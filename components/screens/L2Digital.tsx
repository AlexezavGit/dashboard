import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

const TIME_BREAKDOWN = [
  { label: { uk: 'Дублювання звітів (5 форм/візит)', en: 'Report duplication (5 forms/visit)' }, hrs: 3.5, color: '#ff9966' },
  { label: { uk: 'Ручний перенос між системами', en: 'Manual data re-entry between systems' }, hrs: 1.2, color: '#ff9966' },
  { label: { uk: 'Пошук/верифікація пацієнта (різні реєстри)', en: 'Patient search/verification (different registries)' }, hrs: 0.8, color: '#ff9966' },
  { label: { uk: 'Безпосередньо клінічний час (залишок)', en: 'Direct clinical time (remainder)' }, hrs: 14.5, color: '#00d4aa' },
];
const TOTAL_HOURS = 20;

export const L2Digital: React.FC<Props> = ({ lang, nav }) => {
  const lostHrs = TIME_BREAKDOWN.filter(s => s.color === '#ff9966').reduce((a, s) => a + s.hrs, 0);
  const lostPct = Math.round((lostHrs / TOTAL_HOURS) * 100);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a1000 100%)' }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, #ff9966, #ff6633, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(255,153,102,0.5)' }} />

      <NavBar
        lang={lang}
        onBack={nav.back}
        title={{ uk: 'Digitalization · Ерозія від адмін-дублювання', en: 'Digitalization · Admin duplication erosion' }}
        breadcrumbs={[{ label: { uk: 'L1 Огляд', en: 'L1 Overview' }, onClick: nav.reset }]}
      />

      <div className="flex-1 grid grid-cols-2 gap-5 px-6 pb-4 pt-3 min-h-0">

        {/* Left */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5 flex-shrink-0"
            style={{ background: 'rgba(255,153,102,0.07)', border: '1px solid rgba(255,153,102,0.3)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: '#ff9966' }}>
              MHEI · Digitalization · w10%
            </div>
            <div className="ds-display font-black leading-none" style={{ fontSize: '62px', color: '#ff9966', textShadow: '0 0 40px rgba(255,153,102,0.5)' }}>
              −{lostPct}%
            </div>
            <div className="text-[12px] ds-body mt-2" style={{ color: 'rgba(200,208,220,0.75)' }}>
              {t('клінічного часу втрачено на дублювання', 'clinical time lost to duplicate reporting', lang)}
            </div>
            <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>
              {t(`${lostHrs.toFixed(1)} год/тиж × 4000+ фахівців`, `${lostHrs.toFixed(1)} h/wk × 4000+ specialists`, lang)}
            </div>
            <div className="mt-3 px-3 py-2 rounded-lg text-[11px] font-semibold ds-display inline-block"
              style={{ background: 'rgba(255,153,102,0.1)', color: '#ff9966', border: '1px solid rgba(255,153,102,0.25)' }}>
              {t('Ціль: <5% overhead · зараз: 7.4/10 балів MHEI', 'Target: <5% overhead · now: 7.4/10 MHEI pts', lang)}
            </div>
          </div>

          {/* Time breakdown bar chart */}
          <div className="flex-1 rounded-2xl p-5 min-h-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Розподіл тижневого часу (20 год/тиж)', 'Weekly time breakdown (20 h/wk)', lang)}
            </div>
            <div className="space-y-3">
              {TIME_BREAKDOWN.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] ds-display font-semibold" style={{ color: s.color === '#ff9966' ? 'var(--color-ds-muted)' : 'var(--color-ds-text)' }}>
                      {s.label[lang]}
                    </span>
                    <span className="text-[12px] font-bold ds-display" style={{ color: s.color }}>
                      {s.hrs}h
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: `${(s.hrs / TOTAL_HOURS) * 100}%`, background: s.color, opacity: s.color === '#ff9966' ? 0.7 : 0.9 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Відновлюваний потенціал', 'Recoverable potential', lang)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: '+45K', label: { uk: 'сесій/місяць при усуненні дублювання', en: 'sessions/mo if duplication removed' } },
                { val: '~$30M', label: { uk: '/рік витрачається на дублювання', en: '/yr spent on duplication' } },
                { val: '5 форм', label: { uk: 'на 1 візит пацієнта', en: 'per single patient visit' } },
                { val: '19K', label: { uk: 'фахівців невидимі в НСЗУ реєстрі', en: 'specialists invisible in NHSU registry' } },
              ].map((m) => (
                <div key={m.val} className="p-3 rounded-xl"
                  style={{ background: 'rgba(255,153,102,0.07)', border: '1px solid rgba(255,153,102,0.2)' }}>
                  <div className="text-[18px] font-black ds-display" style={{ color: '#ff9966' }}>{m.val}</div>
                  <div className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{m.label[lang]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-2xl p-5"
            style={{ background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.3)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-gold)' }}>
              {t('FEEL Again · Шлях до <5% overhead', 'FEEL Again · Pathway to <5% overhead', lang)}
            </div>
            <div className="space-y-3">
              {[
                { uk: 'Єдина цифрова форма: 1 введення → 5 систем автоматично', en: 'Single digital form: 1 entry → 5 systems automatically' },
                { uk: 'Авто-заповнення з реєстрів пацієнтів (NHSU/ESOZ lookup)', en: 'Auto-fill from patient registries (NHSU/ESOZ lookup)' },
                { uk: 'Пакетний експорт звіту MoH/NHSU — 1 клік замість 5', en: 'Batch MoH/NHSU report export — 1 click instead of 5' },
                { uk: 'Аудит: час витрачений ↔ час оплачений → верифікація', en: 'Audit: time spent ↔ time billed → verification' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5"
                    style={{ background: 'rgba(200,164,92,0.2)', color: 'var(--color-ds-gold)', border: '1px solid rgba(200,164,92,0.4)' }}>
                    {i + 1}
                  </div>
                  <div className="text-[11px] ds-body" style={{ color: 'var(--color-ds-text)' }}>{item[lang]}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--color-ds-border)' }}>
              <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
                {t('Джерело: FEEL Again польові інтерв\'ю 2024 · NHSU специфікація звітності', 'Source: FEEL Again field interviews 2024 · NHSU reporting spec', lang)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
