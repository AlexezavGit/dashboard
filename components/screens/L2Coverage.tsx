import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

const T = {
  back: { uk: 'Назад', en: 'Back' },
  title: { uk: 'Звідки 0.28% покриття?', en: 'Where does 0.28% come from?' },
  subtitle: {
    uk: 'Анатомія розриву між клінічною потребою та наявною спроможністю',
    en: 'Anatomy of the gap between clinical need and available capacity',
  },
  toAnalytical: { uk: 'Повна аналітика →', en: 'Full analytics →' },
};

const BARS = [
  {
    label: { uk: 'Клінічна потреба', en: 'Clinical need' },
    value: 62_400_000,
    display: '62.4M',
    color: '#ff7b6e',
    pct: 100,
    note: { uk: '3.9M осіб × 16 сес. (ВООЗ норма)', en: '3.9M people × 16 sessions (WHO norm)' },
  },
  {
    label: { uk: 'НСЗУ ПМД (публічна система)', en: 'NHSU primary care (public system)' },
    value: 180_000,
    display: '180K',
    color: '#e8c97a',
    pct: 0.29,
    note: { uk: 'Психологічні послуги НСЗУ 2024', en: 'NHSU psychological services 2024' },
  },
  {
    label: { uk: 'Гуманітарний сектор (видимий)', en: 'Humanitarian sector (visible)' },
    value: 4_700_000,
    display: '~4.7M',
    color: '#00d4aa',
    pct: 7.5,
    note: { uk: 'CommCare/ActivityInfo/Kobo звіти', en: 'CommCare/ActivityInfo/Kobo reports' },
  },
  {
    label: { uk: 'Тіньовий сектор (оцінка)', en: 'Shadow sector (estimate)' },
    value: 3_000_000,
    display: '~3M',
    color: '#a78bfa',
    pct: 4.8,
    note: { uk: '5–15K незареєстрованих практиків × ~200 сес./рік', en: '5–15K unregistered practitioners × ~200 sessions/year' },
  },
];

const GAPS = [
  { label: { uk: '0% цифрового обміну між гуман. системами та ЄСОЗ', en: '0% digital exchange between humanitarian systems and ESOZ' }, color: '#ff7b6e' },
  { label: { uk: '54% пацієнтів не завершують курс лікування', en: '54% of patients do not complete their treatment course' }, color: '#e8c97a' },
  { label: { uk: '78% переходів — без офіційного направлення', en: '78% of care transitions — without formal referral' }, color: '#00d4aa' },
  { label: { uk: 'Тіньовий сектор невидимий для будь-якого реєстру', en: 'Shadow sector invisible to any registry' }, color: '#a78bfa' },
];

export const L2Coverage: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 60% 50% at 10% 50%, rgba(224,85,69,0.14) 0%, transparent 55%), ' +
        'linear-gradient(135deg, #0a1628 0%, #180808 100%)',
    }}
  >
    <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #ff7b6e, #e8c97a 60%, transparent)', boxShadow: '0 0 14px rgba(255,123,110,0.4)' }} />

    {/* Header */}
    <div className="flex items-center gap-4 px-6 pt-5 pb-3 flex-shrink-0">
      <button onClick={nav.back} className="flex items-center gap-1.5 text-[11px] ds-display font-medium transition-colors" style={{ color: 'var(--color-ds-muted)' }}>
        <ArrowLeft className="w-4 h-4" /> {T.back[lang]}
      </button>
      <div className="w-px h-4" style={{ background: 'var(--color-ds-border)' }} />
      <div>
        <div className="text-[18px] font-bold ds-display" style={{ color: '#ff7b6e' }}>{T.title[lang]}</div>
        <div className="text-[11px] ds-body mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>{T.subtitle[lang]}</div>
      </div>
      <div className="flex-1" />
      <button onClick={() => nav.push('appendix')} className="text-[11px] ds-display font-medium flex items-center gap-1" style={{ color: 'var(--color-ds-teal)' }}>
        {T.toAnalytical[lang]} <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Main content */}
    <div className="flex-1 grid grid-cols-2 gap-5 px-6 pb-5 min-h-0">
      {/* Left: capacity bars */}
      <div className="flex flex-col gap-3">
        <div className="cyber-label mb-1" style={{ color: '#ff7b6e' }}>
          {lang === 'uk' ? 'ПОТРЕБА ТА СПРОМОЖНІСТЬ (сесії/рік)' : 'NEED VS CAPACITY (sessions/year)'}
        </div>
        {BARS.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${b.color}33` }}
          >
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[11px] ds-body" style={{ color: 'rgba(200,208,220,0.8)' }}>{b.label[lang]}</span>
              <span className="text-[20px] font-bold ds-display" style={{ color: b.color }}>{b.display}</span>
            </div>
            {/* Bar */}
            <div className="h-2 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(b.pct, 0.5)}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.7 }}
                className="h-full rounded-full"
                style={{ background: b.color, boxShadow: `0 0 8px ${b.color}88` }}
              />
            </div>
            <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{b.note[lang]}</div>
          </motion.div>
        ))}
      </div>

      {/* Right: structural gaps + insight */}
      <div className="flex flex-col gap-3">
        <div className="cyber-label mb-1" style={{ color: 'var(--color-ds-gold)' }}>
          {lang === 'uk' ? 'СТРУКТУРНІ ПРИЧИНИ РОЗРИВУ' : 'STRUCTURAL CAUSES OF THE GAP'}
        </div>
        {GAPS.map((g, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${g.color}33` }}
          >
            <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: g.color, boxShadow: `0 0 6px ${g.color}` }} />
            <span className="text-[12px] ds-body" style={{ color: 'rgba(200,208,220,0.8)' }}>{g.label[lang]}</span>
          </motion.div>
        ))}

        {/* Insight box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-auto rounded-2xl p-5"
          style={{ background: 'rgba(0,210,170,0.08)', border: '1px solid rgba(0,210,170,0.25)' }}
        >
          <div className="cyber-label mb-2" style={{ color: '#00d4aa' }}>
            {lang === 'uk' ? 'РІШЕННЯ FEEL AGAIN' : 'FEEL AGAIN SOLUTION'}
          </div>
          <p className="text-[12px] ds-body leading-relaxed" style={{ color: 'rgba(200,208,220,0.8)' }}>
            {lang === 'uk'
              ? 'Digital Bus з\'єднує CommCare / Kobo / ActivityInfo → ЄСОЗ через HL7 FHIR R4. Кожна гуманітарна сесія стає видимою для THRIVE DLI-вимірювання. Ціль: 400K верифікованих сесій у ЄСОЗ для disbursement.'
              : 'Digital Bus connects CommCare / Kobo / ActivityInfo → ESOZ via HL7 FHIR R4. Every humanitarian session becomes visible for THRIVE DLI measurement. Target: 400K verified sessions in ESOZ for disbursement.'}
          </p>
        </motion.div>
      </div>
    </div>
  </div>
);
