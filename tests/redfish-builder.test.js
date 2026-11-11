// The Redfish hub's request builder: only the Standard preset (Systems/1, Managers/1) is left.
// The Dell and DGX presets were removed 2026-11-11 (neither is in the fleet), and no preset points
// host commands at the GPU baseboard (HGX_Baseboard_0).
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
    check(options.join() === 'standard', `${name}: the vendor list offers only Standard (${options.join(', ')})`);
    const std = await build(p, 'managers', 'sel-entries', 'standard');
    check(/\/Managers\/1\/LogServices\/Sel\/Entries/.test(std), `${name}: Standard still uses Managers/1/LogServices/Sel`);
    const all = await p.evaluate(() => document.body.innerHTML);
    check(!/HGX_BMC_0|HGX_Chassis_0/.test(all), `${name}: no undocumented HGX ids left on the page`);
    check(!/System\.Embedded\.1|iDRAC\.Embedded\.1|Systems\/DGX|Managers\/BMC\b/.test(all), `${name}: no Dell or DGX ids left on the page`);
    const reset = await build(p, 'systems', 'power-cycle', 'standard');
    check(/\/Systems\/1\/Actions\/ComputerSystem\.Reset/.test(reset), `${name}: power cycle goes to Systems/1`);
    await ctx.close();
  }
  // The portable file carries the hub's builder markup but does not render the builder (it shows
  // the Redfish sheet's cards only), so check what the bundle contains instead.
  const bundle = fs.readFileSync(path.join(ROOT, 'datacenter-cheatsheet-portable.html'), 'utf8');
  check(!bundle.includes('DGX / BMC (NVIDIA DGX') && !bundle.includes('HGX_Baseboard_0 (NVIDIA HGX)'), 'portable bundle has no DGX or HGX preset');
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
