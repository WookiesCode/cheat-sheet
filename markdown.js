const MARKDOWN_CHEAT_SHEET_DATA = [
  {
    "id": "md-text",
    "badge": "text",
    "title": "Headings, Text & Paragraphs",
    "subtitle": "Headings, emphasis, line breaks, quotes, rules & escaping",
    "commands": [
      {
        "id": "md-headings",
        "desc": "Headings from level 1 to 6. Put a space after the # marks",
        "cmd": "# Node gpu-node-07 triage\n## Symptoms\n### GPU 3\n#### Xid 79\n##### Notes\n###### Footnote level",
        "flags": [
          [
            "# Title",
            "Level 1. Use one per document, as the title"
          ],
          [
            "## Section",
            "Level 2. GitHub draws a line under levels 1 and 2"
          ],
          [
            "#Title",
            "No space means plain text in CommonMark, not a heading"
          ],
          [
            "Title\\n=====",
            "Older underline style for level 1 (--- under the text gives level 2)"
          ]
        ],
        "subcommands": [
          [
            "## Step 1: Drain the node {#drain}",
            "Custom anchor id (Pandoc and some renderers, not GitHub)"
          ],
          [
            "[Jump to Symptoms](#symptoms)",
            "Link to a heading: lowercase, spaces become -, punctuation removed"
          ]
        ],
        "tip": "Leave a blank line before and after each heading so every renderer sees it.",
        "tags": [
          "markdown",
          "headings",
          "h1",
          "h2",
          "title",
          "anchor"
        ]
      },
      {
        "id": "md-emphasis",
        "desc": "Bold, italic, strikethrough and inline code",
        "cmd": "**bold**  __also bold__\n*italic*  _also italic_\n***bold and italic***\n~~strikethrough~~\n`inline code`\n<kbd>Ctrl</kbd>+<kbd>C</kbd>",
        "flags": [
          [
            "**text**",
            "Bold. Prefer ** over __, because _ inside words is ignored"
          ],
          [
            "*text*",
            "Italic"
          ],
          [
            "~~text~~",
            "Strikethrough (GitHub, not plain CommonMark)"
          ],
          [
            "`text`",
            "Inline code. Nothing inside is formatted"
          ],
          [
            "<kbd>Key</kbd>",
            "Keyboard key style, using HTML that GitHub allows"
          ]
        ],
        "subcommands": [
          [
            "``code with a ` backtick``",
            "Use two backticks to wrap code that contains one"
          ],
          [
            "<sub>2</sub> <sup>TM</sup>",
            "Subscript and superscript with HTML"
          ],
          [
            "<mark>highlighted</mark>",
            "Highlight text (rendered on GitHub)"
          ]
        ],
        "tip": "Put serial numbers, BDFs and hostnames in `backticks` so nothing turns them into links or formatting.",
        "tags": [
          "markdown",
          "bold",
          "italic",
          "strikethrough",
          "emphasis",
          "kbd",
          "inline-code"
        ]
      },
      {
        "id": "md-paragraphs",
        "desc": "Paragraphs, line breaks, block quotes and horizontal rules",
        "cmd": "First paragraph line one\nstill the same paragraph.\n\nNew paragraph after a blank line.\n\nLine one\\\nLine two (backslash break)\n\n> Quoted text from the vendor\n>\n> > Nested quote\n\n---",
        "flags": [
          [
            "Blank line",
            "Starts a new paragraph. A single newline joins the lines"
          ],
          [
            "Line\\\\ at end",
            "A backslash at the end of a line forces a line break"
          ],
          [
            "Two trailing spaces",
            "Also forces a break, but editors often strip them"
          ],
          [
            "> text",
            "Block quote. Add more > for nesting"
          ],
          [
            "--- or *** or ___",
            "Horizontal rule. Put a blank line above ---, or it makes the text above a heading"
          ]
        ],
        "subcommands": [
          [
            "<br>",
            "HTML line break, useful inside table cells"
          ],
          [
            "&nbsp;",
            "Non-breaking space"
          ]
        ],
        "tip": "Use a backslash line break rather than trailing spaces. You can see it, and editors leave it alone.",
        "tags": [
          "markdown",
          "paragraph",
          "line-break",
          "blockquote",
          "hr",
          "rule"
        ]
      },
      {
        "id": "md-escaping",
        "desc": "Show special characters literally with a backslash",
        "cmd": "\\*not italic\\*\n\\# not a heading\n1986\\. A great year\nC:\\\\Users\\\\admin\nfile\\_name\\_v2.txt\n\\| pipe inside a table",
        "flags": [
          [
            "\\\\ ` * _ { } [ ] < > ( ) # + - . ! |",
            "Characters you can escape with a backslash"
          ],
          [
            "1986\\.",
            "Stops a number followed by a period from starting a list"
          ],
          [
            "&lt; &gt; &amp;",
            "HTML entities for <, > and &"
          ]
        ],
        "subcommands": [
          [
            "`*args`",
            "Inline code is the easiest escape: everything inside is literal"
          ],
          [
            "<!-- hidden comment -->",
            "HTML comment, left out of the rendered page"
          ]
        ],
        "tip": "Paths, regexes and globs belong in backticks. Escaping each character one by one is error prone.",
        "tags": [
          "markdown",
          "escape",
          "backslash",
          "special-characters",
          "comment",
          "entities"
        ]
      }
    ]
  },
  {
    "id": "md-lists",
    "badge": "lists",
    "title": "Lists & Task Lists",
    "subtitle": "Bullets, numbered steps, nesting, checkboxes & content inside list items",
    "commands": [
      {
        "id": "md-bullets",
        "desc": "Bullet lists and nested lists",
        "cmd": "- Check SEL\n- Check dmesg\n  - Look for Xid errors\n  - Look for AER errors\n- Check NVLink\n\n* Asterisks work too\n+ So do plus signs",
        "flags": [
          [
            "- item",
            "Bullet. Use one marker style per list"
          ],
          [
            "  - nested",
            "Indent to line up with the text of the parent item (2 spaces after -)"
          ],
          [
            "Blank line between items",
            "Makes a loose list: items are spaced as paragraphs"
          ]
        ],
        "subcommands": [
          [
            "- item\\n\\n<!-- end list -->\\n\\n- new list",
            "A comment ends one list so the next starts fresh"
          ]
        ],
        "tip": "Changing the marker from - to * in the middle starts a new list.",
        "tags": [
          "markdown",
          "lists",
          "bullets",
          "unordered",
          "nested"
        ]
      },
      {
        "id": "md-numbered",
        "desc": "Numbered steps, with code and notes inside a step",
        "cmd": "1. Drain the node in Slurm\n2. Run the health check:\n\n   ```bash\n   dcgmi health -c\n   ```\n\n3. Record the result\n   > Paste the output into the ticket\n\n1. Numbers can all be 1.\n1. The renderer counts for you.",
        "flags": [
          [
            "1. item",
            "Numbered item. The first number sets the start"
          ],
          [
            "5. item",
            "A list that starts at 5 renders as 5, 6, 7"
          ],
          [
            "1) item",
            "A parenthesis also works in CommonMark"
          ],
          [
            "3 spaces of indent",
            "Lines up content with the text after \"1. \", so it stays inside the step"
          ]
        ],
        "subcommands": [
          [
            "1. Step\\n   - sub-bullet",
            "Bullets inside a numbered step"
          ],
          [
            "10. Step",
            "Two-digit numbers need 4 spaces of indent for content below"
          ]
        ],
        "tip": "Indent code blocks inside a numbered step, or the numbering restarts at 1 after the block.",
        "tags": [
          "markdown",
          "lists",
          "numbered",
          "ordered",
          "steps",
          "runbook"
        ]
      },
      {
        "id": "md-tasks",
        "desc": "Task lists with checkboxes",
        "cmd": "- [x] Drain node in Slurm\n- [x] Capture nvidia-smi -q\n- [ ] Reseat GPU 3\n- [ ] Run dcgmi diag -r 3\n  - [ ] Attach results to the RMA",
        "flags": [
          [
            "- [ ] item",
            "Open checkbox"
          ],
          [
            "- [x] item",
            "Checked box"
          ],
          [
            "Space inside [ ]",
            "Required. [] without a space is not a checkbox"
          ]
        ],
        "subcommands": [
          [
            "grep -c '\\- \\[ \\]' summary.md",
            "Count open tasks in a file"
          ],
          [
            "grep -n '\\- \\[ \\]' cases/*/summary.md",
            "List open tasks across every case"
          ]
        ],
        "tip": "On GitHub issues and PRs you can tick the boxes in the rendered page, and the counts show in issue lists.",
        "tags": [
          "markdown",
          "tasks",
          "checklist",
          "checkbox",
          "todo",
          "gfm"
        ]
      }
    ]
  },
  {
    "id": "md-links",
    "badge": "links",
    "title": "Links & Images",
    "subtitle": "Inline links, reference links, anchors, autolinks & images",
    "commands": [
      {
        "id": "md-links-inline",
        "desc": "Inline links, links to headings and links to other files",
        "cmd": "[NVIDIA Xid docs](https://docs.nvidia.com/deploy/xid-errors/)\n[With a title](https://example.com \"Hover text\")\n[Jump to Root Cause](#root-cause)\n[GPU playbook](../docs/playbooks/gpu-nvlink.md)\n[Line 42](scripts/collect.sh#L42)\n<https://example.com>",
        "flags": [
          [
            "[text](url)",
            "Inline link"
          ],
          [
            "[text](url \"title\")",
            "Adds hover text"
          ],
          [
            "[text](#heading-id)",
            "Link to a heading in the same file"
          ],
          [
            "[text](path/file.md)",
            "Relative link to another file in the repository"
          ],
          [
            "<url>",
            "Autolink: shows the URL as a link"
          ]
        ],
        "subcommands": [
          [
            "[text](<path with spaces.md>)",
            "Angle brackets allow spaces in the path"
          ],
          [
            "[text](path%20with%20spaces.md)",
            "Or encode spaces as %20"
          ],
          [
            "https://example.com",
            "GitHub links bare URLs; plain CommonMark doesn't"
          ]
        ],
        "tip": "Heading anchors are lowercase with spaces as -, so \"## Root Cause\" becomes #root-cause.",
        "tags": [
          "markdown",
          "links",
          "url",
          "anchor",
          "relative",
          "autolink"
        ]
      },
      {
        "id": "md-links-reference",
        "desc": "Reference links keep long URLs out of your sentences",
        "cmd": "See the [Xid list][xid] and the [DCGM guide][dcgm].\nThe [RMA portal] is linked below.\n\n[xid]: https://docs.nvidia.com/deploy/xid-errors/\n[dcgm]: https://docs.nvidia.com/datacenter/dcgm/latest/\n[RMA portal]: https://example.com/rma",
        "flags": [
          [
            "[text][label]",
            "Uses the URL defined for label"
          ],
          [
            "[label]",
            "Short form when the text and label match"
          ],
          [
            "[label]: url",
            "Definition. Put these at the bottom; they don't render"
          ],
          [
            "Labels are case-insensitive",
            "[XID] and [xid] are the same link"
          ]
        ],
        "subcommands": [
          [
            "[label]: url \"Title\"",
            "Definition with hover text"
          ]
        ],
        "tip": "Reference links make tables and lists readable in the raw file.",
        "tags": [
          "markdown",
          "links",
          "reference",
          "footnote-style",
          "url"
        ]
      },
      {
        "id": "md-images",
        "desc": "Images, sized images and clickable images",
        "cmd": "![Rack 12 front view](images/rack12-front.jpg)\n![Link LED amber](images/osfp-led.png \"Cage 4\")\n<img src=\"images/riser.jpg\" alt=\"PCIe riser\" width=\"400\">\n[![Status](badge.svg)](https://example.com/status)",
        "flags": [
          [
            "![alt](path)",
            "Image. The alt text is shown if the image can't load"
          ],
          [
            "<img width=\"400\">",
            "Use HTML to set a size"
          ],
          [
            "[![alt](img)](url)",
            "An image that links somewhere"
          ]
        ],
        "subcommands": [
          [
            "![Photo](https://example.com/photo.jpg)",
            "Remote image"
          ],
          [
            "<picture><source media=\"(prefers-color-scheme: dark)\" srcset=\"dark.png\"><img src=\"light.png\" alt=\"Diagram\"></picture>",
            "Different images for light and dark themes on GitHub"
          ]
        ],
        "tip": "Keep photos in an images/ folder next to the file and use relative paths, so they work offline and in clones.",
        "tags": [
          "markdown",
          "images",
          "img",
          "photos",
          "alt",
          "size"
        ]
      }
    ]
  },
  {
    "id": "md-code",
    "badge": "code",
    "title": "Code Blocks",
    "subtitle": "Fenced blocks, syntax highlighting, diffs, log output & nested fences",
    "commands": [
      {
        "id": "md-fenced",
        "desc": "Fenced code block with a language for highlighting",
        "cmd": "```bash\nnvidia-smi -q -d ECC\ndcgmi health -c\n```\n\n```json\n{ \"gpu\": 3, \"xid\": 79 }\n```\n\n```text\nPlain output, no highlighting\n```",
        "flags": [
          [
            "```lang",
            "Opens a block. The language word sets highlighting"
          ],
          [
            "bash sh console",
            "Shell scripts and terminal sessions"
          ],
          [
            "json yaml toml ini",
            "Config and data formats"
          ],
          [
            "python lua powershell sql",
            "Scripting languages"
          ],
          [
            "text or plaintext",
            "No highlighting, best for raw logs"
          ]
        ],
        "subcommands": [
          [
            "~~~bash",
            "Tildes work as fences too"
          ],
          [
            "    indented code",
            "Four spaces of indent also make a code block, but with no language"
          ]
        ],
        "tip": "Always add a language, even text. It keeps highlighting predictable and tells readers what they're looking at.",
        "tags": [
          "markdown",
          "code",
          "fenced",
          "syntax",
          "highlighting",
          "bash"
        ]
      },
      {
        "id": "md-diff-logs",
        "desc": "Show changes and log output",
        "cmd": "```diff\n- MTU=1500\n+ MTU=9000\n```\n\n```console\n$ ibstat mlx5_0 | grep State\n        State: Active\n        Physical state: LinkUp\n```",
        "flags": [
          [
            "```diff",
            "Lines starting with - are red, + are green"
          ],
          [
            "```console",
            "Terminal session: the $ prompt line is styled apart from the output"
          ],
          [
            "```log",
            "Highlights timestamps and levels on some renderers"
          ]
        ],
        "subcommands": [
          [
            "git diff > change.diff",
            "Save a diff to paste into a diff block"
          ]
        ],
        "tip": "Paste raw command output into text or console blocks so wide columns and spacing stay intact.",
        "tags": [
          "markdown",
          "code",
          "diff",
          "console",
          "logs",
          "output"
        ]
      },
      {
        "id": "md-nested-fences",
        "desc": "Show a code block inside a code block",
        "cmd": "````markdown\nUse this in the ticket:\n\n```bash\nipmitool sel elist\n```\n````",
        "flags": [
          [
            "````",
            "Four backticks wrap content that contains three"
          ],
          [
            "~~~ around ```",
            "Or mix tildes and backticks"
          ]
        ],
        "subcommands": [
          [
            "<details><summary>Full dmesg</summary>\\n\\n```text\\n...\\n```\\n\\n</details>",
            "Collapse a long block (see the GitHub section)"
          ]
        ],
        "tip": "The closing fence must use the same character and at least as many as the opening one.",
        "tags": [
          "markdown",
          "code",
          "nested",
          "fence",
          "backticks"
        ]
      }
    ]
  },
  {
    "id": "md-tables",
    "badge": "tables",
    "title": "Tables",
    "subtitle": "Pipe tables, alignment, special characters & building tables from command output",
    "commands": [
      {
        "id": "md-table-basic",
        "desc": "Table with a header row and column alignment",
        "cmd": "| GPU | BDF          | Temp | Status   |\n|:----|:-------------|-----:|:--------:|\n| 0   | 0000:18:00.0 |  41C | OK       |\n| 3   | 0000:8a:00.0 |  88C | **HOT**  |",
        "flags": [
          [
            ":---",
            "Left align"
          ],
          [
            "---:",
            "Right align, best for numbers"
          ],
          [
            ":---:",
            "Center"
          ],
          [
            "Header separator row",
            "Required. Each column needs at least three dashes"
          ],
          [
            "Outer pipes",
            "Optional, but they make the raw text easier to read"
          ]
        ],
        "subcommands": [
          [
            "| a \\| b |",
            "Escape a pipe inside a cell"
          ],
          [
            "| line one<br>line two |",
            "Line break inside a cell"
          ],
          [
            "| `code` | **bold** |",
            "Inline formatting works in cells; lists and code blocks don't"
          ]
        ],
        "tip": "Columns don't need to line up in the raw file. Your editor's formatter or prettier can align them.",
        "tags": [
          "markdown",
          "tables",
          "alignment",
          "columns",
          "gfm"
        ]
      },
      {
        "id": "md-table-from-cli",
        "desc": "Turn command output into a Markdown table",
        "cmd": "nvidia-smi --query-gpu=index,pci.bus_id,temperature.gpu,serial --format=csv,noheader \\\n  | awk -F', ' 'BEGIN { print \"| GPU | BDF | Temp | Serial |\"; print \"|---|---|---:|---|\" }\n               { printf \"| %s | %s | %sC | %s |\\n\", $1, $2, $3, $4 }'",
        "flags": [
          [
            "--format=csv,noheader",
            "Comma-separated output without a header line"
          ],
          [
            "awk -F', '",
            "Split fields on a comma and space"
          ],
          [
            "BEGIN { print ... }",
            "Print the header and separator rows once"
          ]
        ],
        "subcommands": [
          [
            "lsblk -o NAME,SIZE,MODEL,SERIAL -dn | awk '{ printf \"| %s | %s | %s | %s |\\n\", $1, $2, $3, $4 }'",
            "Disk inventory rows"
          ],
          [
            "column -t -s, data.csv",
            "Align a CSV for a plain text block instead"
          ],
          [
            "pandoc -f csv -t gfm data.csv",
            "Convert a CSV straight to a Markdown table"
          ]
        ],
        "tip": "Fields that can contain spaces, like model names, should come last or be quoted in the CSV.",
        "tags": [
          "markdown",
          "tables",
          "awk",
          "nvidia-smi",
          "csv",
          "pandoc",
          "inventory"
        ]
      }
    ]
  },
  {
    "id": "md-gfm",
    "badge": "gfm",
    "title": "GitHub Extensions",
    "subtitle": "Alerts, collapsible sections, footnotes, mentions, diagrams & math",
    "commands": [
      {
        "id": "md-alerts",
        "desc": "GitHub alert boxes for notes and warnings",
        "cmd": "> [!NOTE]\n> GPU 3 was reseated on 2026-11-03.\n\n> [!WARNING]\n> Drain the node before running dcgmi diag -r 3.\n\n> [!CAUTION]\n> nvme format erases the drive.",
        "flags": [
          [
            "[!NOTE]",
            "Blue: useful background"
          ],
          [
            "[!TIP]",
            "Green: a better way to do something"
          ],
          [
            "[!IMPORTANT]",
            "Purple: needed to succeed"
          ],
          [
            "[!WARNING]",
            "Yellow: needs attention right away"
          ],
          [
            "[!CAUTION]",
            "Red: risk of data loss or outage"
          ]
        ],
        "subcommands": [
          [
            "> **Note:** text",
            "Fallback that reads well on renderers without alerts"
          ]
        ],
        "tip": "Alerts render on GitHub and some editors. Elsewhere they show as plain block quotes.",
        "tags": [
          "markdown",
          "gfm",
          "alerts",
          "callout",
          "note",
          "warning",
          "admonition"
        ]
      },
      {
        "id": "md-details",
        "desc": "Collapsible section for long logs",
        "cmd": "<details>\n<summary>Full nvidia-smi -q output</summary>\n\n```text\n==============NVSMI LOG==============\n...\n```\n\n</details>",
        "flags": [
          [
            "<details>",
            "Collapsed by default"
          ],
          [
            "<details open>",
            "Starts expanded"
          ],
          [
            "<summary>",
            "The clickable title line"
          ],
          [
            "Blank lines inside",
            "Needed so the Markdown inside renders"
          ]
        ],
        "subcommands": [],
        "tip": "Keep the key evidence visible and fold the full logs, so reviewers see the cause first.",
        "tags": [
          "markdown",
          "gfm",
          "details",
          "summary",
          "collapse",
          "html",
          "logs"
        ]
      },
      {
        "id": "md-footnotes-mentions",
        "desc": "Footnotes, mentions and issue references",
        "cmd": "Row remap failed on GPU 3.[^1]\n\n[^1]: See nvidia-smi -q -d ROW_REMAPPER output in logs/.\n\nFixed in org/repo#42 and abc1234.\nClosing: Fixes #57",
        "flags": [
          [
            "[^1] and [^1]: text",
            "Footnote marker and its text, listed at the bottom"
          ],
          [
            "#123",
            "Links an issue or PR in the same repository"
          ],
          [
            "org/repo#123",
            "Links an issue in another repository"
          ],
          [
            "abc1234",
            "A commit hash becomes a link"
          ],
          [
            "Fixes #57",
            "In a PR, closes the issue when merged"
          ]
        ],
        "subcommands": [
          [
            "`@name`",
            "Put a name in backticks to mention it without notifying anyone"
          ]
        ],
        "tip": "On GitHub, a bare @name notifies that person, so only write it when you mean to.",
        "tags": [
          "markdown",
          "gfm",
          "footnotes",
          "mentions",
          "issues",
          "references"
        ]
      },
      {
        "id": "md-mermaid-math",
        "desc": "Diagrams with Mermaid and math with LaTeX",
        "cmd": "```mermaid\nflowchart LR\n  GPU3[GPU 3] -->|NVLink| NVS[NVSwitch 1]\n  NVS --> GPU5[GPU 5]\n```\n\nInline math: $BW = lanes \\times rate$\n\n$$\nBER = \\frac{errors}{bits}\n$$",
        "flags": [
          [
            "```mermaid",
            "Flowcharts, sequence diagrams and more, drawn from text"
          ],
          [
            "flowchart LR / TD",
            "Left-to-right or top-down layout"
          ],
          [
            "A -->|label| B",
            "Arrow with a label"
          ],
          [
            "$...$ and $$...$$",
            "Inline and block math on GitHub"
          ]
        ],
        "subcommands": [
          [
            "sequenceDiagram",
            "Mermaid sequence diagram, good for request flows"
          ]
        ],
        "tip": "Mermaid and math need a renderer that supports them. GitHub and Obsidian do; plain viewers show the source.",
        "tags": [
          "markdown",
          "gfm",
          "mermaid",
          "diagram",
          "math",
          "latex"
        ]
      }
    ]
  },
  {
    "id": "md-templates",
    "badge": "tmpl",
    "title": "Ticket & Runbook Templates",
    "subtitle": "Ready-to-fill case summaries, runbooks and front matter",
    "commands": [
      {
        "id": "md-case-summary",
        "desc": "Case summary.md skeleton for a hardware incident",
        "cmd": "# gpu-node-07: GPU 3 Xid 79\n\n| Field    | Value |\n|----------|-------|\n| Ticket   | DC-1234 |\n| Severity | High |\n| Node     | `gpu-node-07` (Rack 12, U20) |\n| Status   | Drained |\n\n## Symptoms\n\n## Timeline\n- 2026-11-03 09:12 Xid 79 on GPU 3\n\n## Evidence\n\n## Root Cause\n\n## Next Actions\n- [ ] Reseat GPU 3\n- [ ] Open RMA",
        "flags": [
          [
            "Title line",
            "Host and symptom, so the case is clear in a file list"
          ],
          [
            "Field table",
            "Quick facts at the top for whoever picks up the ticket"
          ],
          [
            "Timeline",
            "Timestamped entries, newest at the bottom"
          ],
          [
            "Next Actions",
            "A task list that shows what's still open"
          ]
        ],
        "subcommands": [
          [
            "mkdir -p cases/DC-1234/logs && $EDITOR cases/DC-1234/summary.md",
            "Start a new case folder"
          ]
        ],
        "tip": "Never paste passwords or tokens into a case file. Strip them from captured output first.",
        "tags": [
          "markdown",
          "template",
          "case",
          "incident",
          "summary",
          "rma",
          "ticket"
        ]
      },
      {
        "id": "md-runbook",
        "desc": "Runbook skeleton with prerequisites, steps and rollback",
        "cmd": "# Replace a failed NVMe drive\n\n> [!WARNING]\n> Confirm the drive serial before pulling anything.\n\n## Prerequisites\n- Node drained\n- Replacement drive on hand\n\n## Steps\n1. Identify the drive:\n\n   ```bash\n   nvme list\n   ```\n\n2. Light the bay LED.\n3. Swap the drive.\n\n## Verify\n\n## Rollback",
        "flags": [
          [
            "Warning at the top",
            "Puts the risk where nobody can miss it"
          ],
          [
            "Numbered steps",
            "Readers can say which step failed"
          ],
          [
            "Verify and Rollback",
            "How to confirm success and how to back out"
          ]
        ],
        "subcommands": [],
        "tip": "Write each step as a single action, with its command in a code block indented under it.",
        "tags": [
          "markdown",
          "template",
          "runbook",
          "procedure",
          "sop",
          "steps"
        ]
      },
      {
        "id": "md-front-matter",
        "desc": "YAML front matter for static sites and note apps",
        "cmd": "---\ntitle: Replace a failed NVMe drive\nauthor: dc-ops\ndate: 2026-11-03\ntags: [nvme, storage, runbook]\n---\n\n# Replace a failed NVMe drive",
        "flags": [
          [
            "--- ... ---",
            "YAML block. Must be the very first thing in the file"
          ],
          [
            "title, date, tags",
            "Common fields read by Hugo, Jekyll, MkDocs, Obsidian and Pandoc"
          ]
        ],
        "subcommands": [
          [
            "+++ ... +++",
            "TOML front matter (Hugo)"
          ]
        ],
        "tip": "GitHub shows front matter as a table at the top of the rendered file.",
        "tags": [
          "markdown",
          "front-matter",
          "yaml",
          "metadata",
          "hugo",
          "jekyll",
          "obsidian"
        ]
      }
    ]
  },
  {
    "id": "md-tools",
    "badge": "tools",
    "title": "Markdown Tools",
    "subtitle": "Preview in the terminal, lint, format, convert to other formats & build tables of contents",
    "commands": [
      {
        "id": "md-preview",
        "desc": "Read rendered Markdown in the terminal",
        "cmd": "glow README.md\nglow -p cases/DC-1234/summary.md\nmdcat README.md",
        "flags": [
          [
            "glow FILE",
            "Render Markdown with color in the terminal"
          ],
          [
            "glow -p",
            "Page through long files"
          ],
          [
            "glow -w 100",
            "Wrap at 100 columns"
          ],
          [
            "mdcat FILE",
            "Alternative renderer that can show images in some terminals"
          ]
        ],
        "subcommands": [
          [
            "glow",
            "Browse every Markdown file in the current folder"
          ],
          [
            "pandoc README.md | lynx -stdin",
            "Fallback with tools found on most servers"
          ]
        ],
        "tip": "Neovim users can install render-markdown.nvim to see headings and tables styled while editing.",
        "tags": [
          "markdown",
          "glow",
          "mdcat",
          "preview",
          "terminal",
          "render"
        ]
      },
      {
        "id": "md-lint-format",
        "desc": "Check and format Markdown files",
        "cmd": "markdownlint-cli2 \"**/*.md\"\nmarkdownlint-cli2 --fix \"docs/**/*.md\"\nprettier --write \"**/*.md\"",
        "flags": [
          [
            "markdownlint-cli2 GLOB",
            "Report problems such as skipped heading levels and bad list indents"
          ],
          [
            "--fix",
            "Fix the problems it can"
          ],
          [
            ".markdownlint.jsonc",
            "Turn rules on or off, for example { \"MD013\": false } to allow long lines"
          ],
          [
            "prettier --write",
            "Reformat files: aligns tables and normalizes list markers"
          ]
        ],
        "subcommands": [
          [
            "prettier --check \"**/*.md\"",
            "Fail in CI if files need formatting"
          ],
          [
            "npx markdown-link-check README.md",
            "Find broken links"
          ]
        ],
        "tip": "MD013 (line length) is the rule most teams turn off first.",
        "tags": [
          "markdown",
          "lint",
          "markdownlint",
          "prettier",
          "format",
          "ci"
        ]
      },
      {
        "id": "md-pandoc",
        "desc": "Convert Markdown to HTML, Word or PDF with Pandoc",
        "cmd": "pandoc summary.md -o summary.html --standalone\npandoc summary.md -o summary.docx\npandoc summary.md -o summary.pdf\npandoc report.docx -t gfm -o report.md",
        "flags": [
          [
            "-o FILE",
            "Output file. The extension sets the format"
          ],
          [
            "--standalone / -s",
            "Full HTML page with head and body"
          ],
          [
            "-t gfm",
            "Write GitHub Flavored Markdown"
          ],
          [
            "--toc",
            "Add a table of contents"
          ],
          [
            "--metadata title=\"...\"",
            "Set the document title"
          ]
        ],
        "subcommands": [
          [
            "pandoc -s --embed-resources summary.md -o summary.html",
            "Single HTML file with images built in"
          ],
          [
            "pandoc page.html -t gfm -o page.md",
            "Convert a web page or wiki export to Markdown"
          ],
          [
            "pandoc summary.md -t jira",
            "Convert to Jira wiki markup for older Jira editors"
          ]
        ],
        "tip": "PDF output needs a LaTeX engine. On Ubuntu, install texlive-latex-recommended, or write HTML and print it to PDF.",
        "tags": [
          "markdown",
          "pandoc",
          "convert",
          "html",
          "docx",
          "pdf",
          "jira"
        ]
      },
      {
        "id": "md-toc-grep",
        "desc": "List headings and build a table of contents",
        "cmd": "grep -n '^#\\{1,6\\} ' README.md\ngrep -h '^## ' docs/playbooks/*.md\npandoc -s --toc README.md -o README.html",
        "flags": [
          [
            "grep -n '^#\\{1,6\\} '",
            "Every heading with its line number"
          ],
          [
            "--toc --toc-depth=2",
            "Pandoc table of contents down to level 2"
          ]
        ],
        "subcommands": [
          [
            "grep '^## ' README.md | sed -E 's/^## (.*)/- [\\1](#\\1)/'",
            "Rough TOC list to paste (fix the anchors to lowercase-with-dashes)"
          ],
          [
            "npx markdown-toc -i README.md",
            "Insert a TOC between <!-- toc --> markers"
          ]
        ],
        "tip": "GitHub builds a TOC for you: use the outline button at the top of any rendered Markdown file.",
        "tags": [
          "markdown",
          "toc",
          "headings",
          "grep",
          "pandoc",
          "outline"
        ]
      }
    ]
  }
];

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("markdown_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
const sectionsContainer = document.getElementById("sections-container");
const categoryTabsEl = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const themeToggleBtn = document.getElementById("theme-toggle");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const printBtn = document.getElementById("print-btn");

let toastTimer = null;

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  if (!toast) return;
  toastText.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied snippet to clipboard");
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast("Copied snippet to clipboard");
}

// Shell & language syntax highlighter
function highlightCommand(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return `<span class="tok-str">${strLiteral}</span>`;
      if (flagPart) return `<span class="tok-flag">${flagPart}</span>`;
      if (operatorPart) return `<span class="tok-pipe">${operatorPart}</span>`;
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? `<span class="tok-pipe">${sudoPart}</span>` : "";
        return `${prefix}${sudoHtml}<span class="tok-cmd">${cmdName}</span>`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = MARKDOWN_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of MARKDOWN_CHEAT_SHEET_DATA) {
    const isSelected = state.activeCategory === section.id ? "selected" : "";
    optionsHtml.push(
      `<option value="${section.id}" ${isSelected}>${escapeHtml(section.title)} (${section.commands.length})</option>`
    );
  }

  const resetBtnHtml =
    state.activeCategory !== "all"
      ? `<button type="button" class="cat-reset-btn" data-cat="all" title="Show all sections">✕ Show All</button>`
      : "";

  categoryTabsEl.innerHTML = `
    <div class="cat-dropdown-wrap">
      <label class="cat-dropdown-label" for="category-select">Section:</label>
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('Markdown')} section">
        ${optionsHtml.join("")}
      </select>
      ${resetBtnHtml}
    </div>
  `;

  const sel = document.getElementById("category-select");
  if (sel) {
    sel.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderSections();
    });
  }

  const resetBtn = categoryTabsEl.querySelector(".cat-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmdObj, section, query) {
  if (!query) return true;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    cmdObj.desc,
    cmdObj.cmd,
    cmdObj.details || "",
    cmdObj.tip || "",
    section.title,
    section.subtitle,
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat(),
    ...(cmdObj.subcommands || []).flat()
  ]
    .join(" ")
    .toLowerCase();

  return terms.every((t) => haystack.includes(t));
}

let allRenderedCards = [];
function packMasonry() {
  if (!sectionsContainer) return;
  if (sectionsContainer.querySelectorAll(".section-card").length === 0) {
    allRenderedCards = [];
    return;
  }
  const directCards = [...sectionsContainer.querySelectorAll(":scope > .section-card")];
  if (directCards.length > 0) {
    allRenderedCards = directCards;
  }
  if (allRenderedCards.length === 0) return;

  const containerWidth = sectionsContainer.clientWidth || window.innerWidth;
  const colCount = Math.max(1, Math.min(allRenderedCards.length, Math.floor((containerWidth + 18) / (380 + 18))));
  if (colCount <= 1) {
    sectionsContainer.classList.remove("has-masonry");
    sectionsContainer.replaceChildren(...allRenderedCards);
    return;
  }

  sectionsContainer.classList.add("has-masonry");
  const cols = Array.from({ length: colCount }, () => {
    const col = document.createElement("div");
    col.className = "masonry-col";
    return col;
  });
  const colHeights = new Array(colCount).fill(0);
  sectionsContainer.replaceChildren(...cols);

  for (const card of allRenderedCards) {
    let shortestIdx = 0;
    for (let i = 1; i < colCount; i++) {
      if (colHeights[i] < colHeights[shortestIdx]) {
        shortestIdx = i;
      }
    }
    cols[shortestIdx].appendChild(card);
    colHeights[shortestIdx] += card.offsetHeight + 18;
  }
}

let masonryResizeTimer;
function scheduleMasonry() {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
}
window.addEventListener("resize", scheduleMasonry);
document.addEventListener("fullscreenchange", scheduleMasonry);

if (typeof ResizeObserver !== "undefined" && sectionsContainer) {
  let lastObservedWidth = 0;
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width);
      if (w > 0 && Math.abs(w - lastObservedWidth) > 10) {
        lastObservedWidth = w;
        scheduleMasonry();
      }
    }
  });
  ro.observe(sectionsContainer);
}

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of MARKDOWN_CHEAT_SHEET_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const filteredCommands = section.commands.filter((cmdObj) => {
      if (state.savedOnly && !state.bookmarks.has(cmdObj.id)) {
        return false;
      }
      return matchesSearch(cmdObj, section, state.searchQuery);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const itemsHtml = filteredCommands
      .map((item) => {
        const isSaved = state.bookmarks.has(item.id);
        const tipHtml = item.tip ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>` : "";
        const detailsHtml = item.details ? `<p class="cmd-details">${escapeHtml(item.details)}</p>` : "";

        const flagsHtml =
          item.flags && item.flags.length
            ? `<div class="flag-pills">
                ${item.flags
                  .map(
                    ([flag, exp]) =>
                      `<span class="flag-pill"><code>${escapeHtml(flag)}</code> <span>${escapeHtml(exp)}</span></span>`
                  )
                  .join("")}
              </div>`
            : "";

        const subcommandsHtml =
          item.subcommands && item.subcommands.length
            ? `<div class="subcmd-list">
                <span class="subcmd-header">Subcommands, Variations &amp; Snippets</span>
                ${item.subcommands
                  .map(
                    ([subcmd, exp]) =>
                      `<div class="subcmd-row" data-copy="${escapeHtml(subcmd)}" title="Click to copy snippet">
                        <code>${escapeHtml(subcmd)}</code>
                        <span>${escapeHtml(exp)}</span>
                      </div>`
                  )
                  .join("")}
              </div>`
            : "";

        return `
          <div class="cmd-item" id="${item.id}" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn ${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="${item.id}"
                  title="${isSaved ? "Remove bookmark" : "Bookmark snippet"}"
                  aria-label="Bookmark snippet"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(item.cmd)}" title="Click to copy snippet">
              <code class="cmd-code">${highlightCommand(item.cmd)}</code>
              <span class="copy-hint">Copy</span>
            </div>

            ${detailsHtml}
            ${flagsHtml}
            ${subcommandsHtml}
          </div>
        `;
      })
      .join("");

    cardsHtml.push(`
      <article class="section-card" id="sec-${section.id}">
        <header class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">${escapeHtml(section.badge)}</span>
            <div>
              <h2 class="section-title">${escapeHtml(section.title)}</h2>
              <p class="section-subtitle">${escapeHtml(section.subtitle)}</p>
            </div>
          </div>
          <span class="count-badge">${filteredCommands.length}</span>
        </header>
        <div class="command-list">
          ${itemsHtml}
        </div>
      </article>
    `);
  }

  sectionsContainer.innerHTML = cardsHtml.join("");
  packMasonry();
  visibleCountEl.textContent = visibleCommandsCount;
  savedCountEl.textContent = state.bookmarks.size;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
    sectionsContainer.classList.add("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
    sectionsContainer.classList.remove("hidden");
  }
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
    window.AntigravityCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch(e) {}
  }
}

function initEvents() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    renderSections();
  });

  sectionsContainer.addEventListener("click", (e) => {
    const copyBox = e.target.closest(".cmd-code-box, .subcmd-row");
    if (copyBox) {
      copyToClipboard(copyBox.dataset.copy);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const id = bookmarkBtn.dataset.bookmarkId;
      if (state.bookmarks.has(id)) {
        state.bookmarks.delete(id);
        bookmarkBtn.classList.remove("bookmarked");
        bookmarkBtn.textContent = "☆";
        bookmarkBtn.title = "Bookmark snippet";
        showToast("Removed from saved bookmarks");
      } else {
        state.bookmarks.add(id);
        bookmarkBtn.classList.add("bookmarked");
        bookmarkBtn.textContent = "★";
        bookmarkBtn.title = "Remove bookmark";
        showToast("Added to saved bookmarks");
      }
      localStorage.setItem("markdown_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      savedCountEl.textContent = state.bookmarks.size;
      if (state.savedOnly) {
        renderSections();
      }
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    savedFilterBtn.classList.toggle("active", state.savedOnly);
    renderSections();
  });

  if (printBtn) printBtn.addEventListener("click", () => {
    window.print();
  });

  themeToggleBtn.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.activeCategory = "all";
    state.savedOnly = false;
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape") {
      if (document.activeElement === searchInput || state.searchQuery) {
        searchInput.value = "";
        state.searchQuery = "";
        searchInput.blur();
        renderSections();
      }
    }
  });
}

// Initialize
applyTheme(state.theme);
renderCategoryTabs();
renderSections();
initEvents();
