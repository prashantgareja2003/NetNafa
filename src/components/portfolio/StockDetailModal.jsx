import React from 'react';
import { Modal } from '../common/Modal';
import { formatINR, formatDate, getHoldingDays, getHoldingPeriodMonths, formatPercent } from '../../utils/formatters/formatters';

export const StockDetailModal = ({ isOpen, onClose, stock }) => {
  if (!stock) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${stock.stockName} (${stock.symbol})`}
      subtitle={`Sector: ${stock.sector || 'Equities'} | Exchange: ${stock.exchange || 'NSE'}`}
      maxWidth="780px"
    >
      {/* KPI Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          background: '#F8FAFC',
          padding: '14px 16px',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px'
        }}
      >
        <div>
          <span style={{ fontSize: '11px', color: '#777078', textTransform: 'uppercase', fontWeight: 600 }}>Total Holdings</span>
          <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>{stock.totalQuantity} Shares</div>
        </div>
        <div>
          <span style={{ fontSize: '11px', color: '#777078', textTransform: 'uppercase', fontWeight: 600 }}>Avg Buy Price</span>
          <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>{formatINR(stock.avgBuyPrice)}</div>
        </div>
        <div>
          <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Current Value</span>
          <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px', color: '#0056D2' }}>{formatINR(stock.currentValue)}</div>
        </div>
        <div>
          <span style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Unrealized Gain</span>
          <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px', color: stock.unrealizedPnL >= 0 ? '#059669' : '#DC2626' }}>
            {formatINR(stock.unrealizedPnL)} ({formatPercent(stock.returnPercent)})
          </div>
        </div>
      </div>

      {/* Lot-level Breakdown */}
      <h4 style={{ color: '#0B2545', marginBottom: '12px' }}>Open Acquisition Lots (FIFO Order)</h4>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Lot Date</th>
              <th>Type</th>
              <th className="numeric">Available / Original</th>
              <th className="numeric">Cost / Share</th>
              <th className="numeric">Lot Invested</th>
              <th>Holding Period</th>
              <th>Tax Status</th>
            </tr>
          </thead>
          <tbody>
            {(stock.lots || []).map((lot, idx) => {
              const days = getHoldingDays(lot.effectiveHoldingDate, today);
              const months = getHoldingPeriodMonths(lot.effectiveHoldingDate, today);
              const isLtcg = months >= 12;
              const daysToLtcg = Math.max(0, 365 - days);

              return (
                <tr key={lot.lotId || idx}>
                  <td style={{ fontWeight: 500 }}>{formatDate(lot.acquisitionDate)}</td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                      {lot.type}
                    </span>
                  </td>
                  <td className="numeric" style={{ fontWeight: 600 }}>
                    {lot.availableQuantity} / {lot.originalQuantity}
                  </td>
                  <td className="numeric">{formatINR(lot.costPerShare)}</td>
                  <td className="numeric" style={{ fontWeight: 600 }}>
                    {formatINR(lot.availableQuantity * lot.costPerShare)}
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#272326' }}>
                      {months}m ({days}d)
                    </span>
                  </td>
                  <td>
                    {isLtcg ? (
                      <span className="badge badge-success" style={{ fontSize: '10px' }}>
                        LTCG Eligible
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '10px' }} title={`${daysToLtcg} days left for LTCG`}>
                        STCG ({daysToLtcg}d left)
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};
