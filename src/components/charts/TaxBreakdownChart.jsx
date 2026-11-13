import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatINR } from '../../utils/formatters/formatters';

export const TaxBreakdownChart = ({ taxSummary }) => {
  const { taxOnStcg, taxOnLtcg, cessAmount, surchargeAmount, totalTaxLiability } = taxSummary;

  if (totalTaxLiability <= 0) {
    return (
      <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
        <span style={{ fontWeight: 700, color: '#059669', fontSize: '15px', marginBottom: '6px' }}>₹0 Tax Liability</span>
        <span>No taxable realized capital gains or gains fully sheltered under Section 112A threshold.</span>
      </div>
    );
  }

  const data = [
    { name: 'STCG Tax (Sec 111A)', value: taxOnStcg, color: '#0056D2' },
    { name: 'LTCG Tax (Sec 112A)', value: taxOnLtcg, color: '#C8961E' },
    { name: 'Health & Edu Cess (4%)', value: cessAmount, color: '#0B2545' }
  ];

  if (surchargeAmount > 0) {
    data.push({ name: 'Surcharge', value: surchargeAmount, color: '#7C3AED' });
  }

  const activeData = data.filter(d => d.value > 0);

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
          <div style={{ fontSize: '12px', color: '#64748B' }}>{item.name}</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
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
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {activeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(val) => <span style={{ color: '#0F172A', fontSize: '11.5px', fontWeight: 600 }}>{val}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
