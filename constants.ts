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
    subtitle: { uk: "Ментальне здоров\u2019я та психосоціальна підтримка \u2014 перший набір відкритих даних, зібраних вручну: цифровий міжсекторний обмін відсутній", en: "Mental Health & Psychosocial Support \u2014 first manually assembled open dataset: no digital cross-sector data exchange exists" },
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
    label: { uk: '~15-те місце в світі', en: '~15th Global Rank' },
    value: '~15',
    sub: { uk: 'за ринковим потенціалом ментального здоров\'я', en: 'by MH market potential' },
    change: { uk: '↑ $3.5 млрд потенційний ринок', en: '↑ $3.5B potential market' },
    status: 'warning',
    source: { uk: 'аналітичний розрахунок 2025', en: 'analytical estimate 2025' }
  },
  {
    label: { uk: 'Клінічна потреба', en: 'Clinical Need' },
    value: '3 900 000',
    sub: { uk: '22% населення потребують клінічного лікування', en: '22% of population in clinical need' },
    change: { uk: '↑ 54% шукають — не знаходять', en: '↑ 54% seek help, find nothing' },
    status: 'danger',
    source: { uk: 'WHO 2025 / Lancet 2023', en: 'WHO 2025 / Lancet 2023' }
  },
  {
    label: { uk: '54% РОЗРИВ', en: '54% TREATMENT GAP' },
    value: '54%',
    sub: { uk: 'визнають потребу (71%) — реально не лікуються', en: 'recognise need (71%) — not treated' },
    change: { uk: 'Постійний розрив між потребою і реальністю', en: 'Persistent gap: need vs. actual care' },
    status: 'danger',
    source: { uk: 'Gradus Research / Українська Правда', en: 'Gradus Research / UA Pravda' }
  },
  {
    label: { uk: 'AFTERSHOCK (кумул.)', en: 'AFTERSHOCK (cumul.)' },
    value: '6 720 000',
    sub: { uk: '€5.4 млрд ринок · беклог 21.5 роки', en: '€5.4B market · 21.5yr backlog' },
    change: { uk: 'Включ. ВПО, біженці, демобілізовані', en: 'Incl. IDPs, refugees, demobilised' },
    status: 'danger',
    source: { uk: 'аналітичний розрахунок', en: 'analytical estimate' }
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
  { name: l === 'uk' ? 'Держ. сектор (8,201)' : 'Public sector (8,201)', value: 8201, fill: COLORS.blue },
  { name: l === 'uk' ? 'НУО / гуманітарний (38,000+)' : 'NGO / humanitarian (38,000+)', value: 38000, fill: COLORS.green },
  // Private sector: conservative 5-8K estimate from KVED/FOP registrations (practitioners with relevant KVEDs who are potentially accessible)
  // Shadow (unregistered) practitioners NOT counted — too long a path to formalization
  { name: l === 'uk' ? 'Приватний (оцінка 5–8K)' : 'Private (est. 5–8K)', value: 6500, fill: COLORS.purple },
];

export const BUDGET_SPLIT_DATA = (l: Language) => [
  // 2025 NHSU mental health budget structure (МОЗ/НСЗУ 2025)
  // Total health budget 2025: 222.1B UAH. MH share ~2.5% = ~5.55B UAH
  // 55% inpatient = ~3.05B UAH; 34% outpatient = ~1.89B UAH; 11% primary = ~0.61B UAH
  { name: l === 'uk' ? 'Стаціонар 55% (~3.05 млрд ₴)' : 'Inpatient 55% (~₴3.05B)', value: 55, fill: COLORS.red },
  { name: l === 'uk' ? 'Амбулаторія 34% (~1.89 млрд ₴)' : 'Outpatient 34% (~₴1.89B)', value: 34, fill: COLORS.orange },
  { name: l === 'uk' ? 'Первинна 11% (~0.61 млрд ₴)' : 'Primary 11% (~₴0.61B)', value: 11, fill: COLORS.green },
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
  { name: l === 'uk' ? 'Онлайн-сертифікати' : 'Online certificates', value: 150000, fill: COLORS.blueLight },
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
  { name: l === 'uk' ? 'Втрати ВВП (World Bank)' : 'GDP losses (World Bank)', percent: '4.5', value: '$6,000,000,000', source: 'World Bank', period: '2025', units: l === 'uk' ? 'USD (оцінка)' : 'USD (est.)' },
  // LSE/FHI360 methodology: 4-5% of pre-war GDP. Pre-war MH budget ~8B UAH; war-adjusted 10-12B UAH
  { name: l === 'uk' ? 'Втрати ВВП з поправкою на війну (LSE/FHI 360)' : 'War-adjusted GDP loss (LSE/FHI 360)', percent: '10–12', value: l === 'uk' ? '10–12 млрд ₴' : '₴10–12B', source: 'LSE/FHI 360', period: '2023–2025', units: l === 'uk' ? 'оцінка, UAH' : 'estimate, UAH' },
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
    { title: l === 'uk' ? '«ТИ ЯК» — Всеукраїнська програма' : '"TI YAK" — National MH Program', desc: l === 'uk' ? 'Державна ініціатива на підтримку ментального здоров\u2019я населення. Координаційний центр при КМУ. Платформа масової обізнаності: howareu.com, лінія психологічної підтримки, навчальні матеріали.' : 'State mental health awareness initiative. Coordination Center under CMU. Mass awareness platform: howareu.com, psychological support line, educational materials.', status: l === 'uk' ? 'Awareness' : 'Awareness', color: 'blue' },
    { title: l === 'uk' ? 'Awareness vs Clinical Care' : 'Awareness vs Clinical Care', desc: l === 'uk' ? 'Population-level awareness programs (400K+ учасників) є першим кроком. Відстань між усвідомленням потреби та отриманням клінічної допомоги залишається системним бар\u2019єром, що потребує адресного вирішення.' : 'Population-level awareness (400K+ participants) is a first step. The gap between awareness and clinical care access remains a systemic barrier requiring dedicated infrastructure.', status: l === 'uk' ? 'Gap: 15M потреба' : 'Gap: 15M need', color: 'orange' },
    { title: l === 'uk' ? 'MHPSS TWG (ВООЗ + IMC)' : 'MHPSS TWG (WHO + IMC)', desc: l === 'uk' ? '450+ організацій-учасників, збори 2 рази на тиждень, 3 регіональних хаби, 4 task teams. Ручна координація без єдиної цифрової платформи обміну даними.' : '450+ member organizations, meetings 2x/week, 3 regional hubs, 4 task teams. Manual coordination without unified data exchange platform.', status: l === 'uk' ? 'Координація є' : 'Coordination exists', color: 'blue' },
    { title: l === 'uk' ? 'OCHA Health Cluster' : 'OCHA Health Cluster', desc: l === 'uk' ? 'Гуманітарний кластер охорони здоров\u2019я координує надання послуг у зонах конфлікту. Дані збираються через ActivityInfo (5W) — паралельна система, не інтегрована з ЕСОЗ.' : 'Health cluster coordinates service delivery in conflict zones. Data collected via ActivityInfo (5W) — parallel system not integrated with ESOZ.', status: l === 'uk' ? 'Активний' : 'Active', color: 'blue' },
];

export const REACH_TABLE_DATA = (l: Language) => [
    [l === 'uk' ? 'Отримали МЗ-послуги (HEAL ISR #6)' : 'MH services received (HEAL ISR #6)', '624,464', 'World Bank / HEAL', '2025'],
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
    { input: l === 'uk' ? 'Лікарі первинної ланки з mhGAP' : 'Primary care doctors with mhGAP', val: '20,000+', status: l === 'uk' ? 'НЕ ВИМІРЮЄТЬСЯ' : 'NOT MEASURED', out: l === 'uk' ? 'Скільки надають реальну терапію?' : 'How many deliver actual therapy?', statusColor: 'red', tooltip: l === 'uk' ? 'Лікарі — фільтр, не терапевти. Навантаження клін. психологів (3,500 у НСЗУ) — 75+ пацієнтів на фахівця.' : 'Doctors are a filter, not therapists. Clinical psychologists (3,500 in NHSU system) carry 75+ patients each — 3× above norm.' },
    { input: l === 'uk' ? 'UNICEF «навчені фахівці»' : 'UNICEF "trained professionals"', val: '38,000', status: l === 'uk' ? 'НЕ ВИМІРЮЄТЬСЯ' : 'NOT MEASURED', out: l === 'uk' ? 'Скільки надають клінічну допомогу?' : 'How many provide clinical care?', statusColor: 'red', tooltip: l === 'uk' ? 'Відсутні дані щодо того, скільки з навчених фахівців реально надають клінічну допомогу.' : 'There is no data on how many of the trained professionals actually provide clinical care.' },
    { input: l === 'uk' ? 'Супервізія після навчання' : 'Post-training supervision', val: l === 'uk' ? 'Низька' : 'Low', status: l === 'uk' ? 'КРИТИЧНА ПРОГАЛИНА' : 'CRITICAL GAP', out: l === 'uk' ? 'Якість та утримання навичок?' : 'Quality and skill retention?', statusColor: 'red', tooltip: l === 'uk' ? 'Брак систематичної супервізії знижує ефективність навчання та утримання навичок.' : 'Lack of systematic supervision reduces training effectiveness and skill retention.' },
    { input: l === 'uk' ? 'ВООЗ консультації' : 'WHO consultations', val: '80,000+', status: l === 'uk' ? 'НЕ ВИМІРЮЄТЬСЯ' : 'NOT MEASURED', out: l === 'uk' ? 'Відсоток завершення лікування?' : 'Treatment completion rate?', statusColor: 'red', tooltip: l === 'uk' ? 'Кількість консультацій не вказує на те, скільки пацієнтів успішно завершили лікування.' : 'The number of consultations does not indicate how many patients successfully completed treatment.' },
    { input: l === 'uk' ? 'Заклади з пакетом НСЗУ' : 'Facilities with NHSU package', val: '~1,000', status: '~5–7% (' + (l === 'uk' ? 'оцінка' : 'est.') + ')', out: l === 'uk' ? '% потреби покрито (з 15 млн)' : '% of need covered (of 15M)', statusColor: 'orange', tooltip: l === 'uk' ? 'Оцінка покриття потреби базується на загальній кількості закладів, що мають пакет НСЗУ.' : 'The estimated need coverage is based on the total number of facilities with the NHSU package.' },
];

// --- Banker Narrative Data ---

// Perfect Storm scale tiles (market opportunity row, shown below KPI cards)
export const PERFECT_STORM_SCALE = (l: Language) => [
  {
    val: '62.4M',
    label: l === 'uk' ? 'СЕСІЙ / РІК' : 'SESSIONS / YEAR',
    sub: l === 'uk' ? '3.9M × 16 сес. (ВООЗ норма)' : '3.9M × 16 sess. (WHO standard)',
    color: '#00F5FF',
  },
  {
    val: '€2.5–4.1B',
    label: l === 'uk' ? 'РИНКОВИЙ ПОТЕНЦІАЛ' : 'MARKET POTENTIAL',
    sub: l === 'uk' ? '62.4M год × €40–65/год' : '62.4M hr × €40–65/hr',
    color: '#00FF66',
  },
  {
    val: '$140M',
    label: l === 'uk' ? 'МІН. ПУБЛІЧНІ ВИТРАТИ' : 'MIN PUBLIC COST',
    // 62.4M sessions × ~90 UAH NHSU tariff / 40 UAH per USD ≈ $140M
    sub: l === 'uk' ? '62.4M сес. × тариф НСЗУ ~90₴' : '62.4M sess. × NHSU tariff ~₴90',
    color: '#F59E0B',
  },
  {
    val: '7.8–12',
    label: l === 'uk' ? 'РОКІВ БЕКЛОГУ' : 'YEAR BACKLOG',
    sub: l === 'uk' ? '4 000 фахівців навіть при +100% ефект.' : '4,000 spec. even at +100% efficiency',
    color: '#FF4444',
  },
];

// Macro Gap — canonical session-level calculation (War Room canonical, NSZU verified)
export const MACRO_GAP = {
  beneficiaries: 3_900_000,         // WHO 2025, Lancet 2023
  sessionsPerPerson: 16,             // WHO standard avg 12-20
  totalSessionDemand: 62_400_000,    // 3.9M × 16
  currentCapacity: 180_000,          // NSZU primary-care psychological help package: ~3,346 contracted facilities × ~54 sessions/yr average (NSZU open data dashboard 2024)
  coveragePct: 0.28,                 // 180K / 62.4M
  sessionGap: 62_220_000,            // 62.4M - 180K
  blendedFinanceRateUAH: 1914.5,     // = 2000 - (285×0.3) UAH/session
  blendedFinanceNeedUAH: 119_120_190_000, // 62.22M × 1914.5
  marketMinEurBln: 2.5,              // 62.4M hr × €40/hr
  marketMaxEurBln: 4.1,              // 62.4M hr × €65/hr
  gdpLossUSD: '$1.2B+',             // War Room canonical
  lockedFundsUSD: '$954M',           // HEAL/THRIVE (War Room)
  // Aftershock: extended cumulative estimate (moderate + severe, incl. IDPs returning, refugees, cumulative trauma)
  // 6.72M × 16 = 107.52M sessions; × €50 avg = €5.376B ≈ €5.4B; / (4000 × 1250/yr) = 21.5 years
  aftershockBeneficiaries: 6_720_000,
  aftershockMarketEurBln: 5.4,
  aftershockBacklogYears: 21.5,
};

// Structural Disproportions — multiplier chart (shadow economy section)
// Shows how far the system is from norms: each bar = "Ukraine / WHO-benchmark or peer-sector"
// Calculation notes:
//   110× (Private / Humanitarian income):
//     Private: 6,500 practitioners × €1,500 net/mo × 12 = €117M/yr
//     Humanitarian direct MHPSS service fees flowing to practitioners ≈ $1.065M (OCHA 2025: ~38K sessions × $28/session avg)
//     Ratio: €117M / €1.065M ≈ 110
//   3,571× (mhGAP training-to-practice deficit):
//     Certificates issued: 150,000 (mhGAP online, 2020-2024)
//     Documented actively practicing as psychologists: 42 (WHO/MOH 2020 survey, last verified)
//     Ratio: 150,000 / 42 = 3,571 (bar truncated in chart at 120×, label shown outside)
//   3.1× (Admin burden vs WHO recommendation):
//     Ukraine MH practitioners: ~25-30% time on admin (WHO SIMH 2024)
//     WHO norm: ~8-10% admin overhead in outpatient MH settings
//     Ratio: 27% / 8.7% ≈ 3.1
//   8.1× (Budget inversion — inpatient vs actual need):
//     89% of MH budget → inpatient care
//     Only 11% of MH cases clinically require inpatient
//     Ratio: 89% / 11% = 8.1
export const STRUCTURAL_DISP_DATA = (l: Language) => [
  {
    name: l === 'uk' ? 'Приватний / Гуманітарний дохід' : 'Private / Humanitarian income',
    value: 110,
    displayValue: '110×',
    fill: '#FF4444',
    calc: l === 'uk'
      ? '6,500 фахівців × €1,500/міс × 12 = €117M/рік ÷ $1.065M (38K сесій × $28, OCHA 2025) ≈ 110×'
      : '6,500 practitioners × €1,500/mo × 12 = €117M/yr ÷ $1.065M (38K sessions × $28, OCHA 2025) ≈ 110×',
  },
  {
    name: l === 'uk' ? 'Дефіцит mhGAP навчання' : 'mhGAP training deficit',
    value: 120, // Truncated for chart display — actual = 3,571 (150,000 certs / 42 practicing)
    displayValue: '3 571×',
    fill: '#FF6666',
    calc: l === 'uk'
      ? '150,000 сертифікатів (2020–2024) ÷ 42 задокументованих практикуючих (ВООЗ/МОЗ 2020) = 3,571× (бар усічено)'
      : '150,000 certificates (2020–2024) ÷ 42 documented practicing (WHO/MOH 2020) = 3,571× (bar truncated)',
  },
  {
    name: l === 'uk' ? 'Адмін. gap (ВООЗ рекомендація)' : 'Admin gap (WHO recommendation)',
    value: 3.1,
    displayValue: '3.1×',
    fill: '#8B5CF6',
    calc: l === 'uk'
      ? '~27% часу на адмін (ВООЗ SIMH 2024) ÷ ВООЗ норма ~8.7% = 3.1×'
      : '~27% time on admin (WHO SIMH 2024) ÷ WHO norm ~8.7% = 3.1×',
  },
  {
    name: l === 'uk' ? 'Бюджет стаціонар / реальна потреба' : 'Budget inpatient / actual need',
    value: 8.1,
    displayValue: '8.1×',
    fill: '#06B6D4',
    calc: l === 'uk'
      ? '89% бюджету МЗ → стаціонар ÷ 11% випадків, що дійсно потребують стаціонарного лікування = 8.1×'
      : '89% MH budget → inpatient ÷ 11% of cases actually requiring inpatient care = 8.1×',
  },
];

// Backlog chart — years to clear at different specialist counts
// Sustainable (realistic norm): 1,500/yr = 30 sessions/week × 50 weeks
//   Rationale: 4 hrs client work + 4 hrs admin/supervision/notes daily.
//   Wartime practice: psychologists at 7-9hr/day burn out within ~3 months.
//   1,500 already 1.5× above the 4hr-clinical-day norm.
// Theoretical max: 2,000/yr (8hrs clinical/day) — does not exist in sustained practice.
// Charts use sustainable=1,500 and theoretical=2,000 to show range.
// Even at 2,000/yr with 4,000 specialists: 62.4M ÷ 8M = 7.8 years → IMPOSSIBLE
export const BACKLOG_DATA = (l: Language) => [
  {
    name: l === 'uk' ? '4,000 (зареєстр.)' : '4,000 (registered)',
    sustainable: 10.4, theoretical: 7.8,
    verdict: 'IMPOSSIBLE', verdictColor: '#FF4444',
  },
  {
    name: l === 'uk' ? '8,000 (подвоєно)' : '8,000 (doubled)',
    sustainable: 5.2, theoretical: 3.9,
    verdict: 'IMPOSSIBLE', verdictColor: '#FF4444',
  },
  {
    name: l === 'uk' ? '19,000 (макс+тінь)' : '19,000 (max+shadow)',
    sustainable: 2.2, theoretical: 1.6,
    verdict: l === 'uk' ? 'ТЕОРЕТИЧНО' : 'THEORETICAL ONLY', verdictColor: '#F59E0B',
  },
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

// Feel Again 6-layer architecture (War Room)
export const FEEL_AGAIN_ARCHITECTURE = (l: Language) => [
  { num: 1, flow: l === 'uk' ? 'Потреба \u2192 Ідентифікація' : 'Need \u2192 Identification', tool: l === 'uk' ? 'Портал самовизначення' : 'Self-assessment portal' },
  { num: 2, flow: l === 'uk' ? 'Навчання \u2192 Рекомендація' : 'Training \u2192 Recommendation', tool: l === 'uk' ? 'Match на готовність' : 'Readiness matching' },
  { num: 3, flow: l === 'uk' ? 'Формалізація \u2192 Реєстр' : 'Formalisation \u2192 Registry', tool: l === 'uk' ? 'Цифровий підпис кваліфікації' : 'Digital qualification signature' },
  { num: 4, flow: l === 'uk' ? 'Вимірювання \u2192 Верифікація' : 'Measurement \u2192 Verification', tool: 'WHO QoL, PCL-5, CORE-OM' },
  { num: 5, flow: l === 'uk' ? 'Платіжка \u2192 Результат' : 'Payment \u2192 Outcome', tool: 'Outcome-based, SDK.finance' },
  { num: 6, flow: l === 'uk' ? 'Інтеграція \u2192 Держава' : 'Integration \u2192 State', tool: 'ESOZ+, budget harmonization' },
];

// HEAL Ukraine P180245 — World Bank ISR #6 (Sep 2025, canonical)
// NOTE: HEAL is IPF (Investment Project Financing) with PBC, NOT PforR
// THRIVE (P505616) is the real PforR. Two separate instruments.
export const HEAL_UKRAINE = (l: Language) => ({
  project: 'HEAL Ukraine (P180245)',
  mechanism: 'IPF + PBC',
  total: '$500M',
  disbursed: '$171M',
  disbursedPct: 34,
  closing: '23 Dec 2026',
  // Restructured Aug 2024: extended from 31-Dec-2024 to 23-Dec-2026
  // Co-financing: CEB $22M + URTF. Envelope: $160M (PBC) + $340M (investment)
  restructuring: l === 'uk'
    ? 'Реструктуризація (серп. 2024): закриття подовжено з 31-Dec-2024 до 23-Dec-2026. Со-фінансування: CEB $22M + URTF. Конверт: $160M (PBC) + $340M (інвестиції). До закриття залишається ~9 міс.'
    : 'Restructured Aug 2024: closure extended from 31-Dec-2024 to 23-Dec-2026. Co-financing: CEB $22M + URTF. Envelope: $160M (PBC) + $340M (investment). ~9 months to closure.',
  components: [
    { name: l === 'uk' ? 'Психічне здоров\u2019я та реабілітація' : 'Mental Health & Rehabilitation', amount: 100, status: 'EXCEEDED' },
    { name: l === 'uk' ? 'Первинна медична допомога' : 'Primary Health Care', amount: 150, status: 'EXCEEDED' },
    { name: l === 'uk' ? 'Модернізація лікарень' : 'Hospital Modernization', amount: 200, status: 'ON TRACK' },
    { name: l === 'uk' ? 'Діджиталізація та інновації' : 'Digitalization & Innovations', amount: 50, status: 'PARTIAL' },
  ],
  // Full ISR #6 KPI table (as of 25-Mar-2026, WB ISR #6)
  kpis: [
    { name: l === 'uk' ? 'Отримали МЗ-послуги' : 'People receiving MH services', target: 500000, actual: 624464, pct: 125, status: 'exceeded' },
    { name: l === 'uk' ? 'Реабілітаційні послуги' : 'People receiving rehabilitation', target: 312500, actual: 670303, pct: 214, status: 'exceeded' },
    { name: l === 'uk' ? 'Розширені огляди ПМГ' : 'Extended PHC examinations', target: 3500000, actual: 10388635, pct: 297, status: 'exceeded' },
    { name: l === 'uk' ? 'Мобільні МЗ-команди' : 'Mobile MH teams deployed', target: 75, actual: 118, pct: 157, status: 'exceeded' },
    { name: l === 'uk' ? 'Заклади переоблаштовані (МЗ)' : 'Facilities reconfigured for MH', target: 400, actual: 0, pct: 0, status: 'critical' },
    { name: l === 'uk' ? 'Навчені (GBV)' : 'PHC personnel trained (GBV)', target: 3000, actual: 5288, pct: 176, status: 'exceeded' },
    { name: l === 'uk' ? 'Програма доступних ліків' : 'Affordable Medicine Program', target: 4767838, actual: 5502976, pct: 115, status: 'exceeded' },
  ],
  insight: l === 'uk'
    ? "Component 4 Digitalization ($50M) \u2014 точка входу. \u007e$41M незакуплено. 0/400 закладів реконфігуровано для МЗ. Feel Again = Digital Bus. Механізм доступу: procurement (RFQ/Direct Selection) через МОЗ."
    : "Component 4 Digitalization ($50M) is the entry point. \u007e$41M unallocated. 0/400 facilities reconfigured for MH. Feel Again = Digital Bus. Access: procurement (RFQ/Direct Selection) via MoH.",
  synergy: l === 'uk'
    ? "HEAL (IPF, $500M) генерує послуги \u2014 624K МЗ, 118 команд, але ДАНІ поза ЕСОЗ. THRIVE (PforR, $454M) вимірює через ЕСОЗ. GAP: виходи HEAL \u2260 входи THRIVE. FEEL Again middleware закриває цей розрив."
    : "HEAL (IPF, $500M) deploys services \u2014 624K MH, 118 teams, but DATA is outside ESOZ. THRIVE (PforR, $454M) measures via ESOZ. GAP: HEAL outputs \u2260 THRIVE inputs. FEEL Again middleware bridges this gap.",
});

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

// THRIVE World Bank Program-for-Results (P505616/P506083)
export const THRIVE_PROJECT = (l: Language) => ({
  id: 'P505616/P506083',
  mechanism: 'Program-for-Results (PforR)',
  total: '$454M',
  disbursed: '~$320M',
  disbursedPct: 70,
  signed: 'Dec 2024',
  detail: l === 'uk'
    ? 'Гроші виплачуються виключно після досягнення результатів через DLI. Фокус \u2014 ефективн\u0456сть витрат на охорону здоров\u2019я, оптим\u0456зац\u0456я ПМГ, п\u0456двищення операц\u0456йної потужност\u0456 НСЗУ.'
    : 'Funds disbursed only upon achieving results through DLI. Focus: health spending efficiency, PMG optimization, NHSU capacity.',
  critical: l === 'uk'
    ? 'THRIVE вим\u0456рює ефективн\u0456сть через дан\u0456 ЕСОЗ/НСЗУ. Якщо послуги HEAL (624K МЗ, 118 моб\u0456льних команд) не в\u0456дображаються в ЕСОЗ \u2014 вони не \u0456снують для метрик THRIVE.'
    : 'THRIVE measures efficiency via ESOZ/NHSU data. If HEAL services (624K MH, 118 mobile teams) are not in ESOZ \u2014 they do not exist for THRIVE metrics.',
  advance: l === 'uk'
    ? 'При підписанні (10-Dec-2024) Україна отримала $220M. Груд. 2025: +$19.5M після виконання DLI. Разом ~$320M з $454M (=70%) дисбурсовано. Кошти проходять через НБУ як depository bank для операцій Світового банку.'
    : 'At signing (10-Dec-2024) Ukraine received $220M. Dec 2025: +$19.5M after DLI completion. Total ~$320M of $454M (=70%) disbursed. Funds flow through NBU as depository bank for World Bank operations.',
});

// HEAL Component 4 Digitalization: procurement breakdown
export const HEAL_C4_PROCUREMENT = (l: Language) => ({
  budget: '$50M',
  procured: '~$8.9M',
  unallocated: '~$41.1M',
  note: l === 'uk'
    ? '\u0416\u043e\u0434\u043d\u0430 \u043f\u043e\u0437\u0438\u0446\u0456\u044f \u043d\u0435 \u0441\u0442\u043e\u0441\u0443\u0454\u0442\u044c\u0441\u044f interoperability middleware, FHIR-\u0442\u0440\u0430\u043d\u0441\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u0457, \u0430\u0431\u043e \u0456\u043d\u0442\u0435\u0433\u0440\u0430\u0446\u0456\u0457 \u0433\u0443\u043c\u0430\u043d\u0456\u0442\u0430\u0440\u043d\u0438\u0445 \u0434\u0430\u043d\u0438\u0445. \u0417\u0430\u043a\u0443\u043f\u0456\u0432\u043b\u0456 \u2014 \u043f\u0435\u0440\u0435\u0432\u0430\u0436\u043d\u043e hardware, \u043a\u0456\u0431\u0435\u0440\u0431\u0435\u0437\u043f\u0435\u043a\u0430 \u0442\u0430 MIS \u0434\u043b\u044f \u043e\u043a\u0440\u0435\u043c\u0438\u0445 \u0437\u0430\u043a\u043b\u0430\u0434\u0456\u0432.'
    : 'No position relates to interoperability middleware, FHIR transformation, or humanitarian data integration. Procurement is predominantly hardware, cybersecurity, and facility-specific MIS.',
  accessMechanism: l === 'uk'
    ? 'Procurement (RFQ / Direct Selection), \u043d\u0435 \u0433\u0440\u0430\u043d\u0442. FEEL Again \u2014 vendor/consultant \u0447\u0435\u0440\u0435\u0437 MoH (\u041c\u041e\u0417).'
    : 'Procurement (RFQ / Direct Selection), not a grant. FEEL Again enters as vendor/consultant via MoH.',
  categories: [
    { name: 'MIS deployments (specific facilities)', amountK: 163, examples: 'Doctor Eleks \u2192 Heart Institute ($65K); HELSI \u2192 Pediatric Cardiology ($98K)' },
    { name: 'ERP/SAP (Medical Procurement)', amountK: 1222, examples: 'SAP licenses for Enkidu/\u041c\u041f\u0423 \u2014 direct international' },
    { name: 'Cybersecurity', amountK: 2569, examples: 'WAF ($473K), Intrusion detection ($278K), Privileged Access ($330K), Cybersecurity Center ($1,488K)' },
    { name: 'Hardware & servers', amountK: 1474, examples: 'PHC computers ($1M), server equipment, data storage' },
    { name: 'Document management', amountK: 325, examples: 'E-doc systems for Heart Institute, MoH, Pediatric Cardiology' },
    { name: 'MoH Contact Center', amountK: 333, examples: 'National Contact Center of Ministry of Health' },
    { name: 'Other (elevator, generators, tokens)', amountK: 294, examples: 'Elevator in MoH building ($190K), backup power, USB tokens' },
  ],
});

// Counter-arguments to investor objections
export const COUNTERARGUMENTS = (l: Language) => [
  {
    objection: '"World Bank can build its own middleware"',
    response: l === 'uk'
      ? 'HEAL Component 4 \u043c\u0430\u0454 $50M, \u0430\u043b\u0435 0 \u0437\u0430\u043a\u043b\u0430\u0434\u0456\u0432 \u0440\u0435\u043a\u043e\u043d\u0444\u0456\u0433\u0443\u0440\u043e\u0432\u0430\u043d\u043e \u0437\u0430 2.5 \u0440\u043e\u043a\u0438. WB \u043d\u0435 \u0431\u0443\u0434\u0443\u0454 software \u2014 \u0432\u043e\u043d\u0438 \u0444\u0456\u043d\u0430\u043d\u0441\u0443\u044e\u0442\u044c.'
      : 'HEAL Component 4 has $50M but 0 facilities reconfigured in 2.5 years. WB does not build software \u2014 they finance.',
    risk: 'Medium',
  },
  {
    objection: '"MIS (Helsi) will integrate humanitarian data themselves"',
    response: l === 'uk'
      ? '\u041f\u0440\u043e\u0442\u0438 \u0457\u0445\u043d\u044c\u043e\u0457 \u0431\u0456\u0437\u043d\u0435\u0441-\u043c\u043e\u0434\u0435\u043b\u0456 (\u043b\u0456\u0446\u0435\u043d\u0437\u0456\u044f \u0437\u0430 \u0440\u043e\u0431\u043e\u0447\u0435 \u043c\u0456\u0441\u0446\u0435). 118 \u043c\u043e\u0431\u0456\u043b\u044c\u043d\u0438\u0445 \u043a\u043e\u043c\u0430\u043d\u0434 \u2260 \u043f\u043e\u0442\u0435\u043d\u0446\u0456\u0439\u043d\u0456 \u043a\u043b\u0456\u0454\u043d\u0442\u0438 Helsi.'
      : 'Against their business model (per-seat license). 118 mobile teams \u2260 potential Helsi clients.',
    risk: 'Low',
  },
  {
    objection: '"ESOZ already captures this data"',
    response: l === 'uk'
      ? 'ISR \u043f\u043e\u043a\u0430\u0437\u0443\u0454 624K \u041c\u0417-\u0441\u0435\u0440\u0432\u0456\u0441\u0456\u0432, \u0430\u043b\u0435 0/400 \u0440\u0435\u043a\u043e\u043d\u0444\u0456\u0433\u043e\u0432\u0430\u043d\u0438\u0445 \u0437\u0430\u043a\u043b\u0430\u0434\u0456\u0432. \u0414\u0430\u043d\u0456 \u0437\u0431\u0438\u0440\u0430\u044e\u0442\u044c\u0441\u044f \u0432 \u043f\u0430\u0440\u0430\u043b\u0435\u043b\u044c\u043d\u0438\u0445 \u0441\u0438\u0441\u0442\u0435\u043c\u0430\u0445 HEAL, \u043d\u0435 \u0432 \u0415\u0421\u041e\u0417.'
      : 'ISR shows 624K MH services but 0/400 reconfigured facilities. Data is collected in parallel HEAL systems, not in ESOZ.',
    risk: 'Low',
  },
  {
    objection: '"THRIVE DLIs may not measure mental health specifically"',
    response: l === 'uk'
      ? '\u041f\u043e\u0442\u0440\u0456\u0431\u043d\u0430 \u0432\u0435\u0440\u0438\u0444\u0456\u043a\u0430\u0446\u0456\u044f. PAD THRIVE \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0438\u0439 \u043f\u0443\u0431\u043b\u0456\u0447\u043d\u043e. \u0410\u043b\u0435 PforR \u0437\u0430 \u0432\u0438\u0437\u043d\u0430\u0447\u0435\u043d\u043d\u044f\u043c \u0432\u0438\u043c\u0456\u0440\u044e\u0454 \u0447\u0435\u0440\u0435\u0437 \u0415\u0421\u041e\u0417.'
      : 'Verification needed. PAD THRIVE is not publicly available. But PforR by definition measures via ESOZ.',
    risk: 'High',
  },
  {
    objection: '"December 2026 closing is too soon for middleware"',
    response: l === 'uk'
      ? 'HEAL \u0437\u0430\u043a\u0440\u0438\u0432\u0430\u0454\u0442\u044c\u0441\u044f Dec/2026. \u0410\u043b\u0435 THRIVE \u0449\u043e\u0439\u043d\u043e \u0441\u0442\u0430\u0440\u0442\u0443\u0432\u0430\u0432 (Dec 2024). Middleware \u043f\u043e\u0442\u0440\u0456\u0431\u043d\u0438\u0439 \u0434\u043b\u044f THRIVE, \u043d\u0435 \u0442\u0456\u043b\u044c\u043a\u0438 HEAL.'
      : 'HEAL closes Dec/2026. But THRIVE just started (Dec 2024). Middleware is needed for THRIVE, not only HEAL.',
    risk: 'Medium',
  },
];

// Architectural data flow: Humanitarian Zone → FEEL Again → State Zone
export const ARCH_FLOW = (l: Language) => ({
  humanitarian: {
    label: l === 'uk' ? 'ГУМАН\u0406ТАРНА ЗОНА' : 'HUMANITARIAN ZONE',
    sources: ['CommCare (ODK)', 'KoboToolbox', 'ActivityInfo', l === 'uk' ? 'Excel / Paper forms' : 'Excel / Paper forms'],
    highlights: ['118 Mobile MH Teams', '624,464 MH services'],
  },
  middleware: {
    label: 'FEEL Again\nMIDDLEWARE',
    components: ['Universal Adapter', 'Data Normalization', '\u2192 FHIR R4 Bundle', 'Shadow Record Tagging', 'Provenance Resource', 'Batch Processing'],
  },
  state: {
    label: l === 'uk' ? '\u0414\u0415\u0420\u0416\u0410\u0412\u041d\u0410 ЗОНА' : 'STATE ZONE',
    systems: [
      { name: 'Trembita', sub: 'X-Road | 230+ inst.', color: '#3B82F6' },
      { name: 'ESOZ', sub: '36.5M users', color: '#00FF66' },
      { name: 'NHSU (\u041d\u0421\u0417\u0423)', sub: '', color: '#F59E0B' },
      { name: 'THRIVE', sub: '$454M PforR', color: '#F59E0B' },
      { name: 'EHDS', sub: 'EU Integration', color: '#3B82F6' },
    ],
  },
});

// Stakeholder Matrix: who benefits from middleware and why
export const STAKEHOLDER_MATRIX = (l: Language) => [
  {
    stakeholder: 'World Bank',
    pain: l === 'uk'
      ? 'HEAL надає 624K МЗ-послуг, але не може верифікувати, що вони зараховуються до метрик THRIVE PforR'
      : 'HEAL delivers 624K MH services but can\u2019t verify they count for THRIVE PforR metrics',
    gain: l === 'uk'
      ? 'Unified data pipeline: виходи HEAL \u2192 ЕСОЗ \u2192 KPI THRIVE'
      : 'Unified data pipeline: HEAL outputs \u2192 ESOZ \u2192 THRIVE KPIs',
  },
  {
    stakeholder: 'MoH / Ukraine',
    pain: l === 'uk'
      ? 'Втрачає транші THRIVE, якщо ЕСОЗ не відображає реальний обсяг послуг'
      : 'Loses THRIVE tranches if ESOZ doesn\u2019t reflect actual service volume',
    gain: l === 'uk'
      ? '"Digital deoccupation": 624K+ невидимих послуг стають видимими в ЕСОЗ'
      : '"Digital deoccupation": 624K+ invisible services become visible in ESOZ',
  },
  {
    stakeholder: 'NHSU (\u041d\u0421\u0417\u0423)',
    pain: l === 'uk'
      ? 'Не може вимірювати ефективність ПМГ без даних гуманітарних послуг'
      : 'Can\u2019t measure PMG efficiency without humanitarian service data',
    gain: l === 'uk'
      ? 'Non-billing shadow records \u2014 клінічні дані входять до ЕСОЗ без запуску платежів НСЗУ'
      : 'Non-billing shadow records \u2014 clinical data enters ESOZ without triggering NSZU payments',
  },
  {
    stakeholder: l === 'uk' ? '118 мобільних МЗ-команд' : '118 Mobile MH teams',
    pain: l === 'uk'
      ? 'Працюють у CommCare/Kobo/Excel \u2014 дані в силосах, немає континуїтету допомоги'
      : 'Working in CommCare/Kobo/Excel \u2014 data sits in silos, no continuity of care',
    gain: l === 'uk'
      ? 'Universal adapter: CommCare \u2192 FHIR R4 \u2192 Trembita \u2192 ЕСОЗ'
      : 'Universal adapter: CommCare \u2192 FHIR R4 \u2192 Trembita \u2192 ESOZ',
  },
  {
    stakeholder: 'MIS operators (Helsi, Doctor Eleks)',
    pain: l === 'uk'
      ? 'Не будуть інтегрувати дані НГО \u2014 проти моделі ліцензії за робоче місце'
      : 'Won\u2019t integrate NGO data \u2014 against per-seat license business model',
    gain: l === 'uk'
      ? 'FEEL не конкурує з MIS; доставляє попередньо відформатовані дані FHIR для їх споживання'
      : 'FEEL doesn\u2019t compete with MIS; delivers pre-formatted FHIR data they can consume',
  },
  {
    stakeholder: l === 'uk' ? 'Пацієнт / Ветеран' : 'Patient / Veteran',
    pain: l === 'uk'
      ? 'Переходить від мобільної НГО-команди до сімейного лікаря \u2014 лікар бачить "чистий аркуш"'
      : 'Goes from NGO mobile team to family doctor \u2014 doctor sees "clean sheet"',
    gain: l === 'uk'
      ? 'Повна медична історія подорожує разом з пацієнтом'
      : 'Complete medical history travels with the patient',
  },
  {
    stakeholder: l === 'uk' ? 'Донори (гуманітарні)' : 'Donors (humanitarian)',
    pain: l === 'uk'
      ? 'Не можуть продемонструвати вплив у термінах державної системи'
      : 'Can\u2019t demonstrate impact in state-system terms',
    gain: l === 'uk'
      ? 'Кожна сесія тегована "Funded by [Donor], Project ID [X]" \u2014 входить до ЕСОЗ як provenance'
      : 'Every session tagged "Funded by [Donor], Project ID [X]" \u2014 enters ESOZ as provenance',
  },
  {
    stakeholder: 'EU / EHDS',
    pain: l === 'uk'
      ? 'Зобов\u2019язання України щодо \u0454вроінтеграції вимагає інтероперабельності медичних даних'
      : 'Ukraine\u2019s EU integration obligation requires health data interoperability',
    gain: l === 'uk'
      ? 'FHIR R4 compliance \u2014 перший крок до European Health Data Space'
      : 'FHIR R4 compliance as first step toward European Health Data Space',
  },
];

// Formalization cost model v3 — full decomposition
export const FORMALIZATION_COST_V3 = (l: Language) => ({
  assumption: l === 'uk'
    ? '\u0404вро 1,500/міс середній дохід, \u0454вро 46/год ставка, 1,000 год/рік реальний обсяг роботи'
    : '\u20ac1,500/month avg income, \u20ac46/hr rate, 1,000 hrs/year actual shadow workload',
  shadowNet: '\u20ac1,500/month',
  formalNet: '\u20ac335\u2013520/month (23\u201335%)',
  penaltyPct: 65,
  directCosts: {
    label: l === 'uk' ? 'A. Пряме навантаження (податки + адмін)' : 'A. Direct costs (taxes + admin)',
    items: [
      { label: l === 'uk' ? 'ФОП Група 3 (5% від \u20ac1,500)' : 'FOP Group 3 tax (5% of \u20ac1,500)', amountPerMonth: 75 },
      { label: l === 'uk' ? '\u0404СВ (мінімум)' : 'ESV (minimum)', amountPerMonth: 32 },
      { label: l === 'uk' ? 'Бухгалтерські послуги' : 'Accounting services', amountPerMonth: 100 },
    ],
    totalPerMonth: 207,
    totalPerYear: 2484,
  },
  opportunityCost: {
    label: l === 'uk' ? 'B. Opportunity cost (втрачені продуктивні години)' : 'B. Opportunity cost (lost productive hours)',
    items: [
      { label: l === 'uk' ? '20% часу адм\u0456н: 200 год/рік \u00d7 \u20ac46/год' : '20% admin time: 200 hrs/year \u00d7 \u20ac46/hr', amountPerMonth: 767 },
      { label: l === 'uk' ? '5% комплаєнс: 50 год/рік \u00d7 \u20ac46/год' : '5% tax compliance: 50 hrs/year \u00d7 \u20ac46/hr', amountPerMonth: 192 },
    ],
    totalPerMonth: 958,
    totalPerYear: 11500,
  },
  total: {
    perMonth: 1165,
    perYear: 13984,
    label: 'TOTAL A + B',
  },
  conclusion: l === 'uk'
    ? 'Формалізація знищує 2/3 доходу психолога. При \u20ac2,000-3,000/міс (Київ) пропорція покращується, але структурна пастка залишається: 25% часу \u2014 на адміністрування замість клієнтів.'
    : 'Formalization destroys 2/3 of practitioner income. At \u20ac2,000-3,000/month (Kyiv) the ratio improves, but the structural trap remains: 25% of time on admin instead of clients.',
});

// Dual-project synergy: corrected narrative (replaces PforR misattribution to HEAL)
export const DUAL_PROJECT_NARRATIVE = (l: Language) =>
  l === 'uk'
    ? 'Св\u0456товий Банк \u0456нвестував $954M в охорону здоров\u2019я України через два взаємопов\u2019язаних \u0456нструменти. HEAL ($500M, IPF) розгорта\u0454 послуги \u2014 624,464 ос\u0456б отримали МЗ допомогу, 118 моб\u0456льних команд працюють у пол\u0456. THRIVE ($454M, PforR) вим\u0456рю\u0454 ефективн\u0456сть системи через ЕСОЗ. Але ЕСОЗ не бачить б\u0456льш\u0456сть послуг HEAL: моб\u0456льн\u0456 команди працюють у CommCare/Kobo/ActivityInfo. Trembita (230+ \u0456нституц\u0456й, 7B+ транзакц\u0456й) п\u0456дключена до НСЗУ, але не розум\u0456\u0454 формат гуман\u0456тарних систем. Результат: $500M-проєкт генеру\u0454 послуги, як\u0456 $454M-проєкт не може побачити. FEEL Again middleware \u2014 це "по\u0457зд" м\u0456ж зонами: CommCare/Kobo \u2192 FHIR R4 \u2192 Trembita \u2192 ЕСОЗ. Component 4 HEAL ($50M на диг\u0456тал\u0456зац\u0456ю) \u2014 вже затверджене ф\u0456нансове в\u0456кно.'
    : 'World Bank invested $954M in Ukraine health via two linked instruments. HEAL ($500M, IPF) deploys services \u2014 624,464 people received MH support, 118 mobile teams in the field. THRIVE ($454M, PforR) measures system efficiency via ESOZ. But ESOZ cannot see most HEAL services: mobile teams work in CommCare/Kobo/ActivityInfo. Trembita (230+ institutions, 7B+ transactions) connects to NHSU but does not understand humanitarian data formats. Result: the $500M project generates services the $454M project cannot see. FEEL Again middleware is the "train" between zones: CommCare/Kobo \u2192 FHIR R4 \u2192 Trembita \u2192 ESOZ. HEAL Component 4 ($50M digitalization) is the pre-approved funding window.';

// Missing Middle: two invisible layers that statistics cannot capture
export const MISSING_MIDDLE = (l: Language) => ({
  title: l === 'uk' ? 'MISSING MIDDLE: ДВА НЕВИДИМІ ШАРИ' : 'MISSING MIDDLE: TWO INVISIBLE LAYERS',
  clinical: {
    title: l === 'uk' ? 'Клінічна пропущена середина' : 'Clinical missing middle',
    desc: l === 'uk'
      ? 'Реальна середня ланка клінічної допомоги. Неможливо зробити вигляд, що її немає — тільки тому що статистично не видно. Приватні та неформальні фахівці присутні і в гуманітарній, і в тіньовій статистиці, працюють на фронтлайні, приймають удар — але скромно не вважають себе частиною гуманітарного реагування і не мають доступу до фінансування. За консервативною оцінкою вони можуть дорівнювати сукупній кількості зайнятих у гуманітарному хелс-кластері разом із клінічним сектором НСЗУ. Нове регулювання закриває пастку замість того, щоб відкрити вихід.'
      : 'The real clinical middle layer — cannot be ignored just because statistics cannot see it. Private/informal practitioners appear in both humanitarian and shadow data, work frontline, take the hit — but modestly do not see themselves as humanitarian responders and have no access to funding. Conservative estimate: they may equal the combined headcount of the humanitarian health cluster plus NHSU clinical sector. New regulation closes the trap instead of opening an exit.',
    items: [
      { label: l === 'uk' ? 'Реальна пропускна здатність' : 'Actual throughput capacity', desc: l === 'uk' ? 'Немає даних про фактичну кількість сесій на одного фахівця в системі ЕСОЗ' : 'No data on actual sessions per specialist in ESOZ' },
      { label: l === 'uk' ? 'Конверсія mhGAP (<10%)' : 'mhGAP conversion (<10%)', desc: l === 'uk' ? 'З 150,000+ навчених лікарів реально надають послуги — оцінка: менше 10%' : 'Of 150,000+ trained doctors — estimate: <10% actually delivering services' },
      { label: l === 'uk' ? 'Тіньовий ринок' : 'Shadow market volume', desc: l === 'uk' ? 'Точний обсяг приватного ринку, який не проходить через офіційну статистику' : 'Exact volume of private market not captured in official statistics' },
    ],
  },
  coordination: {
    title: l === 'uk' ? 'Цифрова координаційна середина' : 'Digital coordination middle',
    desc: l === 'uk'
      ? 'Координувати 1,000+ осіб і 450+ організацій через чати та фізичні зустрічі — це видимість координації. Реальні надскладні завдання MHPSS (дедуплікація, outcome tracking, gap analysis в реальному часі) потребують цифрової платформи, якої не існує. Відсутня цифрова координаційна середина — це і є структурна причина, чому 624K МЗ-сесій не видно у метриках THRIVE.'
      : 'Coordinating 1,000+ people and 450+ organisations via chats and physical meetings creates the appearance of coordination. Real complex MHPSS tasks (deduplication, outcome tracking, real-time gap analysis) require a digital platform that does not exist. The absent digital coordination layer is the structural reason why 624K MH sessions are invisible to THRIVE metrics.',
  },
});

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
