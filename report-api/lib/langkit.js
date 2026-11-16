// Helpers so a language file only needs to supply translated TEXT; language-neutral data
// (numbers, compatibility tables, friendly-number lists) is shared from the English pack.
const en = require('./content');
const DIGITS = [1,2,3,4,5,6,7,8,9];

// lucky: { 1: [colour, avoid, days, gem, metal, direction, deity], ... }
function lucky(t) {
  const out = {};
  for (const d of DIGITS) {
    const [colour, avoid, days, gem, metal, direction, deity] = t[d];
    out[d] = { colour, avoid, days, friendly: en.LUCKY[d].friendly, gem, metal, direction, deity };
  }
  return out;
}
// mulank: { 1: [title, planetName, summary, strengths, challenges, career, relationships, health], ... }
function mulank(t) {
  const out = {};
  for (const d of DIGITS) {
    const [title, planet, summary, strengths, challenges, career, relationships, health] = t[d];
    out[d] = { title, planet, summary, strengths, challenges, career, relationships, health };
  }
  return out;
}
// missing: { 1: [lesson, remedy], ... }
function missing(t) {
  const out = {};
  for (const d of DIGITS) out[d] = { lesson: t[d][0], remedy: t[d][1] };
  return out;
}
// planet names array [Sun..Mars] -> {1..9}
function planets(a) { const o = {}; DIGITS.forEach((d, i) => { o[d] = a[i]; }); return o; }
// 9-item arrays -> {1..9}
function nine(a) { const o = {}; DIGITS.forEach((d, i) => { o[d] = a[i]; }); return o; }

module.exports = { en, lucky, mulank, missing, planets, nine, COMPAT: en.COMPAT };
