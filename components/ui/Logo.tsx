import React from 'react';

interface LogoProps {
  className?: string;
  darkMode?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, darkMode = true }) => {
  const gold = darkMode ? '#e8c97a' : '#c8a44c';
  const teal = darkMode ? '#00d4aa' : '#2ec4b6';
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon: Puzzle Piece with Cyber Accents */}
      <div className="relative w-8 h-8 flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main Puzzle Shape */}
          <path 
            d="M11.5 3C11.5 2.44772 11.9477 2 12.5 2C13.0523 2 13.5 2.44772 13.5 3V4.05C13.5 4.57467 13.9253 5 14.45 5H18.5C19.6046 5 20.5 5.89543 20.5 7V11.05C20.5 11.5747 20.9253 12 21.45 12C22.0023 12 22.45 12.4477 22.45 13C22.45 13.5523 22.0023 14 21.45 14C20.9253 14 20.5 14.4253 20.5 14.95V19C20.5 20.1046 19.6046 21 18.5 21H14.45C13.9253 21 13.5 21.4253 13.5 21.95C13.5 22.5023 13.0523 22.95 12.5 22.95C11.9477 22.95 11.5 22.5023 11.5 21.95V20.9C11.5 20.3753 11.0747 19.95 10.55 19.95H5.5C4.39543 19.95 3.5 19.0546 3.5 17.95V12.9C3.5 12.3753 3.07467 11.95 2.55 11.95C1.99772 11.95 1.55 11.5023 1.55 10.95C1.55 10.3977 1.99772 9.95 2.55 9.95C3.07467 9.95 3.5 9.52467 3.5 9V5C3.5 3.89543 4.39543 3 5.5 3H10.55C11.0747 3 11.5 3.42533 11.5 3.95V3Z" 
            fill={gold} 
            fillOpacity={darkMode ? "0.15" : "0.1"}
            stroke={gold}
            strokeWidth="1.5"
          />
          {/* Inner core dot */}
          <circle cx="12" cy="12" r="2" fill={teal} />
          {/* Accent lines */}
          <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke={teal} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>

      {/* Text Part: FEEL on top, AGAIN on bottom (same width) */}
      <div className="flex flex-col leading-[0.8] select-none">
        <svg viewBox="0 0 100 38" className="h-7 w-auto overflow-visible">
          <text 
            x="50%" 
            y="14" 
            textAnchor="middle"
            textLength="100" 
            lengthAdjust="spacingAndGlyphs"
            style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 800, 
              fontSize: '16px',
              fill: darkMode ? '#FFFFFF' : '#0a1628',
              letterSpacing: '0.05em'
            }}
          >
            FEEL
          </text>
          <text 
            x="50%" 
            y="34" 
            textAnchor="middle"
            textLength="100" 
            lengthAdjust="spacingAndGlyphs"
            style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 800, 
              fontSize: '16px',
              fill: gold,
              letterSpacing: '0.05em'
            }}
          >
            AGAIN
          </text>
        </svg>
      </div>
    </div>
  );
};
