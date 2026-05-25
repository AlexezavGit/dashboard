import React, { useState, useEffect } from 'react';

interface JourneyItem {
  id: string;
  title: { uk: string; en: string };
  tool: string;
  desc: { uk: string; en: string };
}

interface Phase {
  id: string;
  title: { uk: string; en: string };
  lanes: Record<'beneficiary' | 'provider' | 'donor', JourneyItem | null>;
}

interface StakeholderJourneysProps {
  lang: 'uk' | 'en';
}

const ROLE_LABELS = {
  beneficiary: { uk: 'Бенефіціар', en: 'Beneficiary' },
  provider: { uk: 'Провайдер', en: 'Provider' },
  donor: { uk: 'Донор', en: 'Donor' },
} as const;

const MODES = {
  with: {
    key: 'with',
    label: { uk: 'З FEEL Again', en: 'With FEEL Again' },
    subtitle: {
      uk: 'Платформу FEEL Again включено в кожну фазу — від KoBo-скринінгу до ескроу-транзакцій.',
      en: 'FEEL Again is embedded in every phase — from KoBo screening to escrow transactions.',
    },
  },
  without: {
    key: 'without',
    label: { uk: 'Без FEEL Again', en: 'Without FEEL Again' },
    subtitle: {
      uk: 'Тут показано, як система працює без єдиного інтегрованого цифрового шару.',
      en: 'This shows the path without a unified digital layer.',
    },
  },
} as const;

const getPhases = (mode: 'with' | 'without'): Phase[] => [
  {
    id: 'phase-1',
    title: { uk: 'Діагностика', en: 'Diagnosis' },
    lanes: {
      beneficiary: {
        id: 'B1',
        title: { uk: 'Скринінг / KoBo', en: 'Screening / KoBo' },
        tool: mode === 'with' ? 'kobo.feelagain.me' : 'offline form',
        desc: {
          uk: mode === 'with'
            ? 'Автоматичне скринінг-формування з FEEL Again та KoBo для швидкого визначення клінічної потреби.'
            : 'Ручний збір даних через опитувальник без інтегрованого дорожнього маршруту.',
          en: mode === 'with'
            ? 'Automated screening via FEEL Again + KoBo for fast clinical need triage.'
            : 'Manual data collection using a questionnaire without an integrated flow.',
        },
      },
      provider: null,
      donor: null,
    },
  },
  {
    id: 'phase-2',
    title: { uk: 'Підбір', en: 'Matching' },
    lanes: {
      beneficiary: {
        id: 'B2',
        title: { uk: 'Первинна консультація', en: 'Intake Consultation' },
        tool: mode === 'with' ? 'feelagain.me/matching' : 'paper referral',
        desc: {
          uk: mode === 'with'
            ? 'Кейс-менеджер порівнює потребу з доступною мережею через FEEL Again.'
            : 'Підбір фахівця через локальний центр без цифрової оптимізації.',
          en: mode === 'with'
            ? 'A case manager matches need to available providers through FEEL Again.'
            : 'Provider matching via local center without digital optimisation.',
        },
      },
      provider: {
        id: 'P1',
        title: { uk: 'Реєстрація eHealth', en: 'eHealth Registration' },
        tool: mode === 'with' ? 'ehealth.gov.ua' : 'manual registry',
        desc: {
          uk: mode === 'with'
            ? 'Провайдер синхронізує дані з держреєстром і FEEL шиною.'
            : 'Провайдер реєструється окремо, без автоматичного обміну даними.',
          en: mode === 'with'
            ? 'Provider syncs credentials with the national registry and FEEL bus.'
            : 'Provider registers separately, without automated data exchange.',
        },
      },
      donor: null,
    },
  },
  {
    id: 'phase-3',
    title: { uk: 'Терапія', en: 'Therapy' },
    lanes: {
      beneficiary: {
        id: 'B4',
        title: { uk: 'Курс терапії', en: 'Therapy Course' },
        tool: mode === 'with' ? 'feelagain.me/therapy' : 'clinic services',
        desc: {
          uk: mode === 'with'
            ? 'Сесії ведуться з моніторингом прогресу в цифровому середовищі FEEL.'
            : 'Сесії організовуються офлайн, без централізованого трекінгу результатів.',
            en: mode === 'with'
            ? 'Sessions are tracked in the FEEL digital environment with progress monitoring.'
            : 'Sessions are organized offline without centralized outcome tracking.',
        },
      },
      provider: {
        id: 'P3',
        title: { uk: 'Кабінет надавача', en: 'Provider Cabinet' },
        tool: mode === 'with' ? 'feelagain.me/provider' : 'local scheduler',
        desc: {
          uk: mode === 'with'
            ? 'Провайдер керує чергами, записами та протоколами в одному інтерфейсі.'
            : 'Запис пацієнтів ведеться окремо, без єдиного цифрового екрану.',
            en: mode === 'with'
            ? 'Provider manages queues, appointments and protocols in one interface.'
            : 'Patient scheduling is conducted separately without a unified digital view.',
        },
      },
      donor: null,
    },
  },
  {
    id: 'phase-4',
    title: { uk: 'Верифікація', en: 'Verification' },
    lanes: {
      beneficiary: {
        id: 'B5',
        title: { uk: 'Зворотний зв’язок', en: 'Feedback Loop' },
        tool: mode === 'with' ? 'feelagain.me/feedback' : 'paper evaluation',
        desc: {
          uk: mode === 'with'
            ? 'Після лікування результат відстежується у цифровій формі.'
            : 'Після лікування збір зворотного зв’язку здійснюється вручну.',
            en: mode === 'with'
            ? 'Post-treatment outcomes are tracked digitally.'
            : 'Post-treatment feedback is collected manually.',
        },
      },
      provider: {
        id: 'P4',
        title: { uk: 'Результативна оплата', en: 'Outcome-Based Payment' },
        tool: mode === 'with' ? 'FEEL Escrow Bus' : 'manual claim',
        desc: {
          uk: mode === 'with'
            ? 'Провайдер отримує оплату за підтверджений результат через шину FEEL.'
            : 'Оплата формується вручну на підставі звітів і актів.',
            en: mode === 'with'
            ? 'Provider is paid through FEEL bus for verified outcomes.'
            : 'Payment is manually posted based on reports and forms.',
        },
      },
      donor: {
        id: 'D2',
        title: { uk: 'Дашборд верифікації', en: 'Verification Dashboard' },
        tool: mode === 'with' ? 'dashboard.feelagain.me' : 'legacy report',
        desc: {
          uk: mode === 'with'
            ? 'Донор бачить верифікацію даних у реальному часі.'
            : 'Донор отримує звіт за запитом, без онлайнової видимості.',
            en: mode === 'with'
            ? 'Donor sees real-time data verification.'
            : 'Donor receives reports on request without online transparency.',
        },
      },
    },
  },
  {
    id: 'phase-5',
    title: { uk: 'Фінансування', en: 'Financing' },
    lanes: {
      beneficiary: null,
      provider: {
        id: 'P5',
        title: { uk: 'Матчинг з донорами', en: 'Donor Matching' },
        tool: mode === 'with' ? 'FEEL Matcher' : 'ad hoc quota',
        desc: {
          uk: mode === 'with'
            ? 'Платформа автоматично узгоджує непогашені години з донорськими квотами.'
            : 'Матчинг відбувається вручну й зростає ризик непродуктивного часу.',
            en: mode === 'with'
            ? 'The platform auto-aligns unused hours with donor quotas.'
            : 'Matching happens manually and increases unproductive capacity.',
        },
      },
      donor: {
        id: 'D5',
        title: { uk: 'Кабінет донора: Матчинг', en: 'Donor Cabinet: Matching' },
        tool: mode === 'with' ? 'feelagain.me/donor' : 'legacy tender',
        desc: {
          uk: mode === 'with'
            ? 'Донор бачить, як бюджети розподіляються до сертифікованих провайдерів.'
            : 'Розподіл бюджету відбувається через довгі тендерні цикли.',
            en: mode === 'with'
            ? 'Donor sees budgets allocated to certified providers.'
            : 'Budget allocation occurs through slow tender cycles.',
        },
      },
    },
  },
  {
    id: 'phase-6',
    title: { uk: 'ESG / звітність', en: 'ESG / Reporting' },
    lanes: {
      beneficiary: null,
      provider: null,
      donor: {
        id: 'D6',
        title: { uk: 'Дошка пошани (ESG)', en: 'Honor Board (ESG)' },
        tool: mode === 'with' ? 'feelagain.me/esg' : 'annual audit',
        desc: {
          uk: mode === 'with'
            ? 'Публічна перевірка цільового використання коштів через цифровий ESG-канал.'
            : 'Звітність формується традиційно з ручною перевіркою.',
            en: mode === 'with'
            ? 'Public verification of targeted spending through a digital ESG channel.'
            : 'Reporting is created traditionally with manual validation.',
        },
      },
    },
  },
];

export function StakeholderJourneys({ lang }: StakeholderJourneysProps) {
  const [mode, setMode] = useState<'with' | 'without'>('with');
  const [isPlaying, setIsPlaying] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const phases = getPhases(mode);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (isPlaying) {
      setPhaseIndex(0);
      timer = setInterval(() => {
        setPhaseIndex((prev) => {
          const next = prev + 1;
          if (next >= phases.length) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, 2200);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, phases.length]);

  const activePhase = phases[phaseIndex] || phases[phases.length - 1];

  return (
    <div className="w-full max-w-[1100px] mx-auto text-[var(--color-ds-text)]">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--color-ds-teal)] border-b border-[var(--color-ds-border)] pb-2 inline-block">
            {lang === 'uk' ? 'Дельта Моделі: Stakeholder Journeys' : 'Delta Model: Stakeholder Journeys'}
          </h3>
          <p className="text-sm text-[var(--color-ds-muted)] mt-2 max-w-2xl">
            {lang === 'uk'
              ? 'Три ролі рухаються в єдиному таймлайні з початковою діагностикою бенефіціара та поступовим підключенням провайдера й донора. Перемикач показує різницю між FEEL Again та традиційним процесом.'
              : 'Three roles move within one timeline, starting with beneficiary diagnosis and progressively adding provider and donor stages. The toggle reveals the difference between FEEL Again and a traditional path.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
          <div className="rounded-xl border border-[var(--color-ds-border)] bg-[var(--color-ds-bg-card)] px-4 py-3 text-[11px]">
            <div className="font-bold text-[var(--color-ds-text)]">{MODES[mode].label[lang]}</div>
            <div className="mt-1 text-[var(--color-ds-muted)] text-xs leading-snug">{MODES[mode].subtitle[lang]}</div>
          </div>
          <div className="flex gap-2">
            {(['with', 'without'] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  setMode(option);
                  setIsPlaying(false);
                  setPhaseIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${mode === option ? 'bg-[var(--color-ds-teal)] text-black' : 'bg-[var(--color-ds-bg)] text-[var(--color-ds-muted)] border border-[var(--color-ds-border)]'}`}
              >
                {MODES[option].label[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4">
        <div className="space-y-2">
          {(['beneficiary', 'provider', 'donor'] as const).map((role) => (
            <div key={role} className="rounded-xl border border-[var(--color-ds-border)] bg-[var(--color-ds-bg-card)] p-3 text-[11px] uppercase tracking-wide text-[var(--color-ds-muted)]">
              {ROLE_LABELS[role][lang]}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {phases.map((phase, index) => (
              <div
                key={phase.id}
                className={`rounded-xl border p-3 text-[11px] ${index === phaseIndex ? 'border-[var(--color-ds-teal)] bg-[rgba(0,212,170,0.05)]' : 'border-[var(--color-ds-border)] bg-[var(--color-ds-bg)]'}`}
              >
                <div className="font-bold uppercase tracking-wide text-[var(--color-ds-gold)] mb-2">
                  {lang === 'uk' ? phase.title.uk : phase.title.en}
                </div>
                <div className="text-[10px] text-[var(--color-ds-muted)]">{lang === 'uk' ? `Фаза ${index + 1}` : `Phase ${index + 1}`}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {(['beneficiary', 'provider', 'donor'] as const).map((role) => (
              <div key={role} className="space-y-3">
                {phases.map((phase, phaseIdx) => {
                  const item = phase.lanes[role];
                  const isActive = phaseIdx === phaseIndex;
                  return (
                    <div
                      key={`${role}-${phase.id}`}
                      className={`rounded-2xl border p-4 transition-all duration-200 ${item ? 'bg-[var(--color-ds-bg-card)] border-[var(--color-ds-border)]' : 'bg-transparent border border-transparent opacity-25'} ${isActive && item ? 'shadow-[0_0_20px_rgba(0,212,170,0.12)] border-[var(--color-ds-teal)]' : ''}`}
                    >
                      {item ? (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono text-[var(--color-ds-muted)]">{item.id}</span>
                            <span className="text-[9px] font-semibold text-[var(--color-ds-teal)] break-all max-w-[140px]">{item.tool}</span>
                          </div>
                          <h4 className="text-sm font-bold mb-2 text-[var(--color-ds-text)]">
                            {lang === 'uk' ? item.title.uk : item.title.en}
                          </h4>
                          <p className="text-[11px] leading-snug text-[var(--color-ds-muted)]">
                            {lang === 'uk' ? item.desc.uk : item.desc.en}
                          </p>
                        </>
                      ) : (
                        <div className="text-[11px] text-[var(--color-ds-muted)]">{lang === 'uk' ? 'Без активної ролі в цій фазі' : 'No active role in this phase'}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[var(--color-ds-border)] pt-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-ds-gold)] mb-1">{lang === 'uk' ? 'Поточна фаза' : 'Current phase'}</div>
          <div className="text-sm font-bold text-[var(--color-ds-text)]">{lang === 'uk' ? activePhase.title.uk : activePhase.title.en}</div>
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${isPlaying ? 'bg-[var(--color-ds-teal)] text-black' : 'bg-[var(--color-ds-bg)] text-[var(--color-ds-muted)] border border-[var(--color-ds-border)]'}`}
        >
          {isPlaying
            ? lang === 'uk' ? 'Анімація запущена' : 'Animation running'
            : lang === 'uk' ? 'Запустити покрокову демонстрацію' : 'Run step-by-step demo'}
        </button>
      </div>
    </div>
  );
}
