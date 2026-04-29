import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';

interface Props {
  lang: Language;
  nav: ScreenNav;
  liveHciValue?: number | null;
}

type Role = 'executive' | 'manager' | 'analyst';

const ROLE_LABELS: Record<Role, { uk: string; en: string }> = {
  executive: { uk: 'Керівник / Донор', en: 'Executive / Donor' },
  manager:   { uk: 'Лінійний керівник', en: 'Line Manager' },
  analyst:   { uk: 'Аналітик', en: 'Analyst' },
};

const ROLE_QUESTION: Record<Role, { uk: string; en: string }> = {
  executive: { uk: 'Чи варто фінансувати FEEL Again? Що відбувається з грошима?', en: 'Is FEEL Again worth funding? What is happening with the money?' },
  manager:   { uk: 'Де втрачається клінічний час і що дасть FEEL Again завтра?', en: 'Where is clinical time lost and what will FEEL Again give me tomorrow?' },
  analyst:   { uk: 'Де дані є, де відсутні, де методологічний розрив?', en: 'Where is data available, where missing, where is the methodological gap?' },
};

interface KpiDef {
  id: ScreenId;
  value: { uk: string; en: string };
  unit: { uk: string; en: string };
  label: { uk: string; en: string };
  question: { uk: string; en: string };
  color: string;
  glow: string;
  cardBg: string;
  roleRelevance?: Partial<Record<Role, { uk: string; en: string }>>;
}

const KPIS: KpiDef[] = [
  {
    id: 'l2-coverage',
    value: { uk: '0.28%', en: '0.28%' },
    unit: { uk: 'клінічної потреби покрито системою', en: 'of clinical need covered by the system' },
    label: { uk: 'Охоплення системи', en: 'System coverage' },
    question: { uk: 'Звідки взялось 0.28%?', en: 'Where does 0.28% come from?' },
    color: '#ff7b6e',
    glow: 'rgba(224,85,69,0.22)',
    cardBg: 'rgba(224,85,69,0.08)',
    roleRelevance: {
      executive: { uk: 'Масштаб системного провалу', en: 'Scale of systemic failure' },
      manager:   { uk: '54% не завершують курс', en: '54% do not complete course' },
      analyst:   { uk: '5 систем · 0 синхронізацій', en: '5 systems · 0 synchronisations' },
    },
  },
  {
    id: 'l2-finance',
    value: { uk: '$0', en: '$0' },
    unit: { uk: 'верифікованих виплат, прив\'язаних до результатів (humanitarian)', en: 'verified outcome-based payments (humanitarian)' },
    label: { uk: 'Верифіковані виплати', en: 'Verified payments' },
    question: { uk: 'Як влаштований грошовий потік?', en: 'How is the money flow structured?' },
    color: '#e8c97a',
    glow: 'rgba(200,164,92,0.22)',
    cardBg: 'rgba(200,164,92,0.08)',
    roleRelevance: {
      executive: { uk: '$1.87B в системі · 0% прив\'язано', en: '$1.87B in system · 0% linked' },
      manager:   { uk: '0% автоматичної верифікації', en: '0% automatic verification' },
      analyst:   { uk: 'Ланцюг донор→послуга розірваний', en: 'Donor→service chain is broken' },
    },
  },
  {
    id: 'l2-backlog',
    value: { uk: '12.4', en: '12.4' },
    unit: { uk: 'роки черги до ліквідації без додатк. спеціалістів', en: 'years backlog without additional specialists' },
    label: { uk: 'Беклог системи', en: 'System backlog' },
    question: { uk: 'Як рахується 12.4 роки?', en: 'How is 12.4 years calculated?' },
    color: '#00d4aa',
    glow: 'rgba(0,210,170,0.22)',
    cardBg: 'rgba(0,210,170,0.08)',
    roleRelevance: {
      executive: { uk: 'З FEEL Again: 8.1 р. (-35%)', en: 'With FEEL Again: 8.1 yrs (-35%)' },
      manager:   { uk: '3.5 год/тиж дублювання → +45K сес.', en: '3.5 hrs/wk duplication → +45K sessions' },
      analyst:   { uk: '19K спеціалістів невидимі в реєстрі', en: '19K specialists invisible in registry' },
    },
  },
];

const BOTTOM_METRICS = [
  { val: '3.9M', label: { uk: 'потребують клін. допомоги', en: 'need clinical care' } },
  { val: '260K', label: { uk: 'НСЗУ пацієнтів 2025', en: 'NHSU patients 2025' } },
  { val: '$954M', label: { uk: 'WB заблоковано', en: 'WB invested' } },
  { val: '25K→10K', label: { uk: 'mhGAP серт.→активних', en: 'mhGAP certified→active' } },
  { val: '80%', label: { uk: 'ЦМЗ — перефарбовані диспансери', en: 'MHCs — rebranded dispensaries' } },
];

export const L1Strategic: React.FC<Props> = ({ lang, nav, liveHciValue }) => {
  const [role, setRole] = useState<Role>('executive');

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(0,210,170,0.14) 0%, transparent 55%), ' +
          'radial-gradient(ellipse 60% 50% at 80% 40%, rgba(0,180,200,0.10) 0%, transparent 50%), ' +
          'radial-gradient(ellipse 50% 40% at 50% 110%, rgba(46,196,182,0.10) 0%, transparent 60%), ' +
          'linear-gradient(135deg, #0a1628 0%, #1a0a0a 100%)',
      }}
    >
      {/* Top emerald line */}
      <div
        className="h-[2px] w-full flex-shrink-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00d4aa 30%, #2ec4b6 60%, rgba(200,164,92,0.7) 100%)',
          boxShadow: '0 0 20px rgba(0,212,170,0.55)',
        }}
      />

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="FEEL Again" className="w-8 h-8 rounded-lg" />
          <div>
            <div className="text-[12px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>FEEL Again</div>
            <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
              MHPSS Ukraine · {lang === 'uk' ? 'Системний огляд' : 'System Overview'} · {new Date().toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-GB', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => nav.push('l2-operational')} className="text-[11px] px-3 py-1.5 rounded-lg ds-display font-semibold transition-all" style={{ color: 'var(--color-ds-teal)', border: '1px solid rgba(46,196,182,0.3)' }}>
            {lang === 'uk' ? '9 розривів →' : '9 gaps →'}
          </button>
          <button onClick={() => nav.push('l2-analytical')} className="text-[11px] px-3 py-1.5 rounded-lg ds-display font-semibold transition-all" style={{ color: 'var(--color-ds-gold)', border: '1px solid var(--color-ds-border)' }}>
            {lang === 'uk' ? 'Дані →' : 'Data →'}
          </button>
          <a href="https://feelagain.com.ua" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-lg ds-display font-bold"
            style={{ background: 'var(--color-ds-gold)', color: '#0a1628' }}>
            {lang === 'uk' ? 'Приєднатись' : 'Join'}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ── Role tabs ── */}
      <div className="px-6 pb-2 flex-shrink-0">
        <div className="flex items-center gap-1 mb-1">
          {(Object.entries(ROLE_LABELS) as [Role, { uk: string; en: string }][]).map(([r, lbl]) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold ds-display transition-all"
              style={{
                background: role === r ? 'rgba(200,164,92,0.18)' : 'transparent',
                border: role === r ? '1px solid var(--color-ds-gold)' : '1px solid transparent',
                color: role === r ? 'var(--color-ds-gold)' : 'var(--color-ds-muted)',
              }}
            >
              {lbl[lang]}
            </button>
          ))}
          <span className="ml-3 text-[11px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
            — {ROLE_QUESTION[role][lang]}
          </span>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="flex-1 grid grid-cols-3 gap-4 px-6 pb-3 min-h-0">
        {KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex flex-col rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
            style={{ background: kpi.cardBg, border: `1px solid ${kpi.color}44`, boxShadow: `0 0 40px ${kpi.glow}` }}
            onClick={() => nav.push(kpi.id)}
          >
            {/* Label */}
            <div className="cyber-label mb-2" style={{ color: kpi.color }}>{kpi.label[lang]}</div>

            {/* Big number */}
            <div
              className="ds-display font-bold leading-none flex-1 flex items-center"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', color: kpi.color, textShadow: `0 0 40px ${kpi.glow}, 0 0 80px ${kpi.glow}` }}
            >
              {kpi.value[lang]}
            </div>

            {/* Unit */}
            <div className="text-[12px] ds-body mt-2 mb-3" style={{ color: 'rgba(200,208,220,0.65)' }}>
              {kpi.unit[lang]}
            </div>

            {/* Role relevance badge */}
            {kpi.roleRelevance?.[role] && (
              <motion.div
                key={role}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-semibold ds-display mb-3 px-2 py-1 rounded-lg inline-block"
                style={{ background: `${kpi.color}18`, color: kpi.color, border: `1px solid ${kpi.color}33` }}
              >
                {kpi.roleRelevance[role]![lang]}
              </motion.div>
            )}

            {/* Drill-down CTA */}
            <motion.button
              whileHover={{ x: 4 }}
              className="flex items-center gap-2 text-[12px] font-bold ds-display self-start"
              style={{ color: kpi.color }}
            >
              {kpi.question[lang]}
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            {/* Hover glow overlay */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, ${kpi.glow} 0%, transparent 70%)` }} />
          </motion.div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex-shrink-0 px-6 py-2.5 flex items-center gap-5 flex-wrap"
        style={{ borderTop: '1px solid var(--color-ds-border)', background: 'rgba(0,0,0,0.25)' }}>
        {[
          ...BOTTOM_METRICS,
          ...(liveHciValue ? [{ val: `HCI ${liveHciValue}`, label: { uk: 'WB live', en: 'WB live' } }] : []),
        ].map((m) => (
          <div key={m.val} className="flex items-baseline gap-1.5">
            <span className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>{m.val}</span>
            <span className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{m.label[lang]}</span>
          </div>
        ))}
        <div className="flex-1" />
        <button onClick={() => nav.push('appendix')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-medium"
          style={{ color: 'var(--color-ds-muted)' }}>
          <ChevronRight className="w-3.5 h-3.5" />
          {lang === 'uk' ? '↓ Повний аналітичний дашборд' : '↓ Full analytical dashboard'}
        </button>
      </div>
    </div>
  );
};
