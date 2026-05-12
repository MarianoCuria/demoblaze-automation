import { test, expect } from '@playwright/test';
import { EntriesResponseSchema } from '../../helpers/schemas';

test('firstApi', async ({ request }) => {
  const response = await request.get('https://api.demoblaze.com/entries');
  expect(response.status()).toBe(200);
  const body = await response.json();
  const parsedBody = EntriesResponseSchema.parse(body);
  expect(parsedBody.Items.length).toBeGreaterThan(0);
});