import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { CapitalGainsLedger } from '../../components/tax/CapitalGainsLedger';
import { LossSetOffTable } from '../../components/tax/LossSetOffTable';
import { TaxRuleConfigModal } from '../../components/tax/TaxRuleConfigModal';
import { TaxBreakdownChart } from '../../components/charts/TaxBreakdownChart';
import { formatINR } from '../../utils/formatters/formatters';
import {
  ReceiptIndianRupee,
  ShieldCheck,
  SlidersHorizontal,
  Scale,
  AlertTriangle,
  FileText,
  BookOpen
} from 'lucide-react';

export const TaxCenter = () => {
  const { taxSummary, selectedFy, fifoResult, taxRules } = useApp();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const activeRule = taxSummary.rule || taxRules[selectedFy] || {};

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>Indian Tax Center (Sec 111A & 112A)</h1>
          <p style={{ color: '#64748B', fontSize: '13.5px' }}>
            Statutory capital gains taxation, FIFO lot-level matching, and intra-head loss set-off for <strong>Financial Year {selectedFy}</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            to="/rule-book"
            className="btn btn-primary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#07192F',
              borderColor: '#E5A93C',
              color: '#FFFFFF'
            }}
          >
            <BookOpen size={14} style={{ color: '#E5A93C' }} />
            <span>Tax Rule Book (ટેક્સ રૂલ બુક)</span>
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsConfigModalOpen(true)}
          >
            <SlidersHorizontal size={14} />
            <span>Configure Tax Rules</span>
          </button>
        </div>
      </div>

      {/* Tax Rules Active Banner with Gold border and Navy gradient */}
      <div
        style={{
          background: 'linear-gradient(135deg, #07192F 0%, #0B2545 100%)',
          border: '1px solid #E5A93C',
          borderRadius: '12px',
          padding: '18px 22px',
          marginBottom: '24px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 14px rgba(7, 25, 47, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0056D2 0%, #07192F 100%)',
              border: '1px solid #E5A93C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ECC46A',
              flexShrink: 0
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14.5px' }}>
              Active Statutory Framework: Union Budget Capital Gains (FY {selectedFy})
            </div>
            <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px', maxWidth: '850px' }}>
              {activeRule.notes || 'STCG at 20% (Sec 111A), LTCG at 12.5% (Sec 112A) with ₹1,25,000 threshold exemption and 4% Health & Education Cess.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>STCG (Sec 111A)</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#60A5FA' }}>{activeRule.stcgRate}%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>LTCG (Sec 112A)</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ECC46A' }}>{activeRule.ltcgRate}%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>112A Exemption</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#34D399' }}>{formatINR(activeRule.ltcgExemptionLimit)}</div>
          </div>
        </div>
      </div>

      {/* 4 Tax KPI Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Gross Realized STCG"
          value={formatINR(taxSummary.grossStcg)}
          subtitle={taxSummary.grossStcl > 0 ? `STCL: -${formatINR(taxSummary.grossStcl)}` : 'No short-term loss'}
          trend={taxSummary.grossStcg > 0 ? 'positive' : 'neutral'}
        />

        <StatCard
          title="Gross Realized LTCG"
          value={formatINR(taxSummary.grossLtcg)}
          subtitle={taxSummary.grossLtcl > 0 ? `LTCL: -${formatINR(taxSummary.grossLtcl)}` : 'No long-term loss'}
          trend={taxSummary.grossLtcg > 0 ? 'positive' : 'neutral'}
        />

        <StatCard
          title="Sec 112A Exemption Availed"
          value={formatINR(taxSummary.eligibleLtcgExemption)}
          subtitle={`Limit: ${formatINR(activeRule.ltcgExemptionLimit)}`}
          badgeText={taxSummary.eligibleLtcgExemption > 0 ? 'Tax Sheltered' : 'Not Utilized'}
          badgeType="success"
        />

        <StatCard
          title="Estimated Tax Liability"
          value={formatINR(taxSummary.totalTaxLiability)}
          subtitle={`Base: ${formatINR(taxSummary.baseTax)} + Cess: ${formatINR(taxSummary.cessAmount)}`}
          trend={taxSummary.totalTaxLiability > 0 ? 'negative' : 'positive'}
          badgeText={taxSummary.totalTaxLiability > 0 ? 'Payable' : 'Nil'}
          badgeType={taxSummary.totalTaxLiability > 0 ? 'gold' : 'success'}
        />
      </div>

      {/* Step-by-Step Computation Statement */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">
            <Scale size={18} color="#0056D2" />
            Statutory Capital Gains Computation Statement (FY {selectedFy})
          </span>
          <span className="badge badge-gold">AY {activeRule.assessmentYear || '2027-28'}</span>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Particulars</th>
                <th>Tax Section</th>
                <th>Applicable Rate</th>
                <th className="numeric">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Short-Term Capital Gains (Gross)</td>
                <td>Section 111A</td>
                <td>-</td>
                <td className="numeric" style={{ fontWeight: 600 }}>{formatINR(taxSummary.grossStcg)}</td>
              </tr>
              <tr>
                <td>Less: Short-Term Capital Loss Set-off (Sec 70)</td>
                <td>Section 70(2)</td>
                <td>-</td>
                <td className="numeric" style={{ color: '#DC2626' }}>-{formatINR(taxSummary.stclSetOffAgainstStcg)}</td>
              </tr>
              <tr style={{ background: '#F8FAFC', fontWeight: 600 }}>
                <td>Net Taxable Short-Term Capital Gains</td>
                <td>Section 111A</td>
                <td>{activeRule.stcgRate}%</td>
                <td className="numeric" style={{ color: '#0056D2' }}>{formatINR(taxSummary.netTaxableStcg)}</td>
              </tr>
              <tr>
                <td>Long-Term Capital Gains (Gross)</td>
                <td>Section 112A</td>
                <td>-</td>
                <td className="numeric" style={{ fontWeight: 600 }}>{formatINR(taxSummary.grossLtcg)}</td>
              </tr>
              <tr>
                <td>Less: Long-Term Capital Loss Set-off (Sec 70)</td>
                <td>Section 70(3)</td>
                <td>-</td>
                <td className="numeric" style={{ color: '#DC2626' }}>-{formatINR(taxSummary.ltclSetOffAgainstLtcg)}</td>
              </tr>
              <tr>
                <td>Less: Remaining STCL Set-off against LTCG</td>
                <td>Section 70(2)</td>
                <td>-</td>
                <td className="numeric" style={{ color: '#DC2626' }}>-{formatINR(taxSummary.stclSetOffAgainstLtcg)}</td>
              </tr>
              <tr>
                <td>Net LTCG before Exemption</td>
                <td>Section 112A</td>
                <td>-</td>
                <td className="numeric" style={{ fontWeight: 600 }}>{formatINR(taxSummary.netLtcgBeforeExemption)}</td>
              </tr>
              <tr>
                <td>Less: Exemption under Section 112A</td>
                <td>Section 112A</td>
                <td>Threshold ₹1.25L</td>
                <td className="numeric" style={{ color: '#059669', fontWeight: 600 }}>-{formatINR(taxSummary.eligibleLtcgExemption)}</td>
              </tr>
              <tr style={{ background: '#F8FAFC', fontWeight: 600 }}>
                <td>Net Taxable Long-Term Capital Gains</td>
                <td>Section 112A</td>
                <td>{activeRule.ltcgRate}%</td>
                <td className="numeric" style={{ color: '#C8961E' }}>{formatINR(taxSummary.netTaxableLtcg)}</td>
              </tr>
              <tr>
                <td>Tax on Short-Term Capital Gains ({activeRule.stcgRate}%)</td>
                <td>Section 111A</td>
                <td>{activeRule.stcgRate}%</td>
                <td className="numeric">{formatINR(taxSummary.taxOnStcg)}</td>
              </tr>
              <tr>
                <td>Tax on Long-Term Capital Gains ({activeRule.ltcgRate}%)</td>
                <td>Section 112A</td>
                <td>{activeRule.ltcgRate}%</td>
                <td className="numeric">{formatINR(taxSummary.taxOnLtcg)}</td>
              </tr>
              <tr>
                <td>Total Base Capital Gains Tax</td>
                <td>-</td>
                <td>-</td>
                <td className="numeric" style={{ fontWeight: 700 }}>{formatINR(taxSummary.baseTax)}</td>
              </tr>
              {taxSummary.surchargeAmount > 0 && (
                <tr>
                  <td>Surcharge ({taxSummary.effectiveSurchargeRate}%)</td>
                  <td>Chapter XVII</td>
                  <td>{taxSummary.effectiveSurchargeRate}%</td>
                  <td className="numeric">{formatINR(taxSummary.surchargeAmount)}</td>
                </tr>
              )}
              <tr>
                <td>Health & Education Cess (4%)</td>
                <td>Finance Act</td>
                <td>{activeRule.cessRate}%</td>
                <td className="numeric">{formatINR(taxSummary.cessAmount)}</td>
              </tr>
              <tr style={{ background: '#EDF4FE', fontWeight: 800, fontSize: '15px' }}>
                <td style={{ color: '#0B2545' }}>Final Estimated Tax Liability</td>
                <td style={{ color: '#0056D2' }}>Sec 111A + 112A</td>
                <td style={{ color: '#0056D2' }}>-</td>
                <td className="numeric" style={{ color: '#0056D2' }}>{formatINR(taxSummary.totalTaxLiability)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Loss Set-Off Table */}
      <LossSetOffTable taxSummary={taxSummary} />

      {/* Capital Gains Ledger */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <span className="card-title">
            <FileText size={18} color="#0056D2" />
            Closed Trades Capital Gains Ledger (FY {selectedFy})
          </span>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            {taxSummary.tradesCount} FIFO Matched Trades
          </span>
        </div>

        <CapitalGainsLedger
          trades={fifoResult.realizedTrades.filter(t => t.financialYear === selectedFy)}
          financialYear={selectedFy}
        />
      </div>

      {/* Legal Tax Disclaimer */}
      <div
        style={{
          marginTop: '28px',
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #C8961E',
          borderRadius: '8px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}
      >
        <AlertTriangle size={20} color="#C8961E" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>
          <strong>Statutory Disclaimer:</strong> NetNafa provides capital gains calculations and tax liability estimates for informational and portfolio planning purposes based on user-entered transaction records and prevailing provisions under Sections 111A and 112A of the Indian Income Tax Act, 1961. This does not constitute formal tax, legal, or chartered accountancy advice. Please verify calculations with your certified tax advisor or Chartered Accountant (CA) before filing your Income Tax Return (ITR-2 or ITR-3).
        </div>
      </div>

      {/* Tax Configuration Modal */}
      <TaxRuleConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        targetFy={selectedFy}
      />
    </div>
  );
};
