// Extended chapters for the full Name Report (English). Focus: who you are, your PAST, PRESENT and FUTURE.
// Deliberately does not teach the calculations; it only tells the reader what their numbers mean.
const N = require('./numerology');
const X = require('./extra_content');

function buildExtra(ctx) {
  const { r, C, mk, h } = ctx;
  const { page, sectionHead, table, kv, barChart, lineChart, esc } = h;
  const now = r.now;
  const cy = now.getFullYear();
  const cm = now.getMonth() + 1;
  const MN = r.monthNames;
  const nameNum = r.chaldean.value;
  const lk = C.LUCKY[r.mulank];
  const cp = C.COMPAT[r.mulank];
  const ordinal = (n) => `${n}`;
  const title = (n) => C.MULANK[n].title;
  const tag = (list, n) => (list.friendly.includes(n) ? 'Friendly' : list.challenging.includes(n) ? 'Challenging' : n === r.mulank ? 'Same as you' : 'Neutral');
  const rm0 = X.PLANET_REMEDY;
  const toc = []; // [section, covers]
  const add = (sec, cov) => toc.push([sec, cov]);
  const P = (t) => `<p class="body">${esc(t)}</p>`;
  const M = (t) => `<p class="muted">${esc(t)}</p>`;
  const K = (t) => `<div class="kick2">${esc(t)}</div>`;

  // ---------- IDENTITY ----------
  const relation = (a, b) => (a === b ? 'the same' : C.COMPAT[a].friendly.includes(b) ? 'friendly' : C.COMPAT[a].challenging.includes(b) ? 'challenging' : 'neutral');
  const rel = relation(r.mulank, r.bhagyank);
  const relText = {
    the: '',
    same: 'Your Mulank and Bhagyank are the same number, so your character and your life path point the same way. You tend to feel at home in your own life, and the lessons of this number come to you repeatedly and strongly.',
    friendly: 'Your Mulank and Bhagyank are friendly numbers. What you are like and where life leads you support each other, which tends to make major decisions feel natural and well-timed.',
    neutral: 'Your Mulank and Bhagyank are neutral to each other. You may feel that you are one person at home and another at work, and your path rewards choosing deliberately instead of drifting.',
    challenging: 'Your Mulank and Bhagyank pull in different directions. This often shows up as an inner tug between what you want and what life asks of you. It is a source of depth and growth when you learn to hold both.',
  };
  const relKey = rel === 'the same' ? 'same' : rel;
  const combo = page(sectionHead('You', 'The shape of you') +
    P(`You carry three main signatures: Mulank ${r.mulank} (${title(r.mulank)}), Bhagyank ${r.bhagyank} (${title(r.bhagyank)}) and a name number of ${nameNum} (${title(nameNum)}).`) +
    P(relText[relKey]) +
    kv([
      ['Who you are', esc(`${title(r.mulank)}: ${mk.summary}`)],
      ['Where life leads', esc(`${title(r.bhagyank)}: ${C.BHAGYANK[r.bhagyank]}`)],
      ['How the world sees you', esc(`${title(nameNum)}: ${C.MULANK[nameNum].summary}`)],
      ['Your core strength', esc(mk.strengths)],
      ['Your core challenge', esc(mk.challenges)],
      ['Your ruling planet', esc(`${C.PLANET[r.mulank]} (Mulank), ${C.PLANET[r.bhagyank]} (Bhagyank)`)],
    ]));
  add('The shape of you', 'Your core numbers brought together in one portrait');

  const strengthsPage = page(sectionHead('You', 'Strengths and shadows') +
    K('Strengths to lean on') +
    table(['Number', 'Gift', 'In daily life'], [
      [`Mulank ${r.mulank}`, esc(mk.strengths), esc(X.WORK[r.mulank].style)],
      [`Bhagyank ${r.bhagyank}`, esc(C.MULANK[r.bhagyank].strengths), esc(`Life tends to ask you to use this through ${C.MULANK[r.bhagyank].career.toLowerCase()}`)],
      [`Name ${nameNum}`, esc(C.MULANK[nameNum].strengths), esc('This is the impression people carry of you before they know you well.')],
    ]) +
    K('Shadows to watch') +
    table(['Number', 'Challenge', 'A better habit'], [
      [`Mulank ${r.mulank}`, esc(mk.challenges), esc(X.WORK[r.mulank].grow)],
      [`Bhagyank ${r.bhagyank}`, esc(C.MULANK[r.bhagyank].challenges), esc(X.WORK[r.bhagyank].grow)],
      [`Name ${nameNum}`, esc(C.MULANK[nameNum].challenges), esc(X.WORK[nameNum].grow)],
    ]) +
    K('Under pressure') +
    kv([['What stresses you', esc(X.STRESS[r.mulank].stress)], ['What calms you', esc(X.STRESS[r.mulank].calm)], ['How you decide best', esc(X.STRESS[r.mulank].decide)]]));
  add('Strengths and shadows', 'Your gifts, your blind spots and how you handle pressure');

  const namePortrait = page(sectionHead('Your name', `Name number ${nameNum} — ${title(nameNum)}`) +
    P(`The name you use daily carries the energy of ${nameNum} (${C.PLANET[nameNum]}). ${C.MULANK[nameNum].summary}`) +
    kv([
      ['Presents you as', esc(C.MULANK[nameNum].summary)],
      ['Strengths it amplifies', esc(C.MULANK[nameNum].strengths)],
      ['What it can overplay', esc(C.MULANK[nameNum].challenges)],
      ['Where it helps most', esc(C.MULANK[nameNum].career)],
      ['In relationships', esc(C.MULANK[nameNum].relationships)],
      ['Fit with your birth numbers', esc(nameNum === r.mulank || nameNum === r.bhagyank ? 'Your name supports your birth numbers directly, which tends to feel like being "in tune" with your own life.' : `Your name number is ${tag(cp, nameNum).toLowerCase()} to your Mulank, so it adds a different flavour to the person you naturally are.`)],
    ]));
  add('Your name portrait', 'What your name says about you and how it works with your birth numbers');

  // Repeated numbers
  const repeated = r.present.filter((d) => r.counts[d] >= 2);
  const repRows = r.present.map((d) => {
    const c = Math.min(r.counts[d], 4);
    return [String(d), String(r.counts[d]), esc(X.REPEAT[d][c - 1])];
  });
  const repeat = page(sectionHead('Your birth grid', 'What your repeated numbers say') +
    P(repeated.length ? `You repeat ${repeated.map((d) => `${d} (${r.counts[d]} times)`).join(', ')}. Repeating a number amplifies its qualities.` : 'None of your numbers repeats, so your grid is evenly balanced between its qualities.') +
    table(['Number', 'Times', 'What it says about you'], repRows) +
    (r.missing.length ? K('Numbers you do not have') +
      table(['Number', 'What it means for you', 'How to grow it'], r.missing.map((d) => [String(d), esc(C.DIGIT_MISSING[d].lesson), esc(C.DIGIT_MISSING[d].remedy)])) : ''));
  add('Repeated and missing numbers', 'How your grid shapes your habits, strengths and lessons');

  const MISS = {
    1: { signs: 'Hesitating to speak up, putting yourself last, waiting to be asked.', work: 'Practise asking for what you want at work and putting your name on your ideas.', daily: 'Do one small thing each day purely because you chose it.' },
    2: { signs: 'Missing cues from other people, finding it hard to trust a hunch.', work: 'Build in a pause before decisions and ask one person what they noticed.', daily: 'Spend ten quiet minutes a day noticing how you feel before you react.' },
    3: { signs: 'Struggling to put feelings into words, or holding ideas back.', work: 'Write a short summary after every meeting; say one idea out loud each day.', daily: 'Keep a one-line journal or sketch every evening.' },
    4: { signs: 'Disorganisation, unfinished tasks and routines that drift.', work: 'Use checklists and fixed time blocks; close one task before opening another.', daily: 'Make your bed, plan tomorrow tonight and keep one fixed work hour.' },
    5: { signs: 'Mood sensitivity and feeling thrown by pressure or change.', work: 'Keep a steady routine in busy periods and breathe before replying to tough messages.', daily: 'Walk for twenty minutes at a consistent time each day.' },
    6: { signs: 'Difficulty showing care, or an unsettled sense of home.', work: 'Notice and thank colleagues; take care of your workspace.', daily: 'Do one deliberate act of care for someone and tidy one corner of your home.' },
    7: { signs: 'Impatience with setbacks and a feeling of learning the hard way.', work: 'After every setback write what it taught you and what you would do next.', daily: 'Read or study for fifteen minutes in silence.' },
    8: { signs: 'Trouble with detail, money tracking and follow-through.', work: 'Track expenses weekly and double-check numbers before they go out.', daily: 'Spend five minutes recording money in and out.' },
    9: { signs: 'A sense of lacking drive or larger purpose.', work: 'Join one cause or project outside your own interests.', daily: 'Do something physical every day and give a little time to someone else.' },
  };
  const missPages = r.missing.slice(0, 6).map((d) => page(sectionHead('Your birth grid', `Growing your missing ${d}`) +
    P(`${C.DIGIT_MISSING[d].lesson} ${title(d)} energy is the quality you build by practice.`) +
    kv([
      ['Signs you may notice', esc(MISS[d].signs)],
      ['What it is a gift for', esc(C.DIGIT_HAVE[d])],
      ['At work', esc(MISS[d].work)],
      ['A daily practice', esc(MISS[d].daily)],
      ['Remedy', esc(C.DIGIT_MISSING[d].remedy)],
      ['Planet and day', esc(`${rm0[d].planet}, ${rm0[d].day}`)],
      ['Affirmation', `"${esc(C.AFFIRMATIONS[d])}"`],
    ])));
  if (missPages.length) add('Growing your missing numbers', 'One page for each number your birth date does not have');

  // ---------- LIFE AREAS ----------
  const outlook = (key, label) => K(`${label}: the next five years`) +
    table(['Year', 'No.', 'Outlook'], [1, 2, 3, 4, 5].map((i) => {
      const v = N.personalYear(r.day, r.month, cy + i);
      return [String(cy + i), String(v), esc(X.YEARX[v][key])];
    }));
  const work = page(sectionHead('Career', 'Your work style') +
    kv([
      ['How you work best', esc(X.WORK[r.mulank].style)],
      ['Your role in a team', esc(X.WORK[r.mulank].team)],
      ['Where you can trip', esc(X.WORK[r.mulank].pitfall)],
      ['What to practise', esc(X.WORK[r.mulank].grow)],
      ['Life asks you to grow into', esc(`${X.WORK[r.bhagyank].team} ${X.WORK[r.bhagyank].style}`)],
      ['Fields that suit you', esc(mk.career)],
    ]) + outlook('career', 'Your career'));
  add('Career and work style', 'How you work, your team role and where you can grow');

  const scored = X.VOCATIONS.map(([name, nums]) => {
    let s = 0;
    const w = [[r.mulank, 3], [r.bhagyank, 2], [nameNum, 1]];
    for (const [n, pts] of w) if (nums.includes(n)) s += pts * (nums.indexOf(n) === 0 ? 1.5 : 1);
    return { name, s, nums };
  }).sort((a, b) => b.s - a.s);
  const top = scored.filter((v) => v.s > 0).slice(0, 12);
  const stars = (s) => (s >= 6 ? '★★★' : s >= 3 ? '★★' : '★');
  const vocations = page(sectionHead('Career', 'Careers that tend to suit you') +
    P('These careers draw on the strengths of your Mulank, Bhagyank and name number. More stars mean a stronger traditional match.') +
    table(['Career', 'Fit'], top.map((v) => [esc(v.name), stars(v.s)])) +
    M('Numbers describe tendencies, not limits. Any career can be done well if it holds your interest and you learn the skills.') +
    barChart(top.slice(0, 8).map((v, i) => ({ label: v.name.split(' ')[0].slice(0, 9), value: Math.round(v.s * 10) / 10, hi: i === 0 })), 10));
  add('Careers that suit you', 'Ranked fields that fit your numbers');

  const money = page(sectionHead('Money', 'Your money pattern') +
    kv([
      ['How you earn best', esc(X.MONEY[r.mulank].style)],
      ['What to build', esc(X.MONEY[r.mulank].build)],
      ['Money risk', esc(X.MONEY[r.mulank].risk)],
      ['A habit that helps', esc(X.MONEY[r.mulank].tip)],
      ['Your destiny number adds', esc(`${X.MONEY[r.bhagyank].style} ${X.MONEY[r.bhagyank].tip}`)],
      ['Lucky colour for money days', esc(lk.colour)],
    ]) +
    outlook('money', 'Your money') +
    M('This is not financial advice. Consult a qualified adviser before making investment decisions.'));
  add('Money and wealth', 'How you earn, the habits that help and your risks');

  const love = page(sectionHead('Love', 'You in relationships') +
    kv([
      ['How you love', esc(X.LOVE[r.mulank].style)],
      ['What you look for', esc(X.LOVE[r.mulank].seeks)],
      ['Where it gets hard', esc(X.LOVE[r.mulank].pitfall)],
      ['What helps', esc(X.LOVE[r.mulank].tip)],
      ['Life leads you to learn', esc(`${X.LOVE[r.bhagyank].style} ${X.LOVE[r.bhagyank].tip}`)],
    ]) + outlook('love', 'Your love life'));
  add('Love and relationships', 'Your style in love, where it gets hard and what helps');

  const compat = page(sectionHead('Love', 'Who you click with') +
    P(`As a Mulank ${r.mulank}, these are the people you tend to find easiest and hardest.`) +
    table(['Their number', 'Match', 'What it feels like'], [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
      const t = tag(cp, n);
      const feel = t === 'Friendly' ? `Natural ease. ${title(n)} energy supports yours.` : t === 'Challenging' ? `Needs effort. ${title(n)} energy can rub against yours; patience and humour help.` : t === 'Same as you' ? 'You understand each other instantly, and also each other\'s flaws.' : `Neutral. It depends on the people more than the numbers.`;
      return [`${n} · ${title(n)}`, t, esc(feel)];
    })) +
    M('Compatibility describes tendencies. Shared values, honesty and effort matter far more than numbers.'));
  add('Who you click with', 'Compatibility with every number from 1 to 9');

  const health = page(sectionHead('Wellbeing', 'Your health themes') +
    kv([
      ['Areas to look after', esc(X.HEALTH[r.mulank].focus)],
      ['Habits that suit you', esc(X.HEALTH[r.mulank].habits)],
      ['What to watch', esc(X.HEALTH[r.mulank].watch)],
      ['Your destiny number adds', esc(`${X.HEALTH[r.bhagyank].focus} ${X.HEALTH[r.bhagyank].habits}`)],
    ]) +
    outlook('health', 'Your wellbeing') +
    M('This is traditional numerology and not medical advice. See a doctor for any health concern.'));
  add('Health and wellbeing', 'Themes to look after and habits that suit you');

  // ---------- PAST ----------
  const pastYears = [];
  for (let y = cy - 9; y < cy; y++) if (y >= r.year) pastYears.push({ year: y, value: N.personalYear(r.day, r.month, y) });
  const futureYears = [];
  for (let y = cy + 1; y <= cy + 9; y++) futureYears.push({ year: y, value: N.personalYear(r.day, r.month, y) });
  const nowYear = { year: cy, value: r.personalYear };
  const rhythm = [...pastYears, nowYear, ...futureYears];
  const rhythmPage = page(sectionHead('Your timeline', 'Your life rhythm: past, present, future') +
    P('Your life moves in nine-year cycles. Each year carries a number from 1 to 9 that sets its theme. Here is the wave across the last nine years, this year and the next nine.') +
    lineChart(rhythm) +
    M(`Years before ${cy} are your past, ${cy} is now, and years after are ahead of you.`) +
    table(['Period', 'Years', 'What stands out'], [
      ['Past', pastYears.length ? `${pastYears[0].year} to ${pastYears[pastYears.length - 1].year}` : 'Before this report', esc(pastYears.length ? `You went through ${pastYears.filter((p) => p.value === 1).length ? 'a new beginning and ' : ''}${pastYears.filter((p) => p.value === 9).length ? 'a completion year, ' : ''}${pastYears.length} years that shaped who you are now.` : 'Your earlier life is outside the recent nine-year window.')],
      ['Present', String(cy), esc(`A ${r.personalYear} year: ${C.YEAR_THEME[r.personalYear]}`)],
      ['Future', `${futureYears[0].year} to ${futureYears[8].year}`, esc(`The next cycle begins with a ${futureYears.find((f) => f.value === 1) ? 1 : futureYears[0].value} year in ${(futureYears.find((f) => f.value === 1) || futureYears[0]).year}.`)],
    ]));
  add('Your life rhythm', 'The nine-year wave: your past, present and future in one chart');

  const pastYearPages = pastYears.map((f) => {
    const y = X.YEARX[f.value];
    const ms = Array.from({ length: 12 }, (_, i) => ({ label: MN[i], value: N.personalMonth(r.day, r.month, f.year, i + 1) }));
    return page(sectionHead(`Your past · ${f.year}`, `${f.year}: Personal Year ${f.value} (age ${f.year - r.year})`) +
      P(`${C.YEAR_THEME[f.value]} Notice which of the following you recognise from that year.`) +
      kv([
        ['Work', esc(y.career)], ['Money', esc(y.money)], ['Love', esc(y.love)], ['Health', esc(y.health)],
        ['What the year asked of you', esc(y.do)], ['What it warned against', esc(y.avoid)],
        ['A question to look back on', esc(X.REFLECT[f.value])],
      ]) + K('The twelve months of that year') + barChart(ms) +
      table(['Months', 'Tone'], [
        ['Strongest', esc(ms.filter((m) => m.value === 1 || m.value === 8 || m.value === 3).map((m) => m.label).join(', ') || 'None stood out')],
        ['Quieter', esc(ms.filter((m) => m.value === 7 || m.value === 9 || m.value === 4).map((m) => m.label).join(', ') || 'None stood out')],
      ]));
  });
  add(`Looking back, year by year`, 'One page for each of your last nine years');

  const pastRows = pastYears.map((p) => [`${p.year}`, String(p.year - r.year), String(p.value), esc(C.YEAR_THEME[p.value]), esc(X.REFLECT[p.value])]);
  const pastPage = page(sectionHead('Your past', 'Looking back: the last nine years') +
    P('Reading your past is a way to see patterns. Each year below carried the theme of its number. Notice where it matches your memory.') +
    (pastRows.length ? table(['Year', 'Age', 'Year no.', 'The theme', 'Look back'], pastRows) : M('You were born within the last nine years, so your earlier timeline is limited.')) +
    M('You do not need to agree with every line. Notice which years felt true and use those patterns for planning.'));
  add('Looking back: your past', 'Your last nine years and what each one tended to bring');

  const pastHigh = pastYears.filter((p) => [1, 3, 8].includes(p.value));
  const pastLow = pastYears.filter((p) => [4, 7, 9].includes(p.value));
  const pastSummary = page(sectionHead('Your past', 'Patterns from your past') +
    kv([
      ['Years of beginnings and momentum', esc(pastHigh.length ? pastHigh.map((p) => `${p.year} (${p.value})`).join(', ') : 'None in this window')],
      ['Years of work, reflection or release', esc(pastLow.length ? pastLow.map((p) => `${p.year} (${p.value})`).join(', ') : 'None in this window')],
      ['What your past tends to say', esc(`With Mulank ${r.mulank} you have tended to ${mk.strengths.split(',')[0].toLowerCase()} first and learn about ${mk.challenges.split(',')[0].toLowerCase()} along the way.`)],
      ['A lesson to keep', esc(X.WORK[r.mulank].grow)],
    ]) +
    K('A question for yourself') +
    P(`Looking at ${pastYears.length ? pastYears[pastYears.length - 1].year : 'last year'}, a ${pastYears.length ? pastYears[pastYears.length - 1].value : r.personalYear} year: ${X.REFLECT[pastYears.length ? pastYears[pastYears.length - 1].value : r.personalYear]}`));
  add('Patterns from your past', 'What your past years say about your habits and lessons');

  // ---------- PRESENT ----------
  const pm = N.personalMonth(r.day, r.month, cy, cm);
  const thisYearMonths = Array.from({ length: 12 }, (_, i) => ({ label: MN[i], value: N.personalMonth(r.day, r.month, cy, i + 1), hi: i + 1 === cm }));
  const yx = X.YEARX[r.personalYear];
  const present = page(sectionHead('Your present', `${cy}: a Personal Year ${r.personalYear}`) +
    P(C.YEAR_THEME[r.personalYear]) +
    kv([
      ['Career', esc(yx.career)], ['Money', esc(yx.money)], ['Love', esc(yx.love)], ['Health', esc(yx.health)],
      ['Do this', esc(yx.do)], ['Avoid this', esc(yx.avoid)],
    ]));
  add(`Your present: ${cy}`, 'The theme of this year across career, money, love and health');

  const next3 = N.monthSeries(r.day, r.month, cy, cm, 3);
  const nowPage = page(sectionHead('Your present', `This month: ${MN[cm - 1]} ${cy}`) +
    P(`You are in a Personal Month ${pm}. ${X.MONTH_SHORT[pm]}.`) +
    kv([['Good for', esc(X.ACTIVITY[pm].good)], ['Take care with', esc(X.ACTIVITY[pm].care)]]) +
    K(`This calendar year, month by month`) + barChart(thisYearMonths) +
    K('The next three months') +
    table(['Month', 'Number', 'Good for', 'Take care with'], next3.map((m) => [`${MN[m.month - 1]} ${m.year}`, String(m.value), esc(X.ACTIVITY[m.value].good), esc(X.ACTIVITY[m.value].care)])));
  add('Your present: this month', 'The tone of this month, this calendar year and the next three months');

  // ---------- FUTURE ----------
  const yearPages = futureYears.map((f) => {
    const y = X.YEARX[f.value];
    const ms = Array.from({ length: 12 }, (_, i) => ({ label: MN[i], value: N.personalMonth(r.day, r.month, f.year, i + 1) }));
    const best = ms.filter((m) => m.value === r.mulank || m.value === r.bhagyank || m.value === 1 || m.value === 8).map((m) => m.label);
    const rest = ms.filter((m) => m.value === 7 || m.value === 9).map((m) => m.label);
    return page(sectionHead(`Your future · ${f.year}`, `${f.year}: Personal Year ${f.value}`) +
      P(C.YEAR_THEME[f.value]) +
      kv([
        ['Career', esc(y.career)], ['Money', esc(y.money)], ['Love', esc(y.love)], ['Health', esc(y.health)],
        ['Do this', esc(y.do)], ['Avoid this', esc(y.avoid)],
        ['Strongest months', esc(best.length ? best.join(', ') : 'None stands out; steady progress wins')],
        ['Months for reflection', esc(rest.length ? rest.join(', ') : 'None stands out')],
      ]) + barChart(ms) +
      table(['Month', 'No.', 'Good for'], ms.map((m, i) => [MN[i], String(m.value), esc(X.ACTIVITY[m.value].good)])));
  });
  yearPages.forEach((_, i) => {});
  add(`The next nine years: ${futureYears[0].year} to ${futureYears[8].year}`, 'One page per year with career, money, love, health and month-by-month highs');

  const summary = page(sectionHead('Your future', 'The next nine years at a glance') +
    table(['Year', 'Number', 'Theme', 'Best for'], futureYears.map((f) => [String(f.year), String(f.value), esc(X.MONTH_SHORT[f.value]), esc(X.YEARX[f.value].do)])) +
    M(`The cycle turns on a 1 year. The next 1 year is ${(futureYears.find((f) => f.value === 1) || futureYears[0]).year}.`));
  add('The next nine years at a glance', 'A single table of the years ahead');

  const m108 = N.monthSeries(r.day, r.month, cy, cm, 108);
  const monthChunks = [m108.slice(0, 36), m108.slice(36, 72), m108.slice(72, 108)];
  const monthPages = monthChunks.map((chunk, i) => {
    const half = Math.ceil(chunk.length / 2);
    const rows = [];
    for (let j = 0; j < half; j++) {
      const a = chunk[j], b = chunk[j + half];
      rows.push([`${MN[a.month - 1]} ${a.year}`, String(a.value), esc(X.MONTH_SHORT[a.value]), b ? `${MN[b.month - 1]} ${b.year}` : '', b ? String(b.value) : '', b ? esc(X.MONTH_SHORT[b.value]) : '']);
    }
    return page(sectionHead('Your future', `Month by month, part ${i + 1} of 3`) +
      (i === 0 ? M('Your personal month sets the tone of that month. Use it to time starts, reviews and rest.') : '') +
      table(['Month', 'No.', 'Theme', 'Month', 'No.', 'Theme'], rows));
  });
  add('Month by month for nine years', 'The next 108 months, each with its number and theme');

  const strong = m108.filter((m) => m.value === r.mulank || m.value === r.bhagyank).slice(0, 12);
  const windows = page(sectionHead('Your future', 'Your best windows ahead') +
    P('These are the coming months that carry your own numbers. They tend to feel in tune with you.') +
    table(['Month', 'Number', 'Good for'], strong.map((m) => [`${MN[m.month - 1]} ${m.year}`, String(m.value), esc(X.ACTIVITY[m.value].good)])) +
    K('Months to move slowly') +
    table(['Month', 'Number', 'Take care with'], m108.filter((m) => cp.challenging.includes(m.value)).slice(0, 8).map((m) => [`${MN[m.month - 1]} ${m.year}`, String(m.value), esc(X.ACTIVITY[m.value].care)])));
  add('Your best windows ahead', 'The coming months that favour you and those to take slowly');

  // ---------- PRACTICAL ----------
  const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  const dayList = (set) => days.filter((d) => set.includes(N.reduce(d))).join(', ');
  const luckyDates = page(sectionHead('Luck', 'Your lucky dates and days') +
    kv([
      ['Lucky dates of the month', esc(dayList([...cp.friendly, r.mulank, r.bhagyank]))],
      ['Neutral dates', esc(dayList(cp.neutral))],
      ['Dates to take care with', esc(dayList(cp.challenging))],
      ['Lucky weekdays', esc(lk.days)],
      ['Lucky colours', esc(lk.colour)],
      ['Colours to limit', esc(lk.avoid)],
      ['Lucky direction', esc(lk.direction)],
      ['Gemstone', esc(lk.gem)],
      ['Metal', esc(lk.metal)],
    ]) +
    M('Use these as gentle guidance, for example for picking a day to sign, start or celebrate. They are traditions, not guarantees.'));
  add('Your lucky dates and days', 'Dates, weekdays, colours, direction and gemstone');

  const best = [r.mulank, ...cp.friendly].filter((v, i, a) => a.indexOf(v) === i);
  const numberFit = page(sectionHead('Luck', 'Numbers that suit you') +
    P('Choose phone numbers, house numbers and vehicle numbers that total one of your favourable numbers.') +
    table(['Total', 'Fit for you', 'Phone number', 'House number', 'Vehicle'], [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => [String(n), tag(cp, n), esc(X.TOTAL_MEANING[n].mobile), esc(X.TOTAL_MEANING[n].house), esc(X.TOTAL_MEANING[n].vehicle)])) +
    M(`Best fits for you: ${best.join(', ')}. This is traditional guidance and not a reason to move house or change a number you rely on.`));
  add('Numbers that suit you', 'Which phone, house and vehicle numbers tend to suit you');

  const rm = X.PLANET_REMEDY;
  const planetary = page(sectionHead('Strength', 'Your planetary remedies') +
    P('In Indian tradition each number belongs to a planet. These are the practices people traditionally follow. Keep what feels meaningful.') +
    table(['', `Mulank ${r.mulank} · ${rm[r.mulank].planet}`, `Bhagyank ${r.bhagyank} · ${rm[r.bhagyank].planet}`], [
      ['Mantra', esc(rm[r.mulank].mantra), esc(rm[r.bhagyank].mantra)],
      ['Yantra', esc(rm[r.mulank].yantra), esc(rm[r.bhagyank].yantra)],
      ['Day', esc(rm[r.mulank].day), esc(rm[r.bhagyank].day)],
      ['Offering', esc(rm[r.mulank].give), esc(rm[r.bhagyank].give)],
      ['Daily habit', esc(rm[r.mulank].habit), esc(rm[r.bhagyank].habit)],
      ['Gemstone', esc(lk.gem), esc(C.LUCKY[r.bhagyank].gem)],
    ]) +
    M('These are cultural practices offered for reflection. They are optional and not a substitute for professional advice.'));
  add('Your planetary remedies', 'Mantra, yantra, day, offerings and habits for your planets');

  const mm = r.missing.length ? r.missing[0] : null;
  const plan = page(sectionHead('Strength', 'Your 30-day plan') +
    table(['Week', 'Focus', 'Daily practice'], [
      ['1', 'Ground yourself', esc(`Say your affirmation each morning: "${C.AFFIRMATIONS[r.mulank]}" ${rm[r.mulank].habit}`)],
      ['2', mm ? `Grow your missing ${mm}` : 'Keep your balance', esc(mm ? C.DIGIT_MISSING[mm].remedy : 'Keep a steady routine and look after sleep and food.')],
      ['3', 'Your work', esc(X.WORK[r.mulank].grow)],
      ['4', 'Your relationships', esc(X.LOVE[r.mulank].tip)],
    ]) +
    K('Your monthly rhythm') +
    kv([
      ['Before any big decision', esc(X.STRESS[r.mulank].decide)],
      ['When stressed', esc(X.STRESS[r.mulank].calm)],
      ['This year\'s focus', esc(`${yx.do} Avoid: ${yx.avoid.toLowerCase()}`)],
    ]));
  add('Your 30-day plan', 'Four weeks of small steps drawn from your own numbers');

  const keys = page(sectionHead('Summary', 'Twelve things to remember') +
    table(['', 'Your key'], [
      ['1', esc(`You are a ${title(r.mulank)} at heart: ${mk.summary}`)],
      ['2', esc(`Life leads you toward ${title(r.bhagyank)} themes: ${C.BHAGYANK[r.bhagyank]}`)],
      ['3', esc(`Your name presents you as ${title(nameNum)}.`)],
      ['4', esc(`Your strongest gift: ${mk.strengths.split(',')[0]}.`)],
      ['5', esc(`Your main watch-out: ${mk.challenges.split(',')[0].toLowerCase()}.`)],
      ['6', esc(`Best role: ${X.WORK[r.mulank].team}`)],
      ['7', esc(`Money habit: ${X.MONEY[r.mulank].tip}`)],
      ['8', esc(`In love: ${X.LOVE[r.mulank].tip}`)],
      ['9', esc(`Right now (${cy}): ${yx.do}`)],
      ['10', esc(`Your lucky weekdays: ${lk.days}. Lucky colours: ${lk.colour}.`)],
      ['11', esc(`The next 1 year: ${(futureYears.find((f) => f.value === 1) || futureYears[0]).year}. Plan big beginnings around it.`)],
      ['12', esc(`Your affirmation: "${C.AFFIRMATIONS[r.mulank]}"`)],
    ]));
  add('Twelve things to remember', 'A one-page summary of your report');

  const faq = page(sectionHead('Good to know', 'Questions people ask') +
    table(['Question', 'Answer'], X.FAQ.map(([q, a]) => [esc(q), esc(a)])));
  add('Questions people ask', 'Honest notes about how to use this report');

  return {
    toc,
    identity: [combo, strengthsPage, namePortrait],
    afterGrid: [repeat, ...missPages],
    lifeAreas: [work, vocations, money, love, compat, health],
    timeline: [rhythmPage, pastPage, ...pastYearPages, pastSummary, present, nowPage],
    future: [summary, ...yearPages, ...monthPages, windows],
    practical: [luckyDates, numberFit, planetary, plan],
    closing: [keys, faq],
  };
}

module.exports = { buildExtra };
