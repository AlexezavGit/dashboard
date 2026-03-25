import React from 'react';
import { Language } from '../../types';

interface HeatmapData {
  region?: string;
  name?: string;
  [key: string]: string | number | undefined;
}

interface CustomHeatmapProps {
  data: HeatmapData[];
  metrics: { key: string; label: { uk: string; en: string } }[];
  lang: Language;
}

export const CustomHeatmap: React.FC<CustomHeatmapProps> = ({ data, metrics, lang }) => {
  const getBgColor = (value: number) => {
    if (value >= 70) return 'bg-rose-600/80 text-white border border-rose-500/50 shadow-[0_0_10px_rgba(225,29,72,0.3)]';
    if (value >= 50) return 'bg-rose-400/60 text-white border border-rose-400/30';
    if (value >= 30) return 'bg-cyber-amber/60 text-white border border-cyber-amber/30';
    if (value >= 15) return 'bg-cyber-amber/30 text-cyber-amber border border-cyber-amber/20';
    return 'bg-cyber-border/20 text-slate-500 border border-cyber-border/10';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        {/* Header */}
        <div className="grid grid-cols-6 gap-1 mb-2">
          <div className="col-span-1 p-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
            {lang === 'uk' ? 'РЕГІОН' : 'REGION'}
          </div>
          {metrics.map((m) => (
            <div key={m.key} className="col-span-1 p-2 text-[9px] font-bold text-slate-500 uppercase text-center leading-tight flex items-center justify-center font-mono">
              {m.label[lang]}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-1">
          {data.map((row) => {
            const rowKey = row.region || row.name || Math.random().toString();
            return (
            <div key={rowKey} className="grid grid-cols-6 gap-1">
              <div className="col-span-1 p-3 text-[11px] font-bold text-cyber-cyan bg-cyber-border/10 rounded-l-lg flex items-center border-l border-y border-cyber-border/30 font-mono">
                {row.region || row.name}
              </div>
              {metrics.map((m) => {
                const val = row[m.key] as number;
                return (
                  <div 
                    key={m.key} 
                    className={`col-span-1 p-3 text-xs font-bold text-center rounded-md transition-all hover:scale-[1.05] hover:z-10 cursor-default flex items-center justify-center font-mono ${getBgColor(val)}`}
                    title={`${row.region || row.name} - ${m.label[lang]}: ${val}%`}
                  >
                    {val}%
                  </div>
                );
              })}
            </div>
          )})}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-4 flex-wrap p-3 bg-cyber-border/5 rounded-lg border border-cyber-border/20">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mr-2 font-mono">
            {lang === 'uk' ? 'РІВЕНЬ БАР\'ЄРУ:' : 'BARRIER LEVEL:'}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyber-border/20 border border-cyber-border/30"></div>
            <span className="text-[9px] text-slate-500 font-mono">0-15%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyber-amber/30 border border-cyber-amber/20"></div>
            <span className="text-[9px] text-slate-500 font-mono">15-30%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-cyber-amber/60 border border-cyber-amber/30"></div>
            <span className="text-[9px] text-slate-500 font-mono">30-50%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-400/60 border border-rose-400/30"></div>
            <span className="text-[9px] text-slate-500 font-mono">50-70%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-600/80 border border-rose-500/50"></div>
            <span className="text-[9px] text-slate-500 font-mono">70%+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
