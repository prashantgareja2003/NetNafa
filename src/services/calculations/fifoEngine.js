import {
  safeNumber,
  roundCurrency,
  roundToPrecision,
  addMoney,
  subtractMoney,
  multiplyMoney,
  divideMoney
} from './decimalUtils';
import { getFinancialYear, getHoldingDays, getHoldingPeriodMonths } from '../../utils/formatters/formatters';

/**
 * Rebuilds FIFO lots for all transactions across all stocks.
 * Generates:
 * 1. Open Lots (remaining inventory for current portfolio)
 * 2. Closed / Realized Matched Trades (for Tax Center, Capital Gains Ledger)
 * 3. Validation Errors (e.g. attempting to sell more than available)
 */
export const processFifoTransactions = (transactions = [], taxRules = {}) => {
  // 1. Sort all transactions chronologically: by date ascending, then BUY before SELL on same date
  const sortedTxns = [...transactions].sort((a, b) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    // On the same date, prioritize acquisitions over sales
    const typePriority = {
      BUY: 1,
      IPO_ALLOTMENT: 2,
      GIFT_RECEIVED: 3,
      BONUS: 4,
      SPLIT: 5,
      CORPORATE_ACTION: 6,
      GIFT_TRANSFERRED: 7,
      SELL: 8
    };
    return (typePriority[a.type] || 5) - (typePriority[b.type] || 5);
  });

  // Keep track of stock-specific lot queues
  // Key: stock symbol (e.g., 'TCS.NS' or 'RELIANCE')
  const stockLots = {};
  const realizedTrades = [];
  const errors = [];

  for (const txn of sortedTxns) {
    const symbol = (txn.symbol || '').toUpperCase().trim();
    if (!symbol) continue;

    if (!stockLots[symbol]) {
      stockLots[symbol] = [];
    }

    const txnQty = safeNumber(txn.quantity);
    const txnPrice = safeNumber(txn.price);
    const txnCharges = safeNumber(txn.charges || 0);

    // ==========================================
    // 1. BUY & IPO ALLOTMENT
    // ==========================================
    if (txn.type === 'BUY' || txn.type === 'IPO_ALLOTMENT') {
      const grossCost = multiplyMoney(txnQty, txnPrice);
      const totalAcquisitionCost = addMoney(grossCost, txnCharges);
      const costPerShare = txnQty > 0 ? divideMoney(totalAcquisitionCost, txnQty) : txnPrice;

      stockLots[symbol].push({
        lotId: `lot_${txn.id || Math.random().toString(36).substring(2, 9)}`,
        txnId: txn.id,
        symbol: symbol,
        stockName: txn.stockName || symbol,
        acquisitionDate: txn.date,
        effectiveHoldingDate: txn.date, // For standard buy
        originalQuantity: txnQty,
        availableQuantity: txnQty,
        purchasePrice: txnPrice,
        charges: txnCharges,
        totalCost: totalAcquisitionCost,
        costPerShare: costPerShare,
        type: txn.type,
        notes: txn.notes || ''
      });
    }

    // ==========================================
    // 2. BONUS SHARES (Cost = ₹0 per IT Act)
    // ==========================================
    else if (txn.type === 'BONUS') {
      const bonusCharges = txnCharges;
      const costPerShare = txnQty > 0 ? divideMoney(bonusCharges, txnQty) : 0;

      stockLots[symbol].push({
        lotId: `lot_${txn.id || Math.random().toString(36).substring(2, 9)}`,
        txnId: txn.id,
        symbol: symbol,
        stockName: txn.stockName || symbol,
        acquisitionDate: txn.date,
        effectiveHoldingDate: txn.date,
        originalQuantity: txnQty,
        availableQuantity: txnQty,
        purchasePrice: 0,
        charges: bonusCharges,
        totalCost: bonusCharges,
        costPerShare: costPerShare,
        type: 'BONUS',
        notes: txn.notes || 'Bonus allotment'
      });
    }

    // ==========================================
    // 3. STOCK SPLIT (Adjust existing lots)
    // e.g. splitRatio: 2 for 1:2 split, or splitRatio: 5 for 1:5
    // ==========================================
    else if (txn.type === 'SPLIT') {
      const splitRatio = safeNumber(txn.splitRatio, 2);
      if (splitRatio > 1) {
        stockLots[symbol].forEach(lot => {
          if (lot.availableQuantity > 0) {
            lot.originalQuantity = multiplyMoney(lot.originalQuantity, splitRatio);
            lot.availableQuantity = multiplyMoney(lot.availableQuantity, splitRatio);
            lot.costPerShare = divideMoney(lot.costPerShare, splitRatio);
            lot.purchasePrice = divideMoney(lot.purchasePrice, splitRatio);
          }
        });
      }
    }

    // ==========================================
    // 4. GIFT RECEIVED
    // Section 49(1): Cost to previous owner (donor).
    // Holding period includes donor's holding period if known.
    // ==========================================
    else if (txn.type === 'GIFT_RECEIVED') {
      const donorPrice = safeNumber(txn.donorPurchasePrice || txn.price);
      const donorDate = txn.donorPurchaseDate || txn.date;
      const grossCost = multiplyMoney(txnQty, donorPrice);
      const totalAcquisitionCost = addMoney(grossCost, txnCharges);
      const costPerShare = txnQty > 0 ? divideMoney(totalAcquisitionCost, txnQty) : donorPrice;

      stockLots[symbol].push({
        lotId: `lot_${txn.id || Math.random().toString(36).substring(2, 9)}`,
        txnId: txn.id,
        symbol: symbol,
        stockName: txn.stockName || symbol,
        acquisitionDate: txn.date,
        effectiveHoldingDate: donorDate, // Indian IT Act Sec 49(1) donor holding period
        originalQuantity: txnQty,
        availableQuantity: txnQty,
        purchasePrice: donorPrice,
        charges: txnCharges,
        totalCost: totalAcquisitionCost,
        costPerShare: costPerShare,
        type: 'GIFT_RECEIVED',
        giftedBy: txn.giftedBy || 'Family/Donor',
        donorPurchaseDate: txn.donorPurchaseDate || null,
        donorPurchasePrice: donorPrice,
        isDonorInfoComplete: !!(txn.donorPurchaseDate && txn.donorPurchasePrice),
        notes: txn.notes || 'Gift received'
      });
    }

    // ==========================================
    // 5. SELL & GIFT TRANSFERRED (FIFO Outflow)
    // ==========================================
    else if (txn.type === 'SELL' || txn.type === 'GIFT_TRANSFERRED') {
      let remainingToSell = txnQty;
      const lots = stockLots[symbol] || [];

      // Calculate total available before matching
      const totalAvailable = lots.reduce((acc, l) => acc + l.availableQuantity, 0);

      if (totalAvailable < remainingToSell) {
        errors.push({
          txnId: txn.id,
          symbol: symbol,
          message: `Attempted to sell ${txnQty} shares of ${symbol} on ${txn.date}, but only ${totalAvailable} shares were available in open lots.`
        });
      }

      const isGiftOutflow = txn.type === 'GIFT_TRANSFERRED';
      const saleSellingPrice = isGiftOutflow ? 0 : txnPrice;
      const totalSaleCharges = txnCharges;

      for (const lot of lots) {
        if (remainingToSell <= 0) break;
        if (lot.availableQuantity <= 0) continue;

        const matchedQty = Math.min(lot.availableQuantity, remainingToSell);
        lot.availableQuantity = subtractMoney(lot.availableQuantity, matchedQty);
        remainingToSell = subtractMoney(remainingToSell, matchedQty);

        if (!isGiftOutflow) {
          // Calculate holding duration from effective holding date to sale date
          const holdingDays = getHoldingDays(lot.effectiveHoldingDate, txn.date);
          const holdingMonths = getHoldingPeriodMonths(lot.effectiveHoldingDate, txn.date);

          // Get FY for the sale transaction
          const fy = getFinancialYear(txn.date);
          const rule = taxRules[fy] || taxRules['2026-27'] || { holdingPeriodMonthsEquity: 12 };
          const requiredLtcgMonths = safeNumber(rule.holdingPeriodMonthsEquity, 12);

          // Is it LTCG or STCG?
          // Section 2(42A): Listed equity held for > 12 months is Long Term Capital Asset
          const isLtcg = holdingMonths >= requiredLtcgMonths;

          // Proportional acquisition cost
          const allocatedBuyCost = multiplyMoney(matchedQty, lot.costPerShare);

          // Proportional gross sell value
          const grossSellValue = multiplyMoney(matchedQty, saleSellingPrice);

          // Proportional sell charges allocated to this matched sub-lot
          const allocatedSellCharges = txnQty > 0
            ? multiplyMoney(totalSaleCharges, divideMoney(matchedQty, txnQty))
            : 0;

          const netSellValue = subtractMoney(grossSellValue, allocatedSellCharges);
          const realizedPnL = subtractMoney(netSellValue, allocatedBuyCost);

          realizedTrades.push({
            id: `trade_${txn.id}_${lot.lotId}`,
            sellTxnId: txn.id,
            buyTxnId: lot.txnId,
            symbol: symbol,
            stockName: txn.stockName || lot.stockName || symbol,
            quantity: matchedQty,
            buyDate: lot.acquisitionDate,
            effectiveHoldingDate: lot.effectiveHoldingDate,
            sellDate: txn.date,
            holdingDays: holdingDays,
            holdingMonths: holdingMonths,
            isLtcg: isLtcg,
            gainType: isLtcg ? 'LTCG' : 'STCG',
            financialYear: fy,
            buyPricePerShare: lot.costPerShare,
            sellPricePerShare: saleSellingPrice,
            totalAcquisitionCost: allocatedBuyCost,
            grossSellValue: grossSellValue,
            allocatedSellCharges: allocatedSellCharges,
            netSellValue: netSellValue,
            realizedPnL: realizedPnL,
            lotType: lot.type,
            isDonorInfoComplete: lot.isDonorInfoComplete !== undefined ? lot.isDonorInfoComplete : true,
            notes: txn.notes || ''
          });
        }
      }
    }
  }

  // Filter open lots that still hold positive shares
  const openLots = [];
  for (const sym in stockLots) {
    for (const lot of stockLots[sym]) {
      if (lot.availableQuantity > 0) {
        openLots.push(lot);
      }
    }
  }

  return {
    openLots,
    realizedTrades,
    errors
  };
};

/**
 * Builds consolidated holdings portfolio from open lots and current market prices.
 */
export const buildPortfolioFromLots = (openLots = [], priceMap = {}) => {
  const stockMap = {};

  for (const lot of openLots) {
    const symbol = lot.symbol;
    if (!stockMap[symbol]) {
      stockMap[symbol] = {
        symbol: symbol,
        stockName: lot.stockName || symbol,
        totalQuantity: 0,
        totalInvested: 0,
        currentPrice: safeNumber(priceMap[symbol], lot.costPerShare || lot.purchasePrice),
        lots: [],
        sector: lot.sector || 'Equities',
        exchange: lot.exchange || 'NSE',
        firstBuyDate: lot.acquisitionDate,
        lastBuyDate: lot.acquisitionDate
      };
    }

    const currentHold = stockMap[symbol];
    currentHold.totalQuantity = addMoney(currentHold.totalQuantity, lot.availableQuantity);
    const lotInvested = multiplyMoney(lot.availableQuantity, lot.costPerShare);
    currentHold.totalInvested = addMoney(currentHold.totalInvested, lotInvested);
    currentHold.lots.push(lot);

    if (new Date(lot.acquisitionDate) < new Date(currentHold.firstBuyDate)) {
      currentHold.firstBuyDate = lot.acquisitionDate;
    }
    if (new Date(lot.acquisitionDate) > new Date(currentHold.lastBuyDate)) {
      currentHold.lastBuyDate = lot.acquisitionDate;
    }
  }

  const portfolio = Object.values(stockMap).map(item => {
    const avgBuyPrice = item.totalQuantity > 0
      ? divideMoney(item.totalInvested, item.totalQuantity)
      : 0;

    // Support both direct number and rich quote object { price, change, changePercent, isLive }
    const quoteEntry = priceMap[item.symbol];
    const isQuoteObject = quoteEntry && typeof quoteEntry === 'object' && quoteEntry.price !== undefined;
    const rawPrice = isQuoteObject ? quoteEntry.price : quoteEntry;
    const currentPrice = safeNumber(rawPrice, avgBuyPrice);

    const currentValue = multiplyMoney(item.totalQuantity, currentPrice);
    const unrealizedPnL = subtractMoney(currentValue, item.totalInvested);
    const returnPercent = item.totalInvested > 0
      ? roundCurrency((unrealizedPnL / item.totalInvested) * 100)
      : 0;

    const dayChange = isQuoteObject ? quoteEntry.change : 0;
    const dayChangePercent = isQuoteObject ? quoteEntry.changePercent : 0;
    const isLive = isQuoteObject ? !!quoteEntry.isLive : false;
    const lastUpdated = isQuoteObject ? quoteEntry.lastUpdated : null;

    return {
      ...item,
      avgBuyPrice: roundCurrency(avgBuyPrice),
      currentPrice: roundCurrency(currentPrice),
      currentValue: roundCurrency(currentValue),
      unrealizedPnL: roundCurrency(unrealizedPnL),
      returnPercent: returnPercent,
      dayChange: roundCurrency(dayChange),
      dayChangePercent: dayChangePercent,
      isLive: isLive,
      lastUpdated: lastUpdated
    };
  });

  return portfolio;
};
