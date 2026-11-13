import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, Legend } from 'recharts';
import { formatINR } from '../../utils/formatters/formatters';

export const RealizedVsUnrealizedChart = ({ stats, taxSummary }) => {
  const data = [
    {
      category: 'Unrealized P&L',
      amount: stats.unrealizedPnL,
      isProfit: stats.unrealizedPnL >= 0
    },
    {
      category: `Realized (${taxSummary.financialYear})`,
      amount: taxSummary.totalGrossProfit - taxSummary.totalGrossLoss,
      isProfit: (taxSummary.totalGrossProfit - taxSummary.totalGrossLoss) >= 0
    },
    {
      category: 'All-Time Realized',
      amount: stats.allTimeRealizedPnL,
      isProfit: stats.allTimeRealizedPnL >= 0
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #EAE5E4',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '12px', color: '#777078' }}>{item.category}</div>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: item.isProfit ? '#16845B' : '#D94A52',
            marginTop: '2px'
          }}>
            {formatINR(item.amount)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE5E4" />
          <XAxis dataKey="category" stroke="#777078" fontSize={11.5} />
          <YAxis
            stroke="#9E969F"
            fontSize={11}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.amount >= 0 ? '#16845B' : '#D94A52'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
