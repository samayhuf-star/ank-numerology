# Ank Numerology — Name Report backend

Serverless endpoint that builds the numerology Name Report, renders a multi-page PDF, and emails it via Resend.

- `POST /api/name-report` — body: an Order `{ id, email, language, profile:{ id,name,day,month,year }, tips, createdAt }`. Returns 202 when the email is sent.
- `GET /api/name-report` — health check.

## Env vars
- `RESEND_API_KEY` — Resend sending key.
- `REPORT_FROM` — e.g. `Ank Numerology <reports@your-domain>` (currently adiology.io; change to a numerology/klenzer domain once verified).

## Deploy
Any Node serverless host (Vercel, etc.). After deploy, set `EXPO_PUBLIC_API_URL` in the app's EAS env to the deployment base URL (no trailing `/name-report`) and rebuild.

The PDF generator (`lib/pdf.js`) and numerology engine (`lib/numerology.js`) are pure JS and mirror the app's engine. English only until report translations land.
