# Playbook: checkpoint

> Portable para Codex y OpenCode. Equivalente a `/checkpoint` en Cursor.

Ejecuta validación completa antes de commit.

## Flujo

1. Revisar diff.
2. Detectar secrets, `.env`, `console.log`, `debugger`.
3. Ejecutar `pnpm lint`.
4. Ejecutar `pnpm format`.
5. Ejecutar `cd apps/devSam && pnpm lint:types`.
6. Ejecutar tests con coverage (cuando estén configurados).
7. Ejecutar `pnpm build`.
8. Proponer commit conventional.
9. Esperar aprobación humana.

## Output

```txt
Diff: [N archivos]
Lint: pass/fail
Format: pass/fail
Types: pass/fail
Tests: pass/fail/skip
Coverage: [%]
Build: pass/fail
Commit propuesto: [...]
```
