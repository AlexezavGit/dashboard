import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, AlertTriangle, Link2, Zap } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { BUDGET_SPLIT_DATA, DONOR_DATA } from '../../constants';

interface Props { lang: Language; nav: ScreenNav; }

type FlowState = 'flowing' | 'dead' | 'blocked';

// ─── Animated pipe between blocks ─────────────────────────────────────────────
const FlowPipe: React.FC<{ state: FlowState }> = ({ state }) => {
  const trackColor =
    state === 'flowing' ? 'rgba(0,212,170,0.18)' :
    state === 'blocked' ? 'rgba(255,123,110,0.2)' :
    'rgba(255,255,255,0.05)';

  return (
    <div style={{ width: 44, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: 8,
        borderRadius: 4,
        background: trackColor,
        overflow: 'hidden',
        transition: 'background 0.7s ease',
      }}>
        {state === 'flowing' && [0, 0.65, 1.3].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ x: ['-60%', '220%'] }}
            transition={{ repeat: Infinity, duration: 1.8, delay, ease: 'linear' }}
            style={{
              position: 'absolute', top: 0, bottom: 0, width: '55%',
              background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.7), #00ffcc, rgba(0,212,170,0.7), transparent)',
            }}
          />
        ))}
        {state === 'blocked' && (
          <motion.div
            animate={{ opacity: [0.35, 0.85, 0.35] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(255,123,110,0.65)' }}
          />
        )}
      </div>
    </div>
  );
};

// ─── Chart: World Bank Financing ───────────────────────────────────────────────
const WBChart: React.FC<{ lang: Language; solved: boolean }> = ({ lang, solved }) => {
  const programs = [
    { name: 'HEAL P180245', total: '$500M', disbursed: '$171M', pct: 34, color: '#e8c97a' },
    { name: 'THRIVE P505616', total: '$454M', disbursed: '~$320M', pct: 70, color: '#00d4aa' },
  ];
  return (
    <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,170,0.25)', position: 'relative', overflow: 'hidden' }}>
      {solved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,212,170,0.05)', borderRadius: 12, pointerEvents: 'none' }}
        />
      )}
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        {lang === 'uk' ? 'Фінансування Світового банку' : 'World Bank Financing'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
        {programs.map((p) => (
          <div key={p.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--color-ds-muted)' }}>{p.name}</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: p.color }}>{p.pct}%</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, height: 9, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${solved && p.name.includes('THRIVE') ? 100 : p.pct}%` }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  style={{ height: '100%', borderRadius: 999, background: p.color }}
                />
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', minWidth: 52 }}>{p.total}</span>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: '#00d4aa', marginBottom: 6 }}
          >
            ✓ {lang === 'uk' ? '$134M+ disbursed → рахунки НСЗУ' : '$134M+ disbursed → NHSU payments'}
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
        {lang === 'uk' ? 'Джерело: WB HEAL P180245 / THRIVE P505616' : 'Source: WB HEAL P180245 / THRIVE P505616'}
      </div>
    </div>
  );
};

// ─── Chart: Humanitarian Financing (without veterans) ─────────────────────────
const HumanitarianChart: React.FC<{ lang: Language }> = ({ lang }) => {
  const data = DONOR_DATA(lang).filter(d => !d.name.toLowerCase().includes('ветеран') && !d.name.toLowerCase().includes('veteran'));
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

// ─── Chart: State Budget + Veterans ───────────────────────────────────────────
const StateBudgetChart: React.FC<{ lang: Language }> = ({ lang }) => {
  const data = BUDGET_SPLIT_DATA(lang);
  const veteranData = DONOR_DATA(lang).find(d =>
    d.name.toLowerCase().includes('ветеран') || d.name.toLowerCase().includes('veteran')
  );
  return (
    <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,123,110,0.2)' }}>
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        {lang === 'uk' ? 'Держбюджет МОЗ + Ветерани' : 'State Budget MoH + Veterans'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
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
        {veteranData && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--color-ds-muted)' }}>{veteranData.name}</span>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: veteranData.fill }}>${veteranData.value}M</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '30%' }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ height: '100%', borderRadius: 999, background: veteranData.fill }}
              />
            </div>
          </div>
        )}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#ff7b6e', marginBottom: 4 }}>
        {lang === 'uk' ? '↑ 5× стаціонар vs реальна потреба 11%' : '↑ 5× inpatient vs actual need 11%'}
      </div>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
        {lang === 'uk' ? 'Джерело: МОЗ бюджет 2024 · OCHA FTS' : 'Source: MoH budget 2024 · OCHA FTS'}
      </div>
    </div>
  );
};

// ─── Reusable flip card shell ──────────────────────────────────────────────────
const FlipShell: React.FC<{
  flipped: boolean;
  onClick?: () => void;
  borderColor: string;
  bgColor: string;
  front: React.ReactNode;
  back: React.ReactNode;
}> = ({ flipped, onClick, borderColor, bgColor, front, back }) => (
  <div
    style={{ flex: 1, perspective: '1000px', cursor: onClick ? 'pointer' : 'default', minWidth: 0 }}
    onClick={onClick}
  >
    <motion.div
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ transformStyle: 'preserve-3d', position: 'relative', height: '100%' }}
    >
      <div style={{
        backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
        position: 'absolute', inset: 0,
        borderRadius: 14, padding: 16,
        background: bgColor, border: `1px solid ${borderColor}`,
        display: 'flex', flexDirection: 'column',
      }}>
        {front}
      </div>
      <div style={{
        backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        position: 'absolute', inset: 0,
        borderRadius: 14, padding: 16,
        background: bgColor, border: `1px solid ${borderColor}`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {back}
      </div>
    </motion.div>
  </div>
);

// ─── Shared label styles ───────────────────────────────────────────────────────
const TAG = (color: string) => ({
  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10,
  color, textTransform: 'uppercase' as const, letterSpacing: '0.08em',
});
const AMOUNT = (color: string, big = false) => ({
  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
  fontSize: big ? 'clamp(26px, 2.8vw, 38px)' : 'clamp(18px, 2vw, 26px)',
  color, lineHeight: 1,
});
const BODY = { fontFamily: 'DM Sans, sans-serif', fontSize: 11, lineHeight: 1.5, color: 'rgba(200,208,220,0.8)' };

// ─── Main component ─────────────────────────────────────────────────────────
export const L2Finance: React.FC<Props> = ({ lang, nav }) => {
  const [b1Flipped, setB1Flipped] = useState(false);
  const [b2Flipped, setB2Flipped] = useState(false);
  const [b3Flipped, setB3Flipped] = useState(false);
  // phase 'locked' → 'revealing' (auto-flip back after 2.5s) → 'solved'
  const [b4Phase, setB4Phase] = useState<'locked' | 'revealing' | 'solved'>('locked');

  useEffect(() => {
    if (b4Phase === 'revealing') {
      const t = setTimeout(() => setB4Phase('solved'), 2500);
      return () => clearTimeout(t);
    }
  }, [b4Phase]);

  // Pipe states
  const pipe12: FlowState = b1Flipped ? 'flowing' : 'dead';
  const pipe23: FlowState = 'flowing'; // always alive — services are already happening
  const pipe34: FlowState = b3Flipped ? 'flowing' : 'blocked';

  const uk = lang === 'uk';
  const solved = b4Phase === 'solved';

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 25% 65%, rgba(0,212,170,0.07) 0%, transparent 55%), ' +
          'radial-gradient(ellipse 40% 40% at 80% 30%, rgba(200,164,92,0.07) 0%, transparent 50%), ' +
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
          className="flex items-center gap-2 px-4 py-2 rounded-xl ds-display font-bold flex-shrink-0"
          style={{ background: 'rgba(200,164,92,0.16)', border: '2px solid var(--color-ds-gold)', color: 'var(--color-ds-gold)', fontSize: '12px' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {uk ? 'Назад' : 'Back'}
        </button>
        <div className="text-[17px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>
          {uk ? 'Куди ресурси ідуть і куди вони не доходять' : "Where resources go and where they don't reach"}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 px-5 pb-3 min-h-0">

        {/* TOP: 3 charts — WB left, Humanitarian centre, State Budget+Veterans right */}
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex-shrink-0 flex gap-4"
        >
          <WBChart lang={lang} solved={solved} />
          <HumanitarianChart lang={lang} />
          <StateBudgetChart lang={lang} />
        </motion.div>

        {/* Section title */}
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--color-ds-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
          {uk ? 'ШЛЯХ РЕСУРСІВ — КЕЙС HEAL / THRIVE' : 'RESOURCE PATH — HEAL / THRIVE CASE'}
        </div>

        {/* CHAIN: 4 blocks + 3 animated pipes */}
        <div className="flex-1 flex min-h-0 gap-0" style={{ alignItems: 'stretch' }}>

          {/* ── Block 1: WB Blocked Resources ────────────────────────────────── */}
          <FlipShell
            flipped={b1Flipped}
            onClick={() => setB1Flipped(f => !f)}
            borderColor={solved ? 'rgba(0,212,170,0.4)' : 'rgba(200,164,92,0.4)'}
            bgColor={solved ? 'rgba(0,212,170,0.06)' : 'rgba(200,164,92,0.06)'}
            front={
              <>
                <div style={TAG('#e8c97a')}>{uk ? 'Заблоковані ресурси Світ. банку' : 'Blocked World Bank Resources'}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', marginBottom: 10, marginTop: 2 }}>
                  {uk ? 'на фінансування MHPSS для українців' : 'for MHPSS financing for Ukrainians'}
                </div>
                <AnimatePresence mode="wait">
                  {solved ? (
                    <motion.div key="solved" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ ...AMOUNT('#00d4aa', true) }}>$820M</div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: '#00d4aa', marginTop: 4 }}>
                        {uk ? '→ $134M+ disbursed до НСЗУ ✓' : '→ $134M+ disbursed to NHSU ✓'}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ ...AMOUNT('#e8c97a', true) }}>$954M</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {['HEAL $500M', 'THRIVE $454M'].map(t => (
                    <span key={t} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: '#e8c97a', background: 'rgba(200,164,92,0.1)', border: '1px solid rgba(200,164,92,0.2)', borderRadius: 4, padding: '2px 6px' }}>{t}</span>
                  ))}
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(200,208,220,0.35)', textAlign: 'center', marginTop: 10 }}>
                  {uk ? '↕ фліп — метрики проектів' : '↕ flip — project metrics'}
                </div>
              </>
            }
            back={
              <>
                <div style={TAG('#e8c97a')}>{uk ? 'Метрики проектів' : 'Project Metrics'}</div>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                  {[
                    { name: 'HEAL P180245', mech: 'IPF+PBC', total: '$500M', dis: '$171M (34%)', close: 'Dec 2026', color: '#e8c97a' },
                    { name: 'THRIVE P505616', mech: 'PforR', total: '$454M', dis: '~$320M (70%)', close: 'Dec 2027', color: '#00d4aa' },
                  ].map(p => (
                    <div key={p.name} style={{ borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${p.color}22`, padding: 10 }}>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: p.color, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px' }}>
                        {[
                          [uk ? 'Механізм' : 'Mechanism', p.mech],
                          [uk ? 'Загалом' : 'Total', p.total],
                          [uk ? 'Виплачено' : 'Disbursed', p.dis],
                          [uk ? 'Закриття' : 'Closing', p.close],
                        ].map(([label, val]) => (
                          <React.Fragment key={label as string}>
                            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)' }}>{label}</span>
                            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: 'var(--color-ds-text)' }}>{val}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
          />

          <FlowPipe state={pipe12} />

          {/* ── Block 2: Services Provided ───────────────────────────────────── */}
          <FlipShell
            flipped={b2Flipped}
            onClick={() => setB2Flipped(f => !f)}
            borderColor="rgba(0,212,170,0.3)"
            bgColor="rgba(0,212,170,0.05)"
            front={
              <>
                <div style={TAG('#00d4aa')}>{uk ? 'Надано послуг · план перевиконано' : 'Services provided · plan exceeded'}</div>
                <div style={{ ...AMOUNT('#00d4aa', true), marginTop: 8 }}>624K+</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: '#00d4aa', marginTop: 4 }}>MH {uk ? 'послуг' : 'services'} · 125%</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
                  {[
                    { label: uk ? 'Реабілітація' : 'Rehabilitation', val: '670K', pct: 214 },
                    { label: uk ? 'Розширені огляди' : 'Extended exams', val: '10.4M', pct: 297 },
                  ].map(r => (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)' }}>{r.label} {r.val}</span>
                        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: '#00d4aa' }}>{r.pct}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.6, duration: 0.8 }}
                          style={{ height: '100%', borderRadius: 999, background: '#00d4aa' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(200,208,220,0.35)', textAlign: 'center', marginTop: 10 }}>
                  {uk ? '↕ фліп — мобільні бригади' : '↕ flip — mobile brigades'}
                </div>
              </>
            }
            back={
              <>
                <div style={TAG('#00d4aa')}>{uk ? 'Мобільні MH бригади' : 'Mobile MH Brigades'}</div>
                <div style={{ ...AMOUNT('#00d4aa', true), marginTop: 8 }}>118</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#00d4aa', marginTop: 4 }}>
                  {uk ? 'команд розгорнуто · 157% від плану (75)' : 'teams deployed · 157% of plan (75)'}
                </div>
                <div style={{ flex: 1, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                  <div style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 1 }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #00d4aa, #00ffcc)', borderRadius: 6 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)' }}>{uk ? 'План' : 'Plan'}: 75</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 10, color: '#00d4aa' }}>{uk ? 'Факт' : 'Actual'}: 118</span>
                  </div>
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'var(--color-ds-muted)', marginTop: 10 }}>
                  {uk ? 'Джерело: HEAL ISR#6 · 25.03.2026' : 'Source: HEAL ISR#6 · 25.03.2026'}
                </div>
              </>
            }
          />

          <FlowPipe state={pipe23} />

          {/* ── Block 3: KoboToolbox / Digital Bus ───────────────────────────── */}
          <FlipShell
            flipped={b3Flipped}
            onClick={() => setB3Flipped(f => !f)}
            borderColor={b3Flipped ? 'rgba(0,212,170,0.4)' : 'rgba(255,123,110,0.4)'}
            bgColor={b3Flipped ? 'rgba(0,212,170,0.06)' : 'rgba(255,123,110,0.06)'}
            front={
              <>
                <div style={TAG(b3Flipped ? '#00d4aa' : '#ff7b6e')}>
                  {b3Flipped
                    ? (uk ? 'FEEL Again Digital Bus' : 'FEEL Again Digital Bus')
                    : (uk ? 'Звітність KoboToolbox' : 'KoboToolbox Reporting')}
                </div>
                {b3Flipped ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <Zap style={{ width: 20, height: 20, color: '#00d4aa' }} />
                      <span style={{ ...AMOUNT('#00d4aa'), fontSize: 16 }}>HL7 FHIR R4</span>
                    </div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: '#00d4aa', marginTop: 6 }}>
                      10K req/sec · &lt;200ms p95 · Zero CAPEX
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {['CommCare', 'KoboToolbox', 'ActivityInfo'].map(s => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Link2 style={{ width: 10, height: 10, color: '#00d4aa' }} />
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: '#00d4aa' }}>{s} → ЄСОЗ</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', marginTop: 2, marginBottom: 10 }}>
                      {uk ? 'без доступу до e-health · шлях до ЄСОЗ заблоковано' : 'no e-health access · path to ESOZ blocked'}
                    </div>
                    {[
                      { name: 'CommCare', val: '2.1M' },
                      { name: 'KoboToolbox', val: '0.8M' },
                      { name: 'ActivityInfo', val: '1.8M' },
                    ].map(s => (
                      <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--color-ds-muted)' }}>{s.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 11, color: '#ff7b6e' }}>{s.val}</span>
                          <AlertTriangle style={{ width: 10, height: 10, color: '#ff7b6e' }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ flex: 1 }} />
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: '#ff7b6e', textAlign: 'center', padding: '6px 0', borderRadius: 6, background: 'rgba(255,123,110,0.1)', border: '1px solid rgba(255,123,110,0.2)' }}>
                      {uk ? '4.7M сесій поза ЄСОЗ' : '4.7M sessions outside ESOZ'}
                    </div>
                  </>
                )}
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(200,208,220,0.35)', textAlign: 'center', marginTop: 10 }}>
                  {b3Flipped
                    ? (uk ? '↕ фліп — повернутись до проблеми' : '↕ flip — back to problem')
                    : (uk ? '↕ фліп — рішення Digital Bus' : '↕ flip — Digital Bus solution')}
                </div>
              </>
            }
            back={
              <>
                <div style={TAG('#00d4aa')}>FEEL Again Digital Bus</div>
                <div style={{ flex: 1, overflowY: 'auto', marginTop: 10 }}>
                  <p style={{ ...BODY, marginBottom: 10 }}>
                    {uk
                      ? 'Один інтеграційний шар між кожною гуманітарною системою та ЄСОЗ через Trembita X-Road. Shadow Record Tagging + Provenance Resource для кожної сесії.'
                      : 'One integration layer between each humanitarian system and ESOZ via Trembita X-Road. Shadow Record Tagging + Provenance Resource for every session.'}
                  </p>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: '#00d4aa', marginBottom: 6 }}>
                    {uk ? 'Технічні характеристики' : 'Technical specs'}
                  </div>
                  {[['HL7 FHIR R4', 'Protocol'], ['10K req/sec', 'Throughput'], ['<200ms p95', 'Latency'], ['Zero CAPEX', 'Model']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)' }}>{v}</span>
                      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: '#00d4aa' }}>{k}</span>
                    </div>
                  ))}
                </div>
              </>
            }
          />

          <FlowPipe state={pipe34} />

          {/* ── Block 4: НСЗУ Payments ───────────────────────────────────────── */}
          <FlipShell
            flipped={b4Phase === 'revealing'}
            onClick={b4Phase === 'locked' ? () => setB4Phase('revealing') : undefined}
            borderColor={solved ? 'rgba(0,212,170,0.45)' : b4Phase === 'revealing' ? 'rgba(0,212,170,0.35)' : 'rgba(255,123,110,0.35)'}
            bgColor={solved ? 'rgba(0,212,170,0.08)' : b4Phase === 'revealing' ? 'rgba(0,212,170,0.06)' : 'rgba(255,123,110,0.06)'}
            front={
              <>
                <div style={TAG(solved ? '#00d4aa' : '#ff7b6e')}>{uk ? 'Рахунки НСЗУ' : 'NHSU Payments'}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'var(--color-ds-muted)', marginTop: 2, marginBottom: 10 }}>
                  {uk ? 'верифіковані outcome-платежі' : 'verified outcome-based payments'}
                </div>
                <AnimatePresence mode="wait">
                  {solved ? (
                    <motion.div key="solved" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}>
                      <div style={{ ...AMOUNT('#00d4aa', true) }}>$134M+</div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: '#00d4aa', marginTop: 6 }}>
                        {uk ? 'THRIVE DLI розблоковано ✓' : 'THRIVE DLI unlocked ✓'}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ ...AMOUNT('#ff7b6e', true) }}>$0</div>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#ff7b6e', marginTop: 10, padding: '6px 10px', borderRadius: 6, background: 'rgba(255,123,110,0.12)', border: '1px solid rgba(255,123,110,0.25)', textAlign: 'center' }}>
                        FEEL AGAIN
                      </div>
                      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(255,123,110,0.6)', textAlign: 'center', marginTop: 4 }}>
                        {uk ? '(необхідне з\'єднання)' : '(connection required)'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div style={{ flex: 1 }} />
                {!solved && (
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, color: 'rgba(200,208,220,0.35)', textAlign: 'center', marginTop: 10 }}>
                    {uk ? '↕ натисніть щоб з\'єднати' : '↕ click to connect'}
                  </div>
                )}
              </>
            }
            back={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  <Zap style={{ width: 32, height: 32, color: '#00d4aa' }} />
                </motion.div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: '#00d4aa', textAlign: 'center' }}>
                  FEEL AGAIN
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(0,212,170,0.8)', textAlign: 'center', lineHeight: 1.5 }}>
                  {uk ? 'Digital Bus підключається…\nсесії потрапляють до ЄСОЗ…\nDLI-тригери спрацьовують…' : 'Digital Bus connecting…\nsessions entering ESOZ…\nDLI triggers firing…'}
                </div>
                <motion.div
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                  style={{ height: 4, borderRadius: 2, background: '#00d4aa', alignSelf: 'stretch' }}
                />
              </div>
            }
          />
        </div>

        {/* L3 transition footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex-shrink-0 flex items-center gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fontWeight: 700, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
              {uk ? 'Аналітичний звіт · 6 блоків · рівень L3' : 'Analytical Report · 6 blocks · L3 level'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
              {[
                { uk: 'FEEL AGAIN позиція', en: 'FEEL AGAIN position' },
                { uk: '6-шарова архітектура', en: '6-layer architecture' },
                { uk: 'HEAL ISR#6 KPI', en: 'HEAL ISR#6 KPIs' },
                { uk: 'Data Flow Architecture', en: 'Data Flow Architecture' },
                { uk: 'THRIVE P505616', en: 'THRIVE P505616' },
                { uk: 'HEAL C4 Procurement', en: 'HEAL C4 Procurement' },
              ].map(t => (
                <span key={t.en} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: 'rgba(200,208,220,0.45)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 5, padding: '2px 8px' }}>
                  {t[lang]}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => nav.push('appendix')}
            style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 12, color: '#00d4aa', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            {uk ? '→ Аналітичний огляд' : '→ Analytical Overview'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};
