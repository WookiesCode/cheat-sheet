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
        cmd: "Win+X   |   Ctrl+Shift+Esc   |   Ctrl+Shift+Enter",
        flags: [
          ["Win+X", "Open Power User menu (Terminal, Disk Mgmt, Device Mgr, Event Viewer)"],
          ["Win+X → Terminal (Admin)", "An elevated terminal from the same menu (the underlined letter in the menu is the key)"],
          ["Ctrl+Shift+Esc", "Open Task Manager directly"],
          ["Ctrl+Shift+Enter", "Run selected Start Menu or Win+R command as Administrator (Elevated)"]
        ],
        tip: "Win+X = right-click on Start",
        tags: ["admin", "elevate", "task-manager", "shutdown", "menu", "terminal"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec","title":"Microsoft: keyboard shortcuts in Windows"}],"note":"Corrected 2026-11-10: the Win+X letter shortcuts were wrong (I is Terminal, not Terminal (Admin)) and are not in Microsoft's list; Ctrl+Shift+Enter (run elevated) isn't in it either."}
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
        tags: ["snap", "tile", "monitor", "layout", "minimize", "desktop"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec","title":"Microsoft: keyboard shortcuts in Windows"}]}
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
        tags: ["virtual-desktop", "workspaces", "task-view", "switch"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec","title":"Microsoft: keyboard shortcuts in Windows"}]}
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
          ["Win+Ctrl+Shift+B", "Wake the display from a blank or black screen (Microsoft's description; widely described as resetting the graphics driver)"],
          ["Win+Ctrl+V", "Open quick audio output/input device switcher (Win 11)"]
        ],
        tip: "Win+Ctrl+Shift+B fixes black screens",
        tags: ["clipboard", "screenshot", "snip", "record", "gpu", "audio"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec","title":"Microsoft: keyboard shortcuts in Windows"},{"url":"https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots-00246869-1843-655f-f220-97299b865f6b","title":"Microsoft: Snipping Tool"},{"url":"https://support.microsoft.com/en-us/windows/clipboard-in-windows-c436501e-985d-1c8d-97ea-fe46ddf338c6","title":"Microsoft: clipboard history"}],"note":"Microsoft describes Win+Ctrl+Shift+B as waking the PC from a blank or black screen."}
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
        tags: ["explorer", "path", "copy", "terminal", "folder", "preview"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec","title":"Microsoft: keyboard shortcuts in Windows"},{"url":"https://blogs.windows.com/windows-insider/2021/09/22/announcing-windows-11-insider-preview-build-22463/","title":"Windows Insider build 22463 (Ctrl+Shift+C)"}]}
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
        tags: ["disk", "storage", "nvme", "ssd", "smart", "partition"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/storage/get-disk","title":"Get-Disk"},{"url":"https://learn.microsoft.com/en-us/powershell/module/storage/get-physicaldisk","title":"Get-PhysicalDisk"},{"url":"https://learn.microsoft.com/en-us/powershell/module/storage/get-storagereliabilitycounter","title":"Get-StorageReliabilityCounter"}]}
      },
      {
        id: "disk-partition-format",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Initialize raw disk as GPT, create partition using maximum space and format with NTFS/ReFS",
        cmd: "Initialize-Disk -Number 1 -PartitionStyle GPT; New-Partition -DiskNumber 1 -UseMaximumSize -AssignDriveLetter | Format-Volume -FileSystem NTFS -NewFileSystemLabel 'Data' -Confirm:$false",
        flags: [
          ["Initialize-Disk", "Initializes a RAW unformatted disk without partition table"],
          ["New-Partition", "Creates primary partition with drive letter assignment"],
          ["Format-Volume", "Formats volume with NTFS, ReFS, or FAT32 with specified cluster allocation size"]
        ],
        subcommands: [
          ["Get-Volume | Select-Object DriveLetter, FileSystemLabel, FileSystem, @{Name='Free_GB'; Expression={[math]::Round($_.SizeRemaining/1GB, 1)}}", "List all mounted logical volumes and free capacity"],
          ["Optimize-Volume -DriveLetter C -Verbose", "Optimize the volume the right way for its media: retrim on an SSD, analyze and defrag on an HDD (-Defrag alone always defragments)"]
        ],
        tip: "Pass -Confirm:$false for automated non-interactive scripting",
        tags: ["format", "partition", "volume", "ntfs", "refs", "gpt", "trim"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/storage/initialize-disk","title":"Initialize-Disk"},{"url":"https://learn.microsoft.com/en-us/powershell/module/storage/new-partition","title":"New-Partition"},{"url":"https://learn.microsoft.com/en-us/powershell/module/storage/format-volume","title":"Format-Volume"},{"url":"https://learn.microsoft.com/en-us/powershell/module/storage/get-volume","title":"Get-Volume"},{"url":"https://learn.microsoft.com/en-us/powershell/module/storage/optimize-volume","title":"Optimize-Volume"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipeline_chain_operators","title":"about_Pipeline_Chain_Operators (&& is PowerShell 7+)"}],"note":"Corrected 2026-11-10: && needs PowerShell 7 (now ;), and -Defrag is not TRIM."}
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
        tags: ["bitlocker", "encryption", "tpm", "recovery-key", "manage-bde", "security"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/bitlocker/get-bitlockervolume","title":"Get-BitLockerVolume"},{"url":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/manage-bde-protectors","title":"manage-bde -protectors"},{"url":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/manage-bde-status","title":"manage-bde -status"}]}
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
        tags: ["process", "kill", "memory", "cpu", "top", "stop-process"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process","title":"Get-Process"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/stop-process","title":"Stop-Process"}]}
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
        tags: ["commandline", "arguments", "parent", "pid", "cim", "wmi"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance","title":"Get-CimInstance"},{"url":"https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-process","title":"Win32_Process class"}]}
      },
      {
        id: "windows-services-manage",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Query, restart, or change startup type of Windows background services",
        cmd: "Get-Service | Where-Object {$_.Status -eq 'Running'}   |   Restart-Service -Name 'Spooler' -Force",
        flags: [
          ["Restart-Service -Force", "Restart without asking for confirmation"],
          ["Set-Service -Name <svc> -StartupType Automatic", "Configure service startup mode (Automatic, Manual, Disabled)"]
        ],
        tags: ["service", "daemon", "restart", "running", "startup"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-service","title":"Get-Service"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/restart-service","title":"Restart-Service"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/set-service","title":"Set-Service"}],"note":"Corrected 2026-11-10: -Force skips the confirmation prompt."}
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
        tags: ["logs", "event-viewer", "errors", "crash", "winevent"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-winevent","title":"Get-WinEvent"}]}
      },
      {
        id: "hardware-specs-uptime",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Check system boot time / uptime, motherboard/BIOS info, and RAM DIMM slots",
        cmd: "(Get-Date) - (Get-CimInstance Win32_OperatingSystem).LastBootUpTime   |   Get-ComputerInfo",
        flags: [
          ["LastBootUpTime", "When Windows last did a full boot. With Fast Startup on, Shut down only hibernates the kernel, so this (like Task Manager's uptime) doesn't reset; Restart does"],
          ["Get-CimInstance Win32_PhysicalMemory", "Inspect RAM speed, manufacturer, and capacity per physical slot"],
          ["Get-CimInstance Win32_BIOS", "Show BIOS version and machine serial number"]
        ],
        tags: ["uptime", "boot", "hardware", "ram", "bios", "serial"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows/win32/cimwin32prov/win32-operatingsystem","title":"Win32_OperatingSystem class"},{"url":"https://learn.microsoft.com/en-us/powershell/module/cimcmdlets/get-ciminstance","title":"Get-CimInstance"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-computerinfo","title":"Get-ComputerInfo"},{"url":"https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/distinguishing-fast-startup-from-wake-from-hibernation","title":"Microsoft: fast startup vs hibernation"}],"note":"Corrected 2026-11-10: Fast Startup shutdown is a kernel hibernate, so LastBootUpTime does not reset on Shut down."}
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
        tags: ["ports", "listen", "pid", "netstat", "lsof", "tcp"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection","title":"Get-NetTCPConnection"},{"url":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/netstat","title":"netstat"}]}
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
        tags: ["ping", "ipv6", "port", "telnet", "nc", "traceroute", "tnc"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection","title":"Test-NetConnection"}]}
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
        tags: ["dns", "ipv6", "aaaa", "dig", "nslookup", "flush", "txt", "mx"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname","title":"Resolve-DnsName"},{"url":"https://learn.microsoft.com/en-us/powershell/module/dnsclient/clear-dnsclientcache","title":"Clear-DnsClientCache"}]}
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
        tags: ["curl", "http", "api", "rest", "download", "irm"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-restmethod","title":"Invoke-RestMethod"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-webrequest","title":"Invoke-WebRequest"},{"url":"https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell","title":"PowerShell 7 vs Windows PowerShell (curl alias)"}]}
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
        tags: ["ip", "ipconfig", "firewall", "adapter", "nic", "port"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-netipaddress","title":"Get-NetIPAddress"},{"url":"https://learn.microsoft.com/en-us/powershell/module/netadapter/get-netadapter","title":"Get-NetAdapter"},{"url":"https://learn.microsoft.com/en-us/powershell/module/netsecurity/new-netfirewallrule","title":"New-NetFirewallRule"}]}
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
        tags: ["winget", "install", "package", "app", "search"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows/package-manager/winget/search","title":"winget search"},{"url":"https://learn.microsoft.com/en-us/windows/package-manager/winget/install","title":"winget install"}]}
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
        tags: ["upgrade", "update", "patch", "winget", "uninstall"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows/package-manager/winget/upgrade","title":"winget upgrade"},{"url":"https://learn.microsoft.com/en-us/windows/package-manager/winget/uninstall","title":"winget uninstall"}]}
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
        tags: ["export", "import", "backup", "migrate", "manifest"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows/package-manager/winget/export","title":"winget export"},{"url":"https://learn.microsoft.com/en-us/windows/package-manager/winget/import","title":"winget import"}]}
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
        tags: ["executionpolicy", "scripts", "unblock", "security", "ps1"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy","title":"Set-ExecutionPolicy"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/unblock-file","title":"Unblock-File"}]}
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
        tags: ["wsl", "ubuntu", "linux", "install", "distro", "update"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows/wsl/basic-commands","title":"WSL basic commands"}]}
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
        tags: ["shutdown", "stop", "root", "memory", "restart", "vm"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows/wsl/basic-commands","title":"WSL basic commands"}]}
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
        tags: ["backup", "export", "import", "move", "drive", "vhdx"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows/wsl/basic-commands","title":"WSL basic commands"}]}
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
        tags: ["interop", "explorer", "clip", "wslpath", "bridge"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows/wsl/filesystems","title":"WSL: working across file systems"}]}
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
        cmd: "$env:PATH -split ';'   |   Get-ChildItem Env:   |   [Environment]::SetEnvironmentVariable('EDITOR', 'code --wait', 'User')",
        flags: [
          ["$env:VAR_NAME", "Read or set variable for current PowerShell session"],
          ["'User' / 'Machine'", "Persist the variable in HKCU (User) or HKLM (Machine; needs an elevated shell). Already-open shells don't see it; keep secrets out of env vars"],
          ["where.exe git", "Show all matching executables on PATH in priority order (like which -a)"]
        ],
        tip: "Use where.exe (not where alias)",
        tags: ["path", "env", "environment", "which", "where", "variables"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/dotnet/api/system.environment.setenvironmentvariable","title":"Environment.SetEnvironmentVariable"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables","title":"about_Environment_Variables"},{"url":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/where","title":"where"}]}
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
        tags: ["profile", "bashrc", "history", "psreadline", "startup"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles","title":"about_Profiles"},{"url":"https://learn.microsoft.com/en-us/powershell/module/psreadline/about/about_psreadline","title":"about_PSReadLine"},{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/get-command","title":"Get-Command"}]}
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
        tags: ["registry", "regedit", "hkcu", "hklm", "startup"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_registry_provider","title":"about_Registry_Provider"}]}
      },
      {
        id: "elevate-runas-admin",
        mode: "POWERSHELL",
        modeClass: "mode-n",
        desc: "Spawn an elevated Administrator Windows Terminal or check if current shell is Admin",
        cmd: "Start-Process wt -Verb RunAs   |   ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)",
        flags: [
          ["-Verb RunAs", "Trigger UAC prompt to launch process with Administrator privileges"],
          ["IsInRole([...WindowsBuiltInRole]::Administrator)", "True if this session is elevated. Use the built-in role, not the string 'Administrator': a string is matched against a group name"]
        ],
        tags: ["sudo", "runas", "admin", "uac", "elevate"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/start-process","title":"Start-Process"},{"url":"https://learn.microsoft.com/en-us/dotnet/api/system.security.principal.windowsprincipal.isinrole","title":"WindowsPrincipal.IsInRole"}],"note":"Corrected 2026-11-10: IsInRole('Administrator') matches a group named Administrator; use WindowsBuiltInRole."}
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
        cmd: "DISM.exe /Online /Cleanup-Image /RestoreHealth",
        flags: [
          ["/RestoreHealth", "Download clean system component files from Windows Update to repair component store"],
          ["sfc /scannow", "Scan and repair protected Windows OS binaries (run after DISM)"]
        ],
        tip: "Run DISM first, then sfc",
        tags: ["repair", "dism", "sfc", "corrupt", "health", "windows"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image","title":"Repair a Windows image (DISM)"},{"url":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sfc","title":"sfc"}],"note":"Corrected 2026-11-10: DISM and sfc are now separate lines (&& fails in Windows PowerShell 5.1)."}
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
        tags: ["robocopy", "rsync", "backup", "sync", "mirror", "copy"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy","title":"robocopy"}]}
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
        tags: ["battery", "powercfg", "sleep", "wake", "laptop", "power"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/powercfg-command-line-options","title":"powercfg options"}]}
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
        tags: ["bios", "uefi", "firmware", "reboot", "recovery", "safemode"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shutdown","title":"shutdown"}]}
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
