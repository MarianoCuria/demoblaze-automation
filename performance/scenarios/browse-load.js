// Load test for the read-only browsing flow: catalog list -> product detail.
// Ramps up to a deliberately modest peak (see RESPONSIBLE_LOAD in config.js)
// because api.demoblaze.com is a shared public demo instance, not infra we
// own. This mimics a small wave of real users browsing, not a stress attack.
//
// Run: npm run perf:load
// Custom peak: k6 run --env PEAK_VUS=15 performance/scenarios/browse-load.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import {
  API_BASE,
  RESPONSIBLE_LOAD,
  THRESHOLDS_READ_ONLY,
  randomProductId,
  randomThinkTime,
} from '../config.js';

const peakVUs = Math.min(Number(__ENV.PEAK_VUS) || 20, RESPONSIBLE_LOAD.maxVUs);

export const options = {
  scenarios: {
    browse_catalog: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: Math.round(peakVUs / 2) }, // warm-up
        { duration: '1m', target: peakVUs }, // ramp to peak
        { duration: '2m', target: peakVUs }, // sustained peak
        { duration: '30s', target: 0 }, // cool-down
      ],
    },
  },
  thresholds: THRESHOLDS_READ_ONLY,
};

export default function () {
  const entriesRes = http.get(`${API_BASE}/entries`, {
    tags: { name: 'GET /entries' },
  });
  check(entriesRes, {
    'entries: status is 200': (r) => r.status === 200,
  });

  sleep(randomThinkTime());

  const productId = randomProductId();
  const viewRes = http.post(`${API_BASE}/view`, JSON.stringify({ id: productId }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /view' },
  });
  check(viewRes, {
    'view: status is 200': (r) => r.status === 200,
  });

  sleep(randomThinkTime());
}
