// The Complete Report: Part 1 Name Match (with full working) + Part 2 Future Report, as one list of pages.
import { buildReport, type Page } from './fullReport.ts';
import { buildNameMatch } from './nameMatch.ts';

export type Who = { name: string; day: number; month: number; year: number };
export const PRICE_FALLBACK = { IN: '₹499', world: '$9.99' } as const;

export function buildComplete(b: Who, now: Date): Page[] {
  const nm = buildNameMatch(b), fu = buildReport(b, now);
  const first = b.name.split(' ')[0];
  const toc: Page = { kicker: 'Your complete report', title: `${first}, your complete numerology report`, blocks: [
    { k: 'p', t: `Prepared for ${b.name}, born ${b.day}/${b.month}/${b.year}. One report in two parts: how your name and birth date work together, with every step shown, then your past, present and future.` },
    { k: 'table', head: ['Part', 'What it covers', 'Pages'], widths: [0.6, 3, 0.8], rows: [['1', 'Name Match: your name worked out letter by letter, your birth numbers, and whether they agree', nm.length - 1], ['2', 'Future Report: your nature, grid, last 3 years, this year, 12 months, next 5 years, career, money, love, health, 30-day plan', fu.length - 1]] },
  ] };
  return [toc, ...nm.slice(1).map((p) => ({ ...p, kicker: `Part 1 · ${p.kicker}` })), ...fu.slice(1).map((p) => ({ ...p, kicker: `Part 2 · ${p.kicker}` }))];
}
