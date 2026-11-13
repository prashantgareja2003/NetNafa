import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { StorageService } from '../services/storage/storageService';
import { processFifoTransactions, buildPortfolioFromLots } from '../services/calculations/fifoEngine';
import { calculateTaxForFinancialYear } from '../services/calculations/taxEngine';
import { addMoney, roundCurrency } from '../services/calculations/decimalUtils';
import { useToast } from './ToastContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { showSuccess, showError, showInfo } = useToast();

  // Storage initialization
  useEffect(() => {
    StorageService.init();
  }, []);

  const [transactions, setTransactions] = useState(() => StorageService.getTransactions());
  const [currentPrices, setCurrentPrices] = useState(() => StorageService.getCurrentPrices());
  const [taxRules, setTaxRules] = useState(() => StorageService.getTaxRules());
  const [selectedFy, setSelectedFyState] = useState(() => StorageService.getSelectedFy());
  const [ipos, setIpos] = useState(() => StorageService.getIpos());
  const [profile, setProfileState] = useState(() => StorageService.getProfile());
  const [lastPricesRefreshTime, setLastPricesRefreshTime] = useState(() => new Date());

  // Save to LocalStorage on updates
  const saveTxns = useCallback((txns) => {
    setTransactions(txns);
    StorageService.saveTransactions(txns);
  }, []);

  const savePrices = useCallback((prices) => {
    setCurrentPrices(prices);
    StorageService.saveCurrentPrices(prices);
  }, []);

  const saveTaxRules = useCallback((rules) => {
    setTaxRules(rules);
    StorageService.saveTaxRules(rules);
  }, []);

  const saveIpos = useCallback((list) => {
    setIpos(list);
    StorageService.saveIpos(list);
  }, []);

  const setSelectedFy = useCallback((fy) => {
    setSelectedFyState(fy);
    StorageService.saveSelectedFy(fy);
  }, []);

  const updateProfile = useCallback((newProfile) => {
    setProfileState(newProfile);
    StorageService.saveProfile(newProfile);
  }, []);

  // 1. Reactive FIFO Calculations
  const fifoResult = useMemo(() => {
    return processFifoTransactions(transactions, taxRules);
  }, [transactions, taxRules]);

  // 2. Reactive Consolidated Portfolio Holdings (Auto-computed when prices or lots change!)
  const portfolio = useMemo(() => {
    return buildPortfolioFromLots(fifoResult.openLots, currentPrices);
  }, [fifoResult.openLots, currentPrices]);

  // 3. Reactive Indian Equity Capital Gains Tax
  const taxSummary = useMemo(() => {
    return calculateTaxForFinancialYear(fifoResult.realizedTrades, selectedFy, taxRules);
  }, [fifoResult.realizedTrades, selectedFy, taxRules]);

  // 4. Overall Portfolio Stats
  const overallStats = useMemo(() => {
    let totalInvested = 0;
    let currentPortfolioValue = 0;
    let unrealizedPnL = 0;
    let totalDayChange = 0;

    for (const item of portfolio) {
      totalInvested = addMoney(totalInvested, item.totalInvested);
      currentPortfolioValue = addMoney(currentPortfolioValue, item.currentValue);
      unrealizedPnL = addMoney(unrealizedPnL, item.unrealizedPnL);
      if (item.dayChange) {
        totalDayChange = addMoney(totalDayChange, item.dayChange * item.totalQuantity);
      }
    }

    // Realized PnL for selected FY
    const selectedFyRealizedPnL = taxSummary.totalGrossProfit - taxSummary.totalGrossLoss;

    // Cumulative Realized PnL across all time
    let allTimeRealizedPnL = 0;
    for (const trade of fifoResult.realizedTrades) {
      allTimeRealizedPnL = addMoney(allTimeRealizedPnL, trade.realizedPnL);
    }

    const returnPercent = totalInvested > 0
      ? roundCurrency((unrealizedPnL / totalInvested) * 100)
      : 0;

    return {
      totalInvested: roundCurrency(totalInvested),
      currentPortfolioValue: roundCurrency(currentPortfolioValue),
      unrealizedPnL: roundCurrency(unrealizedPnL),
      selectedFyRealizedPnL: roundCurrency(selectedFyRealizedPnL),
      allTimeRealizedPnL: roundCurrency(allTimeRealizedPnL),
      returnPercent,
      totalDayChange: roundCurrency(totalDayChange),
      estimatedTaxLiability: taxSummary.totalTaxLiability,
      holdingsCount: portfolio.length,
      realizedTradesCount: fifoResult.realizedTrades.length,
      openLotsCount: fifoResult.openLots.length
    };
  }, [portfolio, taxSummary, fifoResult.realizedTrades]);

  // ==========================================
  // TRANSACTION CRUD OPERATIONS
  // ==========================================
  const addTransaction = useCallback((txnData) => {
    const newTxn = {
      ...txnData,
      id: txnData.id || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      symbol: (txnData.symbol || '').toUpperCase().trim()
    };

    const updated = [...transactions, newTxn];
    saveTxns(updated);

    // If new price entered and symbol doesn't have a current price, set it
    if (newTxn.symbol && newTxn.price && !currentPrices[newTxn.symbol]) {
      const updatedPrices = {
        ...currentPrices,
        [newTxn.symbol]: {
          symbol: newTxn.symbol,
          price: Number(newTxn.price),
          previousClose: Number(newTxn.price),
          change: 0,
          changePercent: 0,
          isLive: false,
          lastUpdated: new Date().toISOString()
        }
      };
      savePrices(updatedPrices);
    }

    showSuccess(`Transaction for ${newTxn.symbol} added successfully.`);
    return newTxn;
  }, [transactions, currentPrices, saveTxns, savePrices, showSuccess]);

  const updateTransaction = useCallback((id, updatedFields) => {
    const updated = transactions.map(t => {
      if (t.id === id) {
        return {
          ...t,
          ...updatedFields,
          symbol: (updatedFields.symbol || t.symbol).toUpperCase().trim()
        };
      }
      return t;
    });

    saveTxns(updated);
    showSuccess('Transaction updated successfully. Lots recalculated.');
  }, [transactions, saveTxns, showSuccess]);

  const deleteTransaction = useCallback((id) => {
    const updated = transactions.filter(t => t.id !== id);
    saveTxns(updated);
    showInfo('Transaction deleted. Portfolio lots recalculated.');
  }, [transactions, saveTxns, showInfo]);

  const bulkDeleteTransactions = useCallback((ids) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    const updated = transactions.filter(t => !idSet.has(t.id));
    saveTxns(updated);
    showInfo(`${ids.length} transactions deleted. Portfolio lots recalculated.`);
  }, [transactions, saveTxns, showInfo]);

  // ==========================================
  // USER-DRIVEN LIVE/CURRENT PRICE MANAGEMENT (NO EXTERNAL API)
  // ==========================================
  const updateStockPrice = useCallback((symbol, newPrice) => {
    if (!symbol) return;
    const sym = symbol.toUpperCase().trim();
    const existingEntry = currentPrices[sym];
    const prevClose = (typeof existingEntry === 'object' && existingEntry?.previousClose)
      ? existingEntry.previousClose
      : (typeof existingEntry === 'object' && existingEntry?.price ? existingEntry.price : Number(newPrice));

    const priceNum = Number(newPrice);
    const change = Math.round((priceNum - prevClose) * 100) / 100;
    const changePercent = prevClose > 0 ? Math.round(((priceNum - prevClose) / prevClose) * 10000) / 100 : 0;

    const updated = {
      ...currentPrices,
      [sym]: {
        symbol: sym,
        price: priceNum,
        previousClose: prevClose,
        change: change,
        changePercent: changePercent,
        isLive: true,
        lastUpdated: new Date().toISOString()
      }
    };
    savePrices(updated);
    setLastPricesRefreshTime(new Date());
    showSuccess(`Current price for ${sym} set to ₹${newPrice}. All portfolio & tax calculations recalculated.`);
  }, [currentPrices, savePrices, showSuccess]);

  const bulkUpdateStockPrices = useCallback((priceMap) => {
    const updated = { ...currentPrices };
    let count = 0;
    const now = new Date().toISOString();

    for (const sym in priceMap) {
      const cleanSym = sym.toUpperCase().trim();
      const val = Number(priceMap[sym]);
      if (val > 0) {
        const existingEntry = updated[cleanSym];
        const prevClose = (typeof existingEntry === 'object' && existingEntry?.price)
          ? existingEntry.price
          : val;
        const change = Math.round((val - prevClose) * 100) / 100;
        const changePercent = prevClose > 0 ? Math.round(((val - prevClose) / prevClose) * 10000) / 100 : 0;

        updated[cleanSym] = {
          symbol: cleanSym,
          price: val,
          previousClose: prevClose,
          change: change,
          changePercent: changePercent,
          isLive: true,
          lastUpdated: now
        };
        count++;
      }
    }

    if (count > 0) {
      savePrices(updated);
      setLastPricesRefreshTime(new Date());
      showSuccess(`Successfully updated prices for ${count} stock(s). Portfolio recalculated.`);
    }
  }, [currentPrices, savePrices, showSuccess]);

  // ==========================================
  // IPO MANAGEMENT
  // ==========================================
  const addIpo = useCallback((ipoData) => {
    const newIpo = {
      ...ipoData,
      id: ipoData.id || `ipo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      symbol: (ipoData.symbol || '').toUpperCase().trim()
    };

    const updated = [...ipos, newIpo];
    saveIpos(updated);

    if (newIpo.allottedQuantity > 0 && newIpo.allotmentDate) {
      const ipoTxn = {
        id: `tx_from_${newIpo.id}`,
        type: 'IPO_ALLOTMENT',
        symbol: newIpo.symbol,
        stockName: newIpo.companyName,
        exchange: newIpo.exchange || 'NSE',
        sector: 'Equities',
        date: newIpo.allotmentDate,
        quantity: Number(newIpo.allottedQuantity),
        price: Number(newIpo.issuePrice),
        charges: 0,
        notes: `IPO Allotment for ${newIpo.companyName}`
      };
      if (!transactions.some(t => t.id === ipoTxn.id)) {
        saveTxns([...transactions, ipoTxn]);
      }
    }

    showSuccess(`IPO ${newIpo.companyName} added to tracker.`);
  }, [ipos, transactions, saveIpos, saveTxns, showSuccess]);

  const updateIpo = useCallback((id, updatedFields) => {
    const updated = ipos.map(i => i.id === id ? { ...i, ...updatedFields } : i);
    saveIpos(updated);
    showSuccess('IPO details updated.');
  }, [ipos, saveIpos, showSuccess]);

  const deleteIpo = useCallback((id) => {
    const updated = ipos.filter(i => i.id !== id);
    saveIpos(updated);
    const updatedTxns = transactions.filter(t => t.id !== `tx_from_${id}`);
    if (updatedTxns.length !== transactions.length) {
      saveTxns(updatedTxns);
    }
    showInfo('IPO removed from tracker.');
  }, [ipos, transactions, saveIpos, saveTxns, showInfo]);

  const bulkDeleteIpos = useCallback((ids) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    const updatedIpos = ipos.filter(i => !idSet.has(i.id));
    saveIpos(updatedIpos);
    const txnIdSet = new Set(ids.map(id => `tx_from_${id}`));
    const updatedTxns = transactions.filter(t => !txnIdSet.has(t.id));
    if (updatedTxns.length !== transactions.length) {
      saveTxns(updatedTxns);
    }
    showInfo(`${ids.length} IPO records deleted.`);
  }, [ipos, transactions, saveIpos, saveTxns, showInfo]);

  // ==========================================
  // DEMO & BACKUP OPERATIONS
  // ==========================================
  const loadDemoData = useCallback(() => {
    StorageService.loadDemoData();
    setTransactions(StorageService.getTransactions());
    setCurrentPrices(StorageService.getCurrentPrices());
    setIpos(StorageService.getIpos());
    setProfileState(StorageService.getProfile());
    setTaxRules(StorageService.getTaxRules());
    setSelectedFyState('2026-27');
    showSuccess('Realistic Indian investment demo data loaded!');
  }, [showSuccess]);

  const clearAllData = useCallback(() => {
    StorageService.clearAllData();
    setTransactions([]);
    setCurrentPrices({});
    setIpos([]);
    setProfileState({ investorName: 'Investor' });
    showInfo('All portfolio and transaction records cleared.');
  }, [showInfo]);

  const importBackup = useCallback((jsonString) => {
    const res = StorageService.importBackup(jsonString);
    if (res.success) {
      setTransactions(StorageService.getTransactions());
      setCurrentPrices(StorageService.getCurrentPrices());
      setIpos(StorageService.getIpos());
      setProfileState(StorageService.getProfile());
      setTaxRules(StorageService.getTaxRules());
      setSelectedFyState(StorageService.getSelectedFy());
      showSuccess(`Backup restored successfully (${res.restoredCount.transactions} transactions restored).`);
      return { success: true };
    } else {
      showError(res.error || 'Failed to import backup file.');
      return { success: false, error: res.error };
    }
  }, [showSuccess, showError]);

  const exportBackup = useCallback(() => {
    return StorageService.exportBackup();
  }, []);

  return (
    <AppContext.Provider
      value={{
        transactions,
        currentPrices,
        taxRules,
        selectedFy,
        ipos,
        profile,
        fifoResult,
        portfolio,
        taxSummary,
        overallStats,
        lastPricesRefreshTime,
        setSelectedFy,
        updateTaxRule: (fy, rules) => {
          const updated = { ...taxRules, [fy]: rules };
          saveTaxRules(updated);
          showSuccess(`Tax rules for FY ${fy} updated.`);
        },
        updateProfile,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        bulkDeleteTransactions,
        updateStockPrice,
        bulkUpdateStockPrices,
        addIpo,
        updateIpo,
        deleteIpo,
        bulkDeleteIpos,
        loadDemoData,
        clearAllData,
        importBackup,
        exportBackup
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
