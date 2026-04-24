# Brownfield & Legacy Engineering Playbook

FlowCraft Skills is built for the codebase you actually have, not the one you wish you had.

This playbook is for engineering teams working in:

- Monoliths or distributed services with **100K+ lines of code**
- Codebases with **incomplete or stale test coverage**
- Areas with **high blast radius** where one change can break something nobody remembers writing
- Domains where **institutional knowledge** lives in a few people's heads, not in the repo
- Production systems where **safe change** matters more than speed

## The real problem in brownfield

Jeff Atwood put it plainly:

> "Developers spend most of their time trying to understand code."

In a brownfield codebase, that is the dominant cost of every change. Code generation is everywhere. Understanding is scarce. The agents in FlowCraft Skills are designed to close that gap before code is written, not after.

## A three-week onboarding path

This is the path we recommend for a team adopting FlowCraft Skills in a legacy codebase. It moves from low-risk evaluation to high-leverage workflows in roughly three weeks.

### Week 1 — Safety-first debugging

**Goal:** Build trust in the agents on bugs you can verify manually.

- Pick 3–5 production bugs from the last quarter, ideally already resolved.
- Run `@fc-bug-byomkesh PROJ-XXXX` on each.
- Compare the agent's RCA to what your team actually shipped.
- Look for: hypothesis quality, evidence accuracy, blast-radius coverage.

**Why this comes first:** Bug investigation has a clear ground truth. You can tell quickly whether the agent is producing real signal in your repo.

**Skills active:** `fc-hypothesis-driven-investigation`, `fc-toyota-5-whys`, `fc-blast-radius-analysis`, `fc-confidence-calibration`, `fc-git-forensics`.

### Week 2 — Architecture clarification

**Goal:** Get a structured second opinion on real design decisions.

- Pick 2–3 pending refactoring or design choices on your team's plate.
- Run `@fc-design-vishwakarma` on each.
- Read the trade-off analysis, ADR, and option-space comparison.
- Use it as input to your real architecture conversation, not as a substitute.

**Why this matters in brownfield:** Most legacy refactoring fails because the option space was never properly explored. The agent forces a structured comparison before commitment.

**Skills active:** `fc-evolutionary-architecture`, `fc-blast-radius-analysis`.

### Week 3 — Safe change & regression prevention

**Goal:** Use the agents to make changes you would otherwise delay.

- Pick a change in untested or under-tested code.
- Run `@fc-test-case-chanakya` to design risk-based tests first.
- Add characterization tests using `fc-safe-legacy-patching` techniques (Sprout Method, Wrap Method, seam identification).
- Then apply the change with `@fc-bug-sushruta` (for bug-shaped changes) or via your normal flow with the new test coverage.

**Skills active:** `fc-safe-legacy-patching`, `fc-tdd-red-green-refactor`, `fc-testing-methodologies`.

## The skills that matter most for legacy work

| Skill | What it gives you |
| ----- | ----------------- |
| `fc-safe-legacy-patching` | Michael Feathers' techniques: characterization tests, sprout methods, wrap methods, seam identification |
| `fc-blast-radius-analysis` | Predicts behavioral deltas before any change — callers, callees, DB, API, UI |
| `fc-hypothesis-driven-investigation` | Replaces grep-and-guess debugging with ranked, falsifiable hypotheses |
| `fc-git-forensics` | Blame, authorship, churn, regression candidates around a suspect file |
| `fc-toyota-5-whys` | Forces evidence at each "why" level — distinguishes verified from hypothesized |
| `fc-confidence-calibration` | Scores how strong the evidence behind a conclusion actually is |

You can invoke any of these standalone in your AI assistant, before reaching for a full agent.

## What to avoid in the first month

- **Do not start with greenfield-shaped tasks.** New service designs are not where the brownfield agents shine. Use the bug RCA loop first.
- **Do not run the agents on code you do not own.** Findings are most useful where your team can act on them.
- **Do not skip the test-first step in legacy code.** `@fc-bug-sushruta` writes a failing test before applying any fix — keep that discipline.
- **Do not bypass the reviewer agents.** Every primary agent has a reviewer that adversarially scores its output. The reviewer pass is where most failure modes are caught.

## What to watch as a leader

After the first three weeks, the questions worth asking are:

- **Are the artifacts of consistent quality?** RCA reports, ADRs, patch reports — sample them.
- **Is anyone actually using the outputs?** If the artifacts go in `.flowcraft/case-files/` and nobody opens them, the loop is broken.
- **Are the agents flagging things your team would have missed?** That is the highest signal of value.
- **Is the team faster at the same quality bar, or producing more output at lower quality?** Only the first one is real.

## When to graduate to the platform

FlowCraft Skills is free and self-contained. The next step — visibility, ROI, governance — is what the [FlowCraft platform](https://flowcraft.systems) is for.

The signals that say it is time:

- More than 3 engineers regularly using the agents
- Multiple workflows in active use (bug RCA + design review, for example)
- Leadership starting to ask "what is AI actually delivering for us?"
- A second team interested in adopting the same agents

When those signals are present, the platform makes the value visible to people who do not read code.

## When to bring in managed enablement

Some teams want to skip the trial-and-error. If you are working in a large brownfield codebase and you want FlowCraft to handle the context engineering, agent tuning, and rollout for you, [talk to us directly](mailto:hello@flowcraft.systems).

The managed enablement engagement is built around a 30-day path to the first agent-produced artifact in your repo. After that, expansion across teams and workflows.
