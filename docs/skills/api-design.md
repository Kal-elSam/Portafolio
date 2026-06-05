# API Design Skill

## Cuándo usar

- Crear o modificar endpoints en `pages/api/`
- Cambiar contratos de request/response
- Integrar servicios externos (Octokit, Prisma)
- Validar errores y códigos HTTP

## Fuente de verdad

- `docs/ai/api.md`
- `docs/ai/architecture.md`

## Procedimiento

1. Leer endpoints existentes en `docs/ai/api.md`.
2. Definir contrato (método, path, request, response, errores).
3. Implementar handler en `pages/api/` con try/catch.
4. Delegar lógica a `lib/` — no en el handler.
5. Documentar endpoint en `docs/ai/api.md`.
6. Escribir integration test (cuando suite esté configurada).

## Checklist

- [ ] Contrato documentado
- [ ] Lógica en `lib/`, no en handler
- [ ] Códigos HTTP correctos (200, 405, 500)
- [ ] Sin exposición de secrets
- [ ] Zod validation para inputs nuevos
- [ ] Integration test planificado

## Output esperado

- Endpoint implementado
- Documentación actualizada en `docs/ai/api.md`
- Test de integración (o plan si suite pendiente)
