// Full Ank Numerology Name Report — a 12-18 page PDF with cover art, vector charts and tables.
// Pure JS (pdfkit), self-contained — safe for a serverless runtime.
const PDFDocument = require('pdfkit');
const N = require('./numerology');
const C = require('./content');

const INK = '#12142B';
const INK2 = '#1E2148';
const GOLD = '#C9A227';
const GOLD2 = '#E3C766';
const MUTED = '#6B6F8A';
const LINE = '#E3E4EE';
const BG = '#F7F7FB';
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const pad = (n) => String(n).padStart(2, '0');

function buildReport(profile, now = new Date()) {
  const { name, day, month, year } = profile;
  const counts = N.loShuGrid(day, month, year);
  const mk = N.mulank(day);
  return {
    name, day, month, year, dob: `${pad(day)}-${pad(month)}-${year}`,
    mulank: mk, bhagyank: N.bhagyank(day, month, year), lifePath: N.lifePath(day, month, year),
    chaldean: N.chaldeanName(name), counts,
    present: N.presentDigits(counts), missing: N.missingDigits(counts),
    lines: N.readLines(counts), nameReport: N.nameReport(name, day, month, year),
    personalYear: N.personalYear(day, month, now.getFullYear()),
    months: N.monthSeries(day, month, now.getFullYear(), now.getMonth() + 1, 12),
    years: N.yearSeries(day, month, now.getFullYear(), 9),
    now,
  };
}

function renderPdf(profile) {
  const r = buildReport(profile);
  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true,
    info: { Title: `Ank Numerology — Name Report for ${r.name}`, Author: 'Ank Numerology' } });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));

  const PW = doc.page.width, PH = doc.page.height;
  const M = doc.page.margins.left, W = PW - M * 2;

  // ---------- helpers ----------
  const H = (t) => { doc.x = M; doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(9).text(String(t).toUpperCase(), M, doc.y, { width: W, characterSpacing: 1.6 }); doc.moveDown(0.3); };
  const Title = (t) => { doc.x = M; doc.fillColor(INK).font('Helvetica-Bold').fontSize(18).text(t, M, doc.y, { width: W }); doc.moveDown(0.3); };
  const Sub = (t) => { doc.x = M; doc.fillColor(INK).font('Helvetica-Bold').fontSize(13).text(t, M, doc.y, { width: W }); doc.moveDown(0.2); };
  const Body = (t) => { doc.x = M; doc.fillColor(INK).font('Helvetica').fontSize(10.5).text(t, M, doc.y, { width: W, lineGap: 2.5 }); doc.moveDown(0.3); };
  const Muted = (t) => { doc.x = M; doc.fillColor(MUTED).font('Helvetica').fontSize(9.5).text(t, M, doc.y, { width: W, lineGap: 2 }); doc.moveDown(0.2); };
  const rule = () => { const y = doc.y + 2; doc.moveTo(M, y).lineTo(M + W, y).lineWidth(1).strokeColor(LINE).stroke(); doc.moveDown(0.6); };
  const need = (h) => { if (doc.y + h > PH - 70) doc.addPage(); };

  function sectionHeader(kicker, title) {
    doc.addPage();
    doc.rect(0, 0, PW, 92).fill(INK);
    doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(8.5).text(String(kicker).toUpperCase(), M, 30, { characterSpacing: 2 });
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(19).text(title, M, 46, { width: W });
    doc.y = 116; doc.x = M; doc.fillColor(INK);
  }

  // Simple two-column key/value table
  function kvTable(rows, opts = {}) {
    const col1 = opts.col1 || 150;
    rows.forEach((row, i) => {
      need(30);
      const y0 = doc.y;
      if (i % 2 === 0) { doc.rect(M, y0 - 2, W, 0).fill(); }
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(9.5).text(row[0], M + 4, y0, { width: col1 - 8 });
      const h1 = doc.y;
      doc.fillColor(INK2).font('Helvetica').fontSize(9.5).text(row[1], M + col1, y0, { width: W - col1 - 4, lineGap: 1.5 });
      const h2 = doc.y;
      doc.y = Math.max(h1, h2);
      doc.moveTo(M, doc.y + 3).lineTo(M + W, doc.y + 3).lineWidth(0.5).strokeColor(LINE).stroke();
      doc.moveDown(0.5);
    });
    doc.x = M;
  }

  // Grid/matrix table with header row
  function table(headers, rows, widths) {
    const total = widths.reduce((a, b) => a + b, 0);
    const scale = W / total; const col = widths.map((w) => w * scale);
    need(40);
    let y = doc.y;
    doc.rect(M, y, W, 20).fill(INK);
    let x = M;
    headers.forEach((h, i) => { doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text(h, x + 5, y + 6, { width: col[i] - 8 }); x += col[i]; });
    y += 20; doc.y = y;
    rows.forEach((row, ri) => {
      const cellH = rowHeight(row, col);
      need(cellH + 4);
      if (doc.y + cellH > PH - 70) { doc.addPage(); y = doc.y; doc.rect(M, y, W, 20).fill(INK); let xx = M; headers.forEach((h, i) => { doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9).text(h, xx + 5, y + 6, { width: col[i] - 8 }); xx += col[i]; }); doc.y = y + 20; }
      y = doc.y;
      if (ri % 2 === 1) doc.rect(M, y, W, cellH).fill(BG);
      let cx = M;
      row.forEach((c, i) => { doc.fillColor(INK).font('Helvetica').fontSize(9).text(String(c), cx + 5, y + 5, { width: col[i] - 8, lineGap: 1 }); cx += col[i]; });
      doc.moveTo(M, y + cellH).lineTo(M + W, y + cellH).lineWidth(0.5).strokeColor(LINE).stroke();
      doc.y = y + cellH;
    });
    doc.x = M; doc.moveDown(0.6);
    function rowHeight(row, col) {
      let h = 16;
      row.forEach((c, i) => { const hh = doc.heightOfString(String(c), { width: col[i] - 8, fontSize: 9 }) + 10; if (hh > h) h = hh; });
      return h;
    }
  }

  // Bar chart (labels + values 1..9)
  function barChart(data, opts = {}) {
    const h = opts.height || 150, topPad = 16, botPad = 22;
    need(h + 10);
    const x0 = M, y0 = doc.y, maxV = Math.max(opts.max || 9, ...data.map((d) => d.value));
    const n = data.length, gap = 8, bw = (W - gap * (n - 1)) / n;
    // axis
    doc.moveTo(x0, y0 + h - botPad).lineTo(x0 + W, y0 + h - botPad).lineWidth(0.75).strokeColor(LINE).stroke();
    data.forEach((d, i) => {
      const bx = x0 + i * (bw + gap);
      const bh = Math.max(3, (d.value / maxV) * (h - topPad - botPad));
      const by = y0 + h - botPad - bh;
      doc.save();
      doc.rect(bx, by, bw, bh).fill(d.hi ? GOLD : INK2);
      doc.restore();
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(8.5).text(String(d.value), bx, by - 12, { width: bw, align: 'center' });
      doc.fillColor(MUTED).font('Helvetica').fontSize(7.5).text(d.label, bx - 4, y0 + h - botPad + 4, { width: bw + 8, align: 'center' });
    });
    doc.y = y0 + h + 4; doc.x = M;
  }

  // Line chart for the 9-year cycle
  function lineChart(data, opts = {}) {
    const h = opts.height || 150, topPad = 18, botPad = 24, leftPad = 10;
    need(h + 10);
    const x0 = M + leftPad, y0 = doc.y, plotW = W - leftPad, maxV = 9, minV = 1;
    doc.moveTo(x0, y0 + h - botPad).lineTo(x0 + plotW, y0 + h - botPad).lineWidth(0.75).strokeColor(LINE).stroke();
    const pts = data.map((d, i) => {
      const x = x0 + (plotW) * (i / (data.length - 1));
      const y = y0 + topPad + (1 - (d.value - minV) / (maxV - minV)) * (h - topPad - botPad);
      return { x, y, d };
    });
    // line
    doc.save(); doc.lineWidth(1.5).strokeColor(GOLD);
    pts.forEach((p, i) => { if (i === 0) doc.moveTo(p.x, p.y); else doc.lineTo(p.x, p.y); });
    doc.stroke(); doc.restore();
    pts.forEach((p) => {
      doc.circle(p.x, p.y, 3).fill(INK2);
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(8).text(String(p.d.value), p.x - 8, p.y - 14, { width: 16, align: 'center' });
      doc.fillColor(MUTED).font('Helvetica').fontSize(7.5).text(String(p.d.year), p.x - 14, y0 + h - botPad + 4, { width: 28, align: 'center' });
    });
    doc.y = y0 + h + 4; doc.x = M;
  }

  // Lo Shu grid drawing with present/missing colouring
  function loShu(counts, size = 150) {
    need(size + 10);
    const layout = [[4, 9, 2], [3, 5, 7], [8, 1, 6]];
    const cell = size / 3, gx = M, gy = doc.y;
    for (let rI = 0; rI < 3; rI++) for (let cI = 0; cI < 3; cI++) {
      const d = layout[rI][cI], x = gx + cI * cell, y = gy + rI * cell, cnt = counts[d] || 0;
      doc.rect(x, y, cell, cell).lineWidth(1).strokeColor(LINE).stroke();
      if (cnt > 0) {
        doc.rect(x + 2, y + 2, cell - 4, cell - 4).fill(BG);
        doc.fillColor(INK).font('Helvetica-Bold').fontSize(16).text(String(d).repeat(cnt).slice(0, 4), x, y + cell / 2 - 10, { width: cell, align: 'center' });
      } else {
        doc.fillColor('#C7C9D8').font('Helvetica').fontSize(11).text(String(d), x, y + cell / 2 - 7, { width: cell, align: 'center' });
      }
    }
    return { gx, gy, size };
  }

  // Decorative gold "number wheel" (cover art)
  function numberWheel(cx, cy, R) {
    doc.save();
    doc.circle(cx, cy, R).lineWidth(1).strokeColor(GOLD).stroke();
    doc.circle(cx, cy, R * 0.74).lineWidth(0.6).strokeColor(GOLD2).stroke();
    doc.circle(cx, cy, R * 0.12).fill(GOLD);
    for (let i = 0; i < 9; i++) {
      const a = (-90 + i * 40) * Math.PI / 180;
      const x = cx + Math.cos(a) * R * 0.74, y = cy + Math.sin(a) * R * 0.74;
      doc.save(); doc.lineWidth(0.5).strokeColor(GOLD2); doc.moveTo(cx, cy).lineTo(x, y).stroke(); doc.restore();
      doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(13).text(String(i + 1), x - 8, y - 7, { width: 16, align: 'center' });
    }
    doc.restore();
  }

  // ========================= COVER =========================
  doc.rect(0, 0, PW, PH).fill(INK);
  doc.rect(0, 0, PW, 6).fill(GOLD);
  doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(13).text('ANK NUMEROLOGY', M, 60, { characterSpacing: 3 });
  doc.fillColor('#8A8FB5').font('Helvetica').fontSize(10).text('Lo Shu · Chaldean · Western', M, 82, { characterSpacing: 1 });
  numberWheel(PW / 2, 300, 120);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(34).text('Your Name Report', M, 470, { width: W, align: 'center' });
  doc.fillColor(GOLD2).font('Helvetica').fontSize(14).text(r.name, M, 520, { width: W, align: 'center' });
  doc.fillColor('#9A9FC2').font('Helvetica').fontSize(11).text(`Born ${r.dob}`, M, 544, { width: W, align: 'center' });
  doc.fillColor('#6B6F8A').font('Helvetica').fontSize(9).text(
    `Prepared on ${r.now.toDateString()} · A personalised ${'20'}-point numerology analysis`, M, PH - 90, { width: W, align: 'center' });

  // ========================= CONTENTS =========================
  sectionHeader('Your report', 'What is inside');
  Body('This is your complete numerology Name Report, calculated from your date of birth and the exact spelling of your name. It blends three systems — Indian Lo Shu, Chaldean name numbers and Western numerology — into one clear picture.');
  doc.moveDown(0.3);
  table(['Section', 'What it covers'],
    [
      ['Core numbers', 'Your Mulank, Bhagyank, name number and life path at a glance'],
      ['Mulank', 'Your root number: personality, strengths, career, relationships, health'],
      ['Bhagyank', 'Your destiny number and the path your life tends to take'],
      ['Name analysis', 'Whether your name spelling is in harmony, with options to consider'],
      ['Lo Shu grid', 'Your birth grid, planes and arrows — and what they reveal'],
      ['Present & missing numbers', 'Your natural gifts and the lessons to grow into'],
      ['Forecast', 'Your personal year, the 9-year cycle and the next 12 months'],
      ['Lucky guide & compatibility', 'Colours, days, gems, directions and which numbers suit you'],
      ['Remedies & affirmations', 'Simple practices to strengthen your chart'],
    ], [26, 74]);
  Muted('Each number is reduced to a single digit. Master numbers 11, 22 and 33 are kept only in the Western life path, never in the Indian system.');

  // ========================= CORE NUMBERS =========================
  sectionHeader('At a glance', 'Your core numbers');
  table(['Number', 'Value', 'Ruling planet', 'In one line'],
    [
      ['Mulank (root)', r.mulank, C.PLANET[r.mulank], C.MULANK[r.mulank].title + ' — ' + C.MULANK[r.mulank].summary],
      ['Bhagyank (destiny)', r.bhagyank, C.PLANET[r.bhagyank], C.BHAGYANK[r.bhagyank]],
      ['Name number (Chaldean)', r.chaldean.value, C.PLANET[r.chaldean.value], r.chaldean.compound ? `Compound ${r.chaldean.compound}, reduces to ${r.chaldean.value}` : `Reduces to ${r.chaldean.value}`],
      ['Life path (Western)', r.lifePath, C.PLANET[r.lifePath] || '—', 'The overall journey of your life'],
    ], [26, 10, 18, 46]);
  doc.moveDown(0.4);
  H('How your core numbers compare');
  barChart([
    { label: 'Mulank', value: r.mulank, hi: true },
    { label: 'Bhagyank', value: r.bhagyank },
    { label: 'Name', value: r.chaldean.value },
    { label: 'Life path', value: r.lifePath },
  ], { height: 150 });
  Muted('Taller bars simply mean a higher number — not better or worse. Harmony between these numbers matters more than their size.');

  // ========================= MULANK =========================
  sectionHeader('Root number', `Mulank ${r.mulank} — ${C.MULANK[r.mulank].title}`);
  const mk = C.MULANK[r.mulank];
  Body(mk.summary);
  kvTable([
    ['Ruling planet', mk.planet],
    ['Strengths', mk.strengths],
    ['Challenges', mk.challenges],
    ['Career & work', mk.career],
    ['Relationships', mk.relationships],
    ['Health', mk.health],
    ['Affirmation', '"' + C.AFFIRMATIONS[r.mulank] + '"'],
  ]);

  // ========================= BHAGYANK =========================
  sectionHeader('Destiny number', `Bhagyank ${r.bhagyank}`);
  Body(C.BHAGYANK[r.bhagyank]);
  kvTable([
    ['Ruling planet', C.PLANET[r.bhagyank]],
    ['Life theme', C.MULANK[r.bhagyank].title + ' energy guides your destiny'],
    ['Best expressed through', C.MULANK[r.bhagyank].career],
    ['Watch out for', C.MULANK[r.bhagyank].challenges],
  ]);
  Muted('Your Mulank is how you are wired; your Bhagyank is where life tends to lead you. When they work together, life flows; when they pull apart, your name can help bring them into balance — which is what the next section checks.');

  // ========================= NAME ANALYSIS =========================
  sectionHeader('Name analysis', 'Does your name suit you?');
  const keep = r.nameReport.verdict === 'keep';
  const cur = r.nameReport.current;
  Sub(keep ? 'Your name is in harmony' : 'Your name could be tuned');
  Body(keep
    ? `Your name number is ${cur.number}, which lines up with your ${cur.matchesMulank ? 'Mulank' : 'Bhagyank'}. The spelling you use already supports your natural strengths — there is no need to change it.`
    : `Your name number is ${cur.number}, while your Mulank is ${r.mulank} and Bhagyank is ${r.bhagyank}. They do not yet align, so a small spelling change can bring your name into harmony with the numbers you were born with.`);
  doc.moveDown(0.2);
  H('Your current name, number by number');
  const letterRows = chaldeanBreakdown(r.name);
  table(['Letter', 'Value', 'Running total'], letterRows.rows, [34, 33, 33]);
  Muted(`Total ${letterRows.total}${letterRows.total > 9 ? ` -> reduces to ${r.chaldean.value}` : ''}. (Chaldean: A I J Q Y=1, B K R=2, C G L S=3, D M T=4, E H N X=5, U V W=6, O Z=7, F P=8.)`);

  if (!keep && r.nameReport.options.length) {
    doc.moveDown(0.2);
    H('Spellings worth considering');
    const opts = r.nameReport.options.filter((o) => o.matchesMulank || o.matchesBhagyank);
    const list = (opts.length ? opts : r.nameReport.options).slice(0, 8);
    table(['Spelling', 'Number', 'Why it helps'],
      list.map((o) => [o.spelling, o.number, o.matchesMulank ? 'Matches your Mulank' : o.matchesBhagyank ? 'Matches your Bhagyank' : 'A balanced alternative']),
      [40, 16, 44]);
    Muted('A name change works best when it feels natural to say and write. Try a chosen spelling for a few weeks before making it official.');
  }

  // ========================= LO SHU GRID =========================
  sectionHeader('Birth chart', 'Your Lo Shu grid');
  Body('Your Lo Shu grid is built from the digits of your date of birth. Where numbers repeat, that energy is strong; where they are missing, there is a lesson to grow into.');
  const g = loShu(r.counts, 150);
  const tx = g.gx + g.size + 20, tw = W - g.size - 20;
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text('You have', tx, g.gy, { width: tw });
  doc.fillColor(INK2).font('Helvetica').fontSize(10).text(r.present.join(', ') || 'none', tx, doc.y, { width: tw });
  doc.moveDown(0.3);
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text('Missing', tx, doc.y, { width: tw });
  doc.fillColor(INK2).font('Helvetica').fontSize(10).text(r.missing.join(', ') || 'none — a rare full grid', tx, doc.y, { width: tw });
  doc.y = Math.max(doc.y, g.gy + g.size) + 12;

  // Planes & arrows
  H('Your planes and arrows');
  const planeRows = r.lines.filter((l) => l.kind === 'plane').map((l) => {
    const key = l.id;
    return [l.name, cap(l.status), l.status === 'complete' ? `A complete ${C.PLANES[key]}` : l.status === 'empty' ? `Missing — grow ${C.PLANES[key]}` : `Partly present — developing ${C.PLANES[key]}`];
  });
  const arrowRows = r.lines.filter((l) => l.kind === 'arrow').map((l) => {
    const key = l.id;
    return [l.name + ' arrow', cap(l.status), l.status === 'complete' ? C.ARROWS[key] : l.status === 'empty' ? C.ARROWS_MISSING[key] : 'Partly present — developing'];
  });
  table(['Line', 'Status', 'Meaning'], planeRows.concat(arrowRows), [26, 16, 58]);

  // ========================= PRESENT / MISSING =========================
  sectionHeader('Your numbers', 'Gifts and lessons');
  H('What your present numbers give you');
  table(['No.', 'Count', 'Your natural gift'],
    r.present.map((d) => [d, r.counts[d], C.DIGIT_HAVE[d]]), [10, 12, 78]);
  doc.moveDown(0.3);
  H('How strong each number is in your chart');
  barChart([1,2,3,4,5,6,7,8,9].map((d) => ({ label: String(d), value: r.counts[d] || 0, hi: d === r.mulank })), { height: 130, max: Math.max(2, ...Object.values(r.counts)) });
  Muted('The tallest bars are your dominant energies; empty bars are your missing numbers.');

  if (r.missing.length) {
    doc.moveDown(0.2);
    H('Lessons from your missing numbers (with remedies)');
    table(['No.', 'The lesson', 'A simple remedy'],
      r.missing.map((d) => [d, C.DIGIT_MISSING[d].lesson, C.DIGIT_MISSING[d].remedy]), [8, 46, 46]);
  }

  // ========================= FORECAST =========================
  sectionHeader('Forecast', `Your Personal Year ${r.personalYear}`);
  Body(`You are currently in a Personal Year ${r.personalYear}. ${C.YEAR_THEME[r.personalYear]}`);
  doc.moveDown(0.2);
  H('Your 9-year cycle');
  lineChart(r.years, { height: 150 });
  Muted('Numerology moves in nine-year cycles. A 1 year begins a new chapter; a 9 year completes it. Knowing where you are helps you act with the current, not against it.');
  doc.moveDown(0.2);

  H('The next 12 months');
  barChart(r.months.map((m) => ({ label: MONTHS[m.month - 1], value: m.value, hi: m === r.months[0] })), { height: 140 });
  doc.moveDown(0.2);
  table(['Month', 'Personal month', 'Theme'],
    r.months.map((m) => [`${MONTHS[m.month - 1]} ${m.year}`, m.value, shortTheme(m.value)]), [26, 20, 54]);

  // ========================= LUCKY GUIDE =========================
  sectionHeader('Your fortune', 'Lucky guide & compatibility');
  const lk = C.LUCKY[r.mulank];
  H('Your lucky guide');
  kvTable([
    ['Lucky colours', lk.colour],
    ['Colours to limit', lk.avoid],
    ['Good days', lk.days],
    ['Friendly numbers', lk.friendly.join(', ')],
    ['Gemstone', lk.gem],
    ['Favourable metal', lk.metal],
    ['Lucky direction', lk.direction],
    ['Ruling deity', lk.deity],
  ]);
  doc.moveDown(0.2);
  H('Which numbers suit you');
  const cp = C.COMPAT[r.mulank];
  table(['Relationship', 'Numbers', 'Note'],
    [
      ['Friendly', cp.friendly.join(', '), 'Natural ease in love, work and friendship'],
      ['Neutral', cp.neutral.join(', '), 'Workable with understanding'],
      ['Challenging', cp.challenging.join(', '), 'Needs patience and compromise'],
    ], [26, 20, 54]);
  Muted('Compatibility here is based on your Mulank. For a full couple reading, both birth dates and names are compared.');

  // ========================= REMEDIES =========================
  sectionHeader('Strengthen your chart', 'Remedies & affirmations');
  H('Simple practices');
  const rem = [
    ['Wear your colours', `Bring ${lk.colour.split(',')[0].toLowerCase()} into your clothes or workspace on ${lk.days.split(',')[0]}.`],
    ['Use your numbers', `Favour your friendly numbers (${lk.friendly.join(', ')}) in phone numbers, house numbers and important dates where you can.`],
    ['Honour your day', `${lk.days.split(',')[0]} is your strongest day — begin important work then.`],
    ['Balance a missing number', r.missing.length ? C.DIGIT_MISSING[r.missing[0]].remedy : 'Your grid is already balanced — keep nurturing your strengths.'],
    ['Daily affirmation', '"' + C.AFFIRMATIONS[r.mulank] + '"'],
  ];
  table(['Practice', 'How'], rem, [26, 74]);
  doc.moveDown(0.4);
  Body('Numerology does not replace your own choices — it is a mirror that helps you understand your natural tendencies and time your efforts. Use what resonates, and leave the rest.');

  // ---------- footer / page numbers ----------
  const range = doc.bufferedPageRange();
  for (let i = range.start + 1; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.page.margins.bottom = 0;
    doc.fillColor(MUTED).font('Helvetica').fontSize(8).text(
      `Ank Numerology · Name Report for ${r.name}`, M, PH - 34, { width: W - 40, align: 'left', lineBreak: false });
    doc.fillColor(MUTED).font('Helvetica').fontSize(8).text(String(i - range.start + 1), PW - M - 40, PH - 34, { width: 40, align: 'right', lineBreak: false });
  }
  // disclaimer on last page
  doc.switchToPage(range.start + range.count - 1);
  doc.page.margins.bottom = 0;
  doc.fillColor(MUTED).font('Helvetica-Oblique').fontSize(8).text(
    'This report is prepared for reflection and entertainment. Numerology is not a substitute for professional medical, legal or financial advice.',
    M, PH - 60, { width: W, lineBreak: false });

  doc.end();
  return new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  // local helpers
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function shortTheme(v) { return { 1: 'Fresh starts', 2: 'Patience, bonds', 3: 'Express, connect', 4: 'Work, order', 5: 'Change, travel', 6: 'Home, care', 7: 'Rest, reflect', 8: 'Push, rewards', 9: 'Finish, release' }[v]; }
  function chaldeanBreakdown(name) {
    const MAP = N.chaldeanName; // not used directly
    const letters = String(name).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
    const VAL = {}; for (const [v, ls] of Object.entries({1:'AIJQY',2:'BKR',3:'CGLS',4:'DMT',5:'EHNX',6:'UVW',7:'OZ',8:'FP'})) for (const ch of ls) VAL[ch] = Number(v);
    let t = 0; const rows = [];
    for (const ch of letters) { t += VAL[ch] || 0; rows.push([ch, String(VAL[ch] || 0), String(t)]); }
    return { rows, total: t };
  }
}

module.exports = { renderPdf, buildReport };
