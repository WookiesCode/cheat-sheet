const CLI_TOOLS_DATA = [
  {
    id: "grep",
    badge: "grp",
    title: "grep — Pattern, Regex & Log Search",
    subtitle: "Extended & Perl regex (-E / -P), context lines (-A/-B/-C), comment stripping, zgrep & sysfs multi-file reads",
    commands: [
      {
        id: "grep-recursive-context",
        desc: "Search logs or directories recursively with Extended Regex, line numbers, binary skip & surrounding context",
        cmd: "grep -rnIE -C 3 --color=auto 'ERROR|CRITICAL|FATAL|panic|MCE|AER' /var/log/",
        details: "The primary data center log triage command. '-r' walks directories recursively, '-n' prints 1-based line numbers, '-I' skips binary files so they don't corrupt your terminal, '-E' enables Extended Regex alternation '|', and '-C 3' prints 3 lines before and after every match.",
        flags: [
          ["-r / -R", "Recursive directory search (-R follows all symlinks; -r follows only command-line symlinks)"],
          ["-n", "Prefix each matching output line with its 1-based line number within the file"],
          ["-I", "Process binary files as if they do not match (prevents terminal garbage)"],
          ["-E", "Extended Regular Expressions (enables |, +, ?, (), {m,n} without backslashes)"],
          ["-C 3", "Print 3 lines of leading (-B 3) and trailing (-A 3) context around each match"],
          ["-i", "Case-insensitive matching"]
        ],
        subcommands: [
          ["grep -rnI -B 2 -A 5 'Out of memory' /var/log/", "Show 2 lines before (-B 2) and 5 lines after (-A 5) an OOM-killer trigger"],
          ["grep -rnI --include='*.conf' --include='*.yaml' 'timeout' /etc/", "Search only files matching specific filename globs (--include) inside /etc/"],
          ["grep -rnI --exclude-dir={.git,node_modules,venv,proc,sys} 'listen' /", "Exclude specific directories (--exclude-dir) when searching large trees"]
        ],
        tip: "Always include -I to skip binaries",
        tags: ["grep", "search", "logs", "context", "recursive", "regex", "errors"]
      },
      {
        id: "grep-invert-clean-configs",
        desc: "Invert match (-v) to strip comments and blank lines from config files or filter out noisy log lines",
        cmd: "grep -Ev '^\\s*(#|$|;)' /etc/ssh/sshd_config",
        details: "Config files in /etc often have hundreds of '#' or ';' comments and blank lines. 'grep -Ev' inverts the match (-v), printing only active configuration directives.",
        flags: [
          ["-v", "Invert match: select only non-matching lines"],
          ["^\\s*(#|$|;)", "Matches lines starting with optional whitespace followed by #, ;, or empty line"],
          ["-e <pat>", "Specify multiple independent patterns (e.g. grep -v -e 'CRON' -e 'keepalive')"]
        ],
        subcommands: [
          ["grep -v -e 'CRON' -e 'systemd-logind' /var/log/syslog | tail -n 50", "Filter out repetitive cron and session noise when inspecting /var/log/syslog"],
          ["grep -Fxv -f known_good_hosts.txt all_rack_hosts.txt", "Compare two plain lists and print lines in all_rack_hosts.txt that are missing from known_good_hosts.txt"]
        ],
        tip: "Instant active-config view",
        tags: ["grep", "invert", "comments", "config", "diff", "filter"]
      },
      {
        id: "grep-pcre-extract",
        desc: "Extract only the matched token (-o) using Perl-Compatible Regex (-P) lookarounds and \\K match reset",
        cmd: "grep -Po '([0-9]{1,3}\\.){3}[0-9]{1,3}' /var/log/auth.log | sort | uniq -c | sort -nr | head",
        details: "Adding '-o' (--only-matching) prints ONLY the matched substring on its own line. Combining '-P' (PCRE) with '\\K' (keep only what follows '\\K') lets you extract values from 'key=value' log lines without sed or awk.",
        flags: [
          ["-P", "Perl-Compatible Regular Expression (supports \\d, \\s, \\w, \\K, (?=...))"],
          ["-o", "Print only the matched parts of a matching line, each on a separate line"],
          ["\\K", "PCRE operator: discard everything matched to the left of \\K from the final -o output"]
        ],
        subcommands: [
          ["grep -Po 'user=\\K[^ ]+' /var/log/auth.log | sort | uniq -c | sort -nr", "Extract only the value after 'user=' using \\K without printing 'user=' itself"],
          ["grep -Eio '([0-9a-f]{2}:){5}[0-9a-f]{2}' /var/log/syslog | sort -u", "Extract all unique MAC addresses (XX:XX:XX:XX:XX:XX) from a log file"],
          ["grep -Po '[0-9a-f]{4}:[0-9a-f]{2}:[0-9a-f]{2}\\.[0-7]' /var/log/kern.log | sort -u", "Extract all unique PCIe BDF addresses (0000:3b:00.0) mentioned in kernel error logs"]
        ],
        tip: "grep -Po 'key=\\K\\S+' extracts values cleanly",
        tags: ["grep", "pcre", "extract", "ip", "mac", "bdf", "only-matching"]
      },
      {
        id: "grep-files-counts-flags",
        desc: "List matching filenames (-l / -L), count matches (-c), match whole words (-w), read sysfs (-H '') & zgrep",
        cmd: "grep -H '' /sys/class/net/*/operstate /sys/class/net/*/speed 2>/dev/null",
        details: "'grep -H \"\" /sys/...' is a classic sysadmin trick: since empty pattern '' matches every line and '-H' forces printing the filename prefix, it prints 'filepath:value' for dozens of sysfs pseudo-files in one shot.",
        flags: [
          ["-w / -x", "Match whole words only (-w) or whole lines only (-x)"],
          ["-F", "Fixed literal string search (disables regex metacharacters; fastest mode)"],
          ["-l / -L", "Print only filenames WITH matches (-l) or filenames WITHOUT any matches (-L)"],
          ["-c", "Print count of matching lines per file"],
          ["-H / -h", "Always print filename prefix (-H) or suppress filename prefix (-h)"]
        ],
        subcommands: [
          ["grep -rnw '/dev/sd' /etc/fstab /etc/mdadm/", "Whole-word search (-w) so '/dev/sda' does not accidentally match '/dev/sda1'"],
          ["zgrep -iE 'mce|edac|nvme|xid' /var/log/kern.log* /var/log/syslog*", "Search across both plain-text and gzip-compressed (.gz) rotated log files transparently"]
        ],
        tip: "grep -H '' /sys/... reads many sysfs files with filenames!",
        tags: ["grep", "zgrep", "fgrep", "sysfs", "count", "filenames", "word"]
      }
    ]
  },
  {
    id: "ps",
    badge: "ps",
    title: "ps — Process, Thread & State Inspection",
    subtitle: "Custom -eo columns, STAT state triage, hung D-state kernel wchan, CPU core affinity (psr) & thread views",
    commands: [
      {
        id: "ps-custom-columns-sort",
        desc: "Display custom process table sorted by Resident Memory (RSS) or CPU% with exact start time and PPID",
        cmd: "ps -eo pid,ppid,nlwp,user,stat,%cpu,%mem,rss,lstart,args --sort=-%mem | head -n 20",
        details: "'ps -eo <columns>' lets you specify the exact kernel process fields you need without truncating usernames and sort descending (-) or ascending (+) by any metric ('--sort=-%mem', '--sort=-%cpu', '--sort=-rss', '--sort=etimes').",
        flags: [
          ["-e", "Select every process running on the system"],
          ["-o <cols>", "User-defined columns (pid, ppid, nlwp=thread count, rss=resident KiB, etimes=elapsed secs)"],
          ["--sort=-%mem", "Sort descending (-) or ascending (+) by any specified column key"],
          ["--forest", "Render ASCII art parent-child process tree"]
        ],
        subcommands: [
          ["ps -eo pid,ppid,user,%cpu,%mem,etimes,comm --sort=-%cpu | head -n 15", "List top 15 CPU-consuming processes along with elapsed runtime in seconds (etimes)"],
          ["ps -ef --forest", "Display full ASCII process hierarchy tree showing parent-child spawning relationships"]
        ],
        tip: "nlwp shows thread count per process",
        tags: ["ps", "memory", "rss", "cpu", "sort", "threads", "forest"]
      },
      {
        id: "ps-d-state-zombie-wchan",
        desc: "Diagnose hung Uninterruptible I/O ('D' state) processes, kernel wait channels (wchan) & Zombie ('Z') parents",
        cmd: "ps -eo pid,ppid,user,stat,wchan:28,lstart,args | awk 'NR==1 || $4 ~ /^[DZ]/'",
        details: "When an NFS mount hangs or a RAID/NVMe controller stalls, processes enter 'D' state (Uninterruptible sleep inside a kernel syscall) and ignore SIGKILL (-9). Inspecting 'wchan' (Kernel Wait Channel) and '/proc/<PID>/stack' reveals the exact kernel function where the process is blocked.",
        flags: [
          ["stat", "Process state: D = Uninterruptible I/O sleep, Z = Zombie (defunct), R = Running, S = Sleeping"],
          ["wchan:28", "Name of the kernel function in which the process is sleeping (widened to 28 chars)"]
        ],
        subcommands: [
          ["head -n 30 /proc/$(pgrep -o -r D)/stack", "Print the live kernel call stack of the oldest process currently stuck in 'D' state"],
          ["ps -eo pid,ppid,stat,comm | awk '$3 ~ /^Z/ {print \"Zombie PID:\", $1, \"-> Parent PPID:\", $2, $4}'", "Identify Zombie processes and print the Parent PID (PPID) that failed to reap them"]
        ],
        tip: "Kill Parent (PPID) to clear Zombies; fix I/O to clear D-state",
        tags: ["ps", "d-state", "zombie", "wchan", "hung", "sigkill", "stack"]
      },
      {
        id: "ps-threads-cpu-affinity",
        desc: "Inspect individual threads (LWP/TID), see which physical CPU core (psr) each thread is running on & check cgroups",
        cmd: "ps -eLo pid,lwp,psr,user,%cpu,stat,comm --sort=-%cpu | head -n 25",
        details: "'ps -eL' expands every process into its individual Light Weight Processes (threads / LWP) and 'psr' shows the exact logical CPU core ID currently executing that thread.",
        flags: [
          ["-L / -T", "Show individual threads with LWP / SPID (Thread ID) and NLWP columns"],
          ["psr", "Processor / logical CPU core ID currently executing the thread"],
          ["cgroup:50", "Display systemd slice / container cgroup path owning the process"]
        ],
        subcommands: [
          ["ps -T -p <PID> -o pid,spid,psr,%cpu,stat,comm", "List all threads belonging to a single PID along with their assigned CPU core (psr)"],
          ["ps -eo pid,user,cgroup:50,comm | grep -i '.service'", "Map running PIDs back to their owning systemd .service or container cgroup slice"],
          ["pgrep -fa 'python.*worker' && pkill -SIGTERM -f 'python.*worker'", "Safely match or signal processes by full command line using pgrep/pkill"]
        ],
        tip: "psr column reveals CPU pinning & core hotspots",
        tags: ["ps", "threads", "lwp", "psr", "cpu-core", "affinity", "cgroup", "pgrep", "pkill"]
      }
    ]
  },
  {
    id: "ls",
    badge: "ls",
    title: "ls — Directory, Inode & Sparse Block Listing",
    subtitle: "Sorting by mtime/size/version (-t/-S/-v), inode numbers (-i), allocated vs sparse disk blocks (-s) & full-iso time",
    commands: [
      {
        id: "ls-sorting-timestamps",
        desc: "List files sorted by modification time, file size, or natural version number with full ISO timestamps",
        cmd: "ls -lahtr --time-style=full-iso /var/log/",
        details: "'ls -lahtr' puts the most recently modified log files right at the bottom of your terminal above your prompt. '--time-style=full-iso' displays nanosecond timestamps with timezone offsets to correlate file writes with kernel dmesg or BMC events.",
        flags: [
          ["-l -a -h", "Long format (-l), include hidden dotfiles (-a), human-readable sizes K/M/G (-h)"],
          ["-t / -S / -v", "Sort by mtime newest first (-t), file size largest first (-S), or natural version (-v)"],
          ["-r", "Reverse sort order (with -lt, puts newest files at the bottom of the screen)"],
          ["--time-style=full-iso", "Format timestamps as YYYY-MM-DD HH:MM:SS.nnnnnnnnn +ZZZZ"],
          ["-d", "List directory entries themselves rather than their contents (ls -ld /var/www)"]
        ],
        subcommands: [
          ["ls -laSrh /var/log/", "List files sorted by size with the largest files at the bottom of the terminal"],
          ["ls -l --time=atime /etc/passwd", "Show last access/read timestamp (atime) or metadata change timestamp (--time=ctime)"],
          ["ls -ld /var /var/log /var/log/nginx", "Inspect permissions and ownership of directory entries themselves (-d)"]
        ],
        tip: "ls -lahtr puts newest files right above your prompt",
        tags: ["ls", "sort", "time", "size", "iso", "timestamp", "directory"]
      },
      {
        id: "ls-inodes-sparse-blocks",
        desc: "Inspect filesystem inode numbers (-i), actual allocated disk blocks vs sparse size (-s), and numeric UIDs (-n)",
        cmd: "ls -lahis --color=auto /var/lib/libvirt/images/",
        details: "Virtual machine images (.qcow2/.raw) and core dumps are often sparse files whose apparent size ('ls -lh') is 100 GiB while only consuming 4 GiB on disk. 'ls -lhs' prints the actual allocated disk space in column 1 alongside the apparent file size.",
        flags: [
          ["-i", "Print each file's filesystem inode number in the first column"],
          ["-s", "Print actual allocated filesystem disk space for each file (reveals sparse files)"],
          ["-n", "List numeric UID and GID numbers instead of resolving username/group strings"],
          ["-Z", "Display AppArmor / SELinux security context label"]
        ],
        subcommands: [
          ["ls -li /etc/localtime", "Check inode number and hardlink count of a file"],
          ["ls -1 /etc/netplan/", "Force single-column output (one filename per line)"]
        ],
        tip: "Compare column 1 (-s) vs size column to spot sparse files",
        tags: ["ls", "inode", "sparse", "blocks", "uid", "gid"]
      }
    ]
  },
  {
    id: "stat",
    badge: "stt",
    title: "stat — Inode & Filesystem Metadata",
    subtitle: "Octal & symbolic permissions, birth/access/modify/change timestamps, device IDs & filesystem block/inode status",
    commands: [
      {
        id: "stat-file-filesystem",
        desc: "Inspect complete file inode metadata (timestamps, octal mode, UID/GID, links) or filesystem-level block/inode counters",
        cmd: "stat /etc/fstab && stat -f /var/log",
        details: "'stat <file>' queries the exact struct stat inode fields: Access (atime), Modify (mtime = content changed), Change (ctime = permissions/ownership/link metadata changed), and Birth (crtime = creation time on ext4/xfs/btrfs). Adding '-f' queries statfs() for the underlying filesystem.",
        flags: [
          ["-f", "Display filesystem status (block size, total/free blocks, total/free inodes, fs type) instead of file status"],
          ["-L", "Follow symlinks and stat the target file instead of the symlink itself"],
          ["-c <fmt>", "Custom printf-style format (%a=octal perms, %A=symbolic, %s=bytes, %i=inode, %U=owner, %y=mtime)"]
        ],
        subcommands: [
          ["stat -c '%a %A  %U:%G  %10s  %n' /etc/ssh/*_key*", "Print concise custom columns: octal mode (%a), symbolic mode (%A), owner:group, size, and filename"],
          ["stat -L /dev/disk/by-id/*", "Dereference symlinks (-L) to inspect the target block device major/minor numbers"]
        ],
        tip: "stat -c '%a %n' prints octal permissions (e.g. 600)",
        tags: ["stat", "inode", "octal", "timestamps", "birth", "ctime", "mtime"]
      }
    ]
  },
  {
    id: "namei",
    badge: "nmi",
    title: "namei — Path & Symlink Permission Chain Resolver",
    subtitle: "Walking every parent directory and symlink from '/' down to a target path to spot broken permissions or loops",
    commands: [
      {
        id: "namei-path-permissions",
        desc: "Trace every directory component and symlink from root '/' down to a file with permissions and ownership at each hop",
        cmd: "namei -l /var/www/html/index.html",
        details: "When a service fails with 'Permission denied' even though the target file itself is 644/755, one of its parent directories (/var, /var/www, or a symlink target) is usually missing the execute (+x) traversal bit. 'namei -l' prints permissions for every step in the path chain.",
        flags: [
          ["-l", "Long listing format: display permissions, owner, and group for each path component"],
          ["-m", "Show the mode bits of each file type in the path"],
          ["-o", "Show owner and group name of each component"],
          ["-x", "Show mount point directories with a 'D' instead of 'd'"]
        ],
        subcommands: [
          ["namei -lx /srv/current/app.sock", "Trace a path resolving all nested symlinks while marking filesystem mount boundaries ('D')"]
        ],
        tip: "Instantly spots missing '+x' on parent directories",
        tags: ["namei", "symlink", "permissions", "path", "traversal", "debug"]
      }
    ]
  },
  {
    id: "file",
    badge: "fil",
    title: "file — Binary, Filesystem & Magic Header Identifier",
    subtitle: "Inspecting ELF binaries, core dumps, raw disk partition headers (-s), and compressed archives via magic bytes",
    commands: [
      {
        id: "file-magic-headers",
        desc: "Identify file types, ELF architecture, compression format, or raw block partition filesystems via magic bytes",
        cmd: "file -sL /dev/nvme0n1 /dev/nvme0n1p1 && file -b /bin/ls",
        details: "Instead of trusting file extensions, 'file' reads magic byte signatures inside the file header. Passing '-sL' (--special-files --dereference) reads the raw header of block devices (/dev/nvme0n1p1, /dev/sda1, /dev/md0) to report the exact filesystem (ext4, XFS, FAT32, LVM2, LUKS) and UUID.",
        flags: [
          ["-s", "Read block and character special device files (essential for inspecting /dev/nvme* and /dev/sd*)"],
          ["-L", "Follow symbolic links (essential for /dev/mapper/* and /dev/disk/by-id/*)"],
          ["-b", "Brief mode: do not prepend the filename to output lines"],
          ["-z", "Try to look inside compressed files (.gz, .xz, .zst) to identify the inner payload"]
        ],
        subcommands: [
          ["file /var/crash/core.*", "Inspect an application core dump to see the exact binary name and signal that caused the crash"],
          ["file -z backup.tar.gz", "Peek inside a compressed file to see the uncompressed archive format and original timestamp"]
        ],
        tip: "file -sL /dev/nvme0n1p1 reveals raw partition FS & UUID",
        tags: ["file", "magic", "elf", "partition", "filesystem", "coredump"]
      }
    ]
  },
  {
    id: "awk",
    badge: "awk",
    title: "awk — Column Processing, Math & Associative Arrays",
    subtitle: "Field splitting (-F), built-in variables (NR/NF/FNR), conditional filtering, math summaries & array grouping",
    commands: [
      {
        id: "awk-columns-delimiters",
        desc: "Extract, reorder, and format specific columns using whitespace or custom regex field delimiters (-F)",
        cmd: "awk -F':' '$3 >= 1000 && $3 < 65534 {printf \"%-15s UID:%-6d Shell:%s\\n\", $1, $3, $7}' /etc/passwd",
        details: "By default, awk splits each line on runs of whitespace and assigns columns to $1, $2, ... $NF (where $NF is the last column and $0 is the whole line). Use '-F' to split on ':', ',', or a regex character class like '-F\"[/: ]+\"'.",
        flags: [
          ["-F':'", "Set Input Field Separator (FS) to ':' (or regex like -F'[,;:\\t]+')"],
          ["$1 .. $NF", "Positional column variables ($NF = last column, $(NF-1) = second-to-last column)"],
          ["NR / FNR", "NR = global line number (NR>1 skips header); FNR = line number in current file"],
          ["printf", "Formatted C-style output (%-15s = left-aligned 15-char string, %.2f = 2-decimal float)"]
        ],
        subcommands: [
          ["df -hP | awk 'NR>1 && int($5) >= 80 {print \"CRITICAL DISK:\", $6, $5, \"used on\", $1}'", "Skip header line (NR>1) and alert on any mounted filesystem at or above 80% capacity"],
          ["ip -br addr | awk '$2 == \"UP\" {print $1, $3}'", "Print only UP network interfaces and their primary IPv4 CIDR address"]
        ],
        tip: "NR>1 skips the header row of CLI tables",
        tags: ["awk", "columns", "delimiter", "printf", "filter", "df", "passwd"]
      },
      {
        id: "awk-math-aggregation",
        desc: "Calculate sum, average, min, and max across numeric columns in logs or command outputs",
        cmd: "ps -eo rss,comm | awk 'NR>1 {sum+=$1; count++; if($1>max){max=$1; maxp=$2}} END {printf \"Procs:%d  Total:%.1f MiB  Avg:%.1f MiB  Max:%s (%.1f MiB)\\n\", count, sum/1024, (sum/count)/1024, maxp, max/1024}'",
        details: "Code inside the main '{...}' block runs once for every matching input line, and the 'END {...}' block runs after all input lines have been processed to print totals, averages, and maximums.",
        flags: [
          ["BEGIN {...}", "Executed once before any input lines are read"],
          ["END {...}", "Executed once after EOF is reached across all inputs"],
          ["sum += $1", "Accumulate running total of column 1"]
        ],
        subcommands: [
          ["ls -l /var/log/*.log | awk '{sum += $5} END {printf \"Total uncompressed logs: %.2f MiB\\n\", sum/1048576}'", "Sum byte sizes (column 5 of ls -l) and print total in MiB"],
          ["awk '{sum+=$NF; n++} END {if (n>0) print \"Average:\", sum/n}' timing.log", "Compute the arithmetic mean of the last column ($NF) across a log file"]
        ],
        tags: ["awk", "sum", "average", "math", "max", "min", "aggregation"]
      },
      {
        id: "awk-arrays-frequency-dedup",
        desc: "Group by column, count frequencies, sum per key, deduplicate lines, or join two files using associative arrays",
        cmd: "ss -tan | awk 'NR>1 {state[$1]++} END {for (s in state) printf \"%-15s %d\\n\", s, state[s]}' | sort -k2 -nr",
        details: "awk associative arrays ('arr[key]++' or 'arr[key] += $5') group and aggregate millions of lines in a single streaming pass without sorting. 'awk \"!seen[\\$0]++\"' removes duplicate lines while preserving original chronological order.",
        flags: [
          ["state[$1]++", "Increment counter in associative array keyed by column 1"],
          ["!seen[$0]++", "True only the first time a line ($0) is encountered (order-preserving deduplication)"],
          ["NR==FNR", "True only while reading the first input file (used to load lookup keys into memory)"]
        ],
        subcommands: [
          ["ps -eo user,rss | awk 'NR>1 {mem[$1]+=$2} END {for (u in mem) printf \"%-12s %8.1f MiB\\n\", u, mem[u]/1024}' | sort -k2 -nr", "Aggregate total Resident Memory (MiB) consumed per Linux username"],
          ["awk '!seen[$0]++' /var/log/boot.log", "Deduplicate repeated lines in a file without sorting (preserves chronological order)"],
          ["awk 'NR==FNR {bad[$1]=1; next} $1 in bad {print $0}' faulty_serials.txt inventory.txt", "Join two files: load column 1 of file 1 into array 'bad', then print matching rows from file 2"]
        ],
        tip: "awk '!seen[$0]++' deduplicates without sorting!",
        tags: ["awk", "array", "group-by", "frequency", "deduplicate", "join", "nr==fnr"]
      }
    ]
  },
  {
    id: "sed",
    badge: "sed",
    title: "sed — Stream Editing, Config Patching & Log Slicing",
    subtitle: "In-place edits with backup (-i.bak), custom regex delimiters, timestamp range extraction & capture groups",
    commands: [
      {
        id: "sed-inplace-substitute",
        desc: "Perform safe in-place regex search-and-replace across config files with automatic backup creation",
        cmd: "sed -i.bak -E 's|^#?(PermitRootLogin)\\s+.*|\\1 no|' /etc/ssh/sshd_config && diff -u /etc/ssh/sshd_config.bak /etc/ssh/sshd_config",
        details: "When editing paths or URLs containing slashes '/', use '|' or '#' immediately after 's' (e.g. 's|/old/path|/new/path|g') so you never have to escape slashes. Always pass '-i.bak' so sed creates a backup file you can immediately verify with 'diff -u'.",
        flags: [
          ["-i.bak", "Edit file in-place and save unmodified original as <filename>.bak"],
          ["-E", "Enable Extended Regular Expressions (use () and + without backslashes)"],
          ["s|pat|rep|g", "Substitute pattern with replacement globally (g) on each line using '|' delimiter"],
          ["\\1, \\2 / &", "Insert 1st/2nd parenthesized capture group (\\1) or the entire matched text (&)"]
        ],
        subcommands: [
          ["sed -i.bak 's|/mnt/old-nfs|/srv/fast-nvme|g' /etc/fstab", "Replace file paths in /etc/fstab cleanly using '|' as the s||| delimiter"],
          ["sed -i '/swap/s/^/# /' /etc/fstab", "Address-scoped substitution: prepend '# ' ONLY on lines that match '/swap/'"]
        ],
        tip: "Use s|old|new|g when replacing file paths",
        tags: ["sed", "replace", "substitute", "inplace", "config", "backup", "regex"]
      },
      {
        id: "sed-range-slice-logs",
        desc: "Extract lines between two timestamps, regex markers, or exact line numbers from multi-GB log files",
        cmd: "sed -n '/2026-10-30T02:50/,/2026-10-30T03:05/p' /var/log/syslog",
        details: "'sed -n \"/START/,/END/p\"' streams only the lines between the first occurrence of START and the END marker. For line numbers, add 'q' after the end line ('sed -n \"1000,1050p;1051q\"') so sed stops reading the rest of a huge file immediately.",
        flags: [
          ["-n", "Suppress automatic printing (print only lines explicitly marked with 'p')"],
          ["/START/,/END/p", "Range address: print from line matching /START/ through line matching /END/"],
          ["100,200p;201q", "Print lines 100 through 200, then quit (q) immediately at line 201"]
        ],
        subcommands: [
          ["sed -n '1000,1050p;1051q' /var/log/kern.log", "Extract lines 1000–1050 from a massive file and exit immediately at line 1051"],
          ["sed -n '/^\\[storage\\]/,/^\\[/p' config.ini", "Extract an INI/TOML configuration section block between '[storage]' and the next '[' header"]
        ],
        tip: "Adding ';1051q' avoids reading the rest of a 50GB log",
        tags: ["sed", "slice", "range", "timestamps", "logs", "lines"]
      },
      {
        id: "sed-delete-insert-clean",
        desc: "Delete matching lines (d), strip blank/comment lines, remove ANSI color codes, or strip Windows CRLF",
        cmd: "sed -E '/^\\s*(#|$)/d' /etc/sysctl.conf",
        details: "Line-level sed commands: 'd' (delete line), 'i\\' (insert line before match), 'a\\' (append line after match), and 'c\\' (replace entire matched line).",
        flags: [
          ["/pat/d", "Delete any line matching /pat/"],
          ["42d", "Delete exact line number 42"],
          ["1d / $d", "Delete the first line (1d, e.g. header) or last line ($d)"]
        ],
        subcommands: [
          ["sed -i.bak '42d' ~/.ssh/known_hosts", "Delete exact line 42 from ~/.ssh/known_hosts when a rebuilt server gets a new SSH host key"],
          ["sed -E 's/\\x1B\\[[0-9;]*[a-zA-Z]//g' colored_output.log", "Strip all ANSI terminal color escape sequences from a captured log file"],
          ["sed -i 's/\\r$//' script_from_windows.sh", "Strip Windows CRLF (\\r) carriage returns to fix '/bin/bash^M: bad interpreter'"]
        ],
        tip: "sed -i '42d' ~/.ssh/known_hosts fixes SSH host key alerts",
        tags: ["sed", "delete", "ansi", "crlf", "known_hosts", "comments"]
      }
    ]
  },
  {
    id: "find",
    badge: "fnd",
    title: "find — Filesystem Search & Inode Predicates",
    subtitle: "mtime/mmin/size/perm/inode predicates, mount boundaries (-xdev), directory pruning (-prune) & batch -exec +",
    commands: [
      {
        id: "find-time-size-mount",
        desc: "Locate files by exact modification minutes/days, byte size thresholds, and filesystem boundaries (-xdev)",
        cmd: "find / -xdev -type f -size +200M -mmin -120 -printf '%TY-%Tm-%Td %TH:%TM  %12s  %p\\n' 2>/dev/null | sort -k3 -nr",
        details: "Combining '-xdev' (stay on the same mounted partition), '-size +200M' (>200 MiB), and '-mmin -120' (modified in the last 120 minutes) immediately pinpoints what filled up a root '/' partition.",
        flags: [
          ["-xdev", "Do not descend into directories on other filesystems (essential when scanning '/')"],
          ["-mmin -N / +N", "Modified less than -N minutes ago (-120) or more than +N minutes ago (+120)"],
          ["-mtime -N / +N", "Modified less than -N*24 hours ago or more than +N*24 hours ago"],
          ["-size +100M", "File size greater than (+) or less than (-) N units (c=bytes, k=KiB, M=MiB, G=GiB)"],
          ["-exec cmd {} +", "Batch pass matched files to a single command invocation (fast)"]
        ],
        subcommands: [
          ["find /var/log -type f -empty -delete", "Find and delete all 0-byte empty regular files inside /var/log"],
          ["find / -xdev \\( -path /var/lib/docker -o -path /snap \\) -prune -o -type f -size +500M -print", "Prune (-prune) container/snap trees while searching for files > 500 MiB"]
        ],
        tip: "-mmin -60 finds files modified in the last hour",
        tags: ["find", "size", "mtime", "mmin", "xdev", "prune", "empty"]
      },
      {
        id: "find-perms-owners-inodes",
        desc: "Audit SUID/SGID binaries, world-writable files, orphaned UID/GID files, broken symlinks & hardlinks",
        cmd: "find /etc /srv /opt -xtype l -ls",
        details: "'-xtype l' tests the type of the file after dereferencing symlinks — since a broken symlink still has type 'l' after dereferencing fails, 'find -xtype l' finds every broken/dangling symlink in a tree.",
        flags: [
          ["-xtype l", "Find broken/dangling symbolic links whose target path no longer exists"],
          ["-perm -4000", "Match files with the SUID (4000) bit set (-perm -0002 for world-writable)"],
          ["-nouser / -nogroup", "Find orphaned files whose numeric UID or GID is missing from /etc/passwd"],
          ["-inum <N> / -samefile <f>", "Find all hardlinks pointing to the exact same inode number <N> or file <f>"]
        ],
        subcommands: [
          ["find / -xdev -type f \\( -perm -4000 -o -perm -2000 \\) -ls 2>/dev/null", "Audit all SUID and SGID executables on the root filesystem"],
          ["find /home /srv \\( -nouser -o -nogroup \\) -exec chown root:root {} +", "Find files owned by deleted user/group IDs and reassign ownership"]
        ],
        tip: "find -xtype l finds broken symlinks",
        tags: ["find", "permissions", "suid", "symlinks", "broken", "inode", "nouser"]
      }
    ]
  },
  {
    id: "xargs",
    badge: "xrg",
    title: "xargs — Parallel & Batch Command Execution",
    subtitle: "Null-delimited safe pipelines (-0), multi-core parallel worker pools (-P), batching (-n) & empty-input guard (-r)",
    commands: [
      {
        id: "xargs-parallel-null",
        desc: "Execute commands in parallel across file or host lists using null-delimited streams (-0) and worker pools (-P)",
        cmd: "find /var/log/archive -type f -name '*.log' -print0 | xargs -0 -r -P 8 -n 20 zstd --rm -9",
        details: "'find -print0' separates filenames with a NUL ('\\0') byte, and 'xargs -0' reads NUL-separated items safely even if filenames contain spaces. Adding '-P 8' spawns up to 8 parallel worker processes at once.",
        flags: [
          ["-0 / --null", "Input items are terminated by a null byte ('\\0') instead of whitespace"],
          ["-P <N>", "Run up to <N> processes in parallel at a time (use -P 0 for all CPU cores)"],
          ["-n <N>", "Pass at most <N> arguments per command invocation"],
          ["-I {}", "Replace occurrences of '{}' in the command with each input item"],
          ["-r / --no-run-if-empty", "Do not run the command at all if stdin is empty (critical in scripts!)"],
          ["-t", "Print each constructed command to stderr right before executing it"]
        ],
        subcommands: [
          ["cat rack_bmc_ipv6.txt | xargs -P 16 -I {} sh -c 'ping -6 -c 1 -W 1 {} >/dev/null && echo \"UP: {}\" || echo \"DOWN: {}\"'", "Ping 40+ rack server BMC IPv6 addresses in parallel (16 concurrent workers) and report UP/DOWN status"],
          ["find /tmp -type f -mtime +7 -print0 | xargs -0 -r rm -v", "Safely delete old files using -r (--no-run-if-empty) so rm doesn't error when no files match"]
        ],
        tip: "Always pass -r so empty inputs don't execute!",
        tags: ["xargs", "parallel", "print0", "null", "batch", "ping"]
      }
    ]
  },
  {
    id: "jq",
    badge: "jq",
    title: "jq — JSON Querying for Hardware, Network & BMC APIs",
    subtitle: "Parsing ip -j, lsblk -J, lshw -json, nvme -o json & Redfish responses with select(), -r raw output & @tsv",
    commands: [
      {
        id: "jq-linux-json-tools",
        desc: "Query native JSON outputs from Ubuntu hardware & network tools (ip -j, lsblk -J, lshw -json, nvme -o json)",
        cmd: "ip -j addr show | jq -r '.[] | select(.operstate == \"UP\") | [.ifname, .address, (.addr_info[0].local // \"no-ip\")] | @tsv' | column -t",
        details: "Ubuntu Linux utilities ('ip -j', 'lsblk -J', 'findmnt -J', 'lshw -json', 'nvme list -o json') output structured JSON natively. Using 'jq -r' with '@tsv' extracts exact fields into clean tables.",
        flags: [
          ["-r", "Raw output: strip outer double-quotes from string results"],
          ["select(cond)", "Keep only JSON objects matching the boolean expression"],
          ["// \"default\"", "Alternative operator: provide fallback value if field is null or missing"],
          ["@tsv / @csv", "Format an array of values as tab-separated or comma-separated row"]
        ],
        subcommands: [
          ["nvme list -o json | jq -r '.Devices[] | [.DevicePath, .ModelNumber, .SerialNumber, .Firmware] | @tsv' | column -t -s $'\\t'", "Extract NVMe device path, model, serial, and firmware as an aligned table"],
          ["lsblk -J -o NAME,SIZE,TYPE,SERIAL,MOUNTPOINTS | jq '.blockdevices[] | select(.type==\"disk\")'", "Filter lsblk JSON output for physical disk devices and their hardware serial numbers"]
        ],
        tip: "ip -j, lsblk -J, findmnt -J, nvme -o json all output JSON!",
        tags: ["jq", "json", "ip", "lsblk", "nvme", "lshw", "tsv"]
      },
      {
        id: "jq-transform-group-redfish",
        desc: "Filter Redfish BMC JSON responses over IPv6, sort/group arrays, and safely construct JSON payloads from bash variables",
        cmd: "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Systems/1/Memory\" | jq -r '.Members[] | .[\"@odata.id\"]'",
        details: "When a JSON key contains special characters like '@' or '-' or '.' (common in Redfish '@odata.id'), wrap the key name in bracket-quotes: '.[\"@odata.id\"]'.",
        flags: [
          ["sort_by(.key)", "Sort an array of JSON objects by a specific property"],
          ["group_by(.key)", "Group array elements into sub-arrays sharing the same key value"],
          ["-n --arg k v", "Construct valid, escaped JSON from shell variables without reading stdin"]
        ],
        subcommands: [
          ["jq 'map(select(.status != \"OK\")) | length' health.json", "Count how many items in a JSON array have a status other than 'OK'"],
          ["jq -n --arg host \"$(hostname)\" --arg ts \"$(date -Is)\" '{hostname: $host, timestamp: $ts}'", "Generate a valid JSON payload from shell variables using -n and --arg"]
        ],
        tags: ["jq", "redfish", "csv", "tsv", "sort_by", "group_by", "api"]
      }
    ]
  },
  {
    id: "lsof",
    badge: "lsf",
    title: "lsof — Open Files, Deleted Space & Network Sockets",
    subtitle: "Finding unlinked open files eating disk space (+L1), listening TCP/UDP socket owners (-i) & per-PID descriptors",
    commands: [
      {
        id: "lsof-deleted-sockets-pid",
        desc: "Find deleted files still holding disk blocks (+L1), processes listening on ports (-iTCP), or open FDs of a PID",
        cmd: "lsof +L1 && lsof -iTCP:443 -sTCP:LISTEN -P -n",
        details: "When 'df -h' reports 100% full but 'du -sh' shows plenty of space, a process is holding an open file descriptor to a deleted file. 'lsof +L1' lists every open file with a hardlink count less than 1.",
        flags: [
          ["+L1", "List open files with link count < 1 (deleted from directory tree but FD still open)"],
          ["-iTCP:443", "Filter network files by protocol and port (-sTCP:LISTEN for listening sockets only)"],
          ["-P -n", "Disable port name lookup (-P) and DNS hostname resolution (-n) for fast output"],
          ["-p <PID>", "List all open files, shared libraries, and sockets held by a specific PID"],
          ["+D <dir>", "Recursively find all open files inside directory <dir>"]
        ],
        subcommands: [
          ["lsof -p <PID>", "Inspect all open files, .so libraries, and sockets held by <PID>"],
          ["lsof -u ^root -i -P -n", "List all active network connections owned by any non-root user (^root)"],
          [": > /proc/<PID>/fd/<FD_NUM>", "Truncate a deleted-but-open log file via /proc to reclaim disk space without restarting the daemon"]
        ],
        tip: "lsof +L1 solves 'df says 100% full, du says 20%'",
        tags: ["lsof", "deleted", "disk-full", "ports", "socket", "fd"]
      }
    ]
  },
  {
    id: "fuser",
    badge: "fsr",
    title: "fuser — Mountpoint, Device & Lock File Owners",
    subtitle: "Resolving 'umount: target is busy' (-vm), identifying APT/dpkg lock holders & signaling blocking PIDs (-k)",
    commands: [
      {
        id: "fuser-mount-locks",
        desc: "Identify or terminate processes keeping a mounted filesystem busy (/mnt) or holding a package lock file",
        cmd: "fuser -vm /mnt/data",
        details: "When 'umount /mnt/data' fails with 'target is busy', 'fuser -vm /mnt/data' queries the kernel for every process accessing that mounted filesystem, showing the PID, user, and access type: 'c' (current directory), 'f' (open file), 'e' (running executable), or 'm' (mmap shared library).",
        flags: [
          ["-v", "Verbose mode: show USER, PID, ACCESS type (c/f/e/m/r), and COMMAND"],
          ["-m", "Name specifies a file on a mounted filesystem or a block device; list all processes accessing that mount"],
          ["-k -TERM", "Kill processes accessing the file/mount (use -TERM for graceful SIGTERM instead of default SIGKILL)"]
        ],
        subcommands: [
          ["fuser -v /var/lib/dpkg/lock-frontend /var/lib/apt/lists/lock", "See which process (e.g. unattended-upgrade) is holding the Ubuntu APT/dpkg lock"],
          ["fuser -v -k -TERM /mnt/data", "Send graceful SIGTERM to all processes holding open references on /mnt/data"],
          ["fuser -v -n tcp 8080", "Find the PID listening on local TCP port 8080"]
        ],
        tip: "Access 'c' means a shell is cd'd inside the mountpoint",
        tags: ["fuser", "umount", "busy", "lock", "dpkg", "mount"]
      }
    ]
  },
  {
    id: "strace",
    badge: "stc",
    title: "strace — System Call, Signal & Latency Tracer",
    subtitle: "Live PID attachment (-p), thread following (-f), syscall duration (-T), missing file triage & summary profiling (-c)",
    commands: [
      {
        id: "strace-syscall-triage",
        desc: "Trace live system calls, file opens, network connects, and syscall latency of a running or failing process",
        cmd: "strace -p <PID> -f -tt -T -s 256 -e trace=file,network",
        details: "Intercepts kernel system calls via ptrace. '-e trace=file,network' filters out noisy futex/clock calls so you immediately see which config file returns ENOENT ('No such file or directory'), which permission check returns EACCES, or which IP connect() times out.",
        flags: [
          ["-p <PID>", "Attach to an already-running process ID"],
          ["-f", "Trace child processes and threads created via fork/vfork/clone"],
          ["-tt -T", "Print microsecond wall-clock time (-tt) and duration spent inside each syscall (<0.004120>) (-T)"],
          ["-s 256", "Increase maximum printed string argument length from 32 chars to 256 chars"],
          ["-e trace=...", "Filter syscalls by class (file, network, process, desc) or exact name (openat,connect,write)"],
          ["-c", "Count time, calls, and errors for each syscall and print a summary table on exit"]
        ],
        subcommands: [
          ["strace -p <PID> -f -c", "Attach to a slow process, press Ctrl+C after 10s, and view a summary table of syscall time & errors"],
          ["strace -f -e trace=openat,stat,access ./mystery-binary 2>&1 | grep -v ENOENT", "Run a binary and see every config file or shared library it successfully opens"]
        ],
        tip: "-e trace=file,network cuts 90% of syscall noise",
        tags: ["strace", "syscall", "debug", "hang", "enoent", "latency"]
      }
    ]
  },
  {
    id: "sort",
    badge: "srt",
    title: "sort — Multi-Key, Human Size & Version Sorting",
    subtitle: "Human suffixes (-h: 2G > 500M), natural version/IPv4 sort (-V), column key specs (-t -k) & unique sort (-u)",
    commands: [
      {
        id: "sort-human-version-keys",
        desc: "Sort output by human-readable byte suffixes (-h), IPv4/version numbers (-V), or specific delimited columns (-k)",
        cmd: "du -sh /var/* 2>/dev/null | sort -hr",
        details: "Standard numeric sort ('sort -n') fails on human units because it thinks '500M' > '2G'. GNU 'sort -h' natively understands KiB/MiB/GiB/TiB suffixes, and 'sort -V' naturally sorts IPv4 addresses (10.0.0.2 before 10.0.0.10) and kernel/package versions.",
        flags: [
          ["-h", "Human-numeric sort: compare human-readable sizes (2K < 50M < 4G < 1T)"],
          ["-V", "Natural version / IPv4 address sort (2.4.2 < 2.4.10; 10.0.0.2 < 10.0.0.10)"],
          ["-n / -r", "Numeric sort (-n) and reverse descending order (-r)"],
          ["-t':' -k3,3n", "Use ':' as field delimiter (-t) and sort strictly on field 3 numerically (-k3,3n)"],
          ["-u", "Unique: output only the first of an equal run (sorts and deduplicates in one step)"]
        ],
        subcommands: [
          ["sort -t':' -k3,3n /etc/passwd", "Sort /etc/passwd numerically by UID (column 3)"],
          ["sort -V ip_list.txt", "Sort a list of IPv4 addresses or kernel version strings in natural numerical order"]
        ],
        tip: "sort -h understands K/M/G/T; sort -V sorts IPv4 addresses",
        tags: ["sort", "human", "version", "columns", "ip", "du"]
      }
    ]
  },
  {
    id: "uniq",
    badge: "unq",
    title: "uniq — Frequency Counting & Duplicate Filtering",
    subtitle: "Occurrence histograms (uniq -c), isolating duplicate lines (-d), printing unique-only lines (-u) & case folding (-i)",
    commands: [
      {
        id: "uniq-counts-duplicates",
        desc: "Count line occurrence frequencies (uniq -c) or isolate duplicate (-d) vs single-occurrence (-u) lines",
        cmd: "awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 15",
        details: "'uniq' only compares adjacent lines, so input must be sorted first ('sort | uniq -c'). Combine 'uniq -d' on sorted inventory files to spot duplicate IP addresses, MACs, or asset tags.",
        flags: [
          ["-c", "Prefix each line with the number of times it occurred"],
          ["-d", "Only print duplicate lines (lines that appear 2 or more times)"],
          ["-u", "Only print unique lines (lines that appear exactly once in the input)"],
          ["-i", "Ignore differences in case when comparing adjacent lines"],
          ["-f <N>", "Avoid comparing the first <N> whitespace-delimited fields on each line"]
        ],
        subcommands: [
          ["sort serials.txt | uniq -d", "Find any duplicate hardware serial numbers or IP addresses in an inventory file"],
          ["sort -u ip_list.txt", "Sort and deduplicate a list in a single pass"]
        ],
        tip: "Always pipe through 'sort' before 'uniq'",
        tags: ["uniq", "frequency", "duplicates", "histogram"]
      }
    ]
  },
  {
    id: "comm",
    badge: "com",
    title: "comm — Sorted File & Inventory Set Comparison",
    subtitle: "Comparing two sorted server/serial lists to find missing nodes (-23), extra nodes (-13), or common nodes (-12)",
    commands: [
      {
        id: "comm-set-operations",
        desc: "Compare two sorted lists line-by-line to output set difference (A - B), (B - A), or intersection (A ∩ B)",
        cmd: "comm -23 <(sort expected_nodes.txt) <(sort online_nodes.txt)",
        details: "By default 'comm' outputs 3 tab-indented columns: (1) lines unique to File 1, (2) lines unique to File 2, and (3) lines common to both. Passing '-23' suppresses columns 2 and 3, leaving ONLY lines present in File 1 that are missing from File 2.",
        flags: [
          ["-1", "Suppress column 1 (lines unique to File 1)"],
          ["-2", "Suppress column 2 (lines unique to File 2)"],
          ["-3", "Suppress column 3 (lines present in both files)"],
          ["-23", "Show only lines in File 1 that are missing from File 2"],
          ["-12", "Show only lines present in BOTH File 1 and File 2 (set intersection)"]
        ],
        subcommands: [
          ["comm -12 <(sort rack01_macs.txt) <(sort switch_arp_macs.txt)", "Show only MAC addresses that appear in BOTH the rack manifest and the switch ARP table"],
          ["comm -13 <(sort baseline_pkgs.txt) <(dpkg-query -W -f='${Package}\\n' | sort)", "Show extra packages installed on the current server that are not in the baseline list"]
        ],
        tip: "comm -23 = in File 1 only; comm -12 = in Both",
        tags: ["comm", "compare", "diff", "set", "inventory"]
      }
    ]
  },
  {
    id: "cut",
    badge: "cut",
    title: "cut — Delimited Field & Character Slicing",
    subtitle: "Extracting columns by delimiter (-d -f), field ranges (-f2-), complement extraction (--complement) & output delimiters",
    commands: [
      {
        id: "cut-fields-ranges",
        desc: "Slice specific columns from delimited text streams or config tables",
        cmd: "cut -d':' -f1,3,7 --output-delimiter=$'\\t' /etc/passwd | head -n 15",
        details: "Fast column slicer for single-character delimiters (default is TAB). Note that 'cut' treats every single space as a separate delimiter — if input is separated by variable runs of spaces, use 'awk' or pipe through 'tr -s \" \"' first.",
        flags: [
          ["-d':'", "Use ':' instead of TAB as the field delimiter character"],
          ["-f1,3,7", "Select fields 1, 3, and 7 (use -f2- for field 2 through end of line)"],
          ["--complement", "Invert selection: output all fields EXCEPT the ones specified in -f"],
          ["-s", "Suppress lines that do not contain the delimiter character at all"]
        ],
        subcommands: [
          ["cut -d' ' -f1 --complement /var/log/syslog | head", "Strip the 1st field and print all remaining fields on each line (--complement)"]
        ],
        tip: "Use --complement to drop a single column",
        tags: ["cut", "fields", "columns", "delimiter", "slice"]
      }
    ]
  },
  {
    id: "tr",
    badge: "tr",
    title: "tr — Character Translation, Squeezing & Deletion",
    subtitle: "Squeezing repeated whitespace (-s), deleting unwanted characters (-d), case conversion & delimiter swapping",
    commands: [
      {
        id: "tr-squeeze-delete-translate",
        desc: "Squeeze repeated spaces into single delimiters (-s), delete carriage returns (-d), or convert character sets",
        cmd: "cat /proc/net/dev | tr -s ' ' | cut -d' ' -f1,2,10",
        details: "'tr' operates on stdin and translates, squeezes, or deletes characters. 'tr -s \" \"' collapses multiple spaces into a single space so 'cut -d\" \"' can parse CLI tables cleanly.",
        flags: [
          ["-s ' '", "Squeeze multiple adjacent occurrences of the character into a single occurrence"],
          ["-d '\\r'", "Delete all occurrences of specified characters (e.g. Windows CR '\\r')"],
          ["-c", "Complement the set of characters (e.g. tr -cd '[:print:]\\n' strips non-printable binary junk)"]
        ],
        subcommands: [
          ["echo $PATH | tr ':' '\\n'", "Translate colons into newlines to print PATH directories one per line"],
          ["tr '[:upper:]' '[:lower:]' < mac_list.txt", "Normalize uppercase MAC addresses or hostnames to lowercase"],
          ["tr -cd '[:print:]\\n\\t' < corrupted.log > clean.log", "Strip all non-printable binary bytes from a corrupted text log"]
        ],
        tip: "tr -s ' ' normalizes CLI table spacing for cut",
        tags: ["tr", "squeeze", "delete", "translate", "whitespace", "lowercase"]
      }
    ]
  },
  {
    id: "column",
    badge: "col",
    title: "column — Aligned Terminal Table Formatter",
    subtitle: "Auto-sizing column widths (-t), custom input delimiters (-s), column headers (-N) & JSON output (-J)",
    commands: [
      {
        id: "column-table-align",
        desc: "Format messy whitespace or delimiter-separated output into a cleanly aligned terminal table",
        cmd: "mount | column -t && column -t -s ':' /etc/passwd | head -n 15",
        details: "Reads the entire input stream, calculates the maximum width of every column, and pads fields with spaces so columns line up vertically.",
        flags: [
          ["-t", "Determine the number of columns the input contains and create an aligned table"],
          ["-s ':'", "Specify the input column delimiter character(s) (default is whitespace)"],
          ["-o ' | '", "Specify custom output separator string between aligned columns"],
          ["-N A,B,C", "Specify column header names for the table (util-linux column)"]
        ],
        subcommands: [
          ["cat /etc/fstab | grep -Ev '^\\s*(#|$)' | column -t -N 'DEVICE,MOUNTPOINT,FSTYPE,OPTIONS,DUMP,PASS'", "Render active /etc/fstab mounts as a labeled, aligned table"]
        ],
        tip: "Pipe any TSV or colon-delimited file into column -t",
        tags: ["column", "table", "align", "format", "mount", "fstab"]
      }
    ]
  },
  {
    id: "watch",
    badge: "wtc",
    title: "watch — Periodic Execution & Live Counter Diffs",
    subtitle: "Highlighting changing counters (-d), sub-second intervals (-n), color preservation (-c) & exit-on-change (-g)",
    commands: [
      {
        id: "watch-diff-counters",
        desc: "Run a diagnostic command repeatedly while highlighting every counter or state that changes (-d)",
        cmd: "watch -n 1 -d -c 'ip -c -s link show eth0'",
        details: "When troubleshooting flapping links, optical Rx power, PCIe AER errors, or MD RAID rebuilds, 'watch -n 1 -d' refreshes every second and highlights the exact digits that changed.",
        flags: [
          ["-n 1", "Refresh interval in seconds (supports decimals like -n 0.5)"],
          ["-d / -d=permanent", "Highlight differences between successive updates (=permanent keeps all changes since start highlighted)"],
          ["-c", "Interpret ANSI color sequences from the underlying command"],
          ["-g / --chgexit", "Exit watch automatically as soon as the output of the command changes!"]
        ],
        subcommands: [
          ["watch -n 1 -d 'cat /proc/mdstat'", "Monitor live software RAID rebuild speed and block progress"],
          ["watch -n 2 -g 'cat /sys/class/net/eth0/operstate' && echo 'LINK CHANGED!'", "Block until eth0 link state changes (-g), then trigger an alert"]
        ],
        tip: "watch -g exits the moment output changes!",
        tags: ["watch", "live", "monitor", "diff", "counters"]
      }
    ]
  },
  {
    id: "tee",
    badge: "tee",
    title: "tee — Privileged File Writing & Stream Splitting",
    subtitle: "Writing to root-owned /sys and /proc files with sudo tee, appending (-a) & logging while viewing live stdout",
    commands: [
      {
        id: "tee-sudo-sysfs-logging",
        desc: "Write to root-owned /sys, /proc, or /etc files via sudo or capture live command output to a log file while watching it",
        cmd: "echo 'performance' | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor",
        details: "'echo val > /sys/...' fails with Permission Denied because the shell performs the '>' redirection as your unprivileged user BEFORE invoking sudo. Piping into 'sudo tee' runs the file open() syscall as root AND supports writing to multiple wildcard files at once. Why root is dangerous, and how to use sudo well: see the sudo & root sheet.",
        flags: [
          ["-a", "Append to the target file(s) instead of overwriting (`>>` equivalent)"],
          ["2>&1 | tee", "Redirect stderr into stdout before piping so both normal output and errors are logged to disk"]
        ],
        subcommands: [
          ["./firmware-update.sh 2>&1 | tee -a /var/log/fw-upgrade-$(date +%F).log", "Watch a firmware upgrade live on screen while simultaneously recording all stdout & stderr to a log file"],
          ["echo '2001:db8:dc:4::50 bmc-rack04' | tee -a /etc/hosts", "Safely append an IPv6 host mapping to /etc/hosts with root privileges"]
        ],
        tip: "Always use 'echo x | tee /sys/...' instead of 'echo >'",
        tags: ["tee", "sudo", "sysfs", "proc", "redirect", "logging"]
      }
    ]
  },
  {
    id: "dd",
    badge: "dd",
    title: "dd — Raw Block Cloning, Direct I/O & Benchmarks",
    subtitle: "Direct I/O storage tests (iflag=direct), live USR1 progress stats, sparse disk cloning & MBR/GPT header backups",
    commands: [
      {
        id: "dd-direct-io-progress",
        desc: "Clone, zero, or benchmark raw block devices with Direct I/O (bypassing RAM cache) and live progress",
        cmd: "dd if=/dev/zero of=/tmp/bench.img bs=1G count=4 oflag=direct,dsync status=progress",
        details: "Without 'oflag=direct,dsync', 'dd' writes into Linux RAM page cache and reports artificially high GB/s speeds before the disk has finished writing. Use 'iflag=direct oflag=direct' to measure true hardware throughput.",
        flags: [
          ["bs=4M / bs=1G", "Read and write block size per I/O operation (default 512B is slow)"],
          ["iflag=direct / oflag=direct", "Bypass kernel page cache and perform Direct I/O straight to storage controller"],
          ["conv=fsync / conv=fdatasync", "Physically write output data (fsync: plus metadata) before dd exits; oflag=sync instead makes every write synchronous"],
          ["status=progress", "Print periodic live transfer rate (MB/s) and total bytes copied"],
          ["conv=sparse", "Skip writing blocks of all-zeros on output to create a sparse file"]
        ],
        subcommands: [
          ["kill -USR1 $(pgrep -x dd)", "Send SIGUSR1 to a running dd process (started without status=progress) to force it to print current stats"],
          ["dd if=/dev/nvme0n1 of=/dev/nvme1n1 bs=16M conv=noerror,sync,sparse status=progress", "Block-clone a drive skipping zero-blocks (sparse) and continuing past bad sectors"],
          ["dd if=/dev/nvme0n1 of=/backups/nvme0-mbr-gpt.bin bs=1M count=16", "Back up the first 16 MiB of a disk (MBR, GPT header, EFI partition start)"]
        ],
        danger: "Double-check 'of=' target device — dd overwrites raw blocks!",
        tags: ["dd", "benchmark", "clone", "direct-io", "sparse", "usr1"]
      }
    ]
  },
  {
    id: "tar",
    badge: "tar",
    title: "tar — Archiving, Sparse Backups & SSH Streams",
    subtitle: "Creating/extracting archives (-c/-x/-t), sparse VM disk handling (-S), --numeric-owner & zero-disk SSH streaming",
    commands: [
      {
        id: "tar-archives-streams",
        desc: "Create, inspect, and extract tar archives preserving sparse files (-S), ACLs, xattrs, and numeric UIDs",
        cmd: "tar --sparse --numeric-owner --acls --xattrs -czvf /backups/srv-data.tar.gz /srv/data/",
        details: "Pass '--sparse' ('-S') when archiving VM disks or databases so zero-blocks aren't expanded to full size, and '--numeric-owner' when backing up root filesystems or containers so UIDs/GIDs aren't remapped to the local host's /etc/passwd.",
        flags: [
          ["-c / -x / -t", "Create (-c), Extract (-x), or List contents (-t) of an archive"],
          ["--sparse / -S", "Handle sparse files efficiently so zero-holes do not consume disk space"],
          ["--numeric-owner", "Always use numeric UID/GID numbers instead of user/group names"],
          ["-C <dir>", "Change to target directory before extracting or archiving"],
          ["--exclude='pat'", "Skip files or directories matching pattern"]
        ],
        subcommands: [
          ["tar --numeric-owner --acls --xattrs -czf - /srv/data | ssh backup-host 'cat > /backups/srv-data.tar.gz'", "Stream a compressed backup directly over SSH when local disk is 99% full"],
          ["tar -xvf archive.tar.gz -C /opt/restore/", "Extract any compressed tar archive (.tar.gz, .tar.xz, .tar.zst) into /opt/restore/"]
        ],
        tip: "Use --sparse and --numeric-owner for VM & container backups",
        tags: ["tar", "sparse", "numeric-owner", "ssh", "backup"]
      }
    ]
  },
  {
    id: "zstd",
    badge: "zst",
    title: "zstd — Multithreaded High-Speed Compression",
    subtitle: "All-core compression (-T0), decompression (-d), adaptive compression (--adapt) & tar filter integration",
    commands: [
      {
        id: "zstd-multithreaded",
        desc: "Compress and decompress large logs, core dumps, or raw disk images using all CPU cores (-T0)",
        cmd: "zstd -T0 -9 --rm /var/crash/vmcore.dump   # Decompress: unzstd vmcore.dump.zst",
        details: "Zstandard ('zstd') achieves compression ratios comparable to xz/gzip at 5x–10x the speed by scaling across all CPU threads ('-T0') and decompresses at >1,500 MB/s.",
        flags: [
          ["-T0", "Spawn compression threads for all detected logical CPU cores"],
          ["-1 .. -19", "Compression level (default is 3; -9 is high ratio; --ultra -22 is maximum ratio)"],
          ["-d", "Decompress a .zst file (or use unzstd / zstdcat)"],
          ["--rm", "Remove the source file after successful compression or decompression"]
        ],
        subcommands: [
          ["tar --sparse -I 'zstd -T0 -6' -cvf /backups/vm-disks.tar.zst /var/lib/libvirt/images/", "Pipe tar through multithreaded zstd across all CPU cores (-T0)"],
          ["zstdcat /var/log/archive/syslog.zst | grep -iE 'error|mce'", "Stream-decompress a .zst log file directly to stdout without writing a temp file to disk"]
        ],
        tip: "zstd -T0 compresses multi-GB core dumps in seconds",
        tags: ["zstd", "unzstd", "zstdcat", "compress", "multithreaded"]
      }
    ]
  },
  {
    id: "rsync",
    badge: "rsy",
    title: "rsync — Delta File Sync, Mirroring & Throttling",
    subtitle: "Archive mode (-a), partial resume & progress (-P), dry-run mirror verification (-n --delete) & bandwidth limits",
    commands: [
      {
        id: "rsync-mirror-throttle",
        desc: "Synchronize directories locally or over SSH preserving all attributes, sparse blocks, and partial transfers",
        cmd: "rsync -avhPS --numeric-owner --stats /srv/data/ root@dr-node:/srv/data/",
        details: "Sends only changed blocks over the network. Note the trailing slash on the source ('/srv/data/'): with a trailing slash, rsync copies the contents of /srv/data into the destination; without it, it creates a subdirectory '/srv/data/data'.",
        flags: [
          ["-a", "Archive mode (-rlptgoD: recursive, symlinks, perms, times, group, owner, devices)"],
          ["-P", "Show live transfer progress (--progress) AND keep partial files for resume (--partial)"],
          ["-S / --sparse", "Turn sequences of nulls into sparse blocks on the destination"],
          ["-n / --dry-run", "Perform a trial run making no changes (always use before --delete!)"],
          ["--bwlimit=50M", "Limit network I/O bandwidth to 50 MB/s so production traffic isn't impacted"]
        ],
        subcommands: [
          ["rsync -avhPn --delete /srv/data/ root@dr-node:/srv/data/", "Dry-run (-n) mirror with --delete to preview exactly which files would be added or deleted"],
          ["rsync -avhP --bwlimit=50M -e 'ssh -p 2222' /var/backups/ user@remote:/backups/", "Sync over a custom SSH port while capping transfer rate at 50 MB/s"]
        ],
        tip: "Always test --delete with -n (dry-run) first!",
        tags: ["rsync", "sync", "mirror", "backup", "sparse", "bwlimit"]
      }
    ]
  },
  {
    id: "scp",
    badge: "scp",
    title: "scp — IPv6 SSH File Transfers & 3-Way Remote Copy",
    subtitle: "Bracketed IPv6 syntax (-6 user@[ipv6]:/path), custom SSH port (-P), ProxyJump bastion (-J) & 3-way server copy (-3)",
    commands: [
      {
        id: "scp-file-transfers",
        desc: "Copy files or directories over IPv6 SSH using bracketed literal IPv6 syntax (`[2001:db8::]`), custom port (-P), and 3-way routing (-3)",
        cmd: "scp -6 -r -p -P 2222 -J user@bastion /local/firmware/ \"root@[2001:db8:dc:4::15]:/tmp/firmware/\"",
        details: "When using literal IPv6 addresses with 'scp' or 'rsync', wrap the IPv6 address in square brackets ('root@[2001:db8:dc:4::15]:/path') and quote it so the colons inside the IPv6 address are not misinterpreted as the host:path separator! Note that 'scp' uses capital '-P <port>' for the SSH port.",
        flags: [
          ["-6", "Force IPv6 transport (wrap literal IPv6 host in brackets: user@[2001:db8::1]:/path)"],
          ["-r", "Recursively copy entire directories"],
          ["-p", "Preserve original modification times, access times, and file permission modes"],
          ["-P <port>", "Connect to a non-standard SSH port on the remote host (capital -P!)"],
          ["-J user@host", "Connect through one or more SSH ProxyJump bastion hosts"],
          ["-3", "Copy between two remote hosts routed through the local machine"],
          ["-l <Kbit/s>", "Limit transfer bandwidth in Kbit/s (e.g., -l 80000 = ~10 MB/s)"]
        ],
        subcommands: [
          ["scp -6 -3 \"root@[2001:db8:dc:4::10]:/etc/netplan/01-netcfg.yaml\" \"root@[2001:db8:dc:4::11]:/etc/netplan/01-netcfg.yaml\"", "Copy a file directly from remote Server A to remote Server B over IPv6 routed through your local jumpbox (-3)"],
          ["scp -6 -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null bios.bin \"root@[2001:db8:dc:4::50]:/tmp/\"", "Copy firmware over IPv6 to a freshly imaged rack server without failing on changed/unknown known_hosts keys"]
        ],
        tip: "Always wrap literal IPv6 addresses in brackets: root@[2001:db8::1]:/path",
        tags: ["scp", "ipv6", "ssh", "transfer", "copy", "bastion", "proxyjump", "port"]
      }
    ]
  },
  {
    id: "sftp",
    badge: "sft",
    title: "sftp — Interactive IPv6 SSH File Transfer & Resume",
    subtitle: "Interactive remote browsing over IPv6, resuming interrupted transfers (reget/reput), batch scripts (-b) & recursive put/get",
    commands: [
      {
        id: "sftp-interactive-resume",
        desc: "Open an interactive IPv6 SSH file transfer session supporting directory browsing and resuming interrupted transfers",
        cmd: "sftp -6 -P 22 -i ~/.ssh/id_ed25519 \"root@[2001:db8:dc:4::50]:/var/log/\"",
        details: "Unlike 'scp', 'sftp' lets you interactively browse remote directories ('ls -la', 'cd') alongside your local directories ('lls', 'lcd', 'lpwd') before transferring, and supports 'reget' / 'reput' to resume large ISO or crash-dump downloads that were interrupted.",
        flags: [
          ["-6", "Use IPv6 addresses only (wrap literal IPv6 address in brackets [2001:db8::])"],
          ["-P <port>", "Connect to a custom SSH port (capital -P)"],
          ["-a", "Attempt to continue/resume interrupted transfers automatically rather than overwriting"],
          ["-r", "Recursively copy entire directories when using get/put"],
          ["-b <batchfile>", "Run non-interactively by reading sftp commands from a batch file"]
        ],
        subcommands: [
          ["reget -P large-vmcore.dump /tmp/large-vmcore.dump", "Inside sftp prompt: resume an interrupted download from the exact byte where it stopped"],
          ["put -r -p ./firmware_bundle/ /tmp/firmware_bundle/", "Inside sftp prompt: recursively upload a local folder while preserving permissions and timestamps"]
        ],
        tip: "Use 'reget' / 'reput' inside sftp to resume dropped transfers",
        tags: ["sftp", "ipv6", "ssh", "resume", "reget", "reput", "interactive"]
      }
    ]
  },
  {
    id: "curl",
    badge: "crl",
    title: "curl — IPv6 HTTP Transfers, Globoff (-g), Resume & Timing",
    subtitle: "Bracketed IPv6 URLs (-g -6), resuming ISO/firmware downloads (-C -), failing on 4xx/5xx (-f) & DNS override (--resolve)",
    commands: [
      {
        id: "curl-downloads-timing",
        desc: "Query IPv6 URLs (`-g -6`), download files with auto-resume (`-C -`), override DNS (`--resolve`), and measure TTFB",
        cmd: "curl -6 -fL -C - --retry 5 -O https://releases.ubuntu.com/24.04/ubuntu-24.04.1-live-server-amd64.iso",
        details: "When passing a literal IPv6 address in a URL ('https://[2001:db8:dc:4::50]/...'), you MUST pass '-g' ('--globoff') so curl does not treat '[...]' as a URL range glob! For IPv6 link-local addresses ('fe80::'), URL-encode the '%' scope delimiter as '%25' (e.g., 'https://[fe80::1%25eth0]/redfish/v1').",
        flags: [
          ["-g -6", "-g (--globoff) disables bracket globbing so [IPv6] URLs work; -6 forces IPv6 resolution/transport"],
          ["-f / --fail", "Fail on HTTP 4xx/5xx errors (prevents saving HTML error text into a binary file!)"],
          ["-L", "Follow HTTP 3xx redirects"],
          ["-C -", "Auto-resume an interrupted download from current local file size"],
          ["--interface <if>", "Force traffic out of a specific NIC or source IPv6 (e.g. --interface eth1)"],
          ["--resolve h:p:[ip6]", "Override DNS resolution for host:port to a specific bracketed IPv6 address"]
        ],
        subcommands: [
          ["curl -g -6 -vk --resolve \"bmc.rack04.local:443:[2001:db8:dc:4::50]\" https://bmc.rack04.local/redfish/v1/", "Test a specific IPv6 address with TLS SNI and Host header without editing /etc/hosts (--resolve)"],
          ["curl -g -6 -sSLk -D - -o /dev/null -w 'DNS:%{time_namelookup}s TCP:%{time_connect}s TLS:%{time_appconnect}s TTFB:%{time_starttransfer}s\\n' \"https://[2001:db8:dc:4::50]\"", "Measure granular DNS, IPv6 TCP, TLS handshake, and Time-To-First-Byte latency"],
          ["curl -g -6 -sk \"https://[fe80::a00:27ff:fe12:3456%25eth0]/redfish/v1\"", "Query a BMC over its IPv6 link-local (fe80::) address using URL-encoded '%25<interface>' zone ID"]
        ],
        tip: "Always pass -g to curl with literal [IPv6] URLs; use %25eth0 for fe80::!",
        tags: ["curl", "ipv6", "globoff", "fe80", "resume", "resolve", "download", "iso", "firmware", "ttfb"]
      }
    ]
  },
  {
    id: "http-server",
    badge: "web",
    title: "http.server — Instant IPv6 HTTP File Staging",
    subtitle: "Serving BIOS/BMC firmware .bin files and ISOs over IPv6 HTTP (--bind ::) on an isolated rack VLAN with python3",
    commands: [
      {
        id: "python-http-server",
        desc: "Spin up an instant IPv6 HTTP file server (`--bind ::`) on a rack VLAN to stage firmware or OS ISOs",
        cmd: "python3 -m http.server 8000 --bind :: --directory /srv/firmware",
        details: "Passing '--bind ::' (or a specific rack IPv6 address like '--bind 2001:db8:dc:4::2') binds Python's built-in HTTP server to IPv6! Any server or BMC on the rack VLAN can immediately pull BIOS/BMC images or ISOs via 'http://[2001:db8:dc:4::2]:8000/file.bin'.",
        flags: [
          ["--bind ::", "Bind to IPv6 wildcard '::' (or pass a specific interface IPv6 address like --bind 2001:db8:dc:4::2)"],
          ["8000", "TCP port to listen on (default 8000)"],
          ["--directory <path>", "Serve files from the specified folder without needing to 'cd' into it"]
        ],
        subcommands: [
          ["wget -6 -c \"http://[2001:db8:dc:4::2]:8000/ubuntu-24.04-live-server-amd64.iso\" -O /tmp/ubuntu.iso", "Pull a staged ISO over IPv6 from the ad-hoc HTTP server with automatic resume (-c)"],
          ["curl -g -6 -fLO \"http://[2001:db8:dc:4::2]:8000/firmware.fwpkg\"", "Download a staged firmware package over IPv6 using curl (-g -6)"]
        ],
        tip: "Use --bind :: to enable IPv6 support in python3 -m http.server!",
        tags: ["http.server", "ipv6", "python3", "wget", "firmware", "iso", "staging"]
      }
    ]
  },
  {
    id: "openssl",
    badge: "ssl",
    title: "openssl — IPv6 TLS Certificate, Cipher & Hash Inspection",
    subtitle: "Live IPv6 HTTPS/BMC certificate inspection (s_client -6), decoding PEM/X.509 expiration dates & SANs, and generating secrets",
    commands: [
      {
        id: "openssl-sclient-x509",
        desc: "Inspect a live server or BMC TLS certificate chain over IPv6 (`-6 -connect [ipv6]:443`), expiration dates & SANs",
        cmd: "openssl s_client -6 -connect \"[2001:db8:dc:4::50]:443\" -servername bmc.local </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates -ext subjectAltName",
        details: "Connects over IPv6 ('-6') to any TLS port ('[2001:db8:dc:4::50]:443'), sends the SNI hostname (-servername), extracts the leaf X.509 certificate, and prints who issued it, when it expires (notAfter), and which DNS names/IPv6 addresses it is valid for.",
        flags: [
          ["-6 -connect [ipv6]:port", "Open a raw TLS client connection over IPv6 using bracketed [IPv6]:port syntax"],
          ["-servername <fqdn>", "Send TLS Server Name Indication (SNI) extension during handshake"],
          ["x509 -dates", "Print NotBefore and NotAfter certificate validity timestamps"],
          ["-checkend 86400", "Exit with code 1 if the certificate will expire within N seconds (86400 = 24h)"]
        ],
        subcommands: [
          ["openssl x509 -in /etc/ssl/certs/server.crt -noout -text", "Decode and inspect a local PEM certificate file on disk"],
          ["openssl rand -base64 32", "Generate a cryptographically strong 32-byte random secret / password"]
        ],
        tip: "Redirect </dev/null so s_client closes immediately",
        tags: ["openssl", "ipv6", "tls", "ssl", "certificate", "x509", "expiry", "san"]
      }
    ]
  },
  {
    id: "nmap",
    badge: "nmp",
    title: "nmap — IPv6 Rack Discovery, Multicast & BMC Port Scans",
    subtitle: "Discovering IPv6 hosts via ICMPv6 all-nodes multicast (ff02::1) and scanning SSH/Redfish/IPMI ports with nmap -6",
    commands: [
      {
        id: "nmap-subnet-ports",
        desc: "Discover newly racked IPv6 servers/BMCs via link-local multicast (`ff02::1`) and scan open SSH/Redfish/IPMI ports (`nmap -6`)",
        cmd: "ping -6 -c 3 ff02::1%eth0 && ip -6 -c neigh show dev eth0 && nmap -6 -sS -n -p 22,80,443,623 --open 2001:db8:dc:4::1-100",
        details: "Because an IPv6 /64 subnet has 18.4 quintillion addresses, you don't brute-force sweep a /64! Instead, ping the IPv6 all-nodes link-local multicast address ('ping -6 -c 3 ff02::1%eth0') to populate the kernel NDP table ('ip -6 neigh'), or scan your known static/DHCPv6 range or NDP-discovered targets with 'nmap -6'.",
        flags: [
          ["-6", "Enable IPv6 scanning in nmap"],
          ["ff02::1%eth0", "IPv6 all-nodes link-local multicast address — every active server & BMC on the VLAN responds!"],
          ["--script=targets-ipv6-*", "Use nmap's built-in IPv6 multicast neighbor discovery scripts (--script=targets-ipv6-multicast-echo,targets-ipv6-multicast-slaac)"],
          ["-p 22,80,443,623", "Scan specific datacenter management ports (SSH, HTTP, HTTPS/Redfish, IPMI)"]
        ],
        subcommands: [
          ["nmap -6 -sn --script=targets-ipv6-multicast-echo,targets-ipv6-multicast-slaac --script-args 'newtargets,interface=eth0'", "Automatically discover all IPv6 hosts on eth0 via ICMPv6 multicast & SLAAC and ping-scan them"],
          ["nmap -6 -sU -p 161,623 --open 2001:db8:dc:4::50", "Scan UDP ports 161 (SNMP) and 623 (IPMI RMCP+) on an IPv6 BMC"]
        ],
        tip: "Ping ff02::1%eth0 to instantly discover all IPv6 nodes on a rack VLAN!",
        tags: ["nmap", "ipv6", "ff02::1", "multicast", "subnet", "discovery", "bmc", "ports"]
      }
    ]
  },
  {
    id: "arp-scan",
    badge: "ndp",
    title: "ndisc6 / ip -6 neigh — IPv6 Neighbor & Router Discovery",
    subtitle: "Discovering Layer-2 MAC addresses, EUI-64 link-local nodes, and switch Router Advertisements (rdisc6 / ndisc6 / ip -6 neigh)",
    commands: [
      {
        id: "arpscan-localnet",
        desc: "Discover all active L2 IPv6 neighbors, MAC addresses, and upstream switch Router Advertisements on the local VLAN",
        cmd: "ping -6 -L -c 3 ff02::1%eth1 >/dev/null ; ip -6 -c neigh show dev eth1 && rdisc6 eth1",
        details: "In IPv6, ICMPv6 Neighbor Discovery Protocol (NDP) replaces IPv4 ARP. Pinging 'ff02::1%eth1' triggers all local nodes on eth1 to reply, populating 'ip -6 neigh' with their link-local 'fe80::' addresses and hardware MACs. Furthermore, EUI-64 link-local addresses embed the NIC's MAC address directly inside the 'fe80::' address!",
        flags: [
          ["ip -6 -c neigh show", "Display IPv6 Neighbor Discovery cache mapping fe80:: and global IPv6 addresses to L2 MACs"],
          ["ndisc6 <ipv6> eth1", "Send an ICMPv6 Neighbor Solicitation (type 135) on eth1 and print the target's L2 MAC address"],
          ["rdisc6 eth1", "Send an ICMPv6 Router Solicitation (type 133) to display the switch's RA prefix (/64), MTU, and DNS"]
        ],
        subcommands: [
          ["ndisc6 -1 2001:db8:dc:4::50 eth1", "Resolve a specific IPv6 address to its Layer-2 Ethernet MAC address on eth1"],
          ["arp-scan --interface=eth1 --localnet", "Legacy IPv4 L2 ARP scan (if dual-stack or checking factory-default IPv4 BMCs)"]
        ],
        tip: "rdisc6 shows the exact /64 prefix & MTU advertised by your ToR switch!",
        tags: ["ndp", "ndisc6", "rdisc6", "ipv6", "neigh", "arp-scan", "mac", "vlan", "discovery"]
      }
    ]
  },
  {
    id: "tmux",
    badge: "tmx",
    title: "tmux — Persistent Sessions & Synchronized Panes",
    subtitle: "Keeping firmware flashes/burn-ins alive across SSH drops, broadcasting keystrokes across servers & pane log export",
    commands: [
      {
        id: "tmux-sessions-sync-panes",
        desc: "Keep firmware upgrades/burn-ins alive across SSH drops and broadcast keystrokes to multiple servers at once",
        cmd: "tmux new -s rack04-maint   # Detach: Ctrl+b d   |   Reattach: tmux attach -t rack04-maint",
        details: "Never run a BIOS flash, RAID rebuild, or 'apt full-upgrade' in a raw SSH session: if your network blips, SIGHUP can abort the process. Run inside 'tmux' so the session stays alive in the background. Use 'synchronize-panes on' to type commands into 4–16 server panes simultaneously.",
        flags: [
          ["new -s <name>", "Create a new named tmux session"],
          ["attach -t <name>", "Reattach to a running background tmux session (-d detaches other clients)"],
          ["tmux ls", "List all active background tmux sessions"],
          ["Ctrl+b d", "Detach from current tmux session leaving all processes running in background"]
        ],
        subcommands: [
          ["tmux set-window-option synchronize-panes on", "Broadcast everything you type into ALL split panes in the current window simultaneously (toggle off with 'off')"],
          ["tmux capture-pane -S - -E - -p > /tmp/tmux-scrollback.log", "Dump the entire scrollback history of the current tmux pane to a text file"],
          ["tmux new-session -d -s burnin 'stress-ng --cpu 0 -t 4h > /tmp/burnin.log 2>&1'", "Launch a detached background tmux session running a 4-hour burn-in job"]
        ],
        tip: "synchronize-panes types across all split panes at once!",
        tags: ["tmux", "session", "synchronize-panes", "ssh", "keepalive"]
      }
    ]
  },
  {
    id: "tio",
    badge: "tio",
    title: "tio — Serial Console Crash-Cart Client",
    subtitle: "Connecting USB-to-Serial cables (/dev/ttyUSB0 at 115200 8N1) with automatic hotplug reconnect & session logging",
    commands: [
      {
        id: "serial-console-tio",
        desc: "Connect a USB-to-Serial crash cart cable (/dev/ttyUSB0) to a switch, PDU, or server RS-232 console port",
        cmd: "tio -b 115200 -d 8 -f none -s 1 --log --log-file /tmp/serial.log /dev/ttyUSB0",
        details: "Enterprise switches and x86 server serial ports typically use 115200 8N1 (older PDUs/switches may use 9600 8N1). 'tio' automatically reconnects when you unplug the USB-to-Serial adapter and move it to the next server in the rack.",
        flags: [
          ["-b 115200", "Baud rate (115200 for modern servers/switches; 9600 for legacy Cisco/PDUs)"],
          ["-d 8 -f none -s 1", "8 data bits, no parity, 1 stop bit (8N1 standard)"],
          ["--log-file <f>", "Record the entire serial console session to a log file"],
          ["Ctrl+t q", "Exit key sequence for 'tio' (Ctrl+t ? lists all tio hotkeys)"]
        ],
        subcommands: [
          ["tio -L", "List all available serial devices by ID (/dev/serial/by-id/*) on the system"],
          ["picocom -b 115200 /dev/ttyUSB0   # Exit: Ctrl+a followed by Ctrl+x", "Alternative lightweight serial terminal using picocom"]
        ],
        tip: "Exit tio with Ctrl+t then q",
        tags: ["tio", "picocom", "serial", "ttyusb0", "baud", "console"]
      }
    ]
  },
  {
    id: "base64",
    badge: "b64",
    title: "base64 — Offline Serial / SOL Console File Paste",
    subtitle: "Encoding scripts, configs, or small binaries into single-line ASCII (-w0) to paste over a serial console when NICs are dead",
    commands: [
      {
        id: "base64-serial-paste",
        desc: "Compress and encode a file into single-line Base64 to copy-paste over an offline IPMI SOL or RS-232 serial console",
        cmd: "gzip -c fix-net.sh | base64 -w0 && echo ''   # On target: echo '<B64>' | base64 -d | gunzip > fix-net.sh",
        details: "When all NICs on a server are down and your only access is IPMI Serial-over-LAN (SOL) or a physical RS-232 crash cart, 'gzip -c | base64 -w0' turns any file into a single printable ASCII line that you can copy-paste straight into the serial terminal and decode back to a byte-identical file.",
        flags: [
          ["-w0", "Disable line wrapping (outputs one continuous single line of Base64 text)"],
          ["-d / --decode", "Decode Base64 ASCII stream back into raw binary bytes"]
        ],
        subcommands: [
          ["tar -czf - /etc/netplan/ | base64 -w0 && echo ''", "Encode an entire directory into a single Base64 line for serial console transfer"]
        ],
        tip: "Lifesaver when NICs are dead and only Serial/SOL works!",
        tags: ["base64", "serial", "sol", "paste", "offline", "recovery"]
      }
    ]
  },
  {
    id: "efibootmgr",
    badge: "efi",
    title: "efibootmgr — UEFI Boot Order & PXE NextBoot",
    subtitle: "Inspecting UEFI NVRAM boot entries (-v), setting one-time PXE NextBoot (-n), changing BootOrder (-o) & BIOS reboot",
    commands: [
      {
        id: "efibootmgr-uefi-boot",
        desc: "Inspect UEFI NVRAM boot entries, set one-time NextBoot to PXE/NIC, change BootOrder, or reboot into BIOS Setup",
        cmd: "efibootmgr -v",
        details: "Reads and modifies motherboard UEFI NVRAM variables (/sys/firmware/efi/efivars) from Ubuntu. 'efibootmgr -n <BootNum>' sets NextBoot for the next reboot only without permanently altering the BIOS BootOrder.",
        flags: [
          ["-v", "Verbose: display BootCurrent, BootOrder, and full UEFI device/MAC/GPT paths for every BootXXXX entry"],
          ["-n <XXXX>", "Set BootNext to hex entry XXXX for the next reboot only (one-time boot override)"],
          ["-o XXXX,YYYY", "Explicitly set persistent UEFI BootOrder sequence"],
          ["-b XXXX -B", "Delete (-B) stale UEFI boot entry number XXXX"]
        ],
        subcommands: [
          ["efibootmgr -n 0004 && reboot", "Set UEFI NextBoot to entry 0004 (e.g. PXE IPv6 NIC) for the upcoming reboot only and reboot"],
          ["efibootmgr -c -d /dev/nvme0n1 -p 1 -L 'Ubuntu' -l '\\\\EFI\\\\ubuntu\\\\shimx64.efi'", "Create a new UEFI NVRAM boot entry pointing to the EFI System Partition (partition 1) on /dev/nvme0n1"],
          ["mokutil --sb-state", "Check whether UEFI Secure Boot is currently enabled or disabled"]
        ],
        tip: "systemctl reboot --firmware-setup enters BIOS automatically!",
        tags: ["efibootmgr", "uefi", "bios", "pxe", "bootorder", "nextboot", "mokutil"]
      }
    ]
  },
  {
    id: "udevadm",
    badge: "udv",
    title: "udevadm — Live Hotplug Monitor & Device Rules",
    subtitle: "Watching kernel/udev hotplug events (monitor), querying /dev/disk/by-id attributes (info) & reloading udev rules",
    commands: [
      {
        id: "udevadm-hotplug-monitor",
        desc: "Watch live kernel/udev hardware hotplug events and inspect sysfs device attributes & persistent naming rules",
        cmd: "udevadm monitor --kernel --udev --property",
        details: "Run 'udevadm monitor' before hot-inserting a U.2 NVMe drive, SAS disk, SFP transceiver, or USB device in the rack to watch the kernel emit 'add'/'change'/'remove' uevents in real time and see the exact DEVNAME and ID_SERIAL assigned.",
        flags: [
          ["monitor", "Listen to kernel uevents and udev rule processing events live"],
          ["--property", "Print all device environment variables (ID_SERIAL, ID_WWN, ID_NET_NAME_PATH)"],
          ["info --query=all", "Query all udev database properties and symlinks (/dev/disk/by-id/*) for a device"]
        ],
        subcommands: [
          ["udevadm info --query=all --name=/dev/nvme0n1 | grep -E 'DEVLINKS=|ID_SERIAL=|ID_PATH=|ID_WWN='", "Show persistent /dev/disk/by-id/ and /dev/disk/by-path/ symlinks for a block device"],
          ["udevadm info --query=all --path=/sys/class/net/eth0", "Inspect how systemd/udev named a NIC (ID_NET_NAME_ONBOARD, ID_NET_NAME_SLOT, ID_NET_NAME_PATH)"],
          ["udevadm control --reload-rules && udevadm trigger --verbose --type=devices --action=change", "Reload /etc/udev/rules.d/ and re-trigger udev rules across devices without rebooting"]
        ],
        tip: "Use /dev/disk/by-id/ for drive serial mapping",
        tags: ["udevadm", "hotplug", "udev", "by-id", "by-path", "nvme", "nic"]
      }
    ]
  },
  {
    id: "cloud-init",
    badge: "cld",
    title: "cloud-init — Ubuntu Automated Provisioning Triage",
    subtitle: "Inspecting MaaS / Subiquity / NoCloud first-boot status, module timing blame & user-data script logs",
    commands: [
      {
        id: "cloudinit-triage",
        desc: "Diagnose Ubuntu Server first-boot provisioning status, data source detection, and slow/failed modules",
        cmd: "cloud-init status --long && cloud-init analyze show",
        details: "Newly provisioned Ubuntu data center servers use cloud-init (driven by MaaS, NoCloud ISO, or BMC virtual media) to configure networking, SSH keys, and storage. 'cloud-init status --long' shows whether provisioning succeeded, failed, or is still running.",
        flags: [
          ["status --long --wait", "Print current cloud-init stage, error count, and data source (wait blocks until finished)"],
          ["analyze show / blame", "Break down time spent in each cloud-init module during boot"],
          ["collect-logs", "Collect and tar all cloud-init logs and metadata for debugging"]
        ],
        subcommands: [
          ["tail -n 100 /var/log/cloud-init-output.log /var/log/cloud-init.log", "Inspect stdout/stderr from cloud-init user-data provisioning scripts"],
          ["cloud-init query --all", "Dump all instance metadata and user-data variables discovered by cloud-init"]
        ],
        tags: ["cloud-init", "maas", "provisioning", "subiquity", "ubuntu"]
      }
    ]
  },
  {
    id: "sudo",
    badge: "sudo",
    title: "sudo & root — Why Root Is Dangerous and How to Use sudo",
    subtitle: "What root is, what can go wrong as root, why sudo is safer than a root login, and the sudo options you use on the job",
    commands: [
      {
        id: "sudo-dangers",
        desc: "Why not just work as root? The dangers, and what sudo does instead",
        cmd: "sudo -l",
        details: "1) No safety net: rm -rf on the wrong path, dd, mkfs or wipefs on the wrong disk, chmod -R or chown -R on / all just happen. 2) Everything inherits root: every program, script, plugin and editor shell escape started from a root shell runs as root, so a bad install script or a compromised package owns the machine. 3) No accountability: with a shared root password the logs only say root. 4) Root shells linger: a forgotten root shell in tmux or on a jumpbox is an open door. sudo answers each one: root for one command at a time, your own password, your user name and command in the log, cached for 5 minutes by default, and sudoers can allow only the commands you need (least privilege).",
        flags: [
          ["One command at a time", "Root only for the command that needs it, then you are back to your normal user"],
          ["Your own password", "No shared root password to leak or rotate when someone leaves"],
          ["Logged by name", "Who ran what, where and when: needed for audits and incident timelines"],
          ["Time-limited", "Your password is cached for 5 minutes by default (sudoers timestamp_timeout); sudo -k ends it now"],
          ["Least privilege", "sudoers can allow one command (for example ipmitool) instead of everything"],
          ["sudo -l", "Lists exactly what you are allowed to run here"]
        ],
        subcommands: [
          ["sudo -k", "Forget your cached password now (do it before you walk away)"],
          ["sudo -v", "Refresh the cache without running anything (before a long series of steps)"]
        ],
        tip: "Root is a tool for one step, not a place to work",
        tags: ["sudo", "root", "danger", "least-privilege", "audit", "security"]
      },
      {
        id: "sudo-who-am-i",
        desc: "Who am I running as? Check before you type anything destructive",
        cmd: "id",
        details: "root is the account with user ID 0. For root the kernel skips most permission checks: any file can be read, changed or deleted, any disk can be overwritten, any process can be killed. That is exactly why it is dangerous: the system stops protecting you from your own typo. A prompt ending in # usually means you are root; $ means a normal user.",
        flags: [
          ["uid=0(root)", "You are root right now: nothing checks your permissions"],
          ["groups=…sudo / wheel", "You may use sudo (Ubuntu and Debian use the sudo group; RHEL and Rocky use wheel)"],
          ["# prompt", "Usually a root shell. Exit it as soon as the job is done"],
          ["Ubuntu", "The root password is locked by default: you are meant to use sudo, not log in as root"]
        ],
        subcommands: [
          ["whoami", "Just the user name"],
          ["sudo -l", "What sudo lets you run on this host (asks for your password)"]
        ],
        tip: "Read the prompt: # means every command is unchecked",
        tags: ["sudo", "root", "uid", "id", "whoami", "privilege"]
      },
      {
        id: "sudo-run-one",
        desc: "Run one command as root, or as another user",
        cmd: "sudo dmesg -T",
        details: "sudo checks the sudoers policy, asks for YOUR password (not root's), runs the command as root and logs it. On this site, and in the agent's answers, commands that need root are marked # needs root instead of carrying a sudo prefix: you decide how to elevate.",
        flags: [
          ["-u <user>", "Run as that user instead of root, for example a service account: sudo -u postgres psql"],
          ["-n", "Never prompt: fail with an error if a password is needed (use in scripts so they never hang)"],
          ["-k / -v", "End the cached password now / refresh it"],
          ["--", "End of sudo's own options: everything after it belongs to the command"],
          ["sudo !!", "Re-runs your previous command as root. Read it again first: !! is whatever ran last"]
        ],
        subcommands: [
          ["sudo -u postgres psql -c 'select 1'", "Run a command as a service account"],
          ["sudo -n true && echo 'sudo works without a prompt'", "Check that a script can use sudo before it runs"]
        ],
        tip: "Prefix the one command, never your whole session",
        tags: ["sudo", "run", "user", "non-interactive", "scripts"]
      },
      {
        id: "sudo-shells",
        desc: "A root shell when you really need one: sudo -i, sudo -s and su",
        cmd: "sudo -i",
        details: "Sometimes a root shell is the practical choice (a long recovery in single-user style). Know the trade-off: sudo logs only the command it runs, so once you are in a root shell the commands you type there are not logged one by one (the sudo man page warns about exactly this). Get in, do the job, type exit.",
        flags: [
          ["sudo -i", "Login shell as root: root's environment and home directory, reads root's profile"],
          ["sudo -s", "Shell as root that keeps your own environment (your $HOME, PATH may be reset by policy)"],
          ["su -", "Switch to root with ROOT's password: on Ubuntu root's password is locked, so this usually fails"],
          ["sudo su / sudo bash", "Same as a root shell, and it skips the per-command log: avoid"],
          ["exit", "Leave the root shell the moment you are done"]
        ],
        subcommands: [
          ["exit", "Back to your own user"]
        ],
        tip: "If you open a root shell, close it in the same breath",
        tags: ["sudo", "root-shell", "su", "login", "logging"]
      },
      {
        id: "sudo-redirect-gotcha",
        desc: "The redirect gotcha: sudo echo > /etc/file fails; use tee (changes state)",
        cmd: "echo 'vm.swappiness = 10' | sudo tee /etc/sysctl.d/99-swappiness.conf",
        details: "In sudo echo x > /etc/file, your own shell opens /etc/file for the > BEFORE sudo runs, so it fails with Permission denied. Piping into sudo tee makes tee (running as root) open the file. Add > /dev/null to hide tee's echo, and -a to append instead of replace.",
        flags: [
          ["sudo tee <file>", "tee opens the file as root, so the write works"],
          ["sudo tee -a <file>", "Append instead of replacing the file"],
          ["> /dev/null", "Stop tee from also printing the text to your screen"],
          ["sudo sh -c '… > file'", "The other fix: the whole line, redirect included, runs as root"]
        ],
        subcommands: [
          ["echo '2001:db8:dc:4::50 bmc-rack04' | sudo tee -a /etc/hosts > /dev/null", "Append a line to a root-owned file (changes state)"]
        ],
        tip: "The shell does the redirect, not sudo",
        tags: ["sudo", "tee", "redirect", "permission-denied", "gotcha"]
      },
      {
        id: "sudo-edit-files",
        desc: "Edit a root-owned file safely with sudoedit (sudo -e)",
        cmd: "sudoedit /etc/ssh/sshd_config",
        details: "sudoedit copies the file to a temporary file owned by you, runs YOUR editor as you, and writes the result back as root only when you save. Your editor, its plugins and its shell escapes never run as root, unlike sudo nano or sudo vim. Back up first, validate after (sshd -t, visudo -c, findmnt --verify).",
        flags: [
          ["sudoedit = sudo -e", "Same thing"],
          ["SUDO_EDITOR / VISUAL / EDITOR", "Pick the editor it uses, for example SUDO_EDITOR=nano"],
          ["Why not sudo vim", "Inside sudo vim, :!bash gives a root shell that is not logged"]
        ],
        subcommands: [
          ["sudo sshd -t", "Validate sshd_config before restarting sshd"]
        ],
        tip: "Back up, sudoedit, then validate",
        tags: ["sudo", "sudoedit", "edit", "config", "nano", "vim"]
      },
      {
        id: "sudo-sudoers",
        desc: "Who may run what: sudoers drop-in files, edited only with visudo (changes state)",
        cmd: "sudo visudo -f /etc/sudoers.d/90-datacenter-techs",
        details: "Never edit /etc/sudoers or its drop-ins with a plain editor: one syntax error can leave nobody able to use sudo. visudo locks the file and checks the syntax before saving. Grant the smallest set of commands that does the job. Be careful with NOPASSWD (no password at all) and with commands that can start a shell (editors, less, find -exec, tar --to-command): each one is a way to a full root shell.",
        flags: [
          ["visudo -f <file>", "Edit a drop-in in /etc/sudoers.d/ with locking and a syntax check"],
          ["visudo -c", "Check every sudoers file without editing"],
          ["%group ALL=(root) /usr/bin/ipmitool", "Example rule: members of a group may run only ipmitool as root"],
          ["NOPASSWD:", "Skips the password: convenient for automation, risky on a shared account"],
          ["sudo-rs visudo", "On Ubuntu's newer sudo-rs, visudo is reported to check only /etc/sudoers itself, not the drop-ins: verify on your release"]
        ],
        subcommands: [
          ["sudo visudo -c", "Syntax check of every sudoers file"]
        ],
        tip: "Keep a second root session open while you change sudoers",
        tags: ["sudo", "sudoers", "visudo", "nopasswd", "least-privilege"]
      },
      {
        id: "sudo-audit",
        desc: "Who ran what as root? Read the sudo log",
        cmd: "sudo journalctl -t sudo --since today --no-pager",
        details: "Every sudo command is logged with the user, the terminal, the working directory and the full command. That is what makes sudo better than a shared root login during an incident: the timeline shows who changed what. Ubuntu and Debian also write it to /var/log/auth.log; RHEL and Rocky to /var/log/secure.",
        flags: [
          ["-t sudo", "Only entries logged by sudo"],
          ["--since today / '-1h'", "Limit the time range"],
          ["/var/log/auth.log", "Ubuntu and Debian text log"],
          ["/var/log/secure", "RHEL and Rocky text log"]
        ],
        subcommands: [
          ["sudo grep -h 'COMMAND=' /var/log/auth.log | tail -n 20", "Last 20 sudo commands (Ubuntu and Debian)"]
        ],
        tip: "Commands typed inside a root shell do not show up here",
        tags: ["sudo", "audit", "log", "journalctl", "auth.log", "incident"]
      },
      {
        id: "sudo-implementation",
        desc: "Which sudo is this? Ubuntu 25.10 and 26.04 default to sudo-rs",
        cmd: "update-alternatives --display sudo",
        details: "Ubuntu now ships sudo-rs, a Rust rewrite of sudo, as the default, and keeps the original as sudo.ws. Day-to-day use is the same. Reported differences: sudo-rs shows asterisks while you type the password, visudo checks less, and some sudoers features (LDAP sudoers, mail on failure) are not supported. Upstream sudo is at 1.9.17p2.",
        flags: [
          ["sudo-rs", "Default on Ubuntu 25.10 and 26.04"],
          ["sudo.ws", "The original sudo, still installed as a fallback"],
          ["sudo --version", "Shows the implementation and version"]
        ],
        subcommands: [
          ["sudo --version", "Which sudo, which version"]
        ],
        tip: "If a sudoers rule behaves differently on Ubuntu 26.04, check which sudo is active",
        tags: ["sudo", "sudo-rs", "ubuntu", "version", "rust"]
      }
    ]
  },
  {
    id: "sysctl",
    badge: "sct",
    title: "sysctl — Runtime Linux Kernel Parameters",
    subtitle: "Inspecting and tuning /proc/sys network buffers, VM swappiness/hugepages, file-max & kernel panic timeouts",
    commands: [
      {
        id: "sysctl-kernel-tuning",
        desc: "Query active kernel runtime parameters (/proc/sys), apply live tunables (-w), and reload /etc/sysctl.d/*.conf",
        cmd: "sysctl -a | grep -E 'net.core.rmem_max|vm.swappiness|vm.nr_hugepages|fs.file-max|kernel.panic'",
        details: "Reads and modifies kernel tunables exposed under '/proc/sys/'. Changes made with 'sysctl -w' take effect immediately in RAM; persist them across reboots by placing a drop-in file in '/etc/sysctl.d/90-datacenter.conf' and running 'sysctl --system'.",
        flags: [
          ["-a", "Display all currently available kernel runtime parameters and values"],
          ["-w key=val", "Change a kernel parameter immediately at runtime"],
          ["--system", "Reload settings from all system configuration files in /etc/sysctl.d/ and /etc/sysctl.conf"]
        ],
        subcommands: [
          ["sysctl --system", "Apply all persistent kernel parameters configured in /etc/sysctl.d/*.conf"],
          ["sysctl -w vm.drop_caches=3", "Instruct the kernel to drop clean pagecache, dentries, and inodes from RAM before storage benchmarks"]
        ],
        tip: "Persist settings in /etc/sysctl.d/90-custom.conf",
        tags: ["sysctl", "kernel", "tuning", "hugepages", "swappiness", "network"]
      }
    ]
  },
  {
    id: "xxd",
    badge: "xxd",
    title: "xxd — Hex + ASCII Dump & Binary Patching",
    subtitle: "Inspecting MBR/GPT disk headers, SFP/FRU EEPROM dumps, verifying .bin firmware headers & hex-to-binary reversal (-r)",
    commands: [
      {
        id: "xxd-hexdump-binary",
        desc: "Inspect binary files, MBR/GPT partition headers, or SFP/FRU EEPROM dumps in side-by-side Hex + ASCII",
        cmd: "xxd -g 1 -l 256 /etc/localtime",
        details: "Displays the first 256 bytes in 16-byte rows with byte offsets on the left and printable ASCII on the right. Essential for checking if a downloaded firmware '.bin' is actually a binary vs an HTML error page, or reversing hex edits back into a binary file (-r).",
        flags: [
          ["-g 1", "Group output by 1 byte (2 hex digits) per column"],
          ["-l 256", "Limit dump to the first 256 bytes"],
          ["-s <offset>", "Seek to byte offset (decimal or 0xHex) before dumping"],
          ["-r", "Reverse operation: convert a hex dump back into a binary file"],
          ["-p", "Output continuous plain hex dump without offsets or ASCII column"]
        ],
        subcommands: [
          ["head -c 512 /dev/nvme0n1 | xxd -g 1", "Dump the first 512 bytes (MBR / protective GPT signature 55 AA) of a physical disk"],
          ["echo -n '4d 5a 90 00' | xxd -r -p > header.bin", "Convert a plain hex string back into raw binary bytes (-r -p)"],
          ["hexdump -C -n 256 /bin/ls", "Alternative canonical hex+ASCII dump using BSD/util-linux hexdump -C"]
        ],
        tip: "Check first 64 bytes of a .bin to ensure it's not HTML!",
        tags: ["xxd", "hexdump", "hex", "binary", "eeprom", "mbr", "gpt"]
      }
    ]
  },
  {
    id: "strings",
    badge: "str",
    title: "strings — Firmware & Core Dump String Extraction",
    subtitle: "Extracting embedded ASCII/UTF version strings, board IDs, and build dates from .bin/.rom firmware blobs and core dumps",
    commands: [
      {
        id: "strings-firmware",
        desc: "Extract readable ASCII/UTF version strings from firmware blobs, kernel modules, or application core dumps",
        cmd: "strings -a -n 6 firmware.bin | grep -iE 'version|bios|build|date|copyright' | head -n 30",
        details: "Before flashing a '.bin' or '.rom' file onto a motherboard or NIC, 'strings -a -n 6' scans the entire binary for sequences of at least 6 consecutive printable characters, revealing embedded board IDs, build dates, and firmware version strings.",
        flags: [
          ["-a", "Scan the entire file (not just initialized data sections of ELF binaries)"],
          ["-n 6", "Print sequences of at least 6 consecutive printable ASCII characters (default is 4)"],
          ["-t x", "Print the hexadecimal byte offset within the file before each extracted string"]
        ],
        subcommands: [
          ["strings -t x -n 8 /var/crash/core.* | tail -n 40", "Extract printable strings along with their hex offsets (-t x) from an application core dump"],
          ["cmp -l fw_slot1.bin fw_slot2.bin | head -n 20", "Compare two binary firmware images byte-by-byte and print differing byte offsets"]
        ],
        tip: "Verify board model inside firmware.bin before flashing!",
        tags: ["strings", "cmp", "firmware", "binary", "version", "coredump"]
      }
    ]
  },
  {
    id: "ip",
    badge: "ip6",
    title: "ip — IPv6 Interfaces, Routing, NDP & Namespaces",
    subtitle: "iproute2 link/addr state (-6 -br -c), packet drop counters (-s -s), route policy lookup (ip -6 route get) & NDP cache (ip -6 neigh)",
    commands: [
      {
        id: "ip-link-addr-counters",
        desc: "Inspect network interface carrier state, MAC, MTU, IPv6 `/64` & `fe80::` link-local addresses, and hardware RX/TX drop counters",
        cmd: "ip -c -br link show && ip -6 -c -br addr show && ip -s -s link show dev eth0",
        details: "Replaces legacy 'ifconfig'. In 'ip link', 'LOWER_UP' means physical L1 carrier light/link is detected, while 'UP' means the interface is administratively enabled. Passing '-s -s' prints detailed RX/TX errors, dropped packets, overruns, and carrier transitions.",
        flags: [
          ["-6 -c -br", "Show brief single-line IPv6 addresses with color coding (green UP, red DOWN, magenta IPv6/MAC)"],
          ["-s -s", "Double statistics mode: show granular RX/TX crc, frame, fifo, and carrier error counters"],
          ["-d", "Detailed mode: show VLAN IDs, bond master/slave settings, bridge state, and queue discipline"]
        ],
        subcommands: [
          ["ip -d -c link show type vlan && ip -d -c link show type bond", "Display detailed 802.1Q VLAN tag IDs and 802.3ad bond configurations"],
          ["ip link set dev eth0 mtu 9000 up", "Bring interface eth0 UP and set MTU to 9000 (Jumbo Frames)"],
          ["ip -6 addr add 2001:db8:dc:4::10/64 dev eth1", "Temporarily assign an IPv6 /64 address to eth1 (for direct laptop/BMC recovery connection)"]
        ],
        tip: "LOWER_UP = physical link detected; UP = admin up",
        tags: ["ip", "ipv6", "iproute2", "interface", "mac", "mtu", "counters", "vlan"]
      },
      {
        id: "ip-route-neigh-netns",
        desc: "Query kernel IPv6 routing decisions (`ip -6 route get`), inspect L2 NDP neighbor cache (`ip -6 neigh`), and run inside namespaces",
        cmd: "ip -6 route get 2001:db8:dc:4::50 && ip -6 -c neigh show",
        details: "'ip -6 route get <IPv6>' asks the Linux kernel routing engine which exact outgoing interface, source IPv6, and next-hop gateway (often a switch link-local fe80:: address) it will use to reach a destination IPv6 — essential on multi-homed servers with multiple VLANs.",
        flags: [
          ["-6 route get <IP>", "Resolve and print the exact IPv6 route path, egress interface, and source IPv6 for a target address"],
          ["-6 neigh show", "Display IPv6 Neighbor Discovery (NDP) cache (REACHABLE, STALE, DELAY, FAILED, router)"],
          ["-6 rule list", "List IPv6 Policy-Based Routing (PBR) rules and routing table priorities"]
        ],
        subcommands: [
          ["ip -6 neigh flush all", "Flush stale IPv6 Neighbor Discovery (NDP) cache entries after a switch/VIP failover"],
          ["ip netns list && ip netns exec <ns_name> ip -6 -c -br addr", "List network namespaces and execute an ip -6 command inside an isolated namespace"]
        ],
        tip: "neigh state FAILED = ICMPv6 Neighbor Solicitation sent but no L2 reply!",
        tags: ["ip", "ipv6", "route", "ndp", "neighbor", "gateway", "netns"]
      }
    ]
  },
  {
    id: "ss",
    badge: "ss",
    title: "ss — IPv6 Socket Statistics, Port Owners & TCP Internals",
    subtitle: "Listening IPv6/dual-stack ports (-tulpn), socket state filtering, TCP congestion/retransmits (-6 -ti) & summaries (-s)",
    commands: [
      {
        id: "ss-listening-tcp-internals",
        desc: "List listening IPv6/TCP/UDP ports with owning PIDs, filter by TCP state, and inspect per-socket RTT & retransmits",
        cmd: "ss -tulpn && ss -6 -tanp state established",
        details: "Queries kernel netlink TCP_DIAG directly. Adding '-ti' to established IPv6 connections shows internal kernel TCP stack telemetry for each socket: congestion algorithm (cubic/bbr), smoothed RTT in ms, congestion window (cwnd), and packet retransmit counts.",
        flags: [
          ["-6", "Filter specifically for IPv6 sockets (note: sockets bound to [::] often accept both IPv6 and IPv4)"],
          ["-t -u", "Show TCP (-t) and UDP (-u) sockets (-x for Unix domain sockets)"],
          ["-l / -a", "Show only listening sockets (-l) or all sockets (-a)"],
          ["-p", "Show owning process name, PID, and file descriptor number (requires sudo)"],
          ["-n", "Do not resolve port numbers or IPv6 addresses (instant output)"],
          ["-i / -o", "Show internal TCP info (-i: RTT, cwnd, retransmits) and TCP retransmission timers (-o)"]
        ],
        subcommands: [
          ["ss -6 -tanp state established '( dport = :443 or sport = :22 )'", "Filter established IPv6 TCP connections matching specific source or destination ports"],
          ["ss -tan state time-wait | wc -l", "Count total sockets in TIME-WAIT state (check for ephemeral port exhaustion)"],
          ["ss -6 -ti dst \"[2001:db8:dc:4::50]\"", "Inspect TCP RTT latency, congestion window (cwnd), and retransmit counts to a specific peer IPv6"]
        ],
        tip: "ss -6 -ti reveals per-connection IPv6 TCP retransmits & RTT",
        tags: ["ss", "ipv6", "socket", "ports", "listen", "tcp", "retransmits", "rtt"]
      }
    ]
  },
  {
    id: "tcpdump",
    badge: "tcp",
    title: "tcpdump — IPv6 Packet Capture, ICMPv6/NDP & BPF Filters",
    subtitle: "Capturing 802.1Q VLAN tags, DHCPv6 (546/547)/PXEv6/TFTP, ICMPv6 RA/NDP (133–136), LLDP frames & TCP SYN/RST flags",
    commands: [
      {
        id: "tcpdump-datacenter-bpf",
        desc: "Capture live IPv6 packets on an interface using BPF expressions for VLANs, DHCPv6/PXEv6, ICMPv6 NDP/RA, or TCP flags",
        cmd: "tcpdump -ni eth0 -nn -vv -e -c 50 'ip6 and (port 546 or port 547 or port 69 or icmp6)'",
        details: "Essential when a server fails to PXEv6 boot, get a DHCPv6 lease (UDP 546/547) or Router Advertisement (ICMPv6 type 134), or resolve Neighbor Discovery (types 135/136). Always pass '-nn' (disable DNS/port lookups) and '-e' (print Layer-2 MAC headers and 802.1Q VLAN tag IDs!).",
        flags: [
          ["ip6 / icmp6", "Filter specifically for IPv6 packets or ICMPv6 (Neighbor Discovery, Router Advertisements, Ping6)"],
          ["port 546 or port 547", "Capture DHCPv6 client (546) and server/relay (547) packets"],
          ["-nn -e", "Disable DNS/service lookups (-nn) and print L2 MAC + 802.1Q VLAN ID headers (-e)"],
          ["-vv -X", "Very verbose protocol decoding (-vv) and hex+ASCII payload dump (-X)"],
          ["-s 0 -w out.pcap", "Capture full packet snaplen (-s 0) and write raw binary pcap file (-w) for Wireshark"]
        ],
        subcommands: [
          ["tcpdump -ni eth0 -nn -vv 'icmp6 and (ip6[40] == 133 or ip6[40] == 134 or ip6[40] == 135 or ip6[40] == 136)'", "Capture only ICMPv6 Router Solicitation/Advertisement (133/134) and Neighbor Solicitation/Advertisement (135/136)"],
          ["tcpdump -ni eth0 -nn -e 'vlan 100 and ip6'", "Capture only IPv6 packets tagged with IEEE 802.1Q VLAN ID 100 and display L2 headers (-e)"],
          ["tcpdump -ni eth0 -nn -s 1500 -vv -c 1 'ether proto 0x88cc'", "Capture a single LLDP frame (ethertype 0x88cc) to see the upstream switch name and port ID"]
        ],
        tip: "DHCPv6 uses UDP 546/547; NDP/SLAAC uses ICMPv6 types 133–136!",
        tags: ["tcpdump", "ipv6", "icmp6", "dhcpv6", "ndp", "pcap", "vlan", "pxe", "lldp", "bpf"]
      }
    ]
  },
  {
    id: "dmesg",
    badge: "dmg",
    title: "dmesg — Kernel Ring Buffer & Hardware Event Log",
    subtitle: "Human-readable timestamps (-T), live hardware event following (-w), severity filtering (--level) & OOM/MCE/AER triage",
    commands: [
      {
        id: "dmesg-kernel-triage",
        desc: "Inspect or follow the Linux kernel ring buffer for hardware faults, OOM kills, disk resets, and driver errors",
        cmd: "dmesg -T --level=emerg,alert,crit,err,warn | tail -n 40",
        details: "Reads the kernel printk ring buffer (/dev/kmsg). Whenever a PCIe device drops off the bus, an NVMe I/O times out, an SFP optic is plugged in, an ECC memory error occurs, or the OOM-killer fires, the kernel logs it here first.",
        flags: [
          ["-T / --ctime", "Print human-readable wall-clock timestamps (note: can drift slightly if system suspended)"],
          ["-w / --follow", "Wait and follow new kernel messages live in real time (like tail -f for the kernel)"],
          ["-l / --level=...", "Filter output to comma-separated levels: emerg,alert,crit,err,warn,notice,info,debug"],
          ["-f / --facility=...", "Restrict output to specific facilities (kern, daemon, syslog)"],
          ["-x", "Decode and prefix each line with its facility and level (e.g. 'kern  :err   :')"]
        ],
        subcommands: [
          ["dmesg -T -w", "Follow live kernel events in real time while hot-plugging drives, optics, or USB serial cables"],
          ["dmesg -T | grep -iE 'oom|killed process|out of memory|mce|edac|aer|nvme|reset|link down'", "Scan kernel ring buffer for the top data center hardware and memory fault signatures"]
        ],
        tip: "Keep 'dmesg -T -w' open while hot-swapping hardware",
        tags: ["dmesg", "kernel", "hardware", "oom", "mce", "aer", "hotplug"]
      }
    ]
  }
];

// Interactive Composer Recipes per CLI Tool
const CLI_COMPOSER_RECIPES = {
  grep: [
    {
      id: "err-context",
      label: "Recursive Error Triage with Context (-rnIE -C 3)",
      defaultTarget: "/var/log/",
      build: (t) => `grep -rnIE -C 3 --color=auto 'ERROR|CRITICAL|FATAL|MCE|AER' ${t || "/var/log/"}`,
      desc: "Recursively searches plain-text files in target directory for hardware/service error keywords with line numbers and 3 lines of surrounding context."
    },
    {
      id: "strip-comments",
      label: "Strip Comments & Blank Lines (-Ev '^\\s*(#|$)')",
      defaultTarget: "/etc/ssh/sshd_config",
      build: (t) => `grep -Ev '^\\s*(#|$|;)' ${t || "/etc/ssh/sshd_config"}`,
      desc: "Inverts match (-v) to strip all '#' or ';' comment lines and empty whitespace lines, showing only active directives."
    },
    {
      id: "pcre-extract-ip",
      label: "Extract & Count Unique IPv6 / IPv4 Addresses (-Po)",
      defaultTarget: "/var/log/auth.log",
      build: (t) => `grep -Po '([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}|([0-9]{1,3}\\.){3}[0-9]{1,3}' ${t || "/var/log/auth.log"} | sort | uniq -c | sort -nr | head -n 15`,
      desc: "Uses Perl-Compatible Regex (-P) and only-matching (-o) to extract every IPv6 or IPv4 address and rank the top 15 by frequency."
    },
    {
      id: "sysfs-multi",
      label: "Read Multiple sysfs Files with Filenames (-H '')",
      defaultTarget: "/sys/class/net/*/operstate",
      build: (t) => `grep -H '' ${t || "/sys/class/net/*/operstate"} 2>/dev/null`,
      desc: "Matches every line across wildcard sysfs files and prefixes each value with its exact file path (-H)."
    }
  ],
  ps: [
    {
      id: "top-rss",
      label: "Top 15 Memory (RSS) Consumers with Thread Count",
      defaultTarget: "-%mem",
      build: (t) => `ps -eo pid,ppid,nlwp,user,stat,%cpu,%mem,rss,lstart,args --sort=${t || "-%mem"} | head -n 16`,
      desc: "Lists all processes with PID, PPID, thread count (nlwp), state, CPU%, MEM%, Resident KiB (rss), and full command line."
    },
    {
      id: "hung-d-state",
      label: "Find Hung 'D' (Uninterruptible I/O) & Zombie 'Z' Procs",
      defaultTarget: "/^[DZ]/",
      build: (t) => `ps -eo pid,ppid,user,stat,wchan:28,lstart,args | awk 'NR==1 || $4 ~ ${t || "/^[DZ]/"}'`,
      desc: "Filters for processes stuck in kernel I/O sleep (D) or Zombie state (Z) and prints the kernel wait channel function (wchan)."
    },
    {
      id: "threads-core",
      label: "Inspect Threads (LWP) & Assigned Physical CPU Core (psr)",
      defaultTarget: "-%cpu",
      build: (t) => `ps -eLo pid,lwp,psr,user,%cpu,stat,comm --sort=${t || "-%cpu"} | head -n 20`,
      desc: "Expands processes into individual threads (-L) and displays which logical CPU core (psr) is executing each thread."
    }
  ],
  ls: [
    {
      id: "newest-bottom",
      label: "Newest Modified Files at Bottom with Full ISO Time",
      defaultTarget: "/var/log/",
      build: (t) => `ls -lahtr --time-style=full-iso ${t || "/var/log/"}`,
      desc: "Sorts by modification time in reverse (-tr) with nanosecond ISO timestamps so the latest modified files sit right above your prompt."
    },
    {
      id: "largest-bottom",
      label: "Largest Files at Bottom with Allocated Blocks (-laSrh)",
      defaultTarget: "/var/log/",
      build: (t) => `ls -laSrhs ${t || "/var/log/"}`,
      desc: "Sorts by file size in reverse (-Sr) and includes allocated filesystem blocks (-s) to spot sparse files."
    },
    {
      id: "namei-chain",
      label: "Trace Symlink & Directory Permission Chain (namei -l)",
      defaultTarget: "/var/www/html",
      build: (t) => `namei -l ${t || "/var/www/html"}`,
      desc: "Walks every path component from '/' down to the target, resolving symlinks and printing owner/group/permissions at each step."
    }
  ],
  awk: [
    {
      id: "sum-mib",
      label: "Sum Column & Convert Bytes/KiB to MiB",
      defaultTarget: "/var/log/*.log",
      build: (t) => `ls -l ${t || "/var/log/*.log"} | awk '{sum += $5} END {printf "Total: %.2f MiB\\n", sum/1048576}'`,
      desc: "Accumulates column 5 (byte size from ls -l) across all lines and prints the formatted total in MiB in the END block."
    },
    {
      id: "group-rss-user",
      label: "Group & Sum Resident Memory (MiB) by Username",
      defaultTarget: "-k2 -nr",
      build: (t) => `ps -eo user,rss | awk 'NR>1 {mem[$1]+=$2} END {for (u in mem) printf "%-14s %8.1f MiB\\n", u, mem[u]/1024}' | sort ${t || "-k2 -nr"}`,
      desc: "Uses an awk associative array (mem[user] += rss) to aggregate total physical RAM per user in a single pass."
    },
    {
      id: "dedup-order",
      label: "Deduplicate Lines Preserving Original Order (!seen[$0]++)",
      defaultTarget: "/var/log/syslog",
      build: (t) => `awk '!seen[$0]++' ${t || "/var/log/syslog"}`,
      desc: "Removes duplicate lines from a stream or file without sorting, keeping the exact chronological order of first appearance."
    }
  ],
  sed: [
    {
      id: "inplace-bak",
      label: "Safe In-Place Path/Config Replace with Backup (-i.bak)",
      defaultTarget: "/etc/fstab",
      build: (t) => `sed -i.bak -E 's|/old/mount|/new/mount|g' ${t || "/etc/fstab"} && diff -u ${t || "/etc/fstab"}.bak ${t || "/etc/fstab"}`,
      desc: "Uses '|' as the regex delimiter (no escaping slashes), creates a .bak copy, and runs diff -u to verify the exact change."
    },
    {
      id: "slice-timestamps",
      label: "Slice Log File Between Two Timestamps (/START/,/END/p)",
      defaultTarget: "/var/log/syslog",
      build: (t) => `sed -n '/02:50:00/,/03:05:00/p' ${t || "/var/log/syslog"}`,
      desc: "Streams only the lines falling between the start pattern and end pattern without loading the whole file into an editor."
    },
    {
      id: "slice-lines-fast",
      label: "Extract Exact Line Range & Quit Early (1000,1050p;1051q)",
      defaultTarget: "/var/log/kern.log",
      build: (t) => `sed -n '1000,1050p;1051q' ${t || "/var/log/kern.log"}`,
      desc: "Prints lines 1000 through 1050 and quits immediately at line 1051 so sed doesn't waste time reading multi-GB files."
    }
  ],
  find: [
    {
      id: "recent-large",
      label: "Find Large Files (>100M) Modified in Last 60 Mins on Root",
      defaultTarget: "/",
      build: (t) => `find ${t || "/"} -xdev -type f -size +100M -mmin -60 -exec ls -lh {} + 2>/dev/null`,
      desc: "Scans a single mounted filesystem (-xdev) for regular files larger than 100 MiB modified within the last 60 minutes."
    },
    {
      id: "xargs-parallel",
      label: "Parallel Null-Safe Compression (find -print0 | xargs -0 -P 8)",
      defaultTarget: "/var/log/archive",
      build: (t) => `find ${t || "/var/log/archive"} -type f -name '*.log' -mtime +1 -print0 | xargs -0 -r -P 8 zstd --rm -9`,
      desc: "Passes null-terminated file paths (-print0 / -0) to 8 concurrent zstd compression workers (-P 8)."
    }
  ],
  scp: [
    {
      id: "scp-dir-bastion",
      label: "Copy Directory via Bastion / Custom Port (-r -p -P -J)",
      defaultTarget: "root@10.20.4.15:/tmp/",
      build: (t) => `scp -r -p -P 22 -J user@bastion ./firmware/ ${t || "root@10.20.4.15:/tmp/"}`,
      desc: "Recursively copies a directory preserving timestamps/modes (-p) over SSH port (-P) through a bastion host (-J)."
    },
    {
      id: "scp-three-way",
      label: "Copy Directly Between Two Remote Servers (-3)",
      defaultTarget: "root@10.20.4.16:/etc/netplan/",
      build: (t) => `scp -3 root@10.20.4.15:/etc/netplan/01-netcfg.yaml ${t || "root@10.20.4.16:/etc/netplan/"}`,
      desc: "Routes a file copy between two remote rack servers through your local jumpbox (-3) when the servers cannot SSH to each other."
    },
    {
      id: "http-stage-server",
      label: "Serve Current Directory over HTTP for BMC/ISO Pull (python3)",
      defaultTarget: "8000",
      build: (t) => `python3 -m http.server ${t || "8000"} --directory /srv/firmware`,
      desc: "Starts an instant HTTP server so a BMC or isolated rack server can pull firmware/ISOs via curl or wget."
    }
  ],
  tmux: [
    {
      id: "tmux-sync-panes",
      label: "Start Named Session & Enable Synchronized Multi-Server Panes",
      defaultTarget: "rack04-maint",
      build: (t) => `tmux new -s ${t || "rack04-maint"} \\; split-window -v \\; set-window-option synchronize-panes on`,
      desc: "Creates a persistent named tmux session, splits the window, and turns on synchronize-panes to type across multiple servers at once."
    },
    {
      id: "serial-tio",
      label: "Connect USB-to-Serial Crash Cart at 115200 8N1 (tio)",
      defaultTarget: "/dev/ttyUSB0",
      build: (t) => `tio -b 115200 -d 8 -f none -s 1 ${t || "/dev/ttyUSB0"}`,
      desc: "Opens a 115200 8N1 serial console on the target UART device with auto-reconnect (Exit with Ctrl+t q)."
    },
    {
      id: "base64-sol-paste",
      label: "Encode File as Single-Line Base64 for Serial/SOL Paste",
      defaultTarget: "fix-net.sh",
      build: (t) => `gzip -c ${t || "fix-net.sh"} | base64 -w0 && echo ''`,
      desc: "Compresses and encodes a file into a single ASCII Base64 line you can copy-paste over an offline IPMI SOL / RS-232 console."
    }
  ],
  jq: [
    {
      id: "ip-up-table",
      label: "Parse 'ip -j addr' for UP Interfaces & IPv4 (jq -r)",
      defaultTarget: "UP",
      build: (t) => `ip -j addr show | jq -r '.[] | select(.operstate == "${t || "UP"}") | [.ifname, .address, (.addr_info[0].local // "none")] | @tsv' | column -t`,
      desc: "Queries iproute2 native JSON output (-j) for interfaces matching operstate and formats name, MAC, and IP as a table."
    },
    {
      id: "nvme-json-table",
      label: "Parse 'nvme list -o json' for Serial, FW & Capacity",
      defaultTarget: "/dev/nvme",
      build: (t) => `nvme list -o json | jq -r '.Devices[] | select(.DevicePath | startswith("${t || "/dev/nvme"}")) | [.DevicePath, .ModelNumber, .SerialNumber, .Firmware] | @tsv' | column -t -s $'\\t'`,
      desc: "Extracts NVMe block device path, drive model, serial number, and firmware revision from nvme-cli JSON output."
    }
  ]
};

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("cli_tools_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM References
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

function showToast(message) {
  toastTextEl.textContent = message;
  toastEl.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
  }, 1900);
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
    showToast("Copied command to clipboard");
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) {
        return `<span class="tok-str">${strLiteral}</span>`;
      }
      if (flagPart) {
        return `<span class="tok-flag">${flagPart}</span>`;
      }
      if (operatorPart) {
        return `<span class="tok-pipe">${operatorPart}</span>`;
      }
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
  const totalCommands = CLI_TOOLS_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of CLI_TOOLS_DATA) {
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
    cmdObj.details || "",
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
window.addEventListener("resize", () => packMasonry());
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of CLI_TOOLS_DATA) {
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
        const dangerHtml = item.danger
          ? `<span class="danger-badge" title="${escapeHtml(item.danger)}">! ${escapeHtml(item.danger)}</span>`
          : "";
        const tipHtml = item.tip
          ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>`
          : "";

        const detailsHtml = item.details
          ? `<p class="cmd-details">${escapeHtml(item.details)}</p>`
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

        const subcommandsHtml =
          item.subcommands && item.subcommands.length
            ? `<div class="subcmd-list">
                <span class="subcmd-header">Subcommands &amp; Recipes (click any to copy)</span>
                ${item.subcommands
                  .map(
                    ([subcmd, explanation]) =>
                      `<div class="subcmd-row" data-copy="${escapeHtml(subcmd)}" title="Click to copy subcommand">
                        <code>${escapeHtml(subcmd)}</code>
                        <span>${escapeHtml(explanation)}</span>
                      </div>`
                  )
                  .join("")}
              </div>`
            : "";

        return `
          <div class="cmd-item" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
                ${dangerHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn ${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="${item.id}"
                  title="${isSaved ? "Remove bookmark" : "Bookmark command"}"
                  aria-label="Bookmark command"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(item.cmd)}" title="Click to copy command">
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
  visibleCountEl.textContent = String(visibleCommandsCount);
  savedCountEl.textContent = String(state.bookmarks.size);
  savedFilterBtn.classList.toggle("active", state.savedOnly);

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }
}

// Interactive CLI Composer Logic
function initCliComposer() {
  const toolSelect = document.getElementById("cli-tool-select");
  const taskSelect = document.getElementById("cli-task-select");
  const targetInput = document.getElementById("cli-target-input");
  const outputEl = document.getElementById("cli-composer-output");
  const descEl = document.getElementById("cli-composer-desc");
  const copyBtn = document.getElementById("cli-composer-copy");

  function populateTasks(toolKey) {
    const recipes = CLI_COMPOSER_RECIPES[toolKey] || [];
    taskSelect.innerHTML = recipes
      .map((r, idx) => `<option value="${idx}">${escapeHtml(r.label)}</option>`)
      .join("");
    if (recipes[0]) {
      targetInput.value = recipes[0].defaultTarget;
    }
    updateOutput();
  }

  function updateOutput() {
    const toolKey = toolSelect.value;
    const recipes = CLI_COMPOSER_RECIPES[toolKey] || [];
    const recipe = recipes[Number(taskSelect.value)] || recipes[0];
    if (!recipe) return;
    const cmd = recipe.build(targetInput.value.trim());
    outputEl.textContent = cmd;
    descEl.textContent = recipe.desc;
  }

  toolSelect.addEventListener("change", () => {
    populateTasks(toolSelect.value);
  });

  taskSelect.addEventListener("change", () => {
    const toolKey = toolSelect.value;
    const recipe = (CLI_COMPOSER_RECIPES[toolKey] || [])[Number(taskSelect.value)];
    if (recipe) {
      targetInput.value = recipe.defaultTarget;
    }
    updateOutput();
  });

  targetInput.addEventListener("input", updateOutput);

  copyBtn.addEventListener("click", () => {
    copyToClipboard(outputEl.textContent);
  });

  populateTasks(toolSelect.value);
}

// Mini Tabs inside Decoder Widget
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
        showToast("Removed from saved commands");
      } else {
        state.bookmarks.add(id);
        showToast("Saved command to bookmarks");
      }
      localStorage.setItem("cli_tools_bookmarks", JSON.stringify([...state.bookmarks]));
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
    if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      if (searchInput.value) {
        searchInput.value = "";
        state.searchQuery = "";
        renderSections();
      } else {
        searchInput.blur();
      }
    }
  });
}

function init() {
  applyTheme(state.theme);
  renderCategoryTabs();
  renderSections();
  initCliComposer();
  initMiniTabs();
  initEvents();
}

init();
