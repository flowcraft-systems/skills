---
name: fc-adversarial-review
description: >
  Structured adversarial review methodology with dimension-based scoring and YAML
  verdicts. Use when reviewing any document, report, code change, or analysis
  for quality, completeness, and accuracy. Provides a standardized scoring framework
  (0-10 per dimension), evidence verification protocol, and verdict system
  (approved / revisions_required / rejected). Independently useful for any review task.
---

# Adversarial Review

A standalone playbook for conducting rigorous, scored reviews of any artifact.

## When to Use

- Reviewing an RCA report, design document, or customer briefing
- Reviewing code changes against prescribed actions
- Auditing an incident post-mortem
- Any situation where you need structured quality assessment
- When you want to challenge assumptions and verify claims objectively

## Core Principles

1. **Assume gaps until proven otherwise** — start skeptical, let evidence convince you
2. **Verify, don't trust** — spot-check every factual claim against primary sources
3. **Adversarial ≠ hostile** — the goal is quality improvement, not punishment
4. **Score on evidence, not impression** — every score needs cited justification
5. **Actionable findings only** — every criticism must include a concrete fix suggestion
6. **Separate blocking from nice-to-have** — distinguish MUST-FIX from SHOULD-IMPROVE

## Step 1 — Define Review Dimensions

Before reviewing, establish your scoring dimensions. Choose 5-10 dimensions relevant to the artifact type.

### Standard Dimension Templates

**For RCA / Investigation Reports:**

| # | Dimension | What to Check |
|---|-----------|---------------|
| D1 | Structural Completeness | Are all required sections present and non-empty? |
| D2 | Hypothesis Rigor | Are hypotheses falsifiable with clear mechanisms? |
| D3 | Evidence Quality | Does every claim cite file:line or log entry? |
| D4 | Confidence Calibration | Does claimed confidence match actual evidence strength? |
| D5 | Corrective Actions | Specific, minimal, complete, with rollback plan? |
| D6 | Blast-Radius Depth | Dependencies scanned, behavioral deltas identified? |
| D7 | Preventive Actions | Prevents the class of bug, not just this instance? |

**For Code Changes / Patches:**

| # | Dimension | What to Check |
|---|-----------|---------------|
| D1 | Test Discipline | Failing test exists? RED/GREEN documented? |
| D2 | Patch Minimality | Smallest possible change? No scope creep? |
| D3 | Duplicate Coverage | All instances of the pattern fixed? |
| D4 | Deployment Readiness | Correct rollout order? Rollback plan? |
| D5 | Test Execution Evidence | Tests actually run, not just claimed? |

**For Design / Architecture Documents:**

| # | Dimension | What to Check |
|---|-----------|---------------|
| D1 | Problem Framing | Business goal clear? NFRs quantified? |
| D2 | Current State Evidence | Claims cite file/symbol/line? |
| D3 | Option Space Balance | ≥3 real options? No straw-man? "Do nothing" present? |
| D4 | Tradeoff Rigor | Concrete metrics, not vague adjectives? |
| D5 | Decision Framing | Questions, not dictated answers? |

**For Customer / Stakeholder Communications:**

| # | Dimension | What to Check |
|---|-----------|---------------|
| D1 | Factual Accuracy | All claims verified against source material? |
| D2 | Jargon Audit | No technical terms in customer-facing text? |
| D3 | Tone Assessment | Severity-appropriate? Empathetic? No blame? |
| D4 | Completeness | All required sections present? |
| D5 | No Overpromising | Forward claims backed by confirmed actions? |

## Step 2 — Score Each Dimension

For each dimension, assign a score from 0-10:

| Score | Meaning |
|-------|---------|
| 9-10 | Exemplary — exceeds expectations with no issues |
| 7-8 | Good — minor issues, no blockers |
| 5-6 | Acceptable — notable gaps but usable |
| 3-4 | Below standard — significant issues need fixing |
| 1-2 | Poor — major gaps, largely unusable |
| 0 | Missing — section absent or completely wrong |

### Scoring Rules
- **Every score needs justification**: Cite specific evidence for why you scored as you did
- **Spot-check factual claims**: Verify at least 3-5 claims against primary sources (code, logs, Jira)
- **Check for what's missing**: Score low for important omissions, not just errors
- **Independent verification**: For critical claims, run your own search to verify

## Step 3 — Classify Findings

For each issue found, classify its severity:

| Severity | Meaning | Blocks approval? |
|----------|---------|-----------------|
| 🔴 **Blocker** | Factual error, missing critical section, wrong conclusion | Yes |
| 🟠 **Critical** | Significant gap that undermines confidence | Yes (if ≥2) |
| 🟡 **Major** | Important omission but doesn't invalidate the work | No |
| 🟢 **Minor** | Improvement opportunity, style/clarity issue | No |

### Finding Template
```markdown
### [SEVERITY] Finding F{N}: {Title}

**Dimension**: D{N} — {Dimension Name}
**Issue**: {What's wrong}
**Evidence**: {Where you found the problem — cite specific section/line}
**Impact**: {Why this matters}
**Fix**: {Concrete suggestion for how to fix it}
```

## Step 4 — Render Verdict

### Verdict Computation

Calculate the weighted average of dimension scores, then apply the verdict matrix:

```
overall_score = sum(dimension_score * weight) / sum(weights)
```

| Overall Score | Blockers | Verdict |
|--------------|----------|---------|
| ≥ 7.5 | 0 | ✅ **APPROVED** |
| ≥ 6.0 | 0 | ✅ **APPROVED** (with minor revisions noted) |
| ≥ 6.0 | 1+ | ⚠️ **REVISIONS_REQUIRED** |
| 5.0 – 5.9 | any | ⚠️ **REVISIONS_REQUIRED** |
| < 5.0 | any | 🛑 **REJECTED** |
| N/A | Fundamental accuracy breach | 🚨 **ESCALATE_TO_HUMAN** |

## Step 5 — Write the Review

### YAML Verdict Block (machine-readable)

```yaml
verdict: APPROVED | REVISIONS_REQUIRED | REJECTED
overall_score: 7.8
dimensions:
  - id: D1
    name: Structural Completeness
    score: 8
    justification: "All 7 required sections present. Executive summary is clear."
  - id: D2
    name: Hypothesis Rigor
    score: 7
    justification: "5 hypotheses generated, all falsifiable. H3 mechanism is vague."
findings:
  blockers: 0
  critical: 1
  major: 2
  minor: 3
top_findings:
  - severity: critical
    id: F1
    title: "Missing counter-evidence for H1"
    dimension: D3
    fix: "Add at least one contradicting evidence item for the leading hypothesis"
recommendation: |
  Approve after addressing F1 (critical). The analysis is thorough but needs
  stronger falsification discipline for the leading hypothesis.
```

### Prose Summary (human-readable)

Write a 3-5 sentence summary covering:
1. Overall quality assessment
2. Key strengths (what was done well)
3. Key gaps (what needs fixing)
4. Clear next action

## Iteration Protocol

If the verdict is REVISIONS_REQUIRED:
1. Return findings to the author
2. Author addresses blocker and critical findings
3. Reviewer re-scores only the affected dimensions
4. Maximum 2 review iterations — after that, escalate to human

## Anti-Patterns to Avoid

| Anti-Pattern | Better Approach |
|---|---|
| Scoring by gut feeling | Score based on specific cited evidence |
| Nitpicking style/formatting | Focus on substance: accuracy, completeness, clarity |
| Reviewing without reading the source material | Always verify claims against primary sources |
| Identical scores across all dimensions | If everything scores the same, you're not differentiating |
| Non-actionable criticism ("this could be better") | Specific fix suggestion for every finding |
| Hostility or sarcasm | Professional, constructive tone — the goal is improvement |
