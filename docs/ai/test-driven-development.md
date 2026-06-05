# Test-Driven Development

> Los tests son el juez del harness.

## Regla central

Antes de implementar cambios de comportamiento, escribir el test que define el comportamiento esperado.

## Por tipo de tarea

| Tarea | Test obligatorio |
| --- | --- |
| Función nueva | Unit test |
| Bug fix | Regression test que falla primero |
| Endpoint nuevo | Integration test happy path + errores |
| Flujo de usuario | E2E test |
| Refactor | Tests existentes deben seguir pasando |

## Proceso

```txt
1. Identificar comportamiento esperado
2. Escribir test que falla
3. Confirmar que falla por la razón correcta
4. Implementar mínimo necesario
5. Ejecutar test
6. Ejecutar suite completa
7. Refactorizar si aplica
```

## Prohibiciones

- No mockear lógica de negocio propia.
- No borrar tests para hacer pasar el pipeline.
- No cambiar assertions para ocultar un bug.
- No usar snapshots como sustituto de comportamiento crítico.
- No usar datos hardcodeados si hay factories.

## Factories

Ubicación recomendada:

```txt
apps/devSam/__tests__/factories/
```

## Cobertura mínima

- Líneas: 80%
- Branches: 80%

## Estado del proyecto

El proyecto aún no tiene testing configurado. Antes de escribir el primer test:

1. Leer `docs/ai/testing.md`
2. Obtener confirmación para instalar dependencias
3. Configurar Vitest/Playwright según propuesta
4. Añadir script `test` al pipeline pre-commit
