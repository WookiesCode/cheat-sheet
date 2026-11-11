// Ctrl+K search still finds commands once global-search-index.js loads from a stamped URL, and a query
// no command fully matches shows the closest matches instead of nothing (filler words dropped,
// a few synonyms, numbers ignored); "gpu fell off bus" decodes as Xid 79.
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
  const page = await ctx.newPage();
  let indexUrl = '';
  page.on('response', r => { if (r.url().includes('global-search-index.js')) indexUrl = r.url() + ' ' + r.status(); });
  await page.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);
  await page.keyboard.type('mlxlink', { delay: 40 });
  await page.waitForTimeout(600);
  const n = await page.evaluate(() => document.querySelectorAll('.palette-item').length);
  const first = await page.evaluate(() => { const r = document.querySelector('.palette-item'); return r ? r.innerText.split('\n')[0].slice(0, 80) : null; });
  console.log(`index: ${indexUrl}\nresults for "mlxlink": ${n}; first: ${first}`);
  const failures = [];
  const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
  check(n > 0, 'mlxlink finds commands');

  // What a query shows: the count line, the closest-match note, the decoder title, the top commands.
  async function ask(q) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(250);
    await page.keyboard.type(q, { delay: 15 });
    await page.waitForTimeout(600);
    return page.evaluate(() => ({
      count: (document.getElementById('palette-stats') || {}).textContent || '',
      note: (document.querySelector('.palette-closest') || {}).textContent || '',
      decoder: (document.querySelector('.decoder-title') || {}).textContent || '',
      empty: !!document.querySelector('.palette-empty'),
      top: [...document.querySelectorAll('.palette-item')].slice(0, 6).map(e => e.dataset.cmd || '')
    }));
  }

  // A strict hit stays strict: no closest-match note.
  let r = await ask('mlxlink');
  check(!r.note, 'a query every word of which matches shows no closest-match note');
  // A question: filler words dropped, "slot" widened to the BDF / pci.bus_id commands.
  r = await ask('which gpu is which slot');
  check(/Closest matches/.test(r.count) && /gpu/.test(r.note) && /slot/.test(r.note), `"which gpu is which slot" shows closest matches (${r.count})`);
  check(r.top.some(c => /pci\.bus_id|bdf/i.test(c)), `…with a bus-ID command in the top six (${r.top.map(c => c.slice(0, 40)).join(' | ')})`);
  // A near-miss word: flapping is spelled flap / bounce on the cards.
  r = await ask('ib port flapping');
  check(r.top.length > 0 && !r.empty, `"ib port flapping" is no longer a dead end (${r.count})`);
  // Typed the way people say it: the decoder's Xid 79 card.
  r = await ask('gpu fell off bus');
  check(/fallen off the bus/i.test(r.decoder), `"gpu fell off bus" decodes as Xid 79 (${r.decoder})`);
  // A pasted line the decoder doesn't know falls back to its distinctive words.
  r = await ask('slurmd: error: Node configuration differs from hardware: CPUs=128:256(hw)');
  check(r.top.some(c => /slurmd/.test(c)), `an unknown slurmd line finds slurmd commands (${r.top.map(c => c.slice(0, 30)).join(' | ')})`);
  check(!/128|256/.test(r.note), 'numbers from the pasted line are not used as search words');
  // A word on no card at all still says so.
  r = await ask('crdump');
  check(r.empty && !r.note, '"crdump" (on no card) still shows the empty state');

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
