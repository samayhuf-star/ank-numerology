import { chaldeanName, mulank, bhagyank, loShuGrid } from './numerology.ts';
import { missingDigits } from './loshu.ts';

export type SpellingOption = { spelling: string; compound: number | null; number: number; matchesMulank: boolean; matchesBhagyank: boolean; addsMissing: number[]; current: boolean };

function clean(s: string) { return s.normalize('NFKD').replace(/[^A-Za-z ]/g, '').replace(/\s+/g, ' ').trim(); }

/** Small, deterministic spelling variants for the name check: drop a doubled letter, double the last letter, double a vowel before the last name. */
export function variants(full: string): string[] {
  const name = clean(full);
  if (!name) return [];
  const parts = name.split(' ');
  const out = new Set<string>([name]);
  const last = parts.length - 1;
  for (let p = 0; p < parts.length; p++) {
    const w = parts[p];
    // double the final letter
    out.add([...parts.slice(0, p), w + w[w.length - 1], ...parts.slice(p + 1)].join(' '));
    // drop one of a doubled vowel, e.g. Aarav -> Arav
    const m = w.match(/([AEIOUaeiou])\1/i);
    if (m) out.add([...parts.slice(0, p), w.replace(m[0], m[1]), ...parts.slice(p + 1)].join(' '));
    // double a middle vowel
    const i = w.search(/[AEIOUaeiou]/);
    if (i >= 0 && !m) out.add([...parts.slice(0, p), w.slice(0, i + 1) + w[i] + w.slice(i + 1), ...parts.slice(p + 1)].join(' '));
  }
  // add an "n" to the last name (Sharma -> Sharman)
  if (last >= 0) out.add([...parts.slice(0, last), parts[last] + 'n'].join(' '));
  return [...out];
}

export function checkSpelling(spelling: string, d: number, m: number, y: number, current = false): SpellingOption {
  const r = chaldeanName(spelling);
  const counts = loShuGrid(d, m, y);
  const missing = missingDigits(counts);
  return {
    spelling: clean(spelling), compound: r.compound, number: r.value,
    matchesMulank: r.value === mulank(d), matchesBhagyank: r.value === bhagyank(d, m, y),
    addsMissing: missing.includes(r.value) ? [r.value] : [], current,
  };
}

export function nameReport(full: string, d: number, m: number, y: number) {
  const cur = checkSpelling(full, d, m, y, true);
  const options = variants(full).filter((v) => v !== clean(full)).map((v) => checkSpelling(v, d, m, y));
  return {
    current: cur, options,
    verdict: cur.matchesMulank || cur.matchesBhagyank ? 'keep' as const : 'consider' as const,
  };
}
