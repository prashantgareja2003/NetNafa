import React, { useState, useMemo, useEffect } from 'react';
import { formatINR, formatDate } from '../../utils/formatters/formatters';
import { Search, Eye, Download, Filter } from 'lucide-react';
import { FifoLotsViewModal } from '../transactions/FifoLotsViewModal';
import { Pagination } from '../common/Pagination';
import { BulkActionBar } from '../common/BulkActionBar';

export const CapitalGainsLedger = ({ trades = [], financialYear = '2026-27' }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, STCG, LTCG, PROFIT, LOSS
  const [selectedTrade, setSelectedTrade] = useState(null);

  // Bulk Selection state
  const [selectedTradeIds, setSelectedTradeIds] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page and selection on filter change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedTradeIds(new Set());
  }, [search, filterType]);

  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      const matchSearch =
        t.symbol.toLowerCase().includes(search.toLowerCase()) ||
        (t.stockName && t.stockName.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;

      if (filterType === 'STCG') return !t.isLtcg;
      if (filterType === 'LTCG') return t.isLtcg;
      if (filterType === 'PROFIT') return t.realizedPnL > 0;
      if (filterType === 'LOSS') return t.realizedPnL < 0;
      return true;
    });
  }, [trades, search, filterType]);

  // Paginated slice
  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTrades.slice(start, start + pageSize);
  }, [filteredTrades, currentPage, pageSize]);

  // Selection handlers
  const isAllCurrentPageSelected = paginatedTrades.length > 0 &&
    paginatedTrades.every(t => selectedTradeIds.has(t.id));

  const toggleSelectAllCurrentPage = () => {
    setSelectedTradeIds(prev => {
      const next = new Set(prev);
      if (isAllCurrentPageSelected) {
        paginatedTrades.forEach(t => next.delete(t.id));
      } else {
        paginatedTrades.forEach(t => next.add(t.id));
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedTradeIds(new Set(filteredTrades.map(t => t.id)));
  };

  const toggleSelectRow = (id) => {
    setSelectedTradeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const exportCSV = (selectedOnly = false) => {
    const listToExport = selectedOnly
      ? filteredTrades.filter(t => selectedTradeIds.has(t.id))
      : filteredTrades;

    if (listToExport.length === 0) return;

    const headers = [
      'Stock Name',
      'Symbol',
      'Acquisition Date',
      'Disposal Date',
      'Holding Days',
      'Holding Months',
      'Gain Type',
      'Quantity',
      'Cost Per Share',
      'Sell Price Per Share',
      'Total Acquisition Cost',
      'Net Sale Value',
      'Realized PnL',
      'Financial Year'
    ];

    const rows = listToExport.map(t => [
      `"${t.stockName || t.symbol}"`,
      t.symbol,
      t.buyDate,
      t.sellDate,
      t.holdingDays,
      t.holdingMonths,
      t.gainType,
      t.quantity,
      t.buyPricePerShare,
      t.sellPricePerShare,
      t.totalAcquisitionCost,
      t.netSellValue,
      t.realizedPnL,
      t.financialYear
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NetNafa_CapitalGains_${selectedOnly ? 'Selected_' : ''}${financialYear}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bulkActions = [
    {
      label: `Export Selected (${selectedTradeIds.size})`,
      icon: <Download size={14} />,
      onClick: () => exportCSV(true),
      variant: 'secondary'
    }
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', color: '#511728', marginBottom: '2px' }}>
            Realized Capital Gains & FIFO Matched Lots
          </h2>
          <p style={{ fontSize: '12.5px', color: '#777078', margin: 0 }}>
            Lot-by-lot statutory capital gains tracking under Section 111A / 112A for FY {financialYear}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => exportCSV(false)} disabled={filteredTrades.length === 0}>
            <Download size={14} />
            <span>Export Full CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} color="#777078" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '30px', fontSize: '12.5px' }}
                placeholder="Search symbol or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['ALL', 'STCG', 'LTCG', 'PROFIT', 'LOSS'].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`btn btn-sm ${filterType === f ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '11.5px', padding: '4px 10px' }}
                  onClick={() => setFilterType(f)}
                >
                  {f === 'ALL' ? 'All Trades' : f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Showing <strong>{filteredTrades.length}</strong> trades
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedTradeIds.size}
        totalCount={filteredTrades.length}
        onClearSelection={() => setSelectedTradeIds(new Set())}
        onSelectAll={selectAllFiltered}
        isAllSelected={selectedTradeIds.size === filteredTrades.length}
        actions={bulkActions}
      />

      {/* Table */}
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
              <th>Stock / Symbol</th>
              <th>Disposal Date</th>
              <th>Holding Duration</th>
              <th>Gain Type</th>
              <th className="numeric">Quantity</th>
              <th className="numeric">Acquisition Cost</th>
              <th className="numeric">Net Sale Value</th>
              <th className="numeric">Realized P&L (₹)</th>
              <th style={{ textAlign: 'center' }}>FIFO Audit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrades.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: '#777078' }}>
                  No realized capital gains trades found for the selected criteria in FY {financialYear}.
                </td>
              </tr>
            ) : (
              paginatedTrades.map((trade) => {
                const isGain = trade.realizedPnL >= 0;
                const isSelected = selectedTradeIds.has(trade.id);

                return (
                  <tr key={trade.id} style={{ backgroundColor: isSelected ? '#EFF6FF' : undefined }}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(trade.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#272326' }}>{trade.stockName}</div>
                      <div style={{ fontSize: '11px', color: '#777078' }}>{trade.symbol}</div>
                    </td>
                    <td>{formatDate(trade.sellDate)}</td>
                    <td>
                      <span style={{ fontSize: '12px' }}>
                        {trade.holdingMonths}m ({trade.holdingDays}d)
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${trade.isLtcg ? 'badge-success' : 'badge-warning'}`}>
                        {trade.gainType}
                      </span>
                    </td>
                    <td className="numeric" style={{ fontWeight: 600 }}>{trade.quantity}</td>
                    <td className="numeric">{formatINR(trade.totalAcquisitionCost)}</td>
                    <td className="numeric">{formatINR(trade.netSellValue)}</td>
                    <td className="numeric" style={{ fontWeight: 700, color: isGain ? '#16845B' : '#D94A52' }}>
                      {isGain ? '+' : ''}{formatINR(trade.realizedPnL)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedTrade(trade)}
                        title="Audit FIFO Lot Matching"
                      >
                        <Eye size={13} />
                        <span>Audit</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredTrades.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 20, 50]}
      />

      {/* FIFO Audit Modal */}
      <FifoLotsViewModal
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        trade={selectedTrade}
      />
    </div>
  );
};
