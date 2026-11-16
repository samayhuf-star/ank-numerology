# Ank Numerology — Name Report backend

Serverless endpoint that builds the numerology Name Report, renders a multi-page PDF, and emails it via Resend.

- `POST /api/name-report` — body: an Order `{ id, email, language, profile:{ id,name,day,month,year }, tips, createdAt }`. Returns 202 when the email is sent.
- `GET /api/name-report` — health check.

## Env vars
- `RESEND_API_KEY` — Resend sending key.
- `REPORT_FROM` — e.g. `Ank Numerology <reports@your-domain>` (currently adiology.io; change to a numerology/klenzer domain once verified).
- `CHROME_PATH` — optional path to the Chrome/Chromium binary used for PDF rendering (defaults to `/usr/bin/google-chrome-stable`).

## How the report is rendered
The report is built as a self-contained HTML document (`lib/html.js`) with fonts embedded as base64 `@font-face`, then printed to a 12–13 page A4 PDF by headless Chrome (`lib/render.js`, puppeteer-core driving the system Chrome). Chrome is used instead of a pure-JS PDF library because it shapes Devanagari and other complex Indic scripts correctly (conjuncts, matras).

Pipeline:
- `lib/numerology.js` — numerology engine (Mulank, Bhagyank, Chaldean name number, Lo Shu grid, planes/arrows, personal year/month cycles), mirrors the app's engine.
- `lib/report.js` — `buildReportData(profile)` computes every value the template needs.
- `lib/content.js`, `lib/content_hi.js` — per-language content packs (same keys).
- `lib/i18n.js` — `resolve(lang)` returns `{ labels, content }`; bilingual (en + hi) today, add a language by adding a content pack + label set.
- `lib/html.js` — `buildHtml(profile, lang)` → full HTML (cover number-wheel, core-numbers table + bar chart, Mulank/Bhagyank, Lo Shu grid, strength chart, 12-month forecast charts, lucky guide, remedies).
- `lib/render.js` — `htmlToPdf(html)` → PDF buffer.

Hindi content is a first machine pass flagged for native review. `lib/pdf.js` is the superseded pure-JS renderer, kept for reference.

## Deploy
Needs a host with a Chrome/Chromium binary available (not a stock Vercel Node function). Options: a container image with `google-chrome-stable`, `@sparticuz/chromium` on serverless, or the claude-workstation VM (Chrome already installed). After deploy, set `EXPO_PUBLIC_API_URL` in the app's EAS env to the deployment base URL (no trailing `/name-report`) and rebuild.
