/**
 * RingNav — FEEL Again unified metal ring navigation
 * Source: Bunker image/FEEL Ring.dc.html + FEEL Again - Design System.dc.html
 * Alex 2026-07-29: 1 ring, 2 rows, 6 menu items, metal gold surface
 *
 * Usage:
 *   <RingNav
 *     active="dashboard"
 *     subNumbers={["3.9M", "38%", "$13.94B", "1"]}
 *     onSelect={(id) => nav.push(id)}
 *   />
 */
import React, { useState, useRef, useEffect } from 'react';

// ── Design system tokens (extracted from Bunker image/) ─────────────────────
const T = {
  // Palette
  petrolTeal: '#123C3A',
  panel: '#0E302E',
  brass: '#E3A22E',
  brassHi: '#F2C84A',
  brassLo: '#8A6320',
  orange: '#E8741E',
  steel: '#6E8C9C',
  cream: '#EFE6D2',
  signal: '#E50914',
  // Background
  bgBase: '#050C16',
  bgTop: '#0B1A26',
  // Metal Gold gradient (ring surface)
  metalGold: 'linear-gradient(180deg, #6C4A18 0%, #B08A38 18%, #F2C84A 42%, #E3A22E 58%, #8A6320 82%, #3E2C10 100%)',
  // Type
  fontDisplay: "'Archivo', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', 'SF Mono', monospace",
};

// ── Menu structure (per Alex 2026-07-29 13:06) ──────────────────────────────
export const RING_MENU = [
  { id: 'program',   title: 'ПРОГРАМА',  sub: 'FEEL Again · що і як',
    subs: ['ЧОМУ', 'ЯК', 'НАПРЯМИ', 'ВПЛИВ', 'ОСІ', 'ЦІНА', 'ROI', 'РОЗГОРТАННЯ', 'СТЕК', 'ХТО'] },
  { id: 'dashboard', title: 'ДАШБОРД',   sub: 'сектор · MHPSS · 2025—2027',
    subs: ['ЛАНДШАФТ', 'DIGITAL BUS', 'СИМУЛЯЦІЯ', 'DLI ТРЕКЕР', 'L3 ПЕРВИННІ', 'РІШЕННЯ'] },
  { id: 'ecosystem', title: 'УЧАСНИКИ',  sub: 'донори · провайдери · беніфіціари',
    subs: ['ДОНОРИ', 'ПРОВАЙДЕРИ', 'БЕНЕФІЦІАРИ', 'КОАЛІЦІЇ', 'АКАДЕМІЯ', 'ДОДАТИ'] },
  { id: 'cabinets',  title: 'КАБІНЕТИ',  sub: 'вхід · реєстрація',
    subs: ['УВІЙТИ', 'РЕЄСТРАЦІЯ', 'ЗАБУВ ПАРОЛЬ', 'ДОПОМОГА'] },
  { id: 'demo',      title: 'ДЕМО',      sub: 'аніматований tutorial',
    subs: ['СТАРТ', 'НАВІГАЦІЯ', 'L1', 'L2', 'КАБІНЕТИ'] },
  { id: 'charter',   title: 'ХАРТІЯ · УГОДА · ОФЕРТА · КОНСОРЦІУМ',
    sub: 'правові рамки програми',
    subs: ['ХАРТІЯ', 'УГОДА', 'ОФЕРТА', 'КОНСОРЦІУМ'] },
];

interface RingNavProps {
  active: string;
  subNumbers?: string[];        // Numbers that flow into hourglass from top
  subLabels?: string[];          // Optional labels for numbers
  onSelect?: (id: string) => void;
  darkMode?: boolean;
}

export const RingNav: React.FC<RingNavProps> = ({
  active,
  subNumbers = [],
  subLabels = [],
  onSelect,
  darkMode = true,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate tickmark positions for metal scale effect
  const renderTicks = (count: number, height: number, boldEvery = 4) =>
    Array.from({ length: count }, (_, i) => {
      const bold = i % boldEvery === 0;
      return (
        <div
          key={i}
          style={{
            width: bold ? 2 : 1,
            height: bold ? height * 0.65 : height * 0.4,
            background: bold ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
            boxShadow: bold ? '1px 0 0 rgba(255,235,180,0.4)' : 'none',
            margin: '0 1px',
          }}
        />
      );
    });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        background: darkMode ? T.bgBase : T.cream,
        fontFamily: T.fontDisplay,
        userSelect: 'none',
        zIndex: 200,
      }}
    >
      {/* ── Main row (110px metal scale with menu items) ─────────────── */}
      <div
        style={{
          position: 'relative',
          height: 110,
          background: T.metalGold,
          boxShadow: 'inset 0 2px 0 rgba(180,140,60,0.4), inset 0 -2px 0 rgba(0,0,0,0.55), 0 4px 24px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Tickmarks (notches) - bottom half */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 8px 6px',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        >
          {renderTicks(80, 24, 4)}
        </div>

        {/* Top edge highlight (curvature illusion) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Bottom edge dark bevel */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 18,
            background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Menu items */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 24px',
            zIndex: 2,
          }}
        >
          {RING_MENU.map((item) => {
            const isActive = active === item.id;
            const isHovered = hoveredId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect?.(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-current={isActive ? 'page' : undefined}
                title={item.title}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  fontFamily: T.fontDisplay,
                  fontWeight: 800,
                  fontSize: item.id === 'charter' ? 13 : 18,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: isActive
                    ? '#1a0f00'
                    : isHovered
                      ? 'rgba(26,15,0,0.85)'
                      : 'rgba(26,15,0,0.55)',
                  textShadow: isActive
                    ? '0 0 12px rgba(255,235,180,0.8), 0 1px 0 rgba(255,255,255,0.4)'
                    : 'none',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.title}
                {isActive && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: '10%',
                      right: '10%',
                      bottom: -10,
                      height: 2,
                      background: T.brassHi,
                      boxShadow: '0 0 12px rgba(242,200,74,0.9)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Sub row (46px) — section numbers, can flow into hourglass from above ─ */}
      {subNumbers.length > 0 && (
        <div
          style={{
            position: 'relative',
            height: 46,
            background: darkMode
              ? 'linear-gradient(180deg, #0a1628 0%, #050C16 100%)'
              : 'linear-gradient(180deg, #E9DEC9 0%, #D5C9B0 100%)',
            borderTop: `1px solid ${T.brass}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 24px',
            overflow: 'hidden',
          }}
        >
          {/* Dense tickmarks */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              opacity: 0.3,
              pointerEvents: 'none',
            }}
          >
            {renderTicks(120, 12, 6)}
          </div>

          {/* Sub numbers */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
              zIndex: 2,
            }}
          >
            {subNumbers.map((num, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 6,
                  padding: '0 12px',
                }}
              >
                <span
                  style={{
                    fontFamily: T.fontDisplay,
                    fontWeight: 900,
                    fontSize: 18,
                    color: darkMode ? T.brassHi : T.brassLo,
                    textShadow: darkMode ? '0 0 8px rgba(242,200,74,0.5)' : 'none',
                    letterSpacing: -0.5,
                  }}
                >
                  {num}
                </span>
                {subLabels[i] && (
                  <span
                    style={{
                      fontFamily: T.fontMono,
                      fontSize: 9,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase',
                      color: darkMode ? 'rgba(239,230,210,0.45)' : 'rgba(18,60,58,0.6)',
                    }}
                  >
                    {subLabels[i]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RingNav;
