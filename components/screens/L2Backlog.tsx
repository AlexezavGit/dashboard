import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { L3Footer } from './L3Footer';
import { RegValue } from '../RegValue';
import { reg, formatValue, STATUS_LABEL, type RegCode } from '../../data/registry';

interface Props { lang: Language; nav: ScreenNav; }

// Беклог у роках = потреба в сесіях ÷ річна місткість. Усі входи беруться з реєстру фактів
// FEEL Again за кодами. Доки формула не має повного набору входів із реєстру, число років
// не показується: будь-яке таке число було б наративом без паспорта (протокол, §3).

/** Параметри, без яких беклог у роках не розраховується. Значення — лише з реєстру. */
const MISSING: { code: RegCode; label: { uk: string; en: string }; note: { uk: string; en: string } }[] = [
  {
    code: 'R-011',
    label: { uk: 'Горизонт охоплення потреби', en: 'Coverage horizon' },
    note: {
      uk: 'Задає, як разова потреба в сесіях розподіляється в часі. Параметр сценарію, не вимір.',
      en: 'Sets how the one-off need in sessions is spread over time. A scenario parameter, not a measurement.',
    },
  },
  {
    code: 'R-027',
    label: { uk: 'Чисельність надавачів', en: 'Provider headcount' },
    note: {
      uk: 'Стеля пулу — сума категорій, що перетинаються, а не підрахунок; можливий подвійний облік.',
      en: 'A pool ceiling: a sum of overlapping categories, not a count; double counting possible.',
    },
  },
  {
    code: 'R-029',
    label: { uk: 'Коефіцієнт залучення пулу', en: 'Pool engagement rate' },
    note: {
      uk: 'Єдиний коефіцієнт замість зважування за вісьмома потоками надавачів.',
      en: 'A single rate in place of weighting across the eight provider streams.',
    },
  },
  {
    code: 'R-030',
    label: { uk: 'Річний контактний фонд фахівця', en: 'Annual contact hours per specialist' },
    note: {
      uk: 'Рішення програми; українського нормативу навантаження не існує.',
      en: 'A programme decision; no Ukrainian workload standard exists.',
    },
  },
];

const statusLine = (codes: RegCode[], lang: Language) => {
  const s = STATUS_LABEL[reg(codes[0]).status];
  const span = codes.length > 1 ? `${codes[0]}…${codes[codes.length - 1]}` : codes[0];
  return `${s.mark} ${s[lang]} · ${span}`;
};

export const L2Backlog: React.FC<Props> = ({ lang, nav }) => {
  const needMin = reg('R-012');
  const needMax = reg('R-014');
  const capacity = reg('R-020');
  const contour = reg('R-040');
  const p51 = reg('R-059');

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{
        background:
          'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(0,210,170,0.15) 0%, transparent 55%), ' +
          'linear-gradient(135deg, #080f1c 0%, #0a1628 100%)',
      }}
    >
      <div className="h-px w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #00d4aa, #2ec4b6 50%, transparent)', boxShadow: '0 0 14px rgba(0,212,170,0.5)' }} />

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2 flex-shrink-0">
        <button
          onClick={nav.back}
          className="flex items-center gap-2 px-4 py-2 rounded-xl ds-display font-bold flex-shrink-0 transition-all"
          style={{ background: 'rgba(200,164,92,0.16)', border: '2px solid var(--color-ds-gold)', color: 'var(--color-ds-gold)', fontSize: '12px' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'uk' ? 'Назад' : 'Back'}
        </button>
        <div>
          <div className="text-[17px] font-bold ds-display" style={{ color: 'var(--color-ds-text, #00d4aa)' }}>
            {lang === 'uk' ? 'Беклог у роках: ще не розраховано' : 'Backlog in years: not yet calculated'}
          </div>
          <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
            {lang === 'uk'
              ? 'Що встановлено в реєстрі фактів і чого бракує для розрахунку'
              : 'What the fact registry establishes and what the calculation still lacks'}
          </div>
        </div>
      </div>

      {/* ── Intro context ── */}
      <div className="px-5 pb-2 flex-shrink-0">
        <div className="rounded-xl px-4 py-2" style={{ background: 'rgba(0,210,170,0.06)', border: '1px solid rgba(0,210,170,0.18)' }}>
          <p className="text-[10px] ds-body leading-relaxed" style={{ color: 'var(--color-ds-text, rgba(214,221,230,0.88))' }}>
            {lang === 'uk'
              ? 'Беклог у роках — це потреба в сесіях, поділена на річну місткість системи. Обидва входи в реєстрі мають статус припущення, а результат залежить ще від параметрів, які задає модель попиту і місткості: горизонту охоплення, чисельності надавачів і їхнього річного фонду. Доки кожен вхід формули не має коду реєстру, число років тут не показується.'
              : 'The backlog in years is the need in sessions divided by the system’s annual capacity. Both inputs carry assumption status in the registry, and the result also depends on parameters set by the demand-and-capacity model: coverage horizon, provider headcount and their annual hours. Until every input of the formula has a registry code, no figure in years is shown here.'}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 px-5 pb-3 min-h-0">
        {/* ── Formula box ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl flex items-center gap-6 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-ds-border)' }}
        >
          <div className="text-center" title={`${needMin.code} · ${needMin.origin}`}>
            <div className="text-[10px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'Потреба на весь курс' : 'Need for the full course'}</div>
            <div className="text-[20px] font-bold ds-display" style={{ color: 'var(--color-ds-orange)' }}>
              {formatValue(needMin.value, lang)}{' – '}{formatValue(needMax.value, lang)}
            </div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
              {lang === 'uk' ? 'сесій' : 'sessions'}{' · '}{statusLine(['R-012', 'R-013', 'R-014'], lang)}
            </div>
          </div>
          <div className="text-[18px] font-bold ds-display" style={{ color: 'var(--color-ds-muted)' }}>÷</div>
          <div className="text-center" title={`${capacity.code} · ${capacity.origin}`}>
            <div className="text-[10px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'Місткість НСЗУ' : 'NHSU capacity'}</div>
            <div className="text-[20px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>{formatValue(capacity.value, lang)}</div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
              {capacity.unit}{' · '}{statusLine(['R-020'], lang)}
            </div>
          </div>
          <div className="text-[18px] font-bold ds-display" style={{ color: 'var(--color-ds-muted)' }}>=</div>
          <div className="text-center">
            <div className="text-[10px] ds-body mb-1" style={{ color: 'var(--color-ds-text, #00d4aa)' }}>{lang === 'uk' ? 'Беклог' : 'Backlog'}</div>
            <div className="text-[32px] font-bold ds-display" style={{ color: 'var(--color-ds-text, #00d4aa)' }}>—</div>
            <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
              {lang === 'uk' ? 'не розраховано' : 'not calculated'}
            </div>
          </div>
          <div className="flex-1" />
          {/* Виміряне в реєстрі договорів НСЗУ */}
          <div className="text-right">
            <div className="text-[10px] cyber-label mb-1" style={{ color: 'var(--color-ds-gold)' }}>
              {lang === 'uk' ? 'Реєстр договорів НСЗУ' : 'NHSU contract register'}
            </div>
            <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-text, rgba(214,221,230,0.88))' }}>
              <RegValue code="R-040" lang={lang} unit={false} />{' '}
              {lang === 'uk' ? 'юросіб психіатричного контуру (п.19 ∪ п.22 ∪ п.72)' : 'legal entities in the psychiatric contour (p.19 ∪ p.22 ∪ p.72)'}<br />
              <RegValue code="R-059" lang={lang} unit={false} />{' '}
              {lang === 'uk' ? 'юросіб із чинним договором за пакетом 51' : 'legal entities with a current package 51 contract'}<br />
              <span style={{ opacity: 0.75 }}>{p51.period.includes(contour.period) ? p51.period : `${contour.period} · ${p51.period}`}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Missing inputs ── */}
        <div className="cyber-label flex-shrink-0" style={{ color: 'var(--color-ds-gold)' }}>
          {lang === 'uk' ? 'ЧОГО БРАКУЄ ДЛЯ РОЗРАХУНКУ — СТАН У РЕЄСТРІ' : 'WHAT THE CALCULATION LACKS — REGISTRY STATUS'}
        </div>
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          {MISSING.map((m, i) => (
            <motion.div
              key={m.code}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 + 0.2 }}
              className="flex items-center gap-4 p-3 rounded-xl flex-1"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--color-ds-border)' }}
            >
              <div className="w-44 flex-shrink-0">
                <div className="text-[10px] ds-body leading-snug" style={{ color: 'var(--color-ds-text, rgba(214,221,230,0.88))' }}>{m.label[lang]}</div>
              </div>
              <div className="flex-1 text-[12px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>
                <RegValue code={m.code} lang={lang} />
              </div>
              <div className="w-72 flex-shrink-0 text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
                {m.note[lang]}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Conclusion ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex-shrink-0 rounded-xl px-4 py-2.5"
          style={{ background: 'rgba(0,210,170,0.06)', border: '1px solid rgba(0,210,170,0.18)' }}
        >
          <p className="text-[10px] ds-body leading-relaxed" style={{ color: 'var(--color-ds-text, rgba(214,221,230,0.88))' }}>
            {lang === 'uk'
              ? 'Розрахунок беклогу є частиною моделі попиту і місткості, яка зараз будується. Екран покаже число років тоді, коли кожен вхід формули матиме код реєстру фактів із походженням, одиницею і періодом.'
              : 'The backlog calculation is part of the demand-and-capacity model now under construction. This screen will show a figure in years once every input of the formula has a fact-registry code with origin, unit and period.'}
          </p>
          <div className="text-[10px] font-mono mt-2 pt-2" style={{ borderTop: '1px solid var(--color-ds-border)', color: 'var(--color-ds-muted)' }}>
            {lang === 'uk'
              ? 'Джерело: реєстр фактів FEEL Again · коди R-011, R-012–R-014, R-020, R-027, R-029, R-030, R-040, R-059 · реєстр договорів НСЗУ, data.gov.ua. Наведіть курсор на число — побачите походження.'
              : 'Source: FEEL Again fact registry · codes R-011, R-012–R-014, R-020, R-027, R-029, R-030, R-040, R-059 · NHSU contract register, data.gov.ua. Hover a figure to see its origin.'}
          </div>
        </motion.div>
      </div>
      <L3Footer lang={lang} nav={nav} />
    </div>
  );
};
