---
name: fc-hypothesis-driven-investigation
description: >
  Structured hypothesis-driven bug investigation methodology. Generate 3-7 ranked,
  falsifiable hypotheses from bug symptoms, design fast tests to discriminate them,
  collect evidence with mandatory falsification, and converge on a root cause.
  Use when investigating any bug, defect, or unexpected behavior — either manually
  (to reason through hypotheses before invoking an agent) or as part of an automated
  investigation pipeline. Independently useful for any debugging scenario.
---

# Hypothesis-Driven Investigation

A standalone playbook for investigating software defects using the scientific method.
You don't need an agent to use this — follow these steps manually for any bug.

## When to Use

- You have a bug report and want to systematically investigate it
- You want to reason through hypotheses before letting an agent run
- You're stuck on a defect and need structured thinking
- You're reviewing someone else's root cause analysis

## Step 1 — Collect Symptoms

Gather all observable facts before forming any theory:

| Source | What to collect |
|--------|----------------|
| Bug report | Steps to reproduce, expected vs actual behavior, environment |
| Logs / errors | Stack traces, error codes, timestamps, affected requests |
| User reports | Frequency, affected user roles, data patterns |
| Screenshots / recordings | UI state, network responses, console errors |

**Rule**: Separate _observations_ (facts) from _interpretations_ (theories). Only observations go here.

## Step 2 — Generate Hypotheses

Produce **3–7 ranked hypotheses**. Each hypothesis must have:

| Field | Description |
|-------|-------------|
| **ID** | H1, H2, H3, ... |
| **Statement** | One-sentence falsifiable claim (e.g., "The null check on line 42 fails when `patientId` is zero because zero is falsy in JavaScript") |
| **Mechanism** | How the defect would manifest through this cause |
| **Predicted evidence** | What you'd find in code/logs/data if this hypothesis is correct |
| **Predicted counter-evidence** | What you'd find if this hypothesis is WRONG |
| **Fast test** | The quickest way to confirm or refute (< 15 minutes) |
| **Confidence** | Initial estimate: Low / Medium / High |

### Completeness Gate

Before proceeding, verify your hypothesis set covers these failure modes:

1. **Logic error** — wrong conditional, off-by-one, null handling
2. **Data state** — unexpected DB state, missing records, stale cache
3. **Concurrency** — race condition, deadlock, dirty read
4. **Configuration** — wrong setting, missing flag, environment mismatch
5. **Integration** — contract violation, version skew, timeout
6. **Input validation** — unvalidated user input, edge-case data

If any category is unrepresented, add at least one hypothesis for it.

### Ranking Rules

- Rank by P(hypothesis | symptoms), not by severity
- The simplest explanation consistent with ALL symptoms ranks highest
- If two hypotheses explain the same symptoms, prefer the one with more distinguishing predictions

## Step 3 — Run Fast Tests

Execute fast tests in priority order (highest-ranked hypothesis first):

```
For each hypothesis (highest confidence first):
  1. Run the fast test
  2. Record the result
  3. Update confidence:
     - Evidence supports → increase confidence
     - Evidence contradicts → decrease confidence
     - Evidence is ambiguous → note it, move on
  4. If confidence > 85% → promote to leading hypothesis
  5. If confidence < 15% → mark as refuted
```

**Stop when**: One hypothesis reaches ≥ 85% confidence AND at least one fast test per remaining hypothesis has been run.

## Step 4 — Collect Deep Evidence

For the leading hypothesis, build a full evidence ledger:

| # | Evidence Item | Source (file:line or log entry) | Supports / Contradicts / Neutral | Hypothesis |
|---|---|---|---|---|
| E1 | `patientId` is passed as string "0" | `PatientService.cs:142` | Supports | H1 |
| E2 | Null check uses `!= null` not `!= 0` | `Validator.cs:87` | Supports | H1 |
| E3 | Unit test covers null but not zero | `ValidatorTests.cs:44-60` | Supports | H1 |
| E4 | Other callers always pass non-zero | `ScheduleController.cs:203` | Contradicts | H1 |

### Mandatory Falsification

For EVERY hypothesis in your shortlist, you must find **at least one piece of evidence that contradicts it** — or explicitly document why no contradicting evidence exists. This prevents confirmation bias.

## Step 5 — Synthesize Root Cause

Write a root cause statement that:

1. **Names the defect**: What exactly is wrong in the code
2. **Explains the mechanism**: How the defect produces the observed symptoms
3. **Identifies the trigger**: What conditions activate the defect
4. **Cites evidence**: References specific file:line, log entries, or data

### Root Cause Statement Template

```
ROOT CAUSE: [One sentence identifying the defect]

MECHANISM: [How the defect produces the symptoms]
- Step 1: [First thing that happens]
- Step 2: [Chain of causation]
- Step N: [Observable symptom]

TRIGGER: [Conditions that activate the defect]

EVIDENCE:
- [E1] file:line — what it shows
- [E2] file:line — what it shows
- [E3] log entry — what it shows

CONFIDENCE: [X]% based on [evidence summary]
```

## Step 6 — Derive Actions

From the root cause, derive two types of actions:

### Corrective Actions (fix the bug)
- The minimal, safe change that eliminates the defect
- Must be specific: "Change `!= null` to `!= null && != 0` at `Validator.cs:87`"
- Tier them: 🔴 Must Have (fixes the bug) / 🟡 Good to Have (reduces risk)

### Preventive Actions (prevent the class of bug)
- What test, monitor, or guardrail would catch THIS TYPE of bug in the future?
- Must prevent the _class_ of defect, not just this instance
- Examples: "Add boundary value tests for all ID parameters", "Add runtime assertion for non-zero IDs"

## Anti-Patterns to Avoid

| Anti-Pattern | Why it's harmful |
|---|---|
| **Anchoring on the first idea** | Skips alternative explanations; leads to tunnel vision |
| **Reading the fix PR before investigating** | Biases your hypotheses toward the known answer |
| **Skipping falsification** | Confirmation bias goes undetected |
| **Too few hypotheses (< 3)** | Insufficient coverage of the failure space |
| **Too many hypotheses (> 7)** | Dilutes effort; most bugs have 3-5 plausible causes |
| **Vague mechanism** | "Something is wrong with the data" is not a hypothesis |
| **No fast tests** | Hypotheses without testable predictions are unfalsifiable |

## Example: Quick 15-Minute Investigation

```
Bug: "Caregiver overtime not calculating for visits spanning midnight"

Symptoms:
- Overtime shows $0 for overnight shifts
- Day shifts calculate correctly
- Only affects agencies with "weekly" overtime mode

Hypotheses:
H1 (High): Date boundary splits visit into two zero-overtime days
   Fast test: Check if CalculateOvertime() groups by calendar day
H2 (Med): Overnight flag not set on the shift record
   Fast test: Query shift records for midnight-spanning visits
H3 (Low): Timezone conversion truncates hours
   Fast test: Check if server timezone differs from agency timezone

Fast test results:
H1: CalculateOvertime() at PayrollCalc.cs:340 groups by visit.StartDate.Date
   → visits spanning midnight get split into two partial days
   → neither day exceeds 8h threshold → $0 overtime
   → CONFIRMED (90% confidence)

Root cause: CalculateOvertime() groups hours by calendar day using
StartDate.Date, splitting overnight visits. Each fragment falls below
the overtime threshold independently.
```
