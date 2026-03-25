import React from 'react';

interface UkraineMapProps {
  data: { region: string; value: number; fill: string }[];
  title?: string;
}

// Simplified Ukraine Map SVG paths (approximate)
const REGIONS = [
  { id: 'north', name: { uk: 'Північ', en: 'North' }, path: 'M 150 50 L 250 50 L 250 100 L 150 100 Z' },
  { id: 'south', name: { uk: 'Південь', en: 'South' }, path: 'M 150 150 L 250 150 L 250 200 L 150 200 Z' },
  { id: 'east', name: { uk: 'Схід', en: 'East' }, path: 'M 250 100 L 350 100 L 350 150 L 250 150 Z' },
  { id: 'west', name: { uk: 'Захід', en: 'West' }, path: 'M 50 100 L 150 100 L 150 150 L 50 150 Z' },
  { id: 'central', name: { uk: 'Центр', en: 'Central' }, path: 'M 150 100 L 250 100 L 250 150 L 150 150 Z' },
];

export const UkraineMap: React.FC<UkraineMapProps> = ({ data, title }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {title && <h4 className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-widest font-mono">{title}</h4>}
      <div className="relative w-full max-w-md aspect-[1.5/1] bg-cyber-bg/50 rounded-xl border border-cyber-border/30 p-4 flex items-center justify-center overflow-hidden">
        {/* Grid background effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #00F5FF 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <svg viewBox="0 0 400 250" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,245,255,0.1)] relative z-10">
          {REGIONS.map((region) => {
            const regionData = data.find(d => d.region === region.name.uk || d.region === region.name.en);
            return (
              <g key={region.id} className="transition-all hover:opacity-100 opacity-80 cursor-help group">
                <path
                  d={region.path}
                  fill={regionData?.fill || 'rgba(0, 245, 255, 0.1)'}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1.5"
                  className="transition-all duration-300 group-hover:stroke-cyber-cyan group-hover:filter group-hover:drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]"
                />
                <title>{region.name.uk}: {regionData?.value}%</title>
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 bg-cyber-bg/80 backdrop-blur-md p-3 rounded-lg border border-cyber-border/30 shadow-xl z-20">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-slate-400 font-mono">
              <div className="w-2 h-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.5)]" style={{ backgroundColor: d.fill, boxShadow: `0 0 8px ${d.fill}44` }} />
              <span className="uppercase tracking-tighter">{d.region}: <span className="text-cyber-cyan">{d.value}%</span></span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[9px] text-slate-500 mt-2 italic font-mono uppercase tracking-widest opacity-50">Спрощена карта регіонального розподілу // SIMPLIFIED REGIONAL MAP</p>
    </div>
  );
};
