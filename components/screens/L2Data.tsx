import React from 'react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { NavBar } from './NavBar';

interface Props { lang: Language; nav: ScreenNav; }

const t = (uk: string, en: string, lang: Language) => lang === 'uk' ? uk : en;

const SYSTEMS = [
  { name: 'NHSU / НСЗУ', desc: { uk: '260K MH-пацієнтів 2025, капітаційні виплати', en: '260K MH patients 2025, capitation payments' } },
  { name: 'ESOZ', desc: { uk: '36.5M users, ВПО + реінтеграція', en: '36.5M users, IDPs + reintegration' } },
  { name: 'HELSI', desc: { uk: 'ЕМК для первинної ланки', en: 'EHR for primary care' } },
  { name: 'Reint. Portal', desc: { uk: 'Портал ветеранів МВС / МОЗ', en: 'Veterans portal MoI / MoH' } },
  { name: 'Private EHRs', desc: { uk: '303 приватні клініки, власний облік', en: '303 private clinics, own records' } },
];

const THREE_PRICE = [
  { rate: '€40/hr', label: { uk: 'Гуманітарна ставка', en: 'Humanitarian rate' }, total: '€2.50B' },
  { rate: '€50/hr', label: { uk: 'Операційна ставка', en: 'Operational rate' }, total: '€3.12B' },
  { rate: '€65/hr', label: { uk: 'Ринкова ставка', en: 'Market rate' }, total: '€4.06B' },
];

export const L2Data: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden"
    style={{ background: 'linear-gradient(135deg, #0a1628 0%, #001a14 100%)' }}
  >
    <div className="h-[2px] w-full flex-shrink-0"
      style={{ background: 'linear-gradient(90deg, transparent, #00d4aa, #2ec4b6, rgba(200,164,92,0.4))', boxShadow: '0 0 18px rgba(0,212,170,0.5)' }} />

    <NavBar
      lang={lang}
      nav={nav}
      accentColor="#00d4aa"
      title={{ uk: 'Інтероперабельність', en: 'Interoperability' }}
      subtitle={{ uk: 'Data & Coord · MHEI w20% · ціль ≥60%', en: 'Data & Coord · MHEI w20% · target ≥60%' }}
      crumbs={[{ label: { uk: 'Ландшафт', en: 'Landscape' }, screen: 'l1' }]}
    />

    <div className="flex-1 grid grid-cols-2 gap-5 px-6 pb-4 pt-3 min-h-0">
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-5 flex-shrink-0"
          style={{ background: 'rgba(0,210,170,0.07)', border: '1px solid rgba(0,210,170,0.3)' }}>
          <div className="ds-display font-black leading-none" style={{ fontSize: '72px', color: '#00d4aa', textShadow: '0 0 40px rgba(0,212,170,0.5)' }}>
            &lt;5%
          </div>
          <div className="text-[15px] font-semibold ds-body mt-2" style={{ color: 'rgba(200,208,220,0.9)' }}>
            {t('сесій з крос-системним цифровим записом', 'sessions with cross-system digital record', lang)}
          </div>
          <div className="text-[11px] font-mono mt-1" style={{ color: 'var(--color-ds-muted)' }}>
            {t('NHSU ↔ ESOZ (HL7 FHIR R4) — pilot лише', 'NHSU ↔ ESOZ (HL7 FHIR R4) — pilot only', lang)}
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-5 min-h-0"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('5 систем · 0 з\'єднань', '5 systems · 0 connections', lang)}
          </div>
          <div className="space-y-2.5">
            {SYSTEMS.map((s) => (
              <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#ff7b6e', boxShadow: '0 0 6px rgba(255,123,110,0.6)' }} />
                <div>
                  <div className="text-[13px] font-bold ds-display" style={{ color: 'var(--color-ds-text)' }}>{s.name}</div>
                  <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{s.desc[lang]}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] font-mono" style={{ color: '#ff7b6e' }}>
            ⊘ {t('Жодного FHIR R4 API між системами', 'No FHIR R4 API between any systems', lang)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-ds-border)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('3-Price Architecture · непокрита вартість', '3-Price Architecture · unmet session value', lang)}
          </div>
          <div className="text-[11px] ds-body mb-3" style={{ color: 'var(--color-ds-muted)' }}>
            {t('62.4M сесій/рік · 6.8M осіб × 9.2 сесії', '62.4M sessions/yr · 6.8M need × 9.2 sessions', lang)}
          </div>
          <div className="space-y-2.5">
            {THREE_PRICE.map((p) => (
              <div key={p.rate} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.2)' }}>
                <div>
                  <div className="text-[13px] font-bold ds-display" style={{ color: 'var(--color-ds-gold)' }}>{p.rate}</div>
                  <div className="text-[10px] ds-body" style={{ color: 'var(--color-ds-muted)' }}>{p.label[lang]}</div>
                </div>
                <div className="text-[20px] font-black ds-display" style={{ color: 'var(--color-ds-gold)' }}>{p.total}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-[10px] font-mono" style={{ color: 'var(--color-ds-muted)' }}>
            {t('Весь обсяг невидимий без інтероперабельних даних', 'Entire volume invisible without interoperable data', lang)}
          </div>
        </div>

        <div className="flex-1 rounded-2xl p-5"
          style={{ background: 'rgba(200,164,92,0.06)', border: '1px solid rgba(200,164,92,0.3)' }}>
          <div className="text-[11px] font-mono uppercase tracking-wider mb-3" style={{ color: 'var(--color-ds-gold)' }}>
            {t('FEEL Again · Шлях до 60%', 'FEEL Again · Pathway to 60%', lang)}
          </div>
          <div className="space-y-3">
            {[
              { uk: 'Integration Gateway — єдина точка входу для 5 систем', en: 'Integration Gateway — single entry point for 5 systems' },
              { uk: 'HL7 FHIR R4 service bus: NHSU ↔ ESOZ ↔ HELSI', en: 'HL7 FHIR R4 service bus: NHSU ↔ ESOZ ↔ HELSI' },
              { uk: '10K req/sec · <200ms p95 · 99.95% uptime', en: '10K req/sec · <200ms p95 · 99.95% uptime' },
              { uk: 'Анонімізований аналітичний шар → NBU / МОЗ звіти', en: 'Anonymised analytics layer → NBU / MoH reports' },
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
              {t('Джерело: NHSU 2025 · ESOZ API docs · WHO FHIR 2024', 'Source: NHSU 2025 · ESOZ API docs · WHO FHIR 2024', lang)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
