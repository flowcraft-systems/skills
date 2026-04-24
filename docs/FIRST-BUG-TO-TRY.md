# Your First Bug Investigation (10 minutes)

You just installed FlowCraft Skills. The fastest way to evaluate whether the agents add real value to your team is to point one at a real production bug.

## What to pick

Choose a bug from your backlog that meets these criteria:

- **Real, not synthetic.** A ticket your team has actually triaged or pushed to "later".
- **P2 or P3 severity.** Avoid live incidents on the first run.
- **Roughly 1–4 weeks old.** Old enough to have comments and evidence; recent enough to still matter.
- **Touches code your team owns.** The agent will do the deepest work where it has access to the source.

## What to run

In your Copilot or Claude Code chat:

```text
@fc-bug-byomkesh PROJ-1234
```

Replace `PROJ-1234` with your real Jira issue ID.

## What happens

The agent will:

1. **Fetch the issue** — title, description, comments, labels, linked PRs.
2. **Generate hypotheses** — 3 to 7 ranked, falsifiable explanations for the failure.
3. **Gather evidence** — code-level investigation across the relevant repositories.
4. **Run blast-radius analysis** — every caller, dependency, and downstream effect of the suspected area.
5. **Apply Toyota 5 Whys** — drill into the root cause with cited evidence at each level.
6. **Score confidence** — how strong is the evidence trail behind the conclusion?
7. **Produce a Root Cause Analysis report** — corrective and preventive actions, written to `.flowcraft/case-files/rca/...`.
8. **Post the report to Jira** — chunked comments respecting the 32K limit, with a revision guard so re-runs don't spam.

## How to evaluate

Compare the agent's RCA to what your team would have written manually:

- Are the hypotheses ones your senior engineer would also have considered?
- Is the evidence cited correctly — file paths, line numbers, real call sites?
- Does the blast-radius analysis catch dependencies your team would have missed?
- Are the corrective and preventive actions specific enough to ticket and assign?

If the answer is yes to most of those, you have evidence the agent is working on your codebase.

## Next step: try the patch

Once the RCA is in good shape, hand it to the patching agent:

```text
@fc-bug-sushruta .flowcraft/case-files/rca/<date>--PROJ-1234--<slug>/rca-report.md
```

This will:

1. Write a failing test that reproduces the bug.
2. Apply the minimal fix to make the test pass.
3. Wrap risky changes in a feature flag.
4. Produce a patch report for code review.

Two commands. From triage-pile bug to test-protected, feature-flagged fix. That is the loop.

## When to bring in the rest of the crew

| Situation | Agent |
| --------- | ----- |
| You need an architecture decision before changing things | `@fc-design-vishwakarma` |
| You want a structured review of an existing PR | `@fc-code-review-dronacharya` |
| You need a risk-based test suite for a feature | `@fc-test-case-chanakya` |
| You need to brief a non-technical stakeholder on an incident | `@fc-customer-briefing-narada` |

## When to bring in the platform

FlowCraft Skills is self-contained and free. When your team needs:

- Cross-workspace ROI tracking
- Artifact quality scoring across teams
- Leadership-ready evidence exports
- Multi-team adoption visibility

That is what the [FlowCraft platform](https://flowcraft.systems) adds on top.

If you want help tuning the agents to your specific repositories and workflows, [talk to us about managed enablement](mailto:hello@flowcraft.systems).
