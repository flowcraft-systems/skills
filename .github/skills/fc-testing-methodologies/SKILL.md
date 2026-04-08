---
name: fc-testing-methodologies
description: >
  Modern software testing frameworks for your project: Risk-Based Testing with risk matrices and test management field mapping, Context-Driven Testing, Exploratory Testing with session-based approach, Model-Based Testing, and Behavior-Driven Development. Use when designing or reviewing test cases for any the project feature.
---

# Testing Methodologies Skill

> Load this skill when generating test cases using modern testing methodologies.
> Provides frameworks for Risk-Based Testing, Context-Driven Testing, Session-Based Testing,
> Exploratory Testing, Model-Based Testing, and Behavior-Driven Testing.

---

## 1. Risk-Based Testing (RBT)

### Principles
Risk-Based Testing prioritizes test effort by **risk exposure** = Likelihood × Impact.
Tests with the highest risk exposure are designed, executed, and maintained first.

### Risk Assessment Matrix

| Likelihood \ Impact | Catastrophic (5) | Major (4) | Moderate (3) | Minor (2) | Trivial (1) |
|---|---|---|---|---|---|
| Almost Certain (5) | 25 🔴 | 20 🔴 | 15 🟠 | 10 🟡 | 5 🟢 |
| Likely (4)          | 20 🔴 | 16 🔴 | 12 🟠 | 8 🟡  | 4 🟢 |
| Possible (3)        | 15 🟠 | 12 🟠 | 9 🟡  | 6 🟢  | 3 🟢 |
| Unlikely (2)        | 10 🟡 | 8 🟡  | 6 🟢  | 4 🟢  | 2 🟢 |
| Rare (1)            | 5 🟢  | 4 🟢  | 3 🟢  | 2 🟢  | 1 🟢 |

### Risk Categories for Healthcare Software
- **Patient Safety**: Incorrect schedules, missed visits, wrong caregiver assignments
- **Financial / Billing**: Claims denials, incorrect invoicing, EDI errors, payment miscalculation
- **Compliance / Regulatory**: HIPAA violations, EVV data integrity, audit trail gaps
- **Data Integrity**: Lost records, duplicate entries, cross-tenant data leaks
- **Availability / Uptime**: Service outages, login failures, API timeouts
- **Security**: Authentication bypass, privilege escalation, PHI exposure

### Mapping Risk to the test management system Fields
- 🔴 Risk 15–25 → Severity: **Critical**, Priority: **High**, Type: **Regression** (or **Functional** for new features)
- 🟠 Risk 10–14 → Severity: **Critical** or **Normal**, Priority: **High/Medium**, Type: **Regression**
- 🟡 Risk 6–9  → Severity: **Normal**, Priority: **Not set**, Type: **Regression**
- 🟢 Risk 1–5  → Severity: **Normal**, Priority: **Not set**, Type: **Other** or **Regression**

> ⚠️ **Team convention note**: The the project project rarely uses Blocker, Major, Minor, or Trivial severity. Stick to Critical and Normal. Priority "Not set" is the team default — only set High or Medium for 🔴🟠 risk cases.

### Risk-Based Test Design Heuristics
1. **Boundary values** at integration points (API contracts, DB constraints)
2. **State transitions** for multi-step workflows (scheduling → visit → billing → claims)
3. **Payer-specific logic paths** (different payers = different rules = combinatorial risk)
4. **Concurrency scenarios** for multi-user/multi-tenant operations
5. **Failure modes**: What happens when dependencies fail (DB timeout, gRPC unavailable, external API down)?
6. **Data volume**: Does it work with 0 records? 1? 10,000? 100,000?

---

## 2. Context-Driven Testing (CDT)

### The Seven Principles (Cem Kaner, James Bach, Bret Pettichord)
1. The value of any practice depends on its **context**
2. There are good practices in context, but **no best practices**
3. People, working together, are the most important part of any project's context
4. Projects unfold over time in ways that are often **not predictable**
5. The product is a **solution** — if the problem isn't solved, the product doesn't work
6. Good software testing is a **challenging intellectual process**
7. Only through judgment and skill can we do the right things at the right times

### Context Factors to Capture in Test Cases
When generating test cases, always consider and document:
- **User context**: Who is the user? (Agency admin, caregiver, patient, billing staff)
- **Environmental context**: What device/browser/network? (Mobile app in field, desktop in office)
- **Data context**: What state is the data in? (Fresh install, migrated, years of accumulated data)
- **Integration context**: What external systems are involved? (Payer portals, EVV aggregators, fax services)
- **Regulatory context**: Which state/federal regulations apply? (State-specific EVV rules, Medicaid vs Medicare)

### Mapping Context to the test management system Fields
- Context factors → **Pre-conditions** (brief, one line — e.g., "User logged in as Admin on mobile device")
- User personas → **Tags** (simple words: `Caregiver`, `Admin`, `Billing`)
- Important environmental context can be noted in pre-conditions

> ⚠️ **Team convention note**: Tags in the the project project are simple feature-area words ("Client", "Payer", "Billing"). Do NOT use compound tags like `persona:caregiver`, `env:mobile-field`, or `regulation:hipaa`.

---

## 3. Exploratory Testing (ET)

### Session-Based Test Management (SBTM)
Structure exploratory testing into time-boxed sessions with charters.

### Charter Template for test management system Test Cases
```
Explore [target area]
With [resources / tools / data]  
To discover [information about quality risks]
```

### Mapping to the test management system
- Charter → Test Case **Title** (use "Verify exploring {area} reveals {risk type}" pattern, no `[ET]` prefix)
- Session notes → Test Case **Description** (optional at team's discretion)
- Discovered risks → Linked follow-up test cases
- Type: **Other** (team convention — not "Exploratory")
- Behavior: Can be **Positive**, **Negative**, or **Destructive** based on charter
- Tags: `Exploratory` (simple word, not compound)

---

## 4. Behavior-Driven Development Testing (BDD)

### Gherkin Syntax for test management system Steps

> ⚠️ **Team convention note**: The the project project exclusively uses **classic step format** (action / expected_result / data). While test management system supports Gherkin natively, the team does not use it. When generating test cases, always use classic step format. The Gherkin syntax below is for reference only — use it to derive classic steps from BDD scenarios.

test management system supports Gherkin steps natively. Use this format:

```gherkin
Feature: [Feature under test]

  Scenario: [Specific scenario title]
    Given [initial context / pre-condition]
    And [additional context]
    When [action performed]
    And [additional action]
    Then [expected outcome]
    And [additional verification]
    But [negative verification]
```

### BDD Best Practices for Automation-Ready Cases
1. **Declarative over imperative**: Write WHAT not HOW
   - Bad: `When I click the Login button`
   - Good: `When I authenticate with valid credentials`
2. **One scenario, one behavior**: Don't test multiple things
3. **Use scenario outlines for parametrization**:
   ```gherkin
   Scenario Outline: Login with different roles
     Given I am a <role> user
     When I authenticate with valid credentials
     Then I should see the <dashboard> dashboard

     Examples:
       | role         | dashboard    |
       | agency-admin | admin        |
       | caregiver    | caregiver    |
       | billing      | billing      |
   ```
4. Map Gherkin Examples → test management system **Parameters**

---

## 5. Model-Based Testing (MBT)

### State Transition Testing
For workflow-heavy features, model states and transitions:

1. Identify all **states** (e.g., Schedule: Draft → Confirmed → In-Progress → Completed → Billed)
2. Identify all **transitions** (events that cause state changes)
3. Identify **guards** (conditions that must be true for transition)
4. Generate test cases for:
   - Every valid state transition (happy path)
   - Every invalid state transition (negative path)
   - Every state with no valid exit (terminal states)

### Mapping to the test management system
- State machine diagram → Test Suite **Description** (attach diagram)
- Each transition → Individual test case
- Guards → **Pre-conditions**
- Invalid transitions → Behavior: **Negative** or **Destructive**

---

## 6. Equivalence Partitioning & Boundary Value Analysis

### Standard Partitions
For every input:
1. **Valid partition**: A representative valid value
2. **Invalid partitions**: Values outside valid range, wrong type, null/empty
3. **Boundary values**: Min-1, Min, Min+1, Max-1, Max, Max+1

### Mapping to the test management system
- Each partition → Separate test management case OR parametrized case
- Partition values → test management system **Parameters** (enables multiple iterations in a test run)
- Data in step → Use the **Data** field in Classic steps

---

## 7. Test Type Classification (test management system `Type` Field)

| test management system Type | When to Use | Team Usage |
|---|---|---|
| Regression | Default for most test cases verifying existing or changed functionality | ⭐ Primary |
| Other | General-purpose; use for exploratory charters or cases that don't fit neatly | ⭐ Primary |
| Functional | New feature verification (business logic, not yet in regression) | Occasional |
| Smoke | Quick sanity after deployment | Rare |
| Security | Authentication, authorization, data protection | Rare |
| Usability | User experience, accessibility | Rare |
| Performance | Load, stress, response time | Rare |
| Acceptance | User story acceptance criteria | Rare |

> ⚠️ **Team convention note**: The the project project overwhelmingly uses **Regression** and **Other**. Default to Regression for standard cases. Only use specialized types when the test case genuinely targets that concern.

---

## 8. Automation-Readiness Checklist

Every test case generated MUST be designed for future automation. Apply these rules:

1. **Deterministic**: Same inputs → same outputs. No "verify it looks correct" — specify exact expected values.
2. **Independent**: No test case depends on another test case's execution or side effects.
3. **Idempotent**: Running the test twice produces the same result (or the test cleans up after itself via post-conditions).
4. **Data-specified**: All test data is explicit in the steps or parameters — no "use some valid data".
5. **Observable**: Every step has a verifiable expected result, not just the final step.
6. **Atomic**: Tests a single behavior. If it fails, you know exactly what broke.
7. **Tagged for automation scope**: Use the test management system **Automation Status** field to indicate automation intent:
   - `Not automated` (isManual=true, toBeAutomated=false) — requires human judgment
   - `To be automated` (isManual=true, toBeAutomated=true) — ready for automation, not yet implemented
   - `Automated` (isManual=false) — already automated

> ⚠️ **Team convention note**: Do NOT use compound auto-target tags (`auto:api`, `auto:e2e`, `auto:unit`, `auto:manual-only`). The Automation Status field is sufficient.

---

## 9. test management system Field Usage Reference

### Severity Decision Tree
```
Is patient safety at risk or does it block a core workflow?
  → Yes → Critical
Does it cause data loss, corruption, or HIPAA violation?
  → Yes → Critical
Everything else:
  → Normal
```

> ⚠️ **Team convention note**: The team primarily uses **Critical** and **Normal** severity. Blocker, Major, Minor, and Trivial are rarely used. Default to Normal for most cases. Only use Critical for 🔴🟠 risk scenarios.

### Priority Decision Tree
```
Is this a 🔴 Critical risk area (patient safety, compliance, revenue)?
  → Yes → High
Is this a 🟠 High risk area (core workflow, blocking)?
  → Yes → Medium
Everything else:
  → Not set (team default)
```

> ⚠️ **Team convention note**: The team leaves Priority at "Not set" for most cases. Only set High or Medium when risk analysis clearly warrants it. "Low" is rarely used.

### Behavior Field Guidance
- **Positive**: Verifies the system does what it should (happy path)
- **Negative**: Verifies the system rejects what it should (invalid inputs, unauthorized access)
- **Destructive**: Verifies the system survives abuse (resource exhaustion, concurrent modifications, kill processes)
- **Not Set**: Only for exploratory or draft cases

### Layer Field Guidance
- **E2E**: Full user journey through UI → API → DB → Response
- **API**: Direct API/gRPC call verification (no UI)
- **Unit**: Single function/method in isolation
