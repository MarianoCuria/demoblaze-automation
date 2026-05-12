import { test, expect } from '../../fixtures/auth.fixture';
import { LoginPage } from '../../pages/LoginPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { env } from '../../helpers/env';
import { categories } from '../data/categories';

test.describe('Demoblaze — flujo completo', () => {
  categories.forEach(({ category }) => {
    test(`sesion autenticada → ${category} → carrito → checkout → confirmación`, async ({
      authenticatedPage: page,
    }) => {
      const loginPage = new LoginPage(page);
      const productPage = new ProductPage(page);
      const cartPage = new CartPage(page);

      const user = env.demoblazeUsername();

      await test.step('Sesión restaurada (global setup)', async () => {
        await expect(loginPage.welcomeUser).toContainText(user, {
          ignoreCase: true,
        });
      });

      await test.step('Producto y agregar al carrito', async () => {
        await productPage.openFirstProductFromCategory(category);
        await expect(productPage.productTitle).toContainText(
          productPage.expectedKeywordByCategory[category],
          {
            ignoreCase: true,
          },
        );
        await expect(productPage.productPrice).toBeVisible();
        await productPage.addToCart();
      });

      await test.step('Carrito y datos de orden', async () => {
        await cartPage.gotoFromNav();
        await expect(page).toHaveURL(/cart\.html$/);
        await expect(cartPage.cartRows.first()).toBeVisible();

        await cartPage.openPlaceOrderModal();
        await cartPage.fillOrderForm({
          name: env.checkoutName(),
          country: env.checkoutCountry(),
          city: env.checkoutCity(),
          card: env.checkoutCard(),
          month: env.checkoutMonth(),
          year: env.checkoutYear(),
        });
        await cartPage.purchase();
      });

      await test.step('Confirmación', async () => {
        await expect(cartPage.confirmationTitle).toBeVisible();
        await expect(cartPage.confirmationText).toBeVisible();
      });
    });
  });
});
