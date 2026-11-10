// build-redirect-stub.js
// A merged sheet's old page becomes a tiny redirect to its group page, so bookmarks,
// notes and links to grep.html keep working. The marker meta lets builds and tests
// skip these files (they have no nav, scripts or cards of their own).
const MARKER = 'cs-redirect';

const escapeAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// target: "cli-tools.html#grep". An old link's own #card wins over the tool name, so
// grep.html#grep-pcre-extract lands on that card.
function stub(target, label, group) {
  const [page, part] = target.split('#');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="${MARKER}" content="${escapeAttr(target)}">
  <title>${escapeAttr(label)} → ${escapeAttr(group)}</title>
  <meta http-equiv="refresh" content="0; url=${escapeAttr(target)}">
  <script>location.replace(${JSON.stringify(page + '#')} + (location.hash.slice(1) || ${JSON.stringify(part || '')}));</script>
  <style>body { background: #0b1120; color: #cbd5e1; font: 15px system-ui, sans-serif; padding: 2rem 16px; } a { color: #38bdf8; }</style>
</head>
<body>
  <p>${escapeAttr(label)} is now part of <a href="${escapeAttr(target)}">${escapeAttr(group)}</a>.</p>
</body>
</html>
`;
}

const isStub = html => new RegExp(`<meta name="${MARKER}"`).test(html);
// A page file that is a redirect (missing files are not).
const isStubFile = file => { try { return isStub(require('fs').readFileSync(file, 'utf8')); } catch (e) { return false; } };

module.exports = { stub, isStub, isStubFile, MARKER };
