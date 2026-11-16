import test from 'node:test';
import assert from 'node:assert/strict';
import { reading } from '../src/engine/reading.ts';
import { MULANK, YEAR_THEME, DIGIT_MISSING, LUCKY, DAY_GOOD, BHAGYANK } from '../src/content/en.ts';

test('reading for 27 March 1990 on 15 Nov 2026', () => {
  const r = reading({ day: 27, month: 3, year: 1990 }, new Date(2026, 10, 15));
  assert.equal(r.mulank, 9); assert.equal(r.bhagyank, 4); assert.equal(r.personalYear, 4);
  assert.deepEqual(r.missing, [4, 5, 6, 8]);
  assert.equal(r.months.length, 12); assert.equal(r.months[0].number, 6);
  assert.deepEqual(r.years.map((y) => y.number), [4, 5, 6, 7, 8]);
});
test('content exists for every number 1-9', () => {
  for (let n = 1; n <= 9; n++) {
    assert.ok(MULANK[n] && YEAR_THEME[n] && DIGIT_MISSING[n] && LUCKY[n] && DAY_GOOD[n] && BHAGYANK[n], `missing content for ${n}`);
  }
});
test('every possible birth date gives numbers 1-9 and valid reading', () => {
  for (let m = 1; m <= 12; m++) for (let d = 1; d <= 28; d++) {
    const r = reading({ day: d, month: m, year: 1985 }, new Date(2026, 10, 15));
    assert.ok(r.mulank >= 1 && r.mulank <= 9); assert.ok(r.bhagyank >= 1 && r.bhagyank <= 9);
    assert.ok(r.months.every((p) => p.number >= 1 && p.number <= 9));
  }
});
