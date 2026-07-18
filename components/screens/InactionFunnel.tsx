import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  mutedLight: 'rgba(18,60,58,0.5)',
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(18,60,58,0.12)',
  bg:     'rgba(0,0,0,0.28)',
  bgLight: 'rgba(255,255,255,0.8)',
};

// ── Timeline data (months 0-36) ───────────────────────────────────────────────
const TIMELINE = Array.from({ length: 37 }, (_, m) => ({
  m,
  a: parseFloat((m === 0 ? 0 : -1.29 + (m / 36) * (15.5 + 1.29)).toFixed(2)),
  b: parseFloat((-(m / 36) * 9.8).toFixed(2)),
  c: parseFloat((m < 24 ? -(m / 24) * 30.7 : -30.7).toFixed(2)),
}));

// ── Sequential inaction chain steps ──────────────────────────────────────────
// Based on WHO standards + NSZU Package №2 + verification documents
const INACTION_STEPS = (lang: Language) => [
  {
    period: { uk: '0–30 днів', en: '0–30 days' },
    sessions: { uk: '5 сесій', en: '5 sessions' },
    standard: 'WHO/NICE',
    outcome: { uk: '82% ремісія', en: '82% remission' },
    cost: { uk: '~$150–200', en: '~$150–200' },
    color: C.green,
    barWidth: '100%',
  },
  {
    period: { uk: '30–180 днів', en: '30–180 days' },
    sessions: { uk: '5–8 сесій', en: '5–8 sessions' },
    standard: 'WHO',
    outcome: { uk: 'нижча ремісія', en: 'lower remission' },
    cost: { uk: '~$200–400', en: '~$200–400' },
    color: C.yellow,
    barWidth: '65%',
  },
  {
    period: { uk: '180 дн–24 міс', en: '180d–24mo' },
    sessions: { uk: '12–20 сесій + соматизація', en: '12–20 sessions + somatization' },
    standard: 'WHO',
    outcome: { uk: 'хронізація', en: 'chronification' },
    cost: { uk: '~$2,000–5,000', en: '~$2,000–5,000' },
    color: C.yellow,
    barWidth: '35%',
  },
  {
    period: { uk: '24+ місяців', en: '24+ months' },
    sessions: { uk: '28 днів стаціонар (до 8 циклів/рік)', en: '28 days inpatient (up to 8 cycles/yr)' },
    standard: 'НСЗУ Пакет №2',
    outcome: { uk: 'інвалідизація', en: 'disability' },
    cost: { uk: '$40,500 / 5 років', en: '$40,500 / 5 years' },
    color: C.red,
    barWidth: '15%',
  },
];

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
    caption: { uk: 'Спеціалізована психологічна допомога', en: 'Specialized psychological care' },
    detail: { uk: 'WHO / Lancet 2024', en: 'WHO / Lancet 2024' },
    color: C.green,
    width: '41%',
    pending: false,
  },
  {
    stage: { uk: '260K', en: '260K' },
    caption: { uk: 'НСЗУ пацієнтів прийнято 2025', en: 'NHSU patients accepted 2025' },
    detail: { uk: 'НСЗУ відкриті дані', en: 'NHSU open data' },
    color: C.yellow,
    width: '2.7%',
    pending: false,
  },
  {
    stage: { uk: '260K', en: '260K' },
    caption: { uk: 'Завершили лікування', en: 'Completed treatment' },
    detail: { uk: 'НСЗУ відкриті дані 2025', en: 'NHSU open data 2025' },
    color: C.yellow,
    width: '1%',
    pending: false,
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

// ── Sequential highlight step component ───────────────────────────────────────
const SequentialStep: React.FC<{
  step: ReturnType<typeof INACTION_STEPS>[number];
  index: number;
  isActive: boolean;
  darkMode: boolean;
  lang: Language;
}> = ({ step, index, isActive, darkMode, lang }) => {
  return (
    <motion.div
      initial={{ opacity: 0.3, x: -8 }}
      animate={{
        opacity: isActive ? 1 : 0.3,
        x: 0,
      }}
      transition={{ duration: 0.5, delay: isActive ? 0 : 0.1 }}
      style={{
        display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
        padding: '6px 8px', borderRadius: 6,
        background: isActive
          ? (darkMode ? `${step.color}12` : `${step.color}08`)
          : 'transparent',
        border: `1px solid ${isActive ? `${step.color}33` : 'transparent'}`,
      }}
    >
      {/* Period badge */}
      <div style={{
        flexShrink: 0, minWidth: 90, textAlign: 'center',
        background: isActive ? `${step.color}18` : (darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(18,60,58,0.04)'),
        border: `1px solid ${isActive ? `${step.color}44` : (darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(18,60,58,0.08)')}`,
        borderRadius: 5, padding: '4px 6px',
      }}>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11,
          color: isActive ? step.color : (darkMode ? C.muted : C.mutedLight),
        }}>
          {step.period[lang]}
        </div>
      </div>

      {/* Sessions + standard */}
      <div style={{ flex: 1, minWidth: 120 }}>
        <div style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 10,
          color: isActive
            ? (darkMode ? 'rgba(255,255,255,0.85)' : 'rgba(18,60,58,0.85)')
            : (darkMode ? C.muted : C.mutedLight),
        }}>
          {step.sessions[lang]}
        </div>
        <div style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(18,60,58,0.35)',
        }}>
          {step.standard}
        </div>
      </div>

      {/* Outcome */}
      <div style={{
        flexShrink: 0, textAlign: 'right',
        fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11,
        color: isActive ? step.color : (darkMode ? C.muted : C.mutedLight),
      }}>
        {step.outcome[lang]}
      </div>

      {/* Cost */}
      <div style={{
        flexShrink: 0, textAlign: 'right', minWidth: 80,
        fontFamily: 'DM Mono, monospace', fontSize: 10,
        color: isActive ? step.color : (darkMode ? C.muted : C.mutedLight),
        opacity: isActive ? 1 : 0.5,
      }}>
        {step.cost[lang]}
      </div>
    </motion.div>
  );
};

type Tab = 'timeline' | 'chain' | 'funnel' | 'waterfall';

export const InactionFunnel: React.FC<{ lang: Language; darkMode?: boolean }> = ({ lang, darkMode = false }) => {
  const [tab, setTab] = useState<Tab>('timeline');
  const [activeStep, setActiveStep] = useState(0);
  const isMobile = useMobile();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sequential animation for chain tab
  useEffect(() => {
    if (tab === 'chain') {
      setActiveStep(0);
      intervalRef.current = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= 3) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 3;
          }
          return prev + 1;
        });
      }, 1800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [tab]);

  const steps = INACTION_STEPS(lang);

  return (
    <div style={{
      background: darkMode ? C.bg : C.bgLight,
      border: `1px solid ${darkMode ? C.border : C.borderLight}`,
      borderRadius: 12,
      padding: '10px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
            color: darkMode ? C.red : '#B5481A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {lang === 'uk' ? '⚠ Ціна бездіяльності' : '⚠ Cost of Inaction'}
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10,
            color: darkMode ? C.muted : C.mutedLight, marginTop: 1 }}>
            {lang === 'uk'
              ? '3.9M потребують → 260K отримали (0.41%) · WHO + НСЗУ + WB ISR'
              : '3.9M need → 260K reached (0.41%) · WHO + NHSU + WB ISR'}
          </div>
        </div>
        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {([
            { id: 'timeline' as Tab, label: { uk: 'Динаміка', en: 'Timeline' } },
            { id: 'chain' as Tab,    label: { uk: 'Ланцюг', en: 'Chain' } },
            { id: 'funnel' as Tab,   label: { uk: 'Воронка', en: 'Funnel' } },
            { id: 'waterfall' as Tab, label: { uk: 'ROI', en: 'ROI' } },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: 'DM Mono, monospace', fontSize: 10,
              padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
              background: tab === t.id
                ? (darkMode ? 'rgba(0,212,170,0.15)' : 'rgba(44,110,127,0.1)')
                : 'transparent',
              border: `1px solid ${tab === t.id
                ? (darkMode ? 'rgba(0,212,170,0.5)' : 'rgba(44,110,127,0.3)')
                : (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(18,60,58,0.1)')}`,
              color: tab === t.id
                ? (darkMode ? C.green : '#2C6E7F')
                : (darkMode ? C.muted : C.mutedLight),
              transition: 'all 0.15s',
              minHeight: 44,
              minWidth: 44,
            }}>
              {t.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab: Timeline ── */}
      {tab === 'timeline' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            {[
              { color: C.green,  dash: '',         label: { uk: 'Гілка 1: FEEL Again',         en: 'Path 1: FEEL Again'       } },
              { color: C.yellow, dash: '5 3',      label: { uk: 'Гілка 2: Часткові зусилля',   en: 'Path 2: Partial effort'   } },
              { color: C.red,    dash: '3 3',      label: { uk: 'Гілка 3: Бездіяльність',      en: 'Path 3: Inaction'         } },
            ].map(l => (
              <div key={l.color} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="20" height="6" style={{ flexShrink: 0 }}>
                  <line x1="0" y1="3" x2="20" y2="3" stroke={l.color} strokeWidth="2.5"
                    strokeDasharray={l.dash} strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 10,
                  color: darkMode ? C.muted : C.mutedLight }}>{l.label[lang]}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={isMobile ? 140 : 200}>
            <AreaChart data={TIMELINE} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                {[['ga', C.green], ['gb', C.yellow], ['gc', C.red]].map(([id, color]) => (
                  <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(18,60,58,0.08)'} />
              <XAxis dataKey="m" tick={{ fontSize: 8, fill: darkMode ? C.muted : C.mutedLight, fontFamily: 'DM Mono, monospace' }}
                tickFormatter={v => v === 0 ? '0' : v === 18 ? (lang === 'uk' ? '18м' : '18m') : v === 36 ? (lang === 'uk' ? '36м' : '36m') : ''}
                interval={0} />
              <YAxis tick={{ fontSize: 8, fill: darkMode ? C.muted : C.mutedLight, fontFamily: 'DM Mono, monospace' }}
                tickFormatter={v => `${v}B`} />
              <ReferenceLine y={0} stroke={darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(18,60,58,0.15)'} strokeDasharray="4 4" />
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
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: C.green }}>
              {lang === 'uk' ? 'Дельта: +$15.5B за 36 міс' : 'Delta: +$15.5B over 36 mo'}
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: C.red }}>
              {lang === 'uk' ? 'Колапс: ~24 міс без дій' : 'Collapse: ~24 mo without action'}
            </span>
          </div>
        </motion.div>
      )}

      {/* ── Tab: Sequential Inaction Chain ── */}
      {tab === 'chain' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Sequential steps */}
          {steps.map((step, i) => (
            <SequentialStep
              key={i}
              step={step}
              index={i}
              isActive={i <= activeStep}
              darkMode={darkMode}
              lang={lang}
            />
          ))}
          {/* Summary bar */}
          <div style={{
            marginTop: 4, padding: '6px 8px', borderRadius: 6,
            background: darkMode ? 'rgba(255,123,110,0.08)' : 'rgba(181,72,26,0.06)',
            border: `1px solid ${darkMode ? 'rgba(255,123,110,0.2)' : 'rgba(181,72,26,0.15)'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(18,60,58,0.7)' }}>
                {lang === 'uk'
                  ? 'Без втручання: 15% інвалідизація = $546.75M на 100K осіб'
                  : 'Without intervention: 15% disability = $546.75M per 100K people'}
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: C.red, fontWeight: 700 }}>
                {lang === 'uk' ? '1:200 співвідношення' : '1:200 ratio'}
              </div>
            </div>
          </div>
          {/* Source note */}
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9,
            color: darkMode ? C.muted : C.mutedLight, marginTop: 2 }}>
            {lang === 'uk'
              ? 'Джерела: WHO/NICE · НСЗУ Пакет №2 · Policy Paper актуарні розрахунки'
              : 'Sources: WHO/NICE · NHSU Package №2 · Policy Paper actuarial calculations'}
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
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 14, color: step.color }}>
                {step.stage[lang]}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9,
                color: darkMode ? C.muted : C.mutedLight, marginTop: 1 }}>
                {step.caption[lang]}
              </div>
            </div>
            {/* Center: bar + detail */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ height: 8, borderRadius: 4,
                background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(18,60,58,0.06)',
                marginBottom: 4, overflow: 'hidden' }}>
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
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(18,60,58,0.7)' }}>
                {step.detail[lang]}
              </div>
            </div>
            {/* Right: verify status */}
            <div style={{
              flexShrink: 0, textAlign: 'center',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10,
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
        <div style={{ textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: 9,
          color: darkMode ? C.muted : C.mutedLight, marginTop: 2 }}>
          {lang === 'uk'
            ? '9.6M → 3.9M → 260K: каскад потреби · HCI 0.63 · 0.41% покриття'
            : '9.6M → 3.9M → 260K: need cascade · HCI 0.63 · 0.41% coverage'}
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
            <div style={{ width: '100%', flexShrink: 0, fontFamily: 'DM Sans, sans-serif', fontSize: 10,
              color: darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(18,60,58,0.75)' }}>
              {row.label}
            </div>
            {/* Bar */}
            <div style={{ flex: 1, height: 20,
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(18,60,58,0.05)',
              borderRadius: 4, overflow: 'hidden' }}>
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
            <div style={{ width: 52, textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: 10,
              color: darkMode ? C.muted : C.mutedLight }}>
              {row.invest}
            </div>
            {/* Result */}
            <div style={{ width: 64, textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 12, color: row.color }}>
              {row.result}
            </div>
            {/* ROI badge */}
            <div style={{
              width: 52, textAlign: 'center', flexShrink: 0,
              background: `${row.color}18`, border: `1px solid ${row.color}44`,
              borderRadius: 5, padding: '2px 4px',
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: row.color,
            }}>
              {row.roi}
            </div>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(18,60,58,0.08)'}`,
          paddingTop: 6, fontFamily: 'DM Mono, monospace', fontSize: 9,
          color: darkMode ? C.muted : C.mutedLight }}>
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