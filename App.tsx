import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LayoutDashboard, Globe, ChevronDown, ChevronUp, Check, AlertTriangle, AlertOctagon, Info, Download, Users, Building2, GraduationCap, ShieldCheck, TrendingUp, ExternalLink, BookOpen, Database, FolderOpen } from 'lucide-react';
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

  return (
    <div className="min-h-screen pb-12 bg-cyber-bg text-slate-300 font-sans custom-scrollbar">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-cyber-border pb-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyber-amber flex items-center justify-center cyber-glow-amber">
              <ShieldCheck className="w-7 h-7 text-cyber-bg" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
                {TEXTS.header.title[lang]}
                <span className="text-[10px] bg-cyber-success/20 text-cyber-success px-2 py-0.5 rounded border border-cyber-success/30 font-mono animate-pulse uppercase">
                  SECURE
                </span>
              </h1>
              <p className="text-slate-500 text-xs md:text-sm font-mono mt-1">{TEXTS.header.subtitle[lang]}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
            <div className="flex bg-cyber-surface border border-cyber-border p-1 rounded-lg">
              <button 
                onClick={() => setLang('uk')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'uk' ? 'bg-cyber-amber text-cyber-bg shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                UA
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-cyber-amber text-cyber-bg shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                EN
              </button>
            </div>
            <div className="text-[10px] font-mono text-cyber-amber uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-amber animate-ping" />
              SYSTEM_TIME: {new Date().toLocaleTimeString()} | {TEXTS.header.date[lang]}
            </div>
          </div>
        </header>

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

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {KPI_DATA.map((kpi, idx) => (
            <KpiCard key={idx} data={kpi} lang={lang} />
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-16">
          <AnimatePresence>
            {filteredSections.map((section) => (
              <motion.div 
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                <div className="flex items-center gap-4 mb-8 border-b border-cyber-border pb-4">
                  <div className="p-2.5 bg-cyber-surface border border-cyber-cyan/30 rounded-lg text-cyber-cyan cyber-glow-cyan">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight uppercase">{section.title[lang]}</h2>
                    <div className="h-0.5 w-24 bg-gradient-to-r from-cyber-cyan to-transparent mt-1" />
                  </div>
                </div>

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
                          {lang === 'uk' ? '⚠ 89% бюджету йде на стаціонари, хоча 64–71% пацієнтів звертаються в амбулаторні заклади.' : '⚠ 89% of budget goes to inpatient care, though 64–71% of patients seek outpatient care.'}
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
                    <Card title={lang === 'uk' ? 'Фінансування vs Охоплення' : 'Funding vs Reach'} subtitle={lang === 'uk' ? 'Оцінка ефективності за організаціями' : 'Efficiency estimation by organization'}>
                       <CustomScatterPlot 
                          data={FUNDING_VS_REACH_DATA.map(d => ({
                            name: d.name,
                            x: d.funding,
                            y: d.reach,
                            fill: d.name === 'UNICEF' ? COLORS.teal : d.name === 'WHO' ? COLORS.blue : COLORS.gray
                          }))}
                          xLabel={lang === 'uk' ? 'Фінансування ($M)' : 'Funding ($M)'}
                          yLabel={lang === 'uk' ? 'Охоплення (тис.)' : 'Reach (K)'}
                          height={250}
                       />
                    </Card>
                  </div>
                  <Card colSpan="full" title={lang === 'uk' ? "Бюджет охорони здоров'я та частка на ментальне здоров'я" : "Health Budget & Mental Health Share"}>
                     <ResponsiveContainer width="100%" height={300} minWidth={1}>
                        <ComposedChart data={[{year:'2024', health:239, mh:5.98}, {year:'2025', health:222.1, mh:5.55}, {year:'2026', health:258.6, mh:6.47}]}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                           <XAxis dataKey="year" tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono'}} />
                           <YAxis yAxisId="left" tick={{fontSize:11}} label={{value: lang==='uk'?'Млрд ₴':'B ₴', angle:-90, position:'insideLeft'}} />
                           <YAxis yAxisId="right" orientation="right" tick={{fontSize:11}} label={{value: lang==='uk'?'МЗ (2.5%)':'MH (2.5%)', angle:90, position:'insideRight'}} />
                           <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 8}} />
                           <Legend />
                           <Bar yAxisId="left" dataKey="health" name={lang === 'uk' ? "Бюджет охорони здоров'я" : "Health Budget"} fill={COLORS.blueLight} radius={[4,4,0,0]} barSize={40} />
                           <Line yAxisId="right" type="monotone" dataKey="mh" name={lang === 'uk' ? "Оцінка МЗ (2.5%)" : "Est. MH (2.5%)"} stroke={COLORS.red} strokeWidth={2} dot={{r:4}} />
                        </ComposedChart>
                     </ResponsiveContainer>
                  </Card>
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
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3">{lang === 'uk' ? 'Показник' : 'Indicator'}</th>
                            <th className="px-6 py-3">{lang === 'uk' ? 'Значення' : 'Value'}</th>
                            <th className="px-6 py-3">{lang === 'uk' ? 'Організація' : 'Organization'}</th>
                            <th className="px-6 py-3">{lang === 'uk' ? 'Період' : 'Period'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {REACH_TABLE_DATA(lang).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-medium text-slate-700">{row[0]}</td>
                              <td className="px-6 py-4 font-bold text-cyber-cyan font-mono">{row[1]}</td>
                              <td className="px-6 py-4 text-slate-600">{row[2]}</td>
                              <td className="px-6 py-4 text-slate-500 text-xs">{row[3]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* SHADOW */}
              {section.id === 'shadow' && (
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
              )}

              {/* ECONOMIC / ROI */}
              {section.id === 'economic' && (
                 <div className="space-y-6">
                    {/* ROI Investment Case */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-4 h-4 text-cyber-cyan" />
                        <span className="cyber-label text-[11px] text-cyber-cyan">
                          {lang === 'uk' ? 'КЕЙС ДЛЯ ІНВЕСТОРА: ДОВЕДЕНИЙ ROI' : 'INVESTOR CASE: PROVEN ROI'}
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
                             {lang === 'uk' ? 'З 96 000 сертифікатів лише ~1 000 закладів реально впровадили пакет НСЗУ. (Логарифмічна шкала)' : 'Of 96,000 certificates, only ~1,000 facilities actually implemented the NHSU package. (Logarithmic scale)'}
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

            </motion.div>
          ))}
        </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-cyber-border pt-12 pb-16">
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
                <Globe className="w-4 h-4" /> {lang === 'uk' ? 'Відвідати FEEL AGAIN' : 'Visit FEEL AGAIN'}
              </a>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <h4 className="cyber-label mb-6 text-cyber-amber">{TEXTS.footer.primarySources[lang]}</h4>
                <div className="flex flex-col gap-4">
                  {SOURCES.primary.map((s, idx) => (
                    <motion.a 
                      key={idx} 
                      href={s.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      whileHover={{ x: 5 }}
                      className="text-xs text-slate-500 hover:text-cyber-cyan transition-colors flex items-center gap-3 group"
                    >
                       <Download className="w-3.5 h-3.5 text-cyber-cyan opacity-50 group-hover:opacity-100" /> 
                       <span className="font-mono">{s.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="cyber-label mb-6 text-cyber-amber">{TEXTS.footer.secondarySources[lang]}</h4>
                <div className="flex flex-col gap-4">
                  {SOURCES.secondary.map((s, idx) => (
                    <motion.a 
                      key={idx} 
                      href={s.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      whileHover={{ x: 5 }}
                      className="text-xs text-slate-500 hover:text-cyber-cyan transition-colors flex items-center gap-3 group"
                    >
                       <Globe className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyber-cyan" /> 
                       <span className="font-mono">{s.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
           </div>

           {/* Connected Assets */}
           <div className="mb-10 border border-cyber-cyan/20 rounded-xl overflow-hidden">
             <div className="bg-cyber-surface px-5 py-3 border-b border-cyber-cyan/20 flex items-center gap-3">
               <FolderOpen className="w-4 h-4 text-cyber-cyan" />
               <span className="cyber-label text-[10px] text-cyber-cyan">
                 {lang === 'uk' ? 'ПОВ\u2019ЯЗАНІ МАТЕРІАЛИ' : 'CONNECTED ASSETS'}
               </span>
             </div>
             <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
               {CONNECTED_ASSETS(lang).map((asset, i) => {
                 const typeIcon = asset.type === 'repo'
                   ? <Database className="w-3.5 h-3.5 text-cyber-cyan flex-shrink-0" />
                   : asset.type === 'dashboard'
                   ? <LayoutDashboard className="w-3.5 h-3.5 text-cyber-amber flex-shrink-0" />
                   : asset.type === 'drive'
                   ? <FolderOpen className="w-3.5 h-3.5 text-cyber-purple flex-shrink-0" />
                   : <BookOpen className="w-3.5 h-3.5 text-cyber-success flex-shrink-0" />;
                 return (
                   <motion.a
                     key={i}
                     href={asset.url}
                     target="_blank"
                     rel="noreferrer"
                     whileHover={{ x: 4 }}
                     className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-cyber-cyan/30 hover:bg-slate-800/70 transition-all group"
                   >
                     {typeIcon}
                     <div className="min-w-0">
                       <div className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors truncate">{asset.name}</div>
                       <div className="text-[9px] text-slate-600 mt-0.5">{asset.desc}</div>
                     </div>
                     <ExternalLink className="w-3 h-3 text-slate-700 group-hover:text-cyber-cyan flex-shrink-0 ml-auto mt-0.5 transition-colors" />
                   </motion.a>
                 );
               })}
             </div>
           </div>

           {/* Data Infrastructure Gap — why live data is structurally impossible */}
           <div className="mb-10 border border-slate-800 rounded-xl overflow-hidden">
             <div className="bg-slate-900/60 px-5 py-3 border-b border-slate-800 flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-amber-500/70 flex-shrink-0" />
               <span className="cyber-label text-[10px] text-amber-500/80">
                 {lang === 'uk' ? 'ЧОМУ LIVE-ДАНІ НЕДОСЯЖНІ: СИСТЕМНА ПРИЧИНА' : 'WHY LIVE DATA IS STRUCTURALLY UNAVAILABLE'}
               </span>
             </div>
             <div className="px-5 py-4 space-y-4">
               <p className="text-[11px] text-slate-400 leading-relaxed">
                 {lang === 'uk'
                   ? "Цифрова фрагментація замінила паперову. Проблема крос-секторальної розпорошеності залишається невирішеною: дані про психічне здоров\u2019я існують мінімум у п\u2019яти несумісних системах, жодна з яких не має повністю відкритого публічного API."
                   : 'Digital fragmentation replaced paper fragmentation. Cross-sector data silos remain unsolved: mental health data exists across at least five incompatible systems, none with a fully open public API.'}
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
               <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                 <p className="text-[11px] text-amber-400/80 leading-relaxed">
                   {lang === 'uk'
                     ? "Наслідок: через необхідність паралельно звітувати у несинхронізовані системи адміністративний тягар на MHPSS-фахівців складає розрахункові 20\u201340% робочого часу. При чисельності ~35\u00a0000 активних фахівців це еквівалентно ~$60\u00a0млн втраченої клінічної ємності щорічно \u2014 кошти, що з\u2019їдені не відсутністю спеціалістів, а цифровою неефективністю. Інфраструктура FEEL AGAIN інтегрується саме для усунення цього залишкового цифрового бар\u2019єру."
                     : `Consequence: parallel reporting into unsynchronised systems creates an estimated 20–40% administrative burden on MHPSS professionals. Across ~35,000 active specialists, this equates to ~$60M in lost clinical capacity annually — not from staff shortages, but from digital inefficiency. FEEL AGAIN infrastructure is designed specifically to eliminate this residual digital barrier.`}
                 </p>
               </div>
             </div>
           </div>

           <p className="text-[10px] text-slate-600 italic border-t border-cyber-border pt-6 font-mono">
              {TEXTS.footer.disclaimer[lang]}
           </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
