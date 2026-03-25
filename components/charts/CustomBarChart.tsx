import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

interface CustomBarChartProps {
  data: any[];
  layout?: 'horizontal' | 'vertical';
  bars?: { key: string; color: string; name?: string }[];
  xAxisKey?: string;
  unit?: string;
  height?: number;
}

export const CustomBarChart: React.FC<CustomBarChartProps> = ({ 
  data, 
  layout = 'horizontal', 
  bars = [{ key: 'value', color: '#1B3A5C', name: 'Value' }], 
  xAxisKey = 'name',
  unit = '',
  height = 300
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1}>
        <BarChart
          layout={layout as 'horizontal' | 'vertical'}
          data={data}
          margin={{ top: 5, right: 30, left: layout === 'vertical' ? 100 : 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={layout === 'horizontal'} horizontal={layout === 'vertical'} stroke="rgba(0, 245, 255, 0.1)" />
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }} interval={0} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }} unit={unit} />
            </>
          ) : (
            <>
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }} unit={unit} />
              <YAxis dataKey={xAxisKey} type="category" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }} />
            </>
          )}
          <Tooltip 
            contentStyle={{ backgroundColor: '#050A15', borderRadius: '8px', border: '1px solid rgba(0, 245, 255, 0.2)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ fontSize: '11px', fontWeight: 700, color: '#00F5FF', fontFamily: 'JetBrains Mono' }}
            cursor={{ fill: 'rgba(0, 245, 255, 0.05)' }}
          />
          {bars.length > 1 && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
          {bars.map((bar) => (
            <Bar 
              key={bar.key} 
              dataKey={bar.key} 
              fill={bar.color} 
              name={bar.name} 
              radius={layout === 'horizontal' ? [4, 4, 0, 0] : [0, 4, 4, 0]} 
              barSize={32}
              fillOpacity={0.9}
            />
          ))}
          {bars.length === 1 && (
             <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={layout === 'vertical' ? 20 : 40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || bars[0].color} />
                ))}
             </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
