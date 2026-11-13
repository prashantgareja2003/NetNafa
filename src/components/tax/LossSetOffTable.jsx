import React from 'react';
import { formatINR } from '../../utils/formatters/formatters';
import { Info, CheckCircle2, AlertCircle } from 'lucide-react';

export const LossSetOffTable = ({ taxSummary }) => {
  const {
    grossStcg,
    grossStcl,
    grossLtcg,
    grossLtcl,
    ltclSetOffAgainstLtcg,
    stclSetOffAgainstStcg,
    stclSetOffAgainstLtcg,
    unabsorbedLtcl,
    unabsorbedStcl,
    totalLossToCarryForward
  } = taxSummary;

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="card-header">
        <div className="card-title">
          <Info size={18} color="#0056D2" />
          <span>Statutory Loss Set-Off & Carry Forward Ledger (Sections 70 & 74)</span>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: 1.5 }}>
        Under the Indian Income Tax Act, <strong>Long-Term Capital Loss (LTCL)</strong> can only be set off against Long-Term Capital Gains. <strong>Short-Term Capital Loss (STCL)</strong> is eligible to be set off against both STCG and LTCG. Unabsorbed losses can be carried forward for up to 8 assessment years.
      </p>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Loss Category</th>
              <th className="numeric">Gross Loss Incurred</th>
              <th className="numeric">Set-Off Against STCG</th>
              <th className="numeric">Set-Off Against LTCG</th>
              <th className="numeric">Unabsorbed Loss to Carry Forward</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600 }}>Short-Term Capital Loss (STCL)</td>
              <td className="numeric" style={{ color: '#D94A52', fontWeight: 600 }}>
                {grossStcl > 0 ? formatINR(grossStcl) : '₹0.00'}
              </td>
              <td className="numeric">{formatINR(stclSetOffAgainstStcg)}</td>
              <td className="numeric">{formatINR(stclSetOffAgainstLtcg)}</td>
              <td className="numeric" style={{ fontWeight: 700, color: unabsorbedStcl > 0 ? '#C05621' : '#272326' }}>
                {formatINR(unabsorbedStcl)}
              </td>
              <td>
                {unabsorbedStcl === 0 ? (
                  <span className="badge badge-success" style={{ fontSize: '10.5px' }}>
                    <CheckCircle2 size={11} /> Fully Set-Off
                  </span>
                ) : (
                  <span className="badge badge-warning" style={{ fontSize: '10.5px' }}>
                    <AlertCircle size={11} /> Carry Forward (8 AYs)
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Long-Term Capital Loss (LTCL)</td>
              <td className="numeric" style={{ color: '#D94A52', fontWeight: 600 }}>
                {grossLtcl > 0 ? formatINR(grossLtcl) : '₹0.00'}
              </td>
              <td className="numeric" style={{ color: '#9E969F' }}>Not Permitted (Sec 70(3))</td>
              <td className="numeric">{formatINR(ltclSetOffAgainstLtcg)}</td>
              <td className="numeric" style={{ fontWeight: 700, color: unabsorbedLtcl > 0 ? '#C05621' : '#272326' }}>
                {formatINR(unabsorbedLtcl)}
              </td>
              <td>
                {unabsorbedLtcl === 0 ? (
                  <span className="badge badge-success" style={{ fontSize: '10.5px' }}>
                    <CheckCircle2 size={11} /> Fully Set-Off
                  </span>
                ) : (
                  <span className="badge badge-warning" style={{ fontSize: '10.5px' }}>
                    <AlertCircle size={11} /> Carry Forward (8 AYs)
                  </span>
                )}
              </td>
            </tr>
            <tr style={{ background: '#F8FAFC', fontWeight: 800 }}>
              <td style={{ color: '#0B2545' }}>Total Losses Incurred & Carried Forward</td>
              <td className="numeric" style={{ color: '#DC2626' }}>
                {formatINR(grossStcl + grossLtcl)}
              </td>
              <td className="numeric">{formatINR(stclSetOffAgainstStcg)}</td>
              <td className="numeric">{formatINR(stclSetOffAgainstLtcg + ltclSetOffAgainstLtcg)}</td>
              <td className="numeric" style={{ color: '#0056D2', fontSize: '14px' }}>
                {formatINR(totalLossToCarryForward)}
              </td>
              <td>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
