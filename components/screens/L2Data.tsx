import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, GitMerge, RefreshCw } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';
import { L3Footer } from './L3Footer';
import { DATA_INTELLIGENCE } from '../../constants';
import { fetchAllLiveData, DataSourceInfo } from '../../services/liveData';

interface Props { lang: Language; nav: ScreenNav; }

const STATUS_COLORS: Record<string, string> = {
  live:    '#00d4aa',
  static:  '#e8c97a',
  error:   '#ff7b6e',
  loading: '#a0a0b0',
};

const STATUS_LABELS: Record<string, { uk: string; en: string }> = {
  live:    { uk: 'LIVE',    en: 'LIVE'   },
  static:  { uk: 'СТАТИК', en: 'STATIC' },
  error:   { uk: 'ПОМИЛ.', en: 'ERROR'  },
  loading: { uk: 'ЗАВАНТ.', en: 'LOAD'  },
};

export const L2Data: React.FC<Props> = ({ lang, nav }) => {
  const [sources, setSources] = useState<DataSourceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const di = DATA_INTELLIGENCE(lang);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { sources: s } = await fetchAllLiveData();
      setSources(s);
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #001a14 100%)', color: '#c8d0dc' }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, #00d4aa, #2ec4b6, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(0,212,170,0.5)' }} />

      <NavBar
        lang={lang}
        nav={nav}
        accentColor="#00d4aa"
        title={{ uk: 'Дані та інтероперабельність', en: 'Data & Interoperability' }}
        subtitle={{ uk: 'Data & Coord · ціль ≥60% · зараз <5%', en: 'Data & Coord · target ≥60% · now <5%' }}
        crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
      />

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#00d4aa22 transparent' }}>

        {/* INTEROP HEADLINE */}
        <div className="rounded-2xl p-5 flex items-center gap-6"
          style={{ background: 'rgba(0,210,170,0.07)', border: '1px solid rgba(0,210,170,0.3)' }}>
          <div>
            <div style={{ fontSize: '64px', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color: '#00d4aa', lineHeight: 1, textShadow: '0 0 40px rgba(0,212,170,0.5)' }}>
              &lt;5%
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', color: 'rgba(200,208,220,0.9)', marginTop: 6 }}>
              {lang === 'uk' ? 'сесій з крос-системним цифровим записом' : 'sessions with cross-system digital record'}
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'rgba(200,208,220,0.45)', marginTop: 3 }}>
              NHSU ↔ ESOZ (HL7 FHIR R4) — pilot only
            </div>
          </div>
          <div style={{ flex: 1, borderLeft: '1px solid rgba(0,210,170,0.2)', paddingLeft: 24 }}>
            <div style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'rgba(200,208,220,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
              {lang === 'uk' ? '5 систем · 0 з\'єднань' : '5 systems · 0 connections'}
            </div>
            {['NHSU / НСЗУ', 'ESOZ', 'HELSI', 'Reint. Portal', 'Private EHRs'].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff7b6e', boxShadow: '0 0 6px rgba(255,123,110,0.6)', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: '#c8d0dc' }}>{s}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#ff7b6e' }}>
              ⊘ {lang === 'uk' ? 'Жодного FHIR R4 API між системами' : 'No FHIR R4 API between any systems'}
            </div>
          </div>
        </div>

        {/* DATA SOURCE STATUS */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,210,170,0.2)' }}>
          <div style={{ background: 'rgba(0,210,170,0.08)', borderBottom: '1px solid rgba(0,210,170,0.2)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4aa', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {lang === 'uk' ? 'СТАТУС ДЖЕРЕЛ ДАНИХ' : 'DATA SOURCE STATUS'}
              </span>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'rgba(200,208,220,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
            >
              <RefreshCw style={{ width: 12, height: 12, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {lang === 'uk' ? 'оновити' : 'refresh'}
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(200,208,220,0.4)' }}>
              {lang === 'uk' ? 'Перевірка API…' : 'Checking APIs…'}
            </div>
          ) : sources.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'rgba(200,208,220,0.4)' }}>
              {lang === 'uk' ? 'Дані недоступні' : 'No data available'}
            </div>
          ) : (
            <div>
              {sources.map((src, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < sources.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[src.status] ?? '#a0a0b0', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', color: '#c8d0dc' }}>{src.name[lang]}</div>
                    <div style={{ fontSize: '10px', fontFamily: 'DM Sans, sans-serif', color: 'rgba(200,208,220,0.45)', marginTop: 1 }}>{src.dataType[lang]}</div>
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: STATUS_COLORS[src.status] ?? '#a0a0b0', border: `1px solid ${STATUS_COLORS[src.status] ?? '#a0a0b0'}44`, borderRadius: 4, padding: '1px 6px', flexShrink: 0 }}>
                    {STATUS_LABELS[src.status]?.[lang] ?? src.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DATA INTELLIGENCE */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(59,130,246,0.4), transparent)' }} />
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '0 8px' }}>
              {di.sectionTitle}
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, rgba(59,130,246,0.4), transparent)' }} />
          </div>
          <p style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'rgba(200,208,220,0.4)', textAlign: 'center', marginBottom: 16, lineHeight: 1.5 }}>
            {di.sectionSub}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* NOW */}
            <div style={{ border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(59,130,246,0.05)', borderBottom: '1px solid rgba(59,130,246,0.2)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#60a5fa' }} />
                <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {lang === 'uk' ? 'ЩО МАЄМО ЗАРАЗ' : 'WHAT WE HAVE NOW'}
                </span>
              </div>
              {di.now.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 16px', borderBottom: i < di.now.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', fontWeight: 700, padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1,
                    background: row.status === 'live' ? 'rgba(16,185,129,0.15)' : 'rgba(100,100,120,0.3)',
                    color: row.status === 'live' ? '#34d399' : '#94a3b8' }}>
                    {row.status === 'live' ? 'LIVE' : 'STATIC'}
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#e2e8f0' }}>{row.name}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(200,208,220,0.45)', marginTop: 2 }}>{row.what}</div>
                    <div style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'rgba(200,208,220,0.25)', marginTop: 2 }}>{row.tech}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CANONICAL */}
            <div style={{ border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(245,158,11,0.05)', borderBottom: '1px solid rgba(245,158,11,0.2)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle style={{ width: 12, height: 12, color: '#fbbf24', flexShrink: 0 }} />
                <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {lang === 'uk' ? 'КАНОНІЧНИЙ НАБІР WB / WHO' : 'CANONICAL WB / WHO DATASET'}
                </span>
              </div>
              {di.canonical.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 16px', borderBottom: i < di.canonical.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', fontWeight: 700, padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1,
                    background: row.status === 'locked' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: row.status === 'locked' ? '#f87171' : '#fbbf24' }}>
                    {row.status === 'locked' ? 'LOCKED' : 'AUTH'}
                  </span>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 500, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {row.name}
                      {row.feelbridges && <span style={{ fontSize: '8px', background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '1px 5px', borderRadius: 3, fontFamily: 'DM Mono, monospace' }}>FEEL bridges</span>}
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(200,208,220,0.45)', marginTop: 2 }}>{row.what}</div>
                    <div style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#92400e', marginTop: 2 }}>
                      {lang === 'uk' ? 'Бар\'єр:' : 'Barrier:'} {row.barrier}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gap statement */}
          <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.05)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <GitMerge style={{ width: 16, height: 16, color: '#34d399', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#6ee7b7', lineHeight: 1.5, margin: 0 }}>{di.gapStatement}</p>
          </div>
        </div>

      </div>
      <L3Footer lang={lang} nav={nav} />
    </div>
  );
};
