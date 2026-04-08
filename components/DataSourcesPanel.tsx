import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, ExternalLink, AlertTriangle, CheckCircle2, XCircle, Lock, RefreshCw, ShieldOff } from 'lucide-react';
import { DataSourceInfo, DataSourceStatus } from '../services/liveData';
import { DataSourceBadge } from './ui/DataSourceBadge';
import { Language } from '../types';

interface Props {
  sources: DataSourceInfo[];
  lang: Language;
  isLoading: boolean;
  onRefresh: () => void;
}

const STATUS_ICON: Record<DataSourceStatus, React.FC<{ className?: string }>> = {
  live: ({ className }) => <CheckCircle2 className={className} />,
  static: ({ className }) => <AlertTriangle className={className} />,
  not_configured: ({ className }) => <Lock className={className} />,
  unavailable: ({ className }) => <XCircle className={className} />,
  loading: ({ className }) => <RefreshCw className={`${className} animate-spin`} />,
  restricted: ({ className }) => <ShieldOff className={className} />,
};

const STATUS_ROW_COLOR: Record<DataSourceStatus, string> = {
  live: 'border-l-cyber-success/60',
  static: 'border-l-amber-500/60',
  not_configured: 'border-l-slate-600',
  unavailable: 'border-l-rose-500/60',
  loading: 'border-l-cyan-500/60',
  restricted: 'border-l-orange-500/60',
};

export const DataSourcesPanel: React.FC<Props> = ({ sources, lang, isLoading, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);

  const liveCount = sources.filter(s => s.status === 'live').length;
  const staticCount = sources.filter(s => s.status === 'static').length;
  const notConfiguredCount = sources.filter(s => s.status === 'not_configured').length;
  const unavailableCount = sources.filter(s => s.status === 'unavailable').length;
  const restrictedCount = sources.filter(s => s.status === 'restricted').length;

  return (
    <div className="cyber-card border border-cyber-border rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="cyber-label text-xs">
            {lang === 'uk' ? 'СТАТУС ДЖЕРЕЛ ДАНИХ' : 'DATA SOURCE STATUS'}
          </span>
          <div className="flex items-center gap-2">
            {liveCount > 0 && (
              <span className="text-[10px] font-mono font-bold text-cyber-success bg-cyber-success/10 border border-cyber-success/30 px-2 py-0.5 rounded">
                {liveCount} LIVE
              </span>
            )}
            {staticCount > 0 && (
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                {staticCount} {lang === 'uk' ? 'СТАТИЧНО' : 'STATIC'}
              </span>
            )}
            {notConfiguredCount > 0 && (
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-700/50 border border-slate-600 px-2 py-0.5 rounded">
                {notConfiguredCount} {lang === 'uk' ? 'НЕ НАЛАШТОВАНО' : 'NOT CONFIGURED'}
              </span>
            )}
            {unavailableCount > 0 && (
              <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                {unavailableCount} {lang === 'uk' ? 'НЕДОСТУПНО' : 'UNAVAILABLE'}
              </span>
            )}
            {restrictedCount > 0 && (
              <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">
                {restrictedCount} {lang === 'uk' ? 'ПОТРІБНА ЛІЦЕНЗІЯ' : 'LICENSE REQUIRED'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onRefresh(); }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            title={lang === 'uk' ? 'Оновити дані' : 'Refresh data'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyber-cyan' : ''}`} />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-cyber-border">
              <div className="mt-4 space-y-2">
                {sources.map(source => {
                  const StatusIcon = STATUS_ICON[source.status];
                  return (
                    <div
                      key={source.id}
                      className={`bg-cyber-surface rounded-lg p-3 border-l-2 ${STATUS_ROW_COLOR[source.status]} border border-cyber-border`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <DataSourceBadge status={source.status} lang={lang} lastFetched={source.lastFetched} compact />
                          <span className="text-[11px] font-bold text-white truncate">{source.name[lang]}</span>
                        </div>
                        <a
                          href={source.apiBase}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-slate-600 hover:text-cyber-cyan transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        <div>
                          <span className="text-[9px] text-slate-600 uppercase tracking-wider">
                            {lang === 'uk' ? 'Тип даних' : 'Data type'}:
                          </span>
                          <p className="text-[10px] text-slate-400">{source.dataType[lang]}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-600 uppercase tracking-wider">
                            {lang === 'uk' ? 'Оновлення' : 'Update freq'}:
                          </span>
                          <p className="text-[10px] text-slate-400">{source.updateFrequency[lang]}</p>
                        </div>
                      </div>

                      {/* Why not available */}
                      {source.status === 'not_configured' && source.authNote && (
                        <div className="mt-2 bg-slate-800/50 rounded p-2">
                          <p className="text-[10px] text-slate-400 font-mono">
                            <Lock className="w-2.5 h-2.5 inline mr-1" />
                            {source.authNote[lang]}
                          </p>
                        </div>
                      )}
                      {source.status === 'static' && source.noApiReason && (
                        <div className="mt-2 bg-amber-500/5 rounded p-2 border border-amber-500/20">
                          <p className="text-[10px] text-amber-400/70">
                            <AlertTriangle className="w-2.5 h-2.5 inline mr-1" />
                            {source.noApiReason[lang]}
                          </p>
                        </div>
                      )}
                      {source.status === 'unavailable' && source.error && (
                        <div className="mt-2 bg-rose-500/5 rounded p-2 border border-rose-500/20">
                          <p className="text-[10px] text-rose-400/70 font-mono">{source.error}</p>
                        </div>
                      )}
                      {source.status === 'restricted' && source.restrictionNote && (
                        <div className="mt-2 space-y-1.5">
                          <div className="bg-orange-500/5 rounded p-2 border border-orange-500/20">
                            <p className="text-[10px] text-orange-400/80 flex gap-1">
                              <ShieldOff className="w-2.5 h-2.5 mt-0.5 flex-shrink-0" />
                              {source.restrictionNote[lang]}
                            </p>
                          </div>
                          {source.potentialData && (
                            <div className="bg-slate-800/40 rounded p-2 border border-slate-700/30">
                              <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">
                                {lang === 'uk' ? 'Потенційні дані (за умови ліцензії)' : 'Potential data (if licensed)'}
                              </p>
                              <p className="text-[10px] text-slate-400 italic">{source.potentialData[lang]}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-cyber-border grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['live', 'static', 'not_configured', 'unavailable', 'restricted'] as DataSourceStatus[]).map(s => (
                  <div key={s} className="flex items-center gap-1.5">
                    <DataSourceBadge status={s} lang={lang} compact />
                    <span className="text-[9px] text-slate-600">
                      {s === 'live' && (lang === 'uk' ? 'Реальні дані з API' : 'Live API data')}
                      {s === 'static' && (lang === 'uk' ? 'Вручну з звітів' : 'Manual from reports')}
                      {s === 'not_configured' && (lang === 'uk' ? 'Потрібен токен орг.' : 'Needs org token')}
                      {s === 'unavailable' && (lang === 'uk' ? 'API недоступне' : 'API unreachable')}
                      {s === 'restricted' && (lang === 'uk' ? 'Потрібна ліцензія / угода' : 'License / agreement required')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
