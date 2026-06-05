# Capa de APIs

> Toda llamada externa o interna debe pasar por la abstracción definida.

## Abstracción detectada

- Capa: Next.js API Routes (`pages/api/`)
- Cliente HTTP (cliente): SWR para data fetching, axios disponible
- Persistencia: Prisma Client vía `utils/prisma.ts`
- Timeout estándar: 10000ms (recomendado para llamadas externas)
- Manejo de errores: try/catch en handlers, respuesta `{ message: string }` con códigos HTTP

## Endpoints internos

| Ruta | Método | Descripción |
| --- | --- | --- |
| `/api/content` | GET | Lista metadata de todo el contenido |
| `/api/content/latest` | GET | Contenido más reciente |
| `/api/content/[slug]` | GET | Metadata por slug |
| `/api/views/[slug]` | GET/POST | Contador de vistas |
| `/api/shares/[slug]` | GET/POST | Contador de shares |
| `/api/reactions/[slug]` | GET/POST | Reactions por slug |
| `/api/activity` | GET | Actividad reciente |
| `/api/ai/workflow-demo` | GET | Comprueba si live AI está disponible (sin exponer keys) |
| `/api/ai/workflow-demo` | POST | Simula workflow IA (mock o live con fallback) |
| `/api/og-page` | GET | OG image para páginas |
| `/api/og-post` | GET | OG image para posts |

## Lógica de negocio

- `lib/meta` — operaciones sobre ContentMeta (Prisma/MongoDB)
- `helpers/server.ts` — hashing de IP con `SALT_IP_ADDRESS`
- `helpers/url.ts` — resolución de URL según entorno Vercel

## APIs externas

- **Octokit** (`@octokit/rest`) — actividad GitHub
- **Vercel Analytics** — métricas de visita
- **Vercel OG** (`@vercel/og`) — generación de imágenes OG

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión MongoDB (Prisma) |
| `SALT_IP_ADDRESS` | Hash de IP para sesiones anónimas |
| `NEXT_PUBLIC_VERCEL_ENV` | Entorno Vercel |
| `NEXT_PUBLIC_VERCEL_URL` | URL base en Vercel |
| `ANALYZE` | Bundle analyzer |
| `NODE_ENV` | Entorno Node |
| `GEMINI_API_KEY` | Live AI demo — primary provider (Gemini free tier) |
| `GROQ_API_KEY` | Live AI demo — fallback provider |
| `OPENROUTER_API_KEY` | Live AI demo — optional fallback (`:free` models) |

Ver `.env.example` para placeholders.

## Tipos

- `TApiResponse` — respuesta de error estándar
- `TContentMeta` — metadata de contenido
- Definidos en `apps/devSam/src/types/`

## Reglas

- No llamadas directas a Prisma desde componentes UI.
- Centralizar errores con códigos HTTP apropiados (405, 500).
- Validar request y response con Zod cuando se añadan endpoints nuevos.
- Documentar endpoint nuevo aquí antes de merge.
- Integration test para endpoint nuevo.
- No exponer `SALT_IP_ADDRESS` ni `DATABASE_URL` al cliente.
