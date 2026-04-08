import React from 'react';
import { Wifi, WifiOff, Lock, Database, Loader, ShieldOff } from 'lucide-react';
import { DataSourceStatus } from '../../services/liveData';
import { Language } from '../../types';

interface Props {
  status: DataSourceStatus;
  lang: Language;
  lastFetched?: Date;
  compact?: boolean;
}

const STATUS_CONFIG = {
  live: {
    label: { uk: 'LIVE', en: 'LIVE' },
    className: 'bg-cyber-success/15 text-cyber-success border-cyber-success/40',
    dotClass: 'bg-cyber-success animate-pulse',
    Icon: Wifi,
  },
  static: {
    label: { uk: 'СТАТИЧНО', en: 'STATIC' },
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
    dotClass: 'bg-amber-400',
    Icon: Database,
  },
  not_configured: {
    label: { uk: 'ПОТРІБЕН ТОКЕН', en: 'TOKEN REQUIRED' },
    className: 'bg-slate-700/50 text-slate-400 border-slate-600/40',
    dotClass: 'bg-slate-500',
    Icon: Lock,
  },
  unavailable: {
    label: { uk: 'НЕДОСТУПНО', en: 'UNAVAILABLE' },
    className: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-500',
    Icon: WifiOff,
  },
  loading: {
    label: { uk: 'ЗАВАНТАЖЕННЯ', en: 'LOADING' },
    className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    dotClass: 'bg-cyan-400 animate-ping',
    Icon: Loader,
  },
  restricted: {
    label: { uk: 'ЛІЦЕНЗІЯ', en: 'RESTRICTED' },
    className: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
    dotClass: 'bg-orange-500',
    Icon: ShieldOff,
  },
};

export const DataSourceBadge: React.FC<Props> = ({ status, lang, lastFetched, compact }) => {
  const cfg = STATUS_CONFIG[status];
  const { Icon } = cfg;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase ${cfg.className}`}>
        <span className={`w-1 h-1 rounded-full ${cfg.dotClass}`} />
        {cfg.label[lang]}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-mono px-2 py-1 rounded border uppercase ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
      <Icon className="w-3 h-3" />
      {cfg.label[lang]}
      {status === 'live' && lastFetched && (
        <span className="font-normal opacity-70 normal-case tracking-normal">
          {lastFetched.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
