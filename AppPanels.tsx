import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Language } from './types';
import { ScreenRouter } from './components/screens/ScreenRouter';
import { L4Report } from './components/screens/L4Report';
import { LangThemeBar } from './components/screens/LangThemeBar';
import { fetchAllLiveData, type DataSourceInfo, type LiveMetrics } from './services/liveData';

type PanelId = 'macro' | 'simulator' | 'pipeline' | 'brief';
const PANEL_LABELS: Record<PanelId, string> = {
  macro: 'Macro',
  simulator: 'Simulator',
  pipeline: 'Pipeline',
  brief: 'Brief',
};
const PANEL_NEIGHBORS: Record<PanelId, Partial<Record<'left'|'right'|'up'|'down', PanelId>>> = {
  macro: { left: 'pipeline', right: 'simulator', down: 'brief' },
  simulator: { left: 'macro', down: 'brief' },
  pipeline: { right: 'macro', down: 'brief' },
  brief: { up: 'macro', left: 'pipeline', right: 'simulator' },
};

function getPanelFromSearch(search: string): PanelId {
  const raw = new URLSearchParams(search).get('panel');
  return (raw === 'macro' || raw === 'simulator' || raw === 'pipeline' || raw === 'brief') ? raw : 'macro';
}
function setPanelInUrl(panel: PanelId) {
  const url = new URL(window.location.href);
  url.searchParams.set('panel', panel);
  window.history.pushState({}, '', url.toString());
}

type HashView =
  | { kind: 'l3'; topic: string; section: string }
  | { kind: 'docs'; doc: 'guide' | 'api' | 'glossary' }
  | { kind: 'report' }
  | null;

function parseHash(hash: string): HashView {
  const h = (hash || '').replace(/^#/, '');
  if (!h) return null;
  const parts = h.split('/').filter(Boolean);
  if (parts[0] === 'l3' && parts.length >= 3) {
    return { kind: 'l3', topic: decodeURIComponent(parts[1]), section: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === 'docs' && parts.length >= 2) {
    const doc = parts[1];
    if (doc === 'guide' || doc === 'api' || doc === 'glossary') return { kind: 'docs', doc };
  }
  if (parts[0] === 'report') return { kind: 'report' };
  return null;
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  return el.isContentEditable;
}

function PanelNavigator({
  panel,
  onNavigate,
  statusText,
  disabled,
}: {
  panel: PanelId;
  onNavigate: (next: PanelId) => void;
  statusText: string;
  disabled?: boolean;
}) {
  const neighbors = PANEL_NEIGHBORS[panel];

  useEffect(() => {
    if (disabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (isTypingTarget(e.target)) return;

      const dir =
        e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' ? 'left' :
        e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' ? 'right' :
        e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' ? 'up' :
        e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' ? 'down' :
        null;

      if (!dir) return;
      const next = neighbors[dir as keyof typeof neighbors];
      if (!next) return;
      e.preventDefault();
      onNavigate(next);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [disabled, neighbors, onNavigate]);

  const buttonBase =
    'w-9 h-9 rounded-lg flex items-center justify-center text-[14px] font-bold transition-all select-none';
  const buttonStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid var(--color-ds-border)',
    color: 'var(--color-ds-muted)',
  };

  return (
    <div className="fixed left-4 top-4 z-[90] pointer-events-auto">
      <div
        className="flex items-center gap-3 px-3 py-2 rounded-xl"
        style={{
          background: 'rgba(10,22,40,0.72)',
          border: '1px solid var(--color-ds-border)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex flex-col leading-tight">
          <div className="text-[12px] font-bold ds-display" style={{ color: 'var(--color-ds-text)' }}>
            {PANEL_LABELS[panel]}
          </div>
          <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
            {statusText}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className={buttonBase}
            style={buttonStyle}
            onClick={() => neighbors.left && onNavigate(neighbors.left)}
            disabled={!neighbors.left || disabled}
            title={neighbors.left ? `Left: ${PANEL_LABELS[neighbors.left]}` : 'Left'}
          >
            ←
          </button>
          <button
            type="button"
            className={buttonBase}
            style={buttonStyle}
            onClick={() => neighbors.up && onNavigate(neighbors.up)}
            disabled={!neighbors.up || disabled}
            title={neighbors.up ? `Up: ${PANEL_LABELS[neighbors.up]}` : 'Up'}
          >
            ↑
          </button>
          <button
            type="button"
            className={buttonBase}
            style={buttonStyle}
            onClick={() => neighbors.down && onNavigate(neighbors.down)}
            disabled={!neighbors.down || disabled}
            title={neighbors.down ? `Down: ${PANEL_LABELS[neighbors.down]}` : 'Down'}
          >
            ↓
          </button>
          <button
            type="button"
            className={buttonBase}
            style={buttonStyle}
            onClick={() => neighbors.right && onNavigate(neighbors.right)}
            disabled={!neighbors.right || disabled}
            title={neighbors.right ? `Right: ${PANEL_LABELS[neighbors.right]}` : 'Right'}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function OverlayShell({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] overflow-auto" style={{ background: 'var(--color-ds-bg)', color: 'var(--color-ds-text)' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-2 rounded-lg text-[11px] font-bold ds-display"
            style={{ background: 'rgba(200,164,92,0.18)', border: '1px solid rgba(200,164,92,0.35)', color: 'var(--color-ds-gold)' }}
          >
            Back
          </button>
          <div className="text-[18px] font-bold ds-display">{title}</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function DocsView({ doc }: { doc: 'guide' | 'api' | 'glossary' }) {
  if (doc === 'api') {
    return (
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-ds-border)' }}>
        <div className="text-[14px] font-bold ds-display mb-2">Public API (safe)</div>
        <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          This page is intentionally public and contains no secrets/tokens/private IDs. It documents dashboard outputs and recommended integration shapes.
        </div>
        <pre className="mt-3 text-[11px] p-3 rounded-lg overflow-auto"
             style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--color-ds-border)' }}>
{`GET /api/mhei
  -> { value, year, blocks: { C,B,E,S,G }, weights, updatedAt, sources[] }

GET /api/scenario?panel=simulator&...
  -> { inputs, outputs, series[120] }

GET /api/pipeline/flows
  -> [{ id, name, status, lastFetched, errors, mappingCoverage }]

GET /api/pipeline/gaps
  -> [{ id, status, consequence, mitigation, evidenceRef }]`}
        </pre>
      </div>
    );
  }

  if (doc === 'glossary') {
    return (
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-ds-border)' }}>
        <div className="text-[14px] font-bold ds-display mb-2">Glossary</div>
        <ul className="list-disc pl-5 text-[12px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          <li><b>MHEI</b>: Mental Health Economy Index (C/B/E/S/G blocks).</li>
          <li><b>DLI</b>: Disbursement-Linked Indicators.</li>
          <li><b>Digital Bus</b>: interoperability + indexing layer between humanitarian systems and ESOS.</li>
          <li><b>Golden window</b>: ≤90 days to first session → lowest session-per-case regime.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-ds-border)' }}>
      <div className="text-[14px] font-bold ds-display mb-2">How to read</div>
      <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
        Hover any number for a short hint. Click any number to open direct evidence in L3.
      </div>
    </div>
  );
}

function L3EvidenceView({ topic, section }: { topic: string; section: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-ds-border)' }}>
      <div className="text-[14px] font-bold ds-display mb-2">L3 Evidence</div>
      <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
        Topic: <b>{topic}</b> / Section: <b>{section}</b>
      </div>
      <div className="text-[12px] ds-body mt-3" style={{ color: 'var(--color-ds-muted)' }}>
        v1: this is the placeholder shell. Next step is to move existing Appendix content into these English slugs and map KPI clicks → exact sections.
      </div>
    </div>
  );
}

function SimulatorPanel({
  onOpenL3,
  onOpenDocs,
}: {
  onOpenL3: (topic: string, section: string) => void;
  onOpenDocs: (doc: 'guide' | 'api' | 'glossary') => void;
}) {
  const [pTotal, setPTotal] = useState(8916);
  const [sessionsPerDay, setSessionsPerDay] = useState(4);
  const [digitalBusPct, setDigitalBusPct] = useState(50);

  const model = useMemo(() => {
    const workdaysPerMonth = 22;
    const months = 120;

    const kSurge = 1.22;
    const kSom = 0.15;
    const kDis = 1.0;
    const th365 = 2.5;

    const macroNeedYear = 3_900_000 * kSurge;
    const macroNeedMonth = macroNeedYear / 12;

    const digitalBusRate = Math.max(0, Math.min(1, digitalBusPct / 100));
    const detectedMonth = macroNeedMonth * digitalBusRate;

    const capSessionsMonth = pTotal * sessionsPerDay * workdaysPerMonth;

    let backlog = 0;
    let collapseMonth: number | null = null;
    let share90 = 0;
    let somYear = 0;
    let disYear = 0;

    for (let i = 0; i < months; i++) {
      const utilization = (detectedMonth + backlog) / (capSessionsMonth / 5);
      let spc = 5;
      if (utilization > 1 && utilization <= th365) spc = 16;
      if (utilization > th365) spc = 28;

      const served = Math.min(detectedMonth + backlog, capSessionsMonth / spc);
      backlog = Math.max(0, detectedMonth + backlog - served);

      const golden = spc === 5 ? 1 : 0;
      share90 = golden;

      const missed90 = (1 - golden) * Math.max(0, detectedMonth + backlog - served);
      if (i < 12) {
        somYear += missed90 * kSom;
        disYear += missed90 * kSom * kDis;
      }

      if (collapseMonth === null && backlog > detectedMonth * 6) collapseMonth = i + 1;
    }

    return {
      detectedYear: detectedMonth * 12,
      detectionCoveragePct: (detectedMonth * 12) / macroNeedYear,
      capSessionsYear: capSessionsMonth * 12,
      backlogPeople: backlog,
      backlogMonths: detectedMonth > 0 ? backlog / detectedMonth : 0,
      share90Pct: share90 * 100,
      somYear,
      disYear,
      collapseMonth,
    };
  }, [digitalBusPct, pTotal, sessionsPerDay]);

  const tileStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-ds-border)' };

  return (
    <div className="flex-1 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>L1.5</div>
            <div className="text-[22px] font-bold ds-display">Scenario & Simulation Console</div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => onOpenDocs('api')}
              className="px-3 py-2 rounded-lg text-[11px] font-bold ds-display"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-ds-border)', color: 'var(--color-ds-text)' }}>
              API Docs
            </button>
            <button type="button" onClick={() => { setPTotal(8916); setSessionsPerDay(4); setDigitalBusPct(50); }}
              className="px-3 py-2 rounded-lg text-[11px] font-bold ds-display"
              style={{ background: 'rgba(200,164,92,0.18)', border: '1px solid rgba(200,164,92,0.35)', color: 'var(--color-ds-gold)' }}>
              Reset baseline
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-xl p-4" style={{ ...tileStyle, background: 'rgba(255,255,255,0.03)' }}>
            <div className="text-[12px] font-bold ds-display mb-3">Inputs</div>

            <label className="block mb-3">
              <div className="text-[11px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>P_total_verified</div>
              <input type="range" min={0} max={20000} step={50} value={pTotal} onChange={(e) => setPTotal(Number(e.target.value))} className="w-full" />
              <div className="text-[12px] ds-body">{pTotal.toLocaleString('en-US')}</div>
            </label>

            <label className="block mb-3">
              <div className="text-[11px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>Sessions per day</div>
              <input type="range" min={3} max={9} step={0.5} value={sessionsPerDay} onChange={(e) => setSessionsPerDay(Number(e.target.value))} className="w-full" />
              <div className="text-[12px] ds-body">{sessionsPerDay} / day (eco baseline = 4)</div>
            </label>

            <label className="block">
              <div className="text-[11px] ds-body mb-1" style={{ color: 'var(--color-ds-muted)' }}>DigitalBus_rate</div>
              <input type="range" min={0} max={100} step={1} value={digitalBusPct} onChange={(e) => setDigitalBusPct(Number(e.target.value))} className="w-full" />
              <div className="text-[12px] ds-body">{digitalBusPct}% detection/verification</div>
            </label>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="How many beneficiaries are detected/verified under current Digital Bus coverage."
              onClick={() => onOpenL3('clinical', 'detection-and-verification')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Detected / verified (year)</div>
              <div className="text-[16px] font-bold ds-display">{Math.round(model.detectedYear).toLocaleString('en-US')}</div>
            </button>

            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="Detected share vs macro-need (3.9M * K_surge)."
              onClick={() => onOpenL3('clinical', 'macro-need')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Detection coverage</div>
              <div className="text-[16px] font-bold ds-display">{(model.detectionCoveragePct * 100).toFixed(1)}%</div>
            </button>

            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="Sessions capacity = P_total * sessions/day * 22 days * 12."
              onClick={() => onOpenL3('clinical', 'eco-load')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Session capacity (year)</div>
              <div className="text-[16px] font-bold ds-display">{Math.round(model.capSessionsYear).toLocaleString('en-US')}</div>
            </button>

            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="Unserved detected demand accumulates into backlog."
              onClick={() => onOpenL3('method', 'scenario-engine')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Backlog (people)</div>
              <div className="text-[16px] font-bold ds-display">{Math.round(model.backlogPeople).toLocaleString('en-US')}</div>
            </button>

            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="Backlog expressed as months of detected demand."
              onClick={() => onOpenL3('method', 'scenario-engine')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Backlog (months)</div>
              <div className="text-[16px] font-bold ds-display">{model.backlogMonths.toFixed(1)}</div>
            </button>

            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="Proxy: 100% only when utilization allows 5-session mode."
              onClick={() => onOpenL3('clinical', 'golden-window')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Share within 90 days</div>
              <div className="text-[16px] font-bold ds-display">{model.share90Pct.toFixed(0)}%</div>
            </button>

            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="Missed-90d proxy × K_somatization."
              onClick={() => onOpenL3('clinical', 'somatization-benchmark')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Somatization proxy (year)</div>
              <div className="text-[16px] font-bold ds-display">{Math.round(model.somYear).toLocaleString('en-US')}</div>
            </button>

            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="Somatization proxy × K_disability."
              onClick={() => onOpenL3('clinical', 'disability-proxy')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Disability proxy (year)</div>
              <div className="text-[16px] font-bold ds-display">{Math.round(model.disYear).toLocaleString('en-US')}</div>
            </button>

            <button type="button" style={tileStyle} className="rounded-xl p-3 text-left"
              title="First month where backlog exceeds threshold."
              onClick={() => onOpenL3('method', 'collapse-threshold')}>
              <div className="text-[10px]" style={{ color: 'var(--color-ds-muted)' }}>Collapse month</div>
              <div className="text-[16px] font-bold ds-display">{model.collapseMonth ? String(model.collapseMonth) : '—'}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelinePanel({
  lang,
  isLoading,
  dataSources,
  onOpenL3,
  onOpenDocs,
}: {
  lang: Language;
  isLoading: boolean;
  dataSources: DataSourceInfo[];
  onOpenL3: (topic: string, section: string) => void;
  onOpenDocs: (doc: 'guide'|'api'|'glossary') => void;
}) {
  const box: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-ds-border)' };
  return (
    <div className="flex-1 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>L1.5</div>
            <div className="text-[22px] font-bold ds-display">Digital Bus — Data Flow</div>
          </div>
          <button type="button" onClick={() => onOpenDocs('api')}
            className="px-3 py-2 rounded-lg text-[11px] font-bold ds-display"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-ds-border)', color: 'var(--color-ds-text)' }}>
            API Docs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={box}>
            <div className="text-[12px] font-bold ds-display mb-2">Active flows</div>
            <div className="text-[11px] ds-body mb-3" style={{ color: 'var(--color-ds-muted)' }}>
              {isLoading ? 'Loading…' : 'Click a flow to open lineage evidence.'}
            </div>
            <div className="space-y-2">
              {dataSources.slice(0, 6).map((s) => (
                <button key={s.id} type="button" className="w-full text-left rounded-lg px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-ds-border)' }}
                  onClick={() => onOpenL3('data', 'ingestion-flows')}
                  title="Open L3 lineage">
                  <div className="flex justify-between gap-3">
                    <div className="text-[12px] font-bold ds-display">{s.name[lang]}</div>
                    <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{s.status}</div>
                  </div>
                  <div className="text-[11px] ds-body mt-1" style={{ color: 'var(--color-ds-muted)' }}>{s.apiBase}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={box}>
            <div className="text-[12px] font-bold ds-display mb-2">Open data gaps</div>
            <div className="text-[11px] ds-body mb-3" style={{ color: 'var(--color-ds-muted)' }}>
              Click to open the gap taxonomy.
            </div>
            <button type="button" className="w-full text-left rounded-lg px-3 py-2"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-ds-border)' }}
              onClick={() => onOpenL3('data', 'open-data-gap-index')}>
              Open gap index evidence →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefPanel({
  onOpenL3,
}: {
  onOpenL3: (topic: string, section: string) => void;
}) {
  return (
    <div className="flex-1 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>Brief</div>
        <div className="text-[22px] font-bold ds-display mb-4">Executive Briefing</div>

        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[12px] font-bold ds-display mb-2">Format</div>
          <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
            Narrative for donors / NHSU / WHO / World Bank. Every number links to L3 evidence.
          </div>
          <div className="flex gap-2 mt-3">
            <button type="button" className="px-3 py-2 rounded-lg text-[11px] font-bold ds-display"
              style={{ background: 'color-mix(in srgb, var(--color-ds-teal) 14%, transparent)', border: '1px solid color-mix(in srgb, var(--color-ds-teal) 30%, transparent)', color: 'var(--color-ds-teal)' }}
              onClick={() => window.location.hash = '#/report'}>
              Open full report
            </button>
            <button type="button" className="px-3 py-2 rounded-lg text-[11px] font-bold ds-display"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-ds-border)', color: 'var(--color-ds-text)' }}
              onClick={() => onOpenL3('method', 'scenario-engine')}>
              Evidence: scenario engine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AppPanels: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    try { return (localStorage.getItem('mhpss_lang') as Language) || 'uk'; } catch { return 'uk'; }
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { const v = localStorage.getItem('mhpss_dark'); return v === null ? false : v === '1'; } catch { return false; }
  });

  const toggleTheme = useCallback(() => {
    setDarkMode((d) => {
      const next = !d;
      try { localStorage.setItem('mhpss_dark', next ? '1' : '0'); } catch {}
      return next;
    });
  }, []);

  useEffect(() => { try { localStorage.setItem('mhpss_lang', lang); } catch {} }, [lang]);

  const [panel, setPanel] = useState<PanelId>(() => getPanelFromSearch(window.location.search));
  const [hashView, setHashView] = useState<HashView>(() => parseHash(window.location.hash));

  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({});
  const [dataSources, setDataSources] = useState<DataSourceInfo[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const onPop = () => setPanel(getPanelFromSearch(window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const onHash = () => setHashView(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { metrics, sources } = await fetchAllLiveData();
        if (cancelled) return;
        setLiveMetrics(metrics);
        setDataSources(sources);
      } finally {
        if (!cancelled) setIsLoadingData(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const statusText = useMemo(() => {
    if (isLoadingData) return 'API: LOADING';
    const anyLive = dataSources.some((s) => s.status === 'live');
    return anyLive ? 'API: ACTIVE' : 'API: STANDBY';
  }, [dataSources, isLoadingData]);

  const navigatePanel = useCallback((next: PanelId) => {
    setPanel(next);
    setPanelInUrl(next);
  }, []);

  const openL3 = useCallback((topic: string, section: string) => {
    window.location.hash = `#/l3/${encodeURIComponent(topic)}/${encodeURIComponent(section)}`;
  }, []);

  const openDocs = useCallback((doc: 'guide' | 'api' | 'glossary') => {
    window.location.hash = `#/docs/${doc}`;
  }, []);

  const closeHash = useCallback(() => {
    window.location.hash = '';
  }, []);

  return (
    <div className="min-h-screen font-sans custom-scrollbar flex ds-blueprint-bg" style={{ backgroundColor: 'var(--color-ds-bg)', color: 'var(--color-ds-text)' }}>
      <PanelNavigator panel={panel} onNavigate={navigatePanel} statusText={statusText} disabled={!!hashView} />

      <div className="fixed top-3 right-4 z-[90] pointer-events-auto">
        <LangThemeBar lang={lang} onLangChange={setLang} darkMode={darkMode} onThemeToggle={toggleTheme} />
      </div>

      {hashView?.kind === 'docs' ? (
        <OverlayShell title={`Docs: ${hashView.doc}`} onBack={closeHash}>
          <DocsView doc={hashView.doc} />
        </OverlayShell>
      ) : null}

      {hashView?.kind === 'l3' ? (
        <OverlayShell title={`L3: ${hashView.topic}/${hashView.section}`} onBack={closeHash}>
          <L3EvidenceView topic={hashView.topic} section={hashView.section} />
        </OverlayShell>
      ) : null}

      {hashView?.kind === 'report' ? (
        <L4Report lang={lang} onBack={closeHash} />
      ) : null}

      {!hashView ? (
        <>
          {panel === 'macro' ? (
            <ScreenRouter
              lang={lang}
              liveHciValue={liveMetrics.worldBankHci?.value}
              onAppendix={() => openL3('method', 'scenario-engine')}
              onL4={() => navigatePanel('brief')}
              onLangChange={setLang}
              darkMode={darkMode}
              onThemeToggle={toggleTheme}
            />
          ) : null}

          {panel === 'simulator' ? <SimulatorPanel onOpenL3={openL3} onOpenDocs={openDocs} /> : null}

          {panel === 'pipeline' ? (
            <PipelinePanel
              lang={lang}
              isLoading={isLoadingData}
              dataSources={dataSources}
              onOpenL3={openL3}
              onOpenDocs={openDocs}
            />
          ) : null}

          {panel === 'brief' ? <BriefPanel onOpenL3={openL3} /> : null}
        </>
      ) : null}
    </div>
  );
};

export default AppPanels;
