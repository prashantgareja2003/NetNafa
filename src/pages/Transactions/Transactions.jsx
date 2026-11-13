import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, getFinancialYear } from '../../utils/formatters/formatters';
import { AddTransactionModal } from '../../components/transactions/AddTransactionModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { BulkActionBar } from '../../components/common/BulkActionBar';
import { Search, Plus, Download, Edit2, Trash2, ArrowLeftRight, Filter, CheckSquare } from 'lucide-react';

export const Transactions = () => {
  const { transactions, deleteTransaction, bulkDeleteTransactions, loadDemoData } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [fyFilter, setFyFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTxnId, setDeletingTxnId] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Selection state for Bulk Actions
  const [selectedTxnIds, setSelectedTxnIds] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 and clear selection when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedTxnIds(new Set());
  }, [search, typeFilter, fyFilter]);

  // Available unique FYs
  const availableFys = useMemo(() => {
    const set = new Set(transactions.map(t => getFinancialYear(t.date)));
    return ['ALL', ...Array.from(set)];
  }, [transactions]);

  // Filter & Sort chronologically (latest first)
  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .filter((txn) => {
        const matchesSearch =
          txn.symbol.toLowerCase().includes(search.toLowerCase()) ||
          (txn.stockName && txn.stockName.toLowerCase().includes(search.toLowerCase())) ||
          (txn.notes && txn.notes.toLowerCase().includes(search.toLowerCase()));

        const matchesType = typeFilter === 'ALL' || txn.type === typeFilter;
        const matchesFy = fyFilter === 'ALL' || getFinancialYear(txn.date) === fyFilter;

        return matchesSearch && matchesType && matchesFy;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, typeFilter, fyFilter]);

  // Paginated slice
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  // Selection handlers
  const isAllCurrentPageSelected = paginatedTransactions.length > 0 &&
    paginatedTransactions.every(t => selectedTxnIds.has(t.id));

  const toggleSelectAllCurrentPage = () => {
    setSelectedTxnIds(prev => {
      const next = new Set(prev);
      if (isAllCurrentPageSelected) {
        paginatedTransactions.forEach(t => next.delete(t.id));
      } else {
        paginatedTransactions.forEach(t => next.add(t.id));
      }
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelectedTxnIds(new Set(filteredTransactions.map(t => t.id)));
  };

  const toggleSelectRow = (id) => {
    setSelectedTxnIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Export CSV (Full or Selected)
  const exportCSV = (selectedOnly = false) => {
    const listToExport = selectedOnly
      ? filteredTransactions.filter(t => selectedTxnIds.has(t.id))
      : filteredTransactions;

    if (listToExport.length === 0) return;

    const headers = [
      'Transaction ID',
      'Date',
      'Type',
      'Stock Name',
      'Symbol',
      'Exchange',
      'Quantity',
      'Price Per Share',
      'Charges',
      'Gross Value',
      'Net Consideration',
      'Financial Year',
      'Notes'
    ];

    const rows = listToExport.map(txn => {
      const gross = (txn.quantity || 0) * (txn.price || 0);
      const isSell = txn.type === 'SELL';
      const net = isSell ? gross - (txn.charges || 0) : gross + (txn.charges || 0);
      return [
        txn.id,
        txn.date,
        txn.type,
        `"${(txn.stockName || txn.symbol).replace(/"/g, '""')}"`,
        txn.symbol,
        txn.exchange || 'NSE',
        txn.quantity,
        txn.price,
        txn.charges || 0,
        gross.toFixed(2),
        net.toFixed(2),
        getFinancialYear(txn.date),
        `"${(txn.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NetNafa_Transactions_${selectedOnly ? 'Selected_' : ''}${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk actions definition
  const bulkActions = [
    {
      label: `Export Selected (${selectedTxnIds.size})`,
      icon: <Download size={14} />,
      onClick: () => exportCSV(true),
      variant: 'secondary'
    },
    {
      label: `Delete Selected (${selectedTxnIds.size})`,
      icon: <Trash2 size={14} />,
      onClick: () => setIsBulkDeleteModalOpen(true),
      variant: 'danger'
    }
  ];

  if (transactions.length === 0) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>Transaction Ledger</h1>
            <p style={{ color: '#64748B', fontSize: '13.5px' }}>
              Historical Purchases, Sales, IPO Allotments, and Corporate Actions
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>

        <EmptyState
          title="No Transactions Recorded"
          description="Track your share purchases, sales, bonus shares, splits, and gifts with automatic FIFO lot matching and capital gains calculations."
          actionLabel="Add First Transaction"
          onAction={() => setIsAddModalOpen(true)}
          secondaryActionLabel="Load Realistic Demo Ledger"
          onSecondaryAction={loadDemoData}
        />

        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Title & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>Transaction Ledger</h1>
          <p style={{ color: '#64748B', fontSize: '13.5px' }}>
            {transactions.length} Total Transactions • FIFO Matched with Section 111A/112A Tax Categorization
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => exportCSV(false)}
          >
            <Download size={15} />
            <span>Export All CSV</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingTransaction(null);
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', flex: 1, minWidth: '240px' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '320px' }}>
              <Search size={16} color="#64748B" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '32px' }}
                placeholder="Search stock, symbol, notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div style={{ minWidth: '150px' }}>
              <select
                className="form-control"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="IPO_ALLOTMENT">IPO Allotment</option>
                <option value="BONUS">Bonus Shares</option>
                <option value="SPLIT">Stock Split</option>
                <option value="GIFT_RECEIVED">Gift Received</option>
                <option value="GIFT_TRANSFERRED">Gift Transferred</option>
              </select>
            </div>

            {/* FY Filter */}
            <div style={{ minWidth: '130px' }}>
              <select
                className="form-control"
                value={fyFilter}
                onChange={(e) => setFyFilter(e.target.value)}
              >
                {availableFys.map(fy => (
                  <option key={fy} value={fy}>{fy === 'ALL' ? 'All FYs' : `FY ${fy}`}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#64748B' }}>
            Showing <strong>{filteredTransactions.length}</strong> of {transactions.length} transactions
          </div>
        </div>
      </div>

      {/* Floating / Docked Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedTxnIds.size}
        totalCount={filteredTransactions.length}
        onClearSelection={() => setSelectedTxnIds(new Set())}
        onSelectAll={selectAllFiltered}
        isAllSelected={selectedTxnIds.size === filteredTransactions.length}
        actions={bulkActions}
      />

      {/* Main Transactions Table */}
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
              <th>Date</th>
              <th>Type</th>
              <th>Stock / Symbol</th>
              <th>Exchange</th>
              <th className="numeric">Quantity</th>
              <th className="numeric">Price (₹)</th>
              <th className="numeric">Charges (₹)</th>
              <th className="numeric">Net Amount (₹)</th>
              <th>Financial Year</th>
              <th>Notes</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '36px', color: '#777078' }}>
                  No transactions match your search/filter criteria.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((txn) => {
                const isSelected = selectedTxnIds.has(txn.id);
                const isBuy = txn.type === 'BUY' || txn.type === 'IPO_ALLOTMENT';
                const isSell = txn.type === 'SELL';
                const gross = (txn.quantity || 0) * (txn.price || 0);
                const net = isSell ? gross - (txn.charges || 0) : gross + (txn.charges || 0);

                return (
                  <tr key={txn.id} style={{ backgroundColor: isSelected ? '#EFF6FF' : undefined }}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(txn.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </td>
                    <td>{formatDate(txn.date)}</td>
                    <td>
                      <span className={`badge ${
                        isBuy ? 'badge-navy' : isSell ? 'badge-warning' : 'badge-neutral'
                      }`}>
                        {txn.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{txn.symbol}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{txn.stockName || txn.symbol}</div>
                    </td>
                    <td>{txn.exchange || 'NSE'}</td>
                    <td className="numeric" style={{ fontWeight: 600 }}>{txn.quantity || '-'}</td>
                    <td className="numeric">{txn.price ? formatINR(txn.price) : '-'}</td>
                    <td className="numeric" style={{ color: '#64748B' }}>{txn.charges ? formatINR(txn.charges) : '₹0.00'}</td>
                    <td className="numeric" style={{ fontWeight: 700, color: isSell ? '#059669' : '#0056D2' }}>
                      {txn.price ? formatINR(net) : '-'}
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: '10.5px' }}>
                        {getFinancialYear(txn.date)}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: '#777078', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={txn.notes}>
                      {txn.notes || '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setEditingTransaction(txn)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#777078',
                            padding: '4px',
                            borderRadius: '4px'
                          }}
                          title="Edit Transaction"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingTxnId(txn.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#D94A52',
                            padding: '4px',
                            borderRadius: '4px'
                          }}
                          title="Delete Transaction"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
        totalItems={filteredTransactions.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen || !!editingTransaction}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        initialData={editingTransaction}
      />

      {/* Single Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTxnId}
        onClose={() => setDeletingTxnId(null)}
        onConfirm={() => {
          if (deletingTxnId) {
            deleteTransaction(deletingTxnId);
            setDeletingTxnId(null);
          }
        }}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? All affected FIFO lots, holding periods, and capital gains tax calculations will be automatically recalculated."
        confirmText="Delete"
        isDangerous={true}
      />

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={() => {
          bulkDeleteTransactions(Array.from(selectedTxnIds));
          setSelectedTxnIds(new Set());
          setIsBulkDeleteModalOpen(false);
        }}
        title={`Delete ${selectedTxnIds.size} Selected Transactions`}
        message={`Are you sure you want to delete ${selectedTxnIds.size} transactions simultaneously? All corresponding FIFO lots, portfolio holdings, and capital gains tax calculations will be completely updated.`}
        confirmText={`Delete ${selectedTxnIds.size} Transactions`}
        isDangerous={true}
      />
    </div>
  );
};
