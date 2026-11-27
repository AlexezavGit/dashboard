import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { L3Footer } from './L3Footer';

interface Props { lang: Language; nav: ScreenNav; }

type RoleId = 'recipient' | 'provider' | 'patron' | 'auditor';

const T = {
  back: { uk: 'Назад', en: 'Back' },
  title: { uk: 'Вхід до кабінетів', en: 'Cabinet Entry' },
  subtitle: {
    uk: 'Загальна точка розгалуження потоків: обрана роль веде у відповідний кабінет',
    en: 'The shared fork of flows: a selected role leads to its cabinet',
  },
  hint: {
    uk: 'Кабінет — окремий пакет розробки; адреси нижче зарезервовані рішенням 03-CABINET-ENTRY',
    en: 'Each cabinet ships as a separate package; addresses below are reserved per decision 03-CABINET-ENTRY',
  },
};

const BRANCHES: Array<{
  role: RoleId;
  name: { uk: string; en: string };
  desc: { uk: string; en: string };
  address: string;
  addressPending?: boolean;
  accentVar: string;
}> = [
  {
    role: 'recipient',
    name: { uk: 'Бенефіціар', en: 'Beneficiary' },
    desc: {
      uk: 'Анонімна діагностика, направлення й супровід маршруту допомоги',
      en: 'Anonymous screening, referral and supported care route',
    },
    address: 'recipient.feelagain.me',
    accentVar: 'var(--color-ds-sand)',
  },
  {
    role: 'provider',
    name: { uk: 'Надавач', en: 'Provider' },
    desc: {
      uk: 'Реєстрація, черги, протоколи й оплата прийнятої послуги',
      en: 'Registration, queues, protocols and payment for accepted services',
    },
    address: 'provider.feelagain.me',
    accentVar: 'var(--color-ds-sand-dark)',
  },
  {
    role: 'patron',
    name: { uk: 'Донор / актор', en: 'Donor / actor' },
    desc: {
      uk: 'Обсяг і вплив видно до внеску; депонування й таргетування коштів',
      en: 'Scale and impact visible before the contribution; escrow and targeting',
    },
    address: 'patron.feelagain.me',
    accentVar: 'var(--color-cyber-cyan)',
  },
  {
    role: 'auditor',
    name: { uk: 'Аудитор / аналітик', en: 'Auditor / analyst' },
    desc: {
      uk: 'Незалежна верифікація даних і публічна перевірка ESG-звітності',
      en: 'Independent data verification and public ESG review',
    },
    address: 'адреса — у фінальному синтезі',
    addressPending: true,
    accentVar: 'var(--color-cyber-success)',
  },
];

const ROLE_LABEL: Record<RoleId, string> = {
  recipient: 'recipient',
  provider: 'provider',
  patron: 'donor',
  auditor: 'auditor',
};

export const L2CabinetEntry: React.FC<Props> = ({ lang, nav }) => {
  const [selected, setSelected] = useState<RoleId | null>(() => {
    try {
      const v = sessionStorage.getItem('feel-cabinet-role');
      return (BRANCHES.some((b) => b.role === v) ? v : null) as RoleId | null;
    } catch { return null; }
  });

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden ds-screen">
      <div className="h-px w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, var(--color-ds-royal), var(--color-ds-teal) 60%, transparent)' }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2 flex-shrink-0 z-10">
        <button
          onClick={nav.back}
          className="flex items-center gap-2 px-4 py-2 rounded-xl ds-display font-bold flex-shrink-0 transition-all"
          style={{ background: 'var(--color-ds-royal-dim)', border: '2px solid var(--color-ds-royal)', color: 'var(--color-ds-royal)', fontSize: '12px' }}
        >
          <ArrowLeft className="w-4 h-4" /> {T.back[lang]}
        </button>
        <div>
          <div className="text-[17px] font-bold ds-display" style={{ color: 'var(--color-ds-text)' }}>{T.title[lang]}</div>
          <div className="text-[10px] ds-body mt-0.5" style={{ color: 'var(--color-ds-muted)' }}>{T.subtitle[lang]}</div>
        </div>
      </div>

      {/* Branches */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 min-h-0 z-10 relative">
        <div className="w-full max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {BRANCHES.map((b) => {
              const isSelected = selected === b.role;
              return (
                <div
                  key={b.role}
                  data-role={ROLE_LABEL[b.role]}
                  className="rounded-2xl p-5 transition-all"
                  style={{
                    background: 'var(--color-ds-bg-card)',
                    border: `1px solid ${isSelected ? b.accentVar : 'var(--color-ds-border)'}`,
                    borderLeft: `4px solid ${b.accentVar}`,
                    boxShadow: isSelected ? `0 0 20px var(--color-ds-teal-dim)` : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded"
                      style={{ color: b.accentVar, background: `color-mix(in srgb, ${b.accentVar} 9%, transparent)` }}
                    >
                      {b.name[lang]}
                    </span>
                    <ArrowUpRight className="w-4 h-4" style={{ color: b.accentVar }} />
                  </div>
                  <p className="text-[12px] leading-snug mb-3" style={{ color: 'var(--color-ds-text)' }}>
                    {b.desc[lang]}
                  </p>
                  <div className="text-[10px] font-mono pt-2" style={{ borderTop: '1px solid var(--color-ds-border)', color: b.addressPending ? 'var(--color-ds-muted)' : b.accentVar }}>
                    {b.address}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] ds-body mt-4 max-w-2xl" style={{ color: 'var(--color-ds-muted)' }}>
            {T.hint[lang]}
          </p>
        </div>
      </div>

      <L3Footer lang={lang} nav={nav} />
    </div>
  );
};
