// Backup & restore: export from the localhost site, restore into the portable file:// copy.
// Checks secrets stay out, foreign keys are ignored, unticked items are skipped, undo, bad files,
// and that a write the browser refuses rolls everything back.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const PORTABLE = 'file://' + path.join(ROOT, 'datacenter-cheatsheet-portable.html');

// A click with a real gap between press and release.
async function click(page, sel) {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded();
  const b = await el.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.up();
}

async function openBackupDialog(page) {
  await click(page, '.hdr-more-btn');
  await page.waitForTimeout(250);
  await click(page, '#backup-menu-btn');
  await page.waitForSelector('.bk-backdrop.show', { timeout: 3000 });
}

const ls = (page, k) => page.evaluate(key => localStorage.getItem(key), k);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await launch();
  const ctx = await newContext(browser, { acceptDownloads: true });

  // ---- 1. Export from the localhost site -----------------------------------------
  const src = await ctx.newPage();
  src.on('pageerror', e => check(false, 'page error (site): ' + e.message));
  await src.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
  await src.evaluate(() => {
    localStorage.setItem('nv-smi_bookmarks', JSON.stringify(['smi-topo']));
    localStorage.setItem('cs_racks_v1', JSON.stringify({ rows: 'gpu-node-07,R13,11,4' }));
    localStorage.setItem('cs_practice_v1', JSON.stringify({ boxes: { a: 2 } }));
    localStorage.setItem('dc_terminal_prefs', JSON.stringify({ port: 8767, token: 'SECRET-TOKEN-123', h: 40 }));
    localStorage.setItem('dc_case_file', JSON.stringify({ notes: 'ipmitool -I lanplus -H 10.0.0.5 -U admin -P hunter2 sel elist' }));
    localStorage.setItem('other_app_data', 'not ours');
  });
  await src.reload({ waitUntil: 'load' });
  await src.waitForTimeout(400);
  await openBackupDialog(src);
  const held = await src.locator('.bk-held').innerText().catch(() => '');
  check(/Case file/.test(held), 'case file with a -P password is listed as held back');
  check(!held.includes('hunter2') && /-P ••••/.test(held), 'the held-back line hides the password itself');

  const [download] = await Promise.all([src.waitForEvent('download'), click(src, '[data-bk="export"]')]);
  const file = path.join(OUT, 'backup-under-test.json');
  await download.saveAs(file);
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
  check(/^dc-cheatsheet-backup-\d{4}-\d{2}-\d{2}-\d{4}\.json$/.test(download.suggestedFilename()), `file name ${download.suggestedFilename()}`);
  check(data.app === 'dc-cheatsheet' && data.version === 1, 'file says what it is and its format version');
  check(!!data.items['nv-smi_bookmarks'] && !!data.items.cs_racks_v1 && !!data.items.cs_practice_v1, 'kit stars, rack inventory and practice are in the file');
  check(!('other_app_data' in data.items), 'a key from another page on the same origin is not exported');
  check(!('dc_case_file' in data.items), 'the item holding a credential is not exported');
  check(!raw.includes('SECRET-TOKEN-123') && !raw.includes('hunter2'), 'no token or password anywhere in the file');
  check(JSON.parse(data.items.dc_terminal_prefs).port === 8767, 'terminal settings are kept without the token');

  // ---- 2. Restore into the portable copy (another origin) --------------------------
  const dst = await ctx.newPage();
  dst.on('pageerror', e => check(false, 'page error (portable): ' + e.message));
  await dst.goto(PORTABLE, { waitUntil: 'load' });
  await dst.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('dc_tour_seen', '999');
    localStorage.setItem('cs_racks_v1', JSON.stringify({ rows: 'OLD-INVENTORY' }));
    localStorage.setItem('dc_terminal_prefs', JSON.stringify({ port: 9000, token: 'LOCAL-TOKEN', h: 30 }));
  });
  await dst.reload({ waitUntil: 'load' });
  await dst.waitForTimeout(500);
  check(await ls(dst, 'nv-smi_bookmarks') === null, 'portable copy starts without the localhost stars (separate storage)');

  // 2a. A file that is not a backup is refused.
  await openBackupDialog(dst);
  const junk = path.join(OUT, 'not-a-backup.json');
  fs.writeFileSync(junk, JSON.stringify({ hello: 'world' }));
  await dst.setInputFiles('.bk-file', junk);
  await dst.waitForTimeout(300);
  check(/not a backup/i.test(await dst.locator('.bk-preview').innerText()), 'a JSON file that is not a backup is refused');

  // 2b. Preview, untick practice, restore.
  await dst.setInputFiles('.bk-file', file);
  await dst.waitForSelector('.bk-list');
  const states = await dst.evaluate(() => Object.fromEntries([...document.querySelectorAll('.bk-row')].map(r => [r.querySelector('[data-bk-key]').dataset.bkKey, r.className.replace('bk-row ', '')])));
  check(states.cs_racks_v1 === 'is-differs', 'rack inventory shows "replaces what is here"');
  check(states['nv-smi_bookmarks'] === 'is-new', 'kit stars show "not here yet"');
  await dst.uncheck('[data-bk-key="cs_practice_v1"]');
  const label = await dst.locator('[data-bk="restore"]').innerText();
  check(/^Restore \d+ items?$/.test(label), `restore button counts the ticked items ("${label}")`);
  await Promise.all([dst.waitForEvent('load'), click(dst, '[data-bk="restore"]')]);
  await dst.waitForTimeout(700);
  check(await ls(dst, 'nv-smi_bookmarks') === data.items['nv-smi_bookmarks'], 'kit stars restored');
  check(await ls(dst, 'cs_racks_v1') === data.items.cs_racks_v1, 'rack inventory replaced');
  check(await ls(dst, 'cs_practice_v1') === null, 'unticked item (practice) not restored');
  const prefs = JSON.parse(await ls(dst, 'dc_terminal_prefs'));
  check(prefs.token === 'LOCAL-TOKEN' && prefs.port === 8767, 'terminal settings restored, this browser keeps its own token');
  check(/Restored \d+ items?/.test(await dst.locator('body').innerText()), 'a toast says what was restored after the reload');

  // ---- 3. Undo puts it all back -----------------------------------------------------
  await openBackupDialog(dst);
  await Promise.all([dst.waitForEvent('load'), click(dst, '[data-bk="undo"]')]);
  await dst.waitForTimeout(700);
  check(await ls(dst, 'cs_racks_v1') === JSON.stringify({ rows: 'OLD-INVENTORY' }), 'undo brings the old rack inventory back');
  check(await ls(dst, 'nv-smi_bookmarks') === null, 'undo removes what the restore added');
  check(JSON.parse(await ls(dst, 'dc_terminal_prefs')).port === 9000, 'undo restores the old terminal settings');

  // ---- 4. A refused write rolls the whole restore back ------------------------------
  await dst.evaluate(() => {
    // Behave like a full store for one key: the write is silently dropped (as guardStorage does).
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k, v) { if (k === 'cs_racks_v1' && this === localStorage) return; return set.call(this, k, v); };
  });
  await openBackupDialog(dst);
  await dst.setInputFiles('.bk-file', file);
  await dst.waitForSelector('.bk-list');
  await click(dst, '[data-bk="restore"]');
  await dst.waitForTimeout(500);
  check(/Nothing was restored/.test(await dst.locator('.bk-preview').innerText()), 'a refused write shows "Nothing was restored"');
  check(await ls(dst, 'nv-smi_bookmarks') === null, 'the keys written before the failure were rolled back');

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
