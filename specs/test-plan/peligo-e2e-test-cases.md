# PeliGo — Casos de prueba E2E

**Base URL:** `http://localhost:3001/`  
**Producto:** PeliGo — Encontrá dónde verlo (Argentina)

## Alineación con `.cursorrules`

- Cada caso valida **comportamiento observable** para el usuario (qué ve, a dónde navega), no detalles de implementación.
- Al **automatizar**, un `test` debe tener **una responsabilidad clara**; los casos que listan varias acciones seguidas (p. ej. recorrer todos los filtros) son válidos como *matriz de prueba manual* o checklist, pero en código conviene **partirlos** (p. ej. un test por filtro o por criterio de orden) salvo que el negocio exija un único flujo integral.
- **Antes de escribir Playwright:** definí riesgos (datos TMDB cambiantes, auth, desalineación URL vs. bottom nav) y justificá aserciones; el plan no sustituye ese razonamiento.
- **Implementación** (solo cuando se pida código de forma explícita): POM + fixtures, AAA, orden de localizadores `getByRole` → `getByLabel` → `getByTestId` → CSS si hace falta → XPath último recurso, sin esperas fijas arbitrarias, `test.step()` en pasos que deban leerse en reporte.

### Campos estándar de cada TC

Además de la tabla por caso, al pasar a spec conviene mapear mentalmente:

| Fase | En el test |
|------|------------|
| **Arrange** | `baseURL`, datos de prueba, Page Object listo, sesión si aplica |
| **Act** | Una acción de usuario principal por bloque (o por `test.step`) |
| **Assert** | URL, roles visibles, textos o estados accesibles acordados con el producto |

---

## HOME — Home / Landing

### TC-HOME-001 — Carga inicial del home

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Verificar que la página principal carga correctamente mostrando marca, mensaje principal y secciones de contenido. |
| **Precondiciones** | Servidor en ejecución; ruta `/` accesible. |
| **Pasos** | 1. Navegar a `/`. 2. Comprobar presencia del encabezado principal y texto “Encontrá dónde verlo”. 3. Comprobar sección “Tendencias en Argentina” y “En cines / Recién llegados”. 4. Comprobar barra inferior con enlaces Home, Tendencias, Favoritos, Perfil. |
| **Resultado esperado** | Título de página contiene “PeliGo”; secciones y navegación inferior visibles; al menos un ítem de carrusel enlazado. |

### TC-HOME-002 — Buscador y botón Buscar visibles

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Asegurar que el usuario puede identificar el campo de búsqueda y el control para ejecutar la búsqueda. |
| **Precondiciones** | Home cargado (`/`). |
| **Pasos** | 1. Localizar el campo con etiqueta/accesible acorde a “¿Qué querés ver…”. 2. Localizar el botón “Buscar”. |
| **Resultado esperado** | Ambos controles son visibles y enfocables. |

### TC-HOME-003 — Enlace “Ver todo” desde tendencias en home

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Validar que el usuario puede ampliar el listado desde el carrusel de tendencias mediante “Ver todo”. |
| **Precondiciones** | Home cargado; enlace “Ver todo” presente en contexto de tendencias. |
| **Pasos** | 1. En home, hacer clic en el enlace “Ver todo” asociado a la sección de tendencias (acotar por sección si hay más de uno). 2. Observar URL y contenido. |
| **Resultado esperado** | Navegación sin error; destino coherente con listado extendido o tendencias (validar `href`/ruta en la build actual). |

### TC-HOME-004 — Variante “Búsquedas recientes” desde pestaña Favoritos en barra inferior

| Campo | Contenido |
|-------|-----------|
| **Descripción** | En la misma URL `/`, al activar “Favoritos” en la barra inferior puede mostrarse la zona “Búsquedas recientes”; verificar que la UI cambia sin errores. |
| **Precondiciones** | Home cargado. |
| **Pasos** | 1. Pulsar el enlace “Favoritos” en la barra inferior. 2. Comprobar si aparece “Búsquedas recientes” u estado vacío coherente. 3. Pulsar “Home” y comprobar vista por defecto. |
| **Resultado esperado** | Transiciones sin fallos; estado activo del enlace acorde en el árbol de accesibilidad si está expuesto. |

---

## TRD — Tendencias

### TC-TRD-001 — Página de tendencias por URL

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Comprobar la pantalla de ranking en `/trending`. |
| **Precondiciones** | Ruta `/trending` disponible. |
| **Pasos** | 1. Navegar a `/trending`. 2. Verificar encabezado “Tendencias” y título de documento relacionado con tendencias. 3. Verificar lista con enlaces numerados a títulos. |
| **Resultado esperado** | URL `…/trending`; contenido de listado visible; sin pantalla en blanco. |

### TC-TRD-002 — Filtros de tiempo (Hoy, Esta semana, Todo)

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Verificar que los filtros temporales son interactuables y no rompen la lista. |
| **Precondiciones** | Página `/trending` cargada. |
| **Pasos** | 1. Pulsar “Hoy”. 2. Pulsar “Esta semana”. 3. Pulsar “Todo”. 4. Tras cada acción, comprobar que la lista sigue mostrando ítems o estado vacío controlado. |
| **Resultado esperado** | Sin errores de consola críticos ni UI rota; lista o mensaje coherente. |

### TC-TRD-003 — Filtros Películas / Series

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Verificar filtros por tipo de contenido en tendencias. |
| **Precondiciones** | Página `/trending` cargada. |
| **Pasos** | 1. Pulsar “Películas”. 2. Pulsar “Series”. 3. Observar resultados. |
| **Resultado esperado** | Comportamiento estable; enlaces de resultados indican tipo esperado en el nombre accesible (ej. “Película ·”, “Serie ·”) cuando el producto lo incluye. |

### TC-TRD-004 — Navegación desde ítem de tendencias a ficha

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Desde un título en la lista de tendencias, abrir la ficha de detalle. |
| **Precondiciones** | Lista con al menos un enlace de título. |
| **Pasos** | 1. Hacer clic en el primer enlace de título disponible (o uno estable para el entorno). 2. Verificar URL bajo patrón `/title/…`. |
| **Resultado esperado** | Navegación a ficha; URL y contenido de detalle visibles. |

---

## SRCH — Búsqueda

### TC-SRCH-001 — Búsqueda por texto y resultados en `/search`

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Ejecutar búsqueda desde home y validar página de resultados con query en URL. |
| **Precondiciones** | Término que devuelva resultados (ej. “Breaking Bad” en entornos típicos). |
| **Pasos** | 1. En `/`, introducir el término en el buscador. 2. Ejecutar con botón “Buscar” y/o tecla Enter (según criterio de aceptación). 3. Verificar URL `/search?q=…` codificada y título de página de búsqueda. |
| **Resultado esperado** | Lista de resultados visible; al menos un enlace relacionado con la query. |

### TC-SRCH-002 — Filtros Todas / Películas / Series en resultados

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Aplicar chips de filtrado en la página de búsqueda. |
| **Precondiciones** | Página `/search` con resultados para una query conocida. |
| **Pasos** | 1. Pulsar “Todas”. 2. Pulsar “Películas”. 3. Pulsar “Series”. |
| **Resultado esperado** | UI reacciona sin error; contadores o etiquetas visibles si el producto los muestra. |

### TC-SRCH-003 — Orden Relevancia / Más vistos / Mejor rating / Más recientes

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Cambiar el criterio de orden en resultados de búsqueda. |
| **Precondiciones** | Página `/search` con múltiples resultados. |
| **Pasos** | 1. Pulsar “Relevancia”. 2. Pulsar “Más vistos”. 3. Pulsar “Mejor rating”. 4. Pulsar “Más recientes”. |
| **Resultado esperado** | Orden aplicado sin errores; lista sigue siendo usable (no validar orden exacto salvo contrato API fijado). |

### TC-SRCH-004 — Abrir ficha desde resultado de búsqueda

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Navegar al detalle desde un resultado listado. |
| **Precondiciones** | Resultados visibles para la query. |
| **Pasos** | 1. Hacer clic en un resultado esperado (ej. serie principal de la query). 2. Verificar ruta `/title/…`. |
| **Resultado esperado** | Ficha con título y secciones de detalle visibles. |

---

## TTL — Ficha de título

### TC-TTL-001 — Estructura mínima de la ficha

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Validar bloques principales de una página de título. |
| **Precondiciones** | URL válida `/title/t-<id>` o llegada vía listado/búsqueda. |
| **Pasos** | 1. Abrir la ficha. 2. Verificar `heading` nivel 1 con nombre del título. 3. Verificar sección “Dónde verlo en Argentina”. 4. Verificar “Sinopsis”, “Info”, “Similares”. |
| **Resultado esperado** | Contenido principal visible; título de pestaña acorde (ej. “Dónde ver … en Argentina”). |

### TC-TTL-002 — Expandir sinopsis (“Leer más”)

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Comprobar interacción de lectura extendida de sinopsis si está disponible. |
| **Precondiciones** | Ficha con botón “Leer más”. |
| **Pasos** | 1. Pulsar “Leer más”. 2. Verificar que el texto de sinopsis se muestra o expande. |
| **Resultado esperado** | Comportamiento coherente (más texto visible o modal, según diseño). |

### TC-TTL-003 — Botón “Avisame cuando esté en otra plataforma”

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Verificar presencia y acción no destructiva del CTA de alerta de plataforma. |
| **Precondiciones** | Ficha cargada. |
| **Pasos** | 1. Pulsar el botón cuyo nombre accesible coincide con “Avisame cuando esté…”. 2. Observar respuesta (toast, modal, etc.). |
| **Resultado esperado** | Sin error de página; feedback acorde al producto (definir aserción según implementación). |

### TC-TTL-004 — Navegación por títulos similares

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Desde “Similares”, abrir otro título y comprobar cambio de ficha. |
| **Precondiciones** | Sección “Similares” con al menos un enlace. |
| **Pasos** | 1. Hacer clic en un título de “Similares”. 2. Verificar cambio de URL y de `h1`. |
| **Resultado esperado** | Nueva ficha cargada correctamente. |

---

## LIST — Mi lista (`/favorites`)

### TC-LIST-001 — Estado vacío de Mi lista

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Usuario sin ítems: mensaje y CTA hacia búsqueda. |
| **Precondiciones** | Lista vacía (usuario nuevo o storage limpio según estrategia de test). |
| **Pasos** | 1. Navegar a `/favorites`. 2. Verificar título “Mi lista”. 3. Verificar mensaje “Todavía no agregaste nada” y enlace “Ir a buscar”. |
| **Resultado esperado** | Copy y CTA visibles; “Ir a buscar” navega a flujo de búsqueda o home según diseño. |

### TC-LIST-002 — Pestañas Favoritos / Por ver / Vistos

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Cambiar entre pestañas de la lista sin errores. |
| **Precondiciones** | Página `/favorites` cargada. |
| **Pasos** | 1. Pulsar “Favoritos”. 2. Pulsar “Por ver”. 3. Pulsar “Vistos”. |
| **Resultado esperado** | Contenido o vacío coherente por pestaña; sin errores. |

### TC-LIST-003 — Agregar a lista desde ficha (flujo integrado)

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Tras marcar favorito/por ver desde detalle, el ítem aparece en la pestaña correspondiente. |
| **Precondiciones** | Control en ficha para agregar a lista; usuario con persistencia conocida. |
| **Pasos** | 1. Abrir una ficha. 2. Ejecutar acción de agregar (botón con nombre/`testid` acordado). 3. Ir a `/favorites` y comprobar pestaña adecuada. |
| **Resultado esperado** | Ítem listado o contador actualizado según reglas de negocio. |

---

## PRF — Perfil (`/profile`)

### TC-PRF-001 — Cabecera de perfil y datos de usuario

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Verificar sección “Mi Perfil” con identidad visible cuando hay sesión. |
| **Precondiciones** | Sesión iniciada que muestre perfil (o skip documentado en CI sin auth). |
| **Pasos** | 1. Navegar a `/profile`. 2. Verificar “Mi Perfil” y datos como nombre y email visibles. |
| **Resultado esperado** | Información esperada visible para el usuario de prueba. |

### TC-PRF-002 — Selección de plataformas (“Mis plataformas”)

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Alternar servicios de streaming y verificar feedback visual o de estado. |
| **Precondiciones** | Perfil cargado; botones de plataforma visibles. |
| **Pasos** | 1. Pulsar al menos un botón de plataforma (ej. Netflix). 2. Comprobar estado seleccionado si está expuesto (`aria-pressed`, clase, etc.). |
| **Resultado esperado** | Toggle funcional según contrato de UI acordado con desarrollo. |

### TC-PRF-003 — Enlaces Alertas, Favoritos, Ayuda

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Rutas secundarias desde perfil no están rotas. |
| **Precondiciones** | Perfil cargado. |
| **Pasos** | 1. Abrir enlace “Alertas”. 2. Volver y abrir “Favoritos” (enlace de perfil, si difiere del bottom nav). 3. Abrir “Ayuda”. |
| **Resultado esperado** | Navegación SPA o HTTP 200; contenido esperado en cada destino. |

### TC-PRF-004 — Cerrar sesión (entorno controlado)

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Validar flujo de logout y estado posterior. |
| **Precondiciones** | Solo en entorno donde el cierre de sesión sea seguro y reversible. |
| **Pasos** | 1. Pulsar “Cerrar sesión”. 2. Verificar redirección o anonimización. |
| **Resultado esperado** | Sesión finalizada según criterio de aceptación (URL, ausencia de datos sensibles). |

---

## NAV — Navegación global

### TC-NAV-001 — Barra inferior: Home y Tendencias

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Navegar entre secciones principales desde la barra inferior. |
| **Precondiciones** | Cualquier pantalla con bottom nav. |
| **Pasos** | 1. Pulsar “Tendencias”. 2. Aserción de URL o contenido de tendencias. 3. Pulsar “Home”. 4. Aserción de landing. |
| **Resultado esperado** | Destinos correctos; si hay desajuste URL/estado activo, documentar bug y preferir `page.goto` en automatización hasta corrección. |

### TC-NAV-002 — Barra inferior: Perfil

| Campo | Contenido |
|-------|-----------|
| **Descripción** | Acceso a perfil desde la navegación inferior. |
| **Precondiciones** | App cargada. |
| **Pasos** | 1. Pulsar “Perfil”. 2. Verificar `/profile` o contenido “Mi Perfil”. |
| **Resultado esperado** | Pantalla de perfil alcanzada. |

---

## Notas transversales

- **Localización (`.cursorrules` + accesibilidad):** `getByRole` → `getByLabel` → `getByTestId` → CSS solo con justificación → **XPath último recurso**. Evitar “smart selectors” frágiles.
- **Flakiness:** Preferir condiciones de Playwright (`expect(locator).toBeVisible()`, `toHaveURL`, etc.) en lugar de sleeps fijos.
- **Datos dinámicos:** Preferir regex y patrones (“Serie ·”, “Película ·”, `/title/.+`) frente a un único título o conteo fijo salvo entorno sembrado.
- **Accesibilidad:** Botones sin nombre en el árbol a11y son deuda técnica: conviene `aria-label` o `data-testid` acordado; documentar en el TC si el caso queda bloqueado hasta tener contrato.
- **API en scope:** Si el criterio de aceptación incluye respuesta de backend, validar contrato con esquema (p. ej. Zod) en capa `request`, no mezclar con aserciones de UI sin criterio claro.
- **Partición de casos “ricos”:** Para TC-TRD-002, TC-SRCH-002, TC-SRCH-003, TC-LIST-002 y TC-PRF-003, valorá **un test automatizado por variante** (ej. “orden por Mejor rating”) para cumplir *un comportamiento por test* y fallos más diagnósticos.
