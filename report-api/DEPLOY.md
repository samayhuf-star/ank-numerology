# Deploying the Complete Report backend to claude-workstation (1 GB droplet)

The service renders the report with headless Chrome, so the host needs Chrome + the Noto fonts. Two ways to run it; **systemd is lighter on a 1 GB box** (Docker + Chrome in a container is tight at 1 GB).

## Env vars (both methods)
- `RESEND_API_KEY` — Resend sending key
- `REPORT_FROM` — `Ank Numerology <reports@adiology.io>` (current decision: keep adiology.io)
- `CHROME_PATH` — `/usr/bin/google-chrome-stable`
- `PORT` — `8080` (default)
- `REVENUECAT_SECRET_KEY` — RevenueCat **secret** (v1 REST) API key, used to verify the buyer's `ank_name_report` purchase. **Required**: without it every order is refused.
- `REPORT_LEDGER_PATH` — where the purchase ledger lives (default `report-api/data/ledger.json`; use a persistent path such as `/var/lib/ank-report/ledger.json`, and back it up. It is what Restore Purchases reads)
- `REPORT_MAX_SENDS` — re-sends allowed per purchase (default 5)
- `REPORT_ALLOW_SANDBOX` — set `0` in production once TestFlight testing is done, so sandbox purchases stop counting

## Option A — systemd (recommended for 1 GB)
```bash
# 1. Chrome + fonts
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update && sudo apt-get install -y google-chrome-stable fonts-noto fonts-noto-core

# 2. App
sudo mkdir -p /opt/ank-report-api && cd /opt/ank-report-api
# copy lib/ engine/ api/ server.js package.json here (engine/ is the shared report engine; refresh it with ./sync-engine.sh from the repo root before copying). Needs Node 22+ (runs the TypeScript engine directly). (git clone the repo's report-api/ folder, or scp the tgz)
npm install --omit=dev

# 3. Service
sudo tee /etc/systemd/system/ank-report.service >/dev/null <<'UNIT'
[Unit]
Description=Ank Numerology Name Report API
After=network.target
[Service]
WorkingDirectory=/opt/ank-report-api
ExecStart=/usr/bin/node server.js
Restart=always
Environment=PORT=8080
Environment=CHROME_PATH=/usr/bin/google-chrome-stable
Environment=RESEND_API_KEY=__set_me__
Environment=REPORT_FROM=Ank Numerology <reports@adiology.io>
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload && sudo systemctl enable --now ank-report
```
Add 1–2 GB swap first (`fallocate -l 2G /swapfile …`) — Chrome spikes memory on a 1 GB box.

## Option B — Docker
```bash
docker build -t ank-report-api .
docker run -d --name ank-report --restart always -p 8080:8080 \
  -e RESEND_API_KEY=... -e "REPORT_FROM=Ank Numerology <reports@adiology.io>" ank-report-api
```

## Expose it
Put it behind the droplet's nginx (or Caddy) on a subdomain with TLS, e.g. `https://api.klenzer.online` → `127.0.0.1:8080`. Keep `/api/name-report` as the path.

## Wire the app
```bash
# base URL WITHOUT the trailing /name-report
eas env:create --name EXPO_PUBLIC_API_URL --value "https://api.klenzer.online/api" --environment production
```
Then rebuild + resubmit the app so the client posts orders to the live endpoint.

## Smoke test
```bash
curl -s https://api.klenzer.online/api/name-report   # -> {"ok":true,...}
# Without a purchase this must be refused (401 no identity / 402 no purchase), and no email is sent:
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://api.klenzer.online/api/name-report \
  -H 'content-type: application/json' \
  -d '{"appUserId":"$RCAnonymousID:test","email":"you@example.com","language":"en","profile":{"name":"Rajesh Kumar Sharma","day":18,"month":7,"year":1990}}'   # -> 402
# A real order needs a sandbox/TestFlight purchase of ank_name_report made by that appUserId; then it returns 202 and the PDF arrives.
# Restore lookup (profiles that were bought + unused purchases):
curl -s -X POST https://api.klenzer.online/api/purchased-reports -H 'content-type: application/json' -d '{"appUserId":"<id>"}'
```
