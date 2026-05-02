import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, AlertTriangle } from 'lucide-react';
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
    id: 'donor',
    label: { uk: 'Донор', en: 'Donor' },
    amount: '$1.87B',
    sub: { uk: 'OCHA FTS 2025 · HEAL+THRIVE+humanitarian', en: 'OCHA FTS 2025 · HEAL+THRIVE+humanitarian' },
    color: '#e8c97a',
  },
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
    between: [1, 2],
    label: { uk: 'Розрив A', en: 'Break A' },
    title: { uk: 'Алокація ↛ Провайдер', en: 'Allocation ↛ Provider' },
    desc: { uk: 'Гуманітарні гранти НУО не прив\'язані до ЄСОЗ-записів. Провайдери отримують кошти за активність (inputs), а не за підтверджені послуги. Немає єдиного ідентифікатора, що з\'єднує транзакцію з клінічним записом.', en: 'Humanitarian NGO grants are not linked to ESOZ records. Providers receive funding for activity inputs, not verified services. No shared identifier connects the financial transaction to the clinical record.' },
    fix: { uk: 'FEEL Again: кожна сесія у ЄСОЗ генерує верифікований токен → автоматичний disbursement-тригер', en: 'FEEL Again: every ESOZ session generates a verified token → automatic disbursement trigger' },
  },
  {
    between: [2, 3],
    label: { uk: 'Розрив B', en: 'Break B' },
    title: { uk: 'Провайдер ↛ Верифікація', en: 'Provider ↛ Verification' },
    desc: { uk: '260K НСЗУ-пацієнтів (2025) мають записи, але гуманітарні 4.7M сесій лишаються поза ЄСОЗ. Ручна верифікація MSF/WHO охоплює <5% потоку. Приватні клініки (303 Пакет 51): 1 НСЗУ-сесія → власний прайс → повна невидимість.', en: '260K NHSU patients (2025) have records, but humanitarian 4.7M sessions remain outside ESOZ. Manual MSF/WHO verification covers <5% of flow. Private clinics (303 Package 51): 1 NHSU session → own pricing → complete invisibility.' },
    fix: { uk: 'FEEL Again: HL7-FHIR міст CommCare/Kobo ↔ ЄСОЗ → усі 7M+ сесій стають аудитними', en: 'FEEL Again: HL7-FHIR bridge CommCare/Kobo ↔ ESOZ → all 7M+ sessions become auditable' },
  },
  {
    between: [3, 4],
    label: { uk: 'Розрив C', en: 'Break C' },
    title: { uk: 'Сесія ↛ Disbursement', en: 'Session ↛ Disbursement' },
    desc: { uk: 'WB THRIVE P505616 (PforR $454M): DLI-тригер = запис НСЗУ. Без верифікованих outcome-метрик (PCL-5, PHQ-9, GAD-7) наступний disbursement транш заблокований. Поточний стан: ~$320M disbursed (70%), решта ~$134M потребує outcome-звітності.', en: 'WB THRIVE P505616 (PforR $454M): DLI trigger = NHSU record. Without verified outcome metrics (PCL-5, PHQ-9, GAD-7) the next disbursement tranche is blocked. Current: ~$320M disbursed (70%), remaining ~$134M requires outcome reporting.' },
    fix: { uk: 'FEEL Again: автоматичний PHQ-9/PCL-5 follow-up → DLI-звіт без ручної агрегації', en: 'FEEL Again: automated PHQ-9/PCL-5 follow-up → DLI report without manual aggregation' },
  },
];

const WB_PROGRAMS = [
  { name: 'HEAL P180245', total: '$500M', disbursed: '$171M', pct: 34, note: { uk: 'Закриття 23.12.2026', en: 'Closing 23.12.2026' }, color: '#e8c97a' },
  { name: 'THRIVE P505616', total: '$454M', disbursed: '~$320M', pct: 70, note: { uk: 'DLI-тригер = НСЗУ-запис', en: 'DLI trigger = NHSU record' }, color: '#00d4aa' },
];

const FlipCard: React.FC<{ b: BreakItem; lang: Language; index: number }> = ({ b, lang, index }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      style={{ perspective: '1200px', cursor: 'pointer', height: '100%' }}
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
          borderRadius: 12,
          background: 'rgba(255,123,110,0.05)',
          border: '1px solid rgba(255,123,110,0.25)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <AlertTriangle style={{ width: 14, height: 14, flexShrink: 0, color: '#ff7b6e' }} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: '#ff7b6e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {b.label[lang]}
            </span>
          </div>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--color-ds-text)', lineHeight: 1.3 }}>
            {b.title[lang]}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(200,208,220,0.35)', textAlign: 'center' }}>
            {lang === 'uk' ? '↕ натисніть для деталей' : '↕ click for details'}
          </div>
        </div>

        {/* Back */}
        <div style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          background: 'rgba(255,123,110,0.08)',
          border: '1px solid rgba(255,123,110,0.4)',
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          overflow: 'hidden',
        }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#ff7b6e', flexShrink: 0 }}>
            {b.title[lang]}
          </div>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, lineHeight: 1.5, color: 'rgba(200,208,220,0.85)', flex: 1, margin: 0, overflow: 'hidden' }}>
            {b.desc[lang]}
          </p>
          <div style={{ borderTop: '1px solid rgba(0,212,170,0.2)', paddingTop: 8, flexShrink: 0 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, fontWeight: 700, color: '#00d4aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              FEEL AGAIN FIX
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, lineHeight: 1.4, color: 'rgba(0,212,170,0.85)', margin: 0 }}>
              {b.fix[lang]}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BudgetSplit: React.FC<{ lang: Language }> = ({ lang }) => {
  const data = BUDGET_SPLIT_DATA(lang);
  return (
    <div style={{ flex: 1, borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,123,110,0.2)' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        {lang === 'uk' ? 'Бюджет МЗ — структурна інверсія (МОЗ 2025)' : 'MH budget — structural inversion (MoH 2025)'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((d) => (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--color-ds-muted)' }}>{d.name}</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: d.fill }}>{d.value}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.value}%` }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{ height: '100%', borderRadius: 999, background: d.fill }}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: '#ff7b6e' }}>
        {lang === 'uk' ? '↑ 5× стаціонар vs реальна клінічна потреба 11%' : '↑ 5× inpatient vs actual clinical need 11%'}
      </div>
    </div>
  );
};

const DonorBar: React.FC<{ lang: Language }> = ({ lang }) => {
  const data = DONOR_DATA(lang);
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ flex: 1, borderRadius: 12, padding: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,164,92,0.2)' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
        {lang === 'uk' ? 'Донорський портфель (млн USD)' : 'Donor portfolio (M USD)'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {data.map((d) => (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--color-ds-muted)' }}>{d.name}</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: d.fill }}>${d.value}M</span>
            </div>
            <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / max) * 100}%` }}
                transition={{ delay: 0.85, duration: 0.6 }}
                style={{ height: '100%', borderRadius: 999, background: d.fill }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
            ? '$1.87B у системі — 3 розриви, чому $0 надходить МОЗ від Світового банку українцям'
            : '$1.87B in the system — 3 breaks, why $0 reaches MoH from World Bank for Ukrainians'}
        </div>
      </div>
    </div>

    <div className="flex-1 flex flex-col gap-3 px-5 pb-4 min-h-0">

      {/* Resource path chain */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0"
      >
        <div className="cyber-label mb-2" style={{ color: 'var(--color-ds-gold)' }}>
          {lang === 'uk' ? 'ШЛЯХ РЕСУРСІВ — 5 ЛАНОК' : 'RESOURCE PATH — 5 LINKS'}
        </div>
        <div className="flex items-stretch gap-0">
          {CHAIN_NODES.map((node, i) => {
            const breakAfter = BREAKS.find(b => b.between[0] === i);
            return (
              <React.Fragment key={node.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-1 rounded-xl p-3 flex flex-col items-center text-center"
                  style={{
                    background: node.id === 'result' ? 'rgba(255,123,110,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${node.color}${node.id === 'result' ? '66' : '33'}`,
                    boxShadow: node.id === 'result' ? '0 0 24px rgba(255,123,110,0.15)' : 'none',
                  }}
                >
                  <div className="cyber-label mb-1" style={{ color: node.color, fontSize: '10px' }}>{node.label[lang]}</div>
                  <div className="ds-display font-bold" style={{
                    fontSize: node.id === 'result' ? 'clamp(20px, 2.5vw, 30px)' : 'clamp(14px, 1.8vw, 20px)',
                    color: node.color,
                    textShadow: node.id === 'result' ? `0 0 24px ${node.color}66` : 'none',
                  }}>
                    {node.amount}
                  </div>
                  <div className="ds-body mt-1" style={{ fontSize: '10px', color: 'var(--color-ds-muted)', lineHeight: 1.3 }}>
                    {node.sub[lang]}
                  </div>
                </motion.div>

                {i < CHAIN_NODES.length - 1 && (
                  <div className="flex items-center flex-shrink-0 px-1" style={{ minWidth: '28px' }}>
                    {breakAfter ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <AlertTriangle className="w-4 h-4" style={{ color: '#ff7b6e' }} />
                        <div style={{ fontSize: '10px', color: '#ff7b6e', fontWeight: 700 }} className="ds-display">
                          {breakAfter.label[lang]}
                        </div>
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-ds-border)' }} />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      {/* Flip cards — break points */}
      <div className="flex flex-col gap-2 min-h-0 flex-1" style={{ minHeight: 120 }}>
        <div className="cyber-label flex-shrink-0" style={{ color: '#ff7b6e' }}>
          {lang === 'uk' ? 'ТРИ ТОЧКИ РОЗРИВУ' : 'THREE BREAK POINTS'}
        </div>
        <div
          className="flex-1 grid grid-cols-3 gap-3 min-h-0"
          style={{ gridTemplateRows: '1fr' }}
        >
          {BREAKS.map((b, i) => (
            <FlipCard key={b.label.en} b={b} lang={lang} index={i} />
          ))}
        </div>
      </div>

      {/* Bottom: BudgetSplit + DonorBar + WB status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex-shrink-0 flex gap-3"
      >
        <BudgetSplit lang={lang} />
        <DonorBar lang={lang} />

        <div className="flex flex-col gap-2 flex-shrink-0" style={{ width: 210 }}>
          {WB_PROGRAMS.map((p) => (
            <div key={p.name} className="flex-1 rounded-xl px-3 py-2.5 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${p.color}33` }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="ds-display font-bold" style={{ fontSize: '11px', color: p.color }}>{p.name}</div>
                <div className="ds-body" style={{ fontSize: '10px', color: 'var(--color-ds-muted)' }}>{p.total} · {p.disbursed}</div>
              </div>
              <div style={{ width: 46, flexShrink: 0 }}>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct}%` }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: p.color }}
                  />
                </div>
              </div>
              <div className="ds-display font-bold flex-shrink-0" style={{ fontSize: '14px', color: p.color }}>{p.pct}%</div>
            </div>
          ))}
          <div className="ds-body" style={{ fontSize: '10px', color: 'var(--color-ds-muted)', lineHeight: 1.4 }}>
            {lang === 'uk'
              ? 'Джерело: OCHA FTS 2025 · WB PAD 2024 · МОЗ бюджет 2024 · НСЗУ тарифи 2025'
              : 'Source: OCHA FTS 2025 · WB PAD 2024 · MoH budget 2024 · NHSU tariffs 2025'}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);
