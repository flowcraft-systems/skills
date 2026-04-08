---
name: fc-roi-summary
description: >
  Append a time-savings ROI summary table and qualitative human-under-duress counterfactual analysis to agent reports. Use when finalizing any fc-bug-byomkesh RCA, fc-bug-sushruta patch, fc-design-vishwakarma design packet, fc-code-review-dronacharya review, incident RCA review, or fc-test-case-chanakya test design report.
---

# Skill: ROI Summary

Append an ROI Summary section at the very end of every report. Use the next available section number (or no number for unnumbered sections — see agent instructions).

## Format

```markdown
## ROI Summary

| Phase | Manual | Automated |
| --- | --- | --- |
| {agent-specific phase rows — see agent instructions} | ~X hrs | ~Y min |
| **Total** | **~X hrs** | **~Y min** |

> **Bottom line:** Automated ~X hrs of senior eng work into 1 agent call.

Senior engineers, you've reclaimed X hrs — spend on tech talks, blog posts, innovative features,
design debates, team bonding over books/philosophy, mentoring, hobbies, open-source.
Human creativity shines here; AI supports, never leads.
```

### Critical formatting rules (required for analytics extraction)

- The section heading **must** be `## ROI Summary` (no suffix like "— Time Saved"). The extractor matches `## ROI Summary` exactly.
- Column order is fixed: **Phase** (description) | **Manual** (human hours) | **Automated** (agent time).
- The `Total` row **must** use the exact pattern `| **Total** | **~X hrs** | **~Y min** |` with a single numeric value — not a range like `6–8 hrs`. Use the midpoint or upper bound.
- `~X hrs` goes in column 2 (manual effort), `~Y min` goes in column 3 (agent wall-clock time).
- Do **not** add a 4th column — the extractor is a 3-column regex and extra columns break it.

Use **conservative** estimates based on repos searched, files read, hypotheses tested, and layers traced.
Each agent's instructions list the suggested roles and tasks for that agent type.

## Effort Estimation Reference

Use these ranges to keep the hour estimates grounded. Totals outside the high end must be rare
and justified by concrete scope (e.g. unusually wide blast radius, 4+ repos, 10+ competing options).

| Agent | LOW total | MEDIUM total | HIGH total |
| --- | --- | --- | --- |
| fc-bug-byomkesh | 1–2 h | 2–4 h | 4–6 h |
| fc-bug-sushruta | 1–3 h | 3–5 h | 5–7 h |
| fc-design-vishwakarma | 3–6 h | 6–10 h | 10–16 h |
| fc-code-review-dronacharya | 0.5–1 h | 1–2 h | 2–3 h |
| incident-rca-reviewer | 1–3 h | 3–5 h | 5–8 h |
| fc-test-case-chanakya | 2–4 h | 4–6 h | 6–10 h |

> **Important:** The financial figure shown in the analytics dashboard is derived from
> calibrated per-invocation baselines — it is **not** calculated from hours × rate.
> Write honest hours; they feed the qualitative narrative and display table, but they
> do **not** inflate the reported savings.

## Qualitative ROI — The Human-Under-Duress Counterfactual

After the time-savings table, add a subsection that **contrasts** what the agent delivered against what would realistically happen if a human operator attempted the same task under sprint/incident pressure. This is not a generic disclaimer — it must be **grounded in the specific findings of this report**.

### How to write this section

1. **Set the scene.** In 2–3 sentences, describe the realistic human counterfactual for *this particular task*. Assume the human is competent but under time pressure (sprint deadline, production incident, end-of-day escalation). What corners would likely be cut? What would the deliverable realistically look like?

2. **Cite specific evidence from your report.** Walk through concrete findings the agent produced and, for each one, state plainly what would likely be missed or done poorly by hand. Use the patterns below as lenses — but only include patterns that actually apply to your report:

   - **Shallow fix / shallow analysis:** Would the human likely stop at the first plausible explanation or obvious patch location, missing a deeper systemic cause the agent traced?
   - **Skipped preventive actions:** How many preventive actions did the agent recommend? Under pressure, how many would a human actually explore?
   - **Incomplete coverage:** Did the agent find duplicate code, multiple affected call-sites, or scattered configuration that a hurried human would patch in one place but miss elsewhere?
   - **Confirmation bias:** Did the agent evaluate competing hypotheses, alternative design options, or conflicting evidence that a time-pressed human would likely not consider?
   - **Undocumented reasoning:** Would the investigation, design rationale, or decision trade-offs remain in one person's head instead of in a reviewable artifact?
   - **Blast-radius blind spots:** Did the agent assess downstream impact, regression risk, or deployment sequencing that a "get it done" approach would skip?

3. **Draw the contrast.** End with a short paragraph that makes the value gap explicit: "The time-savings table models the cost of doing this work *correctly* by hand. The realistic alternative under duress is [describe what would actually ship]. The agent closed that gap by [1–2 sentence summary of the agent's key contribution beyond raw speed]."

### Output Template

```markdown
### Qualitative ROI — The Human-Under-Duress Counterfactual

{Scene-setting: what would realistically happen if a human attempted this task under time pressure.}

{Evidence-grounded contrast — cite specific report findings and state what would be missed or done poorly.}

{Closing contrast paragraph.}
```

### Tone

Write as a candid staff-engineer peer review, not a sales pitch. The goal is honest reflection on what the agent's structured process prevented, specific to this task. Avoid generic platitudes — every claim must trace back to something in the report.
