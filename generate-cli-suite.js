// generate-cli-suite.js
// Keeps the CLI Tools menu in step with cli-tools.js. Every tool lives on cli-tools.html
// (the hash picks one: cli-tools.html#grep); the old per-tool pages are redirects there.
const fs = require('fs');
const path = require('path');

// 1. Read cli-tools.js to extract CLI_TOOLS_DATA and CLI_COMPOSER_RECIPES
const cliToolsJs = fs.readFileSync(path.join(__dirname, 'cli-tools.js'), 'utf8');
const sandbox = { localStorage: { getItem: () => null } };
const dataEndIdx = cliToolsJs.indexOf('const searchInput =');
require('vm').runInNewContext(cliToolsJs.slice(0, dataEndIdx) + '\nsandboxData = CLI_TOOLS_DATA; sandboxPipes = CLI_COMPOSER_RECIPES;', sandbox);

const CLI_TOOLS_DATA = sandbox.sandboxData;
const CLI_COMPOSER_RECIPES = sandbox.sandboxPipes || {};

console.log(`Loaded ${CLI_TOOLS_DATA.length} CLI tools from cli-tools.js`);

const CLI_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="cli-nav-dropdown">
                <a href="cli-tools.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2" y="3" width="20" height="18" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 9l3.5 3-3.5 3" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 15h5" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg>
                  <span>CLI Tools</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu cli-dropdown-menu" role="menu">
                  <a href="cli-tools.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 All CLI Tools Hub</a>
                  <div class="dropdown-divider"></div>
                  <div class="cli-dropdown-grid">
                    <div class="cli-dropdown-col">
                      <div class="cli-dropdown-heading">Text &amp; Search</div>
                      <a href="grep.html" class="dropdown-item" role="menuitem"><code>grep</code> <span class="cmd-desc">Pattern search</span></a>
                      <a href="awk.html" class="dropdown-item" role="menuitem"><code>awk</code> <span class="cmd-desc">Columns &amp; math</span></a>
                      <a href="sed.html" class="dropdown-item" role="menuitem"><code>sed</code> <span class="cmd-desc">Stream editing</span></a>
                      <a href="cut.html" class="dropdown-item" role="menuitem"><code>cut</code> <span class="cmd-desc">Delimited slicing</span></a>
                      <a href="tr.html" class="dropdown-item" role="menuitem"><code>tr</code> <span class="cmd-desc">Translate chars</span></a>
                      <a href="sort.html" class="dropdown-item" role="menuitem"><code>sort</code> <span class="cmd-desc">Multi-key sort</span></a>
                      <a href="uniq.html" class="dropdown-item" role="menuitem"><code>uniq</code> <span class="cmd-desc">Deduplicate</span></a>
                      <a href="comm.html" class="dropdown-item" role="menuitem"><code>comm</code> <span class="cmd-desc">Compare lists</span></a>
                      <a href="column.html" class="dropdown-item" role="menuitem"><code>column</code> <span class="cmd-desc">Table align</span></a>
                      <a href="strings.html" class="dropdown-item" role="menuitem"><code>strings</code> <span class="cmd-desc">Binary strings</span></a>
                      <a href="xxd.html" class="dropdown-item" role="menuitem"><code>xxd</code> <span class="cmd-desc">Hex dump</span></a>
                    </div>
                    <div class="cli-dropdown-col">
                      <div class="cli-dropdown-heading">Files &amp; Storage</div>
                      <a href="find.html" class="dropdown-item" role="menuitem"><code>find</code> <span class="cmd-desc">Tree search</span></a>
                      <a href="ls.html" class="dropdown-item" role="menuitem"><code>ls</code> <span class="cmd-desc">File listings</span></a>
                      <a href="stat.html" class="dropdown-item" role="menuitem"><code>stat</code> <span class="cmd-desc">Inode metadata</span></a>
                      <a href="namei.html" class="dropdown-item" role="menuitem"><code>namei</code> <span class="cmd-desc">Path resolver</span></a>
                      <a href="file.html" class="dropdown-item" role="menuitem"><code>file</code> <span class="cmd-desc">Magic headers</span></a>
                      <a href="lsof.html" class="dropdown-item" role="menuitem"><code>lsof</code> <span class="cmd-desc">Open files &amp; ports</span></a>
                      <a href="fuser.html" class="dropdown-item" role="menuitem"><code>fuser</code> <span class="cmd-desc">Process mounts</span></a>
                      <a href="dd.html" class="dropdown-item" role="menuitem"><code>dd</code> <span class="cmd-desc">Direct I/O</span></a>
                      <a href="tar.html" class="dropdown-item" role="menuitem"><code>tar</code> <span class="cmd-desc">Sparse archives</span></a>
                      <a href="zstd.html" class="dropdown-item" role="menuitem"><code>zstd</code> <span class="cmd-desc">Compression</span></a>
                    </div>
                    <div class="cli-dropdown-col">
                      <div class="cli-dropdown-heading">Process &amp; System</div>
                      <a href="ps.html" class="dropdown-item" role="menuitem"><code>ps</code> <span class="cmd-desc">Process table</span></a>
                      <a href="watch.html" class="dropdown-item" role="menuitem"><code>watch</code> <span class="cmd-desc">Diff loop</span></a>
                      <a href="tee.html" class="dropdown-item" role="menuitem"><code>tee</code> <span class="cmd-desc">Pipe splitter</span></a>
                      <a href="strace.html" class="dropdown-item" role="menuitem"><code>strace</code> <span class="cmd-desc">Syscall trace</span></a>
                      <a href="xargs.html" class="dropdown-item" role="menuitem"><code>xargs</code> <span class="cmd-desc">Batch exec</span></a>
                      <a href="sudo.html" class="dropdown-item" role="menuitem"><code>sudo</code> <span class="cmd-desc">Root &amp; why sudo</span></a>
                      <a href="sysctl.html" class="dropdown-item" role="menuitem"><code>sysctl</code> <span class="cmd-desc">Kernel params</span></a>
                      <a href="dmesg.html" class="dropdown-item" role="menuitem"><code>dmesg</code> <span class="cmd-desc">Kernel buffer</span></a>
                      <a href="tmux.html" class="dropdown-item" role="menuitem"><code>tmux</code> <span class="cmd-desc">Multiplexer</span></a>
                      <a href="tio.html" class="dropdown-item" role="menuitem"><code>tio</code> <span class="cmd-desc">Serial console</span></a>
                      <a href="base64.html" class="dropdown-item" role="menuitem"><code>base64</code> <span class="cmd-desc">SOL console copy</span></a>
                    </div>
                    <div class="cli-dropdown-col">
                      <div class="cli-dropdown-heading">Network &amp; Hardware</div>
                      <a href="curl.html" class="dropdown-item" role="menuitem"><code>curl</code> <span class="cmd-desc">HTTP/REST</span></a>
                      <a href="rsync.html" class="dropdown-item" role="menuitem"><code>rsync</code> <span class="cmd-desc">Delta mirror</span></a>
                      <a href="scp.html" class="dropdown-item" role="menuitem"><code>scp</code> <span class="cmd-desc">SSH copy</span></a>
                      <a href="sftp.html" class="dropdown-item" role="menuitem"><code>sftp</code> <span class="cmd-desc">Secure FTP</span></a>
                      <a href="ip.html" class="dropdown-item" role="menuitem"><code>ip</code> <span class="cmd-desc">IPv6 &amp; routes</span></a>
                      <a href="ss.html" class="dropdown-item" role="menuitem"><code>ss</code> <span class="cmd-desc">Socket stats</span></a>
                      <a href="tcpdump.html" class="dropdown-item" role="menuitem"><code>tcpdump</code> <span class="cmd-desc">Packet sniff</span></a>
                      <a href="nmap.html" class="dropdown-item" role="menuitem"><code>nmap</code> <span class="cmd-desc">Port scan</span></a>
                      <a href="arp-scan.html" class="dropdown-item" role="menuitem"><code>ndisc6</code> <span class="cmd-desc">Neighbor NDP</span></a>
                      <a href="openssl.html" class="dropdown-item" role="menuitem"><code>openssl</code> <span class="cmd-desc">TLS certs</span></a>
                      <a href="http-server.html" class="dropdown-item" role="menuitem"><code>http.server</code> <span class="cmd-desc">Staging web</span></a>
                      <a href="jq.html" class="dropdown-item" role="menuitem"><code>jq</code> <span class="cmd-desc">JSON parser</span></a>
                      <a href="efibootmgr.html" class="dropdown-item" role="menuitem"><code>efibootmgr</code> <span class="cmd-desc">UEFI boot</span></a>
                      <a href="udevadm.html" class="dropdown-item" role="menuitem"><code>udevadm</code> <span class="cmd-desc">Device events</span></a>
                      <a href="cloud-init.html" class="dropdown-item" role="menuitem"><code>cloud-init</code> <span class="cmd-desc">Init triage</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// Menu items open the tool on the group page: grep.html → cli-tools.html#grep.
const CLI_MENU = CLI_NAVBAR_SNIPPET.replace(/href="([a-z0-9-]+)\.html"/g, (m, page) => page === 'cli-tools' ? m : `href="cli-tools.html#${page}"`);

// Update navbar in all existing HTML files
const htmlFiles = require('./nav/targets').navFiles();   // the one nav copy, not every page
const cliLinkPattern = /<a href="cli-tools\.html" class="sheet-link(?: active)?"><svg class="nav-logo"[\s\S]*?<\/svg>\s*CLI Tools<\/a>/;

// An existing dropdown is replaced too, so changes to the menu above reach every page.
// Its end is found by counting <div> depth (the menu nests divs, so a regex can't).
const cliMenuStart = '<div class="nav-dropdown" id="cli-nav-dropdown">';
function replaceCliMenu(content) {
  const start = content.indexOf(cliMenuStart);
  if (start < 0) return content;
  const rx = /<div\b|<\/div>/g;
  rx.lastIndex = start;
  let depth = 0, m;
  while ((m = rx.exec(content))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return content.slice(0, start) + CLI_MENU.trimStart() + content.slice(m.index + 6);
  }
  return content;
}

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const before = content;
  if (cliLinkPattern.test(content)) content = content.replace(cliLinkPattern, CLI_MENU);
  else content = replaceCliMenu(content);
  if (content !== before) {
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with CLI Tools dropdown in ${updatedNavCount} existing HTML files`);

// The old per-tool pages: a redirect each, so bookmarks and links to grep.html still land.
const { stub } = require('./build-redirect-stub');
let stubCount = 0;
for (const tool of CLI_TOOLS_DATA) {
  const name = tool.title.split('—')[0].trim();
  fs.writeFileSync(path.join(__dirname, `${tool.id}.html`), stub(`cli-tools.html#${tool.id}`, name, 'CLI Tools'), 'utf8');
  stubCount++;
}
console.log(`Wrote ${stubCount} redirects (tool.html → cli-tools.html#tool)`);
