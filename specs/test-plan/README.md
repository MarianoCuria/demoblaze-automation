# Plan de pruebas E2E — PeliGo

Documentación del plan de pruebas end-to-end para **PeliGo** (`http://localhost:3001/`).

Este plan está **alineado con [`.cursorrules`](../../.cursorrules)** del repo: prioriza pensamiento de dominio y diseño antes que código, y fija criterios de implementación (POM, selectores estables, tests sobre **comportamiento observable**, tolerancia cero a selectores frágiles y a tests con varias responsabilidades).

## Contenido

| Archivo | Descripción |
|---------|-------------|
| [peligo-e2e-test-cases.md](./peligo-e2e-test-cases.md) | Casos de prueba numerados con descripción, precondiciones, pasos y resultados esperados |

## Cómo usar este plan (mentalidad `.cursorrules`)

1. **Dominio primero:** cada TC describe *qué comportamiento del producto* se valida, no *cómo* está implementado el front.
2. **Un comportamiento por automatización:** si al implementar un TC sentís que el `test` hace “demasiado”, partilo en casos más chicos o en tests separados (anti patrón: múltiples responsabilidades en un solo test).
3. **Razonamiento antes de pegar código:** analizar riesgos (datos dinámicos, nav SPA, auth) y definir aserciones observables; el plan no reemplaza ese análisis.
4. **Implementación futura (cuando pidas código explícitamente):**
   - **Arquitectura:** Page Object Model con límites claros de responsabilidad; fixtures para inyectar páginas/objetos.
   - **Patrón en spec:** AAA (Arrange — Act — Assert); nombres de test que digan el comportamiento en voz alta.
   - **Localizadores (orden):** `getByRole` → `getByLabel` → `getByTestId` → CSS solo si es inevitable → **XPath último recurso** (evitar “CSS arbitrario” como primera opción).
   - **Esperas:** confiar en auto-wait de Playwright; **no** `waitForTimeout` mágicos salvo excepción documentada.
   - **Reportes:** anotar pasos relevantes con `test.step()` para que HTML/Allure sea legible para no técnicos.
5. **API / contratos:** si un flujo incluye validación de API, los contratos deben validarse con esquemas tipados (p. ej. Zod), según estándar del proyecto.

## Alcance

- Home, Tendencias, Búsqueda, Ficha de título, Mi lista, Perfil y variantes de navegación observadas en la app.

## Precondiciones generales

- Aplicación disponible en la `baseURL` configurada (por defecto `http://localhost:3001/`).
- API/catálogo operativo para listas y búsqueda.
- Datos dinámicos (títulos, conteos): los casos usan patrones o títulos de ejemplo; ajustar según entorno o seed.

## Convención de IDs

- `TC-<ÁREA>-<NNN>` — Áreas: `HOME`, `TRD` (Tendencias), `SRCH`, `TTL` (Título), `LIST` (Mi lista), `PRF` (Perfil), `NAV` (Navegación).

## Trazabilidad sugerida (implementación)

| Área | Archivo Playwright sugerido |
|------|----------------------------|
| Home | `tests/e2e/home.spec.ts` |
| Tendencias | `tests/e2e/trending.spec.ts` |
| Búsqueda | `tests/e2e/search.spec.ts` |
| Ficha título | `tests/e2e/title-detail.spec.ts` |
| Mi lista | `tests/e2e/my-list.spec.ts` |
| Perfil | `tests/e2e/profile.spec.ts` |

## Anti-patrones a vigilar (`.cursorrules`)

| Evitar | Preferir |
|--------|----------|
| Test que mezcla navegación + filtros + orden + aserciones fuertes en un solo bloque | Varios tests o `test.step` muy claros, cada uno con una intención |
| Selectores frágiles (XPath/CSS largos sin contrato) | Roles, etiquetas, `testid` acordado con desarrollo |
| Validar detalles internos del DOM o del framework | URL, textos/roles visibles, estados accesibles que el usuario también percibe |
| Copiar-pegar Page Objects gigantes | Módulos pequeños, nombres intencionales, composición |
