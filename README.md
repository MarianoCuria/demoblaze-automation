# Demoblaze — Playwright automation

End-to-end and API-level automated tests for [Demoblaze](https://www.demoblaze.com/), a demo e-commerce site. The suite is structured for clarity, CI on GitHub Actions, and portfolio use.

---

## What this suite tests

| Area | Focus |
|------|--------|
| **E2E purchase flow** | Authenticated session, browse by category (Phones / Laptops / Monitors), add to cart, place order with checkout form, confirmation. |
| **Network behaviour** | Route interception on the public catalog API (`entries`): aborted calls, delayed responses, empty payloads — UI should stay stable. |
| **API + UI hybrid** | Login and add-to-cart via HTTP APIs, then assert cart contents in the browser (`@smoke` style flow). |
| **API contract** | `GET https://api.demoblaze.com/entries` validated with **Zod** schemas so response shape is enforced, not only `200`. |
| **Performance** | k6 scenarios (smoke + ramping load) against the read-only browse flow and the authenticated login/cart flow, with latency/error-rate thresholds. See [`performance/README.md`](performance/README.md). |

All UI tests target `https://www.demoblaze.com` (`baseURL` in Playwright config).

---

## Tech stack

- **Playwright** (TypeScript) — Chromium, Firefox, WebKit on CI  
- **Zod** — response parsing / contract checks  
- **dotenv** — local environment loading (`helpers/load-env.ts`)  
- **k6** — load/performance testing (see [`performance/`](performance/))

---

## Project layout

| Path | Role |
|------|------|
| `pages/` | Page Object Model (login, products, cart, etc.) |
| `fixtures/` | Custom test fixtures (e.g. `authenticatedPage`) |
| `.auth/global-setup.ts` | One-time login; writes `storageState` to `.auth/auth.json` |
| `tests/e2e/` | UI specs (`*.spec.ts`) |
| `tests/api/` | API-only specs |
| `helpers/` | Env helpers, Zod schemas, shared utilities |
| `performance/` | k6 load/performance scenarios — see its own [README](performance/README.md) |
| `.github/workflows/playwright.yml` | CI pipeline (functional tests) |
| `.github/workflows/k6-performance.yml` | CI pipeline (performance tests, scheduled + manual) |

---

## Patterns used

- **Page Object Model (POM)** — UI interactions and locators live in `pages/`, not scattered inside every test.  
- **Fixtures** — `fixtures/auth.fixture.ts` extends the base test with an `authenticatedPage` wired to the saved session.  
- **Global setup** — Logs in once before the run, persists cookies/storage to `.auth/auth.json` so tests reuse a real session (requires valid credentials).  
- **Contract-style API checks** — Typed validation of JSON payloads (e.g. `EntriesResponseSchema`) instead of only checking status codes.

---

## Prerequisites

- **Node.js** (LTS recommended, same as CI)  
- **npm**

---

## Run tests locally

1. **Install dependencies**

   ```bash
   npm ci
   ```

2. **Install browsers** (first time or after Playwright upgrade)

   ```bash
   npx playwright install
   ```

3. **Environment variables**

   Copy the example file and fill in real values (user must already exist on Demoblaze — use **Sign up** on the site if needed):

   ```bash
   cp .env.example .env
   ```

   Required keys (see `.env.example`):

   - `DEMOBLAZE_USERNAME`, `DEMOBLAZE_PASSWORD`  
   - `CHECKOUT_NAME`, `CHECKOUT_COUNTRY`, `CHECKOUT_CITY`, `CHECKOUT_CARD`, `CHECKOUT_MONTH`, `CHECKOUT_YEAR` (fake checkout data is fine)

4. **Execute the suite**

   ```bash
   npm run test:e2e
   ```

   Interactive UI mode:

   ```bash
   npm run test:e2e:ui
   ```

5. **HTML report** (after a run)

   ```bash
   npx playwright show-report
   ```

---

## CI — GitHub Actions

Workflow file: [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml).

- **Triggers:** push and `pull_request` targeting `main` or `master`.  
- **Steps:** checkout → Node LTS → `npm ci` → `npx playwright install --with-deps` → `npx playwright test`.  
- **Artifacts:** HTML report uploaded as `playwright-report` (retained 30 days).

### Required repository secrets

Configure under **Settings → Secrets and variables → Actions**:

| Secret | Purpose |
|--------|---------|
| `DEMOBLAZE_USERNAME` | Demoblaze account used in global setup and tests |
| `DEMOBLAZE_PASSWORD` | Account password |

Checkout-related variables for the Place Order modal are set as non-secret test data in the workflow (aligned with `.env.example`).

---

## Portfolio: green pipeline screenshot

For interviews or your portfolio README fork:

1. Open **Actions** in GitHub after a successful run.  
2. Capture the run with a **green** status (or the PR checks panel).  
3. Save the image in this repo (e.g. `docs/ci-green.png`) and reference it from your site or CV:

   ```markdown
   ![Playwright CI passing](docs/ci-green.png)
   ```

Until you have a green run, use the **Actions** tab URL of your repository as the live proof of CI.

---

## Related docs in this repo

- `specs/README.md` and `specs/test-plan/` — planning / test-case notes where applicable.

---

## License

See `package.json` (`license` field). Demoblaze is a third-party demo site; use credentials and checkout data only for automation, not for real payments.
