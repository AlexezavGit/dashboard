import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface CustomDonutChartProps {
  data: any[];
  height?: number;
}

export const CustomDonutChart: React.FC<CustomDonutChartProps> = ({ data, height = 300 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ backgroundColor: '#050A15', borderRadius: '8px', border: '1px solid rgba(0, 245, 255, 0.2)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
             itemStyle={{ fontSize: '11px', fontWeight: 700, color: '#00F5FF', fontFamily: 'JetBrains Mono' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};