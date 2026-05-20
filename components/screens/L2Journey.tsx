import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { L3Footer } from './L3Footer';
import { StakeholderJourneys } from '../StakeholderJourneys';

interface Props { lang: Language; nav: ScreenNav; }

const T = {
  back: { uk: 'Назад', en: 'Back' },
  title: { uk: 'Мапа Інтеграції (Шляхи)', en: 'Integration Map (Journeys)' },
  subtitle: {
    uk: 'Екосистемна взаємодія донорів, провайдерів та бенефіціарів',
    en: 'Ecosystem interaction of donors, providers, and beneficiaries',
  },
};

export const L2Journey: React.FC<Props> = ({ lang, nav }) => (
  <div
    className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
    style={{
      background: 'linear-gradient(135deg, #0a1628 0%, #180808 100%)',
    }}
  >
    <div className="h-px w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #4488ff, #00d4aa 60%, transparent)', boxShadow: '0 0 14px rgba(68,136,255,0.4)' }} />

    {/* Header */}
    <div className="flex items-center gap-3 px-5 pt-4 pb-2 flex-shrink-0 z-10">
      <button
        onClick={nav.back}
        className="flex items-center gap-2 px-4 py-2 rounded-xl ds-display font-bold flex-shrink-0 transition-all"
        style={{ background: 'rgba(68,136,255,0.16)', border: '2px solid #4488ff', color: '#4488ff', fontSize: '12px' }}
      >
        <ArrowLeft className="w-4 h-4" /> {T.back[lang]}
      </button>
      <div>
        <div className="text-[17px] font-bold ds-display" style={{ color: '#4488ff' }}>{T.title[lang]}</div>
        <div className="text-[10px] ds-body mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>{T.subtitle[lang]}</div>
      </div>
    </div>

    {/* Main content */}
    <div className="flex-1 overflow-y-auto px-5 pb-8 min-h-0 z-10 relative">
      <StakeholderJourneys lang={lang} />
    </div>

    <L3Footer lang={lang} nav={nav} />
  </div>
);
