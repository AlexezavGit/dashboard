/**
 * MHPSS UA Dashboard — Cloudflare Worker
 *
 * Responsibilities:
 * 1. Serve the static Vite build (index.html + assets) from ./dist
 * 2. Proxy /api/kobo/* → KoBo Toolbox API (token stays in Worker Secret)
 * 3. Proxy /api/activityinfo/* → ActivityInfo API (token stays in Worker Secret)
 *
 * Secrets (set via `npx wrangler secret put <NAME>`):
 *   KOBO_API_TOKEN          — KoBo API token
 *   ACTIVITYINFO_API_KEY    — ActivityInfo Bearer token (add after registration)
 *
 * Deploy:
 *   npm run build && npx wrangler deploy
 */

export interface Env {
  ASSETS: Fetcher;
  KOBO_API_TOKEN?: string;
  ACTIVITYINFO_API_KEY?: string;
}

const KOBO_BASE = 'https://kf.kobotoolbox.org';
const ACTIVITYINFO_BASE = 'https://api.activityinfo.org';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function corsResponse(body: string, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extra },
  });
}

async function proxyKobo(request: Request, env: Env, path: string): Promise<Response> {
  if (!env.KOBO_API_TOKEN) {
    return corsResponse(JSON.stringify({ error: 'KOBO_API_TOKEN not configured' }), 503);
  }

  const url = new URL(request.url);
  const target = `${KOBO_BASE}${path}${url.search}`;

  const upstream = await fetch(target, {
    headers: {
      Authorization: `Token ${env.KOBO_API_TOKEN}`,
      Accept: 'application/json',
    },
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      ...CORS_HEADERS,
    },
  });
}

async function proxyActivityInfo(request: Request, env: Env, path: string): Promise<Response> {
  if (!env.ACTIVITYINFO_API_KEY) {
    return corsResponse(JSON.stringify({ error: 'ACTIVITYINFO_API_KEY not configured' }), 503);
  }

  const url = new URL(request.url);
  const target = `${ACTIVITYINFO_BASE}${path}${url.search}`;

  const upstream = await fetch(target, {
    headers: {
      Authorization: `Bearer ${env.ACTIVITYINFO_API_KEY}`,
      Accept: 'application/json',
    },
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      ...CORS_HEADERS,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only allow GET
    if (request.method !== 'GET') {
      return corsResponse(JSON.stringify({ error: 'Method not allowed' }), 405);
    }

    // --- API Proxy routes ---

    if (pathname.startsWith('/api/kobo/')) {
      // Strip /api/kobo prefix → pass the rest to KoBo
      const koboPath = pathname.replace('/api/kobo', '');
      return proxyKobo(request, env, koboPath);
    }

    if (pathname.startsWith('/api/activityinfo/')) {
      const aiPath = pathname.replace('/api/activityinfo', '');
      return proxyActivityInfo(request, env, aiPath);
    }

    // Health check
    if (pathname === '/api/health') {
      return corsResponse(
        JSON.stringify({
          status: 'ok',
          kobo: env.KOBO_API_TOKEN ? 'configured' : 'missing',
          activityinfo: env.ACTIVITYINFO_API_KEY ? 'configured' : 'missing',
          timestamp: new Date().toISOString(),
        })
      );
    }

    // --- Static assets (Vite build) ---
    return env.ASSETS.fetch(request);
  },
};
