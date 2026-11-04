// build-reference-rules.js
// Decides which sheet entries are information rather than commands you would run.
// build-index.js marks those entries noCopy in the search index, and common.js turns
// off copying for them on every page. Add a pattern here to make an entry read-only.

// Sheets made of keystrokes. On Neovim, only a single ":" command is something you run.
const OMARCHY_FILE = /^omarchy\.js$/;
const NEOVIM_FILE = /^(neovim|nvim-[a-z-]+)\.js$/;

const REFERENCE_PATTERNS = [
  // Motherboards: POST codes, boot stages, LEDs, jumpers, BIOS settings
  /^POST 0x/, /^Stage \d:/, /^1-DIMM /, /^BMC_(LED1|RDY)/, /^Above 4G Decoding/,
  // Fiber: form factors, polarity, cleaning steps, distance and test tables
  /^Switch Port:/, /^800G Twin-Port/, /^0\.5–2\.5m:/, /^\[Transceiver:/, /^Direct Optic-to-Optic/,
  /^MPO-12 \(4-lane\)/, /^LC Duplex/, /^1\. Inspect/, /^10km LR4/, /^Check DOM RX/, /^Tier 1 /,
  // Ethernet wire colors
  /^T568B /,
  // macOS and Windows keyboard shortcuts, gestures, and Settings paths
  /^[⌘⌥⌃⇧🌐]/u, /^Win\+/, /^Alt\+D /, /^Space \(Quick Look\)/,
  /^3\/4-Finger /, /^Force Click/, /^Hold ⇧/, /^System Settings /
];

function isNeovimKeystrokes(text) {
  const first = text.split('   |   ')[0].trim();
  return !first.startsWith(':') || /\s{3}/.test(first);
}

function isReference(text, file) {
  if (OMARCHY_FILE.test(file)) return true;
  if (NEOVIM_FILE.test(file) && isNeovimKeystrokes(text)) return true;
  return REFERENCE_PATTERNS.some(pattern => pattern.test(text.trim()));
}

module.exports = { isReference };
