// Renders an HTML string to a PDF Buffer using the system Chrome via puppeteer-core.
const puppeteer = require('puppeteer-core');

function findChrome() {
  return process.env.CHROME_PATH
    || ['/usr/bin/google-chrome-stable','/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser']
       .find((p) => { try { return require('fs').existsSync(p); } catch { return false; } });
}

async function htmlToPdf(html) {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, displayHeaderFooter: false,
      margin: { top: 0, bottom: 0, left: 0, right: 0 }, preferCSSPageSize: true });
    return pdf;
  } finally { await browser.close(); }
}
module.exports = { htmlToPdf };
