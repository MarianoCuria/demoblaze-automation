import { test, expect } from '@playwright/test';

const API_ENTRIES = '**/api.demoblaze.com/entries';

test.describe('network intercept', () => {
  test('servidor caído — grilla vacía, UI no crashea', async ({ page }) => {
    await page.route(API_ENTRIES, (route) => route.abort());
    await page.goto('/');
    await expect(page.locator('#tbodyid .card')).toHaveCount(0);
  });

  test('respuesta lenta 4s — productos cargan igual', async ({ page }) => {
    await page.route(API_ENTRIES, async (route) => {
      await new Promise((r) => setTimeout(r, 4000));
      await route.continue();
    });
    await page.goto('/');
    // La ruta retrasa la API 4s; en WebKit el pintado puede quedar justo después del timeout por defecto.
    await expect(page.locator('#tbodyid .card').first()).toBeVisible({ timeout: 15_000 });
  });

  test('lista vacía — grilla sin productos', async ({ page }) => {
    await page.route(API_ENTRIES, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ Items: [] }),
      }),
    );
    await page.goto('/');
    await expect(page.locator('#tbodyid .card')).toHaveCount(0);
  });
});