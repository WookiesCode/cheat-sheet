#!/usr/bin/env bash
# Build dist/dc-cheat.pyz: the Textual app, its stylesheet and data, and Textual
# with its dependencies (all pure Python), in one zip that python3 runs directly.
#
#   ./build_pyz.sh            refresh data/site.json from the site, then build
#   SKIP_DATA=1 ./build_pyz.sh
#
# Needs: uv (to fetch the pinned Textual), node (for export.js) and the .venv's Python.
# The .pyz needs only python3 >= 3.9 on the server: no pip, no internet, writes nothing.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${here}"
py="${here}/.venv/bin/python"
textual_version="8.2.8"

stage="$(mktemp -d)"
trap 'rm -rf "${stage}"' EXIT

if [[ "${SKIP_DATA:-}" != 1 ]]; then
  node export.js
fi

# 1. Textual and its dependencies into the staging folder (wheels only: no compiling).
uv pip install --quiet --python "${py}" --target "${stage}" --only-binary :all: "textual==${textual_version}"
# Every file must be pure Python: zipimport can't load compiled extensions.
if find "${stage}" -name '*.so' -o -name '*.pyd' | grep -q .; then
  echo "A dependency has a compiled extension; it can't run from a .pyz:" >&2
  find "${stage}" -name '*.so' -o -name '*.pyd' >&2
  exit 1
fi
find "${stage}" -name '__pycache__' -type d -prune -exec rm -rf {} +

# 2. The app.
cp dc_cheat.py explain.py dc_cheat.tcss "${stage}/"
mkdir -p "${stage}/data"
cp data/site.json data/explain.json "${stage}/data/"
cat >"${stage}/__main__.py" <<'EOF'
import sys

# Before importing Textual, so an old Python gets a clear message, not an import error.
if sys.version_info < (3, 9):
    sys.exit("dc-cheat needs Python 3.9 or newer (this is %s)." % sys.version.split()[0])

import dc_cheat

dc_cheat.main()
EOF

# 3. Bytecode next to each .py ("legacy" .pyc, the layout zipimport reads), so a matching
#    Python starts fast. Other Python versions ignore it and compile from the .py instead.
"${py}" -m compileall -q -b -j 0 "${stage}" >/dev/null

# 4. Zip it with a shebang, so ./dc-cheat.pyz runs like a program.
mkdir -p dist
"${py}" -m zipapp "${stage}" -o dist/dc-cheat.pyz -p "/usr/bin/env python3" -c
chmod 755 dist/dc-cheat.pyz
(cd dist && sha256sum dc-cheat.pyz > dc-cheat.pyz.sha256)
echo "built dist/dc-cheat.pyz ($(du -h dist/dc-cheat.pyz | cut -f1)), built for Python $("${py}" -c 'import sys; print("%d.%d" % sys.version_info[:2])') bytecode"
