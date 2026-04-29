import React, { useState, useCallback } from 'react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';
import { L1Strategic } from './L1Strategic';
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
import { LangThemeBar } from './LangThemeBar';
import { AnimatePresence, motion } from 'motion/react';

interface Props {
  lang: Language;
  liveHciValue?: number | null;
  onAppendix: () => void;
  onLangChange: (l: Language) => void;
  darkMode: boolean;
  onThemeToggle: () => void;
}

export const ScreenRouter: React.FC<Props> = ({
  lang, liveHciValue, onAppendix, onLangChange, darkMode, onThemeToggle,
}) => {
  const [history, setHistory] = useState<ScreenId[]>(['l1']);

  const current = history[history.length - 1];

  const push = useCallback((id: ScreenId) => {
    if (id === 'appendix') {
      onAppendix();
      return;
    }
    setHistory((h) => [...h, id]);
  }, [onAppendix]);

  const back = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  }, []);

  const reset = useCallback(() => setHistory(['l1']), []);

  const nav: ScreenNav = { current, history, push, back, reset };

  const screens: Record<Exclude<ScreenId, 'appendix'>, React.ReactNode> = {
    'l1':               <L1Strategic lang={lang} nav={nav} liveHciValue={liveHciValue} />,
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
          {screens[current as Exclude<ScreenId, 'appendix'>]}
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
