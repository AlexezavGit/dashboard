/**
 * Live Data Service — MHPSS UA Dashboard
 *
 * Sources and their connectivity:
 *
 * ✅ OCHA FTS (api.hpc.tools) — public humanitarian funding tracker, no auth
 * ❌ HDX HAPI (hapi.humdata.org) — blocks Cloudflare Workers IPs with 403
 * ⚠️  ActivityInfo — requires org-specific API token (ACTIVITYINFO_API_KEY)
 * ⚠️  KoBo Toolbox — requires org API token + form asset ID (KOBO_API_TOKEN, KOBO_ASSET_ID)
 * 🔒 ЕСОЗ / eHealth Ukraine — closed government system; requires MoH licensing + certification
 * 🔒 Helsi / Kyivstar Health — closed commercial platform; requires partnership agreement
 * 🚫 WHO MH Atlas — no machine-readable public API (PDF/XLSX reports only)
 * 🚫 UNICEF HAC — no machine-readable public API (annual PDF reports)
 * 🚫 HeRAMS — no public API (WHO internal reporting system)
 * 🚫 Lancet / PMC — academic publications, no API
 */

export type DataSourceStatus = 'live' | 'static' | 'not_configured' | 'unavailable' | 'loading' | 'restricted';

export interface DataSourceInfo {
  id: string;
  name: { uk: string; en: string };
  status: DataSourceStatus;
  lastFetched?: Date;
  error?: string;
  requiresAuth: boolean;
  authNote?: { uk: string; en: string };
  apiBase: string;
  dataType: { uk: string; en: string };
  updateFrequency: { uk: string; en: string };
  noApiReason?: { uk: string; en: string };
  restrictionNote?: { uk: string; en: string };
  potentialData?: { uk: string; en: string };
}

export interface LiveMetrics {
  hdxFunding?: {
    totalRequirementsUsd: number;
    totalFundingUsd: number;
    fundingPct: number;
    appealCount: number;
  };
  hdxPopulation?: {
    totalPopulation: number;
    source: string;
  };
  activityInfo?: {
    sessionsCount: number;
    beneficiariesReached: number;
  } | null;
  kobo?: {
    assessmentsCount: number;
    lastSubmission: string;
  } | null;
}

const FETCH_TIMEOUT_MS = 8000;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

let _hdxError: string | undefined;

/**
 * OCHA FTS — Ukraine humanitarian response plan funding.
 * Tries two endpoints in order:
 * 1. /v1/public/appeal?year=YYYY&countryIso3=UKR  → appeal objects with requirements + funding
 * 2. /v1/public/fts/flow?groupby=plan&countryISO3=UKR&year=YYYY → report3.planContributions
 */
async function fetchFtsFunding(): Promise<LiveMetrics['hdxFunding'] | null> {
  try {
    for (const year of [2025, 2024]) {
      // Strategy 1: appeal endpoint (has revisedRequirements + funding.totalFunding)
      const appealUrl = `/api/fts/v1/public/appeal?year=${year}&countryIso3=UKR`;
      const appealRes = await fetchWithTimeout(appealUrl);
      if (appealRes.ok) {
        const appealJson = await appealRes.json();
        const appeals: any[] = appealJson?.data ?? [];
        if (appeals.length) {
          let totalReq = 0;
          let totalFund = 0;
          for (const a of appeals) {
            totalReq += a.revisedRequirements ?? a.requirements ?? 0;
            totalFund += a.funding?.totalFunding ?? a.totalFunding ?? 0;
          }
          if (totalReq > 0 || totalFund > 0) {
            _hdxError = undefined;
            return {
              totalRequirementsUsd: totalReq,
              totalFundingUsd: totalFund,
              fundingPct: totalReq > 0 ? Math.round((totalFund / totalReq) * 100) : 0,
              appealCount: appeals.length,
            };
          }
        }
      }

      // Strategy 2: flow endpoint grouped by plan
      const flowUrl = `/api/fts/v1/public/fts/flow?groupby=plan&countryISO3=UKR&year=${year}`;
      const flowRes = await fetchWithTimeout(flowUrl);
      if (!flowRes.ok) {
        _hdxError = `OCHA FTS помилка ${flowRes.status}`;
        continue;
      }
      const flowJson = await flowRes.json();

      // Try report3.planContributions
      const plans: any[] = flowJson?.data?.report3?.planContributions ?? [];
      if (plans.length) {
        let totalReq = 0;
        let totalFund = 0;
        for (const p of plans) {
          totalReq += p.revisedRequirements ?? 0;
          totalFund += p.totalFunding ?? 0;
        }
        if (totalReq > 0 || totalFund > 0) {
          _hdxError = undefined;
          return {
            totalRequirementsUsd: totalReq,
            totalFundingUsd: totalFund,
            fundingPct: totalReq > 0 ? Math.round((totalFund / totalReq) * 100) : 0,
            appealCount: plans.length,
          };
        }
      }

      // Last resort: just total funding from report1 (no requirements)
      const totalFunding = flowJson?.data?.report1?.fundingTotals?.total ?? 0;
      if (totalFunding > 0) {
        _hdxError = undefined;
        return {
          totalRequirementsUsd: 0,
          totalFundingUsd: totalFunding,
          fundingPct: 0,
          appealCount: 1,
        };
      }

      // Debug: capture response shape to help diagnose
      const dataKeys = Object.keys(flowJson?.data ?? {}).join(', ');
      const r3keys = Object.keys(flowJson?.data?.report3 ?? {}).join(', ');
      _hdxError = `FTS: порожня відповідь ${year}. data keys: [${dataKeys}], report3 keys: [${r3keys}]`;
    }
    return null;
  } catch {
    _hdxError = 'Помилка мережі при зверненні до OCHA FTS';
    return null;
  }
}

/** Ukraine population — static reference from OCHA/UNHCR (updated manually) */
function getUkrainePopulation(): LiveMetrics['hdxPopulation'] {
  return {
    totalPopulation: 43_500_000, // Pre-war baseline (State Statistics Service of Ukraine)
    source: 'OCHA / Держстат України',
  };
}

/**
 * ActivityInfo — proxied via Cloudflare Worker (/api/activityinfo/*)
 * Token is stored as a Worker Secret, never in the JS bundle.
 * DB/Form IDs can be baked in via VITE_ env vars (non-sensitive).
 */
async function fetchActivityInfo(): Promise<LiveMetrics['activityInfo']> {
  try {
    // Check if the proxy is configured (health endpoint)
    const health = await fetchWithTimeout('/api/health').catch(() => null);
    if (!health?.ok) return null;
    const healthJson = await health.json().catch(() => ({}));
    if (healthJson?.activityinfo !== 'configured') return null;

    const dbId = import.meta.env.VITE_ACTIVITYINFO_DB_ID;
    const formId = import.meta.env.VITE_ACTIVITYINFO_FORM_ID;
    if (!dbId || !formId) return null;

    const url = `/api/activityinfo/api/v2/databases/${dbId}/forms/${formId}/records`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const json = await res.json();
    const records: any[] = json?.results ?? [];
    return {
      sessionsCount: records.length,
      beneficiariesReached: records.reduce((a: number, r: any) => a + (r.beneficiaries ?? 0), 0),
    };
  } catch {
    return null;
  }
}

/**
 * KoBo Toolbox — proxied via Cloudflare Worker (/api/kobo/*)
 * Token (66bb52de...) is stored as a Worker Secret, never in the JS bundle.
 *
 * If VITE_KOBO_ASSET_ID is set → fetch that specific form's submissions.
 * If not set → auto-discover the first MHPSS survey from the account.
 */
let _koboError: string | undefined;

async function fetchKobo(): Promise<LiveMetrics['kobo']> {
  _koboError = undefined;
  try {
    // Check proxy health first
    const health = await fetchWithTimeout('/api/health').catch(() => null);
    if (!health?.ok) return null;
    const healthJson = await health.json().catch(() => ({}));
    if (healthJson?.kobo !== 'configured') return null;

    // Resolve asset ID: use explicit env var or auto-discover
    let assetId = import.meta.env.VITE_KOBO_ASSET_ID as string | undefined;

    if (!assetId) {
      // Auto-discover first survey form in the account
      const assetsRes = await fetchWithTimeout(
        '/api/kobo/api/v2/assets/?asset_type=survey&limit=10'
      );
      if (!assetsRes.ok) {
        _koboError = `KoBo assets HTTP ${assetsRes.status}`;
        return null;
      }
      const assetsJson = await assetsRes.json().catch(() => ({}));
      const surveys: any[] = assetsJson?.results ?? [];
      if (!surveys.length) {
        _koboError = 'No survey forms found in this KoBo account';
        return null;
      }
      // Prefer a form with "mhpss" or "mental" in its name (case-insensitive)
      const mhpssForm = surveys.find(
        (s: any) =>
          /mhpss|mental|psych|feel|assess/i.test(s.name ?? '') ||
          /mhpss|mental|psych|feel|assess/i.test(s.settings?.description ?? '')
      ) ?? surveys[0];
      assetId = mhpssForm.uid;
    }

    if (!assetId) return null;

    const url = `/api/kobo/api/v2/assets/${assetId}/data/?format=json&limit=1`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const json = await res.json();
    return {
      assessmentsCount: json?.count ?? 0,
      lastSubmission: json?.results?.[0]?.end ?? '',
    };
  } catch {
    return null;
  }
}

/** Run all fetches in parallel and return combined results + source statuses */
export async function fetchAllLiveData(): Promise<{
  metrics: LiveMetrics;
  sources: DataSourceInfo[];
}> {
  // Check Worker proxy health to know which secrets are configured
  let proxyHealth: { kobo?: string; activityinfo?: string } = {};
  try {
    const h = await fetchWithTimeout('/api/health');
    if (h.ok) proxyHealth = await h.json();
  } catch { /* running locally without worker */ }

  const hasKoboToken = proxyHealth.kobo === 'configured';
  const hasActivityInfoToken = proxyHealth.activityinfo === 'configured';

  const [hdxFunding, activityInfo, kobo] = await Promise.all([
    fetchFtsFunding(),
    fetchActivityInfo(),
    fetchKobo(),
  ]);
  const hdxPopulation = getUkrainePopulation();

  const metrics: LiveMetrics = {
    hdxFunding: hdxFunding ?? undefined,
    hdxPopulation: hdxPopulation ?? undefined,
    activityInfo,
    kobo,
  };

  const now = new Date();

  const sources: DataSourceInfo[] = [
    {
      id: 'hdx_hapi',
      name: { uk: 'OCHA FTS (фінансування)', en: 'OCHA FTS (funding)' },
      status: hdxFunding ? 'live' : 'unavailable',
      lastFetched: hdxFunding ? now : undefined,
      requiresAuth: false,
      apiBase: 'https://api.hpc.tools/v1/public/',
      dataType: { uk: 'Гуманітарне фінансування по Україні: плани відповіді, донори, фонди', en: 'Ukraine humanitarian funding: response plans, donors, pooled funds' },
      updateFrequency: { uk: 'Щоденно (OCHA Financial Tracking Service)', en: 'Daily (OCHA Financial Tracking Service)' },
      error: hdxFunding ? undefined : (_hdxError ?? 'Помилка зʼєднання з OCHA FTS'),
    },
    {
      id: 'activityinfo',
      name: { uk: 'ActivityInfo', en: 'ActivityInfo' },
      status: hasActivityInfoToken ? (activityInfo ? 'live' : 'unavailable') : 'not_configured',
      lastFetched: activityInfo ? now : undefined,
      requiresAuth: true,
      authNote: {
        uk: 'Система звітності для гуманітарних організацій ООН і НУО. Дані кластера доступні тільки зареєстрованим партнерам — це не відкрита статистична база. Для підключення потрібен обліковий запис на activityinfo.org і API-ключ вашої організації.',
        en: 'Humanitarian cluster reporting system for UN agencies and NGOs. Cluster data is only for registered partners — not a public stats database. Requires an activityinfo.org account and your organisation\'s API key.',
      },
      apiBase: 'https://api.activityinfo.org/api/v2/',
      dataType: { uk: 'Сесії МЗПСП, охоплення, провайдери, індикатори', en: 'MHPSS sessions, reach, providers, outcome indicators' },
      updateFrequency: { uk: 'Реальний час (після відправки форми)', en: 'Real-time (on form submission)' },
    },
    {
      id: 'kobo',
      name: { uk: 'KoBo Toolbox', en: 'KoBo Toolbox' },
      status: hasKoboToken && kobo ? 'live' : 'not_configured',
      lastFetched: kobo ? now : undefined,
      requiresAuth: true,
      authNote: {
        uk: 'KoBo — платформа для збору власних польових даних (анкети, оцінки, направлення). Це НЕ публічна база статистики. Щоб підключити: створіть форму оцінки у KoBo, потім додайте VITE_KOBO_ASSET_ID у змінні середовища.',
        en: 'KoBo is a field data collection platform (surveys, assessments, referrals). It is NOT a public statistics database. To connect: create an assessment form in KoBo, then add VITE_KOBO_ASSET_ID to environment variables.',
      },
      apiBase: 'https://kf.kobotoolbox.org/api/v2/',
      dataType: { uk: 'Власні польові оцінки, форми направлення, PSS-скори (дані вашої організації)', en: 'Own field assessments, referral forms, PSS scores (your organisation\'s data)' },
      updateFrequency: { uk: 'Кожні 5 хв після відправки форми', en: 'Every 5 min after form submission' },
    },
    {
      id: 'who_mh_atlas',
      name: { uk: 'WHO MH Atlas', en: 'WHO MH Atlas' },
      status: 'static',
      requiresAuth: false,
      apiBase: 'https://www.who.int/publications/',
      dataType: { uk: 'Кадри, бюджет, заклади', en: 'Workforce, budget, facilities' },
      updateFrequency: { uk: 'Кожні 5 років (2020, 2025...)', en: 'Every 5 years (2020, 2025...)' },
      noApiReason: {
        uk: 'Лише PDF/XLSX звіти. Машинозчитуваного API немає.',
        en: 'PDF/XLSX reports only. No machine-readable API.',
      },
    },
    {
      id: 'unicef_hac',
      name: { uk: 'UNICEF HAC Ukraine', en: 'UNICEF HAC Ukraine' },
      status: 'static',
      requiresAuth: false,
      apiBase: 'https://www.unicef.org/',
      dataType: { uk: 'Охоплення дітей, навчений персонал', en: 'Children reach, trained personnel' },
      updateFrequency: { uk: 'Щорічно (звіт)', en: 'Annual (report)' },
      noApiReason: {
        uk: 'Річні PDF-звіти. Немає публічного структурованого API.',
        en: 'Annual PDF reports. No public structured API.',
      },
    },
    {
      id: 'herams',
      name: { uk: 'HeRAMS (ВООЗ)', en: 'HeRAMS (WHO)' },
      status: 'static',
      requiresAuth: false,
      apiBase: 'https://www.who.int/tools/herams',
      dataType: { uk: 'Заклади охорони здоровʼя', en: 'Health facilities' },
      updateFrequency: { uk: 'Щомісяця (внутрішня система)', en: 'Monthly (internal system)' },
      noApiReason: {
        uk: 'Внутрішня система ВООЗ. Доступ лише через офіційні звіти.',
        en: 'WHO internal system. Access only via official reports.',
      },
    },
    {
      id: 'lancet',
      name: { uk: 'Lancet / PMC (наукові дані)', en: 'Lancet / PMC (research data)' },
      status: 'static',
      requiresAuth: false,
      apiBase: 'https://www.thelancet.com/',
      dataType: { uk: 'Поширеність розладів, ПТСР, депресія', en: 'Disorder prevalence, PTSD, depression' },
      updateFrequency: { uk: 'Нерегулярно (публікації)', en: 'Irregular (publications)' },
      noApiReason: {
        uk: 'Наукові публікації. Дані вручну витягнуті з досліджень.',
        en: 'Academic publications. Data manually extracted from studies.',
      },
    },
    {
      id: 'esoz_ehealth',
      name: { uk: 'ЕСОЗ / eHealth Ukraine (МОЗ)', en: 'ESOZ / eHealth Ukraine (MoH)' },
      status: 'restricted',
      requiresAuth: true,
      apiBase: 'https://api.ehealth.gov.ua/',
      dataType: {
        uk: 'Електронні медичні записи, психіатричні консультації (ICD-10), рецепти, направлення, реєстр НСЗУ',
        en: 'Electronic medical records, psychiatric consultations (ICD-10), prescriptions, referrals, NHSU registry',
      },
      updateFrequency: { uk: 'Реальний час (транзакційна система)', en: 'Real-time (transactional system)' },
      restrictionNote: {
        uk: 'Доступ заблоковано регуляторно. Потрібно: (1) юридична угода з ДП «Електронне здоровʼя» (МОЗ), (2) технічна сертифікація ПЗ (аудит коду + тести), (3) ліцензія медичного закладу або статус постачальника МІС. Без цього — жодних даних на жодному рівні.',
        en: 'Access blocked by regulation. Required: (1) legal agreement with SE "Electronic Health" (MoH), (2) software technical certification (code audit + testing), (3) medical facility license or HIS vendor status. Without this — no data at any level.',
      },
      potentialData: {
        uk: 'Якби доступ був: ~6M+ пацієнтів, психіатричні ep-ізоди, ПТСР-діагнози, черги до психологів, географія звернень по регіонах.',
        en: 'If access granted: ~6M+ patients, psychiatric episodes, PTSD diagnoses, psychologist waitlists, regional consultation geography.',
      },
    },
    {
      id: 'helsi_kyivstar',
      name: { uk: 'Helsi / Kyivstar Health', en: 'Helsi / Kyivstar Health' },
      status: 'restricted',
      requiresAuth: true,
      apiBase: 'https://helsi.me/',
      dataType: {
        uk: 'Телемедичні сесії, профілі провайдерів, запити на консультацію, записи до фахівців МЗПСП',
        en: 'Telemedicine sessions, provider profiles, consultation requests, MHPSS specialist appointments',
      },
      updateFrequency: { uk: 'Реальний час (комерційна платформа)', en: 'Real-time (commercial platform)' },
      restrictionNote: {
        uk: 'Закрита комерційна платформа Kyivstar. Потрібно: партнерська угода з Kyivstar Digital, NDA, технічна інтеграція через приватний API. Публічного API або sandbox не існує.',
        en: 'Closed commercial platform by Kyivstar. Required: partnership agreement with Kyivstar Digital, NDA, technical integration via private API. No public API or sandbox exists.',
      },
      potentialData: {
        uk: 'Якби доступ був: кількість онлайн-консультацій з психологами/психіатрами, географія запитів, waitlist-статистика, рейтинги провайдерів.',
        en: 'If access granted: online psych/psychiatrist consultation counts, request geography, waitlist stats, provider ratings.',
      },
    },
  ];

  return { metrics, sources };
}
