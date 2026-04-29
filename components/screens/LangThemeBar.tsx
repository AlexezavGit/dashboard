import React from 'react';
import { Language } from '../../types';

interface Props {
  lang: Language;
  onLangChange: (l: Language) => void;
  darkMode: boolean;
  onThemeToggle: () => void;
}

export const LangThemeBar: React.FC<Props> = ({ lang, onLangChange, darkMode, onThemeToggle }) => (
  <div className="flex items-center gap-1.5 flex-shrink-0">
    <div className="flex p-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <button
        onClick={() => onLangChange('uk')}
        className="px-2.5 py-1 rounded-md text-[10px] font-bold ds-display transition-all"
        style={lang === 'uk'
          ? { background: 'var(--color-ds-gold)', color: '#0a1628' }
          : { color: 'var(--color-ds-muted)' }}
      >UA</button>
      <button
        onClick={() => onLangChange('en')}
        className="px-2.5 py-1 rounded-md text-[10px] font-bold ds-display transition-all"
        style={lang === 'en'
          ? { background: 'var(--color-ds-gold)', color: '#0a1628' }
          : { color: 'var(--color-ds-muted)' }}
      >EN</button>
    </div>
    <button
      onClick={onThemeToggle}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] transition-all"
      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-ds-muted)' }}
      title={darkMode ? 'Light mode' : 'Dark mode'}
    >
      {darkMode ? '☀' : '◑'}
    </button>
  </div>
);
