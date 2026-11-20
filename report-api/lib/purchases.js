// Server-side purchase verification + redemption ledger for the Complete Report.
//
// Why: the report endpoint used to email a report to anyone who POSTed a profile and an email.
// Now every order must be backed by a real, not-yet-used "ank_name_report" purchase that RevenueCat
// (the source of truth for App Store receipts) reports for the caller's app user id.
//
// The ledger maps each RevenueCat transaction id to the profile it was spent on. It is what lets
// "Restore Purchases" rebuild report access after a reinstall or device change, and it stops one
// purchase from being reused for many different profiles/emails.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PRODUCT_ID = process.env.REPORT_PRODUCT_ID || 'ank_name_report';
const RC_BASE = process.env.REVENUECAT_API_BASE || 'https://api.revenuecat.com/v1';
const LEDGER_PATH = process.env.REPORT_LEDGER_PATH || path.join(__dirname, '..', 'data', 'ledger.json');
const MAX_SENDS_PER_PURCHASE = Number(process.env.REPORT_MAX_SENDS || 5); // re-sends of the SAME report (retries, lost email)
const ALLOW_SANDBOX = process.env.REPORT_ALLOW_SANDBOX !== '0'; // TestFlight/sandbox purchases count unless disabled

// ---- profile fingerprint: stable across reinstalls (the local profile id is not) ----
function norm(s) { return String(s || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase(); }
function fingerprint(p) { return crypto.createHash('sha256').update(`${norm(p.name)}|${+p.day}|${+p.month}|${+p.year}`).digest('hex').slice(0, 32); }

// ---- ledger (JSON file, atomic writes, serialized in-process) ----
let chain = Promise.resolve();
function withLock(fn) { const run = chain.then(fn, fn); chain = run.catch(() => {}); return run; }
function load() {
  try { return JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')); } catch { return { tx: {} }; }
}
function save(db) {
  fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  const tmp = LEDGER_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, LEDGER_PATH);
}

// ---- RevenueCat ----
async function fetchPurchases(appUserId) {
  const key = process.env.REVENUECAT_SECRET_KEY;
  if (!key) { const e = new Error('purchase verification not configured'); e.status = 500; throw e; }
  const r = await fetch(`${RC_BASE}/subscribers/${encodeURIComponent(appUserId)}`, { headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' } });
  if (!r.ok) { const e = new Error(`purchase lookup failed (${r.status})`); e.status = r.status === 404 ? 402 : 502; throw e; }
  const j = await r.json();
  const list = (j.subscriber && j.subscriber.non_subscriptions && j.subscriber.non_subscriptions[PRODUCT_ID]) || [];
  return list
    .filter((t) => t && t.id && (ALLOW_SANDBOX || !t.is_sandbox))
    .map((t) => ({ id: String(t.id), date: t.purchase_date || t.original_purchase_date || null }))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function validAppUserId(id) { return typeof id === 'string' && id.length >= 6 && id.length <= 200 && !/[\s/]/.test(id); }

/**
 * Authorise one report order. Returns { ok:true, txId } or { ok:false, status, error }.
 * Idempotent: the app retries an order until it gets 2xx, so a purchase already spent on THIS profile
 * (same fingerprint) is reused, up to MAX_SENDS_PER_PURCHASE sends. A purchase spent on a different profile is not.
 */
async function authorizeOrder(appUserId, profile) {
  if (!validAppUserId(appUserId)) return { ok: false, status: 401, error: 'missing purchase identity' };
  let purchases;
  try { purchases = await fetchPurchases(appUserId); } catch (e) { return { ok: false, status: e.status || 502, error: e.message }; }
  if (!purchases.length) return { ok: false, status: 402, error: 'no Complete Report purchase found' };
  const fp = fingerprint(profile);
  return withLock(() => {
    const db = load();
    const owned = purchases.map((p) => p.id);
    // 1. a purchase already spent on this same profile -> allow a bounded re-send
    const same = owned.find((id) => db.tx[id] && db.tx[id].fp === fp);
    if (same) {
      if (db.tx[same].sends >= MAX_SENDS_PER_PURCHASE) return { ok: false, status: 429, error: 'send limit reached for this report' };
      return { ok: true, txId: same, claim: () => withLock(() => { const d = load(); d.tx[same].sends += 1; d.tx[same].last = Date.now(); save(d); }) };
    }
    // 2. an unused purchase -> claim it for this profile
    const free = owned.find((id) => !db.tx[id]);
    if (!free) return { ok: false, status: 402, error: 'all purchases already used; buy another report' };
    db.tx[free] = { fp, name: String(profile.name).slice(0, 80), day: +profile.day, month: +profile.month, year: +profile.year, sends: 0, at: Date.now(), last: Date.now() };
    save(db);
    return { ok: true, txId: free, claim: () => withLock(() => { const d = load(); d.tx[free].sends += 1; d.tx[free].last = Date.now(); save(d); }) };
  });
}

/** What a restoring device needs: the profiles that were bought, plus how many purchases are still unused. */
async function listRestorable(appUserId) {
  if (!validAppUserId(appUserId)) { const e = new Error('missing purchase identity'); e.status = 401; throw e; }
  const purchases = await fetchPurchases(appUserId);
  const db = load();
  const profiles = [], seen = new Set();
  let unused = 0;
  for (const p of purchases) {
    const row = db.tx[p.id];
    if (!row) { unused += 1; continue; }
    if (seen.has(row.fp)) continue;
    seen.add(row.fp);
    profiles.push({ fp: row.fp, name: row.name, day: row.day, month: row.month, year: row.year });
  }
  return { profiles, unused, purchases: purchases.length };
}

module.exports = { authorizeOrder, listRestorable, fingerprint, validAppUserId };
