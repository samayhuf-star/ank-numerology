// Renders an HTML string to a PDF Buffer using the system Chrome via puppeteer-core.
// Keeps one browser alive across requests and serialises rendering, so a small
// (1 GB) host isn't launching Chrome per call or running several at once.
const puppeteer = require('puppeteer-core');

function findChrome() {
  return process.env.CHROME_PATH
    || ['/usr/bin/google-chrome-stable','/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser']
       .find((p) => { try { return require('fs').existsSync(p); } catch { return false; } });
}

let browserPromise = null;
async function getBrowser() {
  if (browserPromise) {
    const b = await browserPromise;
    if (b.connected) return b;        // reuse if still alive
    browserPromise = null;            // died — relaunch below
  }
  browserPromise = puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-extensions', '--no-first-run'],
  });
  return browserPromise;
}

let chain = Promise.resolve();        // serialise renders (one page at a time)
function htmlToPdf(html) {
  const run = chain.then(async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
      await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
      return await page.pdf({ format: 'A4', printBackground: true, displayHeaderFooter: false,
        margin: { top: 0, bottom: 0, left: 0, right: 0 }, preferCSSPageSize: true });
    } finally { await page.close().catch(() => {}); }
  });
  chain = run.then(() => {}, () => {}); // keep the chain going regardless of outcome
  return run;
}
module.exports = { htmlToPdf };
