# Spec: Portfolio Role Positioning

> Estado: implementado  
> Fecha: 2026-06-05

## Objetivo

Reposicionar el portafolio como **una sola marca** con narrativa senior amplia, mientras los tres CVs se presentan como **formas de impacto profesional**, no como identidades separadas.

## Contexto

- Un solo sitio en `apps/devSam`.
- Narrativa principal: **Software Engineer focused on product engineering, frontend architecture, and AI systems**.
- Tres lecturas de CV: Software Engineer, Technical Lead, Solutions Engineer.
- La cover letter (`coverLetter.pdf`) es referencia interna de posicionamiento; no es descarga pública principal.

## Alcance

- Spec en `docs/ai/specs/portfolio-role-positioning.spec.md`.
- Hero con mensaje principal amplio y senior.
- Sección home **"Three ways I create impact"** con tres perfiles.
- Métricas y case studies alineados a producto, arquitectura e integración.
- CTA **"Download CV by role"** con tres PDFs.
- Estructura de datos `roleProfiles` (`title`, `summary`, `proofPoints`, `cvHref`).
- PDFs públicos en `apps/devSam/public/assets/docs/` con nombres consistentes.

## No-alcance

- Tres portafolios o rutas separadas por rol.
- Texto principal tipo "3 modos" o "elige tu perfil".
- Descarga pública de cover letter.
- Cambios de CI/CD, deploy o base de datos.

## Criterios de aceptación

1. El hero comunica product engineering, frontend architecture y AI systems en un solo mensaje.
2. Existe la sección **Three ways I create impact** con Software Engineer, Technical Lead y Solutions Engineer.
3. Cada case study evidencia producto, arquitectura e integración.
4. El CTA de resume único se reemplaza por menú **Download CV by role** (hero y footer).
5. Los tres PDFs son accesibles en rutas públicas estables.
6. `pnpm lint`, `pnpm lint:types` (en `apps/devSam`) y `pnpm build` pasan sin errores.

## Contratos de datos

```ts
interface RoleProfile {
  id: 'software-engineer' | 'technical-lead' | 'solutions-engineer';
  title: string;
  summary: string;
  proofPoints: string[];
  cvHref: string;
}
```

### Assets públicos

| Rol | Archivo |
| --- | --- |
| Software Engineer | `/assets/docs/SamuelGomez-SoftwareEngineer.pdf` |
| Technical Lead | `/assets/docs/SamuelGomez-TechnicalLead.pdf` |
| Solutions Engineer | `/assets/docs/SamuelGomez-SolutionsEngineer.pdf` |

## Estados de UI

- **Hero:** título + subtítulo senior + CTAs (View Work, Contact, Download CV by role).
- **Role impact:** grid de 3 tarjetas con summary y proof points.
- **Case studies:** cada tarjeta incluye filas Product / Architecture / Integration.
- **CV menu:** dropdown accesible con teclado; cada ítem descarga el PDF del rol.

## Casos de error

- PDF inexistente → enlace roto; validar presencia en `public/assets/docs/` antes de merge.
- Menú sin foco visible → corregir estados `active`/`focus` del patrón Headless UI Menu.

## Estrategia de testing

- Validación manual de los 3 enlaces de descarga.
- Revisión responsive home (mobile/desktop).
- Pipeline: `pnpm lint` → `cd apps/devSam && pnpm lint:types` → `pnpm build`.

## Riesgos

- Nombres de archivo inconsistentes entre repo y deploy → mitigado con tabla de assets en esta spec.
- Duplicación de copy entre hero y role cards → mitigado centralizando `roleProfiles`.
