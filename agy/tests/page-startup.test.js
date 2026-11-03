// Requires jsdom. Run: node codex/tests/page-startup.test.js
// Uses each page's actual HTML: missing elements must remain null.
const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const cache = new Map();
const read = file => {
  if (!cache.has(file)) cache.set(file, fs.readFileSync(path.join(root, file), 'utf8'));
  return cache.get(file);
};
async function check(file, theme) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.cause?.stack || error.detail?.stack || error.message));
  const dom = new JSDOM(read(file), {
    url: 'https://cheatsheet.test/' + file, runScripts: 'outside-only', virtualConsole: vc,
    // No resources option: no external fonts or network requests.
  });
  try {
    dom.window.localStorage.setItem('linux_cs_theme', theme);
    let lastScrolled = null;
    dom.window.HTMLElement.prototype.scrollIntoView = function () { lastScrolled = this; };
    for (const script of dom.window.document.querySelectorAll('script')) {
      const src = script.getAttribute('src');
      dom.window.eval((src ? read(src) : script.textContent) + '\n//# sourceURL=' + (src || file));
    }
    await new Promise(resolve => dom.window.addEventListener('load', resolve, {once:true}));
    assert.equal(errors.length, 0, file + ': ' + errors.join('\n'));
    assert(dom.window.document.querySelectorAll('.cmd-item, .command-item').length > 0, file + ': no command cards rendered');
    assert.equal(dom.window.document.documentElement.getAttribute('data-theme'), theme, file + ': saved theme lost');
    assert(dom.window.document.getElementById('offline-manuals-btn'), file + ': missing Manuals button');
    assert(dom.window.GLOBAL_SEARCH_INDEX?.length > 0, file + ': missing global search index');
    dom.window.CheatSheetCommon.openGlobalSearch('dmidecode');
    assert(dom.window.document.querySelector('.palette-item'), file + ': global search returned no results');
    dom.window.CheatSheetCommon.closeGlobalSearch();
    if (file !== 'datacenter-cheatsheet-portable.html') {
      const ids = new Set(dom.window.GLOBAL_SEARCH_INDEX.filter(item => item.file === file).map(item => item.id));
      for (const id of ids) {
        lastScrolled = null;
        dom.window.CheatSheetCommon.scrollToCard(id);
        assert(lastScrolled, file + ': failed to locate command ' + id);
        assert(lastScrolled.classList.contains('cmd-highlight-flash'), file + ': command not highlighted');
      }
    } else {
      const dropdown = dom.window.document.getElementById('scripting-nav-dropdown');
      dropdown.querySelector('.dropdown-toggle').click();
      assert(dropdown.classList.contains('open'), 'portable scripting menu must open on first click');
      dropdown.querySelector('.dropdown-toggle').click();
      assert(!dropdown.classList.contains('open'), 'portable scripting menu must close on second click');
    }
    const localSearch = dom.window.document.getElementById('search-input');
    localSearch.value = 'definitely-no-command-matches-this-token';
    localSearch.dispatchEvent(new dom.window.Event('input', {bubbles:true}));
    assert.equal(errors.length, 0, file + ': search threw: '+errors.join('\n'));
  } finally {
    dom.window.close();
  }
}
(async () => {
  const failures = [];
  for (const file of files) {
    try { await check(file, 'nord'); } catch (error) { failures.push(error.stack); }
  }
  for (const theme of ['dark', 'light']) {
    try { await check('nv-dcgm.html', theme); } catch (error) { failures.push(error.stack); }
  }
  if (failures.length) { console.error(failures.join('\n\n')); process.exitCode = 1; }
  else console.log(`Passed startup, local/global search, command navigation, and portable dropdown checks for ${files.length} HTML pages, preserving saved themes; DCGM also tested in dark and light modes.`);
})();
