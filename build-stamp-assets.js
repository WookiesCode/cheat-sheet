// build-stamp-assets.js
// Browsers (especially behind a local web server) keep common.js and styles.css
// cached and do not always re-check them when you move between sheets, so a fix
// could be on disk while the page still ran the old script. Every page loads
// them as common.js?v=<hash> / styles.css?v=<hash>; this rewrites the hash from
// the files' contents, so a changed file always has a new URL.
// Run after editing common.js or styles.css (build-portable.js runs it too).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = __dirname;
const hash = f => crypto.createHash('sha1').update(fs.readFileSync(path.join(dir, f))).digest('hex').slice(0, 10);
const assets = { 'common.js': hash('common.js'), 'styles.css': hash('styles.css') };

let changed = 0;
for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.html') && x !== 'datacenter-cheatsheet-portable.html')) {
  const p = path.join(dir, f);
  const src = fs.readFileSync(p, 'utf8');
  let out = src;
  for (const [name, h] of Object.entries(assets)) {
    const attr = name.endsWith('.js') ? 'src' : 'href';
    out = out.replace(new RegExp(`${attr}="${name.replace('.', '\\.')}(\\?v=[0-9a-f]*)?"`, 'g'), `${attr}="${name}?v=${h}"`);
  }
  if (out !== src) { fs.writeFileSync(p, out); changed++; }
}
console.log(`Stamped common.js?v=${assets['common.js']} styles.css?v=${assets['styles.css']} into ${changed} page(s).`);
