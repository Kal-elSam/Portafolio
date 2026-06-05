# Spec: AI Workflow Simulator

> Estado: implementado  
> Fecha: 2026-06-05

## Objetivo

Agregar una sección central **"AI systems in practice"** al home del portafolio: un simulador visual de workflows IA que muestra cómo Sam convierte necesidades de negocio en flujos técnicos reales — no un chatbot genérico.

## Contexto

- El reposicionamiento por roles ya está aplicado (`portfolio-role-positioning.spec.md`).
- El hero y case studies mencionan AI systems; falta una demo tangible e interactiva.
- Debe funcionar sin costo obligatorio (mock por defecto) y escalar a live AI si hay API keys.

## Alcance

- Spec en `docs/ai/specs/ai-workflow-simulator.spec.md`.
- Sección home después de `FeaturedCaseStudies`.
- Componente `AiWorkflowSimulator` con selector de escenario y panel visual animado.
- Data source `aiWorkflowScenarios` con 3 escenarios.
- API route `POST /api/ai/workflow-demo` y `GET /api/ai/workflow-demo` (capability check).
- Capa server-side `lib/ai/` con adapters Gemini → Groq → OpenRouter y fallback a mock.
- Env vars opcionales documentadas en `.env.example`.

## No-alcance

- Chat conversacional persistente o historial de sesiones.
- Persistencia en base de datos de prompts o respuestas.
- Instalación de SDKs de proveedores (usar `fetch` nativo).
- Exponer API keys al cliente.

## Criterios de aceptación

1. Existe la sección **AI systems in practice** visible en home tras case studies.
2. Tres escenarios seleccionables: lead qualification, appointment booking, content workflow.
3. El panel muestra flujo visual: user input → AI intent → tool/API action → business outcome.
4. Los pasos animan estados: analyzing, routing, executing, completed.
5. Mock mode funciona sin API keys configuradas.
6. Live AI mode intenta Gemini → Groq → OpenRouter y cae a mock en error/429.
7. Ninguna API key se expone al cliente.
8. `pnpm lint`, `pnpm lint:types` (en `apps/devSam`) y `pnpm build` pasan.

## Contratos de API

### `GET /api/ai/workflow-demo`

```ts
interface WorkflowDemoCapabilities {
  liveAiAvailable: boolean;
}
```

### `POST /api/ai/workflow-demo`

**Request:**

```ts
interface WorkflowDemoRequest {
  scenarioId: 'lead-qualification' | 'appointment-booking' | 'content-workflow';
  userPrompt: string;
  useLiveAi?: boolean;
}
```

**Response:**

```ts
type WorkflowStepPhase = 'analyzing' | 'routing' | 'executing' | 'completed';

interface WorkflowStep {
  id: string;
  phase: WorkflowStepPhase;
  label: string;
  detail: string;
  tool?: string;
}

interface WorkflowDemoResult {
  mode: 'mock' | 'live';
  provider?: 'gemini' | 'groq' | 'openrouter';
  scenarioId: WorkflowScenarioId;
  userInput: string;
  steps: WorkflowStep[];
  outcome: string;
}
```

## Estados de UI

- **Idle:** escenario seleccionado, prompt de ejemplo precargado, botón Run habilitado.
- **Running:** pasos se revelan secuencialmente con indicadores de fase.
- **Completed:** outcome visible; badge indica mock o live provider.
- **Live unavailable:** toggle live AI deshabilitado si no hay keys server-side.
- **Fallback:** si live falla, resultado mock con nota implícita en `mode: 'mock'`.

## Casos de error

- Prompt vacío → 400 con mensaje claro.
- Provider 429/5xx → fallback silencioso a mock (sin romper UX).
- JSON malformado del LLM → fallback a mock.
- Request no POST → 405.

## Estrategia de testing

- Mock mode sin env vars (manual + build).
- POST con `useLiveAi: false` devuelve steps estructurados.
- GET no expone secrets; solo `liveAiAvailable`.
- Pipeline: `pnpm lint` → `cd apps/devSam && pnpm lint:types` → `pnpm build`.

## Riesgos

- Rate limits en free tier → mitigado con mock fallback y mock por defecto.
- Latencia en live mode → mitigado con animación progresiva en cliente.
- Respuestas no estructuradas del LLM → mitigado con Zod parse + mock fallback.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `GEMINI_API_KEY` | Primary live provider |
| `GROQ_API_KEY` | Fallback live provider |
| `OPENROUTER_API_KEY` | Optional fallback (`:free` models) |
