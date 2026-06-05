# Testing Skill

## Cuándo usar

- Escribir o configurar tests
- Corregir bugs (regression test primero)
- Evaluar cobertura
- Añadir factories o mocks

## Fuente de verdad

- `docs/ai/testing.md`
- `docs/ai/test-driven-development.md`

## Procedimiento

1. Leer estado actual de testing en `docs/ai/testing.md`.
2. Identificar tipo de cambio (unit, integration, E2E, regression).
3. Si no hay suite configurada, proponer setup y pedir confirmación.
4. Escribir test que falla por la razón correcta.
5. Implementar fix mínimo.
6. Ejecutar lint, types, tests y build.

## Checklist

- [ ] Test escrito antes del fix (TDD)
- [ ] Mocks solo para dependencias externas
- [ ] Factory usada si aplica
- [ ] Suite completa verde
- [ ] Cobertura documentada

## Output esperado

- Archivos de test creados/modificados
- Comando ejecutado y resultado
- Cobertura antes/después (cuando aplique)
