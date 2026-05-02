import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

const SCENARIOS = [
  {
    label: { uk: 'Поточний стан (без змін)', en: 'Current state (no change)' },
    years: 12.4,
    color: '#ff7b6e',
    note: { uk: '62.2M / (4K спец. × 1,250 сес./рік) = 12.4 р.', en: '62.2M / (4K spec. × 1,250 sessions/yr) = 12.4 yrs' },
  },
  {
    label: { uk: '+100% ефективності (FEEL Again automation)', en: '+100% efficiency (FEEL Again automation)' },
    years: 7.8,
    color: '#e8c97a',
    note: { uk: 'Скорочення адмін-навантаження 22%→7%, +45K сес./міс', en: 'Admin overhead reduction 22%→7%, +45K sessions/month' },
  },
  {
    label: { uk: 'Із тіньовим сектором (19K спеціалістів)', en: 'With shadow sector (19K specialists)' },
    years: 2.1,
    color: '#00d4aa',
    note: { uk: '19K (реєстр + тінь) × 1,250 = 23.75M сес./рік', en: '19K (registry + shadow) × 1,250 = 23.75M sessions/yr' },
  },
  {
    label: { uk: 'Оптимістичний (інфраструктура + кадри)', en: 'Optimistic (infrastructure + workforce)' },
    years: 0.8,
    color: '#2ec4b6',
    note: { uk: 'FEEL Again + Grand Bargain 25% локалізація + THRIVE кадрове розширення', en: 'FEEL Again + Grand Bargain 25% localisation + THRIVE workforce scale-up' },
  },
];

const MAX_YEARS = 13;

export const L2Backlog: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
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
        <div className="text-[17px] font-bold ds-display" style={{ color: '#00d4aa' }}>
          {lang === 'uk' ? 'Як рахується 12.4 роки беклогу?' : 'How is the 12.4-year backlog calculated?'}
        </div>
        <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          {lang === 'uk' ? 'Чотири сценарії — від формули до реалістичних шляхів закриття' : 'Four scenarios — from formula to realistic closure paths'}
        </div>
      </div>
    </div>

    {/* ── Intro context ── */}
    <div className="px-5 pb-2 flex-shrink-0">
      <div className="rounded-xl px-4 py-2" style={{ background: 'rgba(0,210,170,0.06)', border: '1px solid rgba(0,210,170,0.18)' }}>
        <p className="text-[10px] ds-body leading-relaxed" style={{ color: 'rgba(200,208,220,0.82)' }}>
          {lang === 'uk'
            ? '12.4 роки — це мінімальний розрахунок при незмінних ресурсах. Ключове обмеження не лише кількість фахівців, а неефективність системи: 22% часу витрачається на дублювання документації, а 19K практиків із тіньового сектору лишаються невидимими для системи. Нижче — чотири сценарії залежно від архітектурних рішень.'
            : '12.4 years is the minimum estimate with unchanged resources. The key constraint is not only the number of specialists but system inefficiency: 22% of time is spent on documentation duplication, and 19K shadow-sector practitioners remain invisible to the system. Below — four scenarios depending on architectural decisions.'}
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
        <div className="text-center">
          <div className="text-[10px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'Незакрита потреба' : 'Unmet need'}</div>
          <div className="text-[20px] font-bold ds-display" style={{ color: '#ff7b6e' }}>62.2M</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'сесій/рік' : 'sessions/yr'}</div>
        </div>
        <div className="text-[18px] font-bold ds-display" style={{ color: 'var(--color-ds-muted)' }}>÷</div>
        <div className="text-center">
          <div className="text-[10px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'НСЗУ спеціалісти' : 'NHSU specialists'}</div>
          <div className="text-[20px] font-bold ds-display" style={{ color: '#e8c97a' }}>4,000</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? '× 1,250 сес.' : '× 1,250 sessions'}</div>
        </div>
        <div className="text-[18px] font-bold ds-display" style={{ color: 'var(--color-ds-muted)' }}>=</div>
        <div className="text-center">
          <div className="text-[10px] ds-body mb-1" style={{ color: '#00d4aa' }}>{lang === 'uk' ? 'Беклог' : 'Backlog'}</div>
          <div className="text-[32px] font-bold ds-display" style={{ color: '#00d4aa', textShadow: '0 0 30px rgba(0,210,170,0.4)' }}>12.4</div>
          <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'років' : 'years'}</div>
        </div>
        <div className="flex-1" />
        {/* 2025 context */}
        <div className="text-right">
          <div className="text-[10px] cyber-label mb-1" style={{ color: 'var(--color-ds-gold)' }}>NHSU 2025</div>
          <div className="text-[10px] ds-body" style={{ color: 'rgba(200,208,220,0.7)' }}>
            260K {lang === 'uk' ? 'пацієнтів ПМД' : 'PMD patients'}<br />
            ₴844 {lang === 'uk' ? 'капітаційна ставка/пац.' : 'capitation rate/pt.'}<br />
            2,000+ {lang === 'uk' ? 'закладів Пакет 51' : 'facilities Package 51'}
          </div>
        </div>
      </motion.div>

      {/* ── Scenario bars ── */}
      <div className="cyber-label flex-shrink-0" style={{ color: 'var(--color-ds-gold)' }}>
        {lang === 'uk' ? 'СЦЕНАРНИЙ АНАЛІЗ — СКІЛЬКИ РОКІВ ДО ЗАКРИТТЯ' : 'SCENARIO ANALYSIS — YEARS TO CLOSURE'}
      </div>
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        {SCENARIOS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 + 0.2 }}
            className="flex items-center gap-4 p-3 rounded-xl flex-1"
            style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.color}2a` }}
          >
            <div className="w-36 flex-shrink-0">
              <div className="text-[10px] ds-body leading-snug" style={{ color: 'rgba(200,208,220,0.85)' }}>{s.label[lang]}</div>
            </div>
            <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(s.years / MAX_YEARS) * 100}%` }}
                transition={{ delay: i * 0.12 + 0.4, duration: 0.7 }}
                className="h-full rounded-lg flex items-center pl-2"
                style={{ background: `linear-gradient(90deg, ${s.color}99, ${s.color}55)`, boxShadow: `0 0 12px ${s.color}44` }}
              >
                <span className="text-[12px] font-bold ds-display" style={{ color: s.color }}>{s.years}</span>
                <span className="text-[10px] ds-body ml-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {lang === 'uk' ? 'р.' : 'yrs'}
                </span>
              </motion.div>
            </div>
            <div className="w-44 flex-shrink-0 text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
              {s.note[lang]}
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
        <p className="text-[10px] ds-body leading-relaxed" style={{ color: 'rgba(200,208,220,0.82)' }}>
          {lang === 'uk'
            ? 'Беклог — не вирок. Сценарій 3 (тіньовий сектор + FEEL Again) скорочує його до 2.1 р. без додаткових кадрів — лише за рахунок видимості 19K практиків у реєстрі та ліквідації 22% адміністративних втрат. Це відповідь на питання «що дасть FEEL Again завтра»: +45K сесій/місяць вивільненого клінічного часу.'
            : 'The backlog is not a verdict. Scenario 3 (shadow sector + FEEL Again) reduces it to 2.1 yrs without additional staff — solely by making 19K shadow practitioners visible in the registry and eliminating 22% administrative waste. This answers the question "what will FEEL Again give tomorrow": +45K sessions/month of freed clinical time.'}
        </p>
        <div className="text-[10px] font-mono mt-2 pt-2" style={{ borderTop: '1px solid var(--color-ds-border)', color: 'var(--color-ds-muted)' }}>
          {lang === 'uk'
            ? 'Джерело: НСЗУ відкриті дані 10.04.2026 · ВООЗ mhGAP IG v3 · FEEL Again польові інтерв\'ю 2024 · Lancet 2024 (6.8M оцінка потреби)'
            : 'Source: NHSU open data 10.04.2026 · WHO mhGAP IG v3 · FEEL Again field interviews 2024 · Lancet 2024 (6.8M need estimate)'}
        </div>
      </motion.div>
    </div>
  </div>
);
