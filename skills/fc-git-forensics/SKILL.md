---
name: fc-git-forensics
description: >
  Git history analysis for software investigations. Analyze blame, authorship,
  change velocity, regression candidates, and commit patterns around a suspected
  defect or incident. Use when investigating bugs, reviewing incidents, understanding
  who changed what and when, or identifying high-churn files. Independently useful
  for any code archaeology task.
---

# Git Forensics

A standalone playbook for investigating code history using git.

## When to Use

- Investigating when and why a bug was introduced
- Identifying regression candidates from recent changes
- Understanding authorship and change patterns for a file or module
- Correlating code changes with incidents or production issues
- Reviewing change velocity before/during/after an incident window

## Command Reference

### 1. Blame Analysis — Who Last Touched the Bug Site

```bash
# Blame the specific file and line range
git blame -L <start>,<end> -- <file>

# Blame with commit dates and email
git blame -L <start>,<end> --date=short -- <file>

# Blame ignoring whitespace changes
git blame -w -L <start>,<end> -- <file>

# Blame showing the commit that INTRODUCED each line (not just last touch)
git log -p -S "<suspicious code snippet>" -- <file>
```

**Output template:**

| Line | Commit | Author | Date | Content |
|------|--------|--------|------|---------|
| 142 | `a1b2c3d` | dev@co | 2026-01-15 | `if (patientId != null)` |

### 2. Change History — What Changed and When

```bash
# Full history of a file (concise)
git log --oneline --follow -- <file>

# Changes in a time window (e.g., around incident)
git log --oneline --after="2026-03-01" --before="2026-03-15" -- <file>

# Show actual diffs for each commit
git log -p --follow -- <file>

# Changes by a specific author
git log --oneline --author="<name>" -- <file>

# Commits that touch a specific function/symbol
git log -p -S "<function_name>" -- <file>
git log -p -G "<regex_pattern>" -- <file>
```

### 3. Change Velocity — Is This Area Under Heavy Churn?

```bash
# Count commits to a file in the last N weeks
git log --oneline --since="4 weeks ago" -- <file> | wc -l

# Top 10 most-changed files in the last month
git log --since="4 weeks ago" --name-only --pretty=format: | \
  sort | uniq -c | sort -rn | head -10

# Commits per week for a file (trend analysis)
git log --format="%ai" -- <file> | \
  awk '{print $1}' | cut -d- -f1,2 | sort | uniq -c
```

**Interpretation:**
- **High churn (>10 commits/month)**: Area is actively evolving — higher regression risk
- **Recent spike**: May indicate a recent bug-fix cascade or feature push
- **Long silence then sudden change**: May indicate unfamiliarity with the code

### 4. Authorship Roster — Who Knows This Code?

```bash
# Authors who've touched this file, ranked by commit count
git shortlog -sn -- <file>

# Authors in the last 3 months (recent knowledge)
git shortlog -sn --since="3 months ago" -- <file>

# Authors for a specific directory
git shortlog -sn -- <directory>/
```

**Output template:**

| Author | Commits (all-time) | Commits (last 3mo) | Likely Expertise |
|--------|-------------------|--------------------|--------------------|
| Dev A | 47 | 12 | Primary maintainer |
| Dev B | 23 | 0 | Historical knowledge only |
| Dev C | 3 | 3 | Recent contributor, may lack deep context |

### 5. Regression Candidate Identification

```bash
# Commits that modified the suspicious file in the last N weeks
git log --oneline --since="4 weeks ago" -- <file>

# For each candidate commit, check its diff
git show <commit_hash> -- <file>

# Find commits that changed a specific line range
git log -L <start>,<end>:<file>

# Find merge commits (often carry integration bugs)
git log --merges --oneline --since="4 weeks ago" -- <file>

# Find commits with keywords suggesting fixes (which may have regressed)
git log --oneline --grep="fix\|hotfix\|patch\|workaround" --since="8 weeks ago" -- <file>
```

**Regression Candidate Scoring:**

| Factor | Score |
|--------|-------|
| Changed the exact buggy line | +3 |
| Changed the same function | +2 |
| Changed the same file | +1 |
| Within 2 weeks of bug report | +2 |
| Merge commit (integration risk) | +1 |
| Contains "fix" in message (fix-on-fix) | +1 |
| Author unfamiliar with file (<3 commits) | +1 |

Candidates scoring ≥ 5 warrant close inspection.

### 6. Incident Window Analysis

For production incidents, focus on the 48-hour window before the incident:

```bash
# All commits in the incident window
git log --oneline --all --after="<incident_date - 48h>" --before="<incident_date>"

# Deployable commits (merges to main/master)
git log --oneline --merges --first-parent main \
  --after="<incident_date - 48h>" --before="<incident_date>"

# Config/infrastructure changes
git log --oneline --after="<incident_date - 48h>" --before="<incident_date>" \
  -- "*.config" "*.json" "*.yaml" "*.yml" "*.env" "*appsettings*"
```

## Analysis Template

After running the commands above, compile findings into this template:

```markdown
## Git Forensics Report

### Subject
File(s): [list files investigated]
Investigation window: [date range]
Trigger: [bug report / incident / review]

### Blame Summary
- Bug site: [file:line]
- Introducing commit: [hash] by [author] on [date]
- Commit message: [message]
- Context: [what the commit was trying to do]

### Change Velocity
- Commits in last 4 weeks: [N]
- Trend: [stable / increasing / spike]
- Interpretation: [what this means for risk]

### Authorship
- Primary maintainer: [name] ([N] commits)
- Recent contributors: [names]
- Knowledge concentration risk: [low/medium/high]

### Regression Candidates
| Rank | Commit | Author | Date | Message | Score | Risk |
|------|--------|--------|------|---------|-------|------|
| 1 | abc123 | Dev A | 03-10 | "Fix null check" | 7 | High |
| 2 | def456 | Dev B | 03-08 | "Refactor validator" | 5 | Medium |

### Conclusions
- Most likely introducing commit: [hash]
- Confidence: [%]
- Recommended next step: [what to investigate next]
```

## Tips

- Always use `--follow` when tracing file history — files get renamed
- Use `-w` (ignore whitespace) in blame to see through formatting changes
- Cross-reference git timestamps with deployment logs for production issues
- `git log -S` (pickaxe) finds when a string was added/removed — powerful for tracing specific code
- Pipe through `| head -20` for large repos to avoid overwhelming output
