---
name: code-review
description: Code review técnico pre-merge con severidad CRÍTICO/ADVERTENCIA/SUGERENCIA.
---

# Code Review Skill

Fuente de verdad:

- `docs/ai/conventions.md`
- `docs/ai/architecture.md`
- `docs/ai/testing.md`
- `docs/skills/code-review.md`

Usar cuando:

- hay diff listo para merge
- se ejecuta `/review` o `/checkpoint`
- se audita entrega de otro agente

Procedimiento:

1. Leer spec si existe.
2. Revisar diff completo.
3. Clasificar hallazgos por severidad.
4. No modificar archivos salvo instrucción.
