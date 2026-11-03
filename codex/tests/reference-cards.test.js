// Requires jsdom. Run: NODE_PATH=/tmp/codex-jira-check/node_modules node codex/tests/reference-cards.test.js
const {JSDOM} = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

async function load(file) {
  const dom = new JSDOM(read(file), {url: 'https://cheatsheet.test/' + file, runScripts: 'outside-only'});
  const w = dom.window;
  w.HTMLElement.prototype.scrollIntoView = function () {};
  const loaded = new Promise(resolve => w.addEventListener('load', resolve, {once: true}));
  for (const script of w.document.querySelectorAll('script')) {
    const src = script.getAttribute('src');
    w.eval(src ? read(src) : script.textContent);
  }
  await loaded;
  await Promise.resolve(); // Let reference-card MutationObserver process the initial render.
  return dom;
}

function card(document, id) {
  return document.querySelector(`.cmd-item[data-id="${id}"], .cmd-item[data-cmd-id="${id}"], .command-item[data-id="${id}"]`);
}

function checkReference(document, id) {
  const item = card(document, id);
  assert(item, `${id}: missing card`);
  assert(item.querySelector('.reference-box'), `${id}: missing read-only reference`);
  assert(!item.querySelector('.cmd-code-box, .code-block, .copy-btn, .copy-hint'), `${id}: still offers Copy`);
}

function checkCommand(document, id) {
  const item = card(document, id);
  assert(item, `${id}: missing card`);
  assert(item.querySelector('.cmd-code-box, .code-block'), `${id}: runnable command lost Copy`);
}

(async () => {
  const cases = [
    ['motherboards.html', ['post-50-55-memory-init', 'ai-server-bios-checklist'], 'asus-asmb-redfish-post'],
    ['mb-memory-post.html', ['post-50-55-memory-init', 'post-50-55-memory-init-flags-card'], 'memory-post-tips-card'],
    ['fiber.html', ['breakout-topologies-800g-400g', 'mpo-male-female-pin-rule'], 'linux-ethtool-dom'],
    ['macos.html', ['screenshots-capture', 'trackpad-three-finger-drag'], 'open-command'],
    ['windows.html', ['win-power-user-admin', 'win-snap-multimonitor'], 'get-disk-inventory'],
    ['omarchy.html', ['om-core-menus-launcher'], 'cli-command-discovery'],
    ['neovim.html', ['word-motions', 'visual-block-insert'], 'substitute-buffer-confirm']
  ];
  for (const [file, refs, command] of cases) {
    const dom = await load(file);
    try {
      for (const id of refs) checkReference(dom.window.document, id);
      checkCommand(dom.window.document, command);
      if (file === 'motherboards.html') {
        assert(!dom.window.document.querySelector('#phase-grid [data-copy]'), 'POST phase reference must not copy');
        const copied = [];
        Object.defineProperty(dom.window.navigator, 'clipboard', {value: {writeText: async text => copied.push(text)}});
        dom.window.CheatSheetCommon.openGlobalSearch('POST 0x53');
        const result = dom.window.document.querySelector('.palette-item[data-file="motherboards.html"][data-id="post-50-55-memory-init"]');
        assert(result, 'POST code must remain searchable');
        result.click();
        await Promise.resolve();
        assert.equal(copied.length, 0, 'opening a POST code from global search must not copy it');
        const search = dom.window.document.getElementById('search-input');
        search.value = 'memory';
        search.dispatchEvent(new dom.window.Event('input', {bubbles: true}));
        await Promise.resolve();
        search.value = '';
        search.dispatchEvent(new dom.window.Event('input', {bubbles: true}));
        await Promise.resolve();
        checkReference(dom.window.document, 'post-50-55-memory-init');
      }
    } finally { dom.window.close(); }
  }

  const portable = await load('datacenter-cheatsheet-portable.html');
  try {
    portable.window.PortableNavigation.open('motherboards.html');
    await new Promise(resolve => setTimeout(resolve, 0));
    checkReference(portable.window.document, 'post-50-55-memory-init');
    checkCommand(portable.window.document, 'asus-asmb-redfish-post');
  } finally { portable.window.close(); }
  console.log('Reference cards have no Copy control; runnable commands retain it on hub, subpage, and portable views.');
})().catch(error => { console.error(error); process.exitCode = 1; });
