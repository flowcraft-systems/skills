---
name: fc-case-file-conventions
description: >
  Standard conventions for organizing investigation artifacts in the .flowcraft/case-files/
  directory. Covers directory naming, required sections for reports, output file
  naming, and cross-referencing between agent artifacts. Use when writing any
  investigation report, RCA, patch report, design packet, or code review that
  will be stored in .flowcraft/case-files/. Also useful for understanding the existing
  artifact structure.
---

# Case File Conventions

Standard structure for organizing software investigation and engineering artifacts.

## When to Use

- Writing an RCA report, patch report, design packet, or review
- Looking for existing artifacts for a Jira issue
- Understanding where an agent's output will be stored
- Creating a new case-file directory

## Directory Structure

```
.flowcraft/case-files/
├── rca/                           ← Root cause analysis reports
│   └── {date}--{jira}--{slug}/
│       ├── rca-report.md          ← Primary RCA report
│       ├── rca-review.md          ← Reviewer scored assessment
│       ├── customer-briefing-draft.md
│       ├── customer-briefing-review.md
│       └── customer-briefing-final.md
├── patches/                       ← Bug fix patch reports
│   └── {date}--{jira}--{slug}/
│       └── patch-report.md
├── software-design-and-arch/      ← Architecture/design packets
│   └── {jira}--{slug}/
│       ├── architect-review-packet.md
│       ├── appendix-evidence-ledger.md
│       ├── appendix-adrs.md
│       └── appendix-impact-analysis.md
├── code-reviews/                  ← Code review reports
│   └── {date}--{jira}--{slug}/
│       └── code-review-report.md
├── incidents/                     ← Incident RCA review audits
│   └── {date}/
│       └── rca-review.md
├── test-design/                   ← Test case design reports
│   └── {date}--{jira}--{slug}/
│       └── test-design-report.md
└── customer-briefings/            ← Standalone briefings (no RCA dir)
    └── {jira-id}/
        └── customer-briefing-final.md
```

## Naming Conventions

### Directory Name Format

```
{YYYY-MM-DD}--{JIRA-ID}--{slug}
```

- **date**: ISO 8601 date of creation (e.g., `2026-03-15`)
- **jira**: Jira issue ID, uppercase (e.g., `PROJ-XXXXX`, `PROJ-XXXXX`)
- **slug**: Kebab-case summary, 3-6 words (e.g., `overtime-midnight-split`)

**Examples:**
```
2026-03-15--PROJ-XXXXX--overtime-midnight-split
2026-03-20--PROJ-XXXXX--edi-claim-denial-rendering-provider
2026-03-25--PROJ-XXXXX--visit-scheduling-timezone-drift
```

### File Names

| Artifact | File Name |
|----------|-----------|
| RCA report | `rca-report.md` |
| RCA review | `rca-review.md` |
| Patch report | `patch-report.md` |
| Patch review | `patch-review.md` |
| Design packet | `architect-review-packet.md` |
| Code review | `code-review-report.md` |
| Customer briefing (draft) | `customer-briefing-draft.md` |
| Customer briefing (final) | `customer-briefing-final.md` |
| Briefing review | `customer-briefing-review.md` |
| Test design | `test-design-report.md` |
| Evaluation report | `eval-report.md` |

## Required Report Sections

Every primary artifact MUST include:

### ROI Summary (mandatory for analytics)

```markdown
## ROI Summary

| Phase | Manual | Automated |
|---|---|---|
| [Phase 1 name] | ~X hrs | ~Y min |
| [Phase 2 name] | ~X hrs | ~Y min |
| **Total** | **~X hrs** | **~Y min** |
```

The `**Total**` row is parsed by the analytics extractor. Omitting it means
the ROI data is silently null in the database.

### Jira Header

Every report should begin with:

```markdown
# [Report Type]: [Jira ID] — [Brief Title]

| Field | Value |
|-------|-------|
| Jira Issue | [JIRA-ID](link) |
| Date | YYYY-MM-DD |
| Confidence | X% |
```

## Cross-Referencing

When one artifact references another:

```markdown
See [RCA Report](../rca/2026-03-15--PROJ-XXXXX--overtime-midnight-split/rca-report.md)
```

Use relative paths from the case-file directory. This keeps references valid
regardless of where the workspace is cloned.

## Checking for Existing Artifacts

Before creating a new artifact, check if one already exists:

```bash
# Check for existing RCA for a Jira issue
ls -d .flowcraft/case-files/rca/*PROJ-XXXXX* 2>/dev/null

# Check for existing design packet
ls -d .flowcraft/case-files/software-design-and-arch/*PROJ-XXXXX* 2>/dev/null

# List all artifacts for a Jira issue
find .flowcraft/case-files/ -type d -name "*PROJ-XXXXX*"
```
