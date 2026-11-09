// build-man-data.js
// Writes man-pages-data.js, which the Manuals reader loads the first time it opens.
// It joins the Ubuntu 24.04 capture from build-man-pages.js with open-source pages for
// tools that capture lacks, and adds the categories used by the reader's filter.
const fs = require('fs');
const path = require('path');

const read = file => JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));

const CATEGORIES = [
  ['NVMe', /^nvme/],
  ['InfiniBand & RDMA', /^(ib|rdma|mst|perfquery|sminfo|smp|saquery|opensm|dump_fts|check_lft|vendstat|infiniband)/],
  ['Storage & ZFS', /^(zfs|zpool|zdb|zed|lv|pv|vg|mdadm|multipath|ledctl|lsscsi|sg_|sg$|blk|fdisk|sfdisk|losetup|wipefs|mkfs|mount|umount|findmnt|lsblk|ceph|fio|iostat|parted|smartctl)/],
  ['Networking', /^(ip|ip-[a-z_0-9]+|ss|bridge|ethtool|tc|dig|curl|nc|nmap|mtr|tracepath|iperf3|ndisc6|arp-scan|lldp\w*|netplan|nmcli|networkctl|ssh\w*|scp|sftp|rsync|tcpdump|hostname)$/],
  ['Hardware & Kernel', /^(dmidecode|lspci|lscpu|lshw|lstopo|lsmod|modinfo|modprobe|ipmitool|edac-util|numa\w*|efibootmgr|mokutil|cpupower|dkms|kdump-config|dmesg|turbostat|taskset)/],
  ['Packages', /^(apt|dpkg|debsums|needrestart|cloud-init)/]
];

function categoryFor(name) {
  const match = CATEGORIES.find(([, pattern]) => pattern.test(name));
  return match ? match[0] : 'Linux & Shell';
}

const ubuntu = read('man-pages-data.json');
const extra = read('man-pages-extra.json');
const pages = {};
for (const [name, page] of Object.entries(ubuntu.pages)) {
  pages[name] = { ...page, source: `${ubuntu.source} package`, category: categoryFor(name) };
}
for (const [name, page] of Object.entries(extra.pages)) {
  if (!pages[name]) pages[name] = { ...page, category: categoryFor(name) };
}
const missing = Object.fromEntries(Object.entries(ubuntu.missing).filter(([name]) => !pages[name]));

// --help output for tools with no man page (build-help-pages.js), for "Explain a command".
// Keyed "tool" or "tool subcommand"; not listed in the Manuals reader.
const helpFile = path.join(__dirname, 'help-pages.json');
const helps = fs.existsSync(helpFile) ? read('help-pages.json').pages : {};

const data = { source: ubuntu.source, captured: ubuntu.captured, pages, missing, helps };
fs.writeFileSync(path.join(__dirname, 'man-pages-data.js'), `window.MAN_PAGES_DATA = ${JSON.stringify(data)};\n`, 'utf8');
console.log(`Wrote man-pages-data.js with ${Object.keys(pages).length} manuals and ${Object.keys(helps).length} --help pages.`);
