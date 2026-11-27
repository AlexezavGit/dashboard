import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';
import { L3Footer } from './L3Footer';
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
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #120a1a 100%)' }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-ds-teal-light), #8b5cf6, rgba(201,179,106,0.4))', boxShadow: '0 0 18px rgba(44,110,100,0.5)' }} />

      <NavBar
        lang={lang}
        nav={nav}
        accentColor="var(--color-ds-teal-light)"
        title={{ uk: 'Місткість кадрів — рівень навчання', en: 'Workforce Capacity — Training Level' }}
        subtitle={{ uk: `Місткість · НСЗУ верифіковано ${NSZU_SNAPSHOT.asOf}`, en: `Capacity · NHSU verified ${NSZU_SNAPSHOT.asOf}` }}
        crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 px-6 pb-4 pt-3 min-h-0">

        {/* ── Left: Training reality ── */}
        <div className="flex flex-col gap-3 min-h-0 overflow-hidden">

          {/* 3-layer workforce model */}
          <div className="flex-shrink-0 rounded-2xl p-3"
            style={{ background: 'var(--color-ds-well)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('3 шари кадрового ландшафту', '3-layer workforce landscape', lang)}
            </div>
            <div className="flex flex-col gap-1.5">
              {([
                {
                  layer: 'А',
                  label: { uk: 'WHO Atlas (1.3/100K)', en: 'WHO Atlas (1.3/100K)' },
                  val: '~4,300',
                  sub: { uk: 'реєстровані психіатри + психологи', en: 'registered psychiatrists + psychologists' },
                  color: 'var(--color-cyber-cyan)',
                  barPct: 66,
                },
                {
                  layer: 'Б',
                  label: { uk: 'НСЗУ верифіковано', en: 'NHSU verified' },
                  val: '943',
                  sub: { uk: '0.28% — активні контракти → видимі системі', en: '0.28% — active contracts → system-visible' },
                  color: 'var(--color-ds-teal-light)',
                  barPct: 22,
                },
                {
                  layer: 'В',
                  label: { uk: 'Тіньовий сектор', en: 'Shadow sector' },
                  val: '~6,500',
                  sub: { uk: 'практикують поза НСЗУ (НГО / приватно)', en: 'practising outside NHSU (NGO / private)' },
                  color: 'var(--color-ds-orange)',
                  barPct: 100,
                },
              ] as const).map((row) => (
                <div key={row.layer}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-bold w-4 text-center rounded" style={{ color: row.color, background: `color-mix(in srgb, ${row.color} 13%, transparent)` }}>{row.layer}</span>
                    <span className="text-[10px] font-mono" style={{ color: row.color }}>{row.label[lang]}</span>
                    <span className="ml-auto text-[14px] font-black ds-display leading-none" style={{ color: row.color }}>{row.val}</span>
                  </div>
                  <div className="h-1.5 rounded-full mb-0.5" style={{ background: 'var(--color-ds-track)' }}>
                    <div className="h-full rounded-full" style={{ width: `${row.barPct}%`, background: row.color, opacity: 0.75 }} />
                  </div>
                  <div className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{row.sub[lang]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TRAINED_REALITY stacked bar */}
          <div className="flex-1 rounded-2xl p-4 min-h-0 overflow-hidden"
            style={{ background: 'var(--color-ds-well)', border: '1px solid var(--color-ds-border)', maxHeight: '200px' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Рівень навчання за програмою', 'Training level by program', lang)}
            </div>
            {/* Legend */}
            <div className="flex gap-3 mb-2">
              {[
                { color: 'var(--color-cyber-cyan)', label: t('Awareness', 'Awareness', lang) },
                { color: 'var(--color-ds-orange)', label: t('Психосоц.', 'Psychosoc.', lang) },
                { color: 'var(--color-ds-teal-light)', label: t('Клінічний', 'Clinical', lang) },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                  <span className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{l.label}</span>
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
                    tick={{ fill: '#94a3b8', fontSize: 9, fontFamily: 'Source Sans 3' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-ds-surface)', border: '1px solid var(--color-ds-border)', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: 'var(--color-ds-teal-light)' }}
                    itemStyle={{ color: 'var(--color-ds-text)' }}
                    formatter={(v: number, name: string) => [v.toLocaleString(), name]}
                  />
                  <Bar dataKey="awareness" name={t('Awareness', 'Awareness', lang)} stackId="a" fill="#3E91A2" />
                  <Bar dataKey="psychosocial" name={t('Психосоціальний', 'Psychosocial', lang)} stackId="a" fill="#D35F1E" />
                  <Bar dataKey="clinical" name={t('Клінічний', 'Clinical', lang)} stackId="a" fill="#2C6E64" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Missing middle callout */}
          <div className="flex-shrink-0 p-3 rounded-xl"
            style={{ background: 'rgba(255,123,110,0.08)', border: '1px solid rgba(255,123,110,0.3)' }}>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-black ds-display" style={{ color: 'var(--color-ds-red)' }}>{ratio}:1</span>
              <span className="text-[12px] ds-body" style={{ color: 'var(--color-ds-text)' }}>
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
            style={{ background: 'var(--color-ds-well)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Фахівці на 100K населення', 'Specialists per 100K population', lang)}
            </div>
            <div style={{ height: 110 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workforceData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Source Sans 3' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-ds-surface)', border: '1px solid var(--color-ds-border)', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: 'var(--color-ds-teal-light)' }}
                    itemStyle={{ color: 'var(--color-ds-text)' }}
                  />
                  <Bar dataKey="Ukraine" name="Ukraine" fill="#2C6E64" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="EU" name="EU" fill="rgba(44,110,100,0.35)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="WHO" name={t('ВООЗ норма', 'WHO norm', lang)} fill="rgba(201,179,106,0.5)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-1">
              {[
                { color: 'var(--color-ds-teal-light)', label: 'Ukraine' },
                { color: 'rgba(44,110,100,0.5)', label: 'EU' },
                { color: 'rgba(201,179,106,0.7)', label: t('ВООЗ норма', 'WHO norm', lang) },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                  <span className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* WAR IMPACT: workforce declining */}
          <div className="rounded-2xl p-4 flex-shrink-0"
            style={{ background: 'var(--color-ds-well)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Вплив війни на кадри (тис. фахівців)', 'War impact on workforce (thousands)', lang)}
            </div>
            <div style={{ height: 80 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={warData} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
                  <defs>
                    <linearGradient id="gradPsych2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-ds-teal-light)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-ds-teal-light)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} />
                  <YAxis hide domain={[25, 45]} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-ds-surface)', border: '1px solid var(--color-ds-border)', borderRadius: 8, fontSize: 11 }}
                    labelStyle={{ color: 'var(--color-ds-teal-light)' }}
                    itemStyle={{ color: 'var(--color-ds-text)' }}
                  />
                  <Area type="monotone" dataKey="psych" name={t('Психіатри', 'Psychiatrists', lang)}
                    stroke="#2C6E64" strokeWidth={2} fill="url(#gradPsych2)" dot={{ fill: '#2C6E64', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--color-ds-red)' }}>
              {t('↓ 40.0K → 30.9K psychiatrists (−23% with 01.2022)', '↓ 40.0K → 30.9K psychiatrists (−23% since 01.2022)', lang)}
            </div>
          </div>

          {/* FEEL Again — build the missing middle */}
          <div className="flex-1 rounded-2xl p-4 min-h-0"
            style={{ background: 'rgba(201,179,106,0.06)', border: '1px solid rgba(201,179,106,0.3)' }}>
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
                    style={{ background: 'rgba(201,179,106,0.2)', color: 'var(--color-ds-gold)', border: '1px solid rgba(201,179,106,0.4)' }}>
                    {i + 1}
                  </div>
                  <div className="text-[11px] ds-body" style={{ color: 'var(--color-ds-text)' }}>{item[lang]}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--color-ds-border)' }}>
              <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
                {t(`Джерело: UNICEF 2023 · UNESCO MHPSS · NaUKMA · ВООЗ mhGAP 2023 · НСЗУ портал ${NSZU_SNAPSHOT.asOf}`, `Source: UNICEF 2023 · UNESCO MHPSS · NaUKMA · WHO mhGAP 2023 · NHSU portal ${NSZU_SNAPSHOT.asOf}`, lang)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <L3Footer lang={lang} nav={nav} />
    </div>
  );
};
