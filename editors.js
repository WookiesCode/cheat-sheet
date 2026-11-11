// editors.js
// Standalone interactive cheat sheet for Editors: Editors Hub (nano, VS Code, Zed, Cursor)
const EDITORS_CHEAT_SHEET_DATA = [
  {
    "part": "nano",
    "id": "nano-cmd-1",
    "badge": "nano",
    "title": "GNU nano: Open a file at a given line",
    "subtitle": "Open a file at a given line (with line numbers on)",
    "commands": [
      {
        "id": "nano-open-line",
        "desc": "Open a file at a given line (with line numbers on)",
        "cmd": "nano -l +120 /etc/ssh/sshd_config",
        "details": "",
        "flags": [
          [
            "+120",
            "Start at line 120; +120,8 also sets the column. +/PermitRoot starts at the first match"
          ],
          [
            "-l / --linenumbers",
            "Show line numbers, handy when an error message names a line"
          ],
          [
            "-v / --view",
            "Read-only: you cannot change the file by accident"
          ],
          [
            "-B / --backup",
            "Keep the previous version as file~ when you save"
          ],
          [
            "-m / --mouse",
            "Click to place the cursor and scroll with the wheel"
          ],
          [
            "-E -T 4",
            "Convert typed tabs to spaces, tab width 4 (YAML wants spaces)"
          ]
        ],
        "tip": "Use -v when you only need to read",
        "tags": [
          "editor",
          "editors",
          "nano",
          "open",
          "line",
          "view",
          "flags"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.nano-editor.org/dist/latest/nano.1.html",
              "title": "nano(1)"
            }
          ]
        }
      },
      {
        "id": "nano-open-line-sub-1",
        "desc": "Page through a log without any risk of editing it",
        "cmd": "nano -v /var/log/syslog",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "open",
          "line",
          "view"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.nano-editor.org/dist/latest/nano.1.html",
              "title": "nano(1)"
            }
          ]
        }
      },
      {
        "id": "nano-open-line-sub-2",
        "desc": "Open at the first match of a word",
        "cmd": "nano +/ListenAddress /etc/ssh/sshd_config",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "open",
          "line",
          "view"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.nano-editor.org/dist/latest/nano.1.html",
              "title": "nano(1)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "nano",
    "id": "nano-cmd-2",
    "badge": "nano",
    "title": "GNU nano: Edit a root-owned file safely with sudoedit",
    "subtitle": "Edit a root-owned file safely with sudoedit",
    "commands": [
      {
        "id": "nano-sudoedit",
        "desc": "Edit a root-owned file safely with sudoedit",
        "cmd": "sudoedit /etc/fstab",
        "details": "",
        "flags": [
          [
            "sudoedit (= sudo -e)",
            "Copies the file to a temp file, runs your editor as you, and writes it back as root only when you save"
          ],
          [
            "Why not sudo nano",
            "Your editor, its config and plugins never run as root, and a crash cannot leave the real file half-written"
          ],
          [
            "SUDO_EDITOR=nano",
            "Pick the editor sudoedit uses (it also honours VISUAL and EDITOR)"
          ]
        ],
        "tip": "Back up, sudoedit, then validate",
        "tags": [
          "editor",
          "editors",
          "nano",
          "sudoedit",
          "sudo",
          "root",
          "safe",
          "fstab",
          "validate"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.sudo.ws/docs/man/sudo.man/",
              "title": "sudo(8): sudoedit / -e"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/findmnt.8.html",
              "title": "findmnt(8)"
            },
            {
              "url": "https://man.openbsd.org/sshd",
              "title": "sshd(8): -t"
            },
            {
              "url": "https://www.sudo.ws/docs/man/visudo.man/",
              "title": "visudo(8): -c"
            }
          ]
        }
      },
      {
        "id": "nano-sudoedit-sub-1",
        "desc": "Keep a dated copy before you touch it (changes state)",
        "cmd": "cp -a /etc/fstab /etc/fstab.bak.$(date +%F)",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "sudoedit",
          "sudo",
          "root"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.sudo.ws/docs/man/sudo.man/",
              "title": "sudo(8): sudoedit / -e"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/findmnt.8.html",
              "title": "findmnt(8)"
            },
            {
              "url": "https://man.openbsd.org/sshd",
              "title": "sshd(8): -t"
            },
            {
              "url": "https://www.sudo.ws/docs/man/visudo.man/",
              "title": "visudo(8): -c"
            }
          ]
        }
      },
      {
        "id": "nano-sudoedit-sub-2",
        "desc": "Check /etc/fstab before the next reboot finds the mistake",
        "cmd": "findmnt --verify",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "sudoedit",
          "sudo",
          "root"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.sudo.ws/docs/man/sudo.man/",
              "title": "sudo(8): sudoedit / -e"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/findmnt.8.html",
              "title": "findmnt(8)"
            },
            {
              "url": "https://man.openbsd.org/sshd",
              "title": "sshd(8): -t"
            },
            {
              "url": "https://www.sudo.ws/docs/man/visudo.man/",
              "title": "visudo(8): -c"
            }
          ]
        }
      },
      {
        "id": "nano-sudoedit-sub-3",
        "desc": "Check sshd_config before restarting sshd",
        "cmd": "sshd -t",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "sudoedit",
          "sudo",
          "root"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.sudo.ws/docs/man/sudo.man/",
              "title": "sudo(8): sudoedit / -e"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/findmnt.8.html",
              "title": "findmnt(8)"
            },
            {
              "url": "https://man.openbsd.org/sshd",
              "title": "sshd(8): -t"
            },
            {
              "url": "https://www.sudo.ws/docs/man/visudo.man/",
              "title": "visudo(8): -c"
            }
          ]
        }
      },
      {
        "id": "nano-sudoedit-sub-4",
        "desc": "Check sudoers syntax",
        "cmd": "visudo -c",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "sudoedit",
          "sudo",
          "root"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.sudo.ws/docs/man/sudo.man/",
              "title": "sudo(8): sudoedit / -e"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/findmnt.8.html",
              "title": "findmnt(8)"
            },
            {
              "url": "https://man.openbsd.org/sshd",
              "title": "sshd(8): -t"
            },
            {
              "url": "https://www.sudo.ws/docs/man/visudo.man/",
              "title": "visudo(8): -c"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "nano",
    "id": "nano-cmd-3",
    "badge": "nano",
    "title": "GNU nano: Save, exit and get help",
    "subtitle": "Save, exit and get help (the bottom two lines list the rest)",
    "commands": [
      {
        "id": "nano-save-exit",
        "desc": "Save, exit and get help (the bottom two lines list the rest)",
        "cmd": "Ctrl+O  Enter  ·  Ctrl+X",
        "details": "",
        "flags": [
          [
            "Ctrl+O",
            "Write Out: save; Enter confirms the file name (change it to save a copy)"
          ],
          [
            "Ctrl+X",
            "Exit; if there are changes it asks Y (save), N (discard) or Ctrl+C (cancel)"
          ],
          [
            "Ctrl+S",
            "Save without the file-name prompt"
          ],
          [
            "Ctrl+G",
            "Help: every key binding for your version"
          ],
          [
            "^ and M-",
            "In nano's own help ^ means Ctrl and M- means Alt (Meta): M-U is Alt+U"
          ]
        ],
        "tip": "^ = Ctrl, M- = Alt",
        "tags": [
          "editor",
          "editors",
          "nano",
          "save",
          "exit",
          "write out",
          "help",
          "keys"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.nano-editor.org/dist/latest/cheatsheet.html",
              "title": "nano cheatsheet"
            },
            {
              "url": "https://www.nano-editor.org/dist/latest/nano.html",
              "title": "GNU nano manual"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "nano",
    "id": "nano-cmd-4",
    "badge": "nano",
    "title": "GNU nano: Search and replace",
    "subtitle": "Search and replace",
    "commands": [
      {
        "id": "nano-search-replace",
        "desc": "Search and replace",
        "cmd": "Ctrl+W  ·  Ctrl+\\",
        "details": "",
        "flags": [
          [
            "Ctrl+W or Ctrl+F",
            "Search forward (Ctrl+F since nano 8.0; Ctrl+B searches backward). Alt+F / Alt+B find the next / previous match; Alt+W also repeats"
          ],
          [
            "Ctrl+\\",
            "Replace: type the search, then the replacement, then Y / N / A (all) per match"
          ],
          [
            "Alt+R (in the search prompt)",
            "Toggle regular expressions"
          ],
          [
            "Alt+C (in the search prompt)",
            "Toggle case-sensitive"
          ],
          [
            "Alt+B (in the search prompt)",
            "Search backwards"
          ]
        ],
        "tip": "A = replace all remaining matches",
        "tags": [
          "editor",
          "editors",
          "nano",
          "search",
          "find",
          "replace",
          "regex"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.nano-editor.org/dist/latest/nano.html",
              "title": "GNU nano manual"
            },
            {
              "url": "https://www.nano-editor.org/news.php",
              "title": "nano news (8.0 search keys, 9.3)"
            },
            {
              "url": "https://cgit.git.savannah.gnu.org/cgit/nano.git/tree/src/global.c",
              "title": "nano source: default bindings"
            }
          ],
          "note": "Added 2026-11-10: Ctrl+F / Ctrl+B start a search since nano 8.0; Ctrl+W still works."
        }
      }
    ]
  },
  {
    "part": "nano",
    "id": "nano-cmd-5",
    "badge": "nano",
    "title": "GNU nano: Cut, copy and paste whole lines; undo and redo",
    "subtitle": "Cut, copy and paste whole lines; undo and redo",
    "commands": [
      {
        "id": "nano-cut-paste",
        "desc": "Cut, copy and paste whole lines; undo and redo",
        "cmd": "Ctrl+K  ·  Alt+6  ·  Ctrl+U",
        "details": "",
        "flags": [
          [
            "Ctrl+K",
            "Cut the current line (press repeatedly to cut several lines into one clipboard)"
          ],
          [
            "Alt+6",
            "Copy the current line"
          ],
          [
            "Ctrl+U",
            "Paste (Uncut) what you cut or copied"
          ],
          [
            "Alt+A",
            "Set a mark: move the cursor to select a region, then Ctrl+K or Alt+6 acts on it"
          ],
          [
            "Alt+U / Alt+E",
            "Undo / redo"
          ]
        ],
        "tip": "Ctrl+K several times, then Ctrl+U = move a block",
        "tags": [
          "editor",
          "editors",
          "nano",
          "cut",
          "copy",
          "paste",
          "undo",
          "redo",
          "mark"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.nano-editor.org/dist/latest/cheatsheet.html",
              "title": "nano cheatsheet"
            },
            {
              "url": "https://cgit.git.savannah.gnu.org/cgit/nano.git/tree/src/global.c",
              "title": "nano source: default bindings"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "nano",
    "id": "nano-cmd-6",
    "badge": "nano",
    "title": "GNU nano: Jump around a long file",
    "subtitle": "Jump around a long file",
    "commands": [
      {
        "id": "nano-navigate",
        "desc": "Jump around a long file",
        "cmd": "Ctrl+_  (go to line)",
        "details": "",
        "flags": [
          [
            "Ctrl+_ or Alt+G",
            "Go to line (and column: 120,8)"
          ],
          [
            "Alt+\\ / Alt+/",
            "Top / bottom of the file"
          ],
          [
            "Ctrl+C",
            "Show the current line and column"
          ],
          [
            "Ctrl+Y / Ctrl+V",
            "Page up / page down"
          ],
          [
            "Line numbers",
            "Toggle them with the key listed under Ctrl+G (Alt+N in current nano)"
          ]
        ],
        "tip": "Ctrl+G lists the keys of your exact version",
        "tags": [
          "editor",
          "editors",
          "nano",
          "navigate",
          "go to line",
          "page",
          "position"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.nano-editor.org/dist/latest/cheatsheet.html",
              "title": "nano cheatsheet"
            },
            {
              "url": "https://cgit.git.savannah.gnu.org/cgit/nano.git/tree/src/global.c",
              "title": "nano source: default bindings"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "nano",
    "id": "nano-cmd-7",
    "badge": "nano",
    "title": "GNU nano: ~/.config/nano/nanorc",
    "subtitle": "~/.config/nano/nanorc: sensible defaults for config files",
    "commands": [
      {
        "id": "nano-nanorc",
        "desc": "~/.config/nano/nanorc: sensible defaults for config files",
        "cmd": "set linenumbers\nset mouse\nset autoindent\nset tabsize 4\nset tabstospaces\nset constantshow\ninclude \"/usr/share/nano/*.nanorc\"",
        "details": "",
        "flags": [
          [
            "~/.config/nano/nanorc",
            "Your settings (~/.nanorc also works); /etc/nanorc is the system-wide one"
          ],
          [
            "tabstospaces",
            "Typed tabs become spaces: YAML and most configs want that"
          ],
          [
            "constantshow",
            "Always show the cursor position in the status bar"
          ],
          [
            "include …*.nanorc",
            "Syntax colouring for many file types (shipped with the nano package)"
          ]
        ],
        "tip": "One file, every server: keep it in your dotfiles",
        "tags": [
          "editor",
          "editors",
          "nano",
          "nanorc",
          "config",
          "syntax",
          "tabs",
          "dotfiles"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.nano-editor.org/dist/latest/nanorc.5.html",
              "title": "nanorc(5)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "nano",
    "id": "nano-cmd-8",
    "badge": "nano",
    "title": "GNU nano: Make nano",
    "subtitle": "Make nano (or any editor) the default for git, crontab and visudo",
    "commands": [
      {
        "id": "nano-default-editor",
        "desc": "Make nano (or any editor) the default for git, crontab and visudo",
        "cmd": "export EDITOR=nano VISUAL=nano",
        "details": "",
        "flags": [
          [
            "EDITOR / VISUAL",
            "Most tools (crontab -e, visudo, git, sudoedit) read these; put the line in ~/.bashrc"
          ],
          [
            "git config --global core.editor nano",
            "Only git"
          ],
          [
            "update-alternatives --config editor",
            "System-wide default on Debian/Ubuntu (changes state)"
          ]
        ],
        "tip": "Set EDITOR in ~/.bashrc",
        "tags": [
          "editor",
          "editors",
          "nano",
          "editor",
          "default",
          "git",
          "crontab",
          "visudo"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.sudo.ws/docs/man/sudo.man/",
              "title": "sudo(8): sudoedit / -e"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            },
            {
              "url": "https://manpages.debian.org/trixie/dpkg/update-alternatives.1.en.html",
              "title": "update-alternatives(1)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "nano",
    "id": "nano-pro-tips",
    "badge": "tip",
    "title": "GNU nano: Pro Tip",
    "subtitle": "Change a config the safe way",
    "commands": [
      {
        "id": "nano-tips-card",
        "desc": "Change a config the safe way",
        "cmd": "sudo cp -a FILE FILE.bak.$(date +%F) && sudoedit FILE",
        "details": "Keep a dated copy, edit with sudoedit, validate with the service's own checker (sshd -t, nginx -t, visudo -c, findmnt --verify), and only then reload the service.",
        "flags": [
          [
            "cp -a",
            "Keeps owner, mode and timestamps"
          ],
          [
            "Validate first",
            "A typo in sshd_config plus a restart can lock you out of the box"
          ]
        ],
        "tip": "Backup → edit → validate → reload",
        "tags": [
          "editor",
          "editors",
          "nano",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.sudo.ws/docs/man/sudo.man/",
              "title": "sudo(8): sudoedit / -e"
            },
            {
              "url": "https://man.openbsd.org/sshd",
              "title": "sshd(8): -t"
            },
            {
              "url": "https://www.sudo.ws/docs/man/visudo.man/",
              "title": "visudo(8): -c"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/findmnt.8.html",
              "title": "findmnt(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "vscode",
    "id": "vscode-cmd-1",
    "badge": "code",
    "title": "VS Code: Command Palette and Quick Open",
    "subtitle": "Command Palette and Quick Open: find any command or file",
    "commands": [
      {
        "id": "vscode-palette",
        "desc": "Command Palette and Quick Open: find any command or file",
        "cmd": "Ctrl+Shift+P  ·  Ctrl+P",
        "details": "",
        "flags": [
          [
            "Ctrl+Shift+P (or F1)",
            "Command Palette: every command by name"
          ],
          [
            "Ctrl+P",
            "Quick Open a file by name; type : for a line, @ for a symbol, > for commands"
          ],
          [
            "Ctrl+,",
            "Settings"
          ],
          [
            "Ctrl+K Ctrl+S",
            "Keyboard Shortcuts editor (a chord: press Ctrl+K, release, then Ctrl+S)"
          ]
        ],
        "tip": "Forgot a key? Search the palette",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "command palette",
          "quick open",
          "settings",
          "shortcuts"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            },
            {
              "url": "https://code.visualstudio.com/docs/configure/keybindings",
              "title": "VS Code: keyboard shortcuts"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "vscode",
    "id": "vscode-cmd-2",
    "badge": "code",
    "title": "VS Code: Show and hide the panels",
    "subtitle": "Show and hide the panels",
    "commands": [
      {
        "id": "vscode-panels",
        "desc": "Show and hide the panels",
        "cmd": "Ctrl+B  ·  Ctrl+`",
        "details": "",
        "flags": [
          [
            "Ctrl+B",
            "Toggle the sidebar"
          ],
          [
            "Ctrl+`",
            "Toggle the integrated terminal"
          ],
          [
            "Ctrl+Shift+E",
            "Explorer"
          ],
          [
            "Ctrl+Shift+F / Ctrl+Shift+H",
            "Search / replace across files"
          ],
          [
            "Ctrl+Shift+G",
            "Source Control (git)"
          ],
          [
            "Ctrl+Shift+X",
            "Extensions"
          ]
        ],
        "tip": "Ctrl+` keeps a shell one key away",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "sidebar",
          "terminal",
          "explorer",
          "search",
          "git"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "vscode",
    "id": "vscode-cmd-3",
    "badge": "code",
    "title": "VS Code: Move through code",
    "subtitle": "Move through code: definitions, symbols, lines",
    "commands": [
      {
        "id": "vscode-navigate",
        "desc": "Move through code: definitions, symbols, lines",
        "cmd": "F12  ·  Ctrl+Shift+O  ·  Ctrl+G",
        "details": "",
        "flags": [
          [
            "F12",
            "Go to definition"
          ],
          [
            "Ctrl+Shift+F10",
            "Peek definition (Linux; Alt+F12 on Windows)"
          ],
          [
            "F2",
            "Rename a symbol everywhere"
          ],
          [
            "Ctrl+Shift+O",
            "Go to a symbol in this file"
          ],
          [
            "Ctrl+T",
            "Go to a symbol in the workspace"
          ],
          [
            "Ctrl+G",
            "Go to line"
          ]
        ],
        "tip": "F12 in, Ctrl+Alt+- back",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "definition",
          "symbol",
          "rename",
          "go to line"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "vscode",
    "id": "vscode-cmd-4",
    "badge": "code",
    "title": "VS Code: Multi-cursor and line editing",
    "subtitle": "Multi-cursor and line editing",
    "commands": [
      {
        "id": "vscode-multicursor",
        "desc": "Multi-cursor and line editing",
        "cmd": "Ctrl+D  ·  Shift+Alt+Down",
        "details": "",
        "flags": [
          [
            "Ctrl+D",
            "Select the next occurrence (repeat to add more cursors)"
          ],
          [
            "Ctrl+Shift+L",
            "Select all occurrences"
          ],
          [
            "Shift+Alt+Up / Down",
            "Add a cursor above / below (Linux; Ctrl+Alt on Windows)"
          ],
          [
            "Alt+Up / Down",
            "Move the line up / down"
          ],
          [
            "Ctrl+Shift+Alt+Down",
            "Copy the line down (Linux)"
          ],
          [
            "Ctrl+/",
            "Toggle a line comment"
          ],
          [
            "Ctrl+Shift+I",
            "Format the document (Linux; Shift+Alt+F on Windows)"
          ]
        ],
        "tip": "Ctrl+D is the fastest bulk rename",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "multi-cursor",
          "select",
          "move line",
          "comment",
          "format"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            },
            {
              "url": "https://github.com/microsoft/vscode/blob/main/src/vs/editor/contrib/linesOperations/browser/linesOperations.ts",
              "title": "VS Code source: line commands"
            }
          ],
          "note": "Copy line down is not in the PDF; its Linux binding is in VS Code's source."
        }
      }
    ]
  },
  {
    "part": "vscode",
    "id": "vscode-cmd-5",
    "badge": "code",
    "title": "VS Code: Split, close and focus",
    "subtitle": "Split, close and focus",
    "commands": [
      {
        "id": "vscode-layout",
        "desc": "Split, close and focus",
        "cmd": "Ctrl+\\  ·  Ctrl+W  ·  Ctrl+K Z",
        "details": "",
        "flags": [
          [
            "Ctrl+\\",
            "Split the editor"
          ],
          [
            "Ctrl+W",
            "Close the editor"
          ],
          [
            "Ctrl+K Z",
            "Zen mode; Esc Esc leaves it"
          ]
        ],
        "tip": "Zen mode for long write-ups",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "split",
          "close",
          "zen",
          "layout"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "vscode",
    "id": "vscode-cmd-6",
    "badge": "code",
    "title": "VS Code: The code command",
    "subtitle": "The code command: open, jump to a line, diff",
    "commands": [
      {
        "id": "vscode-cli",
        "desc": "The code command: open, jump to a line, diff",
        "cmd": "code -r -g /etc/netplan/50-cloud-init.yaml:12",
        "details": "",
        "flags": [
          [
            "code .",
            "Open the current folder"
          ],
          [
            "-g / --goto file:line[:col]",
            "Open at a line, e.g. straight from a compiler or log error"
          ],
          [
            "-r / --reuse-window",
            "Use the window that is already open"
          ],
          [
            "-n / --new-window",
            "Force a new window"
          ],
          [
            "-d / --diff A B",
            "Side-by-side diff of two files"
          ],
          [
            "-w / --wait",
            "Return only when the file is closed (needed as a git editor)"
          ]
        ],
        "tip": "core.editor needs --wait",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "code",
          "cli",
          "diff",
          "goto",
          "git",
          "extensions"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      },
      {
        "id": "vscode-cli-sub-1",
        "desc": "Compare two configs",
        "cmd": "code --diff running.conf backup.conf",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "recipe",
          "code",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      },
      {
        "id": "vscode-cli-sub-2",
        "desc": "VS Code for commit messages and rebases",
        "cmd": "git config --global core.editor \"code --wait\"",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "recipe",
          "code",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      },
      {
        "id": "vscode-cli-sub-3",
        "desc": "What is installed (and which versions)",
        "cmd": "code --list-extensions --show-versions",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "recipe",
          "code",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      },
      {
        "id": "vscode-cli-sub-4",
        "desc": "Install an extension by ID (changes state)",
        "cmd": "code --install-extension ms-vscode-remote.remote-ssh",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "recipe",
          "code",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "vscode",
    "id": "vscode-cmd-7",
    "badge": "code",
    "title": "VS Code: Edit files on a server over SSH",
    "subtitle": "Edit files on a server over SSH (Remote-SSH)",
    "commands": [
      {
        "id": "vscode-remote",
        "desc": "Edit files on a server over SSH (Remote-SSH)",
        "cmd": "Ctrl+Shift+P → Remote-SSH: Connect to Host...",
        "details": "",
        "flags": [
          [
            "Remote-SSH extension",
            "Runs a small VS Code server on the target; files, terminal and search work as if local"
          ],
          [
            "~/.ssh/config",
            "Hosts you define there (Host, HostName, User, ProxyJump) appear in the host list"
          ],
          [
            "ProxyJump jumpbox",
            "Reach lab nodes through the jumpbox without extra tunnels"
          ],
          [
            "code --remote ssh-remote+HOST /path",
            "The same from the command line"
          ],
          [
            "code tunnel",
            "Alternative when inbound SSH is blocked: the machine connects out (needs sign-in)"
          ]
        ],
        "tip": "Define hosts in ~/.ssh/config once",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "remote",
          "ssh",
          "remote-ssh",
          "tunnel",
          "jumpbox"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/remote/ssh",
              "title": "VS Code: Remote-SSH"
            },
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://code.visualstudio.com/docs/remote/tunnels",
              "title": "VS Code: Remote Tunnels"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "vscode",
    "id": "vscode-pro-tips",
    "badge": "tip",
    "title": "VS Code: Pro Tip",
    "subtitle": "VS Code 1.145 (November 2026): keys above are the Linux defaults",
    "commands": [
      {
        "id": "vscode-tips-card",
        "desc": "VS Code 1.145 (November 2026): keys above are the Linux defaults",
        "cmd": "Ctrl+K Ctrl+S",
        "details": "Linux, Windows and macOS defaults differ (peek, format, add-cursor). The Keyboard Shortcuts editor shows what your install actually uses and lets you search by key.",
        "flags": [
          [
            "Search by key",
            "Click the keyboard icon in the editor and press the combo"
          ],
          [
            "Settings Sync",
            "Sign in once and keybindings follow you to other machines"
          ]
        ],
        "tip": "Check your own bindings with Ctrl+K Ctrl+S",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/keybindings",
              "title": "VS Code: keyboard shortcuts"
            },
            {
              "url": "https://code.visualstudio.com/updates/v1_145",
              "title": "VS Code 1.145 release notes"
            },
            {
              "url": "https://code.visualstudio.com/docs/configure/settings-sync",
              "title": "VS Code: Settings Sync"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "zed",
    "id": "zed-cmd-1",
    "badge": "zed",
    "title": "Zed: Command palette, file finder, settings and keymap",
    "subtitle": "Command palette, file finder, settings and keymap",
    "commands": [
      {
        "id": "zed-palette",
        "desc": "Command palette, file finder, settings and keymap",
        "cmd": "ctrl-shift-p  ·  ctrl-p",
        "details": "",
        "flags": [
          [
            "ctrl-shift-p (or f1)",
            "Command palette"
          ],
          [
            "ctrl-p (or ctrl-e)",
            "File finder"
          ],
          [
            "ctrl-,",
            "Settings window"
          ],
          [
            "ctrl-alt-,",
            "Open the settings file (JSON)"
          ],
          [
            "ctrl-k ctrl-s",
            "Keymap editor"
          ]
        ],
        "tip": "zed: open default keymap shows every binding",
        "tags": [
          "editor",
          "editors",
          "zed",
          "palette",
          "file finder",
          "settings",
          "keymap"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            },
            {
              "url": "https://zed.dev/docs/key-bindings",
              "title": "Zed: key bindings"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "zed",
    "id": "zed-cmd-2",
    "badge": "zed",
    "title": "Zed: Docks, terminal and project search",
    "subtitle": "Docks, terminal and project search",
    "commands": [
      {
        "id": "zed-panels",
        "desc": "Docks, terminal and project search",
        "cmd": "ctrl-b  ·  ctrl-`",
        "details": "",
        "flags": [
          [
            "ctrl-b",
            "Toggle the left dock"
          ],
          [
            "ctrl-shift-e",
            "Project panel (file tree)"
          ],
          [
            "ctrl-`",
            "Toggle the terminal panel"
          ],
          [
            "ctrl-j",
            "Toggle the bottom dock"
          ],
          [
            "ctrl-shift-f / ctrl-shift-h",
            "Search / replace across the project"
          ]
        ],
        "tip": "Most default keys match VS Code's",
        "tags": [
          "editor",
          "editors",
          "zed",
          "dock",
          "terminal",
          "project",
          "search"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "zed",
    "id": "zed-cmd-3",
    "badge": "zed",
    "title": "Zed: Definitions, references, symbols",
    "subtitle": "Definitions, references, symbols",
    "commands": [
      {
        "id": "zed-navigate",
        "desc": "Definitions, references, symbols",
        "cmd": "f12  ·  alt-shift-f12",
        "details": "",
        "flags": [
          [
            "f12",
            "Go to definition"
          ],
          [
            "alt-shift-f12",
            "Find all references"
          ],
          [
            "f2",
            "Rename symbol"
          ],
          [
            "ctrl-shift-o",
            "Outline: symbols in this file"
          ],
          [
            "ctrl-t",
            "Symbols across the project"
          ],
          [
            "ctrl-g",
            "Go to line"
          ]
        ],
        "tip": "ctrl-shift-o for a quick file outline",
        "tags": [
          "editor",
          "editors",
          "zed",
          "definition",
          "references",
          "symbols",
          "go to line"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "zed",
    "id": "zed-cmd-4",
    "badge": "zed",
    "title": "Zed: Multi-cursor and line editing",
    "subtitle": "Multi-cursor and line editing",
    "commands": [
      {
        "id": "zed-editing",
        "desc": "Multi-cursor and line editing",
        "cmd": "ctrl-d  ·  shift-alt-down",
        "details": "",
        "flags": [
          [
            "ctrl-d",
            "Select the next occurrence"
          ],
          [
            "shift-alt-up / shift-alt-down",
            "Add a cursor above / below"
          ],
          [
            "alt-up / alt-down",
            "Move the line"
          ],
          [
            "ctrl-alt-shift-up / down",
            "Duplicate the line"
          ],
          [
            "ctrl-/",
            "Toggle comment"
          ],
          [
            "ctrl-shift-i",
            "Format"
          ],
          [
            "ctrl-\\ / ctrl-w",
            "Split right / close the tab"
          ]
        ],
        "tip": "Muscle memory from VS Code carries over",
        "tags": [
          "editor",
          "editors",
          "zed",
          "multi-cursor",
          "move line",
          "duplicate",
          "comment",
          "format",
          "split"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "zed",
    "id": "zed-cmd-5",
    "badge": "zed",
    "title": "Zed: AI",
    "subtitle": "AI: agent panel and inline assist",
    "commands": [
      {
        "id": "zed-agent",
        "desc": "AI: agent panel and inline assist",
        "cmd": "ctrl-?  ·  ctrl-enter",
        "details": "",
        "flags": [
          [
            "ctrl-?",
            "Focus the agent panel (opens it if closed)"
          ],
          [
            "ctrl-enter (in the editor)",
            "Inline assist on the selection or the current line"
          ],
          [
            "Providers",
            "Configure models in the agent panel's settings"
          ]
        ],
        "tip": "Select code first, then ctrl-enter",
        "tags": [
          "editor",
          "editors",
          "zed",
          "ai",
          "agent",
          "inline assist",
          "assistant"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            },
            {
              "url": "https://zed.dev/docs/ai/agent-panel",
              "title": "Zed: agent panel"
            },
            {
              "url": "https://zed.dev/docs/ai/inline-assistant",
              "title": "Zed: inline assistant"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "zed",
    "id": "zed-cmd-6",
    "badge": "zed",
    "title": "Zed: The zed command",
    "subtitle": "The zed command: open a folder, a line, a diff",
    "commands": [
      {
        "id": "zed-cli",
        "desc": "The zed command: open a folder, a line, a diff",
        "cmd": "zed /etc/netplan/50-cloud-init.yaml:12:5",
        "details": "",
        "flags": [
          [
            "zed ~/projects/repo",
            "Open a folder as a workspace"
          ],
          [
            "zed file:42 / file:42:10",
            "Open at a line (and column)"
          ],
          [
            "--diff OLD NEW",
            "Diff two files"
          ],
          [
            "-n / -a / -e",
            "New workspace / add to the current workspace / open in an existing window (-r, reuse, still works but is hidden from --help)"
          ],
          [
            "-w / --wait",
            "Wait for the file to close (for git core.editor)"
          ],
          [
            "zeditor",
            "Some Linux packages name the binary zeditor instead of zed"
          ]
        ],
        "tip": "core.editor needs --wait",
        "tags": [
          "editor",
          "editors",
          "zed",
          "zed",
          "cli",
          "diff",
          "git"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/crates/cli/src/main.rs",
              "title": "Zed CLI source (flags)"
            },
            {
              "url": "https://zed.dev/docs/linux",
              "title": "Zed on Linux (zeditor)"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ],
          "note": "Corrected 2026-11-10: -r is hidden; -e / --existing opens in an existing window."
        }
      },
      {
        "id": "zed-cli-sub-1",
        "desc": "Zed for commit messages",
        "cmd": "git config --global core.editor \"zed --wait\"",
        "tags": [
          "editor",
          "editors",
          "zed",
          "recipe",
          "zed",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/crates/cli/src/main.rs",
              "title": "Zed CLI source (flags)"
            },
            {
              "url": "https://zed.dev/docs/linux",
              "title": "Zed on Linux (zeditor)"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ],
          "note": "Corrected 2026-11-10: -r is hidden; -e / --existing opens in an existing window."
        }
      },
      {
        "id": "zed-cli-sub-2",
        "desc": "Installed version",
        "cmd": "zed --version",
        "tags": [
          "editor",
          "editors",
          "zed",
          "recipe",
          "zed",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/crates/cli/src/main.rs",
              "title": "Zed CLI source (flags)"
            },
            {
              "url": "https://zed.dev/docs/linux",
              "title": "Zed on Linux (zeditor)"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ],
          "note": "Corrected 2026-11-10: -r is hidden; -e / --existing opens in an existing window."
        }
      }
    ]
  },
  {
    "part": "zed",
    "id": "zed-cmd-7",
    "badge": "zed",
    "title": "Zed: Keymap file, base keymap and vim mode",
    "subtitle": "Keymap file, base keymap and vim mode",
    "commands": [
      {
        "id": "zed-config",
        "desc": "Keymap file, base keymap and vim mode",
        "cmd": "~/.config/zed/keymap.json",
        "details": "",
        "flags": [
          [
            "~/.config/zed/keymap.json",
            "Your bindings (Linux); they take precedence over the defaults"
          ],
          [
            "zed: toggle base keymap selector",
            "Switch the base keymap: Zed (default), VS Code, JetBrains, Sublime Text, Emacs (beta), Cursor…"
          ],
          [
            "\"vim_mode\": true",
            "Vim keys, set in settings.json (open it with ctrl-alt-,)"
          ]
        ],
        "tip": "Keymap editor writes keymap.json for you",
        "tags": [
          "editor",
          "editors",
          "zed",
          "keymap",
          "settings",
          "vim",
          "base keymap",
          "config"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://zed.dev/docs/key-bindings",
              "title": "Zed: key bindings"
            },
            {
              "url": "https://zed.dev/docs/vim",
              "title": "Zed: Vim mode"
            }
          ],
          "note": "Corrected 2026-11-10: the default base keymap is Zed, not VS Code."
        }
      }
    ]
  },
  {
    "part": "zed",
    "id": "zed-pro-tips",
    "badge": "tip",
    "title": "Zed: Pro Tip",
    "subtitle": "Zed 1.27 (November 2026): check the bindings your build ships",
    "commands": [
      {
        "id": "zed-tips-card",
        "desc": "Zed 1.27 (November 2026): check the bindings your build ships",
        "cmd": "ctrl-shift-p → zed: open default keymap",
        "details": "Zed updates often. The default keymap file is the source of truth for every action and its key; search it for an action name to find its binding.",
        "flags": [
          [
            "Actions",
            "There is no separate action list: the palette and the default keymap are it"
          ],
          [
            "Linux vs macOS",
            "These are the Linux keys; macOS uses cmd"
          ]
        ],
        "tip": "The default keymap is the reference",
        "tags": [
          "editor",
          "editors",
          "zed",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://zed.dev/docs/key-bindings",
              "title": "Zed: key bindings"
            },
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            },
            {
              "url": "https://github.com/zed-industries/zed/releases",
              "title": "Zed releases"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "cursor",
    "id": "cursor-cmd-1",
    "badge": "cur",
    "title": "Cursor: Open the agent side panel and switch modes and models",
    "subtitle": "Open the agent side panel and switch modes and models",
    "commands": [
      {
        "id": "cursor-panel",
        "desc": "Open the agent side panel and switch modes and models",
        "cmd": "Ctrl+I  ·  Ctrl+.  ·  Shift+Tab",
        "details": "",
        "flags": [
          [
            "Ctrl+I (also Ctrl+L / Ctrl+K)",
            "Toggle the side panel (unless you bound a key to a mode)"
          ],
          [
            "Ctrl+E",
            "Toggle the agent layout"
          ],
          [
            "Ctrl+.",
            "Mode menu"
          ],
          [
            "Shift+Tab",
            "Rotate between agent modes"
          ],
          [
            "Ctrl+/",
            "Loop between AI models"
          ],
          [
            "Linux keys",
            "Cursor's reference lists each key twice: Cmd for macOS, Ctrl for Linux and Windows"
          ]
        ],
        "tip": "Shift+Tab to switch Agent / Plan / Ask",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "agent",
          "side panel",
          "mode",
          "model"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/reference/keyboard-shortcuts",
              "title": "Cursor: keyboard shortcuts"
            }
          ],
          "note": "Corrected 2026-11-10: the reference now lists the Ctrl keys too."
        }
      }
    ]
  },
  {
    "part": "cursor",
    "id": "cursor-cmd-2",
    "badge": "cur",
    "title": "Cursor: In the chat box",
    "subtitle": "In the chat box: send, cancel, accept or reject changes",
    "commands": [
      {
        "id": "cursor-chat",
        "desc": "In the chat box: send, cancel, accept or reject changes",
        "cmd": "Ctrl+Enter  ·  Ctrl+Shift+Backspace",
        "details": "",
        "flags": [
          [
            "Enter",
            "Queue the message (default)"
          ],
          [
            "Ctrl+Enter while typing",
            "Send now"
          ],
          [
            "Ctrl+Shift+Backspace",
            "Cancel the generation"
          ],
          [
            "Ctrl+Enter with suggested changes",
            "Accept all changes"
          ],
          [
            "Ctrl+Shift+Backspace with suggested changes",
            "Reject all changes"
          ],
          [
            "Ctrl+N / Ctrl+T / Ctrl+W",
            "New chat / new chat tab / close the chat"
          ]
        ],
        "tip": "Review the diff before accepting all",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "chat",
          "send",
          "accept",
          "reject",
          "cancel"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/reference/keyboard-shortcuts",
              "title": "Cursor: keyboard shortcuts"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "cursor",
    "id": "cursor-cmd-3",
    "badge": "cur",
    "title": "Cursor: Give the agent context",
    "subtitle": "Give the agent context: selections, files, clipboard",
    "commands": [
      {
        "id": "cursor-context",
        "desc": "Give the agent context: selections, files, clipboard",
        "cmd": "Ctrl+Shift+L  ·  @",
        "details": "",
        "flags": [
          [
            "Ctrl+Shift+L",
            "Add the selected code to the chat"
          ],
          [
            "@",
            "Mention files, folders, docs and more"
          ],
          [
            "/",
            "Shortcut commands"
          ],
          [
            "Ctrl+V (code or log in clipboard)",
            "Add it as context; Ctrl+Shift+V adds it to the input box as text"
          ]
        ],
        "tip": "@-mention the file instead of pasting it",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "context",
          "mention",
          "selection",
          "clipboard"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/reference/keyboard-shortcuts",
              "title": "Cursor: keyboard shortcuts"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "cursor",
    "id": "cursor-cmd-4",
    "badge": "cur",
    "title": "Cursor: Tab completions",
    "subtitle": "Tab completions",
    "commands": [
      {
        "id": "cursor-tab",
        "desc": "Tab completions",
        "cmd": "Tab  ·  Ctrl+→",
        "details": "",
        "flags": [
          [
            "Tab",
            "Accept the suggestion"
          ],
          [
            "Ctrl+→",
            "Accept the next word only"
          ]
        ],
        "tip": "Ctrl+→ takes it one word at a time",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "tab",
          "completion",
          "suggestion"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/reference/keyboard-shortcuts",
              "title": "Cursor: keyboard shortcuts"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "cursor",
    "id": "cursor-cmd-5",
    "badge": "cur",
    "title": "Cursor: Settings, palette, keyboard shortcuts, voice",
    "subtitle": "Settings, palette, keyboard shortcuts, voice",
    "commands": [
      {
        "id": "cursor-settings",
        "desc": "Settings, palette, keyboard shortcuts, voice",
        "cmd": "Ctrl+Shift+J  ·  Ctrl+Shift+P",
        "details": "",
        "flags": [
          [
            "Ctrl+Shift+J",
            "Cursor settings (models, rules, privacy)"
          ],
          [
            "Ctrl+,",
            "General (VS Code) settings"
          ],
          [
            "Ctrl+Shift+P",
            "Command palette"
          ],
          [
            "Ctrl+R then Ctrl+S",
            "Keyboard shortcuts editor (or search Keyboard Shortcuts in the palette)"
          ],
          [
            "Ctrl+Shift+Space",
            "Voice mode (dictation)"
          ]
        ],
        "tip": "Ctrl+Shift+J is Cursor's own settings",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "settings",
          "palette",
          "shortcuts",
          "voice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/reference/keyboard-shortcuts",
              "title": "Cursor: keyboard shortcuts"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "cursor",
    "id": "cursor-cmd-6",
    "badge": "cur",
    "title": "Cursor: Run the Cursor agent in a terminal",
    "subtitle": "Run the Cursor agent in a terminal (agent CLI)",
    "commands": [
      {
        "id": "cursor-agent-cli",
        "desc": "Run the Cursor agent in a terminal (agent CLI)",
        "cmd": "agent \"explain why this service fails to start\"",
        "details": "",
        "flags": [
          [
            "agent",
            "Interactive session in the current directory"
          ],
          [
            "-p \"…\" --output-format text",
            "Print mode: one answer to stdout, for scripts"
          ],
          [
            "--mode=plan / --mode=ask",
            "Plan without editing, or just answer questions"
          ],
          [
            "agent ls / agent resume / --continue",
            "List, resume or continue earlier sessions"
          ],
          [
            "--sandbox enabled",
            "Run tool calls in the sandbox"
          ]
        ],
        "tip": "-p for scripts, plain agent for a chat",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "cli",
          "agent",
          "terminal",
          "print mode"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/cli/overview",
              "title": "Cursor CLI overview"
            },
            {
              "url": "https://cursor.com/docs/cli/reference/parameters",
              "title": "Cursor CLI parameters"
            }
          ]
        }
      },
      {
        "id": "cursor-agent-cli-sub-1",
        "desc": "Install the CLI (pipes a script into bash: read it first; changes state)",
        "cmd": "curl https://cursor.com/install -fsS | bash",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "recipe",
          "cli",
          "agent",
          "terminal"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/cli/overview",
              "title": "Cursor CLI overview"
            },
            {
              "url": "https://cursor.com/docs/cli/reference/parameters",
              "title": "Cursor CLI parameters"
            }
          ]
        }
      },
      {
        "id": "cursor-agent-cli-sub-2",
        "desc": "Non-interactive review",
        "cmd": "agent -p \"review these changes for security issues\" --output-format text",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "recipe",
          "cli",
          "agent",
          "terminal"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/cli/overview",
              "title": "Cursor CLI overview"
            },
            {
              "url": "https://cursor.com/docs/cli/reference/parameters",
              "title": "Cursor CLI parameters"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "cursor",
    "id": "cursor-pro-tips",
    "badge": "tip",
    "title": "Cursor: Pro Tip",
    "subtitle": "Keys change often: check Cursor's own list",
    "commands": [
      {
        "id": "cursor-tips-card",
        "desc": "Keys change often: check Cursor's own list",
        "cmd": "Ctrl+R Ctrl+S",
        "details": "Cursor ships updates weekly (changelog entries on Nov 5 and 6, 2026 alone). The keyboard shortcuts editor shows your build's bindings; everything not AI-specific behaves like VS Code.",
        "flags": [
          [
            "VS Code sheet",
            "Navigation, multi-cursor and Remote-SSH keys are the same"
          ],
          [
            "Rules",
            "Project rules guide the agent; keep secrets out of prompts and rules"
          ]
        ],
        "tip": "AI keys here, editing keys on the VS Code sheet",
        "tags": [
          "editor",
          "editors",
          "cursor",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://cursor.com/docs/reference/keyboard-shortcuts",
              "title": "Cursor: keyboard shortcuts"
            },
            {
              "url": "https://cursor.com/changelog",
              "title": "Cursor changelog"
            },
            {
              "url": "https://cursor.com/docs/rules",
              "title": "Cursor: rules"
            }
          ]
        }
      }
    ]
  }
];

// Application State
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("editors.html", "editors_bookmarks", EDITORS_CHEAT_SHEET_DATA, {"nano":"nano_bookmarks","vscode":"vscode_bookmarks","zed":"zed_bookmarks","cursor":"cursor_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("editors_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(EDITORS_CHEAT_SHEET_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: EDITORS_CHEAT_SHEET_DATA, label: "Editors sheets", parts: {
   "cursor": {
    "title": "Cursor",
    "subtitle": "Cursor's AI keys and its terminal agent. Cursor is built on VS Code, so the VS Code sheet's keys work here too",
    "pill": "Cursor · Nov 2026"
   },
   "nano": {
    "title": "GNU nano",
    "subtitle": "The editor that is on every server: open at a line, save, search and replace, cut and paste lines, and a nanorc that makes it pleasant",
    "pill": "GNU nano 9.3"
   },
   "vscode": {
    "title": "VS Code",
    "subtitle": "Default Linux keys for the moves you use daily, the code command line, and editing on a server over SSH",
    "pill": "VS Code 1.145 · Linux keys"
   },
   "zed": {
    "title": "Zed",
    "subtitle": "Zed's default Linux keymap (VS Code-like), where its settings and keymap live, the agent panel and inline assist",
    "pill": "Zed 1.27 · Linux keys"
   }
  } };


// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

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
  // One toast for the whole site: common.js keeps a placeholder warning from being replaced.
  if (window.showGlobalToast) return window.showGlobalToast(msg);
  if (!toastEl) return;
  toastTextEl.textContent = msg;
  toastEl.classList.add("visible");
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
    toastEl.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
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
  showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
}

// Command Syntax Highlighting
function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return '<span class="tok-str">' + strLiteral + '</span>';
      if (flagPart) return '<span class="tok-flag">' + flagPart + '</span>';
      if (operatorPart) return '<span class="tok-pipe">' + operatorPart + '</span>';
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? '<span class="tok-pipe">' + sudoPart + '</span>' : "";
        return prefix + sudoHtml + '<span class="tok-cmd">' + cmdName + '</span>';
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = EDITORS_CHEAT_SHEET_DATA;
  const totalCmds = allCards.reduce((acc, c) => acc + c.commands.length, 0);

  const optionsHtml = [
    '<option value="all"' + (state.activeCategory === "all" ? " selected" : "") + '>All Topics (' + totalCmds + ' items)</option>'
  ];

  for (const card of allCards) {
    const isSelected = state.activeCategory === card.id ? " selected" : "";
    optionsHtml.push(
      '<option value="' + escapeHtml(card.id) + '"' + isSelected + '>' +
      escapeHtml(card.title) + ' (' + card.commands.length + ')' +
      '</option>'
    );
  }

  const resetBtnHtml = state.activeCategory !== "all"
    ? '<button type="button" class="cat-reset-btn" id="cat-reset-btn" title="Show all topics">✕ Show All</button>'
    : "";

  categoryTabsEl.innerHTML =
    '<div class="cat-dropdown-wrap">' +
      '<label class="cat-dropdown-label" for="category-select">Topic:</label>' +
      '<select id="category-select" class="cat-select" aria-label="Filter by topic">' +
        optionsHtml.join("") +
      '</select>' +
      resetBtnHtml +
    '</div>';

  const catSelect = document.getElementById("category-select");
  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderCategoryTabs();
      renderSections();
    });
  }

  const catReset = document.getElementById("cat-reset-btn");
  if (catReset) {
    catReset.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmd, searchTerms) {
  if (!searchTerms.length) return true;
  const target = [
    cmd.cmd || "",
    cmd.desc || "",
    cmd.details || "",
    cmd.tip || "",
    (cmd.tags || []).join(" "),
    (cmd.flags || []).map(([f, d]) => f + " " + d).join(" ")
  ].join(" ").toLowerCase();

  return searchTerms.every(term => target.includes(term));
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

let masonryResizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("fullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("webkitfullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const card of EDITORS_CHEAT_SHEET_DATA) {
    if (((state.activeCategory !== "all" && state.activeCategory !== card.id) || (state.part && (card.part || card.id) !== state.part))) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const filteredCommands = card.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) return false;
      return matchesSearch(cmd, searchTerms);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const commandsHtml = filteredCommands.map((cmd) => {
      const isBookmarked = state.bookmarks.has(cmd.id);

      const flagsHtml = (cmd.flags && cmd.flags.length > 0)
        ? '<div class="flag-pills">' + cmd.flags.map(([f, d]) =>
            '<span class="flag-pill"><strong class="flag-token">' + escapeHtml(f) + '</strong> <span class="flag-desc">' + escapeHtml(d) + '</span></span>'
          ).join("") + '</div>'
        : "";

      const detailsHtml = cmd.details
        ? '<p class="cmd-details">' + escapeHtml(cmd.details) + '</p>'
        : "";

      const tipHtml = cmd.tip
        ? '<div class="cmd-tip"><span class="tip-badge">TIP</span>' + escapeHtml(cmd.tip) + '</div>'
        : "";

      const copyTarget = cmd.cmd.includes("   |   ")
        ? cmd.cmd.split("   |   ")[0].trim()
        : cmd.cmd.trim();

      const codeBoxHtml = cmd.diagram
        ? window.CheatSheetCommon.renderDiagram(cmd.diagram)
        : cmd.hideCode ? "" : [
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <span class="copy-hint">Copy</span>',
        '  </div>'
      ].join("\n");

      return [
        '<div class="cmd-item" id="cmd-' + escapeHtml(cmd.id) + '" data-cmd-id="' + escapeHtml(cmd.id) + '">',
        '  <div class="cmd-header-row">',
        '    <div class="cmd-desc">',
        '      <span>' + escapeHtml(cmd.desc) + '</span>',
        '    </div>',
        '    <button',
        '      type="button"',
        '      class="bookmark-btn ' + (isBookmarked ? "bookmarked" : "") + '"',
        '      data-cmd-id="' + escapeHtml(cmd.id) + '"',
        '      title="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '      aria-label="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '    >',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <path fill="' + (isBookmarked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        '      </svg>',
        '    </button>',
        '  </div>',
        '',
        '  ' + codeBoxHtml,
        '  ' + detailsHtml,
        '  ' + flagsHtml,
        '  ' + tipHtml,
        '</div>'
      ].join("\n");
    }).join("\n");

    cardsHtml.push([
      '<article class="section-card" id="sec-' + escapeHtml(card.id) + '">',
      '  <header class="section-header">',
      '    <div class="section-title-wrap">',
      '      <span class="section-badge">' + escapeHtml(card.badge) + '</span>',
      '      <div>',
      '        <h2 class="section-title">' + escapeHtml(card.title) + '</h2>',
      '        <p class="section-subtitle">' + escapeHtml(card.subtitle) + '</p>',
      '      </div>',
      '    </div>',
      '    <span class="count-badge">' + filteredCommands.length + '</span>',
      '  </header>',
      '  <div class="command-list">',
      commandsHtml,
      '  </div>',
      '</article>'
    ].join("\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\n");
  visibleCountEl.textContent = visibleCommandsCount;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }

  packMasonry();
}

function updateSavedCount() {
  savedCountEl.textContent = state.bookmarks.size;
  if (state.bookmarks.size > 0) {
    savedFilterBtn.classList.add("has-saved");
  } else {
    savedFilterBtn.classList.remove("has-saved");
  }
}

function initEventListeners() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderSections();
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.savedOnly = false;
    state.activeCategory = "all";
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
    searchInput.focus();
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
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    localStorage.setItem("linux_cs_theme", state.theme);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      state.searchQuery = "";
      renderSections();
      searchInput.blur();
    }
  });

  sectionsContainer.addEventListener("click", (e) => {
    const codeBox = e.target.closest(".cmd-code-box");
    if (codeBox) {
      const cmdText = codeBox.getAttribute("data-cmd");
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const cmdId = bookmarkBtn.getAttribute("data-cmd-id");
      if (cmdId) {
        if (state.bookmarks.has(cmdId)) {
          state.bookmarks.delete(cmdId);
          bookmarkBtn.classList.remove("bookmarked");
        } else {
          state.bookmarks.add(cmdId);
          bookmarkBtn.classList.add("bookmarked");
        }
        localStorage.setItem("editors_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    sunIcon?.classList.add("hidden");
    moonIcon?.classList.remove("hidden");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    sunIcon?.classList.remove("hidden");
    moonIcon?.classList.add("hidden");
  }
}

function init() {
  applyTheme(state.theme);
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);

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
