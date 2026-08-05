# Spec: Portfolio v2 — Software/Product Engineer + AI Positioning

> Estado: Fase 1 y Fase 1.5 implementadas; Fase 2 (Kairo Runtime) **pendiente de decisión del dueño** antes de codificar (ver sección "Kairo Runtime — riesgo de honestidad")
> Fecha: 2026-08-05 (actualizado el mismo día tras consolidar CV único y recibir propuesta de pivote a Kairo Runtime)
> Reemplaza / extiende: `docs/ai/specs/portfolio-role-positioning.spec.md` (superseded parcialmente: un solo CV en vez de 3)

## Objetivo

Evolucionar el portafolio de "portfolio de frontend con proyectos" a **la narrativa de un Software/Product Engineer que construye productos completos y sistemas con IA**, alineado con el CV actual y las vacantes objetivo: Senior Software Engineer, Product Engineer, AI Engineer, Solutions Engineer, Tech Lead.

## Contexto

- `portfolio-role-positioning.spec.md` (2026-06-05) ya implementó: hero orientado a product engineering/AI, sección "Three ways I create impact" (`roleProfiles`), `ImpactMetrics`, `FeaturedCaseStudies` con framework Product/Architecture/Integration, CV por rol.
- El usuario (dueño del portafolio) pide una evolución adicional más profunda: Kairo Systems como caso de estudio central con arquitectura, case studies de arquitectura dedicados, system design, timeline visual, stack por categorías, open source, blog técnico, página `/hire-me`, y eliminar elementos que huelen a "portfolio junior" (barras de %, listas de tecnología sin contexto, proyectos tipo Todo/Weather).
- `skills-and-tools.mdx` todavía usa `<Label indicator={95}>` (barras de porcentaje) — contradice el pedido explícito de eliminarlas.
- No existe hoy: página dedicada de Kairo Systems, case study de arquitectura ("How I built ARI"), sección/página de System Design, timeline visual, sección Open Source, blog técnico con artículos, página `/hire-me`.

## Alcance (qué cubre esta spec)

Define el **backlog completo priorizado en fases**. Cada fase se implementa y valida de forma independiente; el pipeline debe pasar antes de avanzar a la siguiente.

### Fase 1 — Quick wins de narrativa (bajo riesgo, alto impacto)

- Eliminar barras de porcentaje (`Label indicator`) de `work/skills-and-tools.mdx`; reemplazar por listado de stack agrupado por categoría (Frontend / Backend / Database / Cloud / AI / Deployment) sin porcentajes.
- Renombrar nomenclatura de navegación/copy: "Projects" → mantener ruta `/projects` pero encabezados internos usan "Featured Products" / "Case Studies" en vez de "Project".
- Revisar copy del Hero contra la propuesta del usuario y ajustar si hace falta (ya está cerca; validar que en <5s comunique software + IA + producto + arquitectura).
- Eliminar/ocultar proyectos tipo ejercicio si existieran en `proyects.ts` (auditoría: no se detectaron Todo/Weather app hoy; confirmar con dueño).

### Fase 1.5 — CV único (implementado 2026-08-05)

- Se reemplazaron los 3 CVs por rol (`SamuelGomez-SoftwareEngineer.pdf`, `-TechnicalLead.pdf`, `-SolutionsEngineer.pdf`) y el resume legado (`SamuelGomezDevResume.pdf`) por **un solo CV canónico**: `apps/devSam/public/assets/docs/SamuelGomez-CV.pdf`, fuente de verdad = CV provisto por el dueño (`Software Engineer | Product Engineer | AI Systems`).
- `CvDownloadMenu` dejó de ser un dropdown por rol (Headless UI Menu) y ahora es un botón único de descarga (`roleProfiles.CV_HREF`).
- `RoleImpactSection` ("Three ways I create impact") se conserva como narrativa de 3 lentes, pero ya sin link de descarga por tarjeta.
- `work/experience.mdx`, `work/skills-and-tools.mdx`, y la entrada de Kairo en `contents/projects/proyects.ts` / `FeaturedCaseStudies.tsx` se alinearon palabra por palabra con los títulos, fechas y stack del CV único (ej. "Software Engineer / Frontend Lead" en Ensamble, no "Senior"/"Architecture Lead"; "Frontend Engineer" en KC, no "Software Engineer"; se agregó el eje "AI-Assisted Engineering" — Claude Code, GPT, Gemini, Groq — que el CV nuevo hace explícito).
- **Hallazgo de auditoría:** se encontró y eliminó una métrica no respaldada por ningún CV (`~50% faster response time`, `~25% lead-to-booking conversion` para Kairo) que había sido introducida en una sesión anterior sin fuente verificable. Regla aplicada: ninguna métrica se publica sin poder señalar de dónde sale (CV, medición real, o admitir que es cualitativa).

### Fase 2 — Kairo Systems / Kairo Runtime como caso de estudio central

> **Pendiente de decisión del dueño.** El 2026-08-05 se propuso un pivote de narrativa: en vez de que ARI/MAYA (productos) sean el centro, **Kairo Runtime** (un runtime open-source reutilizable que supuestamente los sustenta) pasaría a ser el activo principal del portafolio, con página `/kairo-runtime`, `/playground`, sección Open Source con GitHub stars/npm downloads, y blog técnico sobre diseño de runtimes.

#### Riesgo de honestidad — bloqueante antes de codificar

- **Kairo Runtime no aparece en el CV único ni en ningún archivo del repo.** No hay evidencia de que exista como paquete publicado, repositorio público, o código extraíble hoy.
- Publicar en el portafolio afirmaciones como "open-source runtime", "GitHub stars", "npm downloads", "changelog", "benchmarks" o un `/playground` funcional **sin que el paquete exista y esté publicado** sería fabricar contenido verificable por cualquier reclutador (buscarán el repo/npm y no encontrarán nada) — esto viola la regla del proyecto "no declarar éxito parcial como éxito total" y es un riesgo reputacional mayor que el problema que se busca resolver.
- Antes de implementar cualquier pieza de esta fase que implique métricas u open-source reales, se requiere confirmación explícita del dueño sobre:
  1. ¿Existe código real de "Kairo Runtime" hoy (aunque sea privado dentro de Kairo Systems) que se pueda extraer a un paquete independiente?
  2. ¿Hay compromiso y fecha realista de publicarlo en GitHub/npm antes de que el portafolio lo presente como tal?
  3. Mientras no esté publicado: ¿se prefiere una narrativa honesta "in progress / extrayendo el runtime que sustenta ARI y MAYA" (sin stats falsas), o se pospone esta fase hasta que el paquete exista?
  4. ¿El CV único debe actualizarse también para mencionar Kairo Runtime, o el runtime vive solo en el portafolio mientras el CV mantiene el framing actual (Kairo Systems como producto)?

#### Alcance condicional (una vez resuelto el punto anterior)

- Landing dedicada (`/kairo-runtime` o dentro de `work/`) con: Why I built it, Core Principles, Architecture (diagrama JSX/SVG propio, sin Mermaid — decisión ya tomada por el dueño), stack.
- Sección "Built with Kairo Runtime" listando ARI y MAYA como demostraciones de uso (patrón Next.js → ejemplos, no al revés).
- Sección Open Source: solo con datos reales (GitHub, npm) una vez publicado; nunca con placeholders o números inventados.
- `/playground` interactivo: solo si hay tiempo/alcance para una demo real (registrar una Tool, ejecutar un Agent) — no un mockup que aparente funcionalidad inexistente.
- Blog técnico sobre diseño del runtime: contenido real del dueño, no generado en su nombre.

### Fase 3 — Architecture Case Studies + System Design

- Página de case study "How I built ARI" con secciones: Problem, Architecture, Tradeoffs, Challenges, Lessons learned, Diagram, Stack, Future improvements.
- Sección/página "System Design" con temas: Appointment booking architecture, AI orchestration, Frontend architecture, API architecture, Authentication flow, Event-driven workflows, Database design (diagramas Mermaid donde aplique).
- Sección "Engineering Principles" (SOLID, Clean Architecture, DDD, API-first, Performance, Accessibility, Testing, Observability, CI/CD, AI Engineering).

### Fase 4 — Estructura de carrera y stack visual

- Timeline visual reemplazando/complementando `work/experience.mdx` (Kairo → Lumston → Ensamble → Lemu → KC, con flechas/orden cronológico).
- Stack visual agrupado por categoría (Frontend/Backend/Database/Cloud/AI/Deployment) como componente, reemplazando enumeraciones planas.
- Página `/hire-me`: resume por rol (ya existen 3 PDFs), LinkedIn, GitHub, Calendly (si existe), email, ubicación, disponibilidad remoto/relocation, visa, idiomas, timezone — consolidando lo que ya vive disperso en `work/contact.mdx`.

### Fase 5 — Contenido pesado (requiere insumos del dueño del portafolio)

- Sección "Open Source" (Kairo Runtime): requiere que el repo exista o se decida qué se publica.
- Blog técnico en MDX (2–5 artículos reales, ej. "Building an AI WhatsApp Assistant", "Lessons Building a SaaS Product Alone"): requiere contenido/narrativa real del autor, no se puede fabricar de forma creíble.
- Videos cortos (demo de producto): requiere grabación/assets que no existen en el repo.
- Secciones "Now", "Speaking", "AI Engineering" (listado de skills de IA) — bajo esfuerzo técnico, pero requieren decidir contenido real (qué se está aprendiendo, qué se está escribiendo).

## No alcance

- Migración a App Router (fuera de esta spec; ver ADR-002/regla de arquitectura).
- Introducir librerías nuevas de diagramación (ej. Mermaid runtime) sin ADR explícito — Fase 2/3 evalúan si se resuelve con componente propio (SVG/JSX) antes de pedir una dependencia nueva.
- Cambios de CI/CD, deploy, base de datos o `.env`.
- Reemplazar los 3 CVs por rol ya implementados; esta spec los conserva y los expone también en `/hire-me`.
- Escribir contenido de blog o grabar videos en nombre del usuario sin su revisión/aprobación de contenido real.
- Publicar métricas, badges (GitHub stars, npm downloads), changelogs, benchmarks o demos interactivas (`/playground`) para software que no existe o no está publicado. Cualquier dato cuantitativo debe poder rastrearse a: el CV vigente, una medición real, o marcarse explícitamente como roadmap/visión.

## Criterios de aceptación (por fase; ver plan de implementación)

1. Fase 1: `skills-and-tools.mdx` no contiene `<Label indicator=...>`; stack se presenta agrupado por categoría sin porcentajes. Copy de Home usa "Featured Products"/"Case Studies" en vez de "Project" donde aplique.
2. Fase 2: existe una página dedicada de Kairo Systems con ARI, MAYA y diagrama de arquitectura; accesible desde navegación/CTA en Home.
3. Fase 3: existe al menos 1 architecture case study completo (ARI) y una sección/página de System Design con los 7 temas listados.
4. Fase 4: existe timeline visual y página `/hire-me` con todos los datos consolidados; stack visual por categoría implementado como componente reutilizable.
5. Fase 5: solo se implementa la estructura/plantilla (ej. layout de blog post, ruta `/open-source`) — el contenido real requiere aprobación humana explícita del texto/narrativa antes de publicarse.
6. En cada fase: `pnpm lint`, `cd apps/devSam && pnpm lint:types`, `pnpm build` pasan sin errores antes de considerar la fase "lista".

## Diseño técnico

### Capas afectadas

- UI: `apps/devSam/src/contents/index/*`, `apps/devSam/src/pages/work/*`, nuevos componentes en `components/wireframes/` o `components/sections/`.
- Contenido: `apps/devSam/src/contents/`, MDX en `pages/work/`, `pages/blog/` (Fase 5).
- Sin cambios de API/DB salvo que Fase 5 requiera nuevos endpoints (no previsto).

### Componentes nuevos previstos

- `ArchitectureDiagram` (SVG/JSX declarativo, sin dependencia externa) para Fase 2/3.
- `CareerTimeline` para Fase 4.
- `StackByCategory` para Fase 1/4 (reemplaza `Label indicator`).
- `HireMePanel` para `/hire-me`.

## Estados y errores

| Caso                               | Resultado esperado                                                          |
| ---------------------------------- | --------------------------------------------------------------------------- |
| Falta contenido real (blog/videos) | No se publica placeholder; se deja la fase pendiente de insumos             |
| Diagrama sin datos                 | Componente no se renderiza vacío; se documenta en el MDX que falta          |
| Ruta nueva sin enlace en nav       | Se añade a `Navigation.tsx` / `workLinks` en la misma fase que crea la ruta |

## Testing

- Manual: revisión responsive (mobile/desktop) de cada página nueva.
- Pipeline por fase: `pnpm lint` → `pnpm lint:types` → `pnpm build`.
- No hay suite automatizada configurada (ver `docs/ai/testing.md`); no se bloquea por eso, pero no se debe regresar funcionalidad existente.

## Riesgos

- Alcance muy amplio: intentar todas las fases en un solo cambio viola el harness (spec→plan→tests→implementación→validación por incremento). Se ejecuta fase por fase con aprobación humana entre fases.
- Fase 5 depende de insumos que no existen en el repo (texto de blog, videos, decisión sobre Kairo Runtime open source); no se debe inventar contenido en nombre del usuario.
- Introducir Mermaid u otra librería de diagramas sin ADR podría violar "no introducir dependencias sin ADR" — se prioriza solución sin dependencias nuevas.

## Plan de implementación

1. Aprobación humana de esta spec y de qué fase(s) iniciar primero.
2. Fase 1 → validar pipeline → checkpoint.
3. Fase 2 → validar pipeline → checkpoint.
4. Fase 3 → validar pipeline → checkpoint.
5. Fase 4 → validar pipeline → checkpoint.
6. Fase 5 → solo plantilla/estructura; contenido real se agrega en un cambio posterior con el usuario aportando el texto/assets.
