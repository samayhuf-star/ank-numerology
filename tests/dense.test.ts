import test from 'node:test';
import assert from 'node:assert/strict';
import { chart, nameParts, pinnacles, monthDays } from '../src/engine/chart.ts';
import { buildComplete } from '../src/engine/complete.ts';
import { renderHtml } from '../src/engine/html.ts';
import { COMPOUND, NUM, relation } from '../src/content/deep.ts';

const P = { name: 'Priya Verma', day: 23, month: 11, year: 1992 };
const now = new Date('2026-11-17');

test('name parts: vowels + consonants = full, words add up', () => {
  const n = nameParts(P.name);
  assert.equal(n.vowels.total + n.consonants.total, n.full.total);
  assert.equal(n.words.reduce((a, w) => a + w.sum.total, 0), n.full.total);
  assert.equal(n.full.total, 31); assert.equal(n.full.number, 4); assert.equal(n.full.compound, 31);
});
test('pinnacles follow the classical method', () => {
  const { list, lp } = pinnacles(P);
  assert.equal(lp, 1);
  assert.deepEqual(list.map((x) => x.n), [7, 8, 6, 5]);
  assert.equal(list[0].to, 35); assert.equal(list[1].from, 36); assert.equal(list[3].to, null);
});
test('planetary friendship is symmetric where it should be and every number has a profile', () => {
  for (let n = 1; n <= 9; n++) { assert.ok(NUM[n].core.length === 3); assert.equal(relation(n, n), 'same'); }
  assert.equal(relation(1, 2), 'friend'); assert.equal(relation(1, 8), 'enemy');
});
test('every compound 10 to 52 has a meaning', () => { for (let n = 10; n <= 52; n++) assert.ok(COMPOUND[n]?.text.length > 20, String(n)); });
test('month calendar has the right number of days and a personal day on each', () => {
  const m = monthDays(P, 2027, 2); assert.equal(m.cells.length, 28); assert.ok(m.cells.every((x) => x.pd >= 1 && x.pd <= 9));
});
test('complete report is dense, has no undefined text, and renders', () => {
  const pages = buildComplete(P, now);
  assert.ok(pages.length >= 45);
  const json = JSON.stringify(pages);
  assert.ok(!json.includes('undefined') && !json.includes('NaN') && !json.includes('[object'));
  const html = renderHtml(pages, 't');
  assert.ok(html.includes('<svg') && html.includes('class="cal"'));
  assert.equal(chart(P, now).years.length, 9);
});
test('report works for a name with one word and for day 9', () => {
  const pages = buildComplete({ name: 'Madonna', day: 9, month: 9, year: 1999 }, now);
  assert.ok(!JSON.stringify(pages).includes('undefined'));
});
test('bhagyank working shows the full reduction', () => {
  const j = JSON.stringify(buildComplete({ name: 'Amit Kumar Singh', day: 14, month: 7, year: 1988 }, now));
  assert.ok(j.includes('= 38 → 3 + 8 = 11 → 1 + 1 = 2'));
});
import { buildFreeFlow } from '../src/engine/freeFlow.ts';
test('free flow shows the full Bhagyank reduction', () => {
  assert.ok(JSON.stringify(buildFreeFlow({ name: 'Amit Kumar', day: 14, month: 7, year: 1988 }, now)).includes('3 + 8 = 11 → 1 + 1 = 2'));
});
