import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

const SYSTEMS = [
  { name: 'CommCare', owner: { uk: 'Гуманітарний', en: 'Humanitarian' }, sessions: '2.1M', visibility: 85, esoz: 0, open: true, color: '#00d4aa' },
  { name: 'KoBo Toolbox', owner: { uk: 'Гуманітарний', en: 'Humanitarian' }, sessions: '0.8M', visibility: 70, esoz: 0, open: true, color: '#00d4aa' },
  { name: 'ActivityInfo', owner: { uk: 'Гуманітарний', en: 'Humanitarian' }, sessions: '1.8M', visibility: 75, esoz: 0, open: true, color: '#00d4aa' },
  { name: 'ЄСОЗ / eHealth', owner: { uk: 'Держава', en: 'Government' }, sessions: '180K', visibility: 5, esoz: 100, open: false, color: '#ff7b6e' },
  { name: 'Тіньовий сектор', owner: { uk: 'Неформальний', en: 'Informal' }, sessions: '~3M', visibility: 3, esoz: 0, open: false, color: '#a78bfa' },
  { name: 'FEEL Again Bus', owner: { uk: 'Інфраструктура', en: 'Infrastructure' }, sessions: '→', visibility: 100, esoz: 100, open: true, color: '#e8c97a', isBus: true },
];

export const L2Analytical: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(167,139,250,0.12) 0%, transparent 55%), ' +
        'linear-gradient(135deg, #080f1c 0%, #0a1628 100%)',
    }}
  >
    <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #a78bfa 50%, transparent)', boxShadow: '0 0 14px rgba(167,139,250,0.4)' }} />

    <div className="flex items-center gap-4 px-6 pt-5 pb-3 flex-shrink-0">
      <button onClick={nav.back} className="flex items-center gap-1.5 text-[11px] ds-display font-medium" style={{ color: 'var(--color-ds-muted)' }}>
        <ArrowLeft className="w-4 h-4" /> {lang === 'uk' ? 'Назад' : 'Back'}
      </button>
      <div className="w-px h-4" style={{ background: 'var(--color-ds-border)' }} />
      <div>
        <div className="text-[18px] font-bold ds-display" style={{ color: '#a78bfa' }}>
          {lang === 'uk' ? 'Карта видимості даних' : 'Data Visibility Map'}
        </div>
        <div className="text-[11px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          {lang === 'uk' ? 'Що видно кому — і де повна темрява' : 'What is visible to whom — and where is complete darkness'}
        </div>
      </div>
      <div className="flex-1" />
      <button onClick={() => nav.push('appendix')} className="text-[11px] ds-display font-medium" style={{ color: 'var(--color-ds-gold)' }}>
        {lang === 'uk' ? '↓ API статус систем' : '↓ Systems API status'}
      </button>
    </div>

    <div className="flex-1 flex flex-col gap-4 px-6 pb-5 min-h-0">
      {/* Legend */}
      <div className="flex items-center gap-6 flex-shrink-0">
        {[
          { color: '#00d4aa', label: { uk: 'Відкрита / гуманітарна', en: 'Open / humanitarian' } },
          { color: '#ff7b6e', label: { uk: 'Закрита / державна', en: 'Closed / government' } },
          { color: '#a78bfa', label: { uk: 'Невидима / тіньова', en: 'Invisible / shadow' } },
          { color: '#e8c97a', label: { uk: 'FEEL Again (з\'єднує всіх)', en: 'FEEL Again (connects all)' } },
        ].map((l) => (
          <div key={l.color} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{l.label[lang]}</span>
          </div>
        ))}
      </div>

      {/* Matrix */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_80px_100px_80px_80px] gap-3 px-4">
          {['', lang === 'uk' ? 'Сесії/рік' : 'Sessions/yr', lang === 'uk' ? 'Видимість (%)' : 'Visibility (%)', lang === 'uk' ? 'У ЄСОЗ' : 'In ESOZ', lang === 'uk' ? 'Відкритий API' : 'Open API'].map((h, i) => (
            <div key={i} className="cyber-label text-center">{h}</div>
          ))}
        </div>

        {SYSTEMS.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09 }}
            className="grid grid-cols-[1fr_80px_100px_80px_80px] gap-3 items-center p-3 rounded-xl"
            style={{
              background: s.isBus ? `${s.color}12` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${s.color}${s.isBus ? '66' : '33'}`,
            }}
          >
            <div>
              <div className="text-[13px] font-semibold ds-display" style={{ color: s.color }}>{s.name}</div>
              <div className="text-[9px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{s.owner[lang]}</div>
            </div>
            <div className="text-center text-[13px] font-bold ds-display" style={{ color: s.color }}>{s.sessions}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.visibility}%` }}
                  transition={{ delay: i * 0.09 + 0.3, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: s.color }}
                />
              </div>
              <span className="text-[11px] font-bold ds-display w-8 text-right" style={{ color: s.color }}>{s.visibility}%</span>
            </div>
            <div className="text-center">
              <span className={`text-[12px] font-bold ds-display`} style={{ color: s.esoz > 0 ? '#00d4aa' : '#ff7b6e55' }}>
                {s.esoz > 0 ? `${s.esoz}%` : '✕'}
              </span>
            </div>
            <div className="text-center">
              <span style={{ color: s.open ? '#00d4aa' : '#ff7b6e' }}>{s.open ? '✓' : '✕'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="p-4 rounded-xl flex-shrink-0"
        style={{ background: 'rgba(232,201,122,0.07)', border: '1px solid rgba(232,201,122,0.25)' }}
      >
        <p className="text-[12px] ds-body leading-relaxed" style={{ color: 'rgba(200,208,220,0.8)' }}>
          {lang === 'uk'
            ? '~4.7M гуманітарних сесій невидимі для ЄСОЗ → не рахуються для THRIVE DLI → не тригерять disbursement. FEEL Again Digital Bus = один рядок у коді між кожною системою та ЄСОЗ через HL7 FHIR R4.'
            : '~4.7M humanitarian sessions are invisible to ESOZ → not counted for THRIVE DLIs → do not trigger disbursement. FEEL Again Digital Bus = one integration layer between each system and ESOZ via HL7 FHIR R4.'}
        </p>
      </motion.div>
    </div>
  </div>
);
