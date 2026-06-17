---
name: fc-flowcraft-case-file
description: >
  Write a structured case-file markdown document after every meaningful AI session
  so FlowCraft can ingest it into the engineering ROI analytics dashboard.
  WHEN: code review, bug investigation, RCA, architecture design, patch review,
  incident response, test design, customer briefing, problem analysis.
  Do NOT trigger for single-line completions or tasks under 15 minutes.
applyTo: ".flowcraft/case-files/**/*.md"
---

# Skill: FlowCraft Case File

After completing a meaningful engineering task, write a structured markdown file
under `.flowcraft/case-files/`. FlowCraft's observer reads these files and populates the
engineering analytics dashboard with ROI metrics.

## Directory Layout

Place the file under the directory that matches the task type:

```
.flowcraft/case-files/
  code-reviews/               {YYYY-MM-DD}--{ticket}--{slug}/code-review-report.md
  rca/                        {YYYY-MM-DD}--{ticket}--{slug}/rca-report.md
  patches/                    {YYYY-MM-DD}--{ticket}--{slug}/patch-review.md
  software-design-and-arch/   {YYYY-MM-DD}--{ticket}--{slug}/design-report.md
  incidents/                  {YYYY-MM-DD}--{ticket}--{slug}/incident-report.md
  test-design/                {YYYY-MM-DD}--{ticket}--{slug}/test-design-report.md
  customer-briefings/         {ticket-or-slug}/customer-briefing-final.md
  problem-analysis/           {YYYY-MM-DD}--{ticket}--{slug}/problem-analysis.md
  assessments/                {slug}-assessment.md
```

This directory is gitignored — case files are ephemeral telemetry, not deliverables.
Do not commit them to git and do not reference them in your response.

**Slug**: kebab-case summary of the issue, e.g. `overnight-shift-edi-denial`.

## Required Header Block

Every case file MUST start with this header block. FlowCraft parses these fields.

```markdown
**Agent:** {agent-slug}
**Complexity:** {HIGH | MEDIUM | LOW}
**Date:** {YYYY-MM-DD}
**Ticket:** {ticket-id or N/A}
```

## Agent Slugs

Use exactly one of these values for `**Agent:**`. The slug determines which
FlowCraft agent is credited and which ROI baseline is applied.

| Slug | Use for |
|------|---------|
| `fc-code-review-dronacharya` | Code reviews, PR reviews, patch reviews |
| `fc-bug-byomkesh` | Bug investigation, root cause analysis |
| `fc-bug-sushruta` | Patch writing, fix implementation |
| `fc-design-vishwakarma` | Architecture, system design, ADRs |
| `incident-rca-reviewer` | Production incidents, post-mortems |
| `fc-test-case-chanakya` | Test design, test writing, coverage reviews |
| `fc-customer-briefing-narada` | Customer briefings, stakeholder communications |
| `problem-analyst` | Problem analysis, discovery, requirements |

## Complexity Label

Use **HIGH**, **MEDIUM**, or **LOW** (always uppercase). This multiplies the ROI
baseline. Use these guidelines:

| Label | Use when... |
|-------|-------------|
| `HIGH` | Cross-service impact, competing hypotheses, production data risk, > 3 root causes |
| `MEDIUM` | Standard complexity — typical for most tasks |
| `LOW` | Isolated, well-defined problem with a clear and narrow scope |

## ROI Estimate Table (required)

Include this table near the end of every case file. FlowCraft parses the
`Total` row to extract manual hours and agent minutes.

```markdown
## ROI Estimate

| Metric | Manual | Agent |
|--------|--------|-------|
| Total  | ~{X} h | ~{Y} min |
```

Where:
- **`{X}`**: Estimated hours a senior engineer would spend on this task without AI. Be conservative.
- **`{Y}`**: Your actual wall-clock minutes for this session.

**Reference table (conservative estimates):**

| Task type | LOW | MEDIUM | HIGH |
|-----------|-----|--------|------|
| Code review | 0.5 h | 1.0 h | 2.0 h |
| Bug investigation / RCA | 1.0 h | 2.5 h | 5.0 h |
| Architecture / design | 2.0 h | 5.0 h | 10.0 h |
| Patch writing | 1.5 h | 3.0 h | 6.0 h |
| Incident response | 2.0 h | 4.0 h | 8.0 h |
| Test design | 0.5 h | 1.5 h | 3.0 h |
| Customer briefing | 0.5 h | 1.0 h | 2.0 h |
| Problem analysis | 1.0 h | 2.0 h | 4.0 h |

**Important:** Write honest hours. The dashboard's INR savings figure uses
calibrated FlowCraft baselines — your estimate is used for narrative accuracy,
not financial calculation. Inflating it corrupts the signal.

## Reviewer Verdict (reviews only)

When the artifact is a review or audit (code-review, patch, assessment), include
a verdict line. FlowCraft flags this as a reviewer artifact on the dashboard.

```markdown
**Verdict:** PASS
```

or

```markdown
**Verdict:** CONDITIONAL
```

or

```markdown
**Verdict:** FAIL
```

## Complete Example — Code Review

```markdown
**Agent:** fc-code-review-dronacharya
**Complexity:** MEDIUM
**Date:** 2026-04-08
**Ticket:** PROJ-XXXXX

# Code Review: PROJ-XXXXX — Authenticare Filter Not Posted

## Summary

Reviewed the fix for the authenticare filter missing from the posted-claims
view. The root problem was a missing JOIN condition introduced in the billing
refactor (commit a3f2c1d). The fix correctly adds the LEFT JOIN and adds a
guard for null filter_id values.

## Findings

### Issue 1 — Missing null guard (MEDIUM)
The new JOIN was added without checking for null `filter_id`. Under the
abbey-care agency configuration, `filter_id` can be null for legacy rows,
which would cause the query to return an empty set silently.

**Fix:** Add `AND billing_filters.filter_id IS NOT NULL` to the JOIN condition.

### Issue 2 — N+1 query risk (LOW)
The loop in `ClaimService.postBulk()` calls `getFilter()` once per claim.
For the common case of 50+ claims, this generates 50+ round trips.

**Recommendation:** Batch-fetch filters before the loop.

## ROI Estimate

| Metric | Manual | Agent |
|--------|--------|-------|
| Total  | ~1.0 h | ~18 min |

**Verdict:** CONDITIONAL
```

## What NOT to include

- No secrets, tokens, passwords, or environment variable values
- No full stack traces (summarise the relevant frames only)
- No PII or customer data
- No code blocks longer than 20 lines (link to the file instead)

## Response confirmation

After writing the case file, add one line to your response:

```
(FlowCraft case file written — {kind} · {complexity} · ~{X} hrs saved)
```
