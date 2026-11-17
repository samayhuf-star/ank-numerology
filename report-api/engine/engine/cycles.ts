import { personalYear, personalMonth, personalDay } from './numerology.ts';

export type MonthPoint = { year: number; month: number; number: number };

/** Personal Month numbers for `count` months starting at (year, month). Personal Year follows the calendar year. */
export function monthSeries(day: number, birthMonth: number, startYear: number, startMonth: number, count = 12): MonthPoint[] {
  const out: MonthPoint[] = [];
  let y = startYear, m = startMonth;
  for (let i = 0; i < count; i++) {
    const py = personalYear(day, birthMonth, y);
    out.push({ year: y, month: m, number: personalMonth(py, m) });
    m++; if (m > 12) { m = 1; y++; }
  }
  return out;
}

export function yearSeries(day: number, birthMonth: number, startYear: number, count = 5) {
  return Array.from({ length: count }, (_, i) => ({ year: startYear + i, number: personalYear(day, birthMonth, startYear + i) }));
}

export function todayNumber(day: number, birthMonth: number, now: Date) {
  const py = personalYear(day, birthMonth, now.getFullYear());
  const pm = personalMonth(py, now.getMonth() + 1);
  return { year: py, month: pm, day: personalDay(pm, now.getDate()) };
}

export const daysIndex = (d: Date) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
