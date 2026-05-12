---
name: playwright-healer
description: Diagnoses failing Playwright tests from errors, traces, and diffs, then proposes or applies minimal fixes to locators, timing, or test logic. Use when a spec fails in CI or locally, or the user says Healer / arreglar prueba / flaky test.
---

# Playwright test healer (Healer)

## When to apply

A test fails, times out, or is flaky. Work from the **failure output first**, then code.

## Diagnostic order

1. **Read the assertion or timeout message**  
   Identify whether the failure is: strict mode violation, locator not found, unexpected navigation, race, or wrong expectation.

2. **Inspect the failing line and stack**  
   Open the spec and any page objects involved; compare with the UI meaning of the step.

3. **Use artifacts if present**  
   Prefer trace viewer, screenshots, or HTML report attachments referenced in the failure. If the user pasted logs only, reason from those.

4. **Classify root cause**

| Symptom | Likely cause | Direction |
|--------|----------------|-----------|
| Timeout waiting for locator | Wrong role/name, hidden element, wrong frame, dynamic list | Fix locator; scope container; filter by text |
| Strict mode violation | Multiple matches | Narrow with `getByRole({ name, exact })`, `filter`, or parent locator |
| Wrong assertion | Stale copy, i18n, or incorrect expected state | Update expectation or test data setup |
| Flaky pass/fail | Missing await, dependency on order, animation | Stabilize with deterministic setup; avoid arbitrary sleeps |

## Fix principles

- **Smallest change**: adjust one layer at a time (locator → assertion → flow), not rewrite the suite.
- **Prefer resilient locators**: roles and accessible names; add `data-testid` only if the plan/product allows and the repo already uses them.
- **Avoid “fixing” production bugs in tests** unless the user explicitly wants tests to document current buggy behavior temporarily—call that out.

## Response format

When explaining to the user, structure as:

1. **Root cause** (one or two sentences, evidence-based).
2. **Fix** (what changed and why).
3. **Regression risk** (what might still be flaky and how to observe it).

If implementing, change only the failing path and shared helpers if truly shared.

## If information is missing

Ask only for what unblocks diagnosis: failing command, trace path, or the last 30 lines of the error including the **first** Playwright error (not only the final timeout).
