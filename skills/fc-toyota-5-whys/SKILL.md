---
name: fc-toyota-5-whys
description: >
  Toyota 5 Whys root cause analysis methodology. Given a suspected root cause or
  failure, drill down through 5 levels of "why" with evidence at each level.
  Distinguishes VERIFIED (evidence-backed) from HYPOTHESIS (needs validation) at
  each level. Use for bug investigations, incident post-mortems, process failures,
  or any situation requiring deep causal analysis. Independently useful for any
  root cause analysis.
---

# Toyota 5 Whys

A standalone playbook for causal chain analysis.

## When to Use

- You have a suspected root cause and want to find the DEEP cause
- Post-incident review — why did the outage really happen?
- Bug investigation — why does this defect exist?
- Process failure — why did this escape to production?
- Retrospective — why do we keep having this class of problem?

## The Method

Start with the observable problem. Ask "Why?" five times, each time
driving deeper toward the systemic root cause.

```
Problem:    [Observable symptom]
├── Why 1:  [Direct cause]
│   ├── Why 2:  [Cause of the direct cause]
│   │   ├── Why 3:  [Deeper systemic factor]
│   │   │   ├── Why 4:  [Organizational/process factor]
│   │   │   │   ├── Why 5:  [Root cause — systemic, addressable]
```

## Rules

### 1. Evidence at Every Level

Each "Why" must have supporting evidence. Label each level:

| Label | Meaning |
|-------|---------|
| **VERIFIED** | Supported by code, logs, data, or direct observation |
| **HYPOTHESIS** | Plausible explanation that needs validation |

**Example:**

```
Why 1: Overtime = $0 for overnight shifts
  [VERIFIED] PayrollCalc.cs:340 groups by StartDate.Date → splits overnight visits
  Evidence: git blame shows line added in commit abc123 on 2025-11-15

Why 2: Developer grouped by date instead of shift span
  [VERIFIED] Commit message: "optimize overtime calc for large agencies"
  Evidence: PR #142 review comments show no overnight test case

Why 3: No test covered overnight shifts
  [VERIFIED] OvertimeTests.cs has 12 tests, none span midnight
  Evidence: grep for "midnight\|overnight\|SpansMidnight" returns 0 hits

Why 4: Test requirements didn't include overnight scenarios
  [HYPOTHESIS] The original specification may not have called out overnight shifts
  Evidence needed: Check Jira ticket and Confluence spec for the original feature

Why 5: No boundary-value test discipline for time-based calculations
  [HYPOTHESIS] The team lacks a testing checklist for date/time edge cases
  Evidence needed: Review test guidelines and past PRs for similar gaps
```

### 2. Stop When You Reach a Systemic Cause

Don't stop at "developer made a mistake." That's a symptom, not a root cause.
Keep asking "Why?" until you reach something the ORGANIZATION can fix:

| Level | Bad stopping point | Better continuation |
|-------|-------------------|-------------------|
| Why 2 | "Developer forgot the edge case" | "Why wasn't there a test?" |
| Why 3 | "No test existed" | "Why wasn't it in the test plan?" |
| Why 4 | "Test plan didn't cover it" | "Why doesn't the process catch this?" |
| Why 5 | "No boundary-value checklist" | ← GOOD stopping point (systemic, fixable) |

### 3. Don't Branch Too Early

Follow the MOST LIKELY causal chain first. If Why 2 has multiple possible causes,
pick the one with the strongest evidence and follow that chain. You can explore
other branches afterward.

### 4. Exactly 5 Levels (Guideline, Not Law)

- Sometimes you reach the root cause in 3 Whys — that's fine if it's systemic
- Sometimes you need 6-7 — continue if level 5 isn't systemic yet
- If you can't get past level 2, you probably lack evidence — go gather more

## Template

```markdown
## 5 Whys Analysis

### Problem Statement
[One sentence: the observable symptom]

### Causal Chain

**Why 1**: [Direct cause]
- Status: VERIFIED / HYPOTHESIS
- Evidence: [specific citation]

**Why 2**: [Why did Why 1 happen?]
- Status: VERIFIED / HYPOTHESIS
- Evidence: [specific citation]

**Why 3**: [Why did Why 2 happen?]
- Status: VERIFIED / HYPOTHESIS
- Evidence: [specific citation]

**Why 4**: [Why did Why 3 happen?]
- Status: VERIFIED / HYPOTHESIS
- Evidence: [specific citation]

**Why 5**: [Why did Why 4 happen?]
- Status: VERIFIED / HYPOTHESIS
- Evidence: [specific citation]

### Root Cause
[The systemic issue identified at the deepest verified level]

### Corrective Action
[Fix the immediate problem — addresses Why 1-2]

### Preventive Action
[Fix the systemic issue — addresses Why 4-5]
```

## Common Traps

| Trap | How to Avoid |
|------|-------------|
| **Blaming people** ("Dev was careless") | Ask "Why was the system designed so that one person's mistake causes failure?" |
| **Stopping at the obvious** | If your root cause is the same as your first guess, you didn't dig deep enough |
| **Circular reasoning** ("Why? Because of the bug. Why? Because of the error.") | Each level must introduce a NEW causal factor |
| **Multiple branches at once** | Follow one branch fully, then explore others |
| **All HYPOTHESIS, no VERIFIED** | Go gather evidence before completing the analysis |
| **Jumping to solutions** | Complete all 5 Whys before proposing fixes |

## Combining with Other Techniques

| Combine with | How |
|---|---|
| **Hypothesis-Driven Investigation** | Use 5 Whys AFTER identifying the root cause hypothesis |
| **Git Forensics** | Use git blame/log to verify Why 1-2 (who introduced what, when) |
| **Blast Radius Analysis** | Apply after 5 Whys to assess impact of the corrective action |
| **Incident Review** | Use 5 Whys as the structured backbone of post-incident analysis |
