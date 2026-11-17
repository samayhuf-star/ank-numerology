import test from 'node:test';
import assert from 'node:assert/strict';
import { working, buildNameMatch } from '../src/engine/nameMatch.ts';
import { chaldeanName } from '../src/engine/numerology.ts';

test('working matches the engine and shows the reduction chain', () => {
  const w = working('Priya Verma');
  assert.equal(w.total, 31);
  assert.equal(w.number, chaldeanName('Priya Verma').value);
  assert.deepEqual(w.steps, ['31 → 3 + 1 = 4']);
  assert.deepEqual(w.words.map((x) => x.sub), [13, 18]);
});
test('name match report flags a mismatch and offers matching spellings', () => {
  const p = buildNameMatch({ name: 'Priya Verma', day: 23, month: 11, year: 1992 });
  assert.ok(p.length >= 8);
  assert.ok(JSON.stringify(p).includes('does not match'));
});

import { buildFreeFlow } from '../src/engine/freeFlow.ts';
test('free flow has 7 cards', () => {
  assert.equal(buildFreeFlow({ name: 'Priya Verma', day: 23, month: 11, year: 1992 }, new Date('2026-11-17')).length, 7);
});
