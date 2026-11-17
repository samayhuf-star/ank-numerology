// Builds the full Name Report as a self-contained HTML string (fonts embedded),
// rendered to PDF by Chrome. Language-aware: shapes Devanagari and other scripts correctly.
const fs = require('fs');
const path = require('path');
const { buildReportData } = require('./report');
const { resolve } = require('./i18n');

// Script → font registry. To add a language in a new script:
//   1. npm install @fontsource/<pkg>
//   2. add an entry here (subset = the fontsource subset name, range = its CSS unicode-range)
//   3. list the script code in that language's labels `scripts` array (latin is always included)
const NMOD = path.join(__dirname, '..', 'node_modules', '@fontsource');
const SCRIPTS = {
  latin: { pkg: 'noto-sans', subset: 'latin', range: 'U+0000-00FF,U+2000-206F,U+2190-21FF,U+2600-26FF' },
  deva:  { pkg: 'noto-sans-devanagari', subset: 'devanagari', range: 'U+0900-097F,U+1CD0-1CFF,U+A830-A839' },
  beng:  { pkg: 'noto-sans-bengali', subset: 'bengali', range: 'U+0980-09FF' },
  guru:  { pkg: 'noto-sans-gurmukhi', subset: 'gurmukhi', range: 'U+0A00-0A7F' },
  gujr:  { pkg: 'noto-sans-gujarati', subset: 'gujarati', range: 'U+0A80-0AFF' },
  orya:  { pkg: 'noto-sans-oriya', subset: 'oriya', range: 'U+0B00-0B7F' },
  taml:  { pkg: 'noto-sans-tamil', subset: 'tamil', range: 'U+0B80-0BFF' },
  telu:  { pkg: 'noto-sans-telugu', subset: 'telugu', range: 'U+0C00-0C7F' },
  knda:  { pkg: 'noto-sans-kannada', subset: 'kannada', range: 'U+0C80-0CFF' },
  mlym:  { pkg: 'noto-sans-malayalam', subset: 'malayalam', range: 'U+0D00-0D7F' },
  arab:  { pkg: 'noto-sans-arabic', subset: 'arabic', range: 'U+0600-06FF,U+0750-077F,U+FB50-FDFF,U+FE70-FEFF' },
  olck:  { pkg: 'noto-sans-ol-chiki', subset: 'ol-chiki', range: 'U+1C50-1C7F' },
  mtei:  { pkg: 'noto-sans-meetei-mayek', subset: 'meetei-mayek', range: 'U+AAE0-AAFF,U+ABC0-ABFF' },
};
function fontB64(script, weight) {
  const s = SCRIPTS[script];
  return fs.readFileSync(path.join(NMOD, s.pkg, 'files', `${s.pkg}-${s.subset}-${weight}-normal.woff2`)).toString('base64');
}
function fontFaces(scripts) {
  const want = ['latin', ...scripts.filter((s) => s !== 'latin')].filter((s, i, a) => SCRIPTS[s] && a.indexOf(s) === i);
  return want.map((sc) => [400, 700].map((w) =>
    `@font-face{font-family:'NS';font-weight:${w};src:url(data:font/woff2;base64,${fontB64(sc, w)}) format('woff2');unicode-range:${SCRIPTS[sc].range};}`
  ).join('\n')).join('\n');
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));

function buildHtml(profile, lang = 'en') {
  const r = buildReportData(profile);
  const { labels: L, content: C } = resolve(lang);
  const mk = C.MULANK[r.mulank];

  // ---- small builders ----
  const table = (head, rows) => `<table><thead><tr>${head.map((h)=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${
    rows.map((row)=>`<tr>${row.map((c)=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const kv = (rows) => `<table class="kv">${rows.map((row)=>`<tr><th>${esc(row[0])}</th><td>${row[1]}</td></tr>`).join('')}</table>`;

  const barChart = (data, max) => {
    const H = 170, W = 500, pad = 26; max = Math.max(max || 9, ...data.map((d)=>d.value||0));
    const n = data.length, gap = 10, bw = (W - gap*(n-1))/n;
    const bars = data.map((d,i)=>{
      const bh = Math.max(2, (d.value/ (max||1))*(H-pad-18));
      const x = i*(bw+gap), y = H-pad-bh;
      return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3" fill="${d.hi?'#C9A227':'#1E2148'}"/>
        <text x="${x+bw/2}" y="${y-5}" class="bl">${d.value}</text>
        <text x="${x+bw/2}" y="${H-6}" class="ax">${esc(d.label)}</text>`;
    }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="chart"><line x1="0" y1="${H-pad}" x2="${W}" y2="${H-pad}" class="axis"/>${bars}</svg>`;
  };
  const lineChart = (data) => {
    const H = 170, W = 500, top = 20, bot = 28, minV = 1, maxV = 9;
    const pts = data.map((d,i)=>({ x: (W)*(i/(data.length-1)), y: top + (1-(d.value-minV)/(maxV-minV))*(H-top-bot), d }));
    const poly = pts.map((p)=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const dots = pts.map((p)=>`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="#1E2148"/>
      <text x="${p.x.toFixed(1)}" y="${(p.y-9).toFixed(1)}" class="bl">${p.d.value}</text>
      <text x="${p.x.toFixed(1)}" y="${H-8}" class="ax">${p.d.year}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="chart"><line x1="0" y1="${H-bot}" x2="${W}" y2="${H-bot}" class="axis"/>
      <polyline points="${poly}" fill="none" stroke="#C9A227" stroke-width="2"/>${dots}</svg>`;
  };
  const loShu = (counts) => {
    const layout = [[4,9,2],[3,5,7],[8,1,6]];
    return `<div class="grid">${layout.flat().map((d)=>{
      const cnt = counts[d]||0;
      return `<div class="cell ${cnt?'has':'empty'}">${cnt?String(d).repeat(cnt).slice(0,4):d}</div>`;
    }).join('')}</div>`;
  };
  const wheel = () => {
    const cx=130, cy=130, R=112; let s='';
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" stroke="#C9A227" fill="none" stroke-width="1"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R*0.74}" stroke="#E3C766" fill="none" stroke-width="0.6"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R*0.1}" fill="#C9A227"/>`;
    for(let i=0;i<9;i++){ const a=(-90+i*40)*Math.PI/180, x=cx+Math.cos(a)*R*0.74, y=cy+Math.sin(a)*R*0.74;
      s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#E3C766" stroke-width="0.5"/>
        <text x="${x.toFixed(1)}" y="${(y+5).toFixed(1)}" text-anchor="middle" fill="#C9A227" font-size="15" font-weight="700">${i+1}</text>`; }
    return `<svg viewBox="0 0 260 260" class="wheel">${s}</svg>`;
  };

  const sectionHead = (kicker, title) => `<div class="shead"><div class="kick">${esc(kicker)}</div><h1>${esc(title)}</h1></div>`;
  const page = (inner, cls='') => `<section class="page ${cls}">${inner}</section>`;

  // ---- sections ----
  const brandWordmark = (L.scripts && L.scripts.includes('deva')) ? 'अंक न्यूमेरोलॉजी' : 'ANK NUMEROLOGY';
  const cover = page(`
    <div class="brand">${esc(brandWordmark)}</div>
    <div class="tagline">${esc(L.tagline)}</div>
    ${wheel()}
    <h1 class="ctitle">${esc(L.reportTitle)}</h1>
    <div class="cname">${esc(r.name)}</div>
    <div class="cdob">${esc(L.born)} ${esc(r.dob)}</div>
    <div class="cfoot">${esc(L.preparedOn(r.now.toLocaleDateString(lang==='hi'?'hi-IN':'en-GB')))}</div>`, 'cover');

  const contents = page(sectionHead(L.kickers.contents, L.titles.contents) +
    `<p class="body">${esc(L.contentsIntro)}</p>` +
    table(L.contentsHead, L.contentsRows.map((row)=>[esc(row[0]), esc(row[1])])) +
    `<p class="muted">${esc(L.contentsNote)}</p>`);

  const core = page(sectionHead(L.kickers.core, L.titles.core) +
    table(L.coreHead, [
      [L.coreRows[0], r.mulank, esc(C.PLANET[r.mulank]), esc(`${mk.title} — ${mk.summary}`)],
      [L.coreRows[1], r.bhagyank, esc(C.PLANET[r.bhagyank]), esc(C.BHAGYANK[r.bhagyank])],
      [L.coreRows[2], r.chaldean.value, esc(C.PLANET[r.chaldean.value]), esc(r.chaldean.compound?L.compound(r.chaldean.compound,r.chaldean.value):L.reduces(r.chaldean.value))],
      [L.coreRows[3], r.lifePath, esc(C.PLANET[r.lifePath]||'—'), esc(L.oneLineLife)],
    ].map((row)=>row.map(String))) +
    `<div class="kick2">${esc(L.coreCompare)}</div>` +
    barChart([
      { label:L.coreRows[0].split(' ')[0], value:r.mulank, hi:true },
      { label:L.coreRows[1].split(' ')[0], value:r.bhagyank },
      { label:L.coreRows[2].split(' ')[0], value:r.chaldean.value },
      { label:L.coreRows[3].split(' ')[0], value:r.lifePath },
    ]) +
    `<p class="muted">${esc(L.coreCaption)}</p>`);

  const mulankPage = page(sectionHead(`${L.kickers.mulank} ${r.mulank}`, `${lang==='hi'?'मूलांक':'Mulank'} ${r.mulank} — ${esc(mk.title)}`) +
    `<p class="body">${esc(mk.summary)}</p>` +
    kv([[L.mulankKV[0], esc(mk.planet)],[L.mulankKV[1], esc(mk.strengths)],[L.mulankKV[2], esc(mk.challenges)],
      [L.mulankKV[3], esc(mk.career)],[L.mulankKV[4], esc(mk.relationships)],[L.mulankKV[5], esc(mk.health)],
      [L.mulankKV[6], `"${esc(C.AFFIRMATIONS[r.mulank])}"`]]));

  const bhagyankPage = page(sectionHead(`${L.kickers.bhagyank} ${r.bhagyank}`, `${lang==='hi'?'भाग्यांक':'Bhagyank'} ${r.bhagyank}`) +
    `<p class="body">${esc(C.BHAGYANK[r.bhagyank])}</p>` +
    kv([[L.bhagyankKV[0], esc(C.PLANET[r.bhagyank])],[L.bhagyankKV[1], esc(L.bhagyankTheme(C.MULANK[r.bhagyank].title))],
      [L.bhagyankKV[2], esc(C.MULANK[r.bhagyank].career)],[L.bhagyankKV[3], esc(C.MULANK[r.bhagyank].challenges)]]) +
    `<p class="muted">${esc(L.bhagyankNote)}</p>`);

  const keep = r.nameReport.verdict === 'keep';
  const cur = r.nameReport.current;
  const opts = r.nameReport.options.filter((o)=>o.matchesMulank||o.matchesBhagyank);
  const spellList = (keep ? [] : (opts.length?opts:r.nameReport.options).slice(0,8));
  const namePage = page(sectionHead(L.kickers.name, L.titles.name) +
    `<h2>${esc(keep?L.nameHarmony:L.nameTune)}</h2>` +
    `<p class="body">${esc(keep?L.nameKeep(cur.number, cur.matchesMulank?(lang==='hi'?'मूलांक':'Mulank'):(lang==='hi'?'भाग्यांक':'Bhagyank')):L.nameTuneBody(cur.number,r.mulank,r.bhagyank))}</p>` +
    `<div class="kick2">${esc(L.letterByLetter)}</div>` +
    table(L.letterHead, r.letters.rows.map((x)=>[x.ch, x.v, x.total].map(String))) +
    `<p class="muted">${esc(L.totalLine(r.letters.total, r.chaldean.value))}</p>` +
    (spellList.length ? `<div class="kick2">${esc(L.considerSpellings)}</div>` +
      table(L.spellHead, spellList.map((o)=>[esc(o.spelling), String(o.number), esc(o.matchesMulank?L.matchesMulank:o.matchesBhagyank?L.matchesBhagyank:L.balancedAlt)])) +
      `<p class="muted">${esc(L.spellNote)}</p>` : ''));

  const planeRows = r.lines.filter((l)=>l.kind==='plane').map((l)=>{
    const m = C.PLANES[l.id];
    return [esc((L.lineNames&&L.lineNames[l.id])||l.name)+' ', L.status[l.status], esc(l.status==='complete'?L.planeComplete(m):l.status==='empty'?L.planeEmpty(m):L.planePartial(m))];
  });
  const arrowRows = r.lines.filter((l)=>l.kind==='arrow').map((l)=>{
    return [esc((L.lineNames&&L.lineNames[l.id])||l.name)+esc(L.arrowSuffix), L.status[l.status], esc(l.status==='complete'?C.ARROWS[l.id]:l.status==='empty'?C.ARROWS_MISSING[l.id]:L.arrowPartial)];
  });
  const loshuPage = page(sectionHead(L.kickers.loshu, L.titles.loshu) +
    `<p class="body">${esc(L.loshuIntro)}</p>` +
    `<div class="loshuRow">${loShu(r.counts)}<div class="loshuSide">
      <div class="sh">${esc(L.youHave)}</div><div>${r.present.join(', ')||esc(L.none)}</div>
      <div class="sh">${esc(L.missing)}</div><div>${r.missing.length?r.missing.join(', '):esc(L.fullGrid)}</div></div></div>` +
    `<div class="kick2">${esc(L.planesArrows)}</div>` +
    table(L.lineHead, planeRows.concat(arrowRows)));

  const numbersPage = page(sectionHead(L.kickers.numbers, L.titles.numbers) +
    `<div class="kick2">${esc(L.presentTitle)}</div>` +
    table(L.presentHead, r.present.map((d)=>[String(d), String(r.counts[d]), esc(C.DIGIT_HAVE[d])])) +
    `<div class="kick2">${esc(L.strengthTitle)}</div>` +
    barChart([1,2,3,4,5,6,7,8,9].map((d)=>({ label:String(d), value:r.counts[d]||0, hi:d===r.mulank })), Math.max(2,...Object.values(r.counts))) +
    `<p class="muted">${esc(L.strengthCaption)}</p>` +
    (r.missing.length ? `<div class="kick2">${esc(L.missingTitle)}</div>` +
      table(L.missingHead, r.missing.map((d)=>[String(d), esc(C.DIGIT_MISSING[d].lesson), esc(C.DIGIT_MISSING[d].remedy)])) : ''));

  const forecastPage = page(sectionHead(L.kickers.forecast, L.pyTitle(r.personalYear)) +
    `<p class="body">${esc(L.pyBody(r.personalYear, C.YEAR_THEME[r.personalYear]))}</p>` +
    `<div class="kick2">${esc(L.cycle)}</div>` + lineChart(r.years) +
    `<p class="muted">${esc(L.cycleCaption)}</p>` +
    `<div class="kick2">${esc(L.next12)}</div>` +
    barChart(r.months.map((m,i)=>({ label:r.monthNames[m.month-1], value:m.value, hi:i===0 }))) +
    table(L.monthHead, r.months.map((m)=>[`${r.monthNames[m.month-1]} ${m.year}`, String(m.value), esc(L.monthThemes[m.value])])));

  const lk = C.LUCKY[r.mulank];
  const cp = C.COMPAT[r.mulank];
  const luckyPage = page(sectionHead(L.kickers.lucky, L.titles.lucky) +
    `<div class="kick2">${esc(L.luckyTitle)}</div>` +
    kv([[L.luckyKV[0], esc(lk.colour)],[L.luckyKV[1], esc(lk.avoid)],[L.luckyKV[2], esc(lk.days)],[L.luckyKV[3], lk.friendly.join(', ')],
      [L.luckyKV[4], esc(lk.gem)],[L.luckyKV[5], esc(lk.metal)],[L.luckyKV[6], esc(lk.direction)],[L.luckyKV[7], esc(lk.deity)]]) +
    `<div class="kick2">${esc(L.whichSuit)}</div>` +
    table(L.compatHead, [
      [L.friendly, cp.friendly.join(', '), esc(L.friendlyNote)],
      [L.neutral, cp.neutral.join(', '), esc(L.neutralNote)],
      [L.challenging, cp.challenging.join(', '), esc(L.challengingNote)],
    ]) +
    `<p class="muted">${esc(L.compatNote)}</p>`);

  const missingRemedy = r.missing.length ? C.DIGIT_MISSING[r.missing[0]].remedy : L.balancedAlready;
  const remediesPage = page(sectionHead(L.kickers.remedies, L.titles.remedies) +
    `<div class="kick2">${esc(L.practicesTitle)}</div>` +
    table(L.practiceHead, L.practices(lk, missingRemedy, C.AFFIRMATIONS[r.mulank]).map((row)=>[esc(row[0]), esc(row[1])])) +
    `<p class="body">${esc(L.closing)}</p>` +
    `<p class="disc">${esc(L.disclaimer)}</p>`);

  let pages;
  if (lang === 'en') {
    // Full extended report: identity, life areas, past / present / future, practical guidance.
    const X = require('./extra').buildExtra({ r, C, mk, h: { page, sectionHead, table, kv, barChart, lineChart, esc } });
    const base = [['Your core numbers', 'Mulank, Bhagyank, name number and life path'], ['Mulank and Bhagyank', 'Your character and your destiny'],
      ['Your name', 'Letter by letter, with spelling options'], ['Your Lo Shu birth grid', 'Planes, arrows and missing numbers'],
      ['Your lucky guide', 'Colours, gem, direction and compatibility'], ['Your remedies', 'Affirmations and practices']];
    const tocRows = base.concat(X.toc);
    const tocAll = tocRows.map((row, i) => [String(i + 1), esc(row[0]), esc(row[1])]);
    const tocHead = ['No.', 'Section', 'What it covers'];
    const split = Math.ceil(tocAll.length / 2);
    const contentsX = page(sectionHead(L.kickers.contents, L.titles.contents) +
      `<p class="body">Your report in ${tocRows.length} sections: who you are, your past, your present and your future.</p>` + table(tocHead, tocAll.slice(0, split))) +
      page(sectionHead(L.kickers.contents, 'Contents, continued') + table(tocHead, tocAll.slice(split)));
    pages = [cover, contentsX, core, mulankPage, bhagyankPage, ...X.identity, namePage, loshuPage, numbersPage, ...X.afterGrid,
      ...X.lifeAreas, ...X.timeline, ...X.future, luckyPage, ...X.practical, remediesPage, ...X.closing].join('\n');
  } else {
    pages = [cover, contents, core, mulankPage, bhagyankPage, namePage, loshuPage, numbersPage, forecastPage, luckyPage, remediesPage].join('\n');
  }

  return `<!doctype html><html lang="${lang}" dir="${L.dir}" data-nl="${(L.scripts||[]).some((x)=>x!=='latin')?1:0}"><head><meta charset="utf-8"><style>
${fontFaces(L.scripts || ['latin'])}
@page{size:A4;margin:0;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'NS',sans-serif;color:#12142B;-webkit-font-smoothing:antialiased;}
.page{width:210mm;min-height:297mm;padding:0 0 22mm;position:relative;page-break-after:always;}
.page:last-child{page-break-after:auto;}
.shead{background:#12142B;color:#fff;padding:12mm 14mm 9mm;margin-bottom:8mm;}
.kick{color:#C9A227;font-weight:700;font-size:8.5pt;letter-spacing:2px;text-transform:uppercase;}
.shead h1{font-size:19pt;margin-top:4px;font-weight:700;}
.kick2{color:#C9A227;font-weight:700;font-size:8.5pt;letter-spacing:1.4px;text-transform:uppercase;margin:7mm 14mm 3mm;}
.body{margin:0 14mm 4mm;font-size:10.5pt;line-height:1.55;}
.muted{margin:3mm 14mm;font-size:9pt;color:#6B6F8A;line-height:1.5;}
.disc{margin:6mm 14mm;font-size:8pt;color:#6B6F8A;font-style:italic;}
h2{margin:0 14mm 2mm;font-size:13pt;}
table{width:calc(100% - 28mm);margin:0 14mm 2mm;border-collapse:collapse;font-size:9pt;}
th{background:#12142B;color:#fff;text-align:start;padding:5px 7px;font-size:9pt;}
td{padding:5px 7px;border-bottom:0.5px solid #E3E4EE;vertical-align:top;line-height:1.4;}
tbody tr:nth-child(even){background:#F7F7FB;}
table.kv{font-size:9.5pt;}
table.kv th{background:none;color:#12142B;width:38mm;border-bottom:0.5px solid #E3E4EE;padding:5px 7px;}
table.kv td{color:#1E2148;}
.chart{width:calc(100% - 28mm);margin:1mm 14mm 2mm;height:48mm;}
.chart .bl{fill:#12142B;font-size:9px;font-weight:700;text-anchor:middle;}
.chart .ax{fill:#6B6F8A;font-size:7.5px;text-anchor:middle;}
.chart .axis{stroke:#E3E4EE;stroke-width:0.75;}
.loshuRow{display:flex;gap:10mm;margin:0 14mm 3mm;align-items:flex-start;}
.grid{direction:ltr;display:grid;grid-template-columns:repeat(3,16mm);grid-template-rows:repeat(3,16mm);}
.cell{border:0.75px solid #E3E4EE;display:flex;align-items:center;justify-content:center;font-size:13pt;font-weight:700;}
.cell.has{background:#F7F7FB;color:#12142B;}
.cell.empty{color:#C7C9D8;font-weight:400;}
.loshuSide .sh{font-weight:700;font-size:10pt;margin-top:2mm;}
.loshuSide div{font-size:10pt;color:#1E2148;}
/* cover */
.cover{background:#12142B;color:#fff;text-align:center;padding-top:22mm;}
.cover .brand{color:#C9A227;font-weight:700;letter-spacing:3px;font-size:13pt;}
.cover .tagline{color:#8A8FB5;font-size:10pt;margin-top:4px;margin-bottom:14mm;}
.wheel{width:70mm;height:70mm;margin:0 auto 16mm;}
.ctitle{font-size:30pt;font-weight:700;margin-bottom:5mm;}
.cname{color:#E3C766;font-size:15pt;}
.cdob{color:#9A9FC2;font-size:11pt;margin-top:3px;}
.cfoot{color:#6B6F8A;font-size:9pt;position:absolute;bottom:18mm;left:0;right:0;}
html[data-nl="1"] .kick,html[data-nl="1"] .kick2,html[data-nl="1"] .brand{letter-spacing:normal;}
</style></head><body>${pages}</body></html>`;
}

module.exports = { buildHtml };
