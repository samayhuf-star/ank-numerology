// The free guided reading: short cards, one idea each, with the working shown for the numbers. The paid report goes much deeper.
import { reading } from './reading.ts';
import { working } from './nameMatch.ts';
import { hook, type Block, type Page } from './fullReport.ts';
import { MULANK, BHAGYANK, PLANET, DIGIT_MISSING } from '../content/en.ts';
import { MONTH_NOTE } from '../content/report.ts';
import { MONTH_FULL } from './fullReport.ts';

export type FreeCard = Page & { grid?: boolean };
const sd = (n: number) => String(n).split('').join(' + ');

export function buildFreeFlow(b: { name: string; day: number; month: number; year: number }, now: Date): FreeCard[] {
  const r = reading(b, now);
  const first = b.name.split(' ')[0];
  const nw = working(b.name);
  const digits = `${b.day}${b.month}${b.year}`.split('').map(Number);
  const sum = digits.reduce((a, d) => a + d, 0);
  const m0 = r.months[0];
  const h = hook(b, now);
  const cards: FreeCard[] = [];
  const add = (kicker: string, title: string, blocks: Block[], grid = false) => cards.push({ kicker, title, blocks, grid });

  add('Welcome', `Hey ${first}`, [
    { k: 'p', t: 'Welcome to your numerology reading. We look at the numbers in your birth date and your name to see your strengths, your gaps and what the coming months hold.' },
    { k: 'bul', items: ['Your core numbers', 'How each number is worked out', 'Your Lo Shu grid and what is missing', 'Your name number', 'How this month looks'] },
    { k: 'p', t: 'Numerology is a guide for reflection, to use with your own judgement. It is not a prediction or advice.' },
  ]);
  add('Your core numbers', 'The numbers that describe you', [
    { k: 'stats', items: [{ label: 'Mulank', value: r.mulank, sub: PLANET[r.mulank] }, { label: 'Bhagyank', value: r.bhagyank, sub: PLANET[r.bhagyank] }, { label: 'Name number', value: nw.number, sub: nw.compound ? `from ${nw.compound}` : '' }] },
    { k: 'p', t: `Mulank is how you work day to day. Bhagyank is where life is heading. Your name number is the energy you send out each time you use your name.` },
  ]);
  add('Your Mulank', `Mulank ${r.mulank}`, [
    { k: 'table', head: ['Step', 'Working'], widths: [0.8, 2.4], rows: [['Birth day', `${b.day}`], ['Add the digits', b.day > 9 ? `${sd(b.day)} = ${r.mulank}` : `${b.day} is already one digit`]] },
    { k: 'p', t: MULANK[r.mulank].short },
    { k: 'table', head: ['Strengths', 'Watch-outs'], rows: [[MULANK[r.mulank].strengths, MULANK[r.mulank].watch]] },
  ]);
  add('Your Bhagyank', `Bhagyank ${r.bhagyank}`, [
    { k: 'table', head: ['Step', 'Working'], widths: [0.8, 2.4], rows: [['Birth date', `${b.day}/${b.month}/${b.year}`], ['Add every digit', `${digits.join(' + ')} = ${sum}`], ...(sum > 9 ? [['Reduce', `${sd(sum)} = ${r.bhagyank}`]] : [])] },
    { k: 'p', t: `Your life is moving toward "${BHAGYANK[r.bhagyank].theme.toLowerCase()}". The full report shows how this plays out year by year.` },
  ]);
  add('Your name number', `Your name adds up to ${nw.number}`, [
    { k: 'table', head: ['Letter', ...nw.words.flatMap((w) => w.letters.map((l) => l.ch))], rows: [['Value', ...nw.words.flatMap((w) => w.letters.map((l) => l.v))]] },
    { k: 'p', t: `${nw.words.map((w) => `${w.word} = ${w.sub}`).join(', ')}. Total ${nw.total}${nw.steps.length ? `, then ${nw.steps.join(', ')}` : ''}.` },
    { k: 'p', t: nw.number === r.mulank || nw.number === r.bhagyank ? `Your name number matches a birth number. The Name Match report shows how well, and tests other spellings.` : `Your name number ${nw.number} does not match your birth numbers ${r.mulank} and ${r.bhagyank}. The Name Match report shows what that means and which spellings would match.` },
  ]);
  add('Your Lo Shu grid', 'Your Lo Shu grid', [
    { k: 'p', t: r.missing.length ? `Missing from your grid: ${r.missing.join(', ')}. ${DIGIT_MISSING[r.missing[0]].pattern}.` : 'Your grid carries every digit from 1 to 9.' },
    { k: 'p', t: `${h.title}. ${h.shown}` },
  ], true);
  const note = MONTH_NOTE[m0.number];
  add('This month', `${MONTH_FULL[m0.month - 1]} is a ${m0.number} month`, [
    { k: 'stats', items: [{ label: 'Personal month', value: m0.number }] },
    { k: 'table', head: ['', 'This month'], widths: [0.8, 2.4], rows: [['Mood', note.mood], ['Use it for', note.use]] },
    { k: 'p', t: 'The other eleven months, what to avoid in each, and your best windows are in the Complete Report.' },
  ]);
  return cards;
}
