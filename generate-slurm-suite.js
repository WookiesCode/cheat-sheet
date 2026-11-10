// generate-slurm-suite.js
// Generates the "Slurm" suite under the DevOps tab: node state, drain and resume; jobs and
// accounting; GPUs (GRES) and the daemons, plus the slurm.html hub. These are the scheduler
// checks the agent rules call for before any intrusive work: is the node drained, what still
// runs on it, and how to hand it back.
//
// Facts checked 2026-11-09 against SchedMD's documentation for Slurm 26.05 (sinfo, scontrol,
// squeue, sacct, scancel, srun, slurmd, sdiag, GRES, job reason and state codes). Every command
// carries its source line. Menu logos: generic line icons (Slurm has no mark in Simple Icons).
//
// Re-runnable like the other generators.
const { buildSuite } = require('./generate-suite-kit');

const icon = (d, color) => `<svg class="menu-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const LOGOS = {
  'slurm-nodes': icon('<rect x="3" y="3.5" width="18" height="7" rx="1.5"/><rect x="3" y="13.5" width="18" height="7" rx="1.5"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>', '#38bdf8'),
  'slurm-jobs': icon('<path d="M4 6h16M4 12h10M4 18h7"/><circle cx="18" cy="16" r="3"/><path d="M18 14.5V16l1 1"/>', '#a78bfa'),
  'slurm-gpus': icon('<rect x="2.5" y="6" width="19" height="11" rx="1.5"/><circle cx="9" cy="11.5" r="2.5"/><path d="M15 9.5h3M15 13.5h3M6 17v2.5M10 17v2.5"/>', '#76b900')
};

const DOC = 'https://slurm.schedmd.com/';
const R = (page, title) => ({ url: DOC + page, title });
const SRC = (refs, note) => ({ verified: '2026-11-09', refs, ...(note ? { note } : {}) });
const SINFO = R('sinfo.html', 'sinfo (Slurm 26.05)');
const SCONTROL = R('scontrol.html', 'scontrol (Slurm 26.05)');
const SQUEUE = R('squeue.html', 'squeue (Slurm 26.05)');
const SACCT = R('sacct.html', 'sacct (Slurm 26.05)');
const SCANCEL = R('scancel.html', 'scancel (Slurm 26.05)');
const GRES = R('gres.html', 'Slurm: generic resources (GRES)');
const REASONS = R('job_reason_codes.html', 'Slurm: job reason codes');
const STATES = R('job_state_codes.html', 'Slurm: job state codes');

const SLURM_SECTIONS = [
  {
    id: 'slurm-nodes', group: 'nodes', file: 'slurm-nodes', badge: 'nodes', code: 'sinfo',
    name: 'Nodes & drain', navDesc: 'state, drain, resume, reboot', pill: 'Slurm 26.05 · sinfo · scontrol',
    title: 'Slurm Nodes: State, Drain, Resume & Reboot',
    subtitle: 'Read a node\'s state and reason, drain it before hardware work, and hand it back afterwards',
    commands: [
      {
        id: 'slurm-sinfo-node',
        desc: 'One node\'s state, the drain reason, who set it and when',
        cmd: 'sinfo -N -n <node> -o "%N %T %E %u %H"',
        flags: [
          ['%T', 'State, long form: IDLE, MIXED, ALLOCATED, DRAINING, DRAINED, DOWN, FAIL, MAINT…'],
          ['%E / %u / %H', 'The reason the node is unavailable, the user who set it, and when'],
          ['-N -n <node>', 'One line per node, only the nodes named (ranges like gpu[01-08] work)'],
          ['DRAINING vs DRAINED', 'DRAINING still runs jobs but takes no new ones; DRAINED is empty and safe for hardware work'],
          ['DOWN', 'Unavailable; Slurm sets it by itself when a node stops responding'],
          ['Suffix *', 'Not responding: no new work goes there'],
          ['Suffixes ~ # ! %', 'Powered off · powering up · pending power down · powering down'],
          ['Suffixes @ ^ $', 'Reboot pending · reboot issued · in a maintenance reservation']
        ],
        subcommands: [
          ['sinfo -R', 'Every down, drained or failing node with the reason (first 20 characters)'],
          ['sinfo -N -t drain,down -o "%N %T %E"', 'Only drained/draining and down nodes, one per line'],
          ['sinfo -N -l', 'Long, node-oriented view: CPUs, memory, state and reason per node and partition']
        ],
        tip: 'DRAINED, not DRAINING, before you touch hardware',
        tags: ['sinfo', 'node', 'state', 'drain', 'reason', 'slurm'],
        src: SRC([SINFO])
      },
      {
        id: 'slurm-show-node',
        desc: 'Everything slurmctld knows about one node',
        cmd: 'scontrol show node <node>',
        flags: [
          ['State=', 'The base state plus flags, e.g. IDLE+DRAIN or MIXED+DRAIN'],
          ['Reason=', 'The drain or down reason, with the user and time'],
          ['-d', 'scontrol show node -d <node> adds GRES detail (which GPU indexes are in use)']
        ],
        subcommands: [
          ['scontrol show node -d <node>', 'Node details including per-GPU GRES usage']
        ],
        tip: 'State shows DRAIN as a flag on the base state',
        tags: ['scontrol', 'node', 'state', 'reason', 'gres'],
        src: SRC([SCONTROL, GRES])
      },
      {
        id: 'slurm-drain',
        desc: 'Drain a node before hardware work (changes state: ask first)',
        cmd: 'scontrol update NodeName=<node> State=DRAIN Reason="<ticket>: <why>"',
        flags: [
          ['State=DRAIN', 'Running jobs finish; no new jobs start. The node shows DRAINING, then DRAINED'],
          ['Reason=', 'Put the ticket in it: sinfo -R shows it to everyone'],
          ['Admin only', 'Needs root, the SlurmUser or AdminLevel=Administrator']
        ],
        subcommands: [
          ['squeue -w <node>', 'Jobs still running on the node: wait for them, or get the owners\' OK'],
          ['sinfo -N -n <node> -o "%N %T %E"', 'Confirm the node reached DRAINED before you start']
        ],
        tip: 'Ticket number in the reason',
        tags: ['scontrol', 'drain', 'maintenance', 'rma', 'node'],
        src: SRC([SCONTROL, SINFO], 'Reason is optional to Slurm; your site rules (and sinfo -R readers) need it.')
      },
      {
        id: 'slurm-resume',
        desc: 'Return a node to service after the work (changes state: ask first)',
        cmd: 'scontrol update NodeName=<node> State=RESUME',
        flags: [
          ['State=RESUME', 'Not a state: moves a DRAIN, DRAINING, DOWN or REBOOT node back to IDLE'],
          ['State=UNDRAIN', 'Clears the drain but keeps the base state: a DOWN node stays DOWN'],
          ['Before resuming', 'Check the hardware fix and the GPU count (slurmd -C on the node)']
        ],
        subcommands: [
          ['scontrol update NodeName=<node> State=UNDRAIN', 'Clear only the drain flag (changes state)'],
          ['scontrol reboot ASAP nextstate=RESUME reason="<ticket>: <why>" <node>', 'Reboot the node through Slurm once its jobs end, then return it to service (changes state)'],
          ['scontrol cancel_reboot <node>', 'Cancel a pending Slurm reboot (changes state)']
        ],
        tip: 'Verify the fix before RESUME',
        tags: ['scontrol', 'resume', 'undrain', 'reboot', 'node'],
        src: SRC([SCONTROL], 'With ASAP and no nextstate, a rebooted node comes back UNDRAIN (still drained), not RESUME.')
      }
    ],
    proTip: {
      desc: 'Hardware work on a Slurm node',
      cmd: 'sinfo -N -n <node> -o "%N %T %E %u %H"',
      details: 'Check the state and who drained it, get approval, drain with the ticket in the reason, wait for DRAINED (squeue -w <node> empty), do the work, verify (GPU count, health checks), then RESUME. If Kubernetes also schedules on the node, cordon and drain it there too.',
      flags: [['Before', 'State, reason, jobs on the node, approval'], ['After', 'slurmd -C matches slurm.conf, then RESUME']],
      tip: 'Drain → DRAINED → work → verify → RESUME',
      src: SRC([SINFO, SCONTROL, SQUEUE])
    }
  },
  {
    id: 'slurm-jobs', group: 'jobs', file: 'slurm-jobs', badge: 'jobs', code: 'squeue',
    name: 'Jobs & accounting', navDesc: 'squeue, reasons, sacct, scancel', pill: 'Slurm 26.05 · squeue · sacct',
    title: 'Slurm Jobs: What Runs Where, Why It Waits, How It Ended',
    subtitle: 'Jobs on a node, pending reasons, job details, accounting history and cancelling',
    commands: [
      {
        id: 'slurm-squeue-node',
        desc: 'Jobs on one node: who, state, run time and node list',
        cmd: 'squeue -w <node> -o "%.10i %.9u %.8T %.10M %.10l %.6D %R"',
        flags: [
          ['%i %u %T', 'Job ID, user, state (long form)'],
          ['%M / %l', 'Time used / time limit'],
          ['%R', 'Pending: the reason in parentheses. Running: the node list. Failed: why'],
          ['-u <user>', 'One user\'s jobs'],
          ['--start', 'Expected start times of pending jobs (needs the backfill scheduler)']
        ],
        subcommands: [
          ['squeue -u $USER', 'Your own jobs'],
          ['squeue --start', 'When pending jobs are expected to start']
        ],
        tip: 'Empty squeue -w = safe to work on the node',
        tags: ['squeue', 'jobs', 'node', 'running'],
        src: SRC([SQUEUE])
      },
      {
        id: 'slurm-pending',
        desc: 'Pending jobs and why they wait',
        cmd: 'squeue -t PD -o "%.10i %.9u %.10l %R"',
        flags: [
          ['Resources', 'What the job asked for is in use by other jobs'],
          ['Priority', 'Higher-priority jobs are ahead in the partition'],
          ['ReqNodeNotAvail', 'A node the job needs is unavailable; DOWN or DRAINED nodes are listed as UnavailableNodes'],
          ['Dependency', 'Waiting on another job'],
          ['QOSMaxGRESPerUser', 'The user hit the QOS limit on GPUs (or other GRES)']
        ],
        subcommands: [
          ['squeue -t PD -o "%.10i %.9u %R" | grep <node>', 'Pending jobs held up by this node (it appears in their ReqNodeNotAvail reason)'],
          ['scontrol show job <jobid>', 'Full job record: reason, requested TRES and GRES, node list, times']
        ],
        tip: 'ReqNodeNotAvail often means your drained node',
        tags: ['squeue', 'pending', 'reason', 'priority', 'resources'],
        src: SRC([SQUEUE, REASONS, SCONTROL])
      },
      {
        id: 'slurm-sacct-job',
        desc: 'How a job ended: state, exit code, nodes and times',
        cmd: 'sacct -j <jobid> --format=JobID,JobName,State,ExitCode,NodeList,Elapsed,Start,End',
        flags: [
          ['COMPLETED / FAILED', 'Exit code zero on all nodes / non-zero exit or other failure'],
          ['TIMEOUT / NODE_FAIL', 'Hit its time limit / ended because a node failed'],
          ['OUT_OF_MEMORY', 'The job hit an out-of-memory error'],
          ['ExitCode a:b', 'Exit code, and the signal that ended it'],
          ['-X', 'The allocation only, not each step']
        ],
        subcommands: [
          ['sacct -N <node> -S now-1days -X -a --format=JobID,User,State,ExitCode,Start,End', 'Every job that ran on a node in the last day: line it up with dmesg and the SEL'],
          ['sacct -j <jobid> -X --format=JobID,State,ExitCode,NodeList', 'Just the allocation\'s outcome']
        ],
        tip: 'NODE_FAIL jobs point at the hardware',
        tags: ['sacct', 'accounting', 'exit-code', 'node_fail', 'history'],
        src: SRC([SACCT, STATES], 'sacct reads job accounting (AccountingStorageType); -a shows other users\' jobs only for root or when PrivateData allows.')
      },
      {
        id: 'slurm-scancel',
        desc: 'Cancel a job (changes state: ask the owner first)',
        cmd: 'scancel <jobid>',
        flags: [
          ['<jobid>', 'The job and all of its steps'],
          ['-u <user>', 'Only that user\'s jobs'],
          ['-w <nodes>', 'Every job using those nodes: combine with -u to narrow it']
        ],
        subcommands: [
          ['scancel -u <user> -w <node>', 'That user\'s jobs on that node only (changes state)']
        ],
        tip: 'Drain and wait beats scancel',
        tags: ['scancel', 'cancel', 'jobs'],
        src: SRC([SCANCEL])
      }
    ],
    proTip: {
      desc: 'Was it the job or the node?',
      cmd: 'sacct -N <node> -S now-1days -X -a --format=JobID,User,State,ExitCode,Start,End',
      details: 'List what ran on the node around the failure. NODE_FAIL on several users\' jobs points at the node; one job FAILED or OUT_OF_MEMORY while others on the node COMPLETED points at the job. Line the times up with dmesg -T and the BMC SEL.',
      flags: [['NODE_FAIL', 'Hardware or the node, usually'], ['Several users failing', 'The node, not the code']],
      tip: 'Many users failing on one node = the node',
      src: SRC([SACCT, STATES])
    }
  },
  {
    id: 'slurm-gpus', group: 'nodes', file: 'slurm-gpus', badge: 'gpus', code: 'gres',
    name: 'GPUs & daemons', navDesc: 'GRES, slurmd -C, test job, slurmctld', pill: 'Slurm 26.05 · GRES · slurmd',
    title: 'Slurm GPUs (GRES) & Daemons',
    subtitle: 'GPU counts per node, what the node really has, a GPU test job, and the daemons behind it all',
    commands: [
      {
        id: 'slurm-gres-nodes',
        desc: 'GPUs configured and in use, per node',
        cmd: 'sinfo -N -O NodeList:20,Gres:30,GresUsed:0',
        flags: [
          ['Gres', 'What slurm.conf says the node has, e.g. gpu:h200:8'],
          ['GresUsed', 'How many are allocated to jobs now'],
          ['Fewer than configured', 'slurmd finds fewer GPUs than slurm.conf: the node is drained automatically'],
          ['AutoDetect=nvml', 'gres.conf can read the GPUs from NVML; slurm.conf still needs the Gres= count']
        ],
        subcommands: [
          ['scontrol show node -d <node>', 'Per-GPU usage on one node']
        ],
        tip: 'A drained GPU node: count its GPUs first',
        tags: ['gres', 'gpu', 'sinfo', 'nvml'],
        src: SRC([GRES, SINFO])
      },
      {
        id: 'slurm-slurmd-c',
        desc: 'What this node really has, in slurm.conf format (run on the node)',
        cmd: 'slurmd -C',
        flags: [
          ['-C', 'The actual hardware configuration, not slurm.conf, then exit'],
          ['Compare', 'CPUs, RealMemory and Gres against the node\'s slurm.conf line: a missing DIMM or GPU shows here'],
          ['slurmd -G', 'Print the GRES setup from the current configuration']
        ],
        subcommands: [
          ['slurmd -G', 'Test and print the node\'s GRES setup']
        ],
        tip: 'Run after every DIMM or GPU swap',
        tags: ['slurmd', 'hardware', 'gres', 'memory', 'config'],
        src: SRC([R('slurmd.html', 'slurmd (Slurm 26.05)'), GRES])
      },
      {
        id: 'slurm-gpu-test',
        desc: 'Run a one-GPU test job on a specific node',
        cmd: 'srun -N 1 -w <node> --gpus=1 nvidia-smi -L',
        flags: [
          ['-w <node>', 'Only this node; it must be schedulable (not drained)'],
          ['--gpus=1', 'GPUs per job; --gres=gpu:1 asks per node instead'],
          ['Typed GPUs', 'Typed and untyped GPU requests must not be mixed in one job']
        ],
        subcommands: [
          ['srun -N 1 -w <node> --gres=gpu:8 nvidia-smi -L', 'Ask for all 8 GPUs on the node: one fails to appear = a GPU problem']
        ],
        tip: 'After RESUME, prove the GPUs work',
        tags: ['srun', 'gpu', 'test', 'gres'],
        src: SRC([R('srun.html', 'srun (Slurm 26.05)'), GRES])
      },
      {
        id: 'slurm-daemons',
        desc: 'Is Slurm itself healthy: controller, node daemon, scheduler',
        cmd: 'scontrol ping',
        flags: [
          ['scontrol ping', 'Whether the primary and backup slurmctld respond'],
          ['slurmd', 'The node daemon: systemctl status slurmd on the node'],
          ['sdiag', 'Scheduler statistics: threads, agents, job counts, backfill cycles']
        ],
        subcommands: [
          ['systemctl status slurmd --no-pager', 'Is slurmd running on this node'],
          ['journalctl -u slurmd --since \'1 hour ago\' --no-pager', 'slurmd log: GRES detection, registration, errors'],
          ['sdiag', 'Scheduler and RPC statistics from slurmctld']
        ],
        tip: 'Node DOWN*? Check slurmd first',
        tags: ['slurmctld', 'slurmd', 'sdiag', 'ping', 'daemon'],
        src: SRC([SCONTROL, R('sdiag.html', 'sdiag (Slurm 26.05)')], 'systemctl and journalctl are systemd tools; the slurmd unit name depends on your packaging.')
      }
    ],
    proTip: {
      desc: 'GPU node drained by Slurm itself',
      cmd: 'scontrol show node <node>',
      details: 'If the reason mentions GRES or a count mismatch, slurmd found fewer GPUs than slurm.conf promises. On the node: nvidia-smi -L and dmesg -T | grep -i xid, then slurmd -C. Fix the GPU (see the NVIDIA DC sheets), restart slurmd, confirm the count, then RESUME.',
      flags: [['nvidia-smi -L', 'GPUs the driver sees'], ['slurmd -C', 'GPUs Slurm sees']],
      tip: 'Slurm drains a node that lost a GPU',
      src: SRC([GRES])
    }
  }
];

buildSuite({
  name: 'Slurm', menuId: 'slurm-nav-dropdown', hubFile: 'slurm',
  hubLabel: 'Slurm Hub', hubTitle: 'Slurm Hub (nodes and drain, jobs and accounting, GPUs and daemons)',
  hubDocTitle: 'Slurm: Node State, Drain & Resume, Jobs, Accounting, GPUs & Daemons Hub',
  hubPill: 'Nodes · Jobs · GPUs',
  hubSubtitle: 'The scheduler side of a hardware ticket: is the node drained, what ran on it, and how to hand it back',
  prompt: 'SL', cursor: '$', varPrefix: 'SLURM', tags: ['slurm', 'hpc', 'scheduler'],
  menuIcon: '<svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3.5" width="18" height="7" rx="1.5"/><rect x="3" y="13.5" width="18" height="7" rx="1.5"/><path d="M7 7h.01M7 17h.01" stroke="#38bdf8"/></svg>',
  logos: LOGOS, sections: SLURM_SECTIONS,
  groups: [{ key: 'nodes', heading: 'Nodes &amp; GPUs' }, { key: 'jobs', heading: 'Jobs' }]
});
