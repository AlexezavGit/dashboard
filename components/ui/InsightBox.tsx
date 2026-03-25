import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface InsightBoxProps {
  type: 'critical' | 'positive' | 'neutral';
  children: React.ReactNode;
}

export const InsightBox: React.FC<InsightBoxProps> = ({ type, children }) => {
  let bgClass = 'bg-cyber-amber/5 border-cyber-amber/20 text-cyber-amber';
  let icon = <Info className="w-4 h-4 text-cyber-amber mt-0.5" />;
  let borderLeft = 'border-l-cyber-amber';

  if (type === 'critical') {
    bgClass = 'bg-rose-500/5 border-rose-500/20 text-rose-400';
    icon = <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5" />;
    borderLeft = 'border-l-rose-500';
  } else if (type === 'positive') {
    bgClass = 'bg-cyber-success/5 border-cyber-success/20 text-cyber-success';
    icon = <CheckCircle className="w-4 h-4 text-cyber-success mt-0.5" />;
    borderLeft = 'border-l-cyber-success';
  } else {
    bgClass = 'bg-cyber-cyan/5 border-cyber-cyan/20 text-cyber-cyan';
    icon = <Info className="w-4 h-4 text-cyber-cyan mt-0.5" />;
    borderLeft = 'border-l-cyber-cyan';
  }

  return (
    <div className={`mt-4 p-4 rounded-r-lg border-y border-r border-l-4 text-[11px] leading-relaxed flex items-start gap-3 backdrop-blur-sm font-medium ${bgClass} ${borderLeft}`}>
      <div className="shrink-0">{icon}</div>
      <div>{children}</div>
    </div>
  );
};
