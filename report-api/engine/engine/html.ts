// Turns report pages into one self-contained HTML document (A4). Used by the sample generator and by the server that emails the PDF.
import { LAYOUT } from './loshu.ts';
import type { Block, Page } from './fullReport.ts';

const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const INK = '#4b3fb5', GOLD = '#c9a227';

const grid = (counts: Record<number, number>) => `<svg viewBox="0 0 180 180" width="150" height="150">${LAYOUT.map((row, r) => row.map((d, c) => { const n = counts[d]; return `<rect x="${c * 58 + 3}" y="${r * 58 + 3}" width="54" height="54" rx="8" fill="${n ? INK : '#efeefb'}"/><text x="${c * 58 + 30}" y="${r * 58 + 38}" text-anchor="middle" font-size="22" font-weight="700" fill="${n ? '#fff' : '#a9a4d8'}">${n ? String(d).repeat(n) : d}</text>`; }).join('')).join('')}</svg>`;

const bars = (items: { l: string; v: number }[], max: number) => {
  const w = Math.max(items.length * 40 + 10, 200);
  return `<svg viewBox="0 0 ${w} 120" width="100%" style="max-height:130px">${items.map((x, i) => { const h = Math.max(2, (x.v / max) * 70); return `<rect x="${i * 40 + 10}" y="${90 - h}" width="28" height="${h}" rx="4" fill="${INK}"/><text x="${i * 40 + 24}" y="${86 - h}" text-anchor="middle" font-size="11" fill="#333">${x.v}</text><text x="${i * 40 + 24}" y="106" text-anchor="middle" font-size="9" font-weight="700" fill="#555">${esc(x.l)}</text>`; }).join('')}</svg>`;
};

const block = (b: Block): string => {
  switch (b.k) {
    case 'h': return `<h3>${esc(b.t)}</h3>`;
    case 'p': return `<p>${esc(b.t)}</p>`;
    case 'bul': return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    case 'stats': return `<div class="stats">${b.items.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span><i>${esc(s.sub ?? '')}</i></div>`).join('')}</div>`;
    case 'table': return `<table><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    case 'grid': return `<div class="vis">${grid(b.counts)}${b.caption ? `<small>${esc(b.caption)}</small>` : ''}</div>`;
    case 'bars': return `<div class="vis">${b.title ? `<h4>${esc(b.title)}</h4>` : ''}${bars(b.items, b.max ?? Math.max(...b.items.map((x) => x.v), 1))}${b.caption ? `<small>${esc(b.caption)}</small>` : ''}</div>`;
    case 'tiles': return `<div class="tiles">${b.items.map((t) => `<span><b>${esc(t.top)}</b><i>${esc(t.main)}</i></span>`).join('')}</div>${b.caption ? `<small>${esc(b.caption)}</small>` : ''}`;
    case 'cal': { const pad = Array.from({ length: b.startDow }, () => '<span class="e"></span>').join(''); return `<div class="vis"><h4>${esc(b.title)}</h4><div class="cal">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<em>${d}</em>`).join('')}${pad}${b.cells.map((c) => `<span class="${[1, 3, 5, 8].includes(c.pd) ? 'g' : [7, 9].includes(c.pd) ? 'q' : ''}"><b>${c.date}</b><i>${c.pd}</i></span>`).join('')}</div>${b.caption ? `<small>${esc(b.caption)}</small>` : ''}</div>`; }
    case 'note': return `<div class="note">${esc(b.t)}</div>`;
  }
};

const css = `@page{size:A4;margin:14mm 14mm 16mm}*{box-sizing:border-box}body{font-family:Helvetica,Arial,'Noto Sans',sans-serif;color:#222;margin:0;font-size:12.5px}
.sec{margin-top:16px}.sec.new{page-break-before:always}.sec:first-child{page-break-before:avoid}h1,h3,h4,.k{break-after:avoid}
.k{color:${INK};font-size:10px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;border-bottom:2px solid ${GOLD};padding-bottom:4px}h1{font-size:23px;margin:8px 0 10px;color:#1b1840}h3{font-size:14.5px;margin:12px 0 3px;color:${INK}}h4{font-size:12px;margin:8px 0 2px}
p{line-height:1.5;margin:5px 0}ul{line-height:1.5;margin:5px 0;padding-left:18px}
table{border-collapse:collapse;width:100%;margin:8px 0;font-size:11.5px;page-break-inside:auto}tr{page-break-inside:avoid}th{background:${INK};color:#fff;text-align:left;padding:5px 7px}td{padding:5px 7px;border-bottom:1px solid #e4e2f5;vertical-align:top}tbody tr:nth-child(even) td{background:#f6f5fd}
.stats{display:flex;gap:8px;margin:8px 0}.stats div{flex:1;background:#f1effc;border-radius:10px;padding:8px 10px;text-align:center}.stats b{display:block;font-size:22px;color:${INK}}.stats span{font-size:10px;font-weight:700;text-transform:uppercase;color:#555}.stats i{display:block;font-size:11px;font-style:normal;color:#777}
.vis{text-align:center;margin:8px 0;page-break-inside:avoid}small{display:block;color:#777;font-size:10.5px;margin-top:2px}
.tiles{display:flex;flex-wrap:wrap;gap:5px;margin:6px 0}.tiles span{background:#f1effc;border-radius:8px;padding:4px 8px;text-align:center;min-width:34px}.tiles b{display:block;font-size:13px;color:${INK}}.tiles i{font-style:normal;font-size:11px;color:#555}
.note{background:#fff8e1;border-left:4px solid ${GOLD};padding:7px 10px;margin:8px 0;font-size:11.5px;line-height:1.45}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;max-width:420px;margin:4px auto}.cal em{font-style:normal;font-size:9px;font-weight:700;color:#777}.cal span{background:#f3f2fa;border-radius:5px;padding:3px 0;min-height:30px}.cal span.g{background:#ffe9a8}.cal span.q{background:#dfe9ff}.cal b{display:block;font-size:10px}.cal i{display:block;font-style:normal;font-size:12px;font-weight:700;color:${INK}}.cal .e{background:none}`;

export function renderHtml(pages: Page[], title: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>${css}</style></head><body>${pages.map((p, i) => `<section class="sec${i > 0 && p.kicker.split(' · ')[0] !== pages[i - 1].kicker.split(' · ')[0] ? ' new' : ''}"><div class="k">${esc(p.kicker)}</div><h1>${esc(p.title)}</h1>${p.blocks.map(block).join('')}</section>`).join('')}</body></html>`;
}
