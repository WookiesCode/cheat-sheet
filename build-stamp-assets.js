// build-stamp-assets.js
// Browsers (especially behind a local web server) keep scripts and stylesheets
// cached and do not always re-check them when you move between sheets, so a fix
// could be on disk while the page still ran the old script. Every page loads its
// local assets as name.js?v=<hash> / name.css?v=<hash>; this rewrites the hash
// from each file's contents, so a changed file always has a new URL.
// Covers every local <script src> and <link href> that names a file in this folder
// (common.js, styles.css, global-search-index.js, each sheet's own .js).
// Run after editing any of them (build-portable.js runs it too).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = __dirname;
const hashes = new Map();
function hashOf(name) {
  if (!hashes.has(name)) {
    const file = path.join(dir, name);
    // Only files that exist here: external URLs, data: URIs and missing files stay untouched.
    hashes.set(name, fs.existsSync(file) && fs.statSync(file).isFile()
      ? crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10)
      : null);
  }
  return hashes.get(name);
}

// src="x.js" / src="x.js?v=abc" and href="x.css" / href="x.css?v=abc"; plain names only (no scheme, no path).
const ASSET_RE = /\b(src|href)="([\w.-]+\.(?:js|css))(?:\?v=[0-9a-f]*)?"/g;

let changed = 0;
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html') && x !== 'datacenter-cheatsheet-portable.html')) {
  const p = path.join(dir, f);
  const src = fs.readFileSync(p, 'utf8');
  const out = src.replace(ASSET_RE, (whole, attr, name) => {
    const h = hashOf(name);
    return h ? `${attr}="${name}?v=${h}"` : whole;
  });
  if (out !== src) { fs.writeFileSync(p, out); changed++; }
}
const stamped = [...hashes.values()].filter(Boolean).length;
console.log(`Stamped ${stamped} asset(s) (common.js?v=${hashOf('common.js')}, styles.css?v=${hashOf('styles.css')}) into ${changed} page(s).`);
