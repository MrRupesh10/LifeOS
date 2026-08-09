# Architecture — LifeOS System Design

> **Version:** 0.5.0-alpha  
> **Last updated:** 2026-08-08  
> **Status:** Phase 5 complete — Dashboard Foundation & Widget Architecture

---

## Architecture Overview

LifeOS is a **modular monolithic** web application: a thin Next.js routing layer, isolated feature modules, a shared infrastructure layer, and a composition-first dashboard. Business logic lives in modules; `app/` composes, never implements.

```
                                    ┌────────────────────────────────┐
                                    │          User (Browser)        │
                                    └──────────────┬─────────────────┘
                                                   │ HTTPS
                                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Next.js 15 App Router                          │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ app/   (routing / composition ONLY — no business logic)        │  │
│  │  (marketing)/      public landing, no chrome                    │  │
│  │  (auth)/           login · register · forgot/reset-password     │  │
│  │                    verify-email                                 │  │
│  │  (dashboard)/      AppShell (sidebar + header + footer)         │  │
│  │    dashboard/      13 module pages + home, nested under root    │  │
│  │  design-system/     design token showcase                       │  │
│  │  api/auth/[...all]  Better Auth handler                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ components/   shared UI (never domain logic)                   │  │
│  │   ui/        shadcn primitives (button, dialog, input...)      │  │
│  │   layout/    AppShell, Sidebar, Header, Breadcrumb, Container  │  │
│  │   shared/    Card, EmptyState, StatsCard, CommandPalette...    │  │
│  │   landing/   marketing-page sections                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ modules/   isolated feature modules (clean architecture)       │  │
│  │   tasks habits journal notes projects goals calendar            │  │
│  │   expenses activity   (each: types/ + datasource/ + services/) │  │
│  │   dashboard            (aggregator + widgets + constants)      │  │
│  │   auth                 (forms + validation)                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ lib/          shared infrastructure, no domain logic           │  │
│  │   config/     env · database · auth                            │  │
│  │   auth/       Better Auth server/client/session                │  │
│  │   db/         Drizzle client · schema barrel · migrations       │  │
│  │   result.ts   ServiceResult<T>                                 │  │
│  │   mock-data.ts · format-date.ts · utils.ts                     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  config/ providers/ stores/ types/   (site, nav, layout, tokens;   │
│                                     AppProviders; Zustand; types)  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Router Cache / Server Actions                    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ SQL (Drizzle ORM)
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PostgreSQL (serverless, planned)                  │
│              user-scoped rows · UUID PKs · camel/snake rules         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Rendering Strategy

```
Every page starts as a SERVER COMPONENT.

User lands on /dashboard
         │
         ▼
  Server Component renders layout (no client JS required)
         │
         ├── Static content?        → HTML on server (0 client JS)
         │
         ├── Need interactivity?    → Marked 'use client'
         │                            (minimized client JS)
         │
         └── Complex async state?   → TanStack Query (server-safe factory)
```

**Server Components by default.** Opt into `'use client'` only where a browser primitive is required.

### Component Hierarchy

```
<RootLayout>
│
├── <AppProviders>          # composition root: Theme + Query + Sonner
│   │
│   └── <RouteGroup>
│       ├── (marketing) → landing sections
│       ├── (auth)     → centered auth pages
│       └── (dashboard) → <AppShell>      # sidebar + header + footer
│             ├── <Sidebar>               # reads src/config/navigation.ts
│             ├── <Header>                # Breadcrumb + theme + user menu
│             └── <dashboard/...>         # module pages
│                    └── <Dashboard>      # thin composition layer (Phase 5)
```

### Route Architecture — Current

```
app/
├── layout.tsx                    # root layout (providers)
├── error.tsx · global-error.tsx · loading.tsx · not-found.tsx
├── middleware.ts                 # auth / route protection
│
├── (marketing)/
│   ├── layout.tsx                # public, no chrome
│   └── page.tsx                  # landing page
│
├── (auth)/
│   ├── layout.tsx                # minimal, centered
│   ├── login/ · register/
│   ├── forgot-password/ · reset-password/
│   └── verify-email/
│
├── (dashboard)/                  # authenticated area
│   ├── layout.tsx                # AppShell
│   └── dashboard/                # module home root
│       ├── page.tsx              # dashboard (composition only)
│       ├── tasks/ habits/ journal/ notes/ projects/ goals/
│       ├── calendar/ expenses/ interviews/ skills/ analytics/
│       └── resume/ settings/
│
├── design-system/                # design token showcase
│
└── api/
    └── auth/[...all]/route.ts    # Better Auth HTTP handler
```

> **Change from Phase 0:** module pages are nested at `(dashboard)/dashboard/<module>/`, not top-level `(dashboard)/<module>/`. API surface is limited to the single Better Auth handler.

---

## Dashboard Architecture (Phase 5)

The dashboard is an explicit **composition layer**, never a business-logic owner.

```
src/app/(dashboard)/dashboard/page.tsx      (≈58 lines, pure composition)
        │
        ▼
getDashboardSnapshot()                      dashboard-service.ts
        │
        ▼
  SnapshotContributor[]  ── Promise.all ──▶ DashboardSnapshot
        │        (one failed service never breaks the others)
        ▼
  WidgetState slices:  tasks  habits  projects  goals  journal
                       notes  calendar  expenses  activity
                       + computed  welcome · stats
        │
        ▼
  11 presentational widgets (shared UI only, zero business logic)
```

Two registries, joined on `WidgetKey`:

- **Data:** `SnapshotContributor[]`
- **UI:** `DashboardWidgetDefinition[]`

Layer ownership:

```
DataSources  →  own data (mock today; swappable to Drizzle in Phase 6)
Services     →  own logic (filter/count/sort/slice)
Aggregator   →  compose + join + compute welcome/stats
Widgets      →  render their exact slice
```

Dependencies point inward (Clean Architecture). The dashboard never imports mock data directly and never runs business logic.

---

## Backend Architecture

### Data Flow

```
  Browser                  Server (Next.js)              Database
  ───────                  ────────────────              ────────

  ┌─────────┐    HTTP     ┌──────────────┐   SQL    ┌──────────┐
  │ React   │◄──────────►│ Server Action │◄───────►│ PostgreSQL│
  │ Component│  (JSON)    │   (or handler)│   Drizzle└──────────┘
  └─────────┘             └──────────────┘
      │
      │  Two mutation paths:
      │
      │  Path 1: Server Actions (preferred for mutations)
      │    validate with Zod → Drizzle → revalidatePath/tag
      │
      │  Path 2: Route Handlers (external integrations, webhooks)
      │    same auth + validation model as a server action
```

### Service Layer Contract (Phase 5)

Every module service returns the same discriminated union — no helpers, no classes, no throwing:

```typescript
// src/lib/result.ts
type ServiceResult<T> =
  | { success: true;  data: T }
  | { success: false; message: string }
```

A module exposes its widget slice through a typed service:

```typescript
// src/modules/tasks/services/task-service.ts (shape)
async function getTaskWidgetData(
  ds?: TaskDataSource                  // optional DI, default mock
): Promise<ServiceResult<TaskWidgetData>>
```

The dashboard aggregates these via `getDashboardSnapshot()`, mapping each `ServiceResult` to an independent `WidgetState<T>` slot — a failed slice shows its own error without taking down the page.

---

## Module System

### Interface Contract

A data-backed module owns five things: **types, data-access, business logic, validation, UI**.

```
src/modules/<name>/
├── types.ts          # domain + widget-slice types
├── datasource/       # interface + mock impl + factory + toDomain()
├── services/         # ServiceResult-returning business logic
├── actions.ts        # Server Actions            (+ in module phase)
├── validation.ts     # Zod schemas               (+ in module phase)
├── components/       # module UI                 (scaffold → module phase)
└── hooks/            # module hooks              (scaffold → module phase)
```

### Boundary Rules (unchanged, evergreen)

Modules **MAY** import `lib/*`, `components/*`, `hooks/*`, `types/*`, `constants/*`, `validation/*`.

Modules **MUST NOT** import another module, access another module's tables, or hold business logic in `app/`.

Cross-module needs travel through **shared DB schema**, never through imports:

```
tasks needs calendar visibility:
  ✅ Calendar reads `tasks` table via shared DB schema
  ❌ Calendar imports `src/modules/tasks/actions.ts`
```

### Current Module Inventory

- **Implemented (Phase 5):** dashboard, activity, tasks, habits, journal, notes, projects, goals, calendar, expenses (each with `types` + `datasource` + `services`).
- **Partial (Phase 3):** auth (forms + validation; no service layer).
- **Shells (future):** analytics, interviews, resume, settings, notifications.

---

## State Management

```
    ┌────────────────┐
    │ URL            │  ← router state (filters, view params)
    └────────────────┘
         │
    ┌────────────────┐
    │ Server / Query │  ← server components + TanStack Query
    │ Cache          │    (server-safe QueryClient factory)
    └────────────────┘
         │
    ┌────────────────┐
    │ Local State    │  ← useState / useReducer (modals, form drafts)
    └────────────────┘
         │
    ┌────────────────┐
    │ Global State   │  ← Zustand (UI-only: sidebar store, ADR-009)
    └────────────────┘
```

Zustand is reserved for cross-tree UI state (sidebar collapse); server data stays in the Query cache.

---

## Security Architecture

```
Layer 1: Transport        HTTPS · CSP · CORS
Layer 2: Auth             Better Auth sessions, HTTP-only cookies
Layer 3: Data             Input validation (Zod), parameterized SQL (Drizzle)
Layer 4: App              User-scoped queries (userId filter at the datasource)
Layer 5: Infrastructure   PG isolation, encrypted connections
```

Every data-access path is user-scoped at the datasource boundary — the most important security rule and a Phase 6 invariant.

---

## Current Implementation vs. Phase 0 Blueprint

| Area | As originally planned | Implemented / current |
|------|----------------------|----------------------|
| Routing | module pages @ `(dashboard)/<m>/` | nested @ `(dashboard)/dashboard/<m>/` |
| API routes | webhooks / health planned | single Better Auth handler |
| Module shape | actions/types/validation/components/hooks | + `datasource` + `services` (Phase 5) |
| Mock data | inline in pages | isolated behind datasource interfaces |
| Server actions | ADR placeholder | pattern established (Phase 3) |
| AI / Email / Storage | planned | scaffolds only (later phases) |

---

## Phase 6+ Direction

- Replace mock `datasource/` implementations with Drizzle-backed ones — **zero service/widget changes** (the entire point of the Phase 5 contract).
- Add `actions.ts` + `validation.ts` per module; enforce `userId` scoping in every query.
- Build the persistent `tasks` module first, then the remaining data modules.
- Optionally consolidate `db/schema.ts` (barrel) vs `db/schema/` (directory) into one layout.

---

> **Maintained by:** Rupesh Yadav
> **Project:** LifeOS
>
> **Current Release:** **v0.5.0-alpha**
> **Status:** Phase 5 complete • Dashboard Foundation & Widget Architecture shipped