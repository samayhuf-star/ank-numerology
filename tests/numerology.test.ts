import test from 'node:test';
import assert from 'node:assert/strict';
import * as n from '../src/engine/numerology.ts';

test('reduce', () => {
  assert.equal(n.reduce(27), 9);
  assert.equal(n.reduce(11), 2);
  assert.equal(n.reduce(11, true), 11);
  assert.equal(n.reduce(29, true), 11);
  assert.equal(n.reduce(0), 0);
});
test('mulank and bhagyank (27/03/1990)', () => {
  assert.equal(n.mulank(27), 9);
  assert.equal(n.bhagyank(27, 3, 1990), 4);
});
test('life path (27/03/1990)', () => assert.equal(n.lifePath(27, 3, 1990), 4));
test('life path keeps master 11 (01/01/1998)', () => assert.equal(n.lifePath(1, 1, 1998), 11));
test('chaldean name: Aarav Sharma = 27 -> 9', () => {
  assert.deepEqual(n.chaldeanName('Aarav Sharma'), { value: 9, compound: 27 });
  assert.equal(n.chaldeanName('Arav Sharma').value, 8);
  assert.equal(n.chaldeanName('Aarav Sharmaa').compound, 28);
  assert.equal(n.chaldeanName('Aaravv Sharma').compound, 33);
  assert.equal(n.chaldeanName('Aarav Sharman').compound, 32);
});
test('chaldean never assigns 9', () => assert.ok(!Object.values(n.CHALDEAN).includes(9)));
test('pythagorean: Aarav Sharma', () => {
  const r = n.pythagoreanName('Aarav Sharma');
  assert.deepEqual(r.totals, { expression: 40, soulUrge: 5, personality: 35 });
  assert.equal(r.expression, 4); assert.equal(r.soulUrge, 5); assert.equal(r.personality, 8);
});
test('name handles accents, spaces and punctuation', () => {
  assert.equal(n.chaldeanName('  Zoë-Anne ').compound, n.chaldeanName('ZOEANNE').compound);
  assert.deepEqual(n.chaldeanName(''), { value: 0, compound: null });
});
test('lo shu grid (27/03/1990)', () => {
  const g = n.loShuGrid(27, 3, 1990);
  assert.equal(g[9], 2); assert.equal(g[1], 1); assert.equal(g[2], 1);
  assert.equal(g[3], 1); assert.equal(g[7], 1);
  for (const k of [4, 5, 6, 8]) assert.equal(g[k], 0);
});
test('personal cycles on 15 Nov 2026', () => {
  const py = n.personalYear(27, 3, 2026); assert.equal(py, 4);
  const pm = n.personalMonth(py, 11); assert.equal(pm, 6);
  assert.equal(n.personalDay(pm, 15), 3);
});
test('personal month next year', () => {
  assert.equal(n.personalYear(27, 3, 2027), 5);
  assert.equal(n.personalMonth(5, 3), 8);
});
test('date validation incl. leap day', () => {
  assert.ok(n.isValidDate(29, 2, 2024)); assert.ok(!n.isValidDate(29, 2, 2025));
  assert.ok(!n.isValidDate(31, 4, 2026)); assert.ok(n.isValidDate(27, 3, 1990));
});
