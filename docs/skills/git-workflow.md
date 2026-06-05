# Git Workflow Skill

## Cuándo usar

- Preparar commit o PR
- Validar pipeline pre-commit
- Resolver conflictos de merge
- Escribir mensajes conventional

## Fuente de verdad

- `docs/ai/git-workflow.md`
- `AGENTS.md`

## Procedimiento

1. Revisar diff completo.
2. Verificar ausencia de secrets y archivos accidentales.
3. Ejecutar pipeline: lint → format → types → test → build.
4. Redactar commit conventional con scope apropiado.
5. Esperar aprobación humana antes de commitear.

## Checklist

- [ ] Diff revisado
- [ ] Sin `.env` ni secrets
- [ ] Pipeline verde
- [ ] Mensaje conventional redactado
- [ ] Aprobación humana obtenida

## Output esperado

```txt
Diff: [N archivos]
Lint: pass/fail
Types: pass/fail
Tests: pass/fail/skip
Build: pass/fail
Commit propuesto: tipo(scope): descripción
```
