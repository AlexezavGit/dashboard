import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

const GAPS = [
  { id: 'info', color: '#e8c97a', icon: '📊', label: { uk: 'Інформаційний', en: 'Informational' }, val: '0%', valLabel: { uk: 'ЄСОЗ↔Гуман. синхр.', en: 'ESOZ↔Human. sync' }, desc: { uk: 'CommCare/Kobo → ЄСОЗ = 0 автоматичного обміну', en: 'CommCare/Kobo → ESOZ = 0 automated exchange' } },
  { id: 'fin', color: '#ff7b6e', icon: '💰', label: { uk: 'Фінансовий', en: 'Financial' }, val: '$5M', valLabel: { uk: '/міс. ерозія', en: '/mo erosion' }, desc: { uk: 'Дублювання звітності: 3.5 год/тиждень × 35K фахівців', en: 'Report duplication: 3.5 hrs/week × 35K specialists' } },
  { id: 'budget', color: '#a78bfa', icon: '⚖️', label: { uk: 'Бюджетний', en: 'Budget' }, val: '8.1:1', valLabel: { uk: 'стаціонар vs амбулатор', en: 'inpatient vs outpatient' }, desc: { uk: '55% стаціонар при 71% попиті на амбулаторні послуги', en: '55% inpatient with 71% demand for outpatient services' } },
  { id: 'cap', color: '#ff7b6e', icon: '🏥', label: { uk: 'Місткісний', en: 'Capacity' }, val: '0.28%', valLabel: { uk: 'потреби покрито', en: 'need covered' }, desc: { uk: '5M доступних vs 62.4M необхідних сесій/рік', en: '5M available vs 62.4M needed sessions/year' } },
  { id: 'local', color: '#00d4aa', icon: '🌍', label: { uk: 'Гуманітарний', en: 'Humanitarian' }, val: '1%', valLabel: { uk: 'локалізація (ціль 25%)', en: 'localisation (target 25%)' }, desc: { uk: 'Grand Bargain: 1% замість 25% до місцевих НУО', en: 'Grand Bargain: 1% instead of 25% to local NGOs' } },
  { id: 'path', color: '#e8c97a', icon: '🛤️', label: { uk: 'Шлях клієнта', en: 'Client pathway' }, val: '54%', valLabel: { uk: 'не завершують курс', en: 'do not complete course' }, desc: { uk: '78% переходів без направлення; навмання маршрутизація', en: '78% transitions without referral; navigation by guesswork' } },
  { id: 'admin', color: '#2ec4b6', icon: '📋', label: { uk: 'Адміністративний', en: 'Administrative' }, val: '22%', valLabel: { uk: 'час на дублювання', en: 'time on duplication' }, desc: { uk: 'ЄСОЗ + гуманітарна платформа = подвійна робота, ціль 7%', en: 'ESOZ + humanitarian platform = double work, target 7%' } },
  { id: 'ops', color: '#ff7b6e', icon: '⚙️', label: { uk: 'Операційний', en: 'Operational' }, val: '2×/тиж', valLabel: { uk: 'ручна координація', en: 'manual coordination' }, desc: { uk: 'Неможливо масштабувати при 50-60M год/рік обсязі', en: 'Cannot scale at 50-60M hrs/year load' } },
  { id: 'interop', color: '#a78bfa', icon: '🔌', label: { uk: 'Інтероперабельність', en: 'Interoperability' }, val: '0', valLabel: { uk: 'API між системами', en: 'APIs between systems' }, desc: { uk: 'ЄСОЗ ↔ CommCare ↔ ActivityInfo ↔ Kobo: повна ізоляція', en: 'ESOZ ↔ CommCare ↔ ActivityInfo ↔ Kobo: complete isolation' } },
];

export const L2Operational: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 50% 60% at 50% 20%, rgba(46,196,182,0.10) 0%, transparent 55%), ' +
        'linear-gradient(135deg, #080f1c 0%, #0a1628 100%)',
    }}
  >
    <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #2ec4b6 50%, transparent)', boxShadow: '0 0 14px rgba(46,196,182,0.4)' }} />

    <div className="flex items-center gap-4 px-6 pt-5 pb-3 flex-shrink-0">
      <button onClick={nav.back} className="flex items-center gap-1.5 text-[11px] ds-display font-medium" style={{ color: 'var(--color-ds-muted)' }}>
        <ArrowLeft className="w-4 h-4" /> {lang === 'uk' ? 'Назад' : 'Back'}
      </button>
      <div className="w-px h-4" style={{ background: 'var(--color-ds-border)' }} />
      <div>
        <div className="text-[18px] font-bold ds-display" style={{ color: '#2ec4b6' }}>
          {lang === 'uk' ? '9 Операційних розривів' : '9 Operational Gaps'}
        </div>
        <div className="text-[11px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          {lang === 'uk' ? 'Що блокує масштабування MHPSS системи' : 'What blocks MHPSS system scale-up'}
        </div>
      </div>
      <div className="flex-1" />
      <button onClick={() => nav.push('appendix')} className="text-[11px] ds-display font-medium" style={{ color: 'var(--color-ds-gold)' }}>
        {lang === 'uk' ? '↓ Повна аналітика' : '↓ Full analytics'}
      </button>
    </div>

    <div className="flex-1 grid grid-cols-3 gap-3 px-6 pb-5 min-h-0">
      {GAPS.map((g, i) => (
        <motion.div
          key={g.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.07 }}
          className="rounded-xl p-4 flex flex-col"
          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${g.color}33` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[18px]">{g.icon}</span>
            <span className="cyber-label" style={{ color: g.color }}>{g.label[lang]}</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-[26px] font-bold ds-display" style={{ color: g.color, textShadow: `0 0 20px ${g.color}66` }}>{g.val}</span>
            <span className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{g.valLabel[lang]}</span>
          </div>
          <p className="text-[10px] ds-body leading-snug mt-auto" style={{ color: 'rgba(200,208,220,0.65)' }}>{g.desc[lang]}</p>
        </motion.div>
      ))}
    </div>
  </div>
);
