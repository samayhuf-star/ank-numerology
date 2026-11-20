# Deploying the Complete Report backend

This service needs Node 22.18+ (TypeScript stripping), Chrome, Noto fonts, a verified sending domain and a **single always-on process with durable storage**. Do not deploy its JSON ledger to an ephemeral or autoscaled filesystem.

## Release safety gate

The report and restore endpoints require a **verified Cloud email session**. A RevenueCat App User ID alone is not authentication. The app now has email-code sign-in, secure session storage, refresh, sign-out and account deletion. Its account UUID is linked through RevenueCat's supported `logIn` flow; report purchase lookups derive identity from Cloud Auth, never a caller-supplied ID. Historical order IDs stay unchanged for retry idempotency.

Email-code issuance and account deletion functions are prepared in `cloud/`. Sending requires `RESEND_API_KEY` and `ANK_AUTH_FROM` (a verified sender) in Cloud secrets. The sender reserves email/IP/global rate limits atomically and never returns codes to the app. Account deletion validates the session with Cloud Auth before deleting its user. Access and refresh tokens remain in native SecureStore; the web target keeps sessions in memory only.

The report API still requires owner-approved deployment to its durable existing host, its real HTTPS URL in `EXPO_PUBLIC_API_URL`, and iPhone purchase/restore checks. Do not deploy it over an existing service or recreate the ledger without approval.

## Server configuration

Set values through the host's secret manager or a protected environment file, never source control or chat:

- `RESEND_API_KEY`: the Resend sending secret.
- `REVENUECAT_SECRET_KEY`: RevenueCat server-side v1 API key.
- `REPORT_FROM`: verified sender, currently `Ank Numerology <reports@adiology.io>`.
- `ANK_AUTH_URL`: trusted Cloud base URL. Defaults to the connected Ank project `https://fiwszjxgkxqhhamiftvj.supabase.co`.
- `ANK_AUTH_PUBLISHABLE_KEY`: that project's public client key (not a service-role key); the connected project's key is the code default.
- `REPORT_LEDGER_PATH`: an absolute persistent path, for example `/var/lib/ank-report/ledger.json`.
- `CHROME_PATH`: installed Chrome executable path.
- `PORT`: default `8080`.
- `REPORT_MAX_SENDS`: successful deliveries per purchase, default `5`, accepted range `1`–`20`.
- `REPORT_ALLOW_SANDBOX`: leave enabled for TestFlight. Separate staging and production ledgers if using different sandbox policies.

The server sends the presented bearer token only to its trusted Cloud Auth `/auth/v1/user` endpoint and requires a confirmed, non-anonymous email account. It uses that validated user UUID for RevenueCat lookups. Changing the submitted `appUserId` never grants another account's purchases. Ledger rows are pinned to their first verified owner; later transfers require support review instead of automatically exposing a different owner's profile.

## Initialize a NEW ledger only

With `REPORT_LEDGER_PATH` set, run `node init-ledger.js` once. It uses exclusive creation and cannot replace an existing ledger. Never initialize an empty ledger to recover a deployment with previous customers: recover its saved ledger instead. Missing, corrupt and unreadable ledgers intentionally stop redemption and restore.

Back up the ledger and test recovery before accepting purchases. The file is sensitive: it contains names, dates of birth and transaction mappings. Store it with restricted permissions. Atomic writes are synced before rename. Do not run multiple replicas against this file.

## systemd

Install dependencies from the lockfile, install Chrome/fonts, and use a service account with write access to the persistent ledger directory. Configure a protected `/etc/ank-report.env` with all required server variables.

```ini
[Unit]
Description=Ank Numerology Report API
After=network.target
[Service]
WorkingDirectory=/opt/ank-report-api
ExecStart=/usr/bin/node server.js
EnvironmentFile=/etc/ank-report.env
Restart=always
[Install]
WantedBy=multi-user.target
```

Run behind an HTTPS reverse proxy with request limits. Protect all deployment environment files. Size the host for Chrome rendering; a 1 GB host may need additional memory/swap.

## Docker

Use a persistent volume, not just container storage. Provide secrets through the host's protected environment file; set `REPORT_LEDGER_PATH=/data/ledger.json` inside it.

```sh
docker build -t ank-report-api .
docker run -d --name ank-report --restart always -p 127.0.0.1:8080:8080 \
  --env-file /etc/ank-report.env -v ank-report-ledger:/data ank-report-api
```

For a brand-new service initialize the volume once with `node init-ledger.js` using the same configuration and volume. Do not recreate it when replacing the container.

## App connection and release checks

`EXPO_PUBLIC_API_URL` must be the real HTTPS service base, without `/name-report`; both root and `/api` prefixes are supported for `/health`, `/name-report` and `/purchased-reports`. Rebuild the app after changing its Expo configuration. Do not place Resend, RevenueCat secret keys or private signing keys in Expo public variables.

- `/health` returning `ok: true` only proves the process is up. `ready: true` additionally requires email/purchase verification configuration, owner verification configuration and a readable ledger.
- Try another user's ID, missing/expired/modified tokens, no purchase, a purchase redeemed for another profile, and a corrupt/missing ledger. None should send email or reveal report identities.
- A valid owner's verified purchase should return `202` only after the email provider accepts the message. This does not prove inbox delivery.
- Repeating the same order must not send again or consume another resend allowance. Reusing its ID with different details must fail.
- A device retry must retain pending orders, including old and rejected ones, without charging again.
- Verify actual PDF rendering, email receipt, reinstall/restore and sandbox purchases on an iPhone. Local source tests do not replace these checks.

The Cloud sign-in and account-deletion functions are separate from this hosted report service. Deploying them does not deploy PDF generation, migrate the existing ledger, prove email delivery or validate iPhone purchases. Complete those release checks before enabling report checkout.
