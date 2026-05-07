import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

const TOPICS: { uk: string; en: string; screen: ScreenId }[] = [
  { uk: '9 розривів системи',    en: '9 System Gaps',         screen: 'l2-operational' },
  { uk: 'Ландшафт MHPSS',        en: 'MHPSS Landscape',       screen: 'l1'             },
  { uk: 'Карта видимості даних',  en: 'Data Visibility Map',   screen: 'l2-analytical'  },
  { uk: 'Покриття 0.28%',         en: 'Coverage 0.28%',        screen: 'l2-coverage'    },
  { uk: 'Системний беклог',       en: 'System Backlog',        screen: 'l2-backlog'     },
  { uk: 'Локалізація ресурсів',   en: 'Resource Localization', screen: 'l2-regulatory'  },
];

export const L3Footer: React.FC<Props> = ({ lang, nav }) => {
  const [open, setOpen] = useState(false);
  const uk = lang === 'uk';

  return (
    <div
      className="flex-shrink-0 px-5 pb-2"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(o => !o)}
          style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(200,208,220,0.45)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: 4 }}
        >
          {uk ? 'розділи звіту' : 'report sections'} {open ? '↑' : '↓'}
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => nav.push('appendix')}
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12,
            color: '#00d4aa', background: 'rgba(0,212,170,0.1)',
            border: '1px solid rgba(0,212,170,0.3)', borderRadius: 10,
            padding: '6px 14px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          {uk ? '→ Аналітичний звіт' : '→ Analytical Report'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px', paddingTop: 8 }}>
              {TOPICS.map(topic => (
                <button
                  key={topic.en}
                  onClick={() => nav.push(topic.screen)}
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10,
                    color: '#00d4aa', background: 'rgba(0,212,170,0.06)',
                    border: '1px solid rgba(0,212,170,0.2)', borderRadius: 5,
                    padding: '2px 8px', cursor: 'pointer' }}
                >
                  {topic[lang]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
