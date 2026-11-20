import test from 'node:test';
import assert from 'node:assert/strict';
import { canCheck, recordCheck, newUsage, canOpenNameReport } from '../src/logic/entitlements.ts';
import { loShuGrid } from '../src/engine/numerology.ts';
import { readLines, missingDigits, missingArrows, completeArrows } from '../src/engine/loshu.ts';
import { monthSeries, yearSeries, todayNumber } from '../src/engine/cycles.ts';
import { nameReport, variants, checkSpelling } from '../src/engine/nameReport.ts';

const none = { reportBuyer: false, pro: false };

test('free user gets exactly one check, then is blocked', () => {
  let u = newUsage();
  assert.equal(canCheck(none, u, 100).allowed, true);
  u = recordCheck(none, u, 100);
  const r = canCheck(none, u, 100);
  assert.deepEqual(r, { allowed: false, reason: 'free_used' });
  assert.deepEqual(canCheck(none, u, 101), { allowed: false, reason: 'free_used' }); // never resets
});

test('report buyer gets 5 a day and resets next day', () => {
  const b = { reportBuyer: true, pro: false };
  let u = newUsage();
  for (let i = 0; i < 5; i++) { assert.equal(canCheck(b, u, 50).allowed, true); u = recordCheck(b, u, 50); }
  assert.deepEqual(canCheck(b, u, 50), { allowed: false, reason: 'daily_limit', resetsOnDay: 51 });
  const next = canCheck(b, u, 51);
  assert.equal(next.allowed, true);
  if (next.allowed) assert.equal(next.remaining, 5);
});

test('buyer who already used the free check keeps 5 a day', () => {
  let u = recordCheck(none, newUsage(), 10);
  const b = { reportBuyer: true, pro: false };
  const r = canCheck(b, u, 10);
  assert.equal(r.allowed, true);
});

test('pro is unlimited and does not change usage', () => {
  const p = { reportBuyer: false, pro: true };
  let u = newUsage();
  for (let i = 0; i < 50; i++) u = recordCheck(p, u, 7);
  assert.deepEqual(u, { freeUsed: 0, day: 7, today: 0 });
  assert.deepEqual(canCheck(p, u, 7), { allowed: true, plan: 'pro', remaining: null });
});

test('blocked check does not consume usage', () => {
  let u = recordCheck(none, newUsage(), 3);
  const again = recordCheck(none, u, 3);
  assert.equal(again.freeUsed, 1);
});

test('name report is per profile', () => {
  assert.equal(canOpenNameReport(['a'], 'a'), true);
  assert.equal(canOpenNameReport(['a'], 'b'), false);
});

const grid = loShuGrid(27, 3, 1990);
test('lo shu missing digits and arrows for 27/03/1990', () => {
  assert.deepEqual(missingDigits(grid), [4, 5, 6, 8]);
  const lines = readLines(grid);
  const det = lines.find((l) => l.id === 'determination')!;
  assert.equal(det.status, 'empty');
  assert.deepEqual(missingArrows(grid).map((l) => l.id), ['determination']);
  assert.equal(completeArrows(grid).length, 0);
  assert.equal(lines.find((l) => l.id === 'thinking')!.status, 'partial');
});

test('a full grid has all complete', () => {
  const full = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1 };
  assert.ok(readLines(full).every((l) => l.status === 'complete'));
});

test('12-month series matches the sample report', () => {
  const s = monthSeries(27, 3, 2026, 11, 12).map((p) => p.number);
  assert.deepEqual(s, [6, 7, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6]);
});

test('five-year series 2026-2030 is 4,5,6,7,8', () => {
  assert.deepEqual(yearSeries(27, 3, 2026).map((y) => y.number), [4, 5, 6, 7, 8]);
});

test('today number for 15 Nov 2026 with 27 March birth', () => {
  const t = todayNumber(27, 3, new Date(2026, 10, 15));
  assert.equal(t.year, 4); assert.equal(t.month, 6);
});

test('name report keeps Aarav Sharma (27 -> 9 matches Mulank 9)', () => {
  const r = nameReport('Aarav Sharma', 27, 3, 1990);
  assert.equal(r.current.number, 9);
  assert.equal(r.current.compound, 27);
  assert.equal(r.current.matchesMulank, true);
  assert.equal(r.verdict, 'keep');
  const byName = Object.fromEntries(r.options.map((o) => [o.spelling, o.number]));
  assert.equal(byName['Arav Sharma'], 8);
  assert.equal(byName['Aarav Sharmaa'], 1);
  assert.equal(byName['Aarav Sharman'], 5);
});

test('variants never include accents or empty names', () => {
  assert.deepEqual(variants('   '), []);
  assert.ok(variants('José Álvarez').every((v) => /^[A-Za-z ]+$/.test(v)));
});

test('checkSpelling flags a spelling that adds a missing digit', () => {
  const o = checkSpelling('Arav Sharma', 27, 3, 1990);
  assert.deepEqual(o.addsMissing, [8]);
  assert.equal(o.matchesMulank, false);
});

import { mergeRestored } from '../src/logic/restore.ts';
test('restore marks existing profile paid by name + dob and re-creates a missing one', () => {
  const local = [{ id: 'a1', name: 'Asha  Rao', day: 3, month: 4, year: 1990 }];
  const r = mergeRestored(local, [], [
    { fp: 'f1', name: 'asha rao', day: 3, month: 4, year: 1990 },
    { fp: 'f2', name: 'Ravi', day: 1, month: 2, year: 1985 },
  ]);
  assert.equal(r.profiles.length, 2);
  assert.deepEqual(r.paidProfiles.sort(), ['a1', 'rf2']);
  assert.equal(canOpenNameReport(r.paidProfiles, 'rf2'), true);
  assert.deepEqual(mergeRestored(r.profiles, r.paidProfiles, []).paidProfiles.sort(), ['a1', 'rf2']); // idempotent
});
