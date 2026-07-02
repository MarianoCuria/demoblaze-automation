// Shared config for all k6 scripts.
// k6 runs scripts in its own JS runtime (goja), not Node — that's why this
// folder uses plain JS/CommonJS-style ESM instead of the TS used elsewhere
// in the repo. See performance/README.md for details.

export const API_BASE = __ENV.DEMOBLAZE_API_BASE || 'https://api.demoblaze.com';

// Demoblaze is a public, shared demo instance maintained by a third party,
// not infrastructure we own. Every scenario in this folder deliberately caps
// virtual users and adds think-time so the suite behaves like a handful of
// real users, not a stress attack. Bump these only against infra you control.
export const RESPONSIBLE_LOAD = {
  maxVUs: 30,
  thinkTimeMinSeconds: 1,
  thinkTimeMaxSeconds: 3,
};

export const THRESHOLDS_READ_ONLY = {
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<800', 'p(99)<1500'],
};

export const THRESHOLDS_AUTH_FLOW = {
  http_req_failed: ['rate<0.02'],
  http_req_duration: ['p(95)<1500'],
};

// Known product ids on the public Demoblaze catalog (phones/laptops/monitors).
// Kept static instead of discovered at runtime so every VU can pick a random
// one without an extra request per iteration.
export const KNOWN_PRODUCT_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export function randomProductId() {
  return KNOWN_PRODUCT_IDS[Math.floor(Math.random() * KNOWN_PRODUCT_IDS.length)];
}

export function randomThinkTime() {
  const { thinkTimeMinSeconds, thinkTimeMaxSeconds } = RESPONSIBLE_LOAD;
  return thinkTimeMinSeconds + Math.random() * (thinkTimeMaxSeconds - thinkTimeMinSeconds);
}
