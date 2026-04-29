/**
 * Cloudflare Pages Function — ActivityInfo proxy
 * Route: /api/activityinfo/*  →  https://www.activityinfo.org/*
 *
 * Handles GET and POST. Token stored as Pages env var ACTIVITYINFO_API_KEY.
 */

interface Env {
  ACTIVITYINFO_API_KEY?: string;
}

const AI_BASE = 'https://www.activityinfo.org';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions = () =>
  new Response(null, { status: 204, headers: CORS });

export const onRequest: PagesFunction<Env> = async ({ request, env, params }) => {
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
    method: request.method,
    headers: {
      Authorization: `Bearer ${env.ACTIVITYINFO_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: request.method === 'POST' ? request.body : undefined,
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'X-AI-Status': String(upstream.status),
      'X-AI-Target': target,
      ...CORS,
    },
  });
};
