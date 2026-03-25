import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  colSpan?: 'full' | '1' | '2';
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, colSpan = '1' }) => {
  const colSpanClass = colSpan === 'full' ? 'col-span-full' : colSpan === '2' ? 'lg:col-span-2' : 'col-span-1';

  return (
    <div className={`cyber-card overflow-hidden ${colSpanClass} ${className}`}>
      {(title || subtitle) && (
        <div className="px-5 pt-5 pb-2 border-b border-cyber-border/50 mb-2">
          {title && <h3 className="text-xs font-bold text-white uppercase tracking-widest leading-tight">{title}</h3>}
          {subtitle && <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-mono">{subtitle}</p>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};