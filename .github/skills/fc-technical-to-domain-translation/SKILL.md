---
name: fc-technical-to-domain-translation
description: >
  Translate technical findings into plain language for non-technical stakeholders.
  Covers audience analysis, jargon elimination, tone calibration by severity,
  and structured briefing templates. Use when writing customer communications,
  stakeholder briefings, incident summaries, or any document where technical
  details must be conveyed without technical jargon. Independently useful for
  any technical-to-business communication.
---

# Technical-to-Domain Translation

A standalone playbook for converting technical findings into business-friendly language.

## When to Use

- Writing a customer briefing about a bug or incident
- Summarizing technical work for non-technical stakeholders
- Creating release notes for end users
- Explaining a production incident to management
- Any situation where "the audience doesn't write code"

## Step 1 — Know Your Audience

| Audience | What They Care About | Level of Detail |
|----------|---------------------|-----------------|
| **Customer / End User** | "Is my data safe? When will it be fixed?" | Impact + timeline only |
| **Account Manager / CS** | "What do I tell the customer?" | Impact + cause (plain) + resolution |
| **Product Manager** | "What went wrong and what are we doing about it?" | Cause + fix + prevention |
| **Executive** | "What's the business impact?" | Impact + risk + investment needed |

## Step 2 — Translate Technical Terms

### Translation Table

| Technical Term | Domain Translation |
|---|---|
| Stored procedure | How the system retrieves or processes data |
| Null / null reference | Missing or incomplete data |
| Exception / error | A problem the system encountered while processing |
| API endpoint | A service the system uses to communicate |
| Database query | How the system looks up information |
| Race condition | A timing issue where two operations conflict |
| Memory leak | The system gradually using more resources than expected |
| Cache invalidation | The system showing outdated information |
| Deadlock | Two processes waiting on each other, causing a freeze |
| Stack trace | Technical error details (internal diagnostic information) |
| Regression | A feature that was working before but stopped working |
| Deployment | A system update being released |
| Rollback | Reverting to the previous system version |
| Feature flag | A setting that controls whether a feature is active |
| Merge conflict | Changes from two team members that needed reconciliation |
| Commit / PR | A code change submitted by the development team |
| SQL injection | A security vulnerability (use only in security briefings) |

### Rules

1. **Never use**: commit hash, file path, class name, method name, line number, branch name
2. **Never mention**: developer names, git operations, code snippets, stack traces
3. **Replace with**: what the system does from the USER's perspective
4. **If in doubt**: describe the EFFECT, not the CAUSE

### Translation Exercise

```
BEFORE (technical):
"A NullReferenceException in PayrollCalcService.CalculateOvertime() at line 340
caused by visits spanning midnight being split by StartDate.Date grouping,
resulting in zero overtime for affected shift records in the VisitHours table."

AFTER (domain):
"Our payroll system was incorrectly calculating overtime for caregivers whose
shifts crossed midnight. These overnight shifts were being split into two
partial days, so neither part reached the overtime threshold on its own.
This resulted in $0 overtime being shown for affected shifts."
```

## Step 3 — Calibrate Tone by Severity

| Severity | Tone | Key Phrases |
|----------|------|-------------|
| **Minor / cosmetic** | Casual, positive | "We noticed an issue...", "This has been corrected..." |
| **Moderate / functional** | Professional, direct | "We identified a problem that affected...", "Our team has resolved..." |
| **Significant / data** | Empathetic, thorough | "We want to share a full account of...", "We take this seriously..." |
| **Critical / ongoing** | Urgent, transparent | "We are actively investigating...", "We will provide updates every..." |

### Tone Rules

- **Never blame**: Not "the developer made an error" but "a calculation issue was introduced"
- **Never use empty reassurance**: Not "we take security seriously" without specifics
- **Acknowledge impact**: "We understand this affected your payroll processing"
- **Be specific about resolution**: "The fix was verified on March 15" not "it should be fixed"
- **Forward-looking**: "We've added automated checks to prevent this type of issue"

## Step 4 — Structure the Briefing

### Customer Briefing Template (5 sections)

```markdown
## Summary
[1-2 sentences: What happened, in the simplest terms]

## What Happened
[2-3 sentences: The nature of the issue, in domain terms.
What was the user-visible effect?]

## Who Was Affected
[Scope: Which agencies/users/features were impacted?
Time range: When did this start and end?]

## How We Fixed It
[What the team did, in domain terms. When was it resolved?
How was the fix verified?]

## What We're Doing to Prevent This
[Specific preventive measures, in domain terms.
What monitoring/checks were added?]
```

### Release Note Template (shorter)

```markdown
**Fixed**: [Feature/area] — [What was wrong, in user terms].
[What users should expect now].
```

Example:
```
**Fixed**: Overtime Calculation — Overnight shifts spanning midnight were
not calculating overtime correctly. Caregivers working overnight shifts
will now see accurate overtime amounts on their timesheets.
```

## Step 5 — Quality Checklist

Before sending any stakeholder communication:

- [ ] **Jargon audit**: No technical terms remain (scan for: API, SQL, null, exception, commit, deploy, etc.)
- [ ] **Accuracy check**: Every factual claim verified against source material (Jira, RCA, code review)
- [ ] **Tone check**: Appropriate for severity level
- [ ] **No overpromising**: Forward-looking claims backed by confirmed actions
- [ ] **No blame**: No individual names, no blame language
- [ ] **Scope complete**: Affected users, timeframe, and resolution all stated
- [ ] **Timeline coherent**: All dates and relative references are correct

## Anti-Patterns

| Anti-Pattern | Example | Better |
|---|---|---|
| **Jargon leakage** | "...due to a null reference in the API" | "...due to a processing error in our system" |
| **Blame language** | "The developer's code had a bug" | "A calculation issue was introduced during a system update" |
| **Vague reassurance** | "We've improved our processes" | "We've added automated overnight-shift testing to our quality checks" |
| **Over-disclosure** | "File PayrollCalc.cs line 340..." | "Our payroll calculation component..." |
| **Under-disclosure** | "A minor issue was fixed" | "Overnight shift overtime was calculating as $0 for affected caregivers" |
| **Fear, uncertainty, doubt** | "This could have been much worse" | [omit — stick to facts] |
