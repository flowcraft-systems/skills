# FlowCraft Skills

> **A specialized AI engineering crew for brownfield codebases — inside GitHub Copilot and Claude Code. One command to install.**

[![npm](https://img.shields.io/npm/v/@flowcraft.systems/skills)](https://www.npmjs.com/package/@flowcraft.systems/skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

---

## Install now

```bash
npx @flowcraft.systems/skills install
```

Pick your platform — **GitHub Copilot**, **Claude Code**, or **both** — and commit the result. Your whole team gets it automatically.

---

## Built for the codebase you actually have

Most AI tooling is designed for greenfield projects. Your team is working with something real: a production codebase that predates comprehensive test coverage, where bugs require tracing behavior across multiple services, where changes carry hidden blast radius.

FlowCraft Skills gives your AI assistant **discipline** for exactly that environment — structured multi-pass workflows, proven methodologies, and automatic artifact management. The same system your best engineers would follow, encoded and repeatable.

Works with **GitHub Copilot** (`.github/agents/` + `.github/skills/`) and **Claude Code** (`.claude/agents/` + `.claude/rules/`). Same agents, same skills, native format for each platform.

---

## The problem it solves

**For engineers:** Raw AI on a production bug gives you suggestions, not structure. No hypothesis ranking. No blast-radius analysis. No RCA artifact for your Jira ticket. No evidence trail.

**For architects:** AI with no context on your system makes dangerous recommendations. Unguided changes in brownfield code have hidden blast radius. Institutional knowledge disappears between onboardings.

**For VPs of Engineering:** AI adoption is happening across your teams — but there is no way to know if outputs are trustworthy, whether teams are using it safely, or whether any of it is producing value your leadership can see.

FlowCraft Skills gives each layer what it needs.

---

## What just happened

You installed **13 specialized AI agents** and **17 proven methodology skills** directly into your workspace — auto-formatted for whichever platform you chose.

Not just autocomplete. An entire engineering crew:

| Agent | What it does |
| ----- | ----------- |
| **Bug Byomkesh** | Evidence-cited root cause analysis — hypothesis ranking, blast-radius, findings posted to Jira |
| **Bug Sushruta** | Safe bug patching — fails a test first, writes the minimal fix, feature-flagged |
| **Design Vishwakarma** | Architect coach — design options, ADRs, and fitness functions before you write a line |
| **Dronacharya** | Code reviewer — posts structured PR feedback to GitHub and Jira, mentor tone |
| **Test Case Chanakya** | QA designer — risk-based test suites synced directly to your test management system |
| **Narada** | Customer communicator — jargon-free incident briefings for non-technical stakeholders |
| **Incident RCA Reviewer** | Forensic auditor — independent review of production incident post-mortems |

Every primary agent ships with a **Reviewer** that adversarially scores its output before anything is posted. Quality gates built in.

---

## Your first 10 minutes

Pick a real production bug from your backlog — a P2 or P3, something your team has looked at and knows the rough area:

```text
@fc-bug-byomkesh PROJ-1234
```

The agent investigates the issue, ranks hypotheses with evidence, performs blast-radius analysis, generates corrective and preventive actions, and posts the full RCA directly to the Jira ticket — without leaving your editor.

Compare the output to what your team would have produced manually. That is the signal.

---

## A real workflow in two lines

```text
@fc-bug-byomkesh PROJ-1234
@fc-bug-sushruta .flowcraft/case-files/rca/2026-04-08--PROJ-1234--payment-failure/rca-report.md
```

Bug investigated → root cause cited with evidence → failing test written → minimal fix applied → patch report posted to Jira.

---

## Skills built for legacy and brownfield work

The methodology skills bundled here are particularly valuable for teams working in production codebases with accumulated complexity:

| Skill | When to use |
| ----- | ----------- |
| `fc-safe-legacy-patching` | Michael Feathers' characterization tests, sprout methods, seam identification for untested code |
| `fc-blast-radius-analysis` | Before changing anything — understand every caller, dependency, and downstream effect |
| `fc-hypothesis-driven-investigation` | Structure debugging rather than grep-and-guess; generates ranked, falsifiable hypotheses |
| `fc-git-forensics` | Understand who changed what, when, and why — critical context in any long-lived codebase |
| `fc-toyota-5-whys` | Root cause analysis that goes five levels deep with evidence at every step |
| `fc-confidence-calibration` | Score how confident the evidence actually is before acting on a hypothesis |

---

## How it works

A **skill** is a methodology playbook (`SKILL.md`) — hypothesis-driven investigation, TDD red-green-refactor, adversarial review scoring, git forensics. You can invoke any skill standalone in a Copilot chat for a quick structured answer, or let agents compose them automatically.

An **agent** orchestrates the full workflow: loads the right skills at each pass, calls Jira and GitHub, enforces quality gates, and writes structured artifacts to your repo.

**Start small.** Ask Copilot to load a single skill before a debugging session. Get structure for free. When the problem is complex enough, invoke the full agent with one command and let it run.

---

## Full install options

```bash
# Interactive — choose GitHub Copilot, Claude Code, or both
npx @flowcraft.systems/skills install

# Non-interactive — install for a specific platform
npx @flowcraft.systems/skills install --target copilot
npx @flowcraft.systems/skills install --target claude
npx @flowcraft.systems/skills install --target both

# Preview before writing anything
npx @flowcraft.systems/skills install --dry-run

# Overwrite existing files (upgrade)
npx @flowcraft.systems/skills install --force

# Skills only / agents only
npx @flowcraft.systems/skills install --skills-only
npx @flowcraft.systems/skills install --agents-only

# See what's bundled
npx @flowcraft.systems/skills list
```

**Requirements:** Node.js ≥ 18, GitHub Copilot and/or Claude Code

---

## When your team needs more

FlowCraft Skills is self-contained and free forever.

When you need visibility across the team — ROI tracking, artifact quality audits, leadership-ready reporting, and a governed operating model — that is what the [FlowCraft platform](https://flowcraft.systems) adds.

If your organization is ready for **managed enablement** — where FlowCraft handles the context engineering, workflow tuning, and rollout across multiple teams — [talk to us directly](mailto:hello@flowcraft.systems).

---

## Get started

```bash
npx @flowcraft.systems/skills install
```

Commit the installed directory (`.github/` and/or `.claude/`). Done.
