// Pure numerology engine — ported from the Ank Numerology app (src/engine).
// No side effects, no I/O. CommonJS for the serverless runtime.

function reduce(n, keepMaster = false) {
  let x = Math.abs(Math.trunc(n));
  while (x > 9) {
    if (keepMaster && (x === 11 || x === 22 || x === 33)) return x;
    x = String(x).split('').reduce((a, d) => a + Number(d), 0);
  }
  return x;
}

const digitsOf = (s) => String(s).replace(/\D/g, '').split('').map(Number);

const CHALDEAN = {};
for (const [v, ls] of Object.entries({
  1: 'AIJQY', 2: 'BKR', 3: 'CGLS', 4: 'DMT', 5: 'EHNX', 6: 'UVW', 7: 'OZ', 8: 'FP',
})) for (const ch of ls) CHALDEAN[ch] = Number(v);

const letters = (name) =>
  String(name).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');

const mulank = (day) => reduce(day);
const bhagyank = (day, month, year) => reduce(digitsOf(`${day}${month}${year}`).reduce((a, b) => a + b, 0));
const lifePath = (day, month, year) => reduce(reduce(day, true) + reduce(month, true) + reduce(year, true), true);

function chaldeanName(name) {
  const total = [...letters(name)].reduce((a, c) => a + (CHALDEAN[c] || 0), 0);
  return { value: reduce(total), compound: total > 9 ? total : null };
}

function loShuGrid(day, month, year) {
  const counts = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  for (const d of digitsOf(`${day}${month}${year}`)) if (d > 0) counts[d]++;
  return counts;
}

const personalYear = (day, month, cy) => reduce(reduce(day) + reduce(month) + reduce(cy));

function isValidDate(day, month, year) {
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

// Lo Shu lines (planes + arrows)
const LINES = [
  { id: 'thinking', kind: 'plane', name: 'Thinking plane', digits: [4, 9, 2] },
  { id: 'feeling', kind: 'plane', name: 'Feeling plane', digits: [3, 5, 7] },
  { id: 'practical', kind: 'plane', name: 'Practical plane', digits: [8, 1, 6] },
  { id: 'planning', kind: 'arrow', name: 'Planning', digits: [4, 3, 8] },
  { id: 'willpower', kind: 'arrow', name: 'Willpower', digits: [9, 5, 1] },
  { id: 'action', kind: 'arrow', name: 'Action', digits: [2, 7, 6] },
  { id: 'determination', kind: 'arrow', name: 'Determination', digits: [4, 5, 6] },
  { id: 'intuition', kind: 'arrow', name: 'Intuition', digits: [2, 5, 8] },
];

function readLines(counts) {
  return LINES.map((l) => {
    const present = l.digits.filter((d) => (counts[d] || 0) > 0);
    const missing = l.digits.filter((d) => (counts[d] || 0) === 0);
    const status = present.length === 3 ? 'complete' : present.length === 0 ? 'empty' : 'partial';
    return { ...l, present, missing, status };
  });
}

const missingDigits = (counts) => [1,2,3,4,5,6,7,8,9].filter((d) => (counts[d] || 0) === 0);
const presentDigits = (counts) => [1,2,3,4,5,6,7,8,9].filter((d) => (counts[d] || 0) > 0);

// Name report (keep / consider, with spelling options)
function clean(s) { return String(s).normalize('NFKD').replace(/[^A-Za-z ]/g, '').replace(/\s+/g, ' ').trim(); }

function variants(full) {
  const name = clean(full);
  if (!name) return [];
  const parts = name.split(' ');
  const out = new Set([name]);
  const last = parts.length - 1;
  for (let p = 0; p < parts.length; p++) {
    const w = parts[p];
    out.add([...parts.slice(0, p), w + w[w.length - 1], ...parts.slice(p + 1)].join(' '));
    const m = w.match(/([AEIOUaeiou])\1/i);
    if (m) out.add([...parts.slice(0, p), w.replace(m[0], m[1]), ...parts.slice(p + 1)].join(' '));
    const i = w.search(/[AEIOUaeiou]/);
    if (i >= 0 && !m) out.add([...parts.slice(0, p), w.slice(0, i + 1) + w[i] + w.slice(i + 1), ...parts.slice(p + 1)].join(' '));
  }
  if (last >= 0) out.add([...parts.slice(0, last), parts[last] + 'n'].join(' '));
  return [...out];
}

function checkSpelling(spelling, d, m, y, current = false) {
  const r = chaldeanName(spelling);
  const counts = loShuGrid(d, m, y);
  const missing = missingDigits(counts);
  return {
    spelling: clean(spelling), compound: r.compound, number: r.value,
    matchesMulank: r.value === mulank(d), matchesBhagyank: r.value === bhagyank(d, m, y),
    addsMissing: missing.includes(r.value) ? [r.value] : [], current,
  };
}

function nameReport(full, d, m, y) {
  const cur = checkSpelling(full, d, m, y, true);
  const options = variants(full).filter((v) => v !== clean(full)).map((v) => checkSpelling(v, d, m, y));
  return { current: cur, options, verdict: cur.matchesMulank || cur.matchesBhagyank ? 'keep' : 'consider' };
}

module.exports = {
  reduce, mulank, bhagyank, lifePath, chaldeanName, loShuGrid, personalYear,
  isValidDate, readLines, missingDigits, presentDigits, nameReport, clean, LINES,
};

// --- Forecast cycles (for the full report) ---
function personalMonth(day, month, calYear, calMonth) {
  return reduce(personalYear(day, month, calYear) + reduce(calMonth));
}
function monthSeries(day, month, calYear, startMonth, count) {
  const out = [];
  let y = calYear, m = startMonth;
  for (let i = 0; i < count; i++) {
    out.push({ year: y, month: m, value: personalMonth(day, month, y, m) });
    m++; if (m > 12) { m = 1; y++; }
  }
  return out;
}
function yearSeries(day, month, startYear, count) {
  const out = [];
  for (let i = 0; i < count; i++) out.push({ year: startYear + i, value: personalYear(day, month, startYear + i) });
  return out;
}
module.exports.personalMonth = personalMonth;
module.exports.personalYear = personalYear;
module.exports.monthSeries = monthSeries;
module.exports.yearSeries = yearSeries;
