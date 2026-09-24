import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../../types';
import { ScreenNav } from './types';
import { L3Footer } from './L3Footer';
import { RegValue } from '../RegValue';
import { reg, formatValue, STATUS_LABEL, type RegCode } from '../../data/registry';

interface Props { lang: Language; nav: ScreenNav; }

// Тунель бездіяльності у двох доріжках. Доріжка «люди» рахує осіб, доріжка «послуги» — записи ЕСОЗ
// про надану послугу. Між доріжками немає спільної осі і немає відсотка: особа і послуга — різні одиниці.
// Кожне число береться з реєстру фактів FEEL Again за кодом; значень у цьому файлі немає.

const t = (uk: string, en: string, lang: Language) => (lang === 'uk' ? uk : en);

/** Частка з реєстру у відсотках без округлення: зсув десяткової коми на два знаки в рядку. */
function pct(value: string, lang: Language): string {
  const [int, frac = ''] = value.split('.');
  const f = frac.padEnd(2, '0');
  const whole = String(Number(int + f.slice(0, 2)));
  const rest = f.slice(2);
  return formatValue(rest ? `${whole}.${rest}` : whole, lang) + ' %';
}

const TEXT = 'var(--color-ds-text, rgba(214,221,230,0.88))';
const MUTED = 'var(--color-ds-muted)';
const BORDER = 'var(--color-ds-border)';

/** Смуга, ширина якої пропорційна значенню в межах однієї доріжки (одна одиниця). */
const Bar: React.FC<{ code: RegCode; max: number; label: string; lang: Language; color: string; delay: number }> =
  ({ code, max, label, lang, color, delay }) => {
    const e = reg(code);
    const w = Math.max(0.5, (Number(e.value) / max) * 100);
    return (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[10px] ds-body leading-snug" style={{ color: TEXT }}>{label}</span>
          <span className="text-[12px] font-bold ds-display whitespace-nowrap" style={{ color: TEXT }}>
            <RegValue code={code} lang={lang} unit={false} />
          </span>
        </div>
        <div className="h-2 rounded-sm" style={{ background: 'color-mix(in srgb, var(--color-ds-muted) 14%, transparent)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${w}%` }}
            transition={{ delay, duration: 0.6 }}
            className="h-2 rounded-sm"
            style={{ background: color }}
          />
        </div>
      </div>
    );
  };

/** Щабель, для якого відкритих даних немає: порожня смуга зі штриховкою і словесним поясненням. */
const Gap: React.FC<{ label: string; why: string }> = ({ label, why }) => (
  <div className="flex flex-col gap-0.5">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[10px] ds-body leading-snug" style={{ color: TEXT }}>{label}</span>
      <span className="text-[12px] font-bold ds-display whitespace-nowrap" style={{ color: MUTED }}>—</span>
    </div>
    <div
      className="h-2 rounded-sm"
      style={{
        border: `1px dashed ${MUTED}`,
        background: 'repeating-linear-gradient(45deg, transparent 0 4px, color-mix(in srgb, var(--color-ds-muted) 22%, transparent) 4px 6px)',
      }}
    />
    <span className="text-[9px] ds-body" style={{ color: MUTED }}>{why}</span>
  </div>
);

const Lane: React.FC<{ title: string; unit: string; children: React.ReactNode }> = ({ title, unit, children }) => (
  <div className="flex flex-col gap-2.5 p-4 rounded-xl min-h-0" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}` }}>
    <div>
      <div className="cyber-label" style={{ color: 'var(--color-ds-gold)' }}>{title}</div>
      <div className="text-[9px] font-mono" style={{ color: MUTED }}>{unit}</div>
    </div>
    {children}
  </div>
);

export const InactionFunnel: React.FC<Props> = ({ lang, nav }) => {
  const peopleMax = Number(reg('R-004').value);
  const svcMax = Math.max(...(['R-160', 'R-161', 'R-162'] as RegCode[]).map(c => Number(reg(c).value)));
  const ostMax = Number(reg('R-189').value);
  const cov = reg('R-191');
  const who = reg('R-192');
  const svc25 = reg('R-160');
  const svc26 = reg('R-163');

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden ds-screen"
      style={{
        background:
          'radial-gradient(ellipse 50% 60% at 30% 50%, rgba(0,210,170,0.12) 0%, transparent 55%), ' +
          'linear-gradient(135deg, #080f1c 0%, #0a1628 100%)',
      }}
    >
      <div className="h-px w-full flex-shrink-0" style={{ background: 'linear-gradient(90deg, #00d4aa, #2ec4b6 50%, transparent)' }} />

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2 flex-shrink-0">
        <button
          onClick={nav.back}
          className="flex items-center gap-2 px-4 py-2 rounded-xl ds-display font-bold flex-shrink-0"
          style={{ background: 'rgba(200,164,92,0.16)', border: '2px solid var(--color-ds-gold)', color: 'var(--color-ds-gold)', fontSize: '12px' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Назад', 'Back', lang)}
        </button>
        <div>
          <div className="text-[17px] font-bold ds-display" style={{ color: TEXT }}>
            {t('Тунель бездіяльності: люди і послуги окремо', 'Inaction funnel: people and services kept apart', lang)}
          </div>
          <div className="text-[10px] ds-body" style={{ color: MUTED }}>
            {t(
              'Держава рахує надані послуги і посади, але не публікує, скільки людей отримали психіатричну допомогу. Тому доріжки не мають спільної осі, а між ними немає відсотка.',
              'The state counts services delivered and posts, but does not publish how many people received psychiatric care. The lanes therefore share no axis, and no percentage links them.',
              lang,
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-3 grid gap-3 md:grid-cols-2 content-start">
        {/* ── Доріжка 1: люди ── */}
        <Lane title={t('ДОРІЖКА «ЛЮДИ»', 'LANE “PEOPLE”', lang)} unit={t('одиниця: осіб', 'unit: persons', lang)}>
          <Bar code="R-004" max={peopleMax} lang={lang} color="var(--color-ds-orange)" delay={0.1}
            label={t('Особи в групі ризику', 'People at risk', lang)} />
          <Bar code="R-001" max={peopleMax} lang={lang} color="var(--color-ds-orange)" delay={0.2}
            label={t('Клінічна потреба в психологічній допомозі (проєкція)', 'Clinical need for psychological care (projection)', lang)} />
          <Gap
            label={t('Отримали допомогу за психіатричними пакетами НСЗУ', 'Received care under NHSU psychiatric packages', lang)}
            why={t(
              'НСЗУ не публікує кількість осіб за пакетами центрів ментального здоров’я і стаціонару. Потрібен запит на публічну інформацію: унікальні пацієнти за пакетом за 2025 рік з ЕСОЗ.',
              'NHSU does not publish the number of persons under the mental-health-centre and inpatient packages. A public-information request is needed: unique patients per package for 2025 from ESOZ.',
              lang,
            )}
          />
          <Gap
            label={t('Завершили лікування', 'Completed treatment', lang)}
            why={t('Відкритих даних немає ні в НСЗУ, ні в МОЗ.', 'No open data from either NHSU or the MoH.', lang)}
          />

          {/* Єдиний пакет, де держава публікує осіб */}
          <div className="mt-1 pt-3 flex flex-col gap-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="text-[10px] ds-body font-semibold" style={{ color: TEXT }}>
              {t(
                'Єдиний психіатричний пакет, де держава публікує людей: замісна підтримувальна терапія (власний масштаб)',
                'The only psychiatric package where the state publishes people: opioid substitution therapy (own scale)',
                lang,
              )}
            </div>
            <Bar code="R-189" max={ostMax} lang={lang} color="var(--color-ds-orange)" delay={0.3}
              label={t('Люди, які вживають опіоїди ін’єкційно (оцінка дослідження)', 'People who inject opioids (study estimate)', lang)} />
            <Bar code="R-190" max={ostMax} lang={lang} color="var(--color-ds-teal)" delay={0.4}
              label={t(`Отримували замісну терапію, ${reg('R-190').period}`, `Receiving substitution therapy, ${reg('R-190').period}`, lang)} />
            <div className="text-[10px] ds-body leading-relaxed" style={{ color: TEXT }} title={`${cov.code} · ${cov.conflict}`}>
              {t('Охоплення за розрахунком: ', 'Coverage as calculated: ', lang)}
              <b>{pct(cov.value, lang)}</b>
              {' '}<span style={{ color: MUTED }}>({STATUS_LABEL[cov.status].mark} {STATUS_LABEL[cov.status][lang]} · {cov.code})</span>.{' '}
              {t('Рекомендований мінімум ВООЗ і ЮНЕЙДС, як його наводить ЦГЗ: ', 'WHO and UNAIDS recommended minimum, as cited by the PHC: ', lang)}
              <b>{pct(who.value, lang)}</b>
              {' '}<span style={{ color: MUTED }}>({STATUS_LABEL[who.status].mark} {STATUS_LABEL[who.status][lang]} · {who.code})</span>.
            </div>
            <div className="text-[9px] ds-body leading-relaxed rounded-lg px-2.5 py-1.5"
              style={{ color: TEXT, border: '1px dashed var(--color-ds-orange)' }}>
              ⚑ {t(
                'Розбіжність: ЦГЗ на тій самій сторінці пише «охоплює 5,8%», а поділ опублікованих ним же чисел дає інше значення. Причину сторінка не пояснює. У знаменнику лише ін’єкційне вживання.',
                'Discrepancy: the PHC states “covers 5.8%” on the same page, while dividing its own published figures gives a different value. The page does not explain why. The denominator covers injecting use only.',
                lang,
              )}
            </div>
          </div>
        </Lane>

        {/* ── Доріжка 2: послуги ── */}
        <Lane
          title={t('ДОРІЖКА «ПОСЛУГИ»', 'LANE “SERVICES”', lang)}
          unit={t('одиниця: наданих послуг — запис ЕСОЗ про надану послугу, не сесія і не особа', 'unit: services delivered — an ESOZ service record, not a session and not a person', lang)}
        >
          <div className="text-[10px] ds-body font-semibold" style={{ color: TEXT }}>{svc25.period}</div>
          <Bar code="R-160" max={svcMax} lang={lang} color="var(--color-ds-teal)" delay={0.1}
            label={t('Центри ментального здоров’я і мобільні команди', 'Mental health centres and mobile teams', lang)} />
          <Bar code="R-161" max={svcMax} lang={lang} color="var(--color-ds-teal)" delay={0.2}
            label={t('Психіатрична допомога в стаціонарі', 'Inpatient psychiatric care', lang)} />
          <Bar code="R-162" max={svcMax} lang={lang} color="var(--color-ds-teal)" delay={0.3}
            label={t('Замісна підтримувальна терапія', 'Opioid substitution therapy', lang)} />

          <div className="text-[10px] ds-body font-semibold mt-1" style={{ color: TEXT }}>{svc26.period}</div>
          <Bar code="R-163" max={svcMax} lang={lang} color="var(--color-ds-gold)" delay={0.4}
            label={t('Центри ментального здоров’я і мобільні команди', 'Mental health centres and mobile teams', lang)} />
          <Bar code="R-164" max={svcMax} lang={lang} color="var(--color-ds-gold)" delay={0.5}
            label={t('Психіатрична допомога в стаціонарі', 'Inpatient psychiatric care', lang)} />
          <Bar code="R-165" max={svcMax} lang={lang} color="var(--color-ds-gold)" delay={0.6}
            label={t('Замісна підтримувальна терапія', 'Opioid substitution therapy', lang)} />

          <div className="mt-1 pt-3 flex flex-col gap-1.5" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="text-[10px] ds-body font-semibold" style={{ color: TEXT }}>
              {t(`Хто надає: напрям «Психологічна і психіатрична допомога», ${reg('R-170').period}`,
                 `Who delivers: “Psychological and psychiatric care” direction, ${reg('R-170').period}`, lang)}
            </div>
            <div className="text-[10px] ds-body" style={{ color: TEXT }}>
              <RegValue code="R-170" lang={lang} />
            </div>
            <div className="text-[10px] ds-body" style={{ color: TEXT }}>
              <RegValue code="R-172" lang={lang} />{' '}{t('— лікарі, унікальні особи', '— doctors, unique persons', lang)}
            </div>
            <div className="text-[10px] ds-body" style={{ color: TEXT }}>
              <RegValue code="R-186" lang={lang} unit={false} />{' '}
              {t('посад профілю психічного здоров’я (психіатри, психологи, психотерапевти, наркологи)', 'mental-health-profile posts (psychiatrists, psychologists, psychotherapists, narcologists)', lang)}
            </div>
            <div className="text-[9px] ds-body leading-relaxed" style={{ color: MUTED }}>
              {t(
                'НСЗУ не платить за сесію. Центри ментального здоров’я, мобільні команди і стаціонар оплачуються глобальною ставкою, замісна терапія — капітаційною ставкою на пацієнта (Посібник ПМГ 2026, с. 36). Тому показника «сесій на рік» у державних даних немає.',
                'NHSU does not pay per session. Mental health centres, mobile teams and inpatient care are paid a global rate; substitution therapy a capitation rate per patient (PMG 2026 handbook, p. 36). State data therefore holds no “sessions per year” figure.',
                lang,
              )}
            </div>
          </div>
        </Lane>
      </div>

      <div className="px-5 pb-2 flex-shrink-0 text-[9px] font-mono" style={{ color: MUTED }}>
        {t(
          'Джерела: реєстр фактів FEEL Again; дашборди НСЗУ «Статистика наданих послуг» і «Надавачі за напрямом»; ЦГЗ «Статистика ЗПТ»; Посібник ПМГ 2026. Наведіть курсор на число — побачите походження, період і статус.',
          'Sources: FEEL Again fact registry; NHSU dashboards “Services delivered” and “Providers by direction”; PHC “OST statistics”; PMG 2026 handbook. Hover a figure to see origin, period and status.',
          lang,
        )}
      </div>
      <L3Footer lang={lang} nav={nav} />
    </div>
  );
};
