/**
 * Live Data Service — MHPSS UA Dashboard
 *
 * Sources and their connectivity:
 *
 * ✅ HDX HAPI (humdata.org) — public, no auth, CORS enabled
 * ✅ OCHA FTS — public financial tracking, no auth
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

/** HDX HAPI — Ukraine humanitarian funding summary */
async function fetchHdxFunding(): Promise<LiveMetrics['hdxFunding'] | null> {
  try {
    const url = 'https://hapi.humdata.org/api/v1/coordination-context/funding?location_code=UKR&output_format=json&limit=100';
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const json = await res.json();
    const results: any[] = json?.data?.results ?? [];
    if (!results.length) return null;

    let totalReq = 0;
    let totalFund = 0;
    for (const r of results) {
      totalReq += r.requirements_usd ?? 0;
      totalFund += r.funding_usd ?? 0;
    }
    return {
      totalRequirementsUsd: totalReq,
      totalFundingUsd: totalFund,
      fundingPct: totalReq > 0 ? Math.round((totalFund / totalReq) * 100) : 0,
      appealCount: results.length,
    };
  } catch {
    return null;
  }
}

/** HDX HAPI — Ukraine population data */
async function fetchHdxPopulation(): Promise<LiveMetrics['hdxPopulation'] | null> {
  try {
    const url = 'https://hapi.humdata.org/api/v1/population-social/population?location_code=UKR&admin_level=0&output_format=json&limit=10';
    const res = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const json = await res.json();
    const results: any[] = json?.data?.results ?? [];
    if (!results.length) return null;
    // Sum all age/gender groups or take latest total
    const latest = results[0];
    const total = results.reduce((acc: number, r: any) => acc + (r.population ?? 0), 0);
    return {
      totalPopulation: total || latest?.population || 0,
      source: 'HDX HAPI / OCHA',
    };
  } catch {
    return null;
  }
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
async function fetchKobo(): Promise<LiveMetrics['kobo']> {
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
        '/api/kobo/api/v2/assets/?asset_type=survey&format=json&limit=10'
      );
      if (!assetsRes.ok) return null;
      const assetsJson = await assetsRes.json();
      const surveys: any[] = assetsJson?.results ?? [];
      if (!surveys.length) return null;
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

  const [hdxFunding, hdxPopulation, activityInfo, kobo] = await Promise.all([
    fetchHdxFunding(),
    fetchHdxPopulation(),
    fetchActivityInfo(),
    fetchKobo(),
  ]);

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
      name: { uk: 'HDX HAPI (OCHA)', en: 'HDX HAPI (OCHA)' },
      status: hdxFunding || hdxPopulation ? 'live' : 'unavailable',
      lastFetched: hdxFunding || hdxPopulation ? now : undefined,
      requiresAuth: false,
      apiBase: 'https://hapi.humdata.org/api/v1/',
      dataType: { uk: 'Фінансування, населення, 4W матриця', en: 'Funding, population, 4W matrix' },
      updateFrequency: { uk: 'Щоденно (80% automated)', en: 'Daily (80% automated)' },
      error: hdxFunding || hdxPopulation ? undefined : 'Network/CORS error or API unavailable',
    },
    {
      id: 'activityinfo',
      name: { uk: 'ActivityInfo', en: 'ActivityInfo' },
      status: hasActivityInfoToken ? (activityInfo ? 'live' : 'unavailable') : 'not_configured',
      lastFetched: activityInfo ? now : undefined,
      requiresAuth: true,
      authNote: {
        uk: 'Токен зберігається як Worker Secret. Після реєстрації: npx wrangler secret put ACTIVITYINFO_API_KEY',
        en: 'Token stored as Worker Secret. After registration: npx wrangler secret put ACTIVITYINFO_API_KEY',
      },
      apiBase: 'https://api.activityinfo.org/api/v2/',
      dataType: { uk: 'Сесії МЗПСП, охоплення, провайдери, індикатори', en: 'MHPSS sessions, reach, providers, outcome indicators' },
      updateFrequency: { uk: 'Реальний час (після відправки форми)', en: 'Real-time (on form submission)' },
    },
    {
      id: 'kobo',
      name: { uk: 'KoBo Toolbox', en: 'KoBo Toolbox' },
      status: hasKoboToken ? (kobo ? 'live' : 'unavailable') : 'not_configured',
      lastFetched: kobo ? now : undefined,
      requiresAuth: true,
      authNote: {
        uk: 'Токен вже налаштовано як Worker Secret. Якщо форми не знайдено — додай VITE_KOBO_ASSET_ID у .env',
        en: 'Token already set as Worker Secret. If no form found — add VITE_KOBO_ASSET_ID in .env',
      },
      apiBase: 'https://kf.kobotoolbox.org/api/v2/',
      dataType: { uk: 'Польові оцінки, референсні форми, PSS-скори', en: 'Field assessments, referral forms, PSS scores' },
      updateFrequency: { uk: 'Кожні 5 хв (синхронний експорт)', en: 'Every 5 min (synchronous export)' },
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
