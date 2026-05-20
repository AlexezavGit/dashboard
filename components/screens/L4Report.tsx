import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Language } from '../../types';
import {
  DUAL_PROJECT_NARRATIVE, HEAL_UKRAINE, THRIVE_PROJECT, HEAL_C4_PROCUREMENT,
  MISSING_MIDDLE, ARCH_FLOW, STAKEHOLDER_MATRIX, COUNTERARGUMENTS,
  ROI_CARDS, SOURCES,
} from '../../constants';

interface Props {
  lang: Language;
  onBack: () => void;
}

const CHAPTERS = [
  { id: 'exec',         uk: 'Виконавче резюме',        en: 'Executive Summary' },
  { id: 'wb',           uk: 'Проєкти Світового банку',  en: 'World Bank Projects' },
  { id: 'methodology', uk: 'Методологія (WB/HNRP)', en: 'Methodology (WB/HNRP)' },
  { id: 'spi',          uk: 'Системні показники (SPI)', en: 'Systemic Indicators (SPI)' },
  { id: 'gaps',         uk: 'Структурні розриви',       en: 'Structural Gaps' },
  { id: 'arch',         uk: 'Архітектура рішення',      en: 'Solution Architecture' },
  { id: 'stakeholders', uk: 'Стейкхолдери',             en: 'Stakeholders' },
  { id: 'risks',        uk: 'Ризики та контраргументи', en: 'Risks & Counter-arguments' },
  { id: 'sources',      uk: 'Джерела',                  en: 'Sources' },
];

export const L4Report: React.FC<Props> = ({ lang, onBack }) => {
  const [chapter, setChapter] = useState('exec');
  const uk = lang === 'uk';
  const t = (u: string, e: string) => uk ? u : e;

  const heal = HEAL_UKRAINE(lang);
  const thrive = THRIVE_PROJECT(lang);
  const c4 = HEAL_C4_PROCUREMENT(lang);
  const middle = MISSING_MIDDLE(lang);
  const arch = ARCH_FLOW(lang);
  const stakeholders = STAKEHOLDER_MATRIX(lang);
  const risks = COUNTERARGUMENTS(lang);
  const roi = ROI_CARDS(lang);
  const sources = [...SOURCES.primary, ...SOURCES.secondary];

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden flex flex-col" style={{ background: 'var(--color-ds-bg)', color: 'var(--color-ds-text)' }}>

      {/* ── TOP BAR ── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 pt-4 pb-3" style={{ borderBottom: '1px solid var(--color-ds-border)' }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold ds-display transition-all flex-shrink-0"
          style={{ background: 'rgba(200,164,92,0.18)', border: '2px solid var(--color-ds-gold)', color: 'var(--color-ds-gold)', fontSize: 13, minWidth: 90 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,164,92,0.32)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,164,92,0.18)'; }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Назад', 'Back')}
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          <span>{t('Огляд', 'Overview')}</span>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: 'var(--color-ds-gold)' }}>{t('Аналітичний звіт (повний)', 'Analytical Report (full)')}</span>
        </div>

        {/* Chapter tabs */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max ml-4">
            {CHAPTERS.map(c => (
              <button
                key={c.id}
                onClick={() => setChapter(c.id)}
                className="px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wide transition-all whitespace-nowrap"
                style={chapter === c.id
                  ? { background: 'var(--color-ds-gold)', color: '#0a1628' }
                  : { color: 'var(--color-ds-muted)', border: '1px solid var(--color-ds-border)' }}
              >
                {uk ? c.uk : c.en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[960px] mx-auto w-full space-y-10">

        {chapter === 'exec' && (
          <>
            <Section title={t('Виконавче резюме', 'Executive Summary')} color="var(--color-ds-gold)">
              <p className="text-[13px] leading-relaxed ds-body" style={{ color: 'var(--color-ds-muted)' }}>
                {DUAL_PROJECT_NARRATIVE(lang)}
              </p>
            </Section>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: t('Портфель WB', 'WB Portfolio'), val: '$954M', sub: 'HEAL + THRIVE', color: 'var(--color-ds-gold)' },
                { label: t('МЗ-послуги HEAL', 'HEAL MH services'), val: '624,464', sub: t('осіб', 'people'), color: 'var(--color-ds-teal)' },
                { label: t('Покриття ЕСОЗ', 'ESOZ coverage'), val: '0%', sub: t('гуманітарних сесій', 'humanitarian sessions'), color: 'var(--color-ds-red)' },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-5 text-center" style={{ border: `1px solid ${m.color}33`, background: `${m.color}08` }}>
                  <div className="text-[32px] font-bold ds-display" style={{ color: m.color }}>{m.val}</div>
                  <div className="text-[10px] font-mono uppercase tracking-wider mt-1" style={{ color: 'var(--color-ds-muted)' }}>{m.label}</div>
                  <div className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>{m.sub}</div>
                </div>
              ))}
            </div>
            <Section title={t('ROI — обґрунтування інвестицій', 'ROI — investment rationale')} color="var(--color-ds-teal)">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {roi.map((r: any) => (
                  <div key={r.source} className="rounded-lg p-4 space-y-2" style={{ border: `1px solid ${r.color}33`, background: `${r.color}08` }}>
                    <div className="text-[10px] font-mono font-bold uppercase" style={{ color: r.color }}>{r.source}</div>
                    <div className="text-[22px] font-bold ds-display" style={{ color: r.color }}>{r.roi}</div>
                    <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-ds-muted)' }}>{r.desc}</p>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {chapter === 'spi' && (
          <div className="space-y-8">
            <Section title={t('Системні показники відновлення (SPI)', 'Systemic Performance Indicators (SPI)')} color="var(--color-ds-teal)">
              <div className="space-y-6">
                {[
                  {
                    num: '1',
                    label: t('Дані та Координація (Фрагментованість)', 'Data & Coordination (Fragmentation)'),
                    val: '48–76M год/рік',
                    desc: t(
                      'Неможливо координувати 3.9 млн осіб у напівручному режимі. Відсутність єдиного відкритого набору даних створює адміністративний параліч.',
                      'Impossible to coordinate 3.9M people semi-manually. Absence of a unified open dataset creates administrative paralysis.'
                    )
                  },
                  {
                    num: '2',
                    label: t('Доступність: Шлях Бенефіціара', 'Access: Beneficiary Pathway'),
                    val: 'Low Continuity',
                    desc: t(
                      'Втрата даних при переході шпиталь ↔ цивільний сектор. Повторне травмування через постійне нагадування анамнезу.',
                      'Data loss during hospital ↔ civilian transition. Retraumatization due to constant anamnesis repetition.'
                    )
                  },
                  {
                    num: '3',
                    label: t('Рівність та Гідність', 'Equity & Dignity'),
                    val: 'Free Choice',
                    desc: t(
                      'Вільне обирання фахівця без залежності від розміру гонорару. Доступ до фінансування для кожного бенефіціара.',
                      'Free choice of specialist regardless of fee size. Access to funding for every beneficiary.'
                    )
                  },
                  {
                    num: '4',
                    label: t('Якість послуг (Протоколи)', 'Service Quality (Protocols)'),
                    val: 'Bravemind VR',
                    desc: t(
                      'Відповідність клінічним стандартам. Залучення VR-технологій для підвищення ефективності та зменшення кількості сеансів.',
                      'Compliance with clinical standards. Using VR technologies to increase efficiency and reduce session count.'
                    )
                  },
                  {
                    num: '5',
                    label: t('Своєчасність (Місткість)', 'Timeliness (Capacity)'),
                    val: 'Conversion Rate',
                    desc: t(
                      'Ефективність конверсії навчання у реальну практику. Подолання нестачі містості через технологічну оптимізацію.',
                      'Efficiency of training-to-practice conversion. Overcoming capacity shortages via technological optimization.'
                    )
                  },
                  {
                    num: '6',
                    label: t('Попит та Дія (Стигма)', 'Demand & Action (Stigma)'),
                    val: '54% Stigma',
                    desc: t(
                      '3.9 млн потребують супроводу. Трансформація стигми: "не на часі" або "дорого" — це бар\'єри, які ми знімаємо.',
                      '3.9M need support. Stigma transformation: "not the time" or "expensive" are barriers we eliminate.'
                    )
                  },
                  {
                    num: '7',
                    label: t('Завершуваність (Dropouts)', 'Completion (Dropouts)'),
                    val: '54% Dropout',
                    desc: t(
                      'Велика кількість дропаутів після першого сеансу. Необхідність проактивного супроводу до завершення курсу.',
                      'High dropout rate after the first session. Need for proactive support until course completion.'
                    )
                  },
                  {
                    num: '8',
                    label: t('Простежуваність (GDP Impact)', 'Traceability (GDP Impact)'),
                    val: '$8B+ Loss',
                    desc: t(
                      'Вплив на ВВП у 2020 році — $8 млрд. Під час війни цей показник зростає драматично. Системний вплив ніколи не вимірювався в Україні.',
                      'GDP impact in 2020 — $8B. During war, this grows dramatically. Systemic impact has never been measured in Ukraine.'
                    )
                  },
                  {
                    num: '9',
                    label: t('Ліквідність та Фінансування', 'Liquidity & Financing'),
                    val: 'Multi-channel',
                    desc: t(
                      'Консолідація ресурсів на конкретному бенефіціарі. Змішане де-ризиковане фінансування знижує бар\'єри для донорів.',
                      'Resource consolidation per specific beneficiary. Blended de-risked financing lowers barriers for donors.'
                    )
                  }
                ].map(spi => (
                  <div key={spi.num} className="rounded-xl p-5 border border-white/5 bg-white/2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-cyber-teal/20 text-cyber-teal flex items-center justify-center text-[10px] font-bold border border-cyber-teal/30">{spi.num}</span>
                        <span className="text-[13px] font-bold ds-display">{spi.label}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-cyber-gold/10 text-cyber-gold border border-cyber-gold/20">{spi.val}</span>
                    </div>
                    <p className="text-[11px] opacity-70 leading-relaxed ds-body pl-9">{spi.desc}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {chapter === 'methodology' && (
          <div className="space-y-10">
            <Section title={t('Методологічна синхронізація', 'Methodological Alignment')} color="var(--color-ds-teal)">
              <div className="space-y-6 text-[13px] ds-body leading-relaxed text-[--color-ds-muted]">
                <div className="p-4 bg-[--color-ds-teal]/5 border border-[--color-ds-teal]/20 rounded-xl">
                  <h4 className="text-[--color-ds-teal] font-bold uppercase tracking-widest text-[10px] mb-2">Standard 1: World Bank OneHealth Tool</h4>
                  <p>
                    {t(
                      'Всі розрахунки ROI та економічного впливу базуються на параметрах WHO OneHealth Tool, використаних Світовим банком для інвестиційного кейсу психічного здоров\'я в Україні. Ми використовуємо коефіцієнт повернення інвестицій 1:4 та середню вартість успішного курсу лікування $350.',
                      'All ROI and economic impact calculations are based on WHO OneHealth Tool parameters used by the World Bank for the mental health investment case in Ukraine. We apply the 1:4 ROI multiplier and a $350 average successful treatment course cost.'
                    )}
                  </p>
                </div>

                <div className="p-4 bg-[--color-ds-gold]/5 border border-[--color-ds-gold]/20 rounded-xl">
                  <h4 className="text-[--color-ds-gold] font-bold uppercase tracking-widest text-[10px] mb-2">Standard 2: OCHA HNRP 2025 Standard</h4>
                  <p>
                    {t(
                      'Показники охоплення (Reached) та цільові групи синхронізовані з Планом гуманітарних потреб та реагування (HNRP) 2025. Визначено 3.5 млн осіб з клінічними потребами та цільове охоплення 1.2 млн осіб для гуманітарного кластеру здоров\'я та UNICEF.',
                      'Coverage (Reached) metrics and target groups are synchronized with the 2025 Humanitarian Needs and Response Plan (HNRP). Identified 3.5M people with clinical needs and a 1.2M target reach for the Health Cluster and UNICEF.'
                    )}
                  </p>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <h4 className="text-[--color-ds-text] font-bold uppercase tracking-widest text-[10px] mb-2">Standard 3: Gap Analysis Methodology</h4>
                  <p>
                    {t(
                      'Аналіз розривів базується на порівнянні даних НСЗУ (офіційна система охорони здоров\'я) та даних гуманітарних акторів. "Missing Middle" розрив у 60% верифікується як критична зона операційного ризику для портфелів HEAL та THRIVE.',
                      'Gap analysis is based on comparing NHSU data (official healthcare system) with humanitarian actor data. The "Missing Middle" gap of 60% is verified as a critical operational risk zone for the HEAL and THRIVE portfolios.'
                    )}
                  </p>
                </div>
              </div>
            </Section>
          </div>
        )}

        {chapter === 'wb' && (
          <>
            <Section title={heal.project} color="var(--color-ds-gold)">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { l: t('Загальний конверт', 'Total envelope'), v: heal.total },
                  { l: t('Дисбурсовано', 'Disbursed'), v: `${heal.disbursed} (${heal.disbursedPct}%)` },
                  { l: t('Механізм', 'Mechanism'), v: heal.mechanism },
                  { l: t('Закриття', 'Closing'), v: heal.closing },
                ].map(m => (
                  <Metric key={m.l} label={m.l} value={m.v} />
                ))}
              </div>
              <Callout color="var(--color-ds-gold)">{heal.insight}</Callout>
              <p className="text-[12px] mt-4 leading-relaxed" style={{ color: 'var(--color-ds-muted)' }}>{heal.synergy}</p>
              <div className="mt-6">
                <div className="text-[10px] font-mono font-bold uppercase mb-3" style={{ color: 'var(--color-ds-muted)' }}>KPI HEAL ISR #6 (25-Mar-2026)</div>
                <table className="w-full text-[11px]">
                  <thead><tr style={{ color: 'var(--color-ds-muted)', borderBottom: '1px solid var(--color-ds-border)' }}>
                    <th className="text-left py-2 font-mono font-bold uppercase text-[9px]">{t('Показник', 'Indicator')}</th>
                    <th className="text-right py-2 font-mono font-bold uppercase text-[9px]">{t('Ціль', 'Target')}</th>
                    <th className="text-right py-2 font-mono font-bold uppercase text-[9px]">{t('Факт', 'Actual')}</th>
                    <th className="text-right py-2 font-mono font-bold uppercase text-[9px]">%</th>
                  </tr></thead>
                  <tbody>
                    {heal.kpis.map((k: any) => (
                      <tr key={k.name} style={{ borderBottom: '1px solid var(--color-ds-border)' }}>
                        <td className="py-2" style={{ color: 'var(--color-ds-text)' }}>{k.name}</td>
                        <td className="py-2 text-right font-mono" style={{ color: 'var(--color-ds-muted)' }}>{k.target.toLocaleString()}</td>
                        <td className="py-2 text-right font-mono font-bold" style={{ color: k.status === 'exceeded' ? 'var(--color-ds-teal)' : 'var(--color-ds-red)' }}>{k.actual.toLocaleString()}</td>
                        <td className="py-2 text-right font-mono font-bold" style={{ color: k.status === 'exceeded' ? 'var(--color-ds-teal)' : 'var(--color-ds-red)' }}>{k.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title={`THRIVE ${thrive.id}`} color="var(--color-ds-teal)">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { l: t('Загальний конверт', 'Total'), v: thrive.total },
                  { l: t('Дисбурсовано', 'Disbursed'), v: `${thrive.disbursed} (${thrive.disbursedPct}%)` },
                  { l: t('Механізм', 'Mechanism'), v: thrive.mechanism },
                  { l: t('Підписано', 'Signed'), v: thrive.signed },
                ].map(m => (<Metric key={m.l} label={m.l} value={m.v} />))}
              </div>
              <Callout color="var(--color-ds-red)">{thrive.critical}</Callout>
              <p className="text-[12px] mt-3 leading-relaxed" style={{ color: 'var(--color-ds-muted)' }}>{thrive.advance}</p>
            </Section>

            <Section title={`HEAL C4 — ${c4.budget} ${t('Діджиталізація', 'Digitalization')}`} color="#8B5CF6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Metric label={t('Бюджет', 'Budget')} value={c4.budget} />
                <Metric label={t('Закуплено', 'Procured')} value={c4.procured} />
                <Metric label={t('Незакуплено', 'Unallocated')} value={c4.unallocated} />
              </div>
              <Callout color="#8B5CF6">{c4.note}</Callout>
              <p className="text-[12px] mt-3 leading-relaxed" style={{ color: 'var(--color-ds-muted)' }}>{c4.accessMechanism}</p>
            </Section>
          </>
        )}

        {chapter === 'gaps' && (
          <>
            {[middle.clinical, middle.financial, middle.humanitarian, middle.coordination].map((g: any, i: number) => (
              <Section key={i} title={g.title} color="var(--color-ds-teal)">
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-ds-muted)' }}>{g.desc}</p>
                {g.items && (
                  <ul className="mt-4 space-y-2">
                    {g.items.map((item: any) => (
                      <li key={item.label} className="flex gap-3 text-[12px]">
                        <span className="font-bold flex-shrink-0" style={{ color: 'var(--color-ds-teal)' }}>→</span>
                        <span><strong style={{ color: 'var(--color-ds-text)' }}>{item.label}</strong> — <span style={{ color: 'var(--color-ds-muted)' }}>{item.desc}</span></span>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            ))}
          </>
        )}

        {chapter === 'arch' && (
          <>
            <Section title={t('Потік даних: гуманітарна → державна зона', 'Data flow: humanitarian → state zone')} color="var(--color-ds-teal)">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-[12px]">
                <div className="rounded-xl p-5 space-y-3" style={{ border: '1px solid var(--color-ds-teal)33', background: 'var(--color-ds-teal)08' }}>
                  <div className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--color-ds-teal)' }}>{arch.humanitarian.label}</div>
                  {arch.humanitarian.sources.map((s: string) => (
                    <div key={s} className="text-[11px]" style={{ color: 'var(--color-ds-muted)' }}>· {s}</div>
                  ))}
                  {arch.humanitarian.highlights.map((h: string) => (
                    <div key={h} className="text-[11px] font-bold" style={{ color: 'var(--color-ds-teal)' }}>{h}</div>
                  ))}
                </div>
                <div className="rounded-xl p-5 space-y-2" style={{ border: '1px solid var(--color-ds-gold)33', background: 'var(--color-ds-gold)08' }}>
                  <div className="text-[10px] font-mono font-bold uppercase whitespace-pre-line" style={{ color: 'var(--color-ds-gold)' }}>{arch.middleware.label}</div>
                  {arch.middleware.components.map((c: string) => (
                    <div key={c} className="text-[11px]" style={{ color: 'var(--color-ds-muted)' }}>· {c}</div>
                  ))}
                </div>
                <div className="rounded-xl p-5 space-y-2" style={{ border: '1px solid #3B82F633', background: '#3B82F608' }}>
                  <div className="text-[10px] font-mono font-bold uppercase" style={{ color: '#3B82F6' }}>{arch.state.label}</div>
                  {arch.state.systems.map((s: any) => (
                    <div key={s.name} className="text-[11px] font-bold" style={{ color: s.color }}>· {s.name} {s.sub && <span className="font-normal opacity-60">({s.sub})</span>}</div>
                  ))}
                </div>
              </div>
            </Section>
          </>
        )}

        {chapter === 'stakeholders' && (
          <Section title={t('Матриця стейкхолдерів', 'Stakeholder Matrix')} color="var(--color-ds-gold)">
            <div className="space-y-3">
              {stakeholders.map((s: any) => (
                <div key={s.stakeholder} className="rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ border: '1px solid var(--color-ds-border)', background: 'var(--color-ds-surface)' }}>
                  <div className="font-bold text-[12px] ds-display" style={{ color: 'var(--color-ds-gold)' }}>{s.stakeholder}</div>
                  <div className="text-[11px] leading-relaxed" style={{ color: 'var(--color-ds-muted)' }}><span className="font-bold" style={{ color: 'var(--color-ds-red)' }}>Pain:</span> {s.pain}</div>
                  <div className="text-[11px] leading-relaxed" style={{ color: 'var(--color-ds-muted)' }}><span className="font-bold" style={{ color: 'var(--color-ds-teal)' }}>Gain:</span> {s.gain}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {chapter === 'risks' && (
          <Section title={t('Ризики та контраргументи', 'Risks & Counter-arguments')} color="var(--color-ds-red)">
            <div className="space-y-4">
              {risks.map((r: any, i: number) => (
                <div key={i} className="rounded-lg p-4" style={{ border: '1px solid var(--color-ds-border)', background: 'var(--color-ds-surface)' }}>
                  <div className="font-bold text-[12px] mb-2" style={{ color: 'var(--color-ds-red)' }}>⚠ {r.risk ?? r.objection ?? r.label ?? `Risk ${i + 1}`}</div>
                  <div className="text-[11px] leading-relaxed" style={{ color: 'var(--color-ds-muted)' }}>{r.counter ?? r.response ?? r.answer ?? ''}</div>
                </div>
              ))}
            </div>
          </Section>
        )}
        {chapter === 'conclusions' && (
          <div className="space-y-10">
            <Section title={t('Висновок 1: Скидання адміністративної ерозії', 'Conclusion 1: Resetting Administrative Erosion')} color="var(--color-ds-teal)">
              <div className="ds-body text-[13px] leading-relaxed space-y-4" style={{ color: 'var(--color-ds-muted)' }}>
                <p>
                  {t(
                    'Поточна модель звітування в гуманітарному секторі призводить до втрати 25% робочого часу 3,500 клінічних психологів. Це еквівалентно 1.4 млн втрачених клінічних сесій на рік.',
                    'Current reporting models in the humanitarian sector lead to a 25% loss of working time for 3,500 clinical psychologists. This is equivalent to 1.4M lost clinical sessions per year.'
                  )}
                </p>
                <div className="bg-cyber-success/5 border border-cyber-success/30 rounded-xl p-6">
                  <div className="text-[10px] font-mono font-bold uppercase mb-2" style={{ color: 'var(--color-ds-teal)' }}>
                    {t('Економічний ефект автоматизації', 'Economic Effect of Automation')}
                  </div>
                  <div className="text-[28px] font-bold ds-display" style={{ color: 'var(--color-ds-text)' }}>
                    {t('+$60 млн / рік', '+$60M / year')}
                  </div>
                  <p className="text-[11px] mt-1 opacity-70">
                    {t('Повернена клінічна ємність без залучення нових кадрів.', 'Recovered clinical capacity without new staff recruitment.')}
                  </p>
                </div>
              </div>
            </Section>

            <Section title={t('Висновок 2: Відповідність Grand Bargain 3.0', 'Conclusion 2: Grand Bargain 3.0 Compliance')} color="var(--color-ds-gold)">
              <div className="ds-body text-[13px] leading-relaxed space-y-4" style={{ color: 'var(--color-ds-muted)' }}>
                <p>
                  {t(
                    'Перехід від паралельних систем до єдиного middleware (FEEL Again) напряму реалізує цілі Grand Bargain 3.0 щодо локалізації та посилення національних систем.',
                    'The transition from parallel systems to a unified middleware (FEEL Again) directly implements Grand Bargain 3.0 goals regarding localization and strengthening national systems.'
                  )}
                </p>
                <ul className="space-y-3">
                  {[
                    { l: t('Локалізація', 'Localization'), d: t('Пряме фінансування через НСЗУ замість посередників.', 'Direct funding via NSZU instead of intermediaries.') },
                    { l: t('Прозорість', 'Transparency'), d: t('Простежуваність кожної гривні до конкретного пацієнта в ЕСОЗ.', 'Traceability of every Hryvnia to a specific patient in ESOZ.') },
                  ].map(item => (
                    <li key={item.l} className="flex gap-3 text-[12px]">
                      <span className="font-bold flex-shrink-0" style={{ color: 'var(--color-ds-gold)' }}>[✓]</span>
                      <span><strong style={{ color: 'var(--color-ds-text)' }}>{item.l}</strong> — {item.d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>
          </div>
        )}

        {chapter === 'sources' && (
          <Section title={t('Джерела та верифікація даних', 'Sources & Data Verification')} color="var(--color-ds-muted)">
            <div className="space-y-2">
              {sources.map((s: any, i: number) => (
                <div key={i} className="flex gap-3 text-[11px] py-2" style={{ borderBottom: '1px solid var(--color-ds-border)' }}>
                  <span className="font-mono font-bold flex-shrink-0 w-6 text-right" style={{ color: 'var(--color-ds-muted)' }}>{i + 1}.</span>
                  <div>
                    <span className="font-bold" style={{ color: 'var(--color-ds-text)' }}>{s.name ?? s.source ?? s.label}</span>
                    {(s.url ?? s.link) && <span className="ml-2 font-mono" style={{ color: 'var(--color-ds-teal)' }}>{s.url ?? s.link}</span>}
                    {s.note && <div className="mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>{s.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; color: string; children: React.ReactNode }> = ({ title, color, children }) => (
  <div>
    <div className="flex items-center gap-3 mb-5 pb-3" style={{ borderBottom: `2px solid ${color}33` }}>
      <div className="w-1 h-6 rounded flex-shrink-0" style={{ background: color }} />
      <h3 className="text-[16px] font-bold ds-display" style={{ color }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg p-3 text-center" style={{ border: '1px solid var(--color-ds-border)', background: 'var(--color-ds-surface)' }}>
    <div className="text-[9px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--color-ds-muted)' }}>{label}</div>
    <div className="text-[15px] font-bold ds-display" style={{ color: 'var(--color-ds-text)' }}>{value}</div>
  </div>
);

const Callout: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <div className="rounded-lg p-4 text-[12px] leading-relaxed" style={{ border: `1px solid ${color}33`, background: `${color}08`, color: 'var(--color-ds-text)', borderLeft: `3px solid ${color}` }}>
    {children}
  </div>
);
