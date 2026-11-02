// Run with jsdom available: node codex/tests/jira.test.js
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('jira.js');
const data = vm.runInNewContext(source.slice(0, source.indexOf('// State')) + '\nJIRA_DATA');
const queries = data.flatMap(section => section.commands);
assert.equal(queries.length, 27);
assert.equal(new Set(queries.map(query => query.id)).size, queries.length);
for (const id of ['jira-node-history', 'jira-node-broad', 'jira-serial', 'jira-rack', 'jira-position']) {
  const query = queries.find(query => query.id === id).cmd;
  assert(!/status|resolution|project\s*=|created\s*[<>]/i.test(query), id + ': history must not silently exclude older/closed/cross-project tickets');
}
for (const file of fs.readdirSync(root).filter(file => file.endsWith('.html'))) {
  const html = read(file);
  if (!html.includes('class="sheet-switcher"')) continue; // Standalone Omarchy page links back to the suite.
  assert(html.includes(file.startsWith('datacenter-') ? 'data-sheet="jira"' : 'href="jira.html"'), file + ': missing Jira navigation');
}
async function check(file) {
  let copied = null;
  const dom = new JSDOM(read(file), {url:'https://cheatsheet.test/' + file, runScripts:'outside-only'});
  try {
    const w = dom.window;
    Object.defineProperty(w, 'isSecureContext', {value:true});
    w.HTMLElement.prototype.scrollIntoView = function() {};
    Object.defineProperty(w.navigator, 'clipboard', {value:{writeText: async text => {copied = text;}}});
    const loaded = new Promise(resolve => w.addEventListener('load', resolve, {once:true}));
    for (const script of w.document.querySelectorAll('script')) {
      w.eval(script.src ? read(script.getAttribute('src')) : script.textContent);
    }
    await loaded;
    if (file.startsWith('datacenter-')) {
      w.PortableNavigation.open('jira.html', 'jira-node-history');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.equal(w.document.querySelectorAll('.cmd-item, .command-item').length, 27);
    const expected = queries.find(query => query.id === 'jira-node-history').cmd;
    const box = [...w.document.querySelectorAll('[data-cmd], [data-copy]')].find(el => (el.dataset.cmd || el.dataset.copy) === expected);
    assert(box, 'phrase escaping must survive rendering');
    (box.querySelector('.copy-btn') || box).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.equal(copied, expected, 'clipboard must preserve JQL escaped phrase quotes');
    const search = w.document.getElementById('search-input');
    search.value = 'unassigned';
    search.dispatchEvent(new w.Event('input', {bubbles:true}));
    assert.equal(w.document.querySelectorAll('.cmd-item, .command-item').length, 1);
    assert(w.GLOBAL_SEARCH_INDEX.some(item => item.file === 'jira.html' && item.id === 'jira-position'));
  } finally { dom.window.close(); }
}
(async () => {
  await check('jira.html');
  await check('datacenter-cheatsheet-portable.html');
  console.log('Jira: 27 queries, unrestricted history templates, all navigation links, standalone/portable rendering, search, and exact clipboard round-trip passed.');
})().catch(error => {console.error(error); process.exitCode = 1;});
