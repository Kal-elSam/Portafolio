# Architecture Skill

## Cuándo usar

- Cambios estructurales o nuevas capas
- Decisiones de módulos, carpetas o dependencias
- Evaluar impacto de refactors grandes
- Crear o actualizar ADRs

## Fuente de verdad

- `docs/ai/architecture.md`
- `AGENTS.md`

## Procedimiento

1. Leer `docs/ai/architecture.md` y el árbol de carpetas actual.
2. Identificar capas afectadas (UI, API, lib, prisma).
3. Evaluar si el cambio requiere ADR nuevo.
4. Documentar decisión antes de implementar.
5. Validar que no se rompen contratos públicos.

## Checklist

- [ ] Capas identificadas
- [ ] ADR creado/actualizado si aplica
- [ ] Sin dependencias nuevas sin justificación
- [ ] Estructura respeta monorepo Turborepo

## Output esperado

- ADR o nota de arquitectura
- Diagrama de capas si el cambio es complejo
- Lista de archivos/directorios afectados
- Riesgos y alternativas descartadas
