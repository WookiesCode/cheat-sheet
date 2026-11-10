# Datacenter Cheat Sheets & Learning Notes

My personal workspace for learning AI datacenter infrastructure and the languages and tools behind it.

---

## What This Is

I built this mainly for myself, for two reasons:

1. **To understand AI datacenter infrastructure:** GPU nodes (H200, B200, RTX), NVLink/NVSwitch, InfiniBand and RoCE fabrics, optics, storage and JBODs, and BMCs. That means knowing how the parts fit together and how to troubleshoot them, not just which commands to type.
2. **To learn new skills:** Bash, Python, JavaScript/TypeScript, Lua, SQL, jq/awk/sed, YAML/JSON/TOML, Markdown and Git. I'm still learning these. Most of the code here was written with an AI coding agent and explained back to me as it was written.

## Who It's For

**Me.** It's shaped around my own workflow, my jumpbox and how I learn. If you find something useful, you're welcome to it, but it isn't a product: there's no support, no roadmap and no promise that anything fits your environment. Check every command against your own hardware and vendor docs before you trust it.

---

## What's Inside

| Part | What it is |
|---|---|
| Repo root (`index.html`, `*.html`, `*.js`, `styles.css`, `build-*.js`) | The cheat-sheet site: <!-- counts -->246 pages, 222 of them command sheets with 2,174 commands<!-- /counts --> (Linux, CLI tools, scripting, NVIDIA DC, InfiniBand, switches, Redfish, ipmitool, fiber, Ethernet, motherboards, Docker & Kubernetes, Grafana dashboards, editors (nano, VS Code, Zed, Cursor) and more, grouped into tabs), plus triage tools, a terminal dock and a single-file offline bundle. See [`docs/site.md`](docs/site.md). |
| [`docs/playbooks/`](docs/playbooks/) | Troubleshooting playbooks for GPU/NVLink, network and optics, storage and JBODs, BMC hardware, and RMA templates. |
| [`agents/AGENTS.md`](agents/AGENTS.md) | Instructions for an AI agent working as my datacenter troubleshooting partner in this repo: safety rules, read-only vs. ask-first commands, and the 5-step triage method. The root `CLAUDE.md` is a symlink to it. |
| [`agents/AGENTS-portable.md`](agents/AGENTS-portable.md) | A copy of `AGENTS.md` with `<WORKSPACE>` placeholders, for dropping into another repo. |
| [`agents/coding-agent.md`](agents/coding-agent.md) | My general instructions for AI coding agents. They include a **teach-as-you-go** mode, because I'm learning the languages. |
| [`agents/chat-instructions.md`](agents/chat-instructions.md) | The same preferences, written for chat assistants. Includes a short version for fields limited to 1,500 characters. |
| `cases/` | Per-incident working folders (`cases/<ticket-or-hostname>/`) for logs and a `summary.md`. |
| `scripts/` | Read-only diagnostic collection helpers (still empty). |

### Open the Site
- **Normally:** open `index.html` in a browser. It opens on Mission Control, with Field notes for the server you are working on (saved as Markdown to `cases/` or an Obsidian vault).
- **Offline or on another machine:** copy `datacenter-cheatsheet-portable.html`. It's one file and needs no network.

---

## How I Use AI Here

The AI agent is a pair-programmer and a tutor, not an autopilot.

- **Teach, don't just do.** The agent finishes the task, then explains the code: what each part does, the name of each concept, the common mistakes, and a readable version of any one-liner.
- **Verified is the only kind of "fixed."** A change counts as done only after it's tested the way I'd actually use it.
- **Read-only by default.** Diagnostics run freely. Anything that changes state needs my explicit OK first: power, resets, firmware, drains, deletes, commits and pushes.
- **No secrets in the repo.** BMC and API credentials come from environment variables or config files, never from the repo itself or command history.

My global Claude Code profile (`~/.claude/CLAUDE.md`) is built from `agents/coding-agent.md`, plus the troubleshooting rules from `agents/chat-instructions.md`.

---

## Repository Layout

```text
cheat-sheet/
├── CLAUDE.md -> agents/AGENTS.md  # Symlink so Claude Code loads the agent rules
├── README.md                     # This file
├── index.html, *.html, *.js      # The cheat-sheet site (sheets, common.js, styles.css)
├── build-*.js, generate-*.js     # Site build scripts (run build-all.js)
├── nav/nav-source.html           # The one copy of the top nav (build-nav-js.js writes nav.js from it)
├── backups/                      # Site backups (git-ignored)
├── agents/
│   ├── AGENTS.md                 # Datacenter troubleshooting agent rules (source of truth)
│   ├── AGENTS-portable.md        # Workspace-agnostic copy for other repos
│   ├── coding-agent.md           # Preferences for coding agents (incl. teach-as-you-go)
│   └── chat-instructions.md      # Preferences for chat assistants (full + short version)
├── docs/
│   ├── site.md                   # Site guide: features, shortcuts, how it's built
│   └── playbooks/                # GPU, network/optics, storage, BMC, and RMA playbooks
├── cases/                        # Per-incident working folders
└── scripts/                      # Read-only diagnostic helpers
```

---

## Disclaimer

These are personal learning notes. Commands and procedures come from my own study and practice and may be incomplete or wrong for your hardware. Commands that power-cycle, reset, format or flash hardware are destructive. Read them, understand them, and get approval before running them on any system you don't own.
