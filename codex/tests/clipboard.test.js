// Requires jsdom. Run: node codex/tests/clipboard.test.js
const {JSDOM, VirtualConsole} = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
async function check(mode, fallbackWorks, keyboard) {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(read('nv-dcgm.html'), {url:'https://test.invalid/nv-dcgm.html', runScripts:'outside-only', virtualConsole:console});
  try {
    const w = dom.window;
    let nativeCopy, fallbackCopy, navigation;
    if (mode !== 'missing') Object.defineProperty(w.navigator, 'clipboard', {value: {
      writeText: async text => {
        if (mode === 'denied') throw new Error('Permission denied');
        nativeCopy = text;
      }
    }});
    w.document.execCommand = () => {fallbackCopy = w.document.querySelector('textarea').value; return fallbackWorks;};
    for (const script of w.document.querySelectorAll('script')) w.eval(read(script.getAttribute('src')));
    await new Promise(resolve => w.addEventListener('load', resolve, {once:true}));
    // Record destination without attempting real browser navigation in jsdom.
    w.PortableNavigation = {open: (file, id) => {navigation = {file, id};}};
    const common = w.CheatSheetCommon;
    common.openGlobalSearch('dcgmi diag -r 1');
    const first = w.document.querySelector('.palette-item');
    assert(first);
    const expected = {file:first.dataset.file, id:first.dataset.id};
    if (keyboard) w.document.getElementById('palette-search-input').dispatchEvent(new w.KeyboardEvent('keydown', {key:'Enter', bubbles:true}));
    else first.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    assert.deepEqual(navigation, expected, 'navigation must proceed even if both copy methods fail');
    assert.equal(errors.length, 0, errors.join('\n'));
    assert.equal(nativeCopy || fallbackCopy, 'dcgmi diag -r 1', 'alternatives must not be copied as a pipeline');
    assert.equal(w.document.querySelector('textarea'), null, 'fallback textarea must be removed');
    if (mode !== 'success' && !fallbackWorks) assert.match(w.document.getElementById('toast-text').textContent, /Clipboard unavailable/);
    // The fallback must apply target substitutions too.
    await common.copyCommand('echo "$BMC_USER"   |   echo ignored');
    assert.equal(mode === 'success' ? nativeCopy : fallbackCopy, 'echo "ADMIN"');
  } finally {dom.window.close();}
}
(async () => {
  for (const mode of ['success', 'missing', 'denied']) {
    for (const fallback of [true, false]) for (const keyboard of [true, false]) await check(mode, fallback, keyboard);
  }
  console.log('Passed clipboard success, absence, rejection, failed fallback, click/Enter navigation, command normalization, and target substitution checks.');
})().catch(error => {console.error(error); process.exitCode = 1;});
