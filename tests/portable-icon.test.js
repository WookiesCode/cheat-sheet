// Open the 1-file build over file:// and check its <link rel="icon"> decodes as an image.
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');
const path = require('path');

const file = 'file://' + path.join(ROOT, 'datacenter-cheatsheet-portable.html');

(async () => {
  const browser = await launch();
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(file, { waitUntil: 'load' });
  const r = await page.evaluate(() => new Promise(resolve => {
    const link = document.querySelector('link[rel="icon"]');
    if (!link) return resolve({ found: false });
    const img = new Image();
    img.onload = () => resolve({ found: true, type: link.type, w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ found: true, decoded: false });
    img.src = link.href;
  }));
  console.log(JSON.stringify(r), errs.length ? 'pageerrors: ' + errs.join(' | ') : 'no page errors');
  await browser.close();
  process.exit(r.w > 0 && !errs.length ? 0 : 1);
})();
