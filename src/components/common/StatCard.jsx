import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'neutral',
  icon: Icon,
  variant = 'default',
  trend = null // 'positive', 'negative', 'neutral'
}) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(14px, 2vw, 20px)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: trend === 'positive'
          ? '3px solid #059669'
          : trend === 'negative'
          ? '3px solid #DC2626'
          : '3px solid #0056D2'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px', gap: '8px' }}>
        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#EDF4FE',
              border: '1px solid #D0E1FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0056D2',
              flexShrink: 0
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div
          className="stat-value tabular"
          style={{
            fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-sans)',
            color: trend === 'positive'
              ? 'var(--success)'
              : trend === 'negative'
              ? 'var(--danger)'
              : 'var(--brand-navy)',
            lineHeight: 1.2,
            wordBreak: 'break-word'
          }}
        >
          {value}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          {badgeText && (
            <span className={`badge badge-${badgeType}`}>
              {badgeText}
            </span>
          )}
          {subtitle && (
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
