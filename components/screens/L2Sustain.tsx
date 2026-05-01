import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

const PIPELINE = [
  { label: { uk: 'Сертифіковано mhGAP', en: 'mhGAP certified' }, val: '~25K', w: '100%' },
  { label: { uk: 'Активних 12 міс.', en: 'Active at 12 mo.' }, val: '~10K', w: '40%', dim: true },
  { label: { uk: 'Видимих у реєстрі', en: 'Visible in registry' }, val: '~6K', w: '24%', dim: true },
  { label: { uk: 'Верифікованих НСЗУ', en: 'NHSU-verified' }, val: '~4K', w: '16%', dim: true },
];

const BARRIERS = [
  { uk: 'Відсутній реєстр активних практиків — немає pull-ефекту', en: 'No active practitioner registry — no pull effect' },
  { uk: 'Немає супервізійної мережі → ізоляція після навчання', en: 'No supervision network → isolation post-training' },
  { uk: 'Карʼєрний шлях не визначено: сертифікат ≠ посада ≠ оплата', en: 'Career pathway undefined: cert ≠ position ≠ payment' },
  { uk: 'Imitation Index: практик бачить що інші не практикують → зупиняється', en: 'Imitation Index: sees peers not practicing → stops' },
];

export const L2Sustain: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #0a1628 0%, #120a1a 100%)' }}
  >
    <div className="h-[2px] w-full flex-shrink-0"
      style={{ background: 'linear-gradient(90deg, transparent, #a78bfa, #8b5cf6, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(167,139,250,0.5)' }} />

    <NavBar
      lang={lang}
      nav={nav}
      accentColor="#a78bfa"
      title={{ uk: 'Конверсія навчання (Imitation Index)', en: 'Training conversion (Imitation Index)' }}
      subtitle={{ uk: 'Sustainable Dev · MHEI w15% · ціль ≥70%', en: 'Sustainable Dev · MHEI w15% · target ≥70%' }}
      crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
    />

    <div className="flex-1 grid grid-cols-2 gap-5 px-6 pb-4 pt-3 min-h-0">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-5 flex-shrink-0"
          style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.3)' }}>
          <div className="ds-display font-black leading-none" style={{ fontSize: '72px', color: '#a78bfa', textShadow: '0 0 40px rgba(167,139,250,0.5)' }}>
            ~35%
          </div>
          <div className="text-[15px] font-semibold ds-body mt-2" style={{ color: 'rgba(200,208,220,0.9)' }}>
            {t('mhGAP-сертифікованих активних через 12 місяців', 'mhGAP-certified active at 12 months', lang)}
          </div>
          <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>
            {t('~10K активних / ~25K сертифікованих = Imitation Index', '~10K active / ~25K certified = Imitation Index', lang)}
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-5 min-h-0"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Воронка фахівців', 'Workforce funnel', lang)}
          </div>
          <div className="space-y-3">
            {PIPELINE.map((p, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] ds-display font-semibold" style={{ color: p.dim ? 'var(--color-ds-muted)' : 'var(--color-ds-text)' }}>
                    {p.label[lang]}
                  </span>
                  <span className="text-[14px] font-bold ds-display" style={{ color: '#a78bfa', opacity: p.dim ? 0.65 : 1 }}>
                    {p.val}
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-2 rounded-full" style={{ width: p.w, background: '#a78bfa', opacity: p.dim ? 0.45 : 0.9 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] font-mono" style={{ color: '#ff7b6e' }}>
            {t('⟶ 65% сертифікатів не конвертуються в практику', '⟶ 65% of certificates do not convert to practice', lang)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Барʼєри конверсії', 'Conversion barriers', lang)}
          </div>
          <div className="space-y-3">
            {BARRIERS.map((b, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="text-[16px] leading-none mt-0.5" style={{ color: '#ff7b6e' }}>⊘</div>
                <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-text)' }}>{b[lang]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-5"
          style={{ background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.3)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-gold)' }}>
            {t('FEEL Again · Train for Care · Шлях до 70%', 'FEEL Again · Train for Care · Pathway to 70%', lang)}
          </div>
          <div className="space-y-3">
            {[
              { uk: 'Реєстр активних практиків: верифікація кожні 6 міс.', en: 'Active practitioner registry: verification every 6 mo.' },
              { uk: 'Peer-supervision network: 1 супервізор на 8 практиків', en: 'Peer-supervision network: 1 supervisor per 8 practitioners' },
              { uk: 'Карʼєрний трек: сертифікат → НСЗУ-контракт → оплата', en: 'Career track: certificate → NHSU contract → payment' },
              { uk: 'Imitation pull: видимість практики колег → зростання Index', en: 'Imitation pull: peer practice visibility → Index growth' },
            ].map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{ background: 'rgba(200,164,92,0.2)', color: 'var(--color-ds-gold)', border: '1px solid rgba(200,164,92,0.4)' }}>
                  {i + 1}
                </div>
                <div className="text-[12px] ds-body" style={{ color: 'var(--color-ds-text)' }}>{item[lang]}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--color-ds-border)' }}>
            <div className="text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
              {t('Джерело: NHSU 2025 · WHO mhGAP 2023 · Train for Care оцінка', 'Source: NHSU 2025 · WHO mhGAP 2023 · Train for Care assessment', lang)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
