// One place that turns a profile into everything the screens show.
import { mulank, bhagyank, loShuGrid, personalYear } from './numerology.ts';
import { missingDigits, presentDigits, readLines, missingArrows } from './loshu.ts';
import { monthSeries, yearSeries, todayNumber } from './cycles.ts';

export type Birth = { day: number; month: number; year: number };
export function reading(b: Birth, now: Date) {
  const counts = loShuGrid(b.day, b.month, b.year);
  const t = todayNumber(b.day, b.month, now);
  return {
    mulank: mulank(b.day),
    bhagyank: bhagyank(b.day, b.month, b.year),
    counts, missing: missingDigits(counts), present: presentDigits(counts),
    lines: readLines(counts), missingArrows: missingArrows(counts),
    personalYear: personalYear(b.day, b.month, now.getFullYear()),
    today: t,
    months: monthSeries(b.day, b.month, now.getFullYear(), now.getMonth() + 1, 12),
    years: yearSeries(b.day, b.month, now.getFullYear(), 5),
  };
}
