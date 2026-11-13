import React from 'react';
import { CheckSquare, X, Trash2, Download } from 'lucide-react';

export const BulkActionBar = ({
  selectedCount = 0,
  totalCount = 0,
  onClearSelection,
  onSelectAll,
  isAllSelected = false,
  actions = []
}) => {
  if (selectedCount <= 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '10px 18px',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        borderRadius: '8px',
        marginBottom: '14px',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
        animation: 'fadeIn 0.2s ease-in-out'
      }}
    >
      {/* Left: Selection Count badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#0056D2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78rem',
              fontWeight: 700
            }}
          >
            {selectedCount}
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>

        {onSelectAll && !isAllSelected && totalCount > selectedCount && (
          <button
            type="button"
            onClick={onSelectAll}
            style={{
              background: 'none',
              border: 'none',
              color: '#93C5FD',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            Select all {totalCount} items
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {actions.map((act, idx) => {
          const isDanger = act.variant === 'danger';
          const isSecondary = act.variant === 'secondary';

          return (
            <button
              key={idx}
              type="button"
              onClick={act.onClick}
              disabled={act.disabled}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: 'none',
                cursor: act.disabled ? 'not-allowed' : 'pointer',
                backgroundColor: isDanger ? '#DC2626' : isSecondary ? '#334155' : '#0056D2',
                color: '#FFFFFF',
                transition: 'opacity 0.15s ease'
              }}
            >
              {act.icon}
              <span>{act.label}</span>
            </button>
          );
        })}

        {/* Clear Selection Button */}
        {onClearSelection && (
          <button
            type="button"
            onClick={onClearSelection}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#1E293B',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
            title="Clear Selection"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
