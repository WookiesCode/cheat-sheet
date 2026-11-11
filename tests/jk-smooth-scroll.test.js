// j/k pressed while the page is still smooth-scrolling (after an outline link, Home, or a script
// scroll) must not leave the focused command under the footer once the animation would have ended.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// Fully covered = every on-screen sample point of the focused element is under something else.
const hidden = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return 'no focus';
  const rc = el.getBoundingClientRect();
  let on = 0, mine = 0;
  for (const fx of [0.2, 0.5, 0.8]) for (const fy of [0.15, 0.5, 0.85]) {
    const x = rc.left + rc.width * fx, y = rc.top + rc.height * fy;
    if (y < 0 || y >= innerHeight) continue;
    on++;
    const t = document.elementFromPoint(x, y);
    if (t && (t === el || el.contains(t))) mine++;
  }
  return mine ? '' : `hidden (top ${Math.round(rc.top)}, ${on} points on screen)`;
};

(async () => {
  const browser = await launch();
  for (const [w, h, file] of [[800, 700, 'infiniband.html#ib-mlxlink'], [1280, 800, 'nvidia.html#nv-smi']]) {
    const ctx = await newContext(browser, { viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto(BASE + file, { waitUntil: 'load' });
    await p.waitForTimeout(1200);
    let bad = 0, why = '', animOk = true;
    for (let run = 0; run < 5; run++) {
      // Run the whole sequence inside the page: driven step by step from the test runner, headless
      // Chrome finishes the smooth scroll between calls and the race never happens.
      const r = await p.evaluate(async (hiddenSrc) => {
        const hidden = (0, eval)('(' + hiddenSrc + ')');
        const sleep = ms => new Promise(res => setTimeout(res, ms));
        document.activeElement && document.activeElement.blur();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
        await sleep(100);
        const start = scrollY;
        window.scrollTo(0, 0);                       // the page's own smooth scrolling (~500 ms)
        await sleep(150);
        const mid = scrollY;
        // j, as the site's keydown handler on window receives it.
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', bubbles: true }));
        await sleep(1000);                           // longer than any smooth-scroll animation
        return { mid: mid < start && mid > 0, hidden: hidden() };
      }, hidden.toString());
      if (!r.mid) animOk = false;
      if (r.hidden) { bad++; why = r.hidden; }
    }
    check(animOk, `${w}x${h} ${file}: the test caught the page mid-animation every time`);
    check(bad === 0, `${w}x${h} ${file}: j during a smooth scroll leaves the command visible (${5 - bad}/5)${why ? ' · ' + why : ''}`);
    await ctx.close();
  }
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
