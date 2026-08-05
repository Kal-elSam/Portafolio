# Spec: Portfolio v2 — Software/Product Engineer + AI Positioning

> Estado: Fase 1, 1.5, 2 y 3 implementadas y validadas. Fase 4–5 pendientes.
> Fecha: 2026-08-05 (Architecture case study ARI + System Design + Engineering Principles)
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

### Fase 2 — Kairo Runtime como activo open-source central (implementado 2026-08-05)

**Verificación previa (bloqueante resuelta):** se auditó `@kal-elsam/kairo-runtime` contra el registry de npm y la API de GitHub antes de escribir copy. Hallazgos reales:

- Paquete publicado y activo: `@kal-elsam/kairo-runtime`, v0.11.0, releases automatizados vía GitHub Actions con npm provenance/attestations.
- Repo público `github.com/Kal-elSam/harness`, actualizado el mismo día, 10 issues abiertos (uso real), **0 stars, 0 forks**, **sin archivo `LICENSE`** (license: `UNLICENSED` en package.json) → técnicamente no es "open source" en sentido OSI todavía, aunque el código es público. Pendiente para el dueño (fuera de este repo): agregar licencia MIT/Apache si quiere reclamar "open source" con propiedad.
- Descargas npm reales y con tracción: ~3,986/mes (verificado vía `api.npmjs.org/downloads`).
- **Corrección de framing importante:** el producto real es un _"local agent operating system" / governance harness_ para agentes de codificación (Cursor, Codex, Claude, Gemini, Copilot) — detecta agentes, escribe secciones de config gestionadas y reversibles, aplica gobierno SDD/TDD, con una TUI en Ink/React. **No es** un SDK de agentes de IA con providers (OpenAI/Anthropic/Gemini/Groq) orientado a construir productos como ARI/MAYA — esa descripción del pitch original no correspondía al producto publicado.
- **Relación real con Kairo Systems:** Kairo Runtime no es una dependencia que ARI/MAYA importen. La conexión honesta y aprobada por el dueño es "Kairo Runtime gobierna cómo construyo software (esta misma disciplina SDD/TDD se usó para construir ARI y MAYA)", no "ARI/MAYA corren sobre el runtime". Confirmado con el dueño vía `AskQuestion` (opción `honest_dev_tooling`).
- Métricas mostradas: solo npm downloads (vía badge dinámico de shields.io, siempre live, nunca hardcodeado). Se decidió explícitamente **no mostrar GitHub stars** (están en 0) hasta que crezcan (opción `downloads_only` del dueño).

**Implementado:**

- `apps/devSam/src/components/wireframes/ArchitectureDiagram.tsx`: diagrama de arquitectura reutilizable en JSX puro (sin Mermaid, sin dependencias nuevas), accesible (`role="img"` + `aria-label` con el flujo en texto).
- `apps/devSam/src/contents/index/OpenSourceRuntime.tsx`: nueva sección "Open Source — Kairo Runtime" en el home, insertada entre `ImpactMetrics` y `RoleImpactSection` (posición prominente, acorde a la jerarquía "Kairo Runtime primero" propuesta por el dueño). Incluye badges live de npm (versión + descargas/mes), principios reales del CLI, y CTAs a npm/GitHub/página dedicada.
- `apps/devSam/src/pages/work/kairo-runtime.mdx`: página dedicada (`/work/kairo-runtime`) con Why I built it, Core Principles, Architecture (diagrama real: CLI → detección de agentes → escritura de config gestionada → control plane `~/.harness` → loop de gobernanza continua), sección "Built with this discipline" conectando honestamente con Kairo Systems, stack real, e instrucciones de instalación reales (`npx @kal-elsam/kairo-runtime`).
- Navegación: `Navigation.tsx` (`workLinks`) y `Footer.tsx` (grupos "Explore" y "Connect") actualizados con enlaces a la página dedicada y a npm.
- Validado con browser real (`cursor-ide-browser`): home y `/work/kairo-runtime` renderizan correctamente, badges de npm cargan en vivo, diagrama de arquitectura se ve como se diseñó.

**Explícitamente fuera de esta fase (no implementado, por falta de base real o de tiempo):**

- `/playground` interactivo — no se construyó; haría falta una demo real (registrar una Tool, ejecutar un Agent) y no hay tiempo/alcance definido para eso en esta iteración. No se hizo un mockup que aparente funcionalidad inexistente.
- GitHub stars / contributors / changelog / roadmap público — no se muestran hasta que haya tracción real que valga la pena destacar.
- Blog técnico sobre diseño del runtime — pertenece a Fase 5 (requiere contenido real del dueño, no generado en su nombre).
- Actualización del CV único para mencionar Kairo Runtime — no se tocó el CV en esta fase; es una decisión pendiente y separada del dueño sobre el documento que se envía a reclutadores.

### Fase 3 — Architecture Case Studies + System Design (implementado 2026-08-05)

**Implementado:**

- `apps/devSam/src/pages/work/how-i-built-ari.mdx` — case study completo: Problem, Architecture (diagrama JSX), Tradeoffs, Challenges, Lessons learned, Stack, Future improvements. Contenido alineado al CV (WhatsApp, Google Calendar OAuth, Groq/Gemini, Next.js, Express, PostgreSQL). Sin métricas inventadas. Relación con Kairo Runtime = disciplina SDD/TDD, no dependencia de runtime.
- `apps/devSam/src/pages/work/system-design.mdx` — los 7 temas pedidos: Appointment booking, AI orchestration, Frontend architecture, API architecture, Authentication flow, Event-driven workflows, Database design. Diagramas con `ArchitectureDiagram` (sin Mermaid).
- `apps/devSam/src/pages/work/engineering-principles.mdx` — SOLID, Clean Architecture, DDD, API-first, Performance, Accessibility, Testing, Observability, CI/CD, AI Engineering. El ~30% de performance se atribuye explícitamente a Ensamble (fuente: CV), no a Kairo.
- Navegación (`Navigation.tsx` workLinks) y `Footer.tsx` actualizados. CTA "Architecture case study" en la tarjeta ARI/MAYA de `FeaturedCaseStudies`. Soften del impactProof que aún decía "measurable response gains" (resto de la métrica no respaldada eliminada en Fase 1.5).

**Fuera de alcance explícito:** Mermaid runtime (ADR no pedido; se reutiliza JSX). Case studies adicionales (MAYA, NEXUS) — se pueden añadir después sin bloquear el criterio de aceptación ("al menos 1").

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
