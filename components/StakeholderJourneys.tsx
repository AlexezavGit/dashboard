import React, { useState, useEffect } from 'react';

interface JourneyStep {
  id: string;
  title: { uk: string; en: string };
  tool: string;
  desc: { uk: string; en: string };
}

interface StakeholderJourneysProps {
  lang: 'uk' | 'en';
}

export function StakeholderJourneys({ lang }: StakeholderJourneysProps) {
  const [activeTab, setActiveTab] = useState<'donor' | 'provider' | 'beneficiary'>('donor');
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState<number>(-1);

  const journeys: Record<'donor' | 'provider' | 'beneficiary', JourneyStep[]> = {
    donor: [
      {
        id: 'D1',
        title: { uk: 'Аналітична записка', en: 'Analytica Note' },
        tool: 'nbu-analysis.pages.dev',
        desc: {
          uk: 'Перегляд аналізу збитків ВВП та обґрунтування бюджету програми.',
          en: 'Viewing GDP loss analysis and verification of the program budget justifications.'
        }
      },
      {
        id: 'D2',
        title: { uk: 'Дашборд верифікації', en: 'Verification Dashboard' },
        tool: 'dashboard.feelagain.me',
        desc: {
          uk: 'Моніторинг черг, географічного розподілу та клінічних дефіцитів.',
          en: 'Monitoring queue size, geographic gaps, and clinical bottlenecks.'
        }
      },
      {
        id: 'D3',
        title: { uk: 'Сайт програми', en: 'Program Site' },
        tool: 'feelagain.me',
        desc: {
          uk: 'Ознайомлення з протоколами лікування та структурою субсидій.',
          en: 'Reviewing clinical protocols and details of the MHPSS subsidy scheme.'
        }
      },
      {
        id: 'D4',
        title: { uk: 'Кабінет донора: Онбординг', en: 'Donor Cabinet: Onboarding' },
        tool: 'feelagain.me/portal',
        desc: {
          uk: 'Вибір цільової групи (ВПО, ветерани) та визначення лімітів фінансування.',
          en: 'Selecting target groups (IDPs, veterans) and setting funding limits.'
        }
      },
      {
        id: 'D5',
        title: { uk: 'Кабінет донора: Матчинг', en: 'Donor Cabinet: Matching' },
        tool: 'feelagain.me/donor',
        desc: {
          uk: 'Перегляд профілів законтрактованих провайдерів та резервування траншів.',
          en: 'Reviewing profiles of contracted providers and allocating funding tranches.'
        }
      },
      {
        id: 'D6',
        title: { uk: 'Дошка пошани (ESG)', en: 'Honor Board (ESG)' },
        tool: 'feelagain.me/esg',
        desc: {
          uk: 'Публічне підтвердження цільового використання коштів та розблокування DLI.',
          en: 'Public validation of fund utilization and ESG compliance metrics.'
        }
      }
    ],
    provider: [
      {
        id: 'P1',
        title: { uk: 'Train-for-Care', en: 'Train-for-Care' },
        tool: 'feelagain.me/training',
        desc: {
          uk: 'Навчання фахівців доказовим методам (EMDR, VR Bravemind).',
          en: 'Clinical training on evidence-based protocols (EMDR, VR Bravemind).'
        }
      },
      {
        id: 'P2',
        title: { uk: 'Реєстрація НСЗУ (eHealth)', en: 'eHealth / NHSU Sync' },
        tool: 'ehealth.gov.ua',
        desc: {
          uk: 'Синхронізація ліцензій та перевірка відповідності стандартам НСЗУ.',
          en: 'Synchronizing clinical credentials and checking NHSU compliance.'
        }
      },
      {
        id: 'P3',
        title: { uk: 'Кабінет надавача', en: 'Provider Cabinet' },
        tool: 'feelagain.me/provider',
        desc: {
          uk: 'Отримання направлень, ведення розкладу та карток пацієнтів.',
          en: 'Receiving referrals, managing queues, and patient records.'
        }
      },
      {
        id: 'P4',
        title: { uk: 'Результативна оплата', en: 'Outcome-Based Escrow' },
        tool: 'FEEL Escrow Bus',
        desc: {
          uk: 'Зарахування оплати за послуги на основі валідованого результату (PHQ-9/GAD-7).',
          en: 'Tranche release to provider wallet based on verified clinical outcomes.'
        }
      },
      {
        id: 'P5',
        title: { uk: 'Матчинг з донорами', en: 'Donor Matching' },
        tool: 'FEEL Matcher',
        desc: {
          uk: 'Автоматичне заповнення вільних годин фахівців за рахунок донорських квот.',
          en: 'Auto-allocating remaining provider capacity to active donor allocations.'
        }
      }
    ],
    beneficiary: [
      {
        id: 'B1',
        title: { uk: 'Скринінг / КоБо', en: 'Screening / KoBo' },
        tool: 'kobo.feelagain.me',
        desc: {
          uk: 'Первинне тестування симптомів та визначення потреби в терапії.',
          en: 'Self-administered screening using clinically validated forms.'
        }
      },
      {
        id: 'B2',
        title: { uk: 'Первинна консультація', en: 'First Consultation' },
        tool: 'feelagain.me/matching',
        desc: {
          uk: 'Зустріч з кейс-менеджером, підбір відповідного фахівця.',
          en: 'Intake interview with a case manager and matching with a specialist.'
        }
      },
      {
        id: 'B3',
        title: { uk: 'Реєстрація eHealth', en: 'eHealth Registration' },
        tool: 'Trembita Bus',
        desc: {
          uk: 'Внесення медичного епізоду в систему ЄСОЗ для верифікації субсидії.',
          en: 'Logging the clinical episode into HESZ via the national Trembita bus.'
        }
      },
      {
        id: 'B4',
        title: { uk: 'Курс терапії', en: 'Therapy Course' },
        tool: 'FEEL Therapy Cabin',
        desc: {
          uk: 'Проходження сесій терапії (10-15 сеансів за доказовим протоколом).',
          en: 'Completing a course of structured sessions (10-15 sessions of EMDR/CBT).'
        }
      },
      {
        id: 'B5',
        title: { uk: 'Зворотний зв\'язок', en: 'Feedback Loop' },
        tool: 'feelagain.me/feedback',
        desc: {
          uk: 'Повторний клінічний скринінг для підтвердження покращення стану.',
          en: 'Post-intervention clinical screening to confirm state improvement.'
        }
      }
    ]
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      setAnimationStep(0);
      interval = setInterval(() => {
        setAnimationStep((prev) => {
          const limit = journeys[activeTab].length;
          if (prev >= limit - 1) {
            setIsPlaying(false);
            return -1;
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      setAnimationStep(-1);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeTab]);

  const activeSteps = journeys[activeTab];

  return (
    <div className="w-full max-w-[1000px] mx-auto text-[var(--color-ds-text)]">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider text-[var(--color-ds-teal)] border-b border-[var(--color-ds-border)] pb-2 inline-block">
            {lang === 'uk' ? 'Шлях Стейкхолдерів та Інтеграція' : 'Stakeholder Journeys & Integration'}
          </h3>
          <p className="text-sm text-[var(--color-ds-muted)] mt-2">
            {lang === 'uk'
              ? 'Візуалізація цифрового сліду та точок інтеграції для всіх учасників екосистеми FEEL.'
              : 'Visualization of the digital footprint and integration points for all ecosystem participants.'}
          </p>
        </div>

        {/* Play Controls */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-[var(--color-ds-border)] ${
            isPlaying 
              ? 'bg-[var(--color-ds-teal-dim)] border-[var(--color-ds-teal)] text-[var(--color-ds-teal)] shadow-[0_0_15px_rgba(0,210,170,0.15)]' 
              : 'bg-[var(--color-ds-bg-card)] text-[var(--color-ds-muted)] hover:text-white hover:border-[var(--color-ds-muted)]'
          }`}
        >
          {isPlaying ? (
            <>
              <span className="w-2.5 h-2.5 bg-[var(--color-ds-teal)] rounded-full animate-ping" />
              {lang === 'uk' ? 'Анімація...' : 'Animating...'}
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
              {lang === 'uk' ? 'Запустити потік' : 'Play Flow'}
            </>
          )}
        </button>
      </div>

      {/* Stakeholder Tabs */}
      <div className="flex border-b border-[var(--color-ds-border)] mb-8">
        {(['donor', 'provider', 'beneficiary'] as const).map((tab) => {
          const isActive = activeTab === tab;
          let label = '';
          let activeColor = '';
          
          if (tab === 'donor') {
            label = lang === 'uk' ? 'Донор / Фінансист' : 'Donor / Financier';
            activeColor = 'border-[var(--color-ds-gold)] text-[var(--color-ds-gold)]';
          } else if (tab === 'provider') {
            label = lang === 'uk' ? 'Провайдер / Терапевт' : 'Provider / Therapist';
            activeColor = 'border-[var(--color-ds-teal)] text-[var(--color-ds-teal)]';
          } else {
            label = lang === 'uk' ? 'Бенефіціар / Пацієнт' : 'Beneficiary / Patient';
            activeColor = 'border-[#4488ff] text-[#4488ff]';
          }

          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setIsPlaying(false);
                setAnimationStep(-1);
              }}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all duration-200 ${
                isActive 
                  ? activeColor 
                  : 'border-transparent text-[var(--color-ds-muted)] hover:text-[var(--color-ds-text)]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Steps Visual Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
        {activeSteps.map((step, idx) => {
          const isCurrent = animationStep === idx;
          const isCompleted = animationStep > idx;
          
          let cardBorder = 'border-[var(--color-ds-border)]';
          let cardBg = 'bg-[var(--color-ds-bg-card)]';
          let numColor = 'text-[var(--color-ds-muted)]';
          
          if (isCurrent) {
            if (activeTab === 'donor') {
              cardBorder = 'border-[var(--color-ds-gold)] shadow-[0_0_15px_rgba(200,164,92,0.25)]';
              cardBg = 'bg-[var(--color-ds-gold-dim)]';
              numColor = 'text-[var(--color-ds-gold)]';
            } else if (activeTab === 'provider') {
              cardBorder = 'border-[var(--color-ds-teal)] shadow-[0_0_15px_rgba(0,210,170,0.25)]';
              cardBg = 'bg-[var(--color-ds-teal-dim)]';
              numColor = 'text-[var(--color-ds-teal)]';
            } else {
              cardBorder = 'border-[#4488ff] shadow-[0_0_15px_rgba(68,136,255,0.25)]';
              cardBg = 'bg-[rgba(68,136,255,0.1)]';
              numColor = 'text-[#4488ff]';
            }
          } else if (isCompleted) {
            cardBorder = 'border-[var(--color-ds-border)] opacity-60';
            numColor = 'text-[var(--color-ds-muted)]';
          }

          return (
            <div 
              key={step.id} 
              className={`border rounded-xl p-4 flex flex-col justify-between min-h-[160px] transition-all duration-300 ${cardBorder} ${cardBg}`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-mono font-bold ${numColor}`}>{step.id}</span>
                  <span className="text-[9px] font-mono bg-[var(--color-ds-bg)] px-1.5 py-0.5 rounded text-[var(--color-ds-muted)] border border-[var(--color-ds-border)] max-w-[100px] truncate">
                    {step.tool}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[var(--color-ds-text)] uppercase tracking-wide mb-2 line-clamp-2">
                  {lang === 'uk' ? step.title.uk : step.title.en}
                </h4>
              </div>
              <p className="text-[11px] text-[var(--color-ds-muted)] leading-normal line-clamp-3">
                {lang === 'uk' ? step.desc.uk : step.desc.en}
              </p>
            </div>
          );
        })}
      </div>

      {/* Connective Zone / Connector Box */}
      <div className="bg-[var(--color-ds-bg-card)] border border-[var(--color-ds-border)] rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#4488ff] to-transparent opacity-40" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#4488ff] animate-pulse" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-[#4488ff]">
                {lang === 'uk' ? 'Шина Інтеграції FEEL CONNECTOR' : 'FEEL CONNECTOR Integration Bus'}
              </h4>
            </div>
            <p className="text-xs text-[var(--color-ds-muted)] leading-relaxed">
              {lang === 'uk'
                ? 'Уніфіковане ядро платформи, яке синхронізує медичні епізоди FHIR R4 з фінансовими транзакціями, забезпечуючи нульову тінізацію та миттєві цільові виплати.'
                : 'Unified platform core synchronizing FHIR R4 clinical episodes with secure financial routing, ensuring complete transparency and zero shadow transactions.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto font-mono text-[10px] text-[var(--color-ds-muted)]">
            <div className="bg-[var(--color-ds-bg)] border border-[var(--color-ds-border)] px-3 py-2 rounded flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ds-teal)]" />
              FHIR R4 Bus
            </div>
            <div className="bg-[var(--color-ds-bg)] border border-[var(--color-ds-border)] px-3 py-2 rounded flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ds-teal)]" />
              Escrow Pay
            </div>
            <div className="bg-[var(--color-ds-bg)] border border-[var(--color-ds-border)] px-3 py-2 rounded flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ds-teal)]" />
              Trembita Api
            </div>
            <div className="bg-[var(--color-ds-bg)] border border-[var(--color-ds-border)] px-3 py-2 rounded flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ds-teal)]" />
              HIPAA & GDPR
            </div>
          </div>
        </div>

        {/* Pulse path visual connection if playing */}
        {isPlaying && (
          <div className="mt-4 pt-4 border-t border-[var(--color-ds-border)] flex justify-center">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--color-ds-gold)] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ds-gold)] animate-ping" />
              {lang === 'uk'
                ? `Дані кроку ${activeSteps[animationStep >= 0 ? animationStep : 0].id} передаються в FEEL шину...`
                : `Data from step ${activeSteps[animationStep >= 0 ? animationStep : 0].id} routing to FEEL bus...`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
