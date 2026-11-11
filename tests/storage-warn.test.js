// A save the browser refuses is reported once per page, with a bar that stays until dismissed.
// The failure is faked BEFORE common.js loads, so the site's own storage guard wraps it.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// mode: 'full' (QuotaExceededError on localStorage), 'blocked' (localStorage access throws),
// 'session-full' (only sessionStorage refuses), 'ok' (normal).
async function page(browser, mode) {
  const ctx = await newContext(browser);
  await ctx.addInitScript((m) => {
    const real = Storage.prototype.setItem;
    if (m === 'full') {
      // Settings written at start-up still work; anything a person saves does not.
      Storage.prototype.setItem = function(k, v) {
        if (this === window.localStorage && /bookmarks$|^dc_case_file$/.test(k)) throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
        return real.call(this, k, v);
      };
    }
    if (m === 'session-full') {
      Storage.prototype.setItem = function(k, v) {
        if (this === window.sessionStorage) throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
        return real.call(this, k, v);
      };
    }
    if (m === 'blocked') {
      Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('Access is denied for this document.', 'SecurityError'); } });
    }
  }, mode);
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, `${mode}: page error ${e.message}`));
  return p;
}

// Star the first command on the sheet, with a real press-and-release.
async function star(p) {
  const btn = p.locator('.bookmark-btn').first();
  await btn.scrollIntoViewIfNeeded();
  const b = await btn.boundingBox();
  await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await p.mouse.down();
  await p.waitForTimeout(120);
  await p.mouse.up();
  await p.waitForTimeout(300);
}
const bars = (p) => p.locator('.storage-warn').count();

(async () => {
  const browser = await launch();

  // 1. Normal storage: loading pages and starring a command raise nothing.
  {
    const p = await page(browser, 'ok');
    for (const f of ['index.html', 'notes.html', 'nvidia.html#nv-smi']) { await p.goto(BASE + f, { waitUntil: 'load' }); await p.waitForTimeout(400); }
    await star(p);
    check(await bars(p) === 0, 'normal storage: no warning on load or on a save');
  }

  // 2. Storage full: the first failed save raises one bar; the next one does not stack.
  {
    const p = await page(browser, 'full');
    await p.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    await p.waitForTimeout(400);
    check(await bars(p) === 0, 'full storage: no warning until something is actually lost');
    await star(p);
    check(await bars(p) === 1, 'full storage: starring a command raises the warning');
    check(/storage for this site is full/.test(await p.locator('.storage-warn').innerText()), 'the warning says the storage is full');
    check(await p.locator('.storage-warn').getAttribute('role') === 'alert', 'the warning is announced (role="alert")');
    await star(p);
    check(await bars(p) === 1, 'a second failed save does not stack another bar');
    await p.waitForTimeout(2600);
    check(await bars(p) === 1, 'the bar is still there after a toast would have gone (2.6 s)');
    await p.click('.storage-warn .sw-backup');
    await p.waitForTimeout(300);
    check(!!(await p.$('.bk-backdrop.show')), '"Backup & restore" on the bar opens the backup panel');
    await p.keyboard.press('Escape');
    await p.click('.storage-warn .sw-close');
    check(await bars(p) === 0, '✕ dismisses it');
  }

  // 3. Storage full, pin from Explain: the "Pinned" toast must not hide the failure.
  {
    const p = await page(browser, 'full');
    await p.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    await p.waitForTimeout(400);
    await p.keyboard.press('e');
    await p.waitForTimeout(300);
    await p.fill('.an-backdrop.show textarea', 'nvidia-smi -q -d ECC');
    await p.waitForTimeout(400);
    await p.click('[data-ex-pin]');
    await p.waitForTimeout(500);
    check(await bars(p) === 1, 'pinning to a full case file raises the warning, even with the "Pinned" toast shown');
  }

  // 4. Storage blocked: the site still works, and says nothing will be kept.
  {
    const p = await page(browser, 'blocked');
    await p.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    await p.waitForTimeout(400);
    await star(p);
    check(await bars(p) === 1 && /blocking storage/.test(await p.locator('.storage-warn').innerText()), 'blocked storage: the warning says nothing is kept after leaving');
  }

  // 5. A refused tab-only (sessionStorage) write stays quiet: nothing a person saved is lost.
  {
    const p = await page(browser, 'session-full');
    await p.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    await p.waitForTimeout(400);
    await p.evaluate(() => sessionStorage.setItem('dc_probe', 'x'));
    await star(p);
    check(await bars(p) === 0, 'a refused sessionStorage write raises nothing');
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
