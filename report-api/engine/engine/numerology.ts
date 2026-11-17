// Pure numerology calculation engine. No side effects, no I/O.
export type Reduced = { value: number; compound: number | null };

export function reduce(n: number, keepMaster = false): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9) {
    if (keepMaster && (x === 11 || x === 22 || x === 33)) return x;
    x = String(x).split('').reduce((a, d) => a + Number(d), 0);
  }
  return x;
}

const digitsOf = (s: string) => s.replace(/\D/g, '').split('').map(Number);

export const CHALDEAN: Record<string, number> = {};
for (const [v, letters] of Object.entries({
  1: 'AIJQY', 2: 'BKR', 3: 'CGLS', 4: 'DMT', 5: 'EHNX', 6: 'UVW', 7: 'OZ', 8: 'FP',
})) for (const ch of letters) CHALDEAN[ch] = Number(v);

export const PYTHAGOREAN: Record<string, number> = {};
'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((ch, i) => (PYTHAGOREAN[ch] = (i % 9) + 1));

const letters = (name: string) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');

export function mulank(day: number): number { return reduce(day); }

export function bhagyank(day: number, month: number, year: number): number {
  const sum = digitsOf(`${day}${month}${year}`).reduce((a, b) => a + b, 0);
  return reduce(sum);
}

export function lifePath(day: number, month: number, year: number): number {
  return reduce(reduce(day, true) + reduce(month, true) + reduce(year, true), true);
}

export function chaldeanName(name: string): Reduced {
  const total = [...letters(name)].reduce((a, c) => a + CHALDEAN[c], 0);
  return { value: reduce(total), compound: total > 9 ? total : null };
}

export function pythagoreanName(name: string) {
  const L = [...letters(name)];
  const vowels = new Set('AEIOU');
  const sum = (xs: string[]) => xs.reduce((a, c) => a + PYTHAGOREAN[c], 0);
  const v = L.filter((c) => vowels.has(c));
  const c = L.filter((x) => !vowels.has(x));
  return {
    expression: reduce(sum(L), true),
    soulUrge: reduce(sum(v), true),
    personality: reduce(sum(c), true),
    totals: { expression: sum(L), soulUrge: sum(v), personality: sum(c) },
  };
}

export function loShuGrid(day: number, month: number, year: number): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  for (const d of digitsOf(`${day}${month}${year}`)) if (d > 0) counts[d]++;
  return counts;
}

export function personalYear(day: number, month: number, calendarYear: number): number {
  return reduce(reduce(day) + reduce(month) + reduce(calendarYear));
}
export function personalMonth(py: number, calendarMonth: number): number {
  return reduce(py + reduce(calendarMonth));
}
export function personalDay(pm: number, dayOfMonth: number): number {
  return reduce(pm + reduce(dayOfMonth));
}

export function isValidDate(day: number, month: number, year: number): boolean {
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}
