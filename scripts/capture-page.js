const fs = require('fs');
const path = require('path');
const playwright = require('playwright');

(async () => {
  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const url = process.argv[2] || 'http://localhost:3000';
  console.log('Capturing', url);

  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = `[console:${msg.type()}] ${msg.text()}`;
    console.log(text);
    logs.push(text);
  });
  page.on('pageerror', err => {
    const text = `[pageerror] ${err.message}`;
    console.error(text);
    logs.push(text);
  });
  page.on('requestfailed', req => {
    const text = `[requestfailed] ${req.url()} ${req.failure()?.errorText || ''}`;
    console.warn(text);
    logs.push(text);
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 }).catch(e => {
    console.error('Goto error', e && e.message);
  });

  // wait a bit for React to mount
  await page.waitForTimeout(1000);

  const html = await page.content();
  fs.writeFileSync(path.join(outDir, 'page.html'), html, 'utf8');
  fs.writeFileSync(path.join(outDir, 'console.log'), logs.join('\n'), 'utf8');
  await page.screenshot({ path: path.join(outDir, 'screenshot.png'), fullPage: true });

  console.log('Saved output to', outDir);
  await browser.close();
})();
