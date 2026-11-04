# Codex Datacenter Cheat Sheets

A searchable command reference with copy tools, target substitution, offline manuals, and troubleshooting helpers. The pages prepare commands; they do not execute them.

## Open the reference

- **[Normal version](index.html):** Open `index.html` in your browser. Keep the files in this directory together so navigation, styles, search, and manuals work.
- **[Portable version](datacenter-cheatsheet-portable.html):** A self-contained HTML file you can copy to another machine and use offline.

## Find a command

- Use the top menus for Linux, CLI Tools, scripting, NVIDIA, networking, BMC tools, and other subjects.
- Use the **Section** dropdown to filter the current page.
- Use the page search box to search that sheet.
- Click **Search All** or press **Ctrl+K** (Cmd+K on macOS) to search the collection. Use the arrow keys to choose a result, **Enter** to copy it, or click a result to open its page.

## Set Rack Targets

Enter the BMC address, username, password, interface, HCA, disk, and GPU index in the **Rack Targets** bar.

- With **Active** checked, matching placeholders are replaced **when you copy**. The displayed example can still contain placeholders.
- Uncheck **Active** to copy the original examples.
- **Reset** restores defaults; **Collapse** hides the bar.
- Non-password target settings are saved in browser-local storage.
- The password field is masked and kept only in the current page's memory. Reloading or navigating to another page clears it.
- **Copied commands containing password placeholders receive the actual password.** Masking the field does not mask the clipboard or terminal command. Leave the field blank and use shell credential variables when you need to keep credentials out of command history.

## Read, save, and copy commands

1. Find the command or task you need.
2. Read its details and examples; hover over flag pills for explanations.
3. Click a command snippet to copy it.
4. Verify the target, device, credentials, and operation before running it in your terminal.

Bookmark useful commands, then use **Saved** to filter the current sheet to bookmarked entries.

Some examples change configuration, reset hardware, or modify storage. Copying a command does not establish that it is safe for the target's current workload or maintenance state.

## Manuals and troubleshooting helpers

### Manuals

Click **Manuals** to search bundled documentation, filter by category, or enable full-text search. The **Coverage and versions** section explains gaps and version differences. These are documentation snapshots; the target's installed command version may differ.

See [the manual library README](manuals/README.md) for provenance and rebuild instructions.

### Triage & RMA

Click **Triage & RMA** to:

- Inspect and copy a diagnostic collection script.
- Enter hardware details and evidence to generate an RMA ticket in Markdown.

Review the script before running it. Review generated ticket claims before submitting them, especially statements that diagnostics ran or a fault was reproduced.

### Calculators and builders

Some subject pages include interactive helpers, such as:

- Linux: chmod permissions calculator.
- IPMI: out-of-band and in-band command builder.
- Redfish: request and action builder.
- Ethernet: Netplan and iproute2 topology generator.

These generate reference output for you to review and use; they do not apply changes to your systems.

## Lua scripting

Open **Scripting → Lua Scripting** for 16 examples covering variables, strings, control flow, tables, functions, modules, error handling, files, patterns, and coroutines. The Scripting hub also contains a Lua overview. Shell commands are labeled separately from Lua code. Examples target Lua 5.4; embedded LuaJIT hosts may differ. Reference: [official Lua 5.4 manual](https://www.lua.org/manual/5.4/).

## Git commands

Open **Scripting → Git Commands** for 36 copyable examples covering setup, daily work, branches, history, recovery, and datacenter operations. Check the working tree and the command details before running commands that alter local files or publish to a remote.

## Markdown

Open **Scripting → Markdown** for 28 copyable examples covering CommonMark syntax, GitHub extensions, incident templates, and validation tools. The Scripting hub includes the same examples.

## Jira ticket queries

Open the **Jira** tab for 27 copyable JQL templates covering server/node history, serial numbers, rack positions, active work, shift handoffs, hardware faults, and RMA follow-up.

1. Enter a project, site, node, rack, position, serial, or ticket in the form above the Jira queries. Matching examples update as you type; **Clear** restores their placeholders. The form remembers these values in this browser.
2. Copy a query and paste it into Jira's advanced search (JQL). Check any remaining uppercase placeholders and replace them as needed. Rack Targets does not fill these Jira examples.
3. Run the search in Jira and save useful queries as filters.

The primary queries search **Summary and Description**. All-time history queries include closed tickets and have no date restriction. The broader `text` query also checks comments and other indexed text fields. You only see tickets your Jira account can access. Text matching can tokenize punctuation and is not exact asset identity; use aliases and serial numbers to cross-check results. A node-only ticket will not appear in a rack search unless it mentions that rack. JQL does not infer location history or group/count repeated hardware faults by asset.

Optional custom-field queries use example names; verify them and their types with Jira autocomplete. Select-list, numeric, text, and Assets fields have different supported syntax. The tab is a reference and does not connect to Jira or retrieve tickets itself.

Syntax references: [Atlassian JQL fields](https://support.atlassian.com/jira-software-cloud/docs/jql-fields/), [text search](https://support.atlassian.com/jira-software-cloud/docs/search-for-work-items-using-the-text-field/), and [JQL functions](https://support.atlassian.com/jira-software-cloud/docs/jql-functions/). Reviewed when adding this sheet on 2026-11-02; your Jira edition and configuration may differ.

## Display and shortcuts

| Control | Action |
| --- | --- |
| Theme | Choose a color palette; currently 28 themes are available. |
| Density | Toggle compact layout. |
| Saved | Filter the current sheet to bookmarked commands. |
| Ctrl+K / Cmd+K | Open global search. |
| Arrow keys / Enter in global search | Select a result / copy its command. |
| Escape | Close global search or an open dialog; clear the focused page search. |
| Ctrl+P | Print the current sheet. |

Theme, bookmarks, and non-password target settings use browser-local storage. They are not account-synced preferences.

## Suggested daily workflow

**Choose the subject → set targets → search → inspect the command → copy → verify → run in your terminal.**

## Rebuild the portable file

After changing the source pages, shared scripts, or styles, run this from the repository root with Node.js installed:

```sh
node codex/build-portable.js
```

This regenerates `codex/datacenter-cheatsheet-portable.html`. Refresh an already-open browser page to load updated files.
