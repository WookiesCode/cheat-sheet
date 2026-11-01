const OMARCHY_CHEAT_SHEET_DATA = [
  {
    id: "menus-apps",
    badge: "apps",
    title: "Menus, Launchers & App Shortcuts",
    subtitle: "Omarchy menu, terminals, browser, file manager, coding agents, TUIs & web apps",
    commands: [
      {
        id: "om-core-menus-launcher",
        mode: "MENUS",
        modeClass: "mode-n",
        desc: "Open App Launcher, Omarchy Main Menu, Keybindings guide, System/Power menu, or Theme/Wallpaper switchers",
        cmd: "Super + Space (Launcher)   |   Super + Alt + Space (Apps)   |   Super + K (Keybinds)   |   Super + Esc (System)",
        flags: [
          ["Super + Space", "Open Omarchy application & command launcher"],
          ["Super + K", "Open searchable keybindings reference overlay (Super+Alt+K = Tmux, Super+Ctrl+K = Herdr)"],
          ["Super + Escape", "Open System Menu (Lock, Suspend, Reboot, Shutdown, Update)"],
          ["Super + Ctrl + T", "Open Theme Menu (also Super+Shift+Ctrl+Space)"],
          ["Super + Ctrl + W / Space", "Open Background Wallpaper switcher"]
        ],
        tip: "Super+K shows all live bindings",
        tags: ["menu", "launcher", "keybindings", "system", "theme", "wallpaper"]
      },
      {
        id: "om-terminals-browser-files",
        mode: "CORE APPS",
        modeClass: "mode-n",
        desc: "Launch Terminal, Tmux session, Herdr, Browser (normal/private), File Manager, or Neovim Editor",
        cmd: "Super + Return (Term)   |   Super + Alt + Return (Tmux)   |   Super + Shift + Return (Browser)   |   Super + Shift + F (Files)",
        flags: [
          ["Super + Return", "Launch default Terminal (Alacritty / Ghostty / Foot / Kitty)"],
          ["Super + Alt + Return / Ctrl + Return", "Launch Terminal directly into Tmux / Herdr"],
          ["Super + Shift + B / Shift+Alt+B", "Launch Browser / Private Browser window"],
          ["Super + Shift + F / Shift+Alt+F", "Open Nautilus File Manager / Open File Manager in active terminal's CWD"],
          ["Super + Shift + N", "Launch default Editor (Neovim)"]
        ],
        tip: "Super+Shift+Alt+F opens CWD in Files",
        tags: ["terminal", "tmux", "herdr", "browser", "files", "nautilus", "editor", "neovim"]
      },
      {
        id: "om-tuis-utilities-agents",
        mode: "TUIS & TOOLS",
        modeClass: "mode-v",
        desc: "Launch Coding Agent picker, btop Activity Monitor, Lazydocker, Calculator, 1Password, Obsidian, or Music",
        cmd: "Super + Shift + Ctrl + A (Agent)   |   Super + Shift + T (btop)   |   Super + Shift + D (Docker)   |   Super + Shift + / (1Password)",
        flags: [
          ["Super + Shift + Ctrl + A", "Pick & launch AI Coding Agent (`omarchy-agent --pick`)"],
          ["Super + Shift + T / D", "Open btop system activity TUI / Lazydocker container TUI"],
          ["Super + Shift + Q", "Open Calculator (`omacalc`)"],
          ["Super + Shift + M / Shift+Alt+M", "Launch Spotify / `cliamp` Music TUI"],
          ["Super + Shift + O / W", "Launch Obsidian / Omawrite distraction-free writer"]
        ],
        tags: ["agent", "btop", "docker", "lazydocker", "calculator", "1password", "obsidian", "music"]
      },
      {
        id: "om-webapps-shortcuts",
        mode: "WEB APPS",
        modeClass: "mode-v",
        desc: "Launch dedicated Web Apps (ChatGPT, Grok, Email, Calendar, YouTube, WhatsApp, Messages, Maps, Photos, X)",
        cmd: "Super + Shift + A (ChatGPT)   |   Super + Shift + E (Email)   |   Super + Shift + C (Calendar)   |   Super + Shift + Y (YouTube)",
        flags: [
          ["Super + Shift + A / Shift+Alt+A", "ChatGPT / Grok web app"],
          ["Super + Shift + E / Shift+Alt+E", "Email inbox / Compose new email"],
          ["Super + Shift + G / Shift+Alt+G / Shift+Ctrl+G", "Signal / WhatsApp / Google Messages"],
          ["Super + Shift + P / S / X", "Google Photos / Google Maps / X (Shift+Alt+X = X Post)"],
          ["Shift + Alt + L / D (Inside Web App)", "Copy current Web App URL / Download video with yt-dlp"]
        ],
        tip: "Shift+Alt+L copies URL inside any Web App",
        tags: ["webapp", "chatgpt", "grok", "email", "gmail", "calendar", "youtube", "whatsapp", "signal"]
      }
    ]
  },
  {
    id: "windows-tiling",
    badge: "win",
    title: "Window Management, Tiling, Sizing & Opacity",
    subtitle: "Focus, swap, fullscreen modes, float/pop-out, resize increments & visual glass/gap toggles",
    commands: [
      {
        id: "om-window-close-fullscreen-float",
        mode: "WINDOWS",
        modeClass: "mode-n",
        desc: "Close window, toggle fullscreen/tiled-fullscreen, float, or pop-out (float + pin on top)",
        cmd: "Super + W (or Q)   |   Super + F (Fullscreen)   |   Super + Ctrl + F (Tiled Full)   |   Super + T (Float)   |   Super + O (Pop-out)",
        flags: [
          ["Super + W / Super + Q", "Close active window (`Ctrl + Alt + Delete` closes ALL open windows)"],
          ["Super + F / Super + Alt + F", "True Fullscreen / Full-width window"],
          ["Super + Ctrl + F", "Toggle Tiled Fullscreen (keeps window border/bar integration)"],
          ["Super + T / Super + O", "Toggle floating/tiling / Pop window out (fixed floating PIP pinned across workspaces)"],
          ["Super + J / P / M", "Toggle split direction (horiz/vert) / Pseudo-tile / Minimize window to dock"]
        ],
        tip: "Super+O pins video/PIP window on top",
        tags: ["close", "fullscreen", "float", "pop", "pip", "split", "minimize"]
      },
      {
        id: "om-window-focus-swap",
        mode: "NAVIGATION",
        modeClass: "mode-n",
        desc: "Move focus between tiled windows, swap window positions, or cycle workspace layouts",
        cmd: "Super + ←/→/↑/↓ (Focus)   |   Super + Shift + ←/→/↑/↓ (Swap)   |   Alt + Tab   |   Super + L (Layout)",
        flags: [
          ["Super + Arrow Keys", "Move focus left, right, up, or down"],
          ["Super + Shift + Arrow Keys", "Swap active window with neighbor in that direction"],
          ["Alt + Tab / Shift + Alt + Tab", "Focus next / previous window and bring floating windows to top"],
          ["Super + L / Super + Alt + L", "Cycle workspace layout forward / backward"]
        ],
        tags: ["focus", "swap", "move", "arrows", "layout", "alt-tab"]
      },
      {
        id: "om-window-resize-mouse-keys",
        mode: "RESIZING",
        modeClass: "mode-n",
        desc: "Resize or move windows with mouse drag or keyboard increments (normal, fine `Alt`, or coarse `Ctrl`)",
        cmd: "Super + Left-Drag (Move)   |   Super + Right-Drag (Resize)   |   Super + -/= (Width)   |   Super + Shift + -/= (Height)",
        flags: [
          ["Super + - / = ", "Expand / Shrink window horizontally (add Alt for tiny steps, Ctrl for huge steps)"],
          ["Super + Shift + - / =", "Shrink / Expand window vertically (add Alt for tiny steps, Ctrl for huge steps)"],
          ["Super + Alt + Home / Super + Home", "Save focused window's width / Restore saved window width"]
        ],
        tags: ["resize", "mouse", "drag", "width", "height", "expand", "shrink"]
      },
      {
        id: "om-visual-toggles-gaps-opacity",
        mode: "APPEARANCE",
        modeClass: "mode-v",
        desc: "Toggle window transparency/glass, window gaps, top bar visibility, or square aspect ratio on the fly",
        cmd: "Super + Backspace (Opacity)   |   Super + Shift + Backspace (Gaps)   |   Super + Shift + Space (Top Bar)",
        flags: [
          ["Super + Backspace", "Toggle transparency on focused window (opaque ↔ transparent/glassy)"],
          ["Super + Shift + Backspace", "Toggle workspace window gaps between default gaps and zero-gap edge-to-edge"],
          ["Super + Ctrl + Backspace", "Toggle single-window square aspect ratio"],
          ["Super + Shift + Space", "Show or hide the top Omarchy Quickshell bar"]
        ],
        tip: "Super+Shift+Backspace = instant zero-gaps",
        tags: ["transparency", "opacity", "gaps", "bar", "hide", "aspect"]
      }
    ]
  },
  {
    id: "workspaces-groups",
    badge: "ws",
    title: "Workspaces, Scratchpad, Quake & Groups",
    subtitle: "Workspaces 1–10, Quake drop-down terminal, scratchpad, window tab groups & multi-monitor",
    commands: [
      {
        id: "om-workspaces-switch-move",
        mode: "WORKSPACES",
        modeClass: "mode-n",
        desc: "Switch workspaces 1–10, move windows (or move silently without following), and cycle workspaces",
        cmd: "Super + 1..0   |   Super + Shift + 1..0 (Move)   |   Super + Shift + Alt + 1..0 (Silent)   |   Super + Tab",
        flags: [
          ["Super + 1..9, 0", "Switch to Workspace 1 through 10"],
          ["Super + Shift + 1..0", "Move active window to Workspace 1–10 and follow it"],
          ["Super + Shift + Alt + 1..0", "Send active window silently to Workspace 1–10 while staying on current workspace"],
          ["Super + Tab / Shift+Tab / Ctrl+Tab", "Next workspace / Previous workspace / Back-and-forth to former workspace"],
          ["Super + Mouse Scroll", "Scroll active workspace forward / backward"]
        ],
        tip: "Super+Ctrl+Tab jumps to last workspace",
        tags: ["workspace", "switch", "move", "silent", "tab", "scroll"]
      },
      {
        id: "om-scratchpad-quake",
        mode: "SCRATCHPAD",
        modeClass: "mode-v",
        desc: "Toggle the floating Scratchpad workspace or Quake-style drop-down console",
        cmd: "Super + S (Scratchpad)   |   Super + Alt + S (Send to Scratch)   |   Super + ~ (Quake)   |   Super + Shift + ~ (Send to Quake)",
        flags: [
          ["Super + S / Super + Alt + S", "Toggle scratchpad overlay / Move focused window into the scratchpad"],
          ["Super + ~ (Grave) / Super + Shift + ~", "Toggle Quake console overlay / Move focused window into Quake slot"]
        ],
        tip: "Great for persistent chat or terminal",
        tags: ["scratchpad", "quake", "dropdown", "overlay", "tilde", "grave"]
      },
      {
        id: "om-window-groups-tabs",
        mode: "WINDOW GROUPS",
        modeClass: "mode-v",
        desc: "Group multiple windows into a tabbed container and switch or rearrange grouped tabs",
        cmd: "Super + G (Group)   |   Super + Alt + G (Ungroup)   |   Super + Alt + ←/→/↑/↓ (Join Group)   |   Super + Alt + Tab",
        flags: [
          ["Super + G / Super + Alt + G", "Turn active window into a tabbed group / Pop active window out of group"],
          ["Super + Alt + ←/→/↑/↓", "Push active window into adjacent group on left/right/top/bottom"],
          ["Super + Alt + 1..5", "Switch directly to tab 1–5 inside the active group"],
          ["Super + Alt + Tab / Super + Ctrl + ←/→", "Cycle next/prev window in group"]
        ],
        tags: ["group", "tabs", "tabbed", "stack", "container", "ungroup"]
      },
      {
        id: "om-multimonitor-scaling",
        mode: "MONITORS",
        modeClass: "mode-n",
        desc: "Move windows or workspaces across monitors, adjust display scaling, or toggle laptop clamshell display",
        cmd: "Ctrl + Alt + Tab (Focus Mon)   |   Super + Shift + Ctrl + ←/→ (Move Win)   |   Super + Shift + Alt + ←/→ (Move WS)   |   Super + /",
        flags: [
          ["Ctrl + Alt + Tab", "Move focus to next physical monitor"],
          ["Super + Shift + Ctrl + ←/→/↑/↓", "Move active window to adjacent monitor"],
          ["Super + Shift + Alt + ←/→/↑/↓", "Move entire active workspace to adjacent monitor"],
          ["Super + / and Super + Alt + /", "Increase / Decrease focused monitor UI scaling factor"],
          ["Super + Ctrl + Delete / Ctrl+Alt+Delete", "Toggle built-in laptop display on/off / Toggle laptop display mirroring"]
        ],
        tags: ["monitor", "display", "scaling", "mirror", "laptop", "clamshell"]
      }
    ]
  },
  {
    id: "panels-capture",
    badge: "bar",
    title: "Quickshell Bar, Capture, OCR, Dictation & Reminders",
    subtitle: "Audio/Network/Bluetooth panels, screenshots, screen recording, OCR, clipboard & voice dictation",
    commands: [
      {
        id: "om-quickshell-bar-panels",
        mode: "BAR PANELS",
        modeClass: "mode-n",
        desc: "Open Quickshell status bar popovers directly from the keyboard (Audio, Bluetooth, Network, Display, Power, Clock)",
        cmd: "Super + Ctrl + A (Audio)   |   Super + Ctrl + B (BT)   |   Super + Ctrl + N (Net)   |   Super + Ctrl + D (Display)   |   Super + Ctrl + 1..9",
        flags: [
          ["Super + Ctrl + A / B / N / D / P", "Toggle Audio, Bluetooth, Network, Display, or Power panel"],
          ["Super + Ctrl + Alt + D / E", "Toggle Calendar/Clock panel / World Clock (`elsewhen`) panel"],
          ["Super + Ctrl + 1..9", "Toggle top-right bar icon #1 through #9 by position"]
        ],
        tags: ["panel", "bar", "quickshell", "audio", "bluetooth", "network", "wifi", "calendar", "power"]
      },
      {
        id: "om-capture-screenshot-record-ocr",
        mode: "CAPTURE & OCR",
        modeClass: "mode-t",
        desc: "Take region/window/fullscreen screenshots, record screen with webcam, extract text via OCR, or pick colors",
        cmd: "Print (Screenshot)   |   Alt + Print (Record)   |   Super + Ctrl + Print (OCR)   |   Super + Print (Color Picker)   |   Super + Ctrl + C",
        flags: [
          ["Print (or Super+Ctrl+Alt+C)", "Interactive region screenshot (during selection: Enter=focused window, Ctrl+Enter=fullscreen, Tab/Arrows=select window!)"],
          ["Alt + Print", "Start / Stop screen recording (`Super + Alt + [ / ]` resizes webcam PIP overlay)"],
          ["Super + Ctrl + Print", "Select screen region and extract text directly to clipboard via OCR (`omarchy-capture-text`)"],
          ["Super + Print", "Pick any pixel color on screen as `#RRGGBB` hex (`hyprpicker`)"],
          ["Super + Ctrl + S / .", "Open Share menu / Transcode media file (`omarchy-transcode`)"]
        ],
        tip: "Press Enter in Print mode to snap whole window!",
        tags: ["screenshot", "screenrecord", "ocr", "color-picker", "capture", "webcam", "share", "transcode"]
      },
      {
        id: "om-clipboard-dictation-emojis",
        mode: "INPUT & CLIP",
        modeClass: "mode-i",
        desc: "Universal terminal/GUI copy-paste, Clipboard History, Emoji picker, and Voice Dictation",
        cmd: "Super + C / V / X / A   |   Super + Ctrl + V (Clip History)   |   Super + Ctrl + E (Emojis)   |   F9 or Alt+RightAlt (Dictate)",
        flags: [
          ["Super + C / V", "Smart Copy/Paste: sends Ctrl+Shift+C/V inside terminals and Ctrl+C/V in regular GUI apps"],
          ["Super + Ctrl + V / E", "Open Clipboard Manager history / Emoji & symbol picker"],
          ["F9 (or Alt + Right Alt)", "Push-to-Talk voice dictation (hold while speaking); `Super + Ctrl + X` toggles hands-free dictation"],
          ["Super + I / Super + Shift + I", "Cycle keyboard input language forward / backward"]
        ],
        tip: "Super+C/V works in both Terminal & Browser!",
        tags: ["copy", "paste", "clipboard", "emoji", "dictation", "voice", "whisper", "voxtype"]
      },
      {
        id: "om-notifications-reminders-lock",
        mode: "NOTIFICATIONS",
        modeClass: "mode-c",
        desc: "Manage desktop notifications, set timed reminders, check status toasts, zoom screen, or lock system",
        cmd: "Super + , (Dismiss)   |   Super + Ctrl + R (Set Reminder)   |   Super + Ctrl + L (Lock)   |   Super + Ctrl + Z (Zoom)",
        flags: [
          ["Super + , / Super + Shift + ,", "Dismiss last notification / Dismiss all notifications"],
          ["Super + Shift + Alt + , / Ctrl+Alt+,", "Open notification history / Toggle Do-Not-Disturb notification silencing"],
          ["Super + Ctrl + R / Ctrl+Alt+R / Shift+Ctrl+R", "Set reminder / Show active reminders / Clear all reminders"],
          ["Super + Ctrl + Alt + T / B / W", "Pop up Time / Battery remaining / Weather notification toast"],
          ["Super + Ctrl + L / Super + Ctrl + I", "Lock screen immediately / Toggle idle auto-lock"]
        ],
        tags: ["notification", "dismiss", "dnd", "reminder", "lock", "idle", "zoom", "weather", "battery"]
      }
    ]
  },
  {
    id: "omarchy-cli-desktop",
    badge: "cli",
    title: "omarchy CLI: Themes, Bar, Toggles & Capture",
    subtitle: "Self-documenting omarchy <group> <action> commands for appearance, bar plugins & desktop control",
    commands: [
      {
        id: "cli-command-discovery",
        mode: "DISCOVERY",
        modeClass: "mode-n",
        desc: "Discover all available `omarchy` commands, group subcommands, JSON schemas, or system debug info",
        cmd: "omarchy commands   |   omarchy <group> --help   |   omarchy version   |   omarchy debug --no-sudo --print",
        flags: [
          ["omarchy commands", "List every documented command and summary (`--all` includes internal commands, `--json` outputs JSON)"],
          ["omarchy debug --no-sudo --print", "Print full non-interactive diagnostic report (always include `--no-sudo --print`!)"],
          ["cat $(which omarchy-theme-set)", "Inspect source of any underlying `/usr/bin/omarchy-*` script"]
        ],
        tip: "Always use --no-sudo --print with debug",
        tags: ["commands", "help", "version", "debug", "cli", "discover"]
      },
      {
        id: "cli-theme-font-bg",
        mode: "THEMING",
        modeClass: "mode-v",
        desc: "List and switch desktop themes, cycle background wallpapers, or change system monospace font",
        cmd: "omarchy theme list   |   omarchy theme set catppuccin   |   omarchy theme bg next   |   omarchy font set 'JetBrainsMono Nerd Font'",
        flags: [
          ["omarchy theme set <name>", "Atomically updates Hyprland, Quickshell bar, terminals, Neovim, btop, Ghostty, VS Code & browser theme"],
          ["omarchy theme current / refresh", "Print active theme name / Re-apply current theme templates"],
          ["omarchy font list / current / set", "List installed Nerd Fonts, check current font, or switch font across all terminals & UI"]
        ],
        tip: "Themes sync across Terminal, Nvim & Bar",
        tags: ["theme", "font", "background", "wallpaper", "catppuccin", "tokyonight"]
      },
      {
        id: "cli-toggles-window-modes",
        mode: "TOGGLES",
        modeClass: "mode-c",
        desc: "Toggle nightlight, idle lock, bar, animations, window gaps, or window transparency from CLI",
        cmd: "omarchy toggle nightlight   |   omarchy toggle idle   |   omarchy toggle bar   |   omarchy hyprland window transparency glassy",
        flags: [
          ["omarchy toggle <feature>", "Supports `nightlight`, `idle`, `bar`, `animations`, `notification-silencing`, `screensaver`, `suspend`, `touchpad`"],
          ["window transparency [opaque|transparent|glassy]", "Get or set window opacity profile (`window transparency toggle` flips current window)"],
          ["omarchy hyprland window gaps toggle", "Toggle global workspace gaps on/off"]
        ],
        tags: ["toggle", "nightlight", "idle", "animations", "transparency", "glassy", "gaps"]
      },
      {
        id: "cli-bar-plugins-reminders",
        mode: "BAR & PLUGINS",
        modeClass: "mode-c",
        desc: "Move/configure top bar widgets, clone built-in Quickshell plugins for customization, or set reminders",
        cmd: "omarchy bar move omarchy.clock --section right   |   omarchy plugin clone omarchy.workspaces   |   omarchy reminder 15 'Check build'",
        flags: [
          ["omarchy plugin clone <id>", "Copies packaged plugin into `~/.config/omarchy/plugins/` and switches `shell.json` to your editable copy"],
          ["omarchy reminder <min> '<msg>'", "Schedule a desktop reminder notification (`omarchy reminder show` / `clear` to manage)"]
        ],
        tip: "Clone plugins instead of editing /usr/share",
        tags: ["bar", "plugin", "clone", "quickshell", "reminder", "widgets"]
      }
    ]
  },
  {
    id: "omarchy-cli-sys-agents",
    badge: "sys",
    title: "omarchy CLI: Packages, AI Agents, Configs & Hyprland",
    subtitle: "Package/AUR/WebApp installers, multi-account coding agents, config refresh & hyprctl validation",
    commands: [
      {
        id: "cli-pkg-webapp-install",
        mode: "PACKAGES",
        modeClass: "mode-c",
        desc: "Install Arch official repo packages, AUR packages, standalone Web Apps, TUI apps, or dev stacks",
        cmd: "omarchy pkg add ripgrep jq   |   omarchy pkg aur add <aur-pkg>   |   omarchy webapp install   |   omarchy install docker dbs",
        flags: [
          ["omarchy pkg add / remove", "Install or remove official Arch packages cleanly"],
          ["omarchy pkg aur add <pkg>", "Build and install AUR packages"],
          ["omarchy webapp install / remove", "Create or remove a dedicated Chromium app-mode desktop launcher & window class"],
          ["omarchy tui install / remove", "Wrap a terminal TUI tool in a desktop launcher entry"]
        ],
        tags: ["pkg", "pacman", "aur", "webapp", "tui", "install", "docker"]
      },
      {
        id: "cli-ai-agents-accounts",
        mode: "AI AGENTS",
        modeClass: "mode-v",
        desc: "Launch coding agents, manage multiple Claude/Codex/Grok subscription accounts, or auto-switch near rate limits",
        cmd: "omarchy agent --pick   |   omarchy agent account list   |   omarchy agent account use next   |   omarchy agent account mode claude auto",
        flags: [
          ["omarchy agent [--pick] / prompt '...'", "Launch default coding agent or pick from installed agents"],
          ["agent account add / list / use", "Add, inspect usage limits, or switch active account for Claude, Codex, or Grok"],
          ["agent account mode <agent> auto", "Automatically rotate to your next account when approaching subscription usage limits"],
          ["agent account copy <ssh-host>", "Sync agent subscription logins to another Omarchy machine over SSH"]
        ],
        tip: "Auto-rotates accounts near rate limits!",
        tags: ["agent", "claude", "codex", "grok", "account", "usage", "limits"]
      },
      {
        id: "cli-restart-refresh-update",
        mode: "MAINTENANCE",
        modeClass: "mode-t",
        desc: "Update Omarchy, restart desktop services, or safely reset a specific config to defaults (with automatic backup)",
        cmd: "omarchy update   |   omarchy restart shell   |   omarchy restart terminal   |   omarchy refresh config hypr/bindings.lua",
        flags: [
          ["omarchy restart <target>", "Restart `shell` (bar/notifications), `terminal`, `audio`, `bluetooth`, `wifi`, `hyprsunset`, or `trackpad`"],
          ["omarchy refresh <app>", "Backs up your current config with a timestamp, then restores default config for `shell`, `hyprland`, etc."],
          ["omarchy snapshot", "Create or restore system Btrfs/Limine snapshots"]
        ],
        danger: "omarchy refresh resets target config (backs up first)",
        tags: ["update", "restart", "refresh", "reset", "backup", "snapshot", "shell"]
      },
      {
        id: "cli-hyprctl-lua-validation",
        mode: "HYPRLAND",
        modeClass: "mode-n",
        desc: "Validate `~/.config/hypr/*.lua` edits and inspect live window classes, monitors, and layers via `hyprctl`",
        cmd: "hyprctl reload && hyprctl configerrors   |   hyprctl clients | grep -E 'Window|class:|title:'   |   hyprctl monitors",
        flags: [
          ["hyprctl reload && hyprctl configerrors", "Reloads Hyprland Lua config and verifies zero syntax/binding errors"],
          ["hyprctl clients", "Lists all open windows with `class`, `initialClass`, `title`, `workspace`, and `floating` state for window rules"],
          ["hyprctl layers", "Inspect Quickshell bar, OSD, and notification layer-shell surfaces"]
        ],
        tip: "Always run hyprctl configerrors after editing Lua",
        tags: ["hyprctl", "reload", "configerrors", "clients", "monitors", "lua", "windowrules"]
      }
    ]
  }
];

// Interactive Omarchy CLI & Lua Generator Database
const OM_BUILDER_TASKS = {
  theme: [
    {
      id: "set-theme",
      label: "List & Switch Desktop Theme (catppuccin, tokyonight...)",
      desc: "List available themes and switch the entire desktop, terminal, Neovim, and bar to Catppuccin",
      cmd: "omarchy theme list && omarchy theme set catppuccin"
    },
    {
      id: "next-bg",
      label: "Cycle to Next Theme Wallpaper",
      desc: "Switch to the next background wallpaper in the active theme",
      cmd: "omarchy theme bg next"
    },
    {
      id: "set-font",
      label: "List & Change System Monospace Font",
      desc: "List installed fonts and update the monospace font across terminals and UI",
      cmd: "omarchy font list && omarchy font set 'JetBrainsMono Nerd Font'"
    }
  ],
  toggle: [
    {
      id: "toggle-night",
      label: "Toggle Nightlight (Warm Screen Filter)",
      desc: "Toggle hyprsunset blue-light filter on or off",
      cmd: "omarchy toggle nightlight"
    },
    {
      id: "toggle-glass",
      label: "Set Window Transparency Profile (opaque / transparent / glassy)",
      desc: "Switch window opacity mode between opaque, transparent, or glassy",
      cmd: "omarchy hyprland window transparency glassy"
    },
    {
      id: "toggle-gaps",
      label: "Toggle Window Gaps On/Off",
      desc: "Toggle workspace window gaps between default spacing and zero gaps",
      cmd: "omarchy hyprland window gaps toggle"
    },
    {
      id: "toggle-idle",
      label: "Toggle Idle Screen Lock / Sleep",
      desc: "Temporarily disable or re-enable automatic idle screen locking",
      cmd: "omarchy toggle idle"
    }
  ],
  pkg: [
    {
      id: "pkg-add",
      label: "Install Official Arch & AUR Packages",
      desc: "Install official repository packages or AUR packages via omarchy pkg",
      cmd: "omarchy pkg add ripgrep fd jq   # or: omarchy pkg aur add <aur-pkg>"
    },
    {
      id: "webapp-add",
      label: "Install a Custom Standalone Web App",
      desc: "Launch interactive wizard to create a dedicated desktop Web App",
      cmd: "omarchy webapp install"
    },
    {
      id: "reminder-set",
      label: "Set a Timed Desktop Reminder Notification",
      desc: "Trigger a desktop notification reminder in 15 minutes",
      cmd: "omarchy reminder 15 'Check deployment logs'"
    }
  ],
  agent: [
    {
      id: "agent-acct",
      label: "List & Rotate Coding Agent Accounts",
      desc: "View subscription usage limits across Claude/Codex/Grok accounts and switch to the next account",
      cmd: "omarchy agent account list && omarchy agent account use next"
    },
    {
      id: "agent-auto",
      label: "Enable Auto-Account Rotation Near Rate Limits",
      desc: "Automatically switch accounts when approaching subscription usage thresholds",
      cmd: "omarchy agent account mode claude auto"
    },
    {
      id: "agent-prompt",
      label: "Launch Coding Agent with an Immediate Prompt",
      desc: "Open the default coding agent directly with a task prompt",
      cmd: "omarchy agent prompt 'Investigate recent systemd errors'"
    }
  ],
  refresh: [
    {
      id: "refresh-shell",
      label: "Restart Quickshell Bar & Terminal Configs",
      desc: "Restart the Omarchy status bar/notifications shell and reload terminal configs",
      cmd: "omarchy restart shell && omarchy restart terminal"
    },
    {
      id: "debug-print",
      label: "Print Non-Interactive System Diagnostics",
      desc: "Output full Omarchy hardware, driver, Hyprland, and package diagnostic info",
      cmd: "omarchy debug --no-sudo --print"
    },
    {
      id: "reset-cfg",
      label: "Backup & Reset a Specific Config File to Default",
      desc: "Backup current config with timestamp and restore default template",
      cmd: "omarchy refresh config hypr/looknfeel.lua"
    }
  ],
  lua: [
    {
      id: "lua-rebind",
      label: "Override an Existing Keybinding in ~/.config/hypr/bindings.lua",
      desc: "Unbind a default shortcut and replace it in ~/.config/hypr/bindings.lua, then validate",
      cmd: `-- In ~/.config/hypr/bindings.lua:
hl.unbind("SUPER + SHIFT + E")
o.bind("SUPER + SHIFT + E", "Email", { webapp = "https://mail.google.com" })
-- Then validate in terminal: hyprctl reload && hyprctl configerrors`
    },
    {
      id: "lua-newbind",
      label: "Add a Custom App or SSH Keybinding in bindings.lua",
      desc: "Bind a new shortcut in ~/.config/hypr/bindings.lua using o.bind()",
      cmd: `-- In ~/.config/hypr/bindings.lua:
o.bind("SUPER + SHIFT + R", "Prod SSH", "ghostty -e ssh prod-server")
-- Then validate in terminal: hyprctl reload && hyprctl configerrors`
    }
  ]
};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("om_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
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

function highlightOmCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(--[^\n]*|#[^\n]*)|(\s\|\s|\s&&\s)|(\b(?:Super|Ctrl|Alt|Shift|Print|Return|Space|Backspace|Delete|Tab|Esc)(?:\s*\+\s*(?:Super|Ctrl|Alt|Shift|[A-Za-z0-9/.,~\[\]\-=←→↑↓]+))*)|(\b(?:omarchy|hyprctl|o\.bind|hl\.unbind|cat|grep)\b)|(\s--[a-zA-Z0-9-]+|\s-[a-zA-Z0-9]+)/g,
    (match, comment, sep, chord, cmd, flag) => {
      if (comment) return `<span class="tok-comment">${comment}</span>`;
      if (sep) return `<span class="tok-pipe">${sep}</span>`;
      if (chord) return `<span class="tok-flag">${chord}</span>`;
      if (cmd) return `<span class="tok-cmd">${cmd}</span>`;
      if (flag) return `<span class="tok-flag">${flag}</span>`;
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = OMARCHY_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of OMARCHY_CHEAT_SHEET_DATA) {
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

  for (const section of OMARCHY_CHEAT_SHEET_DATA) {
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
        const dangerHtml = item.danger
          ? `<span class="danger-badge">! ${escapeHtml(item.danger)}</span>`
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
                ${dangerHtml}
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
              <code class="cmd-code">${highlightOmCmd(item.cmd)}</code>
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

function initOmBuilder() {
  const groupEl = document.getElementById("om-group");
  const taskEl = document.getElementById("om-task");
  const cmdOutputEl = document.getElementById("om-cmd-output");
  const previewBox = document.getElementById("om-preview-box");
  const copyBtn = document.getElementById("om-copy-btn");
  const meaningEl = document.getElementById("om-meaning-text");
  const presetBtns = document.querySelectorAll(".om-preset");

  function populateTasks(groupKey, selectedTaskId) {
    const list = OM_BUILDER_TASKS[groupKey] || [];
    taskEl.innerHTML = list
      .map(
        (t) =>
          `<option value="${t.id}" ${t.id === selectedTaskId ? "selected" : ""}>${escapeHtml(t.label)}</option>`
      )
      .join("");
  }

  function updateOmPreview() {
    const groupKey = groupEl.value;
    const list = OM_BUILDER_TASKS[groupKey] || [];
    const current = list.find((t) => t.id === taskEl.value) || list[0];
    if (!current) return;

    cmdOutputEl.innerHTML = highlightOmCmd(current.cmd);
    previewBox.dataset.copy = current.cmd;
    meaningEl.textContent = current.desc;

    presetBtns.forEach((btn) => {
      const active = btn.dataset.group === groupKey && btn.dataset.task === current.id;
      btn.classList.toggle("active", active);
    });
  }

  groupEl.addEventListener("change", () => {
    populateTasks(groupEl.value);
    updateOmPreview();
  });

  taskEl.addEventListener("change", updateOmPreview);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      groupEl.value = btn.dataset.group;
      populateTasks(btn.dataset.group, btn.dataset.task);
      updateOmPreview();
    });
  });

  previewBox.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  populateTasks("theme", "set-theme");
  updateOmPreview();
}

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
      localStorage.setItem("om_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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

applyTheme(state.theme);
applyDensity(state.compact);
renderCategoryTabs();
renderSections();
initOmBuilder();
initMiniTabs();
initEvents();
