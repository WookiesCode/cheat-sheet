const { BASE, launch, newContext } = require('./lib');
(async () => { const b = await launch(); const p = await (await newContext(b)).newPage();
 for (const f of ['sw-quantum-ports','sw-arista-bgp']) { await p.goto(BASE+f+'.html',{waitUntil:'load'}); await p.waitForTimeout(400);
  console.log(await p.evaluate(() => [...document.querySelectorAll('.cmd-item[data-cmd-id]')].map(it=>it.dataset.cmdId+' | '+JSON.stringify(it.querySelector('.cmd-code-box').innerText)+' | copy='+JSON.stringify(it.querySelector('.cmd-code-box').dataset.copy||'')).join('\n'))); }
 await b.close(); })();
