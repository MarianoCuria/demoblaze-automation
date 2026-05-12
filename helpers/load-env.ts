import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Carga `.env` desde la raíz del proyecto Playwright y rutas habituales cuando
 * el runner usa otro cwd (repo padre, extensión de VS Code, etc.).
 */
export function loadProjectEnv(): void {
  const projectRoot = path.resolve(__dirname, '..');
  const candidates = [
    path.join(projectRoot, '.env'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'demoblaze-automation', '.env'),
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file });
    }
  }

  if (!process.env.DEMOBLAZE_USERNAME?.length && process.env.EMAIL?.length) {
    process.env.DEMOBLAZE_USERNAME = process.env.EMAIL;
  }
  if (!process.env.DEMOBLAZE_PASSWORD?.length && process.env.PASSWORD?.length) {
    process.env.DEMOBLAZE_PASSWORD = process.env.PASSWORD;
  }
}
