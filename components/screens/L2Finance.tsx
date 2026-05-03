import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { BUDGET_SPLIT_DATA, DONOR_DATA } from '../../constants';

interface Props { lang: Language; nav: ScreenNav; }

type BreakItem = {
  between: [number, number];
  label: { uk: string; en: string };
  title: { uk: string; en: string };
  desc: { uk: string; en: string };
  fix: { uk: string; en: string };
};

const CHAIN_NODES = [
  {
    id: 'alloc',
    label: { uk: 'Алокація', en: 'Allocation' },
    amount: '~$420M',
    sub: { uk: 'OCHA FTS MHPSS-теговані · WB HEAL P180245 + THRIVE P505616', en: 'OCHA FTS MHPSS-tagged · WB HEAL P180245 + THRIVE P505616' },
    color: '#e8c97a',
  },
  {
    id: 'provider',
    label: { uk: 'Провайдер', en: 'Provider' },
    amount: '4,000+',
    sub: { uk: 'НСЗУ реєстр MHPSS провайдерів 2025', en: 'NHSU MHPSS provider registry 2025' },
    color: '#e8c97a',
  },
  {
    id: 'session',
    label: { uk: 'Сесія', en: 'Session' },
    amount: '~7M/рік',
    sub: { uk: 'CommCare 2.1M + ActivityInfo 1.8M + ЄСОЗ 260K + оцінка', en: 'CommCare 2.1M + ActivityInfo 1.8M + ESOZ 260K + estimate' },
    color: '#e8c97a',
  },
  {
    id: 'result',
    label: { uk: 'До МОЗ / українців', en: 'To MoH / Ukrainians' },
    amount: '$0',
    sub: { uk: 'надходжень від Світ. банку на розвиток клін. псих. допомоги', en: 'from World Bank for clinical psychology development' },
    color: '#ff7b6e',
  },
];

const BREAKS: BreakItem[] = [
  {
    between: [0, 1],
    label: { uk: 'Розєднання A', en: 'Disconnect A' },
    title: { uk: 'Алокація ↛ Провайдер', en: 'Allocation ↛ Provider' },
    desc: { uk: 'Гуманітарні гранти НУО не прив\'язані до ЄСОЗ-записів. Провайдери отримують кошти за активність (inputs), а не за підтверджені послуги. Немає єдиного ідентифікатора, що з\'єднує транзакцію з клінічним записом.', en: 'Humanitarian NGO grants are not linked to ESOZ records. Providers receive funding for activity inputs, not verified services. No shared identifier connects the financial transaction to the clinical record.' },
    fix: { uk: 'FEEL Again: кожна сесія у ЄСОЗ генерує верифікований токен → автоматичний disbursement-тригер', en: 'FEEL Again: every ESOZ session generates a verified token → automatic disbursement trigger' },
  },
  {
    between: [1, 2],
    label: { uk: 'Розєднання B', en: 'Disconnect B' },
    title: { uk: 'Провайдер ↛ Верифікація', en: 'Provider ↛ Verification' },
    desc: { uk: '260K НСЗУ-пацієнтів (2025) мають записи, але гуманітарні 4.7M сесій лишаються поза ЄСОЗ. Ручна верифікація MSF/WHO охоплює <5% потоку. Приватні клініки (303 Пакет 51): 1 НСЗУ-сесія → власний прайс → повна невидимість.', en: '260K NHSU patients (2025) have records, but humanitarian 4.7M sessions remain outside ESOZ. Manual MSF/WHO verification covers <5% of flow. Private clinics (303 Package 51): 1 NHSU session → own pricing → complete invisibility.' },
    fix: { uk: 'FEEL Again: HL7-FHIR міст CommCare/Kobo ↔ ЄСОЗ → усі 7M+ сесій стають аудитними', en: 'FEEL Again: HL7-FHIR bridge CommCare/Kobo ↔ ESOZ → all 7M+ sessions become auditable' },
  },
  {
    between: [2, 3],
    label: { uk: 'Розєднання C', en: 'Disconnect C' },
    title: { uk: 'Сесія ↛ Disbursement', en: 'Session ↛ Disbursement' },
    desc: { uk: 'WB THRIVE P505616 (PforR $454M): DLI-тригер = запис НСЗУ. Без верифікованих outcome-метрик (PCL-5, PHQ-9, GAD-7) наступний disbursement транш заблокований. Поточний стан: ~$320M disbursed (70%), решта ~$134M потребує outcome-звітності.', en: 'WB THRIVE P505616 (PforR $454M): DLI trigger = NHSU record. Without verified outcome metrics (PCL-5, PHQ-9, GAD-7) the next disbursement tranche is blocked. Current: ~$320M disbursed (70%), remaining ~$134M requires outcome reporting.' },
    fix: { uk: 'FEEL Again: автоматичний PHQ-9/PCL-5 follow-up → DLI-звіт без ручної агрегації', en: 'FEEL Again: automated PHQ-9/PCL-5 follow-up → DLI report without manual aggregation' },
  },
];

const WB_PROGRAMS = [
  { name: 'HEAL P180245', total: '$500M', disbursed: '$171M', pct: 34, color: '#e8c97a' },
  { name: 'THRIVE P505616', total: '$454M', disbursed: '~$320M', pct: 70, color: '#00d4aa' },
];

// Flip card embedded in the connector column (portrait orientation)
const FlipCard: React.FC<{ b: BreakItem; lang: Language; index: number }> = ({ b, lang, index }) => {
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
          background: 'rgba(255,123,110,0.07)',
          border: '1px solid rgba(255,123,110,0.3)',
          padding: '10px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          textAlign: 'center',
        }}>
          <AlertTriangle style={{ width: 15, height: 15, color: '#ff7b6e', flexShrink: 0 }} />
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: '#ff7b6e', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.3 }}>
            {b.label[lang]}
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--color-ds-text)', lineHeight: 1.3 }}>
            {b.title[lang]}
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
          background: 'rgba(255,123,110,0.1)',
          border: '1px solid rgba(255,123,110,0.45)',
          padding: '10px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          overflow: 'hidden',
        }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: '#ff7b6e', flexShrink: 0, lineHeight: 1.3 }}>
            {b.title[lang]}
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
            {b.desc[lang]}
          </p>
          <div style={{ borderTop: '1px solid rgba(0,212,170,0.2)', paddingTop: 6, flexShrink: 0 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 8, fontWeight: 700, color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
              FEEL AGAIN FIX
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, lineHeight: 1.4, color: 'rgba(0,212,170,0.9)', margin: 0 }}>
              {b.fix[lang]}
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
  <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,164,92,0.2)' }}>
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
        'radial-gradient(ellipse 60% 50% at 30% 60%, rgba(200,164,92,0.10) 0%, transparent 55%), ' +
        'radial-gradient(ellipse 40% 40% at 80% 30%, rgba(255,123,110,0.08) 0%, transparent 50%), ' +
        'linear-gradient(135deg, #080f1c 0%, #0a1628 100%)',
    }}
  >
    <div className="h-px w-full flex-shrink-0" style={{
      background: 'linear-gradient(90deg, transparent, var(--color-ds-gold) 50%, transparent)',
      boxShadow: '0 0 14px rgba(200,164,92,0.45)',
    }} />

    {/* Header */}
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
        <div className="text-[11px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          {lang === 'uk'
            ? '$1.87B у системі — 3 розєднання, чому $0 надходить МОЗ від Світового банку українцям'
            : '$1.87B in the system — 3 disconnects, why $0 reaches MoH from World Bank for Ukrainians'}
        </div>
      </div>
    </div>

    <div className="flex-1 flex flex-col gap-3 px-5 pb-4 min-h-0">

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

      {/* BOTTOM: Resource chain + flip cards (Option B grid) */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--color-ds-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
          {lang === 'uk' ? 'ШЛЯХ РЕСУРСІВ — 4 ЛАНКИ' : 'RESOURCE PATH — 4 LINKS'}
        </div>

        {/*
          7-column CSS grid: node(3fr) gap(2fr) node(3fr) gap(2fr) node(3fr) gap(2fr) node(3fr)
          Row 1 (auto): chain nodes in odd cols, connector ⚠ icon in even cols
          Row 2 (1fr):  flip cards in even cols, empty in odd cols
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
                background: node.id === 'result' ? 'rgba(255,123,110,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${node.color}${node.id === 'result' ? '66' : '33'}`,
                boxShadow: node.id === 'result' ? '0 0 24px rgba(255,123,110,0.15)' : 'none',
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
                fontSize: node.id === 'result' ? 'clamp(22px, 2.4vw, 32px)' : 'clamp(15px, 1.6vw, 22px)',
                color: node.color,
                textShadow: node.id === 'result' ? `0 0 24px ${node.color}66` : 'none',
              }}>
                {node.amount}
              </div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', lineHeight: 1.4, marginTop: 6 }}>
                {node.sub[lang]}
              </div>
            </motion.div>
          ))}

          {/* Row 1 — connector icons in even columns (2, 4, 6) */}
          {BREAKS.map((b, i) => (
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
              <AlertTriangle style={{ width: 14, height: 14, color: '#ff7b6e' }} />
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 9, color: '#ff7b6e', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1.2 }}>
                {b.label[lang]}
              </div>
              {/* vertical connector line down to flip card */}
              <div style={{ width: 1, height: 8, background: 'rgba(255,123,110,0.3)' }} />
            </div>
          ))}

          {/* Row 2 — flip cards in even columns (2, 4, 6) */}
          {BREAKS.map((b, i) => (
            <div
              key={`card-${i}`}
              style={{
                gridColumn: i * 2 + 2,
                gridRow: 2,
              }}
            >
              <FlipCard b={b} lang={lang} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
