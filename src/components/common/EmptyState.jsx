import React from 'react';
import { FolderOpen } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Data Found',
  description = 'Start tracking your stock portfolio and taxes by adding your first transaction.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  showLogo = true
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 24px',
        textAlign: 'center',
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 14px rgba(11, 37, 69, 0.05)',
        margin: '20px 0'
      }}
    >
      {showLogo ? (
        <img
          src={logoImg}
          alt="NetNafa"
          style={{ height: '70px', marginBottom: '20px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
        />
      ) : (
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#EDF4FE',
            border: '1px solid #D0E1FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0056D2',
            marginBottom: '18px'
          }}
        >
          <Icon size={28} />
        </div>
      )}

      <h3 style={{ margin: '0 0 8px', fontSize: '1.35rem', color: '#0B2545', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 24px', fontSize: '13.5px', color: '#64748B', maxWidth: '480px', lineHeight: 1.6 }}>
        {description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {actionLabel && (
          <button type="button" className="btn btn-primary" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && (
          <button type="button" className="btn btn-gold" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
