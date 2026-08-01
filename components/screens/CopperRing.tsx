/**
 * CopperRing — 3-row nav rail for FEEL Again Dashboard
 * Row 1: Logo | L1 hub dots (screen selector) | controls (lang/theme)   h=36px
 *         TickScale
 * Row 2: L2 section rail (prev/next + dot pager) — visible only in L2   h=30px
 *         TickScale
 * Row 3: RingTicker — 5 contextual KPI numbers                           h=32px
 *         TickScale
 *
 * Auto-hides rows 2+3 on scroll down, reveals on scroll up.
 * Replaces NavBar.tsx.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav, ScreenId } from './types';

// ── TickScale ──────────────────────────────────────────────────────────────
const TickScale: React.FC<{ accent?: string }> = ({ accent = 'var(--color-ds-gold)' }) => (
  <div
    className="w-full relative overflow-hidden"
    style={{ height: 8, flexShrink: 0 }}
  >
    {/* baseline */}
    <div
      className="absolute inset-x-0"
      style={{ top: 3, height: 1, background: `color-mix(in srgb, ${accent} 28%, transparent)` }}
    />
    {/* notches */}
    {Array.from({ length: 80 }).map((_, i) => {
      const isMajor = i % 10 === 0;
      const isMid   = i % 5 === 0;
      return (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${(i / 79) * 100}%`,
            top: isMajor ? 0 : isMid ? 1 : 2,
            width: 1,
            height: isMajor ? 7 : isMid ? 5 : 3,
            background: isMajor
              ? `color-mix(in srgb, ${accent} 70%, transparent)`
              : `color-mix(in srgb, ${accent} 30%, transparent)`,
          }}
        />
      );
    })}
  </div>
);

// ── MiniBars ───────────────────────────────────────────────────────────────
const MiniBars: React.FC<{ seed: number; color: string }> = ({ seed, color }) => {
  const bars = Array.from({ length: 7 }, (_, i) => {
    const h = 20 + ((seed * (i + 3) * 17) % 60);
    return h;
  });
  return (
    <div className="flex items-end gap-px" style={{ height: 16 }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: `${(h / 80) * 16}px`,
            background: color,
            opacity: 0.5 + (i / bars.length) * 0.5,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
};

// ── RingTicker ─────────────────────────────────────────────────────────────
interface TickerItem {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
  color: string;
  seed: number;
}

const TICKER_DATA: Record<string, (lang: Language) => TickerItem[]> = {
  'l2-mhei': (lang) => [
    { label: lang === 'uk' ? 'MHEI індекс' : 'MHEI index',       value: '0.31',   delta: '-0.04', up: false, color: '#EF4444', seed: 7  },
    { label: lang === 'uk' ? 'Спроможність' : 'Capacity',         value: '4,000',  delta: '+120',  up: true,  color: '#00F5FF', seed: 13 },
    { label: lang === 'uk' ? 'Беклог (р.)' : 'Backlog (yr)',      value: '7.8',    delta: '+0.3',  up: false, color: '#F59E0B', seed: 5  },
    { label: lang === 'uk' ? 'Покриття' : 'Coverage',             value: '0.28%',  delta: '±0',    up: true,  color: '#8B5CF6', seed: 19 },
    { label: lang === 'uk' ? 'Gorlovyna' : 'Gorlovyna',           value: '62.2M',  delta: '',      up: true,  color: '#D4A017', seed: 3  },
  ],
  'l2-fintech': (lang) => [
    { label: 'HEAL P180245',                                       value: '$500M',  delta: '34%',   up: false, color: '#EF4444', seed: 11 },
    { label: 'THRIVE P505616',                                     value: '$454M',  delta: '70%',   up: true,  color: '#00F5FF', seed: 17 },
    { label: lang === 'uk' ? 'Заблоковано' : 'Locked',            value: '$463M',  delta: '',      up: false, color: '#F59E0B', seed: 7  },
    { label: 'HEAL C4',                                            value: '$41.1M', delta: '',      up: true,  color: '#10B981', seed: 23 },
    { label: 'ROI',                                                value: '4:1',    delta: 'WHO',   up: true,  color: '#D4A017', seed: 9  },
  ],
  'l2-operational': (lang) => [
    { label: lang === 'uk' ? 'Розривів' : 'Gaps',                 value: '9',      delta: '',      up: false, color: '#EF4444', seed: 3  },
    { label: lang === 'uk' ? 'Синхр. даних' : 'Data sync',        value: '0%',     delta: '',      up: false, color: '#8B5CF6', seed: 15 },
    { label: lang === 'uk' ? 'Адмін тягар' : 'Admin overhead',    value: '22%',    delta: '-15%',  up: true,  color: '#F59E0B', seed: 21 },
    { label: lang === 'uk' ? 'Орг. TWG' : 'Orgs TWG',             value: '450+',   delta: '',      up: true,  color: '#00F5FF', seed: 5  },
    { label: lang === 'uk' ? 'Поза ЄСОЗ' : 'Outside ESOZ',        value: '624K',   delta: '',      up: false, color: '#EF4444', seed: 9  },
  ],
};

const DEFAULT_TICKER = (lang: Language): TickerItem[] => [
  { label: lang === 'uk' ? 'Покриття потреби' : 'Need coverage',  value: '0.28%',  delta: '',      up: false, color: '#EF4444', seed: 7  },
  { label: lang === 'uk' ? 'Незакрита потреба' : 'Unmet need',    value: '62.2M',  delta: '',      up: false, color: '#F59E0B', seed: 13 },
  { label: lang === 'uk' ? 'WB заблоковано' : 'WB locked',        value: '$954M',  delta: '',      up: false, color: '#F59E0B', seed: 5  },
  { label: lang === 'uk' ? 'Беклог' : 'Backlog',                  value: '7.8 р.', delta: '',      up: false, color: '#EF4444', seed: 19 },
  { label: lang === 'uk' ? 'Синхр. даних' : 'Data sync',          value: '0%',     delta: '',      up: false, color: '#8B5CF6', seed: 3  },
];

const RingTicker: React.FC<{ screen: ScreenId; lang: Language }> = ({ screen, lang }) => {
  const items = (TICKER_DATA[screen] ?? DEFAULT_TICKER)(lang);
  return (
    <div className="flex items-center gap-0 overflow-x-auto" style={{ height: 32, scrollbarWidth: 'none' }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2 px-3 flex-shrink-0" style={{ height: 32 }}>
            <MiniBars seed={item.seed} color={item.color} />
            <div className="flex flex-col justify-center">
              <span
                className="font-mono font-bold leading-none"
                style={{ fontSize: 12, color: item.color }}
              >
                {item.value}
                {item.delta && (
                  <span style={{ fontSize: 9, marginLeft: 3, color: item.up ? '#10B981' : '#EF4444' }}>
                    {item.up ? '▲' : '▼'}{item.delta}
                  </span>
                )}
              </span>
              <span
                className="font-mono uppercase leading-none"
                style={{ fontSize: 8, color: 'var(--color-ds-muted)', letterSpacing: '0.08em', marginTop: 1 }}
              >
                {item.label}
              </span>
            </div>
          </div>
          {i < items.length - 1 && (
            <div style={{ width: 1, height: 18, background: 'var(--color-ds-border)', flexShrink: 0 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ── L2 order & labels ──────────────────────────────────────────────────────
const L2_ORDER = [
  'l2-mhei', 'l2-fintech', 'l2-clinical', 'l2-coverage',
  'l2-operational', 'l2-analytical', 'l2-sustain', 'l2-digital',
  'l2-regulatory', 'l2-backlog', 'l2-journey',
] as const;

const L2_LABELS: Record<string, { uk: string; en: string }> = {
  'l2-mhei':        { uk: 'MHEI',       en: 'MHEI'       },
  'l2-fintech':     { uk: 'Фінанси',    en: 'Finance'     },
  'l2-clinical':    { uk: 'Клінічна',   en: 'Clinical'    },
  'l2-coverage':    { uk: 'Покриття',   en: 'Coverage'    },
  'l2-operational': { uk: '9 Розривів', en: '9 Gaps'      },
  'l2-analytical':  { uk: 'Аналітика',  en: 'Analytics'   },
  'l2-sustain':     { uk: 'Стійкість',  en: 'Sustain'     },
  'l2-digital':     { uk: 'Диджитал',   en: 'Digital'     },
  'l2-regulatory':  { uk: 'Регулятор',  en: 'Regulatory'  },
  'l2-backlog':     { uk: 'Беклог',     en: 'Backlog'     },
  'l2-journey':     { uk: 'Стейкхолд.', en: 'Journeys'    },
};

// ── L1 hub items ───────────────────────────────────────────────────────────
const L1_HUBS: { id: ScreenId; label: { uk: string; en: string }; color: string }[] = [
  { id: 'l1',             label: { uk: 'L1',       en: 'L1'       }, color: 'var(--color-ds-gold)'   },
  { id: 'l2-mhei',        label: { uk: 'MHEI',     en: 'MHEI'     }, color: 'var(--color-ds-teal)'   },
  { id: 'l2-fintech',     label: { uk: 'Фін.',     en: 'Fin.'     }, color: 'var(--color-ds-teal)'   },
  { id: 'l2-operational', label: { uk: 'Ops',      en: 'Ops'      }, color: 'var(--color-ds-orange)' },
  { id: 'l2-analytical',  label: { uk: 'Data',     en: 'Data'     }, color: 'var(--color-ds-teal)'   },
  { id: 'appendix',       label: { uk: 'L3',       en: 'L3'       }, color: 'var(--color-ds-gold)'   },
];

// ── Props ──────────────────────────────────────────────────────────────────
interface Crumb {
  label: { uk: string; en: string };
  screen?: ScreenId;
}

interface Props {
  lang: Language;
  nav: ScreenNav;
  title?: { uk: string; en: string };
  subtitle?: { uk: string; en: string };
  accentColor?: string;
  crumbs?: Crumb[];
  rightAction?: { label: { uk: string; en: string }; screen: ScreenId; color?: string };
  // Optional — provided by ScreenRouter overlay mode
  darkMode?: boolean;
  onThemeToggle?: () => void;
  onLangChange?: (l: Language) => void;
}

// ── CopperRing ─────────────────────────────────────────────────────────────
export const CopperRing: React.FC<Props> = ({
  lang, nav, title, subtitle, accentColor = 'var(--color-ds-gold)',
  crumbs, rightAction,
  darkMode = true, onThemeToggle, onLangChange,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  // Auto-hide rows 2+3 on scroll down
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current + 8) setCollapsed(true);
      else if (y < lastScrollY.current - 8) setCollapsed(false);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const current = nav.current as ScreenId;
  const l2Idx = L2_ORDER.indexOf(current as (typeof L2_ORDER)[number]);
  const inL2 = l2Idx !== -1;
  const prevId = inL2 && l2Idx > 0 ? L2_ORDER[l2Idx - 1] : null;
  const nextId = inL2 && l2Idx < L2_ORDER.length - 1 ? L2_ORDER[l2Idx + 1] : null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: 'color-mix(in srgb, var(--color-ds-bg) 92%, transparent)',
        borderBottom: '1px solid var(--color-ds-border)',
      }}
    >
      {/* ── ROW 1: Logo | L1 hub | controls ─────────────────────────── */}
      <div className="flex items-center gap-2 px-3" style={{ height: 36 }}>

        {/* Back button — only in L2 */}
        {inL2 && (
          <button
            onClick={nav.back}
            className="flex items-center gap-1 flex-shrink-0 transition-all"
            style={{ color: 'var(--color-ds-gold)', fontSize: 11, fontFamily: 'var(--font-ds-display)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            <ArrowLeft style={{ width: 13, height: 13 }} />
          </button>
        )}

        {/* Logo mark */}
        <div
          className="flex-shrink-0 font-bold"
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-ds-display)',
            color: 'var(--color-ds-gold)',
            letterSpacing: '0.12em',
            cursor: 'pointer',
          }}
          onClick={() => nav.push('l1')}
        >
          FEEL
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 16, background: 'var(--color-ds-border)', flexShrink: 0 }} />

        {/* L1 hub dots */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {L1_HUBS.map((hub) => {
            const isActive = current === hub.id || (hub.id === 'l2-mhei' && inL2 && current !== 'l1');
            const isExact  = current === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => nav.push(hub.id)}
                className="flex items-center gap-1 px-2 rounded transition-all flex-shrink-0"
                style={{
                  height: 22,
                  fontSize: 9,
                  fontFamily: 'var(--font-ds-display)',
                  letterSpacing: '0.1em',
                  color: isExact ? '#0a1628' : isActive ? hub.color : 'var(--color-ds-muted)',
                  background: isExact
                    ? hub.color
                    : isActive
                    ? `color-mix(in srgb, ${hub.color} 15%, transparent)`
                    : 'transparent',
                  border: `1px solid ${isActive ? hub.color : 'transparent'}`,
                }}
              >
                {/* dot */}
                <span
                  style={{
                    width: 5, height: 5,
                    borderRadius: '50%',
                    background: isExact ? '#0a1628' : hub.color,
                    flexShrink: 0,
                    boxShadow: isActive ? `0 0 6px ${hub.color}` : 'none',
                  }}
                />
                {hub.label[lang]}
              </button>
            );
          })}
        </div>

        {/* rightAction — NavBar compat */}
        {rightAction && (
          <button
            onClick={() => nav.push(rightAction.screen)}
            className="flex items-center gap-1 flex-shrink-0 transition-all"
            style={{
              fontSize: 9,
              fontFamily: 'var(--font-ds-display)',
              letterSpacing: '0.08em',
              color: rightAction.color ?? 'var(--color-ds-teal)',
              border: `1px solid ${rightAction.color ?? 'var(--color-ds-teal)'}55`,
              borderRadius: 6,
              padding: '2px 8px',
              height: 22,
            }}
          >
            {rightAction.label[lang]}
            <ChevronRight style={{ width: 10, height: 10 }} />
          </button>
        )}

        {/* Controls: lang + theme — only when callbacks provided */}
        {(onLangChange || onThemeToggle) && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {onLangChange && (
              <div
                className="flex rounded overflow-hidden"
                style={{ border: '1px solid var(--color-ds-border)' }}
              >
                {(['uk', 'en'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => onLangChange(l)}
                    style={{
                      padding: '2px 6px',
                      fontSize: 9,
                      fontFamily: 'var(--font-ds-display)',
                      letterSpacing: '0.08em',
                      background: lang === l ? 'var(--color-ds-gold)' : 'transparent',
                      color: lang === l ? '#0a1628' : 'var(--color-ds-muted)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
            {onThemeToggle && (
              <button
                onClick={onThemeToggle}
                style={{
                  width: 22, height: 22,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 6,
                  border: '1px solid var(--color-ds-border)',
                  color: 'var(--color-ds-muted)',
                  background: 'transparent',
                  fontSize: 11,
                }}
              >
                {darkMode ? <Sun style={{ width: 11, height: 11 }} /> : <Moon style={{ width: 11, height: 11 }} />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* title/subtitle row — NavBar compat, shown below row 1 */}
      {(title || crumbs) && (
        <div className="px-3 pb-1" style={{ borderBottom: '1px solid var(--color-ds-border)' }}>
          {crumbs && crumbs.length > 0 && (
            <div className="flex items-center gap-1" style={{ fontSize: 9, color: 'var(--color-ds-muted)', fontFamily: 'var(--font-ds-display)', marginBottom: 2 }}>
              <button onClick={() => nav.push('l1')} style={{ color: 'var(--color-ds-muted)' }}>
                {lang === 'uk' ? 'Огляд' : 'Overview'}
              </button>
              {crumbs.map((c, i) => (
                <React.Fragment key={i}>
                  <ChevronRight style={{ width: 9, height: 9 }} />
                  {c.screen
                    ? <button onClick={() => nav.push(c.screen!)} style={{ color: accentColor }}>{c.label[lang]}</button>
                    : <span style={{ color: accentColor }}>{c.label[lang]}</span>
                  }
                </React.Fragment>
              ))}
            </div>
          )}
          {title && (
            <div style={{ fontSize: 13, fontFamily: 'var(--font-ds-display)', fontWeight: 700, color: accentColor, lineHeight: 1.2 }}>
              {title[lang]}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: 10, color: 'var(--color-ds-muted)', marginTop: 1 }}>
              {subtitle[lang]}
            </div>
          )}
        </div>
      )}

      <TickScale accent={accentColor} />

      {/* ── ROW 2: L2 section rail ───────────────────────────────────── */}
      <div
        style={{
          height: collapsed ? 0 : 30,
          overflow: 'hidden',
          transition: 'height 0.22s ease',
        }}
      >
        {inL2 ? (
          <div className="flex items-center gap-1 px-3" style={{ height: 30 }}>
            {/* prev */}
            {prevId ? (
              <button
                onClick={() => nav.push(prevId)}
                className="flex items-center gap-1 flex-shrink-0 transition-all"
                style={{ fontSize: 10, color: 'var(--color-ds-muted)', fontFamily: 'var(--font-ds-display)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-gold)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-muted)'}
              >
                <ChevronLeft style={{ width: 12, height: 12 }} />
                {L2_LABELS[prevId]?.[lang]}
              </button>
            ) : <div style={{ width: 60 }} />}

            {/* dot pager */}
            <div className="flex items-center gap-1 flex-1 justify-center overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {L2_ORDER.map((id, i) => (
                <button
                  key={id}
                  onClick={() => nav.push(id)}
                  title={L2_LABELS[id]?.[lang]}
                  style={{
                    width: i === l2Idx ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === l2Idx
                      ? 'var(--color-ds-gold)'
                      : 'var(--color-ds-muted)',
                    opacity: i === l2Idx ? 1 : 0.4,
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            {/* next */}
            {nextId ? (
              <button
                onClick={() => nav.push(nextId)}
                className="flex items-center gap-1 flex-shrink-0 transition-all"
                style={{ fontSize: 10, color: 'var(--color-ds-muted)', fontFamily: 'var(--font-ds-display)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-gold)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-muted)'}
              >
                {L2_LABELS[nextId]?.[lang]}
                <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
            ) : <div style={{ width: 60 }} />}
          </div>
        ) : (
          /* L1: show all L2 labels as quick-jump */
          <div className="flex items-center gap-0 px-3 overflow-x-auto" style={{ height: 30, scrollbarWidth: 'none' }}>
            {L2_ORDER.map((id, i) => (
              <React.Fragment key={id}>
                <button
                  onClick={() => nav.push(id)}
                  className="flex-shrink-0 transition-all"
                  style={{
                    fontSize: 9,
                    fontFamily: 'var(--font-ds-display)',
                    letterSpacing: '0.08em',
                    color: 'var(--color-ds-muted)',
                    padding: '0 8px',
                    height: 30,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-teal)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-muted)'}
                >
                  {L2_LABELS[id]?.[lang]}
                </button>
                {i < L2_ORDER.length - 1 && (
                  <div style={{ width: 1, height: 12, background: 'var(--color-ds-border)', flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <TickScale accent={accentColor} />

      {/* ── ROW 3: RingTicker ────────────────────────────────────────── */}
      <div
        style={{
          height: collapsed ? 0 : 32,
          overflow: 'hidden',
          transition: 'height 0.22s ease',
        }}
      >
        <RingTicker screen={current} lang={lang} />
      </div>

      <TickScale accent={accentColor} />
    </header>
  );
};

export default CopperRing;
