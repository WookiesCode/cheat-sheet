// build-all.js
// Regenerates every sheet's data file, then the search index and portable build.
// Run this rather than individual generators: the order below is the dependency
// order, and the last two steps must see the regenerated data.
//
// Each group is one page whose .js holds its data (the old per-topic pages are parts of it,
// picked by #part in the URL), so there are no generators left to run before the index.
const { execFileSync } = require('child_process');
const path = require('path');

const STEPS = [
  'build-nav-groups.js',
  'build-nav-js.js',      // nav/nav-source.html → nav.js + a small fallback nav in every page
  'build-help-pages.js', // help-captures/ → help-pages.json, shipped by build-man-data.js
  'build-man-data.js',
  'build-index.js',
  'build-portable.js'
];

for (const step of STEPS) {
  execFileSync(process.execPath, [path.join(__dirname, step)], { cwd: __dirname, stdio: 'ignore' });
  console.log(`ok ${step}`);
}
