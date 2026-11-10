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

**Not verified (said on the card):** `lspci` (no vendor doc checked), NVSM commands (NVIDIA's NVSM pages returned no content), `nvidia-ctk system create-dev-char-symlinks`, `NVreg_EnableGpuFirmware=0`, `nvidia-bug-report.sh --output-file`, and the `--query-gpu` / `--query-compute-apps` field names (not on the docs page). NVIDIA builder presets checked 2026-11-09 (`improve/small-fixes`): **no change needed**. The DCGM field IDs match what the presets say (140/150 temperatures, 155 power, 393–395 row remapping, 1009/1010 PCIe bytes), and `pulse_test` is right: every `dcgmi diag -r` example and the config key use `pulse_test` (only the test table writes `pulse`). The earlier suggestion to rename it was wrong.

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
| ipmitool bootparam | `options=no-timeout` "keeps the boot flag" | Marked **Not verified**: ipmitool's source rejects it as written |
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
| `pfs-ceph` | Ceph docs; 21.2 Umbrella current | `ceph -s` / `health detail`, `osd tree` (up/down, in/out), PG states and inconsistent PGs, `device ls-by-host`, `noout`, `orch ps`, crash reports |

`DANGER_RE` now flags `umount`, `lfs setstripe`, the Ceph state changes (`osd set|unset|out|in|…`, `crash archive|rm|prune`, `pg repair`, `health mute`, `orch apply|rm|host …|daemon …`), WEKA drive and container (de)activation and removal, `cluster stop-io|start-io`, `fs remove`, `local stop|rm`, and BeeGFS node delete and migrate (8.x and 7.x).

**Found in `docs/playbooks/storage-jbod.md`** (✅ fixed on `fix/storage-playbook`: WEKA and Ceph lines replaced; BeeGFS split into 8.x and labelled 7.x commands; each section points to the sheets):
- `weka cluster nodes` doesn't exist in the WEKA 6.0 CLI; use `weka cluster container` (or `cluster server list`).
- `ceph osd df tree` isn't in the current Ceph docs; use `ceph osd df <host>`.
- The BeeGFS lines are 7.x-only. On 8.x they are `beegfs health check`, `beegfs node list --with-nics` and `beegfs health df`.

**Not verified:** WEKA's drive status values (the CLI reference doesn't list them); the arguments of BeeGFS 8's `beegfs entry info`; whether BeeGFS 8 still ships `beegfs-ctl`; `lnetctl ping` (not in the Lustre manual, so the sheet uses `lctl ping`).

## Found while building (not fixed)

| Finding | Where | Note |
|---|---|---|
| ✅ Fixed (`improve/small-fixes`): Explain described `nvidia-smi -d` as "g. ECC,POWER." | `common.js` flag-description extraction | Sentence *matching* restarted after the dot in "e.g.", "i.e." or "1.2" and dropped everything before it. It now splits at ". " and protects abbreviations. `tests/explain-help.test.js` |
| ✅ Fixed (`improve/small-fixes`): two "could not keep" toasts could never appear | `fnSave` and `pbWrite` in `common.js` | Removed; the #3 save-failure bar reports refused writes |
| ✅ Fixed (`improve/small-fixes`): tour "What's new" not updated | `TOUR_VERSION` in `common.js` | Now version 9 with 5 new steps (search warnings, backup, sources, read-only reboots/NMI, keyboard); the old steps are no longer flagged new. `tests/whats-new.test.js` |
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
- The Dell preset's ids (`System.Embedded.1`, `iDRAC.Embedded.1`) are not confirmed: Dell's Redfish reference would not load (JavaScript app, PDF 403).
- DGX `Chassis/DGX/Thermal` and `/Power` are not in NVIDIA's DGX pages (only `Chassis/DGX/Sensors`).
- The Standard option's label says "Supermicro/HPE/OpenBMC" for id `1`; OpenBMC is believed to use `system`/`bmc` instead (not verified).
- The portable file carries the Redfish hub's builder markup but does not render the builder (existing behaviour).
- The stale `backups/scratch/` test copies (ask first: deletes files).

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
