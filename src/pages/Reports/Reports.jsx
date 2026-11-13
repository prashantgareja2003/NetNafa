import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatPercent, formatDate, getFinancialYear } from '../../utils/formatters/formatters';
import {
  Download,
  Printer
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const REPORT_TABS = [
  { id: 'PORTFOLIO', label: '1. Complete Portfolio' },
  { id: 'STOCK_PNL', label: '2. Stock-wise P&L' },
  { id: 'TRANSACTIONS', label: '3. Transaction History' },
  { id: 'CAPITAL_GAINS', label: '4. FY Capital Gains' },
  { id: 'STCG', label: '5. STCG Report' },
  { id: 'LTCG', label: '6. LTCG Report' },
  { id: 'IPO', label: '7. IPO Performance' },
  { id: 'GIFTED', label: '8. Gifted Shares' },
  { id: 'TAX_SUMMARY', label: '9. Tax Computation Summary' }
];

export const Reports = () => {
  const {
    portfolio,
    transactions,
    fifoResult,
    taxSummary,
    ipos,
    selectedFy,
    profile
  } = useApp();

  const [activeTab, setActiveTab] = useState('PORTFOLIO');

  const handlePrint = () => {
    window.print();
  };

  // CSV Exporter for active report
  const handleExportActiveCSV = () => {
    let headers = [];
    let rows = [];
    let fileName = `NetNafa_Report_${activeTab}_${selectedFy}`;

    if (activeTab === 'PORTFOLIO') {
      headers = ['Stock Name', 'Symbol', 'Quantity', 'Avg Buy Price', 'Total Invested', 'Current Price', 'Current Value', 'Unrealized PnL', 'Return %'];
      rows = portfolio.map(p => [
        `"${p.stockName}"`, p.symbol, p.totalQuantity, p.avgBuyPrice, p.totalInvested, p.currentPrice, p.currentValue, p.unrealizedPnL, p.returnPercent
      ]);
    } else if (activeTab === 'STOCK_PNL') {
      headers = ['Symbol', 'Quantity Held', 'Total Invested', 'Current Value', 'Unrealized PnL', 'Realized PnL'];
      rows = portfolio.map(p => {
        const stockRealized = fifoResult.realizedTrades
          .filter(t => t.symbol === p.symbol)
          .reduce((sum, t) => sum + t.realizedPnL, 0);
        return [p.symbol, p.totalQuantity, p.totalInvested, p.currentValue, p.unrealizedPnL, stockRealized];
      });
    } else if (activeTab === 'TRANSACTIONS') {
      headers = ['Date', 'Type', 'Symbol', 'Exchange', 'Quantity', 'Price', 'Charges', 'Financial Year', 'Notes'];
      rows = transactions.map(t => [
        t.date, t.type, t.symbol, t.exchange || 'NSE', t.quantity, t.price, t.charges, getFinancialYear(t.date), `"${t.notes || ''}"`
      ]);
    } else if (activeTab === 'CAPITAL_GAINS' || activeTab === 'STCG' || activeTab === 'LTCG') {
      let filteredTrades = fifoResult.realizedTrades.filter(t => t.financialYear === selectedFy);
      if (activeTab === 'STCG') filteredTrades = filteredTrades.filter(t => !t.isLtcg);
      if (activeTab === 'LTCG') filteredTrades = filteredTrades.filter(t => t.isLtcg);
      headers = ['Stock Name', 'Symbol', 'Buy Date', 'Sell Date', 'Holding Months', 'Gain Type', 'Quantity', 'Buy Cost', 'Net Sale', 'Realized PnL'];
      rows = filteredTrades.map(t => [
        `"${t.stockName}"`, t.symbol, t.buyDate, t.sellDate, t.holdingMonths, t.gainType, t.quantity, t.totalAcquisitionCost, t.netSellValue, t.realizedPnL
      ]);
    } else if (activeTab === 'IPO') {
      headers = ['Company', 'Symbol', 'Issue Price', 'Allotted Qty', 'Invested', 'Listing Date', 'Listing Price', 'Status', 'Realized Gain'];
      rows = ipos.map(i => [
        `"${i.companyName}"`, i.symbol, i.issuePrice, i.allottedQuantity, (i.allottedQuantity || 0) * (i.issuePrice || 0), i.listingDate || '-', i.listingPrice || '-', i.status, i.saleQuantity ? ((i.saleQuantity * (i.salePrice || 0)) - (i.charges || 0)) - (i.saleQuantity * (i.issuePrice || 0)) : 0
      ]);
    } else if (activeTab === 'GIFTED') {
      const giftedLots = fifoResult.openLots.filter(l => l.type === 'GIFT_RECEIVED');
      headers = ['Symbol', 'Stock Name', 'Quantity', 'Gift Received Date', 'Donor Name', 'Donor Acquisition Date', 'Cost Per Share', 'Total Cost'];
      rows = giftedLots.map(g => [
        g.symbol, `"${g.stockName}"`, g.availableQuantity, g.acquisitionDate, `"${g.giftedBy || 'Family'}"`, g.effectiveHoldingDate, g.costPerShare, g.totalCost
      ]);
    } else if (activeTab === 'TAX_SUMMARY') {
      headers = ['Tax Head', 'Statutory Section', 'Amount (INR)'];
      rows = [
        ['Gross STCG', 'Section 111A', taxSummary.grossStcg],
        ['Gross STCL', 'Section 70(2)', taxSummary.grossStcl],
        ['Net Taxable STCG', 'Section 111A', taxSummary.netTaxableStcg],
        ['Gross LTCG', 'Section 112A', taxSummary.grossLtcg],
        ['Gross LTCL', 'Section 70(3)', taxSummary.grossLtcl],
        ['LTCG Exemption Limit', 'Section 112A', taxSummary.eligibleLtcgExemption],
        ['Net Taxable LTCG', 'Section 112A', taxSummary.netTaxableLtcg],
        ['Tax on STCG', 'Section 111A', taxSummary.taxOnStcg],
        ['Tax on LTCG', 'Section 112A', taxSummary.taxOnLtcg],
        ['Health & Education Cess (4%)', 'Finance Act', taxSummary.cessAmount],
        ['Total Estimated Tax Liability', 'Sec 111A + 112A', taxSummary.totalTaxLiability]
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>Reports & Statements</h1>
          <p style={{ color: '#64748B', fontSize: '13.5px' }}>
            Official statements, tax schedules, and exportable investment reports for FY {selectedFy}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Statement</span>
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleExportActiveCSV}>
            <Download size={15} />
            <span>Export Active Report</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin'
        }}
      >
        {REPORT_TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '9px 14px',
                borderRadius: '6px 6px 0 0',
                border: 'none',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#0056D2' : '#64748B',
                fontWeight: isActive ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                borderBottom: isActive ? '3px solid #0056D2' : 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Printable Report Header Card */}
      <div
        className="card"
        style={{
          borderTop: '4px solid #C8961E',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={logoImg}
              alt="NetNafa"
              style={{ height: '48px', objectFit: 'contain' }}
            />
            <div>
              <h2 style={{ color: '#0B2545', fontSize: '1.35rem', margin: 0 }}>
                {REPORT_TABS.find(t => t.id === activeTab)?.label.substring(3)}
              </h2>
              <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '3px' }}>
                Investor: <strong style={{ color: '#0F172A' }}>{profile?.investorName || 'Investor'}</strong> | PAN: <strong style={{ color: '#0F172A' }}>{profile?.panNumber || 'Not Specified'}</strong> | Financial Year: <strong style={{ color: '#0056D2' }}>{selectedFy}</strong>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Statement Date</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0B2545' }}>{formatDate(new Date())}</div>
          </div>
        </div>

        {/* Dynamic Content based on activeTab */}

        {/* TAB 1: Complete Portfolio */}
        {activeTab === 'PORTFOLIO' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Stock Name</th>
                  <th>Symbol</th>
                  <th className="numeric">Quantity</th>
                  <th className="numeric">Avg Cost (₹)</th>
                  <th className="numeric">Invested Value (₹)</th>
                  <th className="numeric">Current Price (₹)</th>
                  <th className="numeric">Current Value (₹)</th>
                  <th className="numeric">Unrealized P&L (₹)</th>
                  <th className="numeric">Return %</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map(p => (
                  <tr key={p.symbol}>
                    <td style={{ fontWeight: 600 }}>{p.stockName}</td>
                    <td><span className="badge badge-neutral">{p.symbol}</span></td>
                    <td className="numeric">{p.totalQuantity}</td>
                    <td className="numeric">{formatINR(p.avgBuyPrice)}</td>
                    <td className="numeric">{formatINR(p.totalInvested)}</td>
                    <td className="numeric">{formatINR(p.currentPrice)}</td>
                    <td className="numeric" style={{ fontWeight: 700, color: '#0B2545' }}>{formatINR(p.currentValue)}</td>
                    <td className="numeric" style={{ fontWeight: 700, color: p.unrealizedPnL >= 0 ? '#059669' : '#DC2626' }}>
                      {p.unrealizedPnL >= 0 ? '+' : ''}{formatINR(p.unrealizedPnL)}
                    </td>
                    <td className="numeric">{formatPercent(p.returnPercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Stock-wise P&L */}
        {activeTab === 'STOCK_PNL' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Stock Symbol</th>
                  <th>Company Name</th>
                  <th className="numeric">Current Holdings</th>
                  <th className="numeric">Total Invested</th>
                  <th className="numeric">Unrealized P&L</th>
                  <th className="numeric">Realized P&L (All Time)</th>
                  <th className="numeric">Total Combined Return</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map(p => {
                  const stockRealized = fifoResult.realizedTrades
                    .filter(t => t.symbol === p.symbol)
                    .reduce((sum, t) => sum + t.realizedPnL, 0);
                  const combined = p.unrealizedPnL + stockRealized;

                  return (
                    <tr key={p.symbol}>
                      <td style={{ fontWeight: 700 }}>{p.symbol}</td>
                      <td>{p.stockName}</td>
                      <td className="numeric">{p.totalQuantity} Shares</td>
                      <td className="numeric">{formatINR(p.totalInvested)}</td>
                      <td className="numeric" style={{ color: p.unrealizedPnL >= 0 ? '#059669' : '#DC2626' }}>
                        {formatINR(p.unrealizedPnL)}
                      </td>
                      <td className="numeric" style={{ color: stockRealized >= 0 ? '#059669' : '#DC2626' }}>
                        {formatINR(stockRealized)}
                      </td>
                      <td className="numeric" style={{ fontWeight: 700, color: combined >= 0 ? '#059669' : '#DC2626' }}>
                        {formatINR(combined)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Transactions */}
        {activeTab === 'TRANSACTIONS' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Stock</th>
                  <th className="numeric">Qty</th>
                  <th className="numeric">Price</th>
                  <th className="numeric">Charges</th>
                  <th>FY</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td>{formatDate(t.date)}</td>
                    <td><span className="badge badge-neutral">{t.type}</span></td>
                    <td style={{ fontWeight: 700 }}>{t.symbol}</td>
                    <td className="numeric">{t.quantity}</td>
                    <td className="numeric">{t.price ? formatINR(t.price) : '-'}</td>
                    <td className="numeric">{t.charges ? formatINR(t.charges) : '₹0.00'}</td>
                    <td>{getFinancialYear(t.date)}</td>
                    <td style={{ fontSize: '11.5px', color: '#64748B' }}>{t.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4, 5, 6: Capital Gains / STCG / LTCG */}
        {(activeTab === 'CAPITAL_GAINS' || activeTab === 'STCG' || activeTab === 'LTCG') && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Buy Date</th>
                  <th>Sell Date</th>
                  <th>Holding (m/d)</th>
                  <th>Type</th>
                  <th className="numeric">Qty</th>
                  <th className="numeric">Cost Basis (₹)</th>
                  <th className="numeric">Net Consideration (₹)</th>
                  <th className="numeric">Realized Gain/Loss (₹)</th>
                </tr>
              </thead>
              <tbody>
                {fifoResult.realizedTrades
                  .filter(t => t.financialYear === selectedFy)
                  .filter(t => activeTab === 'STCG' ? !t.isLtcg : activeTab === 'LTCG' ? t.isLtcg : true)
                  .map(trade => (
                    <tr key={trade.id}>
                      <td style={{ fontWeight: 700 }}>{trade.symbol}</td>
                      <td>{formatDate(trade.buyDate)}</td>
                      <td>{formatDate(trade.sellDate)}</td>
                      <td>{trade.holdingMonths}m ({trade.holdingDays}d)</td>
                      <td>
                        <span className={`badge ${trade.isLtcg ? 'badge-success' : 'badge-warning'}`}>
                          {trade.gainType}
                        </span>
                      </td>
                      <td className="numeric">{trade.quantity}</td>
                      <td className="numeric">{formatINR(trade.totalAcquisitionCost)}</td>
                      <td className="numeric">{formatINR(trade.netSellValue)}</td>
                      <td className="numeric" style={{ fontWeight: 700, color: trade.realizedPnL >= 0 ? '#059669' : '#DC2626' }}>
                        {trade.realizedPnL >= 0 ? '+' : ''}{formatINR(trade.realizedPnL)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 7: IPO */}
        {activeTab === 'IPO' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Symbol</th>
                  <th className="numeric">Issue Price</th>
                  <th className="numeric">Allotted Qty</th>
                  <th className="numeric">Invested</th>
                  <th className="numeric">Listing Price</th>
                  <th>Status</th>
                  <th className="numeric">Realized Gain</th>
                </tr>
              </thead>
              <tbody>
                {ipos.map(i => {
                  const invested = (i.allottedQuantity || 0) * (i.issuePrice || 0);
                  const realizedGain = i.saleQuantity ? ((i.saleQuantity * (i.salePrice || 0)) - (i.charges || 0)) - (i.saleQuantity * (i.issuePrice || 0)) : 0;
                  return (
                    <tr key={i.id}>
                      <td style={{ fontWeight: 600 }}>{i.companyName}</td>
                      <td>{i.symbol}</td>
                      <td className="numeric">{formatINR(i.issuePrice)}</td>
                      <td className="numeric">{i.allottedQuantity}</td>
                      <td className="numeric">{formatINR(invested)}</td>
                      <td className="numeric">{i.listingPrice ? formatINR(i.listingPrice) : '-'}</td>
                      <td><span className="badge badge-neutral">{i.status}</span></td>
                      <td className="numeric" style={{ fontWeight: 700, color: realizedGain >= 0 ? '#059669' : '#DC2626' }}>
                        {i.saleQuantity > 0 ? formatINR(realizedGain) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 8: Gifted Shares */}
        {activeTab === 'GIFTED' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Stock Symbol</th>
                  <th>Gift Received Date</th>
                  <th>Gifted By</th>
                  <th>Donor Purchase Date</th>
                  <th className="numeric">Quantity</th>
                  <th className="numeric">Cost of Acquisition / Sh</th>
                  <th className="numeric">Total Cost (₹)</th>
                  <th>IT Act Section</th>
                </tr>
              </thead>
              <tbody>
                {fifoResult.openLots
                  .filter(l => l.type === 'GIFT_RECEIVED')
                  .map(g => (
                    <tr key={g.lotId}>
                      <td style={{ fontWeight: 700 }}>{g.symbol}</td>
                      <td>{formatDate(g.acquisitionDate)}</td>
                      <td>{g.giftedBy || 'Family Member'}</td>
                      <td>{formatDate(g.effectiveHoldingDate)}</td>
                      <td className="numeric">{g.availableQuantity}</td>
                      <td className="numeric">{formatINR(g.costPerShare)}</td>
                      <td className="numeric">{formatINR(g.availableQuantity * g.costPerShare)}</td>
                      <td>Section 49(1)</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 9: Tax Computation Summary */}
        {activeTab === 'TAX_SUMMARY' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Tax Schedule Item</th>
                  <th>Statutory Provision</th>
                  <th className="numeric">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Gross Short-Term Capital Gains</td>
                  <td>Section 111A</td>
                  <td className="numeric">{formatINR(taxSummary.grossStcg)}</td>
                </tr>
                <tr>
                  <td>Less: Short-Term Capital Loss Set-off</td>
                  <td>Section 70(2)</td>
                  <td className="numeric" style={{ color: '#DC2626' }}>-{formatINR(taxSummary.stclSetOffAgainstStcg)}</td>
                </tr>
                <tr style={{ background: '#F8FAFC', fontWeight: 600 }}>
                  <td>Net Taxable STCG (20%)</td>
                  <td>Section 111A</td>
                  <td className="numeric" style={{ color: '#0056D2' }}>{formatINR(taxSummary.netTaxableStcg)}</td>
                </tr>
                <tr>
                  <td>Gross Long-Term Capital Gains</td>
                  <td>Section 112A</td>
                  <td className="numeric">{formatINR(taxSummary.grossLtcg)}</td>
                </tr>
                <tr>
                  <td>Less: LTCL and STCL Set-off</td>
                  <td>Section 70</td>
                  <td className="numeric" style={{ color: '#DC2626' }}>-{formatINR(taxSummary.ltclSetOffAgainstLtcg + taxSummary.stclSetOffAgainstLtcg)}</td>
                </tr>
                <tr>
                  <td>Less: Threshold Exemption under Sec 112A</td>
                  <td>Section 112A</td>
                  <td className="numeric" style={{ color: '#059669' }}>-{formatINR(taxSummary.eligibleLtcgExemption)}</td>
                </tr>
                <tr style={{ background: '#F8FAFC', fontWeight: 600 }}>
                  <td>Net Taxable LTCG (12.5%)</td>
                  <td>Section 112A</td>
                  <td className="numeric" style={{ color: '#C8961E' }}>{formatINR(taxSummary.netTaxableLtcg)}</td>
                </tr>
                <tr>
                  <td>Tax on STCG</td>
                  <td>Section 111A</td>
                  <td className="numeric">{formatINR(taxSummary.taxOnStcg)}</td>
                </tr>
                <tr>
                  <td>Tax on LTCG</td>
                  <td>Section 112A</td>
                  <td className="numeric">{formatINR(taxSummary.taxOnLtcg)}</td>
                </tr>
                <tr>
                  <td>Health & Education Cess (4%)</td>
                  <td>Finance Act</td>
                  <td className="numeric">{formatINR(taxSummary.cessAmount)}</td>
                </tr>
                <tr style={{ background: '#EDF4FE', fontWeight: 800, fontSize: '15px' }}>
                  <td style={{ color: '#0B2545' }}>Estimated Total Tax Liability</td>
                  <td style={{ color: '#0056D2' }}>Sec 111A + Sec 112A</td>
                  <td className="numeric" style={{ color: '#0056D2' }}>{formatINR(taxSummary.totalTaxLiability)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
