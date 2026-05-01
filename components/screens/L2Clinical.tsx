import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

const DROP_STAGES = [
  { stage: { uk: 'Сесія 1', en: 'Session 1' }, pct: 85, note: { uk: 'Первинний контакт', en: 'First contact' } },
  { stage: { uk: 'Сесія 3', en: 'Session 3' }, pct: 55, note: { uk: 'Криза мотивації', en: 'Motivation crisis' } },
  { stage: { uk: 'Сесія 6', en: 'Session 6' }, pct: 40, note: { uk: 'Завершення протоколу', en: 'Protocol completion' } },
  { stage: { uk: 'Ціль ≥80%', en: 'Target ≥80%' }, pct: 80, note: { uk: 'mhGAP повний курс', en: 'mhGAP full course' }, isTarget: true },
];

const DRIVERS = [
  { icon: '⟶', val: { uk: '5 систем, 0 синхронізацій', en: '5 systems, 0 syncs' }, desc: { uk: 'NHSU / ESOZ / HELSI / Reint. Portal / приватні ЕМК', en: 'NHSU / ESOZ / HELSI / Reint. Portal / private EHRs' } },
  { icon: '⊘', val: { uk: 'Немає авто-нагадувань', en: 'No auto-reminders' }, desc: { uk: 'Пацієнт зникає — системи не сповіщають', en: 'Patient disappears — no system alert' } },
  { icon: '⊜', val: { uk: '260K НСЗУ пацієнтів 2025', en: '260K NHSU patients 2025' }, desc: { uk: 'тільки первинна ланка видима НСЗУ', en: 'only primary care visible to NHSU' } },
];

export const L2Clinical: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a0808 100%)' }}
  >
    <div className="h-[2px] w-full flex-shrink-0"
      style={{ background: 'linear-gradient(90deg, transparent, #ff7b6e, #ff4444, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(255,123,110,0.5)' }} />

    <NavBar
      lang={lang}
      nav={nav}
      accentColor="#ff7b6e"
      title={{ uk: 'Завершуваність реабілітації', en: 'Rehabilitation completion' }}
      subtitle={{ uk: 'Clinical · MHEI w25% · ціль ≥80%', en: 'Clinical · MHEI w25% · target ≥80%' }}
      crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
    />

    <div className="flex-1 grid grid-cols-2 gap-5 px-6 pb-4 pt-3 min-h-0">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-5 flex-shrink-0"
          style={{ background: 'rgba(224,85,69,0.08)', border: '1px solid rgba(255,123,110,0.3)' }}>
          <div className="ds-display font-black leading-none" style={{ fontSize: '72px', color: '#ff7b6e', textShadow: '0 0 40px rgba(255,123,110,0.5)' }}>
            ~40%
          </div>
          <div className="text-[15px] font-semibold ds-body mt-2" style={{ color: 'rgba(200,208,220,0.9)' }}>
            {t('епізодів завершено / розпочато', 'episodes completed / initiated', lang)}
          </div>
          <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Епізод = ≥6 сесій / ≥3 міс. (mhGAP)', 'Episode = ≥6 sessions / ≥3 mo. (mhGAP)', lang)}
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-5 min-h-0"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Відсів по протоколу', 'Protocol drop-off', lang)}
          </div>
          <div className="space-y-4">
            {DROP_STAGES.map((s) => (
              <div key={s.stage.uk}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[13px] ds-display font-semibold" style={{ color: s.isTarget ? 'var(--color-ds-gold)' : 'var(--color-ds-text)' }}>
                    {s.stage[lang]}
                  </span>
                  <span className="text-[15px] font-bold ds-display" style={{ color: s.isTarget ? 'var(--color-ds-gold)' : '#ff7b6e' }}>
                    {s.pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-2 rounded-full" style={{
                    width: `${s.pct}%`,
                    background: s.isTarget ? 'var(--color-ds-gold)' : `rgba(255,123,110,${0.4 + (s.pct / 200)})`,
                    boxShadow: s.isTarget ? '0 0 8px rgba(200,164,92,0.5)' : undefined,
                  }} />
                </div>
                <div className="text-[10px] ds-body mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>{s.note[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Системні драйвери відсіву', 'Systemic drop-off drivers', lang)}
          </div>
          <div className="space-y-4">
            {DRIVERS.map((d, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="text-[20px] leading-none mt-0.5" style={{ color: '#ff7b6e' }}>{d.icon}</div>
                <div>
                  <div className="text-[14px] font-bold ds-display" style={{ color: 'var(--color-ds-text)' }}>{d.val[lang]}</div>
                  <div className="text-[11px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{d.desc[lang]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-5"
          style={{ background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.3)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-gold)' }}>
            {t('FEEL Again · Шлях до 80%', 'FEEL Again · Pathway to 80%', lang)}
          </div>
          <div className="space-y-3">
            {[
              { uk: 'Єдиний episode tracker — одна картка, 5 систем', en: 'Unified episode tracker — one record, 5 systems' },
              { uk: 'Авто-нагадування + ескалація при відсіві після сесії 2', en: 'Auto-reminders + escalation on drop-off after session 2' },
              { uk: 'FHIR R4 bridge: NHSU ↔ ESOZ → видимість по всьому епізоду', en: 'FHIR R4 bridge: NHSU ↔ ESOZ → full episode visibility' },
              { uk: 'HL7 CDA export → страховий виплат при завершенні', en: 'HL7 CDA export → insurance disbursement on completion' },
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
              {t('Джерело: NHSU open data 2025 · Lancet 2024 · mhGAP IG v3', 'Source: NHSU open data 2025 · Lancet 2024 · mhGAP IG v3', lang)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
