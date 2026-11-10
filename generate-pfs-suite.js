// generate-pfs-suite.js
// Generates the "Parallel filesystems" suite under the Hardware tab: Lustre, WEKA, BeeGFS and
// Ceph, plus the pfs.html hub. The client- and admin-side checks for a storage ticket: is
// every server and target up, where is the space, which device or node is behind it, and the
// few commands that change state (flagged).
//
// Facts checked 2026-11-09 against each project's own documentation:
// - Lustre Operations Manual (doc.lustre.org; lustre.org lists 2.17.0 as the current major
//   release, 2.15.8 maintenance). lnetctl ping is not in the manual: lctl ping is used.
// - WEKA 6.0 CLI reference (the new weka CLI; "cluster host" is now "cluster container",
//   "events list-local" is now "events local").
// - BeeGFS 8.4 docs (the beegfs CLI) and 7.4.6 docs (beegfs-ctl and friends) for older sites.
// - Ceph docs (latest; Umbrella 21.2 is the newest release, Tentacle 20.2 and Squid 19.2 are
//   still supported).
// Every command carries its source line. Menu logos: generic line icons.
//
// Re-runnable like the other generators.
const { buildSuite } = require('./generate-suite-kit');

const icon = (d, color) => `<svg class="menu-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const DISKS = '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6M4.5 11.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6"/>';
const LOGOS = {
  'pfs-lustre': icon(DISKS, '#38bdf8'),
  'pfs-weka': icon(DISKS, '#a78bfa'),
  'pfs-beegfs': icon(DISKS, '#facc15'),
  'pfs-ceph': icon(DISKS, '#f87171')
};

const SRC = (refs, note) => ({ verified: '2026-11-09', refs: refs.map(([url, title]) => ({ url, title })), ...(note ? { note } : {}) });
const LUSTRE = ['https://doc.lustre.org/lustre_manual.xhtml', 'Lustre Operations Manual'];
const WEKA = 'https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/';
const BEE8 = 'https://doc.beegfs.io/latest/';
const BEE7 = 'https://doc.beegfs.io/7.4.6/';
const CEPH = 'https://docs.ceph.com/en/latest/';

const PFS_SECTIONS = [
  // ------------------------------------------------------------ LUSTRE
  {
    id: 'pfs-lustre', group: 'pfs', file: 'pfs-lustre', badge: 'lustre', code: 'lfs',
    name: 'Lustre', navDesc: 'lfs df, check servers, lctl, LNet', pill: 'Lustre 2.17 · 2.15 LTS',
    title: 'Lustre: Servers, Targets, Space & LNet',
    subtitle: 'From a client: are the MDS and OSS reachable, which OST is full or missing, is LNet up, and how a file is striped',
    commands: [
      {
        id: 'lustre-check-servers',
        desc: 'Are all the Lustre servers (MDTs and OSTs) reachable from this client?',
        cmd: 'lfs check servers',
        flags: [
          ['servers', 'Every MDT and OST the client knows about'],
          ['osts / mds', 'lfs check osts or lfs check mds: only one kind']
        ],
        subcommands: [
          ['lfs check osts', 'Only the object storage targets'],
          ['lfs check mds', 'Only the metadata targets']
        ],
        tip: 'First check on a "Lustre is slow / hung" ticket',
        tags: ['lustre', 'lfs', 'servers', 'ost', 'mdt', 'reachability'],
        src: SRC([LUSTRE])
      },
      {
        id: 'lustre-df',
        desc: 'Space per MDT and OST: which target is full',
        cmd: 'lfs df -h /mnt/<fsname>',
        flags: [
          ['-h', 'Human-readable sizes, per MDT and OST'],
          ['-i', 'Inodes instead of space: a full MDT runs out of inodes first'],
          ['--lazy', 'Skip OSTs that are disconnected instead of waiting on them']
        ],
        subcommands: [
          ['lfs df -i /mnt/<fsname>', 'Inode use per MDT and OST'],
          ['lfs osts /mnt/<fsname>', 'Every OST with its index and UUID']
        ],
        tip: 'One OST at 100% stalls writes striped onto it',
        tags: ['lustre', 'lfs', 'df', 'space', 'inodes', 'ost'],
        src: SRC([LUSTRE])
      },
      {
        id: 'lustre-dl',
        desc: 'Lustre devices on this node and whether they are UP',
        cmd: 'lctl dl',
        flags: [
          ['Columns', 'Index, status (UP), type (mgc, mdc, osc, lov…), name, UUID, refcount'],
          ['osc / mdc', 'One per OST / MDT the client talks to: a missing one is a target it cannot see'],
          ['device_list', 'lctl device_list is the same command']
        ],
        subcommands: [
          ['lctl dl | grep -E " (mdc|osc) "', 'Only the client\'s connections to MDTs and OSTs'],
          ['lctl get_param osc.*.import', 'Connection detail for every OST import (fields vary by Lustre version)']
        ],
        tip: 'Count the osc lines against lfs osts',
        tags: ['lustre', 'lctl', 'devices', 'osc', 'mdc'],
        src: SRC([LUSTRE], 'The manual shows lctl get_param osc.<fs>-OST0001-osc-*.import; the fields in its output vary by version.')
      },
      {
        id: 'lustre-lnet',
        desc: 'LNet: which networks this node is on, and can it reach a server NID',
        cmd: 'lnetctl net show --verbose',
        flags: [
          ['status: up', 'The LNet network (tcp, o2ib) is up on this interface'],
          ['NID', 'address@network, e.g. 192.0.2.10@o2ib for InfiniBand or @tcp0'],
          ['--net <name>', 'Only one network, e.g. --net o2ib']
        ],
        subcommands: [
          ['lctl ping <nid>', 'LNet-level ping of a server, e.g. lctl ping 192.0.2.10@o2ib'],
          ['lnetctl peer show', 'Peers this node knows, with their NIDs and state'],
          ['dmesg -T | grep -iE "lustre|lnet"', 'Timeouts, evictions and reconnects in the kernel log']
        ],
        tip: 'lctl ping fails but IP ping works → LNet / IB, not the network',
        tags: ['lustre', 'lnet', 'lnetctl', 'nid', 'o2ib', 'ping'],
        src: SRC([LUSTRE], 'lnetctl ping is not in the Operations Manual; lctl ping {nid} is.')
      },
      {
        id: 'lustre-stripe',
        desc: 'How a file or directory is striped across OSTs',
        cmd: 'lfs getstripe -v <file-or-dir>',
        flags: [
          ['stripe_count', 'How many OSTs the file is spread over'],
          ['obdidx', 'Which OSTs hold its objects: match them to a slow or failed OST'],
          ['lfs setstripe -c N <dir>', 'Sets the layout for new files in the directory (changes state)']
        ],
        subcommands: [
          ['lfs setstripe -c <count> <dir>', 'Stripe new files in this directory over <count> OSTs (changes state)'],
          ['lfs find --obd <ost-uuid> /mnt/<fsname>', 'Files with objects on one OST (e.g. before replacing it)']
        ],
        tip: 'lfs find --obd lists what a dead OST takes with it',
        tags: ['lustre', 'lfs', 'stripe', 'layout', 'ost'],
        src: SRC([LUSTRE])
      },
      {
        id: 'lustre-mount',
        desc: 'Mount a Lustre filesystem on a client',
        cmd: 'mount -t lustre <mgs-nid>:/<fsname> /mnt/<fsname>',
        flags: [
          ['<mgs-nid>', 'The MGS NID, e.g. 192.0.2.10@o2ib; list a failover MGS as nid1:nid2:/fsname'],
          ['/<fsname>', 'The filesystem name chosen at mkfs.lustre time'],
          ['umount', 'Unmounting kills I/O for every job using it: drain the node first']
        ],
        subcommands: [
          ['umount /mnt/<fsname>', 'Unmount (changes state: drain the node first)']
        ],
        tip: 'Failover MGS: nid1:nid2:/fsname',
        tags: ['lustre', 'mount', 'client', 'mgs', 'nid'],
        src: SRC([LUSTRE])
      }
    ],
    proTip: {
      desc: 'Server side: is the target healthy?',
      cmd: 'lctl get_param health_check',
      details: 'On an MDS or OSS, the health_check parameter says "healthy", or "not healthy" after an LBUG or a failed device. If it is not healthy, check the server consoles and syslogs for LustreError and LBUG lines before restarting anything.',
      flags: [['not healthy', 'Look for LustreError / LBUG first'], ['Clients', 'lfs check servers from a client']],
      tip: 'Read the logs before you restart a Lustre server',
      src: SRC([LUSTRE], 'The manual names the health_check parameter and its "not healthy" status; reading it with lctl get_param is the standard form.')
    }
  },
  // ------------------------------------------------------------ WEKA
  {
    id: 'pfs-weka', group: 'pfs', file: 'pfs-weka', badge: 'weka', code: 'weka',
    name: 'WEKA', navDesc: 'status, alerts, containers, drives', pill: 'WEKA 6.0 CLI',
    title: 'WEKA: Status, Alerts, Containers & Drives',
    subtitle: 'Cluster health and rebuild, active alerts, which container or drive is down, local status, and the client mount',
    commands: [
      {
        id: 'weka-status',
        desc: 'Overall cluster status: health, capacity and protection',
        cmd: 'weka status',
        flags: [
          ['weka status rebuild', 'Phasing in/out progress and protection per fault level'],
          ['--detailed-capacity', 'Capacity detail including data reduction'],
          ['Output layout', 'Redesigned in the 6.0 CLI: re-check scripts that parse it']
        ],
        subcommands: [
          ['weka status rebuild', 'Rebuild / phase-out progress and protection level'],
          ['weka status --detailed-capacity', 'Capacity with data reduction']
        ],
        tip: 'Rebuilding? Don\'t pull another drive',
        tags: ['weka', 'status', 'rebuild', 'protection', 'capacity'],
        src: SRC([[WEKA + 'weka-status', 'WEKA CLI: weka status']])
      },
      {
        id: 'weka-alerts',
        desc: 'Active alerts in the cluster',
        cmd: 'weka alerts',
        flags: [
          ['(no flags)', 'Active alerts; muted ones are not listed'],
          ['--severity <level>', 'Filter by severity'],
          ['--inactive', 'Alerts that have cleared']
        ],
        subcommands: [
          ['weka alerts --inactive', 'Recently cleared alerts']
        ],
        tip: 'Muted alerts hide from the list',
        tags: ['weka', 'alerts', 'health'],
        src: SRC([[WEKA + 'weka-alerts', 'WEKA CLI: weka alerts']])
      },
      {
        id: 'weka-containers',
        desc: 'Every WEKA container (backend and client) and its status',
        cmd: 'weka cluster container',
        flags: [
          ['hostname / status / state / uptime', 'Which server, whether it is UP, and for how long'],
          ['Renamed in 6.0', 'Older CLIs called these hosts (weka cluster host)'],
          ['weka cluster process', 'The processes inside each container']
        ],
        subcommands: [
          ['weka cluster process', 'Processes per container'],
          ['weka cluster server list', 'Servers in the cluster']
        ],
        tip: 'A container not UP: check its server first',
        tags: ['weka', 'cluster', 'container', 'process', 'server'],
        src: SRC([[WEKA + 'weka-cluster', 'WEKA CLI: weka cluster'], ['https://docs.weka.io/getting-started-with-weka/weka-cli-overview/migrate-from-legacy-weka-cli', 'WEKA: migrate from the legacy CLI']])
      },
      {
        id: 'weka-drives',
        desc: 'NVMe drives WEKA manages, per container, and their status',
        cmd: 'weka cluster drive',
        flags: [
          ['status / drive_status', 'Whether each drive is active; look for anything not active'],
          ['--container <id>', 'Only the drives of one container (server)'],
          ['deactivate / remove', 'Change state and reduce protection: only with WEKA support and approval']
        ],
        subcommands: [
          ['weka cluster drive --container <container-id>', 'Drives on one server'],
          ['weka cluster drive deactivate <drive-id>', 'Phase a drive out before replacing it (changes state: WEKA support + approval)']
        ],
        tip: 'Match the drive to its server before any swap',
        tags: ['weka', 'drive', 'nvme', 'container'],
        src: SRC([[WEKA + 'weka-cluster', 'WEKA CLI: weka cluster']], 'The CLI reference names the status columns but does not list their values.')
      },
      {
        id: 'weka-local',
        desc: 'On one machine: its local WEKA containers and events',
        cmd: 'weka local ps',
        flags: [
          ['local ps', 'Containers running on this machine'],
          ['local events', 'Local events; works without authentication even when the cluster is down'],
          ['events local', 'Recent events on this machine (was "events list-local")']
        ],
        subcommands: [
          ['weka local events', 'Local events, even with the cluster down'],
          ['weka events local', 'Recent events that happened on this machine']
        ],
        tip: 'Cluster down? weka local events still answers',
        tags: ['weka', 'local', 'events', 'container'],
        src: SRC([[WEKA + 'weka-local', 'WEKA CLI: weka local'], [WEKA + 'weka-events', 'WEKA CLI: weka events']])
      },
      {
        id: 'weka-mount',
        desc: 'Mount a WEKA filesystem on a stateless client',
        cmd: 'mount -t wekafs <backend1>,<backend2>/<fs> /mnt/weka',
        flags: [
          ['<backend1>,<backend2>', 'Backends to join through; list several in case one is down'],
          ['/<fs>', 'The filesystem name (weka fs lists them); <fs>/<subdir> mounts a subdirectory'],
          ['Persistent clients', 'Mount by filesystem name only: mount -t wekafs <fs> /mnt/weka']
        ],
        subcommands: [
          ['weka fs', 'Filesystems in the cluster']
        ],
        tip: 'List more than one backend',
        tags: ['weka', 'mount', 'wekafs', 'client'],
        src: SRC([['https://docs.weka.io/weka-filesystems-and-object-stores/mounting-filesystems', 'WEKA: mount filesystems'], [WEKA + 'weka-fs', 'WEKA CLI: weka fs']])
      }
    ],
    proTip: {
      desc: 'Before touching a WEKA backend',
      cmd: 'weka status rebuild',
      details: 'Check protection and rebuild first: a cluster that is already rebuilding or running with reduced protection may not survive another drive or server going away. Get WEKA support involved before deactivating drives or containers.',
      flags: [['Protection', 'weka status rebuild'], ['Alerts', 'weka alerts']],
      tip: 'Never start a second failure during a rebuild',
      src: SRC([[WEKA + 'weka-status', 'WEKA CLI: weka status']])
    }
  },
  // ------------------------------------------------------------ BEEGFS
  {
    id: 'pfs-beegfs', group: 'pfs', file: 'pfs-beegfs', badge: 'beegfs', code: 'beegfs',
    name: 'BeeGFS', navDesc: 'health, targets, nodes (8.x and 7.x)', pill: 'BeeGFS 8.4 · 7.4 recipes',
    title: 'BeeGFS: Health, Targets, Nodes & Free Space',
    subtitle: 'BeeGFS 8 uses one beegfs command; each card also gives the BeeGFS 7.4 command for older clusters',
    commands: [
      {
        id: 'beegfs-health-check',
        desc: 'Check for common problems across the whole filesystem',
        cmd: 'beegfs health check',
        flags: [
          ['health check', 'BeeGFS 8: one pass over nodes, targets and connectivity'],
          ['beegfs-check-servers', 'BeeGFS 7.x: whether each service can be reached'],
          ['After an upgrade', 'BeeGFS\'s own upgrade guide uses it to confirm all nodes and targets are good']
        ],
        subcommands: [
          ['beegfs-check-servers', 'BeeGFS 7.x: reachability of mgmtd, meta and storage services']
        ],
        tip: 'Start here on any BeeGFS ticket',
        tags: ['beegfs', 'health', 'check-servers'],
        src: SRC([[BEE8 + 'quick_start_guide/quick_start_guide.html', 'BeeGFS 8.4 quick start'], [BEE8 + 'advanced_topics/upgrade.html', 'BeeGFS 8.4 upgrade guide'], [BEE7 + 'quick_start_guide/quick_start_guide.html', 'BeeGFS 7.4.6 quick start']])
      },
      {
        id: 'beegfs-targets',
        desc: 'Target reachability and consistency',
        cmd: 'beegfs target list --state',
        flags: [
          ['Online / Probably Offline / Offline', 'Reachable · a communication failure was seen · unreachable (a buddy-mirror primary fails over)'],
          ['Good / Needs resync / Resyncing / Bad', 'Consistency; anything but Good is a mirrored secondary that needs or failed a resync'],
          ['7.x', 'beegfs-ctl --listtargets --longnodes --state']
        ],
        subcommands: [
          ['beegfs-ctl --listtargets --longnodes --state', 'BeeGFS 7.x: the same view']
        ],
        tip: 'Bad consistency = the resync failed',
        tags: ['beegfs', 'targets', 'state', 'mirror', 'resync'],
        src: SRC([[BEE8 + 'reference/target_states.html', 'BeeGFS 8.4: target states'], [BEE7 + 'advanced_topics/target_management.html', 'BeeGFS 7.4.6: target management']])
      },
      {
        id: 'beegfs-nodes',
        desc: 'Nodes and the network interfaces they use',
        cmd: 'beegfs node list --with-nics',
        flags: [
          ['--with-nics', 'Each node\'s network interfaces (RDMA or TCP)'],
          ['--node-type=meta --reachability-check', 'Only metadata nodes, with a reachability check'],
          ['7.x', 'beegfs-ctl --listnodes --nodetype=storage --nicdetails']
        ],
        subcommands: [
          ['beegfs node list --node-type=meta --with-nics --reachability-check', 'Metadata nodes, NICs and reachability'],
          ['beegfs-ctl --listnodes --nodetype=storage --nicdetails', 'BeeGFS 7.x: storage nodes with NIC details']
        ],
        tip: 'Expect RDMA NICs on an IB fabric',
        tags: ['beegfs', 'nodes', 'nic', 'rdma'],
        src: SRC([[BEE8 + 'advanced_topics/node_management.html', 'BeeGFS 8.4: node management'], [BEE7 + 'quick_start_guide/quick_start_guide.html', 'BeeGFS 7.4.6 quick start']])
      },
      {
        id: 'beegfs-df',
        desc: 'Free space and inodes on metadata and storage targets',
        cmd: 'beegfs health df',
        flags: [
          ['health df', 'BeeGFS 8: space and inodes per metadata and storage target'],
          ['beegfs-df', 'BeeGFS 7.x equivalent'],
          ['health net', 'beegfs health net: the connections this client is actually using (7.x: beegfs-net)']
        ],
        subcommands: [
          ['beegfs-df', 'BeeGFS 7.x: free space and inodes per target'],
          ['beegfs health net', 'Connections this client uses (RDMA or TCP fallback)'],
          ['beegfs-net', 'BeeGFS 7.x: the same']
        ],
        tip: 'TCP where you expected RDMA = check the IB fabric',
        tags: ['beegfs', 'df', 'space', 'inodes', 'net'],
        src: SRC([[BEE8 + 'quick_start_guide/quick_start_guide.html', 'BeeGFS 8.4 quick start'], [BEE7 + 'quick_start_guide/quick_start_guide.html', 'BeeGFS 7.4.6 quick start']])
      },
      {
        id: 'beegfs-entry',
        desc: 'Where a file or directory lives: stripe pattern and targets',
        cmd: 'beegfs-ctl --getentryinfo <path>',
        flags: [
          ['--getentryinfo', 'BeeGFS 7.x: stripe pattern, chunk size and the targets holding the entry'],
          ['BeeGFS 8', 'beegfs entry info replaces it (beegfs entry info --help for the arguments)'],
          ['Client service', 'systemctl status beegfs-client on the client node']
        ],
        subcommands: [
          ['systemctl status beegfs-client --no-pager', 'Is the BeeGFS client service running on this node']
        ],
        tip: 'Map a slow file to its targets',
        tags: ['beegfs', 'entry', 'stripe', 'client'],
        src: SRC([[BEE7 + 'advanced_topics/striping.html', 'BeeGFS 7.4.6: striping'], [BEE8 + 'release_notes.html', 'BeeGFS 8.4 release notes']], 'The 8.4 docs name beegfs entry info but don\'t show its arguments.')
      }
    ],
    proTip: {
      desc: 'Which BeeGFS do you have?',
      cmd: 'beegfs --help',
      details: 'BeeGFS 8 ships the beegfs command (package beegfs-tools); 7.x uses beegfs-ctl, beegfs-df, beegfs-net and beegfs-check-servers. Flags differ: 8.x spells --node-type with a hyphen, 7.x --nodetype. Check which one the node has before copying.',
      flags: [['8.x', 'beegfs <noun> <verb>'], ['7.x', 'beegfs-ctl --<action>']],
      tip: 'Don\'t mix 7.x flags into 8.x commands',
      src: SRC([[BEE8 + 'quick_start_guide/quick_start_guide.html', 'BeeGFS 8.4 quick start'], [BEE7 + 'quick_start_guide/quick_start_guide.html', 'BeeGFS 7.4.6 quick start']])
    }
  },
  // ------------------------------------------------------------ CEPH
  {
    id: 'pfs-ceph', group: 'pfs', file: 'pfs-ceph', badge: 'ceph', code: 'ceph',
    name: 'Ceph', navDesc: 'health, OSDs, PGs, devices, noout', pill: 'Ceph 21.2 Umbrella · 20.2 · 19.2',
    title: 'Ceph: Health, OSDs, Placement Groups & Devices',
    subtitle: 'Cluster health, which OSD is down and on which disk, PG states, crash reports, and setting noout for maintenance',
    commands: [
      {
        id: 'ceph-status',
        desc: 'Cluster health at a glance, then the detail',
        cmd: 'ceph -s',
        flags: [
          ['HEALTH_OK / WARN / ERR', 'The overall state; ceph health detail says why'],
          ['ceph health detail', 'Each health check with the OSDs and PG ids it concerns'],
          ['ceph df', 'Raw and per-pool usage']
        ],
        subcommands: [
          ['ceph health detail', 'Every warning and error with the OSDs and PGs involved'],
          ['ceph df', 'Space per pool and raw capacity']
        ],
        tip: 'HEALTH_WARN: read ceph health detail before acting',
        tags: ['ceph', 'status', 'health'],
        src: SRC([[CEPH + 'rados/operations/monitoring/', 'Ceph: monitoring a cluster'], [CEPH + 'rados/operations/health-checks/', 'Ceph: health checks']])
      },
      {
        id: 'ceph-osd-tree',
        desc: 'Every OSD by host, and which are down',
        cmd: 'ceph osd tree',
        flags: [
          ['up / down', 'up: running and reachable; down: not running or not reachable'],
          ['in / out', 'in: holds data; a down OSD is marked out after mon_osd_down_out_interval (600 s) unless noout is set'],
          ['ceph osd stat', 'Totals: N osds, N up, N in']
        ],
        subcommands: [
          ['ceph osd stat', 'How many OSDs are up and in'],
          ['ceph osd df <host>', 'Utilization of the OSDs on one host']
        ],
        tip: 'Down but still in = data is degraded, not moving yet',
        tags: ['ceph', 'osd', 'tree', 'up', 'down', 'in', 'out'],
        src: SRC([[CEPH + 'rados/operations/control/', 'Ceph: control commands'], [CEPH + 'rados/operations/monitoring-osd-pg/', 'Ceph: monitoring OSDs and PGs']], 'ceph osd df tree is not in the current docs; ceph osd df <host> is.')
      },
      {
        id: 'ceph-pg',
        desc: 'Placement group states, and inconsistent PGs after a scrub',
        cmd: 'ceph pg stat',
        flags: [
          ['active+clean', 'Healthy'],
          ['degraded / undersized', 'Fewer copies than wanted, usually after an OSD went down'],
          ['backfilling / recovering', 'Ceph is copying data back into place'],
          ['inconsistent', 'A scrub found copies that don\'t match: find them before repairing']
        ],
        subcommands: [
          ['rados list-inconsistent-pg <pool>', 'PG ids with inconsistencies in a pool'],
          ['rados list-inconsistent-obj <pgid> --format=json-pretty', 'Which objects, and which copy is bad']
        ],
        tip: 'Inconsistent: find the bad copy (often a failing disk) before ceph pg repair',
        tags: ['ceph', 'pg', 'degraded', 'inconsistent', 'scrub'],
        src: SRC([[CEPH + 'rados/operations/monitoring-osd-pg/', 'Ceph: monitoring OSDs and PGs'], [CEPH + 'rados/troubleshooting/troubleshooting-pg/', 'Ceph: troubleshooting PGs']])
      },
      {
        id: 'ceph-devices',
        desc: 'Which physical disk is behind each OSD on a host',
        cmd: 'ceph device ls-by-host <host>',
        flags: [
          ['Each line', 'A device on that host and the OSD daemon(s) using it'],
          ['ceph device info <devid>', 'Everything Ceph knows about one device'],
          ['ceph device ls', 'Every device in the cluster']
        ],
        subcommands: [
          ['ceph device info <devid>', 'One device in detail'],
          ['ceph device ls', 'All devices and their daemons']
        ],
        tip: 'Match the serial in the device id to the drive label',
        tags: ['ceph', 'device', 'osd', 'disk', 'serial'],
        src: SRC([[CEPH + 'rados/operations/devices/', 'Ceph: device management']])
      },
      {
        id: 'ceph-noout',
        desc: 'Before maintenance: stop Ceph re-balancing while OSDs are down (changes state: ask first)',
        cmd: 'ceph osd set noout',
        flags: [
          ['noout', 'Down OSDs are not marked out, so no data moves while you work'],
          ['Cluster-wide', 'Affects every OSD: unset it as soon as the work is done'],
          ['ceph osd out <id>', 'Takes an OSD out on purpose: data starts migrating off it']
        ],
        subcommands: [
          ['ceph osd unset noout', 'After the work: let Ceph mark failed OSDs out again (changes state)'],
          ['ceph osd out <osd-id>', 'Drain data off one OSD before replacing its disk (changes state)']
        ],
        tip: 'Set noout → work → unset noout',
        tags: ['ceph', 'noout', 'maintenance', 'osd', 'out'],
        src: SRC([[CEPH + 'rados/operations/health-checks/', 'Ceph: health checks (OSDMAP_FLAGS)'], [CEPH + 'rados/operations/control/', 'Ceph: control commands']])
      },
      {
        id: 'ceph-orch',
        desc: 'cephadm: every daemon, host and device the orchestrator manages',
        cmd: 'ceph orch ps',
        flags: [
          ['orch ps', 'Every daemon (mon, mgr, osd…) with its host and status'],
          ['orch host ls', 'Hosts and their status'],
          ['cephadm shell', 'A shell with the Ceph tools on a host that has no client installed']
        ],
        subcommands: [
          ['ceph orch host ls', 'Hosts in the cluster'],
          ['ceph orch device ls', 'Disks on each host, and whether they are available'],
          ['cephadm shell -- ceph -s', 'Run one ceph command through cephadm']
        ],
        tip: 'No ceph CLI on the host? cephadm shell',
        tags: ['ceph', 'cephadm', 'orch', 'daemons'],
        src: SRC([[CEPH + 'cephadm/operations/', 'Ceph: cephadm operations'], [CEPH + 'cephadm/host-management/', 'Ceph: cephadm host management'], [CEPH + 'cephadm/install/', 'Ceph: cephadm install']])
      },
      {
        id: 'ceph-crash',
        desc: 'Daemon crash reports',
        cmd: 'ceph crash ls-new',
        flags: [
          ['ls-new', 'Crashes nobody has archived yet (these raise RECENT_CRASH)'],
          ['info <id>', 'The full report: daemon, version, backtrace'],
          ['archive-all', 'Acknowledge them all; they stay in ceph crash ls (changes state)']
        ],
        subcommands: [
          ['ceph crash info <crashid>', 'One crash in detail'],
          ['ceph crash archive-all', 'Archive every new crash once it is in the ticket (changes state)']
        ],
        tip: 'Put the backtrace in the ticket before archiving',
        tags: ['ceph', 'crash', 'mgr'],
        src: SRC([[CEPH + 'mgr/crash/', 'Ceph: crash module']])
      }
    ],
    proTip: {
      desc: 'Replacing a disk under a Ceph OSD',
      cmd: 'ceph device ls-by-host <host>',
      details: 'Find the OSD and the serial of its disk, check ceph -s and ceph health detail, get approval, set noout for a short swap (or take the OSD out to drain it first), replace the disk, let Ceph backfill, and unset noout. Watch PGs go back to active+clean.',
      flags: [['Short swap', 'noout'], ['Long or failed disk', 'ceph osd out <id> and let it drain']],
      tip: 'Serial first, then the drive',
      src: SRC([[CEPH + 'rados/operations/devices/', 'Ceph: device management'], [CEPH + 'rados/operations/control/', 'Ceph: control commands']])
    }
  }
];

buildSuite({
  name: 'Parallel filesystems', menuId: 'pfs-nav-dropdown', hubFile: 'pfs',
  hubLabel: 'Parallel Filesystems Hub', hubTitle: 'Parallel Filesystems Hub (Lustre, WEKA, BeeGFS, Ceph)',
  hubDocTitle: 'Parallel Filesystems: Lustre, WEKA, BeeGFS & Ceph Hub',
  hubPill: 'Lustre · WEKA · BeeGFS · Ceph',
  hubSubtitle: 'Server and target health, space, the device behind a failure, and the few commands that change state',
  prompt: 'FS', cursor: '$', varPrefix: 'PFS', tags: ['storage', 'filesystem', 'pfs'],
  menuIcon: '<svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6M4.5 11.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6"/></svg>',
  logos: LOGOS, sections: PFS_SECTIONS,
  groups: [{ key: 'pfs', heading: 'Parallel filesystems' }]
});
