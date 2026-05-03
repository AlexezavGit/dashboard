import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Link2, AlertTriangle } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { BUDGET_SPLIT_DATA, DONOR_DATA } from '../../constants';

interface Props { lang: Language; nav: ScreenNav; }

type ConnectionItem = {
  between: [number, number];
  label: { uk: string; en: string };
  title: { uk: string; en: string };
  desc: { uk: string; en: string };
  fix: { uk: string; en: string };
};

// 4-node path: Allocation → Provider → Session → THRIVE Disbursement
const CHAIN_NODES = [
  {
    id: 'alloc',
    label: { uk: 'Алокація', en: 'Allocation' },
    amount: '~$420M',
    sub: { uk: 'HEAL P180245 + THRIVE P505616 · MHPSS-активні', en: 'HEAL P180245 + THRIVE P505616 · MHPSS-active' },
    color: '#e8c97a',
  },
  {
    id: 'provider',
    label: { uk: 'Провайдер', en: 'Provider' },
    amount: '4,000+',
    sub: { uk: '118 мобільних MH-команд (157% від плану) · 4K+ НСЗУ реєстр', en: '118 mobile MH teams (157% of plan) · 4K+ NHSU registry' },
    color: '#e8c97a',
  },
  {
    id: 'session',
    label: { uk: 'Сесія', en: 'Session' },
    amount: '624K+',
    sub: { uk: 'HEAL MH-сесій верифіковано (125% від плану) · 4.7M поза ЄСОЗ', en: 'HEAL MH sessions verified (125% of plan) · 4.7M outside ESOZ' },
    color: '#e8c97a',
  },
  {
    id: 'result',
    label: { uk: 'THRIVE Disbursement', en: 'THRIVE Disbursement' },
    amount: '$134M+',
    sub: { uk: 'розблоковується після ЄСОЗ-верифікації · плани вже перевиконані', en: 'unlocks after ESOZ verification · plans already exceeded' },
    color: '#00d4aa',
  },
];

// Connections (з'єднання) via FEEL Again Digital Bus
const CONNECTIONS: ConnectionItem[] = [
  {
    between: [0, 1],
    label: { uk: "З'єднання A", en: 'Connection A' },
    title: { uk: 'FEEL Again Digital Bus', en: 'FEEL Again Digital Bus' },
    desc: {
      uk: "HEAL C4 ($50M) не містить middleware для інтероперабельності — лише hardware та cybersecurity. FEEL Again Digital Bus: HL7 FHIR R4, 10K req/sec, <200ms p95. Zero CAPEX SaaS-шар між CommCare/KoboToolbox та ЄСОЗ через Trembita X-Road. Кожна NGO-сесія отримує верифікований Shadow Record → автоматичний disbursement-тригер.",
      en: 'HEAL C4 ($50M) contains no interoperability middleware — hardware and cybersecurity only. FEEL Again Digital Bus: HL7 FHIR R4, 10K req/sec, <200ms p95. Zero CAPEX SaaS layer between CommCare/KoboToolbox and ESOZ via Trembita X-Road. Every NGO session receives a verified Shadow Record → automatic disbursement trigger.',
    },
    fix: {
      uk: "Один API-виклик на провайдера → 624K HEAL MH-сесій стають аудитними для THRIVE DLI",
      en: 'One API call per provider → 624K HEAL MH sessions become auditable for THRIVE DLIs',
    },
  },
  {
    between: [1, 2],
    label: { uk: "З'єднання B", en: 'Connection B' },
    title: { uk: '4.7M сесій → аудитні', en: '4.7M sessions → auditable' },
    desc: {
      uk: "CommCare 2.1M + KoboToolbox 0.8M + ActivityInfo 1.8M — всі поза ЄСОЗ (0% у реєстрі). HL7-FHIR R4 через Trembita → Shadow Record Tagging → Provenance Resource. KPI HEAL ISR#6 перевиконані: 624K MH (125%), 670K реабілітація (214%), 10.4M розширені огляди (297%), 118 мобільних команд (157%).",
      en: 'CommCare 2.1M + KoboToolbox 0.8M + ActivityInfo 1.8M — all outside ESOZ (0% in registry). HL7-FHIR R4 via Trembita → Shadow Record Tagging → Provenance Resource. HEAL ISR#6 KPIs exceeded: 624K MH (125%), 670K rehab (214%), 10.4M extended exams (297%), 118 mobile teams (157%).',
    },
    fix: {
      uk: "FEEL Again: одна інтеграція з ЄСОЗ → 7M+ сесій стають аудитними для всіх DLI THRIVE",
      en: 'FEEL Again: one ESOZ integration → 7M+ sessions become auditable for all THRIVE DLIs',
    },
  },
  {
    between: [2, 3],
    label: { uk: "З'єднання C", en: 'Connection C' },
    title: { uk: '$134M+ розблоковується', en: '$134M+ unlocks' },
    desc: {
      uk: "THRIVE P505616 (PforR $454M): $320M виплачено (70%). Залишок ~$134M потребує верифікованих outcome-метрик (PHQ-9, PCL-5, GAD-7) у ЄСОЗ. Прогрес: Dec 2024 аванс $220M + Dec 2025 +$19.5M (DLI виконано). Плани вже перевиконані — потрібно лише з'єднати 4.7M сесій із ЄСОЗ.",
      en: 'THRIVE P505616 (PforR $454M): $320M disbursed (70%). Remaining ~$134M requires verified outcome metrics (PHQ-9, PCL-5, GAD-7) in ESOZ. Progress: Dec 2024 advance $220M + Dec 2025 +$19.5M (DLI achieved). Plans already exceeded — just need to connect 4.7M sessions to ESOZ.',
    },
    fix: {
      uk: "FEEL Again: автоматичний PHQ-9/PCL-5 follow-up → DLI-звіт без ручної агрегації → $134M+ розблоковується",
      en: 'FEEL Again: automated PHQ-9/PCL-5 follow-up → DLI report without manual aggregation → $134M+ unlocks',
    },
  },
];

const WB_PROGRAMS = [
  { name: 'HEAL P180245', total: '$500M', disbursed: '$171M', pct: 34, color: '#e8c97a' },
  { name: 'THRIVE P505616', total: '$454M', disbursed: '~$320M', pct: 70, color: '#00d4aa' },
];

const L3_TOPICS = [
  { uk: 'FEEL AGAIN позиція', en: 'FEEL AGAIN position' },
  { uk: '6-шарова архітектура', en: '6-layer architecture' },
  { uk: 'HEAL ISR#6 KPI', en: 'HEAL ISR#6 KPIs' },
  { uk: 'Data Flow Architecture', en: 'Data Flow Architecture' },
  { uk: 'THRIVE P505616', en: 'THRIVE P505616' },
  { uk: 'HEAL C4 Procurement', en: 'HEAL C4 Procurement' },
];

// Connection flip card — teal scheme, shows positive FEEL Again solution
const ConnectionCard: React.FC<{ c: ConnectionItem; lang: Language; index: number }> = ({ c, lang, index }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      style={{ perspective: '1000px', cursor: 'pointer', height: '100%', width: '100%' }}
      onClick={() => setFlipped(f => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', height: '100%', width: '100%' }}
      >
        {/* Front */}
        <div style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          background: 'rgba(0,212,170,0.06)',
          border: '1px solid rgba(0,212,170,0.3)',
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
          textAlign: 'center',
        }}>
          <Link2 style={{ width: 14, height: 14, color: '#00d4aa', flexShrink: 0 }} />
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3 }}>
            {c.label[lang]}
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--color-ds-text)', lineHeight: 1.3 }}>
            {c.title[lang]}
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(200,208,220,0.4)', marginTop: 2 }}>
            {lang === 'uk' ? '↕ деталі' : '↕ details'}
          </div>
        </div>

        {/* Back */}
        <div style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          position: 'absolute',
          inset: 0,
          borderRadius: 10,
          background: 'rgba(0,212,170,0.08)',
          border: '1px solid rgba(0,212,170,0.4)',
          padding: '10px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          overflow: 'hidden',
        }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: '#00d4aa', flexShrink: 0, lineHeight: 1.3 }}>
            {c.title[lang]}
          </div>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 10,
            lineHeight: 1.5,
            color: 'rgba(200,208,220,0.85)',
            flex: 1,
            margin: 0,
            overflowY: 'auto',
          }}>
            {c.desc[lang]}
          </p>
          <div style={{ borderTop: '1px solid rgba(0,212,170,0.2)', paddingTop: 6, flexShrink: 0 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 8, fontWeight: 700, color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
              FEEL AGAIN FIX
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, lineHeight: 1.4, color: 'rgba(0,212,170,0.9)', margin: 0 }}>
              {c.fix[lang]}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Chart 1: State Budget structure
const StateBudgetChart: React.FC<{ lang: Language }> = ({ lang }) => {
  const data = BUDGET_SPLIT_DATA(lang);
  return (
    <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,123,110,0.2)' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        {lang === 'uk' ? 'Держбюджет — МОЗ структура' : 'State Budget — MoH structure'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
        {data.map((d) => (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--color-ds-muted)' }}>{d.name}</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: d.fill }}>{d.value}%</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.value}%` }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{ height: '100%', borderRadius: 999, background: d.fill }}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#ff7b6e', marginBottom: 6 }}>
        {lang === 'uk' ? '↑ 5× стаціонар vs реальна потреба 11%' : '↑ 5× inpatient vs actual need 11%'}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
        {lang === 'uk' ? 'Джерело: МОЗ бюджет 2024' : 'Source: MoH budget 2024'}
      </div>
    </div>
  );
};

// Chart 2: Humanitarian financing
const HumanitarianChart: React.FC<{ lang: Language }> = ({ lang }) => {
  const data = DONOR_DATA(lang);
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,164,92,0.2)' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        {lang === 'uk' ? 'Гуманітарне фінансування (млн USD)' : 'Humanitarian Financing (M USD)'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
        {data.map((d) => (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--color-ds-muted)' }}>{d.name}</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: d.fill }}>${d.value}M</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / max) * 100}%` }}
                transition={{ delay: 0.45, duration: 0.6 }}
                style={{ height: '100%', borderRadius: 999, background: d.fill }}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
        {lang === 'uk' ? 'Джерело: OCHA FTS 2025' : 'Source: OCHA FTS 2025'}
      </div>
    </div>
  );
};

// Chart 3: World Bank financing
const WBFinancingChart: React.FC<{ lang: Language }> = ({ lang }) => (
  <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,170,0.25)' }}>
    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
      {lang === 'uk' ? 'Фінансування Світового банку' : 'World Bank Financing'}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
      {WB_PROGRAMS.map((p) => (
        <div key={p.name}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--color-ds-muted)' }}>{p.name}</span>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: p.color }}>{p.pct}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 9, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${p.pct}%` }}
                transition={{ delay: 0.5, duration: 0.7 }}
                style={{ height: '100%', borderRadius: 999, background: p.color }}
              />
            </div>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', minWidth: 55 }}>{p.total}</span>
          </div>
        </div>
      ))}
    </div>
    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#00d4aa', marginBottom: 4 }}>
      {lang === 'uk' ? '↑ $134M+ розблоковується після ЄСОЗ-верифікації' : '↑ $134M+ unlocks after ESOZ verification'}
    </div>
    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
      {lang === 'uk' ? 'Джерело: WB HEAL P180245 / THRIVE P505616' : 'Source: WB HEAL P180245 / THRIVE P505616'}
    </div>
  </div>
);

export const L2Finance: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(0,212,170,0.07) 0%, transparent 55%), ' +
        'radial-gradient(ellipse 40% 40% at 80% 30%, rgba(200,164,92,0.08) 0%, transparent 50%), ' +
        'linear-gradient(135deg, #080f1c 0%, #0a1628 100%)',
    }}
  >
    <div className="h-px w-full flex-shrink-0" style={{
      background: 'linear-gradient(90deg, transparent, var(--color-ds-gold) 50%, transparent)',
      boxShadow: '0 0 14px rgba(200,164,92,0.45)',
    }} />

    {/* Header — no subtitle */}
    <div className="flex items-center gap-3 px-5 pt-4 pb-2 flex-shrink-0">
      <button
        onClick={nav.back}
        className="flex items-center gap-2 px-4 py-2 rounded-xl ds-display font-bold flex-shrink-0 transition-all"
        style={{
          background: 'rgba(200,164,92,0.16)',
          border: '2px solid var(--color-ds-gold)',
          color: 'var(--color-ds-gold)',
          fontSize: '12px',
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        {lang === 'uk' ? 'Назад' : 'Back'}
      </button>
      <div>
        <div className="text-[17px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>
          {lang === 'uk' ? 'Куди ресурси ідуть і куди вони не доходять' : "Where resources go and where they don't reach"}
        </div>
      </div>
    </div>

    <div className="flex-1 flex flex-col gap-3 px-5 pb-3 min-h-0">

      {/* TOP: 3 equal-width charts */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-shrink-0 flex gap-4"
      >
        <StateBudgetChart lang={lang} />
        <HumanitarianChart lang={lang} />
        <WBFinancingChart lang={lang} />
      </motion.div>

      {/* MIDDLE: Resource chain + connection flip cards */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--color-ds-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
          {lang === 'uk' ? 'ШЛЯХ РЕСУРСІВ — КЕЙС HEAL / THRIVE' : 'RESOURCE PATH — HEAL / THRIVE CASE'}
        </div>

        {/*
          7-column CSS grid: node(3fr) connection(2fr) node(3fr) connection(2fr) node(3fr) connection(2fr) node(3fr)
          Row 1 (auto): chain nodes in cols 1,3,5,7 — Link2 icons in cols 2,4,6
          Row 2 (1fr):  connection flip cards in cols 2,4,6
        */}
        <div
          className="flex-1 min-h-0"
          style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr 3fr 2fr 3fr 2fr 3fr',
            gridTemplateRows: 'auto 1fr',
            gap: '6px 8px',
          }}
        >
          {/* Row 1 — chain nodes */}
          {CHAIN_NODES.map((node, i) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              style={{
                gridColumn: i * 2 + 1,
                gridRow: 1,
                borderRadius: 12,
                padding: '12px 10px',
                background: node.id === 'result'
                  ? 'rgba(0,212,170,0.08)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${node.color}${node.id === 'result' ? '55' : '33'}`,
                boxShadow: node.id === 'result' ? '0 0 24px rgba(0,212,170,0.12)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: node.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                {node.label[lang]}
              </div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: node.id === 'result' ? 'clamp(20px, 2.2vw, 30px)' : 'clamp(14px, 1.5vw, 20px)',
                color: node.color,
                textShadow: node.id === 'result' ? `0 0 24px ${node.color}55` : 'none',
              }}>
                {node.amount}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', lineHeight: 1.4, marginTop: 6 }}>
                {node.sub[lang]}
              </div>
            </motion.div>
          ))}

          {/* Row 1 — Link2 connector icons in even columns */}
          {CONNECTIONS.map((c, i) => (
            <div
              key={`icon-${i}`}
              style={{
                gridColumn: i * 2 + 2,
                gridRow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 8,
                gap: 4,
              }}
            >
              <Link2 style={{ width: 13, height: 13, color: '#00d4aa' }} />
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1.2 }}>
                {c.label[lang]}
              </div>
              <div style={{ width: 1, height: 8, background: 'rgba(0,212,170,0.3)' }} />
            </div>
          ))}

          {/* Row 2 — connection flip cards in even columns */}
          {CONNECTIONS.map((c, i) => (
            <div
              key={`card-${i}`}
              style={{
                gridColumn: i * 2 + 2,
                gridRow: 2,
              }}
            >
              <ConnectionCard c={c} lang={lang} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM: L3 analytics transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex-shrink-0 flex items-center gap-3"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 10,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {lang === 'uk' ? 'Аналітичний звіт · 6 блоків · рівень L3' : 'Analytical Report · 6 blocks · L3 level'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
            {L3_TOPICS.map((t) => (
              <span
                key={t.en}
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 10,
                  color: 'rgba(200,208,220,0.5)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6,
                  padding: '2px 8px',
                }}
              >
                {t[lang]}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => nav.push('appendix')}
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            color: '#00d4aa',
            background: 'rgba(0,212,170,0.1)',
            border: '1px solid rgba(0,212,170,0.35)',
            borderRadius: 10,
            padding: '8px 16px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {lang === 'uk' ? '→ Аналітичний огляд' : '→ Analytical Overview'}
        </button>
      </motion.div>
    </div>
  </div>
);
