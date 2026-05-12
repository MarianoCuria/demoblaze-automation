import type { Locator, Page } from '@playwright/test';

/**
 * Modal de login en la home de Demoblaze.
 */
export class LoginPage {
  readonly page: Page;
  readonly openLoginModal: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly logInButton: Locator;
  readonly welcomeUser: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openLoginModal = page.locator('#login2');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.logInButton = page.locator('#logInModal').getByRole('button', { name: 'Log in' });
    this.welcomeUser = page.locator('#nameofuser');
  }

  /**
   * Flujo de login: abrir modal, completar credenciales y enviar.
   */
  async login(username: string, password: string): Promise<void> {
    await this.openLoginModal.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.logInButton.click();
  }
}
