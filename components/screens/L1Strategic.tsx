import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';
import { Logo } from '../ui/Logo';
import { STRATEGIC_FRAMEWORK, MHEI_VALUE_CHAIN, COLORS } from '../../constants';
import { useDrilldown } from '../drilldown/DrilldownContext';
import { InactionFunnel } from './InactionFunnel';

interface Props {
  lang: Language;
  nav: ScreenNav;
  liveHciValue?: number | null;
  darkMode?: boolean;
}

// Mobile breakpoint detection
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

type LayerId = 'needs' | 'capital' | 'finance' | 'coverage';

interface LayerDef {
  id: LayerId;
  screenId: ScreenId;
  weight: number;
  current: number;
  target: number;
  color: string;
  glow: string;
  cardBg: string;
}

// MHEI recalculated (2026-07-14): real crisis-level scores
// Coverage: 260K sessions / 62.4M needed = 0.41% → score 2
// Capital: ~1,400 clinical psychologists/psychotherapists (Compendium May 2026 forecast)
//   vs 3.9M people needing care → 0.036% capacity → score 5
//   Formula: (3.9M × 5 sessions) / (1,400 × 1,000 hrs/yr ÷ 2 hrs/session) = 69:1 gap
// Finance: $175M locked (HEAL C4 $41.1M + THRIVE $134M), $8B/yr GDP loss → score 12
// Needs: 3.9M identified but only 260K reached system → score 8
const PILLARS_CONFIG: LayerDef[] = [
  { id: 'needs',    screenId: 'l2-operational', weight: 25, current: 8,  target: 100, color: '#A855F7', glow: 'rgba(168,85,247,0.22)', cardBg: 'rgba(168,85,247,0.07)' },
  { id: 'capital',  screenId: 'l2-clinical',    weight: 25, current: 5,  target: 100, color: '#3B82F6', glow: 'rgba(59,130,246,0.22)', cardBg: 'rgba(59,130,246,0.07)' },
  { id: 'finance',  screenId: 'l2-finance',     weight: 25, current: 12, target: 100, color: '#EF4444', glow: 'rgba(239,68,68,0.22)',  cardBg: 'rgba(239,68,68,0.07)' },
  { id: 'coverage', screenId: 'l2-sustain',     weight: 25, current: 2,  target: 100, color: '#10B981', glow: 'rgba(16,185,129,0.22)', cardBg: 'rgba(16,185,129,0.07)' },
];

const INDEX_SCORE = Math.round(
  PILLARS_CONFIG.reduce((sum, l) => sum + Math.min(100, (l.current / l.target) * 100) * (l.weight / 100), 0)
); // → 7 (Crisis-level stagnation)

// HCI (Human Capital Index) - World Bank 2020
const HCI_VALUE = 0.63;

// HEAL/THRIVE undisbursed — verified 2026-07-14
const HEAL_UNDISBURSED = 41100000;    // $41.1M — HEAL Component 4 (NBU Brief v14)
const THRIVE_UNDISBURSED = 134000000; // $134M — THRIVE DLI awaiting (NBU Brief v14)
const TOTAL_UNDISBURSED = HEAL_UNDISBURSED + THRIVE_UNDISBURSED; // ~$175M

type Band = 'low' | 'medium' | 'high';
const scoreToBand = (s: number): Band => s < 34 ? 'low' : s < 67 ? 'medium' : 'high';
const BAND_COLOR: Record<Band, string> = { low: '#ff7b6e', medium: '#E3A22E', high: '#00d4aa' };
const BAND_LABEL: Record<Band, { uk: string; en: string }> = {
  low:    { uk: 'Кризова стагнація', en: 'Crisis stagnation' },
  medium: { uk: 'Регульоване плато', en: 'Managed plateau' },
  high:   { uk: 'Стійке відновлення', en: 'Sustained recovery' },
};

const currentBand = scoreToBand(INDEX_SCORE);

// GDP causal chain footer items (verified 2026-07-14)
const GDP_CHAIN = [
  {
    val: '260K',
    label: { uk: 'НСЗУ пацієнтів 2025', en: 'NHSU patients 2025' },
    source: { uk: 'НСЗУ відкриті дані 2025', en: 'NHSU open data 2025' },
    arrow: true,
  },
  {
    val: '0.41%',
    label: { uk: 'покриття потреби', en: 'need coverage' },
    source: { uk: '260K / 62.4M сесій (WHO)', en: '260K / 62.4M sessions (WHO)' },
    arrow: true,
  },
  {
    val: '$8B/рік ⚠️',
    label: { uk: 'ВВП-втрати', en: 'GDP losses' },
    source: { uk: 'WHO/RDNA3 оцінка ⚠️', en: 'WHO/RDNA3 estimate ⚠️' },
    arrow: true,
  },
  {
    val: 'HCI 0.63',
    label: { uk: 'Human Capital Index', en: 'Human Capital Index' },
    source: { uk: 'World Bank 2020', en: 'World Bank 2020' },
    arrow: false,
  },
];

// ── Elevator gauge geometry ────────────────────────────────────────────────────
// Score 0 = left (B / Crisis), Score 100 = right (R / Recovery)
// Semicircle from left (180°) over the top to right (0°) in SVG screen space.
const EL_CX = 140, EL_CY = 135, EL_R = 100;

// Convert score 0-100 → {x,y} on a circle of radius r centred at (EL_CX, EL_CY)
const ePt = (s: number, r: number) => {
  const a = Math.PI * (1 - s / 100); // π (left) → 0 (right)
  return { x: EL_CX + r * Math.cos(a), y: EL_CY - r * Math.sin(a) };
};

// SVG arc path from score s0 → s1 at radius r, clockwise (= over the top)
const eArc = (r: number, s0: number, s1: number) => {
  const p0 = ePt(s0, r), p1 = ePt(s1, r);
  const deg = Math.abs(s1 - s0) * 1.8;
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 ${deg >= 180 ? 1 : 0} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
};

// ── Elevator "floors" ─────────────────────────────────────────────────────────
const FLOORS = [
  { label: '0',   score: 0   },
  { label: '10',  score: 10  },
  { label: '20',  score: 20  },
  { label: '30',  score: 30  },
  { label: '40',  score: 40  },
  { label: '50',  score: 50  },
  { label: '60',  score: 60  },
  { label: '70',  score: 70  },
  { label: '80',  score: 80  },
  { label: '90',  score: 90  },
  { label: '100', score: 100 },
] as const;

// Fan zones: each LAYER occupies a slice of the arc proportional to its weight
let _cur = 0;
const LAYER_ZONES = PILLARS_CONFIG.map(l => {
  const z = { layer: l, start: _cur, end: _cur + l.weight };
  _cur += l.weight;
  return z;
});

// GDP impact formula: −3.5 % at score=0, +5.5 % at score=100
// (WHO/WB: 1 % GDP in MH → 2–4 % GDP return; untreated disorders cost 3–5 % GDP/yr)
const gdpImpact = (score: number) => {
  const v = (score / 100) * 9.0 - 3.5;
  return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
};

// ── Elevator Gauge component ──────────────────────────────────────────────────
const GaugeDisplay: React.FC<{ lang: Language; expanded: boolean; onToggle: () => void }> = ({ lang, expanded, onToggle }) => {
  const CX = EL_CX, CY = EL_CY, R = EL_R;
  const bandColor = BAND_COLOR[currentBand];
  // Compute needle tip directly on the arc — no SVG rotation needed
  const needleTip = ePt(INDEX_SCORE, R - 18);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* ── Elevator SVG dial ── */}
      <div onClick={onToggle} style={{ cursor: 'pointer', width: '100%' }}>
        <svg viewBox="0 0 280 158" width="100%" style={{ display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="mhei-brass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#7a5218" />
              <stop offset="30%"  stopColor="#E3A22E" />
              <stop offset="65%"  stopColor="#C9B36A" />
              <stop offset="100%" stopColor="#5a3a08" />
            </linearGradient>
          </defs>

          {/* Dark semicircle dial face */}
          <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY} Z`}
            fill="rgba(6,4,2,0.93)" />

          {/* Zone background tints: Crisis / Transition / Recovery */}
          <path d={eArc(R - 16, 0,  33)}  fill="none" stroke="#ff7b6e" strokeWidth="28" opacity="0.18" />
          <path d={eArc(R - 16, 33, 67)}  fill="none" stroke="#E3A22E" strokeWidth="28" opacity="0.18" />
          <path d={eArc(R - 16, 67, 100)} fill="none" stroke="#00d4aa" strokeWidth="28" opacity="0.18" />

          {/* Fan lines from pivot — one group per layer, width proportional to weight */}
          {LAYER_ZONES.map(({ layer: l, start, end }) => {
            const count = Math.max(2, Math.round((end - start) / 4.5));
            return Array.from({ length: count }, (_, k) => {
              const s = start + ((k + 0.5) / count) * (end - start);
              const tip = ePt(s, R - 28);
              return (
                <line key={`fan-${l.id}-${k}`}
                  x1={CX} y1={CY} x2={tip.x.toFixed(2)} y2={tip.y.toFixed(2)}
                  stroke={l.color} strokeWidth="1.2" opacity="0.28"
                />
              );
            });
          })}

          {/* Progress arc filled to current score */}
          <path d={eArc(R - 16, 0, INDEX_SCORE)} fill="none"
            stroke={bandColor} strokeWidth="28" opacity="0.88" strokeLinecap="round" />

          {/* Inner ornamental ring */}
          <path d={eArc(R - 30, 0, 100)} fill="none" stroke="rgba(200,164,92,0.18)" strokeWidth="1" />

          {/* Outer brass frame arc + base line */}
          <path d={eArc(R + 5, 0, 100)} fill="none" stroke="url(#mhei-brass)" strokeWidth="7" />
          <line x1={CX - R - 7} y1={CY} x2={CX + R + 7} y2={CY}
            stroke="url(#mhei-brass)" strokeWidth="3.5" />

          {/* Floor tick marks + labels */}
          {FLOORS.map(({ label, score }) => {
            const isEnd = label === '0' || label === '100';
            const lit   = score <= INDEX_SCORE;
            const outer = ePt(score, R + 3);
            const inner = ePt(score, R - 10);
            const lp    = ePt(score, R + 18);
            return (
              <g key={label}>
                <line
                  x1={outer.x.toFixed(1)} y1={outer.y.toFixed(1)}
                  x2={inner.x.toFixed(1)} y2={inner.y.toFixed(1)}
                  stroke={lit ? '#E3A22E' : 'rgba(200,164,92,0.25)'}
                  strokeWidth={isEnd ? 2.5 : 1.5}
                />
                <text x={lp.x.toFixed(1)} y={(lp.y + 4).toFixed(1)}
                  textAnchor="middle" dominantBaseline="central"
                  style={{
                    fontFamily: 'Archivo Black, sans-serif',
                    fontSize: isEnd ? '10px' : '8px',
                    fontWeight: '700',
                    fill: lit ? '#E3A22E' : 'rgba(200,164,92,0.28)',
                  }}>
                  {label}
                </text>
              </g>
            );
          })}

          {/* Needle — static computed from ePt, no rotation needed */}
          <line x1={CX} y1={CY} x2={needleTip.x.toFixed(2)} y2={needleTip.y.toFixed(2)}
            stroke={bandColor} strokeWidth="2.5" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${bandColor}cc)`, transition: 'all 0.6s ease' } as React.CSSProperties}
          />
          {/* Counterweight */}
          <line x1={CX} y1={CY} x2={CX - 14} y2={CY}
            stroke={bandColor} strokeWidth="5" strokeLinecap="round" opacity="0.4"
          />

          {/* Centre pivot — ornamental brass ring + glow dot */}
          <circle cx={CX} cy={CY} r="14" fill="#0f0803" stroke="url(#mhei-brass)" strokeWidth="2.5" />
          <circle cx={CX} cy={CY} r="5" fill={bandColor}
            style={{ filter: `drop-shadow(0 0 12px ${bandColor}cc)` }} />
        </svg>
      </div>

      {/* ── Score + band + GDP ── */}
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <div style={{ fontFamily: 'Archivo Black, sans-serif', fontWeight: 900, fontSize: 46,
          color: bandColor, lineHeight: 1, textShadow: `0 0 32px ${bandColor}77` }}>
          {INDEX_SCORE}
        </div>
        <div style={{ fontFamily: 'Archivo Black, sans-serif', fontWeight: 700, fontSize: 13,
          color: bandColor, marginTop: 4 }}>
          {BAND_LABEL[currentBand][lang]}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#E3A22E',
          opacity: 0.75, marginTop: 3, letterSpacing: '0.06em' }}>
          {gdpImpact(INDEX_SCORE)} {lang === 'uk' ? 'ВВП' : 'GDP'}
        </div>
        <div style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 9,
          color: 'var(--color-ds-muted)', marginTop: 2, lineHeight: 1.4 }}>
          {lang === 'uk' ? 'реальний стан системи MHPSS' : 'actual MHPSS system state'}
        </div>
      </div>

      {/* ── Expand toggle ── */}
      <button
        onClick={onToggle}
        style={{ marginTop: 8, fontFamily: 'Source Sans 3, sans-serif', fontSize: 9,
          color: bandColor, background: 'none',
          border: `1px solid ${bandColor}44`, borderRadius: 6,
          padding: '3px 14px', cursor: 'pointer' }}
      >
        {expanded
          ? (lang === 'uk' ? '↑ згорнути' : '↑ collapse')
          : (lang === 'uk' ? '↓ розклад індексу' : '↓ index breakdown')}
      </button>

      {/* ── Expandable breakdown ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', width: '100%', paddingTop: 12 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {STRATEGIC_FRAMEWORK(lang).map((p, i) => {
                const config = PILLARS_CONFIG.find(c => c.id === p.id)!;
                const pct = Math.min(100, (config.current / config.target) * 100);
                return (
                  <div key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'Archivo Black, sans-serif', fontWeight: 700,
                        fontSize: 11, color: config.color }}>
                        {p.label[lang]}
                      </span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                        color: 'var(--color-ds-muted)' }}>
                        {Math.round(pct)}% · w{config.weight}%
                      </span>
                    </div>
                    <div style={{ height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.05 + i * 0.07, duration: 0.55 }}
                        style={{ height: '100%', borderRadius: 4, background: config.color,
                          boxShadow: `0 0 8px ${config.color}55` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main screen ────────────────────────────────────────────────────────────────
export const L1Strategic: React.FC<Props> = ({ lang, nav, liveHciValue, darkMode = true }) => {
  const { setAnswers: setDrillAnswers } = useDrilldown();
  const isMobile = useMobile();

  // Bloomberg-style KPI data with bars + arrows (DS screenshot 7,8)
  const KPI_DATA = [
    { id: 'needs',    label: { uk: 'Потреба', en: 'Need' }, val: '3.9M', sub: { uk: '+12% vs 2023', en: '+12% vs 2023' }, bars: 4, arrow: 'up' as const, color: 'var(--color-ds-teal)', nav: 'l2-operational' },
    { id: 'capital',  label: { uk: 'Спроможність', en: 'Capacity' }, val: '38%', sub: { uk: 'від потреби закрито', en: 'of need covered' }, bars: 2, arrow: 'up' as const, color: 'var(--color-ds-teal)', nav: 'l2-clinical' },
    { id: 'finance',  label: { uk: 'ВВП-втрати / рік', en: 'GDP Loss / yr' }, val: '$8B', sub: { uk: 'WHO методологія', en: 'WHO methodology' }, bars: 5, arrow: 'up' as const, color: 'var(--color-ds-orange)', nav: 'l2-finance' },
    { id: 'roi',      label: { uk: 'ROI програми', en: 'Programme ROI' }, val: '1→4.5×', sub: { uk: 'за 5 років', en: 'over 5 years' }, bars: 4, arrow: 'up' as const, color: 'var(--color-ds-gold)', nav: 'l4' },
    { id: 'gap',      label: { uk: 'GAP (collision)', en: 'GAP (collision)' }, val: '62%', sub: { uk: 'незакрита потреба ⚡', en: 'unmet need ⚡' }, bars: 4, arrow: 'up' as const, color: 'var(--color-ds-orange)', nav: 'l2-analytical' },
  ];

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{
        background: darkMode
          ? 'linear-gradient(180deg, #050C16 0%, #0a1628 100%)'
          : 'var(--color-ds-bg)',
      }}
    >
      {/* ── Header — DS Bunker style with tabs ── */}
      <div className="flex-shrink-0" style={{
        background: darkMode ? 'rgba(5,12,22,0.95)' : 'rgba(233,222,201,0.95)',
        borderBottom: `1px solid ${darkMode ? 'rgba(28,90,82,0.25)' : '#C9B591'}`,
      }}>
        <div className="flex items-center justify-between px-4 pt-2 pb-0">
          {/* Logo + nav tabs */}
          <div className="flex items-center gap-6">
            <Logo darkMode={darkMode} />
            {/* Tab navigation — DS screenshot 8 */}
            <div className="flex items-center gap-1">
              {([
                { id: 'l1' as ScreenId, label: lang === 'uk' ? 'ЛАНДШАФТ' : 'LANDSCAPE' },
                { id: 'l2-data' as ScreenId, label: 'DIGITAL BUS' },
                { id: 'l2-clinical' as ScreenId, label: lang === 'uk' ? 'СИМУЛЯЦІЯ' : 'SIMULATION' },
                { id: 'l2-finance' as ScreenId, label: 'DLI ТРЕКЕР' },
              ]).map(t => (
                <button
                  key={t.id}
                  onClick={() => nav.push(t.id)}
                  style={{
                    fontFamily: 'Archivo Black, sans-serif', fontWeight: 500, fontSize: 11,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '6px 12px', cursor: 'pointer',
                    color: t.id === 'l1'
                      ? (darkMode ? 'var(--color-ds-gold)' : 'var(--color-ds-orange)')
                      : 'var(--color-ds-muted)',
                    background: 'transparent',
                    borderBottom: t.id === 'l1'
                      ? `2px solid ${darkMode ? 'var(--color-ds-gold)' : 'var(--color-ds-orange)'}`
                      : '2px solid transparent',
                    border: 'none', borderBottomWidth: 2, borderBottomStyle: 'solid',
                    borderBottomColor: t.id === 'l1'
                      ? (darkMode ? 'var(--color-ds-gold)' : 'var(--color-ds-orange)')
                      : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right side — Signal Lamp LIVE + ALERT */}
          <div className="flex items-center gap-3">
            {/* Signal Lamp — DS screenshot 10 */}
            <button
              onClick={() => nav.push('l2-analytical')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'Archivo Black, sans-serif', fontWeight: 700, fontSize: 11,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: darkMode ? 'var(--color-ds-gold)' : 'var(--color-ds-orange)',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(250,176,7,0.15) 0%, rgba(201,179,106,0.08) 100%)'
                  : 'rgba(181,72,26,0.08)',
                border: `1px solid ${darkMode ? 'rgba(250,176,7,0.35)' : 'rgba(181,72,26,0.25)'}`,
                borderRadius: 6, padding: '5px 14px', cursor: 'pointer',
                boxShadow: darkMode ? '0 0 12px rgba(250,176,7,0.15)' : 'none',
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: darkMode ? '#FAB007' : '#B5481A',
                boxShadow: darkMode ? '0 0 8px #FAB007' : 'none',
                animation: 'pulse 2s infinite',
              }} />
              LIVE
            </button>
            {/* ALERT badge */}
            <button
              onClick={() => nav.push('l2-analytical')}
              style={{
                fontFamily: 'Archivo Black, sans-serif', fontWeight: 700, fontSize: 11,
                letterSpacing: '0.08em',
                color: 'var(--color-ds-red)',
                background: darkMode ? 'rgba(205,57,26,0.1)' : 'rgba(138,32,24,0.06)',
                border: `1px solid ${darkMode ? 'rgba(205,57,26,0.3)' : 'rgba(138,32,24,0.2)'}`,
                borderRadius: 6, padding: '5px 12px', cursor: 'pointer',
              }}
            >
              ALERT 3
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI Strip — Bloomberg inline style (DS screenshots 6,7,8) ── */}
      <div className="flex-shrink-0 px-4 pt-3 pb-1">
        <div style={{
          display: 'flex', gap: 0,
          background: darkMode
            ? 'linear-gradient(90deg, #0C293A 0%, #0B2422 100%)'
            : 'rgba(255,255,255,0.8)',
          borderRadius: 6, overflow: 'hidden',
          border: `1px solid ${darkMode ? '#C9B36A' : '#C9B591'}`,
          boxShadow: darkMode ? '0 0 12px rgba(201,179,106,0.08)' : 'none',
        }}>
          {KPI_DATA.map((kpi, i, arr) => (
            <div
              key={kpi.id}
              onClick={() => { setDrillAnswers({ pillarId: kpi.id }); nav.push(kpi.nav); }}
              style={{
                flex: 1, padding: '10px 14px',
                borderRight: i < arr.length - 1 ? `1px solid ${darkMode ? 'rgba(28,90,82,0.12)' : 'rgba(18,60,58,0.08)'}` : 'none',
                cursor: 'pointer', transition: 'background 0.15s', minWidth: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = darkMode ? 'rgba(28,90,82,0.08)' : 'rgba(18,60,58,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Label */}
              <div style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 10, letterSpacing: '0.08em',
                color: 'var(--color-ds-muted)', marginBottom: 4, textTransform: 'uppercase' }}>
                {kpi.label[lang]}
              </div>
              {/* Bloomberg row: bars + value + arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Signal bars (palichky) */}
                <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{
                      width: 3, borderRadius: 1,
                      height: `${(n / 5) * 100}%`,
                      background: n <= kpi.bars
                        ? (kpi.bars >= 5 ? 'var(--color-ds-gold)' : kpi.bars >= 4 ? 'var(--color-ds-orange)' : 'var(--color-ds-teal)')
                        : (darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(18,60,58,0.1)'),
                    }} />
                  ))}
                </div>
                {/* Value */}
                <span style={{
                  fontFamily: 'Archivo Black, sans-serif', fontWeight: 300,
                  fontSize: 'clamp(20px, 2.8vw, 32px)', lineHeight: 1,
                  color: kpi.color, fontVariantNumeric: 'tabular-nums',
                }}>
                  {kpi.val}
                </span>
                {/* Arrow triangle */}
                <span style={{
                  fontSize: 10, lineHeight: 1,
                  color: kpi.arrow === 'up' ? 'var(--color-ds-orange)' : 'var(--color-ds-teal)',
                }}>
                  {kpi.arrow === 'up' ? '▲' : '▼'}
                </span>
              </div>
              {/* Sub text */}
              <div style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', marginTop: 3 }}>
                {kpi.sub[lang]}
              </div>
              {/* Progress bar */}
              <div style={{ height: 2, borderRadius: 1, marginTop: 4,
                background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(18,60,58,0.08)' }}>
                <div style={{ height: '100%', borderRadius: 1, width: `${kpi.bars * 20}%`,
                  background: kpi.color, opacity: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body: Gauge + InactionFunnel ── */}
      <div className="flex-1 min-h-0 flex flex-col px-4 pb-1 gap-3">
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">

          {/* MHEI Gauge — Bunker card style */}
          <div
            className="w-full lg:w-[280px] flex-shrink-0 flex flex-col items-center justify-center py-2 cursor-pointer"
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, #0C293A 0%, #0B2422 100%)'
                : 'rgba(255,255,255,0.8)',
              border: `1px solid ${darkMode ? '#C9B36A' : '#C9B591'}`,
              borderRadius: 8,
              boxShadow: darkMode ? '0 0 20px rgba(201,179,106,0.12)' : 'none',
            }}
            onClick={() => nav.push('l4')}
          >
            <div style={{
              fontFamily: 'Archivo Black, sans-serif', fontWeight: 700, fontSize: 11,
              color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.12em',
              textAlign: 'center', marginBottom: 2,
            }}>
              Mental Health Economy Index
            </div>

            <GaugeDisplay lang={lang} expanded={false} onToggle={() => nav.push('l4')} />

            <button
              onClick={() => nav.push('l4')}
              style={{ marginTop: 8, fontSize: 11, fontFamily: 'Archivo Black, sans-serif', fontWeight: 600,
                color: darkMode ? 'var(--color-ds-gold)' : 'var(--color-ds-orange)',
                border: `1px solid ${darkMode ? 'rgba(250,176,7,0.3)' : 'rgba(181,72,26,0.25)'}`,
                borderRadius: 6, padding: '5px 14px',
                background: darkMode ? 'rgba(250,176,7,0.07)' : 'rgba(181,72,26,0.06)',
                cursor: 'pointer', letterSpacing: '0.05em' }}
            >
              {lang === 'uk' ? '→ Повний звіт' : '→ Full Report'}
            </button>
          </div>

          {/* Right side — InactionFunnel */}
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <InactionFunnel lang={lang} darkMode={darkMode} />
          </div>
        </div>
      </div>

      {/* ── Footer — DS sources + disclaimers ── */}
      <div
        className="flex-shrink-0 px-6 py-2 flex items-center gap-4 flex-wrap"
        style={{
          borderTop: `1px solid ${darkMode ? 'rgba(28,90,82,0.2)' : '#C9B591'}`,
          background: darkMode ? 'rgba(5,12,22,0.6)' : 'rgba(233,222,201,0.6)',
        }}
      >
        <span style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)' }}>
          {lang === 'uk' ? 'Джерела: WHO · World Bank · МОЗ України · LSE · Feel Again 2025' : 'Sources: WHO · World Bank · MoH Ukraine · LSE · Feel Again 2025'}
        </span>
        <div className="flex-1" />
        {/* Role legend — DS screenshot 8 */}
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { color: 'var(--color-ds-teal)', label: lang === 'uk' ? 'Синій — ресурси / donors' : 'Blue — resources / donors' },
            { color: 'var(--color-ds-teal-light)', label: lang === 'uk' ? 'Тіал — providers' : 'Teal — providers' },
            { color: 'var(--color-ds-orange)', label: lang === 'uk' ? 'Оранж — GAP / operational' : 'Orange — GAP / operational' },
            { color: 'var(--color-ds-gold)', label: lang === 'uk' ? 'Золото — ROI / outcome' : 'Gold — ROI / outcome' },
            { color: 'var(--color-ds-red)', label: lang === 'uk' ? 'Червоний — collision (<2%)' : 'Red — collision (<2%)' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 4, background: r.color, borderRadius: 1 }} />
              <span style={{ fontFamily: 'Source Sans 3, sans-serif', fontSize: 8, color: 'var(--color-ds-muted)' }}>{r.label}</span>
            </div>
          ))}
        </div>
        <div className="flex-1" />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--color-ds-muted)' }}>
          © 2026 FEEL Again · dashboard.feelagain.me
        </span>
      </div>
    </div>
  );
};
