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

// Commands that reboot or shut down the machine you type them on. They stay on the sheets as
// documentation but cannot be copied or run from the page (decided 2026-11-09). Out-of-band
// power control through a BMC (ipmitool -H, racadm -r, ilorest --url, Redfish) is not covered.
const HOST_REBOOT = [
  /^(sudo\s+)?(reboot|poweroff|halt)\b/,
  /&&\s*(sudo\s+)?(reboot|poweroff|halt)\b/,
  /^(sudo\s+)?systemctl\s+(reboot|poweroff|halt|kexec|soft-reboot)\b/,
  /^(sudo\s+)?shutdown(\.exe)?\s/i,
  /^(sudo\s+)?(init|telinit)\s+[06]\b/,
  /^(Restart|Stop)-Computer\b/i,
  /^ilorest\s+reboot\b(?![^|;&]*--url)/   // in-band ilorest acts on this server
];

// Commands that inject an NMI to crash the host kernel on purpose (panic + kdump of a hung
// node). Out-of-band, but the user asked for "kernel panic type" commands to be reference only.
const KERNEL_PANIC = [
  /"ResetType"\s*:\s*"Nmi"/i,
  /\bchassis\s+power\s+diag\b/,
  /\btriggernmi\b/i,
  /--diagnostic-interrupt\b/,
  /\bilorest\s+reboot\s+Nmi\b/i
];

function isKernelPanic(text) {
  return String(text).split('   |   ').some(alt => KERNEL_PANIC.some(re => re.test(alt.trim())));
}

function isHostReboot(text) {
  return String(text).split('   |   ').some(alt => HOST_REBOOT.some(re => re.test(alt.trim())));
}

function isNeovimKeystrokes(text) {
  const first = text.split('   |   ')[0].trim();
  return !first.startsWith(':') || /\s{3}/.test(first);
}

// Why an entry is read-only: 'reboot' (host reboot/shutdown), 'reference' (not a command), or null.
function referenceReason(text, file) {
  if (isKernelPanic(text)) return 'nmi';
  if (isHostReboot(text)) return 'reboot';
  if (OMARCHY_FILE.test(file)) return 'reference';
  if (NEOVIM_FILE.test(file) && isNeovimKeystrokes(text)) return 'reference';
  return REFERENCE_PATTERNS.some(pattern => pattern.test(text.trim())) ? 'reference' : null;
}

function isReference(text, file) {
  return referenceReason(text, file) !== null;
}

module.exports = { isReference, referenceReason, isHostReboot, isKernelPanic };
