# FlowCraft Skills

> **A specialized AI engineering crew — inside GitHub Copilot and Claude Code. One command to install.**

[![npm](https://img.shields.io/npm/v/@flowcraft.systems/skills)](https://www.npmjs.com/package/@flowcraft.systems/skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

---

## Install now

```bash
npx @flowcraft.systems/skills install
```

Pick your platform — **GitHub Copilot**, **Claude Code**, or **both** — and commit the result. Your whole team gets it automatically.

---

## What just happened

You installed **13 specialized AI agents** and **17 proven methodology skills** directly into your workspace — auto-formatted for whichever platform you chose.

Not just autocomplete. An entire engineering crew:

| Agent | What it does |
| ----- | ----------- |
| **Bug Byomkesh** | Investigates bugs — evidence-cited root cause, blast-radius analysis, findings posted to Jira |
| **Bug Sushruta** | Patches bugs the right way — fails a test first, writes the fix, feature-flagged |
| **Design Vishwakarma** | Architect coach — design options, ADRs, and fitness functions before you write a line |
| **Dronacharya** | Code reviewer — posts structured PR feedback to GitHub and Jira, mentor tone |
| **Test Case Chanakya** | QA designer — risk-based test suites synced directly to your test management system |
| **Narada** | Customer communicator — jargon-free incident briefings for non-technical stakeholders |
| **Incident RCA Reviewer** | Forensic auditor — independent review of production incident post-mortems |

Every primary agent ships with a **Reviewer** that adversarially scores its output before anything is posted. Quality gates built in.

---

## The problem it solves

AI coding assistants are powerful. But raw AI on a production bug gives you suggestions, not structure. No hypothesis ranking. No blast-radius analysis. No RCA artifact for your Jira ticket. No evidence trail.

FlowCraft Skills gives your AI assistant **discipline** — structured multi-pass workflows, proven methodologies, and automatic artifact management. The same system your best engineers would follow, encoded and repeatable.

Works with **GitHub Copilot** (`.github/agents/` + `.github/skills/`) and **Claude Code** (`.claude/agents/` + `.claude/rules/`). Same agents, same skills, native format for each platform.

---

## How it works

A **skill** is a methodology playbook (`SKILL.md`) — hypothesis-driven investigation, TDD red-green-refactor, adversarial review scoring, git forensics. You can invoke any skill standalone in a Copilot chat for a quick structured answer, or let agents compose them automatically.

An **agent** orchestrates the full workflow: loads the right skills at each pass, calls Jira and GitHub, enforces quality gates, and writes structured artifacts to your repo.

**Start small.** Ask Copilot to load a single skill before a debugging session. Get structure for free. When the problem is complex enough, invoke the full agent with one command and let it run.

---

## A real workflow in two lines

```text
@fc-bug-byomkesh PROJ-1234
@fc-bug-sushruta case-files/rca/2026-04-08--PROJ-1234--payment-failure/rca-report.md
```

Bug investigated → root cause cited with evidence → failing test written → minimal fix applied → patch report posted to Jira. All without leaving your editor.

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

## Get started

```bash
npx @flowcraft.systems/skills install
```

Commit the installed directory (`.github/` and/or `.claude/`). Done.
