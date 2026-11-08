#!/usr/bin/env bash
# Build dc-cheat as static binaries for x86 and ARM Linux servers.
#   ./build.sh            refresh the data from the site, then build
#   SKIP_DATA=1 ./build.sh  build from the data already in data/
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$here"

if [[ "${SKIP_DATA:-}" != 1 ]]; then
  node ../cheat-sheets/build-tui-data.js
fi

go vet ./...
go test ./...

version="$(git -C "$here" describe --always --dirty 2>/dev/null || echo dev)"
mkdir -p dist
for arch in amd64 arm64; do
  out="dist/dc-cheat-linux-${arch}"
  # CGO off = no libc dependency, so one file runs on any Ubuntu release.
  CGO_ENABLED=0 GOOS=linux GOARCH="$arch" \
    go build -trimpath -ldflags "-s -w -X main.version=${version}" -o "$out" .
  echo "built $out ($(du -h "$out" | cut -f1))"
done
(cd dist && sha256sum dc-cheat-linux-* > SHA256SUMS)
echo "checksums in dist/SHA256SUMS"
