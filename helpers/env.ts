/**
 * Variables de entorno exigidas para E2E Demoblaze.
 * Si falta una, el test falla con mensaje claro.
 */
function requireEnv(name: string): string {
  const v = process.env[name];
  if (v === undefined || v.length === 0) {
    throw new Error(
      `Falta variable de entorno ${name}. Copiá .env.example a .env y completá los valores.`,
    );
  }
  return v;
}

export const env = {
  /** Usuario registrado en Demoblaze */
  demoblazeUsername: () => requireEnv('DEMOBLAZE_USERNAME'),
  demoblazePassword: () => requireEnv('DEMOBLAZE_PASSWORD'),

  checkoutName: () => requireEnv('CHECKOUT_NAME'),
  checkoutCountry: () => requireEnv('CHECKOUT_COUNTRY'),
  checkoutCity: () => requireEnv('CHECKOUT_CITY'),
  checkoutCard: () => requireEnv('CHECKOUT_CARD'),
  checkoutMonth: () => requireEnv('CHECKOUT_MONTH'),
  checkoutYear: () => requireEnv('CHECKOUT_YEAR'),
};
