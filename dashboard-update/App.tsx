import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Globe, ChevronDown, ChevronUp, Check, AlertTriangle, AlertOctagon, Info, Download, Users, Building2, GraduationCap, ShieldCheck, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TEXTS, COLORS, KPI_DATA, SECTIONS_CONFIG, TOP_METRICS,
  PREVALENCE_DATA, RISK_GROUP_DATA, WORKFORCE_DATA, WAR_IMPACT_DATA, SECTOR_DIST_DATA,
  BUDGET_SPLIT_DATA, DONOR_DATA, GAP_DATA, BARRIERS_DATA, SHADOW_DATA, DALY_DATA, RECON_DATA,
  CHILDREN_DATA, MHGAP_FUNNEL_DATA, TRAINED_REALITY_DATA, CLUSTER_DATA,
  TIMELINE_ITEMS, ADMIN_BURDEN, COORD_ITEMS, REACH_TABLE_DATA, INPUTS_OUTCOMES_DATA, SOURCES,
  FUNDING_VS_REACH_DATA, REGIONAL_BARRIERS_HEATMAP, DISORDER_IMPACT_BUBBLE,
  ECONOMIC_BURDEN_INDICATORS, REGIONAL_DISORDER_DATA,
  HEAL_KPI_DATA, HEAL_COMPONENTS, COMPONENT4_SPENDING, AMP_MH_DATA,
  PERFECT_STORM_METRICS, STRUCTURAL_RATIOS, BACKLOG_SCENARIOS, FORMALIZATION_COST,
  INTL_MH_BENCHMARKS, SECTOR_FUNDING_COMPARISON, EXECUTIVE_DIGEST, SECTION_CONCLUSIONS
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

// Section Conclusion Component
const SectionConclusion: React.FC<{ sectionId: string, lang: Language }> = ({ sectionId, lang }) => {
  const [expanded, setExpanded] = useState(false);
  const conclusions = SECTION_CONCLUSIONS(lang);
  const data = conclusions[sectionId];
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-8 border border-cyber-amber/30 rounded-xl bg-cyber-amber/5 p-5"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 text-left"
      >
        <span className="text-cyber-amber text-lg mt-0.5">⚡</span>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cyber-amber mb-1 font-mono">
            {lang === 'uk' ? 'ЩО ЦЕ ОЗНАЧАЄ' : 'WHAT THIS MEANS'}
          </div>
          <div className="text-sm font-bold text-white leading-relaxed">{data.summary}</div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-cyber-amber mt-1">
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-cyber-amber/20 text-[11px] text-slate-400 leading-relaxed font-mono">
              {data.detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Executive Digest Component
const ExecutiveDigest: React.FC<{ lang: Language, onNavigate: (section: SectionFilter) => void }> = ({ lang, onNavigate }) => {
  const digest = EXECUTIVE_DIGEST(lang);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 border border-cyber-amber/20 rounded-2xl bg-cyber-surface p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-2 h-2 rounded-full bg-cyber-amber animate-pulse" />
        <h3 className="text-sm font-bold text-cyber-amber uppercase tracking-widest font-mono">
          {lang === 'uk' ? 'Executive Digest — 5 ключових висновків' : 'Executive Digest — 5 Key Findings'}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {digest.map((item, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02, translateY: -2 }}
            onClick={() => onNavigate(item.section as SectionFilter)}
            className="cyber-card p-4 text-left border-l-3 cursor-pointer group"
            style={{ borderLeftColor: item.color, borderLeftWidth: '3px' }}
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-lg">{item.icon}</span>
              <div className="text-[11px] font-bold text-white group-hover:text-cyber-cyan transition-colors leading-snug font-mono uppercase">{item.title}</div>
            </div>
            <div className="text-[10px] text-slate-500 leading-relaxed font-mono">{item.text}</div>
            <div className="mt-2 text-[9px] text-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity font-mono uppercase tracking-wider">
              {lang === 'uk' ? '→ перейти до розділу' : '→ go to section'}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Main App
const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('uk');
  const [activeSection, setActiveSection] = useState<SectionFilter>('all');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

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
    <div className={`min-h-screen pb-12 bg-cyber-bg text-slate-300 font-sans custom-scrollbar ${theme === 'light' ? 'light' : ''}`}>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-amber transition-all"
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-cyber-amber" /> : <Moon className="w-4 h-4 text-cyber-amber" />}
              </button>
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
            </div>
            <div className="text-[10px] font-mono text-cyber-amber uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-amber animate-ping" />
              SYSTEM_TIME: {new Date().toLocaleTimeString()} | {TEXTS.header.date[lang]}
            </div>
          </div>
        </header>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {TOP_METRICS(lang).map((metric, idx) => (
            <TopMetric key={idx} data={metric} lang={lang} />
          ))}
        </div>

        {/* Executive Digest */}
        <ExecutiveDigest lang={lang} onNavigate={(section) => setActiveSection(section)} />

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
          <div className="ml-auto hidden lg:flex items-center gap-6 px-4 border-l border-cyber-border">
             <div className="flex flex-col items-end">
                <span className="cyber-label text-[8px]">Network_Load</span>
                <span className="cyber-number text-xs">42.8%</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="cyber-label text-[8px]">Data_Integrity</span>
                <span className="text-cyber-success text-xs font-mono">VERIFIED</span>
             </div>
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
                <div className="space-y-6">
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
                <SectionConclusion sectionId="prevalence" lang={lang} />
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
                  <SectionConclusion sectionId="workforce" lang={lang} />
                </div>
              )}

              {/* BUDGET */}
              {section.id === 'budget' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={lang === 'uk' ? 'Розподіл бюджету: стаціонар vs амбулаторія' : 'Budget Split: Inpatient vs Outpatient'} subtitle={lang === 'uk' ? '₴6.47B — бюджет MH 2026 (2.5% від здоров\'я)' : '₴6.47B — MH budget 2026 (2.5% of health)'}>
                       <CustomDonutChart data={BUDGET_SPLIT_DATA(lang)} height={250} />
                       <InsightBox type="critical">
                          {lang === 'uk' ? '⚠ 89% бюджету йде на стаціонари, хоча 64–71% пацієнтів звертаються в амбулаторні заклади.' : '⚠ 89% of budget goes to inpatient care, though 64–71% of patients seek outpatient care.'}
                       </InsightBox>
                    </Card>
                    <Card title={lang === 'uk' ? 'Міжнародне фінансування МЗПСП ($M)' : 'International MHPSS Funding ($M)'} subtitle={lang === 'uk' ? 'Основні донори, 2022-2025' : 'Major donors, 2022-2025'}>
                       <ResponsiveContainer width="100%" height={280} minWidth={1}>
                          <BarChart layout="vertical" data={DONOR_DATA(lang)} margin={{ left: 10, right: 50, top: 10, bottom: 10 }}>
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0, 245, 255, 0.1)" />
                             <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} unit="M" />
                             <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
                             <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#050A15', border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: 8 }} />
                             <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22} label={{ position: 'right', fill: '#00F5FF', fontSize: 10, fontWeight: 'bold', fontFamily: 'JetBrains Mono', formatter: (v: any) => `$${v}M` }}>
                                {DONOR_DATA(lang).map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={lang === 'uk' ? "Бюджет здоров'я та частка MH" : "Health Budget & MH Share"} subtitle={lang === 'uk' ? 'Млрд ₴ (2024-2026)' : 'B ₴ (2024-2026)'}>
                       <ResponsiveContainer width="100%" height={280} minWidth={1}>
                          <ComposedChart data={[{year:'2024', health:239, mh:5.98}, {year:'2025', health:222.1, mh:5.55}, {year:'2026', health:258.6, mh:6.47}]}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,245,255,0.1)" />
                             <XAxis dataKey="year" tick={{fontSize: 11, fill: '#94a3b8', fontFamily: 'JetBrains Mono'}} />
                             <YAxis yAxisId="left" tick={{fontSize:11, fill: '#94a3b8'}} label={{value: lang==='uk'?'Млрд ₴':'B ₴', angle:-90, position:'insideLeft', style:{fill:'#94a3b8',fontSize:10}}} />
                             <YAxis yAxisId="right" orientation="right" tick={{fontSize:11, fill: '#94a3b8'}} label={{value: lang==='uk'?'МЗ (2.5%)':'MH (2.5%)', angle:90, position:'insideRight', style:{fill:'#94a3b8',fontSize:10}}} />
                             <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#050A15', border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: 8 }} />
                             <Legend wrapperStyle={{fontSize: 10, fontFamily: 'JetBrains Mono'}} />
                             <Bar yAxisId="left" dataKey="health" name={lang === 'uk' ? "Бюджет здоров'я" : "Health Budget"} fill={COLORS.blueLight} radius={[4,4,0,0]} barSize={40} />
                             <Line yAxisId="right" type="monotone" dataKey="mh" name={lang === 'uk' ? "Оцінка МЗ (2.5%)" : "Est. MH (2.5%)"} stroke={COLORS.red} strokeWidth={2} dot={{r:4}} />
                          </ComposedChart>
                       </ResponsiveContainer>
                    </Card>
                    <Card title={lang === 'uk' ? 'Міжнародний контекст: ринок MH' : 'International Context: MH Market'} subtitle={lang === 'uk' ? 'Порівняння з іншими країнами ($B)' : 'Comparison with other countries ($B)'}>
                       <ResponsiveContainer width="100%" height={280} minWidth={1}>
                          <BarChart layout="vertical" data={INTL_MH_BENCHMARKS(lang).slice(1)} margin={{ left: 10, right: 50, top: 10, bottom: 10 }}>
                             <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0, 245, 255, 0.1)" />
                             <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                             <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
                             <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#050A15', border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: 8 }} />
                             <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22} label={{ position: 'right', fill: '#D4A017', fontSize: 11, fontWeight: 'bold', fontFamily: 'JetBrains Mono', formatter: (v: any) => `$${v}B` }}>
                                {INTL_MH_BENCHMARKS(lang).slice(1).map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                             </Bar>
                          </BarChart>
                       </ResponsiveContainer>
                       <InsightBox type="neutral">
                          {lang === 'uk' ? 'ℹ Україна ~15-та у світі за потенціалом MH-ринку ($3.5B). Глобальний ринок: $537B до 2030.' : 'ℹ Ukraine ~15th globally by MH market potential ($3.5B). Global market: $537B by 2030.'}
                       </InsightBox>
                    </Card>
                  </div>
                  <SectionConclusion sectionId="budget" lang={lang} />
                </div>
              )}

              {/* GAP */}
              {section.id === 'gap' && (
                <div className="space-y-6">
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
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="text-[10px] text-slate-500 uppercase bg-cyber-border/10 font-mono tracking-widest">
                          <tr>
                            <th className="px-4 py-3 border-b border-cyber-border/30">{lang === 'uk' ? 'Показник' : 'Indicator'}</th>
                            <th className="px-4 py-3 border-b border-cyber-border/30 text-right">{lang === 'uk' ? 'Значення' : 'Value'}</th>
                            <th className="px-4 py-3 border-b border-cyber-border/30">{lang === 'uk' ? 'Організація' : 'Organization'}</th>
                            <th className="px-4 py-3 border-b border-cyber-border/30">{lang === 'uk' ? 'Період' : 'Period'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyber-border/10">
                          {REACH_TABLE_DATA(lang).map((row, idx) => (
                            <tr key={idx} className="transition-colors hover:bg-cyber-cyan/3">
                              <td className="px-4 py-3 font-medium text-white text-[11px] font-mono">{row[0]}</td>
                              <td className="px-4 py-3 font-bold text-cyber-cyan font-mono text-[12px] text-right">{row[1]}</td>
                              <td className="px-4 py-3 text-slate-400 text-[11px] font-mono">{row[2]}</td>
                              <td className="px-4 py-3 text-slate-500 text-[10px] font-mono">{row[3]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                  <SectionConclusion sectionId="gap" lang={lang} />
                </div>
              )}

              {/* SHADOW */}
              {section.id === 'shadow' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={lang === 'uk' ? 'Рівні формалізації практики (%)' : 'Practice Formalization Levels (%)'} subtitle={lang === 'uk' ? 'Від повністю тіньових до обов\'язкової сертифікації' : 'From fully shadow to mandatory certification'}>
                      <ResponsiveContainer width="100%" height={280} minWidth={1}>
                         <BarChart layout="vertical" data={SHADOW_DATA(lang)} margin={{ left: 10, right: 50, top: 10, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0, 245, 255, 0.1)" />
                            <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#050A15', border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: 8 }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28} label={{ position: 'right', fill: '#00F5FF', fontSize: 11, fontWeight: 'bold', fontFamily: 'JetBrains Mono', formatter: (v: any) => `${v}%` }}>
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
                  <SectionConclusion sectionId="shadow" lang={lang} />
                </div>
              )}

              {/* WORLD BANK: HEAL + THRIVE + MIDDLEWARE GAP */}
              {section.id === 'worldbank' && (
                <div className="space-y-6">
                  {/* HEAL KPI Table */}
                  <Card colSpan="full" title={lang === 'uk' ? 'HEAL Ukraine (P180245) — KPI з ISR #6' : 'HEAL Ukraine (P180245) — KPIs from ISR #6'} subtitle={lang === 'uk' ? '$500M IPF | Затверджено: грудень 2022 | Закриття: грудень 2026' : '$500M IPF | Approved: Dec 2022 | Closing: Dec 2026'}>
                    <div className="space-y-4">
                      {HEAL_KPI_DATA(lang).map((row, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-cyber-border/20 rounded-lg hover:bg-cyber-cyan/3 transition-colors">
                          <div className="sm:w-1/4">
                            <div className="text-sm font-bold text-white font-mono">{row.name}</div>
                          </div>
                          <div className="sm:w-1/2 flex flex-col gap-1">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-slate-400">{lang === 'uk' ? 'Ціль' : 'Target'}: {row.target.toLocaleString()}</span>
                              <span className="text-cyber-cyan font-bold">{lang === 'uk' ? 'Факт' : 'Actual'}: {row.actual.toLocaleString()}</span>
                            </div>
                            <div className="w-full h-3 bg-cyber-border/30 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${row.status === 'critical' ? 'bg-rose-500' : 'bg-cyber-success'}`}
                                style={{ width: `${Math.min(row.pct, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className="sm:w-1/4 flex items-center justify-end gap-3">
                            <span className={`text-lg font-bold font-mono ${row.status === 'critical' ? 'text-rose-500' : 'text-cyber-success'}`}>{row.pct}%</span>
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest font-mono ${row.status === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-cyber-success/20 text-cyber-success border border-cyber-success/30'}`}>
                              {row.status === 'critical' ? (lang === 'uk' ? 'КРИТИЧНО' : 'CRITICAL') : (lang === 'uk' ? 'ВИКОНАНО' : 'EXCEEDED')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <InsightBox type="critical">
                      {lang === 'uk' ? '⚠ 624K MH-послуг надано мобільними командами через CommCare/Kobo — ці дані НЕ в ЕСОЗ. THRIVE ($454M PforR) вимірює через ЕСОЗ. Middleware gap = HEAL outputs ≠ THRIVE inputs.' : '⚠ 624K MH services delivered by mobile teams via CommCare/Kobo — this data is NOT in ESOZ. THRIVE ($454M PforR) measures via ESOZ. Middleware gap = HEAL outputs ≠ THRIVE inputs.'}
                    </InsightBox>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* HEAL Components */}
                    <Card title={lang === 'uk' ? 'HEAL: Компоненти ($M)' : 'HEAL: Components ($M)'} subtitle="$500M total">
                      <CustomDonutChart data={HEAL_COMPONENTS(lang)} height={250} />
                    </Card>

                    {/* Component 4 Spending */}
                    <Card title={lang === 'uk' ? 'Компонент 4: Дигіталізація ($50M)' : 'Component 4: Digitalization ($50M)'} subtitle={lang === 'uk' ? 'Витрачено ~$8.9M з $50M (тис. $)' : 'Spent ~$8.9M of $50M (K $)'}>
                      <CustomDonutChart data={COMPONENT4_SPENDING(lang)} height={250} />
                      <InsightBox type="positive">
                        {lang === 'uk' ? '✓ $41.1M не розподілені — ВІКНО МОЖЛИВОСТЕЙ для middleware (FEEL Again). Закриття проєкту: грудень 2026.' : '✓ $41.1M unallocated — OPPORTUNITY WINDOW for middleware (FEEL Again). Project closing: Dec 2026.'}
                      </InsightBox>
                    </Card>
                  </div>

                  {/* AMP Mental Health */}
                  <Card colSpan="full" title={lang === 'uk' ? 'AMP: Доступні ліки для ментального здоров\'я' : 'AMP: Affordable Medicines for Mental Health'} subtitle={lang === 'uk' ? 'Програма «Доступні ліки» — єдиний MH-потік, інтегрований з ЕСОЗ' : 'Affordable Medicines Program — only MH flow integrated with ESOZ'}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {AMP_MH_DATA(lang).map((item, idx) => (
                        <motion.div key={idx} whileHover={{ scale: 1.03 }} className="cyber-card p-4 text-center">
                          <div className="cyber-label mb-2">{item.name}</div>
                          <div className="cyber-number text-2xl font-bold">{item.value.toLocaleString()}</div>
                        </motion.div>
                      ))}
                    </div>
                    <InsightBox type="positive">
                      {lang === 'uk' ? '✓ 147K e-рецептів за 4 міс. 2025 — працює через НСЗУ/ЕСОЗ. 20 МНН, 132 торгові назви. 85% викуплено. Це доказ: коли дані в ЕСОЗ — THRIVE їх бачить.' : '✓ 147K e-prescriptions in 4mo 2025 — works via NHSU/ESOZ. 20 INNs, 132 trade names. 85% redeemed. Proof: when data is in ESOZ — THRIVE sees it.'}
                    </InsightBox>
                  </Card>
                  <SectionConclusion sectionId="worldbank" lang={lang} />
                </div>
              )}

              {/* ECONOMIC / REGIONAL DISTRIBUTION */}
              {section.id === 'economic' && (
                 <div className="space-y-6">
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
                    <SectionConclusion sectionId="inputs" lang={lang} />
                 </div>
              )}

              {/* PERFECT STORM */}
              {section.id === 'perfectstorm' && (
                <div className="space-y-6">
                  {/* Storm Metrics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PERFECT_STORM_METRICS(lang).map((m, idx) => (
                      <motion.div key={idx} whileHover={{ scale: 1.03, translateY: -4 }} className="cyber-card p-5 border-t-2" style={{ borderColor: m.color }}>
                        <div className="cyber-label mb-2">{m.label}</div>
                        <div className="text-3xl font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">{m.unit}</div>
                        <div className="text-[9px] text-slate-600 mt-2 italic border-t border-cyber-border pt-2 font-mono">{m.formula}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Structural Ratios */}
                    <Card title={lang === 'uk' ? 'Структурні диспропорції (×)' : 'Structural Imbalances (×)'} subtitle={lang === 'uk' ? 'Множники — наскільки система далека від норми' : 'Multipliers — how far the system is from norm'}>
                      <ResponsiveContainer width="100%" height={280} minWidth={1}>
                        <BarChart layout="vertical" data={STRUCTURAL_RATIOS(lang)} margin={{ left: 10, right: 60, top: 10, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0, 245, 255, 0.1)" />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#050A15', border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: 8 }} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={22} label={{ position: 'right', fill: '#00F5FF', fontSize: 11, fontWeight: 'bold', fontFamily: 'JetBrains Mono', formatter: (v: any) => `${v}×` }}>
                            {STRUCTURAL_RATIOS(lang).map((entry, index) => (
                              <Cell key={`sr-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>

                    {/* Backlog Scenarios */}
                    <Card title={lang === 'uk' ? 'Бекlog: скільки років при різних сценаріях' : 'Backlog: years under different scenarios'} subtitle={lang === 'uk' ? '62.4M годин / кількість фахівців' : '62.4M hours / number of professionals'}>
                      <ResponsiveContainer width="100%" height={280} minWidth={1}>
                        <BarChart data={BACKLOG_SCENARIOS(lang)} margin={{ bottom: 40, top: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 245, 255, 0.1)" />
                          <XAxis dataKey="name" interval={0} tick={{ fontSize: 10, fill: '#94a3b8' }} angle={-15} textAnchor="end" height={60} />
                          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit={lang === 'uk' ? ' р.' : ' yr'} />
                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#050A15', border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: 8 }} />
                          <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                          <Bar dataKey="sustainable" name={lang === 'uk' ? 'Стійкий (1,500 год/рік)' : 'Sustainable (1,500 hrs/yr)'} fill={COLORS.orange} radius={[4, 4, 0, 0]} barSize={30}>
                            <LabelList dataKey="sustainable" position="top" style={{ fontSize: '10px', fill: '#F59E0B', fontFamily: 'JetBrains Mono' }} />
                          </Bar>
                          <Bar dataKey="theoretical" name={lang === 'uk' ? 'Теоретичний (2,000 год/рік)' : 'Theoretical (2,000 hrs/yr)'} fill={COLORS.blue} radius={[4, 4, 0, 0]} barSize={30}>
                            <LabelList dataKey="theoretical" position="top" style={{ fontSize: '10px', fill: '#00F5FF', fontFamily: 'JetBrains Mono' }} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <InsightBox type="critical">
                        {lang === 'uk' ? '⚠ Навіть при 19K фахівців (макс. з тіньовим сектором) — бекlog 1.6–2.2 роки. При 4K зареєстрованих — 7.8–10.4 років. Тренінги не масштабуються — потрібна інфраструктура.' : '⚠ Even at 19K professionals (max with shadow sector) — backlog 1.6–2.2 years. At 4K registered — 7.8–10.4 years. Training doesn\'t scale — infrastructure needed.'}
                      </InsightBox>
                    </Card>
                  </div>

                  {/* Formalization Cost Breakdown */}
                  <Card colSpan="full" title={lang === 'uk' ? 'Вартість формалізації: €979/міс (65% штраф)' : 'Formalization Cost: €979/mo (65% penalty)'} subtitle={lang === 'uk' ? 'Чому тіньовий сектор не формалізується — економічна декомпозиція' : 'Why shadow sector won\'t formalize — economic decomposition'}>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-1/3">
                        <CustomDonutChart data={FORMALIZATION_COST(lang)} height={250} />
                      </div>
                      <div className="w-full md:w-2/3 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="cyber-card p-4">
                            <div className="cyber-label mb-1">{lang === 'uk' ? 'Тіньовий нетто' : 'Shadow net'}</div>
                            <div className="text-2xl font-bold text-cyber-success font-mono">€1,500<span className="text-[10px] text-slate-500">/mo</span></div>
                          </div>
                          <div className="cyber-card p-4">
                            <div className="cyber-label mb-1">{lang === 'uk' ? 'Формальний нетто' : 'Formal net'}</div>
                            <div className="text-2xl font-bold text-rose-500 font-mono">€521<span className="text-[10px] text-slate-500">/mo</span></div>
                          </div>
                        </div>
                        <InsightBox type="neutral">
                          {lang === 'uk' ? 'Formula: Прямі (ФОП 5% €75 + ЄСВ €32 + бухгалтерія €100 = €207/міс) + Opportunity cost (250 год/рік × €46/год = €958/міс) = €979–1,165/міс total (65% від доходу)' : 'Formula: Direct (sole prop 5% €75 + ESV €32 + accounting €100 = €207/mo) + Opportunity cost (250 hrs/yr × €46/hr = €958/mo) = €979–1,165/mo total (65% of income)'}
                        </InsightBox>
                      </div>
                    </div>
                  </Card>
                  <SectionConclusion sectionId="perfectstorm" lang={lang} />
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

           <p className="text-[10px] text-slate-600 italic border-t border-cyber-border pt-6 font-mono">
              {TEXTS.footer.disclaimer[lang]}
           </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
