// Requires jsdom: node codex/tests/compact.test.js
const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),cache=new Map();
const read=f=>{if(!cache.has(f))cache.set(f,fs.readFileSync(path.join(root,f),'utf8'));return cache.get(f);};
async function check(file,saved){
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(read(file),{url:'https://cheatsheet.test/'+file,runScripts:'outside-only',virtualConsole:vc});
 try{
  const w=dom.window;w.localStorage.setItem('linux_cs_compact',saved?'1':'0');
  w.HTMLElement.prototype.scrollIntoView=function(){};
  const loaded=new Promise(r=>w.addEventListener('load',r,{once:true}));
  for(const script of w.document.querySelectorAll('script'))w.eval(script.src?read(script.getAttribute('src')):script.textContent);
  await loaded;
  const button=w.document.getElementById('density-toggle');assert(button,file+': button missing');
  function verify(compact){
   assert.equal(w.document.body.classList.contains('compact-mode'),compact,file+': density CSS class');
   assert.equal(w.localStorage.getItem('linux_cs_compact'),compact?'1':'0',file+': preference');
   const details=w.document.querySelector('.cmd-details, .flag-pills, .subcmd-list, .cmd-note, .flags-list, .cmd-tip');
   if(details)assert.equal(w.getComputedStyle(details).display==='none',compact,file+': detail visibility');
   assert(w.document.querySelector('.cmd-code, .code-block'),file+': commands disappeared');
  }
  // Load the actual shared CSS to verify the visual behavior, not just JS state.
  if(file!=='datacenter-cheatsheet-portable.html'){
   const style=w.document.createElement('style');style.textContent=read('styles.css');w.document.head.append(style);
  }
  verify(saved);button.click();verify(!saved);button.click();verify(saved);
  if(file==='datacenter-cheatsheet-portable.html'){
   button.click();w.PortableNavigation.open('jira.html');await new Promise(r=>setTimeout(r,60));verify(!saved);
  }
  assert.equal(errors.length,0,file+': '+errors.join('; '));
 }finally{dom.window.close();}
}
(async()=>{let n=0;for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){await check(file,false);await check(file,true);n++;}console.log('Compact: toggling, saved-mode startup, detail visibility, and command visibility passed for '+n+' pages in both modes, including portable navigation.');})().catch(e=>{console.error(e);process.exitCode=1;});
