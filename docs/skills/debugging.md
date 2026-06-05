# Debugging Skill

## Cuándo usar

- Bugs, errores 500, comportamiento inesperado
- Fallas de build o runtime
- Regresiones tras deploy

## Fuente de verdad

- `docs/ai/harness.md`
- `docs/ai/api.md` (si es error de endpoint)

## Procedimiento

1. Definir comportamiento esperado vs actual.
2. Reproducir el bug con pasos concretos.
3. Recolectar evidencia (logs, stack trace, request/response).
4. Formular hipótesis y probar una a una.
5. Escribir regression test que falla.
6. Corregir causa raíz (no síntoma).
7. Validar suite completa y build.

## Checklist

- [ ] Reproducción documentada
- [ ] Evidencia adjunta
- [ ] Regression test creado
- [ ] Causa raíz identificada
- [ ] Validación completa

## Output esperado

- Diagnóstico: causa raíz
- Test de regresión
- Fix aplicado
- Resultado de validación
