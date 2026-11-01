const FIBER_CHEAT_SHEET_DATA = [
  {
    id: "dom-cli",
    badge: "dom",
    title: "DOM / DDM Optical CLI Diagnostics",
    subtitle: "Linux ethtool -m, NVIDIA mlxlink, SONiC sfputil, Arista EOS & Cisco NX-OS transceiver telemetry",
    commands: [
      {
        id: "linux-ethtool-dom",
        mode: "LINUX CLI",
        modeClass: "mode-n",
        desc: "Read SFF-8636 / CMIS transceiver EEPROM & live DOM optical RX/TX power (dBm), temperature, and alarms",
        cmd: "ethtool -m eth0   |   ethtool --show-fec eth0   |   ethtool -S eth0 | grep -E 'rx_pcs|fec|crc|err'",
        flags: [
          ["ethtool -m <iface>", "Dumps vendor, PN, SN, wavelength, per-lane Laser Bias (mA), TX power (dBm/mW), RX power (dBm/mW), and LOS/High/Low alarms"],
          ["--show-fec", "Display active Forward Error Correction mode (RS / BaseR / Off)"]
        ],
        tip: "Works on any Linux NIC driver",
        tags: ["ethtool", "dom", "ddm", "eeprom", "dbm", "rx", "tx", "linux"]
      },
      {
        id: "nvidia-mlxlink-optics",
        mode: "NVIDIA / IB",
        modeClass: "mode-v",
        desc: "Inspect ConnectX / Quantum / Spectrum optical transceiver DOM, PAM4 eye diagram, BER, and FEC histogram",
        cmd: "mlxlink -d mlx5_0 -m -c -e   |   mlxlink -d /dev/mst/mt4129_pciconf0 -p 1 -m -c",
        flags: [
          ["-m", "Module info: vendor, SN, temp, voltage, and per-lane RX/TX power in dBm"],
          ["-c", "Counters: Raw Physical BER, Effective Post-FEC BER, and RS-FEC corrected/uncorrectable symbol bins"],
          ["-e", "Physical SerDes Eye Opening grades and height/width in mV / mUI per lane"]
        ],
        tip: "Best all-in-one 400G/800G optic check",
        tags: ["mlxlink", "nvidia", "mellanox", "ber", "eye", "pam4", "infiniband", "roce"]
      },
      {
        id: "sonic-sfputil-show",
        mode: "SONiC NOS",
        modeClass: "mode-i",
        desc: "Query transceiver presence, DOM optical power levels, and reset/low-power mode on SONiC switches",
        cmd: "sfputil show eeprom -d -p Ethernet0   |   show interfaces transceiver eeprom Ethernet0 --dom",
        flags: [
          ["-d (--dom)", "Include real-time Digital Optical Monitoring (DOM) per-lane RX/TX dBm and bias current"],
          ["sfputil reset Ethernet0", "Hardware-reset a wedged CMIS optical transceiver in port Ethernet0"],
          ["sfputil lpmode off Ethernet0", "Take high-power QSFP-DD/OSFP optic out of Low Power Mode"]
        ],
        tags: ["sonic", "sfputil", "lpmode", "reset", "switch", "dom"]
      },
      {
        id: "arista-cisco-juniper-dom",
        mode: "SWITCH NOS",
        modeClass: "mode-c",
        desc: "Inspect optical transceiver DOM power levels and FEC counters on Arista EOS, Cisco NX-OS & Juniper Junos",
        cmd: "Arista: show int Eth1/1 transceiver dom   |   NX-OS: show int eth1/1 transceiver details   |   Junos: show chassis pic fpc-slot 0 pic-slot 0",
        flags: [
          ["Arista: show int phy detail", "Shows per-lane PAM4 pre-FEC BER and FEC symbol error counters in EOS"],
          ["Junos: show interfaces diagnostics optics et-0/0/0", "Displays per-lane laser output/receiver power and alarm flags on Junos"]
        ],
        tags: ["arista", "eos", "cisco", "nxos", "juniper", "junos", "switch"]
      }
    ]
  },
  {
    id: "form-factors-breakout",
    badge: "xcvr",
    title: "Form Factors, 400G/800G Optics & Breakouts",
    subtitle: "OSFP (Finned vs Flat-top RHS), QSFP-DD, QSFP112, DR8/2xDR4/FR4 & breakout topologies",
    commands: [
      {
        id: "osfp-finned-vs-flattop",
        mode: "800G / 400G",
        modeClass: "mode-v",
        desc: "OSFP Finned (Switch side) vs OSFP Flat-Top / RHS (Riding Heat Sink for ConnectX-7/8 PCIe NICs)",
        cmd: "Switch Port: OSFP Finned (8x100G = 800G)   |   NIC Card: OSFP Flat-Top / RHS or QSFP112 (4x100G = 400G)",
        flags: [
          ["OSFP Finned", "Integrated top heatsink fins — used in Quantum-2 / Spectrum-4 / 800G spine-leaf switches"],
          ["OSFP Flat-Top (RHS)", "Flat top so the PCIe NIC cage's riding heatsink rests on the module — Finned OSFP will NOT fit in a Flat-Top NIC cage!"],
          ["QSFP-DD vs OSFP", "QSFP-DD is backward-compatible with QSFP28/56; OSFP is slightly wider with superior thermal dissipation (up to 30W+ for 800G/1.6T)"]
        ],
        danger: "Finned OSFP physically blocks Flat-Top NIC cages",
        tags: ["osfp", "finned", "flattop", "rhs", "qsfp-dd", "qsfp112", "800g", "400g"]
      },
      {
        id: "breakout-topologies-800g-400g",
        mode: "BREAKOUT",
        modeClass: "mode-n",
        desc: "Common AI / Datacenter optical breakout patterns (800G 2xDR4 → 2× 400G DR4, 400G DR4 → 4× 100G DR1)",
        cmd: "800G Twin-Port OSFP (2x MPO-12 APC)  ──►  2× 400G DR4 / QSFP112 (1x MPO-12 APC each)\n400G DR4 (1x MPO-12 APC)             ──►  4× 100G DR1 / SFP112 (4x LC Duplex UPC)",
        flags: [
          ["800G 2xDR4 / 2xFR4", "Houses TWO independent 400G ports (2x MPO-12 or 2x CS/LC) inside a single 800G OSFP switch cage"],
          ["400G DR4 → 4×100G DR1", "MPO-12 (APC Green) fanout cable to 4× LC Duplex (UPC Blue) — 100G/lane PAM4 on both ends!"],
          ["Modulation Match Rule", "Can only passive-breakout when per-lane speed & modulation match (e.g. 100G PAM4/lane to 100G PAM4/lane)"]
        ],
        tip: "Verify 100G/lane vs 50G/lane PAM4 before breakout!",
        tags: ["breakout", "fanout", "2xdr4", "dr4", "dr1", "pam4", "lanes"]
      },
      {
        id: "dac-acc-aec-aoc",
        mode: "CABLING",
        modeClass: "mode-n",
        desc: "Choosing between Passive DAC, Active AEC (Retimed Copper), AOC, SR, DR, and FR optics by distance",
        cmd: "0.5–2.5m: Passive DAC   |   2.5–7m: AEC (Retimed Copper)   |   ≤100m: SR4/SR8 (MMF)   |   ≤500m: DR4/DR8 (SMF)   |   ≤2km: FR4 (SMF)",
        flags: [
          ["Passive DAC (≤2.5m at 100G/lane)", "Zero power draw, <0.1ns latency, cheapest, thick bend radius"],
          ["AEC (Active Electrical Cable)", "Built-in DSP retimers on copper up to 7m, thinner gauge than DAC, ~50% less power than optics"],
          ["AOC (Active Optical Cable)", "Sealed factory-terminated fiber assembly (cannot clean internal ferrules or patch through panels)"]
        ],
        tags: ["dac", "aec", "acc", "aoc", "copper", "distance", "reach"]
      }
    ]
  },
  {
    id: "mpo-polarity-connectors",
    badge: "conn",
    title: "MPO/MTP Pinning, Polarity & Connector Types",
    subtitle: "Male vs Female guide pins, Type A/B/C polarity, MPO-12 vs MPO-16 & UPC vs APC ferrules",
    commands: [
      {
        id: "mpo-male-female-pin-rule",
        mode: "MPO GOLDEN RULE",
        modeClass: "mode-t",
        desc: "Prevent transceiver damage: How Male (Pinned) and Female (Unpinned) MPO/MTP connectors mate",
        cmd: "[Transceiver: MALE PINS] ◄── [Patch Cord: FEMALE] ──► [Trunk Panel: MALE] ◄── [Patch Cord: FEMALE] ──► [Transceiver: MALE PINS]",
        flags: [
          ["Transceiver MPO Cage", "Every SR4/SR8/DR4/DR8 transceiver has 2 metal guide pins (MALE) inside the optical receptacle"],
          ["Female-to-Female Patch Cord", "Direct transceiver-to-transceiver MPO jumper MUST be Female (Unpinned) on BOTH ends"],
          ["Male-to-Male Clash", "Forcing a Male (Pinned) cable into a Male transceiver crushes guide pins and ruins the optic!"],
          ["Female-to-Female Mismatch", "Mating two Female connectors in a patch coupler leaves cores unaligned (causes 3–10+ dB loss!)"]
        ],
        danger: "Never plug a Pinned (Male) MPO cable into a transceiver!",
        tags: ["mpo", "mtp", "male", "female", "pins", "pinned", "unpinned", "damage"]
      },
      {
        id: "mpo-polarity-type-a-b-c",
        mode: "POLARITY",
        modeClass: "mode-v",
        desc: "MPO-12 / MPO-16 Polarity Types (Type B rollover for direct patch vs Type A structured trunks)",
        cmd: "Direct Optic-to-Optic Patch: Type B (Key-Up to Key-Up, Female-to-Female)   |   MPO-12 Lanes: TX=1..4, Unused=5..8, RX=9..12",
        flags: [
          ["Type B (Rollover: 1→12, 2→11...)", "Standard direct patch cord between two SR4/DR4/DR8 transceivers: maps Fiber 1 (TX1) to Fiber 12 (RX1)"],
          ["Type A (Straight: 1→1, 2→2...)", "Key-Up to Key-Down trunk cable; requires one Type A + one Type B patch cord at the panels to flip TX→RX"],
          ["Odd number of Type B cables", "In an end-to-end MPO link without cassettes, you generally need an ODD number of Type B flips so Pos 1 lands on Pos 12"]
        ],
        tip: "Direct jumper between 2 optics = Type B Female-Female",
        tags: ["polarity", "type-b", "type-a", "rollover", "key-up", "mpo12", "mpo16"]
      },
      {
        id: "mpo12-vs-mpo16-keying",
        mode: "800G / 400G",
        modeClass: "mode-v",
        desc: "Distinguishing MPO-12 (4-lane SR4/DR4) from MPO-16 (8-lane 800G SR8/DR8) connectors",
        cmd: "MPO-12 (4-lane): Centered Alignment Key   |   MPO-16 (8-lane 800G): Offset (Left-Shifted) Alignment Key",
        flags: [
          ["MPO-12 (Centered Key)", "Used for 4-lane parallel optics (100G SR4/DR4, 400G SR4/DR4); middle 4 fibers (5–8) are dark"],
          ["MPO-16 (Offset Key)", "Used for 8-lane single-port 800G SR8 / DR8 optics (all 16 fibers active: 1–8 TX, 9–16 RX) — offset key prevents plugging MPO-12 into MPO-16!"]
        ],
        tags: ["mpo12", "mpo16", "key", "offset", "sr8", "dr8", "800g"]
      },
      {
        id: "lc-cs-sn-mdc-duplex",
        mode: "DUPLEX",
        modeClass: "mode-n",
        desc: "Duplex 2-fiber connectors (LC, CS, SN, MDC) and how to fix RX_LOS polarity swaps in the field",
        cmd: "LC Duplex (FR4/LR4/SR/DR1)   |   CS / SN / MDC (High-Density 2xFR4 / 4xDR1 breakouts)",
        flags: [
          ["Both ends show RX -40 dBm (LOS)", "If both transceivers transmit healthy TX power (~0 dBm) but both read -40 dBm RX, TX is going to TX — pop the LC duplex clip and swap A/B fibers on ONE end!"],
          ["UPC (Blue) vs APC (Green)", "Duplex LR4/FR4/CWDM4 transceivers almost always use flat Blue LC/UPC; Single-Mode MPO (DR4/DR8) ALWAYS uses angled Green MPO/APC!"]
        ],
        tip: "TX ok + RX -40dBm on both sides = roll LC clip",
        tags: ["lc", "duplex", "cs", "sn", "mdc", "los", "swap", "roll", "upc", "apc"]
      }
    ]
  },
  {
    id: "cleaning-testing-triage",
    badge: "phy",
    title: "Cleaning, OTDR/OLTS Testing, FEC & Triage",
    subtitle: "Inspect-before-you-connect, attenuator protection, FEC bin analysis & fault isolation",
    commands: [
      {
        id: "inspect-clean-connect",
        mode: "MAINTENANCE",
        modeClass: "mode-c",
        desc: "IEC 61300-3-35 Inspect-Before-You-Connect workflow (85%+ of datacenter link issues are dirty ferrules)",
        cmd: "1. Inspect w/ 400x Scope  ──►  2. Dry IBC Click-Cleaner (1–2 clicks)  ──►  3. Wet-to-Dry Clean (if oil/gel)  ──►  4. Re-Inspect",
        flags: [
          ["9 µm SMF Core Size", "Single-mode core is only 9 microns wide (1/10th of a human hair) — a single skin-oil smudge or dust speck blocks the entire core!"],
          ["Brand New Patch Cords", "Factory dust caps outgas plasticizer residue onto ferrules — ALWAYS click-clean brand-new cables straight out of the bag!"],
          ["MPO vs LC Cleaners", "Use wide ribbon IBC cleaners for MPO-12/16 (cleans all 12/16 fibers + inside Male guide-pin holes) and 1.25mm pens for LC"]
        ],
        tip: "New out of bag ≠ clean!",
        tags: ["clean", "ibc", "clicker", "scope", "ferrule", "dust", "contamination"]
      },
      {
        id: "optical-attenuators-overload",
        mode: "PROTECTION",
        modeClass: "mode-t",
        desc: "When to install inline optical attenuators to prevent burning out receiver photodiodes (`RX High Alarm`)",
        cmd: "10km LR4: Safe at 2m patch (Max TX ≤ Max RX)   |   40km ER4 / 80km ZR: MUST use 10–15 dB Attenuator on short patches!",
        flags: [
          ["Damage Threshold vs Overload", "If TX max launch power exceeds RX overload/damage rating (common on ER4, ZR, DWDM), short patch cords will saturate or permanently destroy the APD receiver!"],
          ["DR4 / FR4 / LR4", "Standard 500m DR4, 2km FR4, and 10km LR4 are engineered so Max TX ≤ Max RX Overload (safe for short back-to-back rack patching)"]
        ],
        danger: "Never short-patch ER4/ZR without an attenuator!",
        tags: ["attenuator", "overload", "er4", "zr", "lr4", "burn", "damage", "pad"]
      },
      {
        id: "fec-ber-fault-triage",
        mode: "TROUBLESHOOTING",
        modeClass: "mode-t",
        desc: "Step-by-step field isolation for flapping links, high Pre-FEC BER, or uncorrectable FEC codeword errors",
        cmd: "Check DOM RX dBm per lane  ──►  Check Lane Skew (<2.5 dB)  ──►  Clean Patch & Panel  ──►  Swap Patch Cord  ──►  Loopback Test Optic",
        flags: [
          ["1 single lane low RX (e.g. Lane 3 = -11 dBm, Lanes 0–2 = -2 dBm)", "Classic symptom of contamination on fiber #3/#10 of an MPO ferrule or damaged individual sub-assembly"],
          ["All lanes low RX (-8 to -12 dBm)", "Excessive link insertion loss: pinched/macro-bent fiber (bend radius <30mm), Female-to-Female unpinned MPO coupler, or dirty trunk cassettes"],
          ["Good RX dBm (-2 dBm) but high Pre-FEC BER / eye closure", "High reflectance (APC mated to UPC!), failing laser/DSP on remote TX or local RX, or chromatic/modal dispersion"]
        ],
        tip: "1 weak lane on MPO = dirty outer fiber",
        tags: ["triage", "troubleshooting", "ber", "fec", "flap", "crc", "skew", "loopback"]
      },
      {
        id: "olts-vs-otdr-testing",
        mode: "CERTIFICATION",
        modeClass: "mode-n",
        desc: "Tier-1 OLTS (Optical Loss Test Set) vs Tier-2 OTDR (Optical Time-Domain Reflectometer) structured cabling tests",
        cmd: "Tier 1 (OLTS Power Meter): Total End-to-End dB Insertion Loss   |   Tier 2 (OTDR): Distance-to-Fault (m) + Per-Panel Reflectance & Splice Loss",
        flags: [
          ["Launch & Receive Reference Cords", "Always use a 150m+ Launch Box & Receive Box with an OTDR so the first and last patch panels don't hide inside the OTDR's event dead zone!"],
          ["Max Datacenter MPO Link Budget", "IEEE 400GBASE-DR4 / 800G-DR8 total channel insertion loss budget is typically ≤ 3.0 dB (500m)"]
        ],
        tags: ["otdr", "olts", "fluke", "exfo", "tier1", "tier2", "launch-cable", "dead-zone"]
      }
    ]
  }
];

// Optical Specs for Interactive Link Budget Calculator
const OPTIC_SPECS = {
  dr4: {
    name: "400G/800G DR4/DR8 (1310nm OS2)",
    attenPerKm: 0.4,
    mateLoss: 0.35,
    rxSens: -9.4,
    rxOverload: 4.0
  },
  fr4: {
    name: "400G FR4 / CWDM4 (1310nm OS2)",
    attenPerKm: 0.4,
    mateLoss: 0.25,
    rxSens: -10.3,
    rxOverload: 3.5
  },
  sr4: {
    name: "400G/800G SR4/SR8 (850nm OM4)",
    attenPerKm: 3.0,
    mateLoss: 0.35,
    rxSens: -8.2,
    rxOverload: 4.0
  },
  lr4: {
    name: "100G/400G LR4 (1310nm OS2 10km)",
    attenPerKm: 0.35,
    mateLoss: 0.25,
    rxSens: -11.5,
    rxOverload: 4.5
  },
  er4: {
    name: "100G/400G ER4 (1550nm OS2 40km)",
    attenPerKm: 0.22,
    mateLoss: 0.25,
    rxSens: -16.5,
    rxOverload: -1.0
  }
};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("fiber_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const emptyStateEl = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

let toastTimer = null;

function showToast(msg) {
  toastTextEl.textContent = msg;
  toastEl.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
  }, 1800);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text.length > 42 ? text.slice(0, 42) + "…" : text}`);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied to clipboard");
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightFiberText(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\s\|\s|──►|◄──)|(\b(?:sudo|ethtool|mlxlink|sfputil|show|grep)\b)|(\b(?:OSFP|QSFP-DD|QSFP112|MPO-12|MPO-16|DR4|DR8|FR4|SR4|SR8|LR4|ER4|ZR|UPC|APC|MALE|FEMALE|DAC|AEC|AOC)\b)|(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9-]+)/g,
    (match, sep, cmd, keyword, flag) => {
      if (sep) return `<span class="tok-pipe">${sep}</span>`;
      if (cmd) return `<span class="tok-cmd">${cmd}</span>`;
      if (keyword) return `<span class="tok-str">${keyword}</span>`;
      if (flag) return `<span class="tok-flag">${flag}</span>`;
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = FIBER_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of FIBER_CHEAT_SHEET_DATA) {
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
    <div class="cat-dropdown-wrap">
      <label class="cat-dropdown-label" for="category-select">Section:</label>
      <select id="category-select" class="cat-select" aria-label="Filter by section">
        ${optionsHtml.join("")}
      </select>
      ${resetBtnHtml}
    </div>
  `;
}

function matchesSearch(cmdObj, section, query) {
  if (!query) return true;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    cmdObj.desc,
    cmdObj.cmd,
    cmdObj.mode || "",
    section.title,
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat()
  ]
    .join(" ")
    .toLowerCase();

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
window.addEventListener("resize", () => packMasonry());
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of FIBER_CHEAT_SHEET_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const filteredCommands = section.commands.filter((cmdObj) => {
      if (state.savedOnly && !state.bookmarks.has(cmdObj.id)) {
        return false;
      }
      return matchesSearch(cmdObj, section, state.searchQuery);
    });

    if (filteredCommands.length === 0) {
      continue;
    }

    visibleCommandsCount += filteredCommands.length;

    const itemsHtml = filteredCommands
      .map((item) => {
        const isSaved = state.bookmarks.has(item.id);
        const modeHtml = item.mode
          ? `<span class="mode-pill ${item.modeClass || "mode-n"}">${escapeHtml(item.mode)}</span>`
          : "";
        const tipHtml = item.tip
          ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>`
          : "";
        const dangerHtml = item.danger
          ? `<span class="danger-badge">! ${escapeHtml(item.danger)}</span>`
          : "";

        const flagsHtml =
          item.flags && item.flags.length
            ? `<div class="flag-pills">
                ${item.flags
                  .map(
                    ([flag, explanation]) =>
                      `<span class="flag-pill"><code>${escapeHtml(flag)}</code> <span>${escapeHtml(explanation)}</span></span>`
                  )
                  .join("")}
              </div>`
            : "";

        const copyTarget = item.cmd.includes("   |   ")
          ? item.cmd.split("   |   ")[0].trim()
          : item.cmd.trim();

        return `
          <div class="cmd-item" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                ${modeHtml}
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
                ${dangerHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn ${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="${item.id}"
                  title="${isSaved ? "Remove bookmark" : "Bookmark item"}"
                  aria-label="Bookmark item"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(copyTarget)}" title="Click to copy">
              <code class="cmd-code">${highlightFiberText(item.cmd)}</code>
              <span class="copy-hint">Copy</span>
            </div>

            ${flagsHtml}
          </div>
        `;
      })
      .join("");

    cardsHtml.push(`
      <article class="section-card" id="sec-${section.id}">
        <header class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">${escapeHtml(section.badge)}</span>
            <div>
              <h2 class="section-title">${escapeHtml(section.title)}</h2>
              <p class="section-subtitle">${escapeHtml(section.subtitle)}</p>
            </div>
          </div>
          <span class="count-badge">${filteredCommands.length}</span>
        </header>
        <div class="command-list">
          ${itemsHtml}
        </div>
      </article>
    `);
  }

  sectionsContainer.innerHTML = cardsHtml.join("");
  packMasonry();
  visibleCountEl.textContent = String(visibleCommandsCount);
  savedCountEl.textContent = String(state.bookmarks.size);
  savedFilterBtn.classList.toggle("active", state.savedOnly);

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }
}

// Interactive Optical Link Budget & dBm <-> mW Calculator
function initFiberCalculator() {
  const opticEl = document.getElementById("fib-optic");
  const distEl = document.getElementById("fib-dist");
  const matesEl = document.getElementById("fib-mates");
  const txEl = document.getElementById("fib-tx");
  const rxDbmEl = document.getElementById("fib-rx-dbm");
  const rxMwEl = document.getElementById("fib-rx-mw");
  const marginPill = document.getElementById("fib-margin-pill");
  const meaningEl = document.getElementById("fib-meaning-text");
  const presetBtns = document.querySelectorAll(".fib-preset");

  function updateLinkBudget() {
    const opticKey = opticEl.value;
    const spec = OPTIC_SPECS[opticKey] || OPTIC_SPECS.dr4;
    const distKm = parseFloat(distEl.value) || 0.1;
    const panels = parseInt(matesEl.value, 10) || 0;
    const txDbm = parseFloat(txEl.value) || 0;

    // Total loss = fiber attenuation + panel insertions + 2 transceiver end-connector insertions (0.5 dB total)
    const fiberLoss = distKm * spec.attenPerKm;
    const panelLoss = panels * spec.mateLoss;
    const endMateLoss = 0.5;
    const totalLoss = fiberLoss + panelLoss + endMateLoss;

    const estRxDbm = txDbm - totalLoss;
    const estRxMw = Math.pow(10, estRxDbm / 10);
    const margin = estRxDbm - spec.rxSens;

    rxDbmEl.textContent = `${estRxDbm >= 0 ? "+" : ""}${estRxDbm.toFixed(2)} dBm`;
    rxMwEl.textContent = `${estRxMw.toFixed(2)} mW`;

    if (estRxDbm > spec.rxOverload) {
      marginPill.textContent = `OVERLOAD (> ${spec.rxOverload} dBm — Add Attenuator!)`;
      marginPill.style.color = "var(--accent-red)";
    } else if (margin < 0) {
      marginPill.textContent = `Margin: ${margin.toFixed(2)} dB (FAIL / RX_LOS)`;
      marginPill.style.color = "var(--accent-red)";
    } else if (margin < 2.0) {
      marginPill.textContent = `Margin: +${margin.toFixed(2)} dB (TIGHT MARGIN)`;
      marginPill.style.color = "var(--accent-amber)";
    } else {
      marginPill.textContent = `Margin: +${margin.toFixed(2)} dB (HEALTHY PASS)`;
      marginPill.style.color = "var(--accent-green)";
    }

    meaningEl.innerHTML = `Total Loss: <strong>${totalLoss.toFixed(2)} dB</strong> (Fiber: ${fiberLoss.toFixed(2)} dB + ${panels} panels @ ${spec.mateLoss} dB + 0.50 dB transceiver coupling) | Min RX Sens: <strong>${spec.rxSens} dBm</strong>`;

    presetBtns.forEach((btn) => {
      const active =
        btn.dataset.optic === opticKey &&
        btn.dataset.dist === distEl.value &&
        btn.dataset.mates === matesEl.value &&
        btn.dataset.tx === txEl.value;
      btn.classList.toggle("active", active);
    });
  }

  [opticEl, distEl, matesEl, txEl].forEach((sel) => {
    sel.addEventListener("change", updateLinkBudget);
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      opticEl.value = btn.dataset.optic;
      distEl.value = btn.dataset.dist;
      matesEl.value = btn.dataset.mates;
      txEl.value = btn.dataset.tx;
      updateLinkBudget();
    });
  });

  updateLinkBudget();
}

function initMiniTabs() {
  const tabs = document.querySelectorAll(".mini-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".mini-tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
    window.AntigravityCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch(e) {}
  }
}

function applyDensity(compact) {
  state.compact = compact;
  document.body.classList.toggle("compact-mode", compact);
  densityToggleBtn.classList.toggle("active", compact);
  densityLabel.textContent = compact ? "Detailed" : "Compact";
  localStorage.setItem("linux_cs_compact", compact ? "1" : "0");
  packMasonry();
}

function initEvents() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    renderSections();
  });

  categoryTabsEl.addEventListener("change", (e) => {
    const sel = e.target.closest(".cat-select");
    if (!sel) return;
    state.activeCategory = sel.value;
    renderCategoryTabs();
    renderSections();
  });

  categoryTabsEl.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-cat]");
    if (!tab) return;
    state.activeCategory = tab.dataset.cat;
    renderCategoryTabs();
    renderSections();
  });

  sectionsContainer.addEventListener("click", (e) => {
    const copyBox = e.target.closest(".cmd-code-box");
    if (copyBox) {
      copyToClipboard(copyBox.dataset.copy);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const id = bookmarkBtn.dataset.bookmarkId;
      if (state.bookmarks.has(id)) {
        state.bookmarks.delete(id);
        showToast("Removed from saved items");
      } else {
        state.bookmarks.add(id);
        showToast("Saved to bookmarks");
      }
      localStorage.setItem("fiber_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      renderSections();
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    renderSections();
  });

  densityToggleBtn.addEventListener("click", () => {
    applyDensity(!state.compact);
  });

  if (printBtn) printBtn.addEventListener("click", () => {
    window.print();
  });

  themeToggleBtn.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.activeCategory = "all";
    state.savedOnly = false;
    searchInput.value = "";
    renderCategoryTabs();
    renderSections();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.key === "/") && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape") {
      if (document.activeElement === searchInput || state.searchQuery) {
        searchInput.value = "";
        state.searchQuery = "";
        searchInput.blur();
        renderSections();
      }
    }
  });
}

applyTheme(state.theme);
applyDensity(state.compact);
renderCategoryTabs();
renderSections();
initFiberCalculator();
initMiniTabs();
initEvents();
