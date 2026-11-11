// The output analyzer reads switch error counters from all five switch OSes on the site (R10).
// Fixtures are the vendors' documented samples (read 2026-11-11); where a sample is all zeros, a few
// counts are changed so there is something to find, and the comment says so. Columns are matched by
// header name, so the NX-OS table split into blocks and SONiC's "653.87 MB/s" cells must still parse.
// common.js is patched in the browser only (page.route) to expose openAnalyzer, as in xss.test.js.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

const FIX = {
  // Arista EOS 4.37 manual, show interfaces counters errors (Et1-Et2 as documented; Et3-Et4 added).
  arista: `switch# show interfaces ethernet 1-4 counters errors
Port               FCS    Align   Symbol       Rx    Runts   Giants       Tx
Et1                  0        0        0        0        0        0        0
Et2                  0        0        0        0        0        0        0
Et3               4182        0     3977     8159        0        0        0
Et4                  2        0        0        2        0        0        0
switch>`,
  // Arista's documented sample exactly: all zeros.
  aristaClean: `switch# show interfaces ethernet 1-2 counters errors
Port               FCS    Align   Symbol       Rx    Runts   Giants       Tx
Et1                  0        0        0        0        0        0        0
Et2                  0        0        0        0        0        0        0`,
  // Cisco 216239 (Nexus 9000 CRC identification): every CRC on Eth1/1 is stomped.
  nxos: `switch# show interface counters errors non-zero
--------------------------------------------------------------------------------
Port          Align-Err    FCS-Err   Xmit-Err    Rcv-Err  UnderSize OutDiscards
--------------------------------------------------------------------------------
Eth1/1       1790348828  1790348828         0  1790348828         0           0

--------------------------------------------------------------------------------
Port         Single-Col  Multi-Col   Late-Col  Exces-Col  Carri-Sen       Runts
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
Port          Giants SQETest-Err Deferred-Tx IntMacTx-Er IntMacRx-Er Symbol-Err
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
Port         InDiscards
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
Port         Stomped-CRC
--------------------------------------------------------------------------------
Eth1/1      1790348828`,
  // The same layout with a second port whose CRCs are local (not stomped): added for the test.
  nxosLocal: `--------------------------------------------------------------------------------
Port          Align-Err    FCS-Err   Xmit-Err    Rcv-Err  UnderSize OutDiscards
--------------------------------------------------------------------------------
Eth1/1              0        900         0        900         0           0
Eth1/7              0         12         0         12         0           0
--------------------------------------------------------------------------------
Port         Stomped-CRC
--------------------------------------------------------------------------------
Eth1/1              0
Eth1/7             12`,
  // SONiC Command Reference, show interfaces counters (first rows as documented): drops, no errors.
  sonic: `admin@sonic:~$ show interfaces counters
        IFACE    STATE            RX_OK       RX_BPS    RX_UTIL    RX_ERR    RX_DRP    RX_OVR            TX_OK       TX_BPS    TX_UTIL    TX_ERR    TX_DRP    TX_OVR
  -----------  -------  ---------------  -----------  ---------  --------  --------  --------  ---------------  -----------  ---------  --------  --------  --------
    Ethernet0        U  471,729,839,997  653.87 MB/s     12.77%         0    18,682         0  409,682,385,925  556.84 MB/s     10.88%         0         0         0
    Ethernet4        U  453,838,006,636  632.97 MB/s     12.36%         0     1,636         0  388,299,875,056  529.34 MB/s     10.34%         0         0         0
    Ethernet8        U  549,034,764,539  761.15 MB/s     14.87%         0    18,274         0  457,603,227,659  615.20 MB/s     12.02%         0         0         0`,
  // Cumulus Linux 5.18 NVUE docs, nv show interface --view counters (first rows; swp2 RX_ERR 37 added).
  cumulus: `cumulus@switch$ nv show interface --view counters
Interface       MTU    RX_OK  RX_ERR  RX_DRP  RX_OVR  TX_OK  TX_ERR  TX_DRP  TX_OVR  Flg
--------------  -----  -----  ------  ------  ------  -----  ------  ------  ------  -----
BLUE            65575  1      0       0       0       0      0       4       0       OmRU
bond1           9000   718    0       0       0       1091   0       0       0       BMmRU
swp1            9000   721    0       0       0       1091   0       0       0       BMsRU
swp2            9000   730    37      0       0       1088   0       0       0       BMsRU`,
  // Cumulus 5.18 NVUE docs, nv show interface swp1 counters errors (FCS and Symbol counts added).
  cumulusPort: `cumulus@switch$ nv show interface swp1 counters errors
Counter           Receive  Transmit
----------------  -------  --------
Alignment Errors  0        n/a
FCS Errors        25       n/a
Jabber Errors     0        n/a
Length Errors     0        n/a
Oversize Errors   0        n/a
Symbol Errors     9        n/a
Total Errors      34       0
Undersize Errors  0        n/a`,
  // MLNX-OS 3.12.6200 manual, show interfaces ib (the documented fields; IB1/2's counts added).
  mlnxos: `switch (config) # show interfaces ib
IB1/1 state:
  Logical port state          : Active
  Physical port state         : LinkUp
Rx:
  Bytes                       : 1000
  Packets                     : 10
  Errors                      : 0
  Symbol errors               : 0
  VL15 dropped packets        : 3
Tx:
  Bytes                       : 1000
  Packets                     : 10
  Wait                        : 0
  Discarded packets           : 0
IB1/2 state:
  Logical port state          : Active
  Physical port state         : LinkUp
Rx:
  Bytes                       : 1000
  Packets                     : 10
  Errors                      : 41
  Symbol errors               : 1250
  VL15 dropped packets        : 0
Tx:
  Bytes                       : 1000
  Packets                     : 10
  Wait                        : 500
  Discarded packets           : 0`
};

(async () => {
  const browser = await launch();
  const ctx = await newContext(browser);
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
  const src = fs.readFileSync(path.join(ROOT, 'common.js'), 'utf8')
    .replace('  window.CheatSheetCommon = commonExports;', 'window.__t = { openAnalyzer };\n  window.CheatSheetCommon = commonExports;');
  await ctx.route(/\/common\.js(\?.*)?$/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: src }));
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'load' });
  await p.waitForTimeout(800);

  // openAnalyzer renders asynchronously: clear the old report, then wait for the new one.
  const run = async text => {
    await p.evaluate(t => { const o = document.querySelector('.an-out'); if (o) o.innerHTML = ''; window.__t.openAnalyzer(t); }, text);
    await p.waitForFunction(() => document.querySelector('.an-out .an-report') || document.querySelector('.an-out') && document.querySelector('.an-out').textContent.trim(), null, { timeout: 3000 }).catch(() => {});
    return read();
  };
  const read = () => p.evaluate(() => {
    const out = document.querySelector('.an-out');
    const rep = out && out.querySelector('.an-report');
    if (!rep) return null;
    return {
      title: (rep.querySelector('.an-type') || {}).textContent || '',
      verdict: (rep.querySelector('.an-verdict b') || {}).textContent || '',
      findings: [...rep.querySelectorAll('.an-findings li')].map(li => `${li.className}|${li.querySelector('b').textContent}`),
      ports: [...rep.querySelectorAll('.sw-table tbody tr')].map(tr => tr.firstElementChild.textContent)
    };
  });
  const has = (r, re) => r.findings.some(f => re.test(f));

  let r = await run(FIX.arista);
  check(r && /Arista EOS/.test(r.title), `Arista: detected (${r && r.title})`);
  check(r && r.ports[0] === 'Et3' && r.ports[1] === 'Et4', `Arista: Et3 is worst, then Et4 (${r && r.ports.join(', ')})`);
  check(r && has(r, /^sev-crit\|Et3: 8,159 receive errors \(FCS 4,182, Symbol 3,977\)/), 'Arista: Et3 is critical (≥10× any other port), with its FCS and Symbol counts');
  r = await run(FIX.aristaClean);
  check(r && has(r, /^sev-ok\|No error counters above zero on 2 ports/), "Arista's documented all-zero sample reads as clean");

  r = await run(FIX.nxos);
  check(r && /NX-OS/.test(r.title), `NX-OS: detected across the split tables (${r && r.title})`);
  check(r && has(r, /^sev-info\|Eth1\/1: 1,790,348,828 of 1,790,348,828 CRC errors are stomped/), 'NX-OS: every CRC on Eth1/1 is reported as stomped');
  check(r && has(r, /^sev-ok\|No errors that start on these 1 link/) && !has(r, /No error counters above zero/), 'NX-OS: no local errors, and it does not claim the counters are zero');
  r = await run(FIX.nxosLocal);
  check(r && r.ports[0] === 'Eth1/1' && has(r, /^sev-(warn|crit)\|Eth1\/1: 900 receive errors/) && !has(r, /^sev-(warn|crit)\|Eth1\/7:/), 'NX-OS: local CRCs count against the port, stomped ones do not');

  r = await run(FIX.sonic);
  check(r && /SONiC/.test(r.title) && r.ports.length === 3, `SONiC: three ports read through the "MB/s" cells (${r && r.ports.join(', ')})`);
  check(r && has(r, /^sev-info\|Drops without errors on 3 ports/) && has(r, /^sev-ok\|No error counters above zero/), 'SONiC: drops are congestion, not errors');

  r = await run(FIX.cumulus);
  check(r && /Cumulus/.test(r.title) && r.ports[0] === 'swp2' && has(r, /swp2: 37 receive errors/), `Cumulus: swp2's 37 receive errors lead (${r && r.ports.join(', ')})`);
  r = await run(FIX.cumulusPort);
  check(r && has(r, /swp1: 34 receive errors \(FCS 25, Symbol 9\)/), "Cumulus one-port view: the port comes from the command line, with FCS and Symbol");

  r = await run(FIX.mlnxos);
  check(r && /MLNX-OS/.test(r.title) && r.ports[0] === 'IB1/2', `MLNX-OS: IB1/2 is worst (${r && r.ports.join(', ')})`);
  check(r && has(r, /IB1\/2: 1,291 receive errors \(Symbol 1,250\)/), 'MLNX-OS: receive errors and symbol errors both count');
  check(r && has(r, /^sev-info\|Drops without errors on 1 port \(IB1\/1\)/) && has(r, /^sev-info\|Tx wait on 1 port \(IB1\/2\)/), 'MLNX-OS: VL15 drops and Tx wait are notes, not faults');

  // Not switch output: no switch report.
  r = await run('nvme nvme0: I/O 123 QID 4 timeout, aborting');
  check(!r || !/Arista|NX-OS|SONiC|Cumulus|MLNX-OS/.test(r.title), 'a log line is not mistaken for switch counters');

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
