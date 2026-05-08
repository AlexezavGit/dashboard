import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../types';
import { ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

const TOPICS: { uk: string; en: string; anchor: string }[] = [
  { uk: 'Поширеність розладів',    en: 'Disorder Prevalence',    anchor: 'section-prevalence'  },
  { uk: 'Кадровий дефіцит',        en: 'Workforce Gap',          anchor: 'section-workforce'   },
  { uk: 'Бюджет і фінансування',   en: 'Budget & Funding',       anchor: 'section-budget'      },
  { uk: 'Клінічний розрив',         en: 'Clinical Gap',           anchor: 'section-gap'         },
  { uk: 'Тіньовий сектор',         en: 'Shadow Sector',          anchor: 'section-shadow'      },
  { uk: 'Економічний вплив',        en: 'Economic Impact',        anchor: 'section-economic'    },
  { uk: 'Діти та підлітки',         en: 'Children & Adolescents', anchor: 'section-children'    },
  { uk: 'Дані та інтероп',          en: 'Data & Interop',         anchor: 'data-intelligence'   },
  { uk: '4 Функції FEEL Again',     en: '4 FEEL Again Functions', anchor: 'feel-functions'      },
];

export const L3Footer: React.FC<Props> = ({ lang, nav }) => {
  const [open, setOpen] = useState(false);
  const uk = lang === 'uk';

  const goToSection = (anchor: string) => {
    sessionStorage.setItem('l3-scroll', anchor);
    nav.push('appendix');
  };

  return (
    <div
      className="flex-shrink-0 px-5 pb-2"
      style={{ borderTop: '1px solid var(--color-ds-border)', paddingTop: 8 }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 10,
            color: 'var(--color-ds-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {uk ? 'розділи звіту' : 'report sections'} {open ? '↑' : '↓'}
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => nav.push('appendix')}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            color: 'var(--color-ds-teal)',
            background: 'color-mix(in srgb, var(--color-ds-teal) 10%, transparent)',
            border: '1px solid color-mix(in srgb, var(--color-ds-teal) 30%, transparent)',
            borderRadius: 10,
            padding: '6px 14px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
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
                  key={topic.anchor}
                  onClick={() => goToSection(topic.anchor)}
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 10,
                    color: 'var(--color-ds-teal)',
                    background: 'color-mix(in srgb, var(--color-ds-teal) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-ds-teal) 20%, transparent)',
                    borderRadius: 5,
                    padding: '2px 8px',
                    cursor: 'pointer',
                  }}
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
