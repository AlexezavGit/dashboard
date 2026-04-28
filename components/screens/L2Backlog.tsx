import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

const SCENARIOS = [
  {
    label: { uk: 'Поточний стан (без змін)', en: 'Current state (no change)' },
    years: 12.5,
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
    <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #00d4aa, #2ec4b6 50%, transparent)', boxShadow: '0 0 14px rgba(0,212,170,0.5)' }} />

    <div className="flex items-center gap-4 px-6 pt-5 pb-3 flex-shrink-0">
      <button onClick={nav.back} className="flex items-center gap-1.5 text-[11px] ds-display font-medium" style={{ color: 'var(--color-ds-muted)' }}>
        <ArrowLeft className="w-4 h-4" /> {lang === 'uk' ? 'Назад' : 'Back'}
      </button>
      <div className="w-px h-4" style={{ background: 'var(--color-ds-border)' }} />
      <div>
        <div className="text-[18px] font-bold ds-display" style={{ color: '#00d4aa' }}>
          {lang === 'uk' ? 'Як рахується 12.5 років беклогу?' : 'How is the 12.5-year backlog calculated?'}
        </div>
        <div className="text-[11px] ds-body mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>
          {lang === 'uk' ? 'Чотири сценарії та що змінює FEEL Again' : 'Four scenarios and what FEEL Again changes'}
        </div>
      </div>
      <div className="flex-1" />
      <button onClick={() => nav.push('appendix')} className="text-[11px] ds-display font-medium flex items-center gap-1" style={{ color: 'var(--color-ds-gold)' }}>
        {lang === 'uk' ? 'ROI Калькулятор →' : 'ROI Calculator →'} <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>

    <div className="flex-1 flex flex-col gap-4 px-6 pb-5 min-h-0">
      {/* Formula box */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl flex items-center gap-6 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-ds-border)' }}
      >
        <div className="text-center">
          <div className="text-[11px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'Незакрита потреба' : 'Unmet need'}</div>
          <div className="text-[22px] font-bold ds-display" style={{ color: '#ff7b6e' }}>62.2M</div>
          <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'сесій/рік' : 'sessions/yr'}</div>
        </div>
        <div className="text-[20px] font-bold ds-display" style={{ color: 'var(--color-ds-muted)' }}>÷</div>
        <div className="text-center">
          <div className="text-[11px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'НСЗУ спеціалісти' : 'NHSU specialists'}</div>
          <div className="text-[22px] font-bold ds-display" style={{ color: '#e8c97a' }}>4,000</div>
          <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? '× 1,250 сес.' : '× 1,250 sessions'}</div>
        </div>
        <div className="text-[20px] font-bold ds-display" style={{ color: 'var(--color-ds-muted)' }}>=</div>
        <div className="text-center">
          <div className="text-[11px] ds-body mb-1" style={{ color: '#00d4aa' }}>{lang === 'uk' ? 'Беклог' : 'Backlog'}</div>
          <div className="text-[36px] font-bold ds-display" style={{ color: '#00d4aa', textShadow: '0 0 30px rgba(0,210,170,0.4)' }}>12.4</div>
          <div className="text-[9px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>{lang === 'uk' ? 'років' : 'years'}</div>
        </div>
      </motion.div>

      {/* Scenario bars */}
      <div className="cyber-label" style={{ color: 'var(--color-ds-gold)' }}>
        {lang === 'uk' ? 'СЦЕНАРНИЙ АНАЛІЗ — СКІЛЬКИ РОКІВ ДО ЗАКРИТТЯ' : 'SCENARIO ANALYSIS — YEARS TO CLOSURE'}
      </div>
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {SCENARIOS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 + 0.2 }}
            className="flex items-center gap-4 p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.color}2a` }}
          >
            <div className="w-32 flex-shrink-0">
              <div className="text-[11px] ds-body leading-snug" style={{ color: 'rgba(200,208,220,0.85)' }}>{s.label[lang]}</div>
            </div>
            {/* Bar */}
            <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(s.years / MAX_YEARS) * 100}%` }}
                transition={{ delay: i * 0.12 + 0.4, duration: 0.7 }}
                className="h-full rounded-lg flex items-center pl-2"
                style={{ background: `linear-gradient(90deg, ${s.color}99, ${s.color}55)`, boxShadow: `0 0 12px ${s.color}44` }}
              >
                <span className="text-[13px] font-bold ds-display" style={{ color: s.color }}>{s.years}</span>
                <span className="text-[9px] ds-body ml-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {lang === 'uk' ? 'р.' : 'yrs'}
                </span>
              </motion.div>
            </div>
            <div className="w-48 flex-shrink-0 text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
              {s.note[lang]}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);
