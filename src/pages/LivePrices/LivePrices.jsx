import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatPercent, formatDate } from '../../utils/formatters/formatters';
import { safeNumber, multiplyMoney, subtractMoney, roundCurrency } from '../../services/calculations/decimalUtils';
import { Pagination } from '../../components/common/Pagination';
import { BulkActionBar } from '../../components/common/BulkActionBar';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Save,
  Search,
  Sparkles,
  PieChart,
  RefreshCw,
  PlusCircle,
  Percent
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LivePrices = () => {
  const {
    portfolio,
    overallStats,
    currentPrices,
    updateStockPrice,
    bulkUpdateStockPrices,
    lastPricesRefreshTime
  } = useApp();

  // Selected stock from dropdown
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Inline edit state for bulk table editing
  const [tablePrices, setTablePrices] = useState({});
  const [hasTableChanges, setHasTableChanges] = useState(false);

  // Selection state for Table Bulk Actions
  const [selectedTableSymbols, setSelectedTableSymbols] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Initialize selected symbol to first portfolio stock
  useEffect(() => {
    if (portfolio.length > 0 && !selectedSymbol) {
      setSelectedSymbol(portfolio[0].symbol);
    }
  }, [portfolio, selectedSymbol]);

  // Sync input price when selected stock changes
  const activeStock = useMemo(() => {
    return portfolio.find(p => p.symbol === selectedSymbol) || null;
  }, [portfolio, selectedSymbol]);

  useEffect(() => {
    if (activeStock) {
      setInputPrice(String(activeStock.currentPrice || activeStock.avgBuyPrice || ''));
    }
  }, [activeStock]);

  // Initialize table prices from portfolio
  useEffect(() => {
    const initialMap = {};
    portfolio.forEach(stock => {
      initialMap[stock.symbol] = String(stock.currentPrice || stock.avgBuyPrice || '');
    });
    setTablePrices(initialMap);
    setHasTableChanges(false);
  }, [portfolio]);

  // Reset pagination on search
  useEffect(() => {
    setCurrentPage(1);
    setSelectedTableSymbols(new Set());
  }, [searchTerm]);

  // Live preview calculation for the selected stock
  const previewData = useMemo(() => {
    if (!activeStock) return null;
    const curPriceNum = safeNumber(inputPrice);
    if (curPriceNum <= 0) return null;

    const newVal = multiplyMoney(activeStock.totalQuantity, curPriceNum);
    const pnl = subtractMoney(newVal, activeStock.totalInvested);
    const retPct = activeStock.totalInvested > 0
      ? roundCurrency((pnl / activeStock.totalInvested) * 100)
      : 0;
    const perShareDiff = roundCurrency(curPriceNum - activeStock.avgBuyPrice);

    return {
      priceNum: curPriceNum,
      newVal,
      pnl,
      retPct,
      perShareDiff,
      isProfit: pnl >= 0
    };
  }, [activeStock, inputPrice]);

  // Handle Quick Percentage Bumps in the form
  const handleQuickBump = (pct) => {
    const cur = safeNumber(inputPrice) > 0 ? safeNumber(inputPrice) : (activeStock?.avgBuyPrice || 100);
    const bumped = roundCurrency(cur * (1 + pct / 100));
    setInputPrice(String(bumped));
  };

  // Submit dropdown price form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedSymbol) return;
    const val = safeNumber(inputPrice);
    if (val <= 0) return;

    updateStockPrice(selectedSymbol, val);
  };

  // Handle table inline price change
  const handleTablePriceChange = (sym, val) => {
    setTablePrices(prev => ({ ...prev, [sym]: val }));
    setHasTableChanges(true);
  };

  // Save single row from table
  const handleSaveTableRow = (sym) => {
    const val = safeNumber(tablePrices[sym]);
    if (val > 0) {
      updateStockPrice(sym, val);
    }
  };

  // Save all changed prices in bulk
  const handleSaveAllTablePrices = () => {
    bulkUpdateStockPrices(tablePrices);
    setHasTableChanges(false);
  };

  // Filtered portfolio list for table
  const filteredPortfolio = useMemo(() => {
    if (!searchTerm.trim()) return portfolio;
    const q = searchTerm.toLowerCase();
    return portfolio.filter(p =>
      p.symbol.toLowerCase().includes(q) ||
      (p.stockName && p.stockName.toLowerCase().includes(q))
    );
  }, [portfolio, searchTerm]);

  // Paginated slice
  const paginatedPortfolio = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPortfolio.slice(start, start + pageSize);
  }, [filteredPortfolio, currentPage, pageSize]);

  // Bulk selection handlers
  const isAllCurrentPageSelected = paginatedPortfolio.length > 0 &&
    paginatedPortfolio.every(s => selectedTableSymbols.has(s.symbol));

  const toggleSelectAllCurrentPage = () => {
    setSelectedTableSymbols(prev => {
      const next = new Set(prev);
      if (isAllCurrentPageSelected) {
        paginatedPortfolio.forEach(s => next.delete(s.symbol));
      } else {
        paginatedPortfolio.forEach(s => next.add(s.symbol));
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedTableSymbols(new Set(filteredPortfolio.map(s => s.symbol)));
  };

  const toggleSelectRow = (sym) => {
    setSelectedTableSymbols(prev => {
      const next = new Set(prev);
      if (next.has(sym)) {
        next.delete(sym);
      } else {
        next.add(sym);
      }
      return next;
    });
  };

  // Bulk percentage bump on selected stocks
  const handleBulkPercentageBump = (pct) => {
    if (selectedTableSymbols.size === 0) return;
    setTablePrices(prev => {
      const updated = { ...prev };
      selectedTableSymbols.forEach(sym => {
        const stock = portfolio.find(p => p.symbol === sym);
        const cur = safeNumber(updated[sym]) > 0 ? safeNumber(updated[sym]) : (stock?.avgBuyPrice || 100);
        updated[sym] = String(roundCurrency(cur * (1 + pct / 100)));
      });
      return updated;
    });
    setHasTableChanges(true);
  };

  // Bulk save selected stock prices
  const handleBulkSaveSelected = () => {
    const selectedMap = {};
    selectedTableSymbols.forEach(sym => {
      if (tablePrices[sym]) {
        selectedMap[sym] = tablePrices[sym];
      }
    });
    bulkUpdateStockPrices(selectedMap);
    setSelectedTableSymbols(new Set());
  };

  // Bulk actions definition for Live Prices
  const bulkActions = [
    {
      label: `Save Selected (${selectedTableSymbols.size})`,
      icon: <Save size={14} />,
      onClick: handleBulkSaveSelected,
      variant: 'primary'
    },
    {
      label: '+1% Selected',
      icon: <Percent size={14} />,
      onClick: () => handleBulkPercentageBump(1),
      variant: 'secondary'
    },
    {
      label: '+5% Selected',
      icon: <Percent size={14} />,
      onClick: () => handleBulkPercentageBump(5),
      variant: 'secondary'
    },
    {
      label: '-5% Selected',
      icon: <Percent size={14} />,
      onClick: () => handleBulkPercentageBump(-5),
      variant: 'secondary'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title & Privacy Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Live Stock Price Manager</h1>
            <span style={{
              backgroundColor: '#0056D2',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Manual CMP
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
            Select any stock from your portfolio to add its current market price. All portfolio valuations, profits, and Indian capital gains taxes update instantly.
          </p>
        </div>

        {/* 100% Offline & Private Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          padding: '8px 14px',
          borderRadius: '30px',
          color: '#166534',
          fontSize: '0.82rem',
          fontWeight: 600
        }}>
          <ShieldCheck size={16} color="#16A34A" />
          <span>100% Offline & Private • Zero External API Calls</span>
        </div>
      </div>

      {/* Top Portfolio Summary Bar */}
      <div className="grid-3" style={{ gap: '16px' }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #0056D2' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Invested Capital
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
            {formatINR(overallStats.totalInvested)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            Across {portfolio.length} stock positions
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #C8961E' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
            Current Portfolio Value (CMP)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
            {formatINR(overallStats.currentPortfolioValue)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            Real-time market valuation
          </div>
        </div>

        <div className="card" style={{
          padding: '16px 20px',
          borderLeft: `4px solid ${overallStats.unrealizedPnL >= 0 ? '#10B981' : '#EF4444'}`
        }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Unrealized Return
          </div>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: overallStats.unrealizedPnL >= 0 ? '#16A34A' : '#DC2626',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {overallStats.unrealizedPnL >= 0 ? '+' : ''}{formatINR(overallStats.unrealizedPnL)}
            <span style={{
              fontSize: '0.85rem',
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: overallStats.unrealizedPnL >= 0 ? '#DCFCE7' : '#FEE2E2',
              color: overallStats.unrealizedPnL >= 0 ? '#15803D' : '#B91C1C'
            }}>
              {formatPercent(overallStats.returnPercent)}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
            Estimated Tax: {formatINR(overallStats.estimatedTaxLiability)}
          </div>
        </div>
      </div>

      {/* CORE FEATURE: Dropdown Selector & Quick Price Update Form */}
      <div className="card" style={{ padding: '24px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coins size={20} color="#0056D2" /> Select Stock from Dropdown & Set Live Price
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Select any share you own from the dropdown, enter the current market price (e.g. bought at ₹109, set to ₹201), and save.
            </p>
          </div>
        </div>

        {portfolio.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 16px', color: '#64748B' }}>
            <p style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Your portfolio currently has no open stock purchases.</p>
            <Link to="/transactions" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <PlusCircle size={16} /> Add First Stock Purchase
            </Link>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {/* Dropdown Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  1. Select Portfolio Stock *
                </label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #0056D2',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  {portfolio.map(stock => (
                    <option key={stock.symbol} value={stock.symbol}>
                      {stock.symbol} — {stock.stockName || stock.symbol} ({stock.totalQuantity} Shares, Avg: {formatINR(stock.avgBuyPrice)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Input Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  2. Current / Live Market Price (₹) *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={inputPrice}
                  onChange={(e) => setInputPrice(e.target.value)}
                  placeholder="e.g. 201.00"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>
            </div>

            {/* Selected Stock Position Snapshot */}
            {activeStock && (
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                padding: '14px 18px',
                border: '1px solid #E2E8F0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Shares Held</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{activeStock.totalQuantity}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Avg Buy Price</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{formatINR(activeStock.avgBuyPrice)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Total Cost</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{formatINR(activeStock.totalInvested)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Recorded CMP</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0056D2' }}>{formatINR(activeStock.currentPrice)}</div>
                </div>
              </div>
            )}

            {/* Quick Percentage Adjustments */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
                Quick Adjustment Buttons:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[-10, -5, -1, 1, 5, 10, 25, 50].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickBump(pct)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: pct > 0 ? '#10B981' : '#EF4444',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {pct > 0 ? `+${pct}%` : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time Calculation Preview Card */}
            {previewData && (
              <div style={{
                backgroundColor: previewData.isProfit ? '#F0FDF4' : '#FEF2F2',
                border: `1.5px solid ${previewData.isProfit ? '#86EFAC' : '#FCA5A5'}`,
                borderRadius: '10px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: previewData.isProfit ? '#166534' : '#991B1B',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Sparkles size={16} /> Instant Recalculation Preview for {selectedSymbol}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: previewData.isProfit ? '#16A34A' : '#DC2626'
                  }}>
                    {previewData.isProfit ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {formatPercent(previewData.retPct)}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>New Portfolio Value</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                      {formatINR(previewData.newVal)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>New Unrealized P&L</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: previewData.isProfit ? '#16A34A' : '#DC2626' }}>
                      {previewData.isProfit ? '+' : ''}{formatINR(previewData.pnl)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Price Gain per Share</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700, color: previewData.perShareDiff >= 0 ? '#16A34A' : '#DC2626' }}>
                      {previewData.perShareDiff >= 0 ? '+' : ''}{formatINR(previewData.perShareDiff)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '4px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#0056D2',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 6px rgba(0, 86, 210, 0.25)'
                }}
              >
                <Save size={18} /> Save & Apply Current Price
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ALL STOCKS CURRENT PRICE TABLE WITH BULK ACTIONS & PAGINATION */}
      {portfolio.length > 0 && (
        <div className="card" style={{ padding: '24px', border: '1px solid #E2E8F0' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                All Portfolio Stocks & Current Prices
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                Select checkboxes to apply bulk price adjustments, or edit any price inline.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Filter stocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 32px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: '180px'
                  }}
                />
              </div>

              {/* Bulk Save Button */}
              {hasTableChanges && (
                <button
                  type="button"
                  onClick={handleSaveAllTablePrices}
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#10B981',
                    fontSize: '0.85rem'
                  }}
                >
                  <Save size={16} /> Save All Changed Prices
                </button>
              )}
            </div>
          </div>

          {/* Bulk Action Bar for Selected Stocks */}
          <BulkActionBar
            selectedCount={selectedTableSymbols.size}
            totalCount={filteredPortfolio.length}
            onClearSelection={() => setSelectedTableSymbols(new Set())}
            onSelectAll={selectAllFiltered}
            isAllSelected={selectedTableSymbols.size === filteredPortfolio.length}
            actions={bulkActions}
          />

          <div className="table-container" style={{ borderRadius: '8px 8px 0 0' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={toggleSelectAllCurrentPage}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      title="Select / Deselect all on this page"
                    />
                  </th>
                  <th>Stock Name</th>
                  <th>Symbol</th>
                  <th className="numeric">Quantity</th>
                  <th className="numeric">Avg Buy Cost</th>
                  <th className="numeric">Total Invested</th>
                  <th style={{ width: '160px', textAlign: 'right' }}>Current Price (₹)</th>
                  <th className="numeric">Current Value</th>
                  <th className="numeric">Unrealized P&L</th>
                  <th className="numeric">Return %</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPortfolio.map(stock => {
                  const isProfit = stock.unrealizedPnL >= 0;
                  const isSelected = selectedTableSymbols.has(stock.symbol);
                  const rowPriceInput = tablePrices[stock.symbol] !== undefined
                    ? tablePrices[stock.symbol]
                    : String(stock.currentPrice || stock.avgBuyPrice);

                  return (
                    <tr key={stock.symbol} style={{ backgroundColor: isSelected ? '#EFF6FF' : (selectedSymbol === stock.symbol ? '#F0F9FF' : 'transparent') }}>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(stock.symbol)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{stock.stockName || stock.symbol}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{stock.sector || 'Equities'}</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                          {stock.symbol}
                        </span>
                      </td>
                      <td className="numeric" style={{ fontWeight: 600 }}>{stock.totalQuantity}</td>
                      <td className="numeric">{formatINR(stock.avgBuyPrice)}</td>
                      <td className="numeric">{formatINR(stock.totalInvested)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            step="any"
                            min="0.01"
                            value={rowPriceInput}
                            onChange={(e) => handleTablePriceChange(stock.symbol, e.target.value)}
                            style={{
                              width: '100px',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              textAlign: 'right',
                              color: '#0F172A'
                            }}
                          />
                        </div>
                      </td>
                      <td className="numeric" style={{ fontWeight: 700 }}>{formatINR(stock.currentValue)}</td>
                      <td className="numeric" style={{ color: isProfit ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                        {isProfit ? '+' : ''}{formatINR(stock.unrealizedPnL)}
                      </td>
                      <td className="numeric">
                        <span className={`badge ${isProfit ? 'badge-success' : 'badge-danger'}`} style={{ fontWeight: 700 }}>
                          {formatPercent(stock.returnPercent)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSymbol(stock.symbol);
                              setInputPrice(String(stock.currentPrice || stock.avgBuyPrice));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            title="Select this stock in the top form"
                          >
                            Select
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveTableRow(stock.symbol)}
                            className="btn btn-primary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#0056D2' }}
                            title="Save new price for this stock"
                          >
                            Save
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredPortfolio.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      )}
    </div>
  );
};
