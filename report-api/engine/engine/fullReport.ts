// Builds the paid Full Future Report as a list of pages from one profile. Pure, so it can be tested.
// The report tells the reader their past, present and future. It never explains how the numbers are calculated.
import { reading, type Birth } from './reading.ts';
import { personalYear } from './numerology.ts';
import type { MonthPoint } from './cycles.ts';
import { BHAGYANK, DIGIT_HAVE, DIGIT_MISSING, ARROW_MISSING, LUCKY, MULANK, PLANET, YEAR_THEME } from '../content/en.ts';
import { AREA, MONTH_NOTE, PAIR_NOTE, YEAR_DEEP } from '../content/report.ts';

export const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const monthLabel = (p: MonthPoint) => `${MONTH_FULL[p.month - 1]} ${p.year}`;

export type Block =
  | { k: 'h'; t: string }
  | { k: 'p'; t: string }
  | { k: 'bul'; items: string[] }
  | { k: 'table'; head: string[]; rows: (string | number)[][]; widths?: number[] }
  | { k: 'stats'; items: { label: string; value: string | number; sub?: string }[] }
  | { k: 'grid'; counts: Record<number, number>; caption?: string }
  | { k: 'bars'; title?: string; items: { l: string; v: number; sub?: string }[]; max?: number; caption?: string }
  | { k: 'tiles'; items: { top: string; main: string | number }[]; caption?: string }
  | { k: 'cal'; title: string; startDow: number; cells: { date: number; pd: number }[]; caption?: string }
  | { k: 'note'; t: string };
export type Page = { kicker: string; title: string; blocks: Block[] };

const START_NUMBERS = [1, 3, 5, 8];
const SLOW_NUMBERS = [7, 4, 9, 2];

/** First strong window to start things, and first window to slow down, among the next twelve months. */
export function windows(months: MonthPoint[]) {
  const start = months.find((m) => START_NUMBERS.includes(m.number)) ?? null;
  const slow = months.find((m) => SLOW_NUMBERS.includes(m.number)) ?? null;
  return { start, slow };
}

export function buildReport(b: Birth & { name: string }, now: Date): Page[] {
  const r = reading(b, now);
  const y = now.getFullYear();
  const mk = MULANK[r.mulank], bh = BHAGYANK[r.bhagyank];
  const area = AREA[r.mulank], bArea = AREA[r.bhagyank];
  const yd = YEAR_DEEP[r.personalYear];
  const first = b.name.split(' ')[0] || b.name;
  const pages: Page[] = [];
  const add = (kicker: string, title: string, blocks: Block[]) => pages.push({ kicker, title, blocks });

  add('Your report', `${first}, your future in numbers`, [
    { k: 'p', t: `Prepared for ${b.name}, born ${b.day}/${b.month}/${b.year}. This report reads your birth numbers and your Lo Shu grid and tells you about your past, your present and the years ahead.` },
    { k: 'stats', items: [{ label: 'Mulank', value: r.mulank, sub: PLANET[r.mulank] }, { label: 'Bhagyank', value: r.bhagyank, sub: PLANET[r.bhagyank] }, { label: `Year ${y}`, value: r.personalYear, sub: YEAR_THEME[r.personalYear].name }] },
    { k: 'p', t: `In one line: ${mk.short} Your life is moving toward "${bh.theme.toLowerCase()}", and ${y} is a year of ${YEAR_THEME[r.personalYear].name.toLowerCase()}.` },
    { k: 'p', t: 'Read this as guidance for reflection, not as a promise. Numbers describe tendencies. What you do with them is yours.' },
  ]);

  add('Who you are', `Mulank ${r.mulank}: your nature`, [
    { k: 'p', t: `${mk.short} Your ruling planet in this tradition is ${PLANET[r.mulank]}.` },
    { k: 'table', head: ['Area', 'Reading'], widths: [1, 2.5], rows: [['Strengths', mk.strengths], ['Watch-outs', mk.watch], ['Natural work', mk.work]] },
    { k: 'h', t: 'How others experience you' }, { k: 'p', t: `People tend to notice your ${mk.strengths.split(',')[0].toLowerCase()} first. The same trait can read as ${mk.watch.split(',')[0].toLowerCase()} when you are tired or under pressure. Knowing this lets you choose which side people meet.` },
  ]);

  add('Your direction', `Bhagyank ${r.bhagyank}: where life is heading`, [
    { k: 'p', t: `Your long-run theme is ${bh.theme.toLowerCase()}. The recurring tension in your life is: ${bh.tension.toLowerCase()}.` },
    { k: 'p', t: `Your life path is ruled by ${PLANET[r.bhagyank]}. You often feel this more after your late twenties, when the pattern of your choices starts to repeat.` },
    ...(r.missing.includes(r.bhagyank) ? [{ k: 'p', t: `${r.bhagyank} is also missing from your birth grid, so this is a skill you grow on purpose, step by step. It is not a flaw. It is your assignment.` } as Block] : []),
  ]);

  add('Two numbers, one person', `Mulank ${r.mulank} and Bhagyank ${r.bhagyank} together`, [
    { k: 'p', t: PAIR_NOTE(r.mulank, r.bhagyank) },
    { k: 'table', head: ['', 'Mulank (how you work)', 'Bhagyank (where you head)'], widths: [0.8, 1.6, 1.6], rows: [['Number', r.mulank, r.bhagyank], ['Planet', PLANET[r.mulank], PLANET[r.bhagyank]], ['Theme', mk.strengths, bh.theme]] },
  ]);

  add('Your grid', 'Your Lo Shu grid at a glance', [
    { k: 'p', t: `Your birth date fills ${r.present.length} of the nine squares. Digits you carry: ${r.present.join(', ')}.${r.missing.length ? ` Digits you do not carry: ${r.missing.join(', ')}.` : ' You carry every digit.'}` },
    { k: 'p', t: r.missing.length <= 3 ? 'A fairly full grid means most life areas have a natural tool behind them. Your growth is in using them evenly.' : 'A grid with several gaps is common. Gaps are not weaknesses; they are the areas where deliberate practice pays most.' },
  ]);

  add('Your gifts', 'Digits you carry', [
    { k: 'table', head: ['Digit', 'Area', 'In your chart'], widths: [0.9, 1.4, 2], rows: r.present.map((d) => [`${d}${r.counts[d] > 1 ? ` (x${r.counts[d]})` : ''}`, DIGIT_HAVE[d].area, DIGIT_HAVE[d].meaning]) },
    ...(r.present.some((d) => r.counts[d] > 1) ? [{ k: 'p', t: `A repeated digit (${r.present.filter((d) => r.counts[d] > 1).join(', ')}) is a strong trait. Use it on purpose, and check it does not tip into its watch-out.` } as Block] : []),
  ]);

  add('Your growth areas', 'Digits to build', r.missing.length
    ? [{ k: 'table', head: ['No.', 'Pattern', 'Practice'], widths: [0.5, 1.6, 1.8], rows: r.missing.map((d) => [d, DIGIT_MISSING[d].pattern, DIGIT_MISSING[d].practice]) }, { k: 'p', t: 'Choose one practice and keep it for thirty days before adding another. Small and daily beats large and occasional.' }]
    : [{ k: 'p', t: 'You carry every digit from 1 to 9. Your task is balance: notice which digit you lean on most and make sure the quieter ones get used.' }]);

  add('Your patterns', 'Planes and arrows', [
    { k: 'table', head: ['Line', 'Theme', 'Your chart'], widths: [1.2, 1.4, 1.4], rows: r.lines.map((l) => [l.digits.join(' · '), l.name, l.status === 'complete' ? 'Complete' : l.status === 'empty' ? 'All three missing' : `${l.present.join(', ')} present`]) },
    ...(r.missingArrows.length ? r.missingArrows.map((a) => ({ k: 'p', t: `Missing arrow ${a.digits.join('-')} (${a.name}): ${ARROW_MISSING[a.id]}` } as Block)) : [{ k: 'p', t: 'None of the five arrows is completely empty, which is a good sign for follow-through.' } as Block]),
  ]);

  const past = [y - 3, y - 2, y - 1].map((yr) => ({ yr, n: personalYear(b.day, b.month, yr) }));
  add('Your past', 'The last three years', [
    { k: 'p', t: 'Looking back helps you see the pattern you are in. Notice how each year below matches what you remember.' },
    { k: 'table', head: ['Year', 'Theme', 'What it asked of you'], widths: [0.7, 1.2, 2.4], rows: past.map((p) => [p.yr, `${YEAR_THEME[p.n].name} (${p.n})`, YEAR_DEEP[p.n].story]) },
    { k: 'p', t: `This leads into ${y}, a year of ${YEAR_THEME[r.personalYear].name.toLowerCase()}.` },
  ]);

  add('Your present', `${y}: ${yd.headline}`, [
    { k: 'stats', items: [{ label: 'Year number', value: r.personalYear, sub: YEAR_THEME[r.personalYear].name }] },
    { k: 'p', t: yd.story },
    { k: 'h', t: 'Do' }, { k: 'bul', items: yd.do }, { k: 'h', t: 'Avoid' }, { k: 'bul', items: yd.avoid },
  ]);

  add('Your present', `${y}: money, love and work`, [
    { k: 'h', t: 'Money' }, { k: 'p', t: yd.money },
    { k: 'h', t: 'Relationships' }, { k: 'p', t: yd.relationships },
    { k: 'h', t: 'Work' }, { k: 'p', t: yd.work },
  ]);

  for (let i = 0; i < r.months.length; i += 2) {
    const two = r.months.slice(i, i + 2);
    add('Month by month', `${monthLabel(two[0])}${two[1] ? ` and ${monthLabel(two[1])}` : ''}`, two.flatMap((m): Block[] => {
      const n = MONTH_NOTE[m.number];
      return [{ k: 'h', t: `${monthLabel(m)} · month ${m.number}` }, { k: 'p', t: `Mood: ${n.mood}.` }, { k: 'p', t: `Best use: ${n.use}.` }, { k: 'p', t: `Take care with: ${n.care}.` }];
    }));
  }

  const w = windows(r.months);
  add('Your timing', 'Best windows and careful windows', [
    { k: 'table', head: ['Window', 'Month', 'Why'], widths: [1.2, 1.2, 2.4], rows: [
      ['Strong start', w.start ? monthLabel(w.start) : 'None this year', w.start ? MONTH_NOTE[w.start.number].use : 'Use steady months for steady progress.'],
      ['Slow down', w.slow ? monthLabel(w.slow) : 'None this year', w.slow ? MONTH_NOTE[w.slow.number].care : 'No strong slow-down month.']] },
    { k: 'table', head: ['Month', 'No.', 'Mood'], widths: [1.4, 0.5, 2.4], rows: r.months.map((m) => [monthLabel(m), m.number, MONTH_NOTE[m.number].mood]) },
  ]);

  r.years.forEach((yr, i) => {
    const d = YEAR_DEEP[yr.number];
    add('Your future', `${yr.year}: ${d.headline}`, [
      { k: 'stats', items: [{ label: i === 0 ? 'This year' : `In ${i} year${i > 1 ? 's' : ''}`, value: yr.number, sub: YEAR_THEME[yr.number].name }] },
      { k: 'p', t: d.story }, { k: 'h', t: 'Money' }, { k: 'p', t: d.money }, { k: 'h', t: 'Relationships' }, { k: 'p', t: d.relationships }, { k: 'h', t: 'Work' }, { k: 'p', t: d.work },
    ]);
  });

  add('Your life areas', 'Career and business', [{ k: 'p', t: area.career }, { k: 'h', t: `Your life-path influence (${r.bhagyank})` }, { k: 'p', t: bArea.career }]);
  add('Your life areas', 'Money and wealth', [{ k: 'p', t: area.money }, { k: 'h', t: `Your life-path influence (${r.bhagyank})` }, { k: 'p', t: bArea.money }]);
  add('Your life areas', 'Love and relationships', [{ k: 'p', t: area.love }, { k: 'h', t: `Your life-path influence (${r.bhagyank})` }, { k: 'p', t: bArea.love }]);
  add('Your life areas', 'Energy and wellbeing', [{ k: 'p', t: area.wellbeing }, { k: 'h', t: `Your life-path influence (${r.bhagyank})` }, { k: 'p', t: bArea.wellbeing }, { k: 'p', t: 'This is lifestyle guidance only. It is not medical advice. See a doctor for health concerns.' }]);
  add('Your life areas', 'Lucky colours, days and remedies', [
    { k: 'table', head: ['Item', 'Suggestion'], widths: [1, 2], rows: [['Colours', LUCKY[r.mulank].colours], ['Good days', LUCKY[r.mulank].days], ['Numbers to build', r.missing.join(', ') || 'None'], ['Life-path colours', LUCKY[r.bhagyank].colours]] },
    { k: 'p', t: area.remedy },
  ]);

  add('Your plan', 'Your next 30 days', [
    { k: 'bul', items: [
      `Week 1: ${r.missing.length ? DIGIT_MISSING[r.missing[0]].practice : 'Pick one habit that supports your strongest digit'}`,
      `Week 2: ${yd.do[0]}`, `Week 3: ${yd.do[1] ?? yd.do[0]}`, `Week 4: Review. Notice what changed, and avoid: ${yd.avoid[0].toLowerCase()}`] },
    { k: 'p', t: `Come back each month. Your next strong window is ${w.start ? monthLabel(w.start) : 'ahead'}.` },
  ]);

  return pages;
}

/** The one real, specific insight shown free on the teaser page. The rest of it sits behind the report. */
export function hook(b: Birth, now: Date): { title: string; shown: string } {
  const r = reading(b, now);
  if (r.missingArrows.length) {
    const a = r.missingArrows[0];
    return { title: `Your chart has an empty ${a.name} arrow`, shown: ARROW_MISSING[a.id].split('.')[0] + '.' };
  }
  const rep = r.present.find((d) => r.counts[d] > 1);
  if (rep) return { title: `The digit ${rep} appears ${r.counts[rep]} times in your birth date`, shown: `${DIGIT_HAVE[rep].meaning}.` };
  if (r.missing.length) return { title: `The digit ${r.missing[0]} is missing from your grid`, shown: `${DIGIT_MISSING[r.missing[0]].pattern}.` };
  return { title: 'Your grid carries every digit', shown: 'That is rare, and it changes how your years play out.' };
}
