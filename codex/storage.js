// storage.js
// Standalone interactive cheat sheet for Filesystems, Partitions, LVM & Mounts
const STORAGE_DATA = [
  {
    "id": "storage-card-1",
    "badge": "dsk",
    "title": "Filesystems: Mounted filesystem capacity, inode exhaustion, a...",
    "subtitle": "Check mounted filesystem capacity, inode exhaustion, and top largest directories",
    "commands": [
      {
        "id": "df-du-space",
        "desc": "Check mounted filesystem capacity, inode exhaustion, and top largest directories",
        "cmd": "df -hT -x tmpfs -x devtmpfs -x squashfs && df -i /",
        "details": "A Linux filesystem can report 'No space left on device' in two ways: running out of data blocks ('df -hT') or running out of inodes ('df -i') due to millions of tiny files in /var/spool or /tmp.",
        "flags": [
          [
            "-hT",
            "Human-readable sizes and print filesystem type (ext4, xfs, btrfs, zfs, nfs4)"
          ],
          [
            "-x squashfs",
            "Exclude Ubuntu Snap loop mounts (squashfs) and pseudo-filesystems"
          ],
          [
            "-i",
            "Show inode usage (Inodes, IUsed, IFree, IUse%) instead of disk blocks"
          ]
        ],
        "subcommands": [
          [
            "du -xh --max-depth=1 /var 2>/dev/null | sort -hr | head -n 15",
            "List the 15 largest subdirectories inside /var on the same filesystem (-x)"
          ],
          [
            "df -hlT -x squashfs -x tmpfs",
            "Show only local filesystems (-l), avoiding hangs when a remote NFS server is unreachable"
          ],
          [
            "df -h --output=source,fstype,size,used,avail,pcent,ipcent,target -x tmpfs -x squashfs",
            "Show both Block Use% (pcent) and Inode Use% (ipcent) side-by-side in a single table"
          ],
          [
            "ncdu -x /",
            "Launch interactive terminal disk usage analyzer on root '/' (staying on one filesystem)"
          ]
        ],
        "tip": "Always check both blocks (df -h) & inodes (df -i)",
        "tags": [
          "space",
          "free",
          "partition",
          "mount",
          "inodes",
          "du",
          "ncdu"
        ]
      }
    ]
  },
  {
    "id": "storage-card-2",
    "badge": "dsk",
    "title": "Filesystems: Block devices, partitions, LVM volumes, filesyst...",
    "subtitle": "Inspect block devices, partitions, LVM volumes, filesystem UUIDs & verify /etc/fstab before reboot",
    "commands": [
      {
        "id": "lsblk-blkid-fstab",
        "desc": "Inspect block devices, partitions, LVM volumes, filesystem UUIDs & verify /etc/fstab before reboot",
        "cmd": "lsblk -f -o NAME,SIZE,TYPE,FSTYPE,LABEL,UUID,MOUNTPOINTS && findmnt --verify --verbose",
        "details": "Before rebooting an Ubuntu server after editing '/etc/fstab', always run 'findmnt --verify' and 'mount -a'. A typo or missing UUID in /etc/fstab without 'nofail' will drop the server into emergency single-user mode on boot.",
        "flags": [
          [
            "lsblk -f -o ...",
            "Tree view of physical disks, partitions, LVM/RAID, filesystem types, and UUIDs"
          ],
          [
            "findmnt --verify",
            "Parse /etc/fstab and validate that all UUIDs, mountpoints, and options are valid"
          ]
        ],
        "subcommands": [
          [
            "blkid",
            "Print block device attributes (UUID, PARTUUID, TYPE) formatted for /etc/fstab"
          ],
          [
            "lsblk -d -o NAME,SIZE,TRAN,ROTA,MODEL,SERIAL,WWN",
            "List only physical disks (-d) with transport type, rotational flag (1=HDD, 0=SSD), model, and serial"
          ],
          [
            "mount -o remount,rw /",
            "Remount the root filesystem read-write if the system booted into read-only recovery mode"
          ]
        ],
        "tip": "Run 'findmnt --verify' before every reboot!",
        "tags": [
          "lsblk",
          "blkid",
          "uuid",
          "fstab",
          "findmnt",
          "mount"
        ]
      }
    ]
  },
  {
    "id": "storage-card-3",
    "badge": "dsk",
    "title": "Filesystems: Ubuntu LVM Physical Volumes (PV), Volume Groups ...",
    "subtitle": "Inspect Ubuntu LVM Physical Volumes (PV), Volume Groups (VG), and grow a Logical Volume (LV) online",
    "commands": [
      {
        "id": "lvm-resize-extend",
        "desc": "Inspect Ubuntu LVM Physical Volumes (PV), Volume Groups (VG), and grow a Logical Volume (LV) online",
        "cmd": "pvs && vgs && lvs",
        "details": "Ubuntu Server defaults to installing on LVM (e.g., /dev/mapper/ubuntu--vg-ubuntu--lv) leaving unallocated space in the Volume Group or expanding dynamically. Adding '-r' (--resizefs) to 'lvextend' grows both the LVM volume and the underlying ext4/xfs filesystem online in one step.",
        "flags": [
          [
            "pvs / vgs / lvs",
            "Concise summary of Physical Volumes, Volume Groups, and Logical Volumes"
          ],
          [
            "lvextend -r",
            "Extend the Logical Volume AND automatically resize the ext4/xfs filesystem online"
          ]
        ],
        "subcommands": [
          [
            "lvextend -r -l +100%FREE /dev/ubuntu-vg/ubuntu-lv",
            "Expand the default Ubuntu root logical volume to use 100% of remaining free space in the VG and resize ext4/xfs live"
          ],
          [
            "lvextend -r -L +50G /dev/ubuntu-vg/ubuntu-lv",
            "Add 50 GiB to the logical volume and grow the filesystem online without unmounting"
          ]
        ],
        "tip": "lvextend -r resizes LV + filesystem together",
        "tags": [
          "lvm",
          "lvextend",
          "vgs",
          "lvs",
          "pvs",
          "resize2fs",
          "xfs_growfs",
          "ubuntu-vg"
        ]
      }
    ]
  },
  {
    "id": "storage-card-4",
    "badge": "dsk",
    "title": "Filesystems: Disks >2TB with GPT (parted), check filesystems,...",
    "subtitle": "Partition disks >2TB with GPT (parted), check filesystems, or write raw disk images with dd",
    "commands": [
      {
        "id": "dd-parted-fsck",
        "desc": "Partition disks >2TB with GPT (parted), check filesystems, or write raw disk images with dd",
        "cmd": "parted -l && dd if=ubuntu-server.iso of=/dev/sdX bs=4M status=progress oflag=sync",
        "details": "Uses 'parted' to inspect or create GUID Partition Tables (GPT, required for disks > 2 TiB). When using 'dd', always include 'oflag=sync' so the command does not return until dirty kernel page cache buffers are physically flushed to the target device.",
        "flags": [
          [
            "bs=4M",
            "Read and write 4 MiB blocks at a time for high throughput"
          ],
          [
            "status=progress",
            "Display live transfer rate and bytes written"
          ],
          [
            "oflag=sync",
            "Synchronize data and metadata to physical storage before exiting"
          ]
        ],
        "subcommands": [
          [
            "parted -s /dev/nvme1n1 mklabel gpt mkpart primary ext4 1MiB 100% && mkfs.ext4 -L data /dev/nvme1n1p1",
            "Create a 1MiB-aligned GPT partition across an entire new NVMe drive and format it as ext4"
          ],
          [
            "tune2fs -l /dev/sda1 | grep -E 'Filesystem state|Mount count|Last checked|Reserved block'",
            "Inspect ext4 superblock health state and reserved root block count"
          ]
        ],
        "danger": "dd/mklabel destroys all data on target disk",
        "tags": [
          "dd",
          "parted",
          "gpt",
          "mkfs",
          "ext4",
          "iso",
          "usb"
        ]
      }
    ]
  }
];

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("storage_bookmarks") || "[]"))
};

// DOM References
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

let toastTimer = null;

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  if (!toastEl) return;
  toastTextEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied command to clipboard");
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast("Copied command to clipboard");
}

function highlightCommand(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return `<span class="tok-str">${strLiteral}</span>`;
      if (flagPart) return `<span class="tok-flag">${flagPart}</span>`;
      if (operatorPart) return `<span class="tok-pipe">${operatorPart}</span>`;
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? `<span class="tok-pipe">${sudoPart}</span>` : "";
        return `${prefix}${sudoHtml}<span class="tok-cmd">${cmdName}</span>`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = STORAGE_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of STORAGE_DATA) {
    const isSelected = state.activeCategory === section.id ? "selected" : "";
    optionsHtml.push(
      `<option value="${section.id}" ${isSelected}>${escapeHtml(section.title)} (${section.commands.length})</option>`
    );
  }

  const resetBtnHtml =
    state.activeCategory !== "all"
      ? `<button type="button" class="cat-reset-btn" data-cat="all" title="Show all sections">✕ Show All</button>`
      : "";

  categoryTabsEl.innerHTML = `
    <div class="cat-select-wrapper">
      <select id="cat-select" class="cat-select" aria-label="Filter by section">
        ${optionsHtml.join("")}
      </select>
      <span class="cat-select-arrow" aria-hidden="true">▾</span>
    </div>
    ${resetBtnHtml}
  `;

  const sel = document.getElementById("cat-select");
  if (sel) {
    sel.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderSections();
      renderCategoryTabs();
    });
  }

  const resetBtn = categoryTabsEl.querySelector(".cat-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCategory = "all";
      renderSections();
      renderCategoryTabs();
    });
  }
}

function matchesSearch(cmdObj, terms) {
  if (terms.length === 0) return true;
  const haystack = [
    cmdObj.desc || "",
    cmdObj.cmd || "",
    cmdObj.details || "",
    cmdObj.tip || "",
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat(),
    ...(cmdObj.subcommands || []).flat()
  ].join(" ").toLowerCase();

  return terms.every((t) => haystack.includes(t));
}

let allRenderedCards = [];
function packMasonry() {
  if (!sectionsContainer) return;
  if (sectionsContainer.querySelectorAll(".section-card").length === 0) {
    allRenderedCards = [];
    return;
  }
  const directCards = [...sectionsContainer.querySelectorAll(":scope > .section-card")];
  if (directCards.length > 0) {
    allRenderedCards = directCards;
  }
  if (allRenderedCards.length === 0) return;

  const containerWidth = sectionsContainer.clientWidth || window.innerWidth;
  const colCount = Math.max(1, Math.min(allRenderedCards.length, Math.floor((containerWidth + 18) / (380 + 18))));
  if (colCount <= 1) {
    sectionsContainer.classList.remove("has-masonry");
    sectionsContainer.replaceChildren(...allRenderedCards);
    return;
  }

  sectionsContainer.classList.add("has-masonry");

  const cols = Array.from({ length: colCount }, () => {
    const col = document.createElement("div");
    col.className = "masonry-col";
    return col;
  });
  const colHeights = new Array(colCount).fill(0);
  sectionsContainer.replaceChildren(...cols);

  for (const card of allRenderedCards) {
    let shortestIdx = 0;
    for (let i = 1; i < colCount; i++) {
      if (colHeights[i] < colHeights[shortestIdx]) {
        shortestIdx = i;
      }
    }
    cols[shortestIdx].appendChild(card);
    colHeights[shortestIdx] += card.offsetHeight + 18;
  }
}

let masonryResizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("fullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("webkitfullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of STORAGE_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const filteredCommands = section.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) return false;
      return matchesSearch(cmd, searchTerms);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const commandsHtml = filteredCommands.map((cmd) => {
      const isBookmarked = state.bookmarks.has(cmd.id);

      const flagsHtml = (cmd.flags && cmd.flags.length > 0)
        ? `<div class="flag-pills">${cmd.flags.map(([f, d]) =>
            `<span class="flag-pill"><strong class="flag-token">${escapeHtml(f)}</strong> <span class="flag-desc">${escapeHtml(d)}</span></span>`
          ).join("")}</div>`
        : "";

      const subcommandsHtml = (cmd.subcommands && cmd.subcommands.length > 0)
        ? `<div class="subcmd-list">${cmd.subcommands.map(([sc, sd]) =>
            `<div class="subcmd-row" data-subcmd="${escapeHtml(sc)}">
              <span class="subcmd-code">${escapeHtml(sc)}</span>
              <span class="subcmd-desc">${escapeHtml(sd)}</span>
              <button type="button" class="subcmd-copy-btn" title="Copy subcommand" aria-label="Copy subcommand">
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/></svg>
              </button>
            </div>`
          ).join("")}</div>`
        : "";

      const detailsHtml = cmd.details
        ? `<p class="cmd-details">${escapeHtml(cmd.details)}</p>`
        : "";

      const tipHtml = cmd.tip
        ? `<div class="cmd-tip"><span class="tip-badge">TIP</span>${escapeHtml(cmd.tip)}</div>`
        : "";

      return `
        <div class="cmd-item" id="cmd-${escapeHtml(cmd.id)}" data-cmd-id="${escapeHtml(cmd.id)}">
          <div class="cmd-header-row">
            <span class="cmd-desc">${escapeHtml(cmd.desc)}</span>
            <button
              type="button"
              class="bookmark-btn ${isBookmarked ? "bookmarked" : ""}"
              data-cmd-id="${escapeHtml(cmd.id)}"
              title="${isBookmarked ? "Remove bookmark" : "Bookmark this recipe"}"
              aria-label="${isBookmarked ? "Remove bookmark" : "Bookmark this recipe"}"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="${isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <div class="cmd-code-box" data-cmd="${escapeHtml(cmd.cmd)}">
            <pre class="cmd-code"><code>${highlightCommand(cmd.cmd)}</code></pre>
            <button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Copy</span>
            </button>
          </div>

          ${detailsHtml}
          ${flagsHtml}
          ${subcommandsHtml}
          ${tipHtml}
        </div>
      `;
    }).join("");

    cardsHtml.push(`
      <div class="section-card" id="sec-${escapeHtml(section.id)}">
        <div class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">${escapeHtml(section.badge)}</span>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <span class="cmd-count-badge">${filteredCommands.length}</span>
        </div>
        <div class="section-body">
          ${commandsHtml}
        </div>
      </div>
    `);
  }

  sectionsContainer.innerHTML = cardsHtml.join("");
  visibleCountEl.textContent = visibleCommandsCount;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
    sectionsContainer.classList.add("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
    sectionsContainer.classList.remove("hidden");
    packMasonry();
  }
}

function updateSavedCount() {
  savedCountEl.textContent = state.bookmarks.size;
  if (state.bookmarks.size > 0) {
    savedFilterBtn.classList.add("has-saved");
  } else {
    savedFilterBtn.classList.remove("has-saved");
  }
}

function initEventListeners() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderSections();
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.savedOnly = false;
    state.activeCategory = "all";
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
    searchInput.focus();
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    savedFilterBtn.classList.toggle("active", state.savedOnly);
    renderSections();
  });

  densityToggleBtn.addEventListener("click", () => {
    state.compact = !state.compact;
    document.body.classList.toggle("compact-mode", state.compact);
    densityLabel.textContent = state.compact ? "Normal" : "Compact";
    localStorage.setItem("linux_cs_compact", state.compact ? "1" : "0");
    packMasonry();
  });

  if (printBtn) printBtn.addEventListener("click", () => {
    window.print();
  });

  themeToggleBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    localStorage.setItem("linux_cs_theme", state.theme);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      state.searchQuery = "";
      renderSections();
      searchInput.blur();
    }
  });

  sectionsContainer.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      const codeBox = copyBtn.closest(".cmd-code-box");
      const cmdText = codeBox ? codeBox.getAttribute("data-cmd") : "";
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const subCopyBtn = e.target.closest(".subcmd-copy-btn");
    if (subCopyBtn) {
      const row = subCopyBtn.closest(".subcmd-row");
      const subcmdText = row ? row.getAttribute("data-subcmd") : "";
      if (subcmdText) copyToClipboard(subcmdText);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const cmdId = bookmarkBtn.getAttribute("data-cmd-id");
      if (cmdId) {
        if (state.bookmarks.has(cmdId)) {
          state.bookmarks.delete(cmdId);
          bookmarkBtn.classList.remove("bookmarked");
        } else {
          state.bookmarks.add(cmdId);
          bookmarkBtn.classList.add("bookmarked");
        }
        localStorage.setItem("storage_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.CheatSheetCommon && typeof window.CheatSheetCommon.applyTheme === "function") {
    window.CheatSheetCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch (e) {}
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(state.theme);
  if (state.compact) {
    document.body.classList.add("compact-mode");
    densityLabel.textContent = "Normal";
  }
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
});
