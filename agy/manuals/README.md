# Embedded offline manual library

The **Manuals** button opens searchable full manual text in every cheat-sheet page and in `datacenter-cheatsheet-portable.html`. The portable HTML embeds all manual data, original sources, and notice texts. It makes no documentation network requests and requires no packages on target machines.

The library contains 500 entries. Coverage includes Linux/shell tools, systemd, IPMI, `nvidia-smi`, InfiniBand diagnostics, NVMe commands, storage tools, and open-source MSTFlint utilities. It is not a complete manual collection for every platform in the cheat sheets. The panel's **Coverage and versions** section lists the gaps and explains differences between MSTFlint and proprietary MFT commands.

## Provenance

`manifest.json` records each source, capture timestamp, SHA-256, manual section, category, and available package version. Sources came from manuals already present on the jumpbox, upstream ipmitool/rdma-core/nvme-cli/MSTFlint sources, and distribution-published hardware/storage manuals. No software was installed on the target images. Remote source snapshots were downloaded on the capture date; their SHA-256 identifies the exact text bundled here even where the upstream URL names a moving branch.

`source` URLs are displayed as provenance text, not loaded remotely. Original roff/RST sources and their notices remain available in the reader. Shared license texts do not relicense the source documents. A target's installed command version may differ from the documentation snapshot.

## Rebuild without network access

From the repository root, on a build machine with Python 3, groff, col, and Node.js already available:

```sh
python3 agy/manuals/build-manuals.py
node agy/build-index.js
node agy/build-portable.js
```

The first command checks hashes and regenerates `manuals-data.js` from the committed sources and notices. The portable build embeds that generated data and `manuals-ui.js`. For the multi-file site, keep those two JavaScript files alongside the HTML pages.

Run the tests with `jsdom` available to Node.js:

```sh
node agy/tests/manuals.test.js
node agy/tests/page-startup.test.js
node agy/tests/clipboard.test.js
node agy/tests/review-fixes.test.js
```
