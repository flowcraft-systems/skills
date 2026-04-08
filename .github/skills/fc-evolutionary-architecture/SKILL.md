---
name: fc-evolutionary-architecture
description: >
  Neal Ford's evolutionary architecture principles for software design decisions.
  Covers fitness functions, Architecture Decision Records (ADRs), option-space
  analysis with tradeoffs, and incremental guided change. Use when designing new
  features, evaluating architectural options, writing ADRs, or defining fitness
  functions to prevent architectural regression. Independently useful for any
  design decision.
---

# Evolutionary Architecture

A standalone playbook for making architectural decisions using evolutionary principles.

## When to Use

- Designing a new feature or system component
- Evaluating multiple architectural approaches
- Writing Architecture Decision Records
- Defining fitness functions to protect architectural qualities
- Reviewing an existing design for evolutionary fitness

## Core Philosophy

1. **Coach, not dictator** — surface options with tradeoffs; let stakeholders decide
2. **Evolutionary over revolutionary** — prefer incremental change that preserves options
3. **Fitness functions over documentation** — automated checks that prove architecture works
4. **Last responsible moment** — defer irreversible decisions until you have enough data
5. **Reversibility** — prefer changes that can be undone over one-way doors

## Step 1 — Frame the Problem

Before exploring solutions, define what you're solving:

```markdown
## Problem Statement

**Business Goal**: [What business outcome are we trying to achieve?]

**Current State**: [What exists today? How does the current system handle this?]

**Trigger**: [Why are we considering a change now?]

**Non-Functional Requirements**:
| NFR | Target | Current | Priority |
|-----|--------|---------|----------|
| Response time | < 200ms p95 | 450ms p95 | Must |
| Throughput | 1000 req/s | 300 req/s | Must |
| Availability | 99.9% | 99.5% | Should |
| Data consistency | Strong | Eventual | Must |

**Constraints**: [Budget, timeline, team skills, compliance, existing contracts]
```

## Step 2 — Map Current State with Evidence

Every claim about the current system must cite code evidence:

| Component | File/Symbol | Line | Behavior |
|-----------|------------|------|----------|
| API endpoint | `ShiftController.cs:GetShifts()` | L42 | Returns all shifts for agency |
| Service layer | `ShiftService.cs:CalculateOvertime()` | L140 | Groups by calendar day |
| Data layer | `sp_GetOvertimeHours` | - | SQL sproc, reads VisitHours table |
| Frontend | `shift-list.component.ts` | L88 | Displays overtime column |

### Request Flow Map

Trace the end-to-end request flow:

```
UI → [HTTP] → BFF/Gateway → [gRPC/REST] → Service → [SQL] → Database
                                          → [HTTP] → External API
```

For each hop, document: protocol, auth, payload shape, latency.

## Step 3 — Explore the Option Space

Generate **at least 3 options** spanning different levels of change:

### Option Template

```markdown
### Option {N}: {Descriptive Name}

**Change level**: Minimal / Moderate / Strategic

**Description**: [2-3 sentences describing the approach]

**How it works**:
1. [Step 1]
2. [Step 2]
3. [Step N]

**Tradeoffs**:
| Dimension | Rating | Notes |
|-----------|--------|-------|
| Implementation effort | Low/Med/High | [specific estimate] |
| Risk | Low/Med/High | [what could go wrong] |
| Performance impact | +/-/neutral | [quantified if possible] |
| Reversibility | Easy/Hard/Irreversible | [what it locks in] |
| Operational complexity | Low/Med/High | [monitoring, deployment] |
| Team familiarity | Low/Med/High | [skills required] |
```

### Required Options

Every option-space analysis MUST include:

1. **"Do Nothing"** — What happens if we don't change? Quantify the cost of inaction.
2. **Minimal change** — Smallest modification that meets the core requirement
3. **Moderate change** — Balanced approach with some structural improvement
4. **Strategic / Platform** — Bigger investment that positions for future needs

### Anti-Patterns in Option Space

| Anti-Pattern | Why It's Harmful |
|---|---|
| **Straw-man alternative** | An obviously bad option to make another look good |
| **Missing "Do Nothing"** | Forces change without quantifying the cost of inaction |
| **Technology bias** | Options differ only in technology choice, not approach |
| **Only one real option** | If there's only one viable option, you haven't explored enough |
| **Vague tradeoffs** | "Better performance" without numbers is meaningless |

## Step 4 — Write ADRs

For each significant decision, write an Architecture Decision Record:

```markdown
# ADR-{N}: {Decision Title}

## Status
PROPOSED | ACCEPTED | SUPERSEDED

## Context
[Why is this decision needed? What forces are at play?]

## Decision
[What decision is being made? Or: what options are being presented?]

### Option A: {Name}
- Pros: [specific benefits]
- Cons: [specific drawbacks]
- Fitness function: [how to verify this option works]

### Option B: {Name}
- Pros: [specific benefits]
- Cons: [specific drawbacks]
- Fitness function: [how to verify this option works]

## Consequences
[What are the implications of this decision? What becomes easier? Harder?]

## Fitness Functions
[What automated checks will verify the decision is respected over time?]
```

### ADR Rules
- ADRs frame **decisions**, not dictate answers (unless the team has decided)
- Each ADR must have **≥ 2 options** with concrete tradeoffs
- Include a **fitness function** for each option showing how to verify it works
- Keep ADRs **short** — one page max per ADR

## Step 5 — Define Fitness Functions

Fitness functions are automated checks that protect architectural qualities:

### Types

| Type | When It Runs | What It Checks | Example |
|------|-------------|----------------|---------|
| **Build-time** | CI pipeline | Structure, dependencies, conventions | "No controller imports DAL directly" |
| **Test-time** | Test suite | Behavioral contracts | "API response time < 200ms for 100 concurrent" |
| **Runtime** | Production monitoring | Operational qualities | "p95 latency alert at > 500ms" |

### Template

```markdown
### Fitness Function: {Name}

**Architectural quality**: [What it protects — e.g., layar separation, performance]
**Type**: Build-time / Test-time / Runtime
**Trigger**: [When it runs]
**Assertion**: [The specific check, in measurable terms]
**Implementation**:
  - Tool: [ArchUnit / custom test / Azure Monitor alert / etc.]
  - Code: [snippet or description]
**Failure action**: [Build fails / Alert fires / PR blocked]
```

### Good Fitness Functions

| Quality | Fitness Function |
|---------|-----------------|
| Layer separation | "No class in BLL/ references DAL/ directly" |
| API response time | "p95 response time < 200ms in load test with 500 users" |
| Database query performance | "No query plan shows table scan on tables > 100K rows" |
| Dependency freshness | "No NuGet package older than 6 months in production" |
| Test coverage for critical paths | "Billing, auth, and payroll modules: ≥ 80% line coverage" |

## Quick Decision Framework

For smaller decisions that don't warrant full option-space analysis:

```
1. Is this reversible?
   ├── YES → Just do it. Choose the simplest option.
   └── NO → Apply the full option-space analysis above.

2. How many teams does it affect?
   ├── 1 team → Team decides, document in ADR
   └── 2+ teams → Cross-team review required

3. What's the blast radius?
   ├── Small (< 5 files) → Local decision
   └── Large (> 5 files or cross-service) → Architect review
```
