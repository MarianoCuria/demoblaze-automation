import { test, expect } from '../../fixtures/auth.fixture';
import { env } from '../../helpers/env';
import { CartPage } from '../../pages/CartPage';

const API_LOGIN = 'https://api.demoblaze.com/login';
const API_ADD_TO_CART = 'https://api.demoblaze.com/addtocart';

test('setup via API → verificación via UI', async ({ request, authenticatedPage: page }) => {
  const cartPage = new CartPage(page);

  const token = await test.step('API: login y obtener token', async () => {
    const encodedPassword = Buffer.from(env.demoblazePassword()).toString('base64');

    const loginResponse = await request.post(API_LOGIN, {
      data: {
        username: env.demoblazeUsername(),
        password: encodedPassword,
      },
    });

    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.text();
    test.skip(!body || body.includes('errorMessage'), 'API login falló — skip test');

    return body.replace(/"/g, '').replace('Auth_token: ', '').trim();
  });

  await test.step('API: agregar Samsung Galaxy S6 al carrito', async () => {
    const addResponse = await request.post(API_ADD_TO_CART, {
      data: {
        id: `${env.demoblazeUsername()}${Date.now()}`,
        cookie: token,
        prod_id: 1,
        flag: true,
      },
    });

    test.skip(addResponse.status() !== 200, 'API addtocart falló — skip test');
  });

  await test.step('UI: verificar producto en el carrito', async () => {
    await page.goto('/');
    await page.context().addCookies([
      {
        name: 'tokenp_',
        value: token,
        domain: '.demoblaze.com',
        path: '/',
      },
    ]);

    await page.goto('/cart.html');
    await expect(cartPage.cartRows.first()).toBeVisible();
    await expect(page.getByText('Samsung galaxy s6').first()).toBeVisible();
  });
});
