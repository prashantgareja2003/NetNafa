import React from 'react';
import { Modal } from '../common/Modal';
import { formatINR, formatDate } from '../../utils/formatters/formatters';

export const FifoLotsViewModal = ({ isOpen, onClose, trade }) => {
  if (!trade) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`FIFO Trade Audit: ${trade.symbol}`}
      subtitle={`Sale matched lot-by-lot under Indian Income Tax Act`}
      maxWidth="650px"
    >
      <div style={{ background: '#FCFBFA', padding: '16px', borderRadius: '8px', border: '1px solid #EAE5E4', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#777078', textTransform: 'uppercase', fontWeight: 600 }}>Matched Quantity</div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>{trade.quantity} Shares</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#777078', textTransform: 'uppercase', fontWeight: 600 }}>Holding Duration</div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '2px' }}>{trade.holdingMonths} months ({trade.holdingDays} days)</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#777078', textTransform: 'uppercase', fontWeight: 600 }}>Tax Classification</div>
            <div style={{ marginTop: '2px' }}>
              <span className={`badge ${trade.isLtcg ? 'badge-success' : 'badge-warning'}`}>
                {trade.gainType} ({trade.isLtcg ? 'Sec 112A' : 'Sec 111A'})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Acquisition (Inflow)</th>
              <th>Disposal (Outflow)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>Date</td>
              <td>{formatDate(trade.buyDate)}</td>
              <td>{formatDate(trade.sellDate)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Effective Date (for holding)</td>
              <td>{formatDate(trade.effectiveHoldingDate)}</td>
              <td>{formatDate(trade.sellDate)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Price Per Share</td>
              <td>{formatINR(trade.buyPricePerShare)}</td>
              <td>{formatINR(trade.sellPricePerShare)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Total Value</td>
              <td>{formatINR(trade.totalAcquisitionCost)}</td>
              <td>{formatINR(trade.grossSellValue)}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Allocated Selling Charges</td>
              <td>-</td>
              <td>{formatINR(trade.allocatedSellCharges)}</td>
            </tr>
            <tr style={{ background: '#EDF4FE', fontWeight: 800 }}>
              <td style={{ color: '#0B2545' }}>Net Realized P&L</td>
              <td colSpan="2" style={{ textAlign: 'right', fontSize: '15px', color: trade.realizedPnL >= 0 ? '#059669' : '#DC2626' }}>
                {trade.realizedPnL >= 0 ? '+' : ''}{formatINR(trade.realizedPnL)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {trade.lotType === 'GIFT_RECEIVED' && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#EDF4FE', border: '1px solid #D0E1FD', borderRadius: '6px', fontSize: '12px', color: '#0056D2' }}>
          <strong>Gifted Asset Rule Applied:</strong> Cost of acquisition taken from donor's original purchase price and holding period calculated starting from donor's acquisition date pursuant to Indian IT Act Sec 49(1).
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
};
