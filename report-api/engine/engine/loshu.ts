// Lo Shu planes and arrows. Layout: 4 9 2 / 3 5 7 / 8 1 6.
export const LAYOUT: number[][] = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];

export type Line = { id: string; kind: 'plane' | 'arrow'; name: string; digits: [number, number, number] };

export const LINES: Line[] = [
  { id: 'thinking', kind: 'plane', name: 'Thinking plane', digits: [4, 9, 2] },
  { id: 'feeling', kind: 'plane', name: 'Feeling plane', digits: [3, 5, 7] },
  { id: 'practical', kind: 'plane', name: 'Practical plane', digits: [8, 1, 6] },
  { id: 'planning', kind: 'arrow', name: 'Planning', digits: [4, 3, 8] },
  { id: 'willpower', kind: 'arrow', name: 'Willpower', digits: [9, 5, 1] },
  { id: 'action', kind: 'arrow', name: 'Action', digits: [2, 7, 6] },
  { id: 'determination', kind: 'arrow', name: 'Determination', digits: [4, 5, 6] },
  { id: 'intuition', kind: 'arrow', name: 'Intuition', digits: [2, 5, 8] },
];

export type LineStatus = 'complete' | 'partial' | 'empty';
export type LineReading = Line & { present: number[]; missing: number[]; status: LineStatus };

export function readLines(counts: Record<number, number>): LineReading[] {
  return LINES.map((l) => {
    const present = l.digits.filter((d) => (counts[d] ?? 0) > 0);
    const missing = l.digits.filter((d) => (counts[d] ?? 0) === 0);
    const status: LineStatus = present.length === 3 ? 'complete' : present.length === 0 ? 'empty' : 'partial';
    return { ...l, present, missing, status };
  });
}

export const missingDigits = (counts: Record<number, number>): number[] =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => (counts[d] ?? 0) === 0);

export const presentDigits = (counts: Record<number, number>): number[] =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => (counts[d] ?? 0) > 0);

export const completeArrows = (counts: Record<number, number>) =>
  readLines(counts).filter((l) => l.kind === 'arrow' && l.status === 'complete');

export const missingArrows = (counts: Record<number, number>) =>
  readLines(counts).filter((l) => l.kind === 'arrow' && l.status === 'empty');
