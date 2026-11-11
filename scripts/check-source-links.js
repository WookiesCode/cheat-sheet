#!/usr/bin/env node
// check-source-links.js: request every source URL the cards cite and report the ones that
// no longer answer. Run by hand (needs internet); it is not part of tests/run-all.js.
//
//   node scripts/check-source-links.js [--json out.json] [--host docs.nvidia.com]
//
// Each URL is fetched once (GET; many doc sites refuse HEAD), following redirects, with the
// body discarded. Results:
//   ok        2xx at the same address (http→https and a trailing slash don't count as moves)
//   moved     2xx, but only after a redirect to a different address: update the card's URL
//   dead      404 or 410
//   blocked   401, 403, 406 or 429: the site refuses automated requests; check it in a browser
//   error     anything else (5xx, timeout, DNS, TLS)
// Only the address is sent: a generic browser User-Agent, no cookies, nothing about the repo.
// Limit: only status codes are read, so a bot check served at the same address (git.kernel.org's
// "Making sure you're not a bot!") counts as ok. Cite a mirror (GitHub torvalds/linux) instead.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GENERATED = new Set(['global-search-index.js', 'flag-index.js', 'man-pages-data.js', 'nav.js']);
const TIMEOUT_MS = 20000;
const MAX_PARALLEL = 12;
const PER_HOST = 2;   // stay polite to any one site
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const jsonOut = opt('--json');
const onlyHost = opt('--host');

// url -> the sheet files that cite it
function collectUrls() {
  const cited = new Map();
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.js') && !GENERATED.has(f));
  for (const f of files) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of text.matchAll(/["']?url["']?\s*:\s*["'](https?:\/\/[^"']+)["']/g)) {
      if (!cited.has(m[1])) cited.set(m[1], new Set());
      cited.get(m[1]).add(f);
    }
  }
  return cited;
}

// Same page if only the scheme, "www.", a trailing slash or the #fragment differ, or the site
// only added a query to an address that had none (Microsoft Learn adds ?view=powershell-7.6).
function samePage(a, b) {
  try {
    const x = new URL(a);
    const y = new URL(b);
    const norm = (u, search) => (u.host.replace(/^www\./, '') + u.pathname.replace(/\/$/, '') + search).toLowerCase();
    return norm(x, x.search) === norm(y, x.search ? y.search : '');
  } catch (e) {
    return a === b;
  }
}

// Bot checks answer 200 with their own page; a redirect to one is a refusal, not a move.
const CHALLENGE = /\/\.internal\/challenge|\/\.within\.website\//;

async function check(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': UA, Accept: 'text/html,application/pdf,*/*' } });
    res.body?.cancel().catch(() => {});   // headers are enough; don't download PDFs
    const s = res.status;
    if (s >= 200 && s < 300 && CHALLENGE.test(res.url)) return { result: 'blocked', status: s, why: 'bot check' };
    if (s >= 200 && s < 300) return samePage(url, res.url) ? { result: 'ok', status: s } : { result: 'moved', status: s, to: res.url };
    if (s === 404 || s === 410) return { result: 'dead', status: s };
    if ([401, 403, 406, 429].includes(s)) return { result: 'blocked', status: s };
    return { result: 'error', status: s };
  } catch (e) {
    return { result: 'error', status: 0, why: e.name === 'AbortError' ? 'timeout' : (e.cause?.code || e.message) };
  } finally {
    clearTimeout(timer);
  }
}

// Some hosts drop a connection now and then (lua.org, gnu.org): one retry for network errors only.
async function checkWithRetry(url) {
  const first = await check(url);
  if (first.status !== 0) return first;
  await new Promise(r => setTimeout(r, 3000));
  return check(url);
}

// A small pool: at most MAX_PARALLEL requests, at most PER_HOST to one host.
async function runAll(urls) {
  const results = new Map();
  const busy = new Map();
  const queue = [...urls];
  let active = 0;
  let done = 0;
  return new Promise(resolve => {
    const pump = () => {
      if (!queue.length && !active) return resolve(results);
      for (let i = 0; i < queue.length && active < MAX_PARALLEL; i++) {
        const url = queue[i];
        const host = new URL(url).host;
        if ((busy.get(host) || 0) >= PER_HOST) continue;
        queue.splice(i--, 1);
        active++;
        busy.set(host, (busy.get(host) || 0) + 1);
        checkWithRetry(url).then(r => {
          results.set(url, r);
          active--;
          busy.set(host, busy.get(host) - 1);
          if (++done % 100 === 0) process.stderr.write(`${done}/${urls.length}\n`);
          pump();
        });
      }
    };
    pump();
  });
}

(async () => {
  const cited = collectUrls();
  let urls = [...cited.keys()];
  if (onlyHost) urls = urls.filter(u => new URL(u).host === onlyHost);
  process.stderr.write(`checking ${urls.length} URLs\n`);
  const results = await runAll(urls);
  const order = ['dead', 'moved', 'error', 'blocked', 'ok'];
  const counts = Object.fromEntries(order.map(k => [k, 0]));
  const rows = urls.map(u => ({ url: u, files: [...cited.get(u)], ...results.get(u) }))
    .sort((a, b) => order.indexOf(a.result) - order.indexOf(b.result) || a.url.localeCompare(b.url));
  for (const r of rows) {
    counts[r.result]++;
    if (r.result === 'ok') continue;
    const extra = r.to ? ` → ${r.to}` : r.why ? ` (${r.why})` : '';
    console.log(`${r.result.padEnd(7)} ${String(r.status).padEnd(3)} ${r.url}${extra}  [${r.files.join(', ')}]`);
  }
  console.log(order.map(k => `${counts[k]} ${k}`).join(', '));
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(rows, null, 2));
  process.exit(counts.dead ? 1 : 0);
})();
