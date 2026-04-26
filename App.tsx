import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LayoutDashboard, Globe, ChevronDown, ChevronUp, Check, AlertTriangle, AlertOctagon, Info, Download, Users, Building2, GraduationCap, ShieldCheck, TrendingUp, ExternalLink, BookOpen, Database, FolderOpen, Zap, Lock, CircleDot, CalendarDays, Mail, Menu, X, Activity, Calculator, GitMerge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TEXTS, COLORS, KPI_DATA, SECTIONS_CONFIG, TOP_METRICS,
  PREVALENCE_DATA, RISK_GROUP_DATA, WORKFORCE_DATA, WAR_IMPACT_DATA, SECTOR_DIST_DATA,
  BUDGET_SPLIT_DATA, DONOR_DATA, GAP_DATA, BARRIERS_DATA, SHADOW_DATA, DALY_DATA, RECON_DATA,
  CHILDREN_DATA, MHGAP_FUNNEL_DATA, TRAINED_REALITY_DATA, CLUSTER_DATA,
  TIMELINE_ITEMS, ADMIN_BURDEN, COORD_ITEMS, REACH_TABLE_DATA, INPUTS_OUTCOMES_DATA, SOURCES,
  FUNDING_VS_REACH_DATA, REGIONAL_BARRIERS_HEATMAP, DISORDER_IMPACT_BUBBLE,
  ECONOMIC_BURDEN_INDICATORS, REGIONAL_DISORDER_DATA,
  CAPACITY_CEILING_DATA, ROI_CARDS, CONNECTED_ASSETS,
  MACRO_GAP, BACKLOG_DATA, INFRA_LEVELS, FEEL_AGAIN_POSITION,
  FEEL_AGAIN_ARCHITECTURE, HEAL_UKRAINE,
  THRIVE_PROJECT, HEAL_C4_PROCUREMENT, COUNTERARGUMENTS, ARCH_FLOW,
  STAKEHOLDER_MATRIX, FORMALIZATION_COST_V3, DUAL_PROJECT_NARRATIVE, MISSING_MIDDLE,
  PERFECT_STORM_SCALE, STRUCTURAL_DISP_DATA,
  KEY_CONCLUSIONS, ALL_CONCLUSIONS_GRID, MISSING_DATA,
  NSZU_SNAPSHOT, KILLER_QUOTES, GRAND_BARGAIN_3,
  DATA_INTELLIGENCE, FEEL_AGAIN_4_FUNCTIONS, ROI_PARAMS,
} from './constants';
import { Language, SectionFilter } from './types';
import { Card } from './components/ui/Card';
import { InsightBox } from './components/ui/InsightBox';
import { CustomBarChart } from './components/charts/CustomBarChart';
import { CustomDonutChart } from './components/charts/CustomDonutChart';
import { CustomScatterPlot } from './components/charts/CustomScatterPlot';
import { CustomHeatmap } from './components/charts/CustomHeatmap';
import { UkraineMap } from './components/charts/UkraineMap';
import { FormattedNumber } from './components/FormattedNumber';
import { DataSourcesPanel } from './components/DataSourcesPanel';
import { DataSourceBadge } from './components/ui/DataSourceBadge';
import { fetchAllLiveData, DataSourceInfo, LiveMetrics } from './services/liveData';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  AreaChart, Area, Cell, ComposedChart, Line, LabelList
} from 'recharts';

// KPI Card Component
const KpiCard: React.FC<{ data: any, lang: Language }> = ({ data, lang }) => {
  const statusColors = {
    danger: 'border-rose-500/50 text-rose-500',
    warning: 'border-cyber-amber/50 text-cyber-amber',
    success: 'border-cyber-success/50 text-cyber-success',
    neutral: 'border-cyber-cyan/50 text-cyber-cyan'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, translateY: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`cyber-card p-5 border-t-2 ${statusColors[data.status]} flex flex-col h-full group`}
    >
      <div className="cyber-label mb-2 flex justify-between items-center">
        <span>{data.label[lang]}</span>
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${data.status === 'danger' ? 'bg-rose-500' : 'bg-cyber-cyan'}`} />
      </div>
      <div className="cyber-number text-3xl font-bold mb-1 group-hover:text-white transition-colors">{data.value}</div>
      <div className="text-[10px] text-slate-500 mb-3 font-medium">{data.sub[lang]}</div>
      <div className="mt-auto space-y-2">
        <div className={`text-[10px] font-bold flex items-center gap-1 ${statusColors[data.status]}`}>
           {data.change[lang]}
        </div>
        <div className="text-[9px] text-slate-600 italic flex items-center gap-1 border-t border-cyber-border pt-2">
          <Info className="w-2.5 h-2.5" /> {lang === 'uk' ? 'Джерело:' : 'Source:'} {data.source[lang]}
        </div>
      </div>
    </motion.div>
  );
};

// Top Metric Component
const TopMetric: React.FC<{ data: any, lang: Language }> = ({ data, lang }) => {
  const Icon = { Users, Building2, GraduationCap }[data.icon] as any;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="cyber-card p-6 flex items-center gap-5 border-l-4 relative group"
      style={{ borderLeftColor: data.color }}
    >
      <div className="p-3 rounded-lg bg-cyber-bg border border-cyber-border" style={{ color: data.color }}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="cyber-label flex items-center gap-1">
          {data.label}
          {data.tooltip && (
            <div className="relative flex items-center">
              <Info className="w-3 h-3 text-slate-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 normal-case tracking-normal font-sans shadow-xl border border-slate-700">
                {data.tooltip}
              </div>
            </div>
          )}
        </div>
        <div className="cyber-number text-4xl font-bold leading-none my-1">
          <FormattedNumber value={data.value} locale={lang} suffix={data.suffix} />
        </div>
        <div className="text-[10px] text-slate-500 font-mono">{data.sub}</div>
      </div>
    </motion.div>
  );
};

// Main App
const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('uk');
  const [activeSection, setActiveSection] = useState<SectionFilter>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({});
  const [dataSources, setDataSources] = useState<DataSourceInfo[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [roiInvestment, setRoiInvestment] = useState<number>(5); // $M

  const roiResults = useMemo(() => {
    const investUsd = roiInvestment * 1_000_000;
    const sessions = Math.round(investUsd / ROI_PARAMS.costPerSessionUsd);
    const beneficiaries = Math.round(sessions / ROI_PARAMS.sessionsPerBeneficiary);
    const directRoi = investUsd * ROI_PARAMS.roiMultiplier;
    const dalys = Math.round(beneficiaries * ROI_PARAMS.dalysPerCourse);
    const dalyValue = Math.round(dalys * ROI_PARAMS.whodalyThresholdUsd);
    const totalReturn = directRoi + dalyValue;
    const roiRatio = (totalReturn / investUsd).toFixed(1);
    const fmt = (n: number): string => n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : `${n}`;
    return { sessions, beneficiaries, directRoi, dalys, dalyValue, totalReturn, roiRatio, fmt };
  }, [roiInvestment]);
  // Collapsible sections — GAP open by default as it's the core thesis
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['gap']));
  const toggleSection = (id: string) => setExpandedSections(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const loadLiveData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const { metrics, sources } = await fetchAllLiveData();
      setLiveMetrics(metrics);
      setDataSources(sources);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  // Auto-expand section when a specific filter is selected
  useEffect(() => {
    if (activeSection !== 'all') {
      setExpandedSections(new Set([activeSection]));
    }
  }, [activeSection]);

  // Email subscribe state
  const [emailTop, setEmailTop] = React.useState('');
  const [emailBottom, setEmailBottom] = React.useState('');
  const [submittedTop, setSubmittedTop] = React.useState(false);
  const [submittedBottom, setSubmittedBottom] = React.useState(false);

  const filteredSections = activeSection === 'all'
    ? SECTIONS_CONFIG 
    : SECTIONS_CONFIG.filter(s => s.id === activeSection);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedInputsOutcomes = useMemo(() => {
    let data = [...INPUTS_OUTCOMES_DATA(lang)];
    
    if (statusFilter !== 'all') {
      data = data.filter(item => item.statusColor === statusFilter);
    }
    
    if (sortConfig) {
      data.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key];
        const bVal = (b as any)[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return data;
  }, [lang, sortConfig, statusFilter]);

  // Sidebar navigation items
  const SIDEBAR_GROUPS = [
    {
      items: [{ id: 'overview', label: lang === 'uk' ? 'Огляд' : 'Overview', icon: LayoutDashboard, target: 'hero-top' }],
    },
    {
      label: 'World Bank',
      items: [
        { id: 'heal', label: 'HEAL P180245', icon: Database, target: 'section-inputs' },
        { id: 'thrive', label: 'THRIVE P505616', icon: TrendingUp, target: 'section-inputs' },
      ],
    },
    {
      label: lang === 'uk' ? 'Сектор' : 'Sector',
      items: [
        { id: 'workforce', label: lang === 'uk' ? 'Кадри' : 'Workforce', icon: Users, target: 'section-workforce' },
        { id: 'coverage', label: lang === 'uk' ? 'Охоплення' : 'Coverage', icon: Activity, target: 'section-gap' },
        { id: 'shadow', label: lang === 'uk' ? 'Тіньовий сектор' : 'Shadow Economy', icon: CircleDot, target: 'section-shadow' },
      ],
    },
    {
      label: lang === 'uk' ? 'Фінансування' : 'Finance',
      items: [
        { id: 'funding', label: lang === 'uk' ? 'Фінансові потоки' : 'Funding Flow', icon: TrendingUp, target: 'section-budget' },
        { id: 'roi', label: lang === 'uk' ? 'ROI Калькулятор' : 'ROI Calculator', icon: Calculator, target: 'roi-calc' },
      ],
    },
    {
      label: lang === 'uk' ? 'Інфраструктура' : 'Infrastructure',
      items: [
        { id: 'data-intel', label: lang === 'uk' ? '8 систем: статус API' : '8 Systems: API Status', icon: GitMerge, target: 'data-intelligence' },
        { id: 'functions', label: lang === 'uk' ? '4 функції FEEL Again' : '4 Core Functions', icon: Zap, target: 'feel-functions' },
      ],
    },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-300 font-sans custom-scrollbar flex">

      {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 flex flex-col border-r border-cyber-border bg-[#070e1a] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-56`}
      >
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-cyber-border flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-[13px] font-bold text-cyber-amber font-mono tracking-tight">FEEL Again</div>
            <div className="text-[8px] text-slate-600 font-mono uppercase tracking-wider">MHPSS Dashboard</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-600 hover:text-slate-400 lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
          {SIDEBAR_GROUPS.map((group, gi) => (
            <div key={gi} className="mb-1">
              {group.label && (
                <div className="px-2 pt-3 pb-1 text-[8px] font-mono font-bold uppercase tracking-[0.15em] text-slate-700">{group.label}</div>
              )}
              {group.items.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.target)}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[11px] text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors text-left"
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        {/* Sidebar footer links */}
        <div className="px-2 py-3 border-t border-cyber-border space-y-1 flex-shrink-0">
          <a href="https://feelagain.com.ua" target="_blank" rel="noreferrer"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[11px] text-cyber-amber hover:bg-cyber-amber/10 transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span>feelagain.com.ua →</span>
          </a>
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[11px] text-slate-600">
            <div className="text-[8px] font-mono">v2.1 · {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT (shifts right when sidebar open on lg+) ─────── */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-56' : 'ml-0'}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-12" id="hero-top">
        
        {/* Header */}
        <header className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-cyber-border pb-8 mb-8">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="flex-shrink-0 p-2 rounded-lg border border-cyber-border text-slate-500 hover:text-cyber-amber hover:border-cyber-amber/40 transition-colors"
              title={sidebarOpen ? 'Close nav' : 'Open nav'}
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          <div className="flex items-center gap-5">
            <img src="/logo.svg" alt="FEEL Again" className="w-24 h-24 rounded-xl" />
            <div className="w-px h-12 bg-cyber-border" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                {TEXTS.header.title[lang]}
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-mono uppercase">
                  OPEN DATA
                </span>
              </h1>
              <p className="text-slate-500 text-xs md:text-sm font-mono mt-1">{TEXTS.header.subtitle[lang]}</p>
            </div>
          </div>
          </div>{/* end flex items-center gap-4 */}

          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
            <div className="flex bg-cyber-surface border border-cyber-border p-1 rounded-lg">
              <button
                onClick={() => setLang('uk')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'uk' ? 'bg-cyber-amber text-cyber-bg shadow-lg scale-[1.04]' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
              >
                UA
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-cyber-amber text-cyber-bg shadow-lg scale-[1.04]' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
              >
                EN
              </button>
            </div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              {TEXTS.header.date[lang]} · {lang === 'uk' ? 'Верифіковано вручну' : 'Manually verified'}
            </div>
          </div>
        </header>

        {/* ── INSTITUTIONAL MISSION STATEMENT ─────────────────────────── */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-slate-700/60" style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #0A1628 50%, #0D1B2A 100%)' }}>
          {/* Top band */}
          <div className="flex items-center gap-0 border-b border-slate-700/60">
            <div className="flex-1 px-6 py-3 bg-blue-900/20 border-r border-slate-700/60 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-[10px] font-mono text-blue-300 uppercase tracking-[0.2em]">
                {lang === 'uk' ? 'ПРОБЛЕМА' : 'THE PROBLEM'}
              </span>
            </div>
            <div className="flex-1 px-6 py-3 bg-amber-900/10 border-r border-slate-700/60 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyber-amber flex-shrink-0" />
              <span className="text-[10px] font-mono text-cyber-amber uppercase tracking-[0.2em]">
                {lang === 'uk' ? 'РОЗРИВ' : 'THE GAP'}
              </span>
            </div>
            <div className="flex-1 px-6 py-3 bg-emerald-900/10 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em]">
                {lang === 'uk' ? 'РІШЕННЯ' : 'THE SOLUTION'}
              </span>
            </div>
          </div>
          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700/60">
            {/* Problem */}
            <div className="px-6 py-5">
              <p className="text-white text-[14px] font-semibold leading-snug mb-2">
                {lang === 'uk'
                  ? '3.9 мільйона людей потребують клінічної допомоги з психічного здоров\'я'
                  : '3.9 million people need clinical mental health care'}
              </p>
              <p className="text-slate-400 text-[12px] leading-relaxed">
                {lang === 'uk'
                  ? '22% населення України — під клінічно значущим психологічним тиском внаслідок війни. Існуюча система покриває 0.28% від потреби.'
                  : '22% of Ukraine\'s population is under clinically significant psychological distress due to war. The existing system covers 0.28% of need.'}
              </p>
            </div>
            {/* Gap */}
            <div className="px-6 py-5">
              <p className="text-white text-[14px] font-semibold leading-snug mb-2">
                {lang === 'uk'
                  ? 'World Bank інвестував $954M — але послуги залишаються невидимими'
                  : 'World Bank invested $954M — but services remain invisible to measurement'}
              </p>
              <p className="text-slate-400 text-[12px] leading-relaxed">
                {lang === 'uk'
                  ? 'HEAL ($500M) та THRIVE ($454M) фінансують послуги, але гуманітарні та державні системи не обмінюються даними. 62.2M сесій/рік — незакрита потреба вартістю $1.87B.'
                  : 'HEAL ($500M) and THRIVE ($454M) fund services, but humanitarian and state systems don\'t share data. 62.2M sessions/year — unmet need worth $1.87B.'}
              </p>
            </div>
            {/* Solution */}
            <div className="px-6 py-5">
              <p className="text-white text-[14px] font-semibold leading-snug mb-2">
                {lang === 'uk'
                  ? 'FEEL Again: цифрова шина між гуманітарними даними та державним eHealth'
                  : 'FEEL Again: digital bus between humanitarian data and state eHealth'}
              </p>
              <p className="text-slate-400 text-[12px] leading-relaxed">
                {lang === 'uk'
                  ? 'Кожна надана сесія стає видимою для DLI-вимірювання THRIVE/ESOZ. Модель: 3.5–7% транзакційна комісія від NHSU-тарифу. Ціль: $25M GMV до кінця 2026.'
                  : 'Every delivered session becomes visible to THRIVE/ESOZ DLI measurement. Model: 3.5–7% transaction fee on NHSU tariff. Target: $25M GMV by end of 2026.'}
              </p>
            </div>
          </div>
          {/* Footer citation */}
          <div className="border-t border-slate-700/60 px-6 py-2 flex items-center justify-between">
            <span className="text-[9px] font-mono text-slate-600">
              {lang === 'uk'
                ? 'Джерела: ВООЗ / Lancet 2023 · НСЗУ відкриті дані 2024 · World Bank HEAL P180245 / THRIVE P505616 · FEEL Again analysis'
                : 'Sources: WHO / Lancet 2023 · NHSU open data 2024 · World Bank HEAL P180245 / THRIVE P505616 · FEEL Again analysis'}
            </span>
            <div className="flex items-center gap-3">
              {liveMetrics.worldBankHealth && (
                <span className="text-[9px] font-mono text-blue-400">
                  WB: Ukraine health {liveMetrics.worldBankHealth.healthSpendingPctGdp}% GDP ({liveMetrics.worldBankHealth.year})
                </span>
              )}
              <DataSourceBadge status="live" lang={lang} compact />
            </div>
          </div>
        </div>

        {/* ── CRISIS HERO BAR ─────────────────────────────────────────── */}
        <div className="mb-1.5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
            {lang === 'uk' ? 'МАСШТАБ КРИЗИ — ЦИФРИ, ЩО НЕ МОЖНА ІГНОРУВАТИ' : 'CRISIS SCALE — NUMBERS THAT CANNOT BE IGNORED'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5 mb-6 font-mono">
          {[
            {
              val: '0.28%',
              label: lang === 'uk' ? 'ПОКРИТТЯ КЛІН. ПОТРЕБИ' : 'CLINICAL NEED COVERED',
              sub: lang === 'uk'
                ? '180K сес./рік (НСЗУ ПМД, 2024) / 62.4M потреба (3.9M × 16, ВООЗ)'
                : '180K sessions/yr (NHSU primary care, 2024) / 62.4M need (3.9M × 16, WHO)',
              color: '#FF4444',
              pulse: true,
              tooltip: lang === 'uk'
                ? '180K — надані НСЗУ психологічні послуги в первинній медичній допомозі за 2024 рік. 62.4M — загальна клінічна потреба в сесіях для 3.9M осіб (22% населення) при нормі ВООЗ 16 сес./особу. Джерела: НСЗУ відкриті дані 2024 / ВООЗ / Lancet 2023.'
                : '180K — NHSU psychological services delivered in primary care during 2024. 62.4M — total clinical session need for 3.9M people (22% of population) at WHO norm of 16 sessions/person. Sources: NHSU open data 2024 / WHO / Lancet 2023.',
            },
            {
              val: '62.2M',
              label: lang === 'uk' ? 'НЕЗАКРИТА ПОТРЕБА / РІК' : 'UNMET NEED / YEAR',
              sub: lang === 'uk'
                ? '62,220,000 сесій · 3.9M осіб × 16 сес. (ВООЗ) − 180K надано'
                : '62,220,000 sessions · 3.9M people × 16 (WHO) − 180K delivered',
              color: '#F59E0B',
              pulse: true,
              tooltip: lang === 'uk'
                ? 'Реальний розрив: 62,400,000 − 180,000 = 62,220,000 сесій незакрито. Вартість закриття за blended public-humanitarian тарифом $30/сес. = $1.87B/рік. За нижньою межею ринку (€40/сес.) = €2.5B/рік. Джерела: НСЗУ 2024 / ВООЗ норма / FEEL Again calculation.'
                : 'Real gap: 62,400,000 − 180,000 = 62,220,000 sessions unmet. Cost to close at blended public-humanitarian rate $30/session = $1.87B/year. At market lower bound (€40/session) = €2.5B/year. Sources: NHSU 2024 / WHO norm / FEEL Again calculation.',
            },
            {
              val: '$954M',
              label: lang === 'uk' ? 'WB ЗАБЛОКОВАНО / У РОБОТІ' : 'WB LOCKED / IN PROGRESS',
              sub: lang === 'uk'
                ? 'HEAL $500M (34% дисб.) + THRIVE $454M (70% дисб.) · разом ~$491M виплачено'
                : 'HEAL $500M (34% disb.) + THRIVE $454M (70% disb.) · total ~$491M disbursed',
              color: '#F59E0B',
              pulse: false,
              tooltip: lang === 'uk'
                ? 'HEAL P180245 (IPF+PBC): загальний конверт $500M, дисбурсовано $171M (34%). THRIVE P505616 (PforR): $454M, дисбурсовано ~$320M (70%), з яких $220M аванс при підписанні (груд. 2024) + $19.5M після DLI (груд. 2025). Загалом: ~$491M / $954M = ~51% виплачено. Фокус HEAL C4 — $50M на цифровізацію.'
                : 'HEAL P180245 (IPF+PBC): total $500M, disbursed $171M (34%). THRIVE P505616 (PforR): $454M, disbursed ~$320M (70%): $220M advance at signing (Dec 2024) + $19.5M after DLI (Dec 2025). Total: ~$491M / $954M = ~51% disbursed. HEAL C4 focus: $50M for digitalization.',
            },
            {
              val: '7.8 ' + (lang === 'uk' ? 'РОК.' : 'YRS'),
              label: lang === 'uk' ? 'БЕКЛОГ ПРИ 4,000 СПЕЦ.' : 'BACKLOG AT 4,000 SPEC.',
              sub: lang === 'uk'
                ? '4,000 НСЗУ-контрактних МЗ-спеціалістів (психіатри + клін. психологи) × 1,250 сес./рік'
                : '4,000 NHSU-contracted MH specialists (psychiatrists + clinical psychol.) × 1,250 sessions/year',
              color: '#FF4444',
              pulse: true,
              tooltip: lang === 'uk'
                ? '4,000 — консервативна оцінка НСЗУ-зареєстрованих МЗ-спеціалістів (психіатрів + клінічних психологів), що ведуть прийом. Норма навантаження: ~1,250 сесій/рік (50 тиж × 25 сес/тиж). Beклог = 62.22M / (4,000 × 1,250) = 12.4 років; при +100% ефективності = 7.8 р. При 19K фахівців (включаючи тінь) = 1.6-2.2 р. Джерела: НСЗУ портал 2026 / ВООЗ SIMH 2024.'
                : '4,000 — conservative estimate of NHSU-registered MH specialists (psychiatrists + clinical psychologists) in active practice. Workload norm: ~1,250 sessions/year (50 weeks × 25 sessions/week). Backlog = 62.22M / (4,000 × 1,250) = 12.4 years; at +100% efficiency = 7.8 years. With 19K specialists (incl. shadow) = 1.6-2.2 years. Sources: NHSU portal 2026 / WHO SIMH 2024.',
            },
            {
              val: '0%',
              label: lang === 'uk' ? 'СИНХРОНІЗАЦІЯ ДАНИХ' : 'DATA SYNCHRONISATION',
              sub: lang === 'uk'
                ? 'Гуманітарні ↔ ЄСОЗ/НСЗУ: 0% цифрового обміну даними (CommCare/Kobo → ЄСОЗ = 0)'
                : 'Humanitarian ↔ ESOZ/NHSU: 0% digital data exchange (CommCare/Kobo → ESOZ = 0)',
              color: '#8B5CF6',
              pulse: true,
              tooltip: lang === 'uk'
                ? 'Жодна гуманітарна організація в Україні не передає дані про сесії безпосередньо до ЄСОЗ/НСЗУ. CommCare, KoBo, ActivityInfo — ізольовані острівці. THRIVE вимагає 400K verified sessions у ЄСОЗ для disbursement, але source-to-ЄСОЗ pipeline = 0. FEEL Again Digital Bus = рішення.'
                : 'No humanitarian organisation in Ukraine transmits session data directly to ESOZ/NHSU. CommCare, KoBo, ActivityInfo — isolated silos. THRIVE requires 400K verified sessions in ESOZ for disbursement, but source-to-ESOZ pipeline = 0. FEEL Again Digital Bus = the solution.',
            },
            {
              val: '$5M',
              label: lang === 'uk' ? 'ЩОМІСЯЦЯ ВТРАЧАЄТЬСЯ' : 'MONTHLY CAPACITY LOST',
              sub: lang === 'uk'
                ? '~$60M/рік клінічної ємності втрачено через цифрову фрагментацію (35K спеціалістів × 20% адмін)'
                : '~$60M/yr clinical capacity lost to digital fragmentation (35K specialists × 20% admin overhead)',
              color: '#F59E0B',
              pulse: false,
              tooltip: lang === 'uk'
                ? 'Розрахунок: ~35,000 активних МЗПСП-фахівців × 20% адміністративного навантаження × $30/год (blended rate) × ~200 год/міс / 12 = ~$35M-$60M на рік втраченої клінічної ємності. Щомісяця: ~$3M–5M. Цифрова інтеграція може скоротити адмін-навантаження з 22% до 7%, звільнивши ~15% часу = +45K сесій/міс. FEEL Again calculation.'
                : 'Calculation: ~35,000 active MHPSS specialists × 20% admin overhead × $30/hr (blended rate) × ~200 hrs/mo / 12 = ~$35M-$60M/yr lost clinical capacity. Monthly: ~$3M–5M. Digital integration can reduce admin from 22% to 7%, freeing ~15% of time = +45K sessions/month. FEEL Again calculation.',
            },
          ].map((m) => (
            <div key={m.label} className="bg-cyber-surface border border-cyber-border px-4 py-3 rounded-lg relative overflow-hidden group hover:border-cyber-amber/40 transition-colors cursor-help" title={m.tooltip}>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-900/20" />
              <div className="relative">
                <div className="text-[28px] md:text-[32px] font-bold tracking-tighter leading-none mb-1" style={{ color: m.color }}>
                  {m.val}
                </div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  {m.pulse && <span className="w-1.5 h-1.5 rounded-full animate-ping flex-shrink-0" style={{ backgroundColor: m.color }} />}
                  {m.label}
                </div>
                <div className="text-[9px] text-slate-600 mt-0.5 leading-snug">{m.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {TOP_METRICS(lang).map((metric, idx) => (
            <TopMetric key={idx} data={metric} lang={lang} />
          ))}
        </div>
        {/* Live OCHA data banner */}
        {liveMetrics.hdxPopulation && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 rounded-lg bg-cyber-success/5 border border-cyber-success/20 text-[11px] font-mono"
          >
            <DataSourceBadge status="live" lang={lang} lastFetched={dataSources.find(s => s.id === 'hdx_hapi')?.lastFetched} compact />
            <span className="text-slate-500">OCHA FTS / Держстат:</span>
            <span className="text-cyber-success font-bold">
              {lang === 'uk'
                ? `Населення: ${(liveMetrics.hdxPopulation.totalPopulation / 1e6).toFixed(1)}M`
                : `Population: ${(liveMetrics.hdxPopulation.totalPopulation / 1e6).toFixed(1)}M`}
            </span>
            {liveMetrics.hdxFunding && liveMetrics.hdxFunding.totalFundingUsd > 0 && (
              <>
                <span className="text-slate-700">|</span>
                <span className="text-slate-400">
                  {lang === 'uk' ? 'HRP 2025 фінансування:' : 'HRP 2025 funding:'}
                </span>
                <span className="text-cyber-success font-bold">
                  ${(liveMetrics.hdxFunding.totalFundingUsd / 1e9).toFixed(2)}B
                </span>
                {liveMetrics.hdxFunding.totalRequirementsUsd > 0 && (
                  <span className="text-slate-400">
                    {lang === 'uk' ? 'з' : 'of'}{' '}
                    <span className="text-amber-400 font-bold">
                      ${(liveMetrics.hdxFunding.totalRequirementsUsd / 1e9).toFixed(2)}B
                    </span>
                    {' '}
                    <span className={liveMetrics.hdxFunding.fundingPct < 50 ? 'text-rose-400 font-bold' : 'text-cyber-success font-bold'}>
                      ({liveMetrics.hdxFunding.fundingPct}%)
                    </span>
                  </span>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Data Sources Status Panel */}
        {dataSources.length > 0 && (
          <div className="mb-8">
            <DataSourcesPanel
              sources={dataSources}
              lang={lang}
              isLoading={isLoadingData}
              onRefresh={loadLiveData}
            />
          </div>
        )}

        {/* Filter Bar */}
        <div className="sticky top-4 z-40 bg-cyber-bg/80 backdrop-blur-xl border border-cyber-border rounded-xl p-3 flex items-center gap-4 flex-wrap mb-10">
          <label className="cyber-label ml-2">{TEXTS.filters.label[lang]}</label>
          <div className="relative flex-1 md:flex-none">
            <select 
              className="appearance-none w-full bg-cyber-surface border border-cyber-border hover:border-cyber-amber text-white text-xs md:text-sm rounded-lg pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-cyber-amber transition-all cursor-pointer md:min-w-[240px] font-mono"
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value as SectionFilter)}
            >
              {Object.entries(TEXTS.filters.options).map(([key, label]) => (
                <option key={key} value={key} className="bg-cyber-bg">{label[lang]}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-cyber-amber pointer-events-none" />
          </div>
          <div className="ml-auto hidden lg:flex items-center gap-4 px-4 border-l border-cyber-border">
            {isLoadingData ? (
              <DataSourceBadge status="loading" lang={lang} compact />
            ) : (
              <>
                {dataSources.filter(s => s.status === 'live').length > 0 && (
                  <DataSourceBadge status="live" lang={lang} compact />
                )}
                <div className="flex flex-col items-end">
                  <span className="cyber-label text-[8px]">Live_Sources</span>
                  <span className="cyber-number text-xs">
                    {dataSources.filter(s => s.status === 'live').length}/{dataSources.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Executive Thesis */}
        <div className="mb-8 px-5 py-4 rounded-xl border border-cyber-amber/20 bg-cyber-amber/3 flex items-start gap-4">
          <div className="w-0.5 h-full bg-cyber-amber/40 self-stretch rounded flex-shrink-0 min-h-[2rem]" />
          <p className="text-[13px] text-slate-300 leading-relaxed font-mono">
            {lang === 'uk'
              ? 'FEEL Again \u2014 цифрова шина між гуманітарними даними (CommCare/Kobo/ActivityInfo) та державною eHealth системою (ESOZ/Trembita). Світовий Банк інвестував $954M через два взаємопов\u2019язані проєкти — HEAL ($500M, IPF) генерує послуги, THRIVE ($454M, PforR) вимірює через ESOZ. \u2764\ufe0f\u200d\ud83d\udd25 Gap: послуги існують, але невидимі для вимірювання.'
              : 'FEEL Again is the digital bus between humanitarian data (CommCare/Kobo/ActivityInfo) and the state eHealth system (ESOZ/Trembita). World Bank invested $954M via two linked instruments — HEAL ($500M, IPF) deploys services; THRIVE ($454M, PforR) measures via ESOZ. \u2764\ufe0f\u200d\ud83d\udd25 Gap: services exist but are invisible to the measurement layer.'}
          </p>
        </div>

        {/* Killer Quotes Strip */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {KILLER_QUOTES(lang).slice(0, 4).map((q, i) => (
            <div key={q.id} className="cyber-card rounded-xl p-4 border-l-2 flex flex-col gap-2" style={{ borderLeftColor: q.color }}>
              <p className="text-[11px] font-mono font-bold leading-snug" style={{ color: q.color }}>
                &ldquo;{lang === 'uk' ? q.uk : q.en}&rdquo;
              </p>
              <p className="text-[8px] text-slate-600 font-mono mt-auto">{q.source}</p>
            </div>
          ))}
        </div>

        {/* Key Conclusions — 4 primary thesis cards */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CircleDot className="w-4 h-4 text-cyber-amber" />
            <span className="cyber-label text-[11px] text-cyber-amber uppercase tracking-widest">
              {lang === 'uk' ? 'КЛЮЧОВІ ВИСНОВКИ' : 'KEY CONCLUSIONS'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {KEY_CONCLUSIONS(lang).map((c, i) => {
              const icons: Record<string, React.ReactNode> = {
                Zap: <Zap className="w-4 h-4 flex-shrink-0" style={{ color: c.color }} />,
                AlertTriangle: <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: c.color }} />,
                TrendingUp: <TrendingUp className="w-4 h-4 flex-shrink-0" style={{ color: c.color }} />,
                Database: <Database className="w-4 h-4 flex-shrink-0" style={{ color: c.color }} />,
              };
              return (
                <div key={i} className="cyber-card rounded-xl p-5 border-l-2 flex flex-col gap-2" style={{ borderLeftColor: c.color }}>
                  <div className="flex items-center gap-2">
                    {icons[c.icon]}
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: c.color }}>
                      {c.num}. {c.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email CTA #1 — Get Report */}
        <div className="mb-8 rounded-xl border border-cyber-amber/30 bg-cyber-amber/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-[11px] font-mono font-bold text-cyber-amber uppercase tracking-widest mb-1">
              {lang === 'uk' ? 'ОТРИМАТИ ЗВІТ НА ПОШТУ' : 'GET REPORT BY EMAIL'}
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'uk'
                ? 'Надішлемо зведений PDF-звіт з усіма висновками та оновленнями даних'
                : 'We\'ll send a summarised PDF report with all findings and data updates'}
            </p>
          </div>
          {submittedTop ? (
            <div className="flex items-center gap-2 text-cyber-success text-[11px] font-mono font-bold">
              <Check className="w-4 h-4" /> {lang === 'uk' ? 'Дякуємо!' : 'Thank you!'}
            </div>
          ) : (
            <form className="flex gap-2 w-full sm:w-auto" onSubmit={e => { e.preventDefault(); if (emailTop) setSubmittedTop(true); }}>
              <input
                type="email"
                required
                value={emailTop}
                onChange={e => setEmailTop(e.target.value)}
                placeholder={lang === 'uk' ? 'your@email.com' : 'your@email.com'}
                className="flex-1 sm:w-56 bg-cyber-surface border border-cyber-border rounded-lg px-3 py-2 text-[11px] font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyber-amber/60 transition-colors"
              />
              <button type="submit" className="bg-cyber-amber text-cyber-bg px-4 py-2 rounded-lg text-[11px] font-mono font-bold hover:bg-white transition-colors uppercase tracking-wider flex-shrink-0">
                {lang === 'uk' ? 'Надіслати' : 'Send'}
              </button>
            </form>
          )}
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {KPI_DATA.map((kpi, idx) => (
            <KpiCard key={idx} data={kpi} lang={lang} />
          ))}
        </div>

        {/* Perfect Storm — Market Scale Row */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-cyber-amber/40 to-transparent" />
            <span className="text-[10px] font-mono text-cyber-amber uppercase tracking-[0.2em] px-2">
              ⚡ {lang === 'uk' ? 'PERFECT STORM — МАСШТАБ КРИЗИ' : 'PERFECT STORM — SCALE OF CRISIS'}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-cyber-amber/40 to-transparent" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 font-mono">
            {PERFECT_STORM_SCALE(lang).map((m) => (
              <div key={m.label} className="bg-cyber-surface/60 border border-cyber-border/60 px-4 py-3 rounded-lg relative overflow-hidden group hover:border-cyber-amber/30 transition-colors">
                <div className="text-[22px] font-bold tracking-tighter leading-none mb-1" style={{ color: m.color }}>{m.val}</div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest">{m.label}</div>
                <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* All Conclusions Summary Grid — 8-cell cross-section digest */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-slate-700/60 to-transparent" />
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] px-2">
              {lang === 'uk' ? 'ВСІ КЛЮЧОВІ ВИСНОВКИ — ЗВЕДЕНИЙ ОГЛЯД' : 'ALL KEY CONCLUSIONS — SUMMARY VIEW'}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-slate-700/60 to-transparent" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {ALL_CONCLUSIONS_GRID(lang).map((c, i) => (
              <div key={i} className="bg-cyber-surface border border-cyber-border/50 rounded-lg p-3 flex flex-col gap-1.5 hover:border-cyber-border transition-colors">
                <div className="text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color: c.color }}>
                  {c.section}
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── DATA INTELLIGENCE: NOW vs CANONICAL ────────────────────── */}
        <div className="mb-12" id="data-intelligence">
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] px-2">
              {DATA_INTELLIGENCE(lang).sectionTitle}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-blue-500/40 to-transparent" />
          </div>
          <p className="text-[11px] text-slate-500 mb-4 font-mono text-center leading-relaxed">
            {DATA_INTELLIGENCE(lang).sectionSub}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* NOW — what's available */}
            <div className="border border-blue-500/20 rounded-xl overflow-hidden">
              <div className="bg-blue-500/5 px-4 py-2.5 border-b border-blue-500/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-blue-300 uppercase tracking-wider">
                  {lang === 'uk' ? 'ЩО МАЄМОзАРАЗ' : 'WHAT WE HAVE NOW'}
                </span>
              </div>
              <div className="divide-y divide-slate-800/60">
                {DATA_INTELLIGENCE(lang).now.map((row, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-3">
                    <span className={`mt-0.5 flex-shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${row.status === 'live' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700/60 text-slate-400'}`}>
                      {row.status === 'live' ? 'LIVE' : 'STATIC'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white font-medium">{row.name}</div>
                      <div className="text-[10px] text-slate-500 leading-snug">{row.what}</div>
                      <div className="text-[9px] text-slate-700 font-mono mt-0.5">{row.tech}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* CANONICAL — what WB/WHO use */}
            <div className="border border-amber-500/20 rounded-xl overflow-hidden">
              <div className="bg-amber-500/5 px-4 py-2.5 border-b border-amber-500/20 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  {lang === 'uk' ? 'КАНОНІЧНИЙ НАБІР WB / WHO' : 'CANONICAL WB / WHO DATASET'}
                </span>
              </div>
              <div className="divide-y divide-slate-800/60">
                {DATA_INTELLIGENCE(lang).canonical.map((row, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-3">
                    <span className={`mt-0.5 flex-shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${row.status === 'locked' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'}`}>
                      {row.status === 'locked' ? 'LOCKED' : 'AUTH'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white font-medium flex items-center gap-1.5">
                        {row.name}
                        {row.feelbridges && <span className="text-[8px] bg-emerald-500/15 text-emerald-400 px-1 py-0.5 rounded font-mono">FEEL bridges</span>}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-snug">{row.what}</div>
                      <div className="text-[9px] text-amber-600/80 font-mono mt-0.5">{lang === 'uk' ? 'Бар\'єр:' : 'Barrier:'} {row.barrier}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Gap statement */}
          <div className="mt-4 px-5 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-3">
            <GitMerge className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-[11px] text-emerald-300 font-mono leading-relaxed">{DATA_INTELLIGENCE(lang).gapStatement}</p>
          </div>
        </div>

        {/* ── FEEL AGAIN 4 CORE FUNCTIONS ─────────────────────────────── */}
        <div className="mb-12" id="feel-functions">
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-cyber-amber/40 to-transparent" />
            <span className="text-[10px] font-mono text-cyber-amber uppercase tracking-[0.2em] px-2">
              {lang === 'uk' ? 'FEEL AGAIN — 4 КЛЮЧОВІ ФУНКЦІЇ ІНФРАСТРУКТУРИ' : 'FEEL AGAIN — 4 CORE INFRASTRUCTURE FUNCTIONS'}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-cyber-amber/40 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEEL_AGAIN_4_FUNCTIONS(lang).map((fn, i) => (
              <div key={i} className="rounded-xl border overflow-hidden flex flex-col" style={{ borderColor: fn.color + '30' }}>
                <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: fn.color + '12', borderBottom: `1px solid ${fn.color}30` }}>
                  <span className="text-2xl font-bold font-mono" style={{ color: fn.color }}>{fn.num}</span>
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: fn.color }}>{fn.title}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{fn.subtitle}</div>
                  </div>
                </div>
                <div className="px-4 py-3 flex-1 space-y-2">
                  {fn.points.map((pt, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-[9px] mt-0.5 flex-shrink-0" style={{ color: fn.color }}>▸</span>
                      <span className="text-[10px] text-slate-400 leading-snug">{pt}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 pb-3 space-y-1.5">
                  <div className="text-[8px] font-mono text-slate-700 border-t border-slate-800/60 pt-2">{fn.tech}</div>
                  <div className="text-[9px] font-mono font-bold" style={{ color: fn.color }}>{fn.impact}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Architecture summary */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            {[
              { label: lang === 'uk' ? 'Вхід' : 'Input', val: lang === 'uk' ? 'CommCare · KoBo · ActivityInfo' : 'CommCare · KoBo · ActivityInfo', color: '#8B5CF6' },
              { label: lang === 'uk' ? 'FEEL Again шина' : 'FEEL Again bus', val: 'FHIR R4 → Trembita → ESOZ', color: '#D4A017' },
              { label: lang === 'uk' ? 'Вихід (DLI)' : 'Output (DLI)', val: lang === 'uk' ? 'ЄСОЗ · НСЗУ · MOH · Donor reporting' : 'ESOZ · NHSU · MOH · Donor reporting', color: '#16A34A' },
            ].map((item, i) => (
              <div key={i} className="rounded-lg px-4 py-3 border" style={{ borderColor: item.color + '30', backgroundColor: item.color + '08' }}>
                <div className="text-[8px] font-mono uppercase tracking-wider text-slate-600 mb-1">{item.label}</div>
                <div className="text-[10px] font-mono font-bold" style={{ color: item.color }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROI CALCULATOR ───────────────────────────────────────────── */}
        <div className="mb-12" id="roi-calc">
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/40 to-transparent" />
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em] px-2">
              {lang === 'uk' ? 'ROI КАЛЬКУЛЯТОР — ВКЛАДІТЬ, ОТРИМАЙТЕ' : 'ROI CALCULATOR — INVEST, RECEIVE'}
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/40 to-transparent" />
          </div>
          <div className="cyber-card border border-emerald-500/20 rounded-2xl overflow-hidden">
            <div className="p-6">
              {/* Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {lang === 'uk' ? 'Обсяг інвестиції' : 'Investment amount'}
                  </span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">${roiInvestment}M</span>
                </div>
                <input
                  type="range" min="1" max="50" step="1"
                  value={roiInvestment}
                  onChange={e => setRoiInvestment(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: '#10b981' }}
                />
                <div className="flex justify-between text-[9px] text-slate-700 font-mono mt-1">
                  <span>$1M</span><span>$50M</span>
                </div>
              </div>
              {/* Results grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: lang === 'uk' ? 'Сесій забезпечено' : 'Sessions funded', val: roiResults.fmt(roiResults.sessions), color: '#3b82f6', note: `@ $${ROI_PARAMS.costPerSessionUsd}/session` },
                  { label: lang === 'uk' ? 'Бенефіціарів' : 'Beneficiaries', val: roiResults.fmt(roiResults.beneficiaries), color: '#2A9D8F', note: `÷ ${ROI_PARAMS.sessionsPerBeneficiary} sessions/person` },
                  { label: lang === 'uk' ? 'Прямий ROI (4:1)' : 'Direct ROI (4:1)', val: roiResults.fmt(roiResults.directRoi), color: '#10b981', note: `WHO $1 → $${ROI_PARAMS.roiMultiplier}` },
                  { label: lang === 'uk' ? 'DALYs авертовано' : 'DALYs averted', val: roiResults.dalys.toLocaleString(), color: '#A855F7', note: `${ROI_PARAMS.dalysPerCourse} DALY/course (avg)` },
                  { label: lang === 'uk' ? 'Вартість DALYs' : 'DALY value', val: roiResults.fmt(roiResults.dalyValue), color: '#F59E0B', note: `$${ROI_PARAMS.whodalyThresholdUsd.toLocaleString()}/DALY (WHO UA)` },
                  { label: lang === 'uk' ? 'Загальний ROI' : 'Total return', val: `${roiResults.roiRatio}×`, color: '#EF4444', note: roiResults.fmt(roiResults.totalReturn) + ' total value' },
                ].map((card, i) => (
                  <div key={i} className="rounded-lg p-3 text-center" style={{ backgroundColor: card.color + '10', border: `1px solid ${card.color}25` }}>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-wider mb-1">{card.label}</div>
                    <div className="text-xl font-bold font-mono" style={{ color: card.color }}>{card.val}</div>
                    <div className="text-[8px] text-slate-700 font-mono mt-0.5">{card.note}</div>
                  </div>
                ))}
              </div>
              {/* Assumptions note */}
              <div className="mt-4 text-[9px] text-slate-700 font-mono leading-relaxed">
                {lang === 'uk'
                  ? `Припущення: $${ROI_PARAMS.costPerSessionUsd}/сесія (blended public-humanitarian тариф) · ${ROI_PARAMS.sessionsPerBeneficiary} сесій/особу (WHO норма) · ROI 4:1 (WHO) · ${ROI_PARAMS.dalysPerCourse} DALY/курс (середнє 0.5–2) · $${ROI_PARAMS.whodalyThresholdUsd.toLocaleString()}/DALY (ВООЗ поріг Україна = 1× ВНД). Не фінансова порада.`
                  : `Assumptions: $${ROI_PARAMS.costPerSessionUsd}/session (blended public-humanitarian tariff) · ${ROI_PARAMS.sessionsPerBeneficiary} sessions/person (WHO norm) · ROI 4:1 (WHO) · ${ROI_PARAMS.dalysPerCourse} DALYs/course (avg 0.5–2) · $${ROI_PARAMS.whodalyThresholdUsd.toLocaleString()}/DALY (WHO threshold Ukraine = 1× GNI). Not financial advice.`}
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          <AnimatePresence>
            {filteredSections.map((section, sectionIdx) => (
              <motion.div
                key={section.id}
                id={`section-${section.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                {/* Section header — clickable to expand/collapse */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-4 mb-0 border-b border-cyber-border pb-4 hover:border-cyber-amber/40 transition-colors group text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-cyber-surface border border-cyber-cyan/30 rounded-lg group-hover:border-cyber-amber/50 transition-colors">
                    <span className="text-[11px] font-bold text-cyber-cyan font-mono">
                      {String(sectionIdx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white tracking-tight uppercase group-hover:text-cyber-amber transition-colors">{section.title[lang]}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="h-0.5 w-16 bg-gradient-to-r from-cyber-cyan to-transparent" />
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                        {section.id === 'prevalence' && (lang === 'uk' ? '9.6M під впливом · 22% населення' : '9.6M affected · 22% of population')}
                        {section.id === 'workforce' && (lang === 'uk' ? '1.3 психолога / 100K · потрібно 5×' : '1.3 psychologists / 100K · needs 5×')}
                        {section.id === 'budget' && (lang === 'uk' ? '2.5% бюджету МЗ · ~5.55 млрд ₴ · ВООЗ ≥5%' : '2.5% MH budget · ~₴5.55B · WHO ≥5%')}
                        {section.id === 'gap' && (lang === 'uk' ? '0.28% покриття · беклог 7.8 років' : '0.28% coverage · 7.8 yr backlog')}
                        {section.id === 'shadow' && (lang === 'uk' ? '110× приватний > гуманітарний · штраф формалізації 65% доходу (ФОП3 5%+ЄСВ+бухг.+200 год адмін)' : '110× private > humanitarian · 65% income formalization penalty (FOP3 5%+SSC+accounting+200h admin)')}
                        {section.id === 'economic' && (lang === 'uk' ? '$1→$4 ROI · $1.2B+ втрати ВВП' : '$1→$4 ROI · $1.2B+ GDP loss')}
                        {section.id === 'children' && (lang === 'uk' ? '1.5M дітей у групі ризику ПТСР' : '1.5M children at PTSD risk')}
                        {section.id === 'inputs' && (lang === 'uk' ? '150K сертифікатів → 0% даних про результат' : '150K certificates → 0% outcome data')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest hidden md:block">
                      {expandedSections.has(section.id) ? (lang === 'uk' ? 'ЗГОРНУТИ' : 'COLLAPSE') : (lang === 'uk' ? 'РОЗГОРНУТИ' : 'EXPAND')}
                    </span>
                    {expandedSections.has(section.id)
                      ? <ChevronUp className="w-4 h-4 text-cyber-amber" />
                      : <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-cyber-amber transition-colors" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                {expandedSections.has(section.id) && (
                <motion.div
                  key={section.id + '-content'}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                <div className="mt-8">

              {/* Content Switcher based on Section ID */}
              
              {/* PREVALENCE */}
              {section.id === 'prevalence' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card title={lang === 'uk' ? 'Поширеність розладів, % населення' : 'Disorder Prevalence, % of Population'} subtitle={lang === 'uk' ? 'Джерело: The Lancet Regional Health Europe, 2023; PMC, 2024' : 'Source: The Lancet Regional Health Europe, 2023; PMC, 2024'}>
                      <ResponsiveContainer width="100%" height={350} minWidth={1}>
                        <BarChart layout="vertical" data={PREVALENCE_DATA(lang)} margin={{ left: 10, right: 60, top: 10, bottom: 10 }}>
                           <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0, 245, 255, 0.1)" />
                           <XAxis type="number" hide />
                           <YAxis type="category" dataKey="name" width={140} tick={{fontSize: 11, fill: '#94a3b8'}} interval={0} />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#050A15', border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: 8 }} itemStyle={{ color: '#00F5FF' }} />
                           <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#00F5FF', fontSize: 11, fontWeight: 'bold', fontFamily: 'JetBrains Mono', formatter: (v:any)=>`${v}%` }}>
                              {PREVALENCE_DATA(lang).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                           </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                  </Card>
                  <Card title={lang === 'uk' ? 'Хто под найбільшим ризиком' : 'Highest-Risk Groups'} subtitle={lang === 'uk' ? 'Джерело: PMC, Lancet, OCHA 2024–2025' : 'Source: PMC, Lancet, OCHA 2024–2025'}>
                     <ResponsiveContainer width="100%" height={350} minWidth={1}>
                        <BarChart data={RISK_GROUP_DATA(lang)} margin={{ bottom: 60, top: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" tick={{fontSize: 10}} height={80} />
                          <YAxis unit="%" tick={{fontSize: 11}} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                          <Bar dataKey="value" fill={COLORS.red} radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                     </ResponsiveContainer>
                     <InsightBox type="critical">
                        {lang === 'uk' ? '⚠ 36% домогосподарств мають хоча б одного члена з психосоціальними проблемами, що впливають на повсякденне функціонування (OCHA, січень 2025)' : '⚠ 36% of households have at least one member with psychosocial problems affecting daily functioning (OCHA, Jan 2025)'}
                     </InsightBox>
                  </Card>
                </div>
              )}

              {/* WORKFORCE */}
              {section.id === 'workforce' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={lang === 'uk' ? 'Фахівці на 100 000 населення' : 'Professionals per 100,000'} subtitle={lang === 'uk' ? 'Україна vs Стандарти (WHO Atlas 2020)' : 'Ukraine vs Standards (WHO Atlas 2020)'}>
                       <ResponsiveContainer width="100%" height={300} minWidth={1}>
                          <BarChart data={WORKFORCE_DATA(lang)}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                             <XAxis dataKey="name" tick={{fontSize: 11}} />
                             <YAxis tick={{fontSize: 11}} />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                             <Legend wrapperStyle={{fontSize: 12, paddingTop: 10}} />
                             <Bar dataKey="Ukraine" name={lang === 'uk' ? 'Україна' : 'Ukraine'} fill={COLORS.blue} radius={[4,4,0,0]}>
                                <LabelList dataKey="Ukraine" position="top" style={{ fontSize: '10px', fill: '#64748b' }} />
                             </Bar>
                             <Bar dataKey="EU" name={lang === 'uk' ? 'ЄС / Високий дохід' : 'EU / High-income'} fill={COLORS.greenLight} radius={[4,4,0,0]}>
                                <LabelList dataKey="EU" position="top" style={{ fontSize: '10px', fill: '#64748b' }} />
                             </Bar>
                             <Bar dataKey="WHO" name={lang === 'uk' ? 'Ціль ВООЗ' : 'WHO Target'} fill={COLORS.orangeLight} radius={[4,4,0,0]}>
                                <LabelList dataKey="WHO" position="top" style={{ fontSize: '10px', fill: '#64748b' }} />
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </Card>
                    <Card title={lang === 'uk' ? 'Вплив війни на кадри' : 'War Impact on Staffing'} subtitle={lang === 'uk' ? 'Середня кількість на заклад (PMC 2024)' : 'Avg per facility (PMC 2024)'}>
                       <ResponsiveContainer width="100%" height={300} minWidth={1}>
                          <AreaChart data={WAR_IMPACT_DATA(lang)}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                             <XAxis dataKey="name" tick={{fontSize: 11}} />
                             <YAxis tick={{fontSize: 11}} />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                             <Legend wrapperStyle={{fontSize: 12, paddingTop: 10}} />
                             <Area type="monotone" dataKey="psych" name={lang === 'uk' ? 'Психіатри' : 'Psychiatrists'} stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.1} />
                             <Area type="monotone" dataKey="social" name={lang === 'uk' ? 'Соцпрацівники (x0.1)' : 'Social Workers (x0.1)'} stroke={COLORS.blue} fill={COLORS.blue} fillOpacity={0.1} />
                          </AreaChart>
                       </ResponsiveContainer>
                       <InsightBox type="critical">
                         <div className="flex items-center gap-2 flex-wrap">
                            <span>{lang === 'uk' ? '⚠ 21.7% медпрацівників переміщені, 0.5% поранені. Середня кількість психіатрів на заклад впала з' : '⚠ 21.7% medical workers displaced, 0.5% injured. Average psychiatrists per facility dropped from'}</span>
                            <span className="font-mono font-bold text-red-600 animate-pulse text-lg">40.0</span>
                            <span>{lang === 'uk' ? 'до' : 'to'}</span>
                            <span className="font-mono font-bold text-red-600 animate-pulse text-lg">30.9</span>
                            <span>(-23%)</span>
                         </div>
                       </InsightBox>
                    </Card>
                  </div>
                  <Card colSpan="full" title={lang === 'uk' ? 'Розподіл кадрів за секторами (оціночні дані)' : 'Workforce Distribution by Sector (Estimated)'}>
                     <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/3">
                          <CustomDonutChart data={SECTOR_DIST_DATA(lang)} height={250} />
                        </div>
                        <div className="w-full md:w-2/3">
                           <InsightBox type="neutral">
                              {lang === 'uk' ? "ℹ Точний розподіл між державним, НУО та приватним секторами не фіксується офіційною статистикою. ВООЗ зазначає: «інші фахівці з психічного здоров'я не включені до офіційної статистики»" : "ℹ Exact distribution between public, NGO and private sectors is not captured in official statistics. WHO notes: 'other mental health professionals are not included in official statistics'"}
                           </InsightBox>
                        </div>
                     </div>
                  </Card>
                </div>
              )}

              {/* BUDGET */}
              {section.id === 'budget' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={lang === 'uk' ? 'Розподіл бюджету' : 'Budget Split'} subtitle="Inpatient vs Outpatient">
                       <CustomDonutChart data={BUDGET_SPLIT_DATA(lang)} height={250} />
                       <InsightBox type="critical">
                          {lang === 'uk' ? '⚠ 55.5% спеціалізованої допомоги (80.2B з 144.6B UAH) → стаціонар, хоча 64–71% пацієнтів звертаються амбулаторно. Первинна допомога: лише 25.6B UAH (МОЗ 2025).' : '⚠ 55.5% of specialized care (80.2B of 144.6B UAH) → inpatient, though 64–71% of patients seek outpatient care. Primary care: only 25.6B UAH (MOH 2025).'}
                       </InsightBox>
                    </Card>
                    <Card title={lang === 'uk' ? 'Міжнародне фінансування МЗПСП' : 'International MHPSS Funding'} subtitle={lang === 'uk' ? 'Млн USD/EUR (2024-2025)' : 'M USD/EUR (2024-2025)'}>
                       <CustomBarChart data={DONOR_DATA(lang)} layout="horizontal" height={250} />
                       {/* HDX HAPI live data block */}
                       {liveMetrics.hdxFunding ? (
                         <div className="mt-3 p-3 rounded-lg bg-cyber-success/5 border border-cyber-success/20">
                           <div className="flex items-center gap-2 mb-2">
                             <DataSourceBadge status="live" lang={lang} lastFetched={dataSources.find(s => s.id === 'hdx_hapi')?.lastFetched} />
                             <span className="text-[10px] text-slate-400 font-mono">OCHA FTS live</span>
                           </div>
                           <div className="grid grid-cols-3 gap-2 text-center">
                             <div>
                               <div className="text-cyber-success font-bold text-sm font-mono">
                                 ${(liveMetrics.hdxFunding.totalFundingUsd / 1e6).toFixed(1)}M
                               </div>
                               <div className="text-[9px] text-slate-500 uppercase">
                                 {lang === 'uk' ? 'Отримано' : 'Received'}
                               </div>
                             </div>
                             <div>
                               <div className="text-amber-400 font-bold text-sm font-mono">
                                 ${(liveMetrics.hdxFunding.totalRequirementsUsd / 1e6).toFixed(1)}M
                               </div>
                               <div className="text-[9px] text-slate-500 uppercase">
                                 {lang === 'uk' ? 'Потрібно' : 'Required'}
                               </div>
                             </div>
                             <div>
                               <div className={`font-bold text-sm font-mono ${liveMetrics.hdxFunding.fundingPct < 50 ? 'text-rose-400' : 'text-cyber-success'}`}>
                                 {liveMetrics.hdxFunding.fundingPct}%
                               </div>
                               <div className="text-[9px] text-slate-500 uppercase">
                                 {lang === 'uk' ? 'Покриття' : 'Coverage'}
                               </div>
                             </div>
                           </div>
                         </div>
                       ) : (
                         <div className="mt-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 flex items-center gap-2">
                           <DataSourceBadge status={isLoadingData ? 'loading' : (dataSources.find(s => s.id === 'hdx_hapi')?.status ?? 'unavailable')} lang={lang} compact />
                           <span className="text-[10px] text-slate-500 font-mono">
                             {isLoadingData
                               ? (lang === 'uk' ? 'Завантаження HDX HAPI...' : 'Loading HDX HAPI...')
                               : (lang === 'uk' ? 'HDX HAPI недоступне — показуються статичні дані' : 'HDX HAPI unavailable — showing static data')}
                           </span>
                         </div>
                       )}
                    </Card>
                    <Card title={lang === 'uk' ? 'Ефективність: вартість на бенефіціара' : 'Efficiency: Cost per Beneficiary'} subtitle={lang === 'uk' ? 'Нижче = ефективніше · Дані: OCHA/UNICEF/WHO 2024' : 'Lower = more efficient · Data: OCHA/UNICEF/WHO 2024'}>
                       <div className="space-y-3 py-2">
                         {[
                           { org: 'UNICEF (group PSS)', costPerPerson: 12, reach: 760, color: COLORS.teal, note: lang === 'uk' ? '$5–15/особу (групова)' : '$5–15/person (group)' },
                           { org: 'WHO (consultations)', costPerPerson: 28, reach: 80, color: COLORS.blue, note: lang === 'uk' ? '$20–35/особу' : '$20–35/person' },
                           { org: lang === 'uk' ? 'Держ. сектор (НСЗУ)' : 'State sector (NHSU)', costPerPerson: 35, reach: 435, color: COLORS.green, note: lang === 'uk' ? '~\u20b91,400 (~$35)/випадок' : '~\u20b91,400 (~$35)/case' },
                           { org: lang === 'uk' ? 'USAID (individual therapy)' : 'USAID (individual therapy)', costPerPerson: 250, reach: 60, color: COLORS.orange, note: lang === 'uk' ? '$150–350/курс' : '$150–350/course' },
                         ].map(item => {
                           const pct = Math.min((item.costPerPerson / 250) * 100, 100);
                           const isNarrow = pct < 20;
                           return (
                           <div key={item.org} className="flex items-center gap-3">
                             <div className="w-40 text-[10px] text-slate-400 text-right flex-shrink-0">{item.org}</div>
                             <div className="flex-1 relative h-7 flex items-center">
                               <div className="absolute inset-y-0 left-0 right-0 bg-slate-800/50 rounded-full" />
                               <div
                                 className="absolute inset-y-0 left-0 rounded-full"
                                 style={{ width: `${pct}%`, backgroundColor: item.color + '25', borderRight: `2px solid ${item.color}` }}
                               />
                               {isNarrow ? (
                                 <span className="relative z-10 text-[11px] font-mono font-bold ml-2" style={{ marginLeft: `calc(${pct}% + 6px)`, color: item.color }}>${item.costPerPerson}</span>
                               ) : (
                                 <span className="absolute right-2 z-10 text-[11px] font-mono font-bold" style={{ left: `calc(${pct}% - 40px)`, color: item.color }}>${item.costPerPerson}</span>
                               )}
                             </div>
                             <div className="w-28 text-[9px] text-slate-500 flex-shrink-0">{item.note}</div>
                           </div>
                           );
                         })}
                         <div className="mt-4 pt-3 border-t border-cyber-border/20 text-[10px] text-slate-500 font-mono">
                           {lang === 'uk'
                             ? 'Охоплення (тис. осіб): UNICEF 760K · НСЗУ 435K · WHO 80K · USAID 60K'
                             : 'Reach (K persons): UNICEF 760K · NHSU 435K · WHO 80K · USAID 60K'}
                         </div>
                       </div>
                    </Card>
                    <Card title={lang === 'uk' ? "Бюджет охорони здоров'я та частка на ментальне здоров'я" : "Health Budget & Mental Health Share"} subtitle={lang === 'uk' ? 'Млрд ₴ · МОЗ 2024-2026' : 'B UAH · MOH 2024-2026'}>
                     <ResponsiveContainer width="100%" height={220} minWidth={1}>
                        <ComposedChart data={[{year:'2024', health:239, mh:5.98}, {year:'2025', health:222.1, mh:5.55}, {year:'2026', health:258.6, mh:6.47}]}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                           <XAxis dataKey="year" tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono'}} />
                           <YAxis yAxisId="left" tick={{fontSize:10}} label={{value: lang==='uk'?'Млрд ₴':'B ₴', angle:-90, position:'insideLeft', style:{fontSize:9}}} />
                           <YAxis yAxisId="right" orientation="right" tick={{fontSize:10}} label={{value: lang==='uk'?'МЗ (2.5%)':'MH (2.5%)', angle:90, position:'insideRight', style:{fontSize:9}}} />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                           <Legend wrapperStyle={{fontSize:10}} />
                           <Bar yAxisId="left" dataKey="health" name={lang === 'uk' ? "Бюджет охорони здоров'я" : "Health Budget"} fill={COLORS.blueLight} radius={[4,4,0,0]} barSize={32} />
                           <Line yAxisId="right" type="monotone" dataKey="mh" name={lang === 'uk' ? "Оцінка МЗ (2.5%)" : "Est. MH (2.5%)"} stroke={COLORS.red} strokeWidth={2} dot={{r:3}} />
                        </ComposedChart>
                     </ResponsiveContainer>
                     <div className="mt-2 text-[9px] text-slate-500 font-mono">
                       {lang === 'uk' ? 'Спеціалізована 144.6B · Стаціонар 80.2B (55.5%) · Первинна 25.6B — МОЗ 2025' : 'Specialized 144.6B · Inpatient 80.2B (55.5%) · Primary 25.6B — MOH 2025'}
                     </div>
                     {/* World Bank live health spending % GDP */}
                     {liveMetrics.worldBankHealth ? (
                       <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                         <div className="flex items-center gap-2 mb-2">
                           <DataSourceBadge status="live" lang={lang} lastFetched={dataSources.find(s => s.id === 'world_bank')?.lastFetched} compact />
                           <span className="text-[10px] text-slate-400 font-mono">World Bank WDI — SH.XPD.CHEX.GD.ZS</span>
                         </div>
                         <div className="flex items-end gap-4">
                           <div className="text-center">
                             <div className="text-2xl font-bold text-blue-400 font-mono">{liveMetrics.worldBankHealth.healthSpendingPctGdp}%</div>
                             <div className="text-[9px] text-slate-500 uppercase">{lang === 'uk' ? 'Україна ВВП' : 'Ukraine GDP'} ({liveMetrics.worldBankHealth.year})</div>
                           </div>
                           <div className="h-8 w-px bg-slate-700" />
                           <div className="text-center">
                             <div className="text-2xl font-bold text-amber-400 font-mono">≥5%</div>
                             <div className="text-[9px] text-slate-500 uppercase">{lang === 'uk' ? 'Мінімум ВООЗ' : 'WHO minimum'}</div>
                           </div>
                           <div className="flex-1">
                             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                               <div
                                 className="h-full rounded-full"
                                 style={{
                                   width: `${Math.min((liveMetrics.worldBankHealth.healthSpendingPctGdp / 12) * 100, 100)}%`,
                                   backgroundColor: liveMetrics.worldBankHealth.healthSpendingPctGdp >= 5 ? '#3b82f6' : '#f59e0b',
                                 }}
                               />
                             </div>
                             <div className="text-[8px] text-slate-600 mt-1 font-mono">
                               {lang === 'uk' ? 'Тренд:' : 'Trend:'}{' '}
                               {liveMetrics.worldBankHealth.trend.map(t => `${t.year}: ${t.value}%`).join(' · ')}
                             </div>
                           </div>
                         </div>
                       </div>
                     ) : (
                       <div className="mt-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 flex items-center gap-2">
                         <DataSourceBadge status={isLoadingData ? 'loading' : (dataSources.find(s => s.id === 'world_bank')?.status ?? 'unavailable')} lang={lang} compact />
                         <span className="text-[10px] text-slate-500 font-mono">
                           {isLoadingData
                             ? (lang === 'uk' ? 'Завантаження World Bank WDI...' : 'Loading World Bank WDI...')
                             : (lang === 'uk' ? 'World Bank WDI недоступне — статичні дані' : 'World Bank WDI unavailable — static data')}
                         </span>
                       </div>
                     )}
                    </Card>
                  </div>

                  {/* Grand Bargain 3.0 Compliance */}
                  <div className="cyber-card border border-amber-500/20 rounded-xl overflow-hidden">
                    <div className="bg-amber-500/5 px-5 py-3 border-b border-amber-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span className="cyber-label text-[11px] text-amber-400">
                          {lang === 'uk' ? 'GRAND BARGAIN 3.0 — РОЗРИВ МІЖ ЦІЛЛЮ ТА РЕАЛЬНІСТЮ' : 'GRAND BARGAIN 3.0 — GAP BETWEEN TARGET AND REALITY'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">IASC / ALNAP 2024-2025</span>
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {GRAND_BARGAIN_3(lang).map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{item.indicator}</div>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold font-mono" style={{ color: item.color }}>{item.actual}{item.unit}</span>
                            <span className="text-[10px] text-slate-500 font-mono mb-1">/ {item.target}{item.unit} ціль</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((item.actual / item.target) * 100, 100)}%`, backgroundColor: item.color }} />
                          </div>
                          <p className="text-[9px] text-slate-600 font-mono leading-snug">{item.note}</p>
                          <div className="text-[8px] text-slate-700 font-mono">{item.source}</div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 pb-4">
                      <p className="text-[10px] text-amber-300/70 font-mono leading-relaxed">
                        {lang === 'uk'
                          ? '⚡ Tom Fletcher (ERC): "Криза легітимності, моральності та фінансування." FEEL Again — локалізована технологічна відповідь на всі 4 показники: підзвітність, якість, доступність, довгостроковість.'
                          : '⚡ Tom Fletcher (ERC): "Crisis of legitimacy, morality and financing." FEEL Again is a localised tech response to all 4 metrics: accountability, quality, access, multi-year sustainability.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* GAP */}
              {section.id === 'gap' && (
                <div className="space-y-6">
                  {/* Capacity Ceiling — mathematical proof */}
                  <div className="cyber-card border border-rose-500/30 rounded-xl overflow-hidden">
                    <div className="bg-rose-500/5 px-5 py-3 border-b border-rose-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="cyber-label text-[11px] text-rose-400">
                          {lang === 'uk' ? 'СТЕЛЯ ЄМНОСТІ: МАТЕМАТИЧНИЙ ДОКАЗ' : 'CAPACITY CEILING: MATHEMATICAL PROOF'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                      <div>
                        <p className="text-[12px] text-slate-300 leading-relaxed mb-4">
                          {lang === 'uk'
                            ? "Навіть якщо подвоїти або потроїти ефективність існуючої системи \u2014 математичний розрив між клінічною потребою та ємністю закриється лише частково. Структурна зміна необхідна."
                            : "Even doubling or tripling existing system efficiency \u2014 the mathematical gap between clinical need and capacity closes only partially. Structural change is required."}
                        </p>
                        <div className="space-y-2">
                          {CAPACITY_CEILING_DATA(lang).map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.fill }} />
                              <div className="flex-1 bg-slate-800/60 rounded-full overflow-hidden h-5">
                                <div
                                  className="h-full rounded-full flex items-center pl-2 transition-all duration-700"
                                  style={{ width: `${(item.value / 3500) * 100}%`, backgroundColor: item.fill + '40', borderRight: `2px solid ${item.fill}` }}
                                >
                                  <span className="text-[9px] font-mono font-bold" style={{ color: item.fill }}>{(item.value / 1000).toFixed(1)}M</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 w-36 flex-shrink-0">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
                          <div className="text-[10px] text-rose-400 uppercase tracking-wider mb-1 font-mono">
                            {lang === 'uk' ? 'Дефіцит при +200% ефект.' : 'Gap at +200% efficiency'}
                          </div>
                          <div className="text-3xl font-bold text-rose-400 font-mono">1,850,000</div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {lang === 'uk' ? 'людей без допомоги навіть при максимальній ефективності' : 'people without care even at maximum efficiency'}
                          </div>
                        </div>
                        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                          <div className="text-[10px] text-amber-400 uppercase tracking-wider mb-1 font-mono">
                            {lang === 'uk' ? 'Висновок для інвестора' : 'Investor takeaway'}
                          </div>
                          <div className="text-[11px] text-amber-300 leading-relaxed">
                            {lang === 'uk'
                              ? "Проблема не у відсутності зусиль \u2014 а у структурній обмеженості системи. Цифрова інфраструктура не замінює фахівців, але множить їх ємність."
                              : "The problem is not lack of effort \u2014 but structural capacity limits. Digital infrastructure doesn\u2019t replace specialists, it multiplies their capacity."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={lang === 'uk' ? 'Потреба vs Охоплення (млн)' : 'Need vs Coverage (millions)'}>
                       <ResponsiveContainer width="100%" height={300} minWidth={1}>
                          <BarChart data={GAP_DATA(lang)}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                             <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-15} textAnchor="end" height={60} />
                             <YAxis tick={{fontSize: 11}} unit="M" />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                             <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#94a3b8' }} />
                             <Bar dataKey="need" name={lang === 'uk' ? 'Потреба' : 'Need'} fill={COLORS.redLight} radius={[4,4,0,0]} />
                             <Bar dataKey="reached" name={lang === 'uk' ? 'Охоплено' : 'Reached'} fill={COLORS.green} radius={[4,4,0,0]} />
                          </BarChart>
                       </ResponsiveContainer>
                    </Card>
                    <Card title={lang === 'uk' ? "Бар'єри для отримання допомоги" : "Barriers to Accessing Care"}>
                       <CustomDonutChart data={BARRIERS_DATA(lang)} height={300} />
                    </Card>
                  </div>
                  <Card colSpan="full" title={lang === 'uk' ? 'Охоплення послугами МЗПСП (фактичні дані)' : 'MHPSS Service Reach (Actual Data)'}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-800/60 border-b border-cyber-border">
                          <tr>
                            <th className="px-5 py-3 font-mono tracking-wider">{lang === 'uk' ? 'Показник' : 'Indicator'}</th>
                            <th className="px-5 py-3 font-mono tracking-wider">{lang === 'uk' ? 'Значення' : 'Value'}</th>
                            <th className="px-5 py-3 font-mono tracking-wider">{lang === 'uk' ? 'Організація' : 'Organization'}</th>
                            <th className="px-5 py-3 font-mono tracking-wider">{lang === 'uk' ? 'Період' : 'Period'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyber-border/20">
                          {REACH_TABLE_DATA(lang).map((row, idx) => (
                            <tr key={idx} className="hover:bg-cyber-cyan/5 transition-colors">
                              <td className="px-5 py-3 text-slate-300 text-[12px]">{row[0]}</td>
                              <td className="px-5 py-3 font-bold text-cyber-cyan font-mono text-[13px]">{row[1]}</td>
                              <td className="px-5 py-3 text-slate-400 text-[11px]">{row[2]}</td>
                              <td className="px-5 py-3 text-slate-600 text-[10px] font-mono">{row[3]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Macro Gap: 0.28% / 62.4M sessions / backlog */}
                  <div className="cyber-card border border-rose-500/30 rounded-xl overflow-hidden">
                    <div className="bg-rose-500/5 px-5 py-3 border-b border-rose-500/20 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span className="cyber-label text-[11px] text-rose-400">
                        {lang === 'uk' ? 'МАКРО-ГЕП: СПРАВЖНІЙ МАСШТАБ (НСЗУ верифіковано)' : 'MACRO GAP: TRUE SCALE (NSZU verified)'}
                      </span>
                    </div>
                    <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4 text-center">
                          <div className="text-[10px] text-rose-400 uppercase tracking-wider font-mono mb-2">
                            {lang === 'uk' ? 'Покриття потреби' : 'Demand coverage'}
                          </div>
                          <div className="text-5xl font-bold text-rose-400 font-mono">0.28%</div>
                          <div className="text-[10px] text-slate-500 mt-2">180,000 / 62,400,000 {lang === 'uk' ? 'сесій' : 'sessions'}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-3 text-center">
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'Дефіцит' : 'Gap'}</div>
                            <div className="text-xl font-bold text-cyber-cyan font-mono">62.2M</div>
                            <div className="text-[8px] text-slate-600">{lang === 'uk' ? 'сесій/рік' : 'sessions/yr'}</div>
                          </div>
                          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-center">
                            <div className="text-[9px] text-amber-400 uppercase tracking-wider font-mono mb-1">Blended Finance</div>
                            <div className="text-[13px] font-bold text-amber-400 font-mono leading-tight">$1.87B</div>
                            <div className="text-[8px] text-slate-600">62.2M × $30 · або 119 млрд грн</div>
                          </div>
                        </div>
                        <div className="bg-cyber-success/5 border border-cyber-success/20 rounded-lg p-3">
                          <div className="text-[9px] text-cyber-success uppercase tracking-wider font-mono mb-1">
                            {lang === 'uk' ? 'Ринкова вартість' : 'Market value'}
                          </div>
                          <div className="text-xl font-bold text-cyber-success font-mono">€2.5–4.1B</div>
                          <div className="text-[8px] text-slate-600">{lang === 'uk' ? '62.4M год × €40–65/год' : '62.4M hr × €40–65/hr'}</div>
                        </div>
                      </div>
                      <div className="lg:col-span-2">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-3">
                          {lang === 'uk' ? 'БЕКЛОГ: СКІЛЬКИ РОКІВ ДО ПОКРИТТЯ ПОТРЕБИ' : 'BACKLOG: YEARS TO CLEAR DEMAND'}
                        </div>
                        <ResponsiveContainer width="100%" height={200} minWidth={1}>
                          <BarChart data={BACKLOG_DATA(lang)} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 9, fill: '#64748b' }} unit=" р." />
                            <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${v} р.`]} />
                            <Legend wrapperStyle={{ fontSize: '9px', color: '#64748b', fontFamily: 'JetBrains Mono' }} />
                            <Bar dataKey="sustainable" name={lang === 'uk' ? 'Стійкий (1,500 год/рік)' : 'Sustainable (1,500h/yr)'} fill={COLORS.cyberAmber} radius={[3,3,0,0]} />
                            <Bar dataKey="theoretical" name={lang === 'uk' ? 'Теоретичний (2,000 год/рік)' : 'Theoretical (2,000h/yr)'} fill={COLORS.cyberCyan} radius={[3,3,0,0]} />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-3 bg-rose-500/5 border border-rose-500/20 rounded-lg p-3">
                          <p className="text-[10px] text-rose-400/80 leading-relaxed">
                            {lang === 'uk'
                              ? "Навіть при 19\u202f000 фахівців (макс + тінь) \u2014 беклог 1.6\u20132.2 роки. При 4\u202f000 офіційно зареєстрованих \u2014 7.8\u201310.4 роки. Тренінги не масштабуються без інфраструктури."
                              : "Even at 19,000 specialists (max incl. shadow) \u2014 backlog is 1.6\u20132.2 years. At 4,000 officially registered \u2014 7.8\u201310.4 years. Training doesn\u2019t scale without infrastructure."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Missing Middle */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Clinical missing middle */}
                    <div className="cyber-card border border-slate-700/50 rounded-xl overflow-hidden">
                      <div className="bg-slate-800/60 px-5 py-3 border-b border-slate-700/30 flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0">
                          <AlertOctagon className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                        <div>
                          <div className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">MISSING MIDDLE</div>
                          <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{lang === 'uk' ? 'КРИТИЧНИЙ ПРОБІЛ ДАНИХ' : 'CRITICAL DATA GAP'}</div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        {MISSING_MIDDLE(lang).clinical.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 bg-slate-800/40 border border-slate-700/20 rounded-lg p-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                            <div>
                              <div className="text-[11px] font-bold text-white">{item.label}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                            </div>
                          </div>
                        ))}
                        <div className="bg-slate-800/20 border border-slate-700/20 rounded-lg p-3 mt-3">
                          <p className="text-[10px] text-slate-500 leading-relaxed italic">{MISSING_MIDDLE(lang).clinical.desc}</p>
                        </div>
                      </div>
                    </div>
                    {/* Coordination missing middle */}
                    <div className="cyber-card border border-slate-700/50 rounded-xl overflow-hidden">
                      <div className="bg-slate-800/60 px-5 py-3 border-b border-slate-700/30 flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-700/60 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                        <div>
                          <div className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">{lang === 'uk' ? 'ЦИФРОВА КООРДИНАЦІЯ' : 'DIGITAL COORDINATION'}</div>
                          <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{lang === 'uk' ? 'ВІДСУТНЯ СЕРЕДИНА' : 'MISSING MIDDLE'}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[
                            { val: '450+', label: lang === 'uk' ? 'орг. у MHPSS TWG' : 'orgs in MHPSS TWG', color: '#F59E0B' },
                            { val: '2×/тиж', label: lang === 'uk' ? 'фізичних зустрічей' : 'physical meetings/wk', color: '#F59E0B' },
                            { val: '0', label: lang === 'uk' ? 'цифрових платформ' : 'digital platforms', color: '#FF4444' },
                            { val: '624K', label: lang === 'uk' ? 'сесій поза ЕСОЗ' : 'sessions outside ESOZ', color: '#FF4444' },
                          ].map((m) => (
                            <div key={m.label} className="bg-slate-800/40 border border-slate-700/20 rounded-lg p-3 text-center">
                              <div className="text-xl font-bold font-mono" style={{ color: m.color }}>{m.val}</div>
                              <div className="text-[9px] text-slate-500 mt-0.5 leading-tight">{m.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-slate-800/20 border border-slate-700/20 rounded-lg p-3">
                          <p className="text-[10px] text-slate-400 leading-relaxed">{MISSING_MIDDLE(lang).coordination.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Three-level infrastructure crisis */}
                  <div className="cyber-card border border-amber-500/30 rounded-xl overflow-hidden">
                    <div className="bg-amber-500/5 px-5 py-3 border-b border-amber-500/20 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="cyber-label text-[11px] text-amber-400">
                        {lang === 'uk' ? 'ТРИ РІВНІ КРИЗИ ІНФРАСТРУКТУРИ ДАНИХ' : 'THREE LEVELS OF DATA INFRASTRUCTURE CRISIS'}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {INFRA_LEVELS(lang).map((lvl, i) => (
                          <div key={i} className="rounded-xl p-4 border" style={{ borderColor: lvl.color + '30', backgroundColor: lvl.color + '08' }}>
                            <div className="text-[9px] uppercase tracking-wider font-mono mb-2" style={{ color: lvl.color + 'aa' }}>{lvl.label}</div>
                            <div className="text-lg font-bold font-mono mb-3" style={{ color: lvl.color }}>{lvl.status}</div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">{lvl.desc}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                        <p className="text-[11px] text-amber-400/80 leading-relaxed">
                          {lang === 'uk'
                            ? "Наслідок: $954M HEAL/THRIVE заблоковано. Держава оплачує сесії, які не може верифікувати. НГО звітують у несинхронізовані системи. Без Digital Bus \u2014 цей розрив неможливо закрити."
                            : "Result: $954M HEAL/THRIVE locked. State pays for sessions it cannot verify. NGOs report into unsynchronised systems. Without Digital Bus \u2014 this gap cannot be closed."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SHADOW */}
              {section.id === 'shadow' && (
                <div className="space-y-6">
                  {/* Structural Disproportions — multiplier chart */}
                  <div className="cyber-card border border-rose-500/20 rounded-xl overflow-hidden">
                    <div className="bg-rose-500/5 px-5 py-3 border-b border-rose-500/20 flex items-center gap-3">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span className="cyber-label text-[11px] text-rose-400 flex-1">
                        {lang === 'uk' ? 'СТРУКТУРНІ ДИСПРОПОРЦІЇ (×)' : 'STRUCTURAL DISPROPORTIONS (×)'}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {lang === 'uk' ? 'Множники — наскільки система далека від норми' : 'Multipliers — how far the system deviates from norm'}
                      </span>
                    </div>
                    <div className="p-4">
                      <ResponsiveContainer width="100%" height={200} minWidth={1}>
                        <BarChart
                          layout="vertical"
                          data={STRUCTURAL_DISP_DATA(lang)}
                          margin={{ left: 10, right: 80, top: 4, bottom: 4 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                          <XAxis
                            type="number"
                            domain={[0, 120]}
                            tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                            tickFormatter={(v) => `${v}×`}
                          />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={220}
                            tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }}
                          />
                          <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            contentStyle={{ background: '#0f1923', border: '1px solid #1e293b', borderRadius: 8, fontSize: 11 }}
                            formatter={(_value: number, _name: string, props: { payload?: { displayValue?: string; calc?: string } }) => {
                              const entry = props.payload;
                              return [entry?.displayValue ?? '', entry?.calc ?? ''];
                            }}
                            labelStyle={{ color: '#94a3b8', fontSize: 11 }}
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22}>
                            {STRUCTURAL_DISP_DATA(lang).map((entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            ))}
                            <LabelList
                              dataKey="displayValue"
                              position="right"
                              style={{ fill: '#e2e8f0', fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-2 bg-rose-500/5 border border-rose-500/20 rounded-lg px-4 py-2.5">
                        <p className="text-[10px] text-rose-300 leading-relaxed">
                          <span className="font-bold">⚡ {lang === 'uk' ? 'Висновок:' : 'Conclusion:'}</span>{' '}
                          {lang === 'uk'
                            ? 'Приватний ринок перевищує гуманітарний у 110 разів — тіньовий сектор реально фінансує систему. Дефіцит mhGAP: 3,571× нижче від очікуваного (150K сертифікатів → 42 практикуючих). Адмін. gap у 3.1× і бюджетна інверсія 5.0× (55.5% спеціалізованої → стаціонар, МОЗ 2025) — системні, не тимчасові. Жоден проєкт не вирішить ці множники без структурних змін в інфраструктурі.'
                            : 'Private market is 110× humanitarian — the shadow sector actually finances the system. mhGAP deficit: 3,571× below expected (150K certs → 42 practicing). Admin gap 3.1× and budget inversion 5.0× (55.5% of specialized → inpatient, MOH 2025) are systemic, not temporary. No project resolves these multipliers without structural infrastructure change.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={lang === 'uk' ? 'Рівні формалізації практики' : 'Practice Formalization Levels'}>
                      <ResponsiveContainer width="100%" height={300} minWidth={1}>
                         <BarChart layout="vertical" data={SHADOW_DATA(lang)} margin={{left:140}}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" unit="%" />
                            <YAxis type="category" dataKey="name" width={130} tick={{fontSize:11}} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                            <Bar dataKey="value" radius={[0,4,4,0]} barSize={24}>
                               {SHADOW_DATA(lang).map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                            </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                    </Card>
                    <Card title={lang === 'uk' ? 'Хронологія регулювання' : 'Regulatory Timeline'}>
                      <div className="relative pl-4 border-l-2 border-cyber-border/30 space-y-6 py-2">
                         {TIMELINE_ITEMS(lang).map((item, idx) => (
                           <div key={idx} className="relative">
                             <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-cyber-bg shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}44`}}></div>
                             <div className="text-[11px] font-bold font-mono" style={{color: item.color}}>{item.year}</div>
                             <div className="text-[11px] text-slate-400 mt-1 leading-relaxed font-mono">{item.text}</div>
                           </div>
                         ))}
                      </div>
                      <InsightBox type="neutral">
                        {lang === 'uk' ? 'ℹ Тіньова економіка України: 38.5% ВВП (2017). Конкретних досліджень тіньового сектору в ментальному здоров\'ї не знайдено.' : 'ℹ Ukraine shadow economy: 38.5% of GDP (2017). No specific studies on mental health shadow sector found.'}
                      </InsightBox>
                    </Card>
                  </div>

                  {/* NSZU Verified Snapshot — private/FOP vs shadow */}
                  <div className="cyber-card border border-cyan-500/20 rounded-xl overflow-hidden">
                    <div className="bg-cyan-500/5 px-5 py-3 border-b border-cyan-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="cyber-label text-[11px] text-cyan-400">
                          {lang === 'uk' ? 'РЕЄСТР НСЗУ — ВЕРИФІКОВАНІ ДАНІ ПОРТАЛУ' : 'NHSU REGISTRY — VERIFIED PORTAL DATA'}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">{lang === 'uk' ? 'Станом на' : 'As of'} {NSZU_SNAPSHOT.asOf}</span>
                    </div>
                    <div className="p-5 space-y-4">
                      {/* Three-column summary */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: lang === 'uk' ? 'Усього надавачів' : 'Total providers', value: NSZU_SNAPSHOT.totalProviders.toLocaleString(), sub: lang === 'uk' ? `${NSZU_SNAPSHOT.totalDoctors.toLocaleString()} лікарів` : `${NSZU_SNAPSHOT.totalDoctors.toLocaleString()} doctors`, color: '#94a3b8' },
                          { label: lang === 'uk' ? 'МЗ-спеціалізація' : 'MH specialization', value: NSZU_SNAPSHOT.mhProviders.toLocaleString(), sub: `${NSZU_SNAPSHOT.mhMnp.toLocaleString()} МНП · ${NSZU_SNAPSHOT.mhDoctors.toLocaleString()} ${lang === 'uk' ? 'лік.' : 'drs'}`, color: '#00F5FF' },
                          { label: lang === 'uk' ? 'Приватний + ФОП' : 'Private + FOP', value: NSZU_SNAPSHOT.privateFopProviders.toLocaleString(), sub: lang === 'uk' ? `${NSZU_SNAPSHOT.privateFopDoctors.toLocaleString()} лікарів` : `${NSZU_SNAPSHOT.privateFopDoctors.toLocaleString()} doctors`, color: '#F59E0B' },
                        ].map((item, i) => (
                          <div key={i} className="bg-slate-800/30 rounded-lg p-3 text-center">
                            <div className="text-[9px] text-slate-500 font-mono uppercase mb-1">{item.label}</div>
                            <div className="text-xl font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                            <div className="text-[9px] text-slate-500 font-mono mt-1">{item.sub}</div>
                          </div>
                        ))}
                      </div>

                      {/* Key insight: private/FOP MH specialists vs shadow */}
                      <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-4">
                        <div className="text-[10px] font-bold text-rose-300 mb-2 uppercase font-mono tracking-wider">
                          {lang === 'uk' ? '⚡ МЗ-фахівців у приватному/ФОП секторі НСЗУ:' : '⚡ MH specialists in private/FOP NHSU sector:'}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          {[
                            { role: lang === 'uk' ? 'Психіатр' : 'Psychiatrist', n: NSZU_SNAPSHOT.privateFopPsychiatrists },
                            { role: lang === 'uk' ? 'Психолог' : 'Psychologist', n: NSZU_SNAPSHOT.privateFopPsychologists },
                            { role: lang === 'uk' ? 'Псих. дитячий' : 'Child psychiatrist', n: NSZU_SNAPSHOT.privateFopChildPsych },
                            { role: lang === 'uk' ? 'Кліні. психолог' : 'Clinical psych.', n: NSZU_SNAPSHOT.privateFopClinicalPsych },
                          ].map((d, i) => (
                            <div key={i} className="bg-slate-800/50 rounded px-2 py-1.5 text-center">
                              <div className="text-[9px] text-slate-500 font-mono">{d.role}</div>
                              <div className="text-sm font-bold font-mono text-rose-300">{d.n}</div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-rose-300/80 leading-relaxed font-mono">
                          {lang === 'uk'
                            ? `Усього МЗ-фахівців у приватному/ФОП секторі НСЗУ: ~${NSZU_SNAPSHOT.privateFopPsychiatrists + NSZU_SNAPSHOT.privateFopPsychologists + NSZU_SNAPSHOT.privateFopChildPsych + NSZU_SNAPSHOT.privateFopClinicalPsych} — проти ~6,500 у тіньовому секторі (оцінка). Тобто на кожного приватного МЗ-фахівця в НСЗУ припадає ~100 тіньових. Вони лікують, заробляють, платять — але невидимі для системи ЕСОЗ/ТHRIVE.`
                            : `Total MH specialists in private/FOP NHSU sector: ~${NSZU_SNAPSHOT.privateFopPsychiatrists + NSZU_SNAPSHOT.privateFopPsychologists + NSZU_SNAPSHOT.privateFopChildPsych + NSZU_SNAPSHOT.privateFopClinicalPsych} — vs ~6,500 in the shadow sector (est.). That is ~100 shadow practitioners per formal private MH specialist in NHSU. They treat, earn, pay taxes — but are invisible to ESOZ/THRIVE.`}
                        </p>
                      </div>

                      {/* Doctor type distribution in MH-specialized providers */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: lang === 'uk' ? 'Психіатрів' : 'Psychiatrists', n: `~${(NSZU_SNAPSHOT.mhPsychiatrists/1000).toFixed(1)}K`, pct: Math.round(NSZU_SNAPSHOT.mhPsychiatrists / NSZU_SNAPSHOT.mhDoctors * 100), color: '#EF4444' },
                          { label: lang === 'uk' ? 'Кліні. психологів' : 'Clinical psychol.', n: `~${(NSZU_SNAPSHOT.mhClinicalPsych/1000).toFixed(1)}K`, pct: Math.round(NSZU_SNAPSHOT.mhClinicalPsych / NSZU_SNAPSHOT.mhDoctors * 100), color: '#8B5CF6' },
                          { label: lang === 'uk' ? 'Психологів' : 'Psychologists', n: `~${(NSZU_SNAPSHOT.mhPsychologists/1000).toFixed(1)}K`, pct: Math.round(NSZU_SNAPSHOT.mhPsychologists / NSZU_SNAPSHOT.mhDoctors * 100), color: '#00F5FF' },
                          { label: lang === 'uk' ? 'Наркологів' : 'Narcologists', n: `~${(NSZU_SNAPSHOT.mhNarcologists/1000).toFixed(1)}K`, pct: Math.round(NSZU_SNAPSHOT.mhNarcologists / NSZU_SNAPSHOT.mhDoctors * 100), color: '#F59E0B' },
                        ].map((d, i) => (
                          <div key={i} className="bg-slate-800/30 rounded-lg p-2">
                            <div className="text-[9px] text-slate-500 font-mono mb-1">{d.label}</div>
                            <div className="text-base font-bold font-mono" style={{ color: d.color }}>{d.n}</div>
                            <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${d.pct}%`, backgroundColor: d.color + '80' }} />
                            </div>
                            <div className="text-[8px] text-slate-600 font-mono mt-0.5">{d.pct}% {lang === 'uk' ? 'від МЗ' : 'of MH'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ECONOMIC / ROI */}
              {section.id === 'economic' && (
                 <div className="space-y-6">
                    {/* ROI Investment Case */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-4 h-4 text-cyber-cyan" />
                        <span className="cyber-label text-[11px] text-cyber-cyan">
                          {lang === 'uk' ? 'ДОВЕДЕНИЙ ROI: ВАРТІСТЬ БЕЗДІЯЛЬНОСТІ' : 'PROVEN ROI: COST OF INACTION'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {ROI_CARDS(lang).map((card, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.02, translateY: -3 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="cyber-card p-5 border-t-2 flex flex-col gap-3"
                            style={{ borderTopColor: card.color }}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{card.source}</span>
                              <span className="text-[10px] font-mono text-slate-600">{card.period}</span>
                            </div>
                            <div className="text-4xl font-bold font-mono" style={{ color: card.color }}>{card.roi}</div>
                            <p className="text-[11px] text-slate-400 leading-relaxed flex-1">{card.desc}</p>
                            <div className="text-[9px] text-slate-600 italic border-t border-cyber-border pt-2 font-mono">
                              {lang === 'uk' ? 'Методологія:' : 'Methodology:'} {card.methodology}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <InsightBox type="warning">
                        {lang === 'uk'
                          ? "При поточному розриві лікування 74% та клінічній потребі 3.5\u202fмлн осіб — незалікований тягар ПТСР та депресії еквівалентний ~$2\u202fмлрд щорічних втрат продуктивності (за моделлю World Bank $4/$ та середньому доходу). Цифрова інфраструктура з мультиплікатором ємності \u2014 найефективніша точка втручання."
                          : "With the current 74% treatment gap and 3.5M clinical need \u2014 untreated PTSD and depression burden equates to ~$2B annual productivity losses (World Bank $4/$ model, average income). Digital infrastructure with a capacity multiplier is the most cost-effective intervention point."}
                      </InsightBox>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card colSpan="full" title={lang === 'uk' ? 'Економічний тягар: індикатори' : 'Economic Burden: Indicators'}>
                          <div className="space-y-4">
                             {ECONOMIC_BURDEN_INDICATORS(lang).map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center border-b border-cyber-border/30 pb-3">
                                  <div>
                                     <div className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono">{item.name}</div>
                                     <div className="text-[10px] text-slate-500 italic font-mono mt-1">
                                        {lang === 'uk' ? 'Джерело:' : 'Source:'} {item.source} | {lang === 'uk' ? 'Період:' : 'Period:'} {item.period} | {lang === 'uk' ? 'Одиниці:' : 'Units:'} {item.units}
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <div className="text-[11px] font-bold text-rose-500 font-mono">{item.percent}%</div>
                                     <div className="text-lg font-bold text-cyber-cyan font-mono">{item.value}</div>
                                  </div>
                               </div>
                             ))}
                          </div>
                          <InsightBox type="neutral">
                             {lang === 'uk' ? 'ℹ Для України конкретне дослідження впливу на ВВП не проводилось — це пріоритетний дефіцит даних.' : 'ℹ No Ukraine-specific GDP impact study exists — this is a priority data gap.'}
                          </InsightBox>
                       </Card>
                    </div>
                 </div>
              )}

              {/* CHILDREN */}
              {section.id === 'children' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                   <Card title={lang === 'uk' ? 'ЮНІСЕФ: Охоплення дітей' : 'UNICEF: Children Reached'}>
                      <CustomBarChart data={CHILDREN_DATA(lang)} layout="horizontal" />
                   </Card>
                   <Card title={lang === 'uk' ? 'Ключові показники' : 'Key Indicators'}>
                      <div className="space-y-4">
                         {[
                           { label: lang === 'uk' ? 'Діти з проявами ПТСР' : 'Children showing PTSD', val: '1 / 5', color: COLORS.red },
                           { label: lang === 'uk' ? 'Порушення сну (13-15 років)' : 'Sleep issues (13-15y)', val: '50%', color: COLORS.orange },
                           { label: lang === 'uk' ? 'Центри Spilno' : 'Spilno Centers', val: '200+', color: COLORS.blue },
                           { label: lang === 'uk' ? 'Відвідувань (2023)' : 'Visits (2023)', val: '2.5M', color: COLORS.teal }
                         ].map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center py-3 border-b border-cyber-border/30">
                              <span className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">{item.label}</span>
                              <span className="text-lg font-bold" style={{color: item.color}}>{item.val}</span>
                           </div>
                         ))}
                      </div>
                      <InsightBox type="positive">
                         {lang === 'uk' ? '✓ 200+ центрів Spilno по всій Україні: 2.5 млн відвідувань у 2023 р.' : '✓ 200+ Spilno centers across Ukraine: 2.5M visits in 2023'}
                      </InsightBox>
                   </Card>
                </div>
              )}

              {/* INPUTS VS OUTCOMES */}
              {section.id === 'inputs' && (
                 <div className="space-y-8">
                    {/* Funnel */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card title="mhGAP Funnel" subtitle={lang === 'uk' ? 'Від сертифіката до практики' : 'From Certificate to Practice'}>
                          <ResponsiveContainer width="100%" height={300} minWidth={1}>
                             <BarChart layout="vertical" data={MHGAP_FUNNEL_DATA(lang)} margin={{left: 140, right: 40}}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" scale="log" domain={[10, 100000]} tick={{fontSize: 11}} />
                                <YAxis type="category" dataKey="name" width={130} tick={{fontSize: 11}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                                <Bar dataKey="value" radius={[0,4,4,0]} barSize={24}>
                                   <LabelList dataKey="value" position="right" style={{ fontSize: '10px', fill: '#64748b' }} />
                                   {MHGAP_FUNNEL_DATA(lang).map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                                </Bar>
                             </BarChart>
                          </ResponsiveContainer>
                          <InsightBox type="neutral">
                             {lang === 'uk'
                               ? '\u0417 150\u202f000 \u0441\u0435\u0440\u0442\u0438\u0444\u0456\u043a\u0430\u0442\u0456\u0432 \u043b\u0438\u0448\u0435 ~1\u202f000 \u0437\u0430\u043a\u043b\u0430\u0434\u0456\u0432 \u0440\u0435\u0430\u043b\u044c\u043d\u043e \u0432\u043f\u0440\u043e\u0432\u0430\u0434\u0438\u043b\u0438 \u043f\u0430\u043a\u0435\u0442 \u041d\u0421\u0417\u0423 (\u043f\u0441\u0438\u0445\u043e\u043b\u043e\u0433\u0456\u0447\u043d\u0430 \u0434\u043e\u043f\u043e\u043c\u043e\u0433\u0430). 3\u202f346 \u0437\u0430\u043a\u043b\u0430\u0434\u0456\u0432 HeRAMS \u2014 \u0446\u0435 \u0432\u0441\u0456 \u0437\u0430\u043a\u043b\u0430\u0434\u0438, \u0449\u043e \u0437\u0432\u0456\u0442\u0443\u044e\u0442\u044c, \u0430 \u043d\u0435 \u0442\u0456, \u0449\u043e \u0432\u043f\u0440\u043e\u0432\u0430\u0434\u0438\u043b\u0438 \u043f\u0441\u0438\u0445\u043e\u043b\u043e\u0433\u0456\u0447\u043d\u0438\u0439 \u043f\u0430\u043a\u0435\u0442.'
                               : 'Of 150,000 certificates only ~1,000 facilities actually implemented the NHSU psychological help package. The 3,346 HeRAMS figure = all reporting facilities, not those with the MH package specifically.'}
                          </InsightBox>
                       </Card>
                       <Card title={lang === 'uk' ? '«Навчені фахівці»: реальність' : "'Trained Professionals': Reality"}>
                          <ResponsiveContainer width="100%" height={300} minWidth={1}>
                             <BarChart data={TRAINED_REALITY_DATA(lang)} layout="vertical" margin={{left:100}}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{fontSize:10}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius:8}} />
                                <Legend wrapperStyle={{fontSize:11}} />
                                <Bar dataKey="awareness" name="Awareness" stackId="a" fill={COLORS.orangeLight} />
                                <Bar dataKey="psychosocial" name="Psychosocial" stackId="a" fill={COLORS.blueLight} />
                                <Bar dataKey="clinical" name="Clinical" stackId="a" fill={COLORS.green} />
                             </BarChart>
                          </ResponsiveContainer>
                          <InsightBox type="critical">
                             {lang === 'uk' ? '⚠ Більшість навчені в педагогічних закладах, а не на медичних факультетах.' : '⚠ Most trained in pedagogical institutions, not medical faculties.'}
                          </InsightBox>
                       </Card>
                    </div>

                    {/* Admin Burden & Coord */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <Card title={lang === 'uk' ? 'Адміністративний тягар' : 'Administrative Burden'}>
                          <div className="space-y-4">
                             {ADMIN_BURDEN(lang).map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-start border-b border-cyber-border/30 pb-3">
                                   <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest shrink-0 mt-1 font-mono ${
                                      item.color === 'red' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                                      item.color === 'orange' ? 'bg-cyber-amber/20 text-cyber-amber border border-cyber-amber/30' : 'bg-cyber-border/20 text-slate-400 border border-cyber-border/30'
                                   }`}>
                                      {item.severity}
                                   </span>
                                   <div>
                                      <div className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">{item.title}</div>
                                      <div className="text-[10px] text-slate-500 mt-1 leading-relaxed font-mono">{item.desc}</div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </Card>
                       <Card title={lang === 'uk' ? 'Координація & Health Cluster' : 'Coordination & Health Cluster'}>
                          <div className="mb-6 h-40">
                             <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                                <BarChart data={CLUSTER_DATA(lang)}>
                                   <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                   <XAxis dataKey="name" tick={{fontSize:11}} />
                                   <YAxis />
                                   <Tooltip cursor={{fill: 'transparent'}} />
                                   <Legend wrapperStyle={{fontSize:10}} />
                                   <Bar dataKey="req" name="Requested ($M)" fill={COLORS.blueLight} />
                                   <Bar dataKey="rec" name="Received ($M)" fill={COLORS.green} />
                                   <Bar dataKey="mh" name="MHPSS Split" fill={COLORS.red} />
                                </BarChart>
                             </ResponsiveContainer>
                          </div>
                          <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
                             {COORD_ITEMS(lang).map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-start pb-3 border-b border-cyber-border/10">
                                   <span className="text-[9px] font-bold text-cyber-cyan bg-cyber-cyan/10 px-1.5 py-0.5 rounded border border-cyber-cyan/20 uppercase mt-0.5 shrink-0 font-mono tracking-tighter">{item.status}</span>
                                   <div>
                                      <div className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">{item.title}</div>
                                      <div className="text-[10px] text-slate-500 leading-snug font-mono">{item.desc}</div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </Card>
                    </div>

                    {/* Final Critical Table */}
                    <Card colSpan="full" title="Inputs vs Outcomes" subtitle={lang === 'uk' ? 'Що вимірюється — і що ні' : 'What Is Measured — And What Is Not'}>
                       <div className="mb-4 flex justify-end">
                          <select 
                            className="bg-cyber-surface border border-cyber-border hover:border-cyber-amber text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyber-amber transition-all cursor-pointer font-mono"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">{lang === 'uk' ? 'Всі статуси' : 'All Statuses'}</option>
                            <option value="red">{lang === 'uk' ? 'Критичні / Не вимірюється' : 'Critical / Not Measured'}</option>
                            <option value="orange">{lang === 'uk' ? 'Оцінка' : 'Estimate'}</option>
                          </select>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[600px]">
                             <thead className="text-[10px] text-slate-500 uppercase bg-cyber-border/10 font-mono tracking-widest">
                                <tr>
                                   <th className="px-4 py-4 border-b border-cyber-border/30 cursor-pointer hover:text-cyber-cyan transition-colors" onClick={() => handleSort('input')}>
                                     <div className="flex items-center gap-1">
                                       {lang === 'uk' ? 'ДІЯ / ВХІДНІ ДАНІ' : 'ACTION / INPUT'}
                                       {sortConfig?.key === 'input' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                     </div>
                                   </th>
                                   <th className="px-4 py-4 border-b border-cyber-border/30 cursor-pointer hover:text-cyber-cyan transition-colors" onClick={() => handleSort('val')}>
                                     <div className="flex items-center gap-1">
                                       {lang === 'uk' ? 'ОБСЯГ' : 'VOLUME'}
                                       {sortConfig?.key === 'val' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                     </div>
                                   </th>
                                   <th className="px-4 py-4 border-b border-cyber-border/30 cursor-pointer hover:text-cyber-cyan transition-colors" onClick={() => handleSort('status')}>
                                     <div className="flex items-center gap-1">
                                       {lang === 'uk' ? 'РЕЗУЛЬТАТ' : 'OUTCOME'}
                                       {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                     </div>
                                   </th>
                                   <th className="px-4 py-4 border-b border-cyber-border/30 cursor-pointer hover:text-cyber-cyan transition-colors" onClick={() => handleSort('out')}>
                                     <div className="flex items-center gap-1">
                                       {lang === 'uk' ? 'ПИТАННЯ' : 'QUESTION'}
                                       {sortConfig?.key === 'out' && (sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                                     </div>
                                   </th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-cyber-border/10">
                                {processedInputsOutcomes.map((row, idx) => (
                                   <tr key={idx} className="hover:bg-cyber-cyan/5 transition-colors group/row">
                                      <td className="px-4 py-4 font-bold text-white font-mono">{row.input}</td>
                                      <td className="px-4 py-4 text-cyber-cyan font-mono">{row.val}</td>
                                      <td className={`px-4 py-4 font-bold text-[10px] font-mono tracking-wider ${row.statusColor === 'red' ? 'text-rose-500' : 'text-cyber-amber'}`}>
                                         <div className="flex items-center gap-1">
                                           {row.status}
                                           {row.tooltip && (
                                             <div className="relative flex items-center group/tooltip">
                                               <Info className="w-3 h-3 text-slate-400 cursor-help" />
                                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 normal-case tracking-normal font-sans shadow-xl border border-slate-700">
                                                 {row.tooltip}
                                               </div>
                                             </div>
                                           )}
                                         </div>
                                      </td>
                                      <td className="px-4 py-4 text-slate-500 text-[10px] italic font-mono">{row.out}</td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </Card>
                 </div>
              )}

                </div>{/* end mt-8 */}
                </motion.div>
                )}
                </AnimatePresence>

            </motion.div>
          ))}
        </AnimatePresence>
        </div>

        {/* ── BANKER CTA ─────────────────────────────────────── */}
        <div className="mt-20 mb-0 rounded-2xl overflow-hidden border border-cyber-amber/40 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-amber/5 via-transparent to-cyber-cyan/5 pointer-events-none" />
          <div className="relative px-8 py-12 text-center">
            <div className="inline-flex items-center gap-2 bg-cyber-amber/10 border border-cyber-amber/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-amber animate-pulse" />
              <span className="text-[10px] font-mono text-cyber-amber uppercase tracking-widest">
                {lang === 'uk' ? 'Інвестиційна можливість · Q2 2026' : 'Investment Opportunity · Q2 2026'}
              </span>
            </div>
            <h2 className="text-[26px] md:text-[34px] font-bold text-white font-mono leading-tight mb-4 tracking-tight">
              {lang === 'uk' ? '$954M заблоковано.' : '$954M locked.'}<br />
              <span className="text-cyber-amber">{lang === 'uk' ? '0.28% покриття клінічної потреби.' : '0.28% of clinical demand covered.'}</span><br />
              <span className="text-cyber-cyan">{lang === 'uk' ? 'FEEL Again \u2014 єдиний middleware-ключ.' : 'FEEL Again \u2014 the only middleware key.'}</span>
            </h2>
            <p className="text-[13px] text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              {lang === 'uk'
                ? 'Цифровий middleware між 118 мобільними командами та державними реєстрами (ЕСОЗ, ТРЕМБІТА). Єдина точка доступу до $41.1M невикористаного бюджетного простору HEAL Component 4. Механізм входу: МОЗ / RFQ / Direct Selection.'
                : 'Digital middleware bridging 118 mobile MH teams to state registries (ESOZ, Trembita). The only access route to $41.1M unused HEAL Component 4 budget space. Entry mechanism: MoH / RFQ / Direct Selection.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <a
                href="mailto:hello@feelagain.com.ua?subject=Partnership%20%E2%80%94%20MHPSS%20Dashboard"
                className="inline-flex items-center gap-2 bg-cyber-amber text-cyber-bg px-8 py-3.5 rounded-xl font-bold text-[13px] hover:bg-white transition-all shadow-lg uppercase tracking-widest font-mono"
              >
                <CalendarDays className="w-4 h-4" /> {lang === 'uk' ? 'Запланувати демо' : 'Schedule a Demo'}
              </a>
              <a
                href="mailto:hello@feelagain.com.ua?subject=Investment%20Deck%20Request%20%E2%80%94%20MHPSS"
                className="inline-flex items-center gap-2 border border-cyber-cyan/50 text-cyber-cyan px-8 py-3.5 rounded-xl font-bold text-[13px] hover:bg-cyber-cyan/10 transition-all uppercase tracking-widest font-mono"
              >
                <Download className="w-4 h-4" /> {lang === 'uk' ? 'Отримати Deck' : 'Get Deck'}
              </a>
              <a
                href="https://feelagain.com.ua"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-slate-700 text-slate-400 px-8 py-3.5 rounded-xl font-bold text-[13px] hover:border-slate-500 hover:text-white transition-all uppercase tracking-widest font-mono"
              >
                <Globe className="w-4 h-4" /> {lang === 'uk' ? 'Сайт' : 'Website'}
              </a>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              {[
                { val: '$41.1M', label: lang === 'uk' ? 'HEAL C4 бюджет' : 'HEAL C4 budget space', color: '#00FF66' },
                { val: '4:1', label: lang === 'uk' ? 'ROI (World Bank)' : 'ROI (World Bank)', color: '#F59E0B' },
                { val: '\u20ac2.5B+', label: lang === 'uk' ? 'Ринок (62.4M сесій)' : 'Market (62.4M sessions)', color: '#00F5FF' },
              ].map((m) => (
                <div key={m.label} className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold font-mono" style={{ color: m.color }}>{m.val}</div>
                  <div className="text-[9px] text-slate-500 mt-1 font-mono uppercase tracking-wider leading-tight">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Missing Data — Future Sections */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-4 h-4 text-slate-500" />
            <span className="cyber-label text-[11px] text-slate-400 uppercase tracking-widest">
              {lang === 'uk' ? 'ДАНІ, ЯКИХ НЕ ВИСТАЧАЄ — МАЙБУТНІ РОЗДІЛИ' : 'MISSING DATA — FUTURE SECTIONS'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MISSING_DATA(lang).map((item, i) => (
              <div key={i} className="bg-cyber-surface border border-slate-700/40 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-2.5 right-2.5 text-[8px] font-mono text-slate-600 border border-slate-700/50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  COMING SOON
                </div>
                <div className="text-[11px] font-bold text-slate-300 pr-20 leading-tight">{item.title}</div>
                <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                <div className="text-[9px] font-mono text-cyber-amber/60 border-t border-slate-700/30 pt-1.5 mt-auto">
                  {lang === 'uk' ? 'Рандах:' : 'Roadmap:'} {item.roadmap}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email CTA #2 — Dashboard Updates */}
        <div className="mb-12 rounded-xl border border-cyber-cyan/20 bg-cyber-cyan/3 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-[11px] font-mono font-bold text-cyber-cyan uppercase tracking-widest mb-1">
              {lang === 'uk' ? 'ОНОВЛЕННЯ ДАШБОРДУ' : 'DASHBOARD UPDATES'}
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'uk'
                ? 'Залишіть email — надсилатимемо оновлення даних і нові версії аналізу'
                : 'Leave your email — we\'ll send data updates and new analysis versions'}
            </p>
          </div>
          {submittedBottom ? (
            <div className="flex items-center gap-2 text-cyber-success text-[11px] font-mono font-bold">
              <Check className="w-4 h-4" /> {lang === 'uk' ? 'Підписано!' : 'Subscribed!'}
            </div>
          ) : (
            <form className="flex gap-2 w-full sm:w-auto" onSubmit={e => { e.preventDefault(); if (emailBottom) setSubmittedBottom(true); }}>
              <input
                type="email"
                required
                value={emailBottom}
                onChange={e => setEmailBottom(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 sm:w-56 bg-cyber-surface border border-cyber-border rounded-lg px-3 py-2 text-[11px] font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/60 transition-colors"
              />
              <button type="submit" className="bg-cyber-cyan text-cyber-bg px-4 py-2 rounded-lg text-[11px] font-mono font-bold hover:bg-white transition-colors uppercase tracking-wider flex-shrink-0">
                {lang === 'uk' ? 'Підписатись' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-cyber-border pt-12 pb-16">
           {/* Feel Again Solution — IS / IS NOT */}
           <div className="mb-12 cyber-card border border-cyber-cyan/30 rounded-2xl overflow-hidden">
             <div className="bg-cyber-cyan/5 px-6 py-4 border-b border-cyber-cyan/20 flex items-center gap-4">
               <CircleDot className="w-4 h-4 text-cyber-cyan" />
               <span className="cyber-label text-[11px] text-cyber-cyan">
                 {lang === 'uk' ? 'FEEL AGAIN — ЦИФРОВА ІНФРАСТРУКТУРА ДЛЯ MHPSS' : 'FEEL AGAIN — DIGITAL INFRASTRUCTURE FOR MHPSS'}
               </span>
               <span className="ml-auto text-[9px] font-mono text-slate-600 border border-slate-700 px-2 py-0.5 rounded">FA-2026-UA</span>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-3">
                 <div className="text-[10px] text-cyber-cyan uppercase tracking-wider font-mono border-b border-cyber-cyan/20 pb-2">
                   {lang === 'uk' ? 'ЦЕ Є:' : 'THIS IS:'}
                 </div>
                 <p className="text-[12px] text-slate-300 leading-relaxed">{FEEL_AGAIN_POSITION(lang).is}</p>
               </div>
               <div className="space-y-3">
                 <div className="text-[10px] text-rose-400 uppercase tracking-wider font-mono border-b border-rose-500/20 pb-2">
                   {lang === 'uk' ? 'ЦЕ НЕ Є:' : 'THIS IS NOT:'}
                 </div>
                 <p className="text-[12px] text-slate-400 leading-relaxed italic">{FEEL_AGAIN_POSITION(lang).isNot}</p>
               </div>
               <div className="space-y-3">
                 <div className="bg-cyber-success/5 border border-cyber-success/20 rounded-xl p-4 text-center">
                   <div className="text-[9px] text-cyber-success uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'Вартість для держави' : 'Cost to state'}</div>
                   <div className="text-4xl font-bold text-cyber-success font-mono">{FEEL_AGAIN_POSITION(lang).costToState}</div>
                   <div className="text-[9px] text-slate-500 mt-1">{FEEL_AGAIN_POSITION(lang).costNote}</div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-rose-400 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'Втрати ВВП' : 'GDP loss'}</div>
                     <div className="text-base font-bold text-rose-400 font-mono">{FEEL_AGAIN_POSITION(lang).gdpLoss}</div>
                     <div className="text-[8px] text-slate-600">{lang === 'uk' ? 'щорічно' : 'annually'}</div>
                   </div>
                   <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-amber-400 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'Заблоковано' : 'Locked'}</div>
                     <div className="text-base font-bold text-amber-400 font-mono">{FEEL_AGAIN_POSITION(lang).lockedFunds}</div>
                     <div className="text-[8px] text-slate-600">HEAL/THRIVE</div>
                   </div>
                 </div>
               </div>
             </div>

             {/* 6-layer architecture + HEAL Ukraine entry point */}
             <div className="border-t border-cyber-cyan/10 px-6 pb-6 pt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* 6-layer architecture: reverse waterfall */}
               <div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                   {lang === 'uk' ? '6 ШАРІВ ІНФРАСТРУКТУРИ' : '6 INFRASTRUCTURE LAYERS'}
                 </div>
                 <div className="text-[9px] text-slate-600 font-mono mb-3">6 {lang === 'uk' ? 'розривів' : 'gaps'} → 6 {lang === 'uk' ? 'шарів' : 'layers'}</div>
                 <div className="space-y-1">
                   {FEEL_AGAIN_ARCHITECTURE(lang).map((layer, i) => (
                     <div
                       key={layer.num}
                       className="flex items-center gap-3 rounded-lg px-3 py-2.5 border border-slate-700/30 transition-all"
                       style={{
                         marginLeft: `${i * 6}px`,
                         backgroundColor: `rgba(245,158,11,${0.03 + i * 0.01})`,
                         borderLeftColor: `rgba(245,158,11,${1 - i * 0.12})`,
                         borderLeftWidth: '3px',
                       }}
                     >
                       <span className="text-[10px] font-bold font-mono flex-shrink-0" style={{ color: `rgba(245,158,11,${1 - i * 0.12})` }}>#{layer.num}</span>
                       <span className="text-[11px] text-white font-semibold flex-1">{layer.flow}</span>
                       <span className="text-[9px] text-slate-400 font-mono text-right flex-shrink-0">{layer.tool}</span>
                     </div>
                   ))}
                 </div>
                 <div className="mt-3 bg-slate-800/30 border border-slate-700/20 rounded-lg p-3">
                   <p className="text-[9px] text-slate-400 leading-relaxed">
                     <strong className="text-cyber-amber">
                       {lang === 'uk' ? 'Вимір ВВП:' : 'GDP measure:'}
                     </strong>{' '}
                     {lang === 'uk'
                       ? 'Кожен шар генерує дані для оцінки впливу на людський капітал (~$8B/рік втрат, OECD). НБУ/НСЗУ індекс ментального добробуту.'
                       : 'Each layer generates data for human capital impact assessment (~$8B/yr losses, OECD). NBU/NHSU mental wellbeing index.'}
                   </p>
                 </div>
               </div>
               {/* HEAL ISR #6 full KPI table */}
               <div>
                 <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">
                   {lang === 'uk' ? 'HEAL P180245 — ISR #6 (WB, 25.03.2026)' : 'HEAL P180245 — ISR #6 (WB, 25.03.2026)'}
                 </div>
                 <div className="text-[9px] text-slate-600 font-mono mb-3">{lang === 'uk' ? 'Конверт: $160M PBC + $340M інвестиції' : 'Envelope: $160M PBC + $340M investment'}</div>
                 <div className="space-y-1">
                   {HEAL_UKRAINE(lang).kpis.map((kpi, i) => (
                     <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 border text-[10px] ${kpi.status === 'critical' ? 'bg-rose-500/5 border-rose-500/30' : 'bg-slate-800/30 border-slate-700/20'}`}>
                       <span className={`flex-1 mr-2 ${kpi.status === 'critical' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>{kpi.name}</span>
                       <div className="flex items-center gap-2 text-right flex-shrink-0">
                         <span className="font-mono font-bold text-[11px]" style={{ color: kpi.status === 'critical' ? '#FF4444' : kpi.pct >= 100 ? '#00FF66' : '#F59E0B' }}>
                           {kpi.actual.toLocaleString()}
                         </span>
                         <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded min-w-[36px] text-center ${kpi.status === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-cyber-success/10 text-cyber-success'}`}>
                           {kpi.pct}%
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="mt-2 bg-rose-500/5 border border-rose-500/20 rounded-lg p-2.5">
                   <p className="text-[9px] text-rose-300 leading-relaxed font-mono">⚠ 0/400 {lang === 'uk' ? 'заклади переоблаштовано (0%)' : 'facilities reconfigured (0%)'} — {lang === 'uk' ? 'критичний індикатор. Дані 624K МЗ-сесій зібрані поза ЕСОЗ.' : 'critical indicator. 624K MH sessions collected outside ESOZ.'}</p>
                 </div>
                 <div className="mt-2 bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/20">
                   <p className="text-[9px] text-slate-500 leading-relaxed">{HEAL_UKRAINE(lang).restructuring}</p>
                 </div>
               </div>
             </div>
           </div>

           {/* Architectural Flow: CommCare → FEEL Again → ESOZ */}
           <div className="mb-12 cyber-card border border-cyber-cyan/30 rounded-2xl overflow-hidden">
             <div className="bg-cyber-cyan/5 px-6 py-4 border-b border-cyber-cyan/20 flex items-center gap-4">
               <Zap className="w-4 h-4 text-cyber-cyan" />
               <span className="cyber-label text-[11px] text-cyber-cyan">
                 {lang === 'uk' ? 'АРХІТЕКТУРНИЙ ПОТІК: CommCare \u2192 FEEL Again \u2192 ЕСОЗ' : 'ARCHITECTURE FLOW: CommCare \u2192 FEEL Again \u2192 ESOZ'}
               </span>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
               {/* Humanitarian Zone */}
               <div className="border border-rose-500/30 rounded-xl p-4 bg-rose-500/5">
                 <div className="text-[9px] font-mono text-rose-400 uppercase tracking-wider mb-3 border-b border-rose-500/20 pb-2">
                   {ARCH_FLOW(lang).humanitarian.label}
                 </div>
                 <div className="space-y-1.5 mb-3">
                   {ARCH_FLOW(lang).humanitarian.sources.map((src) => (
                     <div key={src} className="text-[11px] text-slate-300 bg-slate-800/60 rounded-lg px-3 py-1.5 border border-slate-700/40">{src}</div>
                   ))}
                 </div>
                 <div className="space-y-1">
                   {ARCH_FLOW(lang).humanitarian.highlights.map((h) => (
                     <div key={h} className="text-[10px] text-rose-300 border border-rose-500/30 rounded-lg px-3 py-1.5 bg-rose-500/10 font-mono">{h}</div>
                   ))}
                 </div>
               </div>
               {/* FEEL Again Middleware */}
               <div className="border-2 border-cyber-amber/50 rounded-xl p-4 bg-cyber-amber/5 flex flex-col">
                 <div className="text-[11px] font-bold text-cyber-amber text-center mb-1">FEEL Again</div>
                 <div className="text-[9px] text-cyber-amber/60 text-center uppercase tracking-wider mb-3">MIDDLEWARE</div>
                 <div className="text-[9px] text-slate-500 text-center uppercase tracking-wider mb-3 border-b border-cyber-amber/20 pb-2">Universal Adapter</div>
                 <div className="space-y-1.5 flex-1">
                   {ARCH_FLOW(lang).middleware.components.map((c) => (
                     <div key={c} className="text-[10px] text-slate-300 bg-slate-800/60 rounded px-2.5 py-1.5 border border-slate-700/40">{c}</div>
                   ))}
                 </div>
               </div>
               {/* State Zone */}
               <div className="border border-cyber-success/30 rounded-xl p-4 bg-cyber-success/5">
                 <div className="text-[9px] font-mono text-cyber-success uppercase tracking-wider mb-3 border-b border-cyber-success/20 pb-2">
                   {ARCH_FLOW(lang).state.label}
                 </div>
                 <div className="space-y-2">
                   {ARCH_FLOW(lang).state.systems.map((sys) => (
                     <div key={sys.name} className="rounded-lg px-3 py-2 border border-slate-700/40 bg-slate-800/40 flex items-center justify-between">
                       <span className="text-[11px] font-bold" style={{ color: sys.color }}>{sys.name}</span>
                       {sys.sub && <span className="text-[9px] text-slate-500 font-mono">{sys.sub}</span>}
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </div>

           {/* THRIVE + Component 4 Procurement */}
           <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* THRIVE PforR */}
             <div className="cyber-card border border-amber-500/30 rounded-2xl overflow-hidden">
               <div className="bg-amber-500/5 px-6 py-4 border-b border-amber-500/20 flex items-center gap-4">
                 <Lock className="w-4 h-4 text-cyber-amber" />
                 <span className="cyber-label text-[11px] text-cyber-amber">THRIVE (P505616) — PforR $454M</span>
                 <span className="ml-auto text-[9px] font-mono text-slate-600 border border-slate-700 px-2 py-0.5 rounded">DLI-based</span>
               </div>
               <div className="p-5 space-y-4">
                 <div className="grid grid-cols-3 gap-3">
                   <div className="bg-cyber-success/5 border border-cyber-success/20 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-cyber-success uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'Дисбурсовано' : 'Disbursed'}</div>
                     <div className="text-lg font-bold text-cyber-success font-mono">{THRIVE_PROJECT(lang).disbursed}</div>
                     <div className="text-[8px] text-slate-600">{THRIVE_PROJECT(lang).disbursedPct}%</div>
                   </div>
                   <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-slate-500 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'Загалом' : 'Total'}</div>
                     <div className="text-lg font-bold text-cyber-amber font-mono">{THRIVE_PROJECT(lang).total}</div>
                   </div>
                   <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-slate-500 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'Підписано' : 'Signed'}</div>
                     <div className="text-sm font-bold text-slate-300 font-mono">{THRIVE_PROJECT(lang).signed}</div>
                   </div>
                 </div>
                 <div className="bg-slate-800/30 rounded-lg p-3">
                   <p className="text-[11px] text-slate-400 leading-relaxed">{THRIVE_PROJECT(lang).detail}</p>
                 </div>
                 <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-3">
                   <div className="text-[8px] text-rose-400 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'КРИТИЧНА ДЕТАЛЬ' : 'CRITICAL DETAIL'}</div>
                   <p className="text-[11px] text-rose-300 leading-relaxed">{THRIVE_PROJECT(lang).critical}</p>
                 </div>
                 <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                   <div className="text-[8px] text-amber-400 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'АВАНСОВІ ВИПЛАТИ' : 'ADVANCE DISBURSEMENT'}</div>
                   <p className="text-[10px] text-amber-300/80 leading-relaxed">{THRIVE_PROJECT(lang).advance}</p>
                 </div>
               </div>
             </div>
             {/* HEAL Component 4 Procurement Gap */}
             <div className="cyber-card border border-cyber-success/30 rounded-2xl overflow-hidden">
               <div className="bg-cyber-success/5 px-6 py-4 border-b border-cyber-success/20 flex items-center gap-4">
                 <Database className="w-4 h-4 text-cyber-success" />
                 <span className="cyber-label text-[11px] text-cyber-success">HEAL Component 4 — $50M Procurement</span>
               </div>
               <div className="p-5 space-y-4">
                 <div className="grid grid-cols-2 gap-3 mb-2">
                   <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-slate-500 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'Закуплено' : 'Procured'}</div>
                     <div className="text-lg font-bold text-cyber-amber font-mono">{HEAL_C4_PROCUREMENT(lang).procured}</div>
                   </div>
                   <div className="bg-cyber-success/5 border border-cyber-success/30 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-cyber-success uppercase tracking-wider font-mono mb-1">AVAILABLE BUDGET SPACE</div>
                     <div className="text-lg font-bold text-cyber-success font-mono">{HEAL_C4_PROCUREMENT(lang).unallocated}</div>
                   </div>
                 </div>
                 <div className="space-y-1">
                   {HEAL_C4_PROCUREMENT(lang).categories.map((cat) => (
                     <div key={cat.name} className="flex items-center justify-between text-[10px] px-2.5 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/20">
                       <span className="text-slate-400 flex-1 mr-2">{cat.name}</span>
                       <span className="text-slate-300 font-mono flex-shrink-0">${cat.amountK}K</span>
                     </div>
                   ))}
                 </div>
                 <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                   <p className="text-[10px] text-amber-400/80 leading-relaxed">{HEAL_C4_PROCUREMENT(lang).note}</p>
                 </div>
                 <div className="bg-slate-800/30 rounded-lg p-3">
                   <div className="text-[8px] text-slate-500 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'МЕХАНІЗМ ДОСТУПУ' : 'ACCESS MECHANISM'}</div>
                   <p className="text-[10px] text-slate-300 leading-relaxed">{HEAL_C4_PROCUREMENT(lang).accessMechanism}</p>
                 </div>
               </div>
             </div>
           </div>

           {/* Risks & Counter-arguments */}
           <div className="mb-12 cyber-card border border-slate-700/50 rounded-2xl overflow-hidden">
             <div className="bg-slate-800/40 px-6 py-4 border-b border-slate-700/30 flex items-center gap-4">
               <AlertTriangle className="w-4 h-4 text-cyber-amber" />
               <span className="cyber-label text-[11px] text-cyber-amber">
                 {lang === 'uk' ? 'РИЗИКИ ТА КОНТРАРГУМЕНТИ' : 'RISKS & COUNTER-ARGUMENTS'}
               </span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b border-slate-700/30">
                     <th className="text-left px-5 py-3 text-[10px] font-mono text-cyber-amber uppercase tracking-wider w-1/3">{lang === 'uk' ? 'Контраргумент' : 'Objection'}</th>
                     <th className="text-left px-5 py-3 text-[10px] font-mono text-cyber-amber uppercase tracking-wider">{lang === 'uk' ? 'Відповідь' : 'Response'}</th>
                     <th className="text-right px-5 py-3 text-[10px] font-mono text-cyber-amber uppercase tracking-wider w-20">Risk</th>
                   </tr>
                 </thead>
                 <tbody>
                   {COUNTERARGUMENTS(lang).map((row, i) => (
                     <tr key={i} className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors">
                       <td className="px-5 py-3 text-[11px] text-slate-300 italic">{row.objection}</td>
                       <td className="px-5 py-3 text-[11px] text-slate-400 leading-relaxed">{row.response}</td>
                       <td className="px-5 py-3 text-right">
                         <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${row.risk === 'High' ? 'text-rose-400 bg-rose-500/10' : row.risk === 'Medium' ? 'text-amber-400 bg-amber-500/10' : 'text-cyber-success bg-cyber-success/10'}`}>
                           {row.risk}
                         </span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           {/* Dual-Project Narrative: Corrected HEAL × THRIVE */}
           <div className="mb-12 border border-cyber-amber/30 rounded-2xl overflow-hidden bg-cyber-amber/3">
             <div className="bg-cyber-amber/8 px-6 py-4 border-b border-cyber-amber/20 flex items-center gap-4">
               <TrendingUp className="w-4 h-4 text-cyber-amber" />
               <span className="cyber-label text-[11px] text-cyber-amber">
                 {lang === 'uk' ? 'СКОРИГОВАНИЙ НАРАТИВ: HEAL \u00d7 THRIVE — ДВОПРОЄКТНА СИНЕРГІЯ' : 'CORRECTED NARRATIVE: HEAL \u00d7 THRIVE — DUAL-PROJECT SYNERGY'}
               </span>
             </div>
             <div className="p-6">
               <p className="text-[13px] text-slate-300 leading-relaxed mb-4">{DUAL_PROJECT_NARRATIVE(lang)}</p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                   <div className="text-[8px] text-rose-400 uppercase font-mono mb-1">HEAL (P180245) IPF</div>
                   <div className="text-sm font-bold text-rose-400 font-mono">$500M</div>
                   <div className="text-[9px] text-slate-500 mt-1">{lang === 'uk' ? 'Генерує послуги' : 'Deploys services'}</div>
                 </div>
                 <div className="bg-cyber-amber/5 border border-cyber-amber/30 rounded-lg p-3 text-center flex flex-col items-center justify-center">
                   <div className="text-[9px] text-cyber-amber font-bold font-mono">FEEL Again</div>
                   <div className="text-[8px] text-cyber-amber/60 uppercase mt-0.5">MIDDLEWARE BRIDGE</div>
                   <div className="text-[9px] text-slate-500 mt-1">CommCare \u2192 FHIR R4 \u2192 ESOZ</div>
                 </div>
                 <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                   <div className="text-[8px] text-cyber-success uppercase font-mono mb-1">THRIVE (P505616) PforR</div>
                   <div className="text-sm font-bold text-cyber-success font-mono">$454M</div>
                   <div className="text-[9px] text-slate-500 mt-1">{lang === 'uk' ? 'Вимірює через ЕСОЗ' : 'Measures via ESOZ'}</div>
                 </div>
               </div>
             </div>
           </div>

           {/* Stakeholder Interest Matrix */}
           <div className="mb-12 cyber-card border border-cyber-cyan/20 rounded-2xl overflow-hidden">
             <div className="bg-cyber-cyan/5 px-6 py-4 border-b border-cyber-cyan/20 flex items-center gap-4">
               <Users className="w-4 h-4 text-cyber-cyan" />
               <span className="cyber-label text-[11px] text-cyber-cyan">
                 {lang === 'uk' ? 'МАТРИЦЯ ІНТЕРЕСІВ: ЧОМУ MIDDLEWARE ПОТРІБНИЙ ВСІМ' : 'INTEREST MATRIX: WHY MIDDLEWARE SERVES ALL STAKEHOLDERS'}
               </span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b border-slate-700/30">
                     <th className="text-left px-5 py-3 text-[10px] font-mono text-cyber-amber uppercase tracking-wider w-1/5">{lang === 'uk' ? 'Стейкхолдер' : 'Stakeholder'}</th>
                     <th className="text-left px-5 py-3 text-[10px] font-mono text-cyber-amber uppercase tracking-wider w-2/5">{lang === 'uk' ? 'Біль' : 'Pain'}</th>
                     <th className="text-left px-5 py-3 text-[10px] font-mono text-cyber-amber uppercase tracking-wider">{lang === 'uk' ? 'Що дає middleware' : 'What middleware delivers'}</th>
                   </tr>
                 </thead>
                 <tbody>
                   {STAKEHOLDER_MATRIX(lang).map((row, i) => (
                     <tr key={i} className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors">
                       <td className="px-5 py-3 text-[11px] font-bold text-cyber-cyan">{row.stakeholder}</td>
                       <td className="px-5 py-3 text-[11px] text-slate-400 leading-relaxed">{row.pain}</td>
                       <td className="px-5 py-3 text-[11px] text-cyber-success leading-relaxed">{row.gain}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           {/* Formalization Cost Model v3 */}
           <div className="mb-12 cyber-card border border-rose-500/20 rounded-2xl overflow-hidden">
             <div className="bg-rose-500/5 px-6 py-4 border-b border-rose-500/20 flex items-center gap-4">
               <AlertOctagon className="w-4 h-4 text-rose-400" />
               <span className="cyber-label text-[11px] text-rose-400">
                 {lang === 'uk' ? 'СТРУКТУРНА ПАСТКА: ВАРТІСТЬ ФОРМАЛІЗАЦІЇ (МОДЕЛЬ v3)' : 'STRUCTURAL TRAP: FORMALIZATION COST MODEL (v3)'}
               </span>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-3">
                 <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{FORMALIZATION_COST_V3(lang).directCosts.label}</div>
                 {FORMALIZATION_COST_V3(lang).directCosts.items.map((item) => (
                   <div key={item.label} className="flex justify-between text-[11px] px-2 py-1.5 rounded bg-slate-800/30 border border-slate-700/20">
                     <span className="text-slate-400">{item.label}</span>
                     <span className="text-slate-300 font-mono">&euro;{item.amountPerMonth.toLocaleString('en-US')}/mo</span>
                   </div>
                 ))}
                 <div className="flex justify-between text-[12px] px-2 py-2 rounded bg-rose-500/10 border border-rose-500/20 font-bold">
                   <span className="text-rose-300">Subtotal A</span>
                   <span className="text-rose-300 font-mono">&euro;{FORMALIZATION_COST_V3(lang).directCosts.totalPerMonth.toLocaleString('en-US')}/mo</span>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{FORMALIZATION_COST_V3(lang).opportunityCost.label}</div>
                 {FORMALIZATION_COST_V3(lang).opportunityCost.items.map((item) => (
                   <div key={item.label} className="flex justify-between text-[11px] px-2 py-1.5 rounded bg-slate-800/30 border border-slate-700/20">
                     <span className="text-slate-400">{item.label}</span>
                     <span className="text-slate-300 font-mono">&euro;{item.amountPerMonth.toLocaleString('en-US')}/mo</span>
                   </div>
                 ))}
                 <div className="flex justify-between text-[12px] px-2 py-2 rounded bg-rose-500/10 border border-rose-500/20 font-bold">
                   <span className="text-rose-300">Subtotal B</span>
                   <span className="text-rose-300 font-mono">&euro;{FORMALIZATION_COST_V3(lang).opportunityCost.totalPerMonth.toLocaleString('en-US')}/mo</span>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-center">
                   <div className="text-[8px] text-rose-400 uppercase tracking-wider font-mono mb-1">TOTAL A + B</div>
                   <div className="text-3xl font-bold text-rose-400 font-mono">&euro;{FORMALIZATION_COST_V3(lang).total.perMonth.toLocaleString('en-US')}/mo</div>
                   <div className="text-[9px] text-slate-500 mt-1">&euro;{FORMALIZATION_COST_V3(lang).total.perYear.toLocaleString('en-US')}/year</div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <div className="bg-slate-800/40 border border-slate-700/30 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-slate-500 uppercase font-mono mb-1">{lang === 'uk' ? 'Тінь (100%)' : 'Shadow (100%)'}</div>
                     <div className="text-sm font-bold text-cyber-success font-mono">{FORMALIZATION_COST_V3(lang).shadowNet}</div>
                   </div>
                   <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-3 text-center">
                     <div className="text-[8px] text-rose-400 uppercase font-mono mb-1">{lang === 'uk' ? 'Формально' : 'Formal'}</div>
                     <div className="text-sm font-bold text-rose-400 font-mono">{FORMALIZATION_COST_V3(lang).formalNet}</div>
                   </div>
                 </div>
                 <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-center">
                   <div className="text-[8px] text-rose-400 uppercase tracking-wider font-mono mb-1">{lang === 'uk' ? 'ШТРАФ ЗА ФОРМАЛІЗАЦІЮ' : 'FORMALIZATION PENALTY'}</div>
                   <div className="text-2xl font-bold text-rose-400 font-mono">{FORMALIZATION_COST_V3(lang).penaltyPct}%</div>
                 </div>
               </div>
             </div>
             <div className="px-6 pb-5">
               <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/20">
                 <p className="text-[10px] text-slate-400 leading-relaxed italic">{lang === 'uk' ? 'ASSUMPTION: ' : 'ASSUMPTION: '}{FORMALIZATION_COST_V3(lang).assumption}</p>
                 <p className="text-[11px] text-slate-300 leading-relaxed mt-2">{FORMALIZATION_COST_V3(lang).conclusion}</p>
               </div>
             </div>
           </div>

           {/* Feel Again Website Section */}
           <motion.div 
             whileHover={{ scale: 1.01 }}
             className="mb-12 bg-cyber-surface p-8 rounded-2xl border border-cyber-cyan/20 cyber-glow-cyan"
           >
              <h3 className="text-xl font-bold text-cyber-cyan mb-3 uppercase tracking-tighter">{TEXTS.footer.feelAgainTitle[lang]}</h3>
              <p className="text-sm text-slate-400 mb-6 max-w-2xl leading-relaxed">{TEXTS.footer.feelAgainDesc[lang]}</p>
              <a 
                href="https://feelagain.com.ua" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-3 bg-cyber-cyan text-cyber-bg px-8 py-3 rounded-lg font-bold text-sm hover:bg-white transition-all shadow-lg cyber-glow-cyan uppercase tracking-widest"
              >
                <Globe className="w-4 h-4" /> FEEL AGAIN
              </a>
           </motion.div>

           {/* Sources — collapsible */}
           <details className="mb-12 border border-slate-800 rounded-xl overflow-hidden group/sources">
             <summary className="bg-slate-900/60 px-5 py-3 flex items-center gap-3 cursor-pointer list-none hover:bg-slate-800/60 transition-colors">
               <BookOpen className="w-3.5 h-3.5 text-cyber-amber flex-shrink-0" />
               <span className="cyber-label text-[10px] text-cyber-amber flex-1">{TEXTS.footer.sources[lang]}</span>
               <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-open/sources:rotate-180 transition-transform" />
             </summary>
             <div className="px-5 py-6 grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                 <h4 className="cyber-label mb-4 text-cyber-amber text-[10px]">{TEXTS.footer.primarySources[lang]}</h4>
                 <div className="flex flex-col gap-3">
                   {SOURCES.primary.map((s, idx) => (
                     <motion.a key={idx} href={s.url} target="_blank" rel="noreferrer" whileHover={{ x: 4 }}
                       className="text-xs text-slate-500 hover:text-cyber-cyan transition-colors flex items-center gap-3 group">
                       <Download className="w-3.5 h-3.5 text-cyber-cyan opacity-50 group-hover:opacity-100 flex-shrink-0" />
                       <span className="font-mono">{s.name}</span>
                     </motion.a>
                   ))}
                 </div>
               </div>
               <div>
                 <h4 className="cyber-label mb-4 text-cyber-amber text-[10px]">{TEXTS.footer.secondarySources[lang]}</h4>
                 <div className="flex flex-col gap-3">
                   {SOURCES.secondary.map((s, idx) => (
                     <motion.a key={idx} href={s.url} target="_blank" rel="noreferrer" whileHover={{ x: 4 }}
                       className="text-xs text-slate-500 hover:text-cyber-cyan transition-colors flex items-center gap-3 group">
                       <Globe className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyber-cyan flex-shrink-0" />
                       <span className="font-mono">{s.name}</span>
                     </motion.a>
                   ))}
                 </div>
               </div>
             </div>
           </details>

           {/* Data Infrastructure Gap — why live data is structurally impossible */}
           <div className="mb-10 border border-slate-800 rounded-xl overflow-hidden">
             <div className="bg-slate-900/60 px-5 py-3 border-b border-slate-800 flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-amber-500/70 flex-shrink-0" />
               <span className="cyber-label text-[10px] text-amber-500/80">
                 {lang === 'uk' ? 'ЧОМУ LIVE-ДАНІ СТРУКТУРНО НЕДОСЯЖНІ' : 'WHY LIVE DATA IS STRUCTURALLY UNAVAILABLE'}
               </span>
             </div>
             <div className="px-5 py-4 space-y-4">
               <p className="text-[11px] text-slate-400 leading-relaxed">
                 {lang === 'uk'
                   ? "Цифрова фрагментація замінила паперову. Проблема цифрової та крос-секторальної фрагментації залишається невирішеною. Через розпорошеність даних між медичними і соціальними службами та необхідність звітувати у несинхронізовані системи гуманітарних кластерів, сукупне адміністративне навантаження на фахівців продовжує складати розрахункові 20\u201340% робочого часу."
                   : 'Digital fragmentation replaced paper fragmentation. The problem of digital and cross-sector fragmentation remains unsolved. Due to data dispersal between health and social services, and the need to report into unsynchronised humanitarian cluster systems, the cumulative administrative burden on specialists continues to represent an estimated 20–40% of working time.'}
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                 {[
                   { sys: 'ЕСОЗ / НСЗУ', what: lang === 'uk' ? 'Медичні епізоди, рецепти, пакети' : 'Medical episodes, prescriptions, packages', status: lang === 'uk' ? 'Закрито — МОЗ ліцензія' : 'Closed — MoH licence required' },
                   { sys: 'ActivityInfo (OCHA)', what: lang === 'uk' ? 'Гуманітарне охоплення 5W' : 'Humanitarian 5W coverage', status: lang === 'uk' ? 'Авторизація кластера' : 'Cluster auth required' },
                   { sys: 'KoBo Toolbox', what: lang === 'uk' ? 'Польові оцінки НГО' : 'NGO field assessments', status: lang === 'uk' ? 'Дані кожної орг. окремо' : 'Per-organisation data only' },
                   { sys: 'OCHA FTS', what: lang === 'uk' ? 'Фінансові потоки (LIVE ✓)' : 'Funding flows (LIVE ✓)', status: lang === 'uk' ? 'Публічне API — підключено' : 'Public API — connected' },
                   { sys: 'Helsi / ЕСОЗ-2', what: lang === 'uk' ? 'Телемедицина, записи' : 'Telemedicine, appointments', status: lang === 'uk' ? 'Закрита комерц. платформа' : 'Closed commercial platform' },
                   { sys: 'НСЗУ-дашборди', what: lang === 'uk' ? 'Держпакети психол. допомоги' : 'State mental health packages', status: lang === 'uk' ? 'PDF-звіти, немає API' : 'PDF reports only, no API' },
                 ].map((row, i) => (
                   <div key={i} className={`rounded-lg p-3 border text-[10px] ${row.status.includes('✓') || row.status.includes('connected') ? 'bg-cyber-success/5 border-cyber-success/20' : 'bg-slate-800/40 border-slate-700/40'}`}>
                     <div className="font-bold text-white mb-1 font-mono">{row.sys}</div>
                     <div className="text-slate-400 mb-1">{row.what}</div>
                     <div className={row.status.includes('✓') || row.status.includes('connected') ? 'text-cyber-success' : 'text-amber-500/70'}>{row.status}</div>
                   </div>
                 ))}
               </div>

               {/* Cost of fragmentation */}
               <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                 <p className="text-[11px] text-amber-400/80 leading-relaxed">
                   {lang === 'uk'
                     ? "Наслідок: при ~35\u202f000 активних фахівців 20\u201340% адмін-навантаження = ~$60\u202fмлн втраченої клінічної ємності щорічно \u2014 не через нестачу людей, а через цифрову неефективність. Інфраструктура FEEL AGAIN інтегрується саме для усунення цього залишкового цифрового бар\u2019єру."
                     : "Consequence: across ~35,000 active specialists, a 20–40% admin burden equals ~$60M in lost clinical capacity annually — not from staff shortages, but from digital inefficiency. FEEL AGAIN infrastructure is designed specifically to eliminate this residual digital barrier."}
                 </p>
               </div>

               {/* DALY / FHI 360 note */}
               <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-4 space-y-2">
                 <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                   {lang === 'uk' ? 'DALY-аналіз та економічна модель (FHI 360 / PIN)' : 'DALY analysis & economic model (FHI 360 / PIN)'}
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">
                   {lang === 'uk'
                     ? "FHI\u00a0360 розробила для People in Need (Україна) симуляційну модель, яка конвертує результати MHPSS-втручань у показники економічної продуктивності (повернені робочі дні, скорочення стаціонарних витрат, освітні outcomes дітей). Окремо: стандартний курс терапії в Україні ($150\u2013350) авертує 0.5\u20132 DALY. Поріг рентабельності ВООЗ для України \u2248\u00a0$4\u202f300/DALY (1\u00d7 ВНД на душу населення). Розрахункова ефективність: $75\u2013700/DALY \u2014 у 6\u201357\u00d7 нижче порогу. Це найсильніший аргумент для інвестора: не просто \u2018ефективно\u2019, а \u2018математично поза конкуренцією за будь-якою галуззю охорони здоров\u2019я\u2019."
                     : "FHI 360 developed for People in Need (Ukraine) a simulation model converting MHPSS outcomes into economic productivity metrics (recovered workdays, reduced inpatient costs, children\u2019s educational outcomes). Separately: a standard therapy course in Ukraine ($150\u2013350) averts 0.5\u20132 DALYs. WHO cost-effectiveness threshold for Ukraine \u2248\u00a0$4,300/DALY (1\u00d7 GNI per capita). Calculated effectiveness: $75\u2013700/DALY \u2014 6\u201357\u00d7 below threshold. This is the strongest investor argument: not just \u2018efficient\u2019 but \u2018mathematically unrivalled across any health sector\u2019."}
                 </p>
               </div>
             </div>
           </div>

           <div className="border-t border-cyber-border pt-6 space-y-2">
             <p className="text-[10px] text-slate-600 italic font-mono">
               {TEXTS.footer.disclaimer[lang]}
             </p>
             <p className="text-[10px] text-slate-700 font-mono">
               &copy; 2026 FEEL Again Program.{' '}
               {lang === 'uk' ? 'Всі права захищено.' : 'All rights reserved.'}{' '}
               dashboard.feelagain.me
             </p>
             <p className="text-[10px] text-slate-700 italic font-mono">
               {lang === 'uk'
                 ? 'Дані надані виключно для інформаційних цілей. Не є офіційним звітом гуманітарних акторів, фінансових інституцій, або урядових структур.'
                 : 'Data provided for informational purposes only. Not an official report of humanitarian actors, financial institutions, or governmental structures.'}
             </p>
           </div>
        </footer>
      </div>{/* end max-w content */}
      </div>{/* end shifted main */}
    </div>
  );
};

export default App;
