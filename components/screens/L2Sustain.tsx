import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, CartesianGrid,
} from 'recharts';
import {
  TRAINED_REALITY_DATA,
  WORKFORCE_DATA,
  WAR_IMPACT_DATA,
  NSZU_SNAPSHOT,
} from '../../constants';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

export const L2Sustain: React.FC<Props> = ({ lang, nav }) => {
  const trainedData = TRAINED_REALITY_DATA(lang);
  const workforceData = WORKFORCE_DATA(lang);
  const warData = WAR_IMPACT_DATA(lang);

  const totalAwareness = trainedData.reduce((s, d) => s + d.awareness, 0); // 57,000
  const totalClinical = trainedData.reduce((s, d) => s + d.clinical, 0);   // 700
  const ratio = Math.round(totalAwareness / totalClinical);                 // ~81

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #120a1a 100%)' }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, #8b5cf6, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(167,139,250,0.5)' }} />

      <NavBar
        lang={lang}
        nav={nav}
        accentColor="#a78bfa"
        title={{ uk: 'Місткість кадрів — рівень навчання', en: 'Workforce Capacity — Training Level' }}
        subtitle={{ uk: `Місткість · MHEI w15% · НСЗУ верифіковано ${NSZU_SNAPSHOT.asOf}`, en: `Capacity · MHEI w15% · NHSU verified ${NSZU_SNAPSHOT.asOf}` }}
        crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
      />

      <div className="flex-1 grid grid-cols-2 gap-4 px-6 pb-4 pt-3 min-h-0">

        {/* ── Left: Training reality ── */}
        <div className="flex flex-col gap-3">

          {/* KPI strip */}
          <div className="flex gap-2 flex-shrink-0">
            <div className="flex-1 rounded-2xl p-3"
              style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.3)' }}>
              <div className="text-[9px] font-mono uppercase tracking-wider mb-0.5" style={{ color: '#a78bfa' }}>
                {t('Awareness-рівень', 'Awareness-level', lang)}
              </div>
              <div className="ds-display font-black leading-none" style={{ fontSize: '36px', color: '#a78bfa', textShadow: '0 0 24px rgba(167,139,250,0.5)' }}>
                ~{Math.round(totalAwareness / 1000)}K
              </div>
              <div className="text-[10px] ds-body mt-0.5" style={{ color: 'rgba(200,208,220,0.7)' }}>
                {t('навчених (ПМД + вчителі + НГО)', 'trained (PFA + teachers + NGO)', lang)}
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <div className="px-3 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(249,115,22,0.4)' }}>
                <div className="text-[15px] font-black ds-display leading-none" style={{ color: '#f97316' }}>800</div>
                <div className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{t('психосоціальний', 'psychosocial', lang)}</div>
              </div>
              <div className="px-3 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(167,139,250,0.5)' }}>
                <div className="text-[15px] font-black ds-display leading-none" style={{ color: '#a78bfa' }}>700</div>
                <div className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{t('клінічний', 'clinical', lang)}</div>
              </div>
            </div>
          </div>

          {/* TRAINED_REALITY stacked bar */}
          <div className="flex-1 rounded-2xl p-4 min-h-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Рівень навчання за програмою', 'Training level by program', lang)}
            </div>
            {/* Legend */}
            <div className="flex gap-3 mb-2">
              {[
                { color: '#60a5fa', label: t('Awareness', 'Awareness', lang) },
                { color: '#f97316', label: t('Психосоц.', 'Psychosoc.', lang) },
                { color: '#a78bfa', label: t('Клінічний', 'Clinical', lang) },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                  <span className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div className="h-[calc(100%-52px)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trainedData} layout="vertical" margin={{ left: 4, right: 50, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={115}
                    tick={{ fill: 'var(--color-ds-muted)', fontSize: 9, fontFamily: 'DM Sans' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ background: '#1a2035', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, fontSize: 11 }}
                    formatter={(v: number, name: string) => [v.toLocaleString(), name]}
                  />
                  <Bar dataKey="awareness" name={t('Awareness', 'Awareness', lang)} stackId="a" fill="#60a5fa" />
                  <Bar dataKey="psychosocial" name={t('Психосоціальний', 'Psychosocial', lang)} stackId="a" fill="#f97316" />
                  <Bar dataKey="clinical" name={t('Клінічний', 'Clinical', lang)} stackId="a" fill="#a78bfa" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Missing middle callout */}
          <div className="flex-shrink-0 p-3 rounded-xl"
            style={{ background: 'rgba(255,123,110,0.08)', border: '1px solid rgba(255,123,110,0.3)' }}>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-black ds-display" style={{ color: '#ff7b6e' }}>{ratio}:1</span>
              <span className="text-[12px] ds-body" style={{ color: 'rgba(200,208,220,0.8)' }}>
                {t(
                  `awareness / клінічний — середня амбулаторна ланка НЕ ПОБУДОВАНА (~${Math.round(totalAwareness / 1000)}K awareness-рівень, лише 700 клінічних)`,
                  `awareness / clinical — intermediate ambulatory clinical layer NOT BUILT (~${Math.round(totalAwareness / 1000)}K awareness-level, only 700 clinical)`,
                  lang
                )}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: workforce + war impact + FEEL Again ── */}
        <div className="flex flex-col gap-3">

          {/* Workforce chart: UA vs EU vs WHO */}
          <div className="rounded-2xl p-4 flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Фахівці на 100K населення', 'Specialists per 100K population', lang)}
            </div>
            <div style={{ height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workforceData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--color-ds-muted)', fontSize: 10, fontFamily: 'DM Sans' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#1a2035', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, fontSize: 11 }}
                  />
                  <Bar dataKey="Ukraine" name="Ukraine" fill="#a78bfa" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="EU" name="EU" fill="rgba(167,139,250,0.35)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="WHO" name={t('ВООЗ норма', 'WHO norm', lang)} fill="rgba(200,164,92,0.5)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-1">
              {[
                { color: '#a78bfa', label: 'Ukraine' },
                { color: 'rgba(167,139,250,0.5)', label: 'EU' },
                { color: 'rgba(200,164,92,0.7)', label: t('ВООЗ норма', 'WHO norm', lang) },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                  <span className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WAR IMPACT: workforce declining */}
          <div className="rounded-2xl p-4 flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Вплив війни на кадри (тис. фахівців)', 'War impact on workforce (thousands)', lang)}
            </div>
            <div style={{ height: 80 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={warData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                  <defs>
                    <linearGradient id="gradPsych2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--color-ds-muted)', fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[25, 45]} />
                  <Tooltip
                    contentStyle={{ background: '#1a2035', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, fontSize: 11 }}
                  />
                  <Area type="monotone" dataKey="psych" name={t('Психіатри', 'Psychiatrists', lang)}
                    stroke="#a78bfa" strokeWidth={2} fill="url(#gradPsych2)" dot={{ fill: '#a78bfa', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[9px] font-mono mt-1" style={{ color: '#ff7b6e' }}>
              {t('↓ 40.0K → 30.9K psychiatrists (−23% with 01.2022)', '↓ 40.0K → 30.9K psychiatrists (−23% since 01.2022)', lang)}
            </div>
          </div>

          {/* FEEL Again — build the missing middle */}
          <div className="flex-1 rounded-2xl p-4 min-h-0"
            style={{ background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.3)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-gold)' }}>
              {t('FEEL Again · Train for Care · Побудувати середню ланку', 'FEEL Again · Train for Care · Build the missing middle', lang)}
            </div>
            <div className="space-y-2.5">
              {[
                { uk: `Реєстр активних практиків (зараз: ${NSZU_SNAPSHOT.mhDoctors.toLocaleString()} у НСЗУ → ціль: видимість 25K)`, en: `Active practitioner registry (now: ${NSZU_SNAPSHOT.mhDoctors.toLocaleString()} in NHSU → target: 25K visible)` },
                { uk: 'Карʼєрний трек: awareness → психосоціальний → клінічний (modular upgrade)', en: 'Career track: awareness → psychosocial → clinical (modular upgrade)' },
                { uk: 'Peer-supervision network: 1 супервізор на 8 практиків → утримання навичок', en: 'Peer-supervision network: 1 supervisor per 8 practitioners → skill retention' },
                { uk: 'Дані: хто навчений на якому рівні → видимість у ЄСОЗ → outcome-виплата', en: 'Data: who trained at which level → visibility in ESOZ → outcome payment' },
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
              <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
                {t(`Джерело: UNICEF 2023 · UNESCO MHPSS · NaUKMA · ВООЗ mhGAP 2023 · НСЗУ портал ${NSZU_SNAPSHOT.asOf}`, `Source: UNICEF 2023 · UNESCO MHPSS · NaUKMA · WHO mhGAP 2023 · NHSU portal ${NSZU_SNAPSHOT.asOf}`, lang)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
