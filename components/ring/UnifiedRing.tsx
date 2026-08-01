/**
 * UnifiedRing — единственное навигационное кольцо FEEL Again (по дизайн-системе).
 *
 * Архитектура (решение 2026-08-01):
 * - Монтируется ОДИН раз вне ScreenRouter/AnimatePresence → нет фликера при L1↔L2.
 * - Band 1 (глобальная): ДАНІ · ПРОГРАМА · КОРИСТУВАЧІ · ДЕМО · ПАРТНЕРИ —
 *   тонкая жёлто-металлическая шкала с острыми гранями и насечками (ring-nav.js v6).
 * - Band 2 (строка данных): до 5 динамических метрик, меняются по ресурсу/странице;
 *   каждый KPI = микро-палочки + мигающая стрелка + источник.
 * - Band 3 (локальная): НЕ в кольце — живёт на левом краю как drawer (LeftRail).
 *
 * Источники: designTokens.ts + FEEL Again - Design System Canvas.dc + ring-nav.js v6.
 */
import React from 'react';
import { DS, BADGE_COLOR, BadgeState } from '../../designTokens';
import type { Language } from '../../types';

/* ── Типы ──────────────────────────────────────────────────────────────── */
export type RingResource = 'data' | 'program' | 'users' | 'demo' | 'partners';

export interface KpiCell {
  label: { uk: string; en: string };
  value: string;
  delta?: string;
  up?: boolean;
  tone: 'red' | 'gold' | 'teal';
  state: BadgeState;
  source: { uk: string; en: string };
}

export const RING_RESOURCES: { id: RingResource; label: { uk: string; en: string } }[] = [
  { id: 'data',     label: { uk: 'ДАНІ',       en: 'DATA' } },
  { id: 'program',  label: { uk: 'ПРОГРАМА',   en: 'PROGRAM' } },
  { id: 'users',    label: { uk: 'КОРИСТУВАЧІ', en: 'USERS' } },
  { id: 'demo',     label: { uk: 'ДЕМО',       en: 'DEMO' } },
  { id: 'partners', label: { uk: 'ПАРТНЕРИ',   en: 'PARTNERS' } },
];

const TONE_COLOR: Record<KpiCell['tone'], string> = {
  red:  '#E86B5A',
  gold: '#F2C84A',
  teal: '#4BA8BC',
};

/* ── Микро-индикатор: 5 палочек + мигающая стрелка ────────────────────── */
const MicroIndicator: React.FC<{ seed: number; color: string; up: boolean; speed: number }> = ({ seed, color, up, speed }) => {
  const bars = Array.from({ length: 5 }, (_, i) => 8 + ((seed * (i + 3) * 13) % 18));
  return (
    <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
      {bars.map((h, i) => (
        <div key={i} style={{ width: 3, height: h, background: color, opacity: 0.45 + (i / 5) * 0.55, borderRadius: 1 }} />
      ))}
      <span
        className="flex items-center font-bold"
        style={{
          color,
          fontSize: 9,
          marginLeft: 4,
          animation: `feelBlink ${Math.max(0.4, 2 - speed)}s infinite`,
          lineHeight: '14px',
        }}
      >
        {up ? '▲' : '▼'}
      </span>
    </div>
  );
};

/* ── Одна ячейка данных ────────────────────────────────────────────────── */
const KpiCell: React.FC<{ kpi: KpiCell; lang: Language }> = ({ kpi, lang }) => {
  const color = TONE_COLOR[kpi.tone];
  return (
    <div
      className="flex items-center gap-3 px-4 flex-shrink-0"
      style={{ borderRight: '1px solid rgba(75,168,188,0.12)', height: '100%' }}
    >
      <MicroIndicator seed={kpi.label.uk.length} color={color} up={kpi.up ?? true} speed={kpi.delta ? 0.8 : 0.2} />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: DS.fontDisplay, fontWeight: 700, fontSize: 15, color, letterSpacing: -0.3, lineHeight: 1 }}>
            {kpi.value}
          </span>
          {kpi.delta && (
            <span style={{ fontSize: 9, color: kpi.up ? '#00D4AA' : '#E86B5A', fontFamily: DS.fontMono }}>
              {kpi.up ? '▲' : '▼'}{kpi.delta}
            </span>
          )}
          {/* 4-state badge: color + label + shape (daltonism-safe) */}
          <span
            style={{
              fontSize: 7,
              fontFamily: DS.fontMono,
              letterSpacing: 1,
              padding: '1px 5px',
              borderRadius: 2,
              border: `1px solid ${BADGE_COLOR[kpi.state]}aa`,
              color: BADGE_COLOR[kpi.state],
              background: `${BADGE_COLOR[kpi.state]}14`,
              whiteSpace: 'nowrap',
            }}
          >
            {kpi.state}
          </span>
        </div>
        <span style={{ fontSize: 8, fontFamily: DS.fontMono, color: 'rgba(185,215,205,0.5)', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2, whiteSpace: 'nowrap' }}>
          {kpi.label[lang]} · {kpi.source[lang]}
        </span>
      </div>
    </div>
  );
};

/* ── Тонкая металлическая шкала (насечки) ─────────────────────────────── */
const TickScale: React.FC<{ accent?: string; height?: number }> = ({ accent = DS.metalNotchHi, height = 8 }) => {
  const ticks = Array.from({ length: 120 }, (_, i) => i);
  return (
    <div className="w-full relative overflow-hidden" style={{ height, flexShrink: 0 }}>
      <div className="absolute inset-x-0" style={{ top: height / 2 - 0.5, height: 1, background: `linear-gradient(90deg, transparent, ${DS.goldHi}66 20%, ${DS.goldHi}66 80%, transparent)` }} />
      {ticks.map((i) => {
        const major = i % 10 === 0;
        const mid = i % 5 === 0;
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${(i / 119) * 100}%`,
              top: mid ? height / 2 - (major ? 4 : 2.5) : height / 2 - 1,
              width: major ? 1.5 : 1,
              height: major ? 8 : mid ? 5 : 2,
              background: major ? `linear-gradient(180deg, ${DS.metalNotchHi}, ${DS.metalNotch})` : `${accent}55`,
              boxShadow: major ? `0 0 4px ${DS.goldHi}88` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

/* ── Главный компонент кольца ──────────────────────────────────────────── */
interface UnifiedRingProps {
  lang: Language;
  active: RingResource;
  kpis: KpiCell[];
  onSelect: (id: RingResource) => void;
  onOpenDashboard?: () => void;         // Band 1 → дашборд (L1)
  onOpenLocal?: (screen: string) => void; // Band 3 в левом рейле (прокидывается в LeftRail)
}

/**
 * UnifiedRing встраивается в App.tsx ОДИН раз, вне ScreenRouter.
 * Высота кольца = 44 (шкала) + 30 (строка данных) + 8 (тик) — константа RING_HEIGHT
 * используется всеми L2-экранами через var(--ring-height).
 */
export const RING_HEIGHT = 82; // 44 + 30 + 8

export const UnifiedRing: React.FC<UnifiedRingProps> = ({ lang, active, kpis, onSelect }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200]"
      style={{
        background: `linear-gradient(180deg, ${DS.bgDeep} 0%, ${DS.bgNavy} 100%)`,
        borderBottom: `1px solid ${DS.goldText}33`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
      }}
    >
      {/* ── Band 1: тонкая металлическая шкала 44px ─────────────────── */}
      <div
        className="relative flex items-center gap-1 px-3"
        style={{
          height: 44,
          background: `linear-gradient(180deg, ${DS.metalGold})`,
          boxShadow:
            'inset 0 1px 0 rgba(255,235,180,0.35), inset 0 -1px 0 rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.5)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)',
        }}
      >
        {/* насечки поверх металла */}
        <div className="absolute inset-x-8 top-[6px] bottom-[6px] flex items-center justify-between opacity-40 pointer-events-none">
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} style={{ width: 1, height: i % 6 === 0 ? 14 : 7, background: 'rgba(0,0,0,0.55)', boxShadow: '1px 0 0 rgba(255,235,180,0.25)' }} />
          ))}
        </div>

        {/* бренд */}
        <div className="relative flex items-center gap-2 pl-2 pr-4" style={{ zIndex: 2 }}>
          <div
            style={{
              fontFamily: DS.fontDisplay,
              fontWeight: 900,
              fontSize: 13,
              letterSpacing: 1.5,
              color: '#1a0f00',
              textShadow: '0 1px 0 rgba(255,240,200,0.6)',
              whiteSpace: 'nowrap',
            }}
          >
            FEEL AGAIN
          </div>
        </div>

        {/* вертикальный разделитель */}
        <div style={{ width: 1, height: 22, background: 'rgba(0,0,0,0.4)', boxShadow: '1px 0 0 rgba(255,235,180,0.3)' }} />

        {/* пункты глобальной навигации */}
        <div className="relative flex items-center gap-1 flex-1 overflow-x-auto px-2" style={{ zIndex: 2, scrollbarWidth: 'none' }}>
          {RING_RESOURCES.map((r) => {
            const isActive = active === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelect(r.id)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  fontFamily: DS.fontDisplay,
                  fontWeight: isActive ? 800 : 600,
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: isActive ? '#1a0f00' : 'rgba(26,15,0,0.55)',
                  textShadow: isActive ? '0 0 12px rgba(255,235,180,0.8), 0 1px 0 rgba(255,255,255,0.4)' : '0 1px 0 rgba(255,255,255,0.25)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(26,15,0,0.85)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(26,15,0,0.55)'; }}
              >
                {r.label[lang]}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: '15%',
                      right: '15%',
                      bottom: -6,
                      height: 2,
                      background: DS.goldHi,
                      boxShadow: `0 0 10px ${DS.goldHi}`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <TickScale accent={DS.goldHi} height={8} />

      {/* ── Band 2: строка данных (KPI) 30px ────────────────────────── */}
      <div className="flex items-center overflow-x-auto" style={{ height: 30, scrollbarWidth: 'none', background: 'rgba(4,9,16,0.6)' }}>
        {kpis.map((kpi, i) => (
          <KpiCell key={i} kpi={kpi} lang={lang} />
        ))}
      </div>

      <style>{`
        @keyframes feelBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
      `}</style>
    </div>
  );
};

export default UnifiedRing;
