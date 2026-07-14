import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Language } from '../../types';
import { useMobile } from '@/components/hooks/useMobile';

interface Props { lang: Language; darkMode?: boolean; }

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  green:  '#00d4aa',
  yellow: '#e8c97a',
  red:    '#ff7b6e',
  muted:  'rgba(255,255,255,0.38)',
  border: 'rgba(255,255,255,0.08)',
  bg:     'rgba(0,0,0,0.28)',
};

// ── Timeline data (months 0-36) ───────────────────────────────────────────────
const TIMELINE = Array.from({ length: 37 }, (_, m) => ({
  m,
  a: parseFloat((m === 0 ? 0 : -1.29 + (m / 36) * (15.5 + 1.29)).toFixed(2)),
  b: parseFloat((-(m / 36) * 9.8).toFixed(2)),
  c: parseFloat((m < 24 ? -(m / 24) * 30.7 : -30.7).toFixed(2)),
}));

// ── Waterfall rows ────────────────────────────────────────────────────────────
const WATERFALL = (lang: Language) => [
  {
    label: { uk: 'Цифрове плече (FEEL Again)', en: 'Digital lever (FEEL Again)' },
    invest: '-$1.29B',
    result: '+$15.5B',
    roi: '12:1',
    bar: 100,
    color: C.green,
  },
  {
    label: { uk: 'Часткові зусилля (без координації)', en: 'Partial effort (no coordination)' },
    invest: '-$9.8B',
    result: '+$5.7B',
    roi: '0.6:1',
    bar: 37,
    color: C.yellow,
  },
  {
    label: { uk: 'Бездіяльність (статус-кво)', en: 'Inaction (status quo)' },
    invest: '$0',
    result: '-$30.7B',
    roi: 'КОЛАПС',
    bar: 0,
    color: C.red,
  },
];

// ── Patient funnel: population cascade (9.6M → 3.9M → [VERIFIED] → [VERIFIED]) ──
// Steps 1–2 verified (OCHA HNRP / WHO-Lancet). Steps 3–4 pending WB ISR #6 re-verify.
const FUNNEL_STEPS = (lang: Language) => [
  {
    stage: { uk: '9.6M', en: '9.6M' },
    caption: { uk: 'Усього у психосоціальній потребі', en: 'Total in psychosocial need' },
    detail: { uk: 'Оцінка ООН HNRP', en: 'UN OCHA HNRP estimate' },
    color: C.green,
    width: '100%',
    pending: false,
  },
  {
    stage: { uk: '3.9M', en: '3.9M' },
    caption: { uk: 'Клінічний рівень потреби', en: 'Clinical-level need' },
    detail: { uk: 'WHO / Lancet 2024', en: 'WHO / Lancet 2024' },
    color: C.green,
    width: '41%',
    pending: false,
  },
  {
    stage: { uk: 'ПЕРЕВІР', en: 'VERIFY' },
    caption: { uk: 'Охоплено МНПП', en: 'Reached with MHPSS' },
    detail: { uk: 'WB ISR #6 — потрібна звірка', en: 'WB ISR #6 — re-verify' },
    color: C.yellow,
    width: '14%',
    pending: true,
  },
  {
    stage: { uk: 'ПЕРЕВІР', en: 'VERIFY' },
    caption: { uk: 'Завершили лікування', en: 'Completed treatment' },
    detail: { uk: 'WB ISR #6 — потрібна звірка', en: 'WB ISR #6 — re-verify' },
    color: C.yellow,
    width: '9%',
    pending: true,
  },
];

// ── Custom tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, lang }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 11 }}>
      <div style={{ color: C.muted, marginBottom: 4, fontFamily: 'DM Mono, monospace' }}>
        {lang === 'uk' ? `Місяць ${label}` : `Month ${label}`}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
          {p.name}: {p.value >= 0 ? '+' : ''}{p.value}B
        </div>
      ))}
    </div>
  );
};

type Tab = 'timeline' | 'funnel' | 'waterfall';

export const InactionFunnel: React.FC<{ lang: Language; darkMode?: boolean }> = ({ lang, darkMode = true }) => {
  const [tab, setTab] = useState<'timeline' | 'funnel' | 'waterfall'>('timeline');
  const isMobile = useMobile();

  const tabs: { id: 'timeline' | 'funnel' | 'waterfall'; label: { uk: string; en: string } }[] = [
    { id: 'timeline',  label: { uk: 'Динаміка (36 міс)', en: 'Timeline (36 mo)' } },
    { id: 'funnel',    label: { uk: 'Воронка пацієнтів', en: 'Patient Funnel' } },
    { id: 'waterfall', label: { uk: 'ROI порівняння',    en: 'ROI Comparison'   } },
  ];

  return (
    <div style={{
      background: C.bg,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '10px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {lang === 'uk' ? '⚠ Три розвилки — три долі' : '⚠ Three Paths — Three Fates'}
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: C.muted, marginTop: 1 }}>
            {lang === 'uk'
              ? '9.6M у потребі → 3.9M клінічна · охоплення — звірка WB ISR #6'
              : '9.6M in need → 3.9M clinical · coverage pending WB ISR #6'}
          </div>
        </div>
        {/* Tab switcher - mobile friendly */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['timeline', 'funnel', 'waterfall'].map(t => (
            <button key={t} onClick={() => setTab(t as any)} style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9,
              padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
              background: tab === t ? 'rgba(0,212,170,0.15)' : 'transparent',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: tab === t ? C.green : C.muted,
              transition: 'all 0.15s',
              minHeight: 44,
              minWidth: 44,
            }}>
               {({ timeline: { uk: 'Динаміка (36 міс)', en: 'Timeline (36 mo)' }, funnel: { uk: 'Воронка пацієнтів', en: 'Patient Funnel' }, waterfall: { uk: 'ROI порівняння', en: 'ROI Comparison' } } as Record<string, { uk: string; en: string }>)[t][lang]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab: Timeline ── */}
      {tab === 'timeline' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            {[
              { color: C.green,  label: { uk: 'Гілка 1: FEEL Again',         en: 'Path 1: FEEL Again'       } },
              { color: C.yellow, label: { uk: 'Гілка 2: Часткові зусилля',   en: 'Path 2: Partial effort'   } },
              { color: C.red,    label: { uk: 'Гілка 3: Бездіяльність',      en: 'Path 3: Inaction'         } },
            ].map(l => (
              <div key={l.color} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 20, height: 2.5, background: l.color, borderRadius: 2 }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: C.muted }}>{l.label[lang]}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TIMELINE} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                {[['ga', C.green], ['gb', C.yellow], ['gc', C.red]].map(([id, color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="m" tick={{ fontSize: 8, fill: C.muted, fontFamily: 'DM Mono, monospace' }}
                tickFormatter={v => v === 0 ? '0' : v === 18 ? (lang === 'uk' ? '18м' : '18m') : v === 36 ? (lang === 'uk' ? '36м' : '36m') : ''}
                interval={0} />
              <YAxis tick={{ fontSize: 8, fill: C.muted, fontFamily: 'DM Mono, monospace' }}
                tickFormatter={v => `${v}B`} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" />
              <ReferenceLine x={18} stroke="rgba(232,201,122,0.3)" strokeDasharray="3 3"
                label={{ value: lang === 'uk' ? 'беззбитковість' : 'breakeven', position: 'top', fontSize: 8, fill: C.yellow }} />
              <Tooltip content={<ChartTooltip lang={lang} />} />
              <Area type="monotone" dataKey="a" name={lang === 'uk' ? 'FEEL Again' : 'FEEL Again'}
                stroke={C.green} fill="url(#ga)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="b" name={lang === 'uk' ? 'Часткові' : 'Partial'}
                stroke={C.yellow} fill="url(#gb)" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
              <Area type="monotone" dataKey="c" name={lang === 'uk' ? 'Бездіяльність' : 'Inaction'}
                stroke={C.red} fill="url(#gc)" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: C.green }}>
              {lang === 'uk' ? 'Дельта: +$15.5B за 36 міс' : 'Delta: +$15.5B over 36 mo'}
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 8, color: C.red }}>
              {lang === 'uk' ? 'Колапс: ~24 міс без дій' : 'Collapse: ~24 mo without action'}
            </span>
          </div>
        </motion.div>
      )}

      {/* ── Tab: Patient Funnel (population cascade) ── */}
      {tab === 'funnel' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {FUNNEL_STEPS(lang).map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Left: stage badge */}
            <div style={{
              flexShrink: 0, width: 84, textAlign: 'center',
              background: step.pending ? `${step.color}10` : `${step.color}18`,
              border: `1px solid ${step.color}44`,
              borderRadius: 6, padding: '5px 6px',
              opacity: step.pending ? 0.75 : 1,
            }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 13, color: step.color }}>
                {step.stage[lang]}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, color: C.muted, marginTop: 1 }}>
                {step.caption[lang]}
              </div>
            </div>
            {/* Center: bar + detail */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: step.width }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{
                    height: '100%', borderRadius: 4,
                    background: step.pending
                      ? `repeating-linear-gradient(45deg, ${step.color}55, ${step.color}55 4px, transparent 4px, transparent 8px)`
                      : step.color,
                    boxShadow: step.pending ? 'none' : `0 0 8px ${step.color}55`,
                  }}
                />
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>
                {step.detail[lang]}
              </div>
            </div>
            {/* Right: verify status */}
            <div style={{
              flexShrink: 0, textAlign: 'center',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9,
              color: step.pending ? C.yellow : C.green,
              border: `1px solid ${step.pending ? C.yellow : C.green}44`,
              borderRadius: 5, padding: '3px 6px', minHeight: 44, display: 'flex', alignItems: 'center',
            }}>
              {step.pending
                ? (lang === 'uk' ? 'ЗВІР' : 'VERIFY')
                : (lang === 'uk' ? '✓ підтвердж.' : '✓ verified')}
            </div>
          </div>
        ))}
        {/* Footer note */}
        <div style={{ textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: 8, color: C.muted, marginTop: 2 }}>
          {lang === 'uk'
            ? '9.6M → 3.9M: каскад потреби · кроки 3–4 — звірка WB ISR #6'
            : '9.6M → 3.9M: need cascade · steps 3–4 pending WB ISR #6'}
        </div>
      </motion.div>
      )}

      {/* ── Tab: Waterfall ── */}
      {tab === 'waterfall' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {WATERFALL(lang).map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Label */}
            <div style={{ width: '100%', flexShrink: 0, fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.75)' }}>
              {row.label}
            </div>
            {/* Bar */}
            <div style={{ flex: 1, height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${row.bar}%` }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                style={{
                  height: '100%', borderRadius: 4,
                  background: row.bar === 0
                    ? `repeating-linear-gradient(45deg, ${row.color}22, ${row.color}22 4px, transparent 4px, transparent 8px)`
                    : row.color,
                  boxShadow: row.bar > 0 ? `0 0 10px ${row.color}44` : 'none',
                }}
              />
            </div>
            {/* Invest */}
            <div style={{ width: 52, textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: 9, color: C.muted }}>
              {row.invest}
            </div>
            {/* Result */}
            <div style={{ width: 64, textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 11, color: row.color }}>
              {row.result}
            </div>
            {/* ROI badge */}
            <div style={{
              width: 52, textAlign: 'center', flexShrink: 0,
              background: `${row.color}18`, border: `1px solid ${row.color}44`,
              borderRadius: 5, padding: '2px 4px',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: row.color,
            }}>
              {row.roi}
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 6, fontFamily: 'DM Mono, monospace', fontSize: 8, color: C.muted }}>
          {lang === 'uk'
            ? 'Джерела: WB ISR #6 · Lancet 2023 · Мінсоцполітики Постанова №234 · НСЗУ тариф 2025'
            : 'Sources: WB ISR #6 · Lancet 2023 · MinSocPolicy Decree #234 · NHSU tariff 2025'}
        </div>
      </motion.div>
      )}
    </div>
  );
};

export default InactionFunnel;