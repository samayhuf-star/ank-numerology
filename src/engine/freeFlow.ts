// The free guided reading: short cards, one idea each, with the working shown for the numbers. The paid report goes much deeper.
import { reading } from './reading.ts';
import { working } from './nameMatch.ts';
import { hook, type Block, type Page } from './fullReport.ts';
import { MULANK, BHAGYANK, PLANET, DIGIT_MISSING } from '../content/en.ts';
import { MONTH_NOTE } from '../content/report.ts';
import { NUM, COMPOUND } from '../content/deep.ts';
import { monthDays } from './chart.ts';
import { MONTH_FULL } from './fullReport.ts';

export type FreeCard = Page & { grid?: boolean };
const sd = (n: number) => String(n).split('').join(' + ');
const chainTxt = (n: number) => { const o: string[] = []; let x = n; while (x > 9) { const t = String(x).split('').reduce((a, d) => a + Number(d), 0); o.push(`${sd(x)} = ${t}`); x = t; } return o.join(' → '); };

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
    { k: 'table', head: ['Step', 'Working'], widths: [0.8, 2.4], rows: [['Birth day', `${b.day}`], ['Add the digits', b.day > 9 ? chainTxt(b.day) : `${b.day} is already one digit`]] },
    { k: 'p', t: MULANK[r.mulank].short },
    { k: 'p', t: NUM[r.mulank].core[0] },
    { k: 'table', head: ['Strengths', 'Watch-outs'], rows: NUM[r.mulank].strengths.slice(0, 4).map((x, i) => [x, NUM[r.mulank].challenges[i] ?? '']) },
    { k: 'table', head: ['Lucky', 'For you'], widths: [1, 2.2], rows: [['Planet', PLANET[r.mulank]], ['Colours', NUM[r.mulank].colours], ['Day', NUM[r.mulank].days], ['Dates', NUM[r.mulank].dates]] },
    { k: 'p', t: 'The Complete Report goes through your work, money, love and health for this number, one page each.' },
  ]);
  add('Your Bhagyank', `Bhagyank ${r.bhagyank}`, [
    { k: 'table', head: ['Step', 'Working'], widths: [0.8, 2.4], rows: [['Birth date', `${b.day}/${b.month}/${b.year}`], ['Add every digit', `${digits.join(' + ')} = ${sum}`], ...(sum > 9 ? [['Reduce', chainTxt(sum)]] : [])] },
    { k: 'p', t: `Your life is moving toward "${BHAGYANK[r.bhagyank].theme.toLowerCase()}". The recurring tension is: ${BHAGYANK[r.bhagyank].tension.toLowerCase()}.` },
    { k: 'p', t: NUM[r.bhagyank].core[1] },
    { k: 'table', head: ['Planet', 'Element', 'Nature'], rows: [[PLANET[r.bhagyank], NUM[r.bhagyank].element, NUM[r.bhagyank].nature]] },
    { k: 'p', t: 'The Complete Report shows how this plays out year by year, and checks it against your Mulank.' },
  ]);
  add('Your name number', `Your name adds up to ${nw.number}`, [
    { k: 'table', head: ['Letter', ...nw.words.flatMap((w) => w.letters.map((l) => l.ch))], rows: [['Value', ...nw.words.flatMap((w) => w.letters.map((l) => l.v))]] },
    { k: 'p', t: `${nw.words.map((w) => `${w.word} = ${w.sub}`).join(', ')}. Total ${nw.total}${nw.steps.length ? `, then ${nw.steps.join(', ')}` : ''}.` },
    ...(nw.compound && COMPOUND[nw.compound] ? [{ k: 'p', t: `Compound ${nw.compound}, "${COMPOUND[nw.compound].title}": ${COMPOUND[nw.compound].text}` } as Block] : []),
    { k: 'p', t: nw.number === r.mulank || nw.number === r.bhagyank ? `Your name number matches a birth number. The Name Match report shows how well, and tests other spellings.` : `Your name number ${nw.number} does not match your birth numbers ${r.mulank} and ${r.bhagyank}. The Name Match report shows what that means and which spellings would match.` },
  ]);
  add('Your Lo Shu grid', 'Your Lo Shu grid', [
    { k: 'p', t: r.missing.length ? `Missing from your grid: ${r.missing.join(', ')}. ${DIGIT_MISSING[r.missing[0]].pattern}.` : 'Your grid carries every digit from 1 to 9.' },
    { k: 'p', t: `${h.title}. ${h.shown}` },
    { k: 'bars', title: 'How often each digit appears', items: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => ({ l: `${d}`, v: r.counts[d] })), max: Math.max(3, ...Object.values(r.counts)) },
    { k: 'table', head: ['Missing digit', 'Try this daily'], widths: [1, 2.2], rows: r.missing.slice(0, 3).map((d) => [`${d}: ${DIGIT_MISSING[d].area}`, DIGIT_MISSING[d].practice]) },
  ], true);
  const note = MONTH_NOTE[m0.number];
  const md = monthDays(b as any, m0.year, m0.month);
  add('This month', `${MONTH_FULL[m0.month - 1]} is a ${m0.number} month`, [
    { k: 'stats', items: [{ label: 'Personal month', value: m0.number }] },
    { k: 'table', head: ['', 'This month'], widths: [0.8, 2.4], rows: [['Mood', note.mood], ['Use it for', note.use]] },
    { k: 'cal', title: `Your day numbers, ${MONTH_FULL[m0.month - 1]}`, startDow: md.cells[0].dow, cells: md.cells.map((x) => ({ date: x.date, pd: x.pd })), caption: 'Gold boxes (1, 3, 5, 8) are good days to start things.' },
    { k: 'p', t: 'The other eleven months, each with its own calendar, what to avoid and your best windows are in the Complete Report.' },
  ]);
  return cards;
}
