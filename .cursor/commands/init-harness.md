# /init-harness

Revalida o reinstala la infraestructura agéntica del proyecto.

## Flujo

1. Leer `AGENTS.md`.
2. Leer `docs/ai/harness.md`.
3. Inventariar archivos de agentes existentes.
4. Detectar duplicados o legacy.
5. Reparar punteros (`bash setup-agent-links.sh`).
6. Validar que existen rules, commands, agents y skills.
7. Reportar inconsistencias.
