---
name: fc-tdd-red-green-refactor
description: >
  Test-Driven Development protocol: Red (write failing test) → Green (minimal code
  to pass) → Refactor (clean up under test protection). Includes 7 testing theater
  anti-patterns to detect and avoid fake tests. Use when writing bug fixes, new
  features, or any code where you want test-first discipline. Independently useful
  for any development task.
---

# TDD: Red-Green-Refactor

A standalone playbook for disciplined Test-Driven Development.

## When to Use

- Fixing a bug and you want proof the fix works
- Implementing new functionality test-first
- Refactoring code and you need safety nets
- Reviewing test quality for testing theater

## The Cycle

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│   RED   │ ──→ │  GREEN  │ ──→ │ REFACTOR │
│ (fail)  │     │ (pass)  │     │ (clean)  │
└─────────┘     └─────────┘     └──────────┘
     ↑                                │
     └────────────────────────────────┘
```

## Phase 1: RED — Write a Failing Test

### Rules
1. Write the test BEFORE writing any production code
2. The test must assert the correct behavior (what SHOULD happen)
3. Run the test — it MUST fail
4. The failure message must clearly indicate what's wrong
5. If the test passes immediately, something is wrong (test may be tautological)

### For Bug Fixes
Write a test that **reproduces the bug**:
```
Given: [The conditions that trigger the bug]
When: [The action that causes the defect]
Then: [The CORRECT expected behavior — which currently fails]
```

### For New Features
Write a test that **specifies the behavior**:
```
Given: [Initial state]
When: [User/system action]
Then: [Expected outcome that doesn't work yet]
```

### Verification
```bash
# Run the test — MUST see RED (failure)
dotnet test --filter "TestName"   # .NET
npm test -- --grep "test name"    # JS/TS
pytest -k "test_name"             # Python
```

**Record the failure**: Copy the test output showing the failure. This proves the test is meaningful.

## Phase 2: GREEN — Write Minimal Code to Pass

### Rules
1. Write the **smallest possible change** that makes the test pass
2. Do NOT write "the right" design — just make it work
3. Do NOT refactor yet — ugly is fine
4. Do NOT add code that isn't needed to pass the failing test
5. Run ALL tests — the new test must pass AND no existing tests should break

### Minimal Patch Principles
- **Additive over mutative**: Prefer adding new code paths over changing existing ones
- **One concern per change**: Don't fix two things at once
- **Breadcrumb comments**: Mark changes with `// FIX: [ticket-id] - [what and why]`
- **Patch ALL duplicate locations**: If the same defective pattern exists elsewhere, fix all instances

### Verification
```bash
# Run the specific test — MUST see GREEN (pass)
dotnet test --filter "TestName"

# Run the FULL test suite — no regressions
dotnet test
```

**Record the pass**: Show the test output with the new test passing and full suite green.

## Phase 3: REFACTOR — Clean Up Under Test Protection

### Rules
1. Only refactor code that is **protected by passing tests**
2. Run tests after EVERY refactoring step
3. If any test breaks, UNDO the refactoring step immediately
4. Refactoring changes behavior of the CODE, never the TESTS (this phase)
5. Keep refactoring scope proportional to the change (small fix → small refactor)

### Safe Refactoring Moves
- Extract method/function
- Rename for clarity
- Remove duplication introduced during GREEN phase
- Simplify conditionals
- Extract constants

### Verification
After each refactoring step:
```bash
# Run full suite — MUST stay GREEN
dotnet test
```

## The 7 Testing Theater Anti-Patterns

Detect these in your own tests AND when reviewing others' tests:

| # | Anti-Pattern | What It Looks Like | Why It's Harmful |
|---|---|---|---|
| 1 | **Tautological** | `assert(true)`, `expect(x).toBe(x)` | Always passes, proves nothing |
| 2 | **Mock-Dominated** | Test mocks everything including the thing being tested | Tests the mocks, not the code |
| 3 | **Circular Verification** | Calls the production code to generate expected values | `expect(calc(x)).toBe(calc(x))` — proves code is consistent, not correct |
| 4 | **Always-Green** | Test catches exception and passes regardless | `try { riskyCode(); } catch { /* pass */ }` |
| 5 | **Implementation-Mirroring** | Test duplicates the production code logic line-by-line | Shares the same bugs as the code |
| 6 | **Assertion-Free** | Test runs code but never asserts anything | Exercises the code but verifies nothing |
| 7 | **Hardcoded-Oracle** | Expected value is a magic number with no derivation | `expect(result).toBe(47.3)` — how do you know 47.3 is correct? |

### How to Check Your Tests

For each test you write, answer these questions:
1. **Does it fail when the bug is present?** (Re-introduce the bug temporarily)
2. **Does it pass when the bug is fixed?** (Apply the fix)
3. **Does it fail for the RIGHT reason?** (Failure message is about the defect)
4. **Is the expected value independently derived?** (Not copied from production code)
5. **Would it catch a DIFFERENT bug in the same area?** (Tests behavior, not implementation)

If any answer is "no", fix the test.

## Edge Cases to Always Cover

When writing tests for a bug fix, add tests for:

| Category | Example |
|----------|---------|
| **Null / empty** | null input, empty string, empty collection |
| **Boundary values** | 0, -1, MAX_INT, exactly-at-threshold |
| **Off-by-one** | First item, last item, one-past-end |
| **Multiple items** | Single item vs collection behavior |
| **Concurrent** | Two calls at the same time (if applicable) |
| **The original bug** | Exact reproduction of reported scenario |

## Quick Checklist

Before declaring the cycle complete:

- [ ] Failing test written and failure recorded (RED)
- [ ] Minimal code change makes test pass (GREEN)
- [ ] All existing tests still pass (no regression)
- [ ] Code cleaned up under test protection (REFACTOR)
- [ ] No testing theater anti-patterns present
- [ ] Edge cases covered
- [ ] Change marked with breadcrumb comment
