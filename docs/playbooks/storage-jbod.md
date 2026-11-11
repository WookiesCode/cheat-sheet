# Storage, NVMe & High-Density JBOD Playbook (`storage-jbod.md`)

Covers **High-Density SAS/SATA/NVMe JBOD Enclosures**, **Local U.2 / U.3 / E1.S / E3.S NVMe Drives**, **RAID / ZFS**, and **Parallel Filesystems (Lustre, WEKA, BeeGFS, GPFS/Storage Scale, Ceph)**.

---

## 1. Local NVMe Drives (U.2 / U.3 / E1.S / E3.S / M.2)

### Read-Only Triage Commands
```bash
# 1. List all NVMe namespaces, models, serials, and firmware versions
sudo nvme list

# 2. Map NVMe controller to PCIe BDF, NUMA node, and physical slot
ls -l /sys/class/nvme/
lspci -vvv -D | grep -A 25 -i "Non-Volatile memory"

# 3. Check SMART / Health log & Error log for a specific drive
sudo nvme smart-log /dev/nvmeXn1
sudo nvme error-log /dev/nvmeXn1 | head -n 40
sudo smartctl -a /dev/nvmeXn1

# 4. Check kernel logs for NVMe timeouts, controller resets, or I/O errors
dmesg -T | grep -E -i "nvme|I/O error|blk_update_request|AER|pciehp"
```

### NVMe RMA & Fault Thresholds
Inspect `nvme smart-log /dev/nvmeXn1`:
- **`critical_warning != 0`**:
  - Bit 0 (`0x01`): Available spare space has fallen below threshold -> **RMA Drive**.
  - Bit 1 (`0x02`): Temperature threshold exceeded -> Check fan/airflow or heatsink.
  - Bit 2 (`0x04`): NVM subsystem reliability degraded due to media/internal errors -> **RMA Drive**.
  - Bit 3 (`0x08`): Media placed in **Read-Only mode** -> **Immediate RMA**.
- **`media_errors > 0`**: Any incrementing unrecovered media/data integrity error accompanied by `dmesg` I/O errors is **RMA criteria**.
- **`available_spare < available_spare_threshold`**: Drive endurance exhausted -> **Replace Drive**.
- **Drive Missing from `nvme list` / PCIe Link Down**:
  - Check physical hot-swap bay LED, PCIe slot power via `dmidecode -t slot`, MCIO/SlimSAS backplane cable seating, and check if another drive works in the same bay (isolate drive vs backplane slot).

---

## 2. High-Density SAS / SATA / Dual-Port JBOD Enclosures

When working on 60-bay / 90-bay / 102-bay JBOD shelves connected via external SAS HD / Mini-SAS HD / PCIe expanders:

### Read-Only Triage & Physical Slot Mapping
```bash
# 1. List all SCSI devices, HBA hosts, enclosures, and generic sg devices
lsscsi -g -t

# 2. List all SAS Enclosure Services (SES) devices
lsscsi -g | grep enclosu

# 3. Query JBOD enclosure status, temperatures, PSUs, fans, and slot map (Read-Only)
sudo sg_ses --page=es /dev/sg<X>
sudo sg_ses --index=arr /dev/sg<X>

# 4. Map a Linux block device (/dev/sdX) to exact JBOD Enclosure Serial & Physical Bay/Slot
#    Using sysfs enclosure_device symlink:
ls -d /sys/block/sd*/device/enclosure_device*

# 5. Check Dual-Path / Multipath status (Verify both SAS expanders / HBA cables are active)
sudo multipath -ll

# 6. Check SAS Expander PHY error counters (Invalid Dwords, Disparity, Loss of Dword Sync)
sudo smp_discover /dev/bsg/expander-<X:X>
```

### SAS / SATA Drive SMART Assessment (`smartctl -x /dev/sdX`)
- **SAS Drives**:
  - `Elements in grown defect list` (`Grown defects`): Rising grown defects alongside `Non-medium error count` or `Uncorrected read/write errors > 0` -> **RMA Drive**.
  - `SMART Health Status: Threshold exceeded` or `MEDIUM ERROR` / `HARDWARE IMPENDING FAILURE` -> **Immediate RMA**.
- **SATA Drives**:
  - `5 Reallocated_Sector_Ct`, `197 Current_Pending_Sector`, `198 Offline_Uncorrectable` > 0 with I/O errors -> **RMA Drive**.
  - `199 UDMA_CRC_Error_Count` incrementing rapidly across multiple drives in the same shelf -> **Check external Mini-SAS HD / QSFP+ SAS cable or expander controller**, not individual drives!

### Illuminating / Locating a Faulty JBOD Drive Slot
> **Safety Note**: Locating an LED via `sg_ses --set=ident` or `ledctl` is safe for identifying a bay, but **always verify the serial number (`smartctl -i /dev/sdX`) physically on the drive carrier label** before pulling any drive!

---

## 3. Software RAID (`mdadm`) & ZFS Pools

### Read-Only Status Checks
```bash
# Linux Software RAID (mdadm)
cat /proc/mdstat
sudo mdadm --detail /dev/mdX

# ZFS Storage Pools
zpool status -v
zpool iostat -v
```
- **Never pull a drive from a `DEGRADED` array without verifying which exact serial number is already `FAULTED` or `REMOVED`** — pulling a healthy member of a degraded RAID/vdev can destroy the pool.
- Ask explicit permission before running `mdadm --manage --fail/--remove` or `zpool offline/replace`.

---

## 4. Parallel & Distributed File Systems (Read-Only Health Checks)

When a compute node or storage server reports slow I/O, hung mounts, or OSD/OST errors, use these read-only checks to distinguish client network issues from backend storage server faults. Each one is sourced, with more commands, on the site's Parallel filesystems page's parts (`pfs.html#pfs-lustre`, `pfs.html#pfs-weka`, `pfs.html#pfs-beegfs`, `pfs.html#pfs-scale`, `pfs.html#pfs-ceph`), checked 2026-11-09.

### Lustre
```bash
lfs check servers                   # Verify MDS/OSS reachability from client
lfs df -h                           # Check OST/MDT capacity and state
lctl dl                             # List Lustre devices and status (UP/DOWN)
lctl ping <server-ip>@o2ib          # Test LNet RDMA connectivity to a server NID (Read-Only)
dmesg -T | grep -i lustre           # Check for LNet timeouts or OST evictions
```

### WEKA
```bash
weka status                         # Cluster health and capacity (weka status rebuild: rebuild/protection)
weka alerts                         # List current active cluster alerts
weka cluster container              # Container states per host (WEKA 6.0; older CLIs: weka cluster host)
weka cluster drive                  # Check NVMe drive states managed by WEKA
```

### BeeGFS
BeeGFS 8.x uses one `beegfs` command; 7.x uses `beegfs-ctl` and helper scripts. Check which the node has (`beegfs --help`).
```bash
beegfs health check                 # 8.x: common problems across nodes and targets
beegfs target list --state          # 8.x: reachability (Online/Offline) and consistency (Good/Needs resync/Bad)
beegfs node list --with-nics        # 8.x: nodes and the NICs they use
beegfs health df                    # 8.x: free space and inodes per target
```
```bash
beegfs-check-servers                # 7.x: reachability of mgmtd, meta, storage
beegfs-ctl --listtargets --longnodes --state   # 7.x: target states
beegfs-ctl --listnodes --nodetype=storage --nicdetails   # 7.x: storage nodes and NICs
beegfs-df                           # 7.x: free space and inodes per target
```

### Ceph
```bash
ceph -s                             # Overall health (HEALTH_OK / WARN / ERR)
ceph health detail                  # Detailed breakdown of slow ops, PG state, down OSDs
ceph osd tree                       # Map OSDs to hosts and racks
ceph osd df <host>                  # OSD utilization on one host (ceph osd df: all OSDs)
ceph device ls-by-host <host>       # Which physical disk is behind each OSD
```

### IBM Storage Scale (GPFS)
```bash
mmgetstate -a                       # Check GPFS state across nodes
mmhealth node show --verbose        # Detailed health of network, disk, filesystem on local node (--unhealthy: only problems)
mmdf <fs>                           # Free space per disk and storage pool
mmlsdisk <fs> -e                    # Disks not up/ready ("All disks up and ready" when fine)
```
