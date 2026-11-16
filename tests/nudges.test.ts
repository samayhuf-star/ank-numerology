import test from 'node:test';
import assert from 'node:assert/strict';
import { plan, copyFor, ANGLES } from '../src/engine/nudges.ts';

const ctx = { firstName: 'Aarav', personalDay: 3, nextMonthNumber: 7, missing: [4, 5, 6, 8], luckyColour: 'Gold' };
const s = { optedIn: true, purchased: false, startDay: 100, lastOpenDay: 100 };

test('no nudges without opt-in', () => assert.deepEqual(plan({ ...s, optedIn: false }, 100, 14, ctx), []));
test('no nudges after purchase', () => assert.deepEqual(plan({ ...s, purchased: true }, 100, 14, ctx), []));
test('pauses after 30 idle days', () => {
  assert.equal(plan(s, 131, 14, ctx).length, 0);
  assert.equal(plan(s, 130, 14, ctx).length, 14);
});
test('one nudge per day, different angle each consecutive day', () => {
  const p = plan(s, 100, 20, ctx);
  assert.equal(p.length, 20);
  for (let i = 1; i < p.length; i++) assert.notEqual(p[i].angle, p[i - 1].angle);
  assert.equal(new Set(p.slice(0, 10).map((x) => x.angle)).size, 10);
});
test('rotation is deterministic and wraps', () => {
  assert.equal(plan(s, 110, 1, ctx)[0].angle, ANGLES[0]);
});
test('copy is personalised and fits notification size', () => {
  for (const a of ANGLES) {
    const c = copyFor(a, ctx);
    assert.ok(c.title.length <= 50, a); assert.ok(c.body.length <= 120, a);
  }
  assert.match(copyFor('personalDay', ctx).title, /Aarav/);
  assert.match(copyFor('missingDigits', ctx).body, /4, 5, 6, 8/);
});
test('no fake urgency or scarcity words', () => {
  for (const a of ANGLES) assert.doesNotMatch(JSON.stringify(copyFor(a, ctx)), /last chance|only today|hurry|expires|limited time/i);
});
