# Improvements: ranked proposals and status

Product review started 2026-11-09. Phases 1–3 are below. All 14 items are built (#8 across 11 suites).

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
| 8 | Source and last-verified date on core suites | ✅ NVIDIA, InfiniBand, Redfish, IPMI, BMC vendor tools, switches, Ethernet, Linux storage and hardware, hardware reference, Kubernetes and GPU containers | `improve/sources-*` | `3320dc0` … `7ab92ed` |
| 9 | Stop duplicating the nav into every page | ✅ Built | `improve/nav-once` | (this branch) |
| 10 | Practice what I actually use | ✅ Built | `improve/practice-trail` | `f8e0111` |
| 11 | Local usage meter | ✅ Built | `improve/usage-meter` | `6722fb1` |
| 12 | Export My kit as a navi `.cheat` file | ✅ Built | `improve/navi-export` | (this branch) |
| 13 | Make the doc counts agree | ✅ Built | `improve/doc-counts` | `0d6d0f5` |

Every built item up to #8 is fast-forward merged to `main` and pushed to GitHub (`7ab92ed`, 2026-11-09). #9 is on `improve/nav-once`.

**Tests:** `node tests/run-all.js` runs 21 test files; all pass on `improve/nav-once`. Every built item has its own regression test, and I checked that the tests for #2 and #5 fail on the commit before their fix.

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
| #9 Nav once | The same 142 KB nav copied into 235 pages: HTML 52 MB in all, `nv-smi.html` 146 KB | One copy in `nav/nav-source.html` → `nav.js` (144 KB, cached once); each page carries a 6.4 KB fallback: HTML 22 MB, `nv-smi.html` 11 KB. Menus in place before DOMContentLoaded |
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

**Not verified (said on the card):** `lspci` (no vendor doc checked), NVSM commands (NVIDIA's NVSM pages returned no content; removed in #33), `nvidia-ctk system create-dev-char-symlinks`, `NVreg_EnableGpuFirmware=0`, `nvidia-bug-report.sh --output-file`, and the `--query-gpu` / `--query-compute-apps` field names (not on the docs page). NVIDIA builder presets checked 2026-11-09 (`improve/small-fixes`): **no change needed**. The DCGM field IDs match what the presets say (140/150 temperatures, 155 power, 393–395 row remapping, 1009/1010 PCIe bytes), and `pulse_test` is right: every `dcgmi diag -r` example and the config key use `pulse_test` (only the test table writes `pulse`). The earlier suggestion to rename it was wrong.

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

## Host reboot/shutdown commands made reference-only (2026-11-09, `improve/reboot-reference`)

Requested before further work: remove commands that reboot or crash a system. **No kernel-crash commands exist on the site** (no sysrq, `/dev/mem` or PCI-remove commands). Of the reboot/power commands, the chosen scope was **host OS reboot/shutdown only, kept as non-copyable reference**: 10 entries (4 commands: `systemctl reboot --firmware-setup`, `efibootmgr -n 0004 && reboot`, in-band `ilorest reboot PushPowerButton/ForceOff`, Windows `shutdown /r /fw|/o /t 0`). Kept copyable (red, state-changing): out-of-band BMC power control (~25), BMC/switch reloads (~14) and GPU/PCIe resets (7). Practice no longer drills reference entries, and My kit shows no Copy button for them.

## Errors found by #8 (corrected 2026-11-09, Redfish and IPMI)

Checked against the DMTF Redfish Specification DSP0266 1.25.0 (PDF text; the HTML returns 403 to automated fetches), the DMTF JSON schemas, the curl docs, NVIDIA's DGX Redfish pages, and the ipmitool man page and source.

| Card | Was | Now |
|---|---|---|
| ipmitool lan6 | `lan6 set 1 enabler ipv6_only`; `addr_src` | `lan6 set 1 enables ipv6` (`ipv4`/`ipv6`/`both`); there is no `addr_src` |
| ipmitool bootparam | `options=no-timeout` "keeps the boot flag" | Marked **Not verified**: ipmitool's source rejects it as written (rewritten in #28) |
| ipmitool SEL clock | `sel time set now` | `sel time set "mm/dd/yyyy hh:mm:ss"` |
| ipmitool chassis status | `power-overload`, `power-interlock`, `power-fault` | `overload`, `interlock`, `fault`, `command` (as printed) |
| ipmitool user | sample password `'NewStrongPass!'` | `'<new-password>'` placeholder (never copied unfilled) |
| Redfish `$only` | `$only` | the parameter is `only` (no `$`) |
| Redfish ETag | "412 → send `If-Match: *`" | 428 = If-Match missing, 412 = stale ETag: send a fresh one |
| Redfish BIOS settings | "`/Bios/Settings` is the staging URI" | read it from `@Redfish.Settings.SettingsObject` |
| Redfish HGX | `/Chassis/HGX_GPU_SXM_1`; "readable with the host off" | `/Systems/HGX_Baseboard_0/Processors/GPU_SXM_<n>` (NVIDIA DGX docs); host-off claim dropped |
| Redfish schema | ProcessorType `DPU`; TaskState `Killed`; Thermal/Power as current; DeviceLocator | no DPU type; `Killed` deprecated for `Cancelled`; Thermal/Power deprecated (ThermalSubsystem/PowerSubsystem/Sensors); DeviceLocator deprecated |
| curl `-g` | "always needed for [IPv6]" | curl accepts numeric IPv6 without it (kept, harmless) |

**Confirmed, worth knowing:** ipmitool `-E` reads `IPMITOOL_PASSWORD` first, then `IPMI_PASSWORD`, so the site and AGENTS.md are right.

**NMI commands made reference-only (user decision):** Redfish `ResetType: Nmi` and `ipmitool chassis power diag` deliberately panic the host kernel; the earlier claim "no kernel-panic commands on the site" was wrong because the scan missed BMC-injected NMIs. `chassis power diag` moved out of the `chassis identify` box into its own recipe so the identify commands stay copyable.

**Test flake fixed:** `focus-visible` and `dialog-focus` used `window.scrollTo(0, 0)`, which animates on this site (smooth scrolling); a `j` pressed mid-animation could leave the focused command under the footer. They now scroll with `behavior: 'instant'`.

**Not covered:** the Redfish builder's vendor presets (e.g. `hgx: HGX_Chassis_0 / HGX_BMC_0`), and `rf-firmware-inventory`'s `Updateable` (SoftwareInventory schema not read).

## #8 for the BMC vendor tools (2026-11-09, `improve/sources-bmc-tools`)

All 107 commands and recipes on the racadm, iLOrest, SAA, OneCLI, FreeIPMI and serial-console sheets now cite their source: Dell iDRAC9 7.xx RACADM guide, HPE iLOrest 7.4.0.0 guide, Supermicro SAA for UEFI guide 1.1.0 (PDF, text extracted locally) and product page, Lenovo OneCLI docs, FreeIPMI man pages (Debian trixie copies, 1.6.15, because gnu.org rate-limited fetches), picocom(1), ser2net README, conserver console(1)/conserver.cf(5). This suite had been fact-checked on 2026-11-07, and it showed: **no command errors**, only wording fixes:

- OneCLI `--type AEL|PEL|ALL` is documented for the clear commands; `ospower` is "5.2.0 and earlier" (not "replaced in 5.3.0").
- ser2net's README path is `/etc/ser2net/ser2net.yaml`.
- iLOrest `firmwareupdate` takes `.bin` images only.

**Not verified (said on the card):** SAA `GetBmcCfg` and the `-l` host list (not in the UEFI guide; the OS guide was not found), and four standard Linux helpers on the serial sheet (`ls /dev/serial/by-id`, `dmesg | grep tty`, `id -nG`, `systemctl status ser2net`). Notes flag the unconfirmed details: racadm's 100-record default, OneCLI `config save --file` and `update scan --output`, the FreeIPMI host range with a suffix, and what `ipmi-chassis --get-chassis-status` prints.

`generate-suite-kit.js` now passes `src` through, so the hardware-reference and SRE suites (also built on it) only need data.

## #8 for the switch and Ethernet sheets (2026-11-09, `improve/sources-switches`)

All 67 switch commands and recipes (15 sheets: Quantum MLNX-OS and in-band, Cumulus NVUE, Arista EOS, Cisco NX-OS, SONiC) and all 21 Ethernet/Linux commands now cite a source: MLNX-OS 3.12.6200 LTS manual, NVIDIA MFT 4.33, rdma-core man pages, Cumulus Linux 5.18 and the NVUE command reference, Arista EOS 4.37 manual, Cisco NX-OS 10.5 show command reference, SONiC Command-Reference.md, man7.org (ethtool, ip-*, bridge, ping, pcap-filter, networkctl, resolvectl), netplan docs, nmcli docs, the kernel bonding doc, iperf3, ndisc6/rdisc6 and lldpctl man pages. `generate-switches-suite.js` and `generate-ethernet-suite.js` now pass `src` through.

| Was | Now | Why |
|---|---|---|
| `interface ib 1/1 split` | shut the port, then `module-type qsfp-split-2` in its interface mode | MLNX-OS has no `split` command; splitting deletes the port's config |
| `show ib smgoing` | `sminfo` from a host | not in the MLNX-OS manual |
| `ib sm` / `ib sm enable` | `ib smnode <sm-node> enable` | NVIDIA's example: `ib smnode my-sm enable` |
| `nv config apply -y` (4×) | `nv config apply --assume-yes` | NVUE's flag is `--y` / `--assume-yes` |
| `nv config rollback <rev>` | `nv config apply <rev>` (or `--confirm` for auto-rollback) | no `rollback` subcommand |
| `nv config show -o commands` | `nv config translate revision <rev>` (Cumulus 5.12+) | `-o` takes auto/json/yaml/native only |
| `nv show vrf default router nexthop neighbor` | `nv show interface neighbor` | the NVUE neighbor table (5.7+) |
| `vtysh -c 'show bgp summary'` | `vtysh -c 'show ip bgp summary'` | the form NVIDIA's BGP page uses |
| Arista `show interfaces counters errors nz` (sheet + builder) | `show interfaces counters errors` | EOS documents no `nz` filter |
| Arista `show logging last 50` | `show logging 50` | `last` takes time units, not a count |
| SONiC `sfputil show eeprom -d -p` (sheet + builder) | `show interfaces transceiver eeprom --dom` | the documented DOM command |
| SONiC "status shows FEC" | `show interfaces fec status` | `show interfaces status` has no FEC column |
| `ip -6 neigh flush all` | `ip -6 neigh flush dev eth0` | flush takes the same selectors as show |
| "lldpctl transmits LLDP" | the lldpd daemon sends/receives; lldpctl only displays | lldpctl(8) |
| netplan `chmod 600` "silences a warning" | security advice: keep netplan YAML unreadable by others | netplan docs |

**Not verified (said on the card, 12):** MLNX-OS `show interfaces ib transceiver` (all ports), `… counters`, `clear counters`, port `description`, `show cables`, `show inventory && show version`, `show images` / next-boot partition; `smpquery` (not checked); Arista `bash ethtool -m Ethernet1`, `show version && show boot-config`, `show running-config interfaces`; the RJ45 T568A/B chart (TIA-568 is paywalled). Notes flag the rest (e.g. the NX-OS `++`/`+` DOM legend, `show ipv6 neighbor <addr>` on NX-OS, Aggregator ID in `/proc/net/bonding`, iperf3's Retr column).

**Not covered:** the per-page tip/flag cards (they are quick-reference rows; four wrong rows were corrected anyway), Cumulus `nv show interface --view lldp` and `nv show router arp` there (not checked), and the Switch Rosetta table in `common.js`.

## #8 for the Linux storage sheets (2026-11-09, `improve/sources-storage`)

All 9 commands on the two Linux storage sheets (`nvme-smart`: NVMe, SMART, mdadm, drive LEDs; `storage`: df/du, lsblk/findmnt, LVM, dd/parted) now cite a source: the nvme-cli docs (and the Debian nvme-cli 2.13 page for `id-ns -H`), smartctl(8), mdadm(8), update-initramfs(8), ledctl(8) (ledmon 0.97), lsscsi(8), multipath(8), blkdiscard(8), and man7.org for df, du, dd, lsblk, findmnt, blkid, mount, lvextend, lvs, mke2fs and tune2fs, plus the GNU Parted manual and the ncdu manual. The data lives in `app.js`, whose Linux sheets keep recipes inside their command's card, so one line covers a command and its recipes; it shows on the sheets and on the Linux hub.

| Was | Now | Why |
|---|---|---|
| `dd … oflag=sync`, "synchronize … before exiting" (storage sheet and the CLI-tools dd flag row) | `dd … conv=fsync` | dd(1): `oflag=sync` makes every write synchronous; `conv=fsync` writes data out before dd finishes |
| `fw-commit --action=1` "activate it on slot 1" | activates at the next controller reset (`--action=3` activates at once) | nvme-cli fw-commit |
| `ledctl locate=/dev/…` (storage sheet and hw-reference) | `ledctl --listed-only locate=/dev/…` (and `locate_off`, `normal`) | ledctl(8): without `--listed-only` it turns off every other drive's LEDs, fault LEDs included |
| `smartctl -t short … && smartctl -l selftest …` | two recipes: start the test, then read the log after it finishes | the log is read before the new test has run |
| `parted … mkpart primary ext4 …` on GPT | `mkpart data ext4 …` | on GPT that word is the partition name; part-type is msdos/dvh only |
| `lsblk -f -o NAME,…` | `lsblk -o NAME,…` | `-f` is itself a column list; how the two combine isn't documented |

**Now flagged as changing state** (`DANGER_RE` in `common.js`): `blkdiscard` (wipes the device), `mdadm … --add` (starts a rebuild) and `lvextend`/`lvreduce`/`lvresize`.

**Not confirmed (said in the notes):** the smart-log and id-ctrl output field names (nvme-cli output, not in the man pages); the SATA attribute IDs and SAS "grown defect list" wording (drive-reported); the `tune2fs -l` output labels; Ubuntu's `ubuntu-vg`/`ubuntu-lv` names and how much VG space the installer leaves. nvme-cli 3.0 (Sep 2026) renames `smart-log`, `error-log`, `fw-commit`, `id-ns` and friends to `nvme log smart`, `nvme fw commit`, `nvme id ns` (old names still work with a warning) and 3.2 deprecates `-H`; the sheet keeps the 2.x forms that current distros ship.

**Not covered:** the hw-reference drive cards still put `sudo` in front of their commands (a sheet-wide convention, not changed here); `zpool`/ZFS has no storage card to source.

## #8 for the Linux hardware sections (2026-11-09, `improve/sources-linux-hw`)

All 16 commands in `dmi-hw`, `pcie-numa`, `ecc-edac` and `kernel-boot` (in `app.js`) now cite a source: dmidecode(8), lshw(1) and its source, lspci(8)/setpci(8) and pciutils' ls-caps.c, the kernel ABI files (sysfs-bus-pci, sysfs-class-dmi, sysfs-devices-edac, sysfs-class-thermal), lscpu(1), cpupower, numactl/numastat, lstopo, edac-util, ras-mc-ctl and the rasdaemon README, sensors, turbostat, modinfo/modprobe/dkms, the kernel serial-console doc, update-grub, update-initramfs, systemd-getty-generator, coredumpctl, kdump-config, Ubuntu's kernel crash dump page, stress-ng, fio and iperf3.

| Was | Now | Why |
|---|---|---|
| `lscpu -e=CPU,NODE,SOCKET,CORE,L1d:L1i:L2:L3,…` | `lscpu -e=…,CACHE,…` | fails with "unknown column" (tested, util-linux 2.42); `L1d:L1i:L2:L3` is the CACHE column's heading |
| AER check `lspci … && echo 1 \| tee /sys/bus/pci/rescan` | read-only check; the rescan is its own recipe | copying a "check errors" command re-enumerated the PCI bus |
| `iperf3 -s   # on target node   &&   iperf3 -6 -c …` | two recipes: server, then client | after `#` the rest is a comment, so only the server started |
| `modprobe -v <m> && modprobe -rv <m>` | two recipes: load, unload | copying it loaded the module and removed it again |
| `lshw -short -businfo` | `lshw -businfo` | two output formats; together is undocumented |
| rasdaemon "replaces mcelog", DB at `/var/lib/rasdaemon/ras-mc_event.db` | neither claim | not in rasdaemon's docs |

Wording: dmidecode `-t` keywords map to several types (bios 0+13, system 1/12/15/23/32, baseboard 2/10/41, memory 5/6/16/17); `--vm-bytes 80%` is the total shared by the vm workers; turbostat is in `linux-tools-common` on Ubuntu and `linux-cpupower` on Debian; with `console=ttyS0` systemd starts the serial getty by itself.

**Now flagged as changing state** (`DANGER_RE`): `modprobe` loads (dry-run/show-config forms excepted), `stress-ng`, `cpupower frequency-set`. This also flags `modprobe ipmi_devintf ipmi_si` (ipmitool sheets), `modprobe nvidia-peermem` (NVIDIA sheets) and the tmux burn-in example.

**Not confirmed (said in the notes):** the EDAC `csrow*/ch*_ce_count` files (not in the kernel ABI docs; the `dimm*` files are); the Intel `thermal_throttle/*_count` files (only turbostat(8) points to them); the GRUB manual (rate-limited); the `(downgraded)` and `UNCLAIMED` markers are confirmed from pciutils and lshw source, not their man pages.

## #8 for the Rack & hardware reference sheets (2026-11-09, `improve/sources-hw-reference`)

All 50 entries on the six hardware-reference sheets (power, cooling, memory, drives, GPU form factors, racks: commands, recipes and the Pro Tip cards) now show a source line. `generate-suite-kit.js` now passes a Pro Tip's `src` through too. The sources: ipmitool's man page and source (sensor-type names, `fru print [fru id]`), the nvidia-smi docs, the Fabric Manager guide, NVIDIA's HGX, H200, GB200/GB300 NVL72 and DGX B200 pages, SNIA's EDSFF and SFF pages, the OCP Open Rack V3 base spec (read locally from the PDF), dmidecode, lsmem, numactl, lsblk, nvme-cli, smartctl, edac-util, ledctl and the kernel EDAC ABI. Wikipedia is cited where it was the only fetchable summary: IEC 60320, rack unit, U.2/U.3, 12VHPWR/12V-2x6 and Granite Rapids.

| Was | Now | Why |
|---|---|---|
| Fabric Manager "at the driver's exact version" | compatible with the driver; the same version only before R620 | FM guide: from R620, FM has its own versioning |
| Xeon 6900P/6700P "DDR5-6400" | DDR5-6400 at 1 DPC (5200 at 2 DPC); MRDIMM 8000 on some 6700P SKUs | Intel SKU data (via Wikipedia) |
| "U.2 drive in a U.3-only bay: usually doesn't work" | U.2 drives are not compatible with U.3 hosts | the U.2/U.3 rule as stated |
| 12V-2x6 "marked H++" | dropped; "replaced 12VHPWR in CEM 5.1" | the marking couldn't be confirmed |
| E1.S "8 mm", "20 W and x8" | 8.01 mm; 20 W and x8 in the 9.5 mm symmetric enclosure | SNIA form-factor page |

**`sudo` removed** from all 14 commands (dmidecode, nvme, smartctl, lspci, ledctl, nvidia-bug-report, edac-util). The site marks root commands itself: a ROOT badge, and the copy gets `# needs root` by default. `ledctl` got a root rule in `PRIV_RULES` so its badge isn't lost. `edac-util` reads world-readable sysfs counters, so it never needed root.

**Not verified (said on the card, 5):** the circuit card and its recipe (NEC 210.20(A) is paywalled), the labelling card (ANSI/TIA-606-D is sold), the NVMe link-width loop (the sysfs files exist on a live system but aren't in the kernel ABI docs), and the nvidia-bug-report tip (not in the nvidia-smi docs). Notes also flag the ASHRAE ranges and W classes (ASHRAE refuses automated fetches), the AMD EPYC 9005 memory figures and HPE's "highest common speed" rule (vendor pages refused or timed out), and the nvidia-smi `--query-gpu` field names (use `--help-query-gpu`).

## #8 for the Kubernetes and GPU-container sheets (2026-11-09, `improve/sources-k8s`)

All 96 entries (commands, recipes, Pro Tips) on `docker-gpu-daemon`, `k8s-kubectl`, `k8s-workloads`, `k8s-troubleshoot`, `k8s-nodes` and `k8s-gpu` now cite a source: kubernetes.io (the kubectl reference, debugging, drain, eviction, cgroups, version-skew pages), the NVIDIA Container Toolkit install and CDI pages (1.20.1), Docker's dockerd and `docker events` references, the GPU Operator getting-started page (v26.7) and dcgm-exporter's default counters and releases (4.9.0). `generate-containers-suite.js` now passes `src` through (commands, recipes, Pro Tips). The other four Docker sheets aren't sourced yet.

| Was | Now | Why |
|---|---|---|
| `nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml`, "regenerate after a driver upgrade" | `systemctl restart nvidia-cdi-refresh.service` (toolkit 1.18+); manual generate to `/var/run/cdi/nvidia.yaml` for older toolkits | NVIDIA's CDI page: the refresh service keeps `/var/run/cdi/nvidia.yaml` current |
| CDI "used by Docker 25+" | on by default from Docker Engine 28.3.0 | dockerd reference |
| `docker events --since 1h --until now` | `--until "$(date +%s)"` | `now` isn't a documented `--until` format |
| "kubelet 1.37 refuses cgroup v1" (3 places) | deprecated since 1.35; the kubelet won't start on cgroup v1 by default | Kubernetes cgroups page |
| "Pods with no requests are evicted first" | evicted in order of usage over requests, then priority; QoS class doesn't set the order | node-pressure eviction page |
| `kubectl get nodes -l nvidia.com/gpu.present=true` | `-l feature.node.kubernetes.io/pci-10de.present=true` | the label the GPU Operator docs use |

Also: `kubectl debug node/…` notes `--profile=sysadmin` for `chroot /host`, and the gpu-operator namespace is described as the one NVIDIA's examples use (Helm defaults to `default`). The dcgm-exporter metric names on the sheet (`DCGM_FI_DEV_XID_ERROR`, `…_GPU_TEMP_CELSIUS`, `…_BOARD_POWER_WATTS`) are confirmed as the 4.9.0 defaults.

**`sudo` removed** from 6 commands (`nvidia-ctk`, `systemctl restart docker`, `crictl`). `nvidia-ctk runtime configure` / `cdi generate` got a root rule in `PRIV_RULES`.

**Not confirmed (said in the notes):** the `--gpus '"device=0,1"'` quoting (Docker's GPU page is 404), filtering events by `type=Warning`, and the dcgm-exporter service name and port 9400.

## New: Slurm suite (2026-11-09, `improve/slurm-sheet`)

The fleet schedules on Slurm, and the agent rules ask for drain checks before intrusive work, but the site had no Slurm sheet. `generate-slurm-suite.js` (suite-kit) adds a hub, `slurm.html`, and three sheets in the DevOps tab:
- **`slurm-nodes`**: state, reason and who set it (`sinfo -N -n <node> -o "%N %T %E %u %H"`); node states and state suffixes; `scontrol show node`; drain with the ticket in the reason; RESUME vs UNDRAIN; `scontrol reboot ASAP nextstate=RESUME`.
- **`slurm-jobs`**: jobs on a node, pending reasons, `scontrol show job`, `sacct` outcome and "what ran on this node in the last day", `scancel`.
- **`slurm-gpus`**: GRES per node, `slurmd -C` (the node's real hardware in slurm.conf form), a one-GPU test job, the daemons and `sdiag`.

All 37 entries were written against SchedMD's Slurm 26.05 docs and cite them. Checking them changed the first draft:
- `squeue -t PD -w <node>` would always print nothing: `-w` matches allocated nodes, and pending jobs have none.
- `%u` gives the name of who drained a node.
- `ASAP` without `nextstate` comes back UNDRAIN.
- The job state is `OUT_OF_MEMORY`, not `OOM`.
- An unconfirmed `StateLong` field was dropped.

`DANGER_RE` now flags `scancel` and `scontrol reboot | cancel_reboot | reconfigure`, and the Slurm admin badge covers `cancel_reboot`. `scontrol reboot` stays copyable: it reboots compute nodes through the scheduler, not the machine you type on.

## New: Parallel filesystems suite (2026-11-09, `improve/pfs-sheets`)

`generate-pfs-suite.js` (suite-kit) adds a hub, `pfs.html`, and four sheets in the Hardware tab. All 73 entries are written against each project's docs and cite them:

| Sheet | Version checked | Covers |
|---|---|---|
| `pfs-lustre` | Lustre manual; 2.17 current, 2.15 maintenance | `lfs check servers`, `lfs df -h/-i`, `lctl dl`, `lnetctl net show`, `lctl ping <nid>`, `lfs getstripe` / `find --obd`, client mount, server `health_check` |
| `pfs-weka` | WEKA 6.0 CLI | `weka status` (+ `rebuild`), `weka alerts`, `weka cluster container` / `drive`, `weka local ps` / `local events`, the wekafs mount |
| `pfs-beegfs` | BeeGFS 8.4, with 7.4.6 recipes | `beegfs health check|df|net`, `beegfs target list --state` (state meanings), `beegfs node list --with-nics`; the 7.x `beegfs-ctl` / `beegfs-df` / `beegfs-net` / `beegfs-check-servers` beside each |
| `pfs-scale` | IBM Storage Scale 5.2.3 command reference (6.0.0 matches) | `mmgetstate -a [-L]` (active/arbitrating/down/unknown/unresponsive), `mmhealth node show --verbose`/`--unhealthy`, `cluster show`, `mmlsdisk -e` (availability vs status), `mmdf --block-size auto`, `mmlsnsd -m`, `mmlsmount all -L`; flagged: `mmchdisk start`, `mmshutdown`/`mmstartup -N`, `mmumount` (added later the same day, `improve/storage-scale`) |
| `pfs-ceph` | Ceph docs; 21.2 Umbrella current | `ceph -s` / `health detail`, `osd tree` (up/down, in/out), PG states and inconsistent PGs, `device ls-by-host`, `noout`, `orch ps`, crash reports |

`DANGER_RE` now flags `umount`, `lfs setstripe`, the Ceph state changes (`osd set|unset|out|in|…`, `crash archive|rm|prune`, `pg repair`, `health mute`, `orch apply|rm|host …|daemon …`), WEKA drive and container (de)activation and removal, `cluster stop-io|start-io`, `fs remove`, `local stop|rm`, and BeeGFS node delete and migrate (8.x and 7.x).

**Found in `docs/playbooks/storage-jbod.md`** (✅ fixed on `fix/storage-playbook`: WEKA and Ceph lines replaced; BeeGFS split into 8.x and labelled 7.x commands; each section points to the sheets):
- `weka cluster nodes` doesn't exist in the WEKA 6.0 CLI; use `weka cluster container` (or `cluster server list`).
- `ceph osd df tree` isn't in the current Ceph docs; use `ceph osd df <host>`.
- The BeeGFS lines are 7.x-only. On 8.x they are `beegfs health check`, `beegfs node list --with-nics` and `beegfs health df`.

Storage Scale also fixed the playbook's `mmhealth node show -v` (the option is `--verbose`) and added `mmlsdisk <fs> -e`. `DANGER_RE` flags `mmshutdown|mmstartup|mmchdisk|mmumount|mmmount|mmdeldisk|mmdelnode|mmdelfs|mmrpldisk|mmrestripefs|mmchconfig|mmchfs|mmchmgr`, and a root rule covers the admin `mm*` commands. IBM's docs landing page is a JavaScript app, so the newest release (5.2 or 6.0) wasn't confirmed.

**Not verified:** WEKA's drive status values (the CLI reference doesn't list them); the arguments of BeeGFS 8's `beegfs entry info`; whether BeeGFS 8 still ships `beegfs-ctl`; `lnetctl ping` (not in the Lustre manual, so the sheet uses `lctl ping`).

## Cleanup: no `sudo` prefixes (2026-11-09, `fix/no-sudo`)

The site marks root commands itself (the ROOT badge, and `# needs root` on copy), so commands written for the technician don't carry `sudo`. The last 24 source commands that did are fixed. They show up as 47 commands across 13 sheets, because hubs repeat their sheets' commands. The fixed commands: Supermicro SAA (11), OneCLI (2), FreeIPMI's `install … /etc/freeipmi/freeipmi.conf`, two `dmesg` lines, `ctr` and `ss` on the Docker sheets, and the nano/editors checks (`cp -a /etc/fstab`, `findmnt --verify`, `sshd -t`, `visudo -c`, `update-alternatives --config editor`). New `PRIV_RULES` keep their badges: `install` into system dirs, `cp` under `/etc`, `sshd -t`, `findmnt --verify` (maybe) and `update-alternatives`.

**Kept on purpose**, where `sudo` is what the card teaches: `sudo cp -a FILE … && sudoedit FILE` (back up, then edit as yourself), `echo … | sudo tee /sys/…` (why `sudo echo > file` fails), and the sudo, bash, CLI-tools and Linux sheets. `tests/no-sudo.test.js` holds the line.

## #8 for the rest of the Linux sheets (2026-11-09, `improve/sources-linux-rest`)

The last 29 Linux commands (files, permissions, text, processes, network, archives, systemd, users, packages) and the three generated Pro Tip cards now cite their man pages: man7.org, Debian trixie, Ubuntu noble, rsync's own page, curl, jq, OpenSSL, tcpdump, OpenBSD's ssh pages and sudo.ws. All 77 links were checked to resolve. Every card on the Linux hub now has a source (54/54), and every command in `app.js` has one.

| Was | Now | Why |
|---|---|---|
| `ln -sfn` "atomic … single rename syscall" | `ln` removes and recreates the link; a new recipe makes the atomic switch (`ln -s … current.tmp && mv -T current.tmp current`) | ln(1) documents only `-f` removing the destination; rename(2) is the atomic step |
| `useradd` "defaults to /bin/sh if -s is omitted" | uses `SHELL` from `/etc/default/useradd`, else leaves the field empty | useradd(8) |
| `last` reads `/var/log/wtmp` | noted that Debian 13 dropped `last`/`lastb` from util-linux: `wtmpdb last` reads `/var/log/wtmp.db` | Debian trixie release notes, wtmpdb(8) |
| users Pro Tip: `faillog -a` | `faillock --user <username>` (and a flagged `--reset`) | `faillog` reads the retired pam_tally counter and isn't in Debian 13; pam_faillock's records are read with faillock(8) |
| `ss -p` "(requires sudo)" | no claim (the maybe-root badge covers it) | ss(8) doesn't say so |
| "zstd -T0 is 5x faster than gzip"; "much faster than netstat with 50,000+ sockets" | dropped / softened | no source |

**Now flagged as changing state** (`DANGER_RE`): `systemctl start|enable|disable|mask|unmask|edit|daemon-reload|kill|isolate|set-property`, `journalctl --vacuum-*`, `ufw allow|deny|…`, `apt`/`apt-get install|remove|purge|upgrade|full-upgrade|dist-upgrade|autoremove|reinstall` and `--fix-broken`, `dpkg -i|-r|-P|--configure`, `apt-mark hold|unhold|…`, `useradd`/`usermod`/`userdel`/group changes, `passwd` (as a command; `/etc/passwd` as a file isn't matched), `chmod`/`chown`/`chgrp`, `chattr ±`, `setfacl -m|-x|-b…`, `sed -i … /etc/…`, `rsync --delete` (not with `-n`/`--dry-run`), and `faillock --reset`. This flags 55 commands on 20 sheets that change system state (your ask-first list), including `systemctl enable --now nvidia-persistenced` and the netplan `chmod 600`.

## #8 for the CLI tools (2026-11-09, `improve/sources-cli`)

All 47 CLI tool sheets now show a source on every card (195/195: commands, recipes, pipelines and the generic tip cards), and so does the CLI tools hub (68/68). The sources are man7.org, Debian, the OpenBSD manuals (scp, sftp, tmux), and each project's own docs: curl, jq, Python http.server, OpenSSL, Nmap, cloud-init, sudo.ws, GNU binutils and tcpdump. All 69 links were checked to resolve. `generate-cli-suite.js` now passes `src` to every card it builds; a pipeline cites the tool its first word runs (tio, python3, gzip, nvme), not the card's own tool.

| Was | Now |
|---|---|
| `xargs -P 0` "for all CPU cores" | as many processes as possible at once (no limit) |
| `zstd -T0` "logical CPU cores"; "5x–10x faster, >1,500 MB/s" | physical cores (`--auto-threads=logical` for all threads); levels 1-19, 22 with `--ultra`; speed figures dropped |
| `sftp` `reget -P …` | `reget …` (options are -f -p -R; same as `get -a`) |
| `tio -L` lists devices | `tio -l` (`-L` is `--log`) |
| `watch -d=permanent` | `--differences=permanent` |
| `efibootmgr -l '\\EFI\\…'` | `-l '\EFI\ubuntu\shimx64.efi'` |
| `ip -6 neigh flush all` | `ip -6 neigh flush dev eth0` (flagged) |
| `ss -p` "(requires sudo)"; `ss` "TCP_DIAG directly" | no root claim; "reads sockets over netlink" |
| `file` on a core dump shows "the signal" | identifies the dump and the program that produced it |
| generic tip "Run with sudo when inspecting…" | "Some flags need root: the badge on the command says so" |

Also noted that MAC-derived (EUI-64) link-local addresses aren't universal (RFC 7217), and that `nvme list -o json` field names are nvme-cli 2.x output. Confirmed as written: Ubuntu 25.10+ uses sudo-rs by default with the original kept as `sudo.ws`, and upstream sudo is 1.9.17p2.

**Now flagged:** `fuser -k`, truncating through `> /proc/<pid>/fd/<n>`, `efibootmgr -n|-o|-B|-c|-a|-A|-t`, `sysctl -w|-p|--system`, `udevadm trigger`, and `ip addr|route|neigh|rule add|del|flush|change|replace`. `efibootmgr -n … && reboot` stays reference-only.

**Lesson:** `DANGER_RE` is one big `\b( … )` group, so an alternative that starts with a non-word character (`>`, `(`) can never match at a space. The `/proc` pattern and the earlier `passwd` pattern now use lookbehinds, and both are tested in both directions.

## #8 for the general Docker sheets (2026-11-09, `improve/sources-docker`)

All 63 cards on `docker-containers`, `docker-images`, `docker-compose` and `docker-network-storage` now cite Docker's own docs: the CLI reference, the Dockerfile and Compose file references, and the networking, storage and daemon guides. All 46 links were checked to resolve. The facts were checked against Engine 29.9.3 and Compose v5.7.0. This finishes the containers suite: Kubernetes and the GPU stack were done earlier.

| Was | Now | Source |
|---|---|---|
| `docker system prune --volumes` "removes unused volumes"; `docker volume prune` "deletes unused volumes" | only **anonymous** volumes; named ones are kept unless `docker volume prune -a` | system prune and volume prune references |
| "Images, containers and volumes live under /var/lib/docker (overlay2)"; "check du -sh /var/lib/docker" | containers and volumes do; on fresh Engine 29+ installs the containerd image store keeps images under `/var/lib/containerd` (overlayfs snapshotter), which `data-root` doesn't move; check both | daemon and containerd image store docs |
| `--mount` "fails loudly" | gives the exact error ("bind source path does not exist"); `-v` creates the missing path as a directory | bind mounts |

Notes on cards: Docker's current `docker run` reference shows neither the 125/126/127 exit codes nor `--device` with a directory (`/dev/infiniband`). Its migration page didn't state Compose v1's end-of-life when checked. Confirmed: published ports bypass ufw, the 10-second stop timeout, BuildKit as the default builder, default-bridge name resolution, `.env` interpolation. The GPU sheet's "Storage Driver: overlay2" row now mentions overlayfs too.

## #8 for the SRE toolkit (2026-11-10, `improve/sources-sre`)

All 72 cards on the six SRE sheets (Prometheus and Alertmanager, Ansible, Terraform/OpenTofu, Helm, Argo CD, incident response), including every Pro Tip, now cite their docs: prometheus.io, docs.ansible.com, developer.hashicorp.com, OpenTofu, helm.sh, Argo CD, the node_exporter and Alertmanager READMEs, and Google's SRE books. All 62 links were checked to resolve. The one rate-limited link, HashiCorp's BSL page, was replaced by Terraform's LICENSE file. The suite had been fact-checked on Nov 7, and re-checking it found:

| Was | Now |
|---|---|
| "Helm 3's security fixes end on November 11, 2026" | Helm 3 gets security patches **through February 2027**; its last feature release was September 9, 2026. Nov 11 is only the next patch-release date |
| Alertmanager 0.34; ansible-core 2.21 | Alertmanager 0.35.0 (Nov 9) and ansible-core 2.22.0 (Nov 2) are current; the CORS change is pinned to 0.34.2 |

Confirmed as written:
- `promtool --lint` values (including `too-long-scrape-interval`, for `check config` only) and `--lint-fatal`
- `/-/healthy` always returns 200, and `/-/reload` needs `--web.enable-lifecycle`
- node_exporter's textfile collector: write-then-mv, no timestamps
- `terraform state show -json` needs 1.16+, and `-generate-config-out` is still experimental
- the Helm 4 flag renames, server-side apply for new installs, and `helm version --client` removed (PR #31301)
- Argo CD refuses a rollback while automated sync is on (auto-sync docs)

**Gotcha found:** a sheet's version pill lives in its `.html` (pages own their header; generators only write new pages), so changing `pill:` in a generator doesn't reach an existing page. `ansible.html` and `prometheus.html` were edited directly.

## #8 for the Grafana suite (2026-11-10, `grafana-sources`)

All 36 commands and 6 Pro Tips on the six Grafana sheets (102 entries on the hub) now cite their docs: grafana.com docs (provisioning, panels, transformations, variables, built-in variables, data links, JSON model, Dashboard API, Git Sync, What's new in 13.0), Grafana source files for the shortcut, unit and variable-sort values the docs don't list, prometheus.io, node_exporter, the gcx and grafanactl repos, and NVIDIA's dcgm-exporter release notes, command reference and 4.9.0 counters file. Every link was checked to load (GNU's server refused, so `read` cites man7's bash page). `generate-grafana-suite.js` has its own card builder, so it now passes `src` through to main, More options, Related commands and Pro Tip cards. Corrections:

| Was | Now |
|---|---|
| Compose lab pins `grafana/grafana:13.2.4` | **13.3.0** (Oct 27, 2026) is current |
| Zoom out: `t z` | `t -` (or Ctrl+Z) in Grafana 13's dashboards |
| `grafanactl` "repo was archived 2026-06-01" | Deprecated (last release v0.1.10, April 2026); the README announced June 1 archiving, but the repo was still not archived on Nov 10 |
| gcx "Grafana 12+" | Full support on Grafana 13+; 12.x not actively supported; under 12 refused |
| Dashboard API: no deprecation note | Grafana 13 deprecates `/api` for `/apis` (still served, no longer updated); `/apis/dashboard.grafana.app/v1/...` recipe added |
| Omitting `folderUid` on an update "can move" the dashboard | It **moves** to the root level (docs) |
| `label_values()` shown as the way to fill a variable | Still works, but it's the Classic query type, marked deprecated; the Label values query type does the same |
| Git Sync auth: "GitHub App or a token for GitLab/Bitbucket" | GitHub: personal access token, GitHub App or OAuth App; any Git repo works (Pure Git) |
| "Community dashboard 12239" as the starting point | 12239 is NVIDIA's, last revised 2021, pre-4.9 names; start from `grafana/dcgm-exporter-dashboard.json` in the 4.9.0 repo |
| "Exports default to the v2 schema"; "new dashboards use auto grid" | A dashboard exports as Classic or V2 Resource; Custom layout is the default for a new dashboard |

Confirmed as written: `GF_<SECTION>_<KEY>__FILE`, `/api/health` fields, provisioning keys (`foldersFromFilesStructure` needs `folder`/`folderUid` unset), `/api/datasources/proxy/uid/:uid/*`, service-account click path, `d k`/`e`/`v`/`?` shortcuts, unit IDs (`percentunit`, `mbytes` = MiB), override matcher IDs, value-mapping types, `__url_time_range` needs your own `&`, variable formats, refresh 1/2 and sort 1/3/7, `$__rate_interval` = max(interval + scrape, 4 × scrape), gridPos 24 columns × 30 px rows, 412 version-mismatch/name-exists, Git Sync GA in 13 at Administration → General → Provisioning, every DCGM 4.9.0 metric name and its default/optional status, `--no-hostname`, port 9400, node_exporter's `infiniband` collector (on by default) metric names.

## #8 for the editors suite (2026-11-10, `editors-sources`)

All 28 commands and 4 Pro Tips on the nano, VS Code, Zed and Cursor sheets (46 hub entries) now cite their docs: nano's manual, man page, nanorc(5), cheatsheet, news and default-bindings source; sudo/visudo/findmnt/sshd man pages; VS Code's command-line, Remote-SSH, tunnels and keybinding docs plus the Linux shortcut PDF (copy-line-down from VS Code's source); Zed's default Linux keymap, key-bindings, Vim, Linux and agent docs and its CLI source; Cursor's shortcut reference, CLI overview and parameters page. Every link was checked to load. Corrections:

| Was | Now |
|---|---|
| nano label 9.2; search is Ctrl+W, Alt+W repeats | nano **9.3** (Oct 21); Ctrl+W **or Ctrl+F** searches (Ctrl+F/Ctrl+B since 8.0), Alt+F / Alt+B find next / previous |
| Zed base keymap "VS Code (default)" | **Zed** is the default; VS Code, JetBrains, Sublime, Emacs (beta), Cursor… are options |
| Zed CLI `-n / -a / -r` | `-n / -a / -e` (`--existing`); `-r` still works but is hidden |
| Cursor's reference "lists macOS keys" | It lists Cmd and Ctrl for every key |
| Cursor Ctrl+Shift+V "pastes as plain text" | Adds the clipboard to the input box as text (Cursor's wording) |

Confirmed as written: every nano flag and key on the cards (from the 9.3 source), sudoedit's SUDO_EDITOR → VISUAL → EDITOR order, every VS Code Linux key and `code` flag (`--remote ssh-remote+HOST`), every Zed key against `default-linux.json` (ctrl-enter inline assist, ctrl-\\ split), `zed` -w/--diff/path:line:col, `zeditor` package naming, Cursor's chat/context/Tab keys and `agent` -p/--output-format/--mode/--sandbox/ls/resume/--continue.

## #8 for the Neovim suite (2026-11-10, `neovim-sources`)

All 47 commands (in `neovim.js`, copied whole into the nine sheets) and 9 Pro Tips (in `generate-neovim-suite.js`, now passed through) cite Neovim's help pages (motion, change, visual, pattern, repeat, windows, insert, undo, quickfix, terminal, LSP, diagnostics, treesitter, default mappings, 0.11/0.12 news), LazyVim's keymaps page and v16.0.2 source (gitsigns, flash, treesitter-textobjects), and Neo-tree's defaults. Checked against Neovim 0.12.6 and LazyVim 16.0.2. Corrections:

| Was | Now |
|---|---|
| `:w !sudo tee %` "save with root privileges" (ex-shell Pro Tip) | Removed: Neovim's `:!` runs on a pipe with no terminal, so sudo can't prompt. The tip says to reopen with sudoedit; `:r !date` takes its place |
| gd / gr / gI / gy / `<C-k>` shown as Neovim LSP keys | Labelled LazyVim; Neovim's own are `grr`, `gri`, `grt`, `gra`, `grn`, Ctrl+S (0.11+, `grt` 0.12) and Ctrl+] |
| `:noh or <Esc>` clears the highlight | `<Esc>` is LazyVim; plain Neovim clears it with Ctrl+L |
| Ctrl+A changes "number or alpha" | Letters only if `'nrformats'` has `alpha` (default `bin,hex`) |
| `]c / [c` "class or git hunk" | Class start (a diff change in diff mode); hunks are `]h / [h`. `<C-space>` is LazyVim (flash.nvim); Neovim 0.12 has `an` / `in` |
| Neo-tree is LazyVim's explorer; `y / c / m` = copy name / copy file / move | Snacks explorer is the default, Neo-tree an extra; `y / x / p` copy / cut / paste, `c / m` copy / move to a typed path, `Y` copies the path |
| `<C-r>=` evaluates "math or Lua" | Vimscript expressions; wrap Lua in `luaeval()` |
| "Always wait 100ms after Esc in visual block mode" | The text appears on the other lines once you press Esc |
| Labels "Neovim 0.10+" | "Neovim 0.11+" (the `]b`, `]q`, `grr` defaults are 0.11) |

The hub renders with `data-id`, not `data-cmd-id`; the test counts both (103 cards).

## #8 for the Windows suite (2026-11-10, `windows-sources`)

All 34 commands (in `windows.js`) and 8 Pro Tips (in `generate-windows-suite.js`, now passed through) cite Microsoft: the keyboard-shortcuts, Snipping Tool and clipboard support pages, the Windows Insider post for Ctrl+Shift+C, and Microsoft Learn reference pages for every cmdlet and command (Storage, BitLocker, CIM classes, services, events, networking, DNS, winget, WSL, registry, robocopy, DISM, sfc, powercfg, shutdown). Every link was checked to load. Corrections:

| Was | Now |
|---|---|
| `Initialize-Disk … && New-Partition …`; `DISM … && sfc /scannow` | `&&` only exists in PowerShell 7; the disk card uses `;` and DISM / sfc are separate lines |
| `IsInRole('Administrator')` checks for elevation | A string is matched as a group name; use `IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)` |
| LastBootUpTime "bypasses Fast Startup" for the true boot time | The opposite: a Fast Startup shutdown hibernates the kernel, so LastBootUpTime doesn't reset; Restart does |
| `Optimize-Volume -Defrag` "runs TRIM on SSD or defrags HDD" | `-Defrag` always defrags; with no switch the cmdlet retrims an SSD and defrags an HDD |
| Resolve-DnsName "bypasses the hosts file" | It reads the hosts file unless you pass `-NoHostsFile` |
| `Restart-Service -Force` "restarts dependents too" | It skips the confirmation prompt (Microsoft's wording) |
| Win+X "then I (Admin Terminal)", "u, u / u, r" | Removed: I is the non-admin Terminal and Microsoft doesn't document the letters |
| Win+Ctrl+Shift+B "restarts the graphics driver" | Microsoft: wakes the device from a blank or black screen (the driver-reset description is kept as "widely described") |
| Clipboard "up to 25 items"; robocopy "10x faster"; ReFS "instant block cloning" tip | Unsourced numbers removed; robocopy's documented defaults (8 threads, 1,000,000 retries, 30 s); Dev Drive (ReFS) named instead |
| `SetEnvironmentVariable('API_KEY', '123', 'User')` | `('EDITOR', 'code --wait', 'User')`, with a note that Machine needs elevation and secrets don't belong in env vars |

Not confirmed by a Microsoft page (said in the card's note): Ctrl+Shift+Enter to run elevated from Start/Run.

## #8 for the macOS suite (2026-11-10, `macos-sources`)

All 36 commands (in `macos.js`) and 8 Pro Tips (in `generate-macos-suite.js`, now passed through) cite Apple's support pages (keyboard shortcuts, screenshots, window tiling, Spotlight, force quit, trackpad gestures, three finger drag, accents, macOS versions), Homebrew's docs, and Apple's man pages through keith's Xcode man-page mirror (Apple doesn't publish them online). Current macOS is 27 Golden Gate (27.2.1). Corrections:

| Was | Now |
|---|---|
| Labels "macOS Sequoia" | "macOS 26 & 27" |
| Tile: 🌐⌃Return fills the screen; 🌐F full screen | Fill is 🌐⌃F (🌐⌃C center, 🌐⌃R restore); 🌐F isn't in Apple's list, ⌃⌘F is |
| Spotlight: ⌘Return reveal, ⌘C copy file, ⌘B web search; "weather" | Rebuilt from Apple's current guide: hold ⌘ to locate, Space Quick Look, Tab Quick Actions, ↑ previous search, math and conversions |
| Thumb + 3 finger pinch "opens Launchpad" (sheet and the hub's gesture panel) | Shows Apps on macOS 26+ (Launchpad before) |
| `xattr -cr` "clears com.apple.quarantine" | `-c` clears every attribute; `xattr -dr com.apple.quarantine` removes only that one (with a trust warning) |
| `security add-generic-password … -w 'secret'` | `-w` last so it prompts; the man page recommends it and the secret stays out of history |
| ⇧⌥⌘⎋ held 3 s force-quits; fn+⌥⌫ deletes the next word; a Mission Control "fan out" gesture | Removed (not on Apple's pages); fn+⌫ / ⌃D forward delete, Magic Mouse two-finger double-tap for Mission Control |
| mdfind "100x faster than find /", "across all attached drives" | Searches the Spotlight index, so only indexed volumes |

Noted on the cards, not on Apple's shortcut page: ⇧⌘. hidden files, ⌘1–⌘4 views, ⌥⌘C Copy as Pathname, ⌥⌘⌫ Delete Immediately (all from Finder's menus), Shift+wheel horizontal scroll, ⌥-click Wi-Fi details, the ⌥ typography keys (U.S. layout).

## #8 for the scripting hub and eleven language sheets (2026-11-10, `scripting-sources`)

All 40 commands on the bash, Python, JavaScript, TypeScript, PowerShell, JSON, YAML, TOML, regex, awk/sed and SQL sheets (`generate-scripting-suite.js`) and all 34 on the scripting hub (`create-scripting-data.js`, including its Lua, git and Markdown cards) cite their references: bash(1), docs.python.org, MDN, nodejs.org, the TypeScript handbook and 6.0 notes, Microsoft Learn (PowerShell), RFC 8259, the jq manual, yq docs, YAML 1.2.2, TOML 1.1.0, PCRE2, RFC 9562, man7 (grep, gawk, sed, ps), SQLite, PostgreSQL, the Lua 5.4 manual, LuaJIT, git-scm.com, CommonMark, GFM, GitHub docs, Pandoc, glow and Omarchy's bindings.lua. Every link was checked to load (the Hyprland wiki had moved its hyprctl page). The sheets' JSON passes `src` through as is. The Lua, git and Markdown sheets come next. Corrections (several tested on this machine):

| Was | Now |
|---|---|
| Hub: `echo "${VAR:-…}" \| echo … \| echo "${PATH//:/\n}"` | Separate commands; `\n` in a replacement is a literal `n` (tested), so `$'\n'` |
| PowerShell: `Write-Error "Failed to reach $ComputerName: $_"` | `${ComputerName}:` (a colon after a variable name parses as a scope); `Get-Content -Raw` before ConvertFrom-Json |
| Regex: named groups `(?<name>…)` "Python / JS / PCRE" | Python rejects it (tested on 3.14); it needs `(?P<name>…)`. `(?i)`: JavaScript only has scoped `(?i:…)` |
| SQL "ANSI" example: `GROUP BY n.id` with other columns, `HAVING avg_temp` | Every selected column in GROUP BY and the aggregate repeated in HAVING (PostgreSQL rejects the alias); ran on SQLite 3.54 |
| YAML: "yes, no" listed as booleans on a YAML 1.2 sheet | Only true/false in 1.2; yes/no/on/off are 1.1 (PyYAML); merge key `<<` noted as 1.1 |
| UUID regex "UUID v4" / RFC 4122 | Versions 1–5; RFC 9562 replaced 4122 and adds 6–8 |
| Python defaults "evaluated once at module import"; `arg: list = None` | Evaluated when the def runs; `list \| None = None` |
| pathlib `write_text` "atomically" | Not atomic (write a temp file and `Path.replace()`) |
| PowerShell `[CmdletBinding()]` gives -WhatIf; `Select-Object / %` | -WhatIf needs SupportsShouldProcess; `%` is ForEach-Object |
| PCRE lookbehind "requires fixed length" | PCRE2 10.43+ allows bounded variable length |
| Labels Node.js 20+, TypeScript 5.x, jq 1.7, TOML v1.0.0, SQLite 3.45 | Node.js 22+ (20 is end-of-life), TypeScript 6 & 7 (strict by default since 6.0), jq 1.8, TOML 1.1 (tomllib reads 1.1 from Python 3.15), SQLite 3.54 |
| `export API_KEY="secret_token"`; `sed -i` that disables SELinux | `LOG_LEVEL=debug`; an sshd_config edit with a backup |

Also added: `node script.ts` (type stripping since Node 22.18/23.6, not for enums or parameter properties), the top-level-await-needs-a-module note, and the `[[ ]] && a \|\| b` catch. Confirmed by test: an EXIT trap runs after SIGINT and SIGTERM (bash 5.3); `hyprctl configerrors` exists on Hyprland 0.56.2 though the current wiki page omits it.

## #8 for the Lua, git and Markdown sheets (2026-11-10, `lua-git-md-sources`)

All 69 commands (Lua 12, git 31, Markdown 26) in `generate-scripting-suite.js` cite their references: the Lua 5.5 manual, LuaJIT's extensions page, Omarchy's `bindings.lua`, `looknfeel.lua` and `hyprland.lua`, the Hyprland wiki, Neovim's Lua docs; the git-scm.com page for every git command used (plus gitrevisions, gitignore, githooks), Git LFS, git-filter-repo and GitHub's sensitive-data and signing docs; CommonMark 0.31.2, the GFM spec, GitHub's writing docs (alerts, tables, task lists, autolinks, closing keywords, Mermaid, math, collapsed sections), Pandoc, glow, mdcat, markdownlint, Prettier, markdown-link-check and markdown-toc. All 93 links were checked to load (lua.org needed a retry). These sheets were already close to right; changes:

| Was | Now |
|---|---|
| `f:read("a")`: "Lua 5.1 needs *a" | 5.1 and 5.2 need `*a`; LuaJIT (Neovim) accepts both |
| Worktree tip: one worktree per branch | ...git refuses unless you pass `--force` |
| `<mark>highlighted</mark>` "rendered on GitHub" | `<ins>underlined</ins>`, which GitHub documents (with `<sub>` and `<sup>`) |
| mdcat listed as a current alternative | Notes its repository is archived |

Confirmed as written, for example: reflog expiry 90 / 30 days, `git bisect run` exit codes (0 good, 1–127 bad except 125 skip), `merge.conflictStyle zdiff3`, `push.autoSetupRemote`, `--ours`/`--theirs` swapping in a rebase, git-filter-repo removing `origin`; the Omarchy `o.bind` / `hl.unbind` / `hl.config` forms and `require("hypr.bindings")` (checked against an Omarchy install). Git is at 2.56.0.

## #8 for the fiber optics suite (2026-11-10, `fiber-sources`)

All 15 commands (in `fiber.js`) and 4 Pro Tips (in `generate-fiber-suite.js`) cite NVIDIA's DR4 datasheet, LinkX configuration maps, ACC spec and MPO cable spec, the mlxlink manual, ethtool(8) and its source, the kernel's sysfs-class-infiniband ABI, SONiC's command reference and sfputil source, Junos command pages, Fluke Networks, an IEEE 802.3bs KP4 contribution and a Base-16 (MPO-16) guide. The generator rebuilt each command field by field, so `src` is now passed through to the main, options and recipe cards (34 cards). Arista and Cisco docs refuse automated requests, so their syntax is noted as not re-checked. Corrections:

| Was | Now |
|---|---|
| Pro Tip: "transceiver receptacles are always FEMALE; cables must be MALE" (contradicting its own card) | Transceivers are pinned (male); NVIDIA's transceiver-to-transceiver MPO-12/APC cable is female-to-female, Type B |
| `ethtool -m … \| grep -E "Laser (rx\|output) power"` | `grep -Ei "output power\|optical power"`: ethtool labels the RX reading "Receiver/Rcvr signal average optical power" ("Laser rx power" is only on alarm lines) |
| RX "sensitivity −8 to −10 dBm, overload +2 dBm"; "all lanes low −8 to −12 dBm" | NVIDIA 400G DR4: −5.9 to +4.0 dBm average per lane, damage above +5 dBm |
| Short DR4/FR4 runs may need 3–5 dB attenuators | DR4 launches at most +3.0 dBm and accepts +4.0: safe back-to-back; attenuators are for ER4/ZR-class optics |
| Passive DAC ≤2.5 m (card) / 1.5–2 m (Pro Tip); AEC to 7 m / 4–5 m | NVIDIA LinkX at 100G/lane: passive DAC up to 3 m, active copper (ACC) 4–5 m |
| `mlxlink … --show_ber` | No such flag: BER is in `-c` / `--show_counters` |
| `…/counters/link_downed_counter` | `/sys/class/infiniband/*/ports/*/counters/link_downed` |
| Pre-FEC BER "normal 10^-7 to 10^-5", ">10^-4 = dirty" | KP4 FEC is designed for a pre-FEC BER up to about 2.4e-4; healthy links sit far below |
| "85%+ of link issues are dirty ferrules"; dust caps "outgas plasticizer"; "30W+", "25W" OSFP figures; "lane skew <2.5 dB"; "<0.1 ns" DAC latency | Unsourced numbers removed; contamination described as a leading cause |
| Finned OSFP "will damage the server heat sink" in an RHS cage | Match finned modules to switch cages and flat-top (RHS) modules to adapter cages |

## #8 for the motherboard POST-code suite (2026-11-10, `mb-sources`)

All 17 commands (in `motherboards.js`) and 7 Pro Tips (in `generate-motherboards-suite.js`, which now passes `src` to the main, options, recipe and Pro Tip cards) have a source line on the hub and the seven sheets (41 cards). 13 cite AMI's Aptio V status-code table (Supermicro's copy of AMI Aptio 5.x Status Codes rev 2.04), Intel's S2600ST TPS MRC table, GIGABYTE's BMC password notice, the DMTF Redfish schema, NVIDIA's NCCL GPU troubleshooting page and the Linux kernel source. Four that depend on one board's manual (DIMM slot names, ASUS and GIGABYTE LEDs and jumpers, 2-socket advice) now say "Not verified" instead of implying a source. This sheet had the most invented detail so far:

| Was | Now |
|---|---|
| B0–BF as one "Intel & AMD DDR channel training" range (B4 RCD, B7 training fail, BA BIST…) | Intel MRC during memory init (B0 detect DIMMs, B7 train DDR4 ranks, BF MRC done); AMI reuses B0–B7 later in BDS (B2 option ROM, B4 USB hot plug, B7 NVRAM reset); AMD doesn't use the range for training |
| E0–EF as AMD ABL memory/xGMI codes (EA training error, EE complete / xGMI timeout), socket torque 12.0–13.5 vs 14.0 in-lbs | AMI defines E0–EF as S3 resume; Intel MRC uses E8/EA for memory errors; EPYC's early codes are vendor-specific: use the board manual. The conflicting numbers are gone |
| Memory Pro Tip: 0x53 = bad SPD, 0x55 = no usable memory | 0x51 = SPD read failed, 0x53 = no usable memory, 0x55 = memory not installed |
| 0x91 PCI bus init, 0x92 bridge init; 0x69 NB SMM; 0x2F "init complete"; 0xAC boot menu; 0xd8 "or corrupted NVRAM"; 0x00 reset vector; "codes starting with A are BDS" | AMI: 0x91 driver connecting, 0x92 PCI bus init, 0x69 NB DXE init (SMM 0x6A), 0x2F memory init (other), 0xAC ASL PIC mode, 0xd8 invalid password, 0x00 not used, BDS = 0x90–0xCF |
| `ipmitool raw 0x30 0x18`, `raw 0x32 0x8b`, `raw 0x3c`, `/redfish/v1/Managers/1/Oem/Asus/PostCode` | Removed (no source; unknown raw IPMI commands are risky): `ipmitool … sel elist` and Redfish BootProgress instead |
| GIGABYTE unique BMC password "8 characters on the CPU cover" | GIGABYTE: shipped before March 2020 = password; later = last 11 characters of the serial number on the sticker |
| sysfs board identity "without root"; reading the BERT table | `board_serial` is 0400 and `/sys/firmware/acpi/tables/*` are root-only (kernel `dmi-id.c`, checked on this machine) |
| MMIO High Base 56T / granularity 1024G as mandatory | Use the server vendor's values; ACS-disable advice now cites NVIDIA's NCCL page |

Also fixed on the Quantum in-band switch sheet: `mlxlink … --show_ber` (no such flag) → `--show_counters`.

## #8 for the Omarchy sheet (2026-11-10, `omarchy-sources`)

All 19 cards in `omarchy.js` cite Omarchy's own files at the `v4.5.0` tag (the binding files, the user `bindings.lua` template, the copy-url and yt-dlp browser extensions, `omarchy-capture-region`, and the Ghostty, Alacritty and foot configs). Each binding on the sheet was matched by script against every `o.bind` / `bind_toggle` / `bind_hold` in Omarchy 4.5.0 installed here (identical to the tag) plus `~/.config/hypr/bindings.lua`; all matched except one. Changes:

| Was | Now |
|---|---|
| Super + Shift + F23 opens the menu (the Copilot key) | Removed: Omarchy 4.5.0 has no F23 binding |
| (missing) | Ctrl + Brightness Up / Down also change the keyboard backlight |

Noted on the cards: F9 and Super+Ctrl+X dictation, and the Gmail / Google Calendar web apps, are personal overrides in `~/.config/hypr/bindings.lua`; Omarchy's own dictation keys are Alt+Space and hold Alt+Right Alt, bound only while a dictation backend is installed.

## #8 for the Jira JQL sheet (2026-11-10, `jira-sources`)

All 22 cards in `jira.js` cite Atlassian's Jira Cloud JQL docs (fields, functions, operators, keywords, text-field search syntax, advanced search). The queries held up; changes are small:

| Was | Now |
|---|---|
| `~ / !~` listed without a caveat | The catch-all `text` field accepts only `~` (Atlassian lists `!~`, `=` and the rest as unsupported) |
| "Filters > View all issues > Switch to JQL" | "View all work items (older Jira: View all issues)" |

Noted: Jira Cloud is renaming issue → work item and project → space (`workItemHistory()`, `linkedWorkItems()`); Atlassian says existing JQL with the old names keeps working, and Data Center keeps them, so the sheet keeps `issueHistory()` / `linkedIssues()` / `project`. `breached()` and `remaining()` need Jira Service Management.

## #9 for the Pro Tip cards on the older suites (2026-11-10, `pro-tips-sources`)

The last unsourced cards: 73 Pro Tip entries (67 sheets plus the same six on the BMC tools hub). Each now cites the docs its sheet's other cards use (NVIDIA, rdma-core/MFT, ipmitool, man7/kernel/netplan, DMTF Redfish schemas and DSP0266, NVIDIA Cumulus/MLNX-OS, Arista, Cisco, SONiC, Dell/HPE/Supermicro/Lenovo/FreeIPMI). The 17 InfiniBand tips repeat each sheet's first command, so they share its source. Fixes found on the way:

| Area | Was | Now |
|---|---|---|
| MIG | `mig -lgi` "lists supported profiles"; `-cgi 19,19` | `-lgip` lists profiles (`-lgi` lists instances); profile IDs are model-specific |
| DCGM | r3 "15 minutes", memtest in r3 | NVIDIA's table: r3 < 35 min, r4 < 2.25 h on 8 GPUs; memtest and pulse only at r4 |
| Fabric Manager | must always match the driver; CRC errors mean "dirty optics" | Version match only before driver 620; HGX NVLink is not optical; B200/B300 need NVLSM |
| Xid | 45 "driver reset required"; 62 "VBIOS/GSP timeout" | Xid catalog wording |
| GPU tips | `--gpu-reset` "secondary-bus reset"; `nvidia-persistenced --user root`; "~450 GB/s AllReduce"; "GPU vs HBM delta > 15 °C" | Function Level Reset by default; systemd unit; the two invented numbers removed |
| IPMI | `bootparam set bootflag no-timeout` (ipmitool rejects it) | Chain with `power cycle`, or `options=persistent` |
| Ethernet | YAML needs "exact 2-space" indents; `-P 8` is "bidirectional"; layer3+4 balances "evenly" | Only tabs are forbidden; `--bidir`; one flow stays on one link |
| Redfish | `$expand`/`$filter` unescaped in double quotes (the shell ate them); ForceRestart = "4 s button hold"; IndicatorLED; `LeakDetectionSensors`; `Processors/GPU_0..7` | Escaped / `--data-urlencode`; schema wording; LocationIndicatorActive; LeakDetection/LeakDetectors; `GPU_SXM_<n>` |
| Switches | `nv set interface swp1 state up`; `--view lldp`; "Clause 91" for 400G; "-8 dBm" / "-14 dBm" / "-2..+2 dBm" limits; `orchagent` container | `link state up`; `nv show interface lldp`; RS FEC without a clause; module thresholds; orchagent runs inside swss |
| RACADM | `update viewreport` "result of the last update" | The `--verifycatalog` comparison report; `--reboot` is for single-file updates |

Not checked: Arista `configure session` commands (Arista refused automated reads) and the Cisco vPC configuration guide (404); `nvsm show health` (NVIDIA's NVSM pages are empty; removed in #33). The cards say so.

## #10 Sources in search, tour v12 (2026-11-10, `search-sources-tour`)

- **Index:** command variants inside a card (the extra `dmidecode -s …` forms and so on, about 1,000 entries) now inherit the card's source in `global-search-index.js` (`build-index.js`); a variant's own third-element source wins. Every index entry now has a source.
- **Ctrl+K:** each command result ends with one plain-text line, "Source: <first doc> +N · verified Nov 2026", or "⚠ Not verified"; amber when unverified or over a year old. No links, because clicking a result opens its sheet.
- **Tour v12:** three new "What's new" steps (sources on every card, sources in search, the IBM Storage Scale sheet); the invite names them; "1,500 commands" → "2,000+"; the Slurm and filesystem steps are no longer flagged new.

## #11 One page for CLI Tools (pilot, 2026-11-10, `merge-cli-tools`)

The 47 CLI tool pages are now one page, `cli-tools.html`. The rail, the CLI menu and Ctrl+K filter it in place by hash (`#grep`, or a command id); **All 47 CLI tools →** shows everything.

| Piece | Change |
|---|---|
| Pages | `grep.html` … `cloud-init.html` are redirects (`build-redirect-stub.js`); their 47 generated `.js` files are deleted; the generator only writes the menu and the redirects |
| `common.js` | `initSheetFilter` / `applySheetFilter` (hash → part), `currentSheetFile()` (`cli-tools.html#grep` counts as a sheet for the rail, pager, visited ticks and practice), `migrateMergedSheet` (old stars, visited, practice keys), `goToSheet` stays on the page |
| Search | entries carry `sheet`; the old per-tool duplicates are gone. 76 generic filler cards (`man X \|\| X --help`, `which X && X --version`) are dropped; the 6 real scp/tmux pipeline recipes moved onto the scp and tmux cards with their sources |
| Portable | menu items become `#sheet-cli-tools--grep` and open the sheet filtered |
| Counts | 246 → 199 pages (redirects not counted); 2,174 → 2,098 commands (the filler cards) |

## #12 One page per group, for every group (2026-11-10, `merge-all-groups`)

The CLI pilot's pattern, applied to the other 21 groups: 172 more pages became parts of their group page (219 in all; 27 pages remain).

| Piece | Change |
|---|---|
| Data | Each group page's `.js` is now its source: sections tagged `part`, plus the cards only the old pages had (≈100 Pro Tip cards; Scripting's 14 language sheets, 385 commands). The 17 InfiniBand tip cards only repeated each tool's first card and were dropped. |
| Old headers | Each part keeps its old page's title, subtitle and version label (shown in the **Showing …** bar) |
| `common.js` | parts spanning several sections; old page name for page-keyed features (`nv-smi.html`); a part change reloads; per-recipe source lines where a recipe's source differs from its card; visited/recents/usage accept `page#part`; navi export groups by part; trail practice matches by part; migration writes only when something moves |
| Renderers | Windows and ipmitool cards now draw their recipes (`subcommands`), which only the old pages showed |
| Build | No generators run: menus edited in `nav/nav-source.html`; `build-nav-groups.js` reads the current menus |
| Checked | every old page's commands are in its part (index comparison, 172/172); each old address opens filtered with the rail and pager following (browser, 172/172); 25/25 tests |
| Old pages deleted | After the checks passed, the 219 redirect pages and the 172 old data files were backed up to `backups/merged-old-pages-20261110-181904.tar.gz` (+ `.sha256`, file list in `.list.txt`) and deleted. Links that named old pages now resolve through `sheetHref()` (decoder, analyzer, Explain, Rosetta) or were rewritten (Omarchy's own nav, the storage playbook). All 219 `group#part` addresses re-checked in the browser. |

## #13 Generators retired (2026-11-10, `remove-generators`)

With every group on one page, nothing ran the 25 page generators (`generate-*-suite.js`, `generate-card-utils.js`, `generate-suite-kit.js`, `create-scripting-data.js`) or the redirect helper `build-redirect-stub.js`, and running one by hand would have re-created the deleted pages. All 26 were backed up to `backups/generators-20261110-183822.tar.gz` (+ `.sha256`, list in `.list.txt`) and deleted, with the code that still called them (the redirect checks in `build-index.js`, `build-portable.js` and the doc-counts test, and the unused generator-menu reader in `build-nav-groups.js`). Each group page's `.js` is its own source now; menus are edited in `nav/nav-source.html`.

## #14 Switch Rosetta checked (2026-11-10, `rosetta-switch-check`)

Each cell checked against the NVUE command reference (Interface, LLDP, Platform, System, System-Logs, BGP, Action and Config pages), the SONiC command reference, the MLNX-OS 3.12.6200 manual (InfiniBand interface, chassis management, logging, subnet manager) and the NX-OS 10.5 show-command book; Arista via its EOS 4.37 manual where it could be read.

| Was | Now |
|---|---|
| `nv show interface status` | `nv show interface` (no status subcommand) |
| `nv show interface --view lldp`; note "--view counters" | `nv show interface lldp`; drops via `nv show interface swp1 counters drops` (only `--view ber` and `--view dom` exist) |
| `show logging --lines 50` (SONiC) | `show logging \| tail -n 50` (`--lines` only follows a process name) |
| `show interfaces ib transceiver diagnostics` (MLNX-OS) | `show interfaces ib 1/1 transceiver` (the documented per-port form) |
| "check on your release" on NX-OS optics and BGP, NVUE and SONiC BGP | removed: documented |
| — | now marked: MLNX-OS version, per-port errors, inventory, `show ib sm`, clear counters; EOS clear counters |

Still unconfirmed (marked): EOS `show version`, `show inventory`, `show mac address-table`, interface bounce, `copy running-config startup-config`, BGP summary (Arista refused or the manual pages were too long to read in full); NX-OS clear counters and copy (no 10.5 fundamentals reference). Column links go through `sheetHref()` to `switches.html#sw-…`.

## #15 Terminal bridge: token hand-off, background, Stop (2026-11-10, `bridge-handoff-stop`)

| Ask | Done |
|---|---|
| Token goes in by itself | `term-bridge.py` opens the site in the default browser (`xdg-open` / `open`) with `#term-token=…&term-port=…`; the page saves it, strips it from the address and history, opens the Terminal and connects. Preview server if up, else the file; `--url`, `--no-open`. The token is not served over HTTP (a sandboxed iframe sends Origin `null` too). |
| Close the terminal after starting it | Default is background: double fork + `setsid`, log `~/.cache/dc-cheatsheet/term-bridge.log`, pid `~/.config/dc-cheatsheet/term-bridge.pid`. `--foreground` keeps the old behaviour. A second start reports "already running" and reopens the site. |
| Stop bridge button | In the dock (asks first): sends `{"type":"stop"}` on the live connection (or a short one with the saved token); the bridge hangs up every shell, removes its pid file and exits. Also `--stop` (SIGTERM). |

## #16 The Switch & Fiber Field Guide folded in (2026-11-10, `fold-switch-guide`)

From `/home/jason/Work/agy/network-switch-guide` (read-only), the parts the cheat-sheet lacked:

| Where | What |
|---|---|
| Front panel (▦) | 8 new drawn layouts (SN5400, SN5600, SN2410, Arista 7260CX3-64, N9K-C93180YC-FX3, C9200L-48T-4X, CCR2216, Hasivo S5800W-24G-2S), each checked against its vendor photo; ACS8000 and MX304 photo-only. Vendor photos (`assets/panels/`, 11 WebP, 0.56 MB; PNGs converted, Hasivo trimmed) above the drawing and inline in the portable file. Per-model port parsers; extra ports by side/column, searchable and clickable. QM9700/QM9790: IB `port N` → cage, from NVIDIA's QM97XX manual p. 32. **Installed optics** record per cage (`cs_panel_optics_v1`, in Backup, CSV copy). |
| Fiber → Team Optics & Fit | The team's 12 part labels with per-device fit, optic families, and the BF3 B3220 / CX7 adapter table (part numbers and firmware as the guide gives them) |
| Fiber → First Connection | Five steps, cage/port/lane/breakout, reading the jacket and polish, QM9790 IB port numbers (checked), symptom paths |
| Switches → Hardware & Front Panels | One card per device (11), findable with Ctrl+K |
| Glossary | 30 terms (GbE, SFP+, SFP28, QSFP28/56/112, QSFP-DD, LC, MTP, OM3–OM5, OS2, SR4/SR8/VR4/DR4/FR4, SX/LX, LMIC, EOS, NX-OS, QSA, C2P/P2C, MFT, SKU, Tx/Rx) |

Sources: the guide's vendor links are carried as the cards' sources without a "verified" date, and each card says they were not re-read; the four First Connection cards the guide gave no source for say **Not verified**. Only the QM9790 IB port numbering was checked against the vendor document here. Found: the guide's N9K photo is Cisco's N9K-C93180YC-**FX** image (labelled as such on the panel).

## #17 Front panel tiles, as in the field guide (2026-11-10, `panel-tiles`)

| Ask | Done |
|---|---|
| "Arista 7060 is listed twice" | Not a duplicate: four different 7060X5 models (DX5-64E, PX5-64E, DX5-32, DX5-64S). The picker was grouped, then the reference layouts were removed (#18). |
| Port counting inside the cage (QM9790: 1-2, then 4-3) | Every cage is a tile: its label on top (QM `C01`…`C32`), its logical ports inside (QM odd cages 2n−1 \| 2n, even cages 2n \| 2n−1; SN5400/SN5600 breakout children `s0…`), and the recorded optic's short name below (`—` none, `RJ45` copper). Click a logical port to search it; click the cage to search the cage. On QM a plain number or `port N` is the IB port, `cage N` / `C05` is the cage. |
| Check how all the other switches are laid out | Same tile drawing on all 17 models. SN5400/SN5600 get a **View** menu (Native / 2× / 4×, default 2×; SN5600 2× shows s1 \| s0 on the lower cage rows, as the guide draws it); typing a breakout name (`swp14s3`) switches the view once, and a View choice then sticks until the search changes. ACS8000 (LAN1/LAN2 Cu and SFP) and MX304 (LMIC0–2) are now drawn as tiles instead of photo-only. The vertical brand name is centred and fits short panels. |

## #18 Reference layouts removed from the front panel (2026-11-10, `panel-tiles`)

The four Arista 7060X5 layouts and the two generic patterns are gone; the picker lists only the team's 11 devices (no groups). Default model is the QM9700/QM9790 (a saved 7060 choice falls back to it). The cable-check sample and the rack-view sample leaf switches are now the Arista 7260CX3-64, so "open the front panel" from the rack still lands on a drawn switch. Removed with them: the `mine` flag, the picker groups, the generic brand/"pattern" styling.

## #19 Group pages switch parts without reloading (2026-11-10, `part-switch`)

| Found | Fixed |
|---|---|
| Every part change (rail, pager, menu, Back) ran `location.reload()`. The new page painted at the top, then the browser restored the old scroll position, animated by `scroll-behavior: smooth`: a flash to the top and a ~300 ms glide back to wherever the old part had been. The rail jumped too. | Each group script registers `SHEET_FILTER.setPart(part)`; `common.js` `switchSheetPart` calls it and redoes what a load sets up (Showing bar, strips, hub landing, visit record, visited ticks, rail, pager, panels). One document load per session. |
| Where the new part lands | The window jumps once, instantly, so the Showing bar sits just below the fixed command bar (it was hidden under it in a first try); it stays put if the part's top is already in view. **All …** opens at the top. A card link waits two frames for the masonry layout, then jumps to the card. |
| Back/Forward | `history.scrollRestoration = 'manual'` on group pages, so the browser's restore doesn't glide against the switch. |
| Rail | Keeps its scroll position; scrolls only itself (not the window) if the current item is out of view; the load-time nudge is skipped during a switch. |

A page without `setPart` (an old cached copy) still reloads. The portable file has its own in-place swap and is unchanged.

## #20 Tour v14: the front panel and in-place sheets (2026-11-10, `tour-v14`)

Four new steps, shown to returning users under **What's new** (v13's two steps are now in the full tour only):

| Step | ▶ button |
|---|---|
| Find a port on your own switches (the 11 devices, photos, tiles with the logical ports inside: C02 holds 4 \| 3) | Opens the front panel on the QM9790 with IB port 3 lit |
| Breakouts and the optic in each cage (SN5400/SN5600 View menu, installed-optics record) | Opens the SN5600 at `swp14s3` in the 4× view |
| Team optics and the first connection (Fiber parts, Switch hardware cards, 30 glossary terms) | Opens Fiber → Team Optics & Fit |
| Switching sheets no longer reloads | Opens CLI Tools at `tar` |

The returning-user invite and the Ctrl+K "What's new" entry name the new additions (the Ctrl+K line still described the Slurm and filesystem round).

## #21 Field-guide cards re-checked against vendor pages (2026-11-10, `recheck-guide-cards`)

26 of the 29 guide cards (the QM9790 port-numbering card was already checked) now carry a verified date, links that point at the page holding each fact (titled for what they are), and a note on what was and was not checked. The three First Connection procedure cards (five steps, the words, symptom triage) stay **Not verified**: they are team practice with no vendor page.

| Card | Found | Now |
|---|---|---|
| MMA4Z00-NS-FLT | Guide: "NVIDIA identifies this as an adapter side part" | **Wrong.** NVIDIA: flat top for liquid-cooled and DGX H100 Cedar7 systems; ConnectX-7 MCX750500B/C mezzanine cards **only**; listed for ConnectX-8. Adapter-side single-port parts are MMA4Z00-NS400 (OSFP) and MMA1Z00-NS400 (QSFP112) |
| QSFP112-400G-SR4 / VR4 | "The SN5400 QSFP-DD cage does not support QSFP112" | **Wrong as stated.** NVIDIA: a QSFP-DD cage supports QSFP112, 56 and 28 devices; the 50G-PAM4 SN5400 is listed for QSFP56/QSFP28, and "many, but not all" modules down-shift |
| Optic families | "NVIDIA documents 400G DR4 QSFP-DD for SN5400" | Not found; now "the SN5400 data interfaces take QSFP-DD modules" (NVIDIA) |
| MMA4Z00-NS | 50 m | 50 m OM4 / 30 m OM3 |
| OSFP-400G-SR4 | 100 m OM4 | 70 m OM3 / 100 m OM4; NVIDIA: single-port OSFP never goes in a twin-port switch cage |
| QSFP-100G-SR4, QSFP-DD-400G-SR8 | MPO-12/UPC, MPO-16/APC | The sources give MPO-12 / MPO-16 without the polish: now says so |
| SN5400 / SN5600 | 1/10/25GbE SFP28 | NVIDIA: 25GbE, 1GbE supported on 65/66; 10GbE not stated. Breakout options added (2×200 / 4×100 / 8×50; 800 / 2×400 / 4×200 / 8×100) |
| SN2410 | – | NVIDIA lists MSN2410-CB2RC as **End of Life** |
| C9200L | 4 × 10G uplinks; data-sheet link 404 | 4 × 1/10G fixed uplinks (data sheet updated 2026-11-05, new link); 1G SFP or 10G SFP+ |
| Adapters | Firmware 32.39.4082, 28.39.3004 | Both are real NVIDIA LTS releases, with newer LTS builds out; MCX75310AAS-NEA is the manual’s MCX75310AAS-NEAT (single-port OSFP, NDR 400Gb/s / 400GbE) |
| Links | Five "module data sheets" were NADDOD **switch** data sheets; one "data sheet" was ConnectX-8 release notes | Kept where their compatible-module tables hold the spec, retitled; wrong ones replaced |

Confirmed unchanged: FS SFP-10GLR-31, XS+85LC01D, QSFP56-200G-SR4, QSFP-DD-400G-DR4, OSFP-800G-2XDR4, QM9790 (MQM9790-NS2R unmanaged, C2P), 7260CX3-64-F, CCR2216, Hasivo, ACS8000 (copper left / SFP right, one per LAN, fiber priority; 8/16/32/48 serial), MX304 (LMIC0/1, RE1/LMIC2), N9K-FX3. Cage layouts and port order are from the vendor photos: no vendor text describes them.

## #22 Switch commands checked: the sheet rows and every Rosetta cell (2026-11-10, `switch-commands-check`)

Sources this time were the full manuals as PDFs (downloaded and searched, which got past Arista's refusals and the page-length limits that stopped the last round): MLNX-OS 3.12.6200 LTS (727 pages), Arista EOS 4.37.0F user guide (5,163 pages), Cisco NX-OS 10.5(x) Interfaces and Fundamentals guides, the rdma-core smpquery man page.

| Switches page row | Result |
|---|---|
| `show cables` (MLNX-OS) | **Not a command** in 3.12.6200: now `show interfaces ib transceiver` |
| `show images && boot system partition next` | **Wrong syntax**: `boot system {location \| next}`: now `show images` / `configure terminal` / `boot system next` |
| `interface ib 1/1 description "…"` | **Wrong form**: `description <string>` (40 bytes) is entered inside interface ib mode |
| `show interfaces ib 1/1 counters` | **No counters keyword**: the counters are in `show interfaces ib 1/1` |
| `show interfaces ib transceiver`, `interface ib 1/1` + `clear counters`, `show inventory && show version` | Confirmed |
| `smpquery nodeinfo 1 && smpquery portinfo 1 15` | Confirmed (LID and port are examples) |
| EOS `show version && show boot-config`, `show running-config interfaces ethernet 1` | Confirmed (now the manual's `ethernet 1` form) |
| EOS `bash ethtool -m Ethernet1` | Still **Not verified**: EOS documents `bash <command>` but not the Linux name of Ethernet1 |

Switch Rosetta: all 15 cells that said "check on your release" are confirmed (EOS: version, inventory, MAC lookup, BGP summary, bounce, clear counters, copy; MLNX-OS: version, per-port errors, inventory, `show ib sm`, clear counters in interface ib mode; NX-OS: bounce, `clear counters interface ethernet1/1`, copy). Notes added: EOS MACs in dotted hex; `show ib sm` is the SM admin state (`show ib smnodes` for HA); EOS `clear counters ethernet 1` for one port.

## #23 Field-guide glossary terms checked (2026-11-10, `glossary-check`)

The 30 optics and switch terms the guide added, against vendor and standards pages:

| Term | Was | Now |
|---|---|---|
| FR4 | "Four-wavelength reach" | **Far Reach**, 4 wavelengths, duplex LC, about 2 km (NVIDIA) |
| QSFP28 / 56 / 112, SFP28 | "28 / 56 / 112 Gb/s lanes" | The number is the connector's speed rating (NVIDIA); the lanes run 4 × 25G NRZ, 4 × 50G PAM4, 4 × 100G PAM4 |
| LMIC | "Line Module Interface Card" | Juniper never spells it out: "Juniper MX304 line module", 4 × 400GbE / 16 × 100GbE or a mix |
| NX-OS | "Nexus Operating System" | "Cisco NX-OS" (no Cisco page confirms the expansion) |
| OM3 / OM4 / OM5 | One vague line each | TIA-492AAAC 2000 MHz·km; TIA-492AAAD 4700 MHz·km; TIA-492AAAE wideband for SWDM 850–953 nm (Corning) |
| DR4, VR4, QSA, QSFP-DD, C2P, P2C | Correct but thin | Reach (500 m; 50 m OM4), what QSA does (NVIDIA MAM1Q00A-QSA), QSFP-DD backwards fit, NVIDIA's red/blue airflow marks |

Confirmed as written: GbE, SFP+, LC, MTP (US Conec brand of MPO), OS2, SR4, SR8, SX, LX, EOS, MFT (NVIDIA Firmware Tools: mst, flint, mlxconfig, mlxlink), SKU, Tx, Rx. SFP+, SFP28 and OS2 rest on common usage (no vendor page found); the code comment says so.

## #24 N9K front photo note made precise (2026-11-10, `n9k-photo-note`)

Cisco's FX3 data sheet uses a drawing whose chassis prints **N9K-C93180YC-FX**, captioned as the N93180YC-FX3. The photo note said "the guide uses it for the FX3", which read as if the guide had picked the wrong picture. Now: the chassis reads FX, Cisco uses it as its FX3 figure, and the port layout matches the FX3 install guide (48 SFP28, 6 QSFP28 at 49–54). The hardware card's source note says the same.

## #25 The last four InfiniBand recipes checked (2026-11-10, `ib-four-check`)

| Row | Found | Now |
|---|---|---|
| `ibhosts -C mlx5_0 -P 1 \| wc -l` | Note said -C/-P are undocumented | They are (common options included in the ibhosts man page). The description now says it counts CA nodes (HCAs), not ports |
| `grep -E '^-E-\|^-W-' /tmp/ibdiagnet2/ibdiagnet2.log` | Prefixes "not described" | NVIDIA example output prints -E- / -W- lines; ibdiagnet2.log is the log. The path matches the card's `-o /tmp/ibdiagnet2`; the note names the default `/var/tmp/ibdiagnet2/` and that the log keeps only 5 warnings (all are in the CSV) |
| `show_gids` | "Not described" | NVIDIA's NCCL guide documents it, and that NCCL 2.21+ picks the GID itself (do not set NCCL_IB_GID_INDEX); current DOCA/MLNX_OFED pages dropped the script, the sysfs table works everywhere |
| `systemctl status opensm.service` | Only the distro unit name | **Now `systemctl status opensm opensmd`**: Debian/Ubuntu/Fedora ship `opensm.service`, NVIDIA DOCA starts `opensmd` |

InfiniBand page: no "Not verified" rows left.

## #26 lspci AER audit and the RJ45 chart checked (2026-11-10, `lspci-rj45-check`)

| Entry | Found | Now |
|---|---|---|
| `lspci -vvv -d 10de: \| grep -E '^([0-9a-f]{2}:\|…'` | **The header pattern breaks on multi-domain servers**: lspci only drops the PCI domain on machines that have just domain 0, so on a multi-domain GPU server every device line starts `0000:8a:…` and the grep kept none of them (tested here: 0 of 60 kept) | `lspci -D -vvv -d 10de: \| grep -E '^[0-9a-f]{4}:\|LnkCap:\|…'`: always prints the domain, keeps all 60. Labels (LnkCap, LnkSta, NUMA node, UESta, CESta) confirmed in pciutils source |
| Its UESta / CESta flag | Listed BadTLP, BadDLLP, replay timeout for both | Split: UESta = DLP, SDES, poisoned TLP, CmpltTO, MalfTLP, UnsupReq…; CESta = RxErr, BadTLP, BadDLLP, Rollover, Timeout; `+` means set |
| RJ45 T568A / T568B chart | Pinout unchecked (TIA paywalled); T568A labelled "Gov/Res"; "PAM5 / PAM16" unsourced | Pin colors confirmed (trueCABLE article by a Fluke Networks specialist), pin 1 orientation (ICC), A vs B swaps pairs 2 and 3 (FOA). Label now "older TIA default; some US government contracts" (ANSI/TIA 568.0-E mandates neither); the modulation detail is gone. The diagram labels match |

## #27 No sudo in the tools; root stages run as sudo -n (2026-11-11, `tools-no-sudo`)

| Found | Now |
|---|---|
| 23 commands in the healthy-ranges panel and the runbooks were stored as `sudo nvme smart-log`, `sudo mlxlink`, `sudo lspci`… against the house rule. The no-sudo test only read the sheets | Stored without sudo, shown with the 🔒 ROOT badge (healthy ranges, runbook steps, locked steps), copied as `# needs root` (the site-wide root style); the runbook export says "needs root". The test reads the tools too |
| ▶ Run on a sheet and the runbook autopilot only turned an existing `sudo` into `sudo -n`: sheet commands have none, so ▶ Run on `nvme smart-log` ran as your user and printed Permission denied | One helper, `privRunForm`, puts `sudo -n` on exactly the stages the root rules mark (`sudo -n lspci … \| grep …`, both stages of `ras-mc-ctl … && ras-mc-ctl …`), leaves the rest (`nvidia-smi -q`, `ethtool -S`) and multi-line scripts alone. ▶ Run, the runbook steps and the capture script all use it |
| `ethtool --cable-test` was not marked root | Added to the ethtool rule: a cable test is an ethtool-netlink "action" request, which needs CAP_NET_ADMIN (kernel docs) |

## #28 Boot flag timeout: the raw command that works (2026-11-11, `ipmi-bootparam`)

| Found | Now |
|---|---|
| `chassis bootparam set bootflag force_pxe options=no-timeout` was flagged Not verified. In ipmitool's source the `no-` prefix only matches a bare `no-` (a 2020-06-10 refactor, 6e037d6), so it prints `Invalid option: no-timeout`, **still sets PXE, and exits 0**: a script never notices. IPMITOOL_1_8_19 (2022, the last release; the GitHub repo is archived) has the bug; Codeberg commit b67f400825 (2024-06-24) fixes it, unreleased | `raw 0x00 0x08 0x03 0x08 && chassis bootparam get 3`: Set System Boot Options, parameter 3 (boot flag valid bit clearing), bit 0x08 = don't clear on the 60-second timeout, the exact bytes ipmitool's own code sends. Flags explain each byte, the check line, the undo (`0x03 0x00`), and the tip points to the simpler `power cycle` chain or `options=persistent` |

IPMI and Redfish pages: no "Not verified" rows left.

## #29 The last five hardware-reference cards sourced (2026-11-11, `hw-five-check`)

| Card | Was | Now |
|---|---|---|
| Circuit math (80% rule, three-phase) and the 208 V / 30 A recipe | "NEC not freely readable" | IAEI Magazine quotes NEC 2014 210.20(A) (noncontinuous + 125% of continuous, so 80% of the breaker), its exception (assembly **and** its overcurrent devices listed for 100%), and the Article 100 definition (maximum current for 3 hours or more). The 100% flag now uses the exception's wording. The note says to check the edition your AHJ enforces |
| NVMe link width/speed | "Not in the kernel ABI docs" | The four attributes are defined in the kernel's `pci-sysfs.c`; output reads `16.0 GT/s PCIe` (checked here). E1.S carries x4/x8, E3 up to x16, most SSDs ship x4 (KIOXIA, StorageReview) |
| GPU "evidence first" tip | "Not in the nvidia-smi docs" | NVIDIA GPU Debug Guidelines: the vendor ticket needs nvidia-bug-report.sh output, Fabric Manager logs (HGX) and DCGM diagnostics logs; **field diagnostics are usually required before an RMA** (new flag). Man page: needs root, writes nvidia-bug-report.log.gz |
| TIA-606-D labelling | "Sold, not checked" | Edition and date (October 5, 2021) from the standards listing; the class line now says only what the summaries agree on (four classes by complexity, Class 4 multi-site) |

Hardware reference: no "Not verified" entries left.

## #30 Motherboard cards checked against two board manuals (2026-11-11, `mb-manuals`)

Checked against the **ASUS K14PG-D24** (ESC8000A-E12P user guide, ASUS PDF) and the **GIGABYTE MZ73-LM0** (manual rev 1.0; GIGABYTE's PDF returns 403, so the ManualsLib copy). Both are current 2-socket EPYC boards; other models differ, and the cards say which board each fact is from.

| Entry | Was | Now |
|---|---|---|
| DIMM population | ASUS "slot 1 of each channel first"; GIGABYTE `DIMM_P0_A0`; never mix RDIMM/LRDIMM; "minutes of DDR5 training" | K14PG-D24 is one DIMM per channel (`CPU1_DIMM_A1` … `L1`), with the manual's fill order (1: A1 · 2: A1 G1 · 4: + C1 I1 · 6: + B1 H1 · 8: + E1 K1 · 10: + D1 J1). MZ73-LM0 labels slots A0–X0, one per channel; its matrix did not extract, so the card points to section 1-4-3. ASUS lists RDIMM / 3DS RDIMM only, same CAS latency. The training-time claim is gone |
| ASUS LEDs and jumpers | `BMC_LED1` blinking green, `CATERR_LED1`, `CLRTC1`, "wait ~60 s" | **`BMCLED1`, lit when the BMC works**; no CATERR LED or CLRTC jumper on this board (clear CMOS is a rear switch); `VGA_SW1` 1-2 = VGA on; `DM_IP_SEL1` 2-3 = BMC LAN static 10.10.10.10; Message LED = hardware-monitor event; a Q-Code cycling 0x00–0xFF = "Wait BMC ready" |
| GIGABYTE LEDs and jumpers | `BMC_RDY`, dual-BIOS `SW_BIOS`/`BIOS_SEL` switch ("flip to the backup ROM"), amber `CPU_ERR` | **`LED_BMC`: on = initializing, blink = ready, off = AC loss**; blue ID LED; `CLR_CMOS` 3-pin; J1 `BIOS_RCVR` (recovery from a USB .rom) and `BIOS_PWD`. The MZ73-LM0 has **no backup BIOS chip or switch**; the CPU_ERR LED is not in the manual |
| Dual-socket card | "BMC can flash the host BIOS with the host off" | Removed (in neither manual). Added: ASUS numbers sockets CPU1/CPU2, GIGABYTE CPU0/CPU1; the BIOS update tools each manual names (EZ Flash, CrashFree BIOS 3; BIOS_RCVR) |
| Elsewhere on the page | The GIGABYTE tip card, the 0x61 action ("short CLRTC1 for 10 seconds") and the AGESA quick table (E0–EF meanings removed from the card on 2026-11-10, still in the table) repeated the old names | Rewritten to the same facts; the quick table now says early PSP/ABL codes are vendor-specific |

Motherboards: no "Not verified" entries left.

## #31 The last five BMC-tool entries sourced (2026-11-11, `bmc-five`)

| Entry | Was | Now |
|---|---|---|
| `./saa -l SList.txt … -c GetBmcCfg --file BmcCfg.xml --overwrite` | "Not in the SAA UEFI guide" | **Supermicro FAQ 42925** (2025-05-09) gives exactly this form; SList.txt is one BMC IP per line. The FAQ does not explain `--overwrite`, so the flag says to check `./saa -h` |
| `ls -l /dev/serial/by-id/` | "Standard Linux path" | systemd's `60-serial.rules` creates the by-id and by-path links |
| `dmesg -T \| grep -i tty` | "Standard Linux commands" | The usb-serial core logs "converter now attached to ttyUSB<n>"; CDC-ACM adapters appear as ttyACM |
| `id -nG` (dialout or uucp) | "Depends on the distribution" | Debian base-passwd: dialout = full and direct access to serial ports; ArchWiki: uucp owns ttyS/ttyUSB/ttyACM |
| `systemctl status ser2net` | "Depends on your package" | Upstream ships `ser2net.service` (user ser2net, group dialout) |

Also: the ser2net card's kickolduser (default false), max-connections (default 1) and `*{filename}` include are now checked in ser2net.yaml(5). BMC tools: no "Not verified" entries left.

## #32 Dell removed from the site (2026-11-11, `rf-no-dell`)

The fleet has no Dell hardware, so every Dell entry is gone:

| Where | Removed |
|---|---|
| BMC tools | The racadm part (9 sections, 29 commands and recipes; 78 entries remain), its nav item (shared nav and omarchy.html's own copy), "Dell"/"iDRAC"/"racadm" in the hub title, pill and subtitle |
| BMC Rosetta (`Shift+R`) | The Dell iDRAC vendor and racadm column (now 6 tools), `ROS_RF_IDS`: Redfish paths always use ID `1`. A `dell` vendor saved in the browser is ignored instead of breaking the matrix |
| Redfish builder | The unconfirmed `System.Embedded.1` / `iDRAC.Embedded.1` preset and the two Dell rows in Vendor IDs; the discovery example now names `Systems/DGX` |
| ipmitool | The two Dell `raw 0x30 0x30` fan-control rows |
| Acronyms | iDRAC, FQDD, TSR |
| Shared rules | racadm in the danger match, root rule, password masking, firmware-update detection and `-r` host detection; `idrac` in BMC-hostname detection; the racadm help mapping and help-tools.txt line |
| Wording | Redfish and Motherboards portable subtitles, the `idrac` search tag, "PowerEdge" in the dmidecode example, docs/site.md |

Kept: Dell text inside captured upstream man pages and `--help` output (ipmitool `delloem`, arp-scan vendor names), and the history in this file. Tests: `redfish-builder` (no Dell option or ids) and `sources` 2ze (Rosetta with a saved Dell vendor, 6 tools, ID 1).

## #33 DGX-only content removed (2026-11-11, `no-dgx`)

The fleet has no DGX nodes. HGX content stays, and NVIDIA's DGX docs stay as its source (NVIDIA documents the HGX baseboard's Redfish paths there).

| Where | Change |
|---|---|
| Redfish builder | The DGX preset (`Systems/DGX`, `Managers/BMC`, `LogServices/SEL`) is gone, leaving only Standard (`1`) |
| Redfish HGX cards | "on DGX" now reads "in NVIDIA's DGX docs" / "NVIDIA naming", with a check-your-OEM note; the paths and sources are unchanged |
| NVIDIA ops | The NVSM card (never verified: NVIDIA's NVSM pages were empty) and `nvsm show health` in the tips card; titles and the nav label lose NVSM. Its `nv-fabricmanager -v` flag moved into the Fabric Manager card's Version flag. Ids such as `slurm-nvsm-burnin` are kept so saved stars and links still work |
| GPU form factors | Retitled HGX 8-GPU systems; the DGX B200 row, DGX tags and the DGX B200 guide ref are gone |
| Other | The DGX acronym; `nvsm` in the man-page policy list |

Kept: the fiber notes that name DGX H100 Cedar7 (that is the part's documented compatibility) and DGX doc URLs used as sources. Tests: `redfish-builder` (Standard only, no Dell or DGX ids), `sources` NVIDIA count 31 → 30.

## #34 HPE, Lenovo and Supermicro tools gone; Motherboards is BIOS error codes only (2026-11-11, `fleet-vendors`)

The fleet has no HPE or Lenovo servers. ASUS, GIGABYTE and Supermicro build the boards, so the site keeps only their BIOS error codes, nothing about the boards themselves, and no Supermicro SAA.

| Where | Change |
|---|---|
| BMC tools | The iLOrest, OneCLI and SAA parts are gone (53 entries); FreeIPMI and serial consoles remain (25). Nav, hub title, pill and subtitle follow |
| BMC Rosetta | ipmitool, FreeIPMI and Redfish only. With no vendors, the vendor picker, Detect box and Compare button are not shown; a vendor saved in the browser is ignored. CSS fix: `[hidden]` lost to `display: flex` on those elements, so `.ros-*[hidden] { display: none }` |
| Motherboards | The ASUS and GIGABYTE parts, the DIMM population card and the dual-socket card (board labels and BIOS tools) are gone. POST/MRC/AGESA code text no longer names vendors, models, slots (A1/A0), LEDs or jumpers. Page title: Server BIOS POST Codes. AMI's Aptio V table stays the source even though Supermicro hosts the PDF |
| Shared rules | iLOrest, SAA and OneCLI in the danger match, root rules, password masking, firmware detection; the in-band `ilorest reboot` and OneCLI `triggernmi` reference-only rules; `ilo`/`xcc` in BMC-hostname detection; glossary iLO, XCC, IML, IEL, AHS, FFDC |
| Elsewhere | The Supermicro ipmitool fan row; HPE/Supermicro/Lenovo rows in Redfish Vendor IDs; vendor names in subtitles, tags, examples (RMA model placeholder, the checkup sample node, the dmidecode example) and docs/site.md |

Kept: the Juniper docs URL on networkingdocs.hpe.com (a Juniper source), and "gigabytes" as a unit. Tests: `sources` (25 BMC entries, 32 motherboard cards, no vendor names, the Rosetta checks what is displayed), `reboot-reference` (My kit check now uses the Windows firmware-reboot card), `no-sudo`.

## #35 Parallel filesystems removed (2026-11-11, `no-pfs`)

The fleet runs none of Lustre, WEKA, BeeGFS, IBM Storage Scale or Ceph, so the Parallel filesystems page is gone: `pfs.html` and `pfs.js` (91 entries), the menu group under Hardware (nav source and the `build-nav-groups.js` tab), the two tour steps, the `ceph` man page and its build entry, the old `pfs-*.html` redirects, and the WEKA example in the RMA template. This also clears WEKA and BeeGFS 8 from the sourcing backlog. Test: `sources` 2k now checks that no page or menu group is left.

Agent docs follow the fleet too: `agents/AGENTS.md` (= `CLAUDE.md`) and `AGENTS-portable.md` no longer list parallel filesystems or their health commands, and describe the servers as Linux on ASUS, GIGABYTE and Supermicro boards (was "multi-vendor"). `docs/playbooks/storage-jbod.md` loses its parallel-filesystem section (now NVMe, JBOD, RAID/ZFS).

## #36 Cisco vPC cards checked against the NX-OS 10.5 vPC guide (2026-11-11, `nxos-vpc`)

The vPC tips card said the configuration guide "could not be read". It is read now (via the web-fetch agent; cisco.com refuses curl with 403), with the 10.5 show reference:

| Was | Now |
|---|---|
| "active-active dual-homing without Spanning Tree loop blocking" | No STP-blocked ports, but STP still runs on both peers as a fail-safe |
| Keepalive "out-of-band… prevents split-brain" | Management VRF by default, never over the peer-link; only used when the whole peer-link is down, and then the secondary disables all its vPC ports |
| `consistency-parameters global` = "STP, MTU and VLAN consistency" | `global` for STP mode, MTU and the like; new `… vpc <id>` row for a port-channel's mode, speed, duplex and allowed VLANs. Mismatch suspends the vPC; graceful consistency-check (default) suspends only the secondary's links |
| — | `show vpc role`: lower role priority wins (lowest MAC by default); roles stay swapped after a failover until `vpc role preempt` |

Test: `sources` (switch check) asserts the new wording and the guide reference.

## #37 Sweep after the removals (2026-11-11, `sweep-removed`)

A check of the whole site for leftovers of #32–#35 (Dell, DGX, HPE/Lenovo/SAA, board details, parallel filesystems).

| Checked | Result |
|---|---|
| Page and `#part` links in every sheet, page, the nav source, README and docs | All resolve; the redirect table points only at live parts |
| Runbook, decoder, tour and launchpad references to card ids | All live |
| Stars / My kit, visited ticks, a saved Rosetta vendor | Already ignore removed items |
| Ctrl+K: ilorest, racadm, idrac, onecli, saa, lfs, weka, beegfs, ceph, mmgetstate | No results. `nvsm` matches only the kept `slurm-nvsm-burnin` id (a tag) and `nvidia-smi -q` output ("NVSMI LOG"), both live cards |
| **Home → Recent** | **Fixed:** sheets visited before a removal (`pfs.html`, `bmc-tools.html#racadm`) were still listed and opened a 404 or an empty part. `readRecents()` now keeps only pages and parts the menu still has (the notes page is allowed; in the portable file it checks `PORTABLE_SHEETS` and `data-part`) |

New test `links.test.js`: the static link check, the redirect table, and Recent with stale entries on the site and in the portable file. It will catch the next removal that leaves a link behind.

## #38 Source links checked (2026-11-11, `source-links`)

New `scripts/check-source-links.js` requested all 1,024 source URLs the cards cite (run by hand; needs internet).

| Result | Count | What was done |
|---|---|---|
| Dead | 2 | `kernel.org/doc/Documentation/ABI/testing/sysfs-class-dmi` is gone from the kernel tree: the DMI card now cites `drivers/firmware/dmi-id.c` on GitHub, which shows `product_serial` and `product_uuid` are `0400` (root-only), as the card says. The nano `global.c` 404 was a transient Savannah error |
| Moved | 47 (105 citations) | Updated to the address the site now redirects to: Omarchy `basecamp/omarchy` → `omacom/omarchy` (17), Ansible `docs.ansible.com/ansible/latest` → `/projects/ansible/latest` (12) and ansible-lint, NVIDIA networking pages → `networking-docs.nvidia.com` (ibdiagnet 2.24/2.25, BlueField-3 FW notes; the unversioned NVIDIA SM page now redirects to the DOCA 3.5.0 archive), Python `library/` → `builtins/` (2), CUDA runtime types, Juniper → `networkingdocs.hpe.com` (2), Kubernetes HPA, Cursor rules, the Terraform `moved` block, GitHub task lists, three support.microsoft.com pages, OCP Rack & Power |
| Not moves | 66 | Microsoft Learn only adds `?view=`; conserver drops `www.`; two Debian sites answer with a bot check. The script now treats these as ok or blocked |
| Blocked | 12 | Arista (406, 10 pages), TIA-606-D on GlobalSpec (403), plus the two Debian bot checks: open them in a browser |
| Flaky | 3 hosts | lua.org, gnu.org and Savannah drop some connections; the script retries network errors once |

Only the addresses changed; the redirects come from each doc site, so the pages are the same and the verified dates stay. git.kernel.org (the ethtool `cmis.c` source) now serves a bot check at the same address, which a status-code check can't see; ethtool has no official mirror, so it stays.

## #39 Blocked source links checked in a browser (2026-11-11, `blocked-links`)

The 13 links that refuse scripts (#38) were opened in Chrome and the cited commands looked up on each page.

| Page | Result |
|---|---|
| Arista EOS 4.37.0F: Ethernet ports, LLDP, port channels/LACP, MLAG, IPv6, BGP, environment, switch administration | All load. Every cited command is there: `show interfaces status`, `transceiver detail`, `counters errors`, `phy detail`, `show lldp neighbors [interface] detail`, `show port-channel (dense\|summary)` (summary is a documented form), `show mlag`, `show ipv6 neighbors`, `show ip/ipv6 bgp summary`, `show system environment all`, `show logging` |
| Arista `show inventory` | Was "not in the chapters read": it is in **Session management commands** (EXEC; model/serial, PSUs, fans, each transceiver's manufacturer/model/serial). The recipe now cites that page |
| Arista EOS User Manual PDF | Loads (application/pdf) |
| Debian opensm file list | Loads; ships `opensm.service` and `opensm@.service` |
| Debian base-passwd users-and-groups | Loads; dialout = "Full and direct access to serial ports", as the card says |
| TIA-606-D on GlobalSpec | Cloudflare security check even in a browser; not completed. Open it yourself |

## Found while building (not fixed)

| Finding | Where | Note |
|---|---|---|
| ✅ Fixed (`improve/small-fixes`): Explain described `nvidia-smi -d` as "g. ECC,POWER." | `common.js` flag-description extraction | Sentence *matching* restarted after the dot in "e.g.", "i.e." or "1.2" and dropped everything before it. It now splits at ". " and protects abbreviations. `tests/explain-help.test.js` |
| ✅ Fixed (`improve/small-fixes`): two "could not keep" toasts could never appear | `fnSave` and `pbWrite` in `common.js` | Removed; the #3 save-failure bar reports refused writes |
| ✅ Fixed (`improve/small-fixes`): tour "What's new" not updated | `TOUR_VERSION` in `common.js` | Now version 9 with 5 new steps (search warnings, backup, sources, read-only reboots/NMI, keyboard); the old steps are no longer flagged new. `tests/whats-new.test.js` |
| ✅ Deleted 2026-11-09 (user OK): original test scripts left behind | `backups/scratch/` | 24 files (old `t-*.js` scripts, each superseded in `tests/`; screenshots; an `nv-smi.js.orig`; favicon renders), 3.7 MB |
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
- ✅ **Redfish and IPMI** done on `improve/sources-redfish-ipmi` (45 commands and recipes).
- ✅ **BMC vendor tools** done on `improve/sources-bmc-tools` (107 commands and recipes, no command errors).
- ✅ **Switches and Ethernet** done on `improve/sources-switches` (67 + 21, 15 errors fixed).
- **Next:** the remaining suites (Linux storage, CLI tools) as needed; each is data-only for suite-kit and the six patched generators.

**9. Stop duplicating the full nav into every page**
- **Why:** mostly maintenance and the portable file's size. The direct user gain is small, because pages already load in ~250 ms.
- **Evidence:** the header is ~153 KB of a ~226 KB page, repeated across 237 pages, and the portable file is ~18.2 MB.
- **Plan:** emit the nav once (in `common.js` or a `nav.js` data file), render it at load, and keep a minimal static fallback.
- Impact **L–M** · Effort **L** · Risk **M** · Files: `build-nav-groups.js`, 8 generators, `common.js`, every `*.html`.
- ✅ **Built** (`improve/nav-once`, `tests/nav-once.test.js`). The full nav now lives once in `nav/nav-source.html`. All 17 generators' nav loops edit only that file (`nav/targets.js`), and so does `build-nav-groups.js`. That matters: several generators insert their menu wherever it's missing, so editing pages would re-grow them. A new step, `build-nav-js.js`, writes it into `nav.js` and gives each page a fallback nav: the same top row of tab links without the drop-downs, followed by `<script src="nav.js">`. Running synchronously right after `</nav>`, the script fills the menus before the page paints and before `common.js` reads them; without JavaScript the fallback still links every tab's hub. The portable build reads `nav/nav-source.html`. `omarchy.html` keeps its own nav. The source was byte-identical to the old page nav, and two full builds produce identical output.
- ⚠ **Flag (structure):** a new `nav/` folder and a generated `nav.js`. Edit the nav through the generators or `nav/nav-source.html`, never in a page.

### Innovative ideas

**10. "Practice what I actually use"**
- **Why:** J5. It drills the commands you copied on real tickets, not a random draw from 2,043.
- **Plan:** a "From my trail" source in Practice, seeded from Case Trail entries across node workspaces, using the same Leitner boxes.
- Impact **M** · Effort **S** · Risk **L** · Files: `common.js`.
- ✅ **Built** (`improve/practice-trail`, `tests/practice-trail.test.js`). Practice gets a **From my trail** chip. It reads every node workspace's Case Trail (the live one plus the snapshots in `dc_nodes`) and matches each entry back to its sheet command. The command's placeholders (`<node>`, `$BMC`) act as wildcards, because the trail stores the copy with targets filled in; a `# needs root` line is ignored. The most-copied commands come first, and the same Leitner boxes schedule them. The chip shows only when there's something to drill.

**11. A local usage meter to guide what to keep**
- **Why:** J3. The site keeps growing (24 themes, about 20 tools, 108 home buttons), and you have done redundancy cleanups before.
- **Plan:** count opens per tool and sheet in `localStorage` only (never sent anywhere; name the key `dc_*` so the backup includes it). The Workbench gets an "Unused in 30 days" fold.
- Impact **M** · Effort **S–M** · Risk **L** · Files: `common.js`.
- ✅ **Built** (`improve/usage-meter`, `tests/usage-meter.test.js`). `dc_usage` keeps `{ since, tools: { id: { n, t } }, sheets: { file: { n, t } } }`. Each Workbench tool's open function notes itself on its first line, so a tool counts however it was opened: keyboard, toolbar, Ctrl+K, the home flow or the Workbench. Guided runbooks and the RMA formatter count from the triage modal's tabs, and Field notes, a page, counts as a sheet view. Sheets count in `recordVisit()`, which also covers the portable build's in-place switch. A repeat of the same open within 2 s counts once. The Workbench gets an **Unused in 30 days** fold with the stale tools as one-click chips and the stale sheets grouped by suite. It says "not opened since then" while the meter is under 30 days old. Backup labels the key.

**12. Export My kit as a navi `.cheat` file**
- **Why:** J1 from inside tmux and ssh, without the browser. A **data export only**; it doesn't revive the removed TUIs.
- **Evidence:** navi's syntax is `% tags`, `# description`, the command line, `<var>` placeholders and `$ var: <suggest-cmd>` lines ([syntax doc](https://github.com/denisidoro/navi/blob/master/docs/cheatsheet/syntax/README.md)).
- Impact **M** · Effort **S** · Risk **L** · Files: `common.js`.
- ✅ **Built** (`improve/navi-export`, `tests/kit-navi.test.js`). My kit → **Export for navi** downloads `my-kit.cheat`. It has one `% <sheet>, cheat-sheet` group per sheet and a `# description` above each command. Commands go out as written on the sheet, so navi prompts for them; `<placeholder>` names are rewritten to navi's letters, digits and `_` (`<sm-node>` → `<sm_node>`), and `$BMC`-style names stay shell variables. State-changing commands say so in their description. Multi-line commands, reference-only entries and commands starting with a navi marker (`% # ; $ @`) are left out, and the toast counts them. The test exports a kit, then runs the installed **navi 2.24.0** (`--best-match --print --prevent-interpolation`): every command comes back exactly as exported. Note: navi matches a truncated description column, so search by the first words. `navi info cheats-path` gives the folder; navi 2.25+ renamed it `default-cheats-path`.

**13. ✅ Make the doc counts agree**
- **Why:** trust in J5. The README said "about 200" sheets, `docs/site.md` said "235 linked pages", and the home hero said "214 sheets". They counted different things: 236 pages, of which 214 hold commands.
- Impact **L** · Effort **S** · Risk **L** · Built: `improve/doc-counts`. `build-index.js` writes the counts between `<!-- counts -->` markers, counting the way the home page does; `tests/doc-counts.test.js` compares them with the live home page.

## Recommended next
✅ The `j`/`k` edge case is fixed (`improve/jk-smooth-scroll`): `j`/`k` now stop an in-flight smooth scroll before measuring, so a key pressed mid-animation (after Home, an outline link or a script scroll) no longer leaves the focused command off screen; `tests/jk-smooth-scroll.test.js` reproduced it 5/5 before the fix. ✅ The Redfish builder's `hgx` preset is replaced (`improve/redfish-hgx-preset`, user's choice): it aimed host commands (power reset, SEL, memory, BMC reset) at the GPU baseboard (`HGX_Baseboard_0`), and `HGX_BMC_0` is undocumented. It is now an **NVIDIA DGX** preset with the ids NVIDIA documents for DGX H100/H200/B200 (`Systems/DGX`, `Chassis/DGX`, `Managers/BMC`) and a per-vendor SEL log id (`SEL` on DGX; Redfish paths are case-sensitive). `tests/redfish-builder.test.js`.

**Still open, found while checking it:**
- The Dell preset's ids (`System.Embedded.1`, `iDRAC.Embedded.1`) are not confirmed: Dell's Redfish reference would not load (JavaScript app, PDF 403). Removed 2026-11-11 (#32): no Dell hardware.
- DGX `Chassis/DGX/Thermal` and `/Power` are not in NVIDIA's DGX pages (only `Chassis/DGX/Sensors`).
- The Standard option's label says "Supermicro/HPE/OpenBMC" for id `1`; OpenBMC is believed to use `system`/`bmc` instead (not verified).
- The portable file carries the Redfish hub's builder markup but does not render the builder (existing behaviour).
- ✅ The stale `backups/scratch/` test copies: deleted 2026-11-09 with the user's OK.

Considered and dropped: a shift handoff export (it already exists: "Shift board & handoff" in `common.js`), a phone layout (laptop-only by your decision), and variable prompts in the style of navi (Rack Targets and slot chips already do this).

## Sources
- [MLNX-OS 3.12.6200: InfiniBand interface](https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface) · [subnet manager](https://networking-docs.nvidia.com/mlnxosum/3126200lts/subnet-manager) · [chassis management](https://networking-docs.nvidia.com/mlnxosum/3126200lts/chassis-management) · [logging](https://networking-docs.nvidia.com/mlnxosum/3126200lts/logging)
- [Cumulus Linux 5.18](https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/) · [NVUE command reference](https://docs.nvidia.com/networking-ethernet-software/nvue-reference/)
- [Arista EOS: Ethernet ports](https://www.arista.com/um-eos/eos-ethernet-ports) · [system event logging](https://www.arista.com/um-eos/eos-system-event-logging)
- [Cisco NX-OS 10.5 show commands (I)](https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_i_showcmds.html)
- [SONiC command reference](https://github.com/sonic-net/sonic-utilities/blob/master/doc/Command-Reference.md)
- [ip-neighbour(8)](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html) · [ethtool(8)](https://man7.org/linux/man-pages/man8/ethtool.8.html) · [lldpctl(8)](https://manpages.debian.org/trixie/lldpd/lldpctl.8.en.html) · [netplan](https://netplan.readthedocs.io/en/stable/)
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
- [DMTF Redfish Specification DSP0266 1.25.0 (PDF)](https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf)
- [DMTF Redfish JSON schemas](https://redfish.dmtf.org/schemas/v1/)
- [curl man page](https://curl.se/docs/manpage.html) · [curl URL syntax](https://curl.se/docs/url-syntax.html)
- [NVIDIA DGX H100/H200 Redfish](https://docs.nvidia.com/dgx/dgxh100-user-guide/redfish-api-supp.html) · [NVIDIA DGX B200 Redfish](https://docs.nvidia.com/dgx/dgxb200-user-guide/redfish-api-supp.html)
- [ipmitool man page](https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in) · [ipmitool source](https://github.com/ipmitool/ipmitool/tree/master/lib)
- [Linux kernel IPMI driver](https://docs.kernel.org/driver-api/ipmi.html)
- [Dell iDRAC9 Redfish API (developer portal, 7.xx)](https://developer.dell.com/apis/2978/versions/7.xx/)
- [Dell iDRAC9 7.xx RACADM CLI Guide](https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/introduction)
- [HPE iLOrest 7.4 user guide: global commands](https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/globalcommands.md) · [iLO commands](https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md)
- [Supermicro SAA](https://www.supermicro.com/en/solutions/management-software/superserver-automation-assistant) · [SAA for UEFI User's Guide (PDF)](https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf)
- [Lenovo XClarity Essentials OneCLI](https://pubs.lenovo.com/lxce-onecli/)
- [FreeIPMI man pages (Debian trixie)](https://manpages.debian.org/trixie/freeipmi-tools/index.html)
- [picocom(1)](https://github.com/npat-efault/picocom/blob/master/picocom.1.md) · [ser2net README](https://github.com/cminyard/ser2net/blob/master/README.rst) · [conserver console(1)](https://www.conserver.com/docs/console.man.html) · [conserver.cf(5)](https://www.conserver.com/docs/conserver.cf.man.html)
