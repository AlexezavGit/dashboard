import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';
import { Logo } from '../ui/Logo';
import { STRATEGIC_FRAMEWORK, MHEI_VALUE_CHAIN, COLORS } from '../../constants';

interface Props {
  lang: Language;
  nav: ScreenNav;
  liveHciValue?: number | null;
  darkMode?: boolean;
}

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

const PILLARS_CONFIG: LayerDef[] = [
  { id: 'needs',    screenId: 'l2-operational', weight: 25, current: 34, target: 100, color: '#A855F7', glow: 'rgba(168,85,247,0.22)', cardBg: 'rgba(168,85,247,0.07)' },
  { id: 'capital',  screenId: 'l2-clinical',    weight: 25, current: 18, target: 100, color: '#3B82F6', glow: 'rgba(59,130,246,0.22)', cardBg: 'rgba(59,130,246,0.07)' },
  { id: 'finance',  screenId: 'l2-finance',     weight: 25, current: 5,  target: 100, color: '#EF4444', glow: 'rgba(239,68,68,0.22)',  cardBg: 'rgba(239,68,68,0.07)' },
  { id: 'coverage', screenId: 'l2-sustain',     weight: 25, current: 8,  target: 100, color: '#10B981', glow: 'rgba(16,185,129,0.22)', cardBg: 'rgba(16,185,129,0.07)' },
];

const INDEX_SCORE = Math.round(
  PILLARS_CONFIG.reduce((sum, l) => sum + Math.min(100, (l.current / l.target) * 100) * (l.weight / 100), 0)
); // → 29 (Representative MHEI Score)

type Band = 'low' | 'medium' | 'high';
const scoreToBand = (s: number): Band => s < 34 ? 'low' : s < 67 ? 'medium' : 'high';
const BAND_COLOR: Record<Band, string> = { low: '#ff7b6e', medium: '#e8c97a', high: '#00d4aa' };
const BAND_LABEL: Record<Band, { uk: string; en: string }> = {
  low:    { uk: 'Стагнація / Криза', en: 'Stagnation / Crisis' },
  medium: { uk: 'Помірне відновлення', en: 'Moderate recovery' },
  high:   { uk: 'Активне відновлення', en: 'Active recovery' },
};

const currentBand = scoreToBand(INDEX_SCORE);

// GDP causal chain footer items
const GDP_CHAIN = [
  {
    val: '260K',
    label: { uk: 'НСЗУ пацієнтів 2025', en: 'NHSU patients 2025' },
    source: { uk: 'НСЗУ відкриті дані 2025', en: 'NHSU open data 2025' },
    arrow: true,
  },
  {
    val: '€2.5–4.1B',
    label: { uk: 'непокриті сесії/рік', en: 'unmet sessions/yr' },
    source: { uk: 'МОЗ тариф × 3.5M розрив', en: 'MoH tariff × 3.5M gap' },
    arrow: true,
  },
  {
    val: '$8B/рік ⚠️',
    label: { uk: 'ВВП-втрати', en: 'GDP losses' },
    source: { uk: 'WHO/OECD оцінка ⚠️', en: 'WHO/OECD estimate ⚠️' },
    arrow: true,
  },
  {
    val: '$1.87B',
    label: { uk: 'заблоковано WB+EU', en: 'blocked WB+EU' },
    source: { uk: 'WB HEAL/THRIVE портфель', en: 'WB HEAL/THRIVE portfolio' },
    arrow: false,
  },
];

// ── "Ціна бездіяльності" — inaction cost items linking to L3 sections ──────
interface InactionItem {
  val: string;
  label: { uk: string; en: string };
  anchor: string | null;   // null → navigate to l2-analytical instead
  color: string;
}
const INACTION_COSTS: InactionItem[] = [
  { val: '$1.07B',  label: { uk: 'заблокованого фінансування WB', en: 'blocked WB funding (HEAL/THRIVE)' }, anchor: 'section-budget',   color: '#ff7b6e' },
  { val: '1.4M',    label: { uk: 'втрачених сесій клін. психологів', en: 'lost clinical psych. sessions' }, anchor: 'section-inputs',  color: '#ff7b6e' },
  { val: '87.5K',   label: { uk: 'втрачених циклів лікування (WHO)', en: 'lost treatment cycles (WHO)' },     anchor: 'section-gap',     color: '#ff7b6e' },
  { val: '25% год.',label: { uk: 'адмін-ерозія клінічного часу', en: 'admin erosion of clinical time' },   anchor: 'section-inputs',  color: '#ff9966' },
  { val: '$8B/рік', label: { uk: 'втрати ВВП від кризи MH', en: 'GDP loss from MH crisis' }, anchor: 'section-economic', color: '#e8c97a' },
  { val: '7.8–12р.', label: { uk: 'беклог при 4K практиків (стійкий темп)', en: 'backlog at 4K practitioners (sustainable)' }, anchor: 'section-workforce', color: '#e8c97a' },
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
  { label: 'B', score: 0   },
  { label: '1', score: 12  },
  { label: '2', score: 25  },
  { label: '3', score: 37  },
  { label: '4', score: 50  },
  { label: '5', score: 62  },
  { label: '6', score: 75  },
  { label: '7', score: 87  },
  { label: 'R', score: 100 },
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

// ── Compact layer card ─────────────────────────────────────────────────────────
const LayerCard: React.FC<{ l: LayerDef; pillar: any; i: number; lang: Language; onNav: () => void; darkMode: boolean }> = ({ l, pillar, i, lang, onNav, darkMode }) => (
  <motion.div
    initial={{ opacity: 0, x: i < 2 ? -10 : 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.05, duration: 0.28 }}
    className="flex-1 rounded-2xl px-4 py-3 cursor-pointer group relative overflow-hidden min-h-0"
    style={darkMode
      ? { background: l.cardBg, border: `1px solid ${l.color}40`, boxShadow: `0 0 20px ${l.glow}` }
      : { background: '#FFFFFF', border: `1px solid #DDD5CB`, borderLeft: `3px solid ${l.color}`, boxShadow: '8px 8px 24px rgba(58,53,48,0.09), -2px -2px 10px rgba(255,255,255,0.85)' }}
    onClick={onNav}
  >
    <div className="flex items-center justify-between mb-1">
      <span className="cyber-label" style={{ color: l.color, fontSize: '10px' }}>{pillar.label[lang]}</span>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: 'var(--color-ds-muted)' }}>w{l.weight}%</span>
    </div>
    <div style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.0rem)', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color: l.color, lineHeight: 1 }}>
      {pillar.l1.val}
    </div>
    <div className="flex items-center justify-between mt-1">
      <span style={{ fontSize: '10px', color: 'var(--color-ds-text)', opacity: 0.8, fontWeight: 500 }}>{pillar.l1.title[lang]}</span>
      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" style={{ color: l.color }} />
    </div>
    <div style={{ fontSize: '8px', color: 'var(--color-ds-muted)', marginTop: 2, fontStyle: 'italic' }}>
      {pillar.l1.unit[lang]}
    </div>
  </motion.div>
);

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
              <stop offset="30%"  stopColor="#e8c97a" />
              <stop offset="65%"  stopColor="#c8a44c" />
              <stop offset="100%" stopColor="#5a3a08" />
            </linearGradient>
          </defs>

          {/* Dark semicircle dial face */}
          <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY} Z`}
            fill="rgba(6,4,2,0.93)" />

          {/* Zone background tints: Crisis / Transition / Recovery */}
          <path d={eArc(R - 16, 0,  33)}  fill="none" stroke="#ff7b6e" strokeWidth="28" opacity="0.18" />
          <path d={eArc(R - 16, 33, 67)}  fill="none" stroke="#e8c97a" strokeWidth="28" opacity="0.18" />
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
            const isEnd = label === 'B' || label === 'R';
            const lit   = score <= INDEX_SCORE;
            const outer = ePt(score, R + 3);
            const inner = ePt(score, R - 10);
            const lp    = ePt(score, R + 18);
            return (
              <g key={label}>
                <line
                  x1={outer.x.toFixed(1)} y1={outer.y.toFixed(1)}
                  x2={inner.x.toFixed(1)} y2={inner.y.toFixed(1)}
                  stroke={lit ? '#e8c97a' : 'rgba(200,164,92,0.25)'}
                  strokeWidth={isEnd ? 2.5 : 1.5}
                />
                <text x={lp.x.toFixed(1)} y={(lp.y + 4).toFixed(1)}
                  textAnchor="middle" dominantBaseline="central"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: isEnd ? '10px' : '8px',
                    fontWeight: '700',
                    fill: lit ? '#e8c97a' : 'rgba(200,164,92,0.28)',
                  }}>
                  {label}
                </text>
              </g>
            );
          })}

          {/* Needle (animated, points from pivot to current score position) */}
          <g ref={needleRef}>
            <line x1={CX} y1={CY - 4} x2={CX + R - 5} y2={CY - 4}
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
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: '#e8c97a',
          opacity: 0.75, marginTop: 3, letterSpacing: '0.06em' }}>
          {gdpImpact(INDEX_SCORE)} {lang === 'uk' ? 'ВВП' : 'GDP'}
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9,
          color: 'var(--color-ds-muted)', marginTop: 2, lineHeight: 1.4 }}>
          {lang === 'uk' ? 'темп відновлення при завершенні бойових дій' : 'recovery pace when hostilities end'}
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
                        fontSize: 10, color: config.color }}>
                        {p.label[lang]}
                      </span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10,
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
            <div className="flex items-center gap-1.5 text-[9px] font-mono mb-0.5" style={{ color: 'var(--color-ds-muted)' }}>
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
        <button
          onClick={() => nav.push('l2-analytical')}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'DM Mono, monospace', fontSize: 9,
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

      {/* ── 2-zone body: Zone A (gauge + cards) | Zone B (inaction) ── */}
      <div className="flex-1 min-h-0 flex flex-col px-5 pb-1 gap-3">

        {/* Zone A — Diagnostics: MHEI gauge center + 6 gap cards row */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">

          {/* MHEI Gauge — clickable drill-down to l2-mhei */}
          <div
            className="w-full lg:w-[264px] flex-shrink-0 flex flex-col items-center justify-center py-1 ds-blueprint cursor-pointer"
            style={{ flexShrink: 0 }}
            onClick={() => nav.push('l2-mhei')}
            title={lang === 'uk' ? 'Mental Health Economy Index — клацніть для drill-down' : 'Mental Health Economy Index — click to drill down'}
          >
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9,
              color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.12em',
              textAlign: 'center', marginBottom: 2,
            }}>
              Mental Health Economy Index
            </div>
            <div style={{ fontSize: 9, color: 'var(--color-ds-teal)', textAlign: 'center', marginBottom: 4, fontFamily: 'DM Sans, sans-serif' }}>
              {lang === 'uk' ? '↓ клацніть для drill-down' : '↓ click to drill down'}
            </div>

            <GaugeDisplay lang={lang} expanded={false} onToggle={() => nav.push('l2-mhei')} />

            {/* Layer legend */}
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '3px 6px', justifyContent: 'center' }}>
              {STRATEGIC_FRAMEWORK(lang).map(p => {
                const config = PILLARS_CONFIG.find(c => c.id === p.id)!;
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: 8, height: 2.5, background: config.color, borderRadius: 1 }} />
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, color: 'var(--color-ds-muted)' }}>
                      {p.label[lang]}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => nav.push('l2-mhei')}
              style={{ marginTop: 8, fontSize: 10, color: 'var(--color-ds-teal)', border: '1px solid rgba(0,210,170,0.3)', borderRadius: 6, padding: '4px 12px', background: 'rgba(0,210,170,0.07)', cursor: 'pointer', fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em' }}
            >
              {lang === 'uk' ? 'MHEI Дельта →' : 'MHEI Delta →'}
            </button>
          </div>

          {/* Right side: gap cards + inaction costs */}
          <div className="flex-1 flex flex-col gap-2.5 min-h-0">

            {/* 4 gap cards — "системні розриви" */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 flex-shrink-0">
              {STRATEGIC_FRAMEWORK(lang).map((pillar, i) => {
                const config = PILLARS_CONFIG.find(c => c.id === pillar.id)!;
                return (
                  <LayerCard key={pillar.id} l={config} pillar={pillar} i={i} lang={lang} onNav={() => nav.push(config.screenId)} darkMode={darkMode} />
                );
              })}
            </div>

            {/* Zone B — Ціна бездіяльності (inaction cost strip) */}
            <div className="flex-shrink-0" style={{ borderTop: '1px solid rgba(200,164,92,0.15)', paddingTop: 6 }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 8,
                color: 'var(--color-ds-gold)', textTransform: 'uppercase', letterSpacing: '0.12em',
                marginBottom: 4,
              }}>
                {lang === 'uk' ? 'Ціна бездіяльності' : 'Cost of Inaction'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
                {INACTION_COSTS.map(item => (
                  <button
                    key={item.val}
                    onClick={() => {
                      if (item.anchor === null) {
                        nav.push('l2-analytical');
                      } else {
                        sessionStorage.setItem('l3-scroll', item.anchor);
                        nav.push('appendix');
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'baseline', gap: 5, background: 'none',
                      border: 'none', padding: '2px 4px', borderRadius: 5, cursor: 'pointer',
                      textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
                      fontSize: 11, color: item.color, lineHeight: 1,
                      textShadow: `0 0 10px ${item.color}55` }}>
                      {item.val}
                    </span>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9,
                      color: 'var(--color-ds-muted)', lineHeight: 1.3 }}>
                      {item.label[lang]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer bar — GDP causal chain ── */}
      <div
        className="flex-shrink-0 px-6 py-2 flex items-center gap-3 flex-wrap"
        style={{ borderTop: '1px solid var(--color-ds-border)', background: 'rgba(0,0,0,0.25)' }}
      >
        {GDP_CHAIN.map((m) => (
          <React.Fragment key={m.val}>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>{m.val}</span>
                <span className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{m.label[lang]}</span>
              </div>
              <span className="text-[8px] font-mono" style={{ color: 'rgba(200,164,92,0.45)' }}>{m.source[lang]}</span>
            </div>
            {m.arrow && (
              <span style={{ color: 'rgba(200,164,92,0.4)', fontSize: 12, flexShrink: 0 }}>→</span>
            )}
          </React.Fragment>
        ))}
        {liveHciValue && (
          <>
            <span style={{ color: 'rgba(200,164,92,0.4)', fontSize: 12 }}>·</span>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>HCI {liveHciValue}</span>
              <span className="text-[8px] font-mono" style={{ color: 'rgba(200,164,92,0.45)' }}>Human Capital Index · World Bank 2020</span>
            </div>
          </>
        )}
        <div className="flex-1" />
        <button
          onClick={() => nav.push('l2-journey')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-medium px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(68,136,255,0.07)', border: '1px solid rgba(68,136,255,0.3)', color: '#4488ff', marginRight: 8 }}
        >
          {lang === 'uk' ? 'Шляхи Стейкхолдерів' : 'Stakeholder Journeys'}
        </button>
        <button
          onClick={() => nav.push('appendix')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-medium"
          style={{ color: 'var(--color-ds-muted)' }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
          {lang === 'uk' ? 'Аналітичний звіт' : 'Analytical Report'}
        </button>
        <button
          onClick={() => nav.push('l4')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-bold px-3 py-1.5 rounded-lg"
          style={{ background: 'color-mix(in srgb, var(--color-ds-teal) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--color-ds-teal) 35%, transparent)', color: 'var(--color-ds-teal)' }}
        >
          {lang === 'uk' ? '→ Повний звіт' : '→ Full Report'}
        </button>
      </div>
    </div>
  );
};
