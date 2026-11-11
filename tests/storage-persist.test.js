// Asking the browser to keep the site's storage (navigator.storage.persist).
// The browser's own decision can't be forced, so navigator.storage is replaced by a fake that
// counts persist() calls; the last block only reports what this Chrome really says.
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// mode: 'not-kept' (persist() grants), 'refuse' (persist() says no), 'kept', 'unavailable'
async function fakeContext(browser, mode) {
  const ctx = await newContext(browser);
  await ctx.addInitScript((m) => {
    window.__persistCalls = 0;
    if (m === 'unavailable') { Object.defineProperty(navigator, 'storage', { configurable: true, get: () => undefined }); return; }
    let kept = m === 'kept';
    const fake = {
      persisted: () => Promise.resolve(kept),
      persist: () => { window.__persistCalls++; if (m !== 'refuse') kept = true; return Promise.resolve(kept); },
      estimate: () => Promise.resolve({ usage: 0, quota: 1e9 })
    };
    Object.defineProperty(navigator, 'storage', { configurable: true, get: () => fake });
  }, mode);
  return ctx;
}

async function openPanel(page) {
  await page.click('.hdr-more-btn');
  await page.waitForTimeout(200);
  await page.click('#backup-menu-btn');
  await page.waitForSelector('.bk-backdrop.show');
  await page.waitForTimeout(250);
  return page.locator('.bk-persist');
}
const calls = (page) => page.evaluate(() => window.__persistCalls);

(async () => {
  const browser = await launch();

  // 1. Never asked on page load (Firefox would show a prompt), on any kind of page.
  {
    const ctx = await fakeContext(browser, 'not-kept');
    const page = await ctx.newPage();
    // Give the notes page a draft, so anything that saves on load would show up.
    await page.goto(BASE + 'notes.html', { waitUntil: 'load' });
    await page.evaluate(() => localStorage.setItem('dc_field_notes', JSON.stringify({ notes: [], active: '' })));
    for (const f of ['index.html', 'nvidia.html#nv-smi', 'notes.html', 'tools.html']) {
      await page.goto(BASE + f, { waitUntil: 'load' });
      await page.waitForTimeout(600);
      check(await calls(page) === 0, `${f}: no persist() request on page load`);
    }
    await ctx.close();
  }

  // 2. Not kept → the panel says so; the button asks; granted → "Kept".
  {
    const ctx = await fakeContext(browser, 'not-kept');
    const page = await ctx.newPage();
    await page.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    const box = await openPanel(page);
    check(/Not guaranteed/.test(await box.innerText()), 'panel shows "Not guaranteed" when not kept');
    check(await calls(page) === 0, 'opening the panel does not ask by itself');
    await page.click('.bk-persist [data-bk="persist"]');
    await page.waitForTimeout(300);
    check(await calls(page) === 1 && /Kept/.test(await box.innerText()), 'the button asks once and shows "Kept" when granted');
    await ctx.close();
  }

  // 3. The browser says no → explained, with "Ask again".
  {
    const ctx = await fakeContext(browser, 'refuse');
    const page = await ctx.newPage();
    await page.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    const box = await openPanel(page);
    await page.click('.bk-persist [data-bk="persist"]');
    await page.waitForTimeout(300);
    const t = await box.innerText();
    check(/said no/.test(t) && /bookmark/i.test(t) && /Ask again/.test(t), 'a refusal explains why and offers "Ask again"');
    await page.click('.bk-persist [data-bk="persist"]');
    await page.waitForTimeout(300);
    check(await calls(page) === 2, '"Ask again" asks again (explicit asks are not limited)');
    await ctx.close();
  }

  // 4. Already kept, and a browser without the API.
  for (const [mode, re, what] of [['kept', /✓ Kept/, 'already kept: "Kept", no button'], ['unavailable', /No promise available/, 'no storage API: says so and suggests a backup']]) {
    const ctx = await fakeContext(browser, mode);
    const page = await ctx.newPage();
    await page.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    const box = await openPanel(page);
    const t = await box.innerText();
    check(re.test(t) && !(await page.$('.bk-persist button')), what);
    await ctx.close();
  }

  // 5. Saving a field note asks once per tab, however much is typed.
  {
    const ctx = await fakeContext(browser, 'not-kept');
    const page = await ctx.newPage();
    await page.goto(BASE + 'notes.html', { waitUntil: 'load' });
    await page.waitForTimeout(500);
    await page.fill('.fn-host', 'gpu-node-07');
    await page.keyboard.press('Enter');
    await page.click('.fn-editor');
    await page.keyboard.type('Reseated the riser, Xid 79 gone.', { delay: 15 });
    await page.waitForTimeout(1500);
    check(await calls(page) === 1, 'typing a field note asks once');
    await page.keyboard.type(' Ran checkup again.', { delay: 15 });
    await page.reload({ waitUntil: 'load' });
    await page.click('.fn-editor');
    await page.keyboard.type(' More.', { delay: 15 });
    await page.waitForTimeout(1500);
    check(await calls(page) === 0, 'after a reload in the same tab, it does not ask again');
    await ctx.close();
  }

  // 6. Report only: what this Chrome really answers (headless usually says no: no engagement history).
  {
    const ctx = await newContext(browser);
    for (const [name, url] of [['localhost', BASE + 'nvidia.html#nv-smi'], ['portable file://', 'file://' + path.join(ROOT, 'datacenter-cheatsheet-portable.html')]]) {
      const page = await ctx.newPage();
      await page.goto(url, { waitUntil: 'load' });
      const real = await page.evaluate(async () => ({
        secure: window.isSecureContext,
        api: !!(navigator.storage && navigator.storage.persist),
        persisted: navigator.storage && navigator.storage.persisted ? await navigator.storage.persisted() : null
      }));
      console.log(`info ${name}: secure context ${real.secure}, API ${real.api}, persisted ${real.persisted}`);
    }
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
