import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';

interface Props {
  lang: Language;
  nav: ScreenNav;
  liveHciValue?: number | null;
}

type LayerId = 'fintech' | 'clinical' | 'data' | 'sustain' | 'digital' | 'regulatory';

interface LayerDef {
  id: LayerId;
  screenId: ScreenId;
  weight: number;
  current: number;
  target: number;
  layer: { uk: string; en: string };
  indicator: { uk: string; en: string };
  display: { uk: string; en: string };
  unit: { uk: string; en: string };
  color: string;
  glow: string;
  cardBg: string;
}

const LAYERS: LayerDef[] = [
  {
    id: 'fintech', screenId: 'l2-fintech', weight: 25, current: 0, target: 30,
    layer: { uk: 'FinTech', en: 'FinTech' },
    indicator: { uk: 'Виплати, прив\'язані до результатів', en: 'Outcome-linked payments' },
    display: { uk: '$0', en: '$0' },
    unit: { uk: 'верифікованих outcome-виплат', en: 'verified outcome payments' },
    color: '#e8c97a', glow: 'rgba(200,164,92,0.22)', cardBg: 'rgba(200,164,92,0.07)',
  },
  {
    id: 'clinical', screenId: 'l2-clinical', weight: 25, current: 40, target: 80,
    layer: { uk: 'Clinical', en: 'Clinical' },
    indicator: { uk: 'Завершуваність реабілітації', en: 'Rehabilitation completion' },
    display: { uk: '~40%', en: '~40%' },
    unit: { uk: 'епізодів завершено / розпочато', en: 'episodes completed / initiated' },
    color: '#ff7b6e', glow: 'rgba(224,85,69,0.22)', cardBg: 'rgba(224,85,69,0.07)',
  },
  {
    id: 'data', screenId: 'l2-data', weight: 20, current: 5, target: 60,
    layer: { uk: 'Data & Coord', en: 'Data & Coord' },
    indicator: { uk: 'Інтероперабельність', en: 'Interoperability' },
    display: { uk: '<5%', en: '<5%' },
    unit: { uk: 'сесій з крос-системним записом', en: 'sessions with cross-system record' },
    color: '#00d4aa', glow: 'rgba(0,210,170,0.22)', cardBg: 'rgba(0,210,170,0.07)',
  },
  {
    id: 'sustain', screenId: 'l2-sustain', weight: 15, current: 35, target: 70,
    layer: { uk: 'Місткість', en: 'Capacity' },
    indicator: { uk: 'Конверсія навчання → практика', en: 'Training → practice conversion' },
    display: { uk: '~35%', en: '~35%' },
    unit: { uk: '57K awareness → 700 клін · «зникла середина»', en: '57K awareness → 700 clinical · "missing middle"' },
    color: '#a78bfa', glow: 'rgba(167,139,250,0.22)', cardBg: 'rgba(167,139,250,0.07)',
  },
  {
    id: 'digital', screenId: 'l2-digital', weight: 10, current: 70, target: 95,
    layer: { uk: 'Digitalization', en: 'Digitalization' },
    indicator: { uk: 'Ерозія від дублювання', en: 'Duplication erosion' },
    display: { uk: '−30%', en: '−30%' },
    unit: { uk: 'клін. часу втрачено на дубль-звіти', en: 'clinical time lost to duplicate reports' },
    color: '#ff9966', glow: 'rgba(255,153,102,0.22)', cardBg: 'rgba(255,153,102,0.07)',
  },
  {
    id: 'regulatory', screenId: 'l2-regulatory', weight: 5, current: 1, target: 25,
    layer: { uk: 'Regulatory', en: 'Regulatory' },
    indicator: { uk: 'Локалізація гум. ресурсів', en: 'Humanitarian localization' },
    display: { uk: '~1%', en: '~1%' },
    unit: { uk: 'гум. фінансування через укр. організ.', en: 'humanitarian funding via Ukrainian orgs' },
    color: '#c084fc', glow: 'rgba(192,132,252,0.22)', cardBg: 'rgba(192,132,252,0.07)',
  },
];

const INDEX_SCORE = Math.round(
  LAYERS.reduce((sum, l) => sum + Math.min(100, (l.current / l.target) * 100) * (l.weight / 100), 0)
); // → 29

type Band = 'low' | 'medium' | 'high';
const scoreToBand = (s: number): Band => s < 34 ? 'low' : s < 67 ? 'medium' : 'high';
const BAND_COLOR: Record<Band, string> = { low: '#ff7b6e', medium: '#e8c97a', high: '#00d4aa' };
const BAND_LABEL: Record<Band, { uk: string; en: string }> = {
  low:    { uk: 'Стагнація / Криза', en: 'Stagnation / Crisis' },
  medium: { uk: 'Помірне відновлення', en: 'Moderate recovery' },
  high:   { uk: 'Активне відновлення', en: 'Active recovery' },
};

const currentBand = scoreToBand(INDEX_SCORE);

const SOURCES = [
  { val: '$1.87B', label: { uk: 'WB+EU портфель MH', en: 'WB+EU MH portfolio' } },
  { val: '6.8M', label: { uk: 'PTSD/depr. потреба', en: 'PTSD/depr. need' } },
  { val: '€2.5–4.1B', label: { uk: 'непокрита вартість сесій', en: 'unmet session value' } },
  { val: '260K', label: { uk: 'НСЗУ пацієнтів 2025', en: 'NHSU patients 2025' } },
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
const LAYER_ZONES = LAYERS.map(l => {
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
const LayerCard: React.FC<{ l: LayerDef; i: number; lang: Language; onNav: () => void }> = ({ l, i, lang, onNav }) => (
  <motion.div
    initial={{ opacity: 0, x: i < 3 ? -10 : 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.05, duration: 0.28 }}
    className="flex-1 rounded-2xl px-4 py-3 cursor-pointer group relative overflow-hidden min-h-0"
    style={{ background: l.cardBg, border: `1px solid ${l.color}40`, boxShadow: `0 0 20px ${l.glow}` }}
    onClick={onNav}
  >
    <div className="flex items-center justify-between mb-1">
      <span className="cyber-label" style={{ color: l.color, fontSize: '10px' }}>{l.layer[lang]}</span>
      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: 'var(--color-ds-muted)' }}>w{l.weight}%</span>
    </div>
    <div style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.6rem)', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color: l.color, lineHeight: 1 }}>
      {l.display[lang]}
    </div>
    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(200,208,220,0.85)', marginTop: 3 }}>
      {l.indicator[lang]}
    </div>
    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: 'var(--color-ds-muted)', marginTop: 2 }}>
      {l.unit[lang]}
    </div>
    <motion.div
      whileHover={{ x: 3 }}
      className="flex items-center gap-1 mt-2"
      style={{ color: l.color, fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', fontWeight: 700 }}
    >
      {lang === 'uk' ? 'Деталізація' : 'Drill down'}
      <ChevronRight className="w-3 h-3" />
    </motion.div>
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{ background: `radial-gradient(ellipse at center, ${l.glow} 0%, transparent 70%)` }} />
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
            <line x1={CX} y1={CY} x2={CX + R - 5} y2={CY}
              stroke={bandColor} strokeWidth="2.5" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${bandColor}cc)` } as React.CSSProperties}
            />
            {/* Counterweight */}
            <line x1={CX} y1={CY} x2={CX - 18} y2={CY}
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
              {LAYERS.map((l, i) => {
                const pct = Math.min(100, (l.current / l.target) * 100);
                return (
                  <div key={l.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                        fontSize: 10, color: l.color }}>
                        {l.layer[lang]}
                      </span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 10,
                        color: 'var(--color-ds-muted)' }}>
                        {Math.round(pct)}% · w{l.weight}%
                      </span>
                    </div>
                    <div style={{ height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.05 + i * 0.07, duration: 0.55 }}
                        style={{ height: '100%', borderRadius: 4, background: l.color,
                          boxShadow: `0 0 8px ${l.color}55` }}
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
export const L1Strategic: React.FC<Props> = ({ lang, nav, liveHciValue }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(0,210,170,0.10) 0%, transparent 55%), ' +
          'radial-gradient(ellipse 60% 50% at 80% 40%, rgba(0,180,200,0.07) 0%, transparent 50%), ' +
          'linear-gradient(135deg, #0a1628 0%, #1a0a0a 100%)',
      }}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #00d4aa 30%, #2ec4b6 60%, rgba(200,164,92,0.7) 100%)', boxShadow: '0 0 20px rgba(0,212,170,0.55)' }} />

      {/* ── Header ── */}
      <div className="flex items-center justify-between pl-6 pr-32 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="FEEL Again" className="w-8 h-8 rounded-lg flex-shrink-0" />
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
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => nav.push('l2-operational')}
            className="text-[11px] px-3 py-1.5 rounded-lg ds-display font-semibold"
            style={{ color: 'var(--color-ds-teal)', border: '1px solid rgba(46,196,182,0.3)' }}
          >
            {lang === 'uk' ? '9 розривів →' : '9 gaps →'}
          </button>
          <button
            onClick={() => nav.push('l2-analytical')}
            className="text-[11px] px-3 py-1.5 rounded-lg ds-display font-semibold"
            style={{ color: 'var(--color-ds-gold)', border: '1px solid var(--color-ds-border)' }}
          >
            {lang === 'uk' ? 'Дані →' : 'Data →'}
          </button>
        </div>
      </div>

      {/* ── 3-column body: cards | gauge | cards ── */}
      <div
        className="flex-1 min-h-0 px-5 pb-3 gap-4"
        style={{ display: 'grid', gridTemplateColumns: '1fr 284px 1fr' }}
      >
        {/* Left: FinTech, Clinical, Data */}
        <div className="flex flex-col gap-2.5 min-h-0">
          {LAYERS.slice(0, 3).map((l, i) => (
            <LayerCard key={l.id} l={l} i={i} lang={lang} onNav={() => nav.push(l.screenId)} />
          ))}
        </div>

        {/* Center: Mental Health Economy Index gauge */}
        <div
          className="flex flex-col min-h-0 py-1 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Index name */}
          <div style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9,
            color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.12em',
            textAlign: 'center', marginBottom: 4,
          }}>
            {lang === 'uk' ? 'Mental Health Economy Index' : 'Mental Health Economy Index'}
          </div>

          <GaugeDisplay lang={lang} expanded={expanded} onToggle={() => setExpanded(e => !e)} />

          {/* Layer legend below gauge */}
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: '3px 6px', justifyContent: 'center' }}>
            {LAYERS.map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 8, height: 2.5, background: l.color, borderRadius: 1 }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, color: 'var(--color-ds-muted)' }}>
                  {l.layer[lang]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Capacity, Digital, Regulatory */}
        <div className="flex flex-col gap-2.5 min-h-0">
          {LAYERS.slice(3).map((l, i) => (
            <LayerCard key={l.id} l={l} i={i + 3} lang={lang} onNav={() => nav.push(l.screenId)} />
          ))}
        </div>
      </div>

      {/* ── Footer bar ── */}
      <div
        className="flex-shrink-0 px-6 py-2.5 flex items-center gap-5 flex-wrap"
        style={{ borderTop: '1px solid var(--color-ds-border)', background: 'rgba(0,0,0,0.25)' }}
      >
        {[
          ...SOURCES,
          ...(liveHciValue ? [{ val: `HCI ${liveHciValue}`, label: { uk: 'WB live', en: 'WB live' } }] : []),
        ].map((m) => (
          <div key={m.val} className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>{m.val}</span>
            <span className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{m.label[lang]}</span>
          </div>
        ))}
        <div className="flex-1" />
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
