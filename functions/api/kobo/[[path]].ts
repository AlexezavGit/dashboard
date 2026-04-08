/**
 * Cloudflare Pages Function — KoBo Toolbox proxy
 * Route: /api/kobo/*  →  https://kf.kobotoolbox.org/*
 *
 * Token stored as Pages Environment Variable (secret):
 *   Cloudflare Dashboard → Pages → dashboard → Settings →
 *   Environment Variables → Add → KOBO_API_TOKEN (secret)
 *   Value: 66bb52de75381723cdaec050cf9ffa5ae05fbb5d
 */

interface Env {
  KOBO_API_TOKEN?: string;
}

const KOBO_BASE = 'https://kf.kobotoolbox.org';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export const onRequestOptions = () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  if (!env.KOBO_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'KOBO_API_TOKEN not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  const url = new URL(request.url);
  // params.path is the wildcard segments after /api/kobo/
  const pathSegments = (params.path as string[]) ?? [];
  const koboPath = '/' + pathSegments.join('/');
  const target = `${KOBO_BASE}${koboPath}${url.search}`;

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
      ...CORS,
    },
  });
};
