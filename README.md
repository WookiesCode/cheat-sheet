# AI Datacenter Hardware & Fabric Troubleshooting & Cheat Sheets

Repository containing field playbooks, agent operating instructions, triage templates, and CLI cheat sheets for AI Datacenter operations.

---

## Repository Structure

```text
cheat-sheet/
├── AGENTS.md                        # Core agent operating instructions & safety boundaries (Source of Truth)
├── CLAUDE.md -> AGENTS.md           # Symlink for Claude Code
├── GEMINI.md -> AGENTS.md           # Symlink for Gemini CLI / Antigravity
├── docs/
│   └── playbooks/
│       ├── gpu-nvlink.md            # H200, B200, RTX, Xid/SXid, ECC/Row-Remap, NVLink/NVSwitch
│       ├── network-optics.md        # NDR/XDR InfiniBand, RoCEv2, mlxlink, OSFP/QSFP/MPO DOM & BER
│       ├── storage-jbod.md          # SAS/NVMe JBODs, SES slot mapping, U.2/E3.S, Lustre/WEKA/BeeGFS/Ceph
│       ├── bmc-hardware.md          # Vendor-agnostic IPMI/Redfish, DMI auto-detect, DIMM/CPU/PCIe/PSU
│       └── rma-templates.md         # Ready-to-paste RMA & L1 escalation templates
├── cases/                           # Per-incident working folders (e.g., cases/<ticket-or-hostname>/)
├── scripts/                         # Reusable read-only diagnostic collection helpers
├── agy/                             # Antigravity cheat sheets & references
├── claude/                          # Claude Code cheat sheets & references
└── codex/                           # Codex cheat sheets & references (agent entry point: codex/CODEX.md)
```

---

## Operating Guidelines & Safety

Refer to [`AGENTS.md`](AGENTS.md) for full role definitions, safety boundaries, non-destructive telemetry commands, and guided Layer-1 troubleshooting procedures.

### Agent Directory Ownership
- **GEMINI / Antigravity**: Uses `agy/`
- **Claude**: Uses `claude/`
- **Codex**: Uses `codex/`
- **Shared Incident Triage**: `cases/<ticket-or-hostname>/`
