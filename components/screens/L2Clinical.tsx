import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line, CartesianGrid, ReferenceLine,
} from 'recharts';
import { PREVALENCE_DATA } from '../../constants';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

const DRIVERS = [
  { icon: '⟶', val: { uk: '5 систем, 0 синхронізацій', en: '5 systems, 0 syncs' }, desc: { uk: 'NHSU / ESOZ / HELSI / Reint. Portal / приватні ЕМК', en: 'NHSU / ESOZ / HELSI / Reint. Portal / private EHRs' } },
  { icon: '⊘', val: { uk: 'Немає авто-нагадувань', en: 'No auto-reminders' }, desc: { uk: 'Пацієнт зникає — системи не сповіщають', en: 'Patient disappears — no system alert' } },
  { icon: '⊜', val: { uk: '260K НСЗУ пацієнтів 2025', en: '260K NHSU patients 2025' }, desc: { uk: 'тільки первинна ланка видима НСЗУ', en: 'only primary care visible to NHSU' } },
];

export const L2Clinical: React.FC<Props> = ({ lang, nav }) => {
  const prevData = PREVALENCE_DATA(lang);
  const dropData = [
    { session: t('Сесія 1', 'Session 1', lang), actual: 85 },
    { session: t('Сесія 3', 'Session 3', lang), actual: 55 },
    { session: t('Сесія 6', 'Session 6', lang), actual: 40 },
  ];

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a0808 100%)' }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, #ff7b6e, #ff4444, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(255,123,110,0.5)' }} />

      <NavBar
        lang={lang}
        nav={nav}
        accentColor="#ff7b6e"
        title={{ uk: 'Завершуваність реабілітації', en: 'Rehabilitation completion' }}
        subtitle={{ uk: 'Clinical · MHEI w25% · ціль ≥80%', en: 'Clinical · MHEI w25% · target ≥80%' }}
        crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
      />

      <div className="flex-1 grid grid-cols-2 gap-5 px-6 pb-4 pt-3 min-h-0">
        <div className="flex flex-col gap-4">

          {/* KPI */}
          <div className="rounded-2xl p-5 flex-shrink-0"
            style={{ background: 'rgba(224,85,69,0.08)', border: '1px solid rgba(255,123,110,0.3)' }}>
            <div className="ds-display font-black leading-none" style={{ fontSize: '72px', color: '#ff7b6e', textShadow: '0 0 40px rgba(255,123,110,0.5)' }}>
              ~40%
            </div>
            <div className="text-[15px] font-semibold ds-body mt-2" style={{ color: 'rgba(200,208,220,0.9)' }}>
              {t('епізодів завершено / розпочато', 'episodes completed / initiated', lang)}
            </div>
            <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Епізод = ≥6 сесій / ≥3 міс. (mhGAP)', 'Episode = ≥6 sessions / ≥3 mo. (mhGAP)', lang)}
            </div>
          </div>

          {/* PREVALENCE bar chart */}
          <div className="flex-1 rounded-2xl p-4 min-h-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Поширеність розладів (Lancet 2023, % обстежених)', 'Disorder prevalence (Lancet 2023, % of surveyed)', lang)}
            </div>
            <div className="h-[calc(100%-28px)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prevData} layout="vertical" margin={{ left: 8, right: 50, top: 4, bottom: 4 }}>
                  <XAxis type="number" hide domain={[0, 50]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fill: 'var(--color-ds-muted)', fontSize: 10, fontFamily: 'DM Sans' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, t('Поширеність', 'Prevalence', lang)]}
                    contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,123,110,0.3)', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: '#ff7b6e' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {prevData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          {/* Drop-off line chart */}
          <div className="rounded-2xl p-4 flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Відсів по протоколу (% що продовжують)', 'Protocol drop-off (% continuing)', lang)}
            </div>
            <div style={{ height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dropData} margin={{ left: 0, right: 48, top: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="session" tick={{ fill: 'var(--color-ds-muted)', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, t('Фактично', 'Actual', lang)]}
                    contentStyle={{ background: '#1a2035', border: '1px solid rgba(255,123,110,0.3)', borderRadius: 8, fontSize: 11 }}
                  />
                  <ReferenceLine
                    y={80}
                    stroke="rgba(200,164,92,0.55)"
                    strokeDasharray="4 2"
                    label={{ value: t('Ціль 80%', 'Target 80%', lang), position: 'right', fill: 'var(--color-ds-gold)', fontSize: 9 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name={t('Фактично', 'Actual', lang)}
                    stroke="#ff7b6e"
                    strokeWidth={2}
                    dot={{ fill: '#ff7b6e', r: 4, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Systemic drivers */}
          <div className="rounded-2xl p-4"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Системні драйвери відсіву', 'Systemic drop-off drivers', lang)}
            </div>
            <div className="space-y-2.5">
              {DRIVERS.map((d, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="text-[18px] leading-none mt-0.5" style={{ color: '#ff7b6e' }}>{d.icon}</div>
                  <div>
                    <div className="text-[13px] font-bold ds-display" style={{ color: 'var(--color-ds-text)' }}>{d.val[lang]}</div>
                    <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{d.desc[lang]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FEEL Again pathway */}
          <div className="flex-1 rounded-2xl p-4 min-h-0"
            style={{ background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.3)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-gold)' }}>
              {t('FEEL Again · Шлях до 80%', 'FEEL Again · Pathway to 80%', lang)}
            </div>
            <div className="space-y-2">
              {[
                { uk: 'Єдиний episode tracker — одна картка, 5 систем', en: 'Unified episode tracker — one record, 5 systems' },
                { uk: 'Авто-нагадування + ескалація при відсіві після сесії 2', en: 'Auto-reminders + escalation on drop-off after session 2' },
                { uk: 'FHIR R4 bridge: NHSU ↔ ESOZ → видимість по всьому епізоду', en: 'FHIR R4 bridge: NHSU ↔ ESOZ → full episode visibility' },
                { uk: 'HL7 CDA export → страховий виплат при завершенні', en: 'HL7 CDA export → insurance disbursement on completion' },
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
                {t('Джерело: NHSU open data 2025 · Lancet 2024 · mhGAP IG v3', 'Source: NHSU open data 2025 · Lancet 2024 · mhGAP IG v3', lang)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
