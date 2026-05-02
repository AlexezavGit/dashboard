import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { BUDGET_SPLIT_DATA, DONOR_DATA } from '../../constants';

interface Props { lang: Language; nav: ScreenNav; }

// Five nodes in the money chain
const CHAIN_NODES = [
  {
    id: 'donor',
    label: { uk: 'Донор', en: 'Donor' },
    amount: '$1.87B',
    sub: { uk: 'OCHA FTS 2025 · humanitarian + WB', en: 'OCHA FTS 2025 · humanitarian + WB' },
    color: '#e8c97a',
  },
  {
    id: 'alloc',
    label: { uk: 'Алокація', en: 'Allocation' },
    amount: '~$420M',
    sub: { uk: 'MHPSS-специфічні програми', en: 'MHPSS-specific programmes' },
    color: '#e8c97a',
  },
  {
    id: 'provider',
    label: { uk: 'Провайдер', en: 'Provider' },
    amount: '4,000+',
    sub: { uk: 'контрагентів НСЗУ + НУО', en: 'NHSU contractors + NGOs' },
    color: '#e8c97a',
  },
  {
    id: 'session',
    label: { uk: 'Сесія', en: 'Session' },
    amount: '~7M/рік',
    sub: { uk: 'задокументованих (оцінка)', en: 'documented sessions (estimate)' },
    color: '#e8c97a',
  },
  {
    id: 'result',
    label: { uk: 'Результат', en: 'Result' },
    amount: '$0',
    sub: { uk: 'верифікованих outcome-виплат', en: 'verified outcome-based payments' },
    color: '#ff7b6e',
  },
];

// Three break points between nodes (between indices 1-2, 2-3, 3-4)
const BREAKS = [
  {
    between: [1, 2] as [number, number],
    label:   { uk: 'Розрив A', en: 'Break A' },
    title:   { uk: 'Алокація ↛ Провайдер', en: 'Allocation ↛ Provider' },
    desc:    { uk: 'Гуманітарні гранти НУО не прив\'язані до ЄСОЗ-записів. Провайдери отримують кошти за активність (inputs), а не за підтверджені послуги. Немає єдиного ідентифікатора, що з\'єднує транзакцію з клінічним записом.', en: 'Humanitarian NGO grants are not linked to ESOZ records. Providers receive funding for activity inputs, not verified services. No shared identifier connects the financial transaction to the clinical record.' },
    fix:     { uk: 'FEEL Again: кожна сесія у ЄСОЗ генерує верифікований токен → автоматичний disbursement-тригер', en: 'FEEL Again: every ESOZ session generates a verified token → automatic disbursement trigger' },
    color: '#ff7b6e',
  },
  {
    between: [2, 3] as [number, number],
    label:   { uk: 'Розрив B', en: 'Break B' },
    title:   { uk: 'Провайдер ↛ Верифікація', en: 'Provider ↛ Verification' },
    desc:    { uk: '260K НСЗУ-пацієнтів (2025) мають записи, але гуманітарні 4.7M сесій лишаються поза ЄСОЗ. Ручна верифікація MSF/WHO охоплює <5% потоку. Приватні клініки (303 Пакет 51): 1 НСЗУ-сесія → власний прайс → повна невидимість.', en: '260K NHSU patients (2025) have records, but humanitarian 4.7M sessions remain outside ESOZ. Manual MSF/WHO verification covers <5% of flow. Private clinics (303 Package 51): 1 NHSU session → own pricing → complete invisibility.' },
    fix:     { uk: 'FEEL Again: HL7-FHIR міст CommCare/Kobo ↔ ЄСОЗ → усі 7M+ сесій стають аудитними', en: 'FEEL Again: HL7-FHIR bridge CommCare/Kobo ↔ ESOZ → all 7M+ sessions become auditable' },
    color: '#ff7b6e',
  },
  {
    between: [3, 4] as [number, number],
    label:   { uk: 'Розрив C', en: 'Break C' },
    title:   { uk: 'Сесія ↛ Disbursement', en: 'Session ↛ Disbursement' },
    desc:    { uk: 'WB THRIVE P505616 (PforR $454M): DLI-тригер = запис НСЗУ. Без верифікованих outcome-метрик (PCL-5, PHQ-9, GAD-7) наступний disbursement транш заблокований. Поточний стан: ~$320M disbursed (70%), решта ~$134M потребує outcome-звітності.', en: 'WB THRIVE P505616 (PforR $454M): DLI trigger = NHSU record. Without verified outcome metrics (PCL-5, PHQ-9, GAD-7) the next disbursement tranche is blocked. Current: ~$320M disbursed (70%), remaining ~$134M requires outcome reporting.' },
    fix:     { uk: 'FEEL Again: автоматичний PHQ-9/PCL-5 follow-up → DLI-звіт без ручної агрегації', en: 'FEEL Again: automated PHQ-9/PCL-5 follow-up → DLI report without manual aggregation' },
    color: '#ff7b6e',
  },
];

// WB programme context
const WB_PROGRAMS = [
  { name: 'HEAL P180245', total: '$500M', disbursed: '$171M', pct: 34, note: { uk: 'Закриття 23.12.2026', en: 'Closing 23.12.2026' }, color: '#e8c97a' },
  { name: 'THRIVE P505616', total: '$454M', disbursed: '~$320M', pct: 70, note: { uk: 'DLI-тригер = НСЗУ-запис', en: 'DLI trigger = NHSU record' }, color: '#00d4aa' },
];

const BudgetSplit: React.FC<{ lang: Language }> = ({ lang }) => {
  const data = BUDGET_SPLIT_DATA(lang);
  return (
    <div className="flex-1 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,123,110,0.2)' }}>
      <div className="ds-display font-bold mb-2" style={{ fontSize: '9px', color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {lang === 'uk' ? 'Бюджет МЗ — структурна інверсія (МОЗ 2025)' : 'MH budget — structural inversion (MoH 2025)'}
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.name}>
            <div className="flex justify-between mb-0.5">
              <span className="ds-body" style={{ fontSize: '9px', color: 'var(--color-ds-muted)' }}>{d.name}</span>
              <span className="ds-display font-bold" style={{ fontSize: '10px', color: d.fill }}>{d.value}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.value}%` }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="h-full rounded-full"
                style={{ background: d.fill }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 ds-body" style={{ fontSize: '8px', color: '#ff7b6e' }}>
        {lang === 'uk' ? '↑ 5× стаціонар vs реальна клінічна потреба 11%' : '↑ 5× inpatient vs actual clinical need 11%'}
      </div>
    </div>
  );
};

const DonorBar: React.FC<{ lang: Language }> = ({ lang }) => {
  const data = DONOR_DATA(lang);
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex-1 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,164,92,0.2)' }}>
      <div className="ds-display font-bold mb-2" style={{ fontSize: '9px', color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {lang === 'uk' ? 'Донорський портфель (млн USD)' : 'Donor portfolio (M USD)'}
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.name}>
            <div className="flex justify-between mb-0.5">
              <span className="ds-body" style={{ fontSize: '9px', color: 'var(--color-ds-muted)' }}>{d.name}</span>
              <span className="ds-display font-bold" style={{ fontSize: '10px', color: d.fill }}>${d.value}M</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(d.value / max) * 100}%` }}
                transition={{ delay: 0.85, duration: 0.6 }}
                className="h-full rounded-full"
                style={{ background: d.fill }}
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

    {/* ── Header ── */}
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
          {lang === 'uk' ? 'Як влаштований грошовий потік?' : 'How is the money flow structured?'}
        </div>
        <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
          {lang === 'uk'
            ? '$1.87B у системі — де саме ланцюг розривається і чому результат $0 верифікованих виплат'
            : '$1.87B in the system — exactly where the chain breaks and why the result is $0 verified payments'}
        </div>
      </div>
    </div>

    <div className="flex-1 flex flex-col gap-3 px-5 pb-3 min-h-0">

      {/* ── Money chain ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0"
      >
        <div className="cyber-label mb-2" style={{ color: 'var(--color-ds-gold)' }}>
          {lang === 'uk' ? 'ЛАНЦЮГ ФІНАНСУВАННЯ — 5 ЛАНОК' : 'FUNDING CHAIN — 5 LINKS'}
        </div>
        <div className="flex items-stretch gap-0">
          {CHAIN_NODES.map((node, i) => {
            const breakAfter = BREAKS.find(b => b.between[0] === i);
            return (
              <React.Fragment key={node.id}>
                {/* Node */}
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
                  <div className="cyber-label mb-1" style={{ color: node.color, fontSize: '8px' }}>{node.label[lang]}</div>
                  <div className="ds-display font-bold" style={{
                    fontSize: node.id === 'result' ? 'clamp(20px, 2.5vw, 30px)' : 'clamp(14px, 1.8vw, 20px)',
                    color: node.color,
                    textShadow: node.id === 'result' ? `0 0 24px ${node.color}66` : 'none',
                  }}>
                    {node.amount}
                  </div>
                  <div className="ds-body mt-1" style={{ fontSize: '8px', color: 'var(--color-ds-muted)', lineHeight: 1.3 }}>
                    {node.sub[lang]}
                  </div>
                </motion.div>

                {/* Arrow or break indicator */}
                {i < CHAIN_NODES.length - 1 && (
                  <div className="flex items-center flex-shrink-0 px-1" style={{ minWidth: '28px' }}>
                    {breakAfter ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <AlertTriangle className="w-4 h-4" style={{ color: '#ff7b6e' }} />
                        <div style={{ fontSize: '7px', color: '#ff7b6e', fontWeight: 700 }} className="ds-display">
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

      {/* ── Three break points ── */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <div className="cyber-label flex-shrink-0" style={{ color: '#ff7b6e' }}>
          {lang === 'uk' ? 'ТРИ ТОЧКИ РОЗРИВУ' : 'THREE BREAK POINTS'}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
          {BREAKS.map((b, i) => (
            <motion.div
              key={b.label.en}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl p-4 flex flex-col"
              style={{
                background: 'rgba(255,123,110,0.05)',
                border: '1px solid rgba(255,123,110,0.25)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#ff7b6e' }} />
                <span className="ds-display font-bold" style={{ fontSize: '12px', color: '#ff7b6e' }}>
                  {b.title[lang]}
                </span>
              </div>
              <p className="ds-body flex-1" style={{ fontSize: '10px', lineHeight: 1.5, color: 'rgba(200,208,220,0.80)' }}>
                {b.desc[lang]}
              </p>
              <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(0,212,170,0.18)' }}>
                <div className="cyber-label mb-1" style={{ color: '#00d4aa', fontSize: '7px' }}>
                  {lang === 'uk' ? 'FEEL AGAIN FIX' : 'FEEL AGAIN FIX'}
                </div>
                <p className="ds-body" style={{ fontSize: '9px', lineHeight: 1.4, color: 'rgba(0,212,170,0.85)' }}>
                  {b.fix[lang]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom: budget structure + WB status ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex-shrink-0 flex gap-3"
      >
        {/* Budget inversion */}
        <BudgetSplit lang={lang} />

        {/* Donor structure */}
        <DonorBar lang={lang} />

        {/* WB programme pills */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {WB_PROGRAMS.map((p) => (
            <div key={p.name} className="flex-1 rounded-xl px-3 py-2 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${p.color}33` }}>
              <div>
                <div className="ds-display font-bold" style={{ fontSize: '10px', color: p.color }}>{p.name}</div>
                <div className="ds-body" style={{ fontSize: '8px', color: 'var(--color-ds-muted)' }}>{p.total}</div>
              </div>
              <div style={{ width: 70 }}>
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
              <div className="ds-display font-bold" style={{ fontSize: '13px', color: p.color }}>{p.pct}%</div>
              <div className="ds-body" style={{ fontSize: '8px', color: 'var(--color-ds-muted)', maxWidth: '80px' }}>
                {p.note[lang]}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);
