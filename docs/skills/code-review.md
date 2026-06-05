# Code Review Skill

## Cuándo usar

- Antes de merge, PR o checkpoint
- Revisión de diff de otro agente
- Auditoría de calidad pre-entrega

## Fuente de verdad

- `docs/ai/conventions.md`
- `docs/ai/architecture.md`
- `docs/ai/testing.md`

## Procedimiento

1. Leer spec asociada si existe.
2. Revisar diff archivo por archivo.
3. Evaluar: arquitectura, convenciones, tests, edge cases, seguridad, DX, performance.
4. Clasificar hallazgos por severidad.
5. No modificar archivos salvo instrucción explícita.

## Checklist

- [ ] Spec leída
- [ ] Convenciones respetadas
- [ ] Tests adecuados al cambio
- [ ] Sin secrets ni console.log
- [ ] Scope limitado a la tarea

## Output esperado

Hallazgos clasificados:

- **CRÍTICO:** bloquea merge
- **ADVERTENCIA:** corregir pronto
- **SUGERENCIA:** mejora opcional
