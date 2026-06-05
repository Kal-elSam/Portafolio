# Sistema de diseño

> No crear UI fuera del sistema del proyecto.

## Paleta

- Modo oscuro: `darkMode: 'class'` en Tailwind
- Colores base: paleta Tailwind (`slate`, `red`, `blue` vía `tailwindcss-accent`)
- Divider light: `slate-200`
- Divider dark: `slate-800`
- Accent plugin: `red` (root), `blue` (variante)

## Tipografía

- Sans: **Plus Jakarta Sans** (`--font-sans`) vía `@next/font/google`
- Mono: **JetBrains Mono** (`--font-mono`) vía `@next/font/google`
- Configuración en `components/layouts/Root.tsx`

## Espaciado y layout

- Utility-first con Tailwind CSS 3.x
- Plugins: `@headlessui/tailwindcss`, `@tailwindcss/line-clamp`, `tailwind-scrollbar-hide`
- Variante custom: `fm` (`.fm &`)
- Grid backgrounds: utility `bg-grid` con colores de tema

## Componentes base

| Categoría | Ubicación | Ejemplos |
| --- | --- | --- |
| Layouts | `components/layouts/` | `Root`, `WithNavigationFooter`, `WithReactions` |
| Navegación | `components/navigations/` | `NavLink`, `NavLogo`, `SkipNavigation` |
| Secciones | `components/sections/` | `SectionTitle`, `SectionContent` |
| Wireframes | `components/wireframes/` | `ProjectCard`, `AppWindow`, `Skeletons` |
| MDX | `components/mdx/` | `Code`, `Callout`, `Image`, custom headings |
| Meta | `components/meta/` | `Head`, `OgImages` |

## Librerías UI

- **Headless UI** — componentes accesibles (dropdowns, dialogs)
- **Framer Motion** — animaciones
- **Heroicons / FontAwesome / react-icons** — iconografía
- **clsx** — composición de clases
- **next-themes** — tema claro/oscuro
- **react-hot-toast** — notificaciones

## Reglas

- No colores hardcodeados; usar tokens Tailwind o variables CSS.
- No estilos inline salvo casos justificados (ej. OG images dinámicas).
- Mobile-first.
- Usar componentes base del proyecto antes de crear nuevos.
- No usar primitivos HTML directos si existe wrapper (ej. `NavLink` en lugar de `<a>` suelto).
- Mantener accesibilidad: labels, roles, focus states, keyboard navigation, `SkipNavigation`.
- Respetar convención `default export` en componentes legado; named exports en código nuevo.

## MDX

- Contenido en `src/contents/` (blog, projects, TIL, index)
- Layouts de contenido en `src/contents-layouts/`
- Componentes MDX custom en `components/mdx/custom-components/`
