# Datacenter Cheat Sheets

Offline command reference sheets for datacenter work: 235 linked pages, plus one file that bundles them all.

## Open it

- **Normal use:** open `index.html` in a browser. It is **Mission Control**: decode an error, check the node you are on, start a runbook, practise commands. **Field notes** have their own page (`notes.html`): **More → Field notes**. The Linux reference itself is `linux.html`.
- **Offline or on another machine:** copy `datacenter-cheatsheet-portable.html` and open it. It's a single file that works with no network. The **1-File Offline** button opens it too.

## Find what you need

| To do this | Use |
|---|---|
| Search every sheet | `Ctrl+K`, `/` or the search pill in the header, then arrow keys and `Enter`. It is the only search now: the per-page search box and the All Sections dropdown were retired (the rail's **On this sheet** outline jumps between sections). |
| Filter the current sheet | `/`, and `Esc` clears it |
| Jump to a topic | Top nav menus, or the **Section** dropdown |

**The menus:** Home · Operating Systems (Linux, macOS, Windows, Omarchy) · Editors (Neovim; nano, VS Code, Zed, Cursor) · CLI Tools · Scripting · Networking (InfiniBand, Ethernet, Fiber, Switches) · Remote Management (Redfish, ipmitool, BMC vendor tools: racadm, iLOrest, Supermicro SAA, OneCLI, FreeIPMI, serial consoles) · Hardware (NVIDIA DC, Motherboards, Server internals, Rack & hardware reference: power, cooling, memory, drives, GPU form factors, racks) · DevOps (Containers, Grafana, SRE toolkit: Prometheus, Ansible, Terraform/OpenTofu, Helm, Argo CD, incident response) · Ticketing (Jira). `build-nav-groups.js` builds these tabs from each suite's own menu; edit `TABS` there to move a suite.

## Field notes (More → Field notes)

Field notes have their own page, `notes.html`, opened from **More → Field notes**, from Ctrl+K → "field notes", or from the home page's Document step.


- Type the **Server** you are working on (it becomes the active node workspace, so Rack Targets, the Case Trail and the Case file follow it) and an optional **Ticket**.
- Write in the editor: toolbar or Markdown as you type (`# `, `- `, `1. `, `[ ] `, `> `, ```` ``` ````, `**bold**`, `` `code` ``). **⏱ Log** adds a timestamped line, **⧉ Commands** pastes what you copied (from the Case Trail, passwords masked), **▤ Template** adds the five-step outline.
- **📁 Connect** a folder once (this repo's `cases/` or an Obsidian vault). Each note is written to `<folder>/<server>/<YYYY-MM-DD> <title>.md` with YAML properties (`host: "[[server]]"`, `ticket`, `status`, `tags`), plus a `<server>.md` host note created once, so Obsidian links every note to its server. Without a folder, notes stay as drafts in the browser and **⬇ .md** downloads them.
- A note that looks like it holds a credential (`-P`, `password=`, `curl -u user:pass`, tokens, keys) is not written to disk until you remove it.
- The Case file's **💾 Save to folder** writes `<folder>/<case>/summary.md` the same way (it asks before replacing one).

## Use it on a rack

1. Fill in **Rack Targets** at the top: BMC address, user, password, NIC, HCA, disk and GPU index.
2. Leave **Active** checked.
3. Click any command box to copy it. Your values replace placeholders like `$BMC` and `$DISK` automatically.

Only real commands copy. Reference information such as POST codes, wire colors and keyboard shortcuts is read-only, and `build-reference-rules.js` lists what counts as reference.

Your targets carry across pages, and **Reset** puts them back to defaults.

## The password field

- It's hidden by default, and the eye button shows it.
- It's kept for the current tab only, so you'll re-enter it after closing the tab.
- It only fills 3 commands. `curl -K` commands read `~/.bmc-curlrc`, and `ipmitool -E` commands read `IPMITOOL_PASSWORD` from your shell.
- A copied password stays in your clipboard manager, so clear it after use.

## Other tools

- **Triage & RMA:** gives you a crash-cart diagnostic script and a formatter for RMA tickets.
- **Explain a command (🔍 Explain button, or `e`):** paste a command from a ticket, a vendor KB, a chat or someone's history. It's split into stages (`|`, `&&`, `;`, new lines, and the command inside `ssh host '…'`), and each tool, subcommand and flag is explained from the sheets' own flag notes (`flag-index.js`, built by `build-index.js`), then from the offline manuals. Bundled flags like `-czf` are split. A verdict on top says whether it changes state, never returns, runs a script from the internet, holds a password or token in clear (with **Copy the safe version**, which swaps it for `-E`, `$BMC_PASS` or `$TOKEN`), has unfilled placeholders, runs as root, writes files, or targets another machine. Hover a word to light up its explanation; **📌 Pin to case** files the breakdown. Pasting a command into the home page's "What's broken?" box or Ctrl+K offers it too.
- **Rack view (▤ Rack in the top bar, ▤ on the Shift board, Ctrl+K → "rack view" or "where is gpu-node07", or "Where is it?" on the home page):** paste your inventory once (spreadsheet or CSV rows: host, rack, U or a range like 24-27, height; optional row, type, model, serial, bmc) and every rack is drawn as an elevation at the real U positions, grouped by row. Devices with a node workspace are outlined, and their last Node checkup shows as a green/amber/red dot. Search a host or serial for its location in words ("Row 3 · rack R13 · U11–U14 (4U) · counted from the bottom"); flip a rack to "U1 top" if its rails number from the top. Click a device to **work on it** (starts its node workspace and puts its BMC in Rack Targets), copy the `chassis identify` command that blinks its ID LED, copy its location for the ticket, or open the front panel of a known switch model. Two devices in the same U are flagged. The inventory is saved in this browser only.
- **Switch front panel (▦ on switch sheets, or Ctrl+K → "front panel" / "cable check"):** two jobs that go wrong at the rack. **Find a port**: pick the switch model, type a port name the way the switch prints it (`Ethernet14`, `Et33`, `swp7`, `ib 1/14/2`), and the cage lights up on a drawing of the real front panel, with where it is ("1st column, row 3 of 4, directly below 2") and how that switch counts its ports. Layouts come from the vendors' own front-panel figures: Arista 7060DX5-64E, 7060PX5-64E, 7060DX5-32, 7060DX5-64S (2RU: 33 sits under 2), and NVIDIA QM9700/QM9790 (two NDR ports per cage); two generic patterns are labelled as patterns, not drawings. **Cable check**: paste the wiring manifest (CSV or spreadsheet rows: switch, port, host, nic) and the switch's LLDP output (Arista `show lldp neighbors`, SONiC `show lldp table`, NX-OS-style tables, or `lldpctl` blocks); every port is classed correct / wrong NIC / wrong server / swapped / in the wrong port / no neighbor / not in the manifest, painted on the panel, and turned into a tick-off fix list you can copy or pin to the case.
- **Switch Rosetta (`Shift+R` on a switch sheet, or the Switch tab in the Rosetta):** the same task across Arista EOS, Cumulus NVUE, Cisco NX-OS, SONiC and NVIDIA Quantum MLNX-OS, plus the server end of the same link (`ethtool`, `lldpctl`, `ip`, using your Rack Targets `$IFACE` and `$HCA`). Rows: version, port status, optics DOM, error counters, LLDP, find a MAC, PSUs/fans/temps, serials, logs, BGP or the IB Subnet Manager, and the risky ones (bounce a port, clear counters, save config) in red. Paste a switch's `show version` to detect the OS. Commands the vendor reference didn't confirm are marked **check on your release**; InfiniBand gaps (no LLDP, no MAC table) say what to use instead.
- **BMC Rosetta (`Shift+R`):** one matrix for the dozen jobs every BMC does (power state, event log, sensors, power draw, serials, firmware, console, support bundle, shutdown, power cycle, clear SEL, BMC restart). Columns are ipmitool, FreeIPMI and Redfish plus your vendor's own CLI (racadm, iLOrest, OneCLI or SAA). Pick the vendor, or paste `dmidecode -s system-manufacturer` output to detect it; it's remembered per node and also read from the last Node checkup. Redfish paths use the vendor's IDs (Dell `System.Embedded.1`). Click a command to copy it with Rack Targets filled in; state-changing ones are marked red. **Compare all 7 tools** shows every column. It opens from the strip on BMC sheets, from Ctrl+K, and from the Identify step on the home page.
- **Change plan (+ Change plan on any red ⚠ command, More → Change plan, Ctrl+K → "change plan", or Home → Isolate):** a method of procedure for state-changing work, one per node workspace. Adding a change fills in pre-checks (drain state, plus the SEL or service state before), verify steps and a rollback derived from the command itself: power off ↔ on, Slurm drain ↔ resume, cordon/drain ↔ uncordon, taint ↔ taint-, systemctl stop ↔ start, link down ↔ up, mdadm fail → re-add. Resets, reboots, data wipes and firmware say plainly that there is no undo. The change steps stay locked until every pre-check is ticked and an approval (who, and when) is recorded. Root-only steps are marked "needs root", never prefixed with sudo, and a password typed into a step is swapped for a variable. Export it as Markdown for the ticket, download a `.md`, or pin it to the case.
- **Capture script (⚙ in My kit and the Case trail, or Ctrl+K → "capture"):** turns your kit, your copied commands or the current sheet into one bash script for the node. Only read-only commands go in: anything that changes state, never returns (`-f`, `watch`) or has an unfilled `<placeholder>` is left out, with the reason shown. `sudo` becomes `sudo -n`, each command runs under `timeout` (default 2 min, or `TIMEOUT=` when you run it) with `pipefail`, and each output is saved as `cases/<case>/logs/<UTC time>/NN-name.txt` with the command, time, host and exit code, then tarred. Commands are written as quoted heredocs, so nothing in them is expanded or needs escaping, and passwords stay `$BMC_PASS`: the script checks the variables it needs before it starts. Run it with `bash capture-<case>.sh [case-name]`.
- **My kit (★):** star a command on any sheet to bookmark it. My kit collects them from every sheet, with the current sheet's bookmarks first, and prints them as a pocket card.
- **Manuals:** click **Manuals** or press `M` to search offline manuals by name, category or full text. Ubuntu 24.04 pages come first, and open-source projects fill the gaps. Vendor tools such as `nvidia-smi` aren't included because of their licenses. Keep `man-pages-data.js` with the pages; the offline copy has them built in.
- **Theme:** the theme button in the top bar (or Ctrl+K → "theme") opens a gallery of all 24 themes with previews; click one to apply it. Shift+click the theme button cycles without opening it.
- **Suite landing pages:** every suite hub (Containers, Grafana, BMC tools, NVIDIA DC, InfiniBand…) opens on an overview: what the suite covers, its sheets / commands / how many you've visited, **Practice this suite** and its guided runbooks, then one tile per sheet with its top three commands ready to copy. Where the hub only repeats its sheets, the long list of every card folds behind **Show every command in this suite** (remembered per suite; it opens by itself when you follow a link to a card). Hubs with their own content (Linux, Scripting, Motherboards) keep their cards open.
- **Acronyms:** every acronym in the readable text (BMC, SEL, FRU, DOM, BER, FEC, PFC, MLAG… about 170 of them) has a dotted underline; hover it for what it stands for and one plain line on what it is. Commands, code and the notes editor are never touched, so copying is unchanged. A few depend on the page (UID is the locator LED on IPMI pages, a user ID on Linux pages, a dashboard ID on Grafana pages). Ctrl+K → "what is FEC" answers too.
- **Toolbar:** Search, Triage & RMA, My kit, Explain, Rack, Terminal, Compact and the theme button sit in the top bar; **More** holds Manuals, the 1-file offline copy, Trail (`t`), Practice (`q`), Field notes and the tour.
- **Compact:** fits more on screen by hiding notes, tips, flag explanations and extra command variants. Click **Detailed** on the same button to bring them back. The setting carries across pages. Jira and the Scripting sheets keep their variants, because those are the main content. Searching shows everything hidden, and printing always includes it.
- **Theme menu:** 24 color themes, and your choice is remembered. Everforest is a good pick for long sessions.
- **Print:** `Ctrl+P` prints the current sheet.

## Jira

Open **Jira** in the nav, fill in the form with a node, rack, position or serial, then click a query to copy it. Paste it into Jira's advanced search (JQL). The form values are remembered in your browser. The queries use full-text search, so they work without custom fields. If your Jira has fields like "Rack", the custom field templates are more precise.

## Omarchy and Lua

- **Omarchy** (under the nav) lists your desktop keyboard shortcuts. It's for reading, so there are no commands to copy.
- **Lua** (under Scripting) covers the language and how to edit your Hyprland and Neovim config files.

## Terminal

**Terminal** in the header (or `` Ctrl+` ``) opens a real shell on this jumpbox under the sheet: your login shell with colours, `top`, `less`, `vim`, `ssh`, `ipmitool`, and everything else. It's drawn by xterm.js, vendored in `vendor/xterm/` so it works offline.

A web page can't start a shell, so a small helper does:

1. Start the bridge once per login: `python3 term-bridge.py` (run from this folder). Python standard library only; default port 8767.
2. Paste the token it prints into the dock's **Setup** panel, then click **Connect**. The token is kept in the browser and in `~/.config/dc-cheatsheet/term-token` (mode 0600). `--new-token` rotates it.
3. Hover any command and click **⏎ Send**. It's typed at the prompt with your Rack Targets filled in.

- **Security:** the bridge listens on 127.0.0.1 only. It refuses any connection without the token, and any page that isn't the cheat-sheet (file:// or localhost).
- **Confirmation:** commands that change state ask first.
- **Copy and paste:** Ctrl+Shift+C copies the selection, Ctrl+Shift+V pastes. **^C** sends an interrupt.
- **Save log:** downloads the scrollback as a timestamped `.txt` for `cases/<host>/logs/`. Check it for secrets first.
- **Hiding vs disconnecting:** hiding the dock (▾) keeps the shell running. **Disconnect** or closing the tab hangs it up.
- **Node cockpit (hub):** the right side of "What's broken?" is a live panel for the node you're on. It shows the latest checkup score ring with tallies, a mini GPU tray (one light per GPU, hatched for a lost GPU) with NIC lights, the top three problems, the terminal link, and how old each reading is (amber when over 2 h). Click the ring or tray to reopen the full report. **♥ Run checkup / Re-check** connects and runs. Readings are saved per node workspace (`dc_node_vitals`), so switching nodes switches the cockpit. Built-in samples and demos are never stored.
- **▶ Run on any sheet:** with the terminal connected, read-only commands get **▶ Run** next to **⏎ Send** when you hover them. The command runs at the prompt and its output appears **right under it**, like a notebook cell. The cell shows host, time and line count, flags the first error-looking line in amber, offers the **✦** tool that can read it, and has **Copy**, **📌 Pin** (into the case file) and **↻** re-run. State-changing commands, live views (`watch`, `-f`, `dmesg -w`, `dmon`, loops) and anything with an unfilled `<placeholder>` get no ▶ Run; use ⏎ Send for those.
- **Runbook autopilot:** with the terminal connected, every command step in a guided runbook gets **▶ Run**. It types the command at the prompt (Rack Targets filled in, `sudo` sent as `sudo -n` so a missing password fails fast), shows the output under the step, ticks the step, and suggests a finding from what came back (analyzer verdicts when the output is recognised, otherwise the first warning line). **▶ Run all safe steps** at the top of the runbook walks every such step in order, with **■ Stop**. Some steps are never auto-run: gates (drain + approval), anything the state-change rules flag, live views and long collectors (`watch`, `top`, `-f`, `dmon`, `nvidia-bug-report`, `dcgmi diag`…). Steps with an unfilled `<placeholder>` wait for you to set the value.
- **Node checkup:** **♥ Run checkup** in the hub cockpit (or **♥ Checkup** in the terminal bar, **Node checkup** in step 2 *Collect*, or Ctrl+K → "checkup") runs one read-only sweep at the prompt, with no root needed. It covers the Slurm drain state, GPUs (via the X-ray), error-level kernel messages (via the incident timeline), EDAC ECC counts, InfiniBand port state and rate, NVMe controller state, failed systemd units, and filesystems over 85 %. The result is a scored report card. Each red or amber row opens the tool or runbook that explains it, and the report copies as Markdown or pins to the case. **Copy the command** works without the terminal: paste its output into the hub box. **See a sample report** shows a broken H200 node.
- **Run in terminal:** the Node X-ray's **▶ Run in terminal** types its collection command at the prompt (on whatever host the shell is on, so `ssh` to the GPU node first) and draws the tray from the output. No copy-paste. If the terminal isn't connected, **Connect & run** opens it and runs as soon as the shell is up.
- **Watch live:** once the tray is drawn, **● Watch live** streams `nvidia-smi --query-gpu=… -l 2` through the terminal into it. Every GPU tile gets a scrolling core-temperature trace, with power dashed and the 80 °C line dotted, and the tile colours update as thresholds are crossed. The selected GPU shows **Core now / Range / Peak core / Peak power** with timestamps, and every problem seen during the watch is listed, even ones that cleared. **■ Stop live** sends Ctrl-C. **Copy as Markdown** and **📌 Pin tray to case** include a *Live watch* table, so the peaks reach the RMA. Use it while reproducing a fault under load (after the drain check). The sample tray has **● Watch live (demo load)**, where GPU 3 climbs into thermal slowdown.
- **Read this output:** after any **⏎ Send**, the dock watches the reply. When an analyzer recognises it (GPU table, fleet output, `mlxlink`, `nvme smart-log`, `nvidia-smi topo -m`, dmesg/SEL), a **✦ Read this output as …** button lights up in the dock header and opens the matching tool already filled in.
- **Serial console cables:** run `tio -b 115200 /dev/ttyUSB0` or `screen /dev/ttyUSB0 115200` inside the terminal.

## Sheet layout

On screens 1280px and wider, every sheet has a sticky left rail:
- **Suite list:** every sheet in the suite, with visited ticks and the current one highlighted.
- **On this sheet:** an outline of the cards that follows your scroll; click a section to jump to it.
- **Reference and runbooks:** links to the healthy-ranges and BER panels, and to the suite's guided runbooks.

"What healthy looks like" and "BER" start folded to one line so commands come first. If you open one, it stays open on later visits. The home hub keeps its full Mission Control layout.

## Compare with a known-good node

**⚖ Compare nodes** on the home page opens it. You can also use Ctrl+K → "compare", the sheet rail's Reference block, or **Compare with a healthy node** in the Output Analyzer. Run the same command on a healthy identical node and on the suspect, then paste both outputs.

- **Matching:** fields are matched by structure, not line order:
  - Indented trees: `nvidia-smi -q`, `lspci -vvv`, `dmidecode`, `mlxlink`, `ibstat`, `ethtool -i`, `nvme smart-log`.
  - CSV, by its first column: `nvidia-smi --query-gpu=… --format=csv`.
  - Line lists: `lsmod`, `dpkg -l`.
- **Ranking:**
  - **Critical:** missing devices, error counters worse on the suspect, link/state/mode mismatches and degraded values (`downgraded`, `No Module Installed`, AER flags set).
  - **Check:** firmware and config drift.
  - **Folded away:** noise such as serials, UUIDs, MACs, temperatures, clocks and timestamps.
- **Copy as Markdown:** gives a ticket-ready comparison table.

## Fleet mode (many nodes at once)

The **⇉ Fleet** chip in the Rack Targets bar opens it (also Ctrl+K → "fleet"). Enter nodes and BMCs in pdsh/clush syntax, like `gpu-node-[01-16]`; **Derive** makes `gpu-node-[01-16]-bmc`. With Fleet on, every command you copy comes out fanned out:

- **Node commands:** `pdsh … | dshbak -c`, where identical output folds together so the odd node out stands alone. You can also pick `clush -b` or `ssh` + `xargs -P`, which needs no extra tools.
- **BMC commands (`ipmitool -H`, Redfish):** a sequential `for BMC in …` loop, with `$BMC` as the loop variable.
- **Save output:** optionally saves results under `cases/<node>/logs/`.
- **Badges:** each command shows what it will do: `⇉ ×16`, `⇉ ×16 BMC`, `1 node`, `1 node · changes state` or `run once`.

Some commands never fan out:
- **Copy for one node:** anything that changes state (resets, writes to `/sys`, `setpci` writes, firmware, packages, services, `chassis bootparam`, clearing ECC counts…), plus interactive, streaming and multi-line commands.
- **Copy once:** cluster- and fabric-wide tools (`ibdiagnet`, `iblinkinfo`, Slurm, `kubectl`, `git`), switch CLI, workstation sheets and code snippets.

## Compact header

On screens wider than 768px, the header uses three short lines:
1. **Title, the Search-all pill and the tools** on one row. Tool labels show from 1100px; below that they are icons with tooltips, and counts and status lights stay visible.
2. **Suite nav** on one line. It tightens until it fits: carets go first, then logos.
3. **Rack Targets** on one line, faded at the edge if it overflows.

At 1280×800 the header ends at 141px instead of 313px. The sheet's tagline is now the title's tooltip. Narrower windows keep the stacked header.

## Fleet results (which node is the odd one out?)

After a fan-out, paste what came back. Pasting multi-node output into the home box or Ctrl+K opens it automatically. You can also use **⇉ Fleet results** on the home page, **Read results →** in the Fleet dialog, or Ctrl+K → "fleet results".

- **Formats:** `pdsh` / ssh + xargs lines (`host: …`), `dshbak -c` and `clush -b` blocks, and the Fleet BMC loop (`=== bmc`).
- **Tiles:** one per node, colored green for the baseline, red for a likely fault, amber for "check", and hatched for unreachable. Click a tile to jump to its group.
- **Grouping:** nodes are grouped by output, ignoring temperatures, serials, clocks and the like. The largest group is the baseline. For a grep for errors, where most nodes print nothing, silence is the baseline.
- **Each odd group shows exactly what differs:**
  - **Field changes:** from the Compare engine, for example `pcie.link.width.current 16 → 8`.
  - **Errors only that group printed:** decoded, for example "Xid 79" or "Power supply fault".
  - **Column changes:** for one-line CSV.
- **Unreachable nodes:** listed separately (ssh or IPMI session failures). Nodes in your Fleet list that never answered are flagged too.
- **Follow-up:** **Compare in full →** opens the full node comparison, plus **Copy summary**.

## Case file → summary.md

Every analysis result has **📌 Pin to case**: decoded errors (Ctrl+K), Output Analyzer reports, Incident Timelines, node comparisons and Fleet results. Pins belong to the current node workspace, like the Case Trail, so switching nodes switches cases.

Open the case file from **📁 Case file** in the Trail drawer, Ctrl+K → "case file", the cockpit's **📁 Case**, or the link in Triage & RMA → RMA formatter. It gives you:

- **Status and severity:** a status picker, and a severity worked out from the evidence.
- **Notes:** current hypothesis, root cause and next action.
- **Evidence:** every pin, with chips that copy a serial, part number or BDF found in it into the RMA block.
- **A live `summary.md`:** a header table, then hypothesis, root cause, next action, a timeline merging pins and copied commands, the evidence, the commands run and an RMA block.

**Download summary.md** to save it as `cases/<host>/summary.md`. You can also Copy it. **Close case…** clears the pins and notes and keeps the trail.

## Incident flow (home hub)

Under "What's broken?" the hub shows the team method from AGENTS.md §5 as five connected steps. Each step holds its tools:

| Step | Tools |
|---|---|
| **Identify** | name or switch node, copy the drain check, Rack Targets |
| **Collect** | paste a log, Incident timeline, Terminal |
| **Correlate** | Node X-ray, Compare nodes, Fleet mode, Fleet results |
| **Isolate** | guided runbooks, Cable check, Change plan, healthy ranges |
| **Document** | Field notes, Case file, RMA formatter |

Each card shows live status for the current node, such as `gpu-node-12 · BMC …`, `4 commands run · 2 analyses pinned`, `Fleet on · ×16 nodes`, `GPU missing: 7/13` or `Case: RMA filed`. Finished steps tick green and the next step is highlighted. **+ New incident** starts a fresh node workspace.
