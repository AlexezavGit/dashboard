import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';
import { L3Footer } from './L3Footer';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

const FLOW = [
  { actor: 'Bilateral donors', share: 78, color: '#c084fc', label: { uk: 'EC / USAID / FCDO / BMZ', en: 'EC / USAID / FCDO / BMZ' } },
  { actor: 'UN Agencies', share: 15, color: '#a78bfa', label: { uk: 'UNICEF / WHO / UNHCR', en: 'UNICEF / WHO / UNHCR' } },
  { actor: 'INGOs', share: 6, color: '#9061f9', label: { uk: 'IMC / ACF / MSF та ін.', en: 'IMC / ACF / MSF et al.' } },
  { actor: { uk: 'Укр. організ.', en: 'Ukrainian orgs' }, share: 1, color: '#ff7b6e', label: { uk: 'Всі місцеві НГО', en: 'All local NGOs' } },
];

const MILESTONES = [
  { year: '2016', event: { uk: 'Grand Bargain: ≥25% до локальних акторів', en: 'Grand Bargain: ≥25% to local actors' }, achieved: false },
  { year: '2024', event: { uk: 'Grand Bargain 3.0: акцент на цифровій підзвітності', en: 'Grand Bargain 3.0: focus on digital accountability' }, achieved: true },
  { year: '2025', event: { uk: 'Ukraine MH відповідь: >$400M — <1% локалізовано', en: 'Ukraine MH response: >$400M — <1% localized' }, achieved: false },
  { year: '2026+', event: { uk: 'Humanitarian Reset: перехід до національних систем', en: 'Humanitarian Reset: transition to national systems' }, achieved: true },
];

export const L2Regulatory: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
    style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f0a1a 100%)' }}
  >
    <div className="h-[2px] w-full flex-shrink-0"
      style={{ background: 'linear-gradient(90deg, transparent, #c084fc, #a855f7, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(192,132,252,0.5)' }} />

    <NavBar
      lang={lang}
      nav={nav}
      accentColor="#c084fc"
      title={{ uk: 'Локалізація гуманітарних ресурсів', en: 'Humanitarian localization' }}
      subtitle={{ uk: 'Regulatory · ціль ≥25%', en: 'Regulatory · target ≥25%' }}
      crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
    />

    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 px-6 pb-0 pt-3 min-h-0 overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-5 flex-shrink-0"
          style={{ background: 'rgba(192,132,252,0.07)', border: '1px solid rgba(192,132,252,0.3)' }}>
          <div className="ds-display font-black leading-none" style={{ fontSize: '72px', color: '#c084fc', textShadow: '0 0 40px rgba(192,132,252,0.5)' }}>
            ~1%
          </div>
          <div className="text-[15px] font-semibold ds-body mt-2" style={{ color: 'rgba(200,208,220,0.9)' }}>
            {t('гуманітарного MH фінансування через укр. організації', 'humanitarian MH funding via Ukrainian organisations', lang)}
          </div>
          <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Grand Bargain commitment: ≥25% до 2025 — не виконано', 'Grand Bargain commitment: ≥25% by 2025 — unmet', lang)}
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-5 min-h-0"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Розподіл гуманітарного фінансування', 'Humanitarian fund flow', lang)}
          </div>
          <div className="space-y-3">
            {FLOW.map((f) => (
              <div key={typeof f.actor === 'string' ? f.actor : f.actor.uk}>
                <div className="flex justify-between mb-1">
                  <span className="text-[13px] ds-display font-semibold" style={{ color: 'var(--color-ds-text)' }}>
                    {typeof f.actor === 'string' ? f.actor : f.actor[lang]}
                  </span>
                  <span className="text-[14px] font-bold ds-display" style={{ color: f.color }}>{f.share}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-2 rounded-full" style={{
                    width: `${f.share}%`,
                    background: f.color,
                    boxShadow: f.share === 1 ? `0 0 8px ${f.color}88` : undefined,
                  }} />
                </div>
                <div className="text-[10px] ds-body mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>{f.label[lang]}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] font-mono" style={{ color: '#ff7b6e' }}>
            {t('⟶ 99% капіталу поза прямим укр. управлінням', '⟶ 99% capital outside direct Ukrainian management', lang)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Хронологія зобов\'язань', 'Commitment timeline', lang)}
          </div>
          <div className="space-y-3">
            {MILESTONES.map((m) => (
              <div key={m.year} className="flex gap-3 items-start">
                <div className="text-[12px] font-bold ds-display w-12 flex-shrink-0 mt-0.5"
                  style={{ color: m.achieved ? 'var(--color-ds-gold)' : 'var(--color-ds-muted)' }}>
                  {m.year}
                </div>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                  style={{ background: m.achieved ? 'var(--color-ds-gold)' : '#ff7b6e', boxShadow: m.achieved ? '0 0 8px rgba(200,164,92,0.5)' : undefined }} />
                <div className="text-[12px] ds-body" style={{ color: m.achieved ? 'var(--color-ds-text)' : 'var(--color-ds-muted)' }}>
                  {m.event[lang]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-5 overflow-y-auto" style={{ maxHeight: '320px', background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.3)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-gold)' }}>
            {t('Виконати humanitarian reset (Tom Fletcher)', 'Execute humanitarian reset (Tom Fletcher)', lang)}
          </div>
          <div className="space-y-3">
            {[
              { uk: 'Сягнути показників Grand Bargain 3.0 через цифрову прозорість', en: 'Meet Grand Bargain 3.0 metrics via digital transparency' },
              { uk: 'Реєстраційний фреймворк: акредитація місцевих MH-НГО', en: 'Registration framework: accreditation for local MH NGOs' },
              { uk: 'Pass-through механізм: пряме фінансування верифікованих акторів', en: 'Pass-through mechanism: direct funding for verified actors' },
              { uk: 'Reporting Bus: автоматична звітність у державні реєстри', en: 'Reporting Bus: automated reporting into state registries' },
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
              {t('Джерело: Grand Bargain 2016 · OCHA Ukraine 2024 · OECD-DAC CRS', 'Source: Grand Bargain 2016 · OCHA Ukraine 2024 · OECD-DAC CRS', lang)}
            </div>
          </div>
        </div>
      </div>
    </div>
    <L3Footer lang={lang} nav={nav} />
  </div>
);
