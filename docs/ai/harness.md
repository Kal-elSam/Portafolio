# Agentic Engineering Harness

> Este documento define cómo opera cualquier agente dentro del proyecto.

## Objetivo

Controlar la ejecución de agentes para que todo cambio sea especificado, probado, validado y revisable.

## Modelo operativo

```txt
Input → Spec → Plan → Tests → Implementation → Validation → Review → Report
```

## Estados del harness

| Estado | Descripción | Salida esperada |
| --- | --- | --- |
| `INTAKE` | Entender petición | Resumen de objetivo |
| `SPEC` | Crear o actualizar spec | `.spec.md` |
| `PLAN` | Diseñar pasos técnicos | Plan ejecutable |
| `TEST_FIRST` | Crear tests fallidos | Tests que fallan por la razón correcta |
| `IMPLEMENT` | Cambiar código | Diff limitado al scope |
| `VALIDATE` | Ejecutar pipeline | Lint/type/test/build |
| `REVIEW` | Revisión técnica | Reporte de issues |
| `APPROVAL` | Esperar decisión humana | Aprobado / cambios requeridos |
| `CHECKPOINT` | Commit o reporte final | Commit propuesto o resumen |

## Reglas de transición

- No pasar de `SPEC` a `IMPLEMENT` sin plan.
- No pasar de `PLAN` a `IMPLEMENT` en bugs sin regression test.
- No pasar a `CHECKPOINT` si falla el pipeline.
- Si una validación falla, regresar a `IMPLEMENT` con evidencia.
- Si se detecta cambio arquitectónico, activar Architect Agent.
- Si se detecta bug, activar Debugger Agent.
- Si falta cobertura, activar Test Engineer Agent.
- Si hay diff listo, activar Reviewer Agent.

## Límites del agente

El agente debe reportar antes de:

- instalar dependencias
- modificar CI/CD
- modificar infraestructura
- tocar `.env`
- cambiar arquitectura
- eliminar archivos
- borrar tests
- modificar datos persistentes

## Workflows por herramienta

| Workflow | Cursor | Codex / OpenCode |
| --- | --- | --- |
| Revalidar harness | `/init-harness` | Leer `docs/ai/playbooks/init-harness.md` |
| Iniciar feature | `/init-feature` | Leer `docs/ai/playbooks/init-feature.md` |
| Debug | `/debug` | Leer `docs/ai/playbooks/debug.md` |
| Review | `/review` | Leer `docs/ai/playbooks/review.md` |
| Checkpoint | `/checkpoint` | Leer `docs/ai/playbooks/checkpoint.md` |

OpenCode carga automáticamente `docs/ai/*.md` y playbooks vía `opencode.json`.
Codex y OpenCode descubren skills del proyecto en `.codex/skills/` y `.opencode/skills/`.

## Métricas recomendadas

- tareas completadas
- tests agregados
- retries por tarea
- fallos por herramienta
- tiempo por estado
- archivos modificados por tarea
- cobertura antes/después
- defectos encontrados en review
