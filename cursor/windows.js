const WINDOWS_CHEAT_SHEET_DATA = [
  {
    id: "win-keys",
    badge: "keys",
    title: "Windows 11, Snap & Explorer Shortcuts",
    subtitle: "Power user menu, window tiling, virtual desktops, File Explorer & terminal tricks",
    commands: [
      {
        id: "win-power-user-admin",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Open Quick Link admin menu, Task Manager, or launch any app as Administrator",
        cmd: "Win+X   |   Win+X then I (Admin Terminal)   |   Ctrl+Shift+Esc   |   Ctrl+Shift+Enter",
        flags: [
          ["Win+X", "Open Power User menu (Terminal, Disk Mgmt, Device Mgr, Event Viewer)"],
          ["Win+X then u, u / u, r", "Instant Shutdown (u, u) or Restart (u, r) without mouse"],
          ["Ctrl+Shift+Esc", "Open Task Manager directly"],
          ["Ctrl+Shift+Enter", "Run selected Start Menu or Win+R command as Administrator (Elevated)"]
        ],
        tip: "Win+X then I = Admin PS",
        tags: ["admin", "elevate", "task-manager", "shutdown", "menu", "terminal"]
      },
      {
        id: "win-snap-multimonitor",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Snap windows into halves/quadrants, open Snap Layouts, or move window across monitors",
        cmd: "Win+Z   |   Win+← / Win+→   |   Win+Shift+← / → (Monitor)   |   Win+Home",
        flags: [
          ["Win+Z", "Open Windows 11 Snap Layouts picker for active window"],
          ["Win+← / → then ↑ / ↓", "Snap window to left/right half, then corner quadrant"],
          ["Win+Shift+← / →", "Teleport active window to left or right physical monitor"],
          ["Win+Home / Win+D", "Minimize all windows except active one / Show Desktop"]
        ],
        tags: ["snap", "tile", "monitor", "layout", "minimize", "desktop"]
      },
      {
        id: "win-virtual-desktops",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Create, switch between, and close Virtual Desktops (Workspaces)",
        cmd: "Win+Tab   |   Win+Ctrl+D (New)   |   Win+Ctrl+← / → (Switch)   |   Win+Ctrl+F4 (Close)",
        flags: [
          ["Win+Tab", "Open Task View (drag windows between Virtual Desktops)"],
          ["Win+Ctrl+D", "Create and switch to a new Virtual Desktop"],
          ["Win+Ctrl+← / →", "Switch immediately to previous / next Virtual Desktop"],
          ["Win+Ctrl+F4", "Close current Virtual Desktop (moves open windows to neighbor)"]
        ],
        tags: ["virtual-desktop", "workspaces", "task-view", "switch"]
      },
      {
        id: "win-clipboard-capture-gpu",
        mode: "SHORTCUT",
        modeClass: "mode-n",
        desc: "Clipboard history, region screenshot/screen-record, text OCR, and GPU driver reset",
        cmd: "Win+V (Clipboard)   |   Win+Shift+S (Snip)   |   Win+Ctrl+Shift+B (Reset GPU)",
        flags: [
          ["Win+V", "Open multi-item Clipboard History & pinned snippets"],
          ["Win+Shift+S / Win+Shift+R", "Snipping Tool screenshot / screen video recording (Win 11)"],
          ["Win+Ctrl+Shift+B", "Restart graphics driver immediately when screen freezes or goes black"],
          ["Win+Ctrl+V", "Open quick audio output/input device switcher (Win 11)"]
        ],
        tip: "Win+Ctrl+Shift+B fixes black screens",
        tags: ["clipboard", "screenshot", "snip", "record", "gpu", "audio"]
      },
      {
        id: "win-explorer-power-tricks",
        mode: "EXPLORER",
        modeClass: "mode-v",
        desc: "Open Terminal in current Explorer folder, copy full file path, or toggle preview panes",
        cmd: "Alt+D then type wt<Enter>   |   Ctrl+Shift+C (Copy Path)   |   Alt+P (Preview)",
        flags: [
          ["Alt+D → wt → Enter", "Focus Explorer address bar and launch Windows Terminal in that exact directory!"],
          ["Ctrl+Shift+C", "Copy selected file's full quoted path (Win 11) or Shift+Right-Click → Copy as path"],
          ["Ctrl+Shift+N / F2", "Create new folder / Rename selected file"],
          ["Alt+P / Alt+Shift+P", "Toggle file Preview Pane / Details Pane"]
        ],
        tip: "Alt+D -> wt opens shell here",
        tags: ["explorer", "path", "copy", "terminal", "folder", "preview"]
      }
    ]
  },
  {
    id: "win-storage",
    badge: "storage",
    title: "Disks, Volumes & BitLocker Encryption",
    subtitle: "Get-Disk, partitions, volume formatting, BitLocker status & manage-bde",
    commands: [
      {
        id: "get-disk-inventory",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "List all physical disks, bus types (NVMe/SATA), partition styles (GPT/MBR) and health",
        cmd: "Get-Disk | Select-Object Number, FriendlyName, OperationalStatus, BusType, PartitionStyle, @{Name='Size_GB'; Expression={[math]::Round($_.Size/1GB, 1)}}",
        flags: [
          ["Get-Disk", "Queries physical drive storage devices and partition status"],
          ["OperationalStatus", "Online, Offline, No Media, or Degraded"],
          ["PartitionStyle", "GPT (GUID Partition Table) vs legacy MBR"]
        ],
        subcommands: [
          ["Get-PhysicalDisk | Select-Object DeviceId, FriendlyName, MediaType, HealthStatus", "Inspect whether disks are SSD, HDD, or SCM (Storage Class Memory)"],
          ["Get-StorageReliabilityCounter -PhysicalDisk (Get-PhysicalDisk -DeviceId 0)", "Check hardware temperature, read/write error counts and wear level"]
        ],
        tip: "Native alternative to diskmgmt.msc",
        tags: ["disk", "storage", "nvme", "ssd", "smart", "partition"]
      },
      {
        id: "disk-partition-format",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Initialize raw disk as GPT, create partition using maximum space and format with NTFS/ReFS",
        cmd: "Initialize-Disk -Number 1 -PartitionStyle GPT && New-Partition -DiskNumber 1 -UseMaximumSize -AssignDriveLetter | Format-Volume -FileSystem NTFS -NewFileSystemLabel 'Data' -Confirm:$false",
        flags: [
          ["Initialize-Disk", "Initializes a RAW unformatted disk without partition table"],
          ["New-Partition", "Creates primary partition with drive letter assignment"],
          ["Format-Volume", "Formats volume with NTFS, ReFS, or FAT32 with specified cluster allocation size"]
        ],
        subcommands: [
          ["Get-Volume | Select-Object DriveLetter, FileSystemLabel, FileSystem, @{Name='Free_GB'; Expression={[math]::Round($_.SizeRemaining/1GB, 1)}}", "List all mounted logical volumes and free capacity"],
          ["Optimize-Volume -DriveLetter C -Defrag -Verbose", "Run TRIM optimization on SSD or defragment HDD"]
        ],
        tip: "Pass -Confirm:$false for automated non-interactive scripting",
        tags: ["format", "partition", "volume", "ntfs", "refs", "gpt", "trim"]
      },
      {
        id: "bitlocker-status-keys",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Inspect BitLocker encryption status, key protectors (TPM / Recovery Password) and backup keys",
        cmd: "Get-BitLockerVolume -MountPoint C: | Select-Object MountPoint, VolumeStatus, EncryptionPercentage, ProtectionStatus, KeyProtector",
        flags: [
          ["Get-BitLockerVolume", "Queries encryption progress and protection state of specified drive"],
          ["KeyProtector", "Lists attached unlock mechanisms (Tpm, RecoveryPassword, NumericalPassword)"],
          ["manage-bde -status", "Command-line BitLocker drive encryption status check"]
        ],
        subcommands: [
          ["(Get-BitLockerVolume -MountPoint C:).KeyProtector | Where-Object KeyProtectorType -eq 'RecoveryPassword' | Select-Object -ExpandProperty RecoveryPassword", "Print the 48-digit BitLocker numerical recovery password for disaster recovery"],
          ["manage-bde -protectors -get C:", "Query BitLocker protectors and GUIDs via legacy CLI tool"]
        ],
        tip: "Always backup BitLocker 48-digit recovery keys before BIOS/TPM updates",
        tags: ["bitlocker", "encryption", "tpm", "recovery-key", "manage-bde", "security"]
      }
    ]
  },
  {
    id: "ps-sys",
    badge: "ps-sys",
    title: "Processes, Services, Events & Hardware",
    subtitle: "Process management, Windows Services, Event Viewer queries & WMI/CIM inspection",
    commands: [
      {
        id: "process-top-kill",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "List top memory-consuming processes or forcefully terminate processes by name/PID",
        cmd: "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name,Id,CPU,WorkingSet64   |   Stop-Process -Name 'node' -Force",
        flags: [
          ["WorkingSet64", "Physical RAM bytes used by process"],
          ["Stop-Process -Name ... -Force", "Immediately kill all processes matching name (like pkill -9)"]
        ],
        tags: ["process", "kill", "memory", "cpu", "top", "stop-process"]
      },
      {
        id: "process-commandline-parent",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Inspect full command-line arguments and parent PID of running processes via CIM",
        cmd: "Get-CimInstance Win32_Process -Filter \"Name LIKE '%python%'\" | Select-Object ProcessId, ParentProcessId, CommandLine",
        flags: [
          ["Win32_Process", "Exposes CommandLine, ExecutablePath, and ParentProcessId"],
          ["-Filter", "Server-side WQL filter (fast)"]
        ],
        tip: "Shows full CLI args",
        tags: ["commandline", "arguments", "parent", "pid", "cim", "wmi"]
      },
      {
        id: "windows-services-manage",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Query, restart, or change startup type of Windows background services",
        cmd: "Get-Service | Where-Object {$_.Status -eq 'Running'}   |   Restart-Service -Name 'Spooler' -Force",
        flags: [
          ["Restart-Service -Force", "Restart service and any dependent services"],
          ["Set-Service -Name <svc> -StartupType Automatic", "Configure service startup mode (Automatic, Manual, Disabled)"]
        ],
        tags: ["service", "daemon", "restart", "running", "startup"]
      },
      {
        id: "eventlog-winevent",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Query Windows Event Logs for recent System or Application crashes/errors",
        cmd: "Get-WinEvent -FilterHashtable @{LogName='System'; Level=2; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 25",
        flags: [
          ["Level=2 / Level=1", "Level 1 = Critical, 2 = Error, 3 = Warning, 4 = Information"],
          ["LogName", "'System', 'Application', 'Security', or 'Microsoft-Windows-PowerShell/Operational'"]
        ],
        tags: ["logs", "event-viewer", "errors", "crash", "winevent"]
      },
      {
        id: "hardware-specs-uptime",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Check system boot time / uptime, motherboard/BIOS info, and RAM DIMM slots",
        cmd: "(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime   |   Get-ComputerInfo",
        flags: [
          ["LastBootUpTime", "Exact timestamp when Windows last booted (or fast-startup resumed)"],
          ["Get-CimInstance Win32_PhysicalMemory", "Inspect RAM speed, manufacturer, and capacity per physical slot"],
          ["Get-CimInstance Win32_BIOS", "Show BIOS version and machine serial number"]
        ],
        tags: ["uptime", "boot", "hardware", "ram", "bios", "serial"]
      }
    ]
  },
  {
    id: "ps-net",
    badge: "ps-net",
    title: "Networking, Ports, DNS & Firewall",
    subtitle: "Listening ports + PIDs, Test-NetConnection, DNS resolution, REST APIs & Firewall",
    commands: [
      {
        id: "find-listening-ports-pid",
        mode: "NETWORK",
        modeClass: "mode-t",
        desc: "Find which process owns a listening TCP port (PowerShell & netstat one-liners)",
        cmd: "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object LocalPort,State,OwningProcess,@{N='Process';E={(Get-Process -Id $_.OwningProcess).ProcessName}}",
        flags: [
          ["Get-NetTCPConnection", "Native object replacement for netstat (use -State Listen for all open ports)"],
          ["netstat -ano | findstr :3000", "Classic fast CMD/PS alternative showing PID in last column"]
        ],
        tip: "Windows equivalent of lsof -i",
        tags: ["ports", "listen", "pid", "netstat", "lsof", "tcp"]
      },
      {
        id: "test-netconnection-tnc",
        mode: "NETWORK",
        modeClass: "mode-t",
        desc: "Test remote TCP port connectivity, IPv6/IPv4 ping latency, or trace route (nc / traceroute)",
        cmd: "Test-NetConnection -ComputerName github.com -Port 443   |   tnc 2606:4700:4700::1111 -TraceRoute",
        flags: [
          ["tnc <host> -Port <p>", "Test TCP handshake to remote port (returns TcpTestSucceeded: True/False)"],
          ["-TraceRoute", "Perform hop-by-hop route trace to target IPv6/IPv4 host"],
          ["-InformationLevel Detailed", "Show local interface, source IPv6/IPv4, and matching route"]
        ],
        tip: "Alias: tnc host -Port 443",
        tags: ["ping", "ipv6", "port", "telnet", "nc", "traceroute", "tnc"]
      },
      {
        id: "dns-resolve-flush",
        mode: "NETWORK",
        modeClass: "mode-t",
        desc: "Query specific DNS record types (`AAAA`, `TXT`, `MX`) or flush Windows DNS cache",
        cmd: "Resolve-DnsName -Name example.com -Type AAAA -Server 2606:4700:4700::1111   |   Clear-DnsClientCache",
        flags: [
          ["Resolve-DnsName", "Query AAAA, A, MX, TXT, CNAME, SRV records"],
          ["-Server 2606:4700:4700::1111", "Query a specific upstream IPv6 DNS resolver"],
          ["Clear-DnsClientCache", "Flush local DNS cache (same as ipconfig /flushdns)"]
        ],
        tags: ["dns", "ipv6", "aaaa", "dig", "nslookup", "flush", "txt", "mx"]
      },
      {
        id: "invoke-restmethod-webrequest",
        mode: "NETWORK",
        modeClass: "mode-t",
        desc: "Fetch JSON REST APIs directly into PowerShell objects or download files via HTTP",
        cmd: "Invoke-RestMethod -Uri 'https://ifconfig.me/all.json'   |   Invoke-WebRequest -Uri $url -OutFile app.zip",
        flags: [
          ["Invoke-RestMethod (irm)", "Automatically parses JSON/XML HTTP response into native objects!"],
          ["Invoke-WebRequest (iwr)", "Download files or inspect HTTP status headers"]
        ],
        tip: "Note: use curl.exe for real curl",
        tags: ["curl", "http", "api", "rest", "download", "irm"]
      },
      {
        id: "ip-adapters-firewall",
        mode: "NETWORK",
        modeClass: "mode-t",
        desc: "List clean IPv4 addresses, network interfaces, or open a Windows Firewall port",
        cmd: "Get-NetIPAddress -AddressFamily IPv4 | Select-Object InterfaceAlias, IPAddress   |   New-NetFirewallRule -DisplayName 'Dev 8080' -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow",
        flags: [
          ["Get-NetAdapter", "List physical & virtual NICs with link speed and MAC address"],
          ["New-NetFirewallRule", "Create inbound/outbound Windows Defender Firewall rule from Admin PS"]
        ],
        tags: ["ip", "ipconfig", "firewall", "adapter", "nic", "port"]
      }
    ]
  },
  {
    id: "winget-pkg",
    badge: "pkg",
    title: "Winget, Packages & PS Modules",
    subtitle: "Windows Package Manager (winget), batch upgrades, exports & ExecutionPolicy",
    commands: [
      {
        id: "winget-search-install",
        mode: "WINGET",
        modeClass: "mode-c",
        desc: "Search and install applications silently using the official Windows Package Manager",
        cmd: "winget search neovim   |   winget install -e --id Neovim.Neovim   |   winget install --id Git.Git -s winget",
        flags: [
          ["-e (--exact)", "Match exact package identifier (case-sensitive)"],
          ["--id <Publisher.App>", "Install unambiguously by canonical package ID"],
          ["--silent / -h", "Run installer silently without GUI prompts"]
        ],
        tip: "Built into Windows 10/11",
        tags: ["winget", "install", "package", "app", "search"]
      },
      {
        id: "winget-upgrade-all",
        mode: "WINGET",
        modeClass: "mode-c",
        desc: "List all outdated applications on the PC and upgrade everything in one command",
        cmd: "winget upgrade   |   winget upgrade --all --include-unknown --silent",
        flags: [
          ["winget upgrade", "Show table of installed apps that have newer versions available"],
          ["--all", "Upgrade all outdated packages automatically"],
          ["winget uninstall --id <id>", "Cleanly uninstall application"]
        ],
        tags: ["upgrade", "update", "patch", "winget", "uninstall"]
      },
      {
        id: "winget-export-import",
        mode: "WINGET",
        modeClass: "mode-c",
        desc: "Export all installed software to a JSON manifest and restore on a fresh Windows install",
        cmd: "winget export -o winget-pkgs.json   |   winget import -i winget-pkgs.json --accept-package-agreements",
        flags: [
          ["export -o <file>", "Save reproducible JSON list of installed packages"],
          ["import -i <file>", "Batch-install all packages from exported JSON manifest"]
        ],
        tip: "Reproducible PC setup",
        tags: ["export", "import", "backup", "migrate", "manifest"]
      },
      {
        id: "ps-execution-policy-modules",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Allow local PowerShell scripts (.ps1) to run, unblock downloaded scripts, or install modules",
        cmd: "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser   |   Unblock-File .\\script.ps1",
        flags: [
          ["RemoteSigned", "Allow local scripts to run while requiring signatures on internet-downloaded scripts"],
          ["-Scope CurrentUser", "Apply without needing Administrator privileges"],
          ["Unblock-File", "Remove Zone.Identifier ('Mark of the Web') from a downloaded file"]
        ],
        tags: ["executionpolicy", "scripts", "unblock", "security", "ps1"]
      }
    ]
  },
  {
    id: "wsl",
    badge: "wsl",
    title: "WSL 2 (Subsystem for Linux) & Interop",
    subtitle: "Distro lifecycle, snapshots/exports, VM shutdown & seamless Windows-Linux piping",
    commands: [
      {
        id: "wsl-install-list",
        mode: "WSL 2",
        modeClass: "mode-v",
        desc: "Install WSL 2 and Linux distributions, check running state, or update the WSL kernel",
        cmd: "wsl --install -d Ubuntu   |   wsl --list --verbose   |   wsl --update   |   wsl --status",
        flags: [
          ["wsl -l -v", "List installed distros, running/stopped state, and WSL version (1 or 2)"],
          ["wsl -l --online", "List all official distros available for download"],
          ["wsl --set-default <Distro>", "Set default distribution launched by 'wsl'"]
        ],
        tags: ["wsl", "ubuntu", "linux", "install", "distro", "update"]
      },
      {
        id: "wsl-shutdown-root",
        mode: "WSL 2",
        modeClass: "mode-v",
        desc: "Shut down the WSL 2 lightweight VM (reclaims RAM), terminate a distro, or log in as root",
        cmd: "wsl --shutdown   |   wsl --terminate Ubuntu   |   wsl -d Ubuntu -u root",
        flags: [
          ["--shutdown", "Immediately stop all running distros and the WSL 2 virtual machine"],
          ["-u root", "Launch shell inside distro as root (useful to reset forgotten Linux password!)"]
        ],
        tip: "wsl --shutdown frees cached RAM",
        tags: ["shutdown", "stop", "root", "memory", "restart", "vm"]
      },
      {
        id: "wsl-export-import-move",
        mode: "WSL 2",
        modeClass: "mode-v",
        desc: "Snapshot a WSL distribution to a .tar archive or move it to another drive (e.g. D:\\)",
        cmd: "wsl --export Ubuntu D:\\backups\\ubuntu.tar   |   wsl --import UbuntuDev D:\\WSL\\UbuntuDev D:\\backups\\ubuntu.tar",
        flags: [
          ["--export", "Create full tar image backup of distribution rootfs"],
          ["--import <Name> <InstallDir> <Tar>", "Create new distro instance at custom disk path from tar"],
          ["--unregister <Distro>", "Permanently delete distro and its virtual disk (ext4.vhdx)"]
        ],
        tags: ["backup", "export", "import", "move", "drive", "vhdx"]
      },
      {
        id: "wsl-windows-interop",
        mode: "WSL ↔ WIN",
        modeClass: "mode-v",
        desc: "Call Windows executables from Linux bash or access Linux files from File Explorer",
        cmd: "explorer.exe .   |   cat ~/.ssh/id_ed25519.pub | clip.exe   |   pwsh.exe -c 'Get-Date'",
        flags: [
          ["explorer.exe .", "Run inside WSL bash to open current Linux directory in Windows File Explorer"],
          ["clip.exe", "Pipe Linux command output straight into the Windows clipboard"],
          ["wslpath -w $(pwd)", "Convert Linux path (/mnt/c/...) to Windows path (C:\\...)"]
        ],
        tip: "Works directly inside WSL bash!",
        tags: ["interop", "explorer", "clip", "wslpath", "bridge"]
      }
    ]
  },
  {
    id: "reg-env",
    badge: "reg",
    title: "Environment, Profile, Registry & Admin",
    subtitle: "PATH management, $PROFILE customization, Registry PSDrives & RunAs elevation",
    commands: [
      {
        id: "env-vars-path",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Inspect environment variables, split PATH cleanly, or persist user/machine env vars",
        cmd: "$env:PATH -split ';'   |   Get-ChildItem Env:   |   [Environment]::SetEnvironmentVariable('API_KEY', '123', 'User')",
        flags: [
          ["$env:VAR_NAME", "Read or set variable for current PowerShell session"],
          ["'User' / 'Machine'", "Persist variable permanently in HKCU (User) or HKLM (System)"],
          ["where.exe git", "Show all matching executables on PATH in priority order (like which -a)"]
        ],
        tip: "Use where.exe (not where alias)",
        tags: ["path", "env", "environment", "which", "where", "variables"]
      },
      {
        id: "ps-profile-aliases",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Create or edit your PowerShell startup profile ($PROFILE) and inspect command history",
        cmd: "if (!(Test-Path $PROFILE)) { New-Item -Type File -Path $PROFILE -Force }; notepad $PROFILE",
        flags: [
          ["$PROFILE", "Path to CurrentUserCurrentHost startup script"],
          ["(Get-PSReadLineOption).HistorySavePath", "Show file path of persistent cross-session command history"],
          ["Get-Command <cmd> | Select-Object -ExpandProperty Definition", "Inspect source/path of any cmdlet or alias"]
        ],
        tags: ["profile", "bashrc", "history", "psreadline", "startup"]
      },
      {
        id: "registry-psdrive",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Navigate and edit the Windows Registry just like a filesystem via HKCU: and HKLM:",
        cmd: "Get-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'   |   Set-ItemProperty -Path $reg -Name 'Dark' -Value 0",
        flags: [
          ["HKCU: / HKLM:", "Built-in PowerShell drives for HKEY_CURRENT_USER & HKEY_LOCAL_MACHINE"],
          ["Get-ItemProperty (gp)", "Read all registry values under a key"],
          ["Set-ItemProperty (sp)", "Create or update a registry value"]
        ],
        tags: ["registry", "regedit", "hkcu", "hklm", "startup"]
      },
      {
        id: "elevate-runas-admin",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Spawn an elevated Administrator Windows Terminal or check if current shell is Admin",
        cmd: "Start-Process wt -Verb RunAs   |   ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole('Administrator')",
        flags: [
          ["-Verb RunAs", "Trigger UAC prompt to launch process with Administrator privileges"],
          ["IsInRole('Administrator')", "Returns True if current PowerShell session is elevated"]
        ],
        tags: ["sudo", "runas", "admin", "uac", "elevate"]
      }
    ]
  },
  {
    id: "sysadmin-repair",
    badge: "adm",
    title: "System Repair, Robocopy, Power & UEFI",
    subtitle: "DISM & SFC repair, multi-threaded Robocopy, battery reports & direct BIOS reboot",
    commands: [
      {
        id: "dism-sfc-repair",
        mode: "ADMIN CLI",
        modeClass: "mode-t",
        desc: "Repair corrupted Windows system image files using DISM and System File Checker (SFC)",
        cmd: "DISM.exe /Online /Cleanup-Image /RestoreHealth   &&   sfc /scannow",
        flags: [
          ["/RestoreHealth", "Download clean system component files from Windows Update to repair component store"],
          ["sfc /scannow", "Scan and repair protected Windows OS binaries (run after DISM)"]
        ],
        tip: "Run DISM first, then sfc",
        tags: ["repair", "dism", "sfc", "corrupt", "health", "windows"]
      },
      {
        id: "robocopy-mirror-fast",
        mode: "ADMIN CLI",
        modeClass: "mode-t",
        desc: "High-speed multi-threaded directory sync/backup (Windows built-in rsync alternative)",
        cmd: "robocopy C:\\Source D:\\Backup /MIR /Z /MT:16 /R:2 /W:5 /XD node_modules .git /NFL /NDL",
        flags: [
          ["/MIR", "Mirror directory tree (copies new/changed & deletes removed files on destination!)"],
          ["/MT:16", "Use 16 parallel threads for fast small-file copying"],
          ["/Z", "Restartable mode for resilient network transfers"],
          ["/R:2 /W:5", "Retry locked files only 2 times waiting 5s (default is 1 million retries!)"],
          ["/XD", "Exclude specified directories"]
        ],
        danger: "/MIR deletes extra files on dest",
        tags: ["robocopy", "rsync", "backup", "sync", "mirror", "copy"]
      },
      {
        id: "powercfg-battery-sleep",
        mode: "ADMIN CLI",
        modeClass: "mode-t",
        desc: "Generate detailed HTML laptop battery health report or see what is waking/keeping PC awake",
        cmd: "powercfg /batteryreport /output C:\\battery.html   |   powercfg /requests   |   powercfg /lastwake",
        flags: [
          ["/batteryreport", "Generate HTML chart of design vs full charge capacity and cycle history"],
          ["/requests", "Show processes, drivers, or audio streams preventing sleep"],
          ["/lastwake", "Show exact device/timer that woke the PC from sleep last"]
        ],
        tip: "Great laptop health check",
        tags: ["battery", "powercfg", "sleep", "wake", "laptop", "power"]
      },
      {
        id: "shutdown-uefi-bios",
        mode: "ADMIN CLI",
        modeClass: "mode-t",
        desc: "Reboot directly into motherboard UEFI / BIOS setup without mashing Del/F2 on boot",
        cmd: "shutdown /r /fw /t 0   |   shutdown /r /o /t 0",
        flags: [
          ["/r /fw /t 0", "Reboot immediately (/t 0) straight into UEFI Firmware (BIOS) settings (requires Admin)"],
          ["/r /o /t 0", "Reboot into Windows Advanced Startup Options (Safe Mode / Recovery)"]
        ],
        tip: "No more mashing F2/Del!",
        tags: ["bios", "uefi", "firmware", "reboot", "recovery", "safemode"]
      }
    ]
  }
];

// Interactive PowerShell Pipeline Builder Database
const PS_PIPELINE_SOURCES = {
  process: [
    {
      id: "high-ram",
      label: "Processes using > 200 MB RAM",
      desc: "Find processes using > 200 MB RAM sorted by memory usage",
      core: "Get-Process | Where-Object { $_.WorkingSet64 -gt 200MB } | Sort-Object WorkingSet64 -Descending",
      select: "Select-Object Name, Id, CPU, @{N='RAM_MB';E={[math]::Round($_.WorkingSet64/1MB,1)}}"
    },
    {
      id: "top-cpu",
      label: "Top 15 CPU-consuming processes",
      desc: "List the top 15 processes by total CPU time",
      core: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 15",
      select: "Select-Object Name, Id, @{N='CPU_Sec';E={[math]::Round($_.CPU,1)}}, @{N='RAM_MB';E={[math]::Round($_.WorkingSet64/1MB,1)}}"
    },
    {
      id: "unresponsive",
      label: "Frozen / Not Responding GUI apps",
      desc: "Find GUI processes where Responding is False",
      core: "Get-Process | Where-Object { -not $_.Responding }",
      select: "Select-Object Name, Id, MainWindowTitle, StartTime"
    }
  ],
  service: [
    {
      id: "running-auto",
      label: "All currently Running services",
      desc: "List all active Windows services that are currently Running",
      core: "Get-Service | Where-Object { $_.Status -eq 'Running' } | Sort-Object DisplayName",
      select: "Select-Object Name, DisplayName, Status, StartType"
    },
    {
      id: "stopped-auto",
      label: "Automatic services that crashed/stopped",
      desc: "Find services set to Automatic startup that are currently Stopped",
      core: "Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -ne 'Running' }",
      select: "Select-Object Name, DisplayName, Status, StartType"
    }
  ],
  files: [
    {
      id: "large-files",
      label: "Files larger than 100 MB in subtree",
      desc: "Recursively find files larger than 100 MB sorted biggest first",
      core: "Get-ChildItem -Path . -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 100MB } | Sort-Object Length -Descending",
      select: "Select-Object FullName, @{N='Size_MB';E={[math]::Round($_.Length/1MB,1)}}, LastWriteTime"
    },
    {
      id: "recent-24h",
      label: "Files modified in the last 24 hours",
      desc: "Find files changed within the last 24 hours",
      core: "Get-ChildItem -Path . -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-24) } | Sort-Object LastWriteTime -Descending",
      select: "Select-Object FullName, LastWriteTime, Length"
    }
  ],
  ports: [
    {
      id: "listening",
      label: "All Listening TCP Ports + Process Name",
      desc: "List all local listening TCP ports along with owning PID and process name",
      core: "Get-NetTCPConnection -State Listen | Sort-Object LocalPort",
      select: "Select-Object LocalAddress, LocalPort, OwningProcess, @{N='Process';E={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}}"
    },
    {
      id: "established",
      label: "Active Remote Established Connections",
      desc: "Show active outbound/inbound Established TCP connections",
      core: "Get-NetTCPConnection -State Established | Where-Object { $_.RemoteAddress -notlike '127.*' }",
      select: "Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, OwningProcess"
    }
  ],
  events: [
    {
      id: "sys-errors",
      label: "Recent System Error Events (Last 24h)",
      desc: "Query System Event Log for Critical/Error events in the past 24 hours",
      core: "Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 30 -ErrorAction SilentlyContinue",
      select: "Select-Object TimeCreated, Id, ProviderName, LevelDisplayName, Message"
    },
    {
      id: "app-crashes",
      label: "Application Crash Events (Event ID 1000)",
      desc: "Find application crash events (Event ID 1000) in the Application log",
      core: "Get-WinEvent -FilterHashtable @{LogName='Application'; Id=1000} -MaxEvents 20 -ErrorAction SilentlyContinue",
      select: "Select-Object TimeCreated, Id, ProviderName, Message"
    }
  ]
};

const PS_OUTPUT_SUFFIX = {
  table: " | Format-Table -AutoSize",
  json: " | ConvertTo-Json -Depth 3",
  csv: " | Export-Csv -Path .\\report.csv -NoTypeInformation",
  grid: " | Out-GridView -PassThru",
  clip: " | Set-Clipboard"
};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("win_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Syntax Highlighting for Windows Shortcuts & PowerShell Cmdlets
function highlightPsCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\b(?:Win|Ctrl|Alt|Shift)(?:\+[A-Za-z0-9←→↑↓.`]+)+)|(\s\|\s)|(\b[A-Z][a-zA-Z]+-[A-Z][a-zA-Z0-9]+\b|\b(?:winget|wsl|robocopy|powercfg|shutdown|DISM\.exe|sfc|netstat|findstr|where\.exe|explorer\.exe|clip\.exe|notepad)\b)|(\$[a-zA-Z0-9_:]+|\$_)|(\s-[a-zA-Z0-9-]+|\s\/[a-zA-Z0-9:]+)/g,
    (match, shortcut, sep, cmdlet, variable, flag) => {
      if (shortcut) {
        return `<span class="tok-flag">${shortcut}</span>`;
      }
      if (sep) {
        return `<span class="tok-pipe">${sep}</span>`;
      }
      if (cmdlet) {
        return `<span class="tok-cmd">${cmdlet}</span>`;
      }
      if (variable) {
        return `<span class="tok-str">${variable}</span>`;
      }
      if (flag) {
        return `<span class="tok-flag">${flag}</span>`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = WINDOWS_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of WINDOWS_CHEAT_SHEET_DATA) {
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

  for (const section of WINDOWS_CHEAT_SHEET_DATA) {
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
              <code class="cmd-code">${highlightPsCmd(item.cmd)}</code>
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

// Interactive PowerShell Pipeline Builder
function initPsPipelineBuilder() {
  const sourceEl = document.getElementById("ps-source");
  const filterEl = document.getElementById("ps-filter");
  const outputEl = document.getElementById("ps-output");
  const cmdOutputEl = document.getElementById("ps-cmd-output");
  const previewBox = document.getElementById("ps-preview-box");
  const copyBtn = document.getElementById("ps-copy-btn");
  const meaningEl = document.getElementById("ps-meaning-text");
  const presetBtns = document.querySelectorAll(".ps-preset");

  function populateFilters(sourceKey, selectedFilterId) {
    const list = PS_PIPELINE_SOURCES[sourceKey] || [];
    filterEl.innerHTML = list
      .map(
        (f) =>
          `<option value="${f.id}" ${f.id === selectedFilterId ? "selected" : ""}>${escapeHtml(f.label)}</option>`
      )
      .join("");
  }

  function updatePipelinePreview() {
    const sourceKey = sourceEl.value;
    const list = PS_PIPELINE_SOURCES[sourceKey] || [];
    const current = list.find((f) => f.id === filterEl.value) || list[0];
    if (!current) return;

    const outKey = outputEl.value;
    const suffix = PS_OUTPUT_SUFFIX[outKey] || "";
    const fullCmd = `${current.core} | ${current.select}${suffix}`;

    cmdOutputEl.innerHTML = highlightPsCmd(fullCmd);
    previewBox.dataset.copy = fullCmd;
    meaningEl.textContent = current.desc;

    presetBtns.forEach((btn) => {
      const active =
        btn.dataset.source === sourceKey &&
        btn.dataset.filter === current.id &&
        btn.dataset.output === outKey;
      btn.classList.toggle("active", active);
    });
  }

  sourceEl.addEventListener("change", () => {
    populateFilters(sourceEl.value);
    updatePipelinePreview();
  });

  filterEl.addEventListener("change", updatePipelinePreview);
  outputEl.addEventListener("change", updatePipelinePreview);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      sourceEl.value = btn.dataset.source;
      populateFilters(btn.dataset.source, btn.dataset.filter);
      outputEl.value = btn.dataset.output;
      updatePipelinePreview();
    });
  });

  previewBox.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  populateFilters("process", "high-ram");
  updatePipelinePreview();
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
        showToast("Removed from saved items");
      } else {
        state.bookmarks.add(id);
        showToast("Saved to bookmarks");
      }
      localStorage.setItem("win_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
initPsPipelineBuilder();
initMiniTabs();
initEvents();
