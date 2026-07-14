import React, { useState, useCallback } from 'react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';
import { L1Strategic } from './L1Strategic';
import { L2MHEI } from './L2MHEI';
import { DrilldownProvider } from '../drilldown/DrilldownContext';
// 6 program layer L2 screens
import { L2Finance } from './L2Finance';
import { L2Clinical } from './L2Clinical';
import { L2Data } from './L2Data';
import { L2Sustain } from './L2Sustain';
import { L2Digital } from './L2Digital';
import { L2Regulatory } from './L2Regulatory';
// legacy/supporting screens
import { L2Coverage } from './L2Coverage';
import { L2Backlog } from './L2Backlog';
import { L2Operational } from './L2Operational';
import { L2Analytical } from './L2Analytical';
import { L2Journey } from './L2Journey';
import { LangThemeBar } from './LangThemeBar';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  lang: Language;
  liveHciValue?: number | null;
  onAppendix: () => void;
  onL4: () => void;
  onLangChange: (l: Language) => void;
  darkMode: boolean;
  onThemeToggle: () => void;
}

const VALID_SCREEN_IDS: ScreenId[] = [
  'l1','l2-mhei','l2-fintech','l2-clinical','l2-data','l2-sustain',
  'l2-digital','l2-regulatory','l2-finance','l2-coverage','l2-backlog',
  'l2-operational','l2-analytical','l2-journey',
];

function readHash(): ScreenId {
  const h = window.location.hash.replace('#', '') as ScreenId;
  return VALID_SCREEN_IDS.includes(h) ? h : 'l1';
}

export const ScreenRouter: React.FC<Props> = ({
  lang, liveHciValue, onAppendix, onL4, onLangChange, darkMode, onThemeToggle,
}) => {
  const [history, setHistory] = useState<ScreenId[]>(() => [readHash()]);

  const current = history[history.length - 1];

  // Sync hash → state on browser back/forward
  React.useEffect(() => {
    const onHashChange = () => {
      const id = readHash();
      if (id === current) return;
      setHistory((h) => [...h, id]);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [current]);

  const push = useCallback((id: ScreenId) => {
    if (id === 'appendix') {
      window.location.hash = 'appendix';
      onAppendix();
      return;
    }
    if (id === 'l4') {
      window.location.hash = 'l4';
      onL4();
      return;
    }
    window.location.hash = id;
    setHistory((h) => [...h, id]);
  }, [onAppendix, onL4]);

  const back = useCallback(() => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      window.location.hash = next[next.length - 1];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    window.location.hash = 'l1';
    setHistory(['l1']);
  }, []);

  const nav: ScreenNav = { current, history, push, back, reset };

  const screens: Record<Exclude<ScreenId, 'appendix' | 'l4'>, React.ReactNode> = {
    'l1':               <L1Strategic lang={lang} nav={nav} liveHciValue={liveHciValue} darkMode={darkMode} />,
    'l2-mhei':          <L2MHEI lang={lang} nav={nav} />,
    // 6 program layer L2 screens
    'l2-fintech':       <L2Finance lang={lang} nav={nav} />,
    'l2-clinical':      <L2Clinical lang={lang} nav={nav} />,
    'l2-data':          <L2Data lang={lang} nav={nav} />,
    'l2-sustain':       <L2Sustain lang={lang} nav={nav} />,
    'l2-digital':       <L2Digital lang={lang} nav={nav} />,
    'l2-regulatory':    <L2Regulatory lang={lang} nav={nav} />,
    // legacy/supporting screens
    'l2-finance':       <L2Finance lang={lang} nav={nav} />,
    'l2-coverage':      <L2Coverage lang={lang} nav={nav} />,
    'l2-backlog':       <L2Backlog lang={lang} nav={nav} />,
    'l2-operational':   <L2Operational lang={lang} nav={nav} />,
    'l2-analytical':    <L2Analytical lang={lang} nav={nav} />,
    'l2-journey':       <L2Journey lang={lang} nav={nav} />,
  };

  if (current === 'appendix') return null;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50"
        >
          <DrilldownProvider>
            {screens[current as Exclude<ScreenId, 'appendix'>]}
          </DrilldownProvider>
        </motion.div>
      </AnimatePresence>

      {/* ── Persistent lang + theme bar — same position on every L1/L2 screen ── */}
      <div className="fixed top-3 right-4 z-[60] pointer-events-auto">
        <LangThemeBar
          lang={lang}
          onLangChange={onLangChange}
          darkMode={darkMode}
          onThemeToggle={onThemeToggle}
        />
      </div>
    </>
  );
};
