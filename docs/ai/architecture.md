# Arquitectura del proyecto

> Actualizar ante cualquier cambio estructural.

## Stack

- Lenguaje: TypeScript
- Framework: Next.js 13 (Pages Router)
- Package manager: pnpm 9.x
- Monorepo: Turborepo
- Base de datos: MongoDB vía Prisma
- Inicializado: 2026-06-05

## Propósito

Portafolio personal de Samuel Gomez Serrano que muestra proyectos, blog, TIL y métricas de engagement (views, shares, reactions). Desplegado en Vercel.

## Estructura de carpetas

```txt
.
├── apps/
│   └── devSam/
│       ├── prisma/
│       ├── public/
│       └── src/
│           ├── components/
│           ├── contents/
│           ├── hooks/
│           ├── lib/
│           ├── pages/
│           ├── providers/
│           ├── styles/
│           ├── types/
│           └── utils/
├── packages/
│   ├── eslint-config-next-typescript/
│   ├── eslint-config-typescript/
│   ├── rehype-plugins/
│   ├── remark-plugins/
│   └── tsconfig/
├── docs/
│   └── ai/
└── turbo.json
```

## Patrón de arquitectura

- Patrón principal: Monorepo Turborepo con app Next.js Pages Router
- Presentación: `apps/devSam/src/components/`, `apps/devSam/src/pages/`
- API: `apps/devSam/src/pages/api/`, `apps/devSam/src/lib/`
- Datos: `apps/devSam/prisma/`, `apps/devSam/src/utils/prisma.ts`
- Contenido: `apps/devSam/src/contents/` (MDX)
- Tests: `[COMPLETAR]` — no configurados aún

## Capas

| Capa | Ubicación | Responsabilidad |
| --- | --- | --- |
| UI | `components/`, `pages/` | Presentación, layouts, MDX |
| Hooks | `hooks/` | Estado y efectos reutilizables |
| Servicios | `lib/`, `helpers/` | Lógica de negocio y acceso a datos |
| API | `pages/api/` | Endpoints REST internos |
| Infra | `prisma/`, `utils/prisma.ts` | Persistencia MongoDB |

## Decisiones de arquitectura

### ADR-001 — Stack inicial detectado

**Estado:** aceptado
**Fecha:** 2026-06-05

#### Contexto

El proyecto usa Turborepo + Next.js 13 Pages Router + Prisma/MongoDB.

#### Decisión

Mantener la arquitectura detectada salvo que una spec o ADR proponga cambio.

#### Consecuencias

Toda nueva capa debe respetar la estructura existente bajo `apps/devSam/src/`.

### ADR-002 — Alias `@/*`

**Estado:** aceptado
**Fecha:** 2026-06-05

#### Contexto

`tsconfig.json` define `baseUrl: ./src` y `@/*` → `src/*`.

#### Decisión

Usar `@/` para imports internos en lugar de rutas relativas profundas.

#### Consecuencias

Imports consistentes; no introducir alias adicionales sin ADR.

## Reglas estrictas

- No mezclar lógica de negocio con presentación.
- No introducir dependencias sin ADR o justificación.
- No crear nuevas capas sin documentarlas.
- No romper contratos públicos de API sin migration plan.
- No migrar a App Router sin spec y ADR dedicados.
