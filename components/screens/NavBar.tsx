/**
 * NavBar — persistent navigation bar for all L2/L3 screens.
 * Large, high-contrast back button + horizontal L2 prev/next arrows.
 */
import React from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav, ScreenId } from './types';

interface Crumb {
  label: { uk: string; en: string };
  screen?: ScreenId;
}

interface Props {
  lang: Language;
  nav: ScreenNav;
  title: { uk: string; en: string };
  subtitle?: { uk: string; en: string };
  accentColor: string;
  crumbs?: Crumb[];
  rightAction?: { label: { uk: string; en: string }; screen: ScreenId; color?: string };
}

// Canonical L2 order for ← → navigation
const L2_ORDER: ScreenId[] = [
  'l2-mhei',        // MHEI drill-down — primary entry point
  'l2-fintech',
  'l2-clinical',
  'l2-analytical',
  'l2-sustain',
  'l2-digital',
  'l2-regulatory',
];

const L2_LABELS: Record<string, { uk: string; en: string }> = {
  'l2-mhei':        { uk: 'MHEI Дельта', en: 'MHEI Delta' },
  'l2-fintech':     { uk: 'FinTech', en: 'FinTech' },
  'l2-clinical':    { uk: 'Клінічна', en: 'Clinical' },
  'l2-analytical':  { uk: 'Аналітика', en: 'Analytics' },
  'l2-sustain':     { uk: 'Стійкість', en: 'Sustain' },
  'l2-digital':     { uk: 'Диджитал', en: 'Digital' },
  'l2-regulatory':  { uk: 'Регулятор', en: 'Regulatory' },
};

export const NavBar: React.FC<Props> = ({
  lang, nav, title, subtitle, accentColor, crumbs, rightAction,
}) => {
  const idx = L2_ORDER.indexOf(nav.current as ScreenId);
  const inL2 = idx !== -1;
  const prevId = inL2 && idx > 0 ? L2_ORDER[idx - 1] : null;
  const nextId = inL2 && idx < L2_ORDER.length - 1 ? L2_ORDER[idx + 1] : null;

  const pillBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: 600,
    fontFamily: 'Space Grotesk, sans-serif',
    cursor: 'pointer',
    border: '1px solid rgba(200,164,92,0.22)',
    color: 'rgba(200,164,92,0.65)',
    background: 'rgba(200,164,92,0.05)',
    transition: 'all 0.15s',
  };

  return (
    <div
      className="flex-shrink-0 px-5 pt-4 pb-3"
      style={{ borderBottom: '1px solid var(--color-ds-border)' }}
    >
      {/* Top row: back + breadcrumbs + right action */}
      <div className="flex items-center gap-3">

        {/* BACK BUTTON */}
        <button
          onClick={nav.back}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold ds-display transition-all flex-shrink-0"
          style={{
            background: 'rgba(200,164,92,0.18)',
            border: '2px solid var(--color-ds-gold)',
            color: 'var(--color-ds-gold)',
            fontSize: '13px',
            minWidth: '90px',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,164,92,0.32)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(200,164,92,0.18)'; }}
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'uk' ? 'Назад' : 'Back'}
        </button>

        {/* Breadcrumbs */}
        {crumbs && crumbs.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
            <button
              onClick={() => nav.push('l1')}
              className="hover:underline transition-colors"
              style={{ color: 'var(--color-ds-muted)' }}
            >
              {lang === 'uk' ? 'Огляд' : 'Overview'}
            </button>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                {c.screen ? (
                  <button
                    onClick={() => nav.push(c.screen!)}
                    className="hover:underline"
                    style={{ color: accentColor }}
                  >
                    {c.label[lang]}
                  </button>
                ) : (
                  <span style={{ color: accentColor }}>{c.label[lang]}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Right action (kept for backward compat) */}
        {rightAction && !inL2 && (
          <button
            onClick={() => nav.push(rightAction.screen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold ds-display transition-all flex-shrink-0"
            style={{
              border: `1px solid ${rightAction.color ?? 'var(--color-ds-teal)'}55`,
              color: rightAction.color ?? 'var(--color-ds-teal)',
            }}
          >
            {rightAction.label[lang]}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Title row */}
      <div className="mt-3">
        <h2
          className="text-[22px] font-bold ds-display leading-tight"
          style={{ color: accentColor }}
        >
          {title[lang]}
        </h2>
        {subtitle && (
          <p className="text-[12px] ds-body mt-1" style={{ color: 'var(--color-ds-muted)' }}>
            {subtitle[lang]}
          </p>
        )}
      </div>

      {/* ── L2 prev/next — separate bottom row, no collision with LangThemeBar ── */}
      {inL2 && (
        <div className="flex items-center gap-2 mt-2.5 pt-2" style={{ borderTop: '1px solid rgba(200,164,92,0.12)' }}>
          {/* Prev arrow */}
          <button
            onClick={() => prevId && nav.push(prevId)}
            disabled={!prevId}
            style={{
              ...pillBase,
              opacity: prevId ? 1 : 0.3,
              cursor: prevId ? 'pointer' : 'default',
            }}
            onMouseEnter={e => { if (prevId) (e.currentTarget as HTMLElement).style.background = 'rgba(200,164,92,0.12)'; }}
            onMouseLeave={e => { if (prevId) (e.currentTarget as HTMLElement).style.background = 'rgba(200,164,92,0.05)'; }}
            title={prevId ? (L2_LABELS[prevId]?.[lang] ?? prevId) : undefined}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {prevId ? (L2_LABELS[prevId]?.[lang] ?? '←') : '←'}
          </button>

          {/* L2 position indicator dots */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            {L2_ORDER.map((id, i) => (
              <div
                key={id}
                onClick={() => nav.push(id)}
                title={L2_LABELS[id]?.[lang] ?? id}
                style={{
                  width: i === idx ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  background: i === idx ? accentColor : 'rgba(200,164,92,0.22)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={() => nextId && nav.push(nextId)}
            disabled={!nextId}
            style={{
              ...pillBase,
              opacity: nextId ? 1 : 0.3,
              cursor: nextId ? 'pointer' : 'default',
            }}
            onMouseEnter={e => { if (nextId) (e.currentTarget as HTMLElement).style.background = 'rgba(200,164,92,0.12)'; }}
            onMouseLeave={e => { if (nextId) (e.currentTarget as HTMLElement).style.background = 'rgba(200,164,92,0.05)'; }}
            title={nextId ? (L2_LABELS[nextId]?.[lang] ?? nextId) : undefined}
          >
            {nextId ? (L2_LABELS[nextId]?.[lang] ?? '→') : '→'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
