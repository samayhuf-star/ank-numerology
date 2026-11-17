// POST /api/name-report  — body: Order { id, email, language, profile{ id,name,day,month,year }, tips, createdAt }
// Computes the numerology Name Report, renders a PDF, emails it via Resend. Returns 202 when sent.
const { Resend } = require('resend');
const { buildHtml } = require('../lib/html');
const { htmlToPdf } = require('../lib/render');
const N = require('../lib/numerology');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.REPORT_FROM || 'Ank Numerology <reports@adiology.io>';
const BRAND = 'Ank Numerology';

function bad(res, code, msg) { res.status(code).json({ ok: false, error: msg }); }

module.exports = async (req, res) => {
  if (req.method === 'GET') return res.status(200).json({ ok: true, service: 'ank-name-report', status: 'up' });
  if (req.method !== 'POST') return bad(res, 405, 'method not allowed');

  let order = req.body;
  if (typeof order === 'string') { try { order = JSON.parse(order); } catch { return bad(res, 400, 'invalid json'); } }
  const p = order && order.profile;
  const email = order && order.email;
  if (!p || !p.name || !p.day || !p.month || !p.year) return bad(res, 400, 'missing profile fields');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email))) return bad(res, 400, 'invalid email');
  if (!N.isValidDate(p.day, p.month, p.year)) return bad(res, 400, 'invalid date of birth');
  if (!process.env.RESEND_API_KEY) return bad(res, 500, 'email not configured');

  try {
    const lang = normalizeLang(order.language);
    // English orders get the dense Complete Report built by the shared engine; other languages keep the localised report until translated.
    let htmlDoc;
    if (lang === 'en') {
      const [{ buildComplete }, { renderHtml }] = await Promise.all([import('../engine/engine/complete.ts'), import('../engine/engine/html.ts')]);
      htmlDoc = renderHtml(buildComplete({ name: p.name, day: p.day, month: p.month, year: p.year }, new Date()), `Complete Report for ${p.name}`);
    } else htmlDoc = buildHtml(p, lang);
    const pdf = await htmlToPdf(htmlDoc);
    const nameNum = N.chaldeanName(p.name).value;
    const verdict = N.nameReport(p.name, p.day, p.month, p.year).verdict;
    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;max-width:520px;margin:auto;color:#12142B">
        <div style="background:#12142B;color:#fff;padding:24px 28px;border-radius:12px 12px 0 0">
          <div style="color:#C9A227;font-weight:700;letter-spacing:2px;font-size:12px">ANK NUMEROLOGY</div>
          <div style="font-size:20px;font-weight:700;margin-top:6px">Your Complete Report is ready</div>
        </div>
        <div style="padding:24px 28px;background:#F7F7FB;border-radius:0 0 12px 12px">
          <p>Namaste ${escapeHtml(p.name.split(' ')[0] || 'there')},</p>
          <p>Your Complete Report is attached as a PDF. It shows your Mulank, Bhagyank and Chaldean name number with the working, how your name agrees with your birth numbers${verdict === 'consider' ? ' (with spellings worth considering)' : ''}, your Lo Shu grid, your next nine years, a calendar for each of the next twelve months, and your lucky guide.</p>
          <p style="color:#6B6F8A;font-size:13px">Name number: ${nameNum} · Prepared just for you.</p>
          <p style="color:#6B6F8A;font-size:12px;margin-top:20px">For reflection and entertainment. Replies to this email reach our support team.</p>
        </div>
      </div>`;

    const sent = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: `${BRAND} — Your Complete Report for ${p.name}`,
      html,
      attachments: [{ filename: `Ank-Complete-Report-${slug(p.name)}.pdf`, content: Buffer.from(pdf).toString('base64') }],
    });
    if (sent.error) return bad(res, 502, 'email send failed: ' + (sent.error.message || 'unknown'));
    return res.status(202).json({ ok: true, id: sent.data && sent.data.id, queued: order.id });
  } catch (e) {
    return bad(res, 500, 'report generation failed: ' + (e && e.message));
  }
};

const SUPPORTED = require('../lib/i18n').LABELS;
function normalizeLang(raw) {
  const code = String(raw || 'en').toLowerCase().split(/[-_]/)[0];
  return SUPPORTED[code] ? code : 'en';
}
function slug(s) { return String(s).normalize('NFKD').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'report'; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
