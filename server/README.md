# TeamGraph — Backend Foundation

A production-ready backend foundation for TeamGraph, the **Organizational
Relationship Intelligence Platform**. The frontend is untouched; this package
implements the graph-backed repository the UI will swap to once CognoDB is live.

## Architecture

```
server/
├── types.ts                Contract primitives (EntityType, filters, options)
├── dto/                    DTOs — the only shapes the UI ever receives
├── cognodb/                Connection layer (driver lifecycle, sessions, health)
│   ├── config.ts           Validated env config (fails fast at startup)
│   ├── driver.ts           Singleton driver + graceful close
│   ├── session.ts          Session factory + read/write transaction helpers
│   ├── health.ts           Connectivity + health snapshot
│   ├── errors.ts           Typed error hierarchy
│   └── index.ts            Barrel
├── queries/                All Cypher lives here (parameterized, by domain)
│   ├── employee.ts  project.ts  graph.ts  dashboard.ts  insights.ts  misc.ts
│   └── index.ts
├── mapper/                 Neo4j record → DTO (+ relationship-label translation,
│   ├── index.ts             radial layout, insight composition)
│   ├── graph-layout.ts
│   └── insight-composer.ts
├── repositories/
│   ├── GraphRepository.ts       The contract (mirrors src/data/repository.ts)
│   └── CognoGraphRepository.ts  CognoDB implementation
├── services/               Thin orchestration per surface
│   ├── GraphService EmployeeService ProjectService TeamService
│   ├── DashboardService InsightService
│   └── index.ts
├── seed/                   Schema bootstrap (constraints/indexes); data = next phase
├── index.ts                Composition root + lifecycle (start/shutdown/health)
└── tsconfig.json           Node-targeted TS config
```

## Layering rules (enforced by structure)

- **Queries** — the *only* place Cypher exists. Every query is parameterized.
- **Repositories** — data access + mapping only. No business logic.
- **Services** — orchestration / composition for API endpoints.
- **Mapper** — Neo4j records never escape; the UI receives DTOs only.
- **DTOs** — match the frontend contract field-for-field.

## Driver lifecycle

`initDriver` creates a process-wide singleton with a pooled, validated config.
All access goes through `runRead` / `runWrite` / `withReadTransaction` /
`withWriteTransaction`, which guarantee sessions are closed and errors are
normalised. `shutdown()` drains the pool; SIGTERM/SIGINT are wired for graceful
exit. `start()` verifies connectivity before serving traffic.

## Frontend integration point

The frontend is decoupled via the repository seam. To go live, change one line
in `src/data/repository.ts`:

```ts
import { createCognodbRepository } from "@/server";
export const repository = createCognodbRepository();
```

No page, component, or hook changes required.

## Remaining work before live CognoDB

1. Create the graph schema (node labels + relationship types).
2. Seed CognoDB with realistic company data (`server/seed` → `DATA_SEED_STEPS`).
3. Author/verify Cypher against real data (queries are already in place).
4. Flip the repository swap line above.

See the engineering report in chat for full detail.