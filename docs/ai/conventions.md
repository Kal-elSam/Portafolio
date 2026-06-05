# Convenciones de código

> Leer antes de generar o modificar código.

## Nombrado

- Archivos de componentes: `PascalCase.tsx` (ej. `PageHeader.tsx`, `Root.tsx`)
- Archivos de utilidades/lib: `camelCase.ts` (ej. `prisma.ts`, `url.ts`)
- Páginas: `kebab-case` o nombre descriptivo (`index.tsx`, `[slug].ts`)
- Variables: `camelCase`
- Funciones: `camelCase`
- Clases/componentes: `PascalCase`
- Constantes: `UPPER_SNAKE_CASE`
- Tests: `*.test.ts` / `*.test.tsx` (cuando se configuren)
- Tipos/interfaces: prefijo `T` para tipos (`TContentMeta`), `I` evitar salvo legado

## Imports

Orden recomendado (alineado con `eslint-config-next-typescript`):

1. Paquetes externos (`react`, `next`, librerías npm)
2. Componentes y providers (`@/components`, `@/providers`)
3. Hooks (`@/hooks`)
4. Lib, helpers, utils (`@/lib`, `@/helpers`, `@/utils`)
5. Tipos (`@/types`)
6. Estilos y assets

Alias detectados:

```txt
@/*  →  apps/devSam/src/*
```

## Reglas

- No usar imports relativos de más de 2 niveles si existe alias `@/`.
- No usar `any` sin comentario justificando.
- No crear funciones de más de 30 líneas sin extraer lógica.
- No anidar más de 3 niveles sin refactor.
- No poner lógica de negocio en archivos de presentación.
- No dejar código muerto, comentado o duplicado.
- Usar `clsx` para composición de clases Tailwind.
- Preferir named exports en componentes nuevos; respetar `default export` en legado.

## Estructura de módulo recomendada

```txt
apps/devSam/src/
├── components/     # UI reutilizable
│   ├── layouts/
│   ├── mdx/
│   ├── navigations/
│   ├── sections/
│   └── wireframes/
├── contents/       # MDX estático (blog, projects, TIL)
├── hooks/          # Custom hooks
├── lib/            # Lógica de negocio / data access
├── helpers/        # Utilidades server-side
├── pages/          # Rutas Next.js + API routes
├── providers/      # Context providers
├── types/          # Tipos compartidos
└── utils/          # Utilidades client/server
```

## ESLint y formato

- ESLint: Airbnb + TypeScript + Next.js (`eslint-config-next-typescript`)
- Prettier con `prettier-plugin-tailwindcss`
- Comando lint app: `cd apps/devSam && pnpm lint:all`
