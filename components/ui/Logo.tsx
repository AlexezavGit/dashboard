import React from 'react';

interface LogoProps {
  className?: string;
  darkMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, darkMode = true }) => {
  // DS canonical colors from screenshot 1
  const teal = darkMode ? '#1C5A52' : '#123C3A';
  const gold = darkMode ? '#E3A22E' : '#C9B36A';
  const orange = darkMode ? '#B5481A' : '#992602';
  const blue = darkMode ? '#0C293A' : '#0B2422';
  const textGold = darkMode ? '#E3A22E' : '#8A6830';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* FE Monogram — geometric bar composition */}
      <div className="flex-shrink-0" style={{ width: 48, height: 48 }}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Vertical bars — left group (F) */}
          <rect x="4" y="4" width="6" height="40" rx="1" fill={teal} />
          <rect x="12" y="4" width="4" height="28" rx="1" fill={blue} />
          <rect x="18" y="8" width="3" height="20" rx="1" fill={gold} opacity="0.7" />

          {/* Horizontal bars — F crossbars */}
          <rect x="4" y="4" width="18" height="4" rx="1" fill={teal} />
          <rect x="4" y="16" width="14" height="3" rx="1" fill={gold} />
          <rect x="4" y="24" width="10" height="2" rx="1" fill={orange} opacity="0.6" />

          {/* Vertical bars — right group (E) */}
          <rect x="26" y="4" width="5" height="40" rx="1" fill={orange} />
          <rect x="33" y="8" width="4" height="32" rx="1" fill={teal} opacity="0.6" />
          <rect x="39" y="4" width="5" height="40" rx="1" fill={blue} opacity="0.5" />

          {/* Horizontal bars — E crossbars */}
          <rect x="26" y="4" width="18" height="4" rx="1" fill={orange} />
          <rect x="26" y="18" width="14" height="3" rx="1" fill={teal} />
          <rect x="26" y="30" width="16" height="3" rx="1" fill={gold} />
          <rect x="26" y="42" width="18" height="4" rx="1" fill={blue} opacity="0.4" />
        </svg>
      </div>

      {/* "Again" text — spaced letters, gold on dark / petrol on light */}
      <div className="select-none" style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 400,
        fontSize: 14,
        letterSpacing: '0.35em',
        color: textGold,
        lineHeight: 1,
      }}>
        Again
      </div>
    </div>
  );
};
