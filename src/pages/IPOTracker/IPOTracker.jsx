import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatPercent, formatDate } from '../../utils/formatters/formatters';
import { AddIpoModal } from '../../components/ipo/AddIpoModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { BulkActionBar } from '../../components/common/BulkActionBar';
import { Rocket, Plus, Download, Edit2, Trash2, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export const IPOTracker = () => {
  const { ipos, addIpo, updateIpo, deleteIpo, bulkDeleteIpos, loadDemoData } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIpo, setEditingIpo] = useState(null);
  const [deletingIpoId, setDeletingIpoId] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Selection state for Bulk Actions
  const [selectedIpoIds, setSelectedIpoIds] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Computed IPO metrics
  const ipoStats = useMemo(() => {
    let totalInvested = 0;
    let totalListingGain = 0;
    let totalRealizedGain = 0;
    let totalUnrealizedGain = 0;

    for (const ipo of ipos) {
      const allottedQty = ipo.allottedQuantity || 0;
      const issuePrice = ipo.issuePrice || 0;
      const listingPrice = ipo.listingPrice || 0;
      const currentPrice = ipo.currentPrice || listingPrice || issuePrice;
      const soldQty = ipo.saleQuantity || 0;
      const salePrice = ipo.salePrice || 0;
      const charges = ipo.charges || 0;

      const ipoInvested = allottedQty * issuePrice;
      totalInvested += ipoInvested;

      // Listing Gain (Notional gain on listing day for all allotted shares)
      if (listingPrice > 0 && allottedQty > 0) {
        totalListingGain += allottedQty * (listingPrice - issuePrice);
      }

      // Realized Gain from actual sales
      if (soldQty > 0 && salePrice > 0) {
        const netSale = (soldQty * salePrice) - charges;
        const costBasis = soldQty * issuePrice;
        totalRealizedGain += (netSale - costBasis);
      }

      // Unrealized Gain from remaining holding shares
      const remainingQty = Math.max(0, allottedQty - soldQty);
      if (remainingQty > 0) {
        const curVal = remainingQty * currentPrice;
        const curCost = remainingQty * issuePrice;
        totalUnrealizedGain += (curVal - curCost);
      }
    }

    return {
      totalInvested,
      totalListingGain,
      totalRealizedGain,
      totalUnrealizedGain
    };
  }, [ipos]);

  // Paginated slice
  const paginatedIpos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return ipos.slice(start, start + pageSize);
  }, [ipos, currentPage, pageSize]);

  // Selection handlers
  const isAllCurrentPageSelected = paginatedIpos.length > 0 &&
    paginatedIpos.every(i => selectedIpoIds.has(i.id));

  const toggleSelectAllCurrentPage = () => {
    setSelectedIpoIds(prev => {
      const next = new Set(prev);
      if (isAllCurrentPageSelected) {
        paginatedIpos.forEach(i => next.delete(i.id));
      } else {
        paginatedIpos.forEach(i => next.add(i.id));
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIpoIds(new Set(ipos.map(i => i.id)));
  };

  const toggleSelectRow = (id) => {
    setSelectedIpoIds(prev => {
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
      ? ipos.filter(i => selectedIpoIds.has(i.id))
      : ipos;

    if (listToExport.length === 0) return;

    const headers = [
      'Company Name',
      'Symbol',
      'Exchange',
      'Application Date',
      'Allotment Date',
      'Listing Date',
      'Issue Price',
      'Allotted Quantity',
      'Total Invested',
      'Listing Price',
      'Listing Day Gain',
      'Sale Quantity',
      'Sale Price',
      'Realized Gain',
      'Status'
    ];

    const rows = listToExport.map(ipo => {
      const invested = (ipo.allottedQuantity || 0) * (ipo.issuePrice || 0);
      const listingGain = ipo.listingPrice ? (ipo.allottedQuantity || 0) * (ipo.listingPrice - (ipo.issuePrice || 0)) : 0;
      const realizedGain = ipo.saleQuantity
        ? ((ipo.saleQuantity * (ipo.salePrice || 0)) - (ipo.charges || 0)) - (ipo.saleQuantity * (ipo.issuePrice || 0))
        : 0;

      return [
        `"${ipo.companyName.replace(/"/g, '""')}"`,
        ipo.symbol,
        ipo.exchange || 'NSE',
        ipo.applicationDate || '',
        ipo.allotmentDate || '',
        ipo.listingDate || '',
        ipo.issuePrice || 0,
        ipo.allottedQuantity || 0,
        invested.toFixed(2),
        ipo.listingPrice || 0,
        listingGain.toFixed(2),
        ipo.saleQuantity || 0,
        ipo.salePrice || 0,
        realizedGain.toFixed(2),
        ipo.status || 'HOLDING'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NetNafa_IPOs_${selectedOnly ? 'Selected_' : ''}${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bulkActions = [
    {
      label: `Export Selected (${selectedIpoIds.size})`,
      icon: <Download size={14} />,
      onClick: () => exportCSV(true),
      variant: 'secondary'
    },
    {
      label: `Delete Selected (${selectedIpoIds.size})`,
      icon: <Trash2 size={14} />,
      onClick: () => setIsBulkDeleteModalOpen(true),
      variant: 'danger'
    }
  ];

  if (ipos.length === 0) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>IPO Investments & Performance Tracker</h1>
            <p style={{ color: '#64748B', fontSize: '13.5px' }}>
              Track primary market applications, allotments, listing gains vs. realized sales
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add IPO Investment</span>
          </button>
        </div>

        <EmptyState
          title="No IPO Records Tracked"
          description="Log your Indian primary market IPO applications and allotments. Separate listing day notional bumper gains from actual realized capital gains for Indian tax filing."
          actionLabel="Add IPO Record"
          onAction={() => setIsAddModalOpen(true)}
          secondaryActionLabel="Load Sample IPO Data"
          onSecondaryAction={loadDemoData}
        />

        <AddIpoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Title & Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>IPO Investments & Performance Tracker</h1>
          <p style={{ color: '#64748B', fontSize: '13.5px' }}>
            {ipos.length} Primary Market Applications • Listing Gains vs. Taxable Realized Gains
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => exportCSV(false)}
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingIpo(null);
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>Add IPO Record</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid-3" style={{ marginBottom: '20px' }}>
        <StatCard
          title="Total IPO Investment"
          value={formatINR(ipoStats.totalInvested)}
          subtitle={`${ipos.length} IPO applications tracked`}
          icon={Rocket}
        />

        <StatCard
          title="Listing Day Notional Gains"
          value={formatINR(ipoStats.totalListingGain)}
          subtitle="Theoretical listing day bumper"
          icon={Sparkles}
          trend={ipoStats.totalListingGain >= 0 ? 'positive' : 'negative'}
        />

        <StatCard
          title="Actual Realized IPO Gain"
          value={formatINR(ipoStats.totalRealizedGain)}
          subtitle="Taxable capital gains from sold shares"
          icon={TrendingUp}
          trend={ipoStats.totalRealizedGain >= 0 ? 'positive' : 'negative'}
        />
      </div>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIpoIds.size}
        totalCount={ipos.length}
        onClearSelection={() => setSelectedIpoIds(new Set())}
        onSelectAll={selectAll}
        isAllSelected={selectedIpoIds.size === ipos.length}
        actions={bulkActions}
      />

      {/* Main IPO Table */}
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
              <th>Company Name</th>
              <th>Symbol</th>
              <th className="numeric">Issue Price</th>
              <th className="numeric">Allotted Qty</th>
              <th className="numeric">Total Invested (₹)</th>
              <th>Listing Date</th>
              <th className="numeric">Listing Price</th>
              <th className="numeric">Listing Gain (₹)</th>
              <th>Status</th>
              <th className="numeric">Realized Gain (₹)</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedIpos.map((ipo) => {
              const invested = (ipo.allottedQuantity || 0) * (ipo.issuePrice || 0);
              const listingGain = ipo.listingPrice ? (ipo.allottedQuantity || 0) * (ipo.listingPrice - (ipo.issuePrice || 0)) : 0;
              const listingGainPct = ipo.issuePrice > 0 && ipo.listingPrice ? ((ipo.listingPrice - ipo.issuePrice) / ipo.issuePrice) * 100 : 0;

              const realizedGain = ipo.saleQuantity
                ? ((ipo.saleQuantity * (ipo.salePrice || 0)) - (ipo.charges || 0)) - (ipo.saleQuantity * (ipo.issuePrice || 0))
                : 0;

              const isSelected = selectedIpoIds.has(ipo.id);

              return (
                <tr key={ipo.id} style={{ backgroundColor: isSelected ? '#EFF6FF' : undefined }}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectRow(ipo.id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#272326' }}>{ipo.companyName}</div>
                    <div style={{ fontSize: '11px', color: '#777078' }}>Applied: {formatDate(ipo.applicationDate)}</div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                      {ipo.symbol}
                    </span>
                  </td>
                  <td className="numeric">{formatINR(ipo.issuePrice)}</td>
                  <td className="numeric" style={{ fontWeight: 600 }}>{ipo.allottedQuantity}</td>
                  <td className="numeric" style={{ fontWeight: 600 }}>{formatINR(invested)}</td>
                  <td>{formatDate(ipo.listingDate)}</td>
                  <td className="numeric">{ipo.listingPrice ? formatINR(ipo.listingPrice) : '-'}</td>
                  <td className="numeric" style={{ fontWeight: 700, color: listingGain >= 0 ? '#16845B' : '#D94A52' }}>
                    {listingGain > 0 ? '+' : ''}{formatINR(listingGain)} ({formatPercent(listingGainPct)})
                  </td>
                  <td>
                    <span className={`badge ${
                      ipo.status === 'FULLY_SOLD'
                        ? 'badge-neutral'
                        : ipo.status === 'PARTIALLY_SOLD'
                        ? 'badge-warning'
                        : 'badge-success'
                    }`}>
                      {ipo.status ? ipo.status.replace('_', ' ') : 'HOLDING'}
                    </span>
                  </td>
                  <td className="numeric" style={{ fontWeight: 700, color: realizedGain >= 0 ? '#16845B' : '#D94A52' }}>
                    {ipo.saleQuantity > 0 ? (realizedGain >= 0 ? '+' : '') + formatINR(realizedGain) : '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setEditingIpo(ipo)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#777078',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                        title="Edit IPO Record"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingIpoId(ipo.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#D94A52',
                          padding: '4px',
                          borderRadius: '4px'
                        }}
                        title="Delete IPO Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <Pagination
        currentPage={currentPage}
        totalItems={ipos.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={[5, 10, 20]}
      />

      {/* Modals */}
      <AddIpoModal
        isOpen={isAddModalOpen || !!editingIpo}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingIpo(null);
        }}
        initialData={editingIpo}
      />

      {/* Single Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingIpoId}
        onClose={() => setDeletingIpoId(null)}
        onConfirm={() => {
          if (deletingIpoId) {
            deleteIpo(deletingIpoId);
            setDeletingIpoId(null);
          }
        }}
        title="Delete IPO Record"
        message="Are you sure you want to remove this IPO record? Any corresponding automatic purchase ledger entry will also be cleaned up."
        confirmText="Delete"
        isDangerous={true}
      />

      {/* Bulk Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={() => {
          bulkDeleteIpos(Array.from(selectedIpoIds));
          setSelectedIpoIds(new Set());
          setIsBulkDeleteModalOpen(false);
        }}
        title={`Delete ${selectedIpoIds.size} Selected IPO Records`}
        message={`Are you sure you want to delete ${selectedIpoIds.size} IPO records simultaneously? All associated ledger transactions and gains calculations will be cleaned up.`}
        confirmText={`Delete ${selectedIpoIds.size} IPOs`}
        isDangerous={true}
      />
    </div>
  );
};
