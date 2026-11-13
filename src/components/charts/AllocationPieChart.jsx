import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatINR, formatPercent } from '../../utils/formatters/formatters';

const BRAND_PALETTE = [
  '#0056D2', // Royal Blue
  '#C8961E', // 24K Gold
  '#0B2545', // Deep Navy
  '#10B981', // Emerald
  '#1E40AF', // Sapphire
  '#E5A93C', // Amber Gold
  '#0284C7', // Sky Blue
  '#D97706', // Warm Gold
  '#3B82F6', // Blue Light
  '#6366F1'  // Indigo
];

export const AllocationPieChart = ({ portfolio = [] }) => {
  if (!portfolio || portfolio.length === 0) {
    return (
      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px' }}>
        No holdings to display allocation.
      </div>
    );
  }

  const totalValue = portfolio.reduce((sum, item) => sum + (item.currentValue || 0), 0);

  const data = portfolio.map((item) => ({
    name: item.symbol,
    fullName: item.stockName,
    value: item.currentValue || 0,
    percent: totalValue > 0 ? (item.currentValue / totalValue) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  // Group smaller holdings into 'Others' if more than 7 stocks
  let displayData = data;
  if (data.length > 7) {
    const top6 = data.slice(0, 6);
    const others = data.slice(6);
    const otherVal = others.reduce((s, i) => s + i.value, 0);
    displayData = [
      ...top6,
      {
        name: 'Others',
        fullName: `${others.length} Other Stocks`,
        value: otherVal,
        percent: (otherVal / totalValue) * 100
      }
    ];
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 4px 14px rgba(11, 37, 69, 0.12)'
        }}>
          <div style={{ fontWeight: 700, color: '#0056D2', fontSize: '13px' }}>{item.name}</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>{item.fullName}</div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>{formatINR(item.value)}</div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>{formatPercent(item.percent, false)} of portfolio</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={BRAND_PALETTE[index % BRAND_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(val) => <span style={{ color: '#0F172A', fontSize: '12px', fontWeight: 600 }}>{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
