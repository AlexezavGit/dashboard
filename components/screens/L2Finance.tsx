import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Zap } from 'lucide-react';
import { Language } from '../../types';
import { ScreenId, ScreenNav } from './types';
import { NavBar } from './NavBar';
import { BUDGET_SPLIT_DATA, DONOR_DATA } from '../../constants';

interface Props { lang: Language; nav: ScreenNav; }

type FlowState = 'flowing' | 'dead' | 'blocked';

// ─── Animated pipe between blocks ─────────────────────────────────────────────
const FlowPipe: React.FC<{ state: FlowState }> = ({ state }) => {
  const trackColor =
    state === 'flowing' ? 'rgba(44,110,100,0.18)' :
    state === 'blocked' ? 'rgba(255,123,110,0.2)' :
    'var(--color-ds-track)';

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
              background: 'linear-gradient(90deg, transparent, rgba(44,110,100,0.7), var(--color-ds-teal-light), rgba(44,110,100,0.7), transparent)',
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
    { name: 'HEAL P180245', mech: 'IPF+PBC', total: '$500M', disbursed: '$171M', pct: 34, color: 'var(--color-ds-gold)' },
    { name: 'THRIVE P505616', mech: 'PforR', total: '$454M', disbursed: '~$320M', pct: 70, color: 'var(--color-ds-teal-light)' },
  ];
  return (
    <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'var(--color-ds-track)', border: '1px solid rgba(44,110,100,0.25)', position: 'relative', overflow: 'hidden' }}>
      {solved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(44,110,100,0.05)', borderRadius: 12, pointerEvents: 'none' }}
        />
      )}
      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        {lang === 'uk' ? 'Фінансування Світового банку' : 'World Bank Financing'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
        {programs.map((p) => (
          <div key={p.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'var(--color-ds-muted)' }}>{p.name}</span>
                <span style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 9, color: p.color, marginLeft: 5, opacity: 0.7 }}>{p.mech}</span>
              </div>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 13, color: p.color }}>{p.pct}%</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, height: 9, borderRadius: 999, background: 'var(--color-ds-track)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${solved && p.name.includes('THRIVE') ? 100 : p.pct}%` }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  style={{ height: '100%', borderRadius: 999, background: p.color }}
                />
              </div>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)', minWidth: 52 }}>{p.total}</span>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--color-ds-teal-light)', marginBottom: 6 }}
          >
            ✓ {lang === 'uk' ? '$463M розблоковано → HEAL + THRIVE' : '$463M unlocked → HEAL + THRIVE'}
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid var(--color-ds-border)', paddingTop: 6 }}>
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
    <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'var(--color-ds-track)', border: '1px solid rgba(201,179,106,0.2)' }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        {lang === 'uk' ? 'Гуманітарне фінансування (млн USD)' : 'Humanitarian Financing (M USD)'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
        {data.map((d) => (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'var(--color-ds-muted)' }}>{d.name}</span>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 13, color: d.fill }}>${d.value}M</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'var(--color-ds-track)' }}>
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
      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid var(--color-ds-border)', paddingTop: 6 }}>
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
    <div style={{ flex: 1, borderRadius: 12, padding: 16, background: 'var(--color-ds-track)', border: '1px solid rgba(255,123,110,0.2)' }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--color-ds-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        {lang === 'uk' ? 'Держбюджет + Ветерани' : 'State Budget + Veterans'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
        {data.map((d) => (
          <div key={d.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'var(--color-ds-muted)' }}>{d.name}</span>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 13, color: d.fill }}>{d.value}%</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'var(--color-ds-track)' }}>
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
          <div style={{ borderTop: '1px solid var(--color-ds-border)', paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'var(--color-ds-muted)' }}>{veteranData.name}</span>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 13, color: veteranData.fill }}>${veteranData.value}M</span>
            </div>
            <div style={{ height: 9, borderRadius: 999, background: 'var(--color-ds-track)' }}>
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
      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-red)', marginBottom: 4 }}>
        {lang === 'uk' ? '↑ 5× стаціонар vs реальна потреба 11%' : '↑ 5× inpatient vs actual need 11%'}
      </div>
      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid var(--color-ds-border)', paddingTop: 6 }}>
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
  fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 10,
  color, textTransform: 'uppercase' as const, letterSpacing: '0.08em',
});
const AMOUNT = (color: string, big = false) => ({
  fontFamily: "'Archivo', sans-serif", fontWeight: 700,
  fontSize: big ? 'clamp(26px, 2.8vw, 38px)' : 'clamp(18px, 2vw, 26px)',
  color, lineHeight: 1,
});
const BODY = { fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, lineHeight: 1.5, color: 'var(--color-ds-text)' };

// ─── Main component ─────────────────────────────────────────────────────────
export const L2Finance: React.FC<Props> = ({ lang, nav }) => {
  const [b1Flipped, setB1Flipped] = useState(false);
  const [b2Flipped, setB2Flipped] = useState(false);
  const [b3Flipped, setB3Flipped] = useState(false);
  // phase 'locked' → 'revealing' (auto-flip back after 2.5s) → 'solved'
  const [b4Phase, setB4Phase] = useState<'locked' | 'revealing' | 'solved'>('locked');
  const [topicsOpen, setTopicsOpen] = useState(false);

  useEffect(() => {
    if (b4Phase === 'revealing') {
      const t = setTimeout(() => setB4Phase('solved'), 2500);
      return () => clearTimeout(t);
    }
  }, [b4Phase]);

  // Block 4 auto-flips when Block 3 (Digital Bus) is flipped — wave travel delay
  useEffect(() => {
    if (b3Flipped && b4Phase === 'locked') {
      const t = setTimeout(() => setB4Phase('revealing'), 1800);
      return () => clearTimeout(t);
    }
  }, [b3Flipped, b4Phase]);

  // Pipe states — pipe12 blocked (red) by default, flows when B1 flipped
  const pipe12: FlowState = b1Flipped ? 'flowing' : 'blocked';
  const pipe23: FlowState = 'flowing';
  const pipe34: FlowState = b3Flipped ? 'flowing' : 'blocked';

  const uk = lang === 'uk';
  const solved = b4Phase === 'solved';

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 25% 65%, rgba(44,110,100,0.07) 0%, transparent 55%), ' +
          'radial-gradient(ellipse 40% 40% at 80% 30%, rgba(201,179,106,0.07) 0%, transparent 50%), ' +
          'linear-gradient(135deg, #080f1c 0%, #0a1628 100%)',
      }}
    >
      <div className="h-px w-full flex-shrink-0" style={{
        background: 'linear-gradient(90deg, transparent, var(--color-ds-gold) 50%, transparent)',
        boxShadow: '0 0 14px rgba(201,179,106,0.45)',
      }} />

      {/* Header — shared NavBar: screen is in L2_ORDER, prev/next cover the movement */}
      <NavBar
        lang={lang}
        nav={nav}
        accentColor="var(--color-ds-gold)"
        title={{ uk: 'Куди ресурси ідуть і куди вони не доходять', en: "Where resources go and where they don't reach" }}
        subtitle={{ uk: 'Фінансовий контур HEAL / THRIVE', en: 'HEAL / THRIVE financial flow' }}
        crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
      />

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
        <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--color-ds-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
          {uk ? 'ШЛЯХ РЕСУРСІВ — КЕЙС HEAL / THRIVE' : 'RESOURCE PATH — HEAL / THRIVE CASE'}
        </div>

        {/* CHAIN: 4 blocks + 3 animated pipes */}
        <div className="flex-1 flex min-h-0 gap-0" style={{ alignItems: 'stretch' }}>

          {/* ── Block 1: WB Blocked Resources ────────────────────────────────── */}
          <FlipShell
            flipped={b1Flipped}
            onClick={() => setB1Flipped(f => !f)}
            borderColor={solved ? 'rgba(44,110,100,0.4)' : 'rgba(255,123,110,0.4)'}
            bgColor={solved ? 'rgba(44,110,100,0.06)' : 'rgba(255,123,110,0.06)'}
            front={
              <>
                <div style={TAG('var(--color-ds-red)')}>{uk ? 'Нерозподілені ресурси СБ' : 'WB Undisbursed Resources'}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)', marginBottom: 10, marginTop: 2 }}>
                  {uk ? 'на MHPSS для українців · заблоковано' : 'for MHPSS for Ukrainians · blocked'}
                </div>
                <AnimatePresence mode="wait">
                  {solved ? (
                    <motion.div key="solved" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ ...AMOUNT('var(--color-ds-teal-light)', true) }}>$463M</div>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-teal-light)', marginTop: 4 }}>
                        {uk ? '→ розблоковано · HEAL + THRIVE ✓' : '→ unlocked · HEAL + THRIVE ✓'}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div>
                          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)', marginBottom: 3 }}>HEAL P180245</div>
                          <div style={{ ...AMOUNT('var(--color-ds-red)') }}>$329M</div>
                          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-red)', marginTop: 2 }}>
                            {uk ? 'не виплачено (з $500M)' : 'undisbursed (of $500M)'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)', marginBottom: 3 }}>THRIVE P505616</div>
                          <div style={{ ...AMOUNT('var(--color-ds-red)') }}>$134M</div>
                          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-red)', marginTop: 2 }}>
                            {uk ? 'DLI-транш заблоковано' : 'DLI tranche locked'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div style={{ flex: 1 }} />
              </>
            }
            back={
              <>
                <div style={TAG('var(--color-ds-gold)')}>{uk ? 'План / Факт' : 'Plan / Actual'}</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14, justifyContent: 'center' }}>
                  {[
                    { name: 'HEAL P180245', plan: '$500M', fact: '$171M', pct: 34, color: 'var(--color-ds-gold)' },
                    { name: 'THRIVE P505616', plan: '$454M', fact: '~$320M', pct: 70, color: 'var(--color-ds-teal-light)' },
                  ].map(p => (
                    <div key={p.name}>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 11, color: p.color, marginBottom: 6 }}>{p.name}</div>
                      <div style={{ height: 12, borderRadius: 6, background: 'var(--color-ds-track)', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ delay: 0.3, duration: 1 }}
                          style={{ height: '100%', background: p.color, borderRadius: 6 }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)' }}>{uk ? 'План' : 'Plan'}: {p.plan}</span>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 10, color: p.color }}>{uk ? 'Факт' : 'Actual'}: {p.fact}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--color-ds-border)', paddingTop: 6, marginTop: 6 }}>
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 9, color: 'var(--color-ds-gold)' }}>
                    {uk ? 'Компонент 4 (HEAL): $41M незадіяно' : 'Component 4 (HEAL): $41M unallocated'}
                  </div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'rgba(201,179,106,0.55)', marginTop: 2 }}>
                    {uk ? '→ вікно для FEEL Again middleware' : '→ window for FEEL Again middleware'}
                  </div>
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-muted)', borderTop: '1px solid var(--color-ds-border)', paddingTop: 6, marginTop: 6 }}>
                  {uk ? 'Джерело: WB HEAL ISR#6 · THRIVE ISR' : 'Source: WB HEAL ISR#6 · THRIVE ISR'}
                </div>
              </>
            }
          />

          <FlowPipe state={pipe12} />

          {/* ── Block 2: Services Provided ───────────────────────────────────── */}
          <FlipShell
            flipped={b2Flipped}
            onClick={() => setB2Flipped(f => !f)}
            borderColor="rgba(44,110,100,0.3)"
            bgColor="rgba(44,110,100,0.05)"
            front={
              <>
                <div style={TAG('var(--color-ds-teal-light)')}>{uk ? 'Надано послуг · план перевиконано' : 'Services provided · plan exceeded'}</div>
                <div style={{ ...AMOUNT('var(--color-ds-teal-light)', true), marginTop: 8 }}>624K+</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-teal-light)', marginTop: 4 }}>MH {uk ? 'послуг' : 'services'} · 125%</div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, justifyContent: 'flex-end' }}>
                  {[
                    { label: uk ? 'Реабілітація' : 'Rehabilitation', val: '670K', pct: 214 },
                    { label: uk ? 'Розширені огляди' : 'Extended exams', val: '10.4M', pct: 297 },
                  ].map(r => (
                    <div key={r.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)' }}>{r.label} {r.val}</span>
                        <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--color-ds-teal-light)' }}>{r.pct}%</span>
                      </div>
                      <div style={{ height: 5, borderRadius: 999, background: 'var(--color-ds-track)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.6, duration: 0.8 }}
                          style={{ height: '100%', borderRadius: 999, background: 'var(--color-ds-teal-light)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
            back={
              <>
                <div style={TAG('var(--color-ds-teal-light)')}>{uk ? 'Мобільні MH бригади' : 'Mobile MH Brigades'}</div>
                <div style={{ ...AMOUNT('var(--color-ds-teal-light)', true), marginTop: 8 }}>118</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: 'var(--color-ds-teal-light)', marginTop: 4 }}>
                  {uk ? 'команд розгорнуто · 157% від плану (75)' : 'teams deployed · 157% of plan (75)'}
                </div>
                <div style={{ flex: 1, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                  <div style={{ height: 12, borderRadius: 6, background: 'var(--color-ds-track)', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 1 }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-ds-teal-light), var(--color-ds-teal-light))', borderRadius: 6 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)' }}>{uk ? 'План' : 'Plan'}: 75</span>
                    <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 10, color: 'var(--color-ds-teal-light)' }}>{uk ? 'Факт' : 'Actual'}: 118</span>
                  </div>
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-muted)', marginTop: 10 }}>
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
            borderColor={b3Flipped ? 'rgba(44,110,100,0.4)' : 'rgba(255,123,110,0.4)'}
            bgColor={b3Flipped ? 'rgba(44,110,100,0.06)' : 'rgba(255,123,110,0.06)'}
            front={
              <>
                <div style={TAG('var(--color-ds-red)')}>{uk ? 'Звітність KoboToolbox' : 'KoboToolbox Reporting'}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)', marginTop: 2, marginBottom: 10 }}>
                  {uk ? 'без доступу до e-health · шлях до ЄСОЗ заблоковано' : 'no e-health access · path to ESOZ blocked'}
                </div>
                {[
                  { name: 'CommCare', val: '2.1M' },
                  { name: 'KoboToolbox', val: '0.8M' },
                  { name: 'ActivityInfo', val: '1.8M' },
                ].map(s => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, color: 'var(--color-ds-muted)' }}>{s.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 11, color: 'var(--color-ds-red)' }}>{s.val}</span>
                      <AlertTriangle style={{ width: 10, height: 10, color: 'var(--color-ds-red)' }} />
                    </div>
                  </div>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--color-ds-red)', textAlign: 'center', padding: '6px 0', borderRadius: 6, background: 'rgba(255,123,110,0.1)', border: '1px solid rgba(255,123,110,0.2)' }}>
                  {uk ? '4.7M сесій поза ЄСОЗ' : '4.7M sessions outside ESOZ'}
                </div>
              </>
            }
            back={
              <>
                <div style={TAG('var(--color-ds-teal-light)')}>FEEL Again Digital Bus</div>
                <div style={{ flex: 1, overflowY: 'auto', marginTop: 10 }}>
                  <p style={{ ...BODY, marginBottom: 10 }}>
                    {uk
                      ? 'Один інтеграційний шар між кожною гуманітарною системою та ЄСОЗ через Trembita X-Road. Shadow Record Tagging + Provenance Resource для кожної сесії.'
                      : 'One integration layer between each humanitarian system and ESOZ via Trembita X-Road. Shadow Record Tagging + Provenance Resource for every session.'}
                  </p>
                  <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--color-ds-teal-light)', marginBottom: 6 }}>
                    {uk ? 'Технічні характеристики' : 'Technical specs'}
                  </div>
                  {[['HL7 FHIR R4', 'Protocol'], ['10K req/sec', 'Throughput'], ['<200ms p95', 'Latency'], ['Zero CAPEX', 'Model']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)' }}>{v}</span>
                      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--color-ds-teal-light)' }}>{k}</span>
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
            borderColor={solved ? 'rgba(44,110,100,0.45)' : b4Phase === 'revealing' ? 'rgba(44,110,100,0.35)' : 'var(--color-ds-red)'}
            bgColor={solved ? 'rgba(44,110,100,0.08)' : b4Phase === 'revealing' ? 'rgba(44,110,100,0.06)' : 'rgba(255,123,110,0.06)'}
            front={
              <>
                <div style={TAG(solved ? 'var(--color-ds-teal-light)' : 'var(--color-ds-red)')}>{uk ? 'Рахунки НСЗУ' : 'NHSU Payments'}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)', marginTop: 2, marginBottom: 10 }}>
                  {uk ? 'верифіковані outcome-платежі' : 'verified outcome-based payments'}
                </div>
                <AnimatePresence mode="wait">
                  {solved ? (
                    <motion.div key="solved" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}>
                      <div style={{ ...AMOUNT('var(--color-ds-teal-light)', true) }}>$463M</div>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-teal-light)', marginTop: 6 }}>
                        {uk ? 'HEAL $329M + THRIVE $134M ✓' : 'HEAL $329M + THRIVE $134M ✓'}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div style={{ ...AMOUNT('var(--color-ds-red)', true) }}>$0</div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--color-ds-red)', marginTop: 10, padding: '6px 10px', borderRadius: 6, background: 'rgba(255,123,110,0.12)', border: '1px solid rgba(255,123,110,0.25)', textAlign: 'center' }}>
                        FEEL AGAIN
                      </div>
                      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 9, color: 'var(--color-ds-red)', textAlign: 'center', marginTop: 4 }}>
                        {uk ? '(необхідне з\'єднання)' : '(connection required)'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div style={{ flex: 1 }} />
              </>
            }
            back={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  <Zap style={{ width: 32, height: 32, color: 'var(--color-ds-teal-light)' }} />
                </motion.div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--color-ds-teal-light)', textAlign: 'center' }}>
                  FEEL AGAIN
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 11, color: 'rgba(44,110,100,0.8)', textAlign: 'center', lineHeight: 1.5 }}>
                  {uk ? 'Digital Bus підключається…\n624K сесій → ЄСОЗ…\nTHRIVE PforR DLI розблоковується…' : 'Digital Bus connecting…\n624K sessions → ESOZ…\nTHRIVE PforR DLI unlocking…'}
                </div>
                <motion.div
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                  style={{ height: 4, borderRadius: 2, background: 'var(--color-ds-teal-light)', alignSelf: 'stretch' }}
                />
              </div>
            }
          />
        </div>

        {/* L3 transition footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex-shrink-0"
          style={{ borderTop: '1px solid var(--color-ds-border)', paddingTop: 8 }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTopicsOpen(o => !o)}
              style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              {uk ? 'розділи звіту' : 'report sections'} {topicsOpen ? '↑' : '↓'}
            </button>
            <div style={{ flex: 1 }} />
            <button
              onClick={() => nav.push('appendix')}
              style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 12, color: 'var(--color-ds-teal-light)', background: 'rgba(44,110,100,0.1)', border: '1px solid rgba(44,110,100,0.3)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
            >
              {uk ? '→ Аналітичний звіт' : '→ Analytical Report'}
            </button>
          </div>
          <AnimatePresence>
            {topicsOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px', paddingTop: 8 }}>
                  {([
                    { uk: '9 розривів системи', en: '9 System Gaps', screen: 'l2-operational' as ScreenId },
                    { uk: 'Ландшафт MHPSS', en: 'MHPSS Landscape', screen: 'l1' as ScreenId },
                    { uk: 'Карта видимості даних', en: 'Data Visibility Map', screen: 'l2-analytical' as ScreenId },
                    { uk: 'Покриття 0.28%', en: 'Coverage 0.28%', screen: 'l2-coverage' as ScreenId },
                    { uk: 'Системний беклог', en: 'System Backlog', screen: 'l2-backlog' as ScreenId },
                    { uk: 'Локалізація ресурсів', en: 'Resource Localization', screen: 'l2-regulatory' as ScreenId },
                  ]).map(t => (
                    <button
                      key={t.en}
                      onClick={() => nav.push(t.screen)}
                      style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 10, color: 'var(--color-ds-teal-light)', background: 'rgba(44,110,100,0.06)', border: '1px solid rgba(44,110,100,0.2)', borderRadius: 5, padding: '2px 8px', cursor: 'pointer' }}
                    >
                      {t[lang]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
