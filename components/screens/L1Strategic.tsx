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
  executive: { uk: 'Чи варто фінансувати? Що з грошима?', en: 'Worth funding? What is happening with the money?' },
  manager:   { uk: 'Де втрачається клінічний час?', en: 'Where is clinical time lost?' },
  analyst:   { uk: 'Де дані є, де відсутні, де розрив?', en: 'Where data exists, where missing, where the gap?' },
};

// ── 6 program layers ──
type LayerId = 'fintech' | 'clinical' | 'data' | 'sustain' | 'digital' | 'regulatory';

interface LayerDef {
  id: LayerId;
  screenId: ScreenId;
  weight: number;            // MHEI weight (sums to 100)
  current: number;           // current %
  target: number;            // target %
  layer: { uk: string; en: string };
  indicator: { uk: string; en: string };
  display: { uk: string; en: string };
  unit: { uk: string; en: string };
  formula: { uk: string; en: string };
  color: string;
  glow: string;
  cardBg: string;
  roleRelevance?: Partial<Record<Role, { uk: string; en: string }>>;
}

const LAYERS: LayerDef[] = [
  {
    id: 'fintech',
    screenId: 'l2-fintech',
    weight: 25,
    current: 0, target: 30,
    layer: { uk: 'FinTech', en: 'FinTech' },
    indicator: { uk: 'Виплати, прив\'язані до результатів', en: 'Outcome-linked payments' },
    display: { uk: '$0', en: '$0' },
    unit: { uk: 'верифікованих outcome-виплат (humanitarian)', en: 'verified outcome payments (humanitarian)' },
    formula: { uk: '$0 / $420M алок. = 0% (ціль ≥30%)', en: '$0 / $420M alloc. = 0% (target ≥30%)' },
    color: '#e8c97a',
    glow: 'rgba(200,164,92,0.22)',
    cardBg: 'rgba(200,164,92,0.08)',
    roleRelevance: {
      executive: { uk: '$1.87B → 0% результатів', en: '$1.87B → 0% outcomes' },
      manager:   { uk: '0% автоверифікації', en: '0% auto-verification' },
      analyst:   { uk: 'Розрив донор→послуга', en: 'Donor→service chain broken' },
    },
  },
  {
    id: 'clinical',
    screenId: 'l2-clinical',
    weight: 25,
    current: 40, target: 80,
    layer: { uk: 'Clinical', en: 'Clinical' },
    indicator: { uk: 'Завершуваність реабілітації', en: 'Rehabilitation completion' },
    display: { uk: '~40%', en: '~40%' },
    unit: { uk: 'епізодів завершено / розпочато', en: 'episodes completed / initiated' },
    formula: { uk: 'Епізод = ≥6 сесій / ≥3 міс. (mhGAP)', en: 'Episode = ≥6 sessions / ≥3 mo. (mhGAP)' },
    color: '#ff7b6e',
    glow: 'rgba(224,85,69,0.22)',
    cardBg: 'rgba(224,85,69,0.08)',
    roleRelevance: {
      executive: { uk: '60% — зрив протоколу', en: '60% — protocol abandonment' },
      manager:   { uk: 'Drop-off після сесії 3', en: 'Drop-off after session 3' },
      analyst:   { uk: 'Дані фрагментовано в 5 системах', en: 'Data fragmented across 5 systems' },
    },
  },
  {
    id: 'data',
    screenId: 'l2-data',
    weight: 20,
    current: 5, target: 60,
    layer: { uk: 'Data & Coord', en: 'Data & Coord' },
    indicator: { uk: 'Інтероперабельність', en: 'Interoperability' },
    display: { uk: '<5%', en: '<5%' },
    unit: { uk: 'сесій з крос-системним записом', en: 'sessions with cross-system record' },
    formula: { uk: 'NHSU ↔ ESOZ (HL7 FHIR R4) — pilot only', en: 'NHSU ↔ ESOZ (HL7 FHIR R4) — pilot only' },
    color: '#00d4aa',
    glow: 'rgba(0,210,170,0.22)',
    cardBg: 'rgba(0,210,170,0.08)',
    roleRelevance: {
      executive: { uk: 'Дані не зливаються — нема картини', en: 'Data not joined — no picture' },
      manager:   { uk: 'Картка пацієнта розбита 5×', en: 'Patient record split 5×' },
      analyst:   { uk: '36.5M ESOZ юзерів — без MH-адаптера', en: '36.5M ESOZ users — no MH adapter' },
    },
  },
  {
    id: 'sustain',
    screenId: 'l2-sustain',
    weight: 15,
    current: 35, target: 70,
    layer: { uk: 'Sustainable Dev', en: 'Sustainable Dev' },
    indicator: { uk: 'Конверсія навчання (Imitation Index)', en: 'Training conversion (Imitation Index)' },
    display: { uk: '~35%', en: '~35%' },
    unit: { uk: 'mhGAP-сертифік. активних 12 міс.', en: 'mhGAP-certified active at 12 mo.' },
    formula: { uk: '~10K активних / ~25K сертифік. ≈ 40%', en: '~10K active / ~25K certified ≈ 40%' },
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.22)',
    cardBg: 'rgba(167,139,250,0.08)',
    roleRelevance: {
      executive: { uk: '65% сертифікатів — паперові', en: '65% of certificates — paper only' },
      manager:   { uk: '15K фахівців невидимі в реєстрі', en: '15K specialists invisible in registry' },
      analyst:   { uk: 'Imitation Index: ~35%', en: 'Imitation Index: ~35%' },
    },
  },
  {
    id: 'digital',
    screenId: 'l2-digital',
    weight: 10,
    current: 70, target: 95,
    layer: { uk: 'Digitalization', en: 'Digitalization' },
    indicator: { uk: 'Ерозія від адмін-дублювання', en: 'Erosion from admin duplication' },
    display: { uk: '−30%', en: '−30%' },
    unit: { uk: 'клін. часу втрачено на дубль-звіти', en: 'clinical time lost to duplicate reporting' },
    formula: { uk: '3.5 год/тиж × 4000 фахівців ≈ +45K сесій/міс', en: '3.5 h/wk × 4000 specialists ≈ +45K sessions/mo' },
    color: '#ff9966',
    glow: 'rgba(255,153,102,0.22)',
    cardBg: 'rgba(255,153,102,0.08)',
    roleRelevance: {
      executive: { uk: '~$30M/рік — на дублювання', en: '~$30M/yr — on duplication' },
      manager:   { uk: '5 форм звіту на 1 візит', en: '5 report forms per single visit' },
      analyst:   { uk: 'Час витрачений ≠ час оплачений', en: 'Time spent ≠ time billed' },
    },
  },
  {
    id: 'regulatory',
    screenId: 'l2-regulatory',
    weight: 5,
    current: 1, target: 25,
    layer: { uk: 'Regulatory', en: 'Regulatory' },
    indicator: { uk: 'Локалізація гум. ресурсів', en: 'Humanitarian localization' },
    display: { uk: '~1%', en: '~1%' },
    unit: { uk: 'гум. фінансування через укр. організ.', en: 'humanitarian funding via Ukrainian orgs' },
    formula: { uk: 'Grand Bargain: ≥25% to local actors by 2025', en: 'Grand Bargain: ≥25% to local actors by 2025' },
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.22)',
    cardBg: 'rgba(192,132,252,0.08)',
    roleRelevance: {
      executive: { uk: '99% капіталу — поза укр. контролем', en: '99% capital — outside Ukrainian control' },
      manager:   { uk: 'Залежність від INGO-стандартів', en: 'INGO-standard dependency' },
      analyst:   { uk: 'OECD-DAC + IATI flows', en: 'OECD-DAC + IATI flows' },
    },
  },
];

// ── MHEI calculation: weighted normalized score ──
function mheiScore(): number {
  return LAYERS.reduce((sum, l) => {
    const norm = Math.min(100, Math.max(0, (l.current / l.target) * 100));
    return sum + norm * (l.weight / 100);
  }, 0);
}

const MHEI = Math.round(mheiScore()); // → 29 with current values

// Bands
type Band = 'low' | 'medium' | 'high';
function band(score: number): Band {
  if (score < 34) return 'low';
  if (score < 67) return 'medium';
  return 'high';
}
const BAND_LABELS: Record<Band, { uk: string; en: string }> = {
  low:    { uk: 'Crisis Mode · Ідеальний шторм', en: 'Crisis Mode · Perfect Storm' },
  medium: { uk: 'Transition · інтеграція починається', en: 'Transition · integration emerging' },
  high:   { uk: 'Functional · соц. бонди ↓ · кредит. % ↓', en: 'Functional · social bonds ↓ · credit % ↓' },
};
const BAND_COLOR: Record<Band, string> = {
  low: '#ff7b6e',
  medium: '#e8c97a',
  high: '#00d4aa',
};

const SOURCES = [
  { val: '$1.87B', label: { uk: 'WB+EU портфель MH', en: 'WB+EU MH portfolio' } },
  { val: '6.8M', label: { uk: 'PTSD/depr. потреба', en: 'PTSD/depr. need' } },
  { val: '€2.5–4.1B', label: { uk: 'непокрита вартість сесій (3-Price)', en: 'unmet session value (3-Price)' } },
  { val: '36.5M', label: { uk: 'ESOZ users', en: 'ESOZ users' } },
];

export const L1Strategic: React.FC<Props> = ({ lang, nav, liveHciValue }) => {
  const [role, setRole] = useState<Role>('executive');
  const currentBand = band(MHEI);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 20% 60%, rgba(0,210,170,0.12) 0%, transparent 55%), ' +
          'radial-gradient(ellipse 60% 50% at 80% 40%, rgba(0,180,200,0.08) 0%, transparent 50%), ' +
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
      <div className="flex items-start justify-between px-6 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="FEEL Again" className="w-9 h-9 rounded-lg" />
          <div>
            <div className="flex items-baseline gap-2">
              <div className="text-[12px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>FEEL Again</div>
              <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
                MHPSS Ukraine · {new Date().toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-GB', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="text-[16px] font-bold ds-display leading-tight" style={{ color: 'var(--color-ds-text)' }}>
              {lang === 'uk' ? 'Ідеальний шторм — поточний ландшафт MHPSS' : 'Perfect Storm — Current MHPSS Sector Landscape'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
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
        <div className="flex items-center gap-1">
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

      {/* ── MHEI strip ── */}
      <div className="mx-6 mb-3 px-4 py-3 rounded-xl flex items-center gap-5 flex-shrink-0"
        style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--color-ds-border)' }}>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--color-ds-muted)' }}>
            MHEI · {lang === 'uk' ? 'Індекс екосистеми психічного здоров\'я' : 'Mental Health Ecosystem Index'}
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="ds-display font-black leading-none" style={{ fontSize: '42px', color: BAND_COLOR[currentBand], textShadow: `0 0 30px ${BAND_COLOR[currentBand]}66` }}>{MHEI}</span>
            <span className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-muted)' }}>/ 100</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="relative h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="absolute top-0 left-0 h-2 rounded-full" style={{ width: `${MHEI}%`, background: BAND_COLOR[currentBand], boxShadow: `0 0 12px ${BAND_COLOR[currentBand]}88` }} />
            <div className="absolute top-[-2px] h-3 w-px" style={{ left: '33%', background: 'rgba(255,255,255,0.4)' }} />
            <div className="absolute top-[-2px] h-3 w-px" style={{ left: '67%', background: 'rgba(255,255,255,0.4)' }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[8px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
            <span>0 · {lang === 'uk' ? 'Криза' : 'Crisis'}</span>
            <span style={{ color: BAND_COLOR.low }}>33</span>
            <span style={{ color: BAND_COLOR.medium }}>67</span>
            <span>100 · {lang === 'uk' ? 'Функц.' : 'Functional'}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[12px] font-bold ds-display" style={{ color: BAND_COLOR[currentBand] }}>
            {BAND_LABELS[currentBand][lang]}
          </div>
          <div className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
            {lang === 'uk' ? 'композит з 6 шарів програми' : 'composite of 6 program layers'}
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
            className="flex flex-col rounded-2xl p-4 cursor-pointer group relative overflow-hidden"
            style={{ background: l.cardBg, border: `1px solid ${l.color}44`, boxShadow: `0 0 28px ${l.glow}` }}
            onClick={() => nav.push(l.screenId)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="cyber-label" style={{ color: l.color }}>{l.layer[lang]}</span>
              <span className="text-[8px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>w {l.weight}%</span>
            </div>
            <div className="text-[10.5px] font-semibold ds-display leading-tight mb-1" style={{ color: 'var(--color-ds-text)' }}>
              {l.indicator[lang]}
            </div>

            <div className="flex-1 flex items-center">
              <div
                className="font-bold ds-display leading-none"
                style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.6rem)', color: l.color, textShadow: `0 0 30px ${l.glow}` }}
              >
                {l.display[lang]}
              </div>
            </div>

            <div className="text-[10px] ds-body mt-1" style={{ color: 'rgba(200,208,220,0.7)' }}>{l.unit[lang]}</div>
            <div className="text-[8.5px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>{l.formula[lang]}</div>

            {l.roleRelevance?.[role] && (
              <motion.div
                key={role}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9px] font-semibold ds-display mt-2 px-2 py-1 rounded-md self-start"
                style={{ background: `${l.color}18`, color: l.color, border: `1px solid ${l.color}33` }}
              >
                {l.roleRelevance[role]![lang]}
              </motion.div>
            )}

            <motion.button
              whileHover={{ x: 3 }}
              className="flex items-center gap-1 text-[10px] font-bold ds-display self-start mt-2"
              style={{ color: l.color }}
            >
              {lang === 'uk' ? 'Деталізація' : 'Drill down'}
              <ChevronRight className="w-3 h-3" />
            </motion.button>

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
            <span className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>{m.val}</span>
            <span className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{m.label[lang]}</span>
          </div>
        ))}
        <div className="flex-1" />
        <button onClick={() => nav.push('appendix')}
          className="flex items-center gap-1.5 text-[11px] ds-display font-medium"
          style={{ color: 'var(--color-ds-muted)' }}>
          <ChevronRight className="w-3.5 h-3.5" />
          {lang === 'uk' ? '↓ Бриф (повний)' : '↓ Brief (full)'}
        </button>
      </div>
    </div>
  );
};
