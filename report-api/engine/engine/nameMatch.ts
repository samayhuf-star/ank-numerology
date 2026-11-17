// Builds the Name Match report: how a name's Chaldean number is worked out, how it compares with the birth numbers,
// and what a different spelling would change. Unlike the Future report, this one SHOWS the working, step by step.
import { CHALDEAN, mulank, bhagyank, reduce, loShuGrid } from './numerology.ts';
import { missingDigits } from './loshu.ts';
import { variants } from './nameReport.ts';
import { MULANK, PLANET } from '../content/en.ts';
import type { Block, Page } from './fullReport.ts';

const clean = (s: string) => s.normalize('NFKD').replace(/[^A-Za-z ]/g, '').replace(/\s+/g, ' ').trim();
const lettersOf = (w: string) => [...w.toUpperCase().replace(/[^A-Z]/g, '')];

export type Working = { words: { word: string; letters: { ch: string; v: number; run: number }[]; sub: number }[]; total: number; steps: string[]; number: number; compound: number | null };

/** Letter-by-letter Chaldean working with running totals and the reduction chain (e.g. 31 -> 3+1 = 4). */
export function working(name: string): Working {
  let run = 0;
  const words = clean(name).split(' ').filter(Boolean).map((word) => {
    const letters = lettersOf(word).map((ch) => { const v = CHALDEAN[ch] ?? 0; run += v; return { ch, v, run }; });
    return { word, letters, sub: letters.reduce((a, l) => a + l.v, 0) };
  });
  const steps: string[] = []; let x = run;
  while (x > 9) { const ds = String(x).split(''); const n = ds.reduce((a, d) => a + Number(d), 0); steps.push(`${x} → ${ds.join(' + ')} = ${n}`); x = n; }
  return { words, total: run, steps, number: x, compound: run > 9 ? run : null };
}

const sumDigits = (n: number) => String(n).split('').reduce((a, d) => a + Number(d), 0);

export function buildNameMatch(b: { name: string; day: number; month: number; year: number }): Page[] {
  const { name, day, month, year } = b;
  const first = clean(name).split(' ')[0];
  const w = working(name);
  const mu = mulank(day), bh = bhagyank(day, month, year);
  const digits = `${day}${month}${year}`.split('').map(Number);
  const dobSum = digits.reduce((a, d) => a + d, 0);
  const mMatch = w.number === mu, bMatch = w.number === bh;
  const missing = missingDigits(loShuGrid(day, month, year));
  const pages: Page[] = [];
  const add = (kicker: string, title: string, blocks: Block[]) => pages.push({ kicker, title, blocks });

  const verdict = mMatch && bMatch ? 'Your name matches both birth numbers.' : mMatch ? 'Your name matches your Mulank.' : bMatch ? 'Your name matches your Bhagyank.' : 'Your name does not match either birth number.';
  add('Name Match report', `${first}, does your name match your birth date?`, [
    { k: 'p', t: `Prepared for ${clean(name)}, born ${day}/${month}/${year}. This report shows, step by step, how your name is turned into a number, how your birth numbers are found, and whether the two agree.` },
    { k: 'stats', items: [{ label: 'Name number', value: w.number, sub: w.compound ? `compound ${w.compound}` : 'single digit' }, { label: 'Mulank', value: mu, sub: PLANET[mu] }, { label: 'Bhagyank', value: bh, sub: PLANET[bh] }] },
    { k: 'p', t: `Result: ${verdict}` },
    { k: 'table', head: ['Check', 'Your numbers', 'Match?'], widths: [1.4, 1.6, 0.8], rows: [['Name vs Mulank', `${w.number} vs ${mu}`, mMatch ? 'Yes' : 'No'], ['Name vs Bhagyank', `${w.number} vs ${bh}`, bMatch ? 'Yes' : 'No']] },
  ]);

  add('Step 1', 'Turn each letter into a number', [
    { k: 'p', t: 'This report uses the Chaldean table. Each letter has one value from 1 to 8. The number 9 is never given to a letter.' },
    { k: 'table', head: ['Value', 'Letters'], widths: [0.6, 2.4], rows: [[1, 'A I J Q Y'], [2, 'B K R'], [3, 'C G L S'], [4, 'D M T'], [5, 'E H N X'], [6, 'U V W'], [7, 'O Z'], [8, 'F P']] },
    { k: 'p', t: 'Only letters count. Spaces and punctuation are ignored. Spell the name the way you use it on documents.' },
  ]);

  for (const word of w.words) {
    add('Step 2', `Work out "${word.word}"`, [
      { k: 'table', head: ['Letter', ...word.letters.map((l) => l.ch)], rows: [['Value', ...word.letters.map((l) => l.v)], ['Running total', ...word.letters.map((l) => l.run)]] },
      { k: 'p', t: `${word.word}: ${word.letters.map((l) => l.v).join(' + ')} = ${word.sub}.` },
    ]);
  }

  add('Step 3', 'Add the words and reduce to one digit', [
    { k: 'table', head: ['Word', 'Sum'], widths: [2, 1], rows: [...w.words.map((x) => [x.word, x.sub]), ['Total', w.total]] },
    { k: 'p', t: w.steps.length ? `Reduce the total to one digit: ${w.steps.join(', ')}.` : `${w.total} is already one digit.` },
    { k: 'p', t: `Your name number is ${w.number}${w.compound ? `, reached through the compound number ${w.compound}` : ''}. Chaldean readers look at both: the compound number gives the colour of the name, the single digit gives its core.` },
  ]);

  add('Step 4', 'Find your Mulank and Bhagyank', [
    { k: 'table', head: ['Number', 'Working', 'Result'], widths: [1, 3, 0.8], rows: [
      ['Mulank (day)', `${day}${day > 9 ? ` → ${String(day).split('').join(' + ')} = ${sumDigits(day)}` : ''}`, mu],
      ['Bhagyank (full date)', `${digits.join(' + ')} = ${dobSum}${dobSum > 9 ? ` → ${String(dobSum).split('').join(' + ')} = ${reduce(dobSum)}` : ''}`, bh],
    ] },
    { k: 'p', t: `Mulank ${mu}: ${MULANK[mu].short}` },
  ]);

  add('Step 5', 'Compare the three numbers', [
    { k: 'table', head: ['', 'Number', 'Planet', 'Same as name?'], widths: [1.3, 0.7, 1, 1], rows: [['Name', w.number, PLANET[w.number], '—'], ['Mulank', mu, PLANET[mu], mMatch ? 'Yes' : 'No'], ['Bhagyank', bh, PLANET[bh], bMatch ? 'Yes' : 'No']] },
    { k: 'p', t: mMatch || bMatch ? 'When the name number equals a birth number, the name repeats that number\'s energy every time it is written or spoken. Readers treat this as support.' : `Your name carries ${w.number} (${PLANET[w.number]}) while your birth numbers are ${mu} and ${bh}. The name pulls in a different direction from the birth date. This is common and not a fault. It simply means the name is not reinforcing your birth numbers.` },
  ]);

  add('Step 6', 'What the name does to your Lo Shu grid', [
    { k: 'p', t: missing.includes(w.number) ? `Digit ${w.number} is missing from your birth grid. A name that carries ${w.number} adds the missing energy that your date does not give.` : `Digit ${w.number} is already in your birth grid, so your name repeats an energy you carry rather than adding a new one.` },
    { k: 'table', head: ['Missing in birth grid', 'Name adds it?'], widths: [2, 1], rows: missing.length ? missing.map((d) => [d, d === w.number ? 'Yes' : 'No']) : [['None missing', '—']] },
  ]);

  const opts = variants(name).filter((v) => v !== clean(name)).map((v) => ({ v, w: working(v) }));
  const good = opts.filter((o) => o.w.number === mu || o.w.number === bh);
  add('Step 7', 'Spelling options, with working', [
    { k: 'p', t: 'Small spelling changes move the total. Each option below is worked out the same way as your current name.' },
    { k: 'table', head: ['Spelling', 'Total', 'Reduction', 'Number', 'Matches'], widths: [1.6, 0.6, 1.4, 0.7, 1.3], rows: [[clean(name) + ' (now)', w.total, w.steps.join('; ') || '—', w.number, mMatch ? 'Mulank' : bMatch ? 'Bhagyank' : 'None'], ...opts.map((o) => [o.v, o.w.total, o.w.steps.join('; ') || '—', o.w.number, o.w.number === mu ? 'Mulank' : o.w.number === bh ? 'Bhagyank' : 'None'])] },
  ]);

  add('Your result', 'What we suggest', good.length && !(mMatch || bMatch) ? [
    { k: 'p', t: `Your current spelling does not match. ${good.length} option${good.length > 1 ? 's' : ''} above would: ${good.map((o) => `${o.v} (${o.w.number})`).join(', ')}.` },
    { k: 'bul', items: ['Try the option on your signature, email name and social profiles for 30 days before changing any legal document.', 'Do not change a name on official documents only for numerology. Use it as a spelling for everyday use.', 'Keep the original spelling in all legal records.'] },
  ] : [
    { k: 'p', t: mMatch || bMatch ? 'Your current spelling already supports your birth numbers. Keep it.' : 'None of the small spelling changes reach a birth number. Keep your name as it is.' },
  ]);
  return pages;
}
