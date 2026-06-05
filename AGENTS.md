# AGENTS.md

> Instrucciones universales para agentes de IA trabajando en este proyecto.
> Este archivo es la fuente principal de contexto agéntico del repo.

---

## Proyecto

- **Nombre:** sam.dev (Portafolio)
- **Propósito:** Portafolio personal de Samuel Gomez Serrano — frontend systems, proyectos SaaS, dashboards y product engineering.
- **Stack:** Turborepo monorepo · Next.js 13 (Pages Router) · React 18 · TypeScript · Tailwind CSS · Prisma · MongoDB
- **Package manager:** pnpm
- **Arquitectura detectada:** Monorepo con app principal (`apps/devSam`) y paquetes compartidos (`packages/*`)

---

## Primera ley

La fuente de verdad siempre gana sobre el instinto.

Antes de escribir código:

1. Leer `docs/ai/architecture.md`.
2. Leer el documento de `docs/ai/` correspondiente a la tarea.
3. Si la tarea requiere un flujo específico, leer `docs/skills/`.
4. Si falta documentación, crear o actualizar la documentación antes de implementar.
5. Si hay contradicción entre código y documentación, reportarla antes de continuar.

---

## Harness obligatorio

Todo cambio debe pasar por este flujo:

```txt
Requirement
→ Spec
→ Plan
→ Tests que fallan primero
→ Implementación
→ Validación automática
→ Review
→ Reporte
→ Human approval
```

El agente no debe trabajar fuera del harness salvo instrucción explícita del usuario.

---

## Spec-Driven Development

Para toda feature o cambio significativo, crear o actualizar una spec antes del código.

Ubicación sugerida:

```txt
docs/ai/specs/<feature-name>.spec.md
```

La spec debe incluir:

- objetivo
- contexto
- alcance
- no-alcance
- criterios de aceptación
- contratos de API si aplica
- estados de UI si aplica
- casos de error
- estrategia de testing
- riesgos

---

## Test-Driven Development

Reglas obligatorias:

- Bug fix → regression test que falla primero.
- Nueva función → unit test.
- Nuevo endpoint → integration test.
- Nuevo flujo de usuario → E2E test.
- Refactor → tests existentes deben seguir pasando sin modificar comportamiento.

No declarar listo si tests, linter, typecheck o build fallan.

> **Estado actual:** el proyecto aún no tiene suite de tests configurada. Ver `docs/ai/testing.md` para el setup propuesto antes de implementar tests.

---

## Comandos esenciales

```bash
# Install
pnpm install

# Dev
pnpm dev

# Lint (monorepo)
pnpm lint

# Lint app (tipos + estilo)
cd apps/devSam && pnpm lint:all

# Format
pnpm format

# Type check
cd apps/devSam && pnpm lint:types

# Test (pendiente — ver docs/ai/testing.md)
# cd apps/devSam && pnpm test

# Build
pnpm build
```

---

## Pipeline pre-commit

1. Revisar diff.
2. Verificar que no hay secrets, `.env`, tokens, `console.log`, `debugger` o archivos accidentales.
3. Ejecutar linter: `pnpm lint`.
4. Ejecutar formatter: `pnpm format`.
5. Ejecutar typecheck: `cd apps/devSam && pnpm lint:types`.
6. Ejecutar tests con coverage (cuando estén configurados).
7. Ejecutar build: `pnpm build`.
8. Proponer commit conventional.
9. Esperar aprobación humana antes de commitear.

---

## Límites absolutos

- No instalar dependencias sin confirmación explícita.
- No modificar `.env`, CI/CD, infra o deploy sin avisar.
- No borrar tests sin justificación documentada.
- No crear patrones nuevos sin documentarlos.
- No mezclar lógica de negocio con UI.
- No hacer llamadas directas desde UI a servicios externos si existe capa de abstracción.
- No hacer commit si el pipeline falla.
- No declarar éxito parcial como éxito total.

---

## Fuente de verdad

| Archivo | Propósito |
| ------------------------------------ | --------------------------------------------------- |
| `docs/ai/architecture.md` | Stack, capas, ADRs, decisiones estructurales |
| `docs/ai/conventions.md` | Convenciones de código, naming, imports, estructura |
| `docs/ai/testing.md` | Estrategia de testing, herramientas, cobertura |
| `docs/ai/git-workflow.md` | Pipeline, commits, PRs |
| `docs/ai/harness.md` | Flujo de ejecución agéntica controlada |
| `docs/ai/spec-driven-development.md` | Cómo escribir specs antes de código |
| `docs/ai/test-driven-development.md` | Cómo escribir tests antes de implementación |
| `docs/ai/agent-workflow.md` | Roles, secuencia y handoffs entre agentes |
| `docs/ai/ui.md` | Sistema de diseño y reglas UI |
| `docs/ai/api.md` | Endpoints, contratos, integraciones |

---

## Compatibilidad por herramienta

| Herramienta | Contexto | Skills | Workflows |
| --- | --- | --- | --- |
| **Cursor** | `AGENTS.md` + `.cursor/rules/` | `.cursor/skills/` | `.cursor/commands/`, `.cursor/agents/` |
| **Codex** | `AGENTS.md` + `.codex/AGENTS.md` | `.codex/skills/` → `.cursor/skills/` | `docs/ai/playbooks/` |
| **OpenCode** | `AGENTS.md` + `opencode.json` | `.opencode/skills/` → `.cursor/skills/` | `docs/ai/playbooks/` |
| Claude Code | `CLAUDE.md` / `.claude/CLAUDE.md` | — | — |
| GitHub Copilot | `.github/copilot-instructions.md` | — | — |
| Windsurf | `.windsurfrules` | — | — |
| Antigravity | `.agent/AGENTS.md` | — | — |

Monorepo: `apps/devSam/AGENTS.md` aplica scope local cuando se edita esa app.

Ejecutar `bash setup-agent-links.sh` para crear symlinks de compatibilidad.

---

## graphify (opcional)

Si existe `graphify-out/` en el repo:

- Antes de responder preguntas de arquitectura, leer `graphify-out/GRAPH_REPORT.md`.
- Si existe `graphify-out/wiki/index.md`, navegarlo en lugar de leer archivos crudos.
- Para relaciones cross-module, preferir `graphify query`, `graphify path`, o `graphify explain`.
- Tras modificar código, ejecutar `graphify update .` (AST-only, sin costo de API).

---

## Regla final

El agente puede proponer, implementar y validar, pero la decisión de impacto arquitectónico pertenece al humano.
