// Verified purchases are redeemed against one durable profile and delivery ledger.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PRODUCT_ID = process.env.REPORT_PRODUCT_ID || 'ank_name_report';
const RC_BASE = process.env.REVENUECAT_API_BASE || 'https://api.revenuecat.com/v1';
const LEDGER_PATH = process.env.REPORT_LEDGER_PATH || path.join(__dirname, '..', 'data', 'ledger.json');
const MAX_SENDS_PER_PURCHASE = Number(process.env.REPORT_MAX_SENDS || 5);
const ALLOW_SANDBOX = process.env.REPORT_ALLOW_SANDBOX !== '0';
function norm(s) { return String(s || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase(); }
function fingerprint(p) { return crypto.createHash('sha256').update(`${norm(p.name)}|${+p.day}|${+p.month}|${+p.year}`).digest('hex').slice(0, 32); }
const failure = message => Object.assign(new Error(message), { status: 503 });
let chain = Promise.resolve();
function withLock(fn) { const run = chain.then(fn); chain = run.catch(() => {}); return run; }
// Rendering and sending are coordinated too, not merely the short authorization query.
let deliveryChain = Promise.resolve();
function withDeliveryLock(fn) { const run = deliveryChain.then(fn); deliveryChain = run.catch(() => {}); return run; }
function load() {
  try {
    const data = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8'));
    if (!data || !data.tx || typeof data.tx !== 'object' || Array.isArray(data.tx)) throw new Error('invalid ledger');
    for (const row of Object.values(data.tx)) {
      if (!row || typeof row.fp !== 'string' || typeof row.name !== 'string' || !Number.isSafeInteger(row.sends) || row.sends < 0 || ![row.day, row.month, row.year].every(Number.isInteger)) throw new Error('invalid ledger entry');
    }
    return data;
  } catch {
    // Missing/corrupt ledger must NEVER turn redeemed purchases into unused credits.
    throw failure('purchase ledger unavailable; restore the durable ledger before accepting orders');
  }
}
function save(db) {
  const tmp = LEDGER_PATH + '.tmp';
  const file = fs.openSync(tmp, 'w', 0o600);
  try { fs.writeFileSync(file, JSON.stringify(db)); fs.fsyncSync(file); } finally { fs.closeSync(file); }
  fs.renameSync(tmp, LEDGER_PATH);
  const directory = fs.openSync(path.dirname(LEDGER_PATH), 'r');
  try { fs.fsyncSync(directory); } finally { fs.closeSync(directory); }
}
function ledgerReady() { try { load(); return true; } catch { return false; } }
async function fetchPurchases(appUserId) {
  const key = process.env.REVENUECAT_SECRET_KEY;
  if (!key) throw failure('purchase verification not configured');
  const r = await fetch(`${RC_BASE}/subscribers/${encodeURIComponent(appUserId)}`, {
    headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' }, signal: AbortSignal.timeout(15_000),
  });
  if (!r.ok) throw Object.assign(new Error(`purchase lookup failed (${r.status})`), { status: r.status === 404 ? 402 : 502 });
  const j = await r.json();
  const list = j.subscriber?.non_subscriptions?.[PRODUCT_ID] || [];
  if (!Array.isArray(list)) throw failure('purchase lookup returned invalid data');
  return list.filter(t => t && t.id && (ALLOW_SANDBOX || !t.is_sandbox)).map(t => ({ id: String(t.id), date: t.purchase_date || t.original_purchase_date || null })).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}
function validAppUserId(id) { return typeof id === 'string' && id.length >= 6 && id.length <= 200 && !/[\s/]/.test(id); }
function deliveryHash(order) {
  return crypto.createHash('sha256').update(JSON.stringify([order.appUserId, fingerprint(order.profile), norm(order.email), order.language || 'en', order.createdAt])).digest('hex');
}
async function authorizeOrder(appUserId, profile, order) {
  if (!validAppUserId(appUserId)) return { ok: false, status: 401, error: 'missing purchase identity' };
  if (!Number.isSafeInteger(MAX_SENDS_PER_PURCHASE) || MAX_SENDS_PER_PURCHASE < 1 || MAX_SENDS_PER_PURCHASE > 20) throw failure('invalid resend limit');
  if (!order || typeof order.id !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(order.id)) return { ok: false, status: 400, error: 'invalid order reference' };
  const purchases = await fetchPurchases(appUserId);
  if (!purchases.length) return { ok: false, status: 402, error: 'no Complete Report purchase found' };
  const fp = fingerprint(profile), hash = deliveryHash(order);
  return withLock(() => {
    const db = load(), owned = purchases.map(p => p.id);
    let txId = owned.find(id => db.tx[id]?.fp === fp);
    if (!txId) {
      txId = owned.find(id => !db.tx[id]);
      if (!txId) return { ok: false, status: 402, error: 'all purchases already used; buy another report' };
      db.tx[txId] = { ownerId: appUserId, fp, name: String(profile.name).slice(0, 80), day: +profile.day, month: +profile.month, year: +profile.year, sends: 0, at: Date.now(), last: Date.now(), orders: {} };
      save(db);
    }
    const row = db.tx[txId], previous = row.orders?.[order.id];
    if (row.ownerId && row.ownerId !== appUserId) return { ok: false, status: 409, error: 'this purchase is linked to another verified account; contact support' };
    if (!row.ownerId) { row.ownerId = appUserId; save(db); }
    if (previous) {
      if (previous.hash !== hash) return { ok: false, status: 409, error: 'this order reference belongs to different report details' };
      return { ok: true, txId, alreadySent: true };
    }
    if (row.sends >= MAX_SENDS_PER_PURCHASE) return { ok: false, status: 409, error: 'send limit reached; contact support' };
    return {
      ok: true, txId, idempotencyKey: `ank-report/${crypto.createHash('sha256').update(`${txId}|${order.id}|${hash}`).digest('hex')}`,
      claim: () => withLock(() => {
        const d = load(), entry = d.tx[txId];
        if (!entry || entry.fp !== fp) throw failure('purchase ledger changed during delivery');
        entry.orders = entry.orders || {};
        if (entry.orders[order.id]) return;
        entry.orders[order.id] = { hash, acceptedAt: Date.now() };
        entry.sends += 1; entry.last = Date.now(); save(d);
      }),
    };
  });
}
async function listRestorable(appUserId) {
  if (!validAppUserId(appUserId)) throw Object.assign(new Error('missing purchase identity'), { status: 401 });
  const purchases = await fetchPurchases(appUserId);
  return withLock(() => {
  const db = load();
  const profiles = [], seen = new Set(); let unused = 0;
  let changed = false;
  for (const p of purchases) {
    const row = db.tx[p.id]; if (!row) { unused += 1; continue; }
    if (row.ownerId && row.ownerId !== appUserId) continue;
    if (!row.ownerId) { row.ownerId = appUserId; changed = true; }
    if (seen.has(row.fp)) continue;
    seen.add(row.fp); profiles.push({ fp: row.fp, name: row.name, day: row.day, month: row.month, year: row.year });
  }
  if (changed) save(db);
  return { profiles, unused, purchases: purchases.length };
  });
}
module.exports = { authorizeOrder, listRestorable, fingerprint, validAppUserId, withDeliveryLock, ledgerReady };
