const MACOS_CHEAT_SHEET_DATA = [
  {
    id: "system-keys",
    badge: "keys",
    title: "System, Window & Screenshot Shortcuts",
    subtitle: "Spotlight, screen capture, window tiling, app switching & lock/force-quit",
    commands: [
      {
        id: "screenshots-capture",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Capture full screen, crosshair region, or clean single window (with or without shadow)",
        cmd: "⇧⌘3   |   ⇧⌘4   |   ⇧⌘4 then Space   |   ⇧⌘5",
        flags: [
          ["⇧⌘4 + Space", "Capture single window (Hold ⌥ Option while clicking to remove drop shadow!)"],
          ["Hold ⌃ Control", "Hold ⌃ with any screenshot shortcut (e.g. ⌃⇧⌘4) to copy directly to clipboard"],
          ["Hold Space", "Hold Space while dragging a ⇧⌘4 selection box to reposition the box"],
          ["⇧⌘5", "Open unified Screenshot & Screen Recording HUD bar"]
        ],
        tip: "Hold ⌥ click = no shadow",
        tags: ["screenshot", "capture", "record", "window", "shadow", "clipboard"]
      },
      {
        id: "app-window-switching",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Switch between open apps or cycle through windows of the active application",
        cmd: "⌘Tab   |   ⌘` (Backtick)   |   ⌃↑ (Mission Control)   |   ⌃↓ (App Exposé)",
        flags: [
          ["⌘Tab", "Switch apps (while holding ⌘, press Q to quit or H to hide highlighted app)"],
          ["⌘`", "Cycle between windows of the currently focused app"],
          ["⌃↑ / ⌃↓", "Mission Control (all windows) / App Exposé (only current app's windows)"]
        ],
        tip: "⌘` switches same-app windows",
        tags: ["switch", "alt-tab", "windows", "cycle", "mission-control", "expose"]
      },
      {
        id: "window-tiling-fullscreen",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Native macOS Sequoia window snapping/tiling, fullscreen, hide, and minimize",
        cmd: "🌐⌃←   🌐⌃→   🌐⌃Return   |   ⌃⌘F   ⌘H   ⌥⌘H   ⌘M",
        flags: [
          ["🌐⌃← / 🌐⌃→", "Tile window to left / right half of screen (macOS 15+)"],
          ["🌐⌃Return", "Fill screen without entering separate fullscreen Space"],
          ["⌃⌘F / 🌐F", "Toggle true macOS Fullscreen Space"],
          ["⌘H / ⌥⌘H", "Hide active app / Hide all other apps except active one"]
        ],
        tags: ["tile", "snap", "fullscreen", "hide", "minimize", "sequoia"]
      },
      {
        id: "spotlight-power",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Launch Spotlight search, reveal matched file in Finder, or copy file directly",
        cmd: "⌘Space   |   ⌘Return (Reveal)   |   ⌘C (Copy file)   |   Hold ⌘ (Show Path)",
        flags: [
          ["⌘Return", "Open enclosing folder in Finder instead of launching the result"],
          ["Hold ⌘", "Display full file path in bottom status bar of Spotlight preview"],
          ["⌘B", "Search the web directly for current Spotlight query"]
        ],
        tags: ["spotlight", "search", "launcher", "reveal", "path"]
      },
      {
        id: "lock-forcequit-emoji",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Immediately lock screen, force quit unresponsive app, or open Emoji/Symbol picker",
        cmd: "⌃⌘Q (Lock)   |   ⌥⌘⎋ (Force Quit)   |   ⌃⌘Space (Emoji)",
        flags: [
          ["⌃⌘Q", "Lock screen immediately"],
          ["⌥⌘⎋ (Esc)", "Open Force Quit Applications window (⇧⌥⌘⎋ held 3s force-quits front app)"],
          ["⌃⌘Space / 🌐E", "Open Character Viewer (Emoji, math symbols, arrows)"]
        ],
        tags: ["lock", "force-quit", "hang", "emoji", "symbols", "security"]
      },
      {
        id: "sound-brightness-fine",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Adjust volume or display brightness in 1/4-step micro-increments or open settings",
        cmd: "⌥⇧ + Vol/Brightness (1/4 step)   |   ⌥ + Vol/Brightness (Settings)",
        flags: [
          ["⌥⇧ + F1/F2/F11/F12", "Adjust brightness or volume in tiny quarter-bar steps"],
          ["⌥ + F1/F2 or F10-F12", "Jump straight to Displays or Sound settings pane"],
          ["⌥ + Click Wi-Fi/Bluetooth", "Show RSSI signal dBm, noise, channel, TX rate & MAC address"]
        ],
        tip: "⌥+Click Wi-Fi icon for diagnostics",
        tags: ["volume", "brightness", "fine", "wifi", "menu-bar", "option"]
      }
    ]
  },
  {
    id: "finder-keys",
    badge: "fndr",
    title: "Finder, Quick Look & File Dialogs",
    subtitle: "Path navigation, cut/move files, hidden dotfiles, Quick Look & Open/Save dialogs",
    commands: [
      {
        id: "finder-nav-folders",
        mode: "FINDER",
        modeClass: "mode-v",
        desc: "Navigate folder hierarchy, jump to arbitrary POSIX path, or open selected item",
        cmd: "⇧⌘G (Go to Path)   |   ⌘↑ (Parent)   |   ⌘↓ (Open)   |   ⌘O",
        flags: [
          ["⇧⌘G", "Go to Folder by typing path (supports ~ and Tab completion)"],
          ["⌘↑ / ⌘↓", "Go up to parent directory / Open selected file or enter folder"],
          ["Return", "Rename selected file (unlike Windows/Linux where Enter opens it!)"]
        ],
        tip: "Works in Open/Save dialogs too!",
        tags: ["finder", "goto", "path", "parent", "open", "rename"]
      },
      {
        id: "finder-dotfiles-pathbar",
        mode: "FINDER",
        modeClass: "mode-v",
        desc: "Instantly toggle hidden dotfiles, bottom path bar, status bar, and view modes",
        cmd: "⇧⌘. (Dotfiles)   |   ⌥⌘P (Path Bar)   |   ⌘/ (Status)   |   ⌘1 ⌘2 ⌘3 ⌘4",
        flags: [
          ["⇧⌘.", "Toggle visibility of hidden dotfiles (.git, .env, .zshrc) anywhere"],
          ["⌥⌘P / ⌘/", "Show clickable bottom Path Bar / Show free disk space Status Bar"],
          ["⌘1 / ⌘2 / ⌘3 / ⌘4", "Switch to Icon / List / Column (Miller) / Gallery view"]
        ],
        tip: "⇧⌘. works in Save dialogs",
        tags: ["hidden", "dotfiles", "pathbar", "views", "columns"]
      },
      {
        id: "finder-copy-move-path",
        mode: "FINDER",
        modeClass: "mode-v",
        desc: "Move (Cut-Paste) files, copy full POSIX file path, or duplicate item",
        cmd: "⌘C then ⌥⌘V (Move)   |   ⌥⌘C (Copy Path)   |   ⌘D (Duplicate)",
        flags: [
          ["⌘C then ⌥⌘V", "Copy item then Move it here (macOS equivalent of Cut & Paste)"],
          ["⌥⌘C", "Copy selected file's full POSIX path (e.g. /Users/jason/file.txt) to clipboard"],
          ["⌃⌘N", "Create a new folder already containing the currently selected items"]
        ],
        tip: "⌥⌘V = Cut & Paste files",
        tags: ["cut", "move", "paste", "path", "copy", "duplicate", "folder"]
      },
      {
        id: "finder-trash-delete",
        mode: "FINDER",
        modeClass: "mode-v",
        desc: "Move to Trash, bypass Trash (permanent delete), or empty Trash without prompt",
        cmd: "⌘⌫ (Trash)   |   ⌥⌘⌫ (Delete Immediately)   |   ⌥⇧⌘⌫ (Empty Trash)",
        flags: [
          ["⌘⌫ (Delete)", "Move selected file(s) to Trash"],
          ["⌥⌘⌫", "Delete immediately (bypasses Trash completely)"],
          ["⇧⌘⌫ / ⌥⇧⌘⌫", "Empty Trash (with confirmation / skip confirmation dialog)"]
        ],
        tags: ["trash", "delete", "permanent", "empty", "remove"]
      },
      {
        id: "quicklook-inspector",
        mode: "FINDER",
        modeClass: "mode-v",
        desc: "Preview files with Quick Look, markup PDFs/images, or open live Inspector",
        cmd: "Space (Quick Look)   |   ⌥Space (Fullscreen)   |   ⌘I   |   ⌥⌘I (Inspector)",
        flags: [
          ["Space", "Quick Look preview (use arrow keys while open to browse other files)"],
          ["⌘I vs ⌥⌘I", "Get Info window vs Live Floating Inspector (updates as selection changes)"],
          ["⌘Y", "Alternate shortcut to toggle Quick Look"]
        ],
        tags: ["quicklook", "preview", "info", "inspector", "metadata"]
      }
    ]
  },
  {
    id: "text-editing",
    badge: "txt",
    title: "Text Editing, Cursor & Selection Shortcuts",
    subtitle: "Word/line jumps, forward delete, unformatted paste & special characters",
    commands: [
      {
        id: "text-cursor-navigation",
        mode: "TEXT",
        modeClass: "mode-i",
        desc: "Jump cursor by word, to start/end of line, or top/bottom of document",
        cmd: "⌥← / ⌥→ (Word)   |   ⌘← / ⌘→ (Line)   |   ⌘↑ / ⌘↓ (Doc)",
        flags: [
          ["⌥← / ⌥→", "Jump one word left / right (Hold ⇧ Shift to select by word)"],
          ["⌘← / ⌘→", "Jump to beginning / end of current line (Hold ⇧ Shift to select line)"],
          ["⌘↑ / ⌘↓", "Jump to very top / very bottom of document"]
        ],
        tags: ["cursor", "word", "home", "end", "line", "select"]
      },
      {
        id: "text-delete-word-line",
        mode: "TEXT",
        modeClass: "mode-i",
        desc: "Delete previous word, next word, entire line before cursor, or forward-delete",
        cmd: "⌥⌫ (Prev Word)   |   ⌘⌫ (To Line Start)   |   fn+⌫ or ⌃D (Forward Del)",
        flags: [
          ["⌥⌫", "Delete entire word to the left of cursor"],
          ["fn+⌥⌫", "Delete entire word to the right of cursor"],
          ["⌘⌫", "Delete everything from cursor back to start of line"],
          ["⌃K", "Kill everything from cursor forward to end of line"]
        ],
        tip: "⌥⌫ & ⌘⌫ work everywhere",
        tags: ["delete", "backspace", "word", "line", "forward"]
      },
      {
        id: "paste-without-formatting",
        mode: "TEXT",
        modeClass: "mode-i",
        desc: "Paste clipboard contents as plain text matching destination font & style",
        cmd: "⇧⌥⌘V (Paste & Match Style)   |   ⌘K (Insert Link)",
        flags: [
          ["⇧⌥⌘V", "Strip rich HTML/font formatting when pasting into Mail, Notes, Docs, Slack"],
          ["⌘Z / ⇧⌘Z", "Undo / Redo last action"]
        ],
        tip: "Essential for clean pasting",
        tags: ["paste", "plain", "unformatted", "style", "clipboard"]
      },
      {
        id: "mac-special-typography",
        mode: "TEXT",
        modeClass: "mode-i",
        desc: "Type common symbols, degree sign, em-dash, ellipsis, and Apple logo directly",
        cmd: "⌥⇧8 (°)   ⌥- (–)   ⌥⇧- (—)   ⌥; (…)   ⌥G (©)   ⌥R (®)   ⌥⇧K ()",
        flags: [
          ["⌥- / ⌥⇧-", "En-dash (–) / Em-dash (—)"],
          ["⌥⇧8 / ⌥;", "Degree symbol (°) / Horizontal ellipsis (…)"],
          ["Hold Vowel Key", "Press & hold e, a, u, o, n to pop up accent selector menu"]
        ],
        tags: ["symbols", "typography", "emdash", "degree", "accents", "apple"]
      }
    ]
  },
  {
    id: "trackpad",
    badge: "pad",
    title: "Multi-Touch Trackpad & Mouse Gestures",
    subtitle: "Spaces, Mission Control, Quick Look, Zoom & hidden trackpad tricks",
    commands: [
      {
        id: "trackpad-spaces-mission",
        mode: "TRACKPAD",
        modeClass: "mode-v",
        desc: "Manage workspaces, view all open windows, or reveal the desktop",
        cmd: "3/4-Finger Swipe Up / Down / Left / Right   |   Spread Thumb + 3 Fingers",
        flags: [
          ["Swipe Up (3/4 fingers)", "Open Mission Control (drag windows to top bar to create new Space)"],
          ["Swipe Down (3/4 fingers)", "App Exposé — show all windows of current application"],
          ["Swipe Left/Right", "Glide between Desktop Spaces and Fullscreen apps"],
          ["Spread Thumb + 3 Fingers", "Push all windows aside to reveal Desktop"]
        ],
        tags: ["trackpad", "gesture", "swipe", "spaces", "mission-control", "desktop"]
      },
      {
        id: "trackpad-lookup-zoom",
        mode: "TRACKPAD",
        modeClass: "mode-v",
        desc: "Preview links/files inline, smart-zoom columns, or rotate images",
        cmd: "Force Click (or 3-Finger Tap)   |   2-Finger Double Tap   |   2-Finger Pinch",
        flags: [
          ["Force Click / 3-Tap", "Preview webpage link, look up word definition, preview file or flight/date"],
          ["2-Finger Double Tap", "Smart Zoom in/out on Safari column or PDF"],
          ["2-Finger Rotate", "Rotate photo in Preview or Photos app"]
        ],
        tags: ["force-click", "lookup", "dictionary", "zoom", "preview", "rotate"]
      },
      {
        id: "trackpad-three-finger-drag",
        mode: "TRACKPAD",
        modeClass: "mode-v",
        desc: "Enable effortless Three-Finger Window & Text Dragging (hidden in Accessibility)",
        cmd: "System Settings → Accessibility → Pointer Control → Trackpad Options → Three Finger Drag",
        flags: [
          ["Three Finger Drag", "Move windows or select text with 3 fingers without clicking down on the trackpad"]
        ],
        tip: "Best hidden trackpad setting",
        tags: ["drag", "three-finger", "accessibility", "ergonomic"]
      },
      {
        id: "horizontal-scroll-shift",
        mode: "MOUSE / PAD",
        modeClass: "mode-v",
        desc: "Scroll horizontally with any vertical mouse scroll wheel or switch Mission Control apps",
        cmd: "Hold ⇧ Shift + Scroll Wheel   |   2-Finger Scroll on App Cluster in Mission Control",
        flags: [
          ["⇧ + Scroll Wheel", "Convert vertical mouse wheel movement into horizontal scrolling"],
          ["2-Finger Swipe Up on cluster", "In Mission Control, swipe up with 2 fingers over grouped windows to fan them out"]
        ],
        tags: ["scroll", "horizontal", "mouse", "wheel", "mission-control"]
      }
    ]
  },
  {
    id: "darwin-cli",
    badge: "cli",
    title: "macOS Clipboard, Open & Spotlight CLI",
    subtitle: "pbcopy, pbpaste, open, mdfind, mdls, qlmanage & terminal-to-GUI bridges",
    commands: [
      {
        id: "pbcopy-pbpaste",
        mode: "DARWIN CLI",
        modeClass: "mode-i",
        desc: "Pipe command output into macOS system clipboard or paste clipboard into pipeline",
        cmd: "cat ~/.ssh/id_ed25519.pub | pbcopy   |   pbpaste | jq . > data.json",
        flags: [
          ["pbcopy", "Read stdin and place into macOS pasteboard (clipboard)"],
          ["pbpaste", "Write current macOS pasteboard contents to stdout"],
          ["pbpaste | pbcopy", "Strip rich-text formatting from current clipboard"]
        ],
        tip: "Zero-mouse clipboard piping",
        tags: ["clipboard", "pbcopy", "pbpaste", "copy", "paste", "ssh"]
      },
      {
        id: "open-command",
        mode: "DARWIN CLI",
        modeClass: "mode-i",
        desc: "Open files, URLs, folders in Finder, or launch specific GUI applications from Terminal",
        cmd: "open .   |   open -R file.txt   |   open -a 'Visual Studio Code' .   |   open -t notes.md",
        flags: [
          ["open .", "Open current working directory in Finder"],
          ["-R <file>", "Reveal and highlight specific file inside Finder"],
          ["-a <App>", "Open file/dir with specified macOS application"],
          ["-t / -e", "Open file in default text editor / TextEdit"],
          ["-n", "Launch a fresh new instance of the application"]
        ],
        tags: ["open", "finder", "reveal", "launch", "app", "gui"]
      },
      {
        id: "mdfind-spotlight-cli",
        mode: "DARWIN CLI",
        modeClass: "mode-i",
        desc: "Query the macOS Spotlight index from Terminal (instantaneous vs find)",
        cmd: "mdfind -name 'invoice'   |   mdfind -onlyin ~/Work 'kMDItemTextContent == \"TODO\"c'",
        flags: [
          ["-name <str>", "Instant filename search using Spotlight database"],
          ["-onlyin <dir>", "Restrict Spotlight search to directory subtree"],
          ["-0 | xargs -0", "Null-delimited output for safe piping"],
          ["mdls <file>", "Inspect all indexed Spotlight metadata attributes of a file"]
        ],
        tip: "100x faster than find /",
        tags: ["mdfind", "mdls", "spotlight", "search", "index", "metadata"]
      },
      {
        id: "qlmanage-sips-say",
        mode: "DARWIN CLI",
        modeClass: "mode-i",
        desc: "Trigger Quick Look from Terminal, batch resize/convert images via sips, or speak alerts",
        cmd: "qlmanage -p diagram.svg   |   sips -Z 1200 *.png   |   long_build && say 'Build done'",
        flags: [
          ["qlmanage -p", "Pop open a Quick Look preview window directly from shell"],
          ["sips -Z 1200", "Resize image(s) so max dimension is 1200px (built-in, no ImageMagick needed)"],
          ["sips -s format jpeg in.heic --out out.jpg", "Convert HEIC/PNG to JPEG natively"],
          ["say / afplay", "Synthesize speech alert / play audio file from CLI"]
        ],
        tags: ["quicklook", "qlmanage", "sips", "image", "resize", "heic", "say", "audio"]
      }
    ]
  },
  {
    id: "homebrew",
    badge: "brew",
    title: "Homebrew & Package Management",
    subtitle: "CLI formulae, GUI casks, cleanup, dependency trees, Brewfiles & background services",
    commands: [
      {
        id: "brew-install-casks",
        mode: "HOMEBREW",
        modeClass: "mode-c",
        desc: "Search and install CLI packages (formulae) or macOS GUI applications (casks)",
        cmd: "brew search ripgrep   |   brew install jq fd ripgrep   |   brew install --cask ghostty",
        flags: [
          ["brew install <pkg>", "Install CLI formula into /opt/homebrew"],
          ["--cask", "Install native macOS .app bundle into /Applications"],
          ["brew info <pkg>", "Show version, dependencies, caveats & analytics"]
        ],
        tags: ["brew", "install", "cask", "app", "package", "search"]
      },
      {
        id: "brew-update-cleanup",
        mode: "HOMEBREW",
        modeClass: "mode-c",
        desc: "Update Homebrew, upgrade outdated packages/casks, and reclaim disk space",
        cmd: "brew update && brew upgrade --greedy   |   brew autoremove && brew cleanup -s",
        flags: [
          ["--greedy", "Also upgrade casks that have auto-update enabled"],
          ["brew autoremove", "Uninstall orphaned dependencies no longer needed"],
          ["brew cleanup -s", "Remove old bottle downloads & scrub cache"],
          ["brew outdated", "List packages with available updates before upgrading"]
        ],
        tip: "Reclaims GBs of cache",
        tags: ["update", "upgrade", "cleanup", "autoremove", "cache", "outdated"]
      },
      {
        id: "brew-services-bundle",
        mode: "HOMEBREW",
        modeClass: "mode-c",
        desc: "Manage background launchctl services (Postgres, Redis) or export a reproducible Brewfile",
        cmd: "brew services list   |   brew services restart postgresql@16   |   brew bundle dump --describe",
        flags: [
          ["brew services start/stop/restart", "Manage launchd background service for a formula"],
          ["brew bundle dump --describe", "Export all installed taps, formulae, casks & MAS apps to ./Brewfile"],
          ["brew bundle install", "Install everything declared in a Brewfile on a new Mac"]
        ],
        tip: "Backup setup via Brewfile",
        tags: ["services", "brewfile", "bundle", "daemon", "backup", "migrate"]
      },
      {
        id: "brew-deps-doctor",
        mode: "HOMEBREW",
        modeClass: "mode-c",
        desc: "Inspect dependency tree, see what depends on a package, or diagnose system issues",
        cmd: "brew deps --tree --installed   |   brew uses --installed openssl@3   |   brew doctor",
        flags: [
          ["deps --tree --installed", "Render ASCII dependency tree of installed formulae"],
          ["uses --installed <pkg>", "Show which installed packages depend on <pkg>"],
          ["brew leaves", "List top-level packages not required as dependencies by anything else"]
        ],
        tags: ["dependencies", "tree", "leaves", "doctor", "uses"]
      }
    ]
  },
  {
    id: "system-admin",
    badge: "sys",
    title: "System Defaults, Launchd, Power & Hardware",
    subtitle: "defaults, plutil, launchctl, caffeinate, pmset, sysctl & softwareupdate",
    commands: [
      {
        id: "caffeinate-pmset",
        mode: "DARWIN CLI",
        modeClass: "mode-i",
        desc: "Prevent Mac from sleeping during long tasks or inspect battery & sleep assertions",
        cmd: "caffeinate -dimsu   |   caffeinate -i make -j8   |   pmset -g batt   |   pmset -g assertions",
        flags: [
          ["caffeinate -dimsu", "Prevent display (-d), idle (-i), disk (-m), system (-s) sleep while running"],
          ["caffeinate -t 3600", "Keep Mac awake for 1 hour (3600 seconds)"],
          ["pmset -g batt", "Show battery percentage, cycle status, and power draw"],
          ["pmset -g assertions", "List processes currently blocking display or system sleep"]
        ],
        tip: "Wrap long builds in caffeinate",
        tags: ["sleep", "awake", "caffeinate", "battery", "pmset", "power"]
      },
      {
        id: "defaults-plutil",
        mode: "DARWIN CLI",
        modeClass: "mode-i",
        desc: "Read, search, or modify macOS .plist preference files from Terminal",
        cmd: "defaults domains   |   defaults find TrackpadThreeFingerDrag   |   plutil -p file.plist",
        flags: [
          ["defaults find <word>", "Search all preference domains for keys/values matching <word>"],
          ["defaults read <domain>", "Dump current settings for an app domain"],
          ["plutil -p <file.plist>", "Pretty-print binary or XML property list file"],
          ["plutil -convert xml1", "Convert binary .plist to human-editable XML"]
        ],
        tags: ["defaults", "plist", "plutil", "preferences", "config"]
      },
      {
        id: "launchctl-modern",
        mode: "DARWIN CLI",
        modeClass: "mode-i",
        desc: "Inspect, bootstrap, or restart macOS launchd user agents and system daemons",
        cmd: "launchctl list | grep -v com.apple   |   launchctl kickstart -k gui/$(id -u)/<service>",
        flags: [
          ["launchctl list", "List loaded jobs with PID and last exit status"],
          ["kickstart -k gui/$(id -u)/...", "Immediately kill and restart a running user agent"],
          ["bootstrap / bootout", "Modern replacement for deprecated launchctl load / unload"]
        ],
        tags: ["launchctl", "launchd", "daemon", "agent", "service", "systemd"]
      },
      {
        id: "hardware-swvers-update",
        mode: "DARWIN CLI",
        modeClass: "mode-i",
        desc: "Check macOS build version, Apple Silicon CPU cores/RAM, or install CLI updates",
        cmd: "sw_vers   |   system_profiler SPHardwareDataType   |   softwareupdate -l   |   xcode-select --install",
        flags: [
          ["sw_vers", "Print ProductName, ProductVersion & BuildVersion"],
          ["sysctl -n machdep.cpu.brand_string", "Print exact Apple M-series or Intel chip model"],
          ["softwareupdate -ia", "Download and install all available macOS system updates"],
          ["xcode-select --install", "Install Xcode Command Line Tools (git, clang, make)"]
        ],
        tags: ["version", "hardware", "cpu", "apple-silicon", "update", "xcode"]
      }
    ]
  },
  {
    id: "net-disk-sec",
    badge: "net",
    title: "Networking, Disks, Gatekeeper & Keychain",
    subtitle: "DNS flush, networkQuality, lsof ports, diskutil APFS, xattr quarantine & security",
    commands: [
      {
        id: "dns-flush-and-lookup",
        mode: "NETWORK",
        modeClass: "mode-t",
        desc: "Flush macOS DNS cache, inspect active resolver config, or run Apple's network speed test",
        cmd: "dscacheutil -flushcache; killall -HUP mDNSResponder   |   scutil --dns   |   networkQuality",
        flags: [
          ["killall -HUP mDNSResponder", "Flush macOS DNS resolver cache immediately"],
          ["scutil --dns", "Show exact DNS resolvers (including VPN/Tailscale split-DNS order)"],
          ["networkQuality -v", "Built-in macOS uplink/downlink throughput & responsiveness (RPM) test"]
        ],
        tip: "networkQuality is built-in!",
        tags: ["dns", "flush", "speedtest", "network", "scutil", "vpn"]
      },
      {
        id: "ip-ports-wifi",
        mode: "NETWORK",
        modeClass: "mode-t",
        desc: "Get local LAN IP, list listening TCP ports (`lsof`), or manage interfaces via `networksetup`",
        cmd: "ipconfig getifaddr en0   |   lsof -iTCP -sTCP:LISTEN -n -P   |   networksetup -listallhardwareports",
        flags: [
          ["ipconfig getifaddr en0", "Print clean LAN IPv4 address of primary interface (en0)"],
          ["lsof -i :3000", "Find which process is occupying port 3000 on macOS"],
          ["networksetup -setdnsservers Wi-Fi 2606:4700:4700::1111 2001:4860:4860::8888", "Set IPv6 DNS servers for Wi-Fi from CLI"]
        ],
        tags: ["ip", "ports", "lsof", "listen", "wifi", "en0", "networksetup"]
      },
      {
        id: "gatekeeper-quarantine-codesign",
        mode: "SECURITY",
        modeClass: "mode-t",
        desc: "Fix 'App is damaged / unverified developer' by clearing quarantine xattr or verify signature",
        cmd: "xattr -dr com.apple.quarantine /Applications/App.app   |   codesign -dv --verbose=4 /Applications/App.app",
        flags: [
          ["xattr -dr com.apple.quarantine", "Recursively strip Gatekeeper download quarantine flag from an app/binary"],
          ["codesign -dv --verbose=4", "Inspect Developer Team ID and code signature of an app"],
          ["spctl --assess -vv /Applications/App.app", "Test whether Gatekeeper approves an application"]
        ],
        tip: "Fixes unsigned CLI/GUI apps",
        tags: ["quarantine", "xattr", "gatekeeper", "damaged", "codesign", "unverified"]
      },
      {
        id: "keychain-security-cli",
        mode: "SECURITY",
        modeClass: "mode-t",
        desc: "Retrieve saved Wi-Fi password or store/fetch secrets in macOS Keychain from CLI",
        cmd: "security find-generic-password -D 'AirPort network password' -wa 'MyWiFi'",
        flags: [
          ["-wa <name>", "Print only the raw password string (-w) for account <name>"],
          ["security add-generic-password -a $USER -s my_api_key -w 'secret'", "Save a secret into login Keychain"]
        ],
        tags: ["keychain", "password", "wifi", "secret", "security"]
      },
      {
        id: "diskutil-apfs-dmg",
        mode: "STORAGE",
        modeClass: "mode-t",
        desc: "List disks and APFS containers, safely eject external drives, or mount .dmg images",
        cmd: "diskutil list   |   diskutil apfs list   |   diskutil eject /dev/disk4   |   hdiutil attach app.dmg",
        flags: [
          ["diskutil list", "Show all physical disks, partitions, and synthesized APFS containers"],
          ["diskutil unmountDisk force /dev/disk4", "Force unmount stubborn external drive"],
          ["hdiutil attach / detach", "Mount or unmount a .dmg or .iso disk image from CLI"]
        ],
        tags: ["diskutil", "apfs", "eject", "unmount", "dmg", "hdiutil", "usb"]
      }
    ]
  }
];

// Interactive `defaults write` Tweaks Database
const DEFAULTS_TWEAKS = {
  finder: [
    {
      id: "dotfiles",
      label: "Show hidden dotfiles (.git, .env)",
      desc: "Show hidden dotfiles in Finder windows",
      apply: "defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder",
      revert: "defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"
    },
    {
      id: "extensions",
      label: "Show all filename extensions (.txt, .png)",
      desc: "Always display full file extensions in Finder",
      apply: "defaults write NSGlobalDomain AppleShowAllExtensions -bool true && killall Finder",
      revert: "defaults write NSGlobalDomain AppleShowAllExtensions -bool false && killall Finder"
    },
    {
      id: "pathbar",
      label: "Show Path Bar & Status Bar at bottom",
      desc: "Enable breadcrumb Path Bar and free space Status Bar in Finder",
      apply: "defaults write com.apple.finder ShowPathbar -bool true && defaults write com.apple.finder ShowStatusBar -bool true && killall Finder",
      revert: "defaults write com.apple.finder ShowPathbar -bool false && defaults write com.apple.finder ShowStatusBar -bool false && killall Finder"
    },
    {
      id: "folders-top",
      label: "Keep folders on top when sorting by name",
      desc: "Group directories before files when sorting alphabetically",
      apply: "defaults write com.apple.finder _FXSortFoldersFirst -bool true && killall Finder",
      revert: "defaults write com.apple.finder _FXSortFoldersFirst -bool false && killall Finder"
    },
    {
      id: "search-current",
      label: "Default Finder search to Current Folder",
      desc: "Search current directory instead of 'This Mac' by default",
      apply: "defaults write com.apple.finder FXDefaultSearchScope -string 'SCcf' && killall Finder",
      revert: "defaults delete com.apple.finder FXDefaultSearchScope && killall Finder"
    }
  ],
  dock: [
    {
      id: "autohide-Zero",
      label: "Instant Dock auto-hide (0s delay & fast anim)",
      desc: "Remove the 0.5s hover delay before the auto-hidden Dock appears",
      apply: "defaults write com.apple.dock autohide-delay -float 0 && defaults write com.apple.dock autohide-time-modifier -float 0.15 && killall Dock",
      revert: "defaults delete com.apple.dock autohide-delay && defaults delete com.apple.dock autohide-time-modifier && killall Dock"
    },
    {
      id: "show-recents",
      label: "Hide recent apps section in Dock",
      desc: "Disable suggested/recent applications section in the Dock",
      apply: "defaults write com.apple.dock show-recents -bool false && killall Dock",
      revert: "defaults write com.apple.dock show-recents -bool true && killall Dock"
    },
    {
      id: "spacer-tile",
      label: "Add a blank spacer tile to the Dock",
      desc: "Insert a movable blank separator icon into the Dock",
      apply: "defaults write com.apple.dock persistent-apps -array-add '{tile-data={}; tile-type=\"spacer-tile\";}' && killall Dock",
      revert: "# Drag the spacer tile out of the Dock to remove it"
    },
    {
      id: "mru-spaces",
      label: "Stop rearranging Mission Control Spaces automatically",
      desc: "Keep Desktop Spaces in fixed numeric order instead of most-recently-used",
      apply: "defaults write com.apple.dock mru-spaces -bool false && killall Dock",
      revert: "defaults write com.apple.dock mru-spaces -bool true && killall Dock"
    }
  ],
  global: [
    {
      id: "keyrepeat",
      label: "Blazing-fast keyboard repeat rate (for Vim/coding)",
      desc: "Set ultra-low InitialKeyRepeat (15) and fast KeyRepeat (1) — log out/in to apply",
      apply: "defaults write NSGlobalDomain KeyRepeat -int 1 && defaults write NSGlobalDomain InitialKeyRepeat -int 15",
      revert: "defaults delete NSGlobalDomain KeyRepeat && defaults delete NSGlobalDomain InitialKeyRepeat"
    },
    {
      id: "press-and-hold",
      label: "Disable press-and-hold accent menu (enable key repeat)",
      desc: "Allow holding h/j/k/l keys to repeat in VS Code / apps instead of showing vowel popup",
      apply: "defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool false",
      revert: "defaults write NSGlobalDomain ApplePressAndHoldEnabled -bool true"
    },
    {
      id: "expand-panels",
      label: "Auto-expand Save & Print dialogs by default",
      desc: "Always open full folder browser in Save dialogs without clicking the chevron",
      apply: "defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true && defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode2 -bool true",
      revert: "defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool false && defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode2 -bool false"
    }
  ],
  screencapture: [
    {
      id: "shadow",
      label: "Disable drop shadow on window screenshots",
      desc: "Omit the wide alpha drop-shadow border when capturing windows with ⇧⌘4 + Space",
      apply: "defaults write com.apple.screencapture disable-shadow -bool true && killall SystemUIServer",
      revert: "defaults write com.apple.screencapture disable-shadow -bool false && killall SystemUIServer"
    },
    {
      id: "location",
      label: "Save screenshots to ~/Pictures/Screenshots",
      desc: "Keep Desktop clean by routing screenshots to ~/Pictures/Screenshots",
      apply: "mkdir -p ~/Pictures/Screenshots && defaults write com.apple.screencapture location ~/Pictures/Screenshots && killall SystemUIServer",
      revert: "defaults write com.apple.screencapture location ~/Desktop && killall SystemUIServer"
    },
    {
      id: "format-jpg",
      label: "Save screenshots as lightweight JPEG instead of PNG",
      desc: "Change default screenshot file format to jpg (supports png, jpg, pdf, heic)",
      apply: "defaults write com.apple.screencapture type -string 'jpg' && killall SystemUIServer",
      revert: "defaults write com.apple.screencapture type -string 'png' && killall SystemUIServer"
    }
  ],
  desktopservices: [
    {
      id: "dsstore",
      label: "Stop creating .DS_Store files on network & USB drives",
      desc: "Prevent Finder from littering SMB/NFS shares and thumb drives with .DS_Store files",
      apply: "defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true && defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true",
      revert: "defaults delete com.apple.desktopservices DSDontWriteNetworkStores && defaults delete com.apple.desktopservices DSDontWriteUSBStores"
    }
  ]
};

// Application State (shares theme & compact preference across all sheets)
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("macos_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const emptyStateEl = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

let toastTimer = null;

function showToast(msg) {
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

// Syntax Highlighting for macOS Shortcuts & Darwin CLI Commands
function highlightMacCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /([⌘⌥⌃⇧🌐⎋⌫↩]+[A-Za-z0-9`.\-/←→↑↓]*)|(\s\|\s)|(\b(?:defaults|brew|open|pbcopy|pbpaste|mdfind|mdls|qlmanage|sips|say|afplay|caffeinate|pmset|plutil|launchctl|sw_vers|system_profiler|sysctl|softwareupdate|xcode-select|dscacheutil|killall|scutil|networkQuality|ipconfig|lsof|networksetup|xattr|codesign|spctl|security|diskutil|hdiutil|sudo)\b)|(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9-]+)/g,
    (match, modChord, sep, cliCmd, flagPart) => {
      if (modChord) {
        return `<span class="tok-flag">${modChord}</span>`;
      }
      if (sep) {
        return `<span class="tok-comment">${sep}</span>`;
      }
      if (cliCmd) {
        return `<span class="tok-cmd">${cliCmd}</span>`;
      }
      if (flagPart) {
        return `<span class="tok-flag">${flagPart}</span>`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = MACOS_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of MACOS_CHEAT_SHEET_DATA) {
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

  for (const section of MACOS_CHEAT_SHEET_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
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
                  title="${isSaved ? "Remove bookmark" : "Bookmark item"}"
                  aria-label="Bookmark item"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(copyTarget)}" title="Click to copy">
              <code class="cmd-code">${highlightMacCmd(item.cmd)}</code>
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

// Interactive `defaults write` Builder
function initDefaultsBuilder() {
  const domainEl = document.getElementById("def-domain");
  const tweakEl = document.getElementById("def-tweak");
  const actionEl = document.getElementById("def-action");
  const outputEl = document.getElementById("defaults-cmd-output");
  const previewBox = document.getElementById("defaults-preview-box");
  const copyBtn = document.getElementById("defaults-copy-btn");
  const meaningEl = document.getElementById("defaults-meaning-text");
  const presetBtns = document.querySelectorAll(".def-preset");

  function populateTweaks(domainKey, selectedTweakId) {
    const list = DEFAULTS_TWEAKS[domainKey] || [];
    tweakEl.innerHTML = list
      .map(
        (t) =>
          `<option value="${t.id}" ${t.id === selectedTweakId ? "selected" : ""}>${escapeHtml(t.label)}</option>`
      )
      .join("");
  }

  function updateDefaultsPreview() {
    const domainKey = domainEl.value;
    const list = DEFAULTS_TWEAKS[domainKey] || [];
    const current = list.find((t) => t.id === tweakEl.value) || list[0];
    if (!current) return;

    const cmd = actionEl.value === "revert" ? current.revert : current.apply;
    outputEl.innerHTML = highlightMacCmd(cmd);
    previewBox.dataset.copy = cmd;
    meaningEl.textContent = current.desc;

    presetBtns.forEach((btn) => {
      const active = btn.dataset.domain === domainKey && btn.dataset.tweak === current.id;
      btn.classList.toggle("active", active);
    });
  }

  domainEl.addEventListener("change", () => {
    populateTweaks(domainEl.value);
    updateDefaultsPreview();
  });

  tweakEl.addEventListener("change", updateDefaultsPreview);
  actionEl.addEventListener("change", updateDefaultsPreview);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      domainEl.value = btn.dataset.domain;
      populateTweaks(btn.dataset.domain, btn.dataset.tweak);
      actionEl.value = "apply";
      updateDefaultsPreview();
    });
  });

  previewBox.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  populateTweaks("finder", "dotfiles");
  updateDefaultsPreview();
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

function applyDensity(compact) {
  state.compact = compact;
  document.body.classList.toggle("compact-mode", compact);
  densityToggleBtn.classList.toggle("active", compact);
  densityLabel.textContent = compact ? "Detailed" : "Compact";
  localStorage.setItem("linux_cs_compact", compact ? "1" : "0");
  packMasonry();
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
        showToast("Removed from saved items");
      } else {
        state.bookmarks.add(id);
        showToast("Saved to bookmarks");
      }
      localStorage.setItem("macos_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      renderSections();
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    renderSections();
  });

  densityToggleBtn.addEventListener("click", () => {
    applyDensity(!state.compact);
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
applyDensity(state.compact);
renderCategoryTabs();
renderSections();
initDefaultsBuilder();
initMiniTabs();
initEvents();
