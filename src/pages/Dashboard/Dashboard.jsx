import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { AllocationPieChart } from '../../components/charts/AllocationPieChart';
import { SectorBarChart } from '../../components/charts/SectorBarChart';
import { RealizedVsUnrealizedChart } from '../../components/charts/RealizedVsUnrealizedChart';
import { TaxBreakdownChart } from '../../components/charts/TaxBreakdownChart';
import { AddInvestmentModal } from '../../components/portfolio/AddInvestmentModal';
import { LiveMarketBar } from '../../components/common/LiveMarketBar';
import { formatINR, formatPercent, formatDate, getHoldingDays } from '../../utils/formatters/formatters';
import {
  Wallet,
  TrendingUp,
  ReceiptIndianRupee,
  BadgePercent,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const {
    overallStats,
    portfolio,
    taxSummary,
    fifoResult,
    transactions,
    selectedFy,
    loadDemoData,
    addTransaction
  } = useApp();

  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Top & Worst Performers
  const sortedByReturn = [...portfolio].sort((a, b) => b.returnPercent - a.returnPercent);
  const topPerformers = sortedByReturn.filter(s => s.unrealizedPnL > 0).slice(0, 3);
  const worstPerformers = [...sortedByReturn].reverse().filter(s => s.unrealizedPnL < 0).slice(0, 3);

  // Recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Upcoming LTCG Eligibility (Lots between 10 and 12 months)
  const today = new Date().toISOString().split('T')[0];
  const upcomingLtcgLots = fifoResult.openLots.filter(lot => {
    const days = getHoldingDays(lot.effectiveHoldingDate, today);
    return days >= 270 && days < 365; // ~9 to 12 months
  });

  if (transactions.length === 0) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>Executive Dashboard</h1>
          <p style={{ color: '#64748B', fontSize: '13.5px' }}>
            Real-time Indian stock portfolio accounting and capital gains tax insights.
          </p>
        </div>

        <EmptyState
          icon={Wallet}
          title="Welcome to NetNafa"
          description="NetNafa calculates your real FIFO lots, holdings, and Indian capital gains tax directly from your manual entries. Get started by entering your first share purchase or load sample data to explore."
          actionLabel="Add First Investment"
          onAction={() => setIsAddModalOpen(true)}
          secondaryActionLabel="Load Sample Indian Portfolio"
          onSecondaryAction={loadDemoData}
        />

        <AddInvestmentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTransaction={addTransaction}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Page Title & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#0B2545', marginBottom: '4px' }}>Executive Portfolio Dashboard</h1>
          <p style={{ color: '#64748B', fontSize: '13.5px' }}>
            Assessment Year FY {selectedFy} • Indian Listed Equities & Section 111A/112A Tax Center
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/portfolio')}
          >
            Manage Holdings
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Investment</span>
          </button>
        </div>
      </div>

      {/* Live Market Price Status & Auto-Refresh Bar */}
      <LiveMarketBar />

      {/* 6 Main KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <StatCard
          title="Total Invested Cost"
          value={formatINR(overallStats.totalInvested)}
          subtitle={`${overallStats.holdingsCount} stocks in portfolio`}
          icon={Wallet}
        />

        <StatCard
          title="Current Portfolio Value"
          value={formatINR(overallStats.currentPortfolioValue)}
          subtitle={overallStats.totalDayChange !== 0
            ? `Today: ${overallStats.totalDayChange >= 0 ? '+' : ''}${formatINR(overallStats.totalDayChange)}`
            : 'Based on live / manual prices'}
          icon={TrendingUp}
          trend={overallStats.unrealizedPnL >= 0 ? 'positive' : 'negative'}
        />

        <StatCard
          title="Unrealized Profit / Loss"
          value={formatINR(overallStats.unrealizedPnL)}
          badgeText={formatPercent(overallStats.returnPercent)}
          badgeType={overallStats.unrealizedPnL >= 0 ? 'success' : 'danger'}
          subtitle="Open positions"
          trend={overallStats.unrealizedPnL >= 0 ? 'positive' : 'negative'}
        />

        <StatCard
          title={`Realized P&L (FY ${selectedFy})`}
          value={formatINR(taxSummary.totalGrossProfit - taxSummary.totalGrossLoss)}
          badgeText={taxSummary.tradesCount > 0 ? `${taxSummary.tradesCount} Trades` : 'No Sales'}
          badgeType={taxSummary.totalGrossProfit >= taxSummary.totalGrossLoss ? 'success' : 'danger'}
          subtitle={`STCG + LTCG in ${selectedFy}`}
          trend={(taxSummary.totalGrossProfit - taxSummary.totalGrossLoss) >= 0 ? 'positive' : 'negative'}
        />

        <StatCard
          title="Total Unrealized Returns"
          value={formatPercent(overallStats.returnPercent)}
          subtitle="Return on capital invested"
          icon={BadgePercent}
          trend={overallStats.returnPercent >= 0 ? 'positive' : 'negative'}
        />

        <StatCard
          title={`Estimated Tax (FY ${selectedFy})`}
          value={formatINR(overallStats.estimatedTaxLiability)}
          badgeText={overallStats.estimatedTaxLiability > 0 ? 'Tax Payable' : 'Sheltered / Nil'}
          badgeType={overallStats.estimatedTaxLiability > 0 ? 'gold' : 'success'}
          subtitle={`Sec 111A + 112A + 4% Cess`}
          icon={ReceiptIndianRupee}
        />
      </div>

      {/* FIFO Errors Banner if user over-sold */}
      {fifoResult.errors.length > 0 && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '14px 18px', borderRadius: '8px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ShieldAlert size={20} color="#DC2626" />
          <div style={{ fontSize: '13px', color: '#DC2626' }}>
            <strong>FIFO Quantity Warning:</strong> {fifoResult.errors[0].message}
          </div>
        </div>
      )}

      {/* Row 2: Charts */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Portfolio Allocation by Stock</span>
          </div>
          <AllocationPieChart portfolio={portfolio} />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Sector Distribution</span>
          </div>
          <SectorBarChart portfolio={portfolio} />
        </div>
      </div>

      {/* Row 3: Profit Comparison & Tax Liability */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Realized vs. Unrealized Profit Comparison</span>
          </div>
          <RealizedVsUnrealizedChart stats={overallStats} taxSummary={taxSummary} />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">FY {selectedFy} Tax Liability Breakdown</span>
          </div>
          <TaxBreakdownChart taxSummary={taxSummary} />
        </div>
      </div>

      {/* Row 4: Top/Worst Performers & Upcoming LTCG Eligibility */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {/* Top Performers */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ fontSize: '1rem', color: '#059669' }}>
              <ArrowUpRight size={18} /> Top Performing Stocks
            </span>
          </div>
          {topPerformers.length === 0 ? (
            <div style={{ color: '#64748B', fontSize: '13px', padding: '12px 0' }}>No profitable stocks yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topPerformers.map(stock => (
                <div key={stock.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0B2545' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{stock.totalQuantity} Shares</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="profit-text" style={{ fontSize: '13.5px' }}>+{formatINR(stock.unrealizedPnL)}</div>
                    <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>{formatPercent(stock.returnPercent)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Worst Performers */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ fontSize: '1rem', color: '#DC2626' }}>
              <ArrowDownRight size={18} /> Worst Performing Stocks
            </span>
          </div>
          {worstPerformers.length === 0 ? (
            <div style={{ color: '#64748B', fontSize: '13px', padding: '12px 0' }}>No negative holdings.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {worstPerformers.map(stock => (
                <div key={stock.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0B2545' }}>{stock.symbol}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{stock.totalQuantity} Shares</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="loss-text" style={{ fontSize: '13.5px' }}>{formatINR(stock.unrealizedPnL)}</div>
                    <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>{formatPercent(stock.returnPercent)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming LTCG Opportunities */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ fontSize: '1rem', color: '#C8961E' }}>
              <Clock size={18} /> Upcoming LTCG Eligibility
            </span>
          </div>
          {upcomingLtcgLots.length === 0 ? (
            <div style={{ color: '#64748B', fontSize: '13px', padding: '12px 0' }}>
              No lots nearing the 12-month boundary (270-365 days).
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingLtcgLots.slice(0, 3).map(lot => {
                const days = getHoldingDays(lot.effectiveHoldingDate, today);
                const remaining = 365 - days;
                return (
                  <div key={lot.lotId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0B2545' }}>{lot.symbol}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Bought: {formatDate(lot.acquisitionDate)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-warning" style={{ fontSize: '10.5px' }}>
                        {remaining} days to LTCG
                      </span>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{lot.availableQuantity} Shares</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row 5: Recent Transactions Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Recent Transactions</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/transactions')}
          >
            View Full Ledger
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Stock</th>
                <th className="numeric">Quantity</th>
                <th className="numeric">Price (₹)</th>
                <th className="numeric">Total Value (₹)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => {
                const isBuy = txn.type === 'BUY' || txn.type === 'IPO_ALLOTMENT';
                return (
                  <tr key={txn.id}>
                    <td>{formatDate(txn.date)}</td>
                    <td>
                      <span className={`badge ${isBuy ? 'badge-navy' : 'badge-neutral'}`}>
                        {txn.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{txn.symbol}</td>
                    <td className="numeric">{txn.quantity || '-'}</td>
                    <td className="numeric">{txn.price ? formatINR(txn.price) : '-'}</td>
                    <td className="numeric" style={{ fontWeight: 700 }}>
                      {txn.price ? formatINR(txn.quantity * txn.price) : '-'}
                    </td>
                    <td style={{ color: '#64748B', fontSize: '12px' }}>{txn.notes || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddInvestmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={addTransaction}
      />
    </div>
  );
};
