import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

type GapId = 'info' | 'interop' | 'admin' | 'cap' | 'budget' | 'path' | 'fin' | 'ops' | 'human';
type Cluster = 'data' | 'capacity' | 'accountability';

interface Gap {
  id: GapId;
  cluster: Cluster;
  color: string;
  icon: string;
  label: { uk: string; en: string };
  val: string;
  valLabel: { uk: string; en: string };
  oneliner: { uk: string; en: string };
  source: { uk: string; en: string };
  calc: { uk: string; en: string };
  chainsTo: GapId[];
}

const CLUSTER_META: Record<Cluster, { uk: string; en: string; color: string }> = {
  data:           { uk: 'КЛАСТЕР: ДАНІ',         en: 'CLUSTER: DATA',           color: '#a78bfa' },
  capacity:       { uk: 'КЛАСТЕР: ПОТУЖНІСТЬ',   en: 'CLUSTER: CAPACITY',       color: '#e8c97a' },
  accountability: { uk: 'КЛАСТЕР: ПІДЗВІТНІСТЬ', en: 'CLUSTER: ACCOUNTABILITY', color: '#ff7b6e' },
};

const GAPS: Gap[] = [
  // ── DATA cluster ──────────────────────────────────────────────────────────
  {
    id: 'info', cluster: 'data', color: '#e8c97a', icon: '📊',
    label:    { uk: 'Інформаційний',    en: 'Informational' },
    val: '0', valLabel: { uk: 'авт. передач між системами', en: 'automated data transfers' },
    oneliner: { uk: 'CommCare/Kobo/ActivityInfo → ЄСОЗ: нульова синхронізація', en: 'CommCare/Kobo/ActivityInfo → ESOZ: zero synchronisation' },
    source:   { uk: 'WHO MHPSS Координація УА 2024; MSF IT Survey n=312', en: 'WHO MHPSS Coordination UA 2024; MSF IT Survey n=312' },
    calc:     { uk: '3 гуманітарні системи × 0 API-з\'єднань → 4.7M сесій/рік невидимі для ЄСОЗ → не рахуються для THRIVE DLI', en: '3 humanitarian systems × 0 API connections → 4.7M sessions/yr invisible to ESOZ → not counted for THRIVE DLI' },
    chainsTo: ['admin', 'interop'],
  },
  {
    id: 'interop', cluster: 'data', color: '#a78bfa', icon: '🔌',
    label:    { uk: 'Інтероперабельність', en: 'Interoperability' },
    val: '5', valLabel: { uk: 'систем, 0 з\'єднань', en: 'systems, 0 connections' },
    oneliner: { uk: 'ЄСОЗ↔CommCare↔ActivityInfo↔Kobo↔Тіньовий: повна ізоляція', en: 'ESOZ↔CommCare↔ActivityInfo↔Kobo↔Shadow: complete isolation' },
    source:   { uk: 'ЄСОЗ Технічна Документація 2024; MHPSS IM WG Звіт', en: 'ESOZ Technical Documentation 2024; MHPSS IM WG Report' },
    calc:     { uk: '5 платформ × 0 HL7-FHIR ендпоінтів → дані в 5 ізольованих «озерах»; жодного спільного ідентифікатора пацієнта', en: '5 platforms × 0 HL7-FHIR endpoints → data in 5 isolated lakes; no shared patient identifier' },
    chainsTo: ['info', 'admin'],
  },
  {
    id: 'admin', cluster: 'data', color: '#2ec4b6', icon: '📋',
    label:    { uk: 'Адміністративний', en: 'Administrative' },
    val: '22%', valLabel: { uk: 'часу — подвійна робота', en: 'time on duplication' },
    oneliner: { uk: '3.5 год/тиж × 35K фахівців = 6.4M годин/рік витрачено даремно', en: '3.5 hrs/wk × 35K specialists = 6.4M hrs/yr wasted' },
    source:   { uk: 'MSF Operational Survey 2024 (n=312 спеціалісти)', en: 'MSF Operational Survey 2024 (n=312 specialists)' },
    calc:     { uk: '3.5 год × 35,000 × 52 тижні = 6.37M год → ~$5.6M/рік (по $0.88/год) → ціль FEEL Again: 22%→7% = +45K сесій/міс', en: '3.5 hrs × 35,000 × 52 wks = 6.37M hrs → ~$5.6M/yr (at $0.88/hr) → FEEL Again target: 22%→7% = +45K sessions/mo' },
    chainsTo: ['cap', 'path'],
  },
  // ── CAPACITY cluster ──────────────────────────────────────────────────────
  {
    id: 'cap', cluster: 'capacity', color: '#ff7b6e', icon: '🏥',
    label:    { uk: 'Місткісний', en: 'Capacity' },
    val: '0.28%', valLabel: { uk: 'клінічної потреби покрито', en: 'of clinical need covered' },
    oneliner: { uk: '5M доступних сесій vs 62.4M необхідних/рік — розрив 57.4M', en: '5M available vs 62.4M needed sessions/yr — gap of 57.4M' },
    source:   { uk: 'WHO MHPSS Atlas 2023; NHSU Пакет 51 2025; Lancet Mental Health', en: 'WHO MHPSS Atlas 2023; NHSU Package 51 2025; Lancet Mental Health' },
    calc:     { uk: '4,000 ЄСОЗ-фахівців × 1,250 сес/рік = 5M; 3.9M осіб × 16 сес = 62.4M потреба; 5M/62.4M = 8% → з діагн. фільтром 0.28%', en: '4,000 ESOZ specialists × 1,250 sessions/yr = 5M; 3.9M people × 16 sessions = 62.4M need; 5M/62.4M = 8% → with diagnostic filter 0.28%' },
    chainsTo: ['budget', 'path'],
  },
  {
    id: 'budget', cluster: 'capacity', color: '#a78bfa', icon: '⚖️',
    label:    { uk: 'Бюджетний', en: 'Budget' },
    val: '8.1:1', valLabel: { uk: 'стаціонар:амбулаторне', en: 'inpatient:outpatient' },
    oneliner: { uk: '55% бюджету — стаціонар; 71% попиту — амбулаторні послуги', en: '55% budget inpatient; 71% demand is outpatient services' },
    source:   { uk: 'МОЗ Бюджет 2025; WHO Optimal Mix of Care; NHSU Пакет 51', en: 'MoH Health Budget 2025; WHO Optimal Mix of Care; NHSU Package 51' },
    calc:     { uk: '₴5.6B спец. бюджет 2026: ₴3.1B стаціонар (55%) vs ₴1.5B амбулатор (27%); WHO рекомендує ≤30% стаціонар', en: '₴5.6B specialty budget 2026: ₴3.1B inpatient (55%) vs ₴1.5B outpatient (27%); WHO recommends ≤30% inpatient' },
    chainsTo: ['cap', 'path'],
  },
  {
    id: 'path', cluster: 'capacity', color: '#e8c97a', icon: '🛤️',
    label:    { uk: 'Шлях клієнта', en: 'Client Pathway' },
    val: '54%', valLabel: { uk: 'не завершують курс', en: 'do not complete treatment' },
    oneliner: { uk: '78% переходів між рівнями — без направлення; маршрутизація вгадкою', en: '78% transitions between levels — without referral; navigation by guesswork' },
    source:   { uk: 'NHSU Patient Journey Analysis 2024; WHO Stepped-Care Guidelines', en: 'NHSU Patient Journey Analysis 2024; WHO Stepped-Care Guidelines' },
    calc:     { uk: '100 → 46 завершили курс → 54 дропаут; 78% переходів без офіційного направлення → дублювання первинного прийому', en: '100 → 46 completed → 54 dropout; 78% transitions without formal referral → duplicate initial assessments' },
    chainsTo: ['admin', 'ops'],
  },
  // ── ACCOUNTABILITY cluster ────────────────────────────────────────────────
  {
    id: 'fin', cluster: 'accountability', color: '#ff7b6e', icon: '💰',
    label:    { uk: 'Фінансовий', en: 'Financial' },
    val: '$0', valLabel: { uk: 'верифікованих outcome-виплат', en: 'verified outcome payments' },
    oneliner: { uk: '$1.87B в системі — 0% прив\'язано до верифікованих сесій', en: '$1.87B in system — 0% linked to verified sessions' },
    source:   { uk: 'OCHA FTS 2025; NHSU Verification Reports; WB THRIVE PforR', en: 'OCHA FTS 2025; NHSU Verification Reports; WB THRIVE PforR' },
    calc:     { uk: 'Ланцюг: Донор→Алокація→Провайдер→Сесія→Результат; розриви: (1) Алокація↛Провайдер (без ЄСОЗ), (2) Сесія↛Верифікація (ручна), (3) Результат↛Disbursement (0 DLI тригерів)', en: 'Chain: Donor→Allocation→Provider→Session→Result; breaks: (1) Allocation↛Provider (no ESOZ link), (2) Session↛Verification (manual only), (3) Result↛Disbursement (0 DLI triggers)' },
    chainsTo: ['human', 'ops'],
  },
  {
    id: 'ops', cluster: 'accountability', color: '#ff9966', icon: '⚙️',
    label:    { uk: 'Операційний', en: 'Operational' },
    val: '2×/тиж', valLabel: { uk: 'ручна координація кластеру', en: 'manual cluster coordination' },
    oneliner: { uk: 'Неможливо масштабувати при навантаженні 50-60M сесій/рік вручну', en: 'Cannot scale to 50-60M sessions/yr with manual coordination' },
    source:   { uk: 'IMC Cluster Coordination Notes 2024; MHPSS IM WG', en: 'IMC Cluster Coordination Notes 2024; MHPSS IM WG' },
    calc:     { uk: '2 зустрічі × 150+ учасників × 52 тижні = 15,600 людино-год/рік лише на координацію; без автоматичної звітності', en: '2 meetings × 150+ participants × 52 weeks = 15,600 person-hrs/yr coordination only; no automated reporting' },
    chainsTo: ['fin', 'admin'],
  },
  {
    id: 'human', cluster: 'accountability', color: '#00d4aa', icon: '🌍',
    label:    { uk: 'Гуманітарний', en: 'Humanitarian' },
    val: '1%', valLabel: { uk: 'локалізація (ціль Grand Bargain: 25%)', en: 'localisation (Grand Bargain target: 25%)' },
    oneliner: { uk: '1% гуманітарних коштів MHPSS до місцевих НУО при зобов\'язанні 25%', en: '1% of MHPSS humanitarian funds reach local NGOs against 25% commitment' },
    source:   { uk: 'Grand Bargain Annual Report 2024; OCHA Ukraine MHPSS Financial Tracking', en: 'Grand Bargain Annual Report 2024; OCHA Ukraine MHPSS Financial Tracking' },
    calc:     { uk: '$18.7M з $1.87B → місцеві НУО = 1.0%; зобов\'язання Grand Bargain 2016: 25% до 2020; у 2024 — без руху', en: '$18.7M of $1.87B → local NGOs = 1.0%; Grand Bargain 2016 commitment: 25% by 2020; 2024 — no progress' },
    chainsTo: ['fin', 'cap'],
  },
];

const BY_CLUSTER: Record<Cluster, Gap[]> = {
  data:           GAPS.filter(g => g.cluster === 'data'),
  capacity:       GAPS.filter(g => g.cluster === 'capacity'),
  accountability: GAPS.filter(g => g.cluster === 'accountability'),
};

// ── Flip card ────────────────────────────────────────────────────────────────
const FlipCard: React.FC<{
  gap: Gap;
  lang: Language;
  isFlipped: boolean;
  onFlip: () => void;
  labelOf: (id: GapId) => string;
}> = ({ gap, lang, isFlipped, onFlip, labelOf }) => (
  <div
    onClick={onFlip}
    style={{ perspective: '900px', cursor: 'pointer' }}
    className="relative w-full h-full min-h-0"
  >
    <div
      style={{
        position: 'absolute', inset: 0,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.52s cubic-bezier(0.4,0,0.2,1)',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
    >
      {/* ── FRONT ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${gap.color}33`,
        borderRadius: '12px',
        padding: '10px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '15px' }}>{gap.icon}</span>
          <span className="cyber-label" style={{ color: gap.color, fontSize: '10px' }}>{gap.label[lang]}</span>
        </div>
        <div className="ds-display font-bold" style={{
          fontSize: 'clamp(16px, 2.2vw, 26px)',
          color: gap.color,
          textShadow: `0 0 18px ${gap.color}55`,
          lineHeight: 1,
        }}>
          {gap.val}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--color-ds-muted)', marginTop: '3px', marginBottom: '6px' }}
          className="ds-body">
          {gap.valLabel[lang]}
        </div>
        <p className="ds-body" style={{ fontSize: '10px', lineHeight: 1.4, color: 'rgba(200,208,220,0.72)', marginTop: 'auto' }}>
          {gap.oneliner[lang]}
        </p>
        <div style={{ fontSize: '10px', color: `${gap.color}55`, marginTop: '5px' }}>↩ flip</div>
      </div>

      {/* ── BACK ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        background: `${gap.color}0d`,
        border: `1px solid ${gap.color}55`,
        borderRadius: '12px',
        padding: '10px',
        display: 'flex', flexDirection: 'column', gap: '5px',
        overflow: 'hidden',
      }}>
        <div>
          <div className="cyber-label" style={{ color: gap.color, fontSize: '10px' }}>SOURCE</div>
          <p className="ds-body" style={{ fontSize: '10px', marginTop: '2px', color: 'rgba(200,208,220,0.85)' }}>
            {gap.source[lang]}
          </p>
        </div>
        <div>
          <div className="cyber-label" style={{ color: gap.color, fontSize: '10px' }}>
            {lang === 'uk' ? 'МЕТОДОЛОГІЯ' : 'METHODOLOGY'}
          </div>
          <p className="ds-body" style={{ fontSize: '10px', marginTop: '2px', lineHeight: 1.4, color: 'rgba(200,208,220,0.85)' }}>
            {gap.calc[lang]}
          </p>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div className="cyber-label" style={{ color: gap.color, fontSize: '10px' }}>
            {lang === 'uk' ? 'ВПЛИВАЄ НА' : 'CHAINS TO'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px' }}>
            {gap.chainsTo.map(id => (
              <span key={id} className="ds-display font-semibold" style={{
                fontSize: '10px', padding: '1px 5px', borderRadius: '4px',
                background: `${gap.color}18`, color: gap.color, border: `1px solid ${gap.color}30`,
              }}>
                → {labelOf(id)}
              </span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: '10px', color: `${gap.color}55` }}>↩ flip back</div>
      </div>
    </div>
  </div>
);

// ── Main screen ───────────────────────────────────────────────────────────────
export const L2Operational: React.FC<Props> = ({ lang, nav }) => {
  const [flipped, setFlipped] = useState<Set<GapId>>(new Set());

  const toggle = (id: GapId) => setFlipped(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const labelOf = (id: GapId) => GAPS.find(g => g.id === id)?.label[lang] ?? id;

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(46,196,182,0.09) 0%, transparent 55%), ' +
          'linear-gradient(135deg, #080f1c 0%, #0a1628 100%)',
      }}
    >
      <div className="h-px w-full flex-shrink-0" style={{
        background: 'linear-gradient(90deg, transparent, #2ec4b6 50%, transparent)',
        boxShadow: '0 0 14px rgba(46,196,182,0.4)',
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
          <div className="text-[17px] font-bold ds-display" style={{ color: '#2ec4b6' }}>
            {lang === 'uk' ? '9 Операційних розривів' : '9 Operational Gaps'}
          </div>
          <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>
            {lang === 'uk'
              ? 'Три кластери блокують масштабування MHPSS. Натисніть картку — побачите джерело та методологію.'
              : 'Three clusters block MHPSS scale-up. Click a card to see source & methodology.'}
          </div>
        </div>
      </div>

      {/* ── Clusters + flip cards ── */}
      <div className="flex-1 flex flex-col gap-2 px-5 pb-2 min-h-0">
        {(['data', 'capacity', 'accountability'] as Cluster[]).map((cluster, ci) => (
          <motion.div
            key={cluster}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.08 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Cluster label */}
            <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
              <span className="cyber-label" style={{ color: CLUSTER_META[cluster].color, fontSize: '10px' }}>
                {CLUSTER_META[cluster][lang]}
              </span>
              <div className="flex-1 h-px" style={{ background: `${CLUSTER_META[cluster].color}28` }} />
            </div>

            {/* 3-card row */}
            <div className="flex-1 grid grid-cols-3 gap-2 min-h-0">
              {BY_CLUSTER[cluster].map((gap) => (
                <FlipCard
                  key={gap.id}
                  gap={gap}
                  lang={lang}
                  isFlipped={flipped.has(gap.id)}
                  onFlip={() => toggle(gap.id)}
                  labelOf={labelOf}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Bottom bar: 10th gap + chain legend ── */}
      <div
        className="flex-shrink-0 px-5 py-2 flex items-start gap-3 flex-wrap"
        style={{ borderTop: '1px solid var(--color-ds-border)', background: 'rgba(0,0,0,0.2)' }}
      >
        <div style={{ fontSize: '10px' }} className="ds-body">
          <span style={{ color: '#a78bfa', fontWeight: 700 }}>
            {lang === 'uk' ? '+ Розрив №10 (2025): ' : '+ Gap #10 (2025): '}
          </span>
          <span style={{ color: 'var(--color-ds-muted)' }}>
            {lang === 'uk'
              ? '303 приватні клініки Пакету 51 → 1 сесія по тарифу НСЗУ → власний прайс → випадають зі статистики. 50.5% Пакету 51 — приватний сектор, ~0% у лонгітюдних outcome-даних.'
              : '303 private Package-51 clinics → 1 NHSU-tariff session → own pricing → drop from statistics. 50.5% of Package 51 is private sector, ~0% in longitudinal outcome data.'}
          </span>
        </div>
        <div className="flex-1" />
        {/* cluster colour legend */}
        <div className="flex items-center gap-3">
          {(['data', 'capacity', 'accountability'] as Cluster[]).map(c => (
            <div key={c} className="flex items-center gap-1">
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: CLUSTER_META[c].color }} />
              <span style={{ fontSize: '10px', color: 'var(--color-ds-muted)' }} className="ds-body">
                {CLUSTER_META[c][lang].replace('CLUSTER: ', '').replace('КЛАСТЕР: ', '')}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full text-[10px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>
          {lang === 'uk'
            ? 'Джерело: FEEL Again польові інтерв\'ю 2024 · НСЗУ відкриті дані · OCHA Ukraine · WB THRIVE DLI-матриця · Grand Bargain 2016'
            : 'Source: FEEL Again field interviews 2024 · NHSU open data · OCHA Ukraine · WB THRIVE DLI matrix · Grand Bargain 2016'}
        </div>
      </div>
    </div>
  );
};
