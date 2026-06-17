---
name: fc-safe-legacy-patching
description: >
  Michael Feathers' techniques for safely modifying code that lacks tests.
  Covers characterization tests, Sprout Method, Sprout Class, Wrap Method,
  and seam identification. Use when you need to change untested legacy code
  without breaking existing behavior. Independently useful for any legacy
  codebase work.
---

# Safe Legacy Patching

A standalone playbook for safely modifying legacy code, based on Michael Feathers'
_Working Effectively with Legacy Code_.

## When to Use

- You need to change code that has no tests
- You're afraid a change will break something but can't prove it
- The code is too tangled to test easily
- You need to add a feature to brittle, untested code
- You want to introduce testability incrementally

## Definition

**Legacy code** = code without tests (regardless of age or technology).
If it has no tests, you can't prove that your change doesn't break anything.

## Decision Tree: Which Technique to Use

```
Is there a test covering the code you need to change?
├── YES → Modify directly under test protection (normal TDD)
└── NO → Can you write a characterization test?
    ├── YES → Write characterization test first, then modify
    └── NO → Is the code too tangled to test?
        ├── YES → Use a Seam to isolate dependencies
        │   └── Then write characterization test
        │       └── Then modify
        └── NO → Choose based on change type:
            ├── Adding new behavior → Sprout Method or Sprout Class
            ├── Wrapping existing behavior → Wrap Method
            └── Both → Combine techniques
```

## Technique 1: Characterization Tests

**Purpose**: Document what the code CURRENTLY does (not what it SHOULD do).
These tests protect you from unintended changes.

### How to Write One

1. **Call the code** with representative inputs
2. **Observe the output** (return value, side effects, exceptions)
3. **Write an assertion** that matches the CURRENT output
4. **Repeat** for edge cases and important code paths

### Example

```csharp
// You don't know what CalculateOvertime() does for all cases,
// but you can observe and document its current behavior:

[Test]
public void CalculateOvertime_StandardWeek_ReturnsCurrentBehavior()
{
    var result = calculator.CalculateOvertime(hoursWorked: 45, rate: 25.0m);
    // Observed current output: 187.50 (5 hours × 25.0 × 1.5)
    Assert.AreEqual(187.50m, result);
}

[Test]
public void CalculateOvertime_ExactlyFortyHours_ReturnsZero()
{
    var result = calculator.CalculateOvertime(hoursWorked: 40, rate: 25.0m);
    Assert.AreEqual(0m, result); // Observed: no overtime at 40h
}

[Test]
public void CalculateOvertime_NullRate_ThrowsArgumentNull()
{
    // Observed: throws ArgumentNullException
    Assert.Throws<ArgumentNullException>(() =>
        calculator.CalculateOvertime(hoursWorked: 45, rate: null));
}
```

### Key Rules
- **Assert CURRENT behavior**, even if it's buggy — you'll fix the bug separately
- **Cover the paths you're about to change** — these are your safety net
- **Cover adjacent paths** — nearby code you might accidentally affect
- Don't try to cover everything — focus on the change area

## Technique 2: Sprout Method

**Purpose**: Add new behavior in a NEW method, call it from the existing code.
Keeps new code testable without restructuring old code.

### When to Use
- You need to ADD new behavior to an existing method
- The existing method is too large or tangled to test directly
- You want to keep new code separate and testable

### How

1. Identify where the new behavior needs to go
2. Write a NEW method that implements ONLY the new behavior
3. Write tests for the new method (normal TDD)
4. Call the new method from the appropriate point in the existing code

### Example

```csharp
// BEFORE: Existing tangled method (no tests, scary to change)
public void ProcessPayroll(int agencyId)
{
    // ... 200 lines of complex payroll logic ...
    var overtime = CalculateOvertime(hours);
    // ... more processing ...
}

// AFTER: Sprout a new testable method for overnight overtime
public decimal CalculateOvernightOvertime(Visit visit, OvertimeRule rule)
{
    // New, clean, testable method
    if (!visit.SpansMidnight) return 0m;
    var totalHours = (visit.EndTime - visit.StartTime).TotalHours;
    return rule.CalculateForHours(totalHours);
}

// Existing method gets a one-line change to call the sprout:
public void ProcessPayroll(int agencyId)
{
    // ... existing logic ...
    var overtime = visit.SpansMidnight
        ? CalculateOvernightOvertime(visit, rule)  // ← sprout call
        : CalculateOvertime(hours);
    // ... existing logic ...
}
```

## Technique 3: Sprout Class

**Purpose**: Like Sprout Method, but when the new behavior deserves its own class
(different dependencies, different responsibility).

### When to Use
- The new behavior has dependencies the existing code doesn't
- You want to keep the new logic entirely separate
- The existing class is already too large (God Object)

### How

1. Create a new class for the new behavior
2. Write tests for the new class (normal TDD — clean, testable)
3. Instantiate and call the new class from the existing code

## Technique 4: Wrap Method

**Purpose**: Execute new behavior BEFORE or AFTER existing behavior by renaming
the original and wrapping it.

### When to Use
- You need to add behavior that should run before or after existing logic
- You don't want to modify the internals of the existing method
- The existing method is called from many places

### How

```csharp
// BEFORE
public void ProcessVisit(Visit visit)
{
    // Complex existing logic you don't want to touch
}

// AFTER
// Step 1: Rename original
private void ProcessVisit_Original(Visit visit)
{
    // Complex existing logic (unchanged)
}

// Step 2: New wrapper with the original name
public void ProcessVisit(Visit visit)
{
    ValidateOvernightRules(visit);   // ← NEW behavior (before)
    ProcessVisit_Original(visit);     // ← Original behavior
    AuditVisitProcessing(visit);      // ← NEW behavior (after)
}

// Step 3: New methods are testable independently
public void ValidateOvernightRules(Visit visit) { /* testable */ }
public void AuditVisitProcessing(Visit visit) { /* testable */ }
```

## Technique 5: Seam Identification

**Purpose**: Find points where you can substitute behavior without modifying
the source code, enabling testability.

### Types of Seams

| Seam Type | How to Use It | Example |
|-----------|-------------|---------|
| **Object seam** | Override a method in a subclass | Virtual method → test subclass overrides it |
| **Interface seam** | Extract an interface, inject test double | `IPayrollCalculator` → mock in tests |
| **Preprocessor seam** | Compile-time substitution | `#if TEST` blocks (use sparingly) |
| **Link seam** | Substitute at link/DI time | Dependency injection in .NET/Spring |

### Finding Seams

Look for these patterns in the code:
1. **`new` keyword** — constructor call creates a hard dependency → extract to interface
2. **Static method call** — can't override → wrap in instance method
3. **Database call** — direct SQL → extract to repository interface
4. **File/network I/O** — direct access → extract to abstraction
5. **Global/singleton** — shared state → inject as parameter

### Example: Breaking a Database Dependency

```csharp
// BEFORE: Hard dependency on database (untestable)
public decimal GetOvertime(int employeeId)
{
    var hours = Database.ExecuteScalar("SELECT SUM(Hours) ...");  // ← hard dep
    return CalculateOvertime(hours);
}

// AFTER: Seam via interface injection (testable)
public decimal GetOvertime(int employeeId, IHoursRepository repo)
{
    var hours = repo.GetTotalHours(employeeId);  // ← seam: injectable
    return CalculateOvertime(hours);
}
```

## The Legacy Code Change Algorithm

For any change to legacy code, follow this sequence:

1. **Identify change points** — What code needs to change?
2. **Find test points** — Where can you observe the effects?
3. **Break dependencies** — Use seams to make it testable
4. **Write characterization tests** — Document current behavior
5. **Make the change using TDD** — RED → GREEN → REFACTOR
6. **Verify characterization tests still pass** — No unintended side effects

## Safety Rules

- **Never change production code and tests in the same commit** if you can avoid it
- **Run characterization tests after EVERY change** — they're your safety net
- **If a characterization test breaks, STOP** — you changed behavior unintentionally
- **Small steps** — each change should be independently reversible
- **Don't refactor and add features simultaneously** — one change type at a time
