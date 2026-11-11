// slurm.js
// Standalone interactive cheat sheet for Slurm: Slurm Hub (nodes and drain, jobs and accounting, GPUs and daemons)
const SLURM_HUB_DATA = [
  {
    "part": "slurm-nodes",
    "id": "slurm-nodes-cmd-1",
    "badge": "nodes",
    "title": "Nodes & drain: One node's state, the drain reason, who set it and when",
    "subtitle": "One node's state, the drain reason, who set it and when",
    "commands": [
      {
        "id": "slurm-sinfo-node",
        "desc": "One node's state, the drain reason, who set it and when",
        "cmd": "sinfo -N -n <node> -o \"%N %T %E %u %H\"",
        "details": "",
        "flags": [
          [
            "%T",
            "State, long form: IDLE, MIXED, ALLOCATED, DRAINING, DRAINED, DOWN, FAIL, MAINT…"
          ],
          [
            "%E / %u / %H",
            "The reason the node is unavailable, the user who set it, and when"
          ],
          [
            "-N -n <node>",
            "One line per node, only the nodes named (ranges like gpu[01-08] work)"
          ],
          [
            "DRAINING vs DRAINED",
            "DRAINING still runs jobs but takes no new ones; DRAINED is empty and safe for hardware work"
          ],
          [
            "DOWN",
            "Unavailable; Slurm sets it by itself when a node stops responding"
          ],
          [
            "Suffix *",
            "Not responding: no new work goes there"
          ],
          [
            "Suffixes ~ # ! %",
            "Powered off · powering up · pending power down · powering down"
          ],
          [
            "Suffixes @ ^ $",
            "Reboot pending · reboot issued · in a maintenance reservation"
          ]
        ],
        "tip": "DRAINED, not DRAINING, before you touch hardware",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "sinfo",
          "node",
          "state",
          "drain",
          "reason",
          "slurm"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-sinfo-node-sub-1",
        "desc": "Every down, drained or failing node with the reason (first 20 characters)",
        "cmd": "sinfo -R",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "sinfo",
          "node",
          "state"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-sinfo-node-sub-2",
        "desc": "Only drained/draining and down nodes, one per line",
        "cmd": "sinfo -N -t drain,down -o \"%N %T %E\"",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "sinfo",
          "node",
          "state"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-sinfo-node-sub-3",
        "desc": "Long, node-oriented view: CPUs, memory, state and reason per node and partition",
        "cmd": "sinfo -N -l",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "sinfo",
          "node",
          "state"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-nodes",
    "id": "slurm-nodes-cmd-2",
    "badge": "nodes",
    "title": "Nodes & drain: Everything slurmctld knows about one node",
    "subtitle": "Everything slurmctld knows about one node",
    "commands": [
      {
        "id": "slurm-show-node",
        "desc": "Everything slurmctld knows about one node",
        "cmd": "scontrol show node <node>",
        "details": "",
        "flags": [
          [
            "State=",
            "The base state plus flags, e.g. IDLE+DRAIN or MIXED+DRAIN"
          ],
          [
            "Reason=",
            "The drain or down reason, with the user and time"
          ],
          [
            "-d",
            "scontrol show node -d <node> adds GRES detail (which GPU indexes are in use)"
          ]
        ],
        "tip": "State shows DRAIN as a flag on the base state",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "scontrol",
          "node",
          "state",
          "reason",
          "gres"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
            }
          ]
        }
      },
      {
        "id": "slurm-show-node-sub-1",
        "desc": "Node details including per-GPU GRES usage",
        "cmd": "scontrol show node -d <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "scontrol",
          "node",
          "state"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-nodes",
    "id": "slurm-nodes-cmd-3",
    "badge": "nodes",
    "title": "Nodes & drain: Drain a node before hardware work",
    "subtitle": "Drain a node before hardware work (changes state: ask first)",
    "commands": [
      {
        "id": "slurm-drain",
        "desc": "Drain a node before hardware work (changes state: ask first)",
        "cmd": "scontrol update NodeName=<node> State=DRAIN Reason=\"<ticket>: <why>\"",
        "details": "",
        "flags": [
          [
            "State=DRAIN",
            "Running jobs finish; no new jobs start. The node shows DRAINING, then DRAINED"
          ],
          [
            "Reason=",
            "Put the ticket in it: sinfo -R shows it to everyone"
          ],
          [
            "Admin only",
            "Needs root, the SlurmUser or AdminLevel=Administrator"
          ]
        ],
        "tip": "Ticket number in the reason",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "scontrol",
          "drain",
          "maintenance",
          "rma",
          "node"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ],
          "note": "Reason is optional to Slurm; your site rules (and sinfo -R readers) need it."
        }
      },
      {
        "id": "slurm-drain-sub-1",
        "desc": "Jobs still running on the node: wait for them, or get the owners' OK",
        "cmd": "squeue -w <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "scontrol",
          "drain",
          "maintenance"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ],
          "note": "Reason is optional to Slurm; your site rules (and sinfo -R readers) need it."
        }
      },
      {
        "id": "slurm-drain-sub-2",
        "desc": "Confirm the node reached DRAINED before you start",
        "cmd": "sinfo -N -n <node> -o \"%N %T %E\"",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "scontrol",
          "drain",
          "maintenance"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ],
          "note": "Reason is optional to Slurm; your site rules (and sinfo -R readers) need it."
        }
      }
    ]
  },
  {
    "part": "slurm-nodes",
    "id": "slurm-nodes-cmd-4",
    "badge": "nodes",
    "title": "Nodes & drain: Return a node to service after the work",
    "subtitle": "Return a node to service after the work (changes state: ask first)",
    "commands": [
      {
        "id": "slurm-resume",
        "desc": "Return a node to service after the work (changes state: ask first)",
        "cmd": "scontrol update NodeName=<node> State=RESUME",
        "details": "",
        "flags": [
          [
            "State=RESUME",
            "Not a state: moves a DRAIN, DRAINING, DOWN or REBOOT node back to IDLE"
          ],
          [
            "State=UNDRAIN",
            "Clears the drain but keeps the base state: a DOWN node stays DOWN"
          ],
          [
            "Before resuming",
            "Check the hardware fix and the GPU count (slurmd -C on the node)"
          ]
        ],
        "tip": "Verify the fix before RESUME",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "scontrol",
          "resume",
          "undrain",
          "reboot",
          "node"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ],
          "note": "With ASAP and no nextstate, a rebooted node comes back UNDRAIN (still drained), not RESUME."
        }
      },
      {
        "id": "slurm-resume-sub-1",
        "desc": "Clear only the drain flag (changes state)",
        "cmd": "scontrol update NodeName=<node> State=UNDRAIN",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "scontrol",
          "resume",
          "undrain"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ],
          "note": "With ASAP and no nextstate, a rebooted node comes back UNDRAIN (still drained), not RESUME."
        }
      },
      {
        "id": "slurm-resume-sub-2",
        "desc": "Reboot the node through Slurm once its jobs end, then return it to service (changes state)",
        "cmd": "scontrol reboot ASAP nextstate=RESUME reason=\"<ticket>: <why>\" <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "scontrol",
          "resume",
          "undrain"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ],
          "note": "With ASAP and no nextstate, a rebooted node comes back UNDRAIN (still drained), not RESUME."
        }
      },
      {
        "id": "slurm-resume-sub-3",
        "desc": "Cancel a pending Slurm reboot (changes state)",
        "cmd": "scontrol cancel_reboot <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "recipe",
          "scontrol",
          "resume",
          "undrain"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ],
          "note": "With ASAP and no nextstate, a rebooted node comes back UNDRAIN (still drained), not RESUME."
        }
      }
    ]
  },
  {
    "part": "slurm-nodes",
    "id": "slurm-nodes-pro-tips",
    "badge": "tip",
    "title": "Nodes & drain: Pro Tip",
    "subtitle": "Hardware work on a Slurm node",
    "commands": [
      {
        "id": "slurm-nodes-tips-card",
        "desc": "Hardware work on a Slurm node",
        "cmd": "sinfo -N -n <node> -o \"%N %T %E %u %H\"",
        "details": "Check the state and who drained it, get approval, drain with the ticket in the reason, wait for DRAINED (squeue -w <node> empty), do the work, verify (GPU count, health checks), then RESUME. If Kubernetes also schedules on the node, cordon and drain it there too.",
        "flags": [
          [
            "Before",
            "State, reason, jobs on the node, approval"
          ],
          [
            "After",
            "slurmd -C matches slurm.conf, then RESUME"
          ]
        ],
        "tip": "Drain → DRAINED → work → verify → RESUME",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-nodes",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-jobs",
    "id": "slurm-jobs-cmd-1",
    "badge": "jobs",
    "title": "Jobs & accounting: Jobs on one node",
    "subtitle": "Jobs on one node: who, state, run time and node list",
    "commands": [
      {
        "id": "slurm-squeue-node",
        "desc": "Jobs on one node: who, state, run time and node list",
        "cmd": "squeue -w <node> -o \"%.10i %.9u %.8T %.10M %.10l %.6D %R\"",
        "details": "",
        "flags": [
          [
            "%i %u %T",
            "Job ID, user, state (long form)"
          ],
          [
            "%M / %l",
            "Time used / time limit"
          ],
          [
            "%R",
            "Pending: the reason in parentheses. Running: the node list. Failed: why"
          ],
          [
            "-u <user>",
            "One user's jobs"
          ],
          [
            "--start",
            "Expected start times of pending jobs (needs the backfill scheduler)"
          ]
        ],
        "tip": "Empty squeue -w = safe to work on the node",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "squeue",
          "jobs",
          "node",
          "running"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-squeue-node-sub-1",
        "desc": "Your own jobs",
        "cmd": "squeue -u $USER",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "squeue",
          "jobs",
          "node"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-squeue-node-sub-2",
        "desc": "When pending jobs are expected to start",
        "cmd": "squeue --start",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "squeue",
          "jobs",
          "node"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-jobs",
    "id": "slurm-jobs-cmd-2",
    "badge": "jobs",
    "title": "Jobs & accounting: Pending jobs and why they wait",
    "subtitle": "Pending jobs and why they wait",
    "commands": [
      {
        "id": "slurm-pending",
        "desc": "Pending jobs and why they wait",
        "cmd": "squeue -t PD -o \"%.10i %.9u %.10l %R\"",
        "details": "",
        "flags": [
          [
            "Resources",
            "What the job asked for is in use by other jobs"
          ],
          [
            "Priority",
            "Higher-priority jobs are ahead in the partition"
          ],
          [
            "ReqNodeNotAvail",
            "A node the job needs is unavailable; DOWN or DRAINED nodes are listed as UnavailableNodes"
          ],
          [
            "Dependency",
            "Waiting on another job"
          ],
          [
            "QOSMaxGRESPerUser",
            "The user hit the QOS limit on GPUs (or other GRES)"
          ]
        ],
        "tip": "ReqNodeNotAvail often means your drained node",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "squeue",
          "pending",
          "reason",
          "priority",
          "resources"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_reason_codes.html",
              "title": "Slurm: job reason codes"
            },
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-pending-sub-1",
        "desc": "Pending jobs held up by this node (it appears in their ReqNodeNotAvail reason)",
        "cmd": "squeue -t PD -o \"%.10i %.9u %R\" | grep <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "squeue",
          "pending",
          "reason"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_reason_codes.html",
              "title": "Slurm: job reason codes"
            },
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-pending-sub-2",
        "desc": "Full job record: reason, requested TRES and GRES, node list, times",
        "cmd": "scontrol show job <jobid>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "squeue",
          "pending",
          "reason"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_reason_codes.html",
              "title": "Slurm: job reason codes"
            },
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-jobs",
    "id": "slurm-jobs-cmd-3",
    "badge": "jobs",
    "title": "Jobs & accounting: How a job ended",
    "subtitle": "How a job ended: state, exit code, nodes and times",
    "commands": [
      {
        "id": "slurm-sacct-job",
        "desc": "How a job ended: state, exit code, nodes and times",
        "cmd": "sacct -j <jobid> --format=JobID,JobName,State,ExitCode,NodeList,Elapsed,Start,End",
        "details": "",
        "flags": [
          [
            "COMPLETED / FAILED",
            "Exit code zero on all nodes / non-zero exit or other failure"
          ],
          [
            "TIMEOUT / NODE_FAIL",
            "Hit its time limit / ended because a node failed"
          ],
          [
            "OUT_OF_MEMORY",
            "The job hit an out-of-memory error"
          ],
          [
            "ExitCode a:b",
            "Exit code, and the signal that ended it"
          ],
          [
            "-X",
            "The allocation only, not each step"
          ]
        ],
        "tip": "NODE_FAIL jobs point at the hardware",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "sacct",
          "accounting",
          "exit-code",
          "node_fail",
          "history"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sacct.html",
              "title": "sacct (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_state_codes.html",
              "title": "Slurm: job state codes"
            }
          ],
          "note": "sacct reads job accounting (AccountingStorageType); -a shows other users' jobs only for root or when PrivateData allows."
        }
      },
      {
        "id": "slurm-sacct-job-sub-1",
        "desc": "Every job that ran on a node in the last day: line it up with dmesg and the SEL",
        "cmd": "sacct -N <node> -S now-1days -X -a --format=JobID,User,State,ExitCode,Start,End",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "sacct",
          "accounting",
          "exit-code"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sacct.html",
              "title": "sacct (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_state_codes.html",
              "title": "Slurm: job state codes"
            }
          ],
          "note": "sacct reads job accounting (AccountingStorageType); -a shows other users' jobs only for root or when PrivateData allows."
        }
      },
      {
        "id": "slurm-sacct-job-sub-2",
        "desc": "Just the allocation's outcome",
        "cmd": "sacct -j <jobid> -X --format=JobID,State,ExitCode,NodeList",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "sacct",
          "accounting",
          "exit-code"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sacct.html",
              "title": "sacct (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_state_codes.html",
              "title": "Slurm: job state codes"
            }
          ],
          "note": "sacct reads job accounting (AccountingStorageType); -a shows other users' jobs only for root or when PrivateData allows."
        }
      }
    ]
  },
  {
    "part": "slurm-jobs",
    "id": "slurm-jobs-cmd-4",
    "badge": "jobs",
    "title": "Jobs & accounting: Cancel a job",
    "subtitle": "Cancel a job (changes state: ask the owner first)",
    "commands": [
      {
        "id": "slurm-scancel",
        "desc": "Cancel a job (changes state: ask the owner first)",
        "cmd": "scancel <jobid>",
        "details": "",
        "flags": [
          [
            "<jobid>",
            "The job and all of its steps"
          ],
          [
            "-u <user>",
            "Only that user's jobs"
          ],
          [
            "-w <nodes>",
            "Every job using those nodes: combine with -u to narrow it"
          ]
        ],
        "tip": "Drain and wait beats scancel",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "scancel",
          "cancel",
          "jobs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scancel.html",
              "title": "scancel (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-scancel-sub-1",
        "desc": "That user's jobs on that node only (changes state)",
        "cmd": "scancel -u <user> -w <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "scancel",
          "cancel",
          "jobs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scancel.html",
              "title": "scancel (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-jobs",
    "id": "slurm-jobs-pro-tips",
    "badge": "tip",
    "title": "Jobs & accounting: Pro Tip",
    "subtitle": "Was it the job or the node?",
    "commands": [
      {
        "id": "slurm-jobs-tips-card",
        "desc": "Was it the job or the node?",
        "cmd": "sacct -N <node> -S now-1days -X -a --format=JobID,User,State,ExitCode,Start,End",
        "details": "List what ran on the node around the failure. NODE_FAIL on several users' jobs points at the node; one job FAILED or OUT_OF_MEMORY while others on the node COMPLETED points at the job. Line the times up with dmesg -T and the BMC SEL.",
        "flags": [
          [
            "NODE_FAIL",
            "Hardware or the node, usually"
          ],
          [
            "Several users failing",
            "The node, not the code"
          ]
        ],
        "tip": "Many users failing on one node = the node",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sacct.html",
              "title": "sacct (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_state_codes.html",
              "title": "Slurm: job state codes"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-gpus",
    "id": "slurm-gpus-cmd-1",
    "badge": "gpus",
    "title": "GPUs & daemons: GPUs configured and in use, per node",
    "subtitle": "GPUs configured and in use, per node",
    "commands": [
      {
        "id": "slurm-gres-nodes",
        "desc": "GPUs configured and in use, per node",
        "cmd": "sinfo -N -O NodeList:20,Gres:30,GresUsed:0",
        "details": "",
        "flags": [
          [
            "Gres",
            "What slurm.conf says the node has, e.g. gpu:h200:8"
          ],
          [
            "GresUsed",
            "How many are allocated to jobs now"
          ],
          [
            "Fewer than configured",
            "slurmd finds fewer GPUs than slurm.conf: the node is drained automatically"
          ],
          [
            "AutoDetect=nvml",
            "gres.conf can read the GPUs from NVML; slurm.conf still needs the Gres= count"
          ]
        ],
        "tip": "A drained GPU node: count its GPUs first",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "gres",
          "gpu",
          "sinfo",
          "nvml"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
            },
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-gres-nodes-sub-1",
        "desc": "Per-GPU usage on one node",
        "cmd": "scontrol show node -d <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "recipe",
          "gres",
          "gpu",
          "sinfo"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
            },
            {
              "url": "https://slurm.schedmd.com/sinfo.html",
              "title": "sinfo (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-gpus",
    "id": "slurm-gpus-cmd-2",
    "badge": "gpus",
    "title": "GPUs & daemons: What this node really has, in slurm.conf format",
    "subtitle": "What this node really has, in slurm.conf format (run on the node)",
    "commands": [
      {
        "id": "slurm-slurmd-c",
        "desc": "What this node really has, in slurm.conf format (run on the node)",
        "cmd": "slurmd -C",
        "details": "",
        "flags": [
          [
            "-C",
            "The actual hardware configuration, not slurm.conf, then exit"
          ],
          [
            "Compare",
            "CPUs, RealMemory and Gres against the node's slurm.conf line: a missing DIMM or GPU shows here"
          ],
          [
            "slurmd -G",
            "Print the GRES setup from the current configuration"
          ]
        ],
        "tip": "Run after every DIMM or GPU swap",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "slurmd",
          "hardware",
          "gres",
          "memory",
          "config"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/slurmd.html",
              "title": "slurmd (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
            }
          ]
        }
      },
      {
        "id": "slurm-slurmd-c-sub-1",
        "desc": "Test and print the node's GRES setup",
        "cmd": "slurmd -G",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "recipe",
          "slurmd",
          "hardware",
          "gres"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/slurmd.html",
              "title": "slurmd (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-gpus",
    "id": "slurm-gpus-cmd-3",
    "badge": "gpus",
    "title": "GPUs & daemons: Run a one-GPU test job on a specific node",
    "subtitle": "Run a one-GPU test job on a specific node",
    "commands": [
      {
        "id": "slurm-gpu-test",
        "desc": "Run a one-GPU test job on a specific node",
        "cmd": "srun -N 1 -w <node> --gpus=1 nvidia-smi -L",
        "details": "",
        "flags": [
          [
            "-w <node>",
            "Only this node; it must be schedulable (not drained)"
          ],
          [
            "--gpus=1",
            "GPUs per job; --gres=gpu:1 asks per node instead"
          ],
          [
            "Typed GPUs",
            "Typed and untyped GPU requests must not be mixed in one job"
          ]
        ],
        "tip": "After RESUME, prove the GPUs work",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "srun",
          "gpu",
          "test",
          "gres"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/srun.html",
              "title": "srun (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
            }
          ]
        }
      },
      {
        "id": "slurm-gpu-test-sub-1",
        "desc": "Ask for all 8 GPUs on the node: one fails to appear = a GPU problem",
        "cmd": "srun -N 1 -w <node> --gres=gpu:8 nvidia-smi -L",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "recipe",
          "srun",
          "gpu",
          "test"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/srun.html",
              "title": "srun (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "slurm-gpus",
    "id": "slurm-gpus-cmd-4",
    "badge": "gpus",
    "title": "GPUs & daemons: Is Slurm itself healthy",
    "subtitle": "Is Slurm itself healthy: controller, node daemon, scheduler",
    "commands": [
      {
        "id": "slurm-daemons",
        "desc": "Is Slurm itself healthy: controller, node daemon, scheduler",
        "cmd": "scontrol ping",
        "details": "",
        "flags": [
          [
            "scontrol ping",
            "Whether the primary and backup slurmctld respond"
          ],
          [
            "slurmd",
            "The node daemon: systemctl status slurmd on the node"
          ],
          [
            "sdiag",
            "Scheduler statistics: threads, agents, job counts, backfill cycles"
          ]
        ],
        "tip": "Node DOWN*? Check slurmd first",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "slurmctld",
          "slurmd",
          "sdiag",
          "ping",
          "daemon"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/sdiag.html",
              "title": "sdiag (Slurm 26.05)"
            }
          ],
          "note": "systemctl and journalctl are systemd tools; the slurmd unit name depends on your packaging."
        }
      },
      {
        "id": "slurm-daemons-sub-1",
        "desc": "Is slurmd running on this node",
        "cmd": "systemctl status slurmd --no-pager",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "recipe",
          "slurmctld",
          "slurmd",
          "sdiag"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/sdiag.html",
              "title": "sdiag (Slurm 26.05)"
            }
          ],
          "note": "systemctl and journalctl are systemd tools; the slurmd unit name depends on your packaging."
        }
      },
      {
        "id": "slurm-daemons-sub-2",
        "desc": "slurmd log: GRES detection, registration, errors",
        "cmd": "journalctl -u slurmd --since '1 hour ago' --no-pager",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "recipe",
          "slurmctld",
          "slurmd",
          "sdiag"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/sdiag.html",
              "title": "sdiag (Slurm 26.05)"
            }
          ],
          "note": "systemctl and journalctl are systemd tools; the slurmd unit name depends on your packaging."
        }
      },
      {
        "id": "slurm-daemons-sub-3",
        "desc": "Scheduler and RPC statistics from slurmctld",
        "cmd": "sdiag",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "recipe",
          "slurmctld",
          "slurmd",
          "sdiag"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/sdiag.html",
              "title": "sdiag (Slurm 26.05)"
            }
          ],
          "note": "systemctl and journalctl are systemd tools; the slurmd unit name depends on your packaging."
        }
      }
    ]
  },
  {
    "part": "slurm-gpus",
    "id": "slurm-gpus-pro-tips",
    "badge": "tip",
    "title": "GPUs & daemons: Pro Tip",
    "subtitle": "GPU node drained by Slurm itself",
    "commands": [
      {
        "id": "slurm-gpus-tips-card",
        "desc": "GPU node drained by Slurm itself",
        "cmd": "scontrol show node <node>",
        "details": "If the reason mentions GRES or a count mismatch, slurmd found fewer GPUs than slurm.conf promises. On the node: nvidia-smi -L and dmesg -T | grep -i xid, then slurmd -C. Fix the GPU (see the NVIDIA DC sheets), restart slurmd, confirm the count, then RESUME.",
        "flags": [
          [
            "nvidia-smi -L",
            "GPUs the driver sees"
          ],
          [
            "slurmd -C",
            "GPUs Slurm sees"
          ]
        ],
        "tip": "Slurm drains a node that lost a GPU",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-gpus",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/gres.html",
              "title": "Slurm: generic resources (GRES)"
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
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("slurm.html", "slurm_bookmarks", SLURM_HUB_DATA, {"slurm-nodes":"slurm-nodes_bookmarks","slurm-gpus":"slurm-gpus_bookmarks","slurm-jobs":"slurm-jobs_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("slurm_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(SLURM_HUB_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: SLURM_HUB_DATA, label: "Slurm sheets", parts: {
   "slurm-gpus": {
    "title": "GPUs & daemons",
    "subtitle": "GPU counts per node, what the node really has, a GPU test job, and the daemons behind it all",
    "pill": "Slurm 26.05 · GRES · slurmd"
   },
   "slurm-jobs": {
    "title": "Jobs & accounting",
    "subtitle": "Jobs on a node, pending reasons, job details, accounting history and cancelling",
    "pill": "Slurm 26.05 · squeue · sacct"
   },
   "slurm-nodes": {
    "title": "Nodes & drain",
    "subtitle": "Read a node's state and reason, drain it before hardware work, and hand it back afterwards",
    "pill": "Slurm 26.05 · sinfo · scontrol"
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
  const allCards = SLURM_HUB_DATA;
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

  for (const card of SLURM_HUB_DATA) {
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
        localStorage.setItem("slurm_bookmarks", JSON.stringify([...state.bookmarks]));
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
