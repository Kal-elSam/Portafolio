# Git workflow

> Sin pipeline verde, no hay commit.

## Pipeline pre-commit

1. Diff review.
2. Secrets check (`.env`, tokens, API keys).
3. Linter: `pnpm lint`
4. Formatter: `pnpm format`
5. Type check: `cd apps/devSam && pnpm lint:types`
6. Tests: `[COMPLETAR]` — cuando estén configurados
7. Build: `pnpm build`
8. Commit conventional.

## Conventional Commits

```txt
tipo(scope): descripción en imperativo
```

Tipos:

```txt
feat | fix | test | refactor | docs | chore | perf | ci
```

Scopes sugeridos:

```txt
devSam | packages | docs | harness | deps
```

Ejemplos:

```txt
feat(devSam): add project filter to work page
fix(api): handle missing slug in views endpoint
docs(harness): install agentic engineering infrastructure
```

## Prohibido commitear

- `.env` y variantes con valores reales
- secrets y tokens
- `console.log` y `debugger` en código de producción
- código comentado innecesario
- archivos no relacionados con la tarea
- cambios de formato mezclados con lógica sin razón
- `node_modules/`, `.next/`, `dist/`

## Branches y PRs

- Trabajar en branches descriptivas: `feat/nombre`, `fix/nombre`, `docs/nombre`
- PR con descripción, test plan y screenshots si hay UI
- No mergear con pipeline rojo

## Monorepo

- Cambios en `packages/*` pueden afectar `apps/devSam` — validar build completo
- Usar `turbo` para tareas paralelas: `pnpm build`, `pnpm lint`
