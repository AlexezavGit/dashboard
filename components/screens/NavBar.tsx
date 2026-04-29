/**
 * NavBar — persistent navigation bar for all L2/L3 screens.
 * Large, high-contrast back button so users never accidentally
 * hit the browser back button and leave the app.
 */
import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
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

export const NavBar: React.FC<Props> = ({
  lang, nav, title, subtitle, accentColor, crumbs, rightAction,
}) => (
  <div
    className="flex-shrink-0 px-5 pt-4 pb-3"
    style={{ borderBottom: '1px solid var(--color-ds-border)' }}
  >
    {/* Top row: back + breadcrumbs + right action */}
    <div className="flex items-center gap-3">

      {/* ── BACK BUTTON — large, impossible to miss ── */}
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

      {/* Right action */}
      {rightAction && (
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
  </div>
);
