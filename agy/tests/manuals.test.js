// Requires jsdom. Run: node codex/tests/manuals.test.js
const {JSDOM, VirtualConsole} = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
async function check(file) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', error => errors.push(error.message));
  const portable = file === 'datacenter-cheatsheet-portable.html';
  const html = read(file);
  // Run scripts explicitly. No resource loader is enabled, so tests cannot fetch fonts or manuals.
  const dom = new JSDOM(html, {url:'https://manuals.test/'+file,runScripts:'outside-only',virtualConsole:vc});
  try {
    const w=dom.window,d=w.document;
    const loaded = new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
    for(const script of d.querySelectorAll('script')) {
      const src=script.getAttribute('src');
      w.eval(src ? read(src) : script.textContent);
    }
    await loaded;
    assert.deepEqual(errors,[]);
    const data=w.OFFLINE_MANUALS;
    assert.equal(data.manuals.length,500);
    assert.equal(new Set(data.manuals.map(m=>m.id)).size,500);
    for(const name of ['bash','ssh','curl','ipmitool','nvidia-smi','ibstat','ibv_devinfo','perfquery','nvme','nvme-smart-log','smartctl','sg_ses','ethtool','mstlink'])assert(data.manuals.some(m=>m.name===name),name+' missing');
    for(const manual of data.manuals) {
      assert(manual.text.length>80,manual.id);
      assert(manual.originalSource.length>80,manual.id);
      assert(manual.source && manual.version && manual.sha256.length===64,manual.id);
      assert(!manual.text.includes('\b'),'unstripped formatting in '+manual.id);
      for(const notice of manual.notices)assert(data.notices[notice],notice);
    }
    const button=d.getElementById('offline-manuals-btn');assert(button,file+': Manuals button missing');button.focus();button.click();
    const modal=d.getElementById('offline-manuals-modal');assert(!modal.hidden);
    w.OfflineManuals.open('ipmitool');assert.equal(d.getElementById('manual-title').textContent,'ipmitool(1)');
    assert.match(d.getElementById('manual-content').textContent,/SYNOPSIS/);
    assert(d.querySelector('#manual-notices details pre').textContent.includes('ipmitool'));
    w.OfflineManuals.open('mlxlink');assert.equal(d.getElementById('manual-title').textContent,'mstlink(1)');
    assert.match(d.getElementById('manual-metadata').textContent,/options may differ/);
    w.OfflineManuals.open('definitely-not-a-bundled-manual');assert.equal(d.querySelectorAll('.manual-list-item').length,0);
    const fullText=d.getElementById('manual-fulltext');fullText.checked=true;fullText.dispatchEvent(new w.Event('change'));
    w.OfflineManuals.open('SYNOPSIS');assert(d.querySelectorAll('.manual-list-item').length>10);
    w.OfflineManuals.open('');const cat=d.getElementById('manual-category');cat.value='NVMe';cat.dispatchEvent(new w.Event('change'));
    for(const item of d.querySelectorAll('.manual-list-item'))assert(data.manuals.find(m=>m.id===item.dataset.manualId).category==='NVMe');
    assert(d.querySelector('.manual-coverage').textContent.includes('not included'));
    d.getElementById('manual-search').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert(modal.hidden);assert.equal(d.activeElement,button);
    assert.deepEqual(errors,[]);
    if(portable) {
      assert.equal(d.querySelectorAll('script[src], link[href], img[src], iframe').length,0,'portable assets must all be inline');
      assert(![...d.querySelectorAll('style')].some(s=>/@import|url\(/.test(s.textContent)));
    }
  } finally {dom.window.close();}
}
(async()=>{
  for(const f of ['index.html','rf-discovery.html','datacenter-cheatsheet-portable.html'])await check(f);
  for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.html')&&!f.startsWith('datacenter-'))){const s=read(f);assert(s.includes('src="manuals-data.js"'),f);assert(s.includes('src="manuals-ui.js"'),f);}
  const ctx={window:{}};vm.runInNewContext(read('manuals-data.js'),ctx);
  console.log('Passed: 500 manuals, source/notice integrity, command and full-text search, categories, aliases, keyboard closing, standalone integration, and portable operation with external requests blocked.');
})().catch(e=>{console.error(e);process.exitCode=1;});
