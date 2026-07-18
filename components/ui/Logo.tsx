import React from 'react';

interface LogoProps {
  className?: string;
  darkMode?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Canonical FEEL mark from Design System A4
// Uses 4 rectangular puzzle pieces (F, E1, E2, L) with different colors/opacity
// Light theme: petrol/teal colors on cream background
// Dark theme: cream/gold colors on bunker background
// Bottom fade: 0-58% full, 58-78% 40% opacity, 78-100% 15% opacity (no "jaws")
export const Logo: React.FC<LogoProps> = ({ className, darkMode = false, size = 'md' }) => {
  const sizeMap = { sm: 40, md: 56, lg: 72 };
  const logoSize = sizeMap[size];
  
  // Colors for light theme (from Design System)
  const colorF = darkMode ? '#F2EADB' : '#123C3A';
  const colorE1 = darkMode ? '#C9B36A' : '#8A6830';
  const colorE2 = darkMode ? 'rgba(242,234,219,0.55)' : 'rgba(18,60,58,0.55)';
  const colorL = darkMode ? 'rgba(242,234,219,0.3)' : 'rgba(18,60,58,0.3)';
  const colorAgain = darkMode ? '#C9B36A' : '#8A6830';

  // Scale for the original 1024x1024 SVG
  const scale = logoSize / 1024 * 0.8;
  const scaledSize = 1024 * scale;
  const againFontSize = logoSize * 0.25;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`} style={{ width: logoSize, height: logoSize }}>
      {/* FEEL mark with bottom fade using SVG mask */}
      <svg
        viewBox="0 0 1024 1024"
        width={scaledSize}
        height={scaledSize}
        style={{ display: 'block' }}
      >
        <defs>
          {/* Bottom fade gradient mask */}
          <linearGradient id="logo-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="1"/>
            <stop offset="58%"  stopColor="white" stopOpacity="1"/>
            <stop offset="78%"  stopColor="white" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="white" stopOpacity="0.15"/>
          </linearGradient>
          
          {/* Mask that applies the fade */}
          <mask id="logo-mask">
            <rect x="0" y="0" width="1024" height="1024" fill="url(#logo-fade)"/>
          </mask>
        </defs>
        
        {/* Apply mask to the entire FEEL group */}
        <g mask="url(#logo-mask)">
          {/* F (frontmost) */}
          <path d="M 285.71 226.54 L 285.71 797.46 L 345.54 797.46 L 345.54 541.41 L 532.39 541.41 L 532.39 484.11 L 345.54 484.11 L 345.54 283.84 L 547.33 283.84 L 547.33 226.54 Z" fill={colorF} />
          
          {/* E1 (gold/brass) */}
          <path d="M 407.41 226.54 L 407.41 797.46 L 467.24 797.46 L 467.24 541.41 L 654.09 541.41 L 654.09 484.11 L 467.24 484.11 L 467.24 283.84 L 669.03 283.84 L 669.03 226.54 Z" fill={colorE1} />
          
          {/* E2 (semi-transparent) */}
          <path d="M 529.11 226.54 L 529.11 797.46 L 588.94 797.46 L 588.94 541.41 L 775.79 541.41 L 775.79 484.11 L 588.94 484.11 L 588.94 283.84 L 790.73 283.84 L 790.73 226.54 Z" fill={colorE2} />
          
          {/* L (backmost, most transparent) */}
          <path d="M 650.81 226.54 L 650.81 797.46 L 710.64 797.46 L 710.64 283.84 L 790.73 283.84 L 790.73 226.54 Z" fill={colorL} />
        </g>
      </svg>
      
      {/* Again text with spaced letters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: scaledSize * 0.85,
        marginTop: -logoSize * 0.05,
      }}>
        {['A', 'g', 'a', 'i', 'n'].map((letter, i) => (
          <span 
            key={i}
            style={{
              fontFamily: 'Source Sans 3, sans-serif',
              fontWeight: 700,
              fontSize: againFontSize,
              color: colorAgain,
              lineHeight: 1,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};
