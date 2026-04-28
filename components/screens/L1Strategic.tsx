import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';

interface Props {
  lang: Language;
  nav: ScreenNav;
  liveHciValue?: number | null;
}

const T = {
  tagline: {
    uk: 'Системний огляд MHPSS України',
    en: 'Ukraine MHPSS System Overview',
  },
  subtitle: {
    uk: 'Три числа, які визначають масштаб виклику та ціну бездіяльності',
    en: 'Three numbers that define the scale of the challenge and the cost of inaction',
  },
  drillLabel: {
    uk: 'Детальніше',
    en: 'Drill down',
  },
  viewAll: {
    uk: '↓ Повний аналітичний дашборд',
    en: '↓ Full analytical dashboard',
  },
  operational: {
    uk: '9 операційних розривів →',
    en: '9 operational gaps →',
  },
  analytical: {
    uk: 'Видимість даних →',
    en: 'Data visibility →',
  },
  cta: {
    uk: 'Приєднатись до програми',
    en: 'Join the programme',
  },
  wbLive: {
    uk: 'WB live',
    en: 'WB live',
  },
};

interface KpiDef {
  id: ScreenId;
  value: string;
  unit: { uk: string; en: string };
  label: { uk: string; en: string };
  question: { uk: string; en: string };
  color: string;
  glow: string;
  cardBg: string;
}

const KPIS: KpiDef[] = [
  {
    id: 'l2-coverage',
    value: '0.28%',
    unit: { uk: 'від клінічної потреби', en: 'of clinical need' },
    label: { uk: 'Охоплення системи', en: 'System coverage' },
    question: { uk: 'Звідки взялось 0.28%?', en: 'Where does 0.28% come from?' },
    color: '#ff7b6e',
    glow: 'rgba(224,85,69,0.22)',
    cardBg: 'rgba(224,85,69,0.08)',
  },
  {
    id: 'l2-backlog',
    value: '12.5',
    unit: { uk: 'років черги без інфраструктури', en: 'years backlog without infrastructure' },
    label: { uk: 'Беклог системи', en: 'System backlog' },
    question: { uk: 'Як рахується 12.5 років?', en: 'How is 12.5 years calculated?' },
    color: '#00d4aa',
    glow: 'rgba(0,210,170,0.22)',
    cardBg: 'rgba(0,210,170,0.08)',
  },
  {
    id: 'l2-cost',
    value: '$6–8B',
    unit: { uk: '/рік втрат ВВП (ЄБРР / LSE)', en: '/yr GDP loss (EBRD / LSE)' },
    label: { uk: 'Ціна бездіяльності', en: 'Cost of inaction' },
    question: { uk: 'З чого складається $6–8B?', en: 'What makes up $6–8B?' },
    color: '#e8c97a',
    glow: 'rgba(200,164,92,0.22)',
    cardBg: 'rgba(200,164,92,0.08)',
  },
];

export const L1Strategic: React.FC<Props> = ({ lang, nav, liveHciValue }) => {
  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(0,210,170,0.18) 0%, transparent 55%), ' +
          'radial-gradient(ellipse 60% 50% at 80% 40%, rgba(0,180,200,0.12) 0%, transparent 50%), ' +
          'radial-gradient(ellipse 50% 40% at 50% 110%, rgba(46,196,182,0.10) 0%, transparent 60%), ' +
          'linear-gradient(135deg, #0a1628 0%, #1a0a0a 100%)',
      }}
    >
      {/* Top emerald line */}
      <div
        className="h-px w-full flex-shrink-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00d4aa 30%, #2ec4b6 60%, rgba(200,164,92,0.6) 100%)',
          boxShadow: '0 0 18px rgba(0,212,170,0.5)',
        }}
      />

      {/* Header row */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="FEEL Again" className="w-8 h-8 rounded-lg" />
          <div>
            <div className="text-[11px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>
              FEEL Again
            </div>
            <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
              MHPSS Ukraine · {T.tagline[lang]}
            </div>
          </div>
        </div>

        {/* Right: secondary nav tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => nav.push('l2-operational')}
            className="text-[11px] px-3 py-1.5 rounded-lg transition-all ds-display font-medium"
            style={{ color: 'var(--color-ds-teal)', border: '1px solid rgba(46,196,182,0.25)' }}
          >
            {T.operational[lang]}
          </button>
          <button
            onClick={() => nav.push('l2-analytical')}
            className="text-[11px] px-3 py-1.5 rounded-lg transition-all ds-display font-medium"
            style={{ color: 'var(--color-ds-gold)', border: '1px solid var(--color-ds-border)' }}
          >
            {T.analytical[lang]}
          </button>
          <a
            href="https://feelagain.com.ua"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg transition-all ds-display font-semibold"
            style={{ background: 'var(--color-ds-gold)', color: '#0a1628' }}
          >
            {T.cta[lang]}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Subtitle */}
      <div className="px-6 pb-4 flex-shrink-0">
        <p className="text-[13px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          {T.subtitle[lang]}
        </p>
      </div>

      {/* KPI cards — take remaining vertical space */}
      <div className="flex-1 grid grid-cols-3 gap-4 px-6 pb-4 min-h-0">
        {KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
            className="flex flex-col rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
            style={{
              background: kpi.cardBg,
              border: `1px solid ${kpi.color}33`,
              boxShadow: `0 0 40px ${kpi.glow}`,
            }}
            onClick={() => nav.push(kpi.id)}
          >
            {/* Label */}
            <div className="cyber-label mb-3" style={{ color: kpi.color }}>
              {kpi.label[lang]}
            </div>

            {/* Big number */}
            <div
              className="ds-display font-bold leading-none flex-1 flex items-center"
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                color: kpi.color,
                textShadow: `0 0 40px ${kpi.glow}, 0 0 80px ${kpi.glow}`,
              }}
            >
              {kpi.value}
            </div>

            {/* Unit */}
            <div className="text-[12px] ds-body mt-2 mb-4" style={{ color: 'rgba(200,208,220,0.65)' }}>
              {kpi.unit[lang]}
            </div>

            {/* Drill-down CTA */}
            <motion.button
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 text-[12px] font-semibold ds-display self-start"
              style={{ color: kpi.color }}
              onClick={(e) => { e.stopPropagation(); nav.push(kpi.id); }}
            >
              {kpi.question[lang]}
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, ${kpi.glow} 0%, transparent 70%)` }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom bar: secondary metrics + appendix link */}
      <div
        className="flex-shrink-0 px-6 py-3 flex items-center gap-6 flex-wrap"
        style={{ borderTop: '1px solid var(--color-ds-border)', background: 'rgba(0,0,0,0.2)' }}
      >
        {/* Mini metrics */}
        {[
          { val: '3.9M', label: { uk: 'потребують клін. допомоги', en: 'need clinical care' } },
          { val: '62.4M', label: { uk: 'сесій/рік незакрита потреба', en: 'sessions/yr unmet need' } },
          { val: '$954M', label: { uk: 'WB заблоковано', en: 'WB invested' } },
          { val: '0%', label: { uk: 'синхронізація ЄСОЗ↔Gуман.', en: 'ESOZ↔Humanitarian sync' } },
          ...(liveHciValue
            ? [{ val: `HCI ${liveHciValue}`, label: { uk: 'World Bank live', en: 'World Bank live' } }]
            : []),
        ].map((m) => (
          <div key={m.val} className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>
              {m.val}
            </span>
            <span className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
              {m.label[lang]}
            </span>
          </div>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Appendix link */}
        <button
          onClick={() => nav.push('appendix')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-medium transition-colors"
          style={{ color: 'var(--color-ds-muted)' }}
        >
          <ArrowRight className="w-3.5 h-3.5" />
          {T.viewAll[lang]}
        </button>
      </div>
    </div>
  );
};
