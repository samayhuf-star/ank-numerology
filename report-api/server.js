// Standalone always-on HTTP server wrapping the Name Report handler.
// For hosts with a system Chrome (e.g. the claude-workstation VM). No framework.
const http = require('http');
const handler = require('./api/name-report');

const PORT = process.env.PORT || 8080;
const MAX_BODY = 256 * 1024;

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) });
  res.end(body);
}

const server = http.createServer((req, res) => {
  // tiny shim so the Vercel-style handler (req.method, req.body, res.status().json()) works on raw http
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => send(res, res.statusCode || 200, o);

  const url = (req.url || '/').split('?')[0];
  if (url === '/' || url === '/health') return send(res, 200, { ok: true, service: 'ank-name-report', status: 'up' });
  if (url !== '/api/name-report' && url !== '/name-report') return send(res, 404, { ok: false, error: 'not found' });

  if (req.method === 'GET') return handler(req, res);
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method not allowed' });

  let data = '', tooBig = false;
  req.on('data', (c) => { data += c; if (data.length > MAX_BODY) { tooBig = true; req.destroy(); } });
  req.on('end', () => {
    if (tooBig) return;
    try { req.body = data ? JSON.parse(data) : {}; } catch { return send(res, 400, { ok: false, error: 'invalid json' }); }
    Promise.resolve(handler(req, res)).catch((e) => { if (!res.headersSent) send(res, 500, { ok: false, error: String(e && e.message || e) }); });
  });
});

server.listen(PORT, () => console.log(`ank-name-report listening on :${PORT}`));
