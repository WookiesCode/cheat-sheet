// #11 Usage meter: tool and sheet opens are counted in dc_usage (this browser only), however
// the tool was opened (key, toolbar, triage tab); the Workbench lists what hasn't been opened
// in 30 days, and says so plainly when the meter is younger than that.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const usage = p => p.evaluate(() => JSON.parse(localStorage.getItem('dc_usage') || '{}'));
const DAY = 86400000;

(async () => {
  const browser = await launch();

  // 1. Counting: a sheet view, Explain (e), the Case Trail (t), the triage modal's two tabs.
  {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    await p.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
    await p.waitForTimeout(500);
    let u = await usage(p);
    check(u.sheets && u.sheets['nv-smi.html'] && u.sheets['nv-smi.html'].n === 1 && u.since > 0, `opening nv-smi counts one sheet view and starts the meter (${JSON.stringify(u.sheets)})`);
    await p.reload({ waitUntil: 'load' });
    await p.waitForTimeout(500);
    u = await usage(p);
    check(u.sheets['nv-smi.html'].n === 2, `a second visit counts again (${u.sheets['nv-smi.html'].n})`);

    await p.keyboard.press('e');
    await p.waitForTimeout(300);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(200);
    await p.keyboard.press('t');
    await p.waitForTimeout(300);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(200);
    u = await usage(p);
    check(u.tools.explain && u.tools.explain.n === 1, `the e key opening Explain counts once (${JSON.stringify(u.tools.explain)})`);
    check(u.tools.trail && u.tools.trail.n === 1, `the t key opening the Case Trail counts once (${JSON.stringify(u.tools.trail)})`);

    // The Triage & RMA button opens the modal on Guided runbooks; the RMA tab is the formatter.
    await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /Triage & RMA/.test(x.textContent) && x.offsetParent); b.click(); });
    await p.waitForTimeout(500);
    await p.click('.triage-tab[data-tab="ticket"]');
    await p.waitForTimeout(200);
    u = await usage(p);
    check(u.tools.runbook && u.tools.runbook.n === 1, `opening Triage & RMA counts Guided runbooks (${JSON.stringify(u.tools.runbook)})`);
    check(u.tools.rma && u.tools.rma.n === 1, `the RMA tab counts the RMA formatter (${JSON.stringify(u.tools.rma)})`);
    check(!Object.keys(u.tools).some(k => !['explain', 'trail', 'runbook', 'rma'].includes(k)), `nothing else was counted (${Object.keys(u.tools).join(', ')})`);
    await ctx.close();
  }

  // 2. The Workbench fold, with a meter that has run for 40 days.
  {
    const ctx = await newContext(browser);
    const now = Date.now();
    await ctx.addInitScript((a) => localStorage.setItem('dc_usage', JSON.stringify(a)), {
      since: now - 40 * DAY,
      tools: { explain: { n: 9, t: now - DAY }, rack: { n: 2, t: now - 35 * DAY } },
      sheets: { 'nv-smi.html': { n: 4, t: now - DAY }, 'nv-mig.html': { n: 1, t: now - 31 * DAY }, 'notes.html': { n: 3, t: now - DAY } }
    });
    const p = await ctx.newPage();
    await p.goto(BASE + 'tools.html', { waitUntil: 'load' });
    await p.waitForTimeout(800);
    const f = await p.evaluate(() => {
      const d = document.querySelector('.wb-unused');
      if (!d) return null;
      d.open = true;
      return {
        summary: d.querySelector('summary').textContent.replace(/\s+/g, ' ').trim(),
        tools: [...d.querySelectorAll('.wb-unused-tools [data-wb-open]')].map(b => b.dataset.wbOpen),
        sheets: [...d.querySelectorAll('.wb-unused-sheets a')].map(a => a.getAttribute('href')),
        note: d.querySelector('.wb-unused-note').textContent,
        total: document.querySelectorAll('.wb-card').length,
        hubLabel: ([...d.querySelectorAll('.wb-unused-sheets a')].find(a => a.getAttribute('href') === 'nvidia.html') || {}).textContent
      };
    });
    check(!!f, 'the Workbench has an "Unused in 30 days" fold');
    check(f && f.tools.includes('rack') && !f.tools.includes('explain') && !f.tools.includes('notes') && f.tools.length === f.total - 2,
      `tools: Rack (35 days) is listed; Explain and Field notes (a page, counted as a sheet view) aren't; everything never opened is (${f && f.tools.length} of ${f && f.total})`);
    check(f && f.hubLabel === 'NVIDIA DC hub', `a suite's hub page reads as "<suite> hub" (${f && f.hubLabel})`);
    check(f && f.sheets.includes('nv-mig.html') && !f.sheets.includes('nv-smi.html'), 'sheets: nv-mig (31 days) is listed, nv-smi (yesterday) is not');
    check(f && /Most opened: Explain a command 9/.test(f.note) && !/not opened since then/.test(f.note), `the note names the most-opened tool and no "young meter" caveat (${f && f.note.slice(0, 120)})`);
    // A listed tool opens straight from the fold.
    await p.click('.wb-unused-tools [data-wb-open="rack"]');
    await p.waitForTimeout(500);
    check(await p.evaluate(() => /#rack$/.test(location.hash) || !!document.querySelector('.rk-backdrop.show')), 'clicking Rack in the fold opens the Rack view');
    await ctx.close();
  }

  // 3. A meter that started 3 days ago says what "unused" means.
  {
    const ctx = await newContext(browser);
    await ctx.addInitScript((t) => localStorage.setItem('dc_usage', JSON.stringify({ since: t, tools: {}, sheets: {} })), Date.now() - 3 * 86400000);
    const p = await ctx.newPage();
    await p.goto(BASE + 'tools.html', { waitUntil: 'load' });
    await p.waitForTimeout(800);
    const note = await p.evaluate(() => document.querySelector('.wb-unused-note').textContent);
    check(/3 days ago, so this means "not opened since then"/.test(note), `a 3-day-old meter explains itself (${note.slice(0, 110)})`);
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
