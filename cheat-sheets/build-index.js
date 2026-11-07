// build-index.js
// Generates global-search-index.js across every interactive cheat sheet JS data file.
const fs = require('fs');
const path = require('path');
const { isReference } = require('./build-reference-rules.js');

// Tooling never holds sheet data. app.js does: it backs linux.html (index.html is the home page).
const isTooling = f => /^(build-|generate-|create-)/.test(f) || f === 'common.js' || f === 'global-search-index.js' || f === 'man-pages-data.js';
const htmlFor = f => (f === 'app.js' ? 'linux.html' : f.replace(/\.js$/, '.html'));

const jsFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && !isTooling(f));

const index = [];

for (const jsFile of jsFiles) {
  const htmlFile = htmlFor(jsFile);
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

  const sName = jsFile === 'app.js' ? 'linux' : jsFile.replace(/\.js$/, '');

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
        tags: Array.isArray(c.tags) ? c.tags.join(' ') : '',
        // Reference entries keep their text for search but have nothing to copy.
        ...((c.diagram || c.hideCode || isReference(c.cmd || '', jsFile)) ? { noCopy: true } : {})
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
              tags: Array.isArray(c.tags) ? c.tags.join(' ') : '',
              ...(isReference(String(sub[0]), jsFile) ? { noCopy: true } : {})
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
