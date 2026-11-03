// Run with: node codex/tests/review-fixes.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const nodes = new Map();
function node(id) {
  if (!nodes.has(id)) nodes.set(id, {
    value: '', textContent: '', innerHTML: '', dataset: {},
    classList: {add(){}, remove(){}, toggle(){}},
    addEventListener(){}, querySelectorAll(){return [];}, querySelector(){return null;},
    replaceChildren(){}, setAttribute(){}, scrollIntoView(){}
  });
  return nodes.get(id);
}
const storage = new Map([['dc_target_vars', JSON.stringify({pass: 'test-only-secret', user: 'operator'})]]);
const events = {};
let copied;
const context = {
  window: {location: {pathname: '/datacenter-cheatsheet-portable.html', hash: ''},
    addEventListener(name, handler){ events[name] = handler; }, innerWidth: 1200},
  localStorage: {getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key,value)},
  navigator: {clipboard: {writeText: text => {copied = text; return Promise.resolve();}}},
  document: {addEventListener(){}, getElementById: node, querySelectorAll(){return [];},
    querySelector(){return null;}, documentElement: node('root'), body: {...node('body'), style: {}}},
  setTimeout(){}, clearTimeout(){}
};
vm.createContext(context);
vm.runInContext(read('common.js'), context);
const common = context.window.CheatSheetCommon;
assert(!('pass' in JSON.parse(storage.get('dc_target_vars'))), 'legacy password must be purged');
assert(read('common.js').includes('type="password" id="var-pass"'), 'password input must be masked');
assert(!/id="var-pass"[^>]*\bvalue=/.test(read('common.js')), 'password must not be embedded in HTML markup');
for (const cmd of ['usermod -aG docker $USER && newgrp docker', 'echo ${USER} <user> <device>', 'echo "$PASS" <password>']) {
  assert.equal(common.substituteVariables(cmd).text, cmd);
}
assert.equal(common.substituteVariables('echo "$BMC_USER"').text, 'echo "operator"');
context.navigator.clipboard.writeText('dcgmi diag -r 1   |   dcgmi diag -r 2   |   dcgmi diag -r 3');
assert.equal(copied, 'dcgmi diag -r 1');
assert.equal(common.commandForCopy('dmesg | tail -n 20'), 'dmesg | tail -n 20');
assert.equal(common.commandForCopy('echo ok || echo fail'), 'echo ok || echo fail');
vm.runInContext(read('global-search-index.js'), context);
const index = context.window.GLOBAL_SEARCH_INDEX;
for (const item of index) assert(fs.existsSync(path.join(root,item.file)), item.file);
assert(index.some(item => item.sName === 'app' && item.file === 'index.html'));
const html = read('datacenter-cheatsheet-portable.html');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
for (const script of scripts) new vm.Script(script);
vm.runInContext(scripts[1], context);
const sheets = context.window.PORTABLE_SHEETS;
for (const item of index) {
  const sheet = sheets.find(s => s.file === item.file);
  assert(sheet, 'missing embedded sheet '+item.file);
  assert(context.window.PORTABLE_DATASETS[sheet.key].some(s => s.commands.some(c => c.id === item.id)), 'missing embedded card '+item.id);
}
// Execute the portable runtime with a minimal DOM to check actual route behavior.
const portableRuntime = scripts.find(script => script.includes('window.PortableNavigation ='));
assert(portableRuntime, 'portable router script missing');
vm.runInContext(portableRuntime, context);
common.navigateToResult('nv-dcgm.html', 'dcgmi-diag-levels');
assert.equal(context.window.location.href, undefined, 'portable navigation must not leave file');
assert.equal(context.window.location.hash, 'sheet-nv-dcgm/dcgmi-diag-levels');
context.window.location.hash = '#'+context.window.location.hash; // Browser normalizes hash assignments.
events.hashchange();
assert(node('sections-container').innerHTML.includes('id="dcgmi-diag-levels"'));
assert(node('sections-container').innerHTML.includes('data-copy="dcgmi diag -r 1"'));
for (const file of fs.readdirSync(root).filter(f => f.endsWith('.js'))) new vm.Script(read(file), {filename:file});
console.log(`Passed: credential migration, variable isolation, clipboard safety, ${index.length} search targets, ${sheets.length} embedded sheets, portable routing, and JavaScript syntax.`);
