/**
 * Cloudflare Pages Function — health / config check
 * Route: /api/health
 *
 * Returns which API secrets are configured so the frontend
 * can decide which sources to show as LIVE vs NOT_CONFIGURED.
 */

interface Env {
  KOBO_API_TOKEN?: string;
  ACTIVITYINFO_API_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      kobo: env.KOBO_API_TOKEN ? 'configured' : 'missing',
      activityinfo: env.ACTIVITYINFO_API_KEY ? 'configured' : 'missing',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    }
  );
};
