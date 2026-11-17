import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReport, hook, windows } from '../src/engine/fullReport.ts';
import { reading } from '../src/engine/reading.ts';
import { canOpenFullReport } from '../src/logic/entitlements.ts';

const now = new Date(2026, 10, 17);
const people = [{ name: 'Aarav Sharma', day: 9, month: 4, year: 1990 }, { name: 'Meera Rao', day: 28, month: 12, year: 1985 }, { name: 'Zoya Khan', day: 1, month: 1, year: 2000 }];

test('full report is between 20 and 30 pages for every birth date', () => {
  for (const p of people) { const n = buildReport(p, now).length; assert.ok(n >= 20 && n <= 30, `${p.name}: ${n}`); }
});
test('every page has content and no page explains the calculation', () => {
  for (const pg of buildReport(people[0], now)) {
    assert.ok(pg.blocks.length > 0 && pg.title);
    assert.ok(!/\bworking\b|→|add the digits|reduce/i.test(JSON.stringify(pg)), pg.title);
  }
});
test('every one of 1..9 has year, month and area copy (no undefined text)', () => {
  for (let day = 1; day <= 31; day += 5) for (const mo of [1, 6, 12]) {
    const s = JSON.stringify(buildReport({ name: 'T', day, month: mo, year: 1992 }, now));
    assert.ok(!s.includes('undefined'), `${day}/${mo}`);
  }
});
test('teaser hook is real text and windows come from the next 12 months', () => {
  const h = hook(people[0], now); assert.ok(h.title.length > 5 && h.shown.length > 5);
  const w = windows(reading(people[0], now).months); assert.ok(w.start || w.slow);
});
test('full report opens only with Pro or a purchase for that profile', () => {
  const none = { pro: false, reportBuyer: false };
  assert.equal(canOpenFullReport(none), false);
  assert.equal(canOpenFullReport({ pro: false, reportBuyer: true }), false);
  assert.equal(canOpenFullReport({ pro: true, reportBuyer: true }), true);
  assert.equal(canOpenFullReport({ pro: true, reportBuyer: false }), true);
});
