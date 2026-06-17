---
name: fc-flowcraft-case-file
description: >
  Write a structured case-file markdown document after every meaningful AI
  engineering session so teams can track effort, decisions, and ROI over time.
  Trigger after: code review, bug investigation, RCA, architecture design, patch
  review, incident response, test design, customer briefing, problem analysis.
  Do NOT trigger for single-line completions or tasks under 15 minutes.
license: MIT
---

# Skill: Engineering Case File

After completing a meaningful engineering task, write a structured markdown file
under `case-files/` in the project root. These files create a durable record of
engineering effort, decisions, and time saved — useful for team retrospectives,
ROI tracking, and knowledge transfer.

## Directory Layout

Place the file under the directory that matches the task type:

```
case-files/
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

**Slug**: kebab-case summary of the issue, e.g. `overnight-shift-edi-denial`.

## Required Header Block

Every case file MUST start with this header block:

```markdown
**Agent:** {agent-slug}
**Complexity:** {HIGH | MEDIUM | LOW}
**Date:** {YYYY-MM-DD}
**Ticket:** {ticket-id or N/A}
```

## Agent Slugs

Use exactly one of these values for `**Agent:**`:

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

Use **HIGH**, **MEDIUM**, or **LOW** (always uppercase):

| Label | Use when... |
|-------|-------------|
| `HIGH` | Cross-service impact, competing hypotheses, production data risk, > 3 root causes |
| `MEDIUM` | Standard complexity — typical for most tasks |
| `LOW` | Isolated, well-defined problem with a clear and narrow scope |

## ROI Estimate Table (required)

Include this table near the end of every case file:

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

Write honest hours. Inflating estimates corrupts the signal for future comparisons.

## Reviewer Verdict (reviews only)

When the artifact is a review or audit, include a verdict line:

```markdown
**Verdict:** PASS
```

Valid values: `PASS`, `CONDITIONAL`, `FAIL`.

## Complete Example — Code Review

```markdown
**Agent:** fc-code-review-dronacharya
**Complexity:** MEDIUM
**Date:** 2026-04-08
**Ticket:** PROJ-1234

# Code Review: PROJ-1234 — Null Guard Missing in Payment Processor

## Summary

Reviewed the fix for the payment processor skipping tax calculation when
discount_rate is absent. The root problem was a missing null guard introduced
in the billing refactor (commit a3f2c1d). The fix correctly adds the guard
and covers the edge case with a unit test.

## Findings

### Issue 1 — Missing null guard (MEDIUM)
The new calculation skips the null check for `discount_rate`. Under certain
account configurations, `discount_rate` can be null for legacy records, which
causes the processor to return 0 silently.

**Fix:** Add a null guard before the discount calculation.

### Issue 2 — N+1 query risk (LOW)
The loop in `PaymentService.processBulk()` calls `getDiscount()` once per item.
For batches of 50+ items, this generates 50+ round trips.

**Recommendation:** Batch-fetch discounts before the loop.

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
