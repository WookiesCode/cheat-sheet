# AI Datacenter Hardware & Fabric Troubleshooting & Cheat Sheets

Repository containing field playbooks, agent operating instructions, triage templates, and CLI cheat sheets for AI Datacenter operations.

---

## Repository Structure

```text
cheat-sheet/
├── AGENTS.md                        # Core agent operating instructions & safety boundaries (Source of Truth)
├── CLAUDE.md -> AGENTS.md           # Symlink for Claude Code
├── docs/
│   └── playbooks/
│       ├── gpu-nvlink.md            # H200, B200, RTX, Xid/SXid, ECC/Row-Remap, NVLink/NVSwitch
│       ├── network-optics.md        # NDR/XDR InfiniBand, RoCEv2, mlxlink, OSFP/QSFP/MPO DOM & BER
│       ├── storage-jbod.md          # SAS/NVMe JBODs, SES slot mapping, U.2/E3.S, Lustre/WEKA/BeeGFS/Ceph
│       ├── bmc-hardware.md          # Vendor-agnostic IPMI/Redfish, DMI auto-detect, DIMM/CPU/PCIe/PSU
│       └── rma-templates.md         # Ready-to-paste RMA & L1 escalation templates
├── cases/                           # Per-incident working folders (e.g., cases/<ticket-or-hostname>/)
├── scripts/                         # Reusable read-only diagnostic collection helpers
└── claude/                          # Claude Code cheat sheets & references
```

---

## Operating Guidelines & Safety

Refer to [`AGENTS.md`](AGENTS.md) for full role definitions, safety boundaries, non-destructive telemetry commands, and guided Layer-1 troubleshooting procedures.

### Agent Directory Ownership
Claude Code is the only AI assistant used in this repository.
- **Claude**: Uses `claude/`
- **Shared Incident Triage**: `cases/<ticket-or-hostname>/`
