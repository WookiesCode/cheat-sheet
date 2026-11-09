# Improvements: ranked proposals and status

Product review started 2026-11-09. Phases 1–3 are below. Nine items (#8 for the NVIDIA suite) and one follow-up are built.

## Status

| # | Item | Status | Branch | Commit |
|---|---|---|---|---|
| 7 | Versioned test kit and runner | ✅ Built | `improve/test-kit` | `f50e726` |
| 1 | Flag state-changing results in Ctrl+K; Enter twice to copy them | ✅ Built | `improve/search-danger` | `365d8ae` |
| 2 | Keep keyboard focus inside open tools | ✅ Built | `improve/dialog-focus` | `ccbe20f` |
| 6 | Backup & restore (one JSON file) | ✅ Built | `improve/backup` | `f2cc554` |
| 4 | Ask the browser to keep the site's data | ✅ Built | `improve/storage-persist` | `ed1e061` |
| 3 | Say so when a save fails | ✅ Built | `improve/storage-warn` | `cbb0dd9` |
| 5 | Keep keyboard focus out from under the fixed bars | ✅ Built | `improve/focus-visible` | `de6ac2e` |
| 14 | Skip link (found while building #5) | ✅ Built | `improve/skip-link` | `220d5c9` |
| 8 | Source and last-verified date on core suites | ✅ NVIDIA (`3320dc0`) and InfiniBand suites built; others open | `improve/sources`, `improve/sources-ib` | (this branch) |
| 9 | Stop duplicating the nav into every page | Open | | |
| 10 | Practice what I actually use | Open | | |
| 11 | Local usage meter | Open | | |
| 12 | Export My kit as a navi `.cheat` file | Open (needs navi installed: ask first) | | |
| 13 | Make the doc counts agree | ✅ Built | `improve/doc-counts` | (this branch) |

**The branches are stacked**, each built on the one before, in the order of the table, with `improve/sources-ib` on top. Merging `improve/sources-ib` brings in all eleven. None are pushed or merged yet.

**Tests:** `node tests/run-all.js` runs 15 test files. All pass on `improve/sources-ib`. Every built item has its own regression test, and I checked that the tests for #2 and #5 fail on the commit before their fix.

## What the built items changed (measured)

| Item | Before | After |
|---|---|---|
| #1 Search | `mlxlink --port_state TG` was the 2nd result for "mlxlink ber", unmarked; one Enter copied it | Red **⚠ Changes state** tag; the first Enter asks, the second copies; a click opens the sheet without copying |
| #2 Dialogs | Tab left Ctrl+K on the 8th press and Explain on the 6th | Tab and Shift+Tab wrap inside every tool; focus goes back to the opener on close |
| #6 Backup | About 30 storage keys with no way out; localhost and `file://` don't share storage | One JSON file with preview, per-item choice, undo and all-or-nothing writes; no token, password or credential in it |
| #4 Persistence | Browser free to clear everything under disk pressure | Asked once per tab on the first save; the panel shows Kept / Not guaranteed |
| #3 Save failures | A failed save was silent; a pin even reported "Pinned to case" | An amber bar that stays until closed, says why, and links to Backup |
| #5 Focus hidden | Up to 37 fully-hidden Tab stops per page; `j`/`k` hid 36 of 80 at 800 px | 0 fully and 0 partly hidden on every page and size tested |
| #14 Skip link | 287 Tab presses before the first command | 2 key presses (Tab, Enter) |
| #8 Sources (NVIDIA) | 0 of 31 NVIDIA commands cited a source; nothing had been checked against the vendor docs | 31 of 31 show a source line (30 verified, 1 marked Not verified); 8 errors corrected (below) |
| #8 Sources (InfiniBand) | 0 of 51 InfiniBand commands and recipes cited a source | 51 of 51 show one (47 verified, 4 marked Not verified); 9 errors corrected (below), one of them also on an NVIDIA card |
| #13 Doc counts | README "about 200 sheets", guide "235 linked pages", home "214 sheets" | Both docs say "236 pages, 214 of them command sheets with 2,043 commands", rewritten by `build-index.js` on every build |

## Errors found by #8 (corrected 2026-11-09, NVIDIA suite)

Each was checked against NVIDIA's own docs; the card's source line links the page.

| Card | Was | Now |
|---|---|---|
| ECC counters | `nvidia-smi --clear-ecc-error-counts=0/1` (no such option) | `nvidia-smi -p 0` / `-p 1` (`--reset-ecc-errors`); aggregate reset not supported on Ampere+; flagged as a state change (wipes RMA evidence) |
| NVLink counters | `nvidia-smi nvlink -R` "reset" (`-R` is remote link info) | `nvidia-smi nvlink -re`; not supported on NVLink 5 (B200); flagged. Also fixed in the NVLink builder profile |
| GPU reset | "stop Fabric Manager first" on NVSwitch | Only Ampere NVSwitch systems need FM for a reset; Hopper and later don't |
| MIG enable | `-mig 1 && --gpu-reset` | Reset only on Ampere; Hopper+ enables MIG without one |
| MIG profiles | "9 = 3g.40gb on H100" | IDs 9/19 documented for A100 40GB only: read yours with `-lgip`, or pass names (H200: 3g.71gb, 1g.18gb) |
| DCGM run levels | r4 "~60+ min" | r2 < 2.5/10.5 min, r3 < 10/35 min, r4 < 45 min/2.25 h on 4/8 GPUs |
| Fabric Manager | "must match the driver exactly"; SXid "in fabricmanager.log" | Match only before driver 620; SXid in the kernel log, not used on DGX/HGX B200/B300 |
| Labels | "HW Power Brake Slowdown", "Max", `docker run --gpus all …` | "HW Power Brake", "Maximum", `--runtime=nvidia --gpus all` |

Also: `DANGER_RE` now flags `nvidia-smi -p`/`--reset-ecc-errors`, `nvlink -re`/`--reseterrorcounters` and `setpci … =` (PCIe config writes), and no longer flags the read-only `nvidia-smi nvlink -R`.

**Not verified (said on the card):** `lspci` (no vendor doc checked), NVSM commands (NVIDIA's NVSM pages returned no content), `nvidia-ctk system create-dev-char-symlinks`, `NVreg_EnableGpuFirmware=0`, `nvidia-bug-report.sh --output-file`, and the `--query-gpu` / `--query-compute-apps` field names (not on the docs page). Not covered by #8: the NVIDIA builder profiles other than the NVLink reset, e.g. `dcgmi diag -r '…,pulse_test'` (the docs table names the test `pulse`) and the dmon field IDs 140/150/155/393–395.

## Errors found by #8 (corrected 2026-11-09, InfiniBand suite)

Checked against the rdma-core man pages, perftest source, iproute2 `rdma` man pages and NVIDIA's MFT, ibdiagnet and BlueField docs.

| Card | Was | Now |
|---|---|---|
| perftest (3 commands + builder) | `--ipv6` with an IPv6 server address | `--ipv6-addr` on **both** server and client. `--ipv6` only picks an IPv6 GID (perftest source: `ai_family = AF_INET6` is set by `--ipv6-addr`). **The NVIDIA `ib_write_bw` card had the same mistake** and was marked verified in the NVIDIA round; corrected here with a note |
| ibdiagnet | `--ber_test` | `--get_phy_info`: NVIDIA says `--ber_test` is SwitchX/ConnectX-3/4 only. `--get_cable_info` is marked deprecated |
| perfquery recipe | `--oprcv`, "per-VL congestion counters" | `--oprcvcounters`: receive counters per opcode (optional) |
| mlxlink PRBS | `--rx_prbs PRBS31 --tx_prbs PRBS31` | adds `--test_mode EN` (every NVIDIA example has it); end with `--test_mode DS` |
| BlueField-3 | `q INTERNAL_CPU_MODEL INTERNAL_CPU_OFFLOAD_ENGINE`; "AC power cycle required" | BF3 uses `INTERNAL_CPU_OFFLOAD_ENGINE` only (0 = DPU, 1 = NIC); Arm and NIC reset, power cycle *recommended* |
| bfb-install | `--bfb … --rshim rshim0` | `bfb-install -r rshim0 -b <file>` |
| saquery `-s` | "SMInfo records" | PortInfo records of ports with the isSM bit (Master and Standby SM ports) |
| mlxfwreset / mlxconfig | `-y r`; "reboot/mlxfwreset applies mlxconfig" | `reset -y` (NVIDIA's form); NVIDIA says reboot to apply mlxconfig changes |
| Smaller | ibqueryerrors `-K`, iblinkinfo/ibtracert `-G`, mlxlink `-p` on adapters, rshim `misc` | Described as the man pages and MFT docs say |

`DANGER_RE` now also flags `mlxconfig … s` / `r` / `reset` (the BlueField mode switch used the short `s` and copied with no warning), `mlxlink --test_mode` and `bfb-install`.

**Not verified (said on the card):** `show_gids` (not in the MLNX_OFED docs read), `ibhosts -C/-P` (shared options, not on its page), the OpenSM service name, ibdiagnet's `-E-`/`-W-` prefixes. Notes also flag `LINK_TYPE_P1=1` = IB (only 2 = ETH is documented) and the default ibdiagnet output directory.

## Found while building (not fixed)

| Finding | Where | Note |
|---|---|---|
| Explain describes `nvidia-smi -d` as "g. ECC,POWER." | `build-help-pages.js` (help capture parsing) | The `--help` text seems to be split at "e.g.". It probably affects other flags too |
| Two "could not keep" toasts can never appear | `fnSave` and `pbWrite` in `common.js` | `guardStorage()` swallows the error first. The #3 bar replaces them; they can be removed |
| Tour "What's new" not updated | `TOUR_VERSION` in `common.js` | Returning users get no prompt about the built items; `docs/site.md` documents them |
| Original test scripts left behind | `backups/scratch/t-*.js` | Stale copies of what is now in `tests/`. Safe to delete (ask first) |
| `scroll-padding` alone doesn't stop focus hiding in Chrome | `styles.css` | Tested: Chrome doesn't scroll an element that is already partly in view. Hence the script in #5 |

---

## 1. The product today

**User (inferred; the Context block was left blank):** one datacenter technician (the repo owner) working from a Linux laptop or jumpbox. They are keyboard-first, sometimes air-gapped, triaging H200/B200 GPU nodes, InfiniBand/RoCE fabrics, storage and BMCs, and they are learning the scripting languages along the way. The site is laptop-only (no phone layout) and offline-first (`datacenter-cheatsheet-portable.html`).

**What I ran:** I served the repo at `127.0.0.1:8765` and drove headless Chrome through the home page, Ctrl+K search (hit, decode and empty cases), a sheet at 1280 and 800 px, keyboard Tab inside dialogs, and the portable file. I also re-ran the existing checks in `backups/scratch/` (now in `tests/`).

| Measurement | Result |
|---|---|
| Page errors, 404s, console errors (home, linux, nv-smi, notes, tools, portable) | none |
| Load time per page (DCL / load) | 141–256 ms / 220–270 ms |
| Horizontal overflow at 700 / 900 / 1024 / 1280 px | 0 of 236 pages |
| Portable file load (`file://`) | 204 ms, 18 MB heap |
| DOM per sheet page | ~226 KB, of which the `<header>` is ~153 KB |

### Core jobs and how well each is served

| # | Job | How well it worked at review time |
|---|---|---|
| J1 | **Find the right command fast** (Ctrl+K, nav, sheets) | **Strong.** Search is fast, decodes `xid 79`, and has a useful empty state. Gaps: search results didn't show which commands change state (#1), and keyboard users had to pass 287 stops to reach content (#14). |
| J2 | **Copy commands safely**: targets filled, root handled, mutations flagged | **Strong on sheets, weaker elsewhere.** Sheets, the decoder and the runbooks flagged state changes; the palette did not (#1). |
| J3 | **Triage a node end to end** (decode, checkup, X-ray, fabric map, runbooks, case file) | **Very broad.** 108 visible buttons on the home page alone, so discoverability is now the limit, not missing features. |
| J4 | **Keep evidence and notes** (case file, field notes, trail, kit, rack inventory) | **At risk** (now addressed by #6, #4 and #3). There was no backup, failed writes were silent, and localhost and `file://` don't share storage. |
| J5 | **Learn and trust the material** (practice, Explain, acronyms) | **Good learning tools, uneven provenance.** The core NVIDIA, Redfish and IPMI generators carry 0 source links (#8). |

## 2. Research notes

- **Comparable tools.** [navi](https://github.com/denisidoro/navi) (an interactive cheatsheet CLI, latest release 2.24.0) uses `<var>` placeholders with `$ var: <command>` lines that suggest values. This site already has the equivalent in Rack Targets and slot chips, and it goes well past navi on triage. tldr, devhints and explainshell are narrower. Users of those tools expect provenance ("where does this come from?"), and this site lacks it on its core suites.
- **Accessibility, WCAG 2.2.** The APG modal dialog pattern says Tab and Shift+Tab stay inside an open modal and the page behind it is inert ([APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/)). SC 2.4.11 *Focus Not Obscured* says sticky author content such as a fixed footer must not hide the focused item ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured)).
- **Storage.** A granted `navigator.storage.persist()` exempts the whole origin from eviction, including `localStorage` ([web.dev](https://web.dev/articles/persistent-storage)). Eviction deletes an origin's data all at once ([MDN](https://developer.mozilla.org/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)). Chromium grants or denies it silently by engagement and bookmarks; Firefox shows a prompt, so it shouldn't be asked on page load. `localhost` and `file://` both count as secure contexts. Each is its own origin, so they keep separate storage (confirmed in this run).
- **Core Web Vitals** matter little here. Pages are local and load in ~250 ms, so performance is not a user problem today.

## 3. Ranked list

Impact (H/M/L) · Effort (S/M/L) · Risk (H/M/L). The ranking is by user impact relative to effort.

### Quick wins

**1. ✅ Flag state-changing commands in Ctrl+K search, and make Enter confirm before it copies one**
- **Why:** J2. Search is the main way in, and it was the one place a bounce or reset copied with no warning.
- **Evidence:** searching `mlxlink ber` returned `mlxlink -d mlx5_0 --port_state TG` (a port bounce) as result #2 and the PRBS test as #3, with no marker. The renderer never checked `DANGER_RE`, while the hub tiles, trail and case file all did.
- Impact **H** · Effort **S** · Risk **L** · Built: `improve/search-danger`, `tests/search-danger.test.js`.

**2. ✅ Keep keyboard focus inside open dialogs and return it on close**
- **Why:** J1/J3 for a keyboard-first user. Tabbing out of Ctrl+K or Explain landed on header buttons hidden under the backdrop.
- **Evidence:** 28 `aria-modal` dialogs, no focus-wrap code, no `inert` usage.
- Impact **H** · Effort **S–M** · Risk **L** · Built: `improve/dialog-focus`, `tests/dialog-focus.test.js`. Pinned and docked tools are not trapped.

**3. ✅ Say so when something didn't save**
- **Why:** J4. A full or blocked store lost a pin, a note or a case edit with no sign.
- **Evidence:** `guardStorage()` patched `Storage.prototype.setItem` to swallow every error, which made the 545 sheet-script saves and every write in `common.js` silent.
- Impact **M** · Effort **S** · Risk **L** · Built: `improve/storage-warn`, `tests/storage-warn.test.js`. It is a persistent bar, not a toast, because the caller's success toast would replace a toast at once.

**4. ✅ Ask the browser to keep this site's storage**
- **Why:** J4. It reduces the chance that eviction silently wipes cases and notes.
- Impact **M** · Effort **S** · Risk **L** · Built: `improve/storage-persist`, `tests/storage-persist.test.js`. It asks once per tab on the first save, never on page load.

**5. ✅ Keep focused items clear of the fixed bars**
- **Why:** J1, WCAG 2.2 SC 2.4.11.
- **Evidence (confirmed before building):** three causes. Shift+Tab onto an element already partly in view (Chrome doesn't scroll it); `j`/`k` checking only the bottom 10 px of the window; and the header's z-index 40 stacking context capping its open menus under the pager.
- Impact **M** · Effort **S** · Risk **L** · Built: `improve/focus-visible`, `tests/focus-visible.test.js`.

**14. ✅ Skip link (found while building #5)**
- **Why:** J1, WCAG 2.2 SC 2.4.1. It took 287 Tab presses to reach the first command on a sheet.
- Impact **M** · Effort **S** · Risk **L** · Built: `improve/skip-link`, `tests/skip-link.test.js`. It also fixed `fnhReveal` scrolling tall sections under the command bar.

### Bigger bets

**6. ✅ Back up and restore everything: one JSON export and import**
- **Why:** J4. This is the only way to move work between the localhost site and the portable copy, or to another laptop, and to survive a browser reset.
- Impact **H** · Effort **M** · Risk **M** · Built: `improve/backup`, `tests/backup.test.js`.
- ⚠ **Flag (data format):** the backup file is format `version: 1`. It contains only this site's own keys: `dc_*`, `cs_*`, `linux_cs*`, `jira_cs_*`, `mb_sheet_*` and `*_bookmarks`. **A new storage key outside these prefixes will not be backed up**, so name new keys `dc_*`.

**7. ✅ Put the test kit under version control, with one runner**
- **Why:** reliability for every job. The checks lived in the git-ignored `backups/scratch/`.
- Impact **H** · Effort **M** · Risk **L** · Built: `improve/test-kit`. It also fixed `xss.test.js`, which could never pass: it counted its own positive control as an attack.

**8. Show source and last-verified date on the core datacenter suites**
- **Why:** J5 and J2. Your own rule is "check every command against vendor docs", but the sheets that matter most don't say where a command came from.
- **Evidence:** `generate-nvidia-suite.js`, `generate-redfish-suite.js`, `generate-ipmi-suite.js` and `generate-bmc-tools-suite.js` each have 0 source URLs. Newer suites (grafana, sre, containers) carry "verified" notes, and the DCGM rename (dcgm-exporter 4.9.0) shows how fast this material drifts.
- **Plan:** add an optional `src` field (`{url, verified}`) to card data. It renders as a small "Source · verified 2026-11" link and turns amber after 12 months. Fill in NVIDIA first, verified by web search per card.
- Impact **H** · Effort **L** (the research is the cost, so this is incremental by suite) · Risk **L**.
- ✅ **Built for the NVIDIA suite** (`improve/sources`, `tests/sources.test.js`): an optional `src` field on a command, carried by `build-index.js` into the search index and drawn by `common.js`, so any suite only needs data. Checking the 31 commands found 8 errors (table above).
- ⚠ **Flag (schema):** the optional `src` field is a new, additive part of the card data and of the search-index entries.
- ✅ **InfiniBand** done on `improve/sources-ib` (51 commands and recipes, 9 errors fixed).
- **Next:** Redfish/IPMI, then the BMC tools, one suite at a time.

**9. Stop duplicating the full nav into every page**
- **Why:** mostly maintenance and the portable file's size. The direct user gain is small, because pages already load in ~250 ms.
- **Evidence:** the header is ~153 KB of a ~226 KB page, repeated across 237 pages, and the portable file is ~18.2 MB.
- **Plan:** emit the nav once (in `common.js` or a `nav.js` data file), render it at load, and keep a minimal static fallback.
- Impact **L–M** · Effort **L** · Risk **M** · Files: `build-nav-groups.js`, 8 generators, `common.js`, every `*.html`.

### Innovative ideas

**10. "Practice what I actually use"**
- **Why:** J5. It drills the commands you copied on real tickets, not a random draw from 2,043.
- **Plan:** a "From my trail" source in Practice, seeded from Case Trail entries across node workspaces, using the same Leitner boxes.
- Impact **M** · Effort **S** · Risk **L** · Files: `common.js`.

**11. A local usage meter to guide what to keep**
- **Why:** J3. The site keeps growing (24 themes, about 20 tools, 108 home buttons), and you have done redundancy cleanups before.
- **Plan:** count opens per tool and sheet in `localStorage` only (never sent anywhere; name the key `dc_*` so the backup includes it). The Workbench gets an "Unused in 30 days" fold.
- Impact **M** · Effort **S–M** · Risk **L** · Files: `common.js`.

**12. Export My kit as a navi `.cheat` file**
- **Why:** J1 from inside tmux and ssh, without the browser. A **data export only**; it doesn't revive the removed TUIs.
- **Evidence:** navi's syntax is `% tags`, `# description`, the command line, `<var>` placeholders and `$ var: <suggest-cmd>` lines ([syntax doc](https://github.com/denisidoro/navi/blob/master/docs/cheatsheet/syntax/README.md)).
- Impact **M** · Effort **S** · Risk **L** · Files: `common.js`.
- ⚠ **Ask:** navi isn't installed here, and installing it is a package change. Its default cheat directory isn't confirmed yet.

**13. ✅ Make the doc counts agree**
- **Why:** trust in J5. The README said "about 200" sheets, `docs/site.md` said "235 linked pages", and the home hero said "214 sheets". They counted different things: 236 pages, of which 214 hold commands.
- Impact **L** · Effort **S** · Risk **L** · Built: `improve/doc-counts`. `build-index.js` writes the counts between `<!-- counts -->` markers, counting the way the home page does; `tests/doc-counts.test.js` compares them with the live home page.

## Recommended next
**#8 for Redfish and IPMI** (DMTF Redfish spec + ipmitool man page), then the BMC vendor tools. A suite whose generator builds commands field by field (as InfiniBand's did) needs a one-line `src` pass-through first.

Considered and dropped: a shift handoff export (it already exists: "Shift board & handoff" in `common.js`), a phone layout (laptop-only by your decision), and variable prompts in the style of navi (Rack Targets and slot chips already do this).

## Sources
- [navi: cheatsheet syntax](https://github.com/denisidoro/navi/blob/master/docs/cheatsheet/syntax/README.md)
- [navi releases](https://github.com/denisidoro/navi/releases)
- [WAI-ARIA APG: Dialog (Modal) pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/)
- [W3C: Understanding SC 2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured)
- [W3C: What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [MDN: StorageManager.persist()](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist)
- [MDN: Secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts)
- [web.dev: Persistent storage](https://web.dev/articles/persistent-storage)
- [NVIDIA nvidia-smi documentation](https://docs.nvidia.com/deploy/nvidia-smi/index.html)
- [NVIDIA DCGM diagnostics](https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-diagnostics.html)
- [NVIDIA DCGM field IDs](https://docs.nvidia.com/datacenter/dcgm/latest/dcgm-api/dcgm-api-field-ids.html)
- [NVIDIA Fabric Manager user guide](https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html)
- [NVIDIA Xid catalog](https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html)
- [NVIDIA MIG user guide: getting started](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/getting-started-with-mig.html)
- [NVIDIA MIG supported profiles](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/supported-mig-profiles.html)
- [NVIDIA driver persistence daemon](https://docs.nvidia.com/deploy/driver-persistence/persistence-daemon.html)
- [CUDA runtime API error types](https://docs.nvidia.com/cuda/cuda-runtime-api/group__CUDART__TYPES.html)
- [NCCL GPU troubleshooting](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html)
- [NCCL environment variables](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html)
- [GPUDirect RDMA](https://docs.nvidia.com/cuda/gpudirect-rdma/index.html)
- [perftest](https://github.com/linux-rdma/perftest)
- [nccl-tests](https://github.com/NVIDIA/nccl-tests)
- [nvbandwidth](https://github.com/NVIDIA/nvbandwidth)
- [NVIDIA Container Toolkit sample workload](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/sample-workload.html)
- [Slurm scontrol](https://slurm.schedmd.com/scontrol.html)
- [rdma-core infiniband-diags man pages](https://github.com/linux-rdma/rdma-core/tree/master/infiniband-diags/man)
- [ibv_devinfo man page](https://github.com/linux-rdma/rdma-core/blob/master/libibverbs/man/ibv_devinfo.1)
- [iproute2 rdma-link](https://man7.org/linux/man-pages/man8/rdma-link.8.html) · [rdma-resource](https://man7.org/linux/man-pages/man8/rdma-resource.8.html) · [rdma-system](https://man7.org/linux/man-pages/man8/rdma-system.8.html)
- [perftest man page](https://github.com/linux-rdma/perftest/blob/master/man/perftest.1) · [perftest_parameters.c](https://github.com/linux-rdma/perftest/blob/master/src/perftest_parameters.c)
- [NVIDIA MFT 4.33 documentation](https://networking-docs.nvidia.com/mftswum/4330)
- [ibdiagnet basic commands](https://networking-docs.nvidia.com/ibdiagnetutilityum/2.27.0/basic-commands) · [ibdiagnet output files](https://networking-docs.nvidia.com/ibdiagnetutilityum/2.27.0/ibdiagnet-dump-files)
- [BlueField modes of operation](https://networking-docs.nvidia.com/bsp/4.16.0/modes-of-operation) · [BlueField RShim](https://networking-docs.nvidia.com/bsp/4.16.0/soc-management-interface-rshim)
- [MLNX_OFED RoCE](https://networking-docs.nvidia.com/mlnxofedswum/24.10-5.1.6.1lts/rdma-over-converged-ethernet-roce)
