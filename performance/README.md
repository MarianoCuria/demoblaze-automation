# Performance testing — k6

Load and latency tests for [Demoblaze](https://www.demoblaze.com/), sitting alongside the
functional Playwright suite in this same repo. Same target, different question: instead of
"does it work?", these scripts ask "does it still work — and stay fast — under concurrent load?"

---

## Why k6 (and why plain JS, not TypeScript)

k6 runs scripts in its own embedded JS runtime ([goja](https://github.com/dop251/goja)), not
Node.js. It can't execute compiled TypeScript or import from `node_modules` the way Playwright
does, so this folder is intentionally plain JS/ESM and fully decoupled from the rest of the repo's
`tsconfig`/build. That's also why it has no `package.json` of its own — `k6` is a standalone Go
binary, installed once (`brew install k6` / see [k6.io/docs](https://k6.io/docs/get-started/installation/)),
not an npm dependency.

---

## Responsible load testing

`api.demoblaze.com` is a **public, shared demo instance run by a third party** — not infrastructure
we own or pay for. Every scenario here deliberately:

- Caps peak virtual users at a modest number (`RESPONSIBLE_LOAD.maxVUs` in `../performance/config.js`,
  currently 30).
- Adds randomized think-time (`sleep(1–3s)`) between requests to mimic real user pacing instead of
  a tight request loop.
- Keeps the authenticated flow (`checkout-flow.js`) to a handful of VUs/iterations, since it
  **mutates** a real test account's cart rather than only reading data.

This is a deliberate trade-off, not a limitation: the goal of this suite is to demonstrate
performance-testing methodology (thresholds, ramping stages, contract-aware checks) for a
portfolio, not to stress a service that isn't ours to stress. Point these same scripts at
`DEMOBLAZE_API_BASE` env var pointing to infrastructure you control to push past these caps.

---

## Scenarios

| File | What it does | VUs / duration | Run |
|------|--------------|-----------------|-----|
| `scenarios/smoke.js` | 1 VU, 5 iterations through `GET /entries` + `POST /view`. Fast sanity gate — should always pass before running heavier scenarios. | 1 VU, ~10s | `npm run perf:smoke` |
| `scenarios/browse-load.js` | Ramping load on the read-only browse flow (catalog list → random product detail), with think-time between requests. | 0→20 VUs over 4 min | `npm run perf:load` |
| `scenarios/checkout-flow.js` | Authenticated flow under light concurrency: login → add to cart → view cart. Requires `DEMOBLAZE_USERNAME`/`DEMOBLAZE_PASSWORD` (same account as the Playwright suite). | 3 VUs × 3 iterations | `npm run perf:checkout` |

### Thresholds

Defined centrally in `config.js` so every scenario is judged the same way:

- **Read-only flows**: `http_req_failed` rate < 1%, `p(95)` < 800ms, `p(99)` < 1500ms.
- **Auth flow**: `http_req_failed` rate < 2%, `p(95)` < 1500ms (login is inherently slower).

k6 exits non-zero when a threshold is breached — same signal a CI job would use to fail the build.

---

## Running locally

```bash
# 1. Install k6 (once)
brew install k6            # macOS
# see https://k6.io/docs/get-started/installation/ for other OSes

# 2. Read-only scenarios — no credentials needed
npm run perf:smoke
npm run perf:load

# 3. Authenticated scenario — needs the same .env used by Playwright.
# k6 isn't Node, so it can't load .env itself — export the two vars it needs first:
set -a && source .env && set +a
npm run perf:checkout
```

### Sample output (browse-load.js, local run)

```
█ THRESHOLDS
    http_req_duration
    ✓ 'p(95)<800' p(95)=467.74ms
    ✓ 'p(99)<1500' p(99)=862.85ms
    http_req_failed
    ✓ 'rate<0.01' rate=0.00%

checks_succeeded...: 100.00% 1638 out of 1638
http_reqs..........: 1638   6.73/s
vus_max............: 20
```

---

## CI

Workflow: [`../.github/workflows/k6-performance.yml`](../.github/workflows/k6-performance.yml).

- **Weekly schedule** (`cron`) runs the smoke scenario — cheap regression check for the API
  contract/latency without hammering a third-party demo site on every push.
- **Manual dispatch** (`workflow_dispatch`) lets you pick `smoke` or `load` on demand — useful
  right before a portfolio walkthrough or interview to have a fresh green run to point to.
- `checkout-flow.js` is intentionally **not** wired into CI: it requires real account secrets and
  mutates cart state, so it's kept as a local/manual-only scenario.

---

## Interpreting results for a portfolio / interview

What to point to when talking about this suite:

1. **Thresholds as pass/fail gates**, not just eyeballing a report — same mental model as
   functional test assertions, applied to non-functional requirements.
2. **Ramping stages** (`browse-load.js`) instead of a flat VU count — shows understanding of how
   real traffic ramps up/down, and surfaces problems a constant-load test would miss (e.g. slow
   warm-up, resource exhaustion under sustained peak).
3. **Separating read-only load from mutating/authenticated load** — a load test that blindly hits
   a login+checkout endpoint at high concurrency against a shared demo account is a red flag in
   review, not a strength. Explaining *why* `checkout-flow.js` is scoped down is itself a
   senior-level talking point.
