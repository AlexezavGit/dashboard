import { LocalizedString, KpiData, SectionData, Language } from './types';

// Palette mapping from original design
export const COLORS = {
  cyberCyan: '#00F5FF',
  cyberAmber: '#F59E0B',
  cyberSuccess: '#00FF66',
  cyberPurple: '#A855F7',
  cyberBg: '#050A15',
  blue: '#00F5FF',
  blueLight: 'rgba(0, 245, 255, 0.6)',
  red: '#FF4444',
  redLight: 'rgba(255, 68, 68, 0.6)',
  orange: '#F59E0B',
  orangeLight: 'rgba(245, 158, 11, 0.6)',
  green: '#00FF66',
  greenLight: 'rgba(0, 255, 102, 0.6)',
  purple: '#A855F7',
  purpleLight: 'rgba(168, 85, 247, 0.6)',
  teal: '#00E5FF',
  gray: '#475569',
  navy: '#0A1A2F',
  gold: '#D4A017',
  goldLight: 'rgba(212, 160, 23, 0.6)',
};

export const TEXTS = {
  header: {
    title: { uk: 'Стан сектору МЗПСП в Україні', en: 'MHPSS Sector Status in Ukraine' },
    subtitle: { uk: "Ментальне здоров'я та психосоціальна підтримка — Огляд для донорів та стейкхолдерів", en: "Mental Health & Psychosocial Support — Donor & Stakeholder Overview" },
    date: { uk: 'Дані: 2020–2026 | Оновлено: березень 2026', en: 'Data: 2020–2026 | Updated: March 2026' },
  },
  filters: {
    label: { uk: 'Розділ:', en: 'Section:' },
    options: {
      all: { uk: 'Усі розділи', en: 'All Sections' },
      perfectstorm: { uk: '⚡ Perfect Storm', en: '⚡ Perfect Storm' },
      prevalence: { uk: 'Хто потребує допомоги', en: 'Who Needs Help' },
      workforce: { uk: 'Хто може допомогти', en: 'Who Can Help' },
      budget: { uk: 'Гроші та фінансування', en: 'Money & Funding' },
      worldbank: { uk: 'Світовий Банк ($954M)', en: 'World Bank ($954M)' },
      gap: { uk: 'Розрив: потреба vs реальність', en: 'Gap: Need vs Reality' },
      shadow: { uk: 'Тіньовий сектор', en: 'Shadow Sector' },
      inputs: { uk: 'Що зроблено і чому не працює', en: 'What Was Done & Why It Fails' },
      children: { uk: 'Діти', en: 'Children' },
      economic: { uk: 'Регіональний розподіл', en: 'Regional Distribution' },
    }
  },
  footer: {
    sources: { uk: 'Джерела даних', en: 'Data Sources' },
    primarySources: { uk: 'Первинні джерела (Primary Sources)', en: 'Primary Sources' },
    secondarySources: { uk: 'Вторинні джерела та дослідження (Secondary Sources)', en: 'Secondary Sources' },
    feelAgainTitle: { uk: 'ВІДКРИТИ ВЕБ-САЙТ FEEL AGAIN', en: 'OPEN FEEL AGAIN WEBSITE' },
    feelAgainDesc: { uk: 'Ментальний добробут відновлює країну. FEEL Again — цифрова інфраструктура для цього відновлення', en: 'Mental wellbeing restores the country. FEEL Again is the digital infrastructure for this recovery' },
    disclaimer: {
      uk: 'Дашборд містить дані з відкритих джерел за 2020-2026 рр. «Оцінка» зазначено де дані недоступні. Стигма: верифіковано Gradus Research 2024. Тіньовий сектор: конкретні дослідження для MHPSS не проводились. Сертифікація: добровільна до 2031 р. (Закон 4223-IX, чинний з 07.02.2026).',
      en: "Dashboard contains data from open sources for 2020-2026. 'Estimate' indicated where data unavailable. Stigma: verified via Gradus Research 2024. Shadow sector: specific MHPSS studies not conducted. Certification: voluntary until 2031 (Law 4223-IX, effective 07.02.2026)."
    }
  }
};

export const TOP_METRICS = (l: Language) => [
  {
    label: l === 'uk' ? 'HEAL: MH-послуги надано' : 'HEAL: MH Services Delivered',
    value: 624464,
    suffix: '',
    sub: l === 'uk' ? 'Осіб отримали послуги психічного здоров\'я (WB ISR #6, серпень 2025)' : 'People received mental health services (WB ISR #6, August 2025)',
    tooltip: l === 'uk' ? 'Верифіковано: World Bank Implementation Status Report #6, P180245, заархівовано 20-Sep-2025. Ціль: 500,000 — перевиконано на 25%.' : 'Verified: World Bank Implementation Status Report #6, P180245, archived 20-Sep-2025. Target: 500,000 — exceeded by 25%.',
    icon: 'Users',
    color: COLORS.cyberCyan
  },
  {
    label: l === 'uk' ? 'Мобільні MH команди' : 'Mobile MH Teams',
    value: 118,
    sub: l === 'uk' ? 'Ціль HEAL: 75 — перевиконано. Працюють у полі (CommCare/Kobo)' : 'HEAL target: 75 — exceeded. Operating in field (CommCare/Kobo)',
    tooltip: l === 'uk' ? 'WB ISR #6: 118 мобільних команд розгорнуто у 22 регіонах. Дані збираються в гуманітарних системах, НЕ в ЕСОЗ.' : 'WB ISR #6: 118 mobile teams deployed across 22 regions. Data collected in humanitarian systems, NOT in ESOZ.',
    icon: 'Building2',
    color: COLORS.cyberAmber
  },
  {
    label: l === 'uk' ? 'WB інвестиції в здоров\'я' : 'WB Health Investment',
    value: 954000000,
    suffix: '',
    sub: l === 'uk' ? 'HEAL $500M (IPF) + THRIVE $454M (PforR) = $954M' : 'HEAL $500M (IPF) + THRIVE $454M (PforR) = $954M',
    tooltip: l === 'uk' ? 'HEAL: $500M (інвестиційний, Dec 2022). THRIVE: $454M (Program-for-Results, Dec 2024). Різні механізми — HEAL фінансує послуги, THRIVE вимірює результати через ЕСОЗ.' : 'HEAL: $500M (investment, Dec 2022). THRIVE: $454M (Program-for-Results, Dec 2024). Different mechanisms — HEAL funds services, THRIVE measures results via ESOZ.',
    icon: 'GraduationCap',
    color: COLORS.cyberPurple
  }
];

export const KPI_DATA: KpiData[] = [
  {
    label: { uk: 'Клінічна потреба', en: 'Clinical Need' },
    value: '3.9 млн',
    sub: { uk: 'осіб потребують лікування (22% від 15M з потребою підтримки)', en: 'people need treatment (22% of 15M needing support)' },
    change: { uk: '62.4M клінічних годин (3.9M × 16 сесій)', en: '62.4M clinical hours (3.9M × 16 sessions)' },
    status: 'danger',
    source: { uk: 'Lancet 2023 / МОЗ / Розрахунок', en: 'Lancet 2023 / MOH / Calculated' }
  },
  {
    label: { uk: 'Розрив попит—дія', en: 'Demand-Action Gap' },
    value: '54%',
    sub: { uk: '71% визнають потребу, лише 17% шукають допомогу', en: '71% acknowledge need, only 17% seek help' },
    change: { uk: 'Gradus Research / Правда 2024', en: 'Gradus Research / Pravda 2024' },
    status: 'danger',
    source: { uk: 'Gradus / Українська правда', en: 'Gradus / Ukrainska Pravda' }
  },
  {
    label: { uk: "Бюджет на МЗ", en: 'Mental Health Budget' },
    value: '2.5%',
    sub: { uk: "від бюджету охорони здоров'я (ВООЗ рекомендує ≥5%)", en: 'of total health budget (WHO recommends ≥5%)' },
    change: { uk: '89% бюджету — стаціонар, 11% — амбулаторія', en: '89% budget to inpatient, 11% to outpatient' },
    status: 'warning',
    source: { uk: 'CMU 2026 / ВООЗ', en: 'CMU 2026 / WHO' }
  },
  {
    label: { uk: 'Бекlog сектору', en: 'Sector Backlog' },
    value: '7.8–12',
    sub: { uk: 'років на обробку 62.4M годин при 4,000 фахівців', en: 'years to clear 62.4M hours at 4,000 professionals' },
    change: { uk: '7.8 (теор. стеля) — 12 (з вигоранням)', en: '7.8 (theoretical ceiling) — 12 (with burnout)' },
    status: 'danger',
    source: { uk: 'Розрахунок / Doc 4', en: 'Calculated / Doc 4' }
  }
];

export const SECTIONS_CONFIG: SectionData[] = [
  { id: 'perfectstorm', title: { uk: 'Perfect Storm — масштаб кризи', en: 'Perfect Storm — Crisis Scale' }, icon: 'AlertTriangle' },
  { id: 'prevalence', title: { uk: 'Хто потребує допомоги', en: 'Who Needs Help' }, icon: 'BarChart2' },
  { id: 'workforce', title: { uk: 'Хто може допомогти — і чому цього замало', en: 'Who Can Help — And Why It\'s Not Enough' }, icon: 'Users' },
  { id: 'budget', title: { uk: 'Гроші: хто платить і куди вони йдуть', en: 'Money: Who Pays And Where It Goes' }, icon: 'Coins' },
  { id: 'worldbank', title: { uk: 'Світовий Банк: $954M і middleware gap', en: 'World Bank: $954M And The Middleware Gap' }, icon: 'Globe' },
  { id: 'gap', title: { uk: 'Розрив: потреба vs реальність', en: 'The Gap: Need vs Reality' }, icon: 'AlertCircle' },
  { id: 'shadow', title: { uk: 'Тіньовий сектор: чому не формалізуються', en: 'Shadow Sector: Why They Won\'t Formalize' }, icon: 'EyeOff' },
  { id: 'inputs', title: { uk: 'Що зроблено — і чому це не працює', en: 'What Was Done — And Why It Doesn\'t Work' }, icon: 'Scale' },
  { id: 'children', title: { uk: "Діти: окрема криза", en: "Children: A Separate Crisis" }, icon: 'Smile' },
  { id: 'economic', title: { uk: "Регіональний розподіл та економічний тягар", en: 'Regional Distribution & Economic Burden' }, icon: 'Map' },
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
  { name: l === 'uk' ? 'Приватний (тіньовий)' : 'Private (shadow)', value: 15000, fill: COLORS.gray },
];

export const BUDGET_SPLIT_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Стаціонар (89%)' : 'Inpatient (89%)', value: 89, fill: COLORS.red },
  { name: l === 'uk' ? 'Амбулаторія (11%)' : 'Outpatient (11%)', value: 11, fill: COLORS.green },
];

export const DONOR_DATA = (l: Language) => [
  { name: l === 'uk' ? 'HEAL (WB IPF)' : 'HEAL (WB IPF)', value: 500, fill: COLORS.blue },
  { name: l === 'uk' ? 'THRIVE (WB PforR)' : 'THRIVE (WB PforR)', value: 454, fill: COLORS.teal },
  { name: l === 'uk' ? 'ЄС (виділено)' : 'EU (allocated)', value: 140, fill: COLORS.blueLight },
  { name: 'UNICEF HAC', value: 633.6, fill: COLORS.green },
  { name: l === 'uk' ? 'Ветерани (держ.)' : 'Veterans (gov)', value: 60, fill: COLORS.orange },
  { name: 'USAID (Chemonics)', value: 15, fill: COLORS.red },
];

export const GAP_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Потребують підтримки (МОЗ)' : 'Need support (MOH)', need: 15, reached: 0 },
  { name: l === 'uk' ? 'Потребують лікування' : 'Need treatment', need: 3.9, reached: 0 },
  { name: l === 'uk' ? 'HEAL MH послуги' : 'HEAL MH services', need: 0, reached: 0.624 },
  { name: l === 'uk' ? 'HEAL реабілітація' : 'HEAL rehabilitation', need: 0, reached: 0.670 },
  { name: l === 'uk' ? 'AMP MH ліки (e-рецепти)' : 'AMP MH meds (e-prescriptions)', need: 0, reached: 0.147 },
  { name: l === 'uk' ? 'ВООЗ консультації' : 'WHO consultations', need: 0, reached: 0.08 },
  { name: l === 'uk' ? 'ЮНІСЕФ охоплення' : 'UNICEF reach', need: 0, reached: 0.76 },
];

// CORRECTED: Gradus Research 2024, verified
export const BARRIERS_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Не серйозно (Gradus)' : 'Not serious enough (Gradus)', value: 29, fill: COLORS.red },
  { name: l === 'uk' ? 'Впораюсь сам' : 'Can cope alone', value: 25, fill: COLORS.orange },
  { name: l === 'uk' ? 'Занадто дорого' : 'Too expensive', value: 23, fill: COLORS.purple },
  { name: l === 'uk' ? 'Іншим потрібніше' : 'Others need it more', value: 22, fill: COLORS.blue },
  { name: l === 'uk' ? 'Сумніви в ефективності' : 'Doubt effectiveness', value: 20, fill: COLORS.gray },
];

// CORRECTED: formalization economics with opportunity cost
export const SHADOW_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Повністю тіньові (до 2024)' : 'Fully shadow (pre-2024)', value: 10, fill: COLORS.red },
  { name: l === 'uk' ? 'ФОП без серт.' : 'Reg. sole prop. w/o cert.', value: 35, fill: COLORS.orange },
  { name: l === 'uk' ? 'Добровільна серт. (2024–31)' : 'Voluntary cert. (2024–31)', value: 70, fill: COLORS.blueLight },
  { name: l === 'uk' ? "Обов'язкова (>2031)" : 'Mandatory (>2031)', value: 100, fill: COLORS.green },
];

// NEW: Formalization cost breakdown
export const FORMALIZATION_COST = (l: Language) => [
  { name: l === 'uk' ? 'Податок ФОП 5%' : 'Sole prop tax 5%', value: 75, fill: COLORS.red },
  { name: l === 'uk' ? 'ЄСВ (мінімум)' : 'ESV (minimum)', value: 32, fill: COLORS.orange },
  { name: l === 'uk' ? 'Бухгалтерія' : 'Accounting', value: 100, fill: COLORS.purple },
  { name: l === 'uk' ? 'Втрачені години (opportunity cost)' : 'Lost hours (opportunity cost)', value: 958, fill: COLORS.navy },
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
  { name: l === 'uk' ? "Збитки здоров'ю" : 'Health system damage', value: 26, fill: COLORS.navy },
];

export const CHILDREN_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Діти з МЗПСП' : 'Children MHPSS', value: 757.8, fill: COLORS.blue },
  { name: l === 'uk' ? 'Опікуни з МЗПСП' : 'Caregivers MHPSS', value: 998.0, fill: COLORS.teal },
  { name: l === 'uk' ? 'Спец. допомога' : 'Specialized care', value: 126, fill: COLORS.purple },
  { name: l === 'uk' ? 'Біженці' : 'Refugees', value: 1200, fill: COLORS.orange },
];

export const MHGAP_FUNNEL_DATA = (l: Language) => [
  { name: l === 'uk' ? 'Онлайн-сертифікати' : 'Online certificates', value: 96000, fill: COLORS.blueLight },
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

// --- NEW: World Bank Projects Data ---

export const HEAL_KPI_DATA = (l: Language) => [
  { name: l === 'uk' ? 'MH послуги' : 'MH Services', target: 500000, actual: 624464, pct: 125, status: 'exceeded' },
  { name: l === 'uk' ? 'Реабілітація' : 'Rehabilitation', target: 312500, actual: 670303, pct: 214, status: 'exceeded' },
  { name: l === 'uk' ? 'PHC обстеження' : 'PHC Examinations', target: 3500000, actual: 10388635, pct: 297, status: 'exceeded' },
  { name: l === 'uk' ? 'Мобільні MH команди' : 'Mobile MH Teams', target: 75, actual: 118, pct: 157, status: 'exceeded' },
  { name: l === 'uk' ? 'Заклади реконфіг. MH' : 'Facilities Reconfig. MH', target: 400, actual: 0, pct: 0, status: 'critical' },
  { name: l === 'uk' ? 'PHC навчені (GBV)' : 'PHC Trained (GBV)', target: 3000, actual: 5288, pct: 176, status: 'exceeded' },
  { name: l === 'uk' ? 'AMP (Доступні ліки)' : 'AMP (Affordable Meds)', target: 4767838, actual: 5502976, pct: 115, status: 'exceeded' },
];

export const HEAL_COMPONENTS = (l: Language) => [
  { name: l === 'uk' ? 'Комп.1: MH + Реабілітація' : 'Comp.1: MH + Rehabilitation', value: 100, fill: COLORS.blue },
  { name: l === 'uk' ? 'Комп.2: Первинна медицина' : 'Comp.2: Primary Care', value: 150, fill: COLORS.green },
  { name: l === 'uk' ? 'Комп.3: Модернізація лікарень' : 'Comp.3: Hospital Modernization', value: 200, fill: COLORS.orange },
  { name: l === 'uk' ? 'Комп.4: Дигіталізація' : 'Comp.4: Digitalization', value: 50, fill: COLORS.gold },
];

export const COMPONENT4_SPENDING = (l: Language) => [
  { name: l === 'uk' ? 'Кібербезпека' : 'Cybersecurity', value: 2569, fill: COLORS.red },
  { name: 'SAP/ERP (Enkidu/МПУ)', value: 1222, fill: COLORS.purple },
  { name: l === 'uk' ? 'Обладнання' : 'Hardware', value: 1474, fill: COLORS.blue },
  { name: l === 'uk' ? 'МІС (Helsi, Dr.Eleks)' : 'MIS (Helsi, Dr.Eleks)', value: 163, fill: COLORS.teal },
  { name: l === 'uk' ? 'Інше (ліфт, токени, генератори)' : 'Other (elevator, tokens, generators)', value: 617, fill: COLORS.gray },
  { name: l === 'uk' ? 'Контакт-центр МОЗ' : 'MOH Contact Center', value: 333, fill: COLORS.orange },
  { name: l === 'uk' ? 'НЕ ВИТРАЧЕНО' : 'UNSPENT', value: 41100, fill: COLORS.gold },
];

export const AMP_MH_DATA = (l: Language) => [
  { name: l === 'uk' ? 'e-Рецепти MH (4 міс. 2025)' : 'MH e-Prescriptions (4mo 2025)', value: 147000, fill: COLORS.blue },
  { name: l === 'uk' ? 'Загальний обсяг AMP' : 'Total AMP Coverage', value: 5500000, fill: COLORS.green },
  { name: l === 'uk' ? 'MH МНН (International Names)' : 'MH INNs (International Names)', value: 20, fill: COLORS.purple },
  { name: l === 'uk' ? 'Торгові назви MH' : 'MH Trade Names', value: 132, fill: COLORS.orange },
];

// --- NEW: Perfect Storm Data ---

export const PERFECT_STORM_METRICS = (l: Language) => [
  {
    label: l === 'uk' ? 'Клінічна потреба' : 'Clinical Need',
    value: '62.4M',
    unit: l === 'uk' ? 'годин' : 'hours',
    formula: '3,900,000 × 16 sessions',
    color: COLORS.red
  },
  {
    label: l === 'uk' ? 'Ринкова вартість' : 'Market Value',
    value: '€2.5–4.1B',
    unit: l === 'uk' ? '($2.7–4.4B)' : '($2.7–4.4B)',
    formula: '62.4M × €40–65/hr',
    color: COLORS.gold
  },
  {
    label: l === 'uk' ? 'Глобальний рейтинг' : 'Global Ranking',
    value: '~15th',
    unit: l === 'uk' ? 'за потенціалом MH ринку' : 'MH market by potential',
    formula: '$3.5B potential',
    color: COLORS.purple
  },
  {
    label: l === 'uk' ? 'Aftershock (кумулятивний)' : 'Aftershock (cumulative)',
    value: '6.72M',
    unit: l === 'uk' ? 'людей, 107.5M годин' : 'people, 107.5M hours',
    formula: l === 'uk' ? '€5.4B, бекlog 21.5 років' : '€5.4B, backlog 21.5 years',
    color: COLORS.navy
  },
];

export const STRUCTURAL_RATIOS = (l: Language) => [
  { name: l === 'uk' ? 'Приватний / Гуманітарний дохід' : 'Private / Humanitarian income', value: 110, unit: '×', fill: COLORS.red },
  { name: l === 'uk' ? 'Дефіцит mhGAP навчання' : 'mhGAP training deficit', value: 42, unit: '×', fill: COLORS.orange },
  { name: l === 'uk' ? 'Адмін. gap (ВООЗ рекомендація)' : 'Admin gap (WHO recommendation)', value: 3.1, unit: '×', fill: COLORS.purple },
  { name: l === 'uk' ? 'Бюджет стаціонар / амбулаторія' : 'Inpatient / Outpatient budget', value: 8.1, unit: '×', fill: COLORS.blue },
];

export const BACKLOG_SCENARIOS = (l: Language) => [
  { name: l === 'uk' ? '4,000 (зареєстровані)' : '4,000 (registered)', sustainable: 10.4, theoretical: 7.8, fill: COLORS.red },
  { name: l === 'uk' ? '8,000 (подвоєно)' : '8,000 (doubled)', sustainable: 5.2, theoretical: 3.9, fill: COLORS.orange },
  { name: l === 'uk' ? '19,000 (макс + тінь)' : '19,000 (max + shadow)', sustainable: 2.2, theoretical: 1.6, fill: COLORS.green },
];

// --- International MH Market Benchmarks ---

export const INTL_MH_BENCHMARKS = (l: Language) => [
  { name: l === 'uk' ? 'Глобальний ринок MH (2030 прогноз)' : 'Global MH Market (2030 est.)', value: 537, fill: COLORS.gray, unit: '$B' },
  { name: l === 'uk' ? 'Великобританія' : 'United Kingdom', value: 19.2, fill: COLORS.blue, unit: '£B' },
  { name: l === 'uk' ? 'Німеччина' : 'Germany', value: 10, fill: COLORS.green, unit: '€B' },
  { name: l === 'uk' ? 'Польща' : 'Poland', value: 1.2, fill: COLORS.orange, unit: '€B' },
  { name: l === 'uk' ? 'Україна (потенціал)' : 'Ukraine (potential)', value: 3.5, fill: COLORS.gold, unit: '$B' },
];

export const SECTOR_FUNDING_COMPARISON = (l: Language) => [
  { name: l === 'uk' ? 'Приватний сектор (тіньовий)' : 'Private Sector (shadow)', value: 900, fill: COLORS.gray, note: l === 'uk' ? '~15K фахівців × €5K/міс' : '~15K providers × €5K/mo' },
  { name: l === 'uk' ? 'Державний бюджет MH (2.5%)' : 'Gov MH Budget (2.5%)', value: 155, fill: COLORS.blue, note: l === 'uk' ? '₴6.47B ≈ $155M' : '₴6.47B ≈ $155M' },
  { name: l === 'uk' ? 'Гуманітарна допомога' : 'Humanitarian Aid', value: 180, fill: COLORS.green, note: l === 'uk' ? 'Health Cluster MH ~$180M/рік' : 'Health Cluster MH ~$180M/yr' },
  { name: l === 'uk' ? 'HEAL + THRIVE (WB)' : 'HEAL + THRIVE (WB)', value: 954, fill: COLORS.gold, note: l === 'uk' ? '$954M за 4 роки = ~$238M/рік' : '$954M over 4 years = ~$238M/yr' },
];

// --- Executive Digest ---

export const EXECUTIVE_DIGEST = (l: Language) => [
  {
    id: 'crisis-scale',
    icon: '⚡',
    title: l === 'uk' ? '62.4 мільйони клінічних годин' : '62.4 million clinical hours',
    text: l === 'uk' ? '3.9M людей потребують лікування × 16 сесій. Ринок €2.5-4.1B. Навіть при 19K фахівців (макс) — бекlog 1.6-2.2 року.' : '3.9M people need treatment × 16 sessions. Market €2.5-4.1B. Even at 19K professionals (max) — 1.6-2.2yr backlog.',
    section: 'perfectstorm',
    color: COLORS.red,
  },
  {
    id: 'wb-blind-spot',
    icon: '🏦',
    title: l === 'uk' ? '$954M інвестицій без feedback loop' : '$954M invested without feedback loop',
    text: l === 'uk' ? '624K MH-послуг (HEAL) надано через CommCare/Kobo — 0% в ЕСОЗ. THRIVE вимірює лише через ЕСОЗ. Middleware gap = інвестиції без доказів.' : '624K MH services (HEAL) delivered via CommCare/Kobo — 0% in ESOZ. THRIVE measures only via ESOZ. Middleware gap = investment without evidence.',
    section: 'worldbank',
    color: COLORS.gold,
  },
  {
    id: 'shadow-trap',
    icon: '👤',
    title: l === 'uk' ? '15K фахівців в тіні — 65% штраф за формалізацію' : '15K professionals in shadow — 65% penalty for formalizing',
    text: l === 'uk' ? 'Формалізація коштує €979/міс. Тіньовий нетто €1,500 → формальний €521. Без платформи яка знижує friction — ніхто не вийде з тіні добровільно.' : 'Formalization costs €979/mo. Shadow net €1,500 → formal €521. Without a friction-reducing platform — nobody will formalize voluntarily.',
    section: 'shadow',
    color: COLORS.purple,
  },
  {
    id: 'budget-inversion',
    icon: '💰',
    title: l === 'uk' ? '89% бюджету — стаціонар, де лікують 11% випадків' : '89% budget to inpatient care, treating 11% of cases',
    text: l === 'uk' ? '2.5% бюджету здоров\'я на MH. З цих 2.5% — 89% на стаціонари. 64-71% пацієнтів звертаються амбулаторно. Бюджет дзеркально протилежний потребам.' : '2.5% of health budget to MH. Of that 2.5% — 89% to inpatient. 64-71% patients seek outpatient care. Budget mirrors the opposite of needs.',
    section: 'budget',
    color: COLORS.orange,
  },
  {
    id: 'training-funnel',
    icon: '📉',
    title: l === 'uk' ? '96,000 сертифікатів → 42 практикуючих' : '96,000 certificates → 42 practicing',
    text: l === 'uk' ? 'mhGAP: 96K онлайн-сертифікатів, 700 очне навчання, 42 задокументовано практикуючих. Конверсія <0.1%. Тренінги не масштабуються.' : 'mhGAP: 96K online certificates, 700 in-person trained, 42 documented practicing. Conversion <0.1%. Training doesn\'t scale.',
    section: 'inputs',
    color: COLORS.red,
  },
];

// --- Section Conclusions ---

export const SECTION_CONCLUSIONS = (l: Language): Record<string, { summary: string; detail: string }> => ({
  perfectstorm: {
    summary: l === 'uk' ? 'Масштаб кризи перевищує будь-яку здатність сектору реагувати тренінгами або проєктами. Потрібна інфраструктура — рейки, а не потяги.' : 'Crisis scale exceeds any sector capacity to respond with training or projects. Infrastructure needed — rails, not trains.',
    detail: l === 'uk' ? '62.4M клінічних годин при 4K фахівців = 7.8-12 років бекlogу. Навіть якщо подвоїти кількість (що нереалістично за 5 років) — 3.9-5.2 роки. Aftershock (кумулятивний ефект) додає ще 107.5M годин. Єдиний спосіб масштабувати — автоматизація адміністративного тягаря (250 год/рік на фахівця) і інтеграція розрізнених систем через middleware.' : '62.4M clinical hours at 4K professionals = 7.8-12yr backlog. Even doubling (unrealistic in 5 years) — 3.9-5.2 years. Aftershock adds 107.5M hours. Only way to scale — automate admin burden (250 hrs/yr per provider) and integrate fragmented systems via middleware.',
  },
  prevalence: {
    summary: l === 'uk' ? '44% депресія, 25% ПТСР, 23% тривожність — і це лише клінічно виражені. 3.9M потребують лікування зараз.' : '44% depression, 25% PTSD, 23% anxiety — and that\'s only clinically significant. 3.9M need treatment now.',
    detail: l === 'uk' ? 'Дані Lancet 2023 / PMC 2024 показують стабільно високий рівень поширеності. Жінки (39%) та біженці (35%) — найвразливіші. 50% підлітків 13-15 років мають порушення сну. Це не тимчасова проблема — це нова демографічна реальність.' : 'Lancet 2023 / PMC 2024 data shows consistently high prevalence. Women (39%) and refugees (35%) most vulnerable. 50% of 13-15 year olds have sleep disorders. Not temporary — this is the new demographic reality.',
  },
  workforce: {
    summary: l === 'uk' ? '1.3 психолога на 100K (WHO рекомендує 6.5). 23% кадрів втрачено через війну. 15K в тіні — невидимі для системи.' : '1.3 psychologists per 100K (WHO recommends 6.5). 23% of staff lost to war. 15K in shadow — invisible to system.',
    detail: l === 'uk' ? 'Навіть з тіньовим сектором = 19K максимум. На 62.4M годин це 1.6-2.2 року (теор. стеля). Але при sustainable rate 1,500 год/рік — 2.2 роки. Психіатри впали з 40 до 30.9 на заклад (-23%). Соцпрацівники — з 17.78 до 14.82 (-17%).' : 'Even with shadow sector = 19K max. For 62.4M hours that\'s 1.6-2.2 years (theoretical ceiling). But at sustainable 1,500 hrs/yr — 2.2 years. Psychiatrists fell from 40 to 30.9 per facility (-23%). Social workers from 17.78 to 14.82 (-17%).',
  },
  budget: {
    summary: l === 'uk' ? '₴6.47B на MH (2.5% від здоров\'я). 89% стаціонар. HEAL+THRIVE ($954M) — більше ніж увесь держбюджет на 4 роки.' : '₴6.47B for MH (2.5% of health). 89% inpatient. HEAL+THRIVE ($954M) exceeds entire state budget for 4 years.',
    detail: l === 'uk' ? 'Міжнародне фінансування фактично замінює державний бюджет в MH секторі. HEAL $500M + THRIVE $454M + UNICEF $633M + EU $140M = >$1.7B. Державний бюджет $155M/рік. Приватний (тіньовий) сектор — ще ~$900M/рік. Проблема: ці потоки не інтегровані.' : 'International funding effectively replaces state MH budget. HEAL $500M + THRIVE $454M + UNICEF $633M + EU $140M = >$1.7B. State budget $155M/yr. Private (shadow) ~$900M/yr. Problem: these flows aren\'t integrated.',
  },
  worldbank: {
    summary: l === 'uk' ? '624K послуг надано, але 0% в ЕСОЗ. 0/400 закладів реконфігуровані. $41M з Component 4 не витрачені — вікно можливостей.' : '624K services delivered but 0% in ESOZ. 0/400 facilities reconfigured. $41M of Component 4 unspent — opportunity window.',
    detail: l === 'uk' ? 'HEAL фінансує послуги → дані в CommCare/Kobo. THRIVE вимірює результати → читає з ЕСОЗ. Gap: HEAL outputs ≠ THRIVE inputs. AMP MH (147K e-рецептів) — єдиний MH потік, вже в ЕСОЗ. Це proof of concept: коли дані в ЕСОЗ — вони видимі для THRIVE DLI.' : 'HEAL funds services → data in CommCare/Kobo. THRIVE measures results → reads from ESOZ. Gap: HEAL outputs ≠ THRIVE inputs. AMP MH (147K e-prescriptions) — only MH flow already in ESOZ. This is proof of concept: when data is in ESOZ — it\'s visible to THRIVE DLI.',
  },
  gap: {
    summary: l === 'uk' ? '54% визнають потребу але не шукають допомогу. Головний бар\'єр — «не серйозно» (29%), не ціна (23%).' : '54% acknowledge need but don\'t seek help. Main barrier — "not serious" (29%), not cost (23%).',
    detail: l === 'uk' ? 'Gradus 2024: 71% визнають потребу, 17% шукають допомогу. Gap = 54%. Це стигма + відсутність зрозумілого каналу входу. AMP MH (85% використання e-рецептів) показує: коли канал простий — люди користуються.' : 'Gradus 2024: 71% acknowledge need, 17% seek help. Gap = 54%. This is stigma + lack of clear entry channel. AMP MH (85% e-prescription redemption) shows: when the channel is simple — people use it.',
  },
  shadow: {
    summary: l === 'uk' ? '€979/міс penalty = 65% від доходу. Закон 4223-IX дає час до 2031, але без зниження friction формалізація не відбудеться.' : '€979/mo penalty = 65% of income. Law 4223-IX gives until 2031, but without reducing friction, formalization won\'t happen.',
    detail: l === 'uk' ? 'Прямі витрати (ФОП 5% + ЄСВ + бухгалтерія) = €207/міс. Opportunity cost (250 год/рік × €46) = €958/міс. Разом €979-1,165/міс. Нетто падає з €1,500 до €521. Це раціональна поведінка, а не девіація. Платформа FEEL Again може знизити адмін. витрати до €50-80/міс через автоматизацію звітності.' : 'Direct costs (sole prop 5% + ESV + accounting) = €207/mo. Opportunity cost (250 hrs/yr × €46) = €958/mo. Total €979-1,165/mo. Net drops from €1,500 to €521. This is rational behavior, not deviance. FEEL Again platform can reduce admin costs to €50-80/mo via reporting automation.',
  },
  inputs: {
    summary: l === 'uk' ? '96K сертифікатів → 42 практикуючих (<0.1%). 624K послуг → 0% в системі обліку. Тренінги без інфраструктури = вода в пісок.' : '96K certificates → 42 practicing (<0.1%). 624K services → 0% in tracking system. Training without infrastructure = water into sand.',
    detail: l === 'uk' ? 'mhGAP funnel: 96K → 19K лікарів → 1,000 закладів → 700 очне → 42 задокументовано. AMP MH — єдиний протилежний приклад: інтеграція з ЕСОЗ → 147K e-рецептів → 85% використано. Різниця: інфраструктура, а не мотивація.' : 'mhGAP funnel: 96K → 19K doctors → 1,000 facilities → 700 in-person → 42 documented. AMP MH — the only counter-example: ESOZ integration → 147K e-prescriptions → 85% redeemed. The difference: infrastructure, not motivation.',
  },
});

// --- Enhanced Existing Data ---

export const FUNDING_VS_REACH_DATA = [
  { name: 'WHO', funding: 154, reach: 82, category: 'Clinical' },
  { name: 'UNICEF', funding: 633, reach: 757, category: 'Psychosocial' },
  { name: 'USAID', funding: 15, reach: 12, category: 'Infrastructure' },
  { name: 'EU', funding: 140, reach: 45, category: 'Systemic' },
  { name: 'Red Cross', funding: 45, reach: 120, category: 'Emergency' },
  { name: 'Save Children', funding: 32, reach: 88, category: 'Children' },
  { name: 'HEAL (WB)', funding: 500, reach: 624, category: 'MH+Rehab+PHC' },
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
  { year: '2024', text: l.uk === 'uk' ? 'Підписано Закон 4223-IX про сертифікацію психологів та психотерапевтів. Створення реєстру постачальників послуг.' : 'Law 4223-IX signed for certification of psychologists & psychotherapists. Provider registry being created.', color: COLORS.orange },
  { year: '07.02.2026', text: l.uk === 'uk' ? 'Закон 4223-IX набирає чинності. Перехідний період: сертифікація добровільна. Створення саморегулівних організацій.' : 'Law 4223-IX enters into force. Transition period: certification voluntary. Self-regulatory organizations being created.', color: COLORS.gold },
  { year: '2024–2031', text: l.uk === 'uk' ? 'Перехідний період: сертифікація добровільна. Вимоги: вища освіта, курс з психічних розладів, підвищення кваліфікації.' : 'Transition period: certification voluntary. Requirements: higher education, course on mental disorders, professional development.', color: COLORS.blueLight },
  { year: l.uk === 'uk' ? 'Після 2031' : 'Post-2031', text: l.uk === 'uk' ? "Сертифікація стає обов'язковою. Саморегулівні організації для психотерапевтів." : 'Certification becomes mandatory. Self-regulatory organizations for psychotherapists.', color: COLORS.green },
];

export const ADMIN_BURDEN = (l: Language) => [
    { title: l === 'uk' ? 'Вартість формалізації: €979/міс (65%)' : 'Formalization cost: €979/mo (65%)', desc: l === 'uk' ? 'Прямі витрати (ФОП 5% + ЄСВ + бухгалтерія = €207/міс) + opportunity cost (250 год/рік × €46 = €958/міс). Тіньовий нетто: €1,500/міс. Формальний нетто: €521/міс.' : 'Direct costs (sole prop 5% + ESV + accounting = €207/mo) + opportunity cost (250 hrs/yr × €46 = €958/mo). Shadow net: €1,500/mo. Formal net: €521/mo.', severity: l === 'uk' ? 'Критичний' : 'Critical', color: 'red', source: l === 'uk' ? 'Розрахунок v3' : 'Calculated v3' },
    { title: l === 'uk' ? 'Застарілі системи документообігу' : 'Outdated documentation systems', desc: l === 'uk' ? "ВООЗ фіксує обмежену інтеграцію з електронним здоров'ям та паперовий документообіг" : "WHO documents limited eHealth integration and paper-based recordkeeping", severity: l === 'uk' ? 'Високий' : 'High', color: 'red', source: 'WHO SIMH 2024' },
    { title: l === 'uk' ? 'Вигорання: 2,000 год/рік = стеля' : 'Burnout: 2,000 hrs/yr = ceiling', desc: l === 'uk' ? 'Sustainable rate = 5-6 год клієнтської роботи/день = 1,250-1,500 год/рік. При 8 год/день — вигорання за 1-2 роки.' : 'Sustainable rate = 5-6 client hrs/day = 1,250-1,500 hrs/yr. At 8 hrs/day — burnout within 1-2 years.', severity: l === 'uk' ? 'Високий' : 'High', color: 'orange', source: l === 'uk' ? 'Клінічна практика' : 'Clinical practice' },
    { title: l === 'uk' ? 'Навантаження на фахівця' : 'Caseload per specialist', desc: l === 'uk' ? '1 психолог на 400-500 військовослужбовців (ЗСУ). У цивільному секторі — дані не збираються.' : '1 psychologist per 400-500 military personnel (AFU). Civilian sector — data not collected.', severity: l === 'uk' ? 'Критичний' : 'Critical', color: 'red', source: l === 'uk' ? 'ЗСУ / Відкриті дані' : 'AFU / Open data' },
    { title: l === 'uk' ? 'Кількість годин на адмінроботу' : 'Admin hours per week', desc: l === 'uk' ? '25% робочого часу = 250 год/рік (при 1,000 год/рік загальних). ДАНІ КОНКРЕТНИХ ДОСЛІДЖЕНЬ ВІДСУТНІ.' : '25% of working time = 250 hrs/yr (of 1,000 total hrs/yr). NO SPECIFIC STUDY DATA AVAILABLE.', severity: l === 'uk' ? 'Дефіцит даних' : 'Data gap', color: 'gray', source: l === 'uk' ? 'Оцінка / Аналіз' : 'Estimate / Analysis' },
];

export const COORD_ITEMS = (l: Language) => [
    { title: l === 'uk' ? '«ТИ ЯК» — Всеукраїнська програма' : '"TI YAK" — National MH Program', desc: l === 'uk' ? 'Ініціатива першої леді. Координаційний центр створено постановою КМУ від 30.03.2023. Бюджет програми публічно не розкритий.' : 'First Lady initiative. Coordination Center created by CMU resolution 30.03.2023. Program budget not publicly disclosed.', status: l === 'uk' ? 'Комплементарність' : 'Complementarity', color: 'orange' },
    { title: l === 'uk' ? 'MHPSS TWG (ВООЗ + IMC)' : 'MHPSS TWG (WHO + IMC)', desc: l === 'uk' ? '450+ організацій-учасників, збори 2 рази на тиждень, 3 регіональних хаби, 4 task teams. Ручна координація.' : '450+ member organizations, meetings 2x/week, 3 regional hubs, 4 task teams. Manual coordination.', status: l === 'uk' ? 'Координація є' : 'Coordination exists', color: 'blue' },
    { title: l === 'uk' ? 'HEAL Component 4 ($50M дигіталізація)' : 'HEAL Component 4 ($50M digitalization)', desc: l === 'uk' ? '$50M бюджет, витрачено ~$8.9M (кібербезпека, hardware, MIS для окремих закладів). $41M не розподілені. 0/400 закладів реконфігуровані для MH. Middleware gap.' : '$50M budget, ~$8.9M spent (cybersecurity, hardware, MIS for individual facilities). $41M unallocated. 0/400 facilities reconfigured for MH. Middleware gap.', status: l === 'uk' ? 'ВІКНО МОЖЛИВОСТЕЙ' : 'OPPORTUNITY WINDOW', color: 'gold' },
    { title: l === 'uk' ? 'Закон 4223-IX (чинний з 07.02.2026)' : 'Law 4223-IX (effective 07.02.2026)', desc: l === 'uk' ? 'Система психічного здоров\'я: саморегулівні організації, сертифікація, реєстр. Перехідний період до 2031. NBU SEP (01.01.2024): ISO 20022, SEPA, <10 сек.' : 'Mental health system law: self-regulatory organizations, certification, registry. Transition until 2031. NBU SEP (01.01.2024): ISO 20022, SEPA, <10 sec.', status: l === 'uk' ? 'Регуляторна рамка' : 'Regulatory framework', color: 'green' },
];

export const REACH_TABLE_DATA = (l: Language) => [
    [l === 'uk' ? 'HEAL MH послуги (WB ISR #6)' : 'HEAL MH services (WB ISR #6)', '624,464', l === 'uk' ? 'Світовий Банк' : 'World Bank', 'Aug 2025'],
    [l === 'uk' ? 'HEAL реабілітація' : 'HEAL rehabilitation', '670,303', l === 'uk' ? 'Світовий Банк' : 'World Bank', 'Aug 2025'],
    [l === 'uk' ? 'AMP MH e-рецепти (4 міс.)' : 'AMP MH e-prescriptions (4mo)', '147,000', l === 'uk' ? 'НСЗУ / UNN' : 'NHSU / UNN', '2025'],
    [l === 'uk' ? 'PHC розширені обстеження' : 'PHC extended examinations', '10,388,635', l === 'uk' ? 'Світовий Банк' : 'World Bank', 'Aug 2025'],
    [l === 'uk' ? 'Консультації з МЗ' : 'MH consultations', '80,000+', l === 'uk' ? 'ВООЗ' : 'WHO', '02.2022–2024'],
    [l === 'uk' ? 'Діти, опікуни, фронтлайн' : 'Children, caregivers, frontline', '757,807', 'UNICEF', '2024'],
    [l === 'uk' ? 'Діти з доступом до МЗПСП' : 'Children with MHPSS access', '3,400,000+', 'UNICEF', '2022–2024'],
    [l === 'uk' ? 'Навчені «фахівці МЗПСП»' : 'Trained "MHPSS professionals"', '38,000+', 'UNICEF', '2023'],
    [l === 'uk' ? 'Очне навчення + 6 міс. супервізія' : 'In-person training + 6mo supervision', '700', l === 'uk' ? 'ВООЗ mhGAP' : 'WHO mhGAP', '2019–2022'],
    [l === 'uk' ? 'Онлайн-сертифікати (self-paced)' : 'Online certificates (self-paced)', '96,000', l === 'uk' ? 'ВООЗ mhGAP' : 'WHO mhGAP', l === 'uk' ? 'до серп. 2024' : 'to Aug 2024'],
    [l === 'uk' ? 'Заклади з пакетом МЗ' : 'Facilities with MH package', '~1,000', 'НСЗУ/NHSU', l === 'uk' ? 'сер. 2024' : 'mid-2024'],
    [l === 'uk' ? 'Кваліфіковані спеціалісти' : 'Qualified specialists', '8,201', l === 'uk' ? 'Держава' : 'Government', '2024'],
    [l === 'uk' ? 'Реально практикують МЗ' : 'Actually practicing MH', '42', 'PMC 2020', '2020'],
];

export const INPUTS_OUTCOMES_DATA = (l: Language) => [
    { input: l === 'uk' ? 'HEAL MH послуги' : 'HEAL MH services', val: '624,464', status: l === 'uk' ? '~0% В ЕСОЗ' : '~0% IN ESOZ', out: l === 'uk' ? 'Мобільні команди працюють в CommCare/Kobo — дані не в ЕСОЗ' : 'Mobile teams use CommCare/Kobo — data not in ESOZ', statusColor: 'red', tooltip: l === 'uk' ? 'WB ISR #6: 624K осіб отримали MH послуги, але 118 мобільних команд збирають дані в гуманітарних системах, НЕ в ЕСОЗ. THRIVE ($454M PforR) вимірює через ЕСОЗ — ці послуги невидимі.' : 'WB ISR #6: 624K received MH services, but 118 mobile teams collect data in humanitarian systems, NOT ESOZ. THRIVE ($454M PforR) measures via ESOZ — these services are invisible.' },
    { input: l === 'uk' ? 'mhGAP онлайн-сертифікати' : 'mhGAP online certificates', val: '96,000', status: l === 'uk' ? 'НЕ ВИМІРЮЄТЬСЯ' : 'NOT MEASURED', out: l === 'uk' ? 'Скільки лікарів реально надають МЗ-послуги?' : 'How many doctors actually deliver MH services?', statusColor: 'red', tooltip: l === 'uk' ? 'Кількість виданих сертифікатів не відображає реальну кількість лікарів, які надають послуги.' : 'The number of issued certificates does not reflect the actual number of doctors providing services.' },
    { input: l === 'uk' ? 'mhGAP очне навчання' : 'mhGAP in-person training', val: '700', status: '42 (6%)', out: l === 'uk' ? 'Задокументовано практикуючих (PMC 2020)' : 'Documented practicing (PMC 2020)', statusColor: 'red', tooltip: l === 'uk' ? 'Лише 6% від навчених очно задокументовано надають послуги.' : 'Only 6% of in-person trained are documented as providing services.' },
    { input: l === 'uk' ? 'AMP MH медикаменти' : 'AMP MH medications', val: '147,000', status: l === 'uk' ? 'В ЕСОЗ ✓' : 'IN ESOZ ✓', out: l === 'uk' ? 'e-Рецепти через НСЗУ/ЕСОЗ — єдиний MH потік, що вже інтегрований' : 'e-Prescriptions via NHSU/ESOZ — only MH flow already integrated', statusColor: 'green', tooltip: l === 'uk' ? '147K e-рецептів за 4 міс. 2025. 20 МНН, 132 торгові назви. 85% використано. Працює через ЕСОЗ.' : '147K e-prescriptions in 4mo 2025. 20 INNs, 132 trade names. 85% redeemed. Works via ESOZ.' },
    { input: l === 'uk' ? 'UNICEF «навчені фахівці»' : 'UNICEF "trained professionals"', val: '38,000', status: l === 'uk' ? 'НЕ ВИМІРЮЄТЬСЯ' : 'NOT MEASURED', out: l === 'uk' ? 'Скільки надають клінічну допомогу?' : 'How many provide clinical care?', statusColor: 'red', tooltip: l === 'uk' ? 'Відсутні дані щодо клінічної допомоги.' : 'No data on clinical care delivery.' },
    { input: l === 'uk' ? 'Заклади реконфіг. для MH' : 'Facilities reconfigured for MH', val: '0 / 400', status: l === 'uk' ? 'НЕ РОЗПОЧАТО' : 'NOT STARTED', out: l === 'uk' ? 'HEAL Component 1 KPI — 0% виконання за 2.5 року' : 'HEAL Component 1 KPI — 0% in 2.5 years', statusColor: 'red', tooltip: l === 'uk' ? 'WB ISR #6: target 400, actual 0. Це при тому, що MH послуги перевиконані (624K vs 500K). Інфраструктура відстає від обсягу послуг.' : 'WB ISR #6: target 400, actual 0. While MH services exceeded (624K vs 500K). Infrastructure lags behind service volume.' },
];

export const SOURCES = {
    primary: [
        { name: 'World Bank HEAL Ukraine ISR #6 (P180245, Sep 2025)', url: 'https://documents.worldbank.org/en/publication/documents-reports/documentdetail/099092025154039038' },
        { name: 'World Bank THRIVE Press Release (Dec 2024)', url: 'https://www.worldbank.org/en/news/press-release/2024/12/09/ukraine-health-sector-to-strengthen-with-world-bank-support' },
        { name: 'Gradus Research — Stigma Survey 2024', url: 'https://gradus.app' },
        { name: 'Ukrainska Pravda — 71% need, 17% seek help', url: 'https://life.pravda.com.ua' },
        { name: 'NHSU AMP Mental Health e-Prescriptions (UNN 2025)', url: 'https://unn.ua/en/news/in-ukraine-a-six-month-volume-of-e-prescriptions-for-mental-health-medications-was-issued-in-4-months' },
        { name: 'WHO Special Initiative for Mental Health (SIMH) 2024', url: 'https://www.who.int/publications/m/item/special-initiative-for-mental-health-ukraine' },
        { name: 'World Bank Ukraine Economic Update 2025', url: 'https://www.worldbank.org/en/country/ukraine/publication/ukraine-economic-update' },
        { name: 'OCHA Humanitarian Needs Overview Ukraine 2025', url: 'https://www.unocha.org/publications/report/ukraine/ukraine-humanitarian-needs-and-response-plan-2025' },
        { name: 'WHO Mental Health Atlas 2020 (Ukraine profile)', url: 'https://www.who.int/publications/m/item/mental-health-atlas-ukr-2020-country-profile' },
        { name: 'HeRAMS Ukraine Status Update Report 2024', url: 'https://www.who.int/publications/m/item/herams-ukraine-status-update-report-2024-10-non-communicable-disease-and-mental-health-services-en' },
        { name: 'UNICEF HAC Ukraine 2025', url: 'https://www.unicef.org/media/166046/file/2025-HAC-Ukraine.pdf' },
        { name: 'FTS OCHA Ukraine Health Cluster Funding 2024-2025', url: 'https://fts.unocha.org/plans/1188/summary' },
    ],
    secondary: [
        { name: 'PMC Mental health services during war — 2-year follow-up 2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11951524/' },
        { name: 'Lancet Regional Health Europe 2023 (Prevalence study)', url: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(23)00192-8/fulltext' },
        { name: 'HIAS/Girls MHPSS Full Report 2023', url: 'https://www.hias.org/news/new-report-mental-health-needs-ukraine' },
        { name: 'CSIS Investing in Mental Health 2024', url: 'https://www.csis.org/analysis/investing-mental-health-will-be-critical-ukraines-economic-future' },
        { name: 'KMU: HEAL $136M to state budget', url: 'https://www.kmu.gov.ua/en/news/miliony-ukraintsiv-otrymaly-medychnu-dopomohu-zavdiaky-proektu-svitovoho-banku-heal-ukraine-do-derzhbiudzhetu-vzhe-nadiishlo-136-mln-dolariv-ssha' },
        { name: 'KMU: THRIVE signing ($454M)', url: 'https://www.kmu.gov.ua/en/news/ukraina-ta-svitovyi-bank-realizuiut-novyi-proekt-u-sferi-okhorony-zdorovia-thrive-pidpysano-vidpovidni-uhody-zahalnym-obsiahom-454-mln' },
        { name: 'Interfax: LEARN+THRIVE $125.2M disbursement (Dec 2025)', url: 'https://en.interfax.com.ua/news/economic/1130129.html' },
        { name: 'MSH: AMP Helping Ukraine', url: 'https://msh.org/story/the-affordable-medicines-program-is-helping-ukraine-expand-access-to-health-services-despite-the-war/' },
    ]
};
