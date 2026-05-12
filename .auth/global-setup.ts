import fs from 'fs';
import path from 'path';
import { chromium, expect } from '@playwright/test';
import { env } from '../helpers/env';
import { loadProjectEnv } from '../helpers/load-env';
import { LoginPage } from '../pages/LoginPage';

const AUTH_JSON = path.join(__dirname, 'auth.json');

export default async function globalSetup() {
  loadProjectEnv();

  const projectRoot = path.resolve(__dirname, '..');
  const envFile = path.join(projectRoot, '.env');
  if (!process.env.DEMOBLAZE_USERNAME?.length) {
    throw new Error(
      [
        'Falta DEMOBLAZE_USERNAME en el entorno.',
        fs.existsSync(envFile)
          ? `Revisá que ${envFile} defina DEMOBLAZE_USERNAME=... (sin comillas extra).`
          : `Creá ${envFile} copiando .env.example: cp .env.example .env`,
      ].join(' '),
    );
  }

  const user = env.demoblazeUsername();
  const password = env.demoblazePassword();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await page.goto('https://www.demoblaze.com/');
  await loginPage.login(user, password);
  await expect(page.locator('#logout2')).toBeVisible();
  fs.mkdirSync(path.dirname(AUTH_JSON), { recursive: true });
  await context.storageState({ path: AUTH_JSON });
  await browser.close();
}
