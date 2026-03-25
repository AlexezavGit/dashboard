import React from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, Legend
} from 'recharts';
import { COLORS } from '../../constants';

interface ScatterPoint {
  name: string;
  x: number;
  y: number;
  z?: number;
  category?: string;
  fill?: string;
}

interface CustomScatterPlotProps {
  data: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  zLabel?: string;
  height?: number;
  isBubble?: boolean;
}

export const CustomScatterPlot: React.FC<CustomScatterPlotProps> = ({ 
  data, xLabel, yLabel, zLabel, height = 300, isBubble = false 
}) => {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={1}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 245, 255, 0.1)" />
        <XAxis 
          type="number" 
          dataKey="x" 
          name={xLabel} 
          unit="" 
          tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono'}}
          label={{ value: xLabel, position: 'insideBottom', offset: -10, fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
        />
        <YAxis 
          type="number" 
          dataKey="y" 
          name={yLabel} 
          unit="" 
          tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono'}}
          label={{ value: yLabel, angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono' }}
        />
        {isBubble && <ZAxis type="number" dataKey="z" range={[60, 400]} name={zLabel} />}
        <Tooltip 
          cursor={{ strokeDasharray: '3 3', stroke: 'rgba(0, 245, 255, 0.5)' }} 
          contentStyle={{ backgroundColor: '#050A15', borderRadius: '8px', border: '1px solid rgba(0, 245, 255, 0.2)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
          itemStyle={{ fontSize: '11px', fontWeight: 700, color: '#00F5FF', fontFamily: 'JetBrains Mono' }}
          formatter={(value: any, name: string) => [value, name]}
        />
        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#94a3b8' }} />
        <Scatter name="Data" data={data} fill={COLORS.cyberCyan}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || COLORS.blue} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};
