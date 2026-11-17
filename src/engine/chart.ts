// Full chart: every number the Complete Report needs, with the working kept so the report can show it.
import { CHALDEAN, reduce, mulank, bhagyank, loShuGrid, personalYear, personalMonth, personalDay } from './numerology.ts';
import { missingDigits, presentDigits, readLines } from './loshu.ts';
import { relation, type Rel } from '../content/deep.ts';

export type Sum = { terms: { ch: string; v: number }[]; total: number; chain: string[]; number: number; compound: number | null };

const lettersOf = (s: string) => [...s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '')];

export function sumOf(chars: string[]): Sum {
  const terms = chars.map((ch) => ({ ch, v: CHALDEAN[ch] ?? 0 }));
  const total = terms.reduce((a, t) => a + t.v, 0);
  const chain: string[] = []; let x = total;
  while (x > 9) { const ds = String(x).split(''); const n = ds.reduce((a, d) => a + Number(d), 0); chain.push(`${x} → ${ds.join(' + ')} = ${n}`); x = n; }
  return { terms, total, chain, number: x, compound: total > 9 ? total : null };
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export type NameParts = { words: { word: string; sum: Sum }[]; full: Sum; first: Sum; last: Sum | null; vowels: Sum; consonants: Sum };
export function nameParts(name: string): NameParts {
  const words = name.normalize('NFKD').replace(/[^A-Za-z ]/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const all = words.flatMap((w) => lettersOf(w));
  return {
    words: words.map((word) => ({ word, sum: sumOf(lettersOf(word)) })),
    full: sumOf(all),
    first: sumOf(lettersOf(words[0] ?? '')),
    last: words.length > 1 ? sumOf(lettersOf(words[words.length - 1])) : null,
    vowels: sumOf(all.filter((c) => VOWELS.has(c))),
    consonants: sumOf(all.filter((c) => !VOWELS.has(c))),
  };
}

export type Birth = { name: string; day: number; month: number; year: number };

export type Pinnacle = { n: number; ch: number; from: number; to: number | null };
export function pinnacles(b: Birth): { list: Pinnacle[]; lp: number } {
  const m = reduce(b.month), d = reduce(b.day), y = reduce(b.year);
  const lp = reduce(m + d + y);
  const p1 = reduce(m + d), p2 = reduce(d + y), p3 = reduce(p1 + p2), p4 = reduce(m + y);
  const c1 = Math.abs(m - d), c2 = Math.abs(d - y), c3 = Math.abs(c1 - c2), c4 = Math.abs(m - y);
  const end1 = 36 - lp;
  return { lp, list: [
    { n: p1, ch: c1, from: 0, to: end1 }, { n: p2, ch: c2, from: end1 + 1, to: end1 + 9 },
    { n: p3, ch: c3, from: end1 + 10, to: end1 + 18 }, { n: p4, ch: c4, from: end1 + 19, to: null },
  ] };
}

export type DayCell = { date: number; dow: number; pd: number };
export function monthDays(b: Birth, year: number, month: number): { cells: DayCell[]; pm: number; py: number } {
  const py = personalYear(b.day, b.month, year);
  const pm = personalMonth(py, month);
  const n = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = Array.from({ length: n }, (_, i) => ({ date: i + 1, dow: new Date(Date.UTC(year, month - 1, i + 1)).getUTCDay(), pd: personalDay(pm, i + 1) }));
  return { cells, pm, py };
}

export type Harmony = { a: string; b: string; an: number; bn: number; rel: Rel };
export function harmony(pairs: [string, number, string, number][]): Harmony[] {
  return pairs.map(([a, an, b, bn]) => ({ a, b, an, bn, rel: relation(an, bn) }));
}

export function chart(b: Birth, now: Date) {
  const counts = loShuGrid(b.day, b.month, b.year);
  const parts = nameParts(b.name);
  const mu = mulank(b.day), bh = bhagyank(b.day, b.month, b.year);
  const digits = `${b.day}${b.month}${b.year}`.split('').map(Number);
  const dobSum = digits.reduce((a, d) => a + d, 0);
  const pin = pinnacles(b);
  const age = now.getFullYear() - b.year - (now.getMonth() + 1 < b.month || (now.getMonth() + 1 === b.month && now.getDate() < b.day) ? 1 : 0);
  const y = now.getFullYear();
  return {
    counts, parts, mu, bh, digits, dobSum, pin, age,
    missing: missingDigits(counts), present: presentDigits(counts), lines: readLines(counts),
    nameNo: parts.full.number,
    rels: {
      nameMu: relation(parts.full.number, mu), nameBh: relation(parts.full.number, bh), muBh: relation(mu, bh),
    },
    years: Array.from({ length: 9 }, (_, i) => ({ year: y + i, n: personalYear(b.day, b.month, y + i), age: age + i })),
    py: personalYear(b.day, b.month, y),
    karmicDebt: [...new Set([b.day, dobSum, parts.full.compound ?? 0].filter((n) => [13, 14, 16, 19].includes(n)))],
  };
}
export type Chart = ReturnType<typeof chart>;
