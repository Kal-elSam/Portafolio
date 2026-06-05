# Estrategia de testing

> Ningún cambio de comportamiento llega a main sin pruebas.

## Estado actual

- Tests configurados: **no**
- Herramientas detectadas: ninguna
- Herramientas propuestas: Vitest + Testing Library (unit/integration), Playwright (E2E)
- Comando: `[COMPLETAR]` — pendiente de configuración
- Cobertura mínima objetivo: 80% líneas y branches

## Por tipo de tarea

| Tarea | Test requerido |
| --- | --- |
| Función nueva | Unit |
| Endpoint nuevo | Integration |
| Bug fix | Regression |
| Flujo UI | E2E |
| Refactor | Suite existente verde |

## Setup recomendado

### Unit e integration (Vitest)

```bash
# Requiere confirmación explícita antes de instalar
cd apps/devSam
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Configuración sugerida en `apps/devSam/vitest.config.ts`:

- Environment: `jsdom`
- Alias `@/` igual que `tsconfig.json`
- Setup file: `tests/setup.ts`

Script sugerido en `apps/devSam/package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

### E2E (Playwright)

```bash
# Requiere confirmación explícita antes de instalar
pnpm create playwright
```

Flujos prioritarios para E2E:

- Navegación home → work → proyecto
- Blog listing y post individual
- Reactions/views en contenido

## Estructura propuesta

```txt
apps/devSam/
├── __tests__/           # o tests/
│   ├── unit/
│   ├── integration/
│   └── factories/
└── e2e/                 # Playwright
    └── portfolio.spec.ts
```

## Reglas

- Factories en `tests/factories/` o `__tests__/factories/`.
- Mocks solo para dependencias externas (Octokit, Prisma en unit tests).
- Tests de integración con DB real o test container cuando aplique.
- Regression test antes del fix.
- No borrar tests sin justificación documentada en spec o PR.

## Prioridades de cobertura

1. `lib/` — lógica de meta, content, reactions
2. `pages/api/` — endpoints REST
3. `helpers/` — hashing, URLs
4. Componentes críticos de UI (Reactions, ShareButton, Navigation)
