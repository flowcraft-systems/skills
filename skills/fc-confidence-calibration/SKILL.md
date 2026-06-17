---
name: fc-confidence-calibration
description: >
  Evidence-based confidence scoring for analytical conclusions. Score confidence
  (0-100%) using an 8-source evidence inventory, hard ceiling matrix by evidence
  tier, and penalty deductions for gaps. Use when you need to quantify how
  confident you are in a diagnosis, hypothesis, root cause, or any analytical
  conclusion. Independently useful for any investigation or decision-making.
---

# Confidence Calibration

A standalone playbook for scoring how confident you should be in a conclusion.

## When to Use

- You've completed an investigation and need to score your confidence
- You're deciding whether evidence is strong enough to act on
- You're reviewing someone else's confidence claims
- You want to avoid overconfidence or underconfidence in diagnoses

## The Evidence Inventory

Confidence is built from evidence sources. Catalog what you have:

| Source ID | Evidence Type | Description | Strength |
|-----------|---|---|---|
| S1 | **Code path** | Traced the exact execution path through source code | Strong |
| S2 | **Reproduction** | Bug reproduced in a controlled environment | Strong |
| S3 | **Log/trace** | Error seen in production logs with stack trace | Strong |
| S4 | **Data evidence** | Database records or API responses confirm the state | Strong |
| S5 | **Git history** | Commit/blame identifies introducing change | Medium |
| S6 | **Configuration** | Setting/flag state verified | Medium |
| S7 | **Inference** | Logical deduction from indirect evidence | Weak |
| S8 | **Witness report** | User/developer described behavior (no logs/data) | Weak |

### Inventory Your Evidence

For your conclusion, check which sources you have:

```markdown
## Evidence Inventory for: [your conclusion]

- [x] S1 Code path: Traced through PayrollCalc.cs:340-380
- [x] S2 Reproduction: Reproduced with overnight shift test data
- [ ] S3 Logs: No production logs available for this scenario
- [x] S4 Data: Query shows $0 overtime for affected shifts
- [x] S5 Git: Commit abc123 introduced the date grouping
- [x] S6 Config: Agency has weekly overtime mode enabled
- [ ] S7 Inference: N/A
- [ ] S8 Witness: N/A

Sources present: 5/8 (S1, S2, S4, S5, S6)
```

## Hard Ceiling Matrix

Your maximum confidence is limited by the STRONGEST evidence tier you have:

| Strongest Evidence | Ceiling | Rationale |
|---|---|---|
| S1 + S2 (code path + reproduction) | 95% | Near-certain: you can see it and prove it |
| S1 or S2 alone | 85% | High: strong single source but not cross-validated |
| S3 + S4 (logs + data) | 80% | Strong indirect: observed in production |
| S5 + S6 (git + config) | 70% | Moderate: circumstantial but consistent |
| S7 only (inference) | 50% | Low: logical but unverified |
| S8 only (witness) | 40% | Weak: subjective, no corroboration |
| No evidence | 20% | Guess: acknowledge uncertainty explicitly |

**Rule**: You CANNOT claim higher confidence than your ceiling allows, regardless
of how "sure" you feel. Feelings are not evidence.

## Penalty Deductions

Apply penalties for evidence gaps:

| Gap | Penalty | Rationale |
|-----|---------|-----------|
| No counter-evidence search attempted | -10% | Confirmation bias risk |
| Competing hypothesis not explored | -10% per unexplored | May be looking at the wrong cause |
| Evidence contradicts conclusion (unresolved) | -15% per item | Active counter-evidence is serious |
| Single source of evidence | -10% | No cross-validation |
| Evidence is stale (>30 days old) | -5% | Conditions may have changed |
| Reproduction was partial (not exact repro) | -5% | May be a different bug |

## Calculation

```
raw_confidence = min(evidence_sources_score, hard_ceiling)
final_confidence = raw_confidence - sum(penalties)
final_confidence = max(final_confidence, 5%)  # Floor: never claim 0%
```

### Example

```
Evidence: S1 (code path) + S4 (data) + S5 (git history)
Ceiling: 85% (have S1 but not S2)

Penalties:
  - No counter-evidence search: -10%
  - One competing hypothesis unexplored: -10%

Final: 85% - 10% - 10% = 65%
```

## Confidence Bands

| Band | Range | What It Means | Safe to Act? |
|---|---|---|---|
| **Very High** | 85-95% | Multiple strong evidence sources, counter-evidence addressed | Yes — proceed with fix |
| **High** | 70-84% | Strong evidence but gaps in corroboration | Yes — with blast-radius analysis |
| **Moderate** | 50-69% | Evidence is suggestive but not conclusive | Maybe — gather more evidence first |
| **Low** | 30-49% | Mostly inference or indirect evidence | No — investigate further |
| **Very Low** | 5-29% | Speculation or witness reports only | No — treat as hypothesis only |

## Reporting Template

```markdown
## Confidence Assessment

**Conclusion**: [State the conclusion being scored]

**Evidence sources present**: S1, S4, S5 (3 of 8)
**Hard ceiling**: 85% (code path traced, no reproduction)

**Penalties applied**:
- No counter-evidence search: -10%

**Final confidence**: 75% (High)

**Interpretation**: Evidence is strong enough to proceed with a fix,
but a blast-radius analysis should precede any deployment.

**To increase confidence**: Reproduce the bug in a test environment (S2)
and search for counter-evidence (remove -10% penalty).
```

## Calibration Tips

1. **If you're always at 90%+**, you're probably overconfident — check your penalties
2. **If you're always at 40-50%**, you may need to gather more evidence before scoring
3. **Disagreement between score and gut feeling** is a signal — investigate the gap
4. **Track your calibration over time**: Were your 75% conclusions right ~75% of the time?
5. **Confidence in the negative** ("this is NOT the cause") follows the same framework
