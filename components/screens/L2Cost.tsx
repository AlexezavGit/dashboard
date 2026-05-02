import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';

interface Props { lang: Language; nav: ScreenNav; }

const COMPONENTS = [
  {
    pct: 45,
    label: { uk: 'Втрата продуктивності праці', en: 'Lost labour productivity' },
    value: '$2.7–3.6B',
    color: '#ff7b6e',
    note: { uk: '3.9M осіб × 22% зниження продуктивності × mid-range зарплата', en: '3.9M people × 22% productivity decline × mid-range wage' },
  },
  {
    pct: 30,
    label: { uk: 'Cost-of-illness (медична система)', en: 'Cost-of-illness (health system)' },
    value: '$1.8–2.4B',
    color: '#e8c97a',
    note: { uk: 'Психіатрична госпіталізація, ліки, Crisis intervention (ЄБРР)', en: 'Psychiatric hospitalisation, medication, crisis intervention (EBRD)' },
  },
  {
    pct: 15,
    label: { uk: 'Довгострокова економічна ерозія (DALY)', en: 'Long-term economic erosion (DALYs)' },
    value: '$0.9–1.2B',
    color: '#00d4aa',
    note: { uk: '~320K DALY/рік × $3,000 WHO threshold — хронізація без лікування', en: '~320K DALYs/year × $3,000 WHO threshold — chronification without treatment' },
  },
  {
    pct: 10,
    label: { uk: 'Адміністративна ерозія та дублювання', en: 'Administrative erosion & duplication' },
    value: '$0.6B',
    color: '#a78bfa',
    note: { uk: '35K фахівців × 22% адмін. час × blended rate — пряма операційна втрата', en: '35K specialists × 22% admin time × blended rate — direct operational loss' },
  },
];

export const L2Cost: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(200,164,92,0.14) 0%, transparent 55%), ' +
        'linear-gradient(135deg, #0a1628 0%, #1a0a08 100%)',
    }}
  >
    <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #e8c97a 50%, transparent)', boxShadow: '0 0 14px rgba(232,201,122,0.4)' }} />

    <div className="flex items-center gap-4 px-6 pt-5 pb-3 flex-shrink-0">
      <button onClick={nav.back} className="flex items-center gap-1.5 text-[11px] ds-display font-medium" style={{ color: 'var(--color-ds-muted)' }}>
        <ArrowLeft className="w-4 h-4" /> {lang === 'uk' ? 'Назад' : 'Back'}
      </button>
      <div className="w-px h-4" style={{ background: 'var(--color-ds-border)' }} />
      <div>
        <div className="text-[18px] font-bold ds-display" style={{ color: '#e8c97a' }}>
          {lang === 'uk' ? 'Анатомія $6–8B втрат ВВП' : 'Anatomy of $6–8B GDP Loss'}
        </div>
        <div className="text-[11px] ds-body mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>
          {lang === 'uk'
            ? 'Чотири компоненти макроекономічних втрат від нелікованих психічних розладів (ЄБРР / LSE 2023)'
            : 'Four components of macroeconomic losses from untreated mental disorders (EBRD / LSE 2023)'}
        </div>
      </div>
      <div className="flex-1" />
      <button onClick={() => nav.push('appendix')} className="text-[11px] ds-display font-medium flex items-center gap-1" style={{ color: 'var(--color-ds-teal)' }}>
        {lang === 'uk' ? 'Повний аналіз →' : 'Full analysis →'} <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>

    {/* Pie-like decomposition */}
    <div className="flex-1 grid grid-cols-2 gap-4 px-6 pb-5 min-h-0">
      {/* Left: horizontal stacked bar + legend */}
      <div className="flex flex-col gap-4">
        <div className="cyber-label" style={{ color: '#e8c97a' }}>
          {lang === 'uk' ? 'СТРУКТУРА ВТРАТ' : 'LOSS BREAKDOWN'}
        </div>

        {/* Stacked bar */}
        <div className="h-8 rounded-xl overflow-hidden flex">
          {COMPONENTS.map((c, i) => (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              animate={{ width: `${c.pct}%` }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              style={{ background: c.color, opacity: 0.85 }}
              title={`${c.pct}%`}
            />
          ))}
        </div>

        {/* Component rows */}
        {COMPONENTS.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.color}33` }}
          >
            <div className="flex-shrink-0 w-10 text-center">
              <div className="text-[18px] font-bold ds-display" style={{ color: c.color }}>{c.pct}%</div>
            </div>
            <div>
              <div className="text-[12px] font-semibold ds-display mb-0.5" style={{ color: 'rgba(220,228,240,0.9)' }}>{c.label[lang]}</div>
              <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{c.note[lang]}</div>
            </div>
            <div className="ml-auto text-[16px] font-bold ds-display flex-shrink-0" style={{ color: c.color }}>{c.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Right: context + ROI */}
      <div className="flex flex-col gap-4">
        <div className="cyber-label" style={{ color: 'var(--color-ds-teal)' }}>
          {lang === 'uk' ? 'КОНТЕКСТ ТА ROI ВТРУЧАННЯ' : 'CONTEXT & INTERVENTION ROI'}
        </div>

        {[
          {
            label: { uk: 'Вартість закриття розриву', en: 'Cost to close the gap' },
            value: '$1.87B/рік',
            sub: { uk: '62.2M сесій × $30 (blended rate)', en: '62.2M sessions × $30 (blended rate)' },
            color: '#00d4aa',
          },
          {
            label: { uk: 'ROI інвестиції в MHPSS', en: 'ROI of MHPSS investment' },
            value: '4–6×',
            sub: { uk: 'WHO: кожен $1 в mental health = $4–6 економічного повернення', en: 'WHO: every $1 in mental health = $4–6 economic return' },
            color: '#e8c97a',
          },
          {
            label: { uk: 'WB THRIVE + HEAL (вже активні)', en: 'WB THRIVE + HEAL (already active)' },
            value: '$954M',
            sub: { uk: 'Кошти виділено, але невидимі послуги не рахуються для DLI', en: 'Funds allocated, but invisible services don\'t count for DLIs' },
            color: '#a78bfa',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 + 0.3 }}
            className="p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}33` }}
          >
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[11px] ds-body" style={{ color: 'rgba(200,208,220,0.75)' }}>{item.label[lang]}</span>
              <span className="text-[22px] font-bold ds-display" style={{ color: item.color }}>{item.value}</span>
            </div>
            <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{item.sub[lang]}</div>
          </motion.div>
        ))}

        {/* Bottom insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-auto p-4 rounded-xl"
          style={{ background: 'rgba(0,210,170,0.07)', border: '1px solid rgba(0,210,170,0.2)' }}
        >
          <p className="text-[12px] ds-body leading-relaxed" style={{ color: 'rgba(200,208,220,0.8)' }}>
            {lang === 'uk'
              ? 'Інвестиція $1.87B/рік поверне $7.5–11.2B через відновлення продуктивності. FEEL Again знижує транзакційні витрати до 3.5–7% — робить кожен долар ефективнішим.'
              : 'A $1.87B/yr investment returns $7.5–11.2B through restored productivity. FEEL Again reduces transaction costs to 3.5–7% — making every dollar more effective.'}
          </p>
          <div className="text-[10px] font-mono mt-2 pt-2" style={{ borderTop: '1px solid var(--color-ds-border)', color: 'var(--color-ds-muted)' }}>
            {lang === 'uk'
              ? 'Джерело: OCHA FTS 2025 · World Bank 2016 ROI $1→$4 · UNICEF CBA 2023 · WHO GNI-adj. · LSE/FHI 360 2023'
              : 'Source: OCHA FTS 2025 · World Bank 2016 ROI $1→$4 · UNICEF CBA 2023 · WHO GNI-adj. · LSE/FHI 360 2023'}
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);
