const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

test('durable purchase ledger and delivery retries', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ank-ledger-'));
  const filename = path.join(directory, 'ledger.json');
  const originalPath = process.env.REPORT_LEDGER_PATH, originalKey = process.env.REVENUECAT_SECRET_KEY, originalFetch = global.fetch;
  process.env.REPORT_LEDGER_PATH = filename; process.env.REVENUECAT_SECRET_KEY = 'unit-test-only';
  t.after(() => { global.fetch = originalFetch; fs.rmSync(directory, { recursive: true, force: true }); if (originalPath === undefined) delete process.env.REPORT_LEDGER_PATH; else process.env.REPORT_LEDGER_PATH = originalPath; if (originalKey === undefined) delete process.env.REVENUECAT_SECRET_KEY; else process.env.REVENUECAT_SECRET_KEY = originalKey; });
  global.fetch = async () => new Response(JSON.stringify({ subscriber: { non_subscriptions: { ank_name_report: [{ id: 'tx1' }] } } }), { status: 200 });
  const { authorizeOrder, listRestorable, withDeliveryLock, ledgerReady } = require('../lib/purchases');
  const profile = { name: 'Test Person', day: 1, month: 1, year: 2000 };
  const order = { id: 'order-1', appUserId: 'owner-id', email: 'test@example.com', language: 'en', profile, createdAt: 1 };
  assert.equal(ledgerReady(), false);
  await assert.rejects(listRestorable('owner-id'), /ledger unavailable/);
  fs.writeFileSync(filename, '{broken'); await assert.rejects(authorizeOrder('owner-id', profile, order), /ledger unavailable/);
  fs.writeFileSync(filename, JSON.stringify({ tx: {} }));
  const first = await authorizeOrder('owner-id', profile, order); assert.equal(first.ok, true);
  // A failed send reserves the profile but does not use up its resend allowance.
  assert.equal(JSON.parse(fs.readFileSync(filename)).tx.tx1.sends, 0);
  await first.claim();
  let sent = 0;
  await Promise.all(Array.from({ length: 6 }, () => withDeliveryLock(async () => {
    const auth = await authorizeOrder('owner-id', profile, order);
    if (!auth.alreadySent) { sent++; await auth.claim(); }
  })));
  assert.equal(sent, 0); assert.equal(JSON.parse(fs.readFileSync(filename)).tx.tx1.sends, 1);
  assert.equal((await authorizeOrder('owner-id', profile, { ...order, email: 'different@example.com' })).status, 409);
  assert.equal((await authorizeOrder('owner-id', { ...profile, name: 'Other Person' }, { ...order, id: 'order-2', profile: { ...profile, name: 'Other Person' } })).status, 402);
  assert.equal((await listRestorable('owner-id')).unused, 0);
  fs.unlinkSync(filename); await assert.rejects(listRestorable('owner-id'), /ledger unavailable/);
});
