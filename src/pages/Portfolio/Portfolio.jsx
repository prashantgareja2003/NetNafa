import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatPercent } from '../../utils/formatters/formatters';
import { AddInvestmentModal } from '../../components/portfolio/AddInvestmentModal';
import { UpdatePriceModal } from '../../components/portfolio/UpdatePriceModal';
import { StockDetailModal } from '../../components/portfolio/StockDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { LiveMarketBar } from '../../components/common/LiveMarketBar';
import { Pagination } from '../../components/common/Pagination';
import { BulkActionBar } from '../../components/common/BulkActionBar';
import { Search, Plus, Download, Edit3, Eye, ArrowUpDown, Filter, TrendingUp, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Portfolio = () => {
  const { portfolio, addTransaction, updateStockPrice, loadDemoData } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [sortField, setSortField] = useState('currentValue');
  const [sortDirection, setSortDirection] = useState('desc');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStockForPrice, setSelectedStockForPrice] = useState(null);
  const [selectedStockForDetail, setSelectedStockForDetail] = useState(null);

  // Selection state for Bulk Actions
  const [selectedSymbols, setSelectedSymbols] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page and selection on filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedSymbols(new Set());
  }, [search, sectorFilter]);

  // Available unique sectors
  const availableSectors = useMemo(() => {
    const set = new Set(portfolio.map(p => p.sector || 'Equities'));
    return ['ALL', ...Array.from(set)];
  }, [portfolio]);

  // Filter and Sort
  const filteredAndSorted = useMemo(() => {
    return [...portfolio]
      .filter(item => {
        const matchesSearch =
          item.symbol.toLowerCase().includes(search.toLowerCase()) ||
          item.stockName.toLowerCase().includes(search.toLowerCase());

        const matchesSector = sectorFilter === 'ALL' || item.sector === sectorFilter;
        return matchesSearch && matchesSector;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
  }, [portfolio, search, sectorFilter, sortField, sortDirection]);

  // Paginated slice
  const paginatedPortfolio = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSorted.slice(start, start + pageSize);
  }, [filteredAndSorted, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Selection handlers
  const isAllCurrentPageSelected = paginatedPortfolio.length > 0 &&
    paginatedPortfolio.every(s => selectedSymbols.has(s.symbol));

  const toggleSelectAllCurrentPage = () => {
    setSelectedSymbols(prev => {
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
    setSelectedSymbols(new Set(filteredAndSorted.map(s => s.symbol)));
  };

  const toggleSelectRow = (sym) => {
    setSelectedSymbols(prev => {
      const next = new Set(prev);
      if (next.has(sym)) {
        next.delete(sym);
      } else {
        next.add(sym);
      }
      return next;
    });
  };

  const exportPortfolioCSV = (selectedOnly = false) => {
    const listToExport = selectedOnly
      ? filteredAndSorted.filter(s => selectedSymbols.has(s.symbol))
      : filteredAndSorted;

    if (listToExport.length === 0) return;

    const headers = [
      'Company Name',
      'Symbol',
      'Sector',
      'Exchange',
      'Total Quantity',
      'Average Buy Price',
      'Total Invested',
      'Current Price',
      'Current Value',
      'Unrealized P&L',
      'Return %',
      'Holding Lots Count'
    ];

    const rows = listToExport.map(item => [
      `"${item.stockName.replace(/"/g, '""')}"`,
      item.symbol,
      item.sector || 'Equities',
      item.exchange,
      item.totalQuantity,
      item.avgBuyPrice.toFixed(2),
      item.totalInvested.toFixed(2),
      item.currentPrice.toFixed(2),
      item.currentValue.toFixed(2),
      item.unrealizedPnL.toFixed(2),
      item.returnPercent.toFixed(2) + '%',
      item.lots.length
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NetNafa_Portfolio_${selectedOnly ? 'Selected_' : ''}${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk Actions definition
  const bulkActions = [
    {
      label: `Export Selected (${selectedSymbols.size})`,
      icon: <Download size={14} />,
      onClick: () => exportPortfolioCSV(true),
      variant: 'secondary'
    },
    {
      label: `Update Prices (${selectedSymbols.size})`,
      icon: <Coins size={14} />,
      onClick: () => navigate('/live-prices'),
      variant: 'primary'
    }
  ];

  // Aggregates for filter view
  const totals = useMemo(() => {
    let invested = 0;
    let current = 0;
    for (const item of filteredAndSorted) {
      invested += item.totalInvested;
      current += item.currentValue;
    }
    const pnl = current - invested;
    const retPct = invested > 0 ? (pnl / invested) * 100 : 0;
    return { invested, current, pnl, retPct };
  }, [filteredAndSorted]);

  if (portfolio.length === 0) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>My Stock Portfolio</h1>
            <p style={{ color: '#64748B', fontSize: '13.5px' }}>
              Real-time Portfolio Holdings, Cost Bases, and FIFO Lots
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Stock Purchase</span>
          </button>
        </div>

        <EmptyState
          title="No Open Stock Positions"
          description="Your portfolio will display your active stock holdings, average acquisition costs, and current unrealized profits once you record purchase transactions."
          actionLabel="Add Stock Investment"
          onAction={() => setIsAddModalOpen(true)}
          secondaryActionLabel="Load Sample Portfolio"
          onSecondaryAction={loadDemoData}
        />

        <AddInvestmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTransaction={addTransaction}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Title & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>My Stock Portfolio</h1>
          <p style={{ color: '#64748B', fontSize: '13.5px' }}>
            {portfolio.length} Companies • Real FIFO Lot Inventory & Live Market Feeds
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate('/live-prices')}>
            <Coins size={15} color="#0056D2" />
            <span>Update Live Prices</span>
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => exportPortfolioCSV(false)}>
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>Add Stock Purchase</span>
          </button>
        </div>
      </div>

      {/* Live Market Price Status & Auto-Refresh Bar */}
      <LiveMarketBar />

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', flex: 1, minWidth: '240px' }}>
            <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: '340px' }}>
              <Search size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '32px' }}
                placeholder="Search stock by symbol or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ minWidth: '160px' }}>
              <select
                className="form-control"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
              >
                {availableSectors.map(s => (
                  <option key={s} value={s}>{s === 'ALL' ? 'All Sectors' : s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Portfolio Stats Banner */}
          <div style={{ display: 'flex', gap: 'clamp(12px, 2vw, 20px)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Total Invested</span>
              <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{formatINR(totals.invested)}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Current Value</span>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0056D2' }}>{formatINR(totals.current)}</div>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Unrealized Gain</span>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: totals.pnl >= 0 ? '#059669' : '#DC2626' }}>
                {totals.pnl >= 0 ? '+' : ''}{formatINR(totals.pnl)} ({formatPercent(totals.retPct)})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedSymbols.size}
        totalCount={filteredAndSorted.length}
        onClearSelection={() => setSelectedSymbols(new Set())}
        onSelectAll={selectAllFiltered}
        isAllSelected={selectedSymbols.size === filteredAndSorted.length}
        actions={bulkActions}
      />

      {/* Main Portfolio Table */}
      <div className="table-wrapper" style={{ marginBottom: 0, borderRadius: '8px 8px 0 0' }}>
        <table className="table">
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
              <th onClick={() => handleSort('stockName')} style={{ cursor: 'pointer' }}>
                Stock Name <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th>Symbol</th>
              <th className="numeric" onClick={() => handleSort('totalQuantity')} style={{ cursor: 'pointer' }}>
                Qty <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th className="numeric" onClick={() => handleSort('avgBuyPrice')} style={{ cursor: 'pointer' }}>
                Avg Cost <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th className="numeric" onClick={() => handleSort('totalInvested')} style={{ cursor: 'pointer' }}>
                Invested (₹) <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th className="numeric" onClick={() => handleSort('currentPrice')} style={{ cursor: 'pointer' }}>
                Live Price (CMP) <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th className="numeric" onClick={() => handleSort('currentValue')} style={{ cursor: 'pointer' }}>
                Current Value (₹) <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th className="numeric" onClick={() => handleSort('unrealizedPnL')} style={{ cursor: 'pointer' }}>
                Unrealized P&L (₹) <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th className="numeric" onClick={() => handleSort('returnPercent')} style={{ cursor: 'pointer' }}>
                Return % <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: '4px' }} />
              </th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPortfolio.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center', padding: '36px', color: '#777078' }}>
                  No open stock positions match your search filter.
                </td>
              </tr>
            ) : (
              paginatedPortfolio.map((stock) => {
                const isGain = stock.unrealizedPnL >= 0;
                const isSelected = selectedSymbols.has(stock.symbol);

                return (
                  <tr key={stock.symbol} style={{ backgroundColor: isSelected ? '#EFF6FF' : undefined }}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(stock.symbol)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{stock.stockName}</div>
                      <div style={{ fontSize: '11px', color: '#777078' }}>{stock.sector || 'Equities'}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                        {stock.symbol}
                      </span>
                    </td>
                    <td className="numeric" style={{ fontWeight: 600 }}>{stock.totalQuantity}</td>
                    <td className="numeric">{formatINR(stock.avgBuyPrice)}</td>
                    <td className="numeric">{formatINR(stock.totalInvested)}</td>
                    <td className="numeric">
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#0056D2' }}>
                          {formatINR(stock.currentPrice)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedStockForPrice(stock)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748B',
                            padding: '2px',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                          title="Edit market price manually"
                        >
                          <Edit3 size={13} />
                        </button>
                      </div>
                      {stock.dayChange !== undefined && stock.dayChange !== 0 && (
                        <div style={{
                          fontSize: '10.5px',
                          color: stock.dayChange >= 0 ? '#10B981' : '#EF4444',
                          fontWeight: 600
                        }}>
                          {stock.dayChange >= 0 ? '+' : ''}{formatINR(stock.dayChange)}
                          {' '}({stock.dayChangePercent >= 0 ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%)
                        </div>
                      )}
                    </td>
                    <td className="numeric" style={{ fontWeight: 700 }}>{formatINR(stock.currentValue)}</td>
                    <td className="numeric" style={{
                      color: isGain ? '#059669' : '#D94A52',
                      fontWeight: 700
                    }}>
                      {isGain ? '+' : ''}{formatINR(stock.unrealizedPnL)}
                    </td>
                    <td className="numeric">
                      <span className={`badge ${isGain ? 'badge-success' : 'badge-danger'}`}>
                        {formatPercent(stock.returnPercent)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedStockForDetail(stock)}
                        title="View Lot Breakdown & LTCG Timeline"
                      >
                        <Eye size={13} />
                        <span>Lots ({stock.lots.length})</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredAndSorted.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 20, 50]}
      />

      {/* Modals */}
      <AddInvestmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={addTransaction}
      />

      <UpdatePriceModal
        isOpen={!!selectedStockForPrice}
        onClose={() => setSelectedStockForPrice(null)}
        stock={selectedStockForPrice}
        onUpdatePrice={updateStockPrice}
      />

      <StockDetailModal
        isOpen={!!selectedStockForDetail}
        onClose={() => setSelectedStockForDetail(null)}
        stock={selectedStockForDetail}
      />
    </div>
  );
};
