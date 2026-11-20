// Validate against the trusted Cloud Auth service, never client-supplied identity claims.
const DEFAULT_URL = 'https://fiwszjxgkxqhhamiftvj.supabase.co';
const DEFAULT_KEY = 'sb_publishable_lwLdTJft-t2l8HVUvMEYug_FXfnILIL';
function configured() {
  try { return new URL(process.env.ANK_AUTH_URL || DEFAULT_URL).protocol === 'https:'; } catch { return false; }
}
async function requireOwner(req, appUserId) {
  if (!configured()) return { ok: false, status: 503, error: 'verified report sign-in is not configured' };
  const header = req.headers && req.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ') || header.length > 8192) return { ok: false, status: 401, error: 'verified email sign-in required' };
  try {
    const base = (process.env.ANK_AUTH_URL || DEFAULT_URL).replace(/\/$/, '');
    const response = await fetch(`${base}/auth/v1/user`, {
      headers: { Authorization: header, apikey: process.env.ANK_AUTH_PUBLISHABLE_KEY || DEFAULT_KEY }, signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return { ok: false, status: response.status >= 500 || response.status === 429 ? 503 : 401, error: 'sign-in expired or unavailable' };
    const user = await response.json();
    if (typeof user.id !== 'string' || !user.email_confirmed_at || !user.email || user.is_anonymous) return { ok: false, status: 401, error: 'verified email sign-in required' };
    // Historical anonymous order IDs are retained for idempotency. All purchase lookups
    // use ONLY this server-verified account ID, regardless of the requested appUserId.
    if (typeof appUserId !== 'string' || appUserId.length > 200) return { ok: false, status: 400, error: 'invalid order identity' };
    return { ok: true, accountId: user.id };
  } catch { return { ok: false, status: 503, error: 'sign-in verification unavailable' }; }
}
module.exports = { requireOwner, configured };
