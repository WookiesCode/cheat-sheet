// The Redfish hub's request builder fills each vendor's resource ids; the DGX preset uses the ids
// NVIDIA documents (Systems/DGX, Chassis/DGX, Managers/BMC, LogServices/SEL), and no preset points
// host commands at the GPU baseboard (HGX_Baseboard_0) any more.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// Pick collection, action and vendor the way a person does (select + change event), return the command.
async function build(p, col, act, ven) {
  return p.evaluate(([c, a, v]) => {
    const set = (id, val) => { const el = document.getElementById(id); el.value = val; el.dispatchEvent(new Event('change', { bubbles: true })); };
    set('rf-collection', c); set('rf-action', a); set('rf-vendor', v);
    return document.getElementById('rf-preview-box').dataset.copy;
  }, [col, act, ven]);
}

(async () => {
  const browser = await launch();
  for (const [name, url] of [['site', BASE + 'redfish.html']]) {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    p.on('pageerror', e => check(false, `${name}: page error ${e.message}`));
    await p.goto(url, { waitUntil: 'load' });
    await p.waitForTimeout(900);
    const options = await p.evaluate(() => [...document.querySelectorAll('#rf-vendor option')].map(o => o.value));
    check(options.includes('dgx') && !options.includes('hgx'), `${name}: the vendor list offers DGX and no HGX preset (${options.join(', ')})`);
    const sel = await build(p, 'managers', 'sel-entries', 'dgx');
    check(/\/Managers\/BMC\/LogServices\/SEL\/Entries/.test(sel), `${name}: DGX SEL request goes to Managers/BMC/LogServices/SEL`);
    const reset = await build(p, 'systems', 'power-cycle', 'dgx');
    check(/\/Systems\/DGX\/Actions\/ComputerSystem\.Reset/.test(reset), `${name}: DGX power cycle goes to Systems/DGX`);
    const std = await build(p, 'managers', 'sel-entries', 'standard');
    check(/\/Managers\/1\/LogServices\/Sel\/Entries/.test(std), `${name}: Standard still uses Managers/1/LogServices/Sel`);
    check(!options.includes('dell'), `${name}: no Dell preset (no Dell hardware in the fleet)`);
    const all = await p.evaluate(() => document.body.innerHTML);
    check(!/HGX_BMC_0|HGX_Chassis_0/.test(all), `${name}: no undocumented HGX ids left on the page`);
    check(!/System\.Embedded\.1|iDRAC\.Embedded\.1/.test(all), `${name}: no Dell ids left on the page`);
    await ctx.close();
  }
  // The portable file carries the hub's builder markup but does not render the builder (it shows
  // the Redfish sheet's cards only), so check what the bundle contains instead.
  const bundle = fs.readFileSync(path.join(ROOT, 'datacenter-cheatsheet-portable.html'), 'utf8');
  check(bundle.includes('DGX / BMC (NVIDIA DGX H100/H200/B200)') && !bundle.includes('HGX_Baseboard_0 (NVIDIA HGX)'), 'portable bundle carries the DGX preset, not the old HGX one');
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
