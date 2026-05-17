# Git & GitHub Command Reference

---

## Starting a Project

```bash
# Initialize a new git repo in the current folder
git init

# Create a new GitHub repo and push in one command (requires gh CLI)
gh repo create <repo-name> --public --source=. --remote=origin --push

# Clone an existing repo from GitHub to your machine
git clone <repo-url>
```

---

## Daily Workflow

```bash
# See what files have changed
git status

# See exactly what changed inside the files
git diff

# Stage a specific file for commit
git add <filename>

# Stage all changed files
git add .

# Commit staged files with a message
git commit -m "your message here"

# Push commits to GitHub
git push

# Pull latest changes from GitHub
git pull
```

---

## Branching

Branches let you work on a feature without touching the main code.

```bash
# See all branches (* = current branch)
git branch

# Create and switch to a new branch
git checkout -b <branch-name>

# Switch to an existing branch
git checkout <branch-name>

# Merge a branch into your current branch
git merge <branch-name>

# Delete a branch after merging
git branch -d <branch-name>

# Push a new branch to GitHub
git push -u origin <branch-name>
```

---

## Undoing Things

```bash
# Unstage a file (undo git add)
git restore --staged <filename>

# Discard changes to a file (revert to last commit) — PERMANENT
git restore <filename>

# Undo the last commit but keep the changes staged
git reset --soft HEAD~1

# Undo the last commit and unstage changes (files stay modified)
git reset HEAD~1

# See commit history
git log --oneline
```

---

## Remote (GitHub)

```bash
# See what remote repos are connected
git remote -v

# Add a remote (if you forgot --remote=origin during repo create)
git remote add origin <repo-url>

# Change the remote URL
git remote set-url origin <new-url>

# Push and set upstream tracking in one shot (first push of a branch)
git push -u origin <branch-name>
```

---

## Useful Inspection Commands

```bash
# See full commit history
git log

# See compact one-line history
git log --oneline

# See who changed what line in a file
git blame <filename>

# See details of a specific commit
git show <commit-hash>

# See all changes since last commit
git diff HEAD
```

---

## .gitignore Tips

Create a `.gitignore` file in your project root to exclude files from git.

```
# Common things to always ignore
node_modules/
.env
.env.local
dist/
*.log
.DS_Store
```

> **Rule:** If you accidentally committed something you shouldn't have, remove it with:
> ```bash
> git rm --cached <filename>
> git commit -m "remove sensitive file"
> ```
> Then add it to `.gitignore` so it won't happen again.

---

## Good Commit Message Habits

```
feat: add user login endpoint
fix: correct password hashing bug
style: update button colors
refactor: simplify auth middleware
docs: update README setup steps
chore: install bcryptjs dependency
```

Short, lowercase, present tense. Describe *what* it does, not *how*.
