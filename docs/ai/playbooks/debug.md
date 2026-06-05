# Playbook: debug

> Portable para Codex y OpenCode. Equivalente a `/debug` en Cursor.

Diagnóstico sistemático de bugs.

## Flujo

1. Esperado vs actual.
2. Reproducción.
3. Evidencia.
4. Hipótesis.
5. Regression test que falla.
6. Fix.
7. Validación (`pnpm lint`, `cd apps/devSam && pnpm lint:types`, `pnpm build`).
