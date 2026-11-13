import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSize = true
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  if (totalItems <= 0) return null;

  const startItem = (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (safeCurrentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        borderRadius: '0 0 8px 8px',
        fontSize: '0.85rem'
      }}
    >
      {/* Left: Summary & Page Size Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <span style={{ color: '#64748B' }}>
          Showing <strong style={{ color: '#0F172A' }}>{startItem}</strong> to{' '}
          <strong style={{ color: '#0F172A' }}>{endItem}</strong> of{' '}
          <strong style={{ color: '#0F172A' }}>{totalItems}</strong> entries
        </span>

        {showPageSize && onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#64748B', fontSize: '0.8rem' }}>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8rem',
                color: '#0F172A',
                backgroundColor: '#F8FAFC',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* First Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage === 1}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            backgroundColor: safeCurrentPage === 1 ? '#F8FAFC' : '#FFFFFF',
            color: safeCurrentPage === 1 ? '#94A3B8' : '#0F172A',
            cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer'
          }}
          title="First Page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            backgroundColor: safeCurrentPage === 1 ? '#F8FAFC' : '#FFFFFF',
            color: safeCurrentPage === 1 ? '#94A3B8' : '#0F172A',
            cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer'
          }}
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Number Buttons */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '32px',
                  color: '#94A3B8',
                  fontSize: '0.85rem'
                }}
              >
                ...
              </span>
            );
          }

          const isCurrent = p === safeCurrentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                height: '32px',
                padding: '0 6px',
                borderRadius: '6px',
                border: isCurrent ? '1px solid #0056D2' : '1px solid #E2E8F0',
                backgroundColor: isCurrent ? '#0056D2' : '#FFFFFF',
                color: isCurrent ? '#FFFFFF' : '#0F172A',
                fontWeight: isCurrent ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {p}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            backgroundColor: safeCurrentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
            color: safeCurrentPage === totalPages ? '#94A3B8' : '#0F172A',
            cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={safeCurrentPage === totalPages}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #E2E8F0',
            backgroundColor: safeCurrentPage === totalPages ? '#F8FAFC' : '#FFFFFF',
            color: safeCurrentPage === totalPages ? '#94A3B8' : '#0F172A',
            cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
          title="Last Page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};
