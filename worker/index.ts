/**
 * MHPSS UA Dashboard — Cloudflare Worker
 *
 * - Serves static Vite build from ./dist via ASSETS binding
 * - Proxies /api/kobo/* → KoBo Toolbox (token as Worker Secret)
 * - Proxies /api/activityinfo/* → ActivityInfo (token as Worker Secret)
 * - /api/health → shows which secrets are configured
 *
 * Secrets → Cloudflare Dashboard → Workers → dashboard → Settings → Variables:
 *   KOBO_API_TOKEN       = 66bb52de75381723cdaec050cf9ffa5ae05fbb5d
 *   ACTIVITYINFO_API_KEY = <add after ActivityInfo registration>
 */

export interface Env {
  ASSETS: Fetcher;
  KOBO_API_TOKEN?: string;
  KOBO?: string; // fallback if secret was added with short name
  ACTIVITYINFO_API_KEY?: string;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

async function proxy(upstream: string, authHeader?: string): Promise<Response> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (authHeader) headers['Authorization'] = authHeader;
  const res = await fetch(upstream, { headers, redirect: 'manual' });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
      ...CORS,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname, search } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const koboToken = env.KOBO_API_TOKEN ?? env.KOBO;

    // Health — lets frontend know which secrets are active
    if (pathname === '/api/health') {
      return json({
        status: 'ok',
        kobo: koboToken ? 'configured' : 'missing',
        activityinfo: env.ACTIVITYINFO_API_KEY ? 'configured' : 'missing',
        timestamp: new Date().toISOString(),
      });
    }

    // KoBo proxy
    if (pathname.startsWith('/api/kobo/')) {
      if (!koboToken) return json({ error: 'KOBO_API_TOKEN not set' }, 503);
      const path = pathname.replace('/api/kobo', '');
      return proxy(`https://kf.kobotoolbox.org${path}${search}`, `Token ${koboToken}`);
    }

    // HDX HAPI proxy (public, no auth — proxied to avoid browser CORS)
    if (pathname.startsWith('/api/hdx/')) {
      const path = pathname.replace('/api/hdx', '');
      return proxy(
        `https://hapi.humdata.org${path}${search}${search ? '&' : '?'}app_identifier=mhpss-ua-dashboard`
      );
    }

    // ActivityInfo proxy
    if (pathname.startsWith('/api/activityinfo/')) {
      if (!env.ACTIVITYINFO_API_KEY) return json({ error: 'ACTIVITYINFO_API_KEY not set' }, 503);
      const path = pathname.replace('/api/activityinfo', '');
      return proxy(`https://api.activityinfo.org${path}${search}`, `Bearer ${env.ACTIVITYINFO_API_KEY}`);
    }

    // All other requests → static assets (Vite SPA)
    return env.ASSETS.fetch(request);
  },
};
