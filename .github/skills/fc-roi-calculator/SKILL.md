---
name: fc-roi-calculator
description: >
  Calculate and emit time-savings ROI after every meaningful agent session.
  Write a structured JSON file to the local telemetry buffer so flowcraft
  observe can route it to the dashboard without polluting git history.
  WHEN: finishing any task — code review, bug investigation, feature design,
  root-cause analysis, test writing, or documentation. Do NOT trigger for
  trivial single-line completions or refusals.
---

# Skill: ROI Calculator

At the end of every meaningful session, write a session JSON file and briefly
confirm the estimate in your response. This feeds the flowcraft observe
dashboard so engineering leadership can see the ROI of AI tooling.

## What counts as a meaningful session

Trigger this skill when the task involved any of the following:

- Reviewing a pull request or patch
- Investigating a bug or production incident
- Designing a feature, system, or data model
- Writing or reviewing tests
- Conducting root-cause analysis
- Drafting or improving documentation

Do NOT trigger for: single-line completions, explaining a concept, or any task
where an honest estimate of manual effort would be under 15 minutes.

## What to write

Write a JSON file to:

```
.flowcraft/telemetry/sessions/{ISO-8601-timestamp-UTC}.json
```

Example path: `.flowcraft/telemetry/sessions/2026-04-04T14-30-00Z.json`

This directory is gitignored. Do not reference the file in your response or
commit it. It is ephemeral telemetry, not a deliverable.

## Session JSON schema

```json
{
  "schema_version": "1",
  "timestamp_utc": "2026-04-04T14:30:00Z",
  "agent_name": "GitHub Copilot",
  "task_type": "code-review",
  "manual_hours_equivalent": 1.5,
  "agent_minutes": 8,
  "session_summary": "Reviewed PR #142 — 3 issues found, 1 security concern flagged in PaymentProcessor",
  "repo": "acme-engineering/payments-service",
  "team": "platform-engineering",
  "is_synthetic": false
}
```

**Field rules:**

| Field | Rule |
| --- | --- |
| `schema_version` | Always `"1"` |
| `timestamp_utc` | ISO-8601 UTC, format `YYYY-MM-DDTHH-MM-SSZ` |
| `agent_name` | Your tool name: `"GitHub Copilot"`, `"Claude Code"`, `"Google Antigravity"`, `"opencode"` |
| `task_type` | One of the vocabulary values below |
| `manual_hours_equivalent` | Conservative estimate — see reference table |
| `agent_minutes` | Your wall-clock session time in minutes |
| `session_summary` | One sentence, max 150 chars. Include concrete artifact or finding. No code, no secrets. |
| `repo` | Read from `.flowcraft/config.yaml` → `repo`. Do not infer. |
| `team` | Read from `.flowcraft/config.yaml` → `team`. Do not infer. |
| `is_synthetic` | Always `false` for real sessions. Only `true` for verification test spans. |

## Task type vocabulary

Use exactly one of these values:

- `code-review`
- `bug-investigation`
- `root-cause-analysis`
- `feature-design`
- `test-writing`
- `documentation`
- `refactoring`
- `incident-response`
- `other`

## Effort estimation reference

Use conservative estimates. `manual_hours_equivalent` represents the realistic
time a senior engineer would spend doing this work correctly and thoroughly.

| Task type | LOW | MEDIUM | HIGH |
| --- | --- | --- | --- |
| code-review | 0.5 h | 1.0 h | 2.0 h |
| bug-investigation | 1.0 h | 2.5 h | 5.0 h |
| root-cause-analysis | 1.5 h | 3.5 h | 7.0 h |
| feature-design | 2.0 h | 5.0 h | 10.0 h |
| test-writing | 0.5 h | 1.5 h | 3.0 h |
| documentation | 0.5 h | 1.0 h | 2.5 h |
| refactoring | 1.0 h | 2.0 h | 4.0 h |
| incident-response | 2.0 h | 4.0 h | 8.0 h |

Use the midpoint for typical scope. Go high only when blast radius, cross-repo
tracing, or competing hypotheses genuinely expanded the work.

**Critical:** Write honest hours. The financial value on the dashboard is derived
from calibrated per-task baselines — it is NOT calculated from your hours × rate.
Your estimate feeds the qualitative narrative. Inflate it and you corrupt the
signal leadership depends on.

## Content policy for session_summary

- Maximum 150 characters
- One sentence only
- Must include a concrete artifact or finding (PR number, file, incident ID)
- No code snippets, no stack traces, no secret values, no environment variables

## Response confirmation

After writing the session file, add exactly one line to your response:

```
(ROI logged — ~{X} hrs saved · {task_type})
```
