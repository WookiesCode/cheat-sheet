const NEOVIM_CHEAT_SHEET_DATA = [
  {
    part: "nvim-motions",
    id: "motions",
    badge: "mov",
    title: "Motions, Jumps & Screen Navigation",
    subtitle: "Word movement, character find, line boundaries, viewport & jump list",
    commands: [
      {
        id: "word-motions",
        mode: "N / V",
        modeClass: "mode-n",
        desc: "Move by word start/end or whitespace-delimited WORD",
        cmd: "w   b   e   ge   |   W   B   E",
        flags: [
          ["w / b", "Next / previous word start"],
          ["e / ge", "End of current / previous word"],
          ["W / B / E", "Ignore punctuation (whitespace-only WORDs)"]
        ],
        tags: ["word", "move", "cursor", "navigation", "punctuation"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/motion/","title":"Neovim help: motion"}]}
      },
      {
        id: "line-boundaries",
        mode: "N / V",
        modeClass: "mode-n",
        desc: "Jump to first non-blank character, column 0, or end of line",
        cmd: "^   0   $   g_",
        flags: [
          ["^", "First non-blank character of line"],
          ["0", "Hard column 0 (very start of line)"],
          ["$", "End of line"],
          ["g_", "Last non-blank character of line"]
        ],
        tip: "Use ^ & g_ with operators",
        tags: ["line", "start", "end", "home", "bol", "eol"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/motion/","title":"Neovim help: motion"}]}
      },
      {
        id: "char-find-inline",
        mode: "N / V / O",
        modeClass: "mode-n",
        desc: "Jump directly to or right before a character on the current line",
        cmd: "f{char}   t{char}   ;   ,",
        flags: [
          ["f{c} / F{c}", "Land ON next / prev occurrence of {c}"],
          ["t{c} / T{c}", "Land right BEFORE next / prev {c}"],
          ["; / ,", "Repeat last f/t forward / backward"]
        ],
        tip: "Fastest horizontal motion",
        tags: ["find", "till", "character", "inline", "repeat"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/motion/","title":"Neovim help: motion"}]}
      },
      {
        id: "file-vertical-jumps",
        mode: "N / V",
        modeClass: "mode-n",
        desc: "Jump to top/bottom of buffer, specific line number, or matching bracket",
        cmd: "gg   G   42G   50%   %",
        flags: [
          ["gg / G", "First line / last line of buffer"],
          ["42G or :42", "Jump to line 42"],
          ["%", "Jump between matching (), {}, []"]
        ],
        tags: ["top", "bottom", "goto", "line", "bracket", "match"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/motion/","title":"Neovim help: motion"}]}
      },
      {
        id: "scroll-and-center",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Half-page scrolling and recentering viewport around cursor",
        cmd: "<C-d>   <C-u>   zz   zt   zb",
        flags: [
          ["<C-d> / <C-u>", "Scroll half-page down / up"],
          ["zz", "Center current line on screen"],
          ["zt / zb", "Position current line at top / bottom of window"]
        ],
        tip: "Pro tip: map <C-d>zz",
        tags: ["scroll", "center", "page", "viewport", "screen"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/scroll/","title":"Neovim help: scroll"}]}
      },
      {
        id: "screen-high-mid-low",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Jump to top, middle, or bottom of currently visible window",
        cmd: "H   M   L   |   {   }",
        flags: [
          ["H / M / L", "High (top), Middle, Low (bottom) of visible screen"],
          ["{ / }", "Jump to previous / next blank-line paragraph"]
        ],
        tags: ["window", "high", "middle", "low", "paragraph"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/motion/","title":"Neovim help: motion"}]}
      },
      {
        id: "jumplist-changelist",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Traverse jump history or edit location history across files",
        cmd: "<C-o>   <C-i>   |   g;   g,   gi",
        flags: [
          ["<C-o> / <C-i>", "Go back / forward in Jump List"],
          ["g; / g,", "Go to older / newer position in Change List"],
          ["gi", "Resume Insert mode at exact last edit spot"]
        ],
        tags: ["back", "forward", "history", "jumplist", "changelist"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/motion/","title":"Neovim help: motion"}]}
      }
    ]
  },
  {
    "part": "nvim-motions",
    "id": "motions-pro-tips",
    "badge": "tip",
    "title": "Motions: Pro Tips & Chords",
    "subtitle": "Jump list traversal, change list navigation & viewport centering",
    "commands": [
      {
        "id": "motions-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Jump list traversal, change list navigation & viewport centering",
        "cmd": "<C-o>   <C-i>   |   g;   g,   |   zz   zt   zb",
        "details": "Navigate your entire editing history across buffers with Ctrl+o / Ctrl+i. Use g; to jump to exact previous change positions and zz to immediately center your screen on the active cursor line.",
        "flags": [
          [
            "<C-o> / <C-i>",
            "Jump back / forward in jump list across files"
          ],
          [
            "g; / g,",
            "Jump to older / newer change list edit position"
          ],
          [
            "zz / zt / zb",
            "Center screen / position line at top / position line at bottom"
          ],
          [
            "H / M / L",
            "Move cursor to High, Middle, or Low line of visible viewport"
          ]
        ],
        "tip": "Combine motions with operators: d2w, y$, c^",
        "tags": [
          "motions",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/motion/",
              "title": "Neovim help: motion"
            },
            {
              "url": "https://neovim.io/doc/user/scroll/",
              "title": "Neovim help: scroll"
            }
          ]
        }
      }
    ]
  },
  {
    part: "nvim-operators",
    id: "operators",
    badge: "edit",
    title: "Operators, Text Objects & Editing",
    subtitle: "Composable operator grammar, inner/around objects, dot repeat & case",
    commands: [
      {
        id: "text-objects-quotes-brackets",
        mode: "N / V",
        modeClass: "mode-n",
        desc: "Change, delete, or yank inside/around quotes, parens, braces & tags",
        cmd: 'ci"   da(   yi{   cit   dip',
        flags: [
          ['ci"', "Change inside double quotes"],
          ["da(", "Delete around parentheses (including parens)"],
          ["yi{", "Yank inside curly braces {} (or yiB)"],
          ["cit / cat", "Change inside / around HTML/XML <tag>"],
          ["dip", "Delete inner paragraph"]
        ],
        tip: "Core Vim superpower",
        tags: ["inside", "around", "text-object", "quotes", "parens", "braces", "html", "tag"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/motion/","title":"Neovim help: motion"}]}
      },
      {
        id: "word-change-delete",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Operate on whole word under cursor regardless of cursor position in word",
        cmd: "ciw   diw   yiw   daw",
        flags: [
          ["ciw", "Change inner word (works even from middle of word)"],
          ["daw", "Delete a word including trailing whitespace"],
          ["yiw", "Yank word under cursor"]
        ],
        tags: ["word", "replace", "delete", "copy", "inner"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/motion/","title":"Neovim help: motion"},{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"}]}
      },
      {
        id: "eol-shortcuts",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Single-key equivalents for operating from cursor to end of line",
        cmd: "D   C   Y   S   s   x",
        flags: [
          ["D / C", "Delete (d$) / Change (c$) to end of line"],
          ["Y", "Yank to end of line (y$) in Neovim default"],
          ["S / cc", "Clear entire line and enter Insert mode"],
          ["s / x", "Substitute char (cl) / Delete char under cursor (dl)"]
        ],
        tip: "Nvim defaults Y to y$",
        tags: ["end", "line", "shortcut", "substitute", "delete"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"},{"url":"https://neovim.io/doc/user/vim_diff/","title":"Neovim help: default mappings"}]}
      },
      {
        id: "dot-repeat-and-join",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Repeat last change, join lines with or without space, and increment numbers",
        cmd: ".   J   gJ   <C-a>   <C-x>",
        flags: [
          [".", "Repeat last atomic edit command"],
          ["J / gJ", "Join next line with space / without space"],
          ["<C-a> / <C-x>", "Increment / decrement the number under the cursor (letters too only if 'nrformats' includes alpha; the default is bin,hex)"]
        ],
        tags: ["repeat", "dot", "join", "increment", "number"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/repeat/","title":"Neovim help: repeat (macros, :g)"},{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"},{"url":"https://neovim.io/doc/user/options/","title":"Neovim help: options"}],"note":"Corrected 2026-11-10: Ctrl+A only changes letters when 'nrformats' includes alpha."}
      },
      {
        id: "case-indent-format",
        mode: "N / V",
        modeClass: "mode-n",
        desc: "Toggle case, uppercase/lowercase, auto-indent, and wrap paragraphs",
        cmd: "~   gUiw   guiw   =G   gqip",
        flags: [
          ["~", "Toggle case of character(s)"],
          ["gUiw / guiw", "Uppercase / lowercase inner word (gUU / guu for line)"],
          ["=G / == ", "Auto-indent to end of file / current line"],
          ["gqip", "Hard-wrap inner paragraph to textwidth"]
        ],
        tags: ["case", "uppercase", "lowercase", "indent", "format", "wrap"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"}]}
      },
      {
        id: "commenting-builtin",
        mode: "N / V",
        modeClass: "mode-n",
        desc: "Toggle code comments using Neovim 0.10+ built-in commenting",
        cmd: "gcc   gcip   gc}",
        flags: [
          ["gcc", "Toggle line comment on current line"],
          ["gc{motion}", "Toggle comment over motion/text-object (or visual gc)"]
        ],
        tip: "Built into Nvim 0.10+",
        tags: ["comment", "uncomment", "toggle", "code"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/various/","title":"Neovim help: various (:!, gc, CTRL-L)"},{"url":"https://neovim.io/doc/user/vim_diff/","title":"Neovim help: default mappings"}]}
      }
    ]
  },
  {
    "part": "nvim-operators",
    "id": "operators-pro-tips",
    "badge": "tip",
    "title": "Operators: Pro Tips & Chords",
    "subtitle": "Vim operator grammar composition rules: [operator][count][scope][target]",
    "commands": [
      {
        "id": "operators-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Vim operator grammar composition rules: [operator][count][scope][target]",
        "cmd": "ci\"   da)   yiw   gUiw   =i}   gc",
        "details": "Operators (c, d, y, v, =, gU, gu, gc) combine with inner (i) or around (a) scope targets. Inner affects content inside delimiters; around includes delimiters themselves.",
        "flags": [
          [
            "ci\" / ca\"",
            "Change inside / around double quotes"
          ],
          [
            "da) / di)",
            "Delete around / inside parentheses"
          ],
          [
            "yiw / yaw",
            "Yank inner word / around word including trailing space"
          ],
          [
            "gUiw / guiw",
            "Convert inner word to UPPERCASE / lowercase"
          ],
          [
            "gc / gcc",
            "Comment motion target / comment entire current line"
          ]
        ],
        "tip": "The dot (.) command repeats the entire composite operator change!",
        "tags": [
          "operators",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/motion/",
              "title": "Neovim help: motion"
            },
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            },
            {
              "url": "https://neovim.io/doc/user/various/",
              "title": "Neovim help: various (:!, gc, CTRL-L)"
            }
          ]
        }
      }
    ]
  },
  {
    part: "nvim-visual",
    id: "visual",
    badge: "vis",
    title: "Visual Mode & Multi-Line Block Editing",
    subtitle: "Char/Line/Block selection, column editing, sequence numbering & sorting",
    commands: [
      {
        id: "visual-block-insert",
        mode: "VISUAL BLOCK",
        modeClass: "mode-v",
        desc: "Insert text at the beginning of multiple lines simultaneously",
        cmd: "<C-v>  jjj  I{text}<Esc>",
        flags: [
          ["<C-v>", "Enter Visual Block (column) mode"],
          ["jjj", "Extend block across target lines"],
          ["I ... <Esc>", "Capital I, type prefix, press Esc to apply to all lines"]
        ],
        tip: "Multi-cursor alternative",
        tags: ["block", "column", "multiline", "prefix", "insert"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/visual/","title":"Neovim help: visual"}]}
      },
      {
        id: "visual-block-append",
        mode: "VISUAL BLOCK",
        modeClass: "mode-v",
        desc: "Append text to the end of multiple ragged-length lines",
        cmd: "<C-v>  jjj  $A{text}<Esc>",
        flags: [
          ["$A", "Extend block to end of each line and append text"],
          ["c", "Change selected rectangular block across all lines"]
        ],
        tags: ["append", "eol", "block", "multiline", "column"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/visual/","title":"Neovim help: visual"},{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"}]}
      },
      {
        id: "visual-reselect-and-ends",
        mode: "VISUAL",
        modeClass: "mode-v",
        desc: "Reselect previous visual area or jump cursor to other end of selection",
        cmd: "gv   o   O   V   v",
        flags: [
          ["gv", "Restore last visual selection (Normal mode)"],
          ["o / O", "Swap active cursor to opposite corner of selection"]
        ],
        tags: ["reselect", "swap", "corner", "selection"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/visual/","title":"Neovim help: visual"}]}
      },
      {
        id: "visual-number-sequence",
        mode: "VISUAL",
        modeClass: "mode-v",
        desc: "Turn column of zeros into sequential numbers (1, 2, 3, 4...)",
        cmd: "<C-v> jjj  g<C-a>",
        flags: [
          ["g<C-a>", "Increment each selected line cumulatively (1, 2, 3...)"],
          ["<C-a>", "Increment all selected lines by same amount"]
        ],
        tip: "Instant numbered lists",
        tags: ["sequence", "increment", "numbers", "list"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"}]}
      },
      {
        id: "visual-sort-and-move",
        mode: "VISUAL",
        modeClass: "mode-v",
        desc: "Sort selected lines uniquely or move selected block up/down",
        cmd: ":'<,'>sort u   |   <A-j>   <A-k>",
        flags: [
          [":sort u", "Sort selected lines alphabetically & remove duplicates"],
          [":sort n", "Sort numerically"],
          ["<A-j> / <A-k>", "Move selected line(s) down / up (LazyVim)"]
        ],
        tags: ["sort", "unique", "move", "lines", "deduplicate"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      }
    ]
  },
  {
    "part": "nvim-visual",
    "id": "visual-pro-tips",
    "badge": "tip",
    "title": "Visual Mode: Pro Tips & Chords",
    "subtitle": "Visual-block multi-line column editing & reselection",
    "commands": [
      {
        "id": "visual-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Visual-block multi-line column editing & reselection",
        "cmd": "<C-v>   I<text><Esc>   |   <C-v>$   A<text><Esc>   |   gv",
        "details": "Visual-block mode (<C-v>) allows typing text on 20+ lines at once. Select column, press uppercase I, type prefix, and hit Esc. For ragged lines, select column, hit $ to extend to line ends, press uppercase A, and hit Esc.",
        "flags": [
          [
            "<C-v> then I ... <Esc>",
            "Insert at beginning of all selected column lines simultaneously"
          ],
          [
            "<C-v>$ then A ... <Esc>",
            "Append to end of uneven ragged lines simultaneously"
          ],
          [
            "gv",
            "Reselect the exact previous visual selection area"
          ],
          [
            "o",
            "Swap cursor to opposite diagonal corner of visual block"
          ],
          [
            "< / >",
            "Indent selection left / right (re-select with gv to repeat)"
          ]
        ],
        "tip": "The text shows up on the other lines only after you press Esc",
        "tags": [
          "visual",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/visual/",
              "title": "Neovim help: visual"
            }
          ]
        }
      }
    ]
  },
  {
    part: "nvim-search",
    id: "search",
    badge: "srch",
    title: "Search, Substitute & Global (:g)",
    subtitle: "Regex patterns, word under cursor, project-wide replace & :global power",
    commands: [
      {
        id: "search-word-under-cursor",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Search exact word under cursor forward/backward and operate with cgn",
        cmd: "*   #   n   N   cgn{new}<Esc>.",
        flags: [
          ["* / #", "Search word under cursor forward / backward"],
          ["cgn", "Change next search match (press . to repeat on select matches!)"],
          [":noh or <C-l>", "Clear search highlighting (Ctrl+L does it by default in Neovim; LazyVim also maps <Esc>)"]
        ],
        tip: "* + cgn + . beats :%s",
        tags: ["search", "word", "cgn", "highlight", "repeat"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/pattern/","title":"Neovim help: pattern"},{"url":"https://neovim.io/doc/user/various/","title":"Neovim help: various (:!, gc, CTRL-L)"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}],"note":"Corrected 2026-11-10: <Esc> clearing the highlight is LazyVim; plain Neovim uses Ctrl+L."}
      },
      {
        id: "substitute-buffer-confirm",
        mode: "EX / CMD",
        modeClass: "mode-c",
        desc: "Search and replace across entire buffer with interactive confirmation",
        cmd: ":%s/old_name/new_name/gc",
        flags: [
          ["%", "Entire file range (1,$)"],
          ["g", "All occurrences on each line"],
          ["c", "Confirm each replacement (y/n/a/q/l)"]
        ],
        tags: ["replace", "substitute", "all", "confirm", "find"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"}]}
      },
      {
        id: "substitute-last-search",
        mode: "EX / CMD",
        modeClass: "mode-c",
        desc: "Reuse last search pattern (e.g. from *) in substitution by leaving pattern empty",
        cmd: ":%s//replacement/g",
        flags: [
          ["//", "Empty pattern reuses last / or * search register"],
          [":'<,'>s//new/g", "Replace only inside visual selection"]
        ],
        tip: "Preview w/ / first",
        tags: ["reuse", "last", "search", "replace", "visual"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"},{"url":"https://neovim.io/doc/user/pattern/","title":"Neovim help: pattern"}]}
      },
      {
        id: "substitute-very-magic-groups",
        mode: "EX / CMD",
        modeClass: "mode-c",
        desc: "Capture regex groups using very-magic mode (\\v) without backslash soup",
        cmd: ":%s/\\v(\\w+):\\s*(\\w+)/\\2 = \\1/g",
        flags: [
          ["\\v", "Very magic: (), +, |, {} work without escaping"],
          ["\\1, \\2", "Backreferences to capture groups 1 and 2"],
          ["# delimiter", "Use :%s#/old/path#/new/path#g for file paths"]
        ],
        tags: ["regex", "capture", "groups", "magic", "paths"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/pattern/","title":"Neovim help: pattern"},{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"}]}
      },
      {
        id: "global-delete-matching",
        mode: "EX / CMD",
        modeClass: "mode-c",
        desc: "Delete all lines matching (or NOT matching) a pattern across buffer",
        cmd: ":g/DEBUG/d   |   :v/ERROR/d   |   :g/^\\s*$/d",
        flags: [
          [":g/pat/d", "Delete every line matching pat"],
          [":v/pat/d or :g!/pat/d", "Delete every line NOT matching pat (keep only matches)"],
          [":g/^\\s*$/d", "Remove all blank/whitespace-only lines"]
        ],
        tags: ["global", "filter", "delete", "lines", "blank", "invert"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/repeat/","title":"Neovim help: repeat (macros, :g)"}]}
      },
      {
        id: "global-norm-macro",
        mode: "EX / CMD",
        modeClass: "mode-c",
        desc: "Execute any Normal mode sequence or macro on every matching line",
        cmd: ":g/TODO/norm A [urgent]   |   :g/fn /y A",
        flags: [
          ["norm A ...", "Run Normal mode command (append text) on each match"],
          [":g/pat/y A", "Yank all matching lines into register a (uppercase A appends)"]
        ],
        tip: "Batch line surgery",
        tags: ["global", "normal", "batch", "collect", "yank"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/repeat/","title":"Neovim help: repeat (macros, :g)"},{"url":"https://neovim.io/doc/user/various/","title":"Neovim help: various (:!, gc, CTRL-L)"}]}
      }
    ]
  },
  {
    "part": "nvim-search",
    "id": "search-pro-tips",
    "badge": "tip",
    "title": "Search: Pro Tips & Chords",
    "subtitle": "Interactive buffer search, global confirmation & very-magic regex",
    "commands": [
      {
        "id": "search-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Interactive buffer search, global confirmation & very-magic regex",
        "cmd": ":%s/old/new/gc   |   /\\v<pattern>   |   :g/error/d   |   :v/keep/d",
        "details": "Run global substitution with the c flag to confirm each replacement (y/n/a/q). Use \\v (very magic) to eliminate backslash escaping for parentheses and plus operators. Use :g to execute Ex commands on matching lines.",
        "flags": [
          [
            ":%s/find/replace/gc",
            "Search & replace buffer-wide with confirmation prompt"
          ],
          [
            "c flag",
            "Interactive confirmation: y=yes, n=no, a=all, q=quit"
          ],
          [
            "\\v",
            "Very-magic mode: enables regex without escaping ()+?|"
          ],
          [
            ":g/pat/d",
            "Delete all lines containing pattern"
          ],
          [
            ":v/pat/d",
            "Invert match: delete all lines NOT containing pattern"
          ]
        ],
        "tip": "Hit * on any word to search forward immediately, then cgn to edit the next match!",
        "tags": [
          "search",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            },
            {
              "url": "https://neovim.io/doc/user/pattern/",
              "title": "Neovim help: pattern"
            },
            {
              "url": "https://neovim.io/doc/user/repeat/",
              "title": "Neovim help: repeat (macros, :g)"
            }
          ]
        }
      }
    ]
  },
  {
    part: "nvim-windows",
    id: "windows",
    badge: "win",
    title: "Windows, Splits, Buffers & Tabs",
    subtitle: "Viewport tiling, buffer switching, window resizing & tab pages",
    commands: [
      {
        id: "split-create-close",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Create vertical or horizontal window splits and close active/other splits",
        cmd: "<C-w>v   <C-w>s   <C-w>q   <C-w>o",
        flags: [
          ["<C-w>v or :vsp", "Split window vertically (side-by-side)"],
          ["<C-w>s or :sp", "Split window horizontally"],
          ["<C-w>q / <C-w>c", "Close active split window"],
          ["<C-w>o or :only", "Close all other splits except active one"]
        ],
        tags: ["split", "vertical", "horizontal", "window", "only", "close"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/windows/","title":"Neovim help: windows and buffers"}]}
      },
      {
        id: "split-nav-move",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Move focus between splits or rearrange window layout",
        cmd: "<C-w>h/j/k/l   |   <C-w>H/J/K/L   |   <C-w>T",
        flags: [
          ["<C-w>h/j/k/l", "Focus left / down / up / right window (<C-h/j/k/l> in LazyVim)"],
          ["<C-w>H/J/K/L", "Move current split window to far left/bottom/top/right"],
          ["<C-w>T", "Break current split out into its own Tab page"],
          ["<C-w>r / <C-w>x", "Rotate windows / exchange with neighbor"]
        ],
        tip: "LazyVim maps Ctrl+h/j/k/l",
        tags: ["navigate", "focus", "rearrange", "break", "tab"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/windows/","title":"Neovim help: windows and buffers"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      },
      {
        id: "split-resize",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Equalize, maximize, or adjust split window dimensions",
        cmd: "<C-w>=   <C-w>|   <C-w>_   10<C-w>>",
        flags: [
          ["<C-w>=", "Make all splits equal width & height"],
          ["<C-w>| / <C-w>_", "Maximize current window width / height"],
          ["10<C-w>> / <", "Increase / decrease width by 10 columns"]
        ],
        tags: ["resize", "equalize", "maximize", "width", "height"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/windows/","title":"Neovim help: windows and buffers"}]}
      },
      {
        id: "buffer-management",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Switch between open buffers, jump to alternate file, or delete buffer",
        cmd: "]b   [b   <C-^>   :bd   <leader>bd",
        flags: [
          ["]b / [b", "Next / previous buffer (Shift+l / Shift+h in LazyVim)"],
          ["<C-^> or <C-6>", "Toggle between current and alternate (#) buffer"],
          [":bd / :bd!", "Delete (close) current buffer"],
          ["<leader>bo", "Delete all other buffers (LazyVim)"]
        ],
        tags: ["buffer", "switch", "alternate", "close", "next", "prev"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/windows/","title":"Neovim help: windows and buffers"},{"url":"https://neovim.io/doc/user/vim_diff/","title":"Neovim help: default mappings"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      },
      {
        id: "tabpages",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Manage workspace tab pages (each tab holds its own window layout)",
        cmd: ":tabnew   gt   gT   :tabclose   :tabonly",
        flags: [
          ["gt / gT", "Next / previous tab page (2gt jumps to tab 2)"],
          [":tabclose / :tabo", "Close current tab / close all other tabs"]
        ],
        tags: ["tabs", "workspace", "layout"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/tabpage/","title":"Neovim help: tab pages"}]}
      }
    ]
  },
  {
    "part": "nvim-windows",
    "id": "windows-pro-tips",
    "badge": "tip",
    "title": "Windows: Pro Tips & Chords",
    "subtitle": "Split window layout navigation, resizing & tab page control",
    "commands": [
      {
        "id": "windows-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Split window layout navigation, resizing & tab page control",
        "cmd": "<C-w>v   <C-w>s   |   <C-w>h/j/k/l   |   <C-w>=   |   <C-w>T",
        "details": "Easily manage multi-file views. Split vertically with <C-w>v or horizontally with <C-w>s. Equalize all split sizes with <C-w>=. Break any active split out into its own dedicated tab page with <C-w>T.",
        "flags": [
          [
            "<C-w>v / <C-w>s",
            "Create vertical / horizontal window split"
          ],
          [
            "<C-w>h/j/k/l",
            "Move cursor focus left / down / up / right"
          ],
          [
            "<C-w>=",
            "Equalize height and width across all window splits"
          ],
          [
            "<C-w>T",
            "Move current split into its own full-screen Tab Page"
          ],
          [
            "<C-^> or <C-6>",
            "Instantly toggle between current and alternate file"
          ]
        ],
        "tip": "In LazyVim, use Shift+H and Shift+L to switch between open buffer tabs rapidly!",
        "tags": [
          "windows",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/windows/",
              "title": "Neovim help: windows and buffers"
            },
            {
              "url": "https://neovim.io/doc/user/tabpage/",
              "title": "Neovim help: tab pages"
            },
            {
              "url": "https://www.lazyvim.org/keymaps",
              "title": "LazyVim keymaps"
            }
          ]
        }
      }
    ]
  },
  {
    part: "nvim-macros",
    id: "macros",
    badge: "mac",
    title: "Macros, Registers & Undo Tree",
    subtitle: "Record & replay keystrokes, system clipboard, black-hole & time travel",
    commands: [
      {
        id: "macro-record-replay",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Record keystrokes into register 'a' and replay once or N times",
        cmd: "qa ... q   |   @a   @@   10@a",
        flags: [
          ["qa ... q", "Start recording into register 'a', press q to stop"],
          ["@a / @@", "Execute macro 'a' / repeat last executed macro"],
          ["qA ... q", "Append additional keystrokes to existing macro 'a'"]
        ],
        tip: "Start macro with 0 or ^",
        tags: ["macro", "record", "replay", "automation"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/repeat/","title":"Neovim help: repeat (macros, :g)"}]}
      },
      {
        id: "macro-parallel-visual",
        mode: "VISUAL",
        modeClass: "mode-v",
        desc: "Run recorded macro across all visually selected lines",
        cmd: ":'<,'>norm @a",
        flags: [
          ["norm @a", "Executes @a independently on each selected line (won't stop on single-line miss)"]
        ],
        tags: ["macro", "visual", "batch", "lines"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/various/","title":"Neovim help: various (:!, gc, CTRL-L)"}]}
      },
      {
        id: "clipboard-and-blackhole",
        mode: "N / V",
        modeClass: "mode-n",
        desc: "Copy/paste with system clipboard or replace text without losing yanked register",
        cmd: '"+y   "+p   |   "0p   |   "_dd   "_dP',
        flags: [
          ['"+y / "+p', "Yank to / paste from system OS clipboard"],
          ['"0p', "Paste most recent yank (even if you deleted text afterwards!)"],
          ['"_dd / "_dP', "Delete into black-hole register (preserves unnamed yank)"]
        ],
        tip: '"0p saves tons of re-yanking',
        tags: ["clipboard", "copy", "paste", "blackhole", "register", "yank"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"}]}
      },
      {
        id: "insert-cmd-paste-expr",
        mode: "INSERT / CMD",
        modeClass: "mode-i",
        desc: "Paste any register or evaluate math/Lua expressions inline while typing",
        cmd: '<C-r>"   <C-r>+   <C-r><C-w>   <C-r>=64*1024<CR>',
        flags: [
          ['<C-r>" / <C-r>+', "Insert unnamed / system clipboard register"],
          ["<C-r><C-w>", "Insert word currently under cursor into Cmd/Search prompt"],
          ["<C-r>=...", "Expression register: evaluate math or Vimscript inline"]
        ],
        tags: ["insert", "paste", "calculator", "expression", "cword"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/insert/","title":"Neovim help: insert (CTRL-R)"}]}
      },
      {
        id: "undo-branches-time",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Undo, redo, or travel backward/forward through Neovim's persistent undo tree",
        cmd: "u   <C-r>   U   |   :earlier 10m   :later 5m",
        flags: [
          ["u / <C-r>", "Undo / Redo change"],
          [":earlier 10m", "Rewind buffer state to 10 minutes ago (also 5f = 5 file writes ago)"],
          ["g- / g+", "Step chronologically backward / forward through undo branches"]
        ],
        tags: ["undo", "redo", "history", "tree", "earlier", "time"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/undo/","title":"Neovim help: undo"}]}
      }
    ]
  },
  {
    "part": "nvim-macros",
    "id": "macros-pro-tips",
    "badge": "tip",
    "title": "Macros: Pro Tips & Chords",
    "subtitle": "Macro recording, parallel visual playback & expression register",
    "commands": [
      {
        "id": "macros-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Macro recording, parallel visual playback & expression register",
        "cmd": "qa ... q   |   @a   @@   |   :'<,'>norm @a   |   <C-r>=",
        "details": "Record repetitive keystrokes into any register with qa, then replay with @a. To run macros in parallel across multiple lines without aborting on line errors, select lines and run :norm @a.",
        "flags": [
          [
            "qa ... q",
            "Record keystrokes into register \"a\", stop with q"
          ],
          [
            "@a / @@",
            "Execute macro \"a\" / replay last executed macro"
          ],
          [
            "qA ... q",
            "Append additional keystrokes to register \"a\" without overwriting"
          ],
          [
            ":'<,'>norm @a",
            "Execute macro \"a\" independently across all visually selected lines"
          ],
          [
            "<C-r>= (in Insert)",
            "Evaluate a Vimscript expression inline (e.g. 1024*64); wrap Lua in luaeval()"
          ]
        ],
        "tip": "Use \"+y to yank into system clipboard, and \"0p to paste last yank after deleting!",
        "tags": [
          "macros",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/repeat/",
              "title": "Neovim help: repeat (macros, :g)"
            },
            {
              "url": "https://neovim.io/doc/user/insert/",
              "title": "Neovim help: insert (CTRL-R)"
            },
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            }
          ]
        }
      }
    ]
  },
  {
    part: "nvim-lsp",
    id: "lsp",
    badge: "lsp",
    title: "Built-in LSP, Diagnostics & Treesitter",
    subtitle: "Code navigation, symbol rename, code actions, hover docs & syntax nodes",
    commands: [
      {
        id: "lsp-goto-navigation",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Jump to symbol definition, references, implementation, or type definition",
        cmd: "gd   gr   gI   gy   gD   K",
        flags: [
          ["gd / gD", "Goto Definition / Declaration (LazyVim; in plain Neovim gd is the built-in local-declaration jump, and Ctrl+] reaches the LSP definition)"],
          ["gr (or grr)", "References: gr in LazyVim, grr is the Neovim 0.11+ default"],
          ["gI / gy", "Implementation / Type Definition in LazyVim (gri / grt by default in Neovim)"],
          ["K", "Show Hover documentation float (press K again to focus float)"]
        ],
        tip: "<C-o> jumps right back",
        tags: ["lsp", "definition", "references", "hover", "implementation", "type"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/lsp/","title":"Neovim help: LSP defaults"},{"url":"https://neovim.io/doc/user/news-0.11/","title":"Neovim 0.11 news"},{"url":"https://neovim.io/doc/user/news-0.12/","title":"Neovim 0.12 news"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}],"note":"Corrected 2026-11-10: gd, gr, gI and gy are LazyVim keys; Neovim's own are grr, gri and grt."}
      },
      {
        id: "lsp-actions-rename-format",
        mode: "N / V",
        modeClass: "mode-n",
        desc: "Trigger LSP code actions, workspace-wide symbol rename, and formatting",
        cmd: "<leader>ca   <leader>cr   <leader>cf   |   gra   grn",
        flags: [
          ["<leader>ca / gra", "Code Actions (quickfix, imports, refactors)"],
          ["<leader>cr / grn", "Rename symbol across all project files"],
          ["<leader>cf", "Format current buffer or visual selection"],
          ["<C-k> (Insert)", "Signature help in LazyVim (Ctrl+S is Neovim's 0.11+ default)"]
        ],
        tags: ["rename", "refactor", "code-action", "format", "signature"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/lsp/","title":"Neovim help: LSP defaults"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      },
      {
        id: "diagnostics-navigation",
        mode: "NORMAL",
        modeClass: "mode-n",
        desc: "Jump between compiler/LSP diagnostics, errors, and inspect floating details",
        cmd: "]d   [d   ]e   [e   <leader>cd   <leader>xx",
        flags: [
          ["]d / [d", "Next / previous diagnostic (any severity)"],
          ["]e / [e", "Next / previous Error (LazyVim)"],
          ["<leader>cd / <C-w>d", "Show line diagnostic details in floating window"],
          ["<leader>xx", "Toggle Trouble workspace diagnostics panel (LazyVim)"]
        ],
        tags: ["error", "warning", "diagnostic", "trouble", "lint"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/diagnostic/","title":"Neovim help: diagnostics"},{"url":"https://neovim.io/doc/user/vim_diff/","title":"Neovim help: default mappings"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      },
      {
        id: "treesitter-incremental-select",
        mode: "N / V",
        modeClass: "mode-v",
        desc: "Expand or shrink visual selection incrementally by AST syntax nodes",
        cmd: "<C-space>   <BS>   |   ]f   [f   ]c   [c",
        flags: [
          ["<C-space>", "Start / expand selection to the parent node (LazyVim, via flash.nvim; Neovim 0.12+ has an / in in Visual mode built in)"],
          ["<BS> (Backspace)", "Shrink selection to child AST node"],
          ["]f / [f", "Jump to next / prev function start (Treesitter textobjects)"],
          ["]c / [c", "Next / previous class start (in diff mode: the next / previous change); git hunks are ]h / [h"]
        ],
        tip: "AST-aware selection",
        tags: ["treesitter", "ast", "node", "expand", "function", "class"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://github.com/LazyVim/LazyVim/blob/v16.0.2/lua/lazyvim/plugins/editor.lua","title":"LazyVim source: editor.lua (gitsigns, flash)"},{"url":"https://github.com/LazyVim/LazyVim/blob/v16.0.2/lua/lazyvim/plugins/treesitter.lua","title":"LazyVim source: treesitter.lua"},{"url":"https://neovim.io/doc/user/treesitter/","title":"Neovim help: treesitter (an / in)"}],"note":"Corrected 2026-11-10: ]c is a class (a change in diff mode); git hunks are ]h."}
      }
    ]
  },
  {
    "part": "nvim-lsp",
    "id": "lsp-pro-tips",
    "badge": "tip",
    "title": "Built-in LSP: Pro Tips & Chords",
    "subtitle": "LSP navigation, inlay hints & code actions (LazyVim keys; Neovim 0.11+ defaults in brackets)",
    "commands": [
      {
        "id": "lsp-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "LSP navigation, inlay hints & code actions (LazyVim keys; Neovim 0.11+ defaults in brackets)",
        "cmd": "gd   gr   K   |   <leader>ca   <leader>cr   |   [d   ]d",
        "details": "Native Neovim LSP powers modern IDE capabilities. Jump to definitions with gd, show hover docs with K, trigger code actions with <leader>ca, and navigate compiler diagnostics with [d and ]d.",
        "flags": [
          [
            "gd / gD",
            "Goto Definition / Declaration (LazyVim; Ctrl+] in plain Neovim)"
          ],
          [
            "gr (grr)",
            "Find all references across the project"
          ],
          [
            "K",
            "Show hover documentation float (press K again to focus float)"
          ],
          [
            "<leader>ca (gra)",
            "Code actions (quickfix, imports, refactor)"
          ],
          [
            "<leader>cr (grn)",
            "Rename symbol workspace-wide"
          ],
          [
            "[d / ]d",
            "Jump to previous / next diagnostic error or warning"
          ]
        ],
        "tip": "Since Neovim 0.10, turn on inlay hints with: vim.lsp.inlay_hint.enable()",
        "tags": [
          "lsp",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/lsp/",
              "title": "Neovim help: LSP defaults"
            },
            {
              "url": "https://neovim.io/doc/user/news-0.11/",
              "title": "Neovim 0.11 news"
            },
            {
              "url": "https://www.lazyvim.org/keymaps",
              "title": "LazyVim keymaps"
            }
          ],
          "note": "Corrected 2026-11-10: gd and <leader>ca / <leader>cr are LazyVim keys; plain Neovim has Ctrl+], gra and grn."
        }
      }
    ]
  },
  {
    part: "nvim-lazyvim",
    id: "lazyvim",
    badge: "lazy",
    title: "LazyVim, Picker, Neo-tree & Git",
    subtitle: "Fuzzy file/grep pickers, Neo-tree sidebar, LazyGit & UI toggles (<leader> = Space)",
    commands: [
      {
        id: "lazyvim-file-grep-pickers",
        mode: "LAZYVIM",
        modeClass: "mode-v",
        desc: "Fuzzy find files, live ripgrep across project, recent files & open buffers",
        cmd: "<leader><space>   <leader>/   <leader>,   <leader>fr",
        flags: [
          ["<leader><space>", "Find Files in project root (ff)"],
          ["<leader>/", "Live Grep text across project (sg)"],
          ["<leader>,", "Switch open Buffers with fuzzy preview (fb)"],
          ["<leader>fr", "Find Recent files"]
        ],
        tip: "<leader> is Space",
        tags: ["telescope", "fzf", "snacks", "find", "grep", "files", "search"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      },
      {
        id: "lazyvim-neotree-explorer",
        mode: "LAZYVIM",
        modeClass: "mode-v",
        desc: "File explorer: LazyVim's default is the Snacks explorer; Neo-tree is an optional extra (:LazyExtras → editor.neo-tree)",
        cmd: "<leader>e   <leader>E   |   a   d   r   y   c   m   ?",
        flags: [
          ["<leader>e / <leader>E", "Toggle the explorer (root dir / current working dir): Snacks by default, Neo-tree with the extra"],
          ["a / d / r", "Add file or dir (end w/ /) / Delete / Rename inside Neo-tree"],
          ["y / x / p", "Copy / cut to Neo-tree's clipboard, then paste (c / m copy or move to a path you type; Y copies the path in LazyVim)"],
          ["H / ?", "Toggle hidden dotfiles / Show all Neo-tree mappings"]
        ],
        tags: ["neotree", "explorer", "sidebar", "tree", "create", "rename"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"},{"url":"https://www.lazyvim.org/extras/editor/neo-tree","title":"LazyVim extra: Neo-tree"},{"url":"https://github.com/nvim-neo-tree/neo-tree.nvim/blob/main/lua/neo-tree/defaults.lua","title":"Neo-tree default mappings"}],"note":"Corrected 2026-11-10: LazyVim's default explorer is Snacks; Neo-tree's y copies to its own clipboard, not the name."}
      },
      {
        id: "lazyvim-git-hunks-lazygit",
        mode: "LAZYVIM",
        modeClass: "mode-v",
        desc: "Open LazyGit TUI, navigate git diff hunks, stage/reset hunks, and blame",
        cmd: "<leader>gg   ]h   [h   <leader>ghs   <leader>ghr   <leader>ghb",
        flags: [
          ["<leader>gg", "Open full-screen LazyGit floating terminal"],
          ["]h / [h", "Jump to next / previous Git diff hunk"],
          ["<leader>ghs / ghr", "Stage hunk / Reset hunk under cursor"],
          ["<leader>ghb / ghp", "Blame line / Preview hunk diff inline"]
        ],
        tags: ["git", "lazygit", "hunk", "stage", "blame", "diff"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://github.com/LazyVim/LazyVim/blob/v16.0.2/lua/lazyvim/config/keymaps.lua","title":"LazyVim source: keymaps.lua"},{"url":"https://github.com/LazyVim/LazyVim/blob/v16.0.2/lua/lazyvim/plugins/editor.lua","title":"LazyVim source: editor.lua (gitsigns, flash)"}]}
      },
      {
        id: "lazyvim-search-symbols-replace",
        mode: "LAZYVIM",
        modeClass: "mode-v",
        desc: "Search LSP document/workspace symbols, keymaps, help tags, or project replace",
        cmd: "<leader>ss   <leader>sS   <leader>sr   <leader>sk   <leader>sh",
        flags: [
          ["<leader>ss / <leader>sS", "Goto Symbol in current file / across workspace"],
          ["<leader>sr", "Search & Replace across project (Grug-far / Spectre)"],
          ["<leader>sk / <leader>sh", "Search all configured Keymaps / Neovim Help pages"]
        ],
        tags: ["symbols", "functions", "outline", "keymaps", "help", "grug-far"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      },
      {
        id: "lazyvim-ui-toggles-managers",
        mode: "LAZYVIM",
        modeClass: "mode-v",
        desc: "Toggle UI features (wrap, relative numbers, format-on-save, zen) & plugin managers",
        cmd: "<leader>uw   <leader>ul   <leader>uf   <leader>uC   :Lazy   :Mason",
        flags: [
          ["<leader>uw / <leader>ul", "Toggle word wrap / Toggle line numbers"],
          ["<leader>uf / <leader>ud", "Toggle auto-format on save / Toggle diagnostics"],
          ["<leader>uC", "Preview & switch Colorschemes"],
          [":Lazy / :Mason", "Open Lazy plugin manager / Mason LSP & formatter installer"]
        ],
        tags: ["toggle", "wrap", "format", "colorscheme", "lazy", "mason", "plugins"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      }
    ]
  },
  {
    "part": "nvim-lazyvim",
    "id": "lazyvim-pro-tips",
    "badge": "tip",
    "title": "LazyVim: Pro Tips & Chords",
    "subtitle": "LazyVim fast fuzzy finding, Neo-tree, LazyGit & keymap discovery",
    "commands": [
      {
        "id": "lazyvim-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "LazyVim fast fuzzy finding, Neo-tree, LazyGit & keymap discovery",
        "cmd": "<leader><space>   <leader>sg   <leader>e   <leader>gg",
        "details": "LazyVim is the modern, modular Neovim distribution. Use <leader><space> to find files, <leader>sg for live ripgrep, <leader>e to toggle Neo-tree, and <leader>gg to open full-screen LazyGit.",
        "flags": [
          [
            "<leader><space>",
            "Find files in project (Snacks picker by default; Telescope or fzf-lua as extras)"
          ],
          [
            "<leader>sg",
            "Live ripgrep text across all project files"
          ],
          [
            "<leader>e",
            "Toggle the file explorer (Snacks by default, Neo-tree as an extra)"
          ],
          [
            "<leader>gg",
            "Launch LazyGit terminal UI for staging, commit & rebase"
          ],
          [
            "<leader>sk",
            "Search and inspect all configured keymaps with which-key"
          ]
        ],
        "tip": "Space is the default <leader> key in LazyVim!",
        "tags": [
          "lazyvim",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.lazyvim.org/keymaps",
              "title": "LazyVim keymaps"
            },
            {
              "url": "https://github.com/LazyVim/LazyVim/releases",
              "title": "LazyVim releases"
            }
          ]
        }
      }
    ]
  },
  {
    part: "nvim-ex-shell",
    id: "ex-shell",
    badge: "ex",
    title: "Ex Commands, Shell Filter & Quickfix",
    subtitle: "Save/quit shortcuts, piping lines through Unix tools, built-in terminal & quickfix",
    commands: [
      {
        id: "save-quit-shortcuts",
        mode: "N / EX",
        modeClass: "mode-c",
        desc: "Save, quit, force quit all buffers, or reload file from disk",
        cmd: ":w   ZZ   ZQ   :wa   :qa!   :e!",
        flags: [
          ["ZZ / :x", "Save (if modified) and close window"],
          ["ZQ / :q!", "Quit immediately without saving changes"],
          [":wa / :qa!", "Write all modified buffers / Force quit all buffers"],
          [":e!", "Discard unsaved buffer edits and reload from disk"]
        ],
        tags: ["save", "write", "quit", "exit", "reload", "discard"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/editing/","title":"Neovim help: editing (:w, :e!)"}]}
      },
      {
        id: "filter-through-shell",
        mode: "EX / CMD",
        modeClass: "mode-c",
        desc: "Pipe buffer lines through external Unix commands (jq, sort, column, sh) in-place",
        cmd: ":%!jq .   |   :'<,'>!column -t   |   :r !date -Iseconds",
        flags: [
          [":%!jq .", "Format entire buffer through jq JSON pretty-printer"],
          [":'<,'>!column -t", "Align visually selected lines into clean table columns"],
          [":r !{cmd}", "Insert stdout of shell {cmd} below current cursor line"]
        ],
        tip: "Unix + Vim synergy",
        tags: ["shell", "pipe", "jq", "json", "column", "filter", "external"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/change/","title":"Neovim help: change"},{"url":"https://neovim.io/doc/user/various/","title":"Neovim help: various (:!, gc, CTRL-L)"}]}
      },
      {
        id: "quickfix-cdo-batch",
        mode: "EX / CMD",
        modeClass: "mode-c",
        desc: "Navigate Quickfix list and run substitutions across all quickfix files",
        cmd: "]q   [q   :copen   :cfdo %s/old/new/g | update",
        flags: [
          ["]q / [q", "Next / previous Quickfix item (<leader>xq toggles list)"],
          [":cfdo ... | update", "Run command once per file in Quickfix list and save each"]
        ],
        tags: ["quickfix", "cdo", "cfdo", "project", "batch", "multifile"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/quickfix/","title":"Neovim help: quickfix"},{"url":"https://neovim.io/doc/user/vim_diff/","title":"Neovim help: default mappings"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      },
      {
        id: "builtin-terminal-and-health",
        mode: "TERM / EX",
        modeClass: "mode-t",
        desc: "Toggle floating terminal, exit terminal insert mode, or diagnose Neovim setup",
        cmd: "<C-/>   <C-\\><C-n>   :term   :checkhealth",
        flags: [
          ["<C-/>", "Toggle floating/bottom terminal in LazyVim"],
          ["<C-\\><C-n>", "Leave Terminal insert mode so you can scroll/yank with Normal motions"],
          [":checkhealth", "Verify Neovim, clipboard, treesitter, and LSP health"]
        ],
        tags: ["terminal", "shell", "escape", "checkhealth", "diagnose"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://neovim.io/doc/user/terminal/","title":"Neovim help: terminal"},{"url":"https://neovim.io/doc/user/health/","title":"Neovim help: health"},{"url":"https://www.lazyvim.org/keymaps","title":"LazyVim keymaps"}]}
      }
    ]
  },
  {
    "part": "nvim-ex-shell",
    "id": "ex-shell-pro-tips",
    "badge": "tip",
    "title": "Ex Commands: Pro Tips & Chords",
    "subtitle": "Ex command pipelines, external Unix filters & terminal integration",
    "commands": [
      {
        "id": "ex-shell-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Ex command pipelines, external Unix filters & terminal integration",
        "cmd": ":%!jq .   |   :%!sort -u   |   :r !date   |   <C-/>",
        "details": "Pipe buffer content directly through external shell tools in-place. Run :%!jq . to format JSON or :%!sort -u to deduplicate lines. Use <C-/> in LazyVim for instant floating terminal access.",
        "flags": [
          [
            ":%!jq .",
            "Pipe entire buffer through jq for JSON formatting and syntax validation"
          ],
          [
            ":%!sort -u",
            "Deduplicate and sort all buffer lines in-place"
          ],
          [
            ":r !date",
            "Insert a shell command's output below the cursor. (:w !sudo tee % does not work in Neovim: :! has no terminal for the password prompt; quit and reopen the file with sudoedit)"
          ],
          [
            "<C-/>",
            "Toggle floating terminal window in LazyVim"
          ],
          [
            "<C-\\><C-n>",
            "Exit terminal insert mode to scroll and yank terminal text"
          ]
        ],
        "tip": "Use :checkhealth to diagnose Neovim, clipboard, treesitter, and LSP providers!",
        "tags": [
          "ex-shell",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            },
            {
              "url": "https://neovim.io/doc/user/various/",
              "title": "Neovim help: various (:!, gc, CTRL-L)"
            },
            {
              "url": "https://neovim.io/doc/user/terminal/",
              "title": "Neovim help: terminal"
            },
            {
              "url": "https://neovim.io/doc/user/health/",
              "title": "Neovim help: health"
            }
          ],
          "note": "Corrected 2026-11-10: :w !sudo tee % does not work in Neovim (:! runs without a terminal)."
        }
      }
    ]
  }
];

// Application State (shares theme & compact preference with Linux sheet)
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("neovim.html", "nvim_cs_bookmarks", NEOVIM_CHEAT_SHEET_DATA, {"nvim-motions":"nvim_motions_bookmarks","nvim-operators":"nvim_operators_bookmarks","nvim-visual":"nvim_visual_bookmarks","nvim-search":"nvim_search_bookmarks","nvim-macros":"nvim_macros_bookmarks","nvim-windows":"nvim_windows_bookmarks","nvim-lsp":"nvim_lsp_bookmarks","nvim-lazyvim":"nvim_lazyvim_bookmarks","nvim-ex-shell":"nvim_ex-shell_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nvim_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(NEOVIM_CHEAT_SHEET_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: NEOVIM_CHEAT_SHEET_DATA, label: "Neovim sheets", parts: {
   "nvim-ex-shell": {
    "title": "Ex Commands, Shell Filter & Quickfix",
    "subtitle": "Save/quit shortcuts, piping lines through Unix tools, built-in terminal & quickfix",
    "pill": "EX / Neovim 0.11+"
   },
   "nvim-lazyvim": {
    "title": "LazyVim, Picker, Neo-tree & Git",
    "subtitle": "Fuzzy file/grep pickers, Neo-tree sidebar, LazyGit & UI toggles (<leader> = Space)",
    "pill": "LAZY / Neovim 0.11+"
   },
   "nvim-lsp": {
    "title": "Built-in LSP, Diagnostics & Treesitter",
    "subtitle": "Code navigation, symbol rename, code actions, hover docs & syntax nodes",
    "pill": "LSP / Neovim 0.11+"
   },
   "nvim-macros": {
    "title": "Macros, Registers & Undo Tree",
    "subtitle": "Record & replay keystrokes, system clipboard, black-hole & time travel",
    "pill": "MAC / Neovim 0.11+"
   },
   "nvim-motions": {
    "title": "Motions, Jumps & Screen Navigation",
    "subtitle": "Word movement, character find, line boundaries, viewport & jump list",
    "pill": "MOV / Neovim 0.11+"
   },
   "nvim-operators": {
    "title": "Operators, Text Objects & Editing",
    "subtitle": "Composable operator grammar, inner/around objects, dot repeat & case",
    "pill": "EDIT / Neovim 0.11+"
   },
   "nvim-search": {
    "title": "Search, Substitute & Global (:g)",
    "subtitle": "Regex patterns, word under cursor, project-wide replace & :global power",
    "pill": "SRCH / Neovim 0.11+"
   },
   "nvim-visual": {
    "title": "Visual Mode & Multi-Line Block Editing",
    "subtitle": "Char/Line/Block selection, column editing, sequence numbering & sorting",
    "pill": "VIS / Neovim 0.11+"
   },
   "nvim-windows": {
    "title": "Windows, Splits, Buffers & Tabs",
    "subtitle": "Viewport tiling, buffer switching, window resizing & tab pages",
    "pill": "WIN / Neovim 0.11+"
   }
  } };


// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const emptyStateEl = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

let toastTimer = null;

function showToast(msg) {
  // One toast for the whole site: common.js keeps a placeholder warning from being replaced.
  if (window.showGlobalToast) return window.showGlobalToast(msg);
  toastTextEl.textContent = msg;
  toastEl.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
  }, 1800);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text.length > 42 ? text.slice(0, 42) + "…" : text}`);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied to clipboard");
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Syntax Highlighting for Neovim Keychords & Ex Commands
function highlightVimCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(&lt;[A-Za-z0-9\-\\]+&gt;)|(\s\|\s)|(:[a-zA-Z!]+|:%s|:'&lt;,'&gt;[a-zA-Z!]*)|(\{[a-zA-Z]+\})/g,
    (match, chord, sep, exCmd, placeholder) => {
      if (chord) {
        return `<span class="tok-flag">${chord}</span>`;
      }
      if (sep) {
        return `<span class="tok-comment">${sep}</span>`;
      }
      if (exCmd) {
        return `<span class="tok-cmd">${exCmd}</span>`;
      }
      if (placeholder) {
        return `<span class="tok-str">${placeholder}</span>`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = NEOVIM_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of NEOVIM_CHEAT_SHEET_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by section">
        ${optionsHtml.join("")}
      </select>
      ${resetBtnHtml}
    </div>
  `;
}

function matchesSearch(cmdObj, section, query) {
  if (!query) return true;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    cmdObj.desc,
    cmdObj.cmd,
    cmdObj.mode || "",
    section.title,
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat()
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
window.addEventListener("resize", () => packMasonry());
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of NEOVIM_CHEAT_SHEET_DATA) {
    if (((state.activeCategory !== "all" && state.activeCategory !== section.id) || (state.part && (section.part || section.id) !== state.part))) {
      continue;
    }

    const filteredCommands = section.commands.filter((cmdObj) => {
      if (state.savedOnly && !state.bookmarks.has(cmdObj.id)) {
        return false;
      }
      return matchesSearch(cmdObj, section, state.searchQuery);
    });

    if (filteredCommands.length === 0) {
      continue;
    }

    visibleCommandsCount += filteredCommands.length;

    const itemsHtml = filteredCommands
      .map((item) => {
        const isSaved = state.bookmarks.has(item.id);
        const modeHtml = item.mode
          ? `<span class="mode-pill ${item.modeClass || "mode-n"}">${escapeHtml(item.mode)}</span>`
          : "";
        const tipHtml = item.tip
          ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>`
          : "";

        const flagsHtml =
          item.flags && item.flags.length
            ? `<div class="flag-pills">
                ${item.flags
                  .map(
                    ([flag, explanation]) =>
                      `<span class="flag-pill"><code>${escapeHtml(flag)}</code> <span>${escapeHtml(explanation)}</span></span>`
                  )
                  .join("")}
              </div>`
            : "";

        // First snippet before "|" when copying, or full command if no pipe separator
        const copyTarget = item.cmd.includes("   |   ")
          ? item.cmd.split("   |   ")[0].trim()
          : item.cmd.trim();

        return `
          <div class="cmd-item" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                ${modeHtml}
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn ${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="${item.id}"
                  title="${isSaved ? "Remove bookmark" : "Bookmark keymap"}"
                  aria-label="Bookmark keymap"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(copyTarget)}" title="Click to copy">
              <code class="cmd-code">${highlightVimCmd(item.cmd)}</code>
              <span class="copy-hint">Copy</span>
            </div>

            ${flagsHtml}
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
  visibleCountEl.textContent = String(visibleCommandsCount);
  savedCountEl.textContent = String(state.bookmarks.size);
  savedFilterBtn.classList.toggle("active", state.savedOnly);

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }
}

// Interactive Vim Operator + Text-Object Composer
function initVimComposer() {
  const opEl = document.getElementById("comp-op");
  const countEl = document.getElementById("comp-count");
  const scopeEl = document.getElementById("comp-scope");
  const targetEl = document.getElementById("comp-target");
  const displayEl = document.getElementById("vim-chord-display");
  const meaningEl = document.getElementById("vim-meaning-text");
  const copyBtn = document.getElementById("vim-chord-copy");
  const presetBtns = document.querySelectorAll(".vim-preset");

  const OP_TEXT = {
    c: "Delete and enter Insert mode on",
    d: "Delete",
    y: "Yank (copy)",
    v: "Visually select",
    ">": "Indent right",
    "<": "Indent left",
    gU: "Convert to UPPERCASE",
    gu: "Convert to lowercase",
    gc: "Toggle code comments on",
    "=": "Auto-format / re-indent"
  };

  const SCOPE_TEXT = {
    i: "inside (excluding delimiters)",
    a: "around (including delimiters / whitespace)",
    "": "to motion"
  };

  const TARGET_TEXT = {
    '"': "double quotes \"...\"",
    "'": "single quotes '...'",
    "`": "backticks `...`",
    w: "word(s)",
    W: "whitespace-delimited WORD(s)",
    ")": "parentheses (...)",
    "}": "curly braces {...}",
    "]": "square brackets [...]",
    t: "HTML/XML <tag>...</tag>",
    p: "paragraph(s)",
    $: "end of line",
    G: "end of file"
  };

  function updateComposer() {
    const op = opEl.value;
    const count = countEl.value;
    let scope = scopeEl.value;
    const target = targetEl.value;

    // Direct motions like $ or G don't take i/a text-object scopes
    if (target === "$" || target === "G") {
      scope = "";
      scopeEl.value = "";
    }

    const chord = `${op}${count}${scope}${target}`;
    displayEl.textContent = chord;

    const countPhrase = count ? `${count} ` : "";
    const scopePhrase = scope ? `${SCOPE_TEXT[scope]} ` : "";
    const explanation = `${OP_TEXT[op]} ${countPhrase}${scopePhrase}${TARGET_TEXT[target]}`;
    meaningEl.innerHTML = `<strong>${escapeHtml(chord)}</strong> — ${escapeHtml(explanation)}`;

    presetBtns.forEach((btn) => {
      const matches =
        btn.dataset.op === op &&
        btn.dataset.count === count &&
        btn.dataset.scope === scope &&
        btn.dataset.target === target;
      btn.classList.toggle("active", matches);
    });
  }

  [opEl, countEl, scopeEl, targetEl].forEach((sel) => {
    sel.addEventListener("change", updateComposer);
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      opEl.value = btn.dataset.op;
      countEl.value = btn.dataset.count;
      scopeEl.value = btn.dataset.scope;
      targetEl.value = btn.dataset.target;
      updateComposer();
    });
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(displayEl.textContent);
  });

  updateComposer();
}

// Mini Tabs inside Essentials Widget
function initMiniTabs() {
  const tabs = document.querySelectorAll(".mini-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".mini-tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });
}

// Theme & Density
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

  categoryTabsEl.addEventListener("change", (e) => {
    const sel = e.target.closest(".cat-select");
    if (!sel) return;
    state.activeCategory = sel.value;
    renderCategoryTabs();
    renderSections();
  });

  categoryTabsEl.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-cat]");
    if (!tab) return;
    state.activeCategory = tab.dataset.cat;
    renderCategoryTabs();
    renderSections();
  });

  sectionsContainer.addEventListener("click", (e) => {
    const copyBox = e.target.closest(".cmd-code-box");
    if (copyBox) {
      copyToClipboard(copyBox.dataset.copy);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const id = bookmarkBtn.dataset.bookmarkId;
      if (state.bookmarks.has(id)) {
        state.bookmarks.delete(id);
        showToast("Removed from saved keymaps");
      } else {
        state.bookmarks.add(id);
        showToast("Saved keymap to bookmarks");
      }
      localStorage.setItem("nvim_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      renderSections();
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
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
    renderCategoryTabs();
    renderSections();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.key === "/") && document.activeElement !== searchInput) {
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
initVimComposer();
initMiniTabs();
initEvents();

// Picking another part (rail, pager, nav menu, Back) redraws in place: common.js calls this
// with the new part instead of reloading the page. The search box and Section filter reset,
// as a fresh load would; "Saved only" stays as the tech left it.
if (typeof window !== "undefined" && window.SHEET_FILTER) {
  window.SHEET_FILTER.setPart = (part) => {
    state.part = part;
    state.activeCategory = "all";
    state.searchQuery = "";
    if (searchInput) searchInput.value = "";
    renderCategoryTabs();
    renderSections();
  };
}
