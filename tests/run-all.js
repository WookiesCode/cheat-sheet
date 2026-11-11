// Run every tests/*.test.js and *.test.py against a private copy of the site server.
// Usage: node tests/run-all.js [name-filter]     e.g. node tests/run-all.js search
// Exits non-zero if any test fails. perf.js and xss-peek.js are run by hand (see tests/README.md).
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// Its own port, so it never collides with a preview server on 8765.
const PORT = Number(process.env.TEST_PORT || 8799);
const BASE = `http://127.0.0.1:${PORT}/`;
const filter = process.argv[2] || '';

const tests = fs.readdirSync(__dirname)
  .filter(f => /\.test\.(js|py)$/.test(f) && f.includes(filter))
  .sort();
if (!tests.length) {
  console.error(`No tests match "${filter}".`);
  process.exit(2);
}
fs.mkdirSync(path.join(__dirname, 'output'), { recursive: true });

// Resolves once the server answers, so the first test never races its start-up.
function waitForServer(deadline) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http.get(BASE + 'index.html', res => { res.resume(); resolve(); })
        .on('error', () => (Date.now() > deadline ? reject(new Error(`server on ${PORT} did not start`)) : setTimeout(attempt, 150)));
    };
    attempt();
  });
}

(async () => {
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  // Stop the server however the run ends, including Ctrl+C.
  const stop = () => { if (server.exitCode === null) server.kill(); };
  process.on('exit', stop);
  process.on('SIGINT', () => process.exit(130));

  try {
    await waitForServer(Date.now() + 10000);
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }

  // Every test drives the same browser: picked once here (see lib.js) and handed down.
  const { BROWSER } = require('./lib');
  process.env.CHROME_PATH = BROWSER.path;
  console.log(`Browser: ${BROWSER.path} (${BROWSER.why})`);

  const results = [];
  for (const t of tests) {
    const runner = t.endsWith('.py') ? 'python3' : process.execPath;
    console.log(`\n── ${t}`);
    const started = Date.now();
    // spawnSync keeps each test's output together and in order.
    const r = spawnSync(runner, [path.join(__dirname, t)], {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, TEST_BASE: BASE },
      timeout: 10 * 60 * 1000
    });
    const ok = r.status === 0;
    results.push({ t, ok, secs: ((Date.now() - started) / 1000).toFixed(1), why: r.error ? r.error.message : `exit ${r.status}` });
  }

  console.log('\n── Summary');
  for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.t.padEnd(26)} ${r.secs}s${r.ok ? '' : '  (' + r.why + ')'}`);
  const failed = results.filter(r => !r.ok).length;
  console.log(`${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
