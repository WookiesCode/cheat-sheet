// #10 Practice "From my trail": the commands copied on real tickets (every node workspace's
// Case Trail) become a Practice scope. Entries are stored with targets filled in, so they are
// matched back to the sheet command through its placeholders; the most-copied come first.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();

  // Pick two real k8s-nodes commands: one with a <placeholder>, one without.
  const pick = async () => {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    await p.goto(BASE + 'containers.html#k8s-nodes', { waitUntil: 'load' });
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      const ok = i => (i.sheet || i.file) === 'containers.html#k8s-nodes' && !i.noCopy && !/\n/.test(i.cmd) && i.cmd.length < 160 && i.desc.length > 6 && i.desc !== i.cmd;
      const items = window.GLOBAL_SEARCH_INDEX.filter(ok);
      const slot = items.find(i => /<[a-z][^<>]*>/.test(i.cmd));
      const plain = items.find(i => !/[<$]/.test(i.cmd) && i.desc !== (slot && slot.desc));
      return { slot, plain };
    });
    await ctx.close();
    return r;
  };
  const { slot, plain } = await pick();
  check(!!(slot && plain), `found test commands (${slot && slot.cmd} · ${plain && plain.cmd})`);
  const filled = slot.cmd.replace(/<[a-z][^<>]*>/gi, 'gpu-node-07');

  // Runs in the page before its scripts: the live trail and the node registry.
  const seed = (args) => {
    localStorage.setItem('dc_case_trail', JSON.stringify(args.trail));
    if (args.nodes) localStorage.setItem('dc_nodes', JSON.stringify(args.nodes));
  };
  const openPractice = async (p) => {
    await p.keyboard.press('q');
    await p.waitForSelector('.prac-scopes button');
    return p.evaluate(() => [...document.querySelectorAll('.prac-scope')].map(b => ({ spec: b.dataset.pracScope, n: b.querySelector('small').textContent })));
  };

  // 1. Live trail (the slot command 3 times, filled in, once with a "# needs root" line) plus
  //    another node's snapshot (the plain command once), plus a command that isn't on any sheet.
  {
    const ctx = await newContext(browser);
    const t = Date.now();
    const trail = [
      { id: 'a', t, cmd: filled, sheet: 'k8s-nodes', note: '' },
      { id: 'b', t, cmd: `# needs root\n${filled}`, sheet: 'k8s-nodes', note: '' },
      { id: 'c', t, cmd: filled, sheet: 'k8s-nodes', note: '' },
      { id: 'd', t, cmd: 'echo not-a-sheet-command', sheet: 'k8s-nodes', note: '' }
    ];
    const nodes = { active: 'gpu-node-07', nodes: { 'gpu-node-07': { t }, 'gpu-node-12': { t, data: { dc_case_trail: JSON.stringify([{ id: 'e', t, cmd: plain.cmd, sheet: 'k8s-nodes', note: '' }]) } } } };
    await ctx.addInitScript(seed, { trail, nodes });
    const p = await ctx.newPage();
    await p.goto(BASE + 'containers.html#k8s-nodes', { waitUntil: 'load' });
    await p.waitForTimeout(500);
    const chips = await openPractice(p);
    const mine = chips.find(c => c.spec === 'trail');
    check(!!mine && mine.n === '2', `"From my trail" chip counts the 2 matched commands across both nodes (${mine ? mine.n : 'no chip'})`);
    await p.click('.prac-scope[data-prac-scope="trail"]');
    await p.waitForTimeout(200);
    const r = await p.evaluate(() => ({
      title: document.querySelector('#prac-title').textContent,
      count: document.querySelector('.prac-count').textContent,
      task: document.querySelector('.prac-task').textContent
    }));
    check(/From my trail/.test(r.title), `the round is titled "From my trail" (${r.title.trim()})`);
    check(/^1 \/ 2$/.test(r.count.trim()), `the round has exactly the 2 trail commands (${r.count.trim()})`);
    check(r.task === slot.desc, `the most-copied command comes first (${r.task})`);
    // Answer it: the placeholder accepts the value the tech typed.
    await p.fill('.prac-input', filled);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(200);
    const verdict = await p.evaluate(() => (document.querySelector('.prac-verdict, .prac-result') || {}).className || document.querySelector('.prac-stage').textContent.slice(0, 80));
    check(!/miss/i.test(verdict), `typing the filled-in command counts as right (${verdict})`);
    await ctx.close();
  }

  // 2. No trail: no chip.
  {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    await p.goto(BASE + 'containers.html#k8s-nodes', { waitUntil: 'load' });
    await p.waitForTimeout(500);
    const chips = await openPractice(p);
    check(!chips.some(c => c.spec === 'trail'), 'with an empty trail there is no "From my trail" chip');
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
