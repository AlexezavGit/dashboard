import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
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

// ── Speedometer geometry helpers ──────────────────────────────────────────────
const polar = (deg: number, r: number, cx: number, cy: number) => ({
  x: cx + r * Math.cos((deg * Math.PI) / 180),
  y: cy - r * Math.sin((deg * Math.PI) / 180),
});

// SVG arc from angle A to B (math convention: counterclockwise, y-flipped for SVG → sweep=0)
const gaugePath = (r: number, A: number, B: number, cx: number, cy: number) => {
  const s = polar(A, r, cx, cy);
  const e = polar(B, r, cx, cy);
  const large = Math.abs(A - B) > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 0 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
};

// Map value 0–100 → angle 180°–0° (left to right across the gauge)
const valToAngle = (v: number) => 180 - (v / 100) * 180;

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

// ── Gauge component ─────────────────────────────────────────────────────────
const GaugeDisplay: React.FC<{ lang: Language; expanded: boolean; onToggle: () => void }> = ({ lang, expanded, onToggle }) => {
  const cx = 140, cy = 113, R = 95;
  const bandColor = BAND_COLOR[currentBand];

  // Animate needle by driving score 0→INDEX_SCORE and computing endpoint via polar()
  // This avoids SVG CSS-rotation direction ambiguity entirely.
  const scoreProgress = useMotionValue(0);
  useEffect(() => {
    const controls = animate(scoreProgress, INDEX_SCORE, {
      type: 'spring', stiffness: 42, damping: 13, delay: 0.45,
    });
    return controls.stop;
  }, []);
  const needleX2 = useTransform(scoreProgress, v => polar(valToAngle(v), R * 0.77, cx, cy).x);
  const needleY2 = useTransform(scoreProgress, v => polar(valToAngle(v), R * 0.77, cx, cy).y);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {/* Gauge SVG */}
      <div onClick={onToggle} style={{ cursor: 'pointer', width: '100%' }}>
        <svg viewBox="0 0 280 160" width="100%" style={{ overflow: 'visible', display: 'block' }}>

          {/* Track background */}
          <path d={gaugePath(R, 180, 0, cx, cy)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />

          {/* Zone arcs: Crisis / Warning / Recovery */}
          <path d={gaugePath(R, 180, 120, cx, cy)} fill="none" stroke="#ff7b6e" strokeWidth="13" opacity="0.40" />
          <path d={gaugePath(R, 120, 60, cx, cy)}  fill="none" stroke="#e8c97a" strokeWidth="13" opacity="0.40" />
          <path d={gaugePath(R, 60, 0, cx, cy)}   fill="none" stroke="#00d4aa" strokeWidth="13" opacity="0.40" />

          {/* Filled progress arc */}
          <path d={gaugePath(R, 180, valToAngle(INDEX_SCORE), cx, cy)} fill="none" stroke={bandColor} strokeWidth="13" opacity="0.88" strokeLinecap="round" />

          {/* Layer score tick marks */}
          {LAYERS.map(l => {
            const pct = Math.min(100, (l.current / l.target) * 100);
            const ang = valToAngle(pct);
            const inner = polar(ang, R - 10, cx, cy);
            const outer = polar(ang, R + 10, cx, cy);
            return (
              <line key={l.id}
                x1={inner.x.toFixed(2)} y1={inner.y.toFixed(2)}
                x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
                stroke={l.color} strokeWidth="2.5" opacity="0.9"
              />
            );
          })}

          {/* Major tick marks at 0, 25, 50, 75, 100 */}
          {[0, 25, 50, 75, 100].map(v => {
            const ang = valToAngle(v);
            const i = polar(ang, R - 5, cx, cy);
            const o = polar(ang, R + 5, cx, cy);
            return <line key={v} x1={i.x.toFixed(2)} y1={i.y.toFixed(2)} x2={o.x.toFixed(2)} y2={o.y.toFixed(2)} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />;
          })}

          {/* Animated needle — endpoint computed via polar(), correct in all browsers */}
          <motion.line
            x1={cx} y1={cy}
            x2={needleX2 as any} y2={needleY2 as any}
            stroke={bandColor} strokeWidth="2.5" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${bandColor}99)` } as React.CSSProperties}
          />

          {/* Needle base */}
          <circle cx={cx} cy={cy} r="7" fill={bandColor}
            style={{ filter: `drop-shadow(0 0 12px ${bandColor}aa)` }} />

          {/* Zone endpoint labels */}
          <text x="14" y={cy + 5} textAnchor="middle" fill="rgba(255,123,110,0.6)"
            style={{ fontSize: 8, fontFamily: 'DM Sans, sans-serif' } as React.CSSProperties}>
            {lang === 'uk' ? 'Стагн.' : 'Stag.'}
          </text>
          <text x="266" y={cy + 5} textAnchor="middle" fill="rgba(0,212,170,0.6)"
            style={{ fontSize: 8, fontFamily: 'DM Sans, sans-serif' } as React.CSSProperties}>
            {lang === 'uk' ? 'Відн.' : 'Rec.'}
          </text>

          {/* Central value */}
          <text x={cx} y={cy + 28} textAnchor="middle" fill={bandColor}
            style={{ fontSize: 36, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 900 } as React.CSSProperties}>
            {INDEX_SCORE}
          </text>
          <text x={cx} y={cy + 43} textAnchor="middle" fill="rgba(200,208,220,0.45)"
            style={{ fontSize: 8, fontFamily: 'DM Sans, sans-serif' } as React.CSSProperties}>
            {lang === 'uk' ? 'з 100' : 'out of 100'}
          </text>
        </svg>
      </div>

      {/* Band label */}
      <div style={{ textAlign: 'center', marginTop: -4 }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: bandColor }}>
          {BAND_LABEL[currentBand][lang]}
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)', marginTop: 3, lineHeight: 1.4 }}>
          {lang === 'uk'
            ? 'темп відновлення при завершенні бойових дій'
            : 'recovery pace when hostilities end'}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={onToggle}
        style={{
          marginTop: 6,
          fontFamily: 'DM Sans, sans-serif', fontSize: 9,
          color: bandColor, background: 'none',
          border: `1px solid ${bandColor}44`, borderRadius: 6,
          padding: '3px 12px', cursor: 'pointer',
        }}
      >
        {expanded
          ? (lang === 'uk' ? '↑ згорнути' : '↑ collapse')
          : (lang === 'uk' ? '↓ розклад індексу' : '↓ index breakdown')}
      </button>

      {/* Expandable layer breakdown */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', width: '100%', paddingTop: 8 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {LAYERS.map((l, i) => {
                const pct = Math.min(100, (l.current / l.target) * 100);
                return (
                  <div key={l.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: l.color }}>
                        {l.layer[lang]}
                      </span>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)' }}>
                        {Math.round(pct)}% · w{l.weight}%
                      </span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: i * 0.07, duration: 0.55 }}
                        style={{ height: '100%', borderRadius: 2, background: l.color }}
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
      className="fixed inset-0 flex flex-col overflow-hidden"
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
          {lang === 'uk' ? 'Бриф (повний) ↓' : 'Brief (full) ↓'}
        </button>
      </div>
    </div>
  );
};
