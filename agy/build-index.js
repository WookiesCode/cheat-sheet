// build-index.js
// Generates global-search-index.js across all 184 interactive cheat sheet JS data files.
const fs = require('fs');
const path = require('path');

const excludeFiles = new Set([
  'build-index.js',
  'build-portable.js',
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
  'generate-all-remaining-suites.js',
  'create-scripting-data.js',
  'common.js',
  'global-search-index.js'
]);

const jsFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && !excludeFiles.has(f));

const index = [];

for (const jsFile of jsFiles) {
  const htmlFile = jsFile.replace(/\.js$/, '.html');
  const filePath = path.join(__dirname, jsFile);
  const content = fs.readFileSync(filePath, 'utf8');

  const match = content.match(/const\s+([A-Z0-9_]+_DATA)\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) continue;

  let sections = [];
  try {
    sections = eval(match[2]);
  } catch (err) {
    console.error(`Error evaluating ${jsFile}:`, err.message);
    continue;
  }

  const sName = jsFile.replace(/\.js$/, '');

  for (const s of sections) {
    if (!s || !Array.isArray(s.commands)) continue;
    for (const c of s.commands) {
      if (!c) continue;
      index.push({
        sName: sName,
        file: htmlFile,
        badge: s.badge || sName.toUpperCase(),
        id: c.id || '',
        sec: s.title || '',
        cmd: c.cmd || '',
        desc: c.desc || '',
        tip: c.tip || '',
        tags: Array.isArray(c.tags) ? c.tags.join(' ') : ''
      });
      if (Array.isArray(c.subcommands)) {
        for (const sub of c.subcommands) {
          if (Array.isArray(sub) && sub.length >= 2) {
            index.push({
              sName: sName,
              file: htmlFile,
              badge: s.badge || sName.toUpperCase(),
              id: c.id || '',
              sec: s.title || '',
              cmd: sub[0],
              desc: sub[1],
              tip: '',
              tags: Array.isArray(c.tags) ? c.tags.join(' ') : ''
            });
          }
        }
      }
    }
  }
}

const outContent = `// Auto-generated Global Search Index across all ${jsFiles.length} cheat sheets
// Total indexed items: ${index.length}
window.GLOBAL_SEARCH_INDEX = ${JSON.stringify(index, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'global-search-index.js'), outContent, 'utf8');
console.log(`Successfully generated global-search-index.js across ${jsFiles.length} sheets with ${index.length} items.`);
