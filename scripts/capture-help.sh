#!/usr/bin/env bash
# capture-help.sh: save the --help output of the tools on the cheat sheets, so
# "Explain a command" can describe flags that have no offline man page
# (nvidia-smi, dcgmi, mlxlink, ilorest, kubectl...).
#
# Read-only: it only runs the help commands listed in help-tools.txt, as your
# own user (it refuses to run as root), with no stdin and a 5-second timeout.
# Tools that aren't installed are skipped, so run it anywhere and on as many
# boxes as you like: every box adds the tools it has.
#
# Usage:
#   scripts/capture-help.sh                 # writes ./help-capture-<label>/
#   scripts/capture-help.sh -o DIR -l LABEL
#   scripts/capture-help.sh --tar > x.tgz   # tarball on stdout (for ssh)
# Then copy the folder to help-captures/<label>/ and run
#   node build-all.js
#
# List format (help-tools.txt): one command per line.
#   nvidia-smi             a bare tool: tries --help, then -h, then -?, stops at real help
#   nvidia-smi nvlink -h   anything longer runs exactly as written
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]:-.}")" && pwd)"
list="${here}/help-tools.txt"
out=""
tar_stdout=0
# A label instead of the hostname: captures get committed to a public repo.
label="$(. /etc/os-release 2>/dev/null && echo "${ID:-linux}-${VERSION_ID:-x}")-$(uname -m)"

while (($#)); do
  case "$1" in
    -o) out="$2"; shift 2 ;;
    -l) label="$2"; shift 2 ;;
    --list) list="$2"; shift 2 ;;
    --tar) tar_stdout=1; shift ;;
    -h|--help) sed -n '2,23p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

if [[ "${EUID}" -eq 0 ]]; then
  echo "Refusing to run as root: help output never needs it." >&2
  exit 1
fi

# The list can also arrive in $HELP_LIST (used when the script is piped over ssh).
if [[ -n "${HELP_LIST:-}" ]]; then
  list_text="${HELP_LIST}"
elif [[ -r "${list}" ]]; then
  list_text="$(cat "${list}")"
else
  echo "No list: ${list} not found (or set HELP_LIST)." >&2
  exit 1
fi

tmp=""
cleanup() { [[ -n "${tmp}" ]] && rm -rf "${tmp}"; }
trap cleanup EXIT
if ((tar_stdout)); then
  tmp="$(mktemp -d)"
  dir="${tmp}/${label}"
else
  dir="${out:-./help-capture-${label}}"
fi
mkdir -p "${dir}"

# Run one help command quietly: no stdin, no pager, no colour, 5 s at most,
# and a clean environment so no credentials or kubeconfig are passed along.
#
# Help text can print defaults with your home, username or hostname in them
# (docker: "/home/<you>/.docker"): those become ~, <user> and <host>, because
# captures are committed to a public repo.
me="$(id -un)"
host="$(hostname -s 2>/dev/null || echo localhost)"
run_help() {
  env -i PATH="${PATH}" HOME="${HOME}" TERM=dumb LANG=C.UTF-8 \
    PAGER=cat MANPAGER=cat GIT_PAGER=cat SYSTEMD_PAGER=cat NO_COLOR=1 \
    timeout 5 "$@" </dev/null 2>&1 |
    head -c 200000 |
    sed -e 's/\x1b\[[0-9;]*[A-Za-z]//g' -e 's/.\x08//g' \
        -e "s#${HOME}#~#g" -e "s/\\b${me}\\b/<user>/g" -e "s/\\b${host}\\b/<host>/g" || true
}

# How useful a help text is: lines that start with an option.
option_lines() { grep -cE '^[[:space:]]*-{1,2}[A-Za-z?]' <<<"$1" || true; }

today="$(date -u +%F)"
saved=0 skipped=0 empty=0
while IFS= read -r line; do
  line="${line%%#*}"                      # drop comments
  read -ra words <<<"${line}"             # split into words (no globbing: the list holds plain words)
  ((${#words[@]})) || continue
  tool="${words[0]}"
  if ! command -v "${tool}" >/dev/null 2>&1; then
    skipped=$((skipped + 1))
    continue
  fi

  if ((${#words[@]} == 1)); then
    # Stop at the first form that prints real help: a tool that doesn't know
    # -h or -? might treat it as something else, so don't try more than needed.
    # (No bare "help" word: some tools would take it as a file or target name.)
    best="" best_cmd="" best_n=-1
    for flag in --help -h '-?'; do
      text="$(run_help "${tool}" "${flag}")"
      n="$(option_lines "${text}")"
      if ((n > best_n)); then best="${text}" best_cmd="${tool} ${flag}" best_n="${n}"; fi
      ((n >= 3)) && break
    done
    text="${best}" cmd="${best_cmd}"
  else
    text="$(run_help "${words[@]}")"
    cmd="${words[*]}"
  fi

  if [[ -z "${text//[[:space:]]/}" ]]; then
    empty=$((empty + 1))
    continue
  fi
  version="$(run_help "${tool}" --version | grep -m1 '[0-9]' | cut -c1-120 || true)"
  file="${dir}/$(tr -c 'A-Za-z0-9._-' '_' <<<"${cmd}" | sed 's/_*$//').txt"
  {
    echo "# dc-help-capture 1"
    echo "# command: ${cmd}"
    echo "# label: ${label}"
    echo "# version: ${version}"
    echo "# captured: ${today}"
    echo
    printf '%s\n' "${text}"
  } >"${file}"
  saved=$((saved + 1))
done <<<"${list_text}"

echo "${label}: saved ${saved}, not installed ${skipped}, no output ${empty}" >&2
if ((tar_stdout)); then
  tar -C "${tmp}" -czf - "${label}"
else
  echo "Wrote ${dir}" >&2
fi
