// Authenticated flow under light load: login -> add to cart -> view cart.
// Deliberately small scale (few VUs, few iterations): unlike the read-only
// browse scenario, this one *mutates* state on a real test account's cart,
// so hammering it would just pollute the account rather than measure
// anything useful. Treat this as a "capacity smoke test" for the auth path,
// not a full load test.
//
// Requires DEMOBLAZE_USERNAME / DEMOBLAZE_PASSWORD env vars (same account
// used by the Playwright suite — see .env.example).
// Run: npm run perf:checkout
import http from 'k6/http';
import encoding from 'k6/encoding';
import { check, sleep, fail } from 'k6';
import { API_BASE, THRESHOLDS_AUTH_FLOW, randomProductId } from '../config.js';

const USERNAME = __ENV.DEMOBLAZE_USERNAME;
const PASSWORD = __ENV.DEMOBLAZE_PASSWORD;

export const options = {
  scenarios: {
    checkout_smoke: {
      executor: 'per-vu-iterations',
      vus: 3,
      iterations: 3,
    },
  },
  thresholds: THRESHOLDS_AUTH_FLOW,
};

export function setup() {
  if (!USERNAME || !PASSWORD) {
    fail(
      'Missing DEMOBLAZE_USERNAME / DEMOBLAZE_PASSWORD env vars. Copy .env.example to .env and export them, or pass with --env.',
    );
  }
}

export default function () {
  const encodedPassword = encoding.b64encode(PASSWORD);

  const loginRes = http.post(
    `${API_BASE}/login`,
    JSON.stringify({ username: USERNAME, password: encodedPassword }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'POST /login' } },
  );
  const loginOk = check(loginRes, {
    'login: status is 200': (r) => r.status === 200,
    'login: no errorMessage': (r) => !r.body.includes('errorMessage'),
  });
  if (!loginOk) {
    return; // don't chain add-to-cart on a failed login
  }

  const token = loginRes.body.replace(/"/g, '').replace('Auth_token: ', '').trim();
  sleep(1);

  const addRes = http.post(
    `${API_BASE}/addtocart`,
    JSON.stringify({
      id: `${USERNAME}${Date.now()}${__VU}`,
      cookie: token,
      prod_id: randomProductId(),
      flag: true,
    }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'POST /addtocart' } },
  );
  check(addRes, {
    'addtocart: status is 200': (r) => r.status === 200,
  });
  sleep(1);

  const viewCartRes = http.post(
    `${API_BASE}/viewcart`,
    JSON.stringify({ cookie: token }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'POST /viewcart' } },
  );
  check(viewCartRes, {
    'viewcart: status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
