# Agent Workflow

> Define roles, activación y handoffs entre agentes.

## Roles

| Agente | Cuándo se activa | Responsabilidad |
| --- | --- | --- |
| Harness Orchestrator | tareas complejas | Coordina estados del harness |
| Architect | arquitectura, capas, ADRs | Decide estructura y límites |
| Debugger | bugs, errores, fallas | Diagnóstico con evidencia |
| Test Engineer | tests, cobertura | Diseña y escribe pruebas |
| Reviewer | antes de merge/commit | Revisión técnica independiente |

## Secuencia recomendada para feature

```txt
Harness Orchestrator
→ Architect
→ Test Engineer
→ Implementation Agent
→ Reviewer
→ Human
```

## Secuencia recomendada para bug

```txt
Debugger
→ Test Engineer
→ Implementation Agent
→ Reviewer
→ Human
```

## Handoffs

Cada agente debe entregar:

- contexto leído
- archivos analizados
- decisión tomada
- riesgos
- siguiente acción sugerida

## Definiciones por herramienta

### Cursor (subagentes nativos)

Los agentes viven en `.cursor/agents/`:

- `harness-orchestrator.md`
- `architect.md`
- `debugger.md`
- `reviewer.md`
- `test-engineer.md`

### Codex y OpenCode (playbooks portables)

Equivalente funcional en `docs/ai/playbooks/`:

- `init-harness.md` → Harness Orchestrator
- `init-feature.md` → Architect + Test Engineer
- `debug.md` → Debugger
- `review.md` → Reviewer
- `checkpoint.md` → validación pre-commit

OpenCode carga estos archivos automáticamente vía `opencode.json`.
Codex y OpenCode descubren skills en `.codex/skills/` y `.opencode/skills/`.

## Reglas

- El Reviewer debe actuar con contexto fresco.
- El Debugger nunca debe adivinar; debe probar hipótesis.
- El Architect debe documentar ADRs en `docs/ai/architecture.md`.
- El Test Engineer debe priorizar comportamiento, no solo cobertura.
- El Harness Orchestrator debe detenerse si faltan specs, tests o validación.
