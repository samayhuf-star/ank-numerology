// The Complete Report, dense edition. Every section = calculation shown + interpretation + a visual.
// Blueprint (from reviewing ~10 commercial numerology reports): summary table, core numbers each with
// working and 4-5 reading areas (character, career, money, love, health), name numbers with compound meaning,
// name vs birth harmony, Lo Shu digits/planes/arrows, karmic lessons, nine-year cycle, pinnacles/challenges,
// 12 personal months with calendar, lucky guide, remedies, compatibility, action plan.
import { chart, nameParts, monthDays, type Sum } from './chart.ts';
import { personalMonth } from './numerology.ts';
import { variants } from './nameReport.ts';
import { sumOf } from './chart.ts';
import { PLANET, DIGIT_HAVE, DIGIT_MISSING, ARROW_MISSING, YEAR_THEME, DAY_GOOD } from '../content/en.ts';
import { AREA, MONTH_NOTE, YEAR_DEEP, PAIR_NOTE } from '../content/report.ts';
import { NUM, COMPOUND, REL, REL_TEXT, PAIR_LIFE, KARMIC_DEBT, DAY_USE, DAY_START, DAY_QUIET, PAIR_NOTE_SHORT, AGE_BAND, relation } from '../content/deep.ts';
import { MONTH_FULL, type Block, type Page } from './fullReport.ts';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const plus = (s: Sum) => s.terms.map((t) => t.v).join(' + ');
const reduceTxt = (s: Sum) => s.chain.length ? s.chain.join(', ') : `${s.total} is already one digit`;
const mid = (n: number) => NUM[n];

export function buildDense(b: { name: string; day: number; month: number; year: number }, now: Date): Page[] {
  const c = chart(b, now);
  const { parts, mu, bh, nameNo } = c;
  const first = parts.words[0]?.word ?? b.name;
  const y = now.getFullYear();
  const pages: Page[] = [];
  const add = (kicker: string, title: string, blocks: Block[]) => pages.push({ kicker, title, blocks });
  const M = mid(mu), B = mid(bh), N = mid(nameNo);
  const chainOf = (n: number) => { const out: string[] = []; let x = n; while (x > 9) { const ds = String(x).split(''); const t = ds.reduce((a, d) => a + Number(d), 0); out.push(`${ds.join(' + ')} = ${t}`); x = t; } return out; };
  const dobChain = c.dobSum > 9 ? ' → ' + chainOf(c.dobSum).join(' → ') : '';

  // ───────── Part 1 · your chart at a glance
  add('Part 1 · Your chart', `${first}, your numerology chart`, [
    { k: 'p', t: `Prepared for ${b.name}, born ${b.day}/${b.month}/${b.year}. This report reads your date of birth and your name together, using the Indian (Mulank / Bhagyank) method for birth numbers and the Chaldean method for your name. Every number is shown with its working, so you can check it yourself.` },
    { k: 'table', head: ['Number', 'Working', 'Result', 'Planet'], widths: [1.3, 2.6, 0.8, 0.9], rows: [
      ['Mulank (day)', b.day > 9 ? `${String(b.day).split('').join(' + ')} = ${mu}` : `${b.day}`, mu, PLANET[mu]],
      ['Bhagyank (date)', `${c.digits.join(' + ')} = ${c.dobSum}${dobChain}`, bh, PLANET[bh]],
      ['Name number', `${plus(parts.full)} = ${parts.full.total}${parts.full.chain.length ? ' → ' + parts.full.chain.join(', ') : ''}`, nameNo, PLANET[nameNo]],
      ['First name', `${plus(parts.first)} = ${parts.first.total}`, parts.first.number, PLANET[parts.first.number]],
      ['Heart (vowels)', `${plus(parts.vowels)} = ${parts.vowels.total}`, parts.vowels.number, PLANET[parts.vowels.number]],
      ['Outer self (consonants)', `${plus(parts.consonants)} = ${parts.consonants.total}`, parts.consonants.number, PLANET[parts.consonants.number]],
      [`Year ${y}`, `Day + month + ${y} reduced`, c.py, PLANET[c.py]],
    ] },
    { k: 'grid', counts: c.counts, caption: 'Your Lo Shu grid. Filled squares are digits in your birth date; pale squares are missing.' },
    { k: 'bars', title: 'Digits in your birth date', items: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => ({ l: `Digit ${d}`, v: c.counts[d] })), max: Math.max(3, ...Object.values(c.counts)) },
  ]);

  add('Part 1 · Your chart', 'The short version', [
    { k: 'p', t: `${M.core[0].split('. ')[0]}. That is your Mulank ${mu} nature. Your Bhagyank ${bh} says life is moving you toward ${B.keywords.slice(0, 2).join(' and ').toLowerCase()}. Your name carries ${nameNo}, which ${c.rels.nameMu === 'friend' || c.rels.nameMu === 'same' ? 'supports' : c.rels.nameMu === 'enemy' ? 'pulls against' : 'neither helps nor hinders'} your Mulank.` },
    { k: 'table', head: ['Area', 'Your reading'], widths: [1.2, 3.4], rows: [
      ['Strongest qualities', M.strengths.slice(0, 4).join(', ')],
      ['Main watch-outs', M.challenges.slice(0, 4).join(', ')],
      ['Best fields of work', M.careers.slice(0, 4).join(', ')],
      ['Lucky colours', M.colours], ['Lucky days', M.days], ['Supportive dates', M.dates],
      ['Missing digits', c.missing.length ? c.missing.join(', ') : 'None'],
      ['Name and birth match', `${cap(c.rels.nameMu)} with Mulank, ${c.rels.nameBh} with Bhagyank`],
      [`This year (${y})`, `${c.py} · ${YEAR_THEME[c.py].name}`],
    ] },
    { k: 'bars', title: `Personal year, next nine years`, items: c.years.map((x) => ({ l: String(x.year), v: x.n })), max: 9 },
    { k: 'note', t: 'Numerology is a framework for reflection, not a prediction or advice. Use it with your own judgement.' },
  ]);

  add('Part 1 · Your chart', 'How this report works', [
    { k: 'p', t: 'Three sets of numbers are read here. Birth numbers come from your date of birth and describe your nature and direction. Name numbers come from the letters of your name and describe the energy you send out. Cycle numbers come from today\'s date and describe the year and month you are in.' },
    { k: 'table', head: ['Value', 'Letters (Chaldean)'], widths: [0.8, 2.6], rows: [[1, 'A, I, J, Q, Y'], [2, 'B, K, R'], [3, 'C, G, L, S'], [4, 'D, M, T'], [5, 'E, H, N, X'], [6, 'U, V, W'], [7, 'O, Z'], [8, 'F, P'], [9, 'Not given to any letter']] },
    { k: 'p', t: 'The Chaldean table gives letters values from 1 to 8 by sound, not by position in the alphabet. When a total has two digits, that is the compound number and carries its own meaning. Adding its digits gives the single number, which carries the core energy.' },
    { k: 'table', head: ['Planet', 'Number', 'Planet', 'Number'], rows: [['Sun', 1, 'Mercury', 5], ['Moon', 2, 'Venus', 6], ['Jupiter', 3, 'Ketu', 7], ['Rahu', 4, 'Saturn', 8], ['Mars', 9, '', '']] },
    { k: 'bul', items: ['Part 1: your chart at a glance', 'Part 2: birth numbers in depth', 'Part 3: your name, letter by letter', 'Part 4: your Lo Shu grid', 'Part 5: life cycles and the year ahead', 'Part 6: the next twelve months with calendars', 'Part 7: career, money, love, health and compatibility', 'Part 8: lucky guide, remedies and a 90 day plan'] },
  ]);

  // ───────── Part 2 · birth numbers
  const numberPages = (label: string, n: number, why: string, working: string, kicker = 'Part 2 · Birth numbers') => {
    const P = mid(n), A = AREA[n];
    add(kicker, `${label} ${n}: ${P.nature}`, [
      { k: 'stats', items: [{ label, value: n, sub: PLANET[n] }, { label: 'Element', value: P.element }, { label: 'Lucky day', value: P.days.split(',')[0] }] },
      { k: 'table', head: ['Working', 'Result'], widths: [3, 1], rows: [[working, n]] },
      { k: 'p', t: why },
      { k: 'h', t: 'Your character' }, ...P.core.map((t) => ({ k: 'p', t } as Block)),
      { k: 'p', t: P.inner },
      { k: 'table', head: ['Strengths', 'Challenges'], rows: P.strengths.map((s, i) => [s, P.challenges[i] ?? '']) },
      { k: 'tiles', items: P.keywords.map((k) => ({ top: k, main: PLANET[n] })) },
    ]);
    add(kicker, `${label} ${n}: work and money`, [
      { k: 'p', t: P.career }, { k: 'p', t: A.career },
      { k: 'table', head: ['Natural fields'], rows: P.careers.map((x) => [x]) },
      { k: 'h', t: 'Money' }, { k: 'p', t: P.money }, { k: 'p', t: A.money },
      { k: 'note', t: `Best months to start something for a ${n}: those with personal month 1, 3, 5 or 8. See Part 6.` },
    ]);
    add(kicker, `${label} ${n}: love, family and health`, [
      { k: 'h', t: 'Love' }, { k: 'p', t: P.love }, { k: 'p', t: A.love },
      { k: 'h', t: 'Family' }, { k: 'p', t: P.family },
      { k: 'h', t: 'Wellbeing' }, { k: 'p', t: P.health }, { k: 'p', t: A.wellbeing },
      { k: 'h', t: 'Inner life' }, { k: 'p', t: P.spirit },
    ]);
  };
  numberPages('Mulank', mu, `Your Mulank is the number of the day you were born. It shows how you act day to day, how people see you and how you respond under pressure. It is ruled by ${PLANET[mu]}.`, `Day ${b.day}${b.day > 9 ? ` → ${String(b.day).split('').join(' + ')} = ${mu}` : ''}`);
  if (bh !== mu) numberPages('Bhagyank', bh, `Your Bhagyank is the sum of your whole date of birth. It shows the direction of life, the lessons that repeat and where effort pays later. It is ruled by ${PLANET[bh]}.`, `${c.digits.join(' + ')} = ${c.dobSum}${dobChain}`);
  else add('Part 2 · Birth numbers', `Bhagyank ${bh}: the same as your Mulank`, [
    { k: 'p', t: `Your Bhagyank and Mulank are both ${bh}. Your way of acting and the direction of your life are the same energy, so the readings above apply twice over.` },
    { k: 'table', head: ['Working', 'Result'], rows: [[`${c.digits.join(' + ')} = ${c.dobSum}${dobChain}`, bh]] },
    { k: 'p', t: PAIR_NOTE(mu, bh) },
  ]);

  add('Part 2 · Birth numbers', `Mulank ${mu} with Bhagyank ${bh}`, [
    { k: 'p', t: PAIR_NOTE(mu, bh) },
    { k: 'table', head: ['', 'Mulank', 'Bhagyank'], widths: [1, 1.5, 1.5], rows: [['Number', mu, bh], ['Planet', PLANET[mu], PLANET[bh]], ['Element', M.element, B.element], ['Nature', M.nature, B.nature], ['Lucky colours', M.colours, B.colours], ['Relationship', cap(c.rels.muBh), REL_TEXT[c.rels.muBh]]] },
    { k: 'p', t: PAIR_LIFE[c.rels.muBh] },
    { k: 'h', t: 'Karmic debt check' },
    c.karmicDebt.length ? { k: 'table', head: ['Number', 'Meaning'], widths: [0.6, 3], rows: c.karmicDebt.map((n) => [n, KARMIC_DEBT[n]]) } : { k: 'p', t: 'No karmic debt numbers (13, 14, 16, 19) appear in your birth day, date total or name total.' },
    { k: 'bars', title: 'Friendly numbers for you', items: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({ l: `No. ${n}`, v: relation(mu, n) === 'same' ? 3 : relation(mu, n) === 'friend' ? 3 : relation(mu, n) === 'neutral' ? 2 : 1, sub: relation(mu, n) })), max: 3, caption: '3 = friendly or same, 2 = neutral, 1 = tense, from the Mulank ' + mu + ' point of view.' },
  ]);

  // ───────── Part 3 · name
  add('Part 3 · Your name', 'Step 1: letters to numbers', [
    { k: 'p', t: `Your name as used: ${parts.words.map((w) => w.word).join(' ')}. Each letter takes its Chaldean value. Only letters count.` },
    ...parts.words.flatMap((w): Block[] => [
      { k: 'h', t: w.word },
      { k: 'tiles', items: w.sum.terms.map((t) => ({ top: t.ch, main: t.v })) },
      { k: 'p', t: `${plus(w.sum)} = ${w.sum.total}${w.sum.compound ? ` → ${w.sum.number}` : ''}` },
    ]),
    { k: 'table', head: ['Word', 'Sum', 'Single'], widths: [2, 0.8, 0.8], rows: [...parts.words.map((w) => [w.word, w.sum.total, w.sum.number]), ['Full name', parts.full.total, parts.full.number]] },
  ]);

  const compoundPage = (kicker: string, title: string, s: Sum, intro: string) => {
    const cm = s.compound ? COMPOUND[s.compound] : null; const P = mid(s.number);
    add(kicker, title, [
      { k: 'stats', items: [{ label: 'Total', value: s.total }, { label: 'Single', value: s.number, sub: PLANET[s.number] }, { label: 'Compound', value: s.compound ?? '—', sub: cm?.title ?? 'single digit' }] },
      { k: 'p', t: intro },
      { k: 'table', head: ['Working', 'Result'], widths: [3, 1], rows: [[`${plus(s)} = ${s.total}`, s.total], ...(s.chain.length ? [[s.chain.join('; '), s.number]] : [])] },
      ...(cm ? [{ k: 'h', t: `${s.compound}: ${cm.title}` } as Block, { k: 'p', t: cm.text } as Block, { k: 'p', t: `Chaldean readers class this compound as ${cm.mood === 'good' ? 'favourable' : cm.mood === 'caution' ? 'one that asks for care' : 'mixed'}. The compound number shows how the energy tends to arrive. The single number ${s.number} shows what it is made of.` } as Block] : []),
      { k: 'h', t: `Core energy: ${s.number} (${PLANET[s.number]})` }, { k: 'p', t: P.core[0] }, { k: 'p', t: P.core[1] },
      { k: 'table', head: ['Helps you', 'Needs care'], rows: P.strengths.slice(0, 4).map((x, i) => [x, P.challenges[i] ?? '']) },
    ]);
  };
  compoundPage('Part 3 · Your name', `Your name number: ${nameNo}`, parts.full, 'Your full name total is called your name number. It is the energy that you send out every time your name is written, said or signed. It shapes how people respond to you.');
  if (parts.first.total !== parts.full.total) compoundPage('Part 3 · Your name', `Your first name: ${parts.first.number}`, parts.first, 'The first name is what people say most. In Chaldean practice it carries the day to day energy and the first impression.');
  if (parts.last) compoundPage('Part 3 · Your name', `Your surname: ${parts.last.number}`, parts.last, 'The surname connects to family, background and public identity. It carries the energy of belonging to a group.');
  compoundPage('Part 3 · Your name', `Your heart (vowels): ${parts.vowels.number}`, parts.vowels, 'The vowels in your name are read as the inner motive: what you want when nobody is watching. Y is counted as a consonant here.');
  compoundPage('Part 3 · Your name', `Your outer self (consonants): ${parts.consonants.number}`, parts.consonants, 'The consonants are read as the outer layer: how you appear and how you handle the world. When it differs from the heart number, people may see a different person than you feel yourself to be.');

  const hm: [string, number, string, number][] = [['Name', nameNo, 'Mulank', mu], ['Name', nameNo, 'Bhagyank', bh], ['Heart', parts.vowels.number, 'Name', nameNo], ['Outer self', parts.consonants.number, 'Name', nameNo], ['First name', parts.first.number, 'Mulank', mu]];
  add('Part 3 · Your name', 'Do your name and birth numbers agree?', [
    { k: 'p', t: 'A name works best when its number supports your birth numbers. Each pair below is checked with the classical friendship of the number planets.' },
    { k: 'table', head: ['Pair', 'Numbers', 'Relationship', 'Reading'], widths: [1.3, 0.9, 0.9, 2.7], rows: hm.map(([a, an, bb, bn]) => [`${a} with ${bb}`, `${an} and ${bn}`, cap(relation(an, bn)), REL_TEXT[relation(an, bn)]]) },
    { k: 'bars', title: 'Support score', items: hm.map(([a, an, bb, bn]) => ({ l: `${a[0]}-${bb.slice(0, 2)}`, v: { same: 3, friend: 3, neutral: 2, enemy: 1 }[relation(an, bn)] })), max: 3, caption: '3 supports, 2 neutral, 1 tense.' },
    { k: 'p', t: `Overall: your name ${c.rels.nameMu === 'enemy' || c.rels.nameBh === 'enemy' ? 'pulls against at least one birth number. This is common and is not a fault, but it explains why some efforts feel harder than they should. See the spelling options on the next page.' : 'works well with your birth numbers. Keep your current spelling for signatures, social profiles and business use.'}` },
    { k: 'p', t: `The name also shapes your Lo Shu grid. ${c.missing.includes(nameNo) ? `Digit ${nameNo} is missing from your birth grid, so your name adds energy that your date lacks.` : `Digit ${nameNo} is already in your birth grid, so the name repeats energy you carry.`}` },
  ]);

  const opts = variants(b.name).filter((v) => v.toUpperCase().replace(/[^A-Z]/g, '') !== parts.words.join('').toUpperCase()).map((v) => { const s = nameParts(v).full; return { v, s, ok: relation(s.number, mu) !== 'enemy' && relation(s.number, bh) !== 'enemy', hit: s.number === mu || s.number === bh }; });
  add('Part 3 · Your name', 'Spelling options, worked out', [
    { k: 'p', t: 'Small spelling changes move the total. Each row is worked out in the same way as your name. Tick marks show options that match a birth number or at least avoid a tense relationship.' },
    { k: 'table', head: ['Spelling', 'Total', 'Compound / single', 'Mulank', 'Bhagyank'], widths: [1.7, 0.6, 1.3, 1, 1], rows: [[`${b.name} (now)`, parts.full.total, `${parts.full.compound ?? '—'} / ${nameNo}`, cap(c.rels.nameMu), cap(c.rels.nameBh)], ...opts.slice(0, 12).map((o) => [o.v, o.s.total, `${o.s.compound ?? '—'} / ${o.s.number}`, cap(relation(o.s.number, mu)), cap(relation(o.s.number, bh))])] },
    { k: 'bul', items: ['Test a new spelling on your signature, email display name and social profiles first.', 'Do not change names on legal documents only for numerology.', 'Pick a spelling that is easy to read and say. A name that you use confidently carries more energy than a perfect total.', 'Keep the original in all official records.'] },
  ]);

  // ───────── Part 4 · Lo Shu
  add('Part 4 · Lo Shu grid', 'Your grid, digit by digit', [
    { k: 'p', t: `The Lo Shu grid places the digits of your birth date (${b.day}/${b.month}/${b.year}) on a 3 by 3 square. Digits that appear are your built-in strengths. Digits that do not appear are areas you build deliberately.` },
    { k: 'grid', counts: c.counts },
    { k: 'table', head: ['Digit', 'Count', 'Area', 'Reading'], widths: [0.5, 0.6, 1.3, 3], rows: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => [d, c.counts[d], c.counts[d] ? DIGIT_HAVE[d].area : DIGIT_MISSING[d].area, c.counts[d] > 1 ? `${DIGIT_HAVE[d].meaning}, and strongly, because it appears ${c.counts[d]} times.` : c.counts[d] ? DIGIT_HAVE[d].meaning : DIGIT_MISSING[d].pattern]) },
  ]);
  add('Part 4 · Lo Shu grid', 'Missing digits and how to build them', c.missing.length ? [
    { k: 'p', t: `Digits ${c.missing.join(', ')} do not appear in your birth date. Traditional readers call these karmic lessons: skills that life asks you to learn through practice instead of giving them freely.` },
    { k: 'table', head: ['Digit', 'Pattern you may notice', 'Daily practice', 'Planet'], widths: [0.5, 2, 2, 0.8], rows: c.missing.map((d) => [d, DIGIT_MISSING[d].pattern, DIGIT_MISSING[d].practice, PLANET[d]]) },
    { k: 'bars', title: 'How much of the grid is filled', items: [{ l: 'Present', v: c.present.length }, { l: 'Missing', v: c.missing.length }], max: 9 },
    { k: 'table', head: ['Missing digit', 'Remedy colour', 'Remedy day', 'Mantra'], rows: c.missing.map((d) => [d, NUM[d].colours.split(',')[0], NUM[d].days.split(',')[0], NUM[d].mantra]) },
    { k: 'note', t: 'Missing digits are not weaknesses. Many accomplished people have several. They show where to practise.' },
  ] : [
    { k: 'p', t: 'Your grid carries every digit from 1 to 9. That is rare. It gives you a wide set of tools, and the question becomes focus: which of them you use on purpose.' },
    { k: 'grid', counts: c.counts },
  ]);

  c.missing.forEach((d) => {
    const P = NUM[d];
    add('Part 4 · Lo Shu grid', `Missing digit ${d}: ${DIGIT_MISSING[d].area}`, [
      { k: 'stats', items: [{ label: 'Digit', value: d, sub: PLANET[d] }, { label: 'Element', value: P.element }, { label: 'Lucky day', value: P.days.split(',')[0] }] },
      { k: 'p', t: `${d} does not appear in your birth date. It stands for ${DIGIT_MISSING[d].area.toLowerCase()}, and its planet is ${PLANET[d]}. ${DIGIT_MISSING[d].pattern}.` },
      { k: 'p', t: P.core[0] },
      { k: 'table', head: ['What the digit gives', 'How to build it'], widths: [2.4, 2.6], rows: [[P.strengths.slice(0, 3).join(', '), DIGIT_MISSING[d].practice], [`Colour: ${P.colours}`, `Day: ${P.days}`], [`Mantra: ${P.mantra}`, `Direction: ${P.direction}`]] },
      { k: 'p', t: `Your name ${nameNo === d ? `carries ${d}, so it already brings this energy into your life.` : `carries ${nameNo}, not ${d}, so the energy has to be built through practice.`} ${c.years.find((x) => x.n === d) ? `Your personal year is ${d} in ${c.years.find((x) => x.n === d)!.year}, which is a natural time to work on it.` : ''}` },
      { k: 'note', t: `Ten minutes a day on the practice above is worth more than a gem or a charm.` },
    ]);
  });
  add('Part 4 · Lo Shu grid', 'Planes and arrows', [
    { k: 'p', t: 'Rows, columns and diagonals of the grid are read as planes and arrows. A complete line is a strength. An empty line is an area to develop.' },
    { k: 'table', head: ['Line', 'Digits', 'Status', 'Reading'], widths: [1.2, 0.9, 0.9, 3], rows: c.lines.map((l) => [l.name, l.digits.join('-'), l.status === 'complete' ? 'Complete' : l.status === 'empty' ? 'Empty' : `${l.present.length} of 3`, l.status === 'complete' ? `A strength: ${l.name.toLowerCase()} comes naturally.` : l.status === 'empty' ? (ARROW_MISSING[l.id]?.split('.')[0] ?? 'Area to develop') + '.' : `Partly there. Missing ${l.missing.join(', ')}.`]) },
    { k: 'bars', title: 'Strength of each line (digits present out of 3)', items: c.lines.map((l) => ({ l: l.name.slice(0, 9), v: l.present.length })), max: 3 },
  ]);

  // ───────── Part 5 · cycles
  const yd = YEAR_DEEP[c.py];
  add('Part 5 · Life cycles', `Your ${y}: personal year ${c.py}`, [
    { k: 'stats', items: [{ label: `Year ${y}`, value: c.py, sub: YEAR_THEME[c.py].name }, { label: 'Age', value: c.age }, { label: 'Cycle position', value: `${c.py} of 9` }] },
    { k: 'table', head: ['Working', 'Result'], widths: [3, 1], rows: [[`Day ${b.day} + month ${b.month} + year ${y} → ${mu} + ${b.month > 9 ? String(b.month).split('').reduce((a, d) => a + Number(d), 0) : b.month} + ${String(y).split('').reduce((a, d) => a + Number(d), 0)}`, c.py]] },
    { k: 'h', t: yd.headline }, { k: 'p', t: yd.story },
    { k: 'table', head: ['Do', 'Avoid'], rows: yd.do.map((d, i) => [d, yd.avoid[i] ?? '']) },
    { k: 'table', head: ['Area', 'This year'], widths: [1, 3.4], rows: [['Money', yd.money], ['Relationships', yd.relationships], ['Work', yd.work]] },
  ]);
  add('Part 5 · Life cycles', 'The nine-year cycle', [
    { k: 'p', t: 'Your years move through a nine-year cycle. Year 1 starts a cycle, year 9 closes it. Knowing where you are tells you whether to start, build or finish.' },
    { k: 'bars', title: 'Personal year number, next nine years', items: c.years.map((x) => ({ l: String(x.year), v: x.n })), max: 9 },
    { k: 'table', head: ['Year', 'Age', 'Number', 'Theme', 'Focus'], widths: [0.8, 0.6, 0.8, 1.2, 2.8], rows: c.years.map((x) => [x.year, x.age, x.n, YEAR_THEME[x.n].name, YEAR_THEME[x.n].focus]) },
    { k: 'note', t: 'Years 1, 3, 5 and 8 favour launching. Years 4, 7 and 9 favour preparing, studying and finishing.' },
  ]);
  const next = YEAR_DEEP[c.years[1].n];
  add('Part 5 · Life cycles', `A look at ${y + 1}: personal year ${c.years[1].n}`, [
    { k: 'h', t: next.headline }, { k: 'p', t: next.story },
    { k: 'table', head: ['Do', 'Avoid'], rows: next.do.map((d, i) => [d, next.avoid[i] ?? '']) },
    { k: 'p', t: `Money: ${next.money}` }, { k: 'p', t: `Work: ${next.work}` },
    { k: 'p', t: `Moving from a ${c.py} year to a ${c.years[1].n} year: ${c.py === 9 ? 'a new cycle begins, so use this year to close what is done.' : `finish what ${YEAR_THEME[c.py].name.toLowerCase()} started, then bring the energy of ${YEAR_THEME[c.years[1].n].name.toLowerCase()} into your plans.`}` },
  ]);

  c.years.slice(2, 6).forEach((yr) => {
    const d = YEAR_DEEP[yr.n];
    add('Part 5 · Life cycles', `${yr.year}: personal year ${yr.n}, age ${yr.age}`, [
      { k: 'stats', items: [{ label: 'Year', value: yr.year }, { label: 'Number', value: yr.n, sub: YEAR_THEME[yr.n].name }, { label: 'Age', value: yr.age }] },
      { k: 'h', t: d.headline }, { k: 'p', t: d.story },
      { k: 'table', head: ['Do', 'Avoid'], rows: d.do.map((x, i) => [x, d.avoid[i] ?? '']) },
      { k: 'table', head: ['Area', 'Reading'], widths: [1, 3.4], rows: [['Money', d.money], ['Relationships', d.relationships], ['Work', d.work], ['Colour of the year', NUM[yr.n].colours], ['Best months', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((m) => DAY_START.includes(personalMonth(yr.n, m))).map((m) => MONTH_FULL[m - 1].slice(0, 3)).join(', ')]] },
      { k: 'p', t: `Against your Mulank ${mu}: ${REL_TEXT[relation(mu, yr.n)]}` },
    ]);
  });
  add('Part 5 · Life cycles', 'Pinnacles and challenges', [
    { k: 'p', t: `Life is read in four phases called pinnacles. Each has a number that sets the theme and a challenge number that shows the lesson. Your first phase ends at age ${c.pin.list[0].to}, the next two last nine years each, and the last runs on.` },
    { k: 'table', head: ['Phase', 'Ages', 'Years', 'Pinnacle', 'Challenge'], widths: [1.2, 1, 1.4, 0.9, 0.9], rows: c.pin.list.map((p, i) => [AGE_BAND[i], `${p.from} to ${p.to ?? 'end'}`, `${b.year + p.from} to ${p.to ? b.year + p.to : 'end'}`, p.n, p.ch]) },
    { k: 'bars', title: 'Pinnacle numbers', items: c.pin.list.map((p, i) => ({ l: `Phase ${i + 1}`, v: p.n })), max: 9 },
    ...c.pin.list.flatMap((p, i): Block[] => [{ k: 'h', t: `${AGE_BAND[i]}: pinnacle ${p.n}, challenge ${p.ch}` }, { k: 'p', t: NUM[p.n].pinnacle }, { k: 'p', t: p.ch === 0 ? 'Challenge 0 means no single lesson is set. You choose your own.' : NUM[p.ch].challenge }]),
  ]);

  // ───────── Part 6 · months
  const months: { year: number; month: number }[] = [];
  for (let i = 0, yy = y, mm = now.getMonth() + 1; i < 12; i++) { months.push({ year: yy, month: mm }); mm++; if (mm > 12) { mm = 1; yy++; } }
  const md = months.map((m) => ({ ...m, ...monthDays(b, m.year, m.month) }));
  add('Part 6 · Next 12 months', 'Your twelve months at a glance', [
    { k: 'p', t: 'Each month has a personal number: your personal year plus the calendar month. It shows the mood of the month and what it is good for.' },
    { k: 'bars', title: 'Personal month number', items: md.map((m) => ({ l: MONTH_FULL[m.month - 1].slice(0, 3) + ' ' + String(m.year).slice(2), v: m.pm })), max: 9 },
    { k: 'table', head: ['Month', 'No.', 'Mood', 'Best used for'], widths: [1.2, 0.5, 2, 2.6], rows: md.map((m) => [`${MONTH_FULL[m.month - 1]} ${m.year}`, m.pm, MONTH_NOTE[m.pm].mood, MONTH_NOTE[m.pm].use]) },
  ]);
  const good = md.filter((m) => DAY_START.includes(m.pm)), slow = md.filter((m) => DAY_QUIET.includes(m.pm));
  add('Part 6 · Next 12 months', 'Best windows and quiet windows', [
    { k: 'table', head: ['Window', 'Months', 'What to do'], widths: [1.2, 2.2, 2.6], rows: [
      ['Start and launch', good.map((m) => MONTH_FULL[m.month - 1].slice(0, 3) + ' ' + String(m.year).slice(2)).join(', ') || 'None this year', 'Begin projects, apply, pitch, sign, propose.'],
      ['Slow and finish', slow.map((m) => MONTH_FULL[m.month - 1].slice(0, 3) + ' ' + String(m.year).slice(2)).join(', ') || 'None', 'Study, review, rest, close old loops.'],
    ] },
    { k: 'bars', title: 'Launch-friendly months (1) and quiet months (0)', items: md.map((m) => ({ l: MONTH_FULL[m.month - 1].slice(0, 3), v: DAY_START.includes(m.pm) ? 1 : 0 })), max: 1 },
    { k: 'p', t: 'Do not read a quiet month as a bad month. Quiet months are where plans mature and relationships repair.' },
  ]);
  md.forEach((m, i) => {
    const note = MONTH_NOTE[m.pm];
    const starts = m.cells.filter((x) => DAY_START.includes(x.pd)).map((x) => x.date), quiet = m.cells.filter((x) => DAY_QUIET.includes(x.pd)).map((x) => x.date);
    add('Part 6 · Next 12 months', `${MONTH_FULL[m.month - 1]} ${m.year}: month ${m.pm}`, [
      { k: 'stats', items: [{ label: 'Personal month', value: m.pm, sub: PLANET[m.pm] }, { label: 'Personal year', value: m.py }, { label: 'Lucky colour', value: NUM[m.pm].colours.split(',')[0] }] },
      { k: 'table', head: ['', 'This month'], widths: [1, 3.6], rows: [['Mood', note.mood], ['Use it for', note.use], ['Take care with', note.care], ['Money', YEAR_DEEP[m.pm].money], ['Relationships', YEAR_DEEP[m.pm].relationships]] },
      { k: 'cal', title: `Your personal day numbers, ${MONTH_FULL[m.month - 1]}`, startDow: m.cells[0].dow, cells: m.cells.map((x) => ({ date: x.date, pd: x.pd })), caption: 'Each box shows date and personal day number. Gold boxes (1, 3, 5, 8) are good for starting and signing.' },
      { k: 'table', head: ['Kind of day', 'Dates'], widths: [1.4, 3.2], rows: [['Good for starting', starts.join(', ')], ['Quiet days', quiet.join(', ')]] },
    ]);
  });

  // ───────── Part 7 · work, money, love, health, compatibility
  add('Part 7 · Life areas', 'Career, money, love and health, together', [
    { k: 'table', head: ['Area', 'From Mulank ' + mu, 'From Bhagyank ' + bh], widths: [1, 2.4, 2.4], rows: [['Work', M.career, B.career], ['Money', M.money, B.money], ['Love', M.love, B.love], ['Health', M.health, B.health]] },
    { k: 'p', t: `Where both numbers agree, treat it as a firm tendency. Where they differ, use the Mulank for day to day habits and the Bhagyank for long-run choices such as career change and where to live.` },
    { k: 'bars', title: 'Relationship of your numbers to each number 1 to 9', items: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({ l: `No. ${n}`, v: { same: 3, friend: 3, neutral: 2, enemy: 1 }[relation(mu, n)] })), max: 3 },
  ]);
  add('Part 7 · Life areas', 'Compatibility guide', [
    { k: 'p', t: `Birth numbers of partners, friends and co-founders matter. Below, each Mulank is compared with yours (${mu}).` },
    { k: 'table', head: ['Their Mulank', 'Planet', 'With you', 'What they bring'], widths: [0.9, 0.9, 1, 3.2], rows: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => [n, PLANET[n], cap(relation(mu, n)), PAIR_NOTE_SHORT[n]]) },
    { k: 'table', head: ['Friendly', 'Neutral', 'Tense'], rows: [[REL[mu].friend.join(', '), REL[mu].neutral.join(', ') || '—', REL[mu].enemy.join(', ')]] },
    { k: 'note', t: 'Tension is not a ban. It means different speeds and values. Good partners across such numbers agree on roles and talk early.' },
  ]);

  // ───────── Part 8 · lucky guide, remedies, plan
  add('Part 8 · Guide and plan', 'Your lucky guide', [
    { k: 'table', head: ['Item', 'For Mulank ' + mu, 'For Bhagyank ' + bh], widths: [1.2, 2.4, 2.4], rows: [['Planet', M.planet, B.planet], ['Colours', M.colours, B.colours], ['Avoid colours', M.avoidColours, B.avoidColours], ['Days', M.days, B.days], ['Avoid days', M.avoidDays, B.avoidDays], ['Dates', M.dates, B.dates], ['Direction', M.direction, B.direction], ['Metal', M.metal, B.metal], ['Gem (traditional)', M.gem, B.gem], ['Mantra', M.mantra, B.mantra]] },
    { k: 'note', t: 'Gems are a tradition, not a requirement. Check with a qualified astrologer before wearing a strong stone, and do not spend more than you comfortably can.' },
    { k: 'tiles', items: [...new Set([mu, bh, nameNo])].map((n) => ({ top: `No. ${n}`, main: PLANET[n] })), caption: 'Your lucky numbers: Mulank, Bhagyank and name number.' },
  ]);
  add('Part 8 · Guide and plan', 'Remedies and daily practice', [
    { k: 'p', t: AREA[mu].remedy }, { k: 'p', t: AREA[bh].remedy },
    { k: 'table', head: ['Time', 'Practice'], widths: [1.2, 4.4], rows: [['Morning', `Sit quietly for five minutes. Repeat "${M.mantra}" 11 times.`], ['Work', DAY_GOOD[mu].good], ['Avoid', DAY_GOOD[mu].easy], ['Evening', c.missing.length ? DIGIT_MISSING[c.missing[0]].practice : 'Write down three things that went well.'], ['Weekly', `Use ${M.days.split(',')[0]} for a fresh start and for charity.`]] },
    { k: 'bul', items: ['Use your lucky colour in something you see daily: a phone case, a notebook, a shirt.', 'Sign with confidence, in the same way each time.', 'Give on your lucky day, in small amounts, without announcement.'] },
  ]);
  add('Part 8 · Guide and plan', 'Your 90 day plan', [
    { k: 'p', t: `Your year is a ${c.py} year (${YEAR_THEME[c.py].name.toLowerCase()}) and this month is month ${md[0].pm}. The plan follows those two.` },
    { k: 'table', head: ['Days', 'Focus', 'Actions'], widths: [0.9, 1.6, 3.2], rows: [['1 to 30', `Month ${md[0].pm}: ${MONTH_NOTE[md[0].pm].mood.toLowerCase()}`, MONTH_NOTE[md[0].pm].use], ['31 to 60', `Month ${md[1].pm}: ${MONTH_NOTE[md[1].pm].mood.toLowerCase()}`, MONTH_NOTE[md[1].pm].use], ['61 to 90', `Month ${md[2].pm}: ${MONTH_NOTE[md[2].pm].mood.toLowerCase()}`, MONTH_NOTE[md[2].pm].use]] },
    { k: 'bars', title: 'Month number over the 90 days', items: md.slice(0, 3).map((m) => ({ l: MONTH_FULL[m.month - 1].slice(0, 3), v: m.pm })), max: 9 },
    { k: 'bul', items: [`Keep your daily practice: ${c.missing.length ? DIGIT_MISSING[c.missing[0]].practice.toLowerCase() : 'a short daily review'}.`, `Use your best windows: ${good.slice(0, 3).map((m) => MONTH_FULL[m.month - 1]).join(', ') || 'see Part 6'}.`, 'Review this report each month and mark what was true.'] },
    { k: 'note', t: 'This report is a guide for reflection. It is not a prediction, and not medical, legal or financial advice.' },
  ]);
  return pages;
}
