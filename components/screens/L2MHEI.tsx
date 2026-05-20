import React, { useState, useCallback } from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';
import { L3Footer } from './L3Footer';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

// ── MHEI component definitions (mirror of L1Strategic LAYERS) ─────────────
interface GapComponent {
  id: string;
  label: { uk: string; en: string };
  current: number;
  target: number;
  weight: number;
  color: string;
  source: { uk: string; en: string };
  assumption?: boolean;
}

const GAP_COMPONENTS: GapComponent[] = [
  {
    id: 'fintech', weight: 25, current: 0, target: 30, color: '#e8c97a',
    label: { uk: 'Виплати, прив\'язані до результатів', en: 'Outcome-linked payments' },
    source: { uk: 'НСЗУ, HEAL/THRIVE DLI', en: 'NHSU, HEAL/THRIVE DLI' },
  },
  {
    id: 'clinical', weight: 25, current: 82, target: 90, color: '#ff7b6e',
    label: { uk: 'Позитивна динаміка (1-й цикл)', en: 'Positive outcomes (1st cycle)' },
    source: { uk: 'МОЗ Центри досконалості 2025', en: 'MoH Centres of Excellence 2025' },
  },
  {
    id: 'data', weight: 20, current: 5, target: 60, color: '#00d4aa',
    label: { uk: 'Інтероперабельність систем', en: 'System interoperability' },
    source: { uk: 'CommCare/ActivityInfo/ЄСОЗ аналіз', en: 'CommCare/ActivityInfo/ESOZ analysis' },
  },
  {
    id: 'sustain', weight: 15, current: 35, target: 70, color: '#a78bfa',
    label: { uk: 'Конверсія навчання → практика', en: 'Training → practice conversion' },
    source: { uk: 'НСЗУ реєстр 2026 / ВООЗ mhGAP', en: 'NHSU registry 2026 / WHO mhGAP' },
  },
  {
    id: 'digital', weight: 10, current: 70, target: 95, color: '#ff9966',
    label: { uk: 'Ерозія від дублювання (інверс.)', en: 'Duplication erosion (inverse)' },
    source: { uk: 'FEEL Again польові дані 2024', en: 'FEEL Again field data 2024' },
  },
  {
    id: 'regulatory', weight: 5, current: 1, target: 25, color: '#c084fc',
    label: { uk: 'Локалізація гуманітарних ресурсів', en: 'Humanitarian resource localization' },
    source: { uk: 'Grand Bargain 2025 звіт', en: 'Grand Bargain 2025 report' },
  },
];

const computeMHEI = (values: Record<string, number>) =>
  Math.round(
    GAP_COMPONENTS.reduce((sum, c) => {
      const pct = Math.min(100, (values[c.id] / c.target) * 100);
      return sum + pct * (c.weight / 100);
    }, 0)
  );

const gdpImpact = (score: number) => {
  const v = (score / 100) * 9.0 - 3.5;
  return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
};

// ── Backlog calculator ────────────────────────────────────────────────────────
// Formula: 48M sessions ÷ (N practitioners × 1,200 hrs/yr ÷ 0.67 hrs/session)
// 0.67 hr/session = 40 min average therapeutic session
const calcBacklogYears = (practitioners: number): number => {
  const sessionsPerYr = practitioners * 1200 / 0.67;
  return Math.round((48_000_000 / sessionsPerYr) * 10) / 10;
};

const calcMinPractitioners = (targetYears: number): number =>
  Math.ceil(48_000_000 / (targetYears * (1200 / 0.67)));

export const L2MHEI: React.FC<Props> = ({ lang, nav }) => {
  const initialValues = Object.fromEntries(GAP_COMPONENTS.map(c => [c.id, c.current]));
  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const [practitioners, setPractitioners] = useState(943);

  const mhei = computeMHEI(values);
  const baselineMhei = computeMHEI(initialValues);
  const mheiDelta = mhei - baselineMhei;
  const backlogYears = calcBacklogYears(practitioners);

  const handleSlider = useCallback((id: string, val: number) => {
    setValues(v => ({ ...v, [id]: val }));
  }, []);

  const handleTargetMhei = useCallback((targetMhei: number) => {
    // Reverse-logic: scale all components to reach target MHEI score
    const targetRatio = targetMhei / 100;
    const newValues: Record<string, number> = {};
    GAP_COMPONENTS.forEach(c => {
      newValues[c.id] = Math.round(c.target * targetRatio);
    });
    setValues(newValues);
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setPractitioners(943);
  }, []);

  const bandColor = mhei < 34 ? '#ff7b6e' : mhei < 67 ? '#e8c97a' : '#00d4aa';

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{ background: 'linear-gradient(135deg, #080f1c 0%, #0d1a14 100%)' }}
    >
      <div className="h-[2px] w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, transparent, #e8c97a, #c8a45c, rgba(0,210,170,0.4))', boxShadow: '0 0 18px rgba(232,201,122,0.4)' }} />

      <NavBar
        lang={lang}
        nav={nav}
        accentColor="#e8c97a"
        title={{ uk: 'MHEI: Інтерактивна Дельта-Панель', en: 'MHEI: Interactive Delta Dashboard' }}
        subtitle={{
          uk: 'Зсувайте слайдери, щоб побачити, як зміни в кожному компоненті впливають на індекс та ВВП',
          en: 'Drag sliders to see how changes in each component affect the index and GDP',
        }}
        crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
      />

      <div className="flex-1 grid min-h-0 px-5 pb-3 pt-3 gap-4"
        style={{ gridTemplateColumns: '1fr 1fr' }}>

        {/* ── LEFT: MHEI Delta sliders ─────────────────────────────────── */}
        <div className="flex flex-col gap-3 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

          {/* Score readout */}
          <div className="flex items-center gap-4 p-3 rounded-xl flex-shrink-0 ds-blueprint"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${bandColor}33` }}>
            <div className="text-center">
              <div className="text-[9px] font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-ds-muted)' }}>
                {t('MHEI Зараз', 'MHEI Now', lang)}
              </div>
              <div className="ds-display font-black leading-none" style={{ fontSize: '42px', color: bandColor }}>
                {mhei}
              </div>
            </div>
            <div style={{ color: 'var(--color-ds-muted)', fontSize: '24px' }}>→</div>
            <div className="text-center flex-1">
              <div className="text-[9px] font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-ds-muted)' }}>
                {t('Дельта', 'Delta', lang)}
              </div>
              <div className="ds-display font-black leading-none" style={{
                fontSize: '42px',
                color: mheiDelta > 0 ? '#00d4aa' : mheiDelta < 0 ? '#ff7b6e' : 'var(--color-ds-muted)',
              }}>
                {mheiDelta > 0 ? '+' : ''}{mheiDelta}
              </div>
            </div>
            <div style={{ color: 'var(--color-ds-muted)', fontSize: '24px' }}>≈</div>
            <div className="text-center">
              <div className="text-[9px] font-mono uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-ds-muted)' }}>
                {t('ВВП вплив', 'GDP impact', lang)}
              </div>
              <div className="ds-display font-black leading-none" style={{ fontSize: '28px', color: '#e8c97a' }}>
                {gdpImpact(mhei)}
              </div>
              <div className="text-[9px]" style={{ color: 'var(--color-ds-muted)' }}>
                {t('ВВП/рік', 'GDP/yr', lang)}
              </div>
            </div>
            <button
              onClick={reset}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold ds-display transition-all hover:bg-[rgba(200,164,92,0.2)]"
              style={{ background: 'rgba(200,164,92,0.12)', border: '1px solid rgba(200,164,92,0.3)', color: 'var(--color-ds-gold)' }}
            >
              {t('Скинути', 'Reset', lang)}
            </button>
          </div>

          {/* Master Reverse-Logic Slider */}
          <div className="rounded-xl p-3 flex-shrink-0" style={{ background: 'rgba(68,136,255,0.05)', border: '1px solid rgba(68,136,255,0.3)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-bold ds-display text-[#4488ff] uppercase tracking-wider">
                {lang === 'uk' ? 'Цільове Моделювання (Reverse-Logic)' : 'Target Modeling (Reverse-Logic)'}
              </span>
              <span className="text-[10px] font-mono text-[#4488ff]">
                MHEI: {mhei}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-[var(--color-ds-muted)]">0</span>
              <input
                type="range"
                min={0}
                max={100}
                value={mhei}
                onChange={e => handleTargetMhei(Number(e.target.value))}
                className="flex-1"
                style={{ accentColor: '#4488ff' }}
              />
              <span className="text-[10px] font-mono text-[var(--color-ds-muted)]">100</span>
            </div>
            <p className="text-[9px] text-[var(--color-ds-muted)] mt-1.5 leading-tight">
              {lang === 'uk'
                ? 'Зсувайте для авто-розрахунку потрібних показників інфраструктури.'
                : 'Drag to auto-calculate required infrastructure metrics.'}
            </p>
          </div>

          {/* Component sliders */}
          {GAP_COMPONENTS.map(c => {
            const pct = Math.min(100, Math.round((values[c.id] / c.target) * 100));
            return (
              <div key={c.id} className="rounded-xl p-3 flex-shrink-0 ds-spotlight"
                style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${c.color}22` }}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[11px] font-semibold ds-display" style={{ color: c.color }}>
                    {c.label[lang]}
                  </span>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
                    w{c.weight}% · {pct}% від цілі
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[18px] font-black ds-display w-12 text-right flex-shrink-0" style={{ color: c.color }}>
                    {values[c.id]}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={c.target}
                    value={values[c.id]}
                    onChange={e => handleSlider(c.id, Number(e.target.value))}
                    className="flex-1"
                    style={{ accentColor: c.color }}
                  />
                  <span className="text-[10px] font-mono w-10 flex-shrink-0" style={{ color: 'var(--color-ds-muted)' }}>
                    /{c.target}%
                  </span>
                </div>
                {/* Source */}
                <div className="text-[9px] font-mono mt-1.5 pt-1.5" style={{ borderTop: `1px solid ${c.color}18`, color: 'var(--color-ds-muted)' }}>
                  {c.source[lang]}
                </div>
                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, background: c.color, boxShadow: `0 0 6px ${c.color}66` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: Backlog calculator + capacity scale ─────────────────── */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Backlog interactive scale */}
          <div className="rounded-xl p-4 flex-shrink-0"
            style={{ background: 'rgba(0,210,170,0.05)', border: '1px solid rgba(0,210,170,0.2)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: '#00d4aa' }}>
              {t('Інтерактивний беклог', 'Interactive Backlog Scale', lang)}
            </div>

            {/* Formula */}
            <div className="text-[9px] font-mono mb-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--color-ds-muted)' }}>
              {t('Беклог = 48M сесій ÷ (N спец. × 1,200 год/рік ÷ 0.67 год/сес.)', 'Backlog = 48M sessions ÷ (N spec. × 1,200 hrs/yr ÷ 0.67 hrs/session)', lang)}
            </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] ds-body flex-shrink-0" style={{ color: 'var(--color-ds-muted)' }}>
                {t('Практиків:', 'Practitioners:', lang)}
              </span>
              <input
                type="range"
                min={943}
                max={15000}
                step={100}
                value={practitioners}
                onChange={e => setPractitioners(Number(e.target.value))}
                className="flex-1"
                style={{ accentColor: '#00d4aa' }}
              />
              <span className="text-[15px] font-black ds-display w-16 text-right flex-shrink-0" style={{ color: '#00d4aa' }}>
                {practitioners.toLocaleString()}
              </span>
            </div>

            {/* Backlog result */}
            <div className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,210,170,0.15)' }}>
              <div>
                <div className="text-[9px] font-mono uppercase" style={{ color: 'var(--color-ds-muted)' }}>
                  {t('Беклог для 3.9M потреби', 'Backlog for 3.9M need', lang)}
                </div>
                <div className="ds-display font-black leading-none mt-0.5"
                  style={{ fontSize: '36px', color: backlogYears > 10 ? '#ff7b6e' : backlogYears > 5 ? '#e8c97a' : '#00d4aa' }}>
                  {backlogYears}
                </div>
                <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
                  {t('років', 'years', lang)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono uppercase mb-1" style={{ color: 'var(--color-ds-muted)' }}>
                  {t('Сесій/рік', 'Sessions/yr', lang)}
                </div>
                <div className="text-[14px] font-bold ds-display" style={{ color: '#e8c97a' }}>
                  {((practitioners * 1200 / 0.67) / 1_000_000).toFixed(1)}M
                </div>
              </div>
            </div>

            {/* Milestone targets */}
            <div className="mt-3 flex gap-2">
              {[5, 10, 15].map(yr => (
                <div key={yr} className="flex-1 p-2 rounded-lg text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,210,170,0.12)' }}>
                  <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
                    {t(`≤${yr} р.`, `≤${yr} yrs`, lang)}
                  </div>
                  <div className="text-[13px] font-black ds-display" style={{ color: '#00d4aa' }}>
                    {calcMinPractitioners(yr).toLocaleString()}
                  </div>
                  <div className="text-[8px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
                    {t('спец. потрібно', 'spec. needed', lang)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workforce capacity scale */}
          <div className="rounded-xl p-4 flex-1 min-h-0"
            style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)' }}>
            <div className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: '#a78bfa' }}>
              {t('Місткість кадрів — 3 рівні', 'Workforce Capacity — 3 Layers', lang)}
            </div>

            {[
              {
                label: { uk: 'А. WHO Atlas (заголовний)', en: 'A. WHO Atlas (headline)' },
                value: '1.3/100K',
                desc: { uk: 'провайдерів / 100K нас. · WHO Mental Health Atlas 2023', en: 'providers / 100K pop. · WHO Mental Health Atlas 2023' },
                color: '#e8c97a',
                badge: null,
              },
              {
                label: { uk: 'Б. НСЗУ-верифікована ємність', en: 'B. NHSU-verified capacity' },
                value: '0.28%',
                desc: { uk: '943 провайдери → 180K сесій/рік → 0.28% від клін. потреби · НСЗУ 10.04.2026', en: '943 providers → 180K sessions/yr → 0.28% of clinical need · NHSU 10.04.2026' },
                color: '#ff7b6e',
                badge: null,
              },
              {
                label: { uk: 'В. Тіньовий ринок', en: 'C. Shadow market' },
                value: '~6,500',
                desc: { uk: 'практиків (оцінка) · лише 17 у НСЗУ (0.26% зареєстровано) · Штраф формалізації: 65% розриву в доходах', en: 'practitioners (est.) · only 17 in NHSU (0.26% registered) · Formalization penalty: 65% income gap' },
                color: '#a78bfa',
                badge: { uk: '⚠️ оцінка', en: '⚠️ estimate' },
              },
            ].map((layer, i) => (
              <div key={i} className="mb-3 pb-3 ds-reveal-content"
                style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wide" style={{ color: layer.color }}>
                    {layer.label[lang]}
                  </span>
                  {layer.badge && (
                    <span className="ds-assumption-badge">{layer.badge[lang]}</span>
                  )}
                </div>
                <div className="text-[24px] font-black ds-display leading-none mb-1" style={{ color: layer.color }}>
                  {layer.value}
                </div>
                <div className="text-[10px] ds-body leading-snug" style={{ color: 'var(--color-ds-muted)' }}>
                  {layer.desc[lang]}
                </div>
              </div>
            ))}

            {/* Funnel: 57K → 700 → 42 → 50 */}
            <div className="mt-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-[9px] font-mono uppercase mb-2" style={{ color: 'var(--color-ds-muted)' }}>
                {t('Воронка сертифікації', 'Certification funnel', lang)}
              </div>
              <div className="flex items-center gap-1 text-center flex-wrap justify-center">
                {[
                  { val: '57K', label: { uk: 'awareness', en: 'awareness' }, color: '#e8c97a' },
                  { val: '→', label: null, color: 'var(--color-ds-muted)' },
                  { val: '700', label: { uk: 'клін. серт.', en: 'clin. cert.' }, color: '#a78bfa' },
                  { val: '→', label: null, color: 'var(--color-ds-muted)' },
                  { val: '42', label: { uk: 'практика (docs)', en: 'practice (docs)' }, color: '#ff7b6e' },
                  { val: '→', label: null, color: 'var(--color-ds-muted)' },
                  { val: '50', label: { uk: 'EMDR cert.', en: 'EMDR cert.' }, color: '#00d4aa' },
                ].map((item, i) => (
                  item.label ? (
                    <div key={i} className="text-center">
                      <div className="text-[16px] font-black ds-display leading-none" style={{ color: item.color }}>{item.val}</div>
                      <div className="text-[8px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{item.label[lang]}</div>
                    </div>
                  ) : (
                    <span key={i} style={{ color: item.color, fontSize: '14px' }}>{item.val}</span>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <L3Footer lang={lang} nav={nav} />
    </div>
  );
};
