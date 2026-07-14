import React, { useState, useEffect, useRef } from 'react';
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

// SVG rotation for animated needle: 180° at score=0 (left), 0° at score=100 (right)
const eNeedleAngle = (s: number) => 180 - s * 1.8;

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
  const needleRef = useRef<SVGGElement>(null);

  // Animate needle via SVG transform attr (CSS rotate(a,cx,cy) is invalid CSS)
  useEffect(() => {
    const ctrl = animate(eNeedleAngle(0), eNeedleAngle(INDEX_SCORE), {
      duration: 1.8, delay: 0.4,
      ease: [0.34, 1.56, 0.64, 1],
      onUpdate: v => needleRef.current?.setAttribute('transform', `rotate(${v.toFixed(3)},${CX},${CY})`),
    });
    return () => ctrl.stop();
  }, []);

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
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: isEnd ? '10px' : '8px',
                    fontWeight: '700',
                    fill: lit ? '#E3A22E' : 'rgba(200,164,92,0.28)',
                  }}>
                  {label}
                </text>
              </g>
            );
          })}

          {/* Needle (animated, points from pivot to current score position) */}
          <g ref={needleRef}>
            <line x1={CX} y1={CY - 4} x2={CX + R - 15} y2={CY - 4}
              stroke={bandColor} strokeWidth="2.5" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${bandColor}cc)` } as React.CSSProperties}
            />
            {/* Counterweight */}
            <line x1={CX} y1={CY - 4} x2={CX - 18} y2={CY - 4}
              stroke={bandColor} strokeWidth="5.5" strokeLinecap="round" opacity="0.45"
            />
          </g>

          {/* Centre pivot — ornamental brass ring + glow dot */}
          <circle cx={CX} cy={CY} r="14" fill="#0f0803" stroke="url(#mhei-brass)" strokeWidth="2.5" />
          <circle cx={CX} cy={CY} r="5" fill={bandColor}
            style={{ filter: `drop-shadow(0 0 12px ${bandColor}cc)` }} />
        </svg>
      </div>

      {/* ── Score + band + GDP ── */}
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900, fontSize: 46,
          color: bandColor, lineHeight: 1, textShadow: `0 0 32px ${bandColor}77` }}>
          {INDEX_SCORE}
        </div>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13,
          color: bandColor, marginTop: 4 }}>
          {BAND_LABEL[currentBand][lang]}
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#E3A22E',
          opacity: 0.75, marginTop: 3, letterSpacing: '0.06em' }}>
          {gdpImpact(INDEX_SCORE)} {lang === 'uk' ? 'ВВП' : 'GDP'}
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9,
          color: 'var(--color-ds-muted)', marginTop: 2, lineHeight: 1.4 }}>
          {lang === 'uk' ? 'реальний стан системи MHPSS' : 'actual MHPSS system state'}
        </div>
      </div>

      {/* ── Expand toggle ── */}
      <button
        onClick={onToggle}
        style={{ marginTop: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 9,
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
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                        fontSize: 11, color: config.color }}>
                        {p.label[lang]}
                      </span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11,
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

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{
        background: darkMode
          ? 'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(0,210,170,0.10) 0%, transparent 55%), ' +
            'radial-gradient(ellipse 60% 50% at 80% 40%, rgba(0,180,200,0.07) 0%, transparent 50%), ' +
            'linear-gradient(135deg, #0a1628 0%, #1a0a0a 100%)'
          : 'var(--color-ds-bg)',
      }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #00d4aa 30%, #2ec4b6 60%, rgba(200,164,92,0.7) 100%)', boxShadow: '0 0 20px rgba(0,212,170,0.55)' }} />

      {/* ── Header ── */}
      <div className="flex items-center justify-between pl-6 pr-32 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Logo darkMode={darkMode} />
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono mb-0.5" style={{ color: 'var(--color-ds-muted)' }}>
              <span style={{ color: 'var(--color-ds-gold)' }}>FEEL Again</span>
              <span>·</span>
              <span>MHPSS Ukraine</span>
              <span>·</span>
              <span style={{ color: 'var(--color-ds-text)' }}>{lang === 'uk' ? 'ЛАНДШАФТ' : 'LANDSCAPE'}</span>
            </div>
            <div className="text-[17px] font-bold ds-display leading-tight" style={{ color: 'var(--color-ds-text)' }}>
              {lang === 'uk' ? 'Ідеальний шторм — поточний ландшафт MHPSS' : 'Perfect Storm — Current MHPSS Sector Landscape'}
            </div>
          </div>
        </div>
        {/* API status dot — links to l2-analytical */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => nav.push('l2-journey')}
            className="text-[10px] ds-display font-medium px-2 py-1 rounded"
            style={{ color: 'var(--color-ds-muted)', border: '1px solid var(--color-ds-border)', cursor: 'pointer' }}
          >
            {lang === 'uk' ? 'Стейкхолдери' : 'Stakeholders'}
          </button>
          <button
            onClick={() => nav.push('appendix')}
            className="text-[10px] ds-display font-medium px-2 py-1 rounded"
            style={{ color: 'var(--color-ds-muted)', border: '1px solid var(--color-ds-border)', cursor: 'pointer' }}
          >
            {lang === 'uk' ? 'Звіт' : 'Report'}
          </button>
          <button
            onClick={() => nav.push('l4')}
            className="text-[10px] ds-display font-bold px-2 py-1 rounded"
            style={{ background: 'color-mix(in srgb, var(--color-ds-teal) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--color-ds-teal) 35%, transparent)', color: 'var(--color-ds-teal)', cursor: 'pointer' }}
          >
            {lang === 'uk' ? 'Повний звіт' : 'Full Report'}
          </button>
          <button
            onClick={() => nav.push('l2-analytical')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'DM Mono, monospace', fontSize: 10,
              color: 'rgba(0,210,170,0.7)',
              background: 'rgba(0,210,170,0.06)',
              border: '1px solid rgba(0,210,170,0.2)',
              borderRadius: 6, padding: '3px 10px', cursor: 'pointer',
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: '#00d4aa', boxShadow: '0 0 8px #00d4aa',
              animation: 'pulse 2s infinite',
            }} />
            {lang === 'uk' ? '● API Live' : '● API Live'}
          </button>
        </div>
      </div>

      {/* ── 2-zone body: Zone A (gauge + cards) | Zone B (inaction) ── */}
      <div className="flex-1 min-h-0 flex flex-col px-5 pb-1 gap-3">

        {/* Zone A — Diagnostics: MHEI gauge center + 6 gap cards row */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">

          {/* MHEI Gauge — clickable to L4 full report */}
          <div
            className="w-full lg:w-[264px] flex-shrink-0 flex flex-col items-center justify-center py-1 ds-blueprint cursor-pointer"
            style={{ flexShrink: 0 }}
            onClick={() => nav.push('l4')}
            title={lang === 'uk' ? 'Mental Health Economy Index — перейти до звіту' : 'Mental Health Economy Index — go to report'}
          >
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11,
              color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.12em',
              textAlign: 'center', marginBottom: 2,
            }}>
              Mental Health Economy Index
            </div>

            <GaugeDisplay lang={lang} expanded={false} onToggle={() => nav.push('l4')} />

            <button
              onClick={() => nav.push('l4')}
              style={{ marginTop: 8, fontSize: 10, color: 'var(--color-ds-teal)', border: '1px solid rgba(0,210,170,0.3)', borderRadius: 6, padding: '4px 12px', background: 'rgba(0,210,170,0.07)', cursor: 'pointer', fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}
            >
              {lang === 'uk' ? '→ Повний звіт' : '→ Full Report'}
            </button>
          </div>

{/* Right side — 2 rows: KPI strip + funnel */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">

          {/* Row 1: KPI strip — 5 Bloomberg marks (wireframe G1) */}
          <div style={{
            display: 'flex', gap: 1, flexShrink: 0,
            background: darkMode ? 'rgba(6,14,24,0.6)' : 'rgba(255,255,255,0.8)',
            borderRadius: 4, overflow: 'hidden',
            border: `1px solid ${darkMode ? 'rgba(46,137,166,0.12)' : 'rgba(18,60,58,0.1)'}`,
          }}>
            {([
              { id: 'needs',    label: { uk: 'ПОТРЕБА', en: 'NEED' }, val: '3.9M', sub: { uk: 'клінічна (WB/Lancet)', en: 'clinical (WB/Lancet)' }, color: '#3E91A2', nav: 'l2-operational' },
              { id: 'capital',  label: { uk: 'СПРОМОЖНІСТЬ', en: 'CAPACITY' }, val: '0.41%', sub: { uk: '260K із 62.4M сесій', en: '260K of 62.4M sessions' }, color: '#E8741E', nav: 'l2-clinical' },
              { id: 'hci',      label: { uk: 'HCI', en: 'HCI' }, val: '0.63', sub: { uk: 'Human Capital Index', en: 'Human Capital Index' }, color: '#3E91A2', nav: 'l2-analytical' },
              { id: 'finance',  label: { uk: 'ВВП-ВТРАТИ', en: 'GDP LOSS' }, val: '$8B', sub: { uk: 'щорічно (WHO/RDNA3)', en: 'per year (WHO/RDNA3)' }, color: '#E8741E', nav: 'l2-finance' },
              { id: 'gap',      label: { uk: 'GAP', en: 'GAP' }, val: '62%', sub: { uk: 'незакрита потреба ⚡', en: 'unmet need ⚡' }, color: '#E8741E', nav: 'l2-analytical' },
            ] as const).map((kpi, i, arr) => (
              <div
                key={kpi.id}
                onClick={() => { setDrillAnswers({ pillarId: kpi.id }); nav.push(kpi.nav); }}
                style={{
                  flex: 1, padding: 'clamp(6px, 1vw, 10px) clamp(6px, 1.2vw, 12px)',
                  borderRight: i < arr.length - 1 ? `1px solid ${darkMode ? 'rgba(46,137,166,0.07)' : 'rgba(18,60,58,0.06)'}` : 'none',
                  cursor: 'pointer', transition: 'background 0.15s', minWidth: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = darkMode ? 'rgba(46,137,166,0.06)' : 'rgba(18,60,58,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.1em', color: darkMode ? 'rgba(75,168,188,0.5)' : 'rgba(18,60,58,0.5)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {kpi.label[lang]}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 300, fontSize: 'clamp(18px, 2.5vw, 28px)', color: kpi.color, lineHeight: 1 }}>
                  {kpi.val}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: darkMode ? 'rgba(200,190,170,0.35)' : 'rgba(18,60,58,0.4)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {kpi.sub[lang]}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: InactionFunnel */}
          <InactionFunnel lang={lang} darkMode={darkMode} />

        </div>
        </div>
      </div>

      {/* ── Footer bar — GDP causal chain + disclaimers ── */}
      <div
        className="flex-shrink-0 px-6 py-3 flex flex-col gap-2"
        style={{ borderTop: '1px solid var(--color-ds-border)', background: 'rgba(0,0,0,0.25)' }}
      >
        {/* GDP chain row */}
        <div className="flex items-center gap-3 flex-wrap">
          {GDP_CHAIN.map((m) => (
            <React.Fragment key={m.val}>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>{m.val}</span>
                  <span className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{m.label[lang]}</span>
                </div>
                <span className="text-[10px] font-mono" style={{ color: 'rgba(200,164,92,0.45)' }}>{m.source[lang]}</span>
              </div>
              {m.arrow && (
                <span style={{ color: 'rgba(200,164,92,0.4)', fontSize: 12, flexShrink: 0 }}>→</span>
              )}
            </React.Fragment>
          ))}
          <div className="flex-1" />
          {/* Navigation moved to header */}
        </div>
        {/* Disclaimer row — matches L3 footer */}
        <div className="flex items-start gap-4 flex-wrap" style={{ borderTop: '1px solid rgba(200,164,92,0.1)', paddingTop: 8 }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'rgba(200,164,92,0.4)', lineHeight: 1.5, maxWidth: 600 }}>
            {lang === 'uk'
              ? 'Дашборд містить дані з відкритих джерел за 2020-2025 рр., «оцінка» зазначено там де дані недоступні. Тіньовий сектор: конкретні дослідження для MHPSS не проводились. Сертифікація: добровільна до 2031 року.'
              : "Dashboard contains data from open sources for 2020-2025, 'estimate' is indicated where data is unavailable. Shadow sector: specific studies for MHPSS were not conducted. Certification: voluntary until 2031."}
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'rgba(200,164,92,0.35)', lineHeight: 1.5, maxWidth: 500 }}>
            {lang === 'uk'
              ? 'Дані надані виключно для інформаційних цілей. Не є офіційним звітом гуманітарних акторів, фінансових інституцій, або урядових структур.'
              : 'Data provided for informational purposes only. Not an official report of humanitarian actors, financial institutions, or governmental structures.'}
          </div>
          <div className="flex-1" />
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'rgba(200,164,92,0.3)', textAlign: 'right', whiteSpace: 'nowrap' }}>
            © 2026 FEEL Again Program · dashboard.feelagain.me
          </div>
        </div>
      </div>
    </div>
  );
};
