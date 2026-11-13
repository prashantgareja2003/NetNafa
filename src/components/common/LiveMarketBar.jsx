import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveMarketBar = ({ compact = false }) => {
  const {
    portfolio,
    lastPricesRefreshTime
  } = useApp();

  const navigate = useNavigate();

  if (portfolio.length === 0) return null;

  const formatTime = (time) => {
    if (!time) return 'Just now';
    const d = new Date(time);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: compact ? '8px 14px' : '10px 18px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        marginBottom: '18px',
        boxShadow: '0 1px 4px rgba(11, 37, 69, 0.03)'
      }}
    >
      {/* Offline Status & Mode Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#166534',
            letterSpacing: '0.03em'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#16A34A',
              display: 'inline-block'
            }}
          />
          <span>CMP MODE: 100% PRIVATE & OFFLINE</span>
        </div>

        <span style={{ fontSize: '12px', color: '#64748B' }}>
          • Prices update calculations instantly across all portfolio holdings & taxes
        </span>
      </div>

      {/* Quick Action Link to Live Prices Tab */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => navigate('/live-prices')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            backgroundColor: '#0056D2',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
          title="Open Live Stock Price Manager to update market prices via dropdown"
        >
          <Coins size={14} />
          <span>Update Live Prices</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
