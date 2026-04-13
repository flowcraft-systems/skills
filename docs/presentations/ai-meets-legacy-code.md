---
marp: true
theme: default
paginate: true
size: 16:9
footer: AI Meets Legacy Code
style: |
  section {
    font-family: "Aptos", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    background: #f6f3eb;
    color: #14263d;
    padding: 54px 64px;
    line-height: 1.25;
  }

  section.lead {
    background: linear-gradient(145deg, #0f2742 0%, #19486a 55%, #d26a2c 100%);
    color: #ffffff;
  }

  section.closing {
    background: linear-gradient(145deg, #14263d 0%, #204e68 60%, #f2b14a 100%);
    color: #ffffff;
  }

  section.act {
    background: linear-gradient(145deg, #10243b 0%, #183a57 55%, #7b3f1a 100%);
    color: #ffffff;
    text-align: center;
    justify-content: center;
  }

  h1, h2, h3 {
    color: #0f3557;
    letter-spacing: -0.02em;
    margin-bottom: 0.35em;
  }

  section.lead h1,
  section.lead h2,
  section.lead h3,
  section.act h1,
  section.act h2,
  section.act h3,
  section.closing h1,
  section.closing h2,
  section.closing h3 {
    color: #ffffff;
  }

  p, li, td, th {
    font-size: 0.96em;
  }

  strong {
    color: #b6501b;
  }

  section.lead strong,
  section.act strong,
  section.closing strong {
    color: #ffd28d;
  }

  code {
    background: #e9eef5;
    color: #16385b;
    padding: 0.1em 0.3em;
    border-radius: 0.25em;
    font-size: 0.82em;
  }

  pre {
    background: #e9eef5;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 0.78em;
    line-height: 1.25;
  }

  pre code {
    background: transparent;
    padding: 0;
  }

  blockquote {
    border-left: 6px solid #f2b14a;
    padding: 0.4em 0 0.4em 1em;
    margin: 0.7em 0;
    font-size: 1em;
  }

  table {
    font-size: 0.78em;
  }

  .small {
    font-size: 0.78em;
  }
---

<!-- _class: lead -->
# AI Meets Legacy Code
## Transforming Software Engineering in the Real World

Not a story about prompts.  
A story about **understanding**, **safe change**, and **raising the productivity baseline** of entire engineering teams.

---

## What this talk is not

- Not "developers are afraid of AI"
- Not "engineers need prompt training"
- Not "code generation will save software delivery"

Most developers already use AI to write code.

The harder problem is this:

**Can AI help us understand legacy systems well enough to change them safely and sustainably?**

---

## The real bottleneck

Jeff Atwood said it plainly:

> "developers spend most of their time trying to understand code."

That is the center of gravity in legacy engineering:

- understand behavior
- diagnose defects
- estimate blast radius
- modify safely
- prove nothing important broke

**Code generation is common. Understanding is scarce.**

---

## That was my mission

As a VP of Engineering, I was trying to solve for:

- sustainable change in legacy software
- faster delivery without reckless changes
- team-wide productivity, not solo heroics
- competitiveness without pretending we were greenfield

That is where **context engineering + AI agents** became high-leverage investments.

---

## The scene we all recognize

It is late.

A customer is blocked.

The answer is hiding somewhere between:

- old SQL
- multiple services
- a UI another team touched
- issue comments
- unwritten business rules

The real question is not "Who can write the fix?"

It is: **Who can still explain how the system really works?**

---

<!-- _class: act -->
# Act I
We did not need better prompts.

We needed a better world model.

---

## The breakthrough: context engineering

We stopped asking:

**"How do we get AI to write more code?"**

and started asking:

**"How do we give AI enough context to understand the system the way our best engineers do?"**

That changed the game.

`AI usefulness = code context x architecture context x domain context x institutional memory x safety feedback loops`

---

## What that meant in practice

We built a workspace that acts as a reasoning surface:

- multiple codebases in one place
- architecture and domain-model context alongside code
- persistent artifacts for RCA, design, review, and testing
- live links into issue tracking, source control, and test management

The repo stopped being a checkout.

It became a **map** and a **memory**.

---

## Not just autocomplete. An engineering crew.

Publicly available today through **FlowCraft Skills**:

- **13 specialized AI agents**
- **17 methodology skills**
- reviewer agents built in as quality gates

Core agents:

| Agent | What it does |
| --- | --- |
| `Bug Byomkesh` | evidence-cited root cause analysis |
| `Bug Sushruta` | safe bug patching with tests first |
| `Design Vishwakarma` | design options, ADRs, fitness functions |
| `Dronacharya` | structured code review and mentoring feedback |
| `Test Case Chanakya` | risk-based QA design |
| `Narada` | clear stakeholder communication |

---

## Open source. One command.

```bash
npx @flowcraft.systems/skills install
```

Supports:

- GitHub Copilot
- Claude Code
- or both in one workspace

Open source repo:

`https://github.com/flowcraft-systems/skills`

Install it, commit the generated directories, and your whole team inherits the same discipline.

---

## Why this matters

Raw AI on a production problem gives you suggestions.

What engineering teams actually need is structure:

- hypothesis ranking
- evidence trails
- blast-radius analysis
- ADRs before implementation
- regression artifacts that outlive the incident

That is what methodology-encoded agents provide.

---

<!-- _class: act -->
# Act II
Once the agents could see the world,

they started helping teams understand it.

---

## What improved first

Three things got noticeably better:

1. **RCA** stopped being a guess and became a causal narrative
2. **Design work** stopped being vague advice and became implementation-ready ADRs
3. **Test design** stopped living in people's heads and became repeatable regression coverage

In other words:

AI started reducing the **cost of understanding**.

---

## Real world — Apache DevLake, in the open

**Bug:** [GitHub #8708](https://github.com/apache/incubator-devlake/issues/8708) — severity P0. Every Bitbucket PR sync fails with a `time.ParseError` after a routine feature merge. Blocks all users upgrading to v1.0.3-beta9.

`fc-bug-byomkesh` ran against the open-source repo and posted the full RCA as a **public GitHub comment**:

- 4 ranked, falsifiable hypotheses with confidence scores
- 9-piece evidence ledger — every claim tied to a file and line number
- Toyota 5 Whys tracing a **latent 2023 regex defect** activated by a December 2025 PR
- Blast-radius analysis across 60+ usages of the shared `Iso8601Time` type
- Corrective actions with working Go code and rollback instructions
- Preventive actions covering test gaps, lint rules, and documentation
- PR alignment review of the contributor's independent fix

All of it visible at: `github.com/apache/incubator-devlake/issues/8708#issuecomment-4205251356`

---

## 23 minutes, not 7 hours

| Task | Human estimate | Agent |
| --- | --- | --- |
| Bug triage + issue intake | 30 min | < 1 min |
| Code tracing, hypotheses, blame analysis | 3–4 hrs | ~10 min |
| `iso8601time.go` regex forensics + Go time research | 2 hrs | included |
| Corrective/preventive planning + blast-radius | 1–2 hrs | ~5 min |
| Fix implementation + test writing | 30–60 min | ~5 min |
| PR alignment review | 45 min | ~2 min |
| **Total** | **7–9 hours** | **~23 minutes** |

> "A developer under production pressure would likely spend 4–6 hours before finding the correct `DateTimeFormats` entry — and might fix only half the root cause, leaving the issue partially unresolved."

That is the **human under duress** counterfactual.  
That is the baseline this raises.

---

## The leverage was not "10x coding"

The leverage showed up somewhere more important:

- faster truth-finding on bugs
- lower cost to trace behavior across layers
- easier access to architecture and domain knowledge
- less dependency on a few people carrying all the context
- better preservation of lessons after incidents and design work

This is how the **baseline productivity of a team** starts to rise.

---

<!-- _class: act -->
# Act III
Then came the twist:

understanding improved faster than safety.

---

## This is where AI-first narratives often fail

They assume the barrier is:

- fear of AI
- poor prompting
- lack of developer curiosity

That is the wrong diagnosis.

Developers are already using AI.

The real constraint is whether the system around them allows **safe change**.

---

## Accuracy without safety is still dangerous

AI can produce a strong RCA or design packet and still be unsafe to let loose on changes if:

- tests are missing
- the test runner is not trustworthy
- pull requests are not protected
- local verification is painful
- database logic has no real safety net

In legacy environments, **safety is the real platform**.

Without it, autonomy is theater.

---

## So the next chapter is safety engineering

For legacy teams, that means:

- characterization tests around fragile behavior
- real PR-triggered build and test gates
- better local verification loops
- explicit engineering constitutions for agents
- SQL/database test harnesses such as **`tSQLt`** where needed

Only then does autonomous change move from exciting to credible.

---

## For managers and leaders: the next layer is observability

FlowCraft Analytics is an upcoming beta product at:

`https://flowcraft.systems/`

Public positioning:

> "Measure the ROI of every AI agent run"

> "Flowcraft captures every AI agent session, calculates time savings, and serves a live analytics dashboard."

Cloud-hosted, ready in minutes, with enterprise self-hosting for teams that need it.

---

## Why that matters

Leaders need more than anecdotes.

They need to see:

- which agents are actually used
- where time savings are real
- which workflows are producing value
- where adoption is shallow vs. operational

This is the bridge from experimentation to management visibility.

---

## The invitation

If this resonates, start with the open source package:

```bash
npx @flowcraft.systems/skills install
```

Repo:

`https://github.com/flowcraft-systems/skills`

It is freely available, open to contribution, and intended to grow in the open so we all learn together.

---

<!-- _class: closing -->
# Final thought

The future of AI in software engineering is not just faster code generation.

It is faster, deeper, more durable **understanding**.

That is what moves legacy systems.

That is what raises the productivity baseline of a whole team.

And that is why context engineering plus AI agents is one of the highest-leverage investments we can make in the craft.
