---
name: playwright-generator
description: Turns an approved Markdown test plan into Playwright TypeScript specs (v1.56+), Page Objects, and fixtures following POM and AAA. Use when the user asks to implement tests from a plan, scaffold specs, or says Generator / generar pruebas.
---

# Playwright test generator (Generator)

## When to apply

Use after a plan exists (from `playwright-planner` or user-provided). If no plan exists, propose a minimal plan outline first or ask for the missing flows.

## Standards (match the repo)

- **Structure**: Page Object Model; inject pages via fixtures when the project already does.
- **Tests**: `test.describe` / `test` titles read as behavior; **Arrange → Act → Assert** inside each test.
- **Steps**: meaningful `test.step()` for report readability.
- **Locators**: `getByRole` > `getByLabel` > `getByTestId`; avoid brittle CSS/XPath unless the plan documents an exception.
- **Waits**: auto-waiting and web-first assertions (`expect(locator).toBeVisible()`); avoid fixed `waitForTimeout` except rare documented cases.
- **API checks**: if the project uses `request` + Zod, follow the same pattern for contract checks.

## Playwright syntax baseline

Target **Playwright v1.56+** APIs and project `playwright.config.ts` (projects, baseURL, storageState, etc.). Reuse existing helpers and path aliases from `tsconfig.json`.

## Implementation workflow

1. Map each planned flow to a file under the project’s spec convention (e.g. `tests/e2e/...spec.ts`).
2. Create or extend page objects only with methods that reflect user tasks (not single clicks scattered in tests).
3. Implement tests strictly from the plan’s steps and assertions; if the plan is ambiguous, resolve with the smallest reasonable assumption and note it in a short comment or PR description—not long essays in code.
4. Keep types explicit for structured data (interfaces/types for payloads and fixtures).

## Deliverables

- New or updated `*.spec.ts` files.
- Any new `pages/*.ts` or fixture wiring required for DRY, readable tests.
- Do not change unrelated production code unless the user asked for app fixes.

## Anti-patterns

- One giant test covering multiple unrelated flows.
- Copy-pasting long selector chains instead of page object methods.
- Hardcoding secrets; use env vars consistent with the repo.
