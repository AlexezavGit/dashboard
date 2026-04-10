import { LocalizedString, KpiData, SectionData, Language } from './types';

// Palette mapping from original design
export const COLORS = {
  cyberCyan: '#00F5FF',
  cyberAmber: '#F59E0B',
  cyberSuccess: '#00FF66',
  cyberPurple: '#A855F7',
  cyberBg: '#050A15',
  blue: '#00F5FF', // Map old blue to cyberCyan
  blueLight: 'rgba(0, 245, 255, 0.6)',
  red: '#FF4444', 
  redLight: 'rgba(255, 68, 68, 0.6)',
  orange: '#F59E0B', // Map old orange to cyberAmber
  orangeLight: 'rgba(245, 158, 11, 0.6)',
  green: '#00FF66', // Map old green to cyberSuccess
  greenLight: 'rgba(0, 255, 102, 0.6)',
  purple: '#A855F7', // Map old purple to cyberPurple
  purpleLight: 'rgba(168, 85, 247, 0.6)',
  teal: '#00E5FF',
  gray: '#475569',
  navy: '#0A1A2F'
};

export const TEXTS = {
  header: {
    title: { uk: 'Стан сектору МЗПСП в Україні', en: 'MHPSS Sector Status in Ukraine' },
    subtitle: { uk: "Ментальне здоров'я та психосоціальна підтримка — Огляд для донорів", en: "Mental Health & Psychosocial Support — Donor Overview" },
    date: { uk: 'Дані: 2020–2025', en: 'Data: 2020–2025' },
  },
  filters: {
    label: { uk: 'Розділ:', en: 'Section:' },
    options: {
      all: { uk: 'Усі розділи', en: 'All Sections' },
      prevalence: { uk: 'Поширеність розладів', en: 'Disorder Prevalence' },
      workforce: { uk: 'Кадровий потенціал', en: 'Workforce' },
      budget: { uk: 'Бюджет та фінансування', en: 'Budget & Funding' },
      gap: { uk: 'Розрив у доступі', en: 'Treatment Gap' },
      shadow: { uk: 'Тіньовий сектор', en: 'Shadow Economy' },
      economic: { uk: 'Економічний тягар та ROI', en: 'Economic Burden & ROI' },
      children: { uk: 'Діти', en: 'Children' },
      inputs: { uk: 'Зроблено vs Потрібно', en: 'Done vs Needed' },
    }
  },
  footer: {
    sources: { uk: 'Джерела даних', en: 'Data Sources' },
    primarySources: { uk: 'Первинні джерела (Primary Sources)', en: 'Primary Sources' },
    secondarySources: { uk: 'Вторинні джерела та дослідження (Secondary Sources)', en: 'Secondary Sources' },
    feelAgainTitle: { uk: 'ВІДКРИТИ ВЕБ-САЙТ FEEL AGAIN', en: 'OPEN FEEL AGAIN WEBSITE' },
    feelAgainDesc: { uk: 'Ментальний добробут відновлює країну. FEEL Again — цифрова інфраструктура для цього відновлення', en: 'Mental wellbeing restores the country. FEEL Again is the digital infrastructure for this recovery' },
    disclaimer: { 
      uk: 'Дашборд містить дані з відкритих джерел за 2020-2025 рр., «оцінка» зазанчено там де дані недоступні. Тіньовий сектор: конкретні дослідження для MHPSS не проводились. Сертифікація: добровільна до 2031 року.', 
      en: "Dashboard contains data from open sources for 2020-2025, 'estimate' is indicated where data is unavailable. Shadow sector: specific studies for MHPSS were not conducted. Certification: voluntary until 2031." 
    }
  }
};

export const TOP_METRICS = (l: Language) => [
  {
    label: l === 'uk' ? 'Охоплено бенефіціарів' : 'Beneficiaries Reached',
    value: 3400000,
    suffix: '+',
    sub: l === 'uk' ? 'Діти та молодь з доступом до МЗПСП (UNICEF)' : 'Children & youth with MHPSS access (UNICEF)',
    tooltip: l === 'uk' ? 'Включає дітей та молодь, які отримали доступ до послуг з психічного здоров\'я та психосоціальної підтримки через програми UNICEF.' : 'Includes children and youth who accessed mental health and psychosocial support services through UNICEF programs.',
    icon: 'Users',
    color: COLORS.cyberCyan
  },
  {
    label: l === 'uk' ? 'Активні заклади НСЗУ' : 'Active NHSU Facilities',
    value: 3346,
    sub: l === 'uk' ? 'Заклади HeRAMS (Держава)' : 'HeRAMS facilities (Gov)',
    tooltip: l === 'uk' ? 'Медичні заклади, що надають послуги за пакетом НСЗУ та звітують через систему HeRAMS.' : 'Medical facilities providing services under the NHSU package and reporting via HeRAMS.',
    icon: 'Building2',
    color: COLORS.cyberAmber
  },
  {
    label: l === 'uk' ? 'Навчений персонал' : 'Trained Personnel',
    value: 38000,
    suffix: '+',
    sub: l === 'uk' ? 'Фахівці МЗПСП (UNICEF)' : 'MHPSS professionals (UNICEF)',
    tooltip: l === 'uk' ? 'Кількість фахівців, які пройшли навчання з надання МЗПСП.' : 'Number of professionals trained in providing MHPSS.',
    icon: 'GraduationCap',
    color: COLORS.cyberPurple
  }
];

export const KPI_DATA: KpiData[] = [
  {
    label: { uk: 'Населення под впливом', en: 'Population Affected' },
    value: '9.6 млн',
    sub: { uk: '22% населення потребують підтримки', en: '22% of population needs support' },
    change: { uk: '↑ до 15 млн (оцінка МОЗ)', en: '↑ up to 15M (MOH estimate)' },
    status: 'danger',
    source: { uk: 'Lancet 2023 / МОЗ', en: 'Lancet 2023 / MOH' }
  },
  {
    label: { uk: 'Розрив у лікуванні', en: 'Treatment Gap' },
    value: '74%',
    sub: { uk: 'ВПО не отримують допомоги', en: 'IDPs not receiving care' },
    change: { uk: 'лише 3.2% з депресією лікувались', en: 'only 3.2% with depression treated' },
    status: 'danger',
    source: { uk: 'WHO MH Atlas', en: 'WHO MH Atlas' }
  },
  {
    label: { uk: "Бюджет на МЗ", en: 'Mental Health Budget' },
    value: '2.5%',
    sub: { uk: "від бюджету охорони здоров'я", en: 'of total health budget' },
    change: { uk: 'ВООЗ рекомендує ≥5%', en: 'WHO recommends ≥5%' },
    status: 'warning',
    source: { uk: 'CMU 2026 / ВООЗ', en: 'CMU 2026 / WHO' }
  },
  {
    label: { uk: 'Психологів на 100 тис.', en: 'Psychologists per 100K' },
    value: '1.3 чол.',
    sub: { uk: 'середнє по ЄС: 2.7', en: 'EU average: 2.7' },
    change: { uk: 'Потрібно збільшити у 5 разів', en: 'Needs 5x increase' },
    status: 'neutral',
    source: { uk: 'WHO Atlas', en: 'WHO Atlas' }
  }
];

export const SECTIONS_CONFIG: SectionData[] = [
  { id: 'prevalence', title: { uk: 'Поширеність психічних розладів (через рік після повномасштабного вторгнення)', en: 'Mental Health Disorder Prevalence (1 year post-invasion)' }, icon: 'BarChart2' },
  { id: 'workforce', title: { uk: 'Кадровий потенціал та людський капітал', en: 'Workforce & Human Capital' }, icon: 'Users' },
  { id: 'budget', title: { uk: 'Бюджети та фінансування сектору', en: 'Sector Budgets & Funding' }, icon: 'Coins' },
  { id: 'gap', title: { uk: 'Розрив у доступі до допомоги', en: 'Treatment Access Gap' }, icon: 'AlertCircle' },
  { id: 'shadow', title: { uk: 'Тіньовий сектор та формалізація практики', en: 'Shadow Economy & Practice Formalization' }, icon: 'EyeOff' },
  { id: 'economic', title: { uk: "Економічний тягар та ROI для інвесторів", en: 'Economic Burden & Investor ROI' }, icon: 'TrendingUp' },
  { id: 'children', title: { uk: "Ментальне здоров'я дітей", en: "Children's Mental Health" }, icon: 'Smile' },
  { id: 'inputs', title: { uk: 'Що зроблено — і чого це вартує в масштабі країни', en: 'What Was Achieved — And What It Means at National Scale' }, icon: 'Scale' },
];

// --- Chart Data ---

export const PREVALENCE_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Депресія' : 'Depression', value: 44.2, fill: COLORS.blue },
  { name: l === 'uk' ? 'Будь-який із 7 розладів' : 'Any of 7 disorders', value: 36.3, fill: COLORS.navy },
  { name: l === 'uk' ? 'ПТСР (ризик)' : 'PTSD (at risk)', value: 25, fill: COLORS.red },
  { name: l === 'uk' ? 'Тривожність' : 'Anxiety', value: 23.1, fill: COLORS.orange },
  { name: l === 'uk' ? 'Складний ПТСР' : 'Complex PTSD', value: 8.9, fill: COLORS.purple },
];

export const RISK_GROUP_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Жінки' : 'Women', value: 39.0, fill: COLORS.redLight },
  { name: l === 'uk' ? 'Біженці' : 'Refugees', value: 35, fill: COLORS.red },
  { name: l === 'uk' ? 'Чоловіки' : 'Men', value: 33.8, fill: COLORS.blue },
  { name: l === 'uk' ? 'ВПО' : 'IDPs', value: 30, fill: COLORS.orange },
  { name: l === 'uk' ? '13-15 років (сон)' : '13-15y (sleep)', value: 50, fill: COLORS.purple },
];

export const WORKFORCE_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Психіатри' : 'Psychiatrists', Ukraine: 11.6, EU: 12.9, WHO: 12.9 },
  { name: l === 'uk' ? 'Психологи' : 'Psychologists', Ukraine: 1.3, EU: 2.7, WHO: 6.5 },
  { name: l === 'uk' ? 'Психотерапевти' : 'Psychotherapists', Ukraine: 0.56, EU: 1.5, WHO: 3.0 },
];

export const WAR_IMPACT_DATA = (l: Language) => [
  { name: l === 'uk' ? 'До війни (01.2022)' : 'Pre-war (01.2022)', psych: 40.0, social: 17.78 },
  { name: l === 'uk' ? 'Липень 2022' : 'July 2022', psych: 33.4, social: 16.5 },
  { name: l === 'uk' ? 'Квітень 2024' : 'April 2024', psych: 30.9, social: 14.82 },
];

export const SECTOR_DIST_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Державний сектор' : 'Public sector', value: 8201, fill: COLORS.blue },
  { name: l === 'uk' ? 'НУО / гуманітарний' : 'NGO / humanitarian', value: 38000, fill: COLORS.green },
  { name: l === 'uk' ? 'Приватний сектор' : 'Private sector', value: 0, fill: COLORS.gray }, 
];

export const BUDGET_SPLIT_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Стаціонар (89%)' : 'Inpatient (89%)', value: 89, fill: COLORS.red },
  { name: l === 'uk' ? 'Амбулаторія (11%)' : 'Outpatient (11%)', value: 11, fill: COLORS.green },
];

export const DONOR_DATA = (l: Language) => [
  { name: l === 'uk' ? 'ЄС (запит)' : 'EU (requested)', value: 390, fill: COLORS.blueLight },
  { name: l === 'uk' ? 'ЄС (виділено)' : 'EU (allocated)', value: 140, fill: COLORS.blue },
  { name: 'USAID', value: 15, fill: COLORS.red },
  { name: 'UNICEF HAC', value: 633.6, fill: COLORS.teal },
  { name: l === 'uk' ? 'Ветерани (держ.)' : 'Veterans (gov)', value: 60, fill: COLORS.orange },
];

export const GAP_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Потребують підтримки' : 'Need support', need: 15, reached: 0 },
  { name: l === 'uk' ? 'Потребують лікування' : 'Need treatment', need: 3.9, reached: 0 },
  { name: l === 'uk' ? 'Діти з ПТСР ризиком' : 'Children PTSD risk', need: 1.5, reached: 0 },
  { name: l === 'uk' ? 'ВООЗ консультації' : 'WHO consultations', need: 0, reached: 0.08 },
  { name: l === 'uk' ? 'ЮНІСЕФ охоплення' : 'UNICEF reach', need: 0, reached: 0.76 },
];

export const BARRIERS_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Фінансові бар\'єри' : 'Financial barriers', value: 30, fill: COLORS.red },
  { name: l === 'uk' ? 'Незнання де шукати' : 'Don\'t know where', value: 25, fill: COLORS.orange },
  { name: l === 'uk' ? 'Стигма' : 'Stigma', value: 20, fill: COLORS.purple },
  { name: l === 'uk' ? 'Нестача фахівців' : 'Specialist shortage', value: 15, fill: COLORS.blue },
  { name: l === 'uk' ? 'Якість послуг' : 'Service quality', value: 10, fill: COLORS.gray },
];

export const SHADOW_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Повністю тіньові (до 2024)' : 'Fully shadow (pre-2024)', value: 10, fill: COLORS.red },
  { name: l === 'uk' ? 'ФОП без серт.' : 'Reg. sole prop. w/o cert.', value: 35, fill: COLORS.orange },
  { name: l === 'uk' ? 'Добровільна (2024–31)' : 'Voluntary (2024–31)', value: 70, fill: COLORS.blueLight },
  { name: l === 'uk' ? 'Обов\'язкова (>2031)' : 'Mandatory (>2031)', value: 100, fill: COLORS.green },
];

export const DALY_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Депресія' : 'Depression', NW: 8519, C: 12621, SE: 11624 },
  { name: l === 'uk' ? 'ПТСР' : 'PTSD', NW: 3185, C: 4641, SE: 4228 },
  { name: l === 'uk' ? 'Тривожність' : 'Anxiety', NW: 1482, C: 2929, SE: 3528 },
];

export const RECON_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Прямі збитки' : 'Direct damage', value: 1.4, fill: COLORS.orange },
  { name: l === 'uk' ? 'З непрямими' : 'With indirect', value: 6.0, fill: COLORS.red },
  { name: l === 'uk' ? '+ Розширення МЗПСП' : '+ MHPSS expansion', value: 15.1, fill: COLORS.redLight },
  { name: l === 'uk' ? 'Збитки здоров\'ю' : 'Health system damage', value: 26, fill: COLORS.navy },
];

export const CHILDREN_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Діти з МЗПСП' : 'Children MHPSS', value: 757.8, fill: COLORS.blue },
  { name: l === 'uk' ? 'Опікуни з МЗПСП' : 'Caregivers MHPSS', value: 998.0, fill: COLORS.teal },
  { name: l === 'uk' ? 'Спец. допомога' : 'Specialized care', value: 126, fill: COLORS.purple },
  { name: l === 'uk' ? 'Біженці' : 'Refugees', value: 1200, fill: COLORS.orange },
];

export const MHGAP_FUNNEL_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Онлайн-сертифікати' : 'Online certificates', value: 130000, fill: COLORS.blueLight },
  { name: l === 'uk' ? 'З них — первинні лікарі' : 'Of which — primary docs', value: 19000, fill: COLORS.blue },
  { name: l === 'uk' ? 'Заклади з пакетом НСЗУ' : 'NHSU MH package facilities', value: 1000, fill: COLORS.orange },
  { name: l === 'uk' ? 'Очне навчання + супервізія' : 'In-person + supervision', value: 700, fill: COLORS.green },
  { name: l === 'uk' ? 'Задокументовано (2020)' : 'Documented practicing (2020)', value: 42, fill: COLORS.red },
];

export const TRAINED_REALITY_DATA = (l: Language) => [
  { name: 'UNICEF MHPSS', awareness: 38000, psychosocial: 0, clinical: 0 },
  { name: 'UNESCO School', awareness: 15000, psychosocial: 0, clinical: 0 },
  { name: 'NaUKMA Teachers', awareness: 4000, psychosocial: 0, clinical: 0 },
  { name: 'NaUKMA Psych', awareness: 0, psychosocial: 800, clinical: 0 },
  { name: 'mhGAP Clinical', awareness: 0, psychosocial: 0, clinical: 700 },
];

export const CLUSTER_DATA = (l: LocalizedString) => [
  { name: '2024', req: 145, rec: 177, mh: 0 },
  { name: '2025', req: 130.9, rec: 138.9, mh: 0 },
];

// --- New Enhanced Data ---

export const FUNDING_VS_REACH_DATA = [
  { name: 'WHO', funding: 154, reach: 82, category: 'Clinical' },
  { name: 'UNICEF', funding: 633, reach: 757, category: 'Psychosocial' },
  { name: 'USAID', funding: 15, reach: 12, category: 'Infrastructure' },
  { name: 'EU', funding: 140, reach: 45, category: 'Systemic' },
  { name: 'Red Cross', funding: 45, reach: 120, category: 'Emergency' },
  { name: 'Save Children', funding: 32, reach: 88, category: 'Children' },
];

export const ECONOMIC_BURDEN_INDICATORS = (l: Language) => [
  { name: l === 'uk' ? 'Поширеність розладів' : 'Disorder Prevalence', percent: '22', value: '9,600,000', source: 'Lancet', period: '2023', units: l === 'uk' ? 'осіб' : 'people' },
  { name: l === 'uk' ? 'Потребують підтримки (МОЗ)' : 'Need support (MOH)', percent: '35', value: '15,000,000', source: 'MOH', period: '2024', units: l === 'uk' ? 'осіб' : 'people' },
  { name: l === 'uk' ? 'Економічні втрати (ВВП)' : 'Economic losses (GDP)', percent: '4.5', value: '$6,000,000,000', source: 'World Bank', period: '2025', units: l === 'uk' ? 'USD' : 'USD' },
];

export const REGIONAL_BARRIERS_HEATMAP = (l: Language) => [
  { name: l === 'uk' ? 'Київ' : 'Kyiv', stigma: 15, cost: 20, distance: 5, awareness: 10 },
  { name: l === 'uk' ? 'Львів' : 'Lviv', stigma: 12, cost: 18, distance: 8, awareness: 15 },
  { name: l === 'uk' ? 'Одеса' : 'Odesa', stigma: 25, cost: 22, distance: 12, awareness: 20 },
  { name: l === 'uk' ? 'Харків' : 'Kharkiv', stigma: 30, cost: 35, distance: 25, awareness: 30 },
  { name: l === 'uk' ? 'Дніпро' : 'Dnipro', stigma: 22, cost: 28, distance: 15, awareness: 25 },
];

export const REGIONAL_DISORDER_DATA = (l: Language) => [
  { region: l === 'uk' ? 'Північ' : 'North', value: 38, fill: COLORS.blue },
  { region: l === 'uk' ? 'Південь' : 'South', value: 42, fill: COLORS.red },
  { region: l === 'uk' ? 'Схід' : 'East', value: 55, fill: COLORS.navy },
  { region: l === 'uk' ? 'Захід' : 'West', value: 32, fill: COLORS.green },
  { region: l === 'uk' ? 'Центр' : 'Central', value: 35, fill: COLORS.orange },
];

export const DISORDER_IMPACT_BUBBLE = (l: Language) => [
  { name: l === 'uk' ? 'Депресія' : 'Depression', prevalence: 44.2, daly: 12621, cost: 4.2, fill: COLORS.blue },
  { name: l === 'uk' ? 'ПТСР' : 'PTSD', prevalence: 25, daly: 4641, cost: 2.8, fill: COLORS.red },
  { name: l === 'uk' ? 'Тривожність' : 'Anxiety', prevalence: 23.1, daly: 3528, cost: 1.5, fill: COLORS.orange },
  { name: l === 'uk' ? 'Складний ПТСР' : 'Complex PTSD', prevalence: 8.9, daly: 1800, cost: 0.9, fill: COLORS.purple },
];

// --- Static Content ---

export const TIMELINE_ITEMS = (l: LocalizedString) => [
  { year: l.uk === 'uk' ? 'До 2024' : 'Pre-2024', text: l.uk === 'uk' ? 'Ліцензування відсутнє. Будь-хто міг надавати психологічні послуги без підтвердження кваліфікації.' : 'No licensing. Anyone could provide psychological services without qualification verification.', color: COLORS.red },
  { year: '2024', text: l.uk === 'uk' ? 'Підписано Закон про сертифікацію психологів та психотерапевтів. Створення реєстру постачальників послуг.' : 'Certification Law signed for psychologists & psychotherapists. Provider registry being created.', color: COLORS.orange },
  { year: '2024–2031', text: l.uk === 'uk' ? 'Перехідний період: сертифікація добровільна. Вимоги: вища освіта, курс з психічних розладів, підвищення кваліфікації.' : 'Transition period: certification voluntary. Requirements: higher education, course on mental disorders, professional development.', color: COLORS.blueLight },
  { year: l.uk === 'uk' ? 'Після 2031' : 'Post-2031', text: l.uk === 'uk' ? "Сертифікація стає обов'язковою. Саморегулівні організації для психотерапевтів." : 'Certification becomes mandatory. Self-regulatory organizations for psychotherapists.', color: COLORS.green },
];

export const ADMIN_BURDEN = (l: Language) => [
    { title: l === 'uk' ? 'Застарілі системи документообігу' : 'Outdated documentation systems', desc: l === 'uk' ? "ВООЗ фіксує обмежену інтеграцію з електронним здоров'ям та паперовий документообіг" : "WHO documents limited eHealth integration and paper-based recordkeeping", severity: l === 'uk' ? 'Високий' : 'High', color: 'red', source: 'WHO SIMH 2024' },
    { title: l === 'uk' ? 'Нові вимоги сертифікації (2024+)' : 'New certification requirements (2024+)', desc: l === 'uk' ? 'Вища освіта + теоретичний курс + підтвердження підвищення кваліфікації + подання до Національної комісії або СРО' : 'Higher education + theoretical course + CPD certificates + submission to National Commission or SRO', severity: l === 'uk' ? 'Середній' : 'Medium', color: 'orange', source: 'МОЗ України' },
    { title: l === 'uk' ? 'Навантаження на фахівця' : 'Caseload per specialist', desc: l === 'uk' ? '1 психолог на 400-500 військовослужбовців (ЗСУ). У цивільному секторі — дані не збираються.' : '1 psychologist per 400-500 military personnel (AFU). Civilian sector — data not collected.', severity: l === 'uk' ? 'Критичний' : 'Critical', color: 'red', source: 'ЗСУ / Відкриті дані' },
    { title: l === 'uk' ? 'Відсутність клерикальної підтримки' : 'Lack of clerical support', desc: l === 'uk' ? 'Lancet Commission: психіатри та психологи «перевантажені та недоплачені», без допоміжного адмінперсоналу' : 'Lancet Commission: psychiatrists and psychologists "overworked and underpaid", without admin support staff', severity: l === 'uk' ? 'Високий' : 'High', color: 'red', source: 'Lancet 2023' },
    { title: l === 'uk' ? 'Кількість годин на адмінроботу' : 'Admin hours per week', desc: l === 'uk' ? 'ДАНІ ВІДСУТНІ. Конкретна кількість годин на адміністративну роботу не фіксується в жодному відомому дослідженні.' : 'DATA NOT AVAILABLE. Specific admin hours are not quantified in any known study.', severity: l === 'uk' ? 'Дефіцит даних' : 'Data gap', color: 'gray', source: 'Аналіз літератури' },
];

export const COORD_ITEMS = (l: Language) => [
    { title: l === 'uk' ? '«ТИ ЯК» — Всеукраїнська програма' : '"TI YAK" — National MH Program', desc: l === 'uk' ? 'Ініціатива першої леді. Координаційний центр створено постановою КМУ від 30.03.2023 як тимчасовий дорадчий орган. Бюджет програми публічно не розкритий.' : 'First Lady initiative. Coordination Center created by CMU resolution 30.03.2023 as temporary advisory body. Program budget not publicly disclosed.', status: l === 'uk' ? 'Бюджет невідомий' : 'Budget unknown', color: 'orange' },
    { title: l === 'uk' ? 'Ключовий продукт: PDF «Аптечка самодопомоги»' : '"Self-help first aid kit" PDF', desc: l === 'uk' ? 'Буклет з базовою інформацією про стрес та ПТСР на сайті howareu.com. Для програми національного масштабу з вищим патронатом та координаційною радою КМУ — непропорційно заявленим амбіціям.' : 'Basic stress/PTSD brochure on howareu.com. For a national-scale program with highest patronage and CMU coordination council — disproportionate to stated ambitions.', status: l === 'uk' ? 'Факт' : 'Fact', color: 'gray' },
    { title: l === 'uk' ? '«400 000 слухачів»' : '"400,000 listeners"', desc: l === 'uk' ? 'Заявлена цифра «ТИ ЯК». Це population-level awareness, не клінічна допомога. Різниця між «слухачем вебінару» та «клінічним психологом» — як між глядачем операції на YouTube та хірургом.' : 'TI YAK claimed figure. This is population-level awareness, not clinical care. The difference between "webinar listener" and "clinical psychologist" is like watching surgery on YouTube vs. being a surgeon.', status: l === 'uk' ? 'Awareness ≠ лікування' : 'Awareness ≠ treatment', color: 'red' },
    { title: l === 'uk' ? 'MHPSS TWG (ВООЗ + IMC)' : 'MHPSS TWG (WHO + IMC)', desc: l === 'uk' ? '450+ організацій-учасників, збори 2 рази на тиждень, 3 регіональних хаби, 4 task teams. Ручна координація. Гуманітарний стандарт — виконано. Операційна ефективність — під питанням.' : '450+ member organizations, meetings 2x/week, 3 regional hubs, 4 task teams. Manual coordination. Humanitarian standard — met. Operational efficiency — questionable.', status: l === 'uk' ? 'Координація є' : 'Coordination exists', color: 'blue' },
];

export const REACH_TABLE_DATA = (l: Language) => [
    [l === 'uk' ? 'Консультації з МЗ' : 'MH consultations', '80,000+', l === 'uk' ? 'ВООЗ' : 'WHO', '02.2022–2024'],
    [l === 'uk' ? 'Важкі розлади — пряма допомога' : 'Severe disorders — direct care', '2,000+', l === 'uk' ? 'ВООЗ' : 'WHO', '02.2022–2024'],
    [l === 'uk' ? 'Діти, опікуни, фронтлайн' : 'Children, caregivers, frontline', '757,807', 'UNICEF', '2024'],
    [l === 'uk' ? 'Діти з доступом до МЗПСП' : 'Children with MHPSS access', '3,400,000+', 'UNICEF', '2022–2024'],
    [l === 'uk' ? 'Навчені «фахівці МЗПСП»' : 'Trained "MHPSS professionals"', '38,000+', 'UNICEF', '2023'],
    [l === 'uk' ? 'Очне навчення + 6 міс. супервізія' : 'In-person training + 6mo supervision', '700', l === 'uk' ? 'ВООЗ mhGAP' : 'WHO mhGAP', '2019–2022'],
    [l === 'uk' ? 'Онлайн-сертифікати (self-paced)' : 'Online certificates (self-paced)', '130,000+', l === 'uk' ? 'ВООЗ mhGAP' : 'WHO mhGAP', l === 'uk' ? 'до жовт. 2024' : 'to Oct 2024'],
    [l === 'uk' ? 'З них — первинні лікарі' : 'Of which — primary care doctors', '~19,000', l === 'uk' ? 'ВООЗ mhGAP' : 'WHO mhGAP', l === 'uk' ? 'до серп. 2024' : 'to Aug 2024'],
    [l === 'uk' ? 'Заклади з пакетом МЗ' : 'Facilities with MH package', '~1,000', 'НСЗУ/NHSU', l === 'uk' ? 'сер. 2024' : 'mid-2024'],
    [l === 'uk' ? 'Заклади HeRAMS' : 'HeRAMS facilities', '3,346', l === 'uk' ? 'Держава' : 'Government', '2024'],
    [l === 'uk' ? 'Кваліфіковані спеціалісти' : 'Qualified specialists', '8,201', l === 'uk' ? 'Держава' : 'Government', '2024'],
    [l === 'uk' ? 'Реально практикують МЗ' : 'Actually practicing MH', '42', 'PMC 2020', '2020'],
];

export const INPUTS_OUTCOMES_DATA = (l: Language) => [
    { input: l === 'uk' ? 'mhGAP онлайн-сертифікати' : 'mhGAP online certificates', val: '130,000+', status: l === 'uk' ? 'НЕ ВИМІРЮЄТЬСЯ' : 'NOT MEASURED', out: l === 'uk' ? 'Скільки лікарів реально надають МЗ-послуги?' : 'How many doctors actually deliver MH services?', statusColor: 'red', tooltip: l === 'uk' ? 'Кількість виданих сертифікатів не відображає реальну кількість лікарів, які надають послуги.' : 'The number of issued certificates does not reflect the actual number of doctors providing services.' },
    { input: l === 'uk' ? 'mhGAP очне навчання' : 'mhGAP in-person training', val: '700', status: '42 (6%)', out: l === 'uk' ? 'Задокументовано практикуючих (PMC 2020)' : 'Documented practicing (PMC 2020)', statusColor: 'red', tooltip: l === 'uk' ? 'Лише невелика частка лікарів, які пройшли очне навчання, задокументовано надають послуги.' : 'Only a small fraction of doctors who completed in-person training are documented as providing services.' },
    { input: l === 'uk' ? 'UNICEF «навчені фахівці»' : 'UNICEF "trained professionals"', val: '38,000', status: l === 'uk' ? 'НЕ ВИМІРЮЄТЬСЯ' : 'NOT MEASURED', out: l === 'uk' ? 'Скільки надають клінічну допомогу?' : 'How many provide clinical care?', statusColor: 'red', tooltip: l === 'uk' ? 'Відсутні дані щодо того, скільки з навчених фахівців реально надають клінічну допомогу.' : 'There is no data on how many of the trained professionals actually provide clinical care.' },
    { input: l === 'uk' ? 'Супервізія після навчання' : 'Post-training supervision', val: l === 'uk' ? 'Низька' : 'Low', status: l === 'uk' ? 'КРИТИЧНА ПРОГАЛИНА' : 'CRITICAL GAP', out: l === 'uk' ? 'Якість та утримання навичок?' : 'Quality and skill retention?', statusColor: 'red', tooltip: l === 'uk' ? 'Брак систематичної супервізії знижує ефективність навчання та утримання навичок.' : 'Lack of systematic supervision reduces training effectiveness and skill retention.' },
    { input: l === 'uk' ? 'ВООЗ консультації' : 'WHO consultations', val: '80,000+', status: l === 'uk' ? 'НЕ ВИМІРЮЄТЬСЯ' : 'NOT MEASURED', out: l === 'uk' ? 'Відсоток завершення лікування?' : 'Treatment completion rate?', statusColor: 'red', tooltip: l === 'uk' ? 'Кількість консультацій не вказує на те, скільки пацієнтів успішно завершили лікування.' : 'The number of consultations does not indicate how many patients successfully completed treatment.' },
    { input: l === 'uk' ? 'Заклади з пакетом НСЗУ' : 'Facilities with NHSU package', val: '~1,000', status: '~5–7% (' + (l === 'uk' ? 'оцінка' : 'est.') + ')', out: l === 'uk' ? '% потреби покрито (з 15 млн)' : '% of need covered (of 15M)', statusColor: 'orange', tooltip: l === 'uk' ? 'Оцінка покриття потреби базується на загальній кількості закладів, що мають пакет НСЗУ.' : 'The estimated need coverage is based on the total number of facilities with the NHSU package.' },
];

// --- Banker Narrative Data ---

// Macro Gap — canonical session-level calculation (War Room canonical, NSZU verified)
export const MACRO_GAP = {
  beneficiaries: 3_900_000,         // WHO 2025, Lancet 2023
  sessionsPerPerson: 16,             // WHO standard avg 12-20
  totalSessionDemand: 62_400_000,    // 3.9M × 16
  currentCapacity: 180_000,          // NSZU verified (primary care)
  coveragePct: 0.28,                 // 180K / 62.4M
  sessionGap: 62_220_000,            // 62.4M - 180K
  blendedFinanceRateUAH: 1914.5,     // = 2000 - (285×0.3) UAH/session
  blendedFinanceNeedUAH: 119_120_190_000, // 62.22M × 1914.5
  marketMinEurBln: 2.5,              // 62.4M hr × €40/hr
  marketMaxEurBln: 4.1,              // 62.4M hr × €65/hr
  gdpLossUSD: '$1.2B+',             // War Room canonical
  lockedFundsUSD: '$954M',           // HEAL/THRIVE (War Room)
};

// Backlog chart — years to clear at different specialist counts
export const BACKLOG_DATA = (l: Language) => [
  { name: l === 'uk' ? '4,000 (зареєстр.)' : '4,000 (registered)', sustainable: 10.4, theoretical: 7.8 },
  { name: l === 'uk' ? '8,000 (подвоєно)' : '8,000 (doubled)', sustainable: 5.2, theoretical: 3.9 },
  { name: l === 'uk' ? '19,000 (макс+тінь)' : '19,000 (max+shadow)', sustainable: 2.2, theoretical: 1.6 },
];

// Three-level data infrastructure crisis (War Room)
export const INFRA_LEVELS = (l: Language) => [
  {
    label: l === 'uk' ? 'РІВЕНЬ 1: ДЕРЖАВА (ЕСОЗ)' : 'LEVEL 1: STATE (ESOZ)',
    status: l === 'uk' ? 'НЕСПРАВНІСТЬ' : 'MALFUNCTION',
    color: '#FF4444',
    desc: l === 'uk'
      ? 'API заблоковано. Неможливо верифікувати держфінансовані сесії або приймати зовнішні дані НГО.'
      : 'API connection blocked. Cannot verify state-funded sessions or accept external NGO data.',
  },
  {
    label: l === 'uk' ? 'РІВЕНЬ 2: ГУМАНІТАРНИЙ API' : 'LEVEL 2: HUMANITARIAN API',
    status: l === 'uk' ? 'АКТИВНИЙ (5W)' : 'ACTIVE (5W)',
    color: '#00FF66',
    desc: l === 'uk'
      ? 'Дані НГО/кластерів готові, але ізольовані. Неможливо верифікувати проти держреєстрів без Digital Bus.'
      : 'NGO/Cluster data is ready, but isolated. Cannot be verified against state registries without Digital Bus.',
  },
  {
    label: l === 'uk' ? 'РІВЕНЬ 3: КОШТИ ДОНОРІВ' : 'LEVEL 3: DONOR FUNDS',
    status: '$954M LOCKED',
    color: '#F59E0B',
    desc: l === 'uk'
      ? 'Кошти HEAL/THRIVE не можуть бути повністю виплачені без верифікованого двостороннього обміну даними.'
      : 'HEAL/THRIVE funds cannot be fully disbursed without verified bilateral data exchange.',
  },
];

// Feel Again positioning (War Room canonical)
export const FEEL_AGAIN_POSITION = (l: Language) => ({
  costToState: '\u20ac0',
  costNote: l === 'uk' ? 'Держава купує послугу (SaaS). Zero CAPEX.' : 'State buys service (SaaS). Zero CAPEX.',
  gdpLoss: '$1.2B+',
  lockedFunds: '$954M',
  is: l === 'uk'
    ? 'Цифрові фінансові рейки та інфраструктура даних. Система вимірювання та платежів, що доповнює існуючі програми.'
    : 'Digital financial rails and data infrastructure. A measurement and payment system that complements existing programs.',
  isNot: l === 'uk'
    ? 'Не постачальник послуг ментального здоров\u2019я. Не застосунок і не стартап. Ми не надаємо терапію \u2014 ми робимо її фінансованою, доступною та підзвітною.'
    : 'NOT a mental health service provider. Not an app or startup. We do not provide therapy \u2014 we make it fundable, findable, and accountable.',
});

// Capacity Ceiling: mathematical proof the gap can't close with efficiency alone
export const CAPACITY_CEILING_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Клінічна потреба' : 'Clinical Need', value: 3500, fill: '#FF4444' },
  { name: l === 'uk' ? 'Поточна ємність' : 'Current Capacity', value: 550, fill: COLORS.cyberAmber },
  { name: l === 'uk' ? '+100% ефективності' : '+100% Efficiency', value: 1100, fill: COLORS.cyberPurple },
  { name: l === 'uk' ? '+200% ефективності' : '+200% Efficiency', value: 1650, fill: COLORS.cyberCyan },
];

// ROI Investment Case: World Bank, UNICEF, DALY
export const ROI_CARDS = (l: Language) => [
  {
    source: 'World Bank',
    roi: '$1 \u2192 $4',
    roiNum: 4,
    period: l === 'uk' ? '5 років' : '5 years',
    color: COLORS.cyberCyan,
    desc: l === 'uk'
      ? 'Кожен $1, інвестований у лікування депресії та тривожності, повертає $4 у вигляді покращеного здоров\u2019я та підвищеної продуктивності.'
      : 'Every $1 invested in treating depression and anxiety returns $4 in improved health and productivity.',
    methodology: 'World Bank / Lancet Commission 2016, OneHealth Tool',
  },
  {
    source: 'UNICEF (global)',
    roi: '$1 \u2192 $225',
    roiNum: 225,
    period: l === 'uk' ? 'Довгострок.' : 'Long-term',
    color: COLORS.cyberSuccess,
    desc: l === 'uk'
      ? 'Профілактичні втручання у дитячому віці дають 225-кратний соціально-економічний повернення за рахунок освіти, продуктивності та скорочення витрат на охорону здоров\u2019я.'
      : 'Preventive childhood interventions yield 225× socioeconomic return through education, productivity, and reduced health costs.',
    methodology: 'UNICEF CBA 2023',
  },
  {
    source: l === 'uk' ? 'DALY / WHO поріг' : 'DALY / WHO threshold',
    roi: '8\u201340\u00d7',
    roiNum: 40,
    period: l === 'uk' ? 'На рік' : 'Per year',
    color: COLORS.cyberAmber,
    desc: l === 'uk'
      ? 'Курс психотерапії $150\u2013350 запобігає 1 DALY. При пороговому значенні ВОЗ $12\u202f000\u2013$15\u202f000/DALY це 8\u201340\u00d7 ефективніше за порогом рентабельності.'
      : 'A $150\u2013350 therapy course prevents 1 DALY. At WHO\u2019s $12,000\u2013$15,000/DALY threshold, this is 8\u201340\u00d7 more cost-effective.',
    methodology: 'WHO GNI threshold analysis',
  },
];

// Connected Assets: links to all related materials
export const CONNECTED_ASSETS = (l: Language) => [
  {
    name: l === 'uk' ? 'FEEL AGAIN \u2014 Відкриті дані v1' : 'FEEL AGAIN \u2014 Open Data v1',
    url: 'https://feelagain.pages.dev',
    type: 'portal',
    desc: l === 'uk' ? 'Канонічний набір даних та документація' : 'Canonical dataset & documentation',
  },
  {
    name: l === 'uk' ? 'OpenData Monitor (NBU Briefing)' : 'OpenData Monitor (NBU Briefing)',
    url: 'https://github.com/AlexezavGit/opendatamonitor',
    type: 'repo',
    desc: l === 'uk' ? 'Репозиторій моніторингу відкритих даних' : 'Open data monitoring repository',
  },
  {
    name: l === 'uk' ? 'Дашборд v1 (архів)' : 'Dashboard v1 (archive)',
    url: 'https://dashboard-1q7.pages.dev',
    type: 'dashboard',
    desc: l === 'uk' ? 'Попередня версія дашборду' : 'Previous dashboard version',
  },
  {
    name: l === 'uk' ? 'War Room (Google Drive)' : 'War Room (Google Drive)',
    url: 'https://drive.google.com/drive/folders/1VOFar_1bXsloOm6EA3uas1yeQ3ofDsTm',
    type: 'drive',
    desc: l === 'uk' ? 'Робоча папка з усіма матеріалами' : 'Working folder with all materials',
  },
];

export const SOURCES = {
    primary: [
        { name: 'WHO Special Initiative for Mental Health (SIMH) 2024', url: 'https://www.who.int/publications/m/item/special-initiative-for-mental-health-ukraine' },
        { name: 'World Bank Ukraine Economic Update 2025', url: 'https://www.worldbank.org/en/country/ukraine/publication/ukraine-economic-update' },
        { name: 'OCHA Humanitarian Needs Overview Ukraine 2025', url: 'https://www.unocha.org/publications/report/ukraine/ukraine-humanitarian-needs-and-response-plan-2025' },
        { name: 'WHO Mental Health Atlas 2020 (Ukraine profile)', url: 'https://www.who.int/publications/m/item/mental-health-atlas-ukr-2020-country-profile' },
        { name: 'HeRAMS Ukraine Status Update Report 2024', url: 'https://www.who.int/publications/m/item/herams-ukraine-status-update-report-2024-10-non-communicable-disease-and-mental-health-services-en' },
        { name: 'UNICEF HAC Ukraine 2025', url: 'https://www.unicef.org/media/166046/file/2025-HAC-Ukraine.pdf' },
        { name: 'FTS OCHA Ukraine Health Cluster Funding 2024-2025', url: 'https://fts.unocha.org/plans/1188/summary' }
    ],
    secondary: [
        { name: 'PMC Mental health services during war — 2-year follow-up 2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11951524/' },
        { name: 'Lancet Regional Health Europe 2023 (Prevalence study)', url: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(23)00192-8/fulltext' },
        { name: 'HIAS/Girls MHPSS Full Report 2023', url: 'https://www.hias.org/news/new-report-mental-health-needs-ukraine' },
        { name: 'CSIS Investing in Mental Health 2024', url: 'https://www.csis.org/analysis/investing-mental-health-will-be-critical-ukraines-economic-future' }
    ]
};
