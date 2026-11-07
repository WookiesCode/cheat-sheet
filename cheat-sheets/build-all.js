// build-all.js
// Regenerates every sheet's data file, then the search index and portable build.
// Run this rather than individual generators: the order below is the dependency
// order, and the last two steps must see the regenerated data.
//
// Generators write sheet .js files and only create .html files that are missing.
// Existing pages own their header and nav, so a new page needs its chrome checked.
const { execFileSync } = require('child_process');
const path = require('path');

const STEPS = [
  'create-scripting-data.js',
  'generate-scripting-suite.js',
  'generate-cli-suite.js',
  'generate-linux-suite.js',
  'generate-neovim-suite.js',
  'generate-macos-suite.js',
  'generate-windows-suite.js',
  'generate-nvidia-suite.js',
  'generate-infiniband-suite.js',
  'generate-switches-suite.js',
  'generate-redfish-suite.js',
  'generate-ipmi-suite.js',
  'generate-fiber-suite.js',
  'generate-ethernet-suite.js',
  'generate-motherboards-suite.js',
  'generate-containers-suite.js',
  'generate-grafana-suite.js',
  'build-man-data.js',
  'build-index.js',
  'build-portable.js'
];

for (const step of STEPS) {
  execFileSync(process.execPath, [path.join(__dirname, step)], { cwd: __dirname, stdio: 'ignore' });
  console.log(`ok ${step}`);
}
