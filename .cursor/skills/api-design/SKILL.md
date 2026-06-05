---
name: api-design
description: Diseño e implementación de API Routes Next.js con Prisma y contratos documentados.
---

# API Design Skill

Fuente de verdad:

- `docs/ai/api.md`
- `docs/skills/api-design.md`

Usar cuando:

- se crean o modifican endpoints
- se cambian contratos request/response
- se integran servicios externos

Procedimiento:

1. Leer `docs/ai/api.md`.
2. Definir contrato y documentarlo.
3. Implementar handler; lógica en `lib/`.
4. Validar con Zod para inputs nuevos.
5. Planificar integration test.
