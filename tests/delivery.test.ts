import test from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../src/config.ts';
import { flush, submitOrder, reportServiceReady } from '../src/services/reportApi.ts';
import { mergePending } from '../src/logic/delivery.ts';
import { createSaveQueue } from '../src/logic/persistence.ts';
const order = { id: 'old', appUserId: 'owner-id', email: 'test@example.com', language: 'en', profile: { id: 'profile', name: 'A', day: 1, month: 1, year: 2000 }, tips: false, createdAt: 1 };
test('report delivery safety', async t => {
  const previous = CONFIG.apiUrl; const fetch = globalThis.fetch;
  t.after(() => { CONFIG.apiUrl = previous; globalThis.fetch = fetch; });
  CONFIG.apiUrl = '';
  assert.equal(await reportServiceReady(order.appUserId), false);
  assert.deepEqual(await flush([order]), [{ ...order, deliveryState: 'queued' }]);
  CONFIG.apiUrl = 'https://example.com';
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: false }), { status: 200 });
  assert.equal(await submitOrder(order), 'rejected');
  globalThis.fetch = async () => new Response('{}', { status: 400 });
  const rejected = await flush([order]); assert.equal(rejected[0].deliveryState, 'needs_attention');
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.equal((await flush([order])).length, 1); // even orders older than 14 days remain
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 202 });
  assert.deepEqual(await flush([order]), []);
  assert.equal((await flush([{ ...order, purchaseState: 'awaiting_purchase' }])).length, 1);
  const newOrder = { ...order, id: 'new' };
  assert.deepEqual(mergePending([order, newOrder], [order], []), [newOrder]);
  const revised = { ...order, email: 'updated@example.com' };
  assert.deepEqual(mergePending([revised], [order], []), [revised]);
});
test('storage writes are ordered and failure can be retried', async () => {
  const saved: number[] = []; let failed = false;
  const save = createSaveQueue(async (n: number) => { if (n === 1) throw new Error('disk'); saved.push(n); }, v => { failed = v; });
  assert.equal(await save(1), false); assert.equal(failed, true);
  const result = await Promise.all([save(2), save(3)]); assert.deepEqual(result, [true, true]);
  assert.deepEqual(saved, [2, 3]); assert.equal(failed, false);
});
