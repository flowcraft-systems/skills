---
name: fc-blast-radius-analysis
description: >
  Analyze the potential impact of a proposed code change before applying it.
  Scans dependencies (callers, callees, DB, API, UI), predicts behavioral deltas,
  constructs a risk table, and recommends mitigations. Use before any bug fix,
  refactoring, or feature change to understand what might break. Independently
  useful for any code change impact assessment.
---

# Blast Radius Analysis

A standalone playbook for assessing the impact of a proposed code change.

## When to Use

- Before applying a bug fix — what else might break?
- Before refactoring — what depends on this code?
- Before a feature change — what's the propagation surface?
- After a patch — verify the actual diff matches expectations
- During code review — is the change safely scoped?

## Step 1 — Map the Change Surface

Identify everything the changed code touches:

### Direct Dependencies (things the changed code CALLS)

```bash
# Find what the changed function/method calls
grep -n "<function_name>" <file>        # Direct calls
grep -rn "<function_name>" <directory>  # Cross-file calls
```

### Reverse Dependencies (things that CALL the changed code)

```bash
# Find all callers of the changed function
grep -rn "<function_name>" --include="*.cs" --include="*.ts" <repo_root>

# For .NET: find usages of a class/method
grep -rn "<ClassName>\.\|new <ClassName>" --include="*.cs" <repo_root>
```

### Data Dependencies

| Layer | What to check |
|-------|--------------|
| **Database** | Tables read/written, stored procedures called, views referenced |
| **Cache** | Cache keys invalidated or read |
| **Queue/Event** | Messages published or consumed |
| **File system** | Files read or written |
| **External API** | HTTP calls made, webhooks triggered |

### UI Dependencies

| Check | How |
|-------|-----|
| **Pages using this API** | Search frontend for API endpoint URL |
| **Components using this data** | Search for the model/DTO type name |
| **Downstream displays** | Reports, dashboards, exports that consume this data |

## Step 2 — Predict Behavioral Deltas

For each dependency found, predict how the change affects it:

| # | Dependent Component | Current Behavior | Predicted New Behavior | Risk Level |
|---|---|---|---|---|
| 1 | `ScheduleController.GetShifts()` | Returns all shifts including overnight | Same (no change to return shape) | 🟢 None |
| 2 | `OvertimeReport.Calculate()` | Groups by `StartDate.Date` | Now groups by shift span (may change totals) | 🔴 High |
| 3 | `PayrollExport.GenerateCSV()` | Reads overtime from same function | Overtime values will change → CSV changes | 🟠 Medium |

### Risk Levels

| Level | Meaning | Action Required |
|-------|---------|-----------------|
| 🟢 **None** | No behavioral change expected | No action |
| 🟡 **Low** | Cosmetic or edge-case change only | Verify with existing tests |
| 🟠 **Medium** | Behavioral change in a downstream consumer | Write targeted test |
| 🔴 **High** | Behavioral change in a critical path (billing, auth, data integrity) | Manual QA + test + staged rollout |

## Step 3 — Construct the Risk Table

Compile all findings into a single risk table:

```markdown
## Blast Radius Summary

### Change Description
[One sentence describing the proposed change]

### Impact Layer Map

| Layer | Components Affected | Max Risk |
|-------|-------------------|----------|
| API/Controller | [list] | 🟢/🟡/🟠/🔴 |
| Service/Business Logic | [list] | 🟢/🟡/🟠/🔴 |
| Database/Repository | [list] | 🟢/🟡/🟠/🔴 |
| UI/Frontend | [list] | 🟢/🟡/🟠/🔴 |
| External Integrations | [list] | 🟢/🟡/🟠/🔴 |
| Reports/Exports | [list] | 🟢/🟡/🟠/🔴 |

### Detailed Risk Register

| # | Component | File:Line | Risk | Behavioral Delta | Mitigation |
|---|-----------|-----------|------|-------------------|------------|
| 1 | OvertimeCalc | PayrollCalc.cs:340 | 🔴 | Totals change for overnight shifts | Add regression test |
| 2 | PayrollExport | Export.cs:120 | 🟠 | CSV values change | Validate export output |
| 3 | ScheduleView | schedule.component.ts:45 | 🟢 | No change | None |
```

## Step 4 — Recommend Mitigations

For each 🟠 or 🔴 risk item:

| Risk Item | Mitigation | Type |
|-----------|-----------|------|
| OvertimeCalc totals change | Regression test comparing before/after | Test |
| PayrollExport CSV changes | Diff old vs new CSV for sample data | Verification |
| Billing amounts affected | Feature flag with per-agency rollout | Staged rollout |
| External API contract change | Version the endpoint, keep backward compat | API safety |

### Mitigation Types
- **Test**: Write automated test covering this scenario
- **Verification**: Manual spot-check or automated diff
- **Staged rollout**: Feature flag or canary deployment
- **API safety**: Versioning, backward compatibility
- **Monitoring**: Alert on metric change post-deploy
- **Communication**: Notify downstream team or customer

## Step 5 — Verdict

Summarize with a go/no-go recommendation:

| Verdict | Criteria |
|---------|----------|
| ✅ **Safe to proceed** | No 🔴 risks, all 🟠 mitigated, tests in place |
| ⚠️ **Proceed with caution** | 🔴 risks exist but are mitigated, needs staged rollout |
| 🛑 **Block — needs redesign** | Unmitigated 🔴 risks, blast radius too wide for the change |

## Post-Patch Verification (After Applying the Change)

After the change is applied, verify the actual impact matches predictions:

1. **Diff check**: `git diff` — does the actual diff match the planned change?
2. **Test sweep**: Run full test suite — any unexpected failures?
3. **Build verification**: Does the project compile/build cleanly?
4. **Smoke test**: Run the reproduction scenario — is the bug fixed?

If any prediction was wrong (unexpected failures, wider diff than planned), update the risk table and reassess.
