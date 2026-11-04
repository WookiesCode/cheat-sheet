# Antigravity AI Datacenter & Sysadmin Cheat Sheet Suite (`agy/`)

An interactive, high-density, technician-first cheat sheet suite engineered for AI datacenter hardware triaging, cluster fabric diagnostics, Linux system administration, and CLI pipeline composition.

---

## 🚀 Quick Start & Launching

The suite requires **zero build steps or runtime dependencies**. You can open it immediately in any modern web browser:

### Option 1: Direct File Open
Open any `.html` file directly in your browser:
```bash
# Ubuntu Linux & Sysadmin Hub
xdg-open agy/index.html

# 100% Offline Single-File Crash-Cart Edition
xdg-open agy/datacenter-cheatsheet-portable.html
```

### Option 2: Local Staging Server
Serve the suite locally over HTTP (great for remote crash carts and jumpbox tunnels):
```bash
python3 -m http.server 8080 --directory agy/
# Open: http://localhost:8080
```

---

## 🎯 The Core Feature: Live Rack Targets Bar (`🎯 RACK TARGETS`)

Pinned across the top of every cheat sheet is the **Live Rack Targets Bar**:

```text
🎯 RACK TARGETS [Active ✓] [Reset] [Collapse ▴]
$BMC: 2001:db8:dc::50  |  $USER: ADMIN  |  $PASS: •••••••• 👁️  |  $IFACE: eno1  |  $HCA: mlx5_0  |  $DISK: /dev/nvme0n1  |  $GPU: 0
```

### How Live Substitution Works:
1. **Enter Your Target Node's Values**: Fill in the BMC IPv6/IPv4 address, credentials, target interface, HCA device, disk path, and GPU index.
2. **One-Click Copy Auto-Rewrite**: Clicking **any** command pill anywhere across the entire suite automatically substitutes your entered values into the clipboard.
   - Example template: `ipmitool -I lanplus -H $BMC -U $USER -P $PASS sensor`
   - Actually copied: `ipmitool -I lanplus -H 2001:db8:dc::50 -U ADMIN -P MySecretPass sensor`
3. **Password Security**: The `$PASS` input is masked (`type="password"`) by default with an inline eye toggle button (`👁️`) to verify or hide credentials.
4. **Local Persistence**: State is saved automatically to browser `localStorage` and persists seamlessly across pages.

---

## 📑 Domain Hubs & Navigation

Use the top navigation bar dropdowns to browse domain-specific command hubs or deep-dive into standalone tool sub-sheets:

| Hub Dropdown | Hub File | Key Focus & Scope |
| :--- | :--- | :--- |
| **Linux** | `index.html` | Hardware inventory (DMI/SMBIOS), PCIe/NUMA topology, ECC/EDAC memory & MCEs, NVMe/SMART, kernel parameters, systemd, and LVM storage. |
| **CLI Tools** | `cli-tools.html` | 46 individual POSIX/Linux command deep dives (`grep`, `awk`, `sed`, `find`, `xargs`, `jq`, `strace`, `lsof`, `curl`, `rsync`, `dd`, etc.) + Interactive Pipeline Composer. |
| **NVIDIA DC** | `nvidia.html` | H200/B200/HGX/SXM architecture, `nvidia-smi -q`, DCGM health (`dcgmi`), NVLink/NVSwitch, MIG partitioning, and Xid/SXid triage. |
| **InfiniBand** | `infiniband.html` | ConnectX-6/7/8 HCAs, NDR 400G / XDR 800G, `mlxlink`, `iblinkinfo`, OpenSM fabric management, and RoCEv2. |
| **Switches** | `switches.html` | Datacenter switch NOS command references: SONiC, Mellanox Onyx (MLNX-OS), and Cumulus Linux (NVUE). |
| **BMC / IPMI** | `ipmi.html` | In-band and out-of-band `ipmitool` commands: SDR sensors, SEL event logs, SOL serial consoles, chassis power, and raw hex OEM commands. |
| **Redfish** | `redfish.html` | DMTF Redfish REST API automation via `curl`, JSON payloads, and OEM extensions (Dell iDRAC, HPE iLO, Supermicro, ASUS, GIGABYTE). |
| **Fiber & Optics**| `fiber.html` | OSFP/QSFP-DD/MPO-APC DOM optical transceiver monitoring, TX/RX optical power (dBm), link BER, and cleaning procedures. |
| **Ethernet** | `ethernet.html` | 100G/200G/400G NIC configuration, `ethtool`, ring buffers, FEC tuning, LACP bonding, and SR-IOV. |
| **Motherboards** | `motherboards.html`| Server motherboard hardware diagnostics, BIOS/AGESA post-codes, and sensor audits for ASUS, GIGABYTE, SMC, Dell, and HPE. |
| **Jira** | `jira.html` | Datacenter JQL queries: node/hostname history, rack & RU position audits, chassis/GPU serials, vendor RMAs, GPU/NVLink incidents, Slurm drains, queue P1 blockers, REST API & `jira-cli`. |
| **Scripting** | `scripting.html` | Polyglot scripting reference: Bash, Python 3.10+, JavaScript, TypeScript, PowerShell 7, Lua 5.4, Git, JSON, YAML, TOML, Regex, SQL/SQLite, and Markdown. |
| **Neovim** | `neovim.html` | Vim/Neovim motions, operators, text objects, visual block mode, window splits, buffers, and interactive keybinding composer. |
| **macOS / Win** | `macos.html` / `windows.html` | Darwin sysadmin (`launchctl`, `brew`, `diskutil`) & Windows Server / PowerShell 7 admin. |

---

## ⚡ Global Search (`Ctrl + K` / `Cmd + K`)

- Press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>Cmd</kbd> + <kbd>K</kbd> on macOS) anywhere across the site.
- Search instantly across **thousands of commands, flags, descriptions, and tags** in the global index (`global-search-index.js`).
- Use <kbd>↑</kbd> and <kbd>↓</kbd> arrows to navigate search results and press <kbd>Enter</kbd> to jump straight to the exact command card.

---

## 🛠️ Interactive Composers & Calculators

- **JQL Query & Direct Link Composer** (`jira.html`): Select a query preset (Node, Rack, Chassis Serial, Component, Open P1s, Active RMAs, Slurm Drains) to generate copyable JQL queries and direct one-click "Open in Jira" search URLs.
- **CLI Pipeline Composer** (`cli-tools.html`): Select a utility (`grep`, `awk`, `find`, `strace`, `jq`, `tcpdump`, etc.) and a specific task recipe to generate ready-to-paste shell commands.
- **`chmod` Octal & Symbolic Calculator** (`index.html`): Interactive visual checkbox matrix that calculates octal modes (`755`, `644`, `700`) and symbolic strings (`rwxr-xr-x`) in real time.
- **Reference Decoders**:
  - `ps` STAT codes (`R`, `S`, `D`, `Z`, `T`, `W`, `<`)
  - `awk` built-in variables (`NR`, `NF`, `FS`, `OFS`, `RS`)
  - `sed` delimiter rules and range syntax
  - Linux POSIX signals (`SIGTERM`, `SIGKILL`, `SIGINT`, `SIGHUP`)
  - Bash Readline editing keystrokes (`Ctrl+A`, `Ctrl+R`, `Alt+.`).

---

## 📚 Embedded Offline Manuals Library (`📚 Manuals`)

The suite embeds **500 complete, offline UNIX & datacenter hardware manpages** accessible from any page:

- **Instant Access**: Click the **Manuals** button in the top action bar or press <kbd>M</kbd> anywhere on the page (when not typing in an input).
- **Zero Internet Required**: All 500 manuals are pre-rendered into UTF-8 plaintext with original sources, copyright notices, and license metadata bundled locally in `manuals-data.js` and embedded inline into the portable single-file edition.
- **Coverage**:
  - **Linux & Shell**: `bash`, `ssh`, `curl`, `awk`, `sed`, `grep`, `systemctl`, `journalctl`, `cron`, `tar`, `find`, `strace`, `lsof`, etc.
  - **BMC & Hardware**: `ipmitool`, `dmidecode`, `lscpu`, `lspci`, `numactl`, `mcelog`, `edac-util`.
  - **GPU & Fabric**: `nvidia-smi`, `dcgmi` (DCGM), `nvlink`.
  - **InfiniBand & RDMA**: `ibstat`, `ibv_devinfo`, `iblinkinfo`, `perfquery`, `sminfo`, `ibping`, `mstlink`, `mstflint`.
  - **Storage & Enclosures**: `nvme`, `nvme-smart-log`, `smartctl`, `sg_ses`, `multipath`, `mdadm`, `zpool`.
- **Search & Filtering**:
  - Filter by command name, section, category, or alias.
  - Optional **Search full text** toggle to search through all manual bodies.
  - One-click **Copy** button to copy full manpages into the clipboard.
- **Rebuilding & Verification**:
  ```bash
  python3 agy/manuals/build-manuals.py
  NODE_PATH=/home/jason/.hermes/hermes-agent/node_modules node agy/tests/manuals.test.js
  ```

---

## 📦 1-File Offline Crash-Cart Edition

For secure facilities, air-gapped clusters, or crash carts without internet access:
- **File**: `agy/datacenter-cheatsheet-portable.html`
- **Zero External Calls**: 100% self-contained single HTML bundle (~17.5 MB) containing all CSS styling, SVGs, client-side search indexes, target bar substitutions, 14 cheat sheets, and the complete 500-entry offline manual library.
- **Recompiling**:
  ```bash
  node agy/build-portable.js
  ```

---

## 🎨 24 Built-In Color Themes

Click the **Theme** button in the header (or **Shift + Click** to cycle quickly):

| Theme Category | Available Themes |
| :--- | :--- |
| **Dark & Datacenter** | **Cyber Dark** (Default obsidian & cyan), **Matrix CRT** (Phosphor green), **Tokyo Night** (Shibuya neon), **Nord Frost** (Arctic blue), **Dracula Night** (Vampire purple), **Star Trek** (LCARS console orange/lilac), **Star Wars** (Deep space black & crawl yellow). |
| **Muted & Low Eye-Strain** | **Warm Sepia** (Parchment & espresso ink), **Zenburn** (Low-contrast warm gray & sage), **Ayu Mirage** (Dusk navy & amber), **Kanagawa** (Sumi-e ink & autumn wave), **Everforest** (Pine & moss), **Gruvbox Dark** (Retro groove), **Rosé Pine** (Velvet charcoal & dusty rose), **Solarized Dark** (Precision cyan & gold). |
| **AI Assistants & Cloud** | **Gemini Spark** (Google cosmic indigo & violet), **Claude Warm** (Anthropic terracotta & charcoal), **Codex Mint** (OpenAI charcoal & mint), **Nebius Cloud** (Petrol navy & volt lime). |
| **Daylight & Light Paper** | **Clean Light** (Crisp daylight azure), **Catppuccin Latte** (Soft pastel paper & mauve), **Gruvbox Light** (Warm cream paper & forest), **Solarized Light** (Precision cream & cyan). |

---

## ⚙️ Maintenance & Generator Scripts

The `agy/` directory includes helper scripts to rebuild or expand suite components:

- `node agy/build-portable.js`: Recompiles all HTML/JS assets into `datacenter-cheatsheet-portable.html`.
- `node agy/build-index.js`: Rebuilds `global-search-index.js` across all sheets.
- `node agy/generate-linux-suite.js`: Generates the 15 standalone Linux subsystem sub-pages from `app.js`.
- `node agy/generate-cli-suite.js`: Generates the 46 standalone CLI utility sub-pages from `cli-tools.js`.
- `node agy/generate-scripting-suite.js`: Generates language-specific scripting sub-pages.
