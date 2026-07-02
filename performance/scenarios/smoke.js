// Smoke test: 1 VU, a handful of iterations. Fails fast if the API contract
// or basic latency is broken before running the heavier load scenario.
// Run: npm run perf:smoke
import http from 'k6/http';
import { check, sleep } from 'k6';
import { API_BASE, THRESHOLDS_READ_ONLY, randomProductId } from '../config.js';

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: THRESHOLDS_READ_ONLY,
};

export default function () {
  const entriesRes = http.get(`${API_BASE}/entries`, {
    tags: { name: 'GET /entries' },
  });
  check(entriesRes, {
    'entries: status is 200': (r) => r.status === 200,
    'entries: has Items array': (r) => {
      const body = r.json();
      return Array.isArray(body.Items) && body.Items.length > 0;
    },
  });

  const productId = randomProductId();
  const viewRes = http.post(`${API_BASE}/view`, JSON.stringify({ id: productId }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /view' },
  });
  check(viewRes, {
    'view: status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
