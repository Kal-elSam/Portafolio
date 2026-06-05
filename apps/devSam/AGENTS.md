# AGENTS.md — apps/devSam

> Scope local para la app principal del monorepo. OpenCode y Codex usan el `AGENTS.md` más cercano al archivo editado.

## Fuente de verdad

- Universal (monorepo): `../../AGENTS.md`
- Técnica: `../../docs/ai/`
- Skills: `../../docs/skills/`
- Playbooks: `../../docs/ai/playbooks/`

## Scope

Instrucciones específicas cuando trabajas en `apps/devSam/`.

## Comandos de esta app

```bash
# Dev
pnpm dev

# Lint completo (ESLint + types + Prettier)
pnpm lint:all

# Solo tipos
pnpm lint:types

# Build
pnpm build

# Prisma
pnpm db:generate
```

## Estructura clave

- UI: `src/components/`, `src/pages/`
- API: `src/pages/api/`, `src/lib/`
- Contenido MDX: `src/contents/`
- DB: `prisma/`, `src/utils/prisma.ts`

## Reglas locales

- Alias `@/` → `src/`
- No llamadas directas a Prisma desde componentes.
- Leer `../../docs/ai/ui.md` antes de cambios visuales.
- Leer `../../docs/ai/api.md` antes de cambios en endpoints.
