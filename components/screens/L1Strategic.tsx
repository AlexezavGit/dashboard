import React from 'react';
import { motion } from 'motion/react';
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
  formula: { uk: string; en: string };
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
    formula: { uk: '$0 / $420M алок. · ціль ≥30%', en: '$0 / $420M alloc. · target ≥30%' },
    color: '#e8c97a', glow: 'rgba(200,164,92,0.22)', cardBg: 'rgba(200,164,92,0.07)',
  },
  {
    id: 'clinical', screenId: 'l2-clinical', weight: 25, current: 40, target: 80,
    layer: { uk: 'Clinical', en: 'Clinical' },
    indicator: { uk: 'Завершуваність реабілітації', en: 'Rehabilitation completion' },
    display: { uk: '~40%', en: '~40%' },
    unit: { uk: 'епізодів завершено / розпочато', en: 'episodes completed / initiated' },
    formula: { uk: 'Епізод ≥6 сесій / ≥3 міс. · ціль ≥80%', en: 'Episode ≥6 sessions / ≥3 mo. · target ≥80%' },
    color: '#ff7b6e', glow: 'rgba(224,85,69,0.22)', cardBg: 'rgba(224,85,69,0.07)',
  },
  {
    id: 'data', screenId: 'l2-data', weight: 20, current: 5, target: 60,
    layer: { uk: 'Data & Coord', en: 'Data & Coord' },
    indicator: { uk: 'Інтероперабельність', en: 'Interoperability' },
    display: { uk: '<5%', en: '<5%' },
    unit: { uk: 'сесій з крос-системним записом', en: 'sessions with cross-system record' },
    formula: { uk: 'NHSU ↔ ESOZ FHIR R4 pilot · ціль ≥60%', en: 'NHSU ↔ ESOZ FHIR R4 pilot · target ≥60%' },
    color: '#00d4aa', glow: 'rgba(0,210,170,0.22)', cardBg: 'rgba(0,210,170,0.07)',
  },
  {
    id: 'sustain', screenId: 'l2-sustain', weight: 15, current: 35, target: 70,
    layer: { uk: 'Місткість', en: 'Capacity' },
    indicator: { uk: 'Конверсія навчання → практика', en: 'Training → practice conversion' },
    display: { uk: '~35%', en: '~35%' },
    unit: { uk: '57K awareness → 700 клін · «зникла середина»', en: '57K awareness → 700 clinical · "missing middle"' },
    formula: { uk: '4,427 НСЗУ / потенціал 49K+ · ціль ≥70%', en: '4,427 NHSU / potential 49K+ · target ≥70%' },
    color: '#a78bfa', glow: 'rgba(167,139,250,0.22)', cardBg: 'rgba(167,139,250,0.07)',
  },
  {
    id: 'digital', screenId: 'l2-digital', weight: 10, current: 70, target: 95,
    layer: { uk: 'Digitalization', en: 'Digitalization' },
    indicator: { uk: 'Ерозія від дублювання', en: 'Duplication erosion' },
    display: { uk: '−30%', en: '−30%' },
    unit: { uk: 'клін. часу втрачено на дубль-звіти', en: 'clinical time lost to duplicate reports' },
    formula: { uk: '3.5 год/тиж × 4000+ фахівців · ціль <5%', en: '3.5 h/wk × 4000+ specialists · target <5%' },
    color: '#ff9966', glow: 'rgba(255,153,102,0.22)', cardBg: 'rgba(255,153,102,0.07)',
  },
  {
    id: 'regulatory', screenId: 'l2-regulatory', weight: 5, current: 1, target: 25,
    layer: { uk: 'Regulatory', en: 'Regulatory' },
    indicator: { uk: 'Локалізація гум. ресурсів', en: 'Humanitarian localization' },
    display: { uk: '~1%', en: '~1%' },
    unit: { uk: 'гум. фінансування через укр. організ.', en: 'humanitarian funding via Ukrainian orgs' },
    formula: { uk: 'Grand Bargain ≥25% до 2025 — не виконано · ціль 25%', en: 'Grand Bargain ≥25% by 2025 — unmet · target 25%' },
    color: '#c084fc', glow: 'rgba(192,132,252,0.22)', cardBg: 'rgba(192,132,252,0.07)',
  },
];

// MHEI composite: weighted normalized score
const MHEI = Math.round(
  LAYERS.reduce((sum, l) => sum + Math.min(100, (l.current / l.target) * 100) * (l.weight / 100), 0)
); // → 29

type Band = 'low' | 'medium' | 'high';
const band = (s: number): Band => s < 34 ? 'low' : s < 67 ? 'medium' : 'high';
const BAND_COLOR: Record<Band, string> = { low: '#ff7b6e', medium: '#e8c97a', high: '#00d4aa' };

const currentBand = band(MHEI);

const SOURCES = [
  { val: '$1.87B', label: { uk: 'WB+EU портфель MH', en: 'WB+EU MH portfolio' } },
  { val: '6.8M', label: { uk: 'PTSD/depr. потреба', en: 'PTSD/depr. need' } },
  { val: '€2.5–4.1B', label: { uk: 'непокрита вартість сесій', en: 'unmet session value' } },
  { val: '260K', label: { uk: 'НСЗУ пацієнтів 2025', en: 'NHSU patients 2025' } },
];

export const L1Strategic: React.FC<Props> = ({ lang, nav, liveHciValue }) => (
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
    <div className="flex items-center justify-between pl-6 pr-32 pt-4 pb-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="FEEL Again" className="w-9 h-9 rounded-lg flex-shrink-0" />
        <div>
          {/* Breadcrumb location */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono mb-0.5" style={{ color: 'var(--color-ds-muted)' }}>
            <span style={{ color: 'var(--color-ds-gold)' }}>FEEL Again</span>
            <span>·</span>
            <span>MHPSS Ukraine</span>
            <span>·</span>
            <span style={{ color: 'var(--color-ds-text)' }}>{lang === 'uk' ? 'ЛАНДШАФТ' : 'LANDSCAPE'}</span>
          </div>
          <div className="text-[19px] font-bold ds-display leading-tight" style={{ color: 'var(--color-ds-text)' }}>
            {lang === 'uk' ? 'Ідеальний шторм — поточний ландшафт MHPSS' : 'Perfect Storm — Current MHPSS Sector Landscape'}
          </div>
        </div>
      </div>

      {/* Right: nav buttons + MHEI pulsing badge */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => nav.push('l2-operational')} className="text-[12px] px-3 py-1.5 rounded-lg ds-display font-semibold"
          style={{ color: 'var(--color-ds-teal)', border: '1px solid rgba(46,196,182,0.3)' }}>
          {lang === 'uk' ? '9 розривів →' : '9 gaps →'}
        </button>
        <button onClick={() => nav.push('l2-analytical')} className="text-[12px] px-3 py-1.5 rounded-lg ds-display font-semibold"
          style={{ color: 'var(--color-ds-gold)', border: '1px solid var(--color-ds-border)' }}>
          {lang === 'uk' ? 'Дані →' : 'Data →'}
        </button>

        {/* MHEI pulsing badge */}
        <div className="relative flex items-center">
          <motion.div
            animate={{ opacity: [1, 0.45, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-1 rounded-xl"
            style={{ background: `${BAND_COLOR[currentBand]}22` }}
          />
          <div className="relative px-3 py-2 rounded-xl flex flex-col items-center"
            style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${BAND_COLOR[currentBand]}55` }}>
            <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--color-ds-muted)' }}>MHEI</div>
            <div className="text-[20px] font-black ds-display leading-none" style={{ color: BAND_COLOR[currentBand] }}>{MHEI}</div>
            <div className="text-[9px] font-mono" style={{ color: BAND_COLOR[currentBand] }}>
              {lang === 'uk' ? 'Криза' : 'Crisis'}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ── 6 KPI cards (3×2) ── */}
    <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3 px-6 pb-3 min-h-0">
      {LAYERS.map((l, i) => (
        <motion.div
          key={l.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.32 }}
          className="flex flex-col rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
          style={{ background: l.cardBg, border: `1px solid ${l.color}40`, boxShadow: `0 0 28px ${l.glow}` }}
          onClick={() => nav.push(l.screenId)}
        >
          {/* Layer label + weight */}
          <div className="flex items-center justify-between mb-2">
            <span className="cyber-label" style={{ color: l.color }}>{l.layer[lang]}</span>
            <span className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>w {l.weight}%</span>
          </div>

          {/* Indicator name */}
          <div className="text-[12px] font-semibold ds-display leading-snug mb-2" style={{ color: 'var(--color-ds-text)' }}>
            {l.indicator[lang]}
          </div>

          {/* Big value */}
          <div className="flex-1 flex items-center">
            <div className="font-black ds-display leading-none"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', color: l.color, textShadow: `0 0 30px ${l.glow}` }}>
              {l.display[lang]}
            </div>
          </div>

          {/* Unit — larger & readable */}
          <div className="text-[12px] ds-body font-medium mt-2" style={{ color: 'rgba(200,208,220,0.85)' }}>
            {l.unit[lang]}
          </div>

          {/* Formula */}
          <div className="text-[10px] font-mono mt-1 mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {l.formula[lang]}
          </div>

          {/* Drill-down CTA */}
          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-1 text-[11px] font-bold ds-display self-start"
            style={{ color: l.color }}
          >
            {lang === 'uk' ? 'Деталізація' : 'Drill down'}
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>

          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at center, ${l.glow} 0%, transparent 70%)` }} />
        </motion.div>
      ))}
    </div>

    {/* ── Bottom bar ── */}
    <div className="flex-shrink-0 px-6 py-2.5 flex items-center gap-5 flex-wrap"
      style={{ borderTop: '1px solid var(--color-ds-border)', background: 'rgba(0,0,0,0.25)' }}>
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
      <button onClick={() => nav.push('appendix')}
        className="flex items-center gap-1.5 text-[11px] ds-display font-medium"
        style={{ color: 'var(--color-ds-muted)' }}>
        <ChevronRight className="w-3.5 h-3.5" />
        {lang === 'uk' ? 'Бриф (повний) ↓' : 'Brief (full) ↓'}
      </button>
    </div>
  </div>
);
