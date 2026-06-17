# FlowCraft Skills

> **A specialized AI engineering crew for brownfield codebases. One command to install across 46+ AI agents.**

[![npm](https://img.shields.io/npm/v/@flowcraft.systems/skills)](https://www.npmjs.com/package/@flowcraft.systems/skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

---

## Install the skills

[SkillKit](https://github.com/rohitg00/skillkit) translates skills into your environment's format — Cursor, Windsurf, Claude Code, Gemini CLI, Codex, Amazon Q, and 40+ more.

```bash
# Install for your current agent (auto-detected)
npx skillkit@latest add flowcraft-systems/skills

# Install for a specific agent (--agent selects the target IDE)
npx skillkit@latest add flowcraft-systems/skills --agent claude-code
npx skillkit@latest add flowcraft-systems/skills --agent cursor
npx skillkit@latest add flowcraft-systems/skills --agent github-copilot

# Add to your team's .skills manifest for reproducible installs
npx skillkit@latest manifest add flowcraft-systems/skills
npx skillkit@latest manifest install   # teammates run this to sync
```

---

## Install the agents

Agents install through a **separate channel** — `skillkit add` discovers skills only, so the 11 orchestration agents need one extra step. This keeps them as true subagents (preserving each agent's `model` and reviewer pairing) rather than flattening them into skills.

```bash
# Fetch the agent definitions into a temp directory...
npx degit flowcraft-systems/skills/agents /tmp/fc-agents

# ...then translate them into your IDE's agent format

# Project-scoped (run from your project root — agents land in .claude/agents/)
npx skillkit@latest agent translate --source /tmp/fc-agents --all --to claude-code

# Global (available in every project)
npx skillkit@latest agent translate --source /tmp/fc-agents --all --to claude-code --output ~/.claude/agents

#   ...or --to cursor / --to codex / any SkillKit-supported agent
```

Each primary agent and its reviewer (11 files total) lands in your IDE's agent directory. **Run from your project root** for a project-scoped install, or pass `--output ~/.claude/agents` to make them available globally.

---

## Built for the codebase you actually have

Most AI tooling is designed for greenfield projects. Your team is working with something real: a production codebase that predates comprehensive test coverage, where bugs require tracing behavior across multiple services, where changes carry hidden blast radius.

FlowCraft Skills gives your AI assistant **discipline** for exactly that environment — structured multi-pass workflows, proven methodologies, and automatic artifact management. The same system your best engineers would follow, encoded and repeatable.

Works with **any AI agent that SkillKit supports** — Claude Code, GitHub Copilot, Cursor, Windsurf, Gemini CLI, Codex, Amazon Q, and more. No hardcoded tool dependencies.

---

## What's included

**18 methodology skills** — reusable playbooks your agent applies during any investigation or design session:

| Skill | When to use |
| ----- | ----------- |
| `fc-hypothesis-driven-investigation` | Structure debugging rather than grep-and-guess; generates ranked, falsifiable hypotheses |
| `fc-blast-radius-analysis` | Before changing anything — understand every caller, dependency, and downstream effect |
| `fc-safe-legacy-patching` | Michael Feathers' characterization tests, sprout methods, seam identification for untested code |
| `fc-git-forensics` | Understand who changed what, when, and why — critical context in any long-lived codebase |
| `fc-toyota-5-whys` | Root cause analysis that goes five levels deep with evidence at every step |
| `fc-confidence-calibration` | Score how confident the evidence actually is before acting on a hypothesis |
| `fc-tdd-red-green-refactor` | TDD discipline: fail the test first, write the minimal fix, refactor only once green |
| `fc-adversarial-review` | Structured adversarial scoring of any agent output before it drives action |
| `fc-evolutionary-architecture` | Incremental, fitness-function-driven architecture change with ADR generation |
| `fc-testing-methodologies` | Risk-based, BDD, context-driven, and exploratory testing selection framework |
| `fc-technical-to-domain-translation` | Translate technical findings into plain language for non-technical stakeholders |
| `fc-case-file-conventions` | Standard artifact directory structure and naming for investigation outputs |
| `fc-flowcraft-case-file` | Write structured case files after engineering sessions for ROI tracking |
| `fc-chunked-posting` | Post large reports to issue trackers with character limits in labeled chunks |
| `fc-roi-calculator` | Estimate time saved vs. manual effort for any AI-assisted engineering task |
| `fc-roi-summary` | Generate ROI summary tables for inclusion in case file reports |
| `fc-calculate-roi` | Calculate total ROI across a session or sprint |

**11 orchestration agents** — role-based agents that compose the skills above into full workflows:

| Agent | What it does |
| ----- | ----------- |
| **fc-bug-byomkesh** | Multi-pass evidence-cited RCA — hypothesis ranking, blast-radius, corrective/preventive actions |
| **fc-bug-byomkesh-reviewer** | Adversarially validates the RCA before it drives a patch |
| **fc-bug-sushruta** | TDD-driven patching — fails the test first, writes the minimal surgical fix |
| **fc-bug-sushruta-reviewer** | Validates patch safety, test discipline, and deployment readiness |
| **fc-design-vishwakarma** | Architect coach — multi-option design space, ADRs, and fitness functions |
| **fc-design-vishwakarma-reviewer** | Checks option diversity and tradeoff rigor in architect packets |
| **fc-code-review-dronacharya** | Coaching code review — alignment verification, 6 quality dimensions, warm mentor tone |
| **fc-test-case-chanakya** | Risk-based test design — likelihood × impact matrix, methodology selection, coverage matrix |
| **fc-test-case-chanakya-reviewer** | Validates test case quality and coverage completeness |
| **fc-customer-briefing-narada** | Translates incident findings into plain-language briefings for non-technical stakeholders |
| **fc-customer-briefing-narada-reviewer** | Checks for jargon, accuracy, and tone before publication |

Every primary agent ships with a **reviewer** that adversarially scores its output before anything is posted. Quality gates built in.

---

## A real workflow in two steps

```text
Invoke fc-bug-byomkesh with issue PROJ-1234
Invoke fc-bug-sushruta with the RCA report from the previous step
```

Bug investigated → root cause cited with evidence → failing test written → minimal fix applied → patch report written.

---

## Your first 10 minutes

Pick a real production bug from your backlog — a P2 or P3, something your team has looked at and knows the rough area.

**Before invoking:** fc-bug-byomkesh's first pass reads the issue in full. If your issue tracker is Jira, Linear, or GitHub Issues, install the matching MCP server so the agent can fetch issue data directly:

| Tracker | MCP server |
|---------|-----------|
| Jira | [mcp-atlassian](https://github.com/sooperset/mcp-atlassian) |
| Linear | [linear-mcp](https://github.com/jerhadf/linear-mcp) |
| GitHub Issues | [github MCP server](https://github.com/github/github-mcp-server) |

Without an MCP server, paste the issue description directly when you invoke the agent — it works from plain text too.

Invoke fc-bug-byomkesh with the issue ID (or description). The agent investigates, ranks hypotheses with evidence, performs blast-radius analysis, generates corrective and preventive actions, and writes a structured RCA report to your case file directory.

Compare the output to what your team would have produced manually. That is the signal.

---

## When your team needs more

FlowCraft Skills is self-contained and free forever.

When you need visibility across the team — ROI tracking, artifact quality audits, leadership-ready reporting, and a governed operating model — that is what the [FlowCraft platform](https://flowcraft.systems) adds.

If your organization is ready for **managed enablement** — where FlowCraft handles the context engineering, workflow tuning, and rollout across multiple teams — [talk to us directly](mailto:hello@flowcraft.systems).

---

## Get started

```bash
# Skills
npx skillkit@latest add flowcraft-systems/skills

# Agents
npx degit flowcraft-systems/skills/agents /tmp/fc-agents
npx skillkit@latest agent translate --source /tmp/fc-agents --all --to claude-code
```
