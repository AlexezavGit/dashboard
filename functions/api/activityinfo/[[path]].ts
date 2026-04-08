/**
 * Cloudflare Pages Function — ActivityInfo proxy
 * Route: /api/activityinfo/*  →  https://api.activityinfo.org/*
 *
 * Token stored as Pages Environment Variable (secret):
 *   Cloudflare Dashboard → Pages → dashboard → Settings →
 *   Environment Variables → Add → ACTIVITYINFO_API_KEY (secret)
 *   (add after receiving registration confirmation)
 */

interface Env {
  ACTIVITYINFO_API_KEY?: string;
}

const AI_BASE = 'https://api.activityinfo.org';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const onRequestOptions = () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!env.ACTIVITYINFO_API_KEY) {
    return new Response(JSON.stringify({ error: 'ACTIVITYINFO_API_KEY not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  const url = new URL(request.url);
  const pathSegments = (params.path as string[]) ?? [];
  const aiPath = '/' + pathSegments.join('/');
  const target = `${AI_BASE}${aiPath}${url.search}`;

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
      ...CORS,
    },
  });
};
