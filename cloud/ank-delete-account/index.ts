const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const reply = (status: number, ok: boolean) => new Response(JSON.stringify({ ok }), { status, headers });
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers });
  if (req.method !== 'POST') return reply(405, false);
  const authorization = req.headers.get('authorization') ?? '';
  if (!authorization.startsWith('Bearer ') || authorization.length > 8192) return reply(401, false);
  try {
    const base = Deno.env.get('SUPABASE_URL')!, secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const userResponse = await fetch(`${base}/auth/v1/user`, { headers: { Authorization: authorization, apikey: secret }, signal: AbortSignal.timeout(10_000) });
    if (!userResponse.ok) return reply(userResponse.status >= 500 ? 503 : 401, false);
    const user = await userResponse.json();
    if (typeof user.id !== 'string' || !user.email_confirmed_at || user.is_anonymous) return reply(401, false);
    const removed = await fetch(`${base}/auth/v1/admin/users/${encodeURIComponent(user.id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${secret}`, apikey: secret }, signal: AbortSignal.timeout(10_000) });
    return reply(removed.ok ? 200 : 503, removed.ok);
  } catch { return reply(503, false); }
});
export {};
