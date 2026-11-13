import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { formatINR } from '../../utils/formatters/formatters';

export const SectorBarChart = ({ portfolio = [] }) => {
  if (!portfolio || portfolio.length === 0) {
    return (
      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px' }}>
        No sector data to display.
      </div>
    );
  }

  // Aggregate by sector
  const sectorMap = {};
  for (const item of portfolio) {
    const sec = item.sector || 'Equities';
    sectorMap[sec] = (sectorMap[sec] || 0) + (item.currentValue || 0);
  }

  const data = Object.keys(sectorMap)
    .map(key => ({
      sector: key,
      value: sectorMap[key]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 sectors

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
          <div style={{ fontWeight: 700, color: '#0056D2', fontSize: '12.5px' }}>{item.sector}</div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
            {formatINR(item.value)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 30, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
          <XAxis
            type="number"
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            stroke="#94A3B8"
            fontSize={11}
          />
          <YAxis
            type="category"
            dataKey="sector"
            stroke="#64748B"
            fontSize={11}
            width={120}
            tickFormatter={(val) => val.length > 18 ? val.substring(0, 16) + '..' : val}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? '#0056D2' : index === 1 ? '#C8961E' : '#0B2545'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
