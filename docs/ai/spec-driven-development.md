# Spec-Driven Development

> Ninguna feature significativa debe implementarse sin especificación previa.

## Cuándo crear una spec

Crear spec para:

- nueva feature
- cambio de flujo
- endpoint nuevo
- integración externa
- cambio de modelo de datos
- refactor estructural
- automatización agéntica

No es obligatorio para cambios triviales de copy, estilos menores o fixes muy pequeños, salvo que el riesgo sea alto.

## Ubicación

```txt
docs/ai/specs/<feature-name>.spec.md
```

## Plantilla

```md
# Spec: [Nombre]

## Objetivo

[Qué se busca lograr]

## Contexto

[Por qué existe este cambio]

## Alcance

- [Incluido]

## No alcance

- [Excluido]

## Criterios de aceptación

- [ ] [Comportamiento observable]
- [ ] [Caso de error]
- [ ] [Validación técnica]

## Diseño técnico

### Capas afectadas

- UI:
- API:
- DB:
- Servicios:
- Jobs:

### Contratos

#### Request

```json
{}
```

#### Response

```json
{}
```

## Estados y errores

| Caso | Resultado esperado |
| --- | --- |
| Happy path | |
| Error externo | |
| Input inválido | |
| Sin permisos | |

## Testing

- Unit:
- Integration:
- E2E:
- Regression:

## Riesgos

- [Riesgo]

## Plan de implementación

1. [Paso]
2. [Paso]
3. [Paso]
```

## Reglas

- La spec debe ser suficientemente clara para que otro agente implemente.
- Los criterios de aceptación deben poder convertirse en tests.
- Si cambia la implementación, actualizar la spec.
- Si la spec contradice arquitectura, resolver antes de codificar.
