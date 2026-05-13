import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { DemoblazeCategory } from '../tests/data/categories';
/**
 * Listado por categoría y detalle de producto (Demoblaze).
 */
export class ProductPage {
  readonly page: Page;
  readonly firstProductLink: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  /** Subcadena que aparece en el título del primer producto de cada categoría en demoblaze.com (no coincide con el nombre del menú). */
  readonly expectedKeywordByCategory: Record<DemoblazeCategory, string> = {
    Phones: 'galaxy',
    Laptops: 'vaio',
    Monitors: 'monitor',
  };

  categoryLink(category: DemoblazeCategory): Locator {
    return this.page.getByRole('link', { name: category });
  }

  constructor(page: Page) {
    this.page = page;
    this.firstProductLink = page.locator('#tbodyid .card-title a').first();
    this.productTitle = page.locator('.name');
    this.productPrice = page.locator('.price-container');
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
  }

  /** Entra a categoría y abre el primer producto del listado. */
  async openFirstProductFromCategory(category: DemoblazeCategory): Promise<void> {
    await this.categoryLink(category).click();
    await expect(this.firstProductLink).toContainText(this.expectedKeywordByCategory[category], {
      ignoreCase: true,
    });
    await this.firstProductLink.click();
  }
  /**
   * Agrega al carrito y acepta el alert nativo de confirmación.
   */
  async addToCart(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.addToCartButton.click();
  }
}
