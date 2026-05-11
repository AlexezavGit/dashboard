import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

interface Topic { uk: string; en: string; anchor: string }

// All canonical L3 section anchors — data-intelligence & feel-functions removed per decisions #7/#8
const ALL_TOPICS: Topic[] = [
  { uk: 'Клінічний розрив',       en: 'Clinical Gap',           anchor: 'section-gap'        },
  { uk: 'Кадровий дефіцит',       en: 'Workforce Gap',          anchor: 'section-workforce'  },
  { uk: 'Бюджет і фінансування',  en: 'Budget & Funding',       anchor: 'section-budget'     },
  { uk: 'Тіньовий сектор',        en: 'Shadow Sector',          anchor: 'section-shadow'     },
  { uk: 'Поширеність розладів',   en: 'Disorder Prevalence',    anchor: 'section-prevalence' },
  { uk: 'Економічний вплив',      en: 'Economic Impact',        anchor: 'section-economic'   },
  { uk: 'Діти та підлітки',       en: 'Children & Adolescents', anchor: 'section-children'   },
  { uk: 'Вхідні дані',            en: 'Data Inputs',            anchor: 'section-inputs'     },
];

const byAnchor = (anchors: string[]): Topic[] =>
  anchors.map(a => ALL_TOPICS.find(t => t.anchor === a)!).filter(Boolean);

// Per-screen contextual topic sets (decision: show only relevant sections, no repetition)
const SCREEN_TOPICS: Partial<Record<ScreenId, Topic[]>> = {
  'l2-fintech':     byAnchor(['section-budget', 'section-gap', 'section-economic']),
  'l2-clinical':    byAnchor(['section-gap', 'section-workforce', 'section-children', 'section-prevalence']),
  'l2-analytical':  byAnchor(['section-gap']),   // decision #8: show only gap
  'l2-data':        byAnchor(['section-gap']),   // aliased to l2-analytical
  'l2-sustain':     byAnchor(['section-workforce', 'section-budget', 'section-shadow']),
  'l2-digital':     byAnchor(['section-inputs', 'section-budget', 'section-gap']),
  'l2-regulatory':  byAnchor(['section-shadow', 'section-budget', 'section-economic']),
  'l2-operational': byAnchor(['section-gap', 'section-workforce', 'section-budget', 'section-economic']),
  'l2-coverage':    byAnchor(['section-prevalence', 'section-gap', 'section-children']),
  'l2-backlog':     byAnchor(['section-gap', 'section-workforce', 'section-inputs']),
  'l2-finance':     byAnchor(['section-budget', 'section-gap', 'section-economic']),
};

const DEFAULT_TOPICS = byAnchor([
  'section-gap', 'section-workforce', 'section-budget',
  'section-shadow', 'section-prevalence', 'section-economic',
  'section-children', 'section-inputs',
]);

export const L3Footer: React.FC<Props> = ({ lang, nav }) => {
  const [open, setOpen] = useState(false);
  const uk = lang === 'uk';

  const topics: Topic[] =
    SCREEN_TOPICS[nav.current as ScreenId] ?? DEFAULT_TOPICS;

  const isAnalytical =
    nav.current === 'l2-analytical' || nav.current === 'l2-data';

  const goToSection = (anchor: string) => {
    sessionStorage.setItem('l3-scroll', anchor);
    nav.push('appendix');
  };

  return (
    <div
      className="flex-shrink-0 px-5 pb-2"
      style={{ borderTop: '2px solid rgba(212,165,116,0.4)', background: 'rgba(212,165,116,0.05)', paddingTop: 8 }}
    >
      <div className="flex items-center gap-3 flex-wrap">
        {/* Report sections toggle */}
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
          {uk ? 'Дані ↑' : 'Data ↑'} {open ? '↑' : '↓'}
        </button>

        {/* API connection badge — decision #7: visible on all L2 screens */}
        <button
          onClick={() => nav.push('l2-analytical')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontFamily: 'DM Mono, monospace',
            fontSize: 9,
            color: isAnalytical ? '#00d4aa' : 'rgba(0,210,170,0.55)',
            background: isAnalytical
              ? 'rgba(0,210,170,0.10)'
              : 'rgba(0,210,170,0.04)',
            border: isAnalytical
              ? '1px solid rgba(0,210,170,0.35)'
              : '1px solid rgba(0,210,170,0.12)',
            borderRadius: 5,
            padding: '2px 8px',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          <span style={{
            width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
            background: isAnalytical ? '#00d4aa' : 'rgba(0,210,170,0.35)',
            boxShadow: isAnalytical ? '0 0 6px #00d4aa' : 'none',
          }} />
          {uk ? 'API статус' : 'API status'}
        </button>

        <div style={{ flex: 1 }} />

        {/* Full report button */}
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

      {/* Contextual section chips */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px', paddingTop: 8 }}>
              {topics.map(topic => (
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
