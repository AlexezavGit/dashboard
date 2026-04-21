/**
 * Cloudflare Pages Function — OCHA FTS proxy
 * Route: /api/fts/* → https://api.hpc.tools/*
 *
 * The OCHA FTS API is public but can be blocked from some server IPs.
 * This proxy forwards requests from our Cloudflare Worker to the FTS API
 * and adds CORS headers for the browser client.
 */

export const onRequest: PagesFunction = async ({ request, params }) => {
  const path = (params['path'] as string[]).join('/');
  const url = new URL(request.url);
  const target = `https://api.hpc.tools/${path}${url.search}`;

  try {
    const res = await fetch(target, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FEEL-Again-Dashboard/1.0',
      },
      signal: AbortSignal.timeout(10_000),
    });

    const body = await res.text();

    return new Response(body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') ?? 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300', // 5-min cache
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'FTS proxy error', detail: String(err) }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
