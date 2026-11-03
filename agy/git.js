const GIT_CHEAT_SHEET_DATA = [
  {
    "id": "git-setup",
    "badge": "setup",
    "title": "Setup & Configuration",
    "subtitle": "Identity, useful defaults, aliases, starting a repository & cloning",
    "commands": [
      {
        "id": "git-config-basics",
        "desc": "Set your identity and sensible defaults once per machine",
        "cmd": "git config --global user.name \"Your Name\"\ngit config --global user.email \"you@example.com\"\ngit config --global init.defaultBranch main\ngit config --global pull.rebase true\ngit config --global push.autoSetupRemote true\ngit config --global fetch.prune true",
        "flags": [
          [
            "--global",
            "Applies to your user (~/.gitconfig)"
          ],
          [
            "--local",
            "Applies to this repository only (.git/config). This is the default when writing"
          ],
          [
            "--system",
            "Applies to every user on the machine (/etc/gitconfig)"
          ],
          [
            "pull.rebase true",
            "git pull rebases your work instead of creating a merge commit"
          ],
          [
            "push.autoSetupRemote true",
            "The first git push on a new branch sets its upstream for you"
          ],
          [
            "fetch.prune true",
            "Fetching removes local copies of branches deleted on the remote"
          ]
        ],
        "subcommands": [
          [
            "git config --list --show-origin",
            "Show every setting and the file it came from"
          ],
          [
            "git config --global core.editor nvim",
            "Set the editor used for commit messages"
          ],
          [
            "git config --global --unset pull.rebase",
            "Remove a setting"
          ],
          [
            "git config --global --edit",
            "Open your global config in the editor"
          ]
        ],
        "tip": "Run git config user.email inside a repository to see which address your commits will use.",
        "tags": [
          "git",
          "config",
          "setup",
          "identity",
          "gitconfig",
          "defaults"
        ]
      },
      {
        "id": "git-aliases",
        "desc": "Short aliases for commands you type all day",
        "cmd": "git config --global alias.st \"status -sb\"\ngit config --global alias.co switch\ngit config --global alias.lg \"log --oneline --graph --decorate --all\"\ngit config --global alias.last \"log -1 --stat\"\ngit config --global alias.unstage \"restore --staged\"",
        "flags": [
          [
            "alias.NAME \"args\"",
            "Runs git args when you type git NAME"
          ],
          [
            "alias.NAME \"!cmd\"",
            "A leading ! runs a shell command instead of a git subcommand"
          ]
        ],
        "subcommands": [
          [
            "git config --get-regexp '^alias\\.'",
            "List your aliases"
          ],
          [
            "git config --global alias.root \"rev-parse --show-toplevel\"",
            "git root prints the top folder of the repository"
          ]
        ],
        "tip": "Aliases live in ~/.gitconfig, so copying that file brings them to a new machine.",
        "tags": [
          "git",
          "alias",
          "config",
          "shortcuts"
        ]
      },
      {
        "id": "git-init-clone",
        "desc": "Start a new repository or clone an existing one",
        "cmd": "# New repository\ngit init my-project\n\n# Clone over SSH or HTTPS\ngit clone git@github.com:org/repo.git\ngit clone https://github.com/org/repo.git my-folder",
        "flags": [
          [
            "--depth 1",
            "Shallow clone: fetch only the latest commit"
          ],
          [
            "--branch NAME",
            "Check out this branch or tag after cloning"
          ],
          [
            "--single-branch",
            "Fetch one branch instead of all of them"
          ],
          [
            "--filter=blob:none",
            "Partial clone: full history, with file contents fetched on demand"
          ],
          [
            "--recurse-submodules",
            "Also clone every submodule"
          ]
        ],
        "subcommands": [
          [
            "git clone --depth 1 --branch v1.2.0 https://github.com/org/repo.git",
            "Fetch one tagged release quickly"
          ],
          [
            "git clone --filter=blob:none https://github.com/org/repo.git",
            "Clone a large repository with history but less data"
          ],
          [
            "git fetch --unshallow",
            "Turn a shallow clone into a full one"
          ]
        ],
        "tip": "A shallow clone is ideal for pulling a tool onto a node. Use a full clone if you need log, blame or bisect.",
        "tags": [
          "git",
          "init",
          "clone",
          "shallow",
          "partial",
          "depth"
        ]
      },
      {
        "id": "git-ignore",
        "desc": "Keep logs, build output and secrets out of the repository",
        "cmd": "cat >> .gitignore <<'EOF'\n*.log\nbuild/\n.env\n!important.log\nEOF\ngit add .gitignore\ngit commit -m \"Ignore logs, build output and .env\"",
        "flags": [
          [
            "*.log",
            "Ignore matching files in every folder"
          ],
          [
            "build/",
            "Ignore a folder"
          ],
          [
            "/config.local",
            "A leading / matches only at the repository root"
          ],
          [
            "!important.log",
            "Exception: keep tracking this file"
          ]
        ],
        "subcommands": [
          [
            "git check-ignore -v build/out.bin",
            "Show which rule ignores a file"
          ],
          [
            "git rm --cached .env",
            "Stop tracking a file but keep it on disk"
          ],
          [
            "git rm -r --cached build/",
            "Stop tracking a whole folder"
          ],
          [
            "git status --ignored",
            "List ignored files too"
          ]
        ],
        "tip": ".gitignore only affects untracked files. If a file is already committed, remove it with git rm --cached first.",
        "tags": [
          "git",
          "gitignore",
          "ignore",
          "untrack",
          "secrets"
        ]
      }
    ]
  },
  {
    "id": "git-daily",
    "badge": "daily",
    "title": "Everyday Workflow",
    "subtitle": "Check status, stage changes, commit, compare & stash work",
    "commands": [
      {
        "id": "git-status-add-commit",
        "desc": "The basic loop: check what changed, stage it, commit it",
        "cmd": "git status -sb\ngit add path/to/file\ngit commit -m \"Fix BMC timeout in collection script\"\ngit push",
        "flags": [
          [
            "git add .",
            "Stage every change under the current folder"
          ],
          [
            "git add -A",
            "Stage every change in the repository, including deletions"
          ],
          [
            "git add -u",
            "Stage changes to tracked files only, leaving new files out"
          ],
          [
            "git add -p",
            "Choose individual hunks to stage"
          ],
          [
            "git commit -a",
            "Stage all tracked changes and commit in one step"
          ],
          [
            "git commit -v",
            "Show the diff in the editor while you write the message"
          ]
        ],
        "subcommands": [
          [
            "git commit --amend --no-edit",
            "Add staged changes to the last commit and keep its message"
          ],
          [
            "git commit --amend -m \"Better message\"",
            "Replace the last commit's message"
          ],
          [
            "git mv old.sh new.sh",
            "Rename a tracked file"
          ],
          [
            "git rm old.sh",
            "Delete a tracked file and stage the deletion"
          ],
          [
            "git ls-files",
            "List every tracked file"
          ]
        ],
        "tip": "Only amend commits you haven't pushed, because amending rewrites history other people may already have.",
        "tags": [
          "git",
          "status",
          "add",
          "commit",
          "amend",
          "stage",
          "push"
        ]
      },
      {
        "id": "git-diff",
        "desc": "Compare the working tree, staging area, commits and branches",
        "cmd": "git diff\ngit diff --staged\ngit diff HEAD~1 HEAD\ngit diff main...feature/fix",
        "flags": [
          [
            "git diff",
            "Unstaged changes"
          ],
          [
            "--staged",
            "What the next commit will contain"
          ],
          [
            "A..B or A B",
            "Direct comparison of two commits"
          ],
          [
            "A...B",
            "Changes on B since it split from A, which is what a pull request shows"
          ],
          [
            "--stat",
            "Summary of files and lines changed"
          ],
          [
            "--name-only",
            "Changed file names only"
          ],
          [
            "-w",
            "Ignore whitespace changes"
          ],
          [
            "--word-diff",
            "Highlight changed words instead of whole lines"
          ]
        ],
        "subcommands": [
          [
            "git diff --stat main...HEAD",
            "See how much your branch changes"
          ],
          [
            "git diff --name-only HEAD~3",
            "Files changed in the last 3 commits"
          ],
          [
            "git diff HEAD~1 -- path/to/file",
            "Limit the diff to one file"
          ],
          [
            "git show HEAD:path/to/file",
            "Print a file as it was in a commit"
          ]
        ],
        "tip": "Run git diff --staged before every commit to catch stray debug lines and secrets.",
        "tags": [
          "git",
          "diff",
          "compare",
          "staged",
          "changes"
        ]
      },
      {
        "id": "git-stash",
        "desc": "Set unfinished work aside and bring it back later",
        "cmd": "git stash push -u -m \"WIP timeout fix\"\ngit stash list\ngit stash pop",
        "flags": [
          [
            "-u",
            "Include untracked files"
          ],
          [
            "-m \"msg\"",
            "Label the stash so you can recognise it later"
          ],
          [
            "-p",
            "Choose which hunks to stash"
          ],
          [
            "pop",
            "Apply the newest stash and delete it"
          ],
          [
            "apply",
            "Apply a stash and keep it"
          ]
        ],
        "subcommands": [
          [
            "git stash show -p stash@{0}",
            "See what a stash contains"
          ],
          [
            "git stash apply stash@{1}",
            "Apply a specific stash"
          ],
          [
            "git stash branch fix-timeout stash@{0}",
            "Turn a stash into a new branch"
          ],
          [
            "git stash drop stash@{1}",
            "Delete one stash"
          ],
          [
            "git stash clear",
            "Delete every stash"
          ]
        ],
        "tip": "If git stash pop hits a conflict, the stash is kept. Fix the conflict, then git stash drop it.",
        "tags": [
          "git",
          "stash",
          "wip",
          "pop",
          "apply",
          "shelve"
        ]
      }
    ]
  },
  {
    "id": "git-branch",
    "badge": "branch",
    "title": "Branches, Merging & Rebasing",
    "subtitle": "Create and switch branches, merge, rebase, cherry-pick & resolve conflicts",
    "commands": [
      {
        "id": "git-branches",
        "desc": "Create, switch, rename and delete branches",
        "cmd": "git switch -c feature/nvme-check\ngit switch main\ngit switch -\ngit branch -vv",
        "flags": [
          [
            "-c NAME",
            "Create a branch and switch to it"
          ],
          [
            "git switch -",
            "Go back to the previous branch"
          ],
          [
            "-a",
            "List local and remote branches"
          ],
          [
            "-vv",
            "Show each branch's upstream and whether it's ahead or behind"
          ],
          [
            "-d NAME",
            "Delete a merged branch"
          ],
          [
            "-D NAME",
            "Force delete a branch, even if unmerged"
          ],
          [
            "-m OLD NEW",
            "Rename a branch"
          ]
        ],
        "subcommands": [
          [
            "git switch -c fix origin/fix",
            "Create a local branch from a remote branch"
          ],
          [
            "git switch --detach v1.2.0",
            "Look at a tag without being on a branch"
          ],
          [
            "git branch --merged main",
            "List branches already merged, which are safe to delete"
          ],
          [
            "git branch --sort=-committerdate",
            "List branches by most recent work"
          ],
          [
            "git push origin --delete feature/old",
            "Delete a branch on the remote"
          ]
        ],
        "tip": "git switch and git restore split up the old git checkout, so it's harder to overwrite files by mistake.",
        "tags": [
          "git",
          "branch",
          "switch",
          "checkout",
          "delete",
          "rename"
        ]
      },
      {
        "id": "git-merge",
        "desc": "Bring another branch into the current one",
        "cmd": "git switch main\ngit pull\ngit merge feature/nvme-check",
        "flags": [
          [
            "--ff-only",
            "Only merge if no merge commit is needed, otherwise stop"
          ],
          [
            "--no-ff",
            "Always create a merge commit, which keeps the branch visible in history"
          ],
          [
            "--squash",
            "Stage all the branch's changes as one commit for you to make"
          ],
          [
            "--abort",
            "Cancel a merge and go back to how things were"
          ],
          [
            "--continue",
            "Finish the merge after resolving conflicts"
          ]
        ],
        "subcommands": [
          [
            "git merge --squash feature/x && git commit -m \"Add feature x\"",
            "Merge a branch as a single commit"
          ],
          [
            "git merge --abort",
            "Back out of a conflicted merge"
          ],
          [
            "git log --merges --oneline",
            "List merge commits"
          ]
        ],
        "tip": "Commit or stash your work before merging. Merges are hard to back out of with uncommitted changes around.",
        "tags": [
          "git",
          "merge",
          "fast-forward",
          "squash",
          "no-ff"
        ]
      },
      {
        "id": "git-rebase",
        "desc": "Replay your commits on top of another branch and tidy them up",
        "cmd": "git switch feature/nvme-check\ngit fetch origin\ngit rebase origin/main\ngit push --force-with-lease",
        "flags": [
          [
            "-i HEAD~5",
            "Interactive: reorder, squash, edit or drop the last 5 commits"
          ],
          [
            "--continue",
            "Carry on after fixing a conflict and running git add"
          ],
          [
            "--skip",
            "Drop the commit that's currently conflicting"
          ],
          [
            "--abort",
            "Cancel and return the branch to where it started"
          ],
          [
            "--autosquash",
            "Move fixup! commits next to their targets automatically"
          ],
          [
            "--onto NEW OLD",
            "Move commits made after OLD onto NEW"
          ]
        ],
        "subcommands": [
          [
            "git rebase -i HEAD~5",
            "Clean up recent commits before opening a pull request"
          ],
          [
            "git commit --fixup=abc1234",
            "Mark a commit as a correction to abc1234"
          ],
          [
            "git rebase -i --autosquash origin/main",
            "Fold fixup commits into their targets"
          ],
          [
            "git rebase --onto main old-base feature/x",
            "Move a branch to a new base"
          ]
        ],
        "tip": "Don't rebase a branch other people work on. Rebasing rewrites commit IDs, and that breaks their copies.",
        "tags": [
          "git",
          "rebase",
          "interactive",
          "squash",
          "fixup",
          "history"
        ]
      },
      {
        "id": "git-cherry-pick",
        "desc": "Copy specific commits onto the current branch",
        "cmd": "git switch release/1.2\ngit cherry-pick abc1234",
        "flags": [
          [
            "-x",
            "Add \"cherry picked from\" with the original commit ID to the message"
          ],
          [
            "-n",
            "Apply the changes without committing"
          ],
          [
            "A^..B",
            "Pick a range of commits, including A"
          ],
          [
            "--abort",
            "Cancel and go back"
          ],
          [
            "--continue",
            "Carry on after fixing a conflict"
          ]
        ],
        "subcommands": [
          [
            "git cherry-pick -x abc1234",
            "Backport a fix and record where it came from"
          ],
          [
            "git cherry-pick abc1234^..def5678",
            "Pick a run of commits in order"
          ]
        ],
        "tip": "Use -x when backporting to a release branch, so people can trace the fix to its original commit.",
        "tags": [
          "git",
          "cherry-pick",
          "backport",
          "hotfix"
        ]
      },
      {
        "id": "git-conflicts",
        "desc": "Resolve merge and rebase conflicts",
        "cmd": "git status\n# Edit each conflicted file and remove the <<<<<<< ======= >>>>>>> markers\ngit add path/to/file\ngit merge --continue",
        "flags": [
          [
            "<<<<<<< HEAD",
            "Start of the version on your current branch"
          ],
          [
            "=======",
            "Divider between the two versions"
          ],
          [
            ">>>>>>> other",
            "End of the incoming version"
          ],
          [
            "--ours",
            "During a merge, your branch. During a rebase, the branch you're rebasing onto"
          ],
          [
            "--theirs",
            "During a merge, the incoming branch. During a rebase, your commit"
          ]
        ],
        "subcommands": [
          [
            "git diff --name-only --diff-filter=U",
            "List files that still have conflicts"
          ],
          [
            "git checkout --ours path/to/file",
            "Take one side of a conflicted file"
          ],
          [
            "git checkout --theirs path/to/file",
            "Take the other side of a conflicted file"
          ],
          [
            "git config --global merge.conflictStyle zdiff3",
            "Also show the original text inside conflict markers"
          ],
          [
            "git config --global rerere.enabled true",
            "Remember how you resolved a conflict and reuse it"
          ]
        ],
        "tip": "--ours and --theirs swap meaning during a rebase, so check the file after you pick a side.",
        "tags": [
          "git",
          "conflict",
          "merge",
          "rebase",
          "resolve",
          "ours",
          "theirs"
        ]
      }
    ]
  },
  {
    "id": "git-remote",
    "badge": "remote",
    "title": "Remotes, Fetch, Pull & Push",
    "subtitle": "Manage remotes, sync with them, safe force pushes & tags",
    "commands": [
      {
        "id": "git-remotes",
        "desc": "See and change the remotes this repository talks to",
        "cmd": "git remote -v\ngit remote add upstream https://github.com/org/repo.git\ngit remote set-url origin git@github.com:org/repo.git",
        "flags": [
          [
            "-v",
            "Show each remote's URLs"
          ],
          [
            "add NAME URL",
            "Add a remote"
          ],
          [
            "set-url NAME URL",
            "Change a remote's address, for example from HTTPS to SSH"
          ],
          [
            "rename OLD NEW",
            "Rename a remote"
          ],
          [
            "remove NAME",
            "Remove a remote"
          ],
          [
            "show NAME",
            "Show branches and tracking details for a remote"
          ]
        ],
        "subcommands": [
          [
            "git remote show origin",
            "Check the default branch and what tracks what"
          ],
          [
            "git remote prune origin",
            "Remove local references to deleted remote branches"
          ],
          [
            "git ls-remote origin",
            "List remote branches and tags without fetching"
          ]
        ],
        "tip": "git ls-remote is a quick way to test that you can reach a remote and that your credentials work.",
        "tags": [
          "git",
          "remote",
          "origin",
          "upstream",
          "url"
        ]
      },
      {
        "id": "git-fetch-pull-push",
        "desc": "Download changes, update your branch and publish your commits",
        "cmd": "git fetch --all --prune\ngit status -sb\ngit pull --rebase\ngit push -u origin HEAD",
        "flags": [
          [
            "git fetch",
            "Download changes without touching your files"
          ],
          [
            "git pull",
            "Fetch, then update the current branch"
          ],
          [
            "--rebase",
            "Put your local commits on top of what you pulled"
          ],
          [
            "--ff-only",
            "Pull only if no merge or rebase is needed"
          ],
          [
            "-u origin HEAD",
            "Push the current branch and set it as the upstream"
          ],
          [
            "--force-with-lease",
            "Force push, but stop if someone else has pushed in the meantime"
          ]
        ],
        "subcommands": [
          [
            "git log HEAD..@{u} --oneline",
            "Commits on the remote that you don't have yet"
          ],
          [
            "git log @{u}..HEAD --oneline",
            "Local commits you haven't pushed"
          ],
          [
            "git pull --ff-only",
            "Update a deployed copy, stopping if it has diverged"
          ],
          [
            "git push --force-with-lease",
            "Publish a rebased branch safely"
          ]
        ],
        "tip": "Use --force-with-lease rather than --force, because plain --force can erase a teammate's commits.",
        "tags": [
          "git",
          "fetch",
          "pull",
          "push",
          "upstream",
          "force-with-lease",
          "sync"
        ]
      },
      {
        "id": "git-tags",
        "desc": "Mark releases and compare what's between them",
        "cmd": "git tag -a v1.2.0 -m \"Release 1.2.0\"\ngit push origin v1.2.0\ngit tag -l 'v1.*'",
        "flags": [
          [
            "-a",
            "Annotated tag, which stores the author, date and message"
          ],
          [
            "-m \"msg\"",
            "Tag message"
          ],
          [
            "-l 'pattern'",
            "List matching tags"
          ],
          [
            "-d NAME",
            "Delete a local tag"
          ],
          [
            "--sort=-v:refname",
            "Sort by version, newest first"
          ]
        ],
        "subcommands": [
          [
            "git tag -a v1.1.9 abc1234 -m \"Tag an older commit\"",
            "Tag a past commit"
          ],
          [
            "git push origin --tags",
            "Push every local tag"
          ],
          [
            "git push origin --delete v1.2.0",
            "Delete a tag on the remote"
          ],
          [
            "git log v1.1.0..v1.2.0 --oneline",
            "List commits between two releases"
          ],
          [
            "git describe --tags --always --dirty",
            "Name the current commit relative to the nearest tag"
          ]
        ],
        "tip": "git push doesn't send tags by default, so push them by name.",
        "tags": [
          "git",
          "tag",
          "release",
          "version",
          "describe"
        ]
      }
    ]
  },
  {
    "id": "git-history",
    "badge": "history",
    "title": "History & Searching",
    "subtitle": "Read the log, find who changed what, search code & track down bad commits",
    "commands": [
      {
        "id": "git-log",
        "desc": "Read the commit history",
        "cmd": "git log --oneline --graph --decorate --all -20",
        "flags": [
          [
            "--oneline",
            "One line per commit"
          ],
          [
            "--graph",
            "Draw branches and merges"
          ],
          [
            "-n / -20",
            "Limit the number of commits"
          ],
          [
            "--stat",
            "Show files changed in each commit"
          ],
          [
            "-p",
            "Show the full diff of each commit"
          ],
          [
            "--author=\"name\"",
            "Commits by one author"
          ],
          [
            "--since=\"2 weeks ago\"",
            "Commits after a date (--until for before)"
          ],
          [
            "--grep=\"text\"",
            "Search commit messages"
          ],
          [
            "--follow -- file",
            "Follow one file's history across renames"
          ]
        ],
        "subcommands": [
          [
            "git log --pretty=format:'%h %ad %an %s' --date=short",
            "Compact custom format"
          ],
          [
            "git log main..feature/x --oneline",
            "Commits on the branch that aren't on main"
          ],
          [
            "git log --follow -p -- path/to/file",
            "Every change made to one file"
          ],
          [
            "git shortlog -sne",
            "Commit counts per author"
          ],
          [
            "git show abc1234 --stat",
            "Show one commit and its files"
          ]
        ],
        "tip": "Commits can be named with HEAD~2 (two back), HEAD^ (parent), a tag, a branch, or a short ID.",
        "tags": [
          "git",
          "log",
          "history",
          "graph",
          "shortlog",
          "show"
        ]
      },
      {
        "id": "git-blame-search",
        "desc": "Find who changed a line and when a string appeared",
        "cmd": "git blame -L 40,60 path/to/file\ngit log -S'bmc_timeout' --oneline\ngit grep -n 'bmc_timeout'",
        "flags": [
          [
            "-L 40,60",
            "Blame only these lines"
          ],
          [
            "-w",
            "Ignore whitespace-only changes when blaming"
          ],
          [
            "-C",
            "Follow lines moved or copied from other files"
          ],
          [
            "-S'text'",
            "Commits where the number of times text appears changed"
          ],
          [
            "-G'regex'",
            "Commits whose diff has a line matching the regex"
          ],
          [
            "git grep -n",
            "Search tracked files, showing line numbers"
          ]
        ],
        "subcommands": [
          [
            "git blame -w -C path/to/file",
            "Skip formatting changes to find the real author"
          ],
          [
            "git log -L 40,60:path/to/file",
            "History of a range of lines"
          ],
          [
            "git grep -n 'pattern' v1.2.0",
            "Search the code as it was at a tag"
          ],
          [
            "git log --all --oneline -- deleted/file.sh",
            "Find commits that touched a file that's now gone"
          ]
        ],
        "tip": "git log -S finds when something was added or removed, even if the line no longer exists.",
        "tags": [
          "git",
          "blame",
          "grep",
          "pickaxe",
          "search",
          "annotate"
        ]
      },
      {
        "id": "git-bisect",
        "desc": "Binary search through history to find the commit that broke something",
        "cmd": "git bisect start\ngit bisect bad HEAD\ngit bisect good v1.1.0\n# Test this commit, then mark it, and repeat until git names the culprit\ngit bisect good\ngit bisect reset",
        "flags": [
          [
            "start",
            "Begin a bisect session"
          ],
          [
            "bad [commit]",
            "Mark a commit as broken"
          ],
          [
            "good [commit]",
            "Mark a commit as working"
          ],
          [
            "skip",
            "Skip a commit you can't test"
          ],
          [
            "run ./test.sh",
            "Automate it: exit 0 is good, exit 1 to 127 is bad, 125 is skip"
          ],
          [
            "reset",
            "End the session and return to where you started"
          ]
        ],
        "subcommands": [
          [
            "git bisect run ./test.sh",
            "Let a script find the bad commit"
          ],
          [
            "git bisect log",
            "Show the steps so far"
          ]
        ],
        "tip": "Bisect tests about 10 commits to search 1,000, so it's well worth a small test script.",
        "tags": [
          "git",
          "bisect",
          "regression",
          "binary-search",
          "debug"
        ]
      }
    ]
  },
  {
    "id": "git-undo",
    "badge": "undo",
    "title": "Undo & Recovery",
    "subtitle": "Discard changes, unstage, undo commits & recover lost work",
    "commands": [
      {
        "id": "git-restore",
        "desc": "Undo changes that haven't been committed",
        "cmd": "git restore --staged path/to/file\ngit restore path/to/file",
        "flags": [
          [
            "--staged",
            "Unstage a file and keep your edits"
          ],
          [
            "git restore file",
            "Discard unstaged edits. They can't be recovered"
          ],
          [
            "--source=COMMIT",
            "Restore a file as it was in a commit"
          ],
          [
            "-p",
            "Choose which hunks to discard"
          ]
        ],
        "subcommands": [
          [
            "git restore --source=HEAD~2 -- path/to/file",
            "Bring back an older version of a file"
          ],
          [
            "git restore .",
            "Discard all unstaged edits under the current folder"
          ],
          [
            "git clean -nd",
            "Preview which untracked files and folders would be deleted"
          ],
          [
            "git clean -fd",
            "Delete untracked files and folders"
          ],
          [
            "git clean -fdx",
            "Also delete ignored files, such as build output and .env"
          ]
        ],
        "tip": "Always run git clean -nd first. git clean deletes files that git has no copy of.",
        "tags": [
          "git",
          "restore",
          "unstage",
          "discard",
          "clean",
          "untracked"
        ]
      },
      {
        "id": "git-reset",
        "desc": "Move the branch back to an earlier commit",
        "cmd": "# Undo the last commit and keep its changes staged\ngit reset --soft HEAD~1",
        "flags": [
          [
            "--soft",
            "Undo commits. Changes stay staged"
          ],
          [
            "--mixed",
            "Undo commits and unstage. Changes stay in your files. This is the default"
          ],
          [
            "--hard",
            "Undo commits and delete the changes from your files"
          ],
          [
            "HEAD~1",
            "One commit back. Use HEAD~3 for three"
          ]
        ],
        "subcommands": [
          [
            "git reset HEAD~1",
            "Undo the last commit and keep the edits unstaged"
          ],
          [
            "git reset --hard origin/main",
            "Make your branch match the remote exactly, discarding local work"
          ],
          [
            "git reset --hard ORIG_HEAD",
            "Undo a merge, rebase or reset you just did"
          ]
        ],
        "tip": "Run git status and git stash first. git reset --hard deletes uncommitted work for good.",
        "tags": [
          "git",
          "reset",
          "soft",
          "mixed",
          "hard",
          "uncommit"
        ]
      },
      {
        "id": "git-revert",
        "desc": "Undo a commit that's already pushed by adding a new commit",
        "cmd": "git revert abc1234\ngit push",
        "flags": [
          [
            "--no-edit",
            "Use the default commit message"
          ],
          [
            "-n",
            "Apply the reversal without committing"
          ],
          [
            "-m 1",
            "Revert a merge commit, keeping its first parent"
          ],
          [
            "A..B",
            "Revert a range of commits, leaving A itself in place"
          ]
        ],
        "subcommands": [
          [
            "git revert --no-edit HEAD",
            "Back out the latest commit"
          ],
          [
            "git revert -m 1 abc1234",
            "Back out a merged branch"
          ],
          [
            "git revert --abort",
            "Cancel a conflicted revert"
          ]
        ],
        "tip": "On shared branches use git revert, not git reset, because revert keeps history intact for everyone else.",
        "tags": [
          "git",
          "revert",
          "undo",
          "rollback",
          "shared"
        ]
      },
      {
        "id": "git-reflog",
        "desc": "Recover commits after a bad reset, rebase or deleted branch",
        "cmd": "git reflog -20\ngit branch recovered HEAD@{2}\ngit switch recovered",
        "flags": [
          [
            "git reflog",
            "Every position HEAD has been in, even for commits no branch points to"
          ],
          [
            "HEAD@{2}",
            "Where HEAD was two moves ago"
          ],
          [
            "git reflog show BRANCH",
            "History of one branch"
          ],
          [
            "git fsck --lost-found",
            "Find commits no reference points to, such as a dropped stash"
          ]
        ],
        "subcommands": [
          [
            "git reset --hard HEAD@{1}",
            "Jump back to where you were before the last move"
          ],
          [
            "git fsck --lost-found",
            "Find dangling commits and blobs"
          ],
          [
            "git show abc1234",
            "Inspect a recovered commit before using it"
          ]
        ],
        "tip": "If it was committed, it can usually be recovered. Reflog entries last 90 days by default, or 30 for unreachable commits.",
        "tags": [
          "git",
          "reflog",
          "recover",
          "lost",
          "fsck",
          "rescue"
        ]
      }
    ]
  },
  {
    "id": "git-advanced",
    "badge": "advanced",
    "title": "Worktrees, Submodules & Hooks",
    "subtitle": "Parallel checkouts, nested repositories, automation, large files & signing",
    "commands": [
      {
        "id": "git-worktree",
        "desc": "Check out a second branch in another folder without cloning again",
        "cmd": "git worktree add ../repo-hotfix -b hotfix main\ngit worktree list\ngit worktree remove ../repo-hotfix",
        "flags": [
          [
            "add PATH BRANCH",
            "Check out an existing branch at PATH"
          ],
          [
            "add PATH -b NEW BASE",
            "Create a new branch from BASE at PATH"
          ],
          [
            "list",
            "Show every worktree"
          ],
          [
            "remove PATH",
            "Delete a worktree"
          ],
          [
            "prune",
            "Clean up records of worktrees whose folders are gone"
          ]
        ],
        "subcommands": [
          [
            "git worktree add ../repo-review origin/main",
            "Check out a remote branch in a separate folder, detached, to compare with"
          ],
          [
            "git worktree prune",
            "Tidy up after deleting a folder by hand"
          ]
        ],
        "tip": "A branch can only be checked out in one worktree at a time.",
        "tags": [
          "git",
          "worktree",
          "parallel",
          "checkout",
          "hotfix"
        ]
      },
      {
        "id": "git-submodule",
        "desc": "Work with repositories nested inside another repository",
        "cmd": "git submodule add https://github.com/org/lib.git vendor/lib\ngit submodule update --init --recursive\ngit submodule status",
        "flags": [
          [
            "add URL PATH",
            "Add a repository as a submodule"
          ],
          [
            "update --init --recursive",
            "Download the exact commits the parent expects"
          ],
          [
            "update --remote",
            "Move submodules to the latest commit on their branch"
          ],
          [
            "status",
            "Show the commit each submodule is on"
          ]
        ],
        "subcommands": [
          [
            "git clone --recurse-submodules https://github.com/org/repo.git",
            "Clone with submodules included"
          ],
          [
            "git submodule foreach 'git status -sb'",
            "Run a command in every submodule"
          ]
        ],
        "tip": "Empty submodule folders after a clone just mean you need git submodule update --init --recursive.",
        "tags": [
          "git",
          "submodule",
          "vendor",
          "nested",
          "recursive"
        ]
      },
      {
        "id": "git-hooks",
        "desc": "Run checks automatically on commit or push",
        "cmd": "mkdir -p .githooks\ncat > .githooks/pre-commit <<'EOF'\n#!/bin/sh\nif git diff --cached | grep -qE 'BEGIN (RSA|OPENSSH) PRIVATE KEY'; then\n  echo \"Private key in staged changes\" >&2\n  exit 1\nfi\nEOF\nchmod +x .githooks/pre-commit\ngit config core.hooksPath .githooks",
        "flags": [
          [
            "pre-commit",
            "Runs before a commit. A non-zero exit stops the commit"
          ],
          [
            "commit-msg",
            "Checks the commit message"
          ],
          [
            "pre-push",
            "Runs before a push"
          ],
          [
            "core.hooksPath",
            "Use a tracked folder of hooks rather than .git/hooks"
          ]
        ],
        "subcommands": [
          [
            "git commit --no-verify",
            "Skip the pre-commit and commit-msg hooks once"
          ],
          [
            "ls .git/hooks",
            "See the sample hooks git installs"
          ]
        ],
        "tip": "Files in .git/hooks aren't cloned, so keep shared hooks in a tracked folder and set core.hooksPath.",
        "tags": [
          "git",
          "hooks",
          "pre-commit",
          "automation",
          "secrets"
        ]
      },
      {
        "id": "git-lfs-signing",
        "desc": "Store large binaries with Git LFS and sign commits with an SSH key",
        "cmd": "# Large files (needs the git-lfs package)\ngit lfs install\ngit lfs track \"*.bin\"\ngit add .gitattributes\n\n# Sign commits with your SSH key\ngit config --global gpg.format ssh\ngit config --global user.signingkey ~/.ssh/id_ed25519.pub\ngit config --global commit.gpgsign true",
        "flags": [
          [
            "git lfs track",
            "Store matching files in LFS. The rule goes in .gitattributes"
          ],
          [
            "git lfs pull",
            "Download the real files for the current checkout"
          ],
          [
            "gpg.format ssh",
            "Sign with an SSH key instead of GPG"
          ],
          [
            "commit.gpgsign true",
            "Sign every commit"
          ]
        ],
        "subcommands": [
          [
            "git lfs ls-files",
            "List files stored in LFS"
          ],
          [
            "git log --show-signature -1",
            "Check the signature on the last commit"
          ]
        ],
        "tip": "If firmware files look like tiny text files after a clone, those are LFS pointers. Run git lfs pull.",
        "tags": [
          "git",
          "lfs",
          "large-files",
          "signing",
          "ssh",
          "gpg",
          "firmware"
        ]
      }
    ]
  },
  {
    "id": "git-ops",
    "badge": "ops",
    "title": "Datacenter & Ops Recipes",
    "subtitle": "Check deployed copies, move code to air-gapped hosts & fix common errors",
    "commands": [
      {
        "id": "git-check-deployed",
        "desc": "Check what version of a repository is deployed on a node, without changing it",
        "cmd": "git -C /opt/tools describe --tags --always --dirty\ngit -C /opt/tools rev-parse HEAD\ngit -C /opt/tools status --short\ngit -C /opt/tools log -1 --format='%h %ad %an %s' --date=iso",
        "flags": [
          [
            "-C PATH",
            "Run git as if started in PATH, so you don't need to cd"
          ],
          [
            "--dirty",
            "Adds -dirty to the name if there are local edits"
          ],
          [
            "--short",
            "One line per changed file. Empty output means a clean copy"
          ]
        ],
        "subcommands": [
          [
            "git rev-parse --show-toplevel",
            "Print the top folder of the repository"
          ],
          [
            "git rev-parse --abbrev-ref HEAD",
            "Print the current branch name"
          ],
          [
            "for h in node01 node02; do echo \"$h: $(ssh \"$h\" git -C /opt/tools rev-parse --short HEAD)\"; done",
            "Compare the deployed commit across nodes"
          ]
        ],
        "tip": "These commands only read the repository, so they're safe to run on a node that's running jobs.",
        "tags": [
          "git",
          "deployed",
          "version",
          "describe",
          "rev-parse",
          "fleet",
          "drift"
        ]
      },
      {
        "id": "git-air-gapped",
        "desc": "Move a repository to a host with no route to the Git server",
        "cmd": "# On the connected machine\ngit bundle create tools.bundle --all\nsha256sum tools.bundle\nscp tools.bundle jumpbox:/tmp/\n\n# On the isolated host\ngit bundle verify /tmp/tools.bundle\ngit clone /tmp/tools.bundle tools",
        "flags": [
          [
            "git bundle create FILE --all",
            "Pack every branch and tag into one file"
          ],
          [
            "git bundle verify FILE",
            "Check that a bundle is complete and valid"
          ],
          [
            "base..HEAD",
            "Bundle only recent commits instead of everything"
          ],
          [
            "git archive",
            "Export a plain snapshot with no history"
          ],
          [
            "git format-patch",
            "Write commits out as patch files"
          ]
        ],
        "subcommands": [
          [
            "git bundle create update.bundle main ^v1.2.0",
            "Bundle main's commits made since a tag"
          ],
          [
            "git fetch /tmp/update.bundle main:refs/remotes/bundle/main",
            "Fetch from a bundle on the isolated host"
          ],
          [
            "git archive --format=tar.gz --prefix=tools/ -o tools.tar.gz HEAD",
            "Export the files only"
          ],
          [
            "git format-patch -3 -o patches/",
            "Save the last 3 commits as patches"
          ],
          [
            "git apply --check patches/0001-fix.patch",
            "Test whether a patch applies, without changing anything"
          ],
          [
            "git am patches/*.patch",
            "Apply patches as commits"
          ]
        ],
        "tip": "A git bundle works like a remote, so history and tags survive the trip. Compare the sha256sum at both ends.",
        "tags": [
          "git",
          "bundle",
          "archive",
          "air-gapped",
          "offline",
          "patch",
          "format-patch"
        ]
      },
      {
        "id": "git-network-auth",
        "desc": "Work behind a proxy or internal CA, and debug connections",
        "cmd": "# Check that you can reach the remote and authenticate\ngit ls-remote origin HEAD\nssh -T git@github.com\n\n# Show what git is doing on the network\nGIT_TRACE=1 GIT_CURL_VERBOSE=1 git fetch\nGIT_SSH_COMMAND=\"ssh -v\" git fetch",
        "flags": [
          [
            "GIT_TRACE=1",
            "Print the commands git runs internally"
          ],
          [
            "GIT_CURL_VERBOSE=1",
            "Print HTTP request details"
          ],
          [
            "GIT_SSH_COMMAND",
            "Replace the ssh command git uses"
          ],
          [
            "http.proxy",
            "Send HTTPS traffic through a proxy"
          ],
          [
            "http.sslCAInfo",
            "Trust an internal certificate authority"
          ]
        ],
        "subcommands": [
          [
            "git config --global http.proxy http://proxy.example.com:3128",
            "Use a proxy"
          ],
          [
            "git config --global --unset http.proxy",
            "Stop using a proxy"
          ],
          [
            "git config --global http.sslCAInfo /etc/ssl/certs/internal-ca.pem",
            "Trust an internal CA"
          ],
          [
            "GIT_SSH_COMMAND=\"ssh -i ~/.ssh/deploy_key -o IdentitiesOnly=yes\" git pull",
            "Use a specific SSH key once"
          ],
          [
            "git config --global credential.helper 'cache --timeout=3600'",
            "Keep HTTPS credentials in memory for an hour"
          ]
        ],
        "tip": "GIT_CURL_VERBOSE output can include auth headers, so clean it before pasting it into a ticket.",
        "tags": [
          "git",
          "proxy",
          "ssl",
          "ca",
          "ssh",
          "trace",
          "debug",
          "credentials"
        ]
      },
      {
        "id": "git-common-errors",
        "desc": "Fix common error messages",
        "cmd": "# fatal: detected dubious ownership in repository\ngit config --global --add safe.directory /opt/tools",
        "flags": [
          [
            "dubious ownership",
            "The folder belongs to another user. Add it to safe.directory, or run git as the owner"
          ],
          [
            "non-fast-forward",
            "The remote has commits you don't. Run git pull --rebase, then push"
          ],
          [
            "detached HEAD",
            "You aren't on a branch. Save your work with git switch -c NAME"
          ],
          [
            "Permission denied (publickey)",
            "Your SSH key isn't loaded or authorised. Test with ssh -T git@github.com"
          ],
          [
            "SSL certificate problem",
            "Your host doesn't trust the server's CA. Set http.sslCAInfo"
          ],
          [
            "index.lock exists",
            "Another git process is running, or one crashed. Check before deleting the lock"
          ],
          [
            "refusing to merge unrelated histories",
            "The two repositories don't share a root commit"
          ]
        ],
        "subcommands": [
          [
            "pgrep -a git",
            "Check for a running git process before touching a lock file"
          ],
          [
            "rm .git/index.lock",
            "Remove a stale lock once no git process is running"
          ],
          [
            "git switch -c rescue-work",
            "Keep commits made on a detached HEAD"
          ],
          [
            "git fsck",
            "Check the repository for corruption"
          ],
          [
            "git count-objects -vH",
            "Show how much space the repository uses"
          ],
          [
            "git gc",
            "Compress and clean up the repository"
          ]
        ],
        "tip": "Don't set http.sslVerify false to get past certificate errors. Install the CA instead.",
        "tags": [
          "git",
          "errors",
          "safe.directory",
          "dubious-ownership",
          "detached-head",
          "index.lock",
          "troubleshooting"
        ]
      },
      {
        "id": "git-secret-removal",
        "desc": "Deal with a password or key that was committed",
        "cmd": "# 1. Rotate the credential first. It's exposed once pushed.\n# 2. Rewrite history (needs the git-filter-repo package) in a fresh clone\ngit clone --mirror git@github.com:org/repo.git\ncd repo.git\ngit filter-repo --path config/secrets.env --invert-paths\n# 3. git filter-repo removes origin, so add it back, then coordinate the force push\ngit remote add origin git@github.com:org/repo.git\ngit push --force --mirror origin",
        "flags": [
          [
            "--path FILE",
            "Select a file"
          ],
          [
            "--invert-paths",
            "Remove the selected paths from every commit"
          ],
          [
            "--replace-text FILE",
            "Replace strings listed in a file throughout history"
          ],
          [
            "--mirror",
            "Clone or push every branch and tag exactly"
          ]
        ],
        "subcommands": [
          [
            "git log --all --oneline -- config/secrets.env",
            "See which commits contain the file"
          ],
          [
            "git log --all -p -S'SEARCH_TEXT'",
            "Find a leaked string anywhere in history"
          ],
          [
            "git filter-repo --replace-text replacements.txt",
            "Scrub a string everywhere"
          ]
        ],
        "tip": "Rewriting history breaks everyone's clones and doesn't reach copies already made. Rotating the secret is the real fix.",
        "tags": [
          "git",
          "secrets",
          "filter-repo",
          "history",
          "rewrite",
          "credentials",
          "leak"
        ]
      }
    ]
  }
];

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("git_cs_bookmarks") || "[]"))
};

// DOM Elements
const sectionsContainer = document.getElementById("sections-container");
const categoryTabsEl = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const themeToggleBtn = document.getElementById("theme-toggle");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const printBtn = document.getElementById("print-btn");

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
  if (!toast) return;
  toastText.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.CheatSheetCommon && typeof window.CheatSheetCommon.copyCommand === "function") {
    window.CheatSheetCommon.copyCommand(text);
    return;
  }
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied snippet to clipboard");
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
  showToast("Copied snippet to clipboard");
}

// Shell & language syntax highlighter
function highlightCommand(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return `<span class="tok-str">${strLiteral}</span>`;
      if (flagPart) return `<span class="tok-flag">${flagPart}</span>`;
      if (operatorPart) return `<span class="tok-pipe">${operatorPart}</span>`;
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
  const totalCommands = GIT_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of GIT_CHEAT_SHEET_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by Git section">
        ${optionsHtml.join("")}
      </select>
      ${resetBtnHtml}
    </div>
  `;

  const sel = document.getElementById("category-select");
  if (sel) {
    sel.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderSections();
    });
  }

  const resetBtn = categoryTabsEl.querySelector(".cat-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmdObj, section, query) {
  if (!query) return true;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    cmdObj.desc,
    cmdObj.cmd,
    cmdObj.details || "",
    cmdObj.tip || "",
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

let masonryResizeTimer;
function scheduleMasonry() {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
}
window.addEventListener("resize", scheduleMasonry);
document.addEventListener("fullscreenchange", scheduleMasonry);

if (typeof ResizeObserver !== "undefined" && sectionsContainer) {
  let lastObservedWidth = 0;
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width);
      if (w > 0 && Math.abs(w - lastObservedWidth) > 10) {
        lastObservedWidth = w;
        scheduleMasonry();
      }
    }
  });
  ro.observe(sectionsContainer);
}

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of GIT_CHEAT_SHEET_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const filteredCommands = section.commands.filter((cmdObj) => {
      if (state.savedOnly && !state.bookmarks.has(cmdObj.id)) {
        return false;
      }
      return matchesSearch(cmdObj, section, state.searchQuery);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const itemsHtml = filteredCommands
      .map((item) => {
        const isSaved = state.bookmarks.has(item.id);
        const tipHtml = item.tip ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>` : "";
        const detailsHtml = item.details ? `<p class="cmd-details">${escapeHtml(item.details)}</p>` : "";

        const flagsHtml =
          item.flags && item.flags.length
            ? `<div class="flag-pills">
                ${item.flags
                  .map(
                    ([flag, exp]) =>
                      `<span class="flag-pill"><code>${escapeHtml(flag)}</code> <span>${escapeHtml(exp)}</span></span>`
                  )
                  .join("")}
              </div>`
            : "";

        const subcommandsHtml =
          item.subcommands && item.subcommands.length
            ? `<div class="subcmd-list">
                <span class="subcmd-header">Subcommands, Variations &amp; Snippets</span>
                ${item.subcommands
                  .map(
                    ([subcmd, exp]) =>
                      `<div class="subcmd-row" data-copy="${escapeHtml(subcmd)}" title="Click to copy snippet">
                        <code>${escapeHtml(subcmd)}</code>
                        <span>${escapeHtml(exp)}</span>
                      </div>`
                  )
                  .join("")}
              </div>`
            : "";

        return `
          <div class="cmd-item" id="${item.id}" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn ${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="${item.id}"
                  title="${isSaved ? "Remove bookmark" : "Bookmark snippet"}"
                  aria-label="Bookmark snippet"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(item.cmd)}" title="Click to copy snippet">
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
  visibleCountEl.textContent = visibleCommandsCount;
  savedCountEl.textContent = state.bookmarks.size;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
    sectionsContainer.classList.add("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
    sectionsContainer.classList.remove("hidden");
  }
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.CheatSheetCommon && window.CheatSheetCommon.applyTheme) {
    window.CheatSheetCommon.applyTheme(theme);
  } else if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
    window.AntigravityCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch(e) {}
  }
}

function applyDensity(compact) {
  state.compact = compact;
  document.body.classList.toggle("compact-density", compact);
  document.body.classList.toggle("compact-mode", compact);
  if (densityToggleBtn) {
    densityToggleBtn.classList.toggle("active", compact);
    densityToggleBtn.setAttribute("aria-pressed", compact ? "true" : "false");
  }
  if (densityLabel) densityLabel.textContent = compact ? "Relaxed" : "Compact";
  localStorage.setItem("linux_cs_compact", compact ? "1" : "0");
  packMasonry();
}

function initEvents() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
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
        bookmarkBtn.classList.remove("bookmarked");
        bookmarkBtn.textContent = "☆";
        bookmarkBtn.title = "Bookmark snippet";
        showToast("Removed from saved bookmarks");
      } else {
        state.bookmarks.add(id);
        bookmarkBtn.classList.add("bookmarked");
        bookmarkBtn.textContent = "★";
        bookmarkBtn.title = "Remove bookmark";
        showToast("Added to saved bookmarks");
      }
      localStorage.setItem("git_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      savedCountEl.textContent = state.bookmarks.size;
      if (state.savedOnly) {
        renderSections();
      }
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    savedFilterBtn.classList.toggle("active", state.savedOnly);
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
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
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
initEvents();
