const OMARCHY_CHEAT_SHEET_DATA = [
  {
    id: "menus-apps",
    badge: "apps",
    title: "Menus, Launchers & Apps",
    subtitle: "Omarchy menus, terminals, browser, files, tools & web apps",
    commands: [
      {
        id: "om-core-menus-launcher",
        mode: "MENUS",
        modeClass: "mode-n",
        desc: "Open the Omarchy menu, app launcher, keybinding guides, and the focused sub-menus",
        cmd: "Super + Space (Omarchy Menu)   |   Super + Alt + Space (Apps)   |   Super + K (Keybindings)   |   Super + Escape (System)",
        flags: [
          ["Super + Space", "Omarchy main menu"],
          ["Super + Shift + F23", "Omarchy main menu (the Copilot key on laptops that have one)"],
          ["Super + Alt + Space", "App launcher"],
          ["Super + Escape", "System menu (Power key opens it too)"],
          ["Super + K", "Searchable keybindings overlay"],
          ["Super + Alt + K", "Tmux keybindings overlay"],
          ["Super + Ctrl + K", "Herdr keybindings overlay"],
          ["Super + Ctrl + T / Super + Shift + Ctrl + Space", "Theme menu"],
          ["Super + Ctrl + W / Super + Ctrl + Space", "Background switcher"],
          ["Super + Ctrl + O", "Toggle menu"],
          ["Super + Ctrl + H", "Hardware menu"],
          ["Super + Ctrl + C", "Capture menu"],
          ["Super + Ctrl + S", "Share menu"]
        ],
        tip: "Super+K searches every live binding",
        tags: ["menu", "launcher", "keybindings", "system", "theme", "wallpaper", "background", "hardware", "toggle", "share", "capture", "tmux", "herdr", "power"]
      },
      {
        id: "om-terminals-browser-files",
        mode: "CORE APPS",
        modeClass: "mode-n",
        desc: "Launch the terminal, browser, file manager, and editor",
        cmd: "Super + Return (Terminal)   |   Super + Shift + Return (Browser)   |   Super + Shift + F (Files)   |   Super + Shift + N (Editor)",
        flags: [
          ["Super + Return", "Terminal"],
          ["Super + Alt + Return", "Terminal in Tmux"],
          ["Super + Ctrl + Return", "Terminal in Herdr"],
          ["Super + Shift + Return / Super + Shift + B", "Browser"],
          ["Super + Shift + Alt + B", "Private browser window"],
          ["Super + Shift + F", "File manager"],
          ["Super + Shift + Alt + F", "File manager at the active terminal's current folder"],
          ["Super + Shift + N", "Editor"]
        ],
        tip: "Two chords open the browser",
        tags: ["terminal", "tmux", "herdr", "browser", "private", "files", "nautilus", "editor", "neovim"]
      },
      {
        id: "om-tuis-utilities-agents",
        mode: "TOOLS",
        modeClass: "mode-v",
        desc: "Launch the coding agent picker, activity monitor, Docker, calculator, passwords, notes, and music",
        cmd: "Super + Shift + Ctrl + A (Agent)   |   Super + Shift + T (Activity)   |   Super + Shift + D (Docker)   |   Super + Shift + / (Passwords)",
        flags: [
          ["Super + Shift + Ctrl + A", "Pick and launch a coding agent"],
          ["Super + Shift + T", "Activity monitor"],
          ["Super + Shift + D", "Docker manager"],
          ["Super + Shift + Q", "Calculator (Calculator key works too)"],
          ["Super + Shift + /", "Passwords (1Password)"],
          ["Super + Shift + O", "Obsidian"],
          ["Super + Shift + W", "Omawrite distraction-free writer"],
          ["Super + Shift + M", "Spotify"],
          ["Super + Shift + Alt + M", "Terminal music player"]
        ],
        tags: ["agent", "activity", "btop", "docker", "lazydocker", "calculator", "1password", "passwords", "obsidian", "omawrite", "music", "spotify"]
      },
      {
        id: "om-webapps-shortcuts",
        mode: "WEB APPS",
        modeClass: "mode-v",
        desc: "Launch web apps. Email and Calendar are rebound to Gmail and Google Calendar on this machine.",
        cmd: "Super + Shift + E (Gmail)   |   Super + Shift + C (Calendar)   |   Super + Shift + A (ChatGPT)   |   Super + Shift + Y (YouTube)",
        flags: [
          ["Super + Shift + E", "Gmail inbox"],
          ["Super + Shift + Alt + E", "Compose a new Gmail message"],
          ["Super + Shift + C", "Google Calendar"],
          ["Super + Shift + A", "ChatGPT"],
          ["Super + Shift + Alt + A", "Grok"],
          ["Super + Shift + G", "Signal"],
          ["Super + Shift + Alt + G", "WhatsApp"],
          ["Super + Shift + Ctrl + G", "Google Messages"],
          ["Super + Shift + P", "Google Photos"],
          ["Super + Shift + S", "Google Maps"],
          ["Super + Shift + Y", "YouTube"],
          ["Super + Shift + X", "X"],
          ["Super + Shift + Alt + X", "New X post"],
          ["Shift + Alt + L", "Inside a web app: copy the page URL"],
          ["Shift + Alt + D", "Inside a web app: download the video"]
        ],
        tip: "Shift+Alt+L copies the URL inside any web app",
        tags: ["webapp", "chatgpt", "grok", "email", "gmail", "calendar", "youtube", "whatsapp", "signal", "messages", "photos", "maps", "url", "download"]
      }
    ]
  },
  {
    id: "windows-tiling",
    badge: "win",
    title: "Windows, Tiling & Sizing",
    subtitle: "Close, fullscreen, float, focus, swap, resize & appearance toggles",
    commands: [
      {
        id: "om-window-close-fullscreen-float",
        mode: "WINDOWS",
        modeClass: "mode-n",
        desc: "Close windows, change fullscreen mode, float, pop out, and change the tiling split",
        cmd: "Super + W (Close)   |   Super + F (Fullscreen)   |   Super + T (Float)   |   Super + O (Pop Out)",
        flags: [
          ["Super + W / Super + Q", "Close the active window"],
          ["Ctrl + Alt + Delete", "Close ALL windows"],
          ["Super + F", "Full screen"],
          ["Super + Alt + F", "Full width"],
          ["Super + Ctrl + F", "Tiled full screen"],
          ["Super + Ctrl + Alt + F", "Toggle full screen desktop"],
          ["Super + T", "Toggle floating / tiling"],
          ["Super + O", "Pop window out (float and pin on top)"],
          ["Super + J", "Toggle split direction"],
          ["Super + P", "Pseudo-tile the window"],
          ["Super + M", "Minimize window to the dock"]
        ],
        tip: "Super+O keeps a video on top",
        danger: "Ctrl+Alt+Delete closes every window",
        tags: ["close", "fullscreen", "float", "pop", "pip", "pin", "split", "pseudo", "minimize", "dock"]
      },
      {
        id: "om-window-focus-swap",
        mode: "NAVIGATION",
        modeClass: "mode-n",
        desc: "Move focus between windows, swap their positions, and cycle the workspace layout",
        cmd: "Super + Arrows (Focus)   |   Super + Shift + Arrows (Swap)   |   Alt + Tab (Next)   |   Super + L (Layout)",
        flags: [
          ["Super + Arrows", "Move focus left, right, up, or down"],
          ["Super + Shift + Arrows", "Swap the window in that direction"],
          ["Alt + Tab", "Focus the next window and raise it"],
          ["Shift + Alt + Tab", "Focus the previous window and raise it"],
          ["Super + L", "Cycle workspace layout forward"],
          ["Super + Alt + L", "Cycle workspace layout back"]
        ],
        tags: ["focus", "swap", "move", "arrows", "layout", "alt-tab", "navigate"]
      },
      {
        id: "om-window-resize-mouse-keys",
        mode: "RESIZING",
        modeClass: "mode-n",
        desc: "Move or resize with the mouse or keyboard. Add Alt for small steps or Ctrl for large steps.",
        cmd: "Super + Left-Drag (Move)   |   Super + Right-Drag (Resize)   |   Super + -/= (Width)   |   Super + Shift + -/= (Height)",
        flags: [
          ["Super + Left-Drag", "Move window with the mouse"],
          ["Super + Right-Drag", "Resize window with the mouse"],
          ["Super + -", "Widen window, moving its edge left"],
          ["Super + =", "Narrow window, moving its edge left"],
          ["Super + Shift + -", "Shorten window upward"],
          ["Super + Shift + =", "Lengthen window downward"],
          ["Super + Alt + -", "Widen a little"],
          ["Super + Alt + =", "Narrow a little"],
          ["Super + Shift + Alt + -", "Shorten a little"],
          ["Super + Shift + Alt + =", "Lengthen a little"],
          ["Super + Ctrl + -", "Widen a lot"],
          ["Super + Ctrl + =", "Narrow a lot"],
          ["Super + Shift + Ctrl + -", "Shorten a lot"],
          ["Super + Shift + Ctrl + =", "Lengthen a lot"],
          ["Super + Alt + Home", "Save window width"],
          ["Super + Home", "Restore saved window width"]
        ],
        tags: ["resize", "mouse", "drag", "width", "height", "expand", "shrink", "save", "restore"]
      },
      {
        id: "om-visual-toggles-gaps-opacity",
        mode: "APPEARANCE",
        modeClass: "mode-v",
        desc: "Toggle transparency, gaps, the top bar, and single-window aspect",
        cmd: "Super + Backspace (Transparency)   |   Super + Shift + Backspace (Gaps)   |   Super + Shift + Space (Top Bar)",
        flags: [
          ["Super + Backspace", "Toggle transparency on the window"],
          ["Super + Shift + Backspace", "Toggle window gaps"],
          ["Super + Ctrl + Backspace", "Toggle single-window square aspect"],
          ["Super + Shift + Space", "Show or hide the top bar"]
        ],
        tags: ["transparency", "opacity", "gaps", "bar", "hide", "aspect"]
      }
    ]
  },
  {
    id: "workspaces-groups",
    badge: "ws",
    title: "Workspaces, Groups & Monitors",
    subtitle: "Workspaces 1-10, scratchpad, Quake console, tabbed groups & multi-monitor",
    commands: [
      {
        id: "om-workspaces-switch-move",
        mode: "WORKSPACES",
        modeClass: "mode-n",
        desc: "Switch workspaces and move windows between them. Each monitor has its own workspaces 1-10.",
        cmd: "Super + 1..0 (Switch)   |   Super + Shift + 1..0 (Move)   |   Super + Shift + Alt + 1..0 (Silent)   |   Super + Tab (Next)",
        flags: [
          ["Super + 1..0", "Switch to workspace 1-10 (0 = 10)"],
          ["Super + Shift + 1..0", "Move window to workspace 1-10 and follow it"],
          ["Super + Shift + Alt + 1..0", "Send window to workspace 1-10 and stay here"],
          ["Super + Tab", "Next workspace"],
          ["Super + Shift + Tab", "Previous workspace"],
          ["Super + Ctrl + Tab", "Back to the former workspace"],
          ["Super + Scroll Down", "Scroll workspaces forward"],
          ["Super + Scroll Up", "Scroll workspaces backward"]
        ],
        tip: "Super+Ctrl+Tab jumps back",
        tags: ["workspace", "switch", "move", "silent", "tab", "scroll", "former"]
      },
      {
        id: "om-scratchpad-quake",
        mode: "SCRATCHPAD",
        modeClass: "mode-v",
        desc: "Toggle the scratchpad or Quake console overlay, or send the active window to either one",
        cmd: "Super + S (Scratchpad)   |   Super + Alt + S (Send)   |   Super + ` (Quake)   |   Super + Shift + ` (Send)",
        flags: [
          ["Super + S", "Toggle the scratchpad"],
          ["Super + Alt + S", "Move window to the scratchpad"],
          ["Super + `", "Toggle the Quake console (the ~ key)"],
          ["Super + Shift + `", "Move window to the Quake console"]
        ],
        tip: "Good for an always-handy terminal or chat",
        tags: ["scratchpad", "quake", "dropdown", "overlay", "tilde", "grave"]
      },
      {
        id: "om-window-groups-tabs",
        mode: "WINDOW GROUPS",
        modeClass: "mode-v",
        desc: "Combine windows into a tabbed group, then switch or rearrange its tabs",
        cmd: "Super + G (Group)   |   Super + Alt + G (Ungroup)   |   Super + Alt + Arrows (Join)   |   Super + Alt + Tab (Next)",
        flags: [
          ["Super + G", "Toggle window grouping"],
          ["Super + Alt + G", "Move window out of the group"],
          ["Super + Alt + Arrows", "Move window into the group in that direction"],
          ["Super + Alt + 1..5", "Switch to group window 1-5"],
          ["Super + Alt + Tab", "Next window in group"],
          ["Super + Shift + Alt + Tab", "Previous window in group"],
          ["Super + Ctrl + Right", "Next window in group"],
          ["Super + Ctrl + Left", "Previous window in group"],
          ["Super + Alt + Scroll Down", "Next window in group"],
          ["Super + Alt + Scroll Up", "Previous window in group"]
        ],
        tags: ["group", "tabs", "tabbed", "stack", "container", "ungroup"]
      },
      {
        id: "om-multimonitor-scaling",
        mode: "MONITORS",
        modeClass: "mode-n",
        desc: "Move focus, windows, and workspaces across monitors, adjust scaling, and control the laptop display",
        cmd: "Ctrl + Alt + Tab (Next Monitor)   |   Super + Shift + Ctrl + Arrows (Move Window)   |   Super + Shift + Alt + Arrows (Move Workspace)",
        flags: [
          ["Ctrl + Alt + Tab", "Focus the next monitor"],
          ["Shift + Ctrl + Alt + Tab", "Focus the previous monitor"],
          ["Super + Shift + Ctrl + Arrows", "Move window to the monitor in that direction"],
          ["Super + Shift + Alt + Arrows", "Move workspace to the monitor in that direction"],
          ["Super + /", "Monitor scaling up"],
          ["Super + Alt + /", "Monitor scaling down"],
          ["Super + Ctrl + Delete", "Toggle the laptop display"],
          ["Super + Ctrl + Alt + Delete", "Toggle laptop display mirroring"]
        ],
        tags: ["monitor", "display", "scaling", "mirror", "laptop", "clamshell"]
      }
    ]
  },
  {
    id: "panels-capture",
    badge: "bar",
    title: "Bar Panels, Capture & Input",
    subtitle: "Bar panels, screenshots, recording, clipboard, dictation & notifications",
    commands: [
      {
        id: "om-quickshell-bar-panels",
        mode: "BAR PANELS",
        modeClass: "mode-n",
        desc: "Open top bar panels from the keyboard",
        cmd: "Super + Ctrl + A (Audio)   |   Super + Ctrl + B (Bluetooth)   |   Super + Ctrl + N (Network)   |   Super + Ctrl + 1..9 (By Position)",
        flags: [
          ["Super + Ctrl + A", "Audio"],
          ["Super + Ctrl + B", "Bluetooth"],
          ["Super + Ctrl + N", "Network"],
          ["Super + Ctrl + D", "Display"],
          ["Super + Ctrl + P", "Power"],
          ["Super + Ctrl + Alt + D", "Calendar"],
          ["Super + Ctrl + Alt + E", "World clock"],
          ["Super + Ctrl + 1..9", "Right-side bar panels by position, counted from the left"]
        ],
        tags: ["panel", "bar", "quickshell", "audio", "bluetooth", "network", "wifi", "calendar", "clock", "power", "display"]
      },
      {
        id: "om-capture-screenshot-record-ocr",
        mode: "CAPTURE",
        modeClass: "mode-t",
        desc: "Take screenshots, record the screen, extract text, pick colors, and transcode media",
        cmd: "Print (Screenshot)   |   Alt + Print (Record)   |   Super + Ctrl + Print (OCR)   |   Super + Print (Color)",
        flags: [
          ["Print / Super + Ctrl + Alt + C", "Screenshot"],
          ["Enter", "While selecting: capture the highlighted window"],
          ["Ctrl + Enter", "While selecting: capture the entire screen"],
          ["Tab", "While selecting: highlight the next window"],
          ["Ctrl + Tab", "While selecting: highlight the previous window"],
          ["Arrows", "While selecting: highlight the window in that direction"],
          ["Alt + Print", "Start or stop screen recording"],
          ["Super + Alt + [", "Make the webcam overlay smaller"],
          ["Super + Alt + ]", "Make the webcam overlay larger"],
          ["Super + Ctrl + Print", "Extract text from a screenshot (OCR)"],
          ["Super + Print", "Color picker"],
          ["Super + Ctrl + .", "Transcode"]
        ],
        tip: "Enter snaps the highlighted window",
        tags: ["screenshot", "screenrecord", "ocr", "color-picker", "capture", "webcam", "share", "transcode"]
      },
      {
        id: "om-clipboard-dictation-emojis",
        mode: "INPUT & CLIP",
        modeClass: "mode-i",
        desc: "Universal clipboard shortcuts, clipboard history, emojis, voice dictation, and input language",
        cmd: "Super + C / V / X / A   |   Super + Ctrl + V (History)   |   Super + Ctrl + E (Emojis)   |   F9 (Hold to Dictate)",
        flags: [
          ["Super + C", "Universal copy (works in terminals too)"],
          ["Super + V", "Universal paste"],
          ["Super + X", "Universal cut"],
          ["Super + A", "Select all"],
          ["Super + Ctrl + V", "Clipboard manager"],
          ["Super + Ctrl + E", "Emojis"],
          ["F9 / Alt + Right Alt", "Hold to dictate, release to stop"],
          ["Super + Ctrl + X", "Toggle hands-free dictation"],
          ["Super + I", "Switch input language"],
          ["Super + Shift + I", "Switch input language back"],
          ["Ctrl + Space", "Direct input for the Tmux or Herdr prefix"]
        ],
        tip: "Super+C/V works in terminals and apps",
        tags: ["copy", "paste", "cut", "select", "clipboard", "emoji", "dictation", "voice", "voxtype", "language", "prefix"]
      },
      {
        id: "om-notifications-reminders-lock",
        mode: "NOTIFICATIONS",
        modeClass: "mode-c",
        desc: "Manage notifications and reminders, show status toasts, zoom, and lock the system",
        cmd: "Super + , (Dismiss)   |   Super + Ctrl + R (Reminder)   |   Super + Ctrl + L (Lock)   |   Super + Ctrl + Z (Zoom)",
        flags: [
          ["Super + ,", "Dismiss, invoke, or focus the last notification"],
          ["Super + Alt + ,", "Dismiss the last notification"],
          ["Super + Shift + ,", "Dismiss all notifications"],
          ["Super + Ctrl + ,", "Control notifications with the keyboard"],
          ["Super + Shift + Alt + ,", "Open notification history"],
          ["Super + Ctrl + Alt + ,", "Toggle silencing notifications"],
          ["Super + Ctrl + R", "Set a reminder"],
          ["Super + Ctrl + Alt + R", "Show reminders"],
          ["Super + Shift + Ctrl + R", "Clear reminders"],
          ["Super + Ctrl + Alt + T", "Show the time"],
          ["Super + Ctrl + Alt + B", "Show battery remaining"],
          ["Super + Ctrl + Alt + W", "Toggle weather"],
          ["Super + Ctrl + Z", "Zoom in (press again for more)"],
          ["Super + Ctrl + Alt + Z", "Reset zoom"],
          ["Super + Ctrl + L", "Lock the system"],
          ["Super + Ctrl + I", "Toggle locking on idle"]
        ],
        tags: ["notification", "dismiss", "dnd", "silence", "reminder", "lock", "idle", "zoom", "weather", "battery", "time"]
      }
    ]
  },
  {
    id: "keyboard-function-keys",
    badge: "keys",
    title: "Media, Brightness & Terminal Keys",
    subtitle: "Dedicated keyboard keys, plus keys built into the terminal",
    commands: [
      {
        id: "om-audio-media-keys",
        mode: "AUDIO & MEDIA",
        modeClass: "mode-n",
        desc: "Control volume, playback, and audio routing with the keyboard's media keys",
        cmd: "Volume Up / Volume Down   |   Mute   |   Play   |   Next Track   |   Previous Track",
        flags: [
          ["Volume Up / Volume Down", "Change volume"],
          ["Alt + Volume Up / Alt + Volume Down", "Change volume in fine steps"],
          ["Mute", "Mute audio"],
          ["Mic Mute", "Mute the microphone"],
          ["Shift + Mute", "Switch audio output"],
          ["Play / Pause", "Play or pause"],
          ["Next Track / Alt + Play", "Next track"],
          ["Previous Track / Shift + Alt + Play", "Previous track"],
          ["Shift + Play / Shift + Pause", "Switch media source"],
          ["Eject", "Eject media"]
        ],
        tip: "Alt gives fine volume steps",
        tags: ["volume", "mute", "microphone", "media", "play", "pause", "track", "audio", "output", "eject"]
      },
      {
        id: "om-brightness-touchpad-keys",
        mode: "HARDWARE KEYS",
        modeClass: "mode-n",
        desc: "Control screen and keyboard brightness, the touchpad, and the power menu",
        cmd: "Brightness Up / Brightness Down   |   Keyboard Light Key   |   Touchpad Toggle   |   Power Key",
        flags: [
          ["Brightness Up / Brightness Down", "Change screen brightness"],
          ["Alt + Brightness Up / Alt + Brightness Down", "Change brightness in fine steps"],
          ["Shift + Brightness Up", "Maximum brightness"],
          ["Shift + Brightness Down", "Minimum brightness"],
          ["Keyboard Brightness Up / Keyboard Brightness Down", "Change keyboard backlight"],
          ["Keyboard Light Key", "Cycle keyboard backlight"],
          ["Touchpad Toggle", "Toggle the touchpad"],
          ["Touchpad On", "Enable the touchpad"],
          ["Touchpad Off", "Disable the touchpad"],
          ["Power Key", "Open the system menu"]
        ],
        tags: ["brightness", "screen", "keyboard", "backlight", "touchpad", "power"]
      },
      {
        id: "om-terminal-keys",
        mode: "TERMINAL",
        modeClass: "mode-i",
        desc: "Keys configured inside Omarchy's terminals, in addition to Super+C and Super+V",
        cmd: "Ctrl + Insert (Copy)   |   Shift + Insert (Paste)   |   Super + Shift + Ctrl + Alt + Arrows (Ghostty Split)",
        flags: [
          ["Ctrl + Insert", "Copy (Alacritty, Ghostty, Foot)"],
          ["Shift + Insert", "Paste (Alacritty, Ghostty, Foot)"],
          ["Super + Shift + Ctrl + Alt + Arrows", "Resize a Ghostty split"]
        ],
        tags: ["terminal", "copy", "paste", "ghostty", "alacritty", "foot", "split"]
      }
    ]
  }
];

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
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

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCategoryTabs() {
  const totalCommands = OMARCHY_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} groups)</option>`
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
renderCategoryTabs();
renderSections();
initEvents();
