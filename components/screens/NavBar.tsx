/**
 * NavBar — persistent navigation bar for all L2/L3 screens.
 * Mobile: bottom tab bar (Overview, Finance, Gaps, Cabinet) + collapsible top bar.
 * Desktop: horizontal L2 prev/next arrows + breadcrumbs.
 */
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, LayoutDashboard, DollarSign, AlertTriangle, Users } from 'lucide-react';
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

const L2_ORDER = [
  'l2-mhei',
  'l2-fintech',
  'l2-clinical',
  'l2-coverage',
  'l2-operational',
  'l2-analytical',
  'l2-sustain',
  'l2-digital',
  'l2-regulatory',
  'l2-backlog',
  'l2-journey',
] as const;

const L2_LABELS = {
  'l2-mhei':        { uk: 'MHEI', en: 'MHEI' },
  'l2-fintech':     { uk: 'Фінанси', en: 'Finance' },
  'l2-clinical':    { uk: 'Клінічна', en: 'Clinical' },
  'l2-coverage':    { uk: 'Покриття', en: 'Coverage' },
  'l2-operational': { uk: '9 Розривів', en: '9 Gaps' },
  'l2-analytical':  { uk: 'Аналітика', en: 'Analytics' },
  'l2-sustain':     { uk: 'Стійкість', en: 'Sustain' },
  'l2-digital':     { uk: 'Диджитал', en: 'Digital' },
  'l2-regulatory':  { uk: 'Регулятор', en: 'Regulatory' },
  'l2-backlog':     { uk: 'Беклог', en: 'Backlog' },
  'l2-journey':     { uk: 'Стейкхолдери', en: 'Journeys' },
} as const;

const MOBILE_TABS = [
  { id: 'l1', icon: LayoutDashboard, label: { uk: 'Огляд', en: 'Overview' } },
  { id: 'l2-fintech', icon: DollarSign, label: { uk: 'Фінанси', en: 'Finance' } },
  { id: 'l2-operational', icon: AlertTriangle, label: { uk: 'Розриви', en: 'Gaps' } },
  { id: 'cabinet', icon: Users, label: { uk: 'Кабінет', en: 'Cabinet' } },
] as const;

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

export const NavBar = ({
  lang, nav, title, subtitle, accentColor, crumbs, rightAction,
}: Props) => {
  const isMobile = useMobile();
  const currentScreen = nav.current as ScreenId;
  const idx = L2_ORDER.indexOf(currentScreen as (typeof L2_ORDER)[number]);
  const inL2 = idx !== -1;
  const prevId = inL2 && idx > 0 ? L2_ORDER[idx - 1] : null;
  const nextId = inL2 && idx < L2_ORDER.length - 1 ? L2_ORDER[idx + 1] : null;

  const renderBreadcrumbs = () => {
    if (!crumbs || crumbs.length === 0) return null;
    return (
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
    );
  };

  const renderBackButton = () => (
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
  );

  const renderRightAction = () => {
    if (!rightAction) return null;
    return (
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
    );
  };

  const renderTitleRow = () => (
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
  );

  const renderMobile = () => (
    <div
      className="fixed inset-0 z-50 safe-area-inset"
      style={{
        background: 'rgba(10, 22, 40, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(200,164,92,0.2)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="flex-shrink-0 px-4 pt-3 pb-2"
        style={{ borderBottom: '1px solid var(--color-ds-border)' }}
      >
        <div className="flex items-center gap-3">
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
          <div className="flex-1 min-w-0">
            {renderTitleRow()}
          </div>
          {renderRightAction()}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {renderBreadcrumbs()}
        <div className="mt-4 space-y-3">
          {MOBILE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => nav.push(tab.id as ScreenId)}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all ds-body"
              style={{
                background: nav.current === tab.id ? 'rgba(200,164,92,0.15)' : 'rgba(255,255,255,0.03)',
                border: nav.current === tab.id ? '1px solid var(--color-ds-gold)' : '1px solid var(--color-ds-border)',
                color: nav.current === tab.id ? 'var(--color-ds-gold)' : 'var(--color-ds-text)',
              }}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--color-ds-gold)' }} />
              <span>{tab.label[lang]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDesktop = () => (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl safe-area-inset"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid var(--color-ds-border)',
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {inL2 && renderBackButton()}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          {renderBreadcrumbs()}
          {renderTitleRow()}
        </div>

        {inL2 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {prevId && (
              <button
                onClick={() => nav.push(prevId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold ds-display transition-all"
                style={{
                  border: '1px solid var(--color-ds-border)',
                  color: 'var(--color-ds-muted)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-ds-gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-gold)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-ds-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-muted)'; }}
              >
                <ChevronLeft className="w-4 h-4" />
                {L2_LABELS[prevId]?.[lang] ?? prevId}
              </button>
            )}

            <div className="flex items-center gap-1 px-2">
              {L2_ORDER.map((id, i) => (
                <button
                  key={id}
                  onClick={() => nav.push(id)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === idx ? 'w-6' : ''
                  }`}
                  style={{
                    background: i === idx ? 'var(--color-ds-gold)' : 'var(--color-ds-muted)',
                  }}
                  aria-label={L2_LABELS[id]?.[lang] ?? id}
                />
              ))}
            </div>

            {nextId && (
              <button
                onClick={() => nav.push(nextId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold ds-display transition-all"
                style={{
                  border: '1px solid var(--color-ds-border)',
                  color: 'var(--color-ds-muted)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-ds-gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-gold)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-ds-border)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-ds-muted)'; }}
              >
                {L2_LABELS[nextId]?.[lang] ?? nextId}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {renderRightAction()}
      </div>
    </header>
  );

  return isMobile ? renderMobile() : renderDesktop();
};

export default NavBar;