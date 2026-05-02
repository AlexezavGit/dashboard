import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine,
} from 'recharts';
import { STRUCTURAL_DISP_DATA } from '../../constants';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

const TIME_BREAKDOWN = [
  { label: { uk: 'Дублювання звітів (5 форм/візит)', en: 'Report duplication (5 forms/visit)' }, hrs: 3.5, clinical: false },
  { label: { uk: 'Ручний перенос між системами', en: 'Manual re-entry between systems' }, hrs: 1.2, clinical: false },
  { label: { uk: 'Пошук пацієнта (різні реєстри)', en: 'Patient search (different registries)' }, hrs: 0.8, clinical: false },
  { label: { uk: 'Безпосередньо клінічний час', en: 'Direct clinical time' }, hrs: 14.5, clinical: true },
];
const TOTAL = 20;

export const L2Digital: React.FC<Props> = ({ lang, nav }) => {
  const lostHrs = TIME_BREAKDOWN.filter(s => !s.clinical).reduce((a, s) => a + s.hrs, 0);
  const lostPct = Math.round((lostHrs / TOTAL) * 100);

  // Admin burden (3.1×) + inpatient mismatch (5.0×) — the two structural issues directly affecting digital overhead
  const structData = STRUCTURAL_DISP_DATA(lang).slice(2);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a1000 100%)' }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, #ff9966, #ff6633, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(255,153,102,0.5)' }} />

      <NavBar
        lang={lang}
        nav={nav}
        accentColor="#ff9966"
        title={{ uk: 'Ерозія від адмін-дублювання', en: 'Erosion from admin duplication' }}
        subtitle={{ uk: 'Digitalization · MHEI w10% · ціль <5% overhead', en: 'Digitalization · MHEI w10% · target <5% overhead' }}
        crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
      />

      <div className="flex-1 grid grid-cols-2 gap-5 px-6 pb-4 pt-3 min-h-0">
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-5 flex-shrink-0"
            style={{ background: 'rgba(255,153,102,0.07)', border: '1px solid rgba(255,153,102,0.3)' }}>
            <div className="ds-display font-black leading-none" style={{ fontSize: '72px', color: '#ff9966', textShadow: '0 0 40px rgba(255,153,102,0.5)' }}>
              −{lostPct}%
            </div>
            <div className="text-[15px] font-semibold ds-body mt-2" style={{ color: 'rgba(200,208,220,0.9)' }}>
              {t('клінічного часу втрачено на дублювання', 'clinical time lost to duplicate reporting', lang)}
            </div>
            <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>
              {t(`${lostHrs.toFixed(1)} год/тиж × 4000+ фахівців`, `${lostHrs.toFixed(1)} h/wk × 4000+ specialists`, lang)}
            </div>
          </div>

          <div className="flex-1 rounded-2xl p-5 min-h-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Тижневий час (20 год/тиж)', 'Weekly time (20 h/wk)', lang)}
            </div>
            <div className="space-y-3">
              {TIME_BREAKDOWN.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] ds-display font-semibold" style={{ color: s.clinical ? 'var(--color-ds-text)' : 'var(--color-ds-muted)' }}>
                      {s.label[lang]}
                    </span>
                    <span className="text-[14px] font-bold ds-display" style={{ color: s.clinical ? '#00d4aa' : '#ff9966' }}>
                      {s.hrs}h
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-2 rounded-full" style={{
                      width: `${(s.hrs / TOTAL) * 100}%`,
                      background: s.clinical ? '#00d4aa' : '#ff9966',
                      opacity: s.clinical ? 0.9 : 0.65,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          {/* Structural disproportions: admin burden + inpatient mismatch */}
          <div className="rounded-2xl p-4 flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Структурні диспропорції (× WHO норма = 1.0)', 'Structural disproportions (× WHO norm = 1.0)', lang)}
            </div>
            <div style={{ height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={structData} margin={{ left: 0, right: 8, top: 8, bottom: 4 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--color-ds-muted)', fontSize: 9, fontFamily: 'DM Sans' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide domain={[0, 6]} />
                  <Tooltip
                    formatter={(_v: number, _n: string, p: { payload: { displayValue: string; calc: string } }) => [p.payload.displayValue, p.payload.calc]}
                    contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,153,102,0.3)', borderRadius: 8, fontSize: 10 }}
                  />
                  <ReferenceLine
                    y={1}
                    stroke="rgba(200,164,92,0.5)"
                    strokeDasharray="4 2"
                    label={{ value: t('×1 норма', '×1 norm', lang), position: 'right', fill: 'var(--color-ds-gold)', fontSize: 8 }}
                  />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                    {structData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-1">
              {structData.map((d) => (
                <div key={d.displayValue} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ background: d.fill }} />
                  <span className="text-[10px] font-bold ds-display" style={{ color: d.fill }}>{d.displayValue}</span>
                  <span className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Відновлюваний потенціал', 'Recoverable potential', lang)}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: '+45K', label: { uk: 'сесій/міс при усуненні дублювання', en: 'sessions/mo if duplication removed' } },
                { val: '~$30M', label: { uk: '/рік витрачається на дублювання', en: '/yr spent on duplication' } },
                { val: '5 форм', label: { uk: 'на 1 візит пацієнта', en: 'per single patient visit' } },
                { val: '19K', label: { uk: 'фахівців невидимі у реєстрі НСЗУ', en: 'specialists invisible in NHSU registry' } },
              ].map((m) => (
                <div key={m.val} className="p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,153,102,0.07)', border: '1px solid rgba(255,153,102,0.2)' }}>
                  <div className="text-[18px] font-black ds-display" style={{ color: '#ff9966' }}>{m.val}</div>
                  <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{m.label[lang]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 rounded-2xl p-4"
            style={{ background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.3)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-gold)' }}>
              {t('FEEL Again · Шлях до <5% overhead', 'FEEL Again · Pathway to <5% overhead', lang)}
            </div>
            <div className="space-y-2.5">
              {[
                { uk: 'Єдина цифрова форма: 1 введення → 5 систем автоматично', en: 'Single digital form: 1 entry → 5 systems automatically' },
                { uk: 'Авто-заповнення з реєстрів пацієнтів (NHSU/ESOZ lookup)', en: 'Auto-fill from patient registries (NHSU/ESOZ lookup)' },
                { uk: 'Пакетний експорт звіту МОЗ/НСЗУ — 1 клік замість 5', en: 'Batch MoH/NHSU report export — 1 click instead of 5' },
                { uk: 'Аудит: час витрачений ↔ час оплачений → верифікація', en: 'Audit: time spent ↔ time billed → verification' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                    style={{ background: 'rgba(200,164,92,0.2)', color: 'var(--color-ds-gold)', border: '1px solid rgba(200,164,92,0.4)' }}>
                    {i + 1}
                  </div>
                  <div className="text-[11px] ds-body" style={{ color: 'var(--color-ds-text)' }}>{item[lang]}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--color-ds-border)' }}>
              <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
                {t('Джерело: FEEL Again польові інтерв\'ю 2024 · NHSU специфікація звітності', 'Source: FEEL Again field interviews 2024 · NHSU reporting spec', lang)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
