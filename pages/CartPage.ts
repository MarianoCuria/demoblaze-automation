import type { Locator, Page } from '@playwright/test';

/**
 * Carrito, modal de orden y pantalla de confirmación (Demoblaze).
 */
export class CartPage {
  readonly page: Page;
  readonly cartNavLink: Locator;
  readonly cartRows: Locator;
  readonly totalLabel: Locator;
  readonly placeOrderButton: Locator;
  readonly orderName: Locator;
  readonly orderCountry: Locator;
  readonly orderCity: Locator;
  readonly orderCard: Locator;
  readonly orderMonth: Locator;
  readonly orderYear: Locator;
  readonly purchaseButton: Locator;
  readonly confirmationTitle: Locator;
  readonly confirmationText: Locator;
  readonly okButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartNavLink = page.locator('#cartur');
    this.cartRows = page.locator('#tbodyid tr');
    this.totalLabel = page.locator('#totalp');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.orderName = page.locator('#name');
    this.orderCountry = page.locator('#country');
    this.orderCity = page.locator('#city');
    this.orderCard = page.locator('#card');
    this.orderMonth = page.locator('#month');
    this.orderYear = page.locator('#year');
    this.purchaseButton = page.locator('#orderModal').getByRole('button', { name: 'Purchase' });
    this.confirmationTitle = page.getByRole('heading', { name: 'Thank you for your purchase!' })
    this.confirmationText = page.getByRole('heading', { name: 'Thank you for your purchase!' });
    this.okButton = page.locator('.confirm');
  }

  async gotoFromNav(): Promise<void> {
    await this.cartNavLink.click();
  }

  async openPlaceOrderModal(): Promise<void> {
    await this.placeOrderButton.click();
  }

  async fillOrderForm(fields: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }): Promise<void> {
    await this.orderName.fill(fields.name);
    await this.orderCountry.fill(fields.country);
    await this.orderCity.fill(fields.city);
    await this.orderCard.fill(fields.card);
    await this.orderMonth.fill(fields.month);
    await this.orderYear.fill(fields.year);
  }

  async purchase(): Promise<void> {
    await this.purchaseButton.click();
  }
}
