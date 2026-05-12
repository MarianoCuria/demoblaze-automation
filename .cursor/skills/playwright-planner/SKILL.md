---
name: playwright-planner
description: Explores the app under test and produces a Markdown test plan with user flows, steps, preferred locators, and expected outcomes. Use when the user asks to plan tests, design coverage, map DOM flows, or says Planner / planificar pruebas.
---

# Playwright test planner (Planner)

## When to apply

Activate when planning is requested before implementation: new features, refactors of flaky areas, or expanding E2E coverage.

## Workflow

1. **Gather context**
   - Read relevant page objects, fixtures, and existing specs in the repo.
   - If a URL or environment is available, infer flows from product behavior described by the user; do not invent business rules not stated or implied.

2. **Identify user flows**
   - List primary and critical alternate paths (happy path, validation errors, auth/session edge cases if applicable).
   - One flow = one cohesive user goal (e.g. “complete checkout”, “reset password”).

3. **Write the plan in Markdown**
   For each flow, include:
   - **Objective**: what behavior is proven.
   - **Preconditions**: data, auth state, feature flags if known.
   - **Steps**: numbered, user-facing actions (not implementation).
   - **Locators strategy**: for each critical interaction, specify the *preferred* Playwright locator in this order: `getByRole` → `getByLabel` → `getByTestId`. Avoid raw CSS/XPath unless justified.
   - **Assertions**: observable outcomes (URL, visible text, API side effects if in scope).
   - **Risks**: flakiness (dynamic lists, animations, third-party widgets).

4. **Traceability**
   - Map each flow to a suggested `describe` / file name so a Generator pass can implement without re-deriving structure.

## Output shape (template)

Use this structure so downstream automation stays consistent:

```markdown
## Flow: [short name]

### Objective
...

### Preconditions
- ...

### Steps
1. ...

### Locators
| Step | Element | Preferred locator |
|------|---------|-------------------|
| ... | ... | `page.getByRole(...)` |

### Expected results
- ...

### Notes / risks
- ...
```

## Constraints

- Prefer stable, accessible selectors; call out unstable UI explicitly.
- Do not output full test code here unless the user explicitly asks for a spike snippet.
