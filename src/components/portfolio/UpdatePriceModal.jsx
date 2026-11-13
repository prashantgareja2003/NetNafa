import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { formatINR, formatPercent } from '../../utils/formatters/formatters';
import { safeNumber, multiplyMoney, subtractMoney, roundCurrency } from '../../services/calculations/decimalUtils';
import { TrendingUp, Coins, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const UpdatePriceModal = ({ isOpen, onClose, stock, onUpdatePrice }) => {
  const [newPrice, setNewPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (stock) {
      setNewPrice(String(stock.currentPrice || stock.avgBuyPrice || ''));
      setError('');
    }
  }, [stock, isOpen]);

  if (!stock) return null;

  const currentPriceNum = safeNumber(newPrice);
  const totalValuePreview = multiplyMoney(stock.totalQuantity, currentPriceNum);
  const pnlPreview = subtractMoney(totalValuePreview, stock.totalInvested);
  const returnPctPreview = stock.totalInvested > 0
    ? roundCurrency((pnlPreview / stock.totalInvested) * 100)
    : 0;

  const handlePercentageBump = (pct) => {
    const base = currentPriceNum > 0 ? currentPriceNum : stock.avgBuyPrice;
    const bumped = roundCurrency(base * (1 + pct / 100));
    setNewPrice(String(bumped));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = safeNumber(newPrice);
    if (val <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    onUpdatePrice(stock.symbol, val);
    onClose();
  };

  const isProfit = pnlPreview >= 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Set Current Market Price (CMP): ${stock.symbol}`}
      subtitle={`${stock.stockName || stock.symbol} • ${stock.exchange || 'NSE'}`}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Holding Context */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '10px',
          padding: '14px',
          border: '1px solid #E2E8F0',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Holdings</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{stock.totalQuantity} Shares</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Avg Buy Cost</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{formatINR(stock.avgBuyPrice)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Total Invested</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>{formatINR(stock.totalInvested)}</div>
          </div>
        </div>

        {/* Input Field */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
            Current Market Price (₹) *
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number"
              step="any"
              min="0.01"
              value={newPrice}
              onChange={(e) => {
                setNewPrice(e.target.value);
                setError('');
              }}
              placeholder="e.g. 201.00"
              autoFocus
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: error ? '1px solid #EF4444' : '1px solid #CBD5E1',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#0F172A',
                outline: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>
          {error && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
        </div>

        {/* Quick percentage adjustment buttons */}
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>Quick Adjustment:</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[-5, -1, 1, 5, 10, 25].map(pct => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentageBump(pct)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: pct > 0 ? '#10B981' : '#EF4444',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {pct > 0 ? `+${pct}%` : `${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Live Calculation Preview */}
        {currentPriceNum > 0 && (
          <div style={{
            backgroundColor: isProfit ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${isProfit ? '#BBF7D0' : '#FECACA'}`,
            borderRadius: '10px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isProfit ? '#166534' : '#991B1B', textTransform: 'uppercase' }}>
                Instant Recalculation Preview
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: isProfit ? '#16A34A' : '#DC2626' }}>
                {isProfit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {formatPercent(returnPctPreview)}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>New Portfolio Value: </span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{formatINR(totalValuePreview)}</span>
              </div>
              <div>
                <span style={{ color: '#64748B', fontSize: '0.75rem' }}>New Unrealized P&L: </span>
                <span style={{ fontWeight: 700, color: isProfit ? '#16A34A' : '#DC2626' }}>
                  {isProfit ? '+' : ''}{formatINR(pnlPreview)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px 16px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '8px 20px',
              backgroundColor: '#0056D2',
              color: '#FFFFFF',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={16} /> Apply Price & Update
          </button>
        </div>
      </form>
    </Modal>
  );
};
