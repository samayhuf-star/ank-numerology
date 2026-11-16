// Computes all report data from a profile. Shared by the HTML renderer and handler.
const N = require('./numerology');
const pad = (n) => String(n).padStart(2, '0');
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildReportData(profile, now = new Date()) {
  const { name, day, month, year } = profile;
  const counts = N.loShuGrid(day, month, year);
  return {
    name, day, month, year, dob: `${pad(day)}-${pad(month)}-${year}`,
    mulank: N.mulank(day), bhagyank: N.bhagyank(day, month, year), lifePath: N.lifePath(day, month, year),
    chaldean: N.chaldeanName(name), counts,
    present: N.presentDigits(counts), missing: N.missingDigits(counts),
    lines: N.readLines(counts), nameReport: N.nameReport(name, day, month, year),
    personalYear: N.personalYear(day, month, now.getFullYear()),
    months: N.monthSeries(day, month, now.getFullYear(), now.getMonth() + 1, 12),
    years: N.yearSeries(day, month, now.getFullYear(), 9),
    letters: chaldeanBreakdown(name),
    now, monthNames: MONTHS_EN,
  };
}

function chaldeanBreakdown(name) {
  const letters = String(name).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  const VAL = {}; for (const [v, ls] of Object.entries({1:'AIJQY',2:'BKR',3:'CGLS',4:'DMT',5:'EHNX',6:'UVW',7:'OZ',8:'FP'})) for (const ch of ls) VAL[ch] = Number(v);
  let t = 0; const rows = [];
  for (const ch of letters) { t += VAL[ch] || 0; rows.push({ ch, v: VAL[ch] || 0, total: t }); }
  return { rows, total: t };
}

module.exports = { buildReportData };
