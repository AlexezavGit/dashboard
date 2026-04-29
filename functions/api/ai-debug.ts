/**
 * Debug endpoint — shows raw ActivityInfo /resources/databases response.
 * Remove after debugging is done.
 */
interface Env { ACTIVITYINFO_API_KEY?: string; }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.ACTIVITYINFO_API_KEY) {
    return json({ error: 'token not configured' }, 503);
  }

  const results: Record<string, unknown> = {
    token_length: env.ACTIVITYINFO_API_KEY.length,
    token_prefix: env.ACTIVITYINFO_API_KEY.slice(0, 6) + '...',
  };

  // Try both possible base URLs
  for (const base of ['https://www.activityinfo.org', 'https://api.activityinfo.org']) {
    try {
      const r = await fetch(`${base}/resources/databases`, {
        headers: { Authorization: `Bearer ${env.ACTIVITYINFO_API_KEY}`, Accept: 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      const text = await r.text();
      results[base] = { status: r.status, body: text.slice(0, 500) };
    } catch (e) {
      results[base] = { error: String(e) };
    }
  }

  return json(results, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}
