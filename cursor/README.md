# Datacenter Cheat Sheets

Offline command reference sheets for datacenter work: 188 linked pages, plus one file that bundles them all.

## Open it

- **Normal use:** open `index.html` in a browser.
- **Offline or on another machine:** copy `datacenter-cheatsheet-portable.html` and open it. It's a single file that works with no network. The **1-File Offline** button opens it too.

## Find what you need

| To do this | Use |
|---|---|
| Search every sheet | `Ctrl+K` or **Search All**, then arrow keys and `Enter` |
| Filter the current sheet | `/`, and `Esc` clears it |
| Jump to a topic | Top nav menus, or the **Section** dropdown |

**The menus:** Linux, CLI Tools, Scripting, Neovim, macOS, Windows, NVIDIA DC, InfiniBand, Switches, Redfish, ipmitool, Fiber, Ethernet, Motherboards, Omarchy and Jira.

## Use it on a rack

1. Fill in **Rack Targets** at the top: BMC address, user, password, NIC, HCA, disk and GPU index.
2. Leave **Active** checked.
3. Click any command box to copy it. Your values replace placeholders like `$BMC` and `$DISK` automatically.

Only real commands copy. Reference information such as POST codes, wire colors and keyboard shortcuts is read-only, and `build-reference-rules.js` lists what counts as reference.

Your targets carry across pages, and **Reset** puts them back to defaults.

## The password field

- It's hidden by default, and the eye button shows it.
- It's kept for the current tab only, so you'll re-enter it after closing the tab.
- It only fills 3 commands. `curl -K` commands read `~/.bmc-curlrc`, and `ipmitool -E` commands read `IPMITOOL_PASSWORD` from your shell.
- A copied password stays in your clipboard manager, so clear it after use.

## Other tools

- **Triage & RMA:** gives you a crash-cart diagnostic script and a formatter for RMA tickets.
- **Saved:** star a command to bookmark it, then click **Saved** to show only those.
- **Manuals:** click **Manuals** or press `M` to search offline manuals by name, category or full text. Ubuntu 24.04 pages come first, and open-source projects fill the gaps. Vendor tools such as `nvidia-smi` aren't included because of their licenses. Keep `man-pages-data.js` with the pages; the offline copy has them built in.
- **Compact:** fits more on screen by hiding notes, tips, flag explanations and extra command variants. Click **Detailed** on the same button to bring them back. The setting carries across pages. Jira and the Scripting sheets keep their variants, because those are the main content. Searching shows everything hidden, and printing always includes it.
- **Theme menu:** 24 color themes, and your choice is remembered. Everforest is a good pick for long sessions.
- **Print:** `Ctrl+P` prints the current sheet.

## Jira

Open **Jira** in the nav, fill in the form with a node, rack, position or serial, then click a query to copy it. Paste it into Jira's advanced search (JQL). The form values are remembered in your browser. The queries use full-text search, so they work without custom fields. If your Jira has fields like "Rack", the custom field templates are more precise.

## Omarchy and Lua

- **Omarchy** (under the nav) lists your desktop keyboard shortcuts. It's for reading, so there are no commands to copy.
- **Lua** (under Scripting) covers the language and how to edit your Hyprland and Neovim config files.
