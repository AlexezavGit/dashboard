import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';
import { L3Footer } from './L3Footer';
import { PREVALENCE_DATA } from '../../constants';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from 'recharts';

interface Props { lang: Language; nav: ScreenNav; }
const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

// Verified МОЗ/НСЗУ/WHO 2025 data
// Sources:
//   МОЗ: https://moz.gov.ua/uk/rozbudova-sistemi-pidtrimki-psihichnogo-zdorov-ya-v-ukrayini-pidsumki-2025-roku
//   WHO April 2025: https://www.ecoi.net/en/file/local/2131858/WHO-EURO-2025-6904-46670-80597-eng.pdf
//   МОД: https://mod.gov.ua/en/news/over-33-000-service-members-underwent-rehabilitation
//   PHQ-9/GAD-7: МОЗ Centres of Excellence pilot report 2025

const KPI_CARDS = [
  {
    val: '20%',
    label: { uk: 'звертаються за допомогою', en: 'seek help' },
    sub:  { uk: 'із тих, хто має симптоми (WHO, квітень 2025)', en: 'of those with symptoms (WHO, April 2025)' },
    color: '#ff7b6e',
    bg: 'rgba(255,123,110,0.08)',
    border: 'rgba(255,123,110,0.3)',
    note: { uk: '⚠ Вхідний бар\'єр > ризик dropout', en: '⚠ Entry barrier > dropout risk' },
  },
  {
    val: '550K+',
    label: { uk: 'звернень до первинної ланки', en: 'primary care contacts' },
    sub:  { uk: 'сімейні лікарі / mhGAP 2025 (МОЗ)', en: 'family doctors / mhGAP 2025 (МОЗ)' },
    color: '#00d4aa',
    bg: 'rgba(0,212,170,0.07)',
    border: 'rgba(0,212,170,0.25)',
    note: { uk: '+10% до 2024, ×4 до 2023', en: '+10% vs 2024, ×4 vs 2023' },
  },
  {
    val: '118K+',
    label: { uk: 'спеціалізована допомога', en: 'specialized care' },
    sub:  { uk: '152 Центри ментального здоров\'я (МОЗ 2025)', en: '152 Mental Health Centres (МОЗ 2025)' },
    color: '#c8a45c',
    bg: 'rgba(200,164,92,0.07)',
    border: 'rgba(200,164,92,0.25)',
    note: { uk: '21% — діти', en: '21% — children' },
  },
  {
    val: '82–85%',
    label: { uk: 'позитивна динаміка (PHQ-9/GAD-7)', en: 'positive dynamics (PHQ-9/GAD-7)' },
    sub:  { uk: 'Центри досконалості, після 1-го циклу', en: 'Centres of Excellence, after 1st cycle' },
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.07)',
    border: 'rgba(167,139,250,0.25)',
    note: { uk: 'цикл = 14+ днів, до 8 циклів/рік', en: 'cycle = 14+ days, up to 8/yr' },
  },
];

// Funnel: від потреби до верифікованого покриття
const FUNNEL = (lang: Language) => [
  { name: t('Клінічна потреба', 'Clinical need', lang), value: 3900000, color: '#ff4444', pct: 100 },
  { name: t('Звертаються (20%)', 'Seek help (20%)', lang), value: 780000, color: '#ff7b6e', pct: 20 },
  { name: t('Первинна ланка', 'Primary care', lang), value: 550000, color: '#00d4aa', pct: 14.1 },
  { name: t('Спеціалізована', 'Specialized', lang), value: 118000, color: '#c8a45c', pct: 3.0 },
];

const MILITARY = [
  { label: { uk: 'Завершили реабілітацію (МоД 2025)', en: 'Completed rehab (MoD 2025)' }, val: '33K+', color: '#00d4aa' },
  { label: { uk: 'Довгострокова (після-гострий)', en: 'Long-term (post-acute)' }, val: '70%', color: '#c8a45c' },
];

export const L2Clinical: React.FC<Props> = ({ lang, nav }) => {
  const funnelData = FUNNEL(lang);

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a0a0a 100%)' }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, #ff7b6e, #00d4aa, rgba(200,164,92,0.4))', boxShadow: '0 0 16px rgba(255,123,110,0.4)' }} />

      <NavBar
        lang={lang}
        nav={nav}
        accentColor="#00d4aa"
        title={{ uk: 'Клінічне охоплення та результати 2025', en: 'Clinical coverage & outcomes 2025' }}
        subtitle={{ uk: 'МОЗ · НСЗУ · WHO — верифіковані дані', en: 'МОЗ · НСЗУ · WHO — verified data' }}
        crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
      />

      {/* Body: 2-column layout */}
      <div className="flex-1 grid min-h-0 px-5 pb-3 pt-3 gap-4"
        style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* LEFT — 4 KPI cards in 2×2 */}
        <div className="grid min-h-0 gap-2.5" style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
          {KPI_CARDS.map((k, i) => (
            <div key={i} className="rounded-xl p-3.5 flex flex-col justify-between"
              style={{ background: k.bg, border: `1px solid ${k.border}` }}>
              <div>
                <div className="font-black ds-display leading-none" style={{ fontSize: '32px', color: k.color }}>
                  {k.val}
                </div>
                <div className="text-[12px] font-semibold ds-body mt-1.5 leading-tight" style={{ color: 'rgba(200,208,220,0.9)' }}>
                  {k.label[lang]}
                </div>
                <div className="text-[10px] font-mono mt-1 leading-tight" style={{ color: 'var(--color-ds-muted)' }}>
                  {k.sub[lang]}
                </div>
              </div>
              <div className="text-[10px] font-semibold mt-2 px-2 py-1 rounded-md"
                style={{ background: `${k.color}18`, color: k.color }}>
                {k.note[lang]}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — funnel + military */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Coverage funnel */}
          <div className="flex-1 rounded-xl p-4 min-h-0"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-3"
              style={{ color: 'var(--color-ds-muted)' }}>
              {t('Воронка охоплення: від потреби до системи (2025)', 'Coverage funnel: from need to system (2025)', lang)}
            </div>
            <div className="flex flex-col gap-2 h-[calc(100%-36px)] justify-around">
              {funnelData.map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-[11px] font-mono w-[130px] flex-shrink-0" style={{ color: 'var(--color-ds-muted)' }}>
                    {row.name}
                  </div>
                  <div className="flex-1 relative h-6 rounded-md overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="absolute inset-y-0 left-0 rounded-md flex items-center px-2"
                      style={{
                        width: `${Math.max(row.pct, 3)}%`,
                        background: `${row.color}30`,
                        borderRight: `2px solid ${row.color}`,
                        transition: 'width 0.6s ease',
                      }}>
                    </div>
                  </div>
                  <div className="text-[12px] font-bold ds-display w-[58px] text-right flex-shrink-0"
                    style={{ color: row.color }}>
                    {row.value >= 1000000
                      ? `${(row.value / 1000000).toFixed(1)}M`
                      : row.value >= 1000
                      ? `${(row.value / 1000).toFixed(0)}K`
                      : row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Military rehab */}
          <div className="rounded-xl p-4 flex-shrink-0"
            style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-2.5"
              style={{ color: 'var(--color-ds-muted)' }}>
              {t('Ветерани — МоД 2025', 'Veterans — MoD 2025', lang)}
            </div>
            <div className="flex gap-4">
              {MILITARY.map((m, i) => (
                <div key={i} className="flex-1">
                  <div className="text-[24px] font-black ds-display" style={{ color: m.color }}>{m.val}</div>
                  <div className="text-[10px] ds-body mt-1 leading-tight" style={{ color: 'var(--color-ds-muted)' }}>
                    {m.label[lang]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source note */}
          <div className="text-[9px] font-mono flex-shrink-0" style={{ color: 'rgba(100,120,140,0.6)' }}>
            {t(
              'Джерела: МОЗ 2025 (moz.gov.ua/uk/rozbudova-sistemi), WHO EURO April 2025 (ecoi.net), МоД Jan 2026 (mod.gov.ua). Completion rate не публікується — реабілітація перейшла на цикловий облік (ПМГ-2025).',
              'Sources: МОЗ 2025, WHO EURO April 2025, МоД Jan 2026. Completion rate not published — rehab converted to cycle-based tracking (PMG-2025).',
              lang
            )}
          </div>
        </div>
      </div>

      <L3Footer lang={lang} nav={nav} />
    </div>
  );
};
