"""Does explain.py explain commands exactly as the site does?

Runs the site's own Explain (explain_golden.js: common.js in node) and explain.py over
every command on the sheets, the dialog's samples and some awkward cases, and compares
verdicts, findings and every row. Needs node and data/explain.json (node export.js).

    .venv/bin/python test_explain.py
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import explain

HERE = Path(__file__).resolve().parent
explain.load((HERE / "data" / "explain.json").read_text(encoding="utf-8"))

EXTRA = [
    "nvidia-smi -r",
    "nvidia-smi -r -i 0",
    "nvidia-smi nvlink -s",
    "sudo -u root env FOO=1 timeout 30 watch -n 5 nvidia-smi -q -d ECC",
    "tar -czf /tmp/x.tgz -C /var/log journal syslog",
    "grep -iA3 error /var/log/syslog",
    "cut -d':' -f1 /etc/passwd",
    "lsof -iTCP:8080",
    "ssh node07 'sudo dmesg -T | tail -n 50' > out.txt 2>&1",
    "curl -fsSL https://get.example.com/install.sh | sudo bash",
    "curl -u admin:secret https://10.0.0.5/redfish/v1/Systems",
    "curl -H 'X-Auth-Token: abcdef123456789' https://bmc/redfish/v1",
    "racadm -r 10.1.1.1 -u root -p calvin serveraction powercycle",
    "mysql --password=hunter2 -e 'select 1'",
    "ipmitool -I lanplus -H <bmc-ip> -U admin -E sel elist",
    "x -= 1",
    "jq -r '.items[] | .name' file.json",
    "git fetch --no-depth origin",
    "lsblk --summary",
    "$ dmesg -T\n$ journalctl -k -f",
    "echo 1 > /sys/bus/pci/devices/0000:8a:00.0/remove",
    "watch -n1 'nvidia-smi --query-gpu=index,temperature.gpu --format=csv'",
    "kubectl drain node07 --ignore-daemonsets --delete-emptydir-data",
    "unknowntool --frobnicate -xyz",
    "",
    "   ",
    "a && b || c ; d &",
]


def golden(cmds: list[str]) -> list[dict]:
    run = subprocess.run(["node", str(HERE / "explain_golden.js")], input=json.dumps(cmds), capture_output=True, text=True, check=True)
    return json.loads(run.stdout)


def mine(cmd: str) -> dict:
    r = explain.analyze(cmd)
    return {
        "src": r.src, "verdict": r.verdict, "safe": r.safe,
        "findings": [[f.sev, f.title, f.text, f.safe] for f in r.findings],
        "stages": [{
            "tool": s.tool, "name": s.name, "sheet": s.sheet, "remote": s.remote, "leftovers": s.leftovers,
            "rows": [[x.tok, x.kind, x.plain(), x.src, x.unknown] for x in s.rows],
        } for s in r.stages],
    }


def main() -> int:
    site = json.loads((HERE / "data" / "site.json").read_text(encoding="utf-8"))
    cmds: list[str] = []
    for sheet in site["sheets"].values():
        for sec in sheet:
            for e in sec["commands"]:
                cmds.append(e["cmd"])
                cmds += [str(s[0]) for s in e.get("subs", [])]
    cmds += [c for _, c in explain.data()["samples"]] + EXTRA
    cmds = list(dict.fromkeys(cmds))
    want = golden(cmds)
    # Known site bug, not copied: a redirection the site has no words for ("exec 3>&1")
    # prints "undefined" there; the terminal leaves it blank.
    for w in want:
        for s in w["stages"]:
            for row in s["rows"]:
                if row[1] == "op" and row[2].startswith("undefined"):
                    row[2] = row[2][len("undefined"):]
    bad = 0
    for cmd, w in zip(cmds, want):
        got = mine(cmd)
        if got != w:
            bad += 1
            if bad <= 5:
                print(f"DIFF {cmd!r}")
                for key in w:
                    if got[key] != w[key]:
                        print(f"  {key}:\n    site: {json.dumps(w[key])[:600]}\n    tui:  {json.dumps(got[key])[:600]}")
    print(f"{len(cmds) - bad}/{len(cmds)} commands explained the same as the site")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
