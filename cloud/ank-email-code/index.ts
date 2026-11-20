const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const CLIENT_KEY = 'sb_publishable_lwLdTJft-t2l8HVUvMEYug_FXfnILIL';
const response = (status: number, error?: string) => new Response(JSON.stringify(error ? { error } : { ok: true }), { status, headers });
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers });
  if (req.method !== 'POST') return response(405, 'Method not allowed');
  // This is a public sign-in endpoint. Client-key checking and atomic rate limits
  // protect code issuance; account access requires verification of the emailed OTP.
  if (req.headers.get('apikey') !== CLIENT_KEY) return response(401, 'Client key required');
  const key = Deno.env.get('RESEND_API_KEY'), from = Deno.env.get('ANK_AUTH_FROM');
  if (!key || !from) return response(503, 'Email sign-in is not configured');
  try {
    const text = await req.text(); if (text.length > 1024) return response(400, 'Invalid request');
    const email = String(JSON.parse(text).email ?? '').trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return response(400, 'Invalid email');
    const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const base = Deno.env.get('SUPABASE_URL')!;
    const adminHeaders = { Authorization: `Bearer ${secret}`, apikey: secret, 'Content-Type': 'application/json' };
    const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${secret}|${value}`))), b => b.toString(16).padStart(2, '0')).join('');
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const limiter = await fetch(`${base}/rest/v1/rpc/ank_reserve_email_code`, { method: 'POST', headers: adminHeaders, body: JSON.stringify({ email_hash: await hash(email), ip_hash: await hash(ip) }), signal: AbortSignal.timeout(10_000) });
    if (!limiter.ok) return response(503, 'Email sign-in is unavailable');
    if (await limiter.json() !== true) return response(429, 'Wait before requesting another code');
    const generated = await fetch(`${base}/auth/v1/admin/generate_link`, { method: 'POST', headers: adminHeaders, body: JSON.stringify({ type: 'magiclink', email }), signal: AbortSignal.timeout(10_000) });
    if (!generated.ok) return response(503, 'Email sign-in is unavailable');
    const code = (await generated.json()).email_otp;
    if (typeof code !== 'string' || !/^[0-9]{6,10}$/.test(code)) return response(503, 'Email sign-in is unavailable');
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({ from, to: [email], subject: 'Your Ank sign-in code', text: `Your one-time Ank Numerology sign-in code is ${code}.\n\nEnter it in Ank. Never share this code. If you did not request it, ignore this email.`, html: `<div style="background:#12142B;color:#F7F7FB;padding:32px;font-family:Arial,sans-serif"><p style="color:#C9A227">ANK NUMEROLOGY</p><h2>Your sign-in code</h2><p>Enter this one-time code in Ank:</p><p style="font-size:32px;letter-spacing:6px;color:#C9A227">${code}</p><p>Never share this code. If you didn’t request it, you can ignore this email.</p></div>` }),
    });
    if (!sent.ok) return response(503, 'Email delivery is unavailable');
    const accepted = await sent.json(); if (!accepted.id) return response(503, 'Email delivery is unavailable');
    return response(200);
  } catch { return response(503, 'Email sign-in is unavailable'); }
});
export {};
