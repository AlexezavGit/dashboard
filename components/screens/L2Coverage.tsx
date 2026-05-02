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
    value: 260_000,
    display: '260K',
    color: '#e8c97a',
    pct: 0.42,
    note: { uk: 'НСЗУ ПМД 2025 — пацієнти зі встановленим діагнозом', en: 'NHSU PMD 2025 — patients with established diagnosis' },
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
    <div className="flex items-center gap-3 px-5 pt-4 pb-2 flex-shrink-0">
      <button
        onClick={nav.back}
        className="flex items-center gap-2 px-4 py-2 rounded-xl ds-display font-bold flex-shrink-0 transition-all"
        style={{ background: 'rgba(200,164,92,0.16)', border: '2px solid var(--color-ds-gold)', color: 'var(--color-ds-gold)', fontSize: '12px' }}
      >
        <ArrowLeft className="w-4 h-4" /> {T.back[lang]}
      </button>
      <div>
        <div className="text-[17px] font-bold ds-display" style={{ color: '#ff7b6e' }}>{T.title[lang]}</div>
        <div className="text-[10px] ds-body mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>{T.subtitle[lang]}</div>
      </div>
      <div className="flex-1" />
      <button onClick={() => nav.push('l2-operational')} className="text-[11px] ds-display font-medium flex items-center gap-1" style={{ color: 'var(--color-ds-teal)' }}>
        {lang === 'uk' ? '9 розривів →' : '9 gaps →'} <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Intro context */}
    <div className="px-5 pb-2 flex-shrink-0">
      <div className="rounded-xl px-4 py-2.5" style={{ background: 'rgba(255,123,110,0.06)', border: '1px solid rgba(255,123,110,0.18)' }}>
        <p className="text-[10px] ds-body leading-relaxed" style={{ color: 'rgba(200,208,220,0.82)' }}>
          {lang === 'uk'
            ? '0.28% — це не округлення. Ця цифра виходить із співвідношення фактичних доступних сесій до клінічно обґрунтованої потреби. Нижче — декомпозиція за кожним сектором і структурні причини, чому розрив не закривається при збільшенні фінансування без реформи архітектури.'
            : '0.28% is not a rounding. This figure is derived from the ratio of actually available sessions to clinically justified need. Below is a decomposition by sector and the structural reasons why the gap does not close when funding increases without reforming the architecture.'}
        </p>
      </div>
    </div>

    {/* Main content */}
    <div className="flex-1 grid grid-cols-2 gap-4 px-5 pb-3 min-h-0">
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
            <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{b.note[lang]}</div>
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

        {/* Conclusion + FEEL Again */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-auto rounded-xl p-4"
          style={{ background: 'rgba(0,210,170,0.07)', border: '1px solid rgba(0,210,170,0.22)' }}
        >
          <div className="cyber-label mb-1.5" style={{ color: '#00d4aa', fontSize: '10px' }}>
            {lang === 'uk' ? 'ВИСНОВОК + FEEL AGAIN' : 'CONCLUSION + FEEL AGAIN'}
          </div>
          <p className="text-[10px] ds-body leading-relaxed" style={{ color: 'rgba(200,208,220,0.82)' }}>
            {lang === 'uk'
              ? 'Розрив — архітектурний, не фінансовий. 260K НСЗУ-пацієнтів 2025 — це лише ті, хто пройшов через офіційну систему. Ще ~4.7M гуманітарних та ~3M тіньових сесій невидимі для будь-якого зведеного реєстру. FEEL Again Digital Bus (HL7 FHIR R4) → одна інтеграція між кожною системою та ЄСОЗ = усі сесії стають аудитними. Ціль: 400K верифікованих записів для THRIVE disbursement.'
              : 'The gap is architectural, not financial. 260K NHSU patients 2025 are only those who passed through the official system. Another ~4.7M humanitarian and ~3M shadow sessions are invisible to any consolidated registry. FEEL Again Digital Bus (HL7 FHIR R4) → one integration between each system and ESOZ = all sessions become auditable. Target: 400K verified records for THRIVE disbursement.'}
          </p>
          <div className="text-[10px] font-mono mt-2 pt-2" style={{ borderTop: '1px solid var(--color-ds-border)', color: 'var(--color-ds-muted)' }}>
            {lang === 'uk'
              ? 'Джерело: НСЗУ відкриті дані 10.04.2026 · CommCare/ActivityInfo/Kobo агрегат · Lancet 2024 (3.9M PTSD/dep. оцінка) · ВООЗ 16 сес. норма'
              : 'Source: NHSU open data 10.04.2026 · CommCare/ActivityInfo/Kobo aggregate · Lancet 2024 (3.9M PTSD/dep. estimate) · WHO 16 sessions norm'}
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);
