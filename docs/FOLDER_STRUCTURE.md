# Folder Structure — LifeOS

Defines the actual LifeOS project structure, module boundaries, responsibilities, and architecture.

Current status: Phase 5 complete

Last updated: 2026-08-08 — Phase 5

## 1. Top-Level Project Structure
```
LifeOS/
├── src/                        # Application source code
├── docs/                       # Engineering and project documentation
├── .claude/                    # Claude Code project memory, rules, plans
├── .github/                    # Issue templates & CI workflows (scaffold)
├── .husky/                     # Git hooks
├── tests/                      # e2e / integration / unit (scaffold)
├── assets/ artifacts
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # pnpm lockfile
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── next-env.d.ts               # Next.js type reference
├── drizzle.config.ts           # Drizzle Kit configuration
├── eslint.config.mjs           # ESLint 9 flat configuration
├── postcss.config.mjs          # PostCSS / Tailwind configuration
├── .prettierrc                 # Prettier configuration
├── .prettierignore             # Prettier ignore rules
├── .gitignore                  # Git ignore rules
├── components.json             # shadcn/ui configuration
├── .env.example                # Environment variable documentation
└── README.md                   # Project README
```

`public/`, `mcp/`, `skills/` exist as empty or near-empty scaffolds and are omitted here until populated.

## 2. src/ — Application Source
```
src/
├── middleware.ts               # Auth / route protection
├── app/                        # Next.js routing layer
├── modules/                    # Feature modules (business logic)
├── components/                 # Shared UI + app shell
├── lib/                        # Infrastructure & shared utilities
├── config/                     # Site, navigation, layout, design tokens
├── providers/                  # AppProviders composition root
├── stores/                     # Zustand state
├── types/                      # Global TypeScript types
├── hooks/                      # Shared hooks (scaffold)
├── constants/                  # Shared constants (scaffold)
├── validation/                 # Shared Zod schemas (scaffold)
└── styles/                     # (scaffold)
```

The application follows a module-oriented architecture.

- `app/` handles routing and page composition only.
- Business logic belongs inside `modules/`.
- Shared infrastructure belongs inside `lib/`.
- Shared UI belongs inside `components/`.

## 3. src/app/ — Next.js Routing Layer
```
src/app/
├── layout.tsx
├── globals.css
├── error.tsx
├── global-error.tsx
├── loading.tsx
├── not-found.tsx
│
├── (marketing)/                # Public landing (no app chrome)
│   ├── layout.tsx
│   └── page.tsx
│
├── (auth)/
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── verify-email/page.tsx
│
├── (dashboard)/                # Authenticated area (AppShell)
│   ├── layout.tsx
│   └── dashboard/
│       ├── page.tsx            # ← Dashboard home (thin composition)
│       ├── tasks/page.tsx
│       ├── habits/page.tsx
│       ├── journal/page.tsx
│       ├── notes/page.tsx
│       ├── projects/page.tsx
│       ├── goals/page.tsx
│       ├── calendar/page.tsx
│       ├── expenses/page.tsx
│       ├── interviews/page.tsx
│       ├── skills/page.tsx
│       ├── analytics/page.tsx
│       ├── resume/page.tsx
│       └── settings/page.tsx
│
├── design-system/              # Design token showcase
│   ├── layout.tsx
│   └── page.tsx
│
└── api/
    ├── .gitkeep
    └── auth/[...all]/route.ts  # Better Auth API handler
```

**Rule**

`app/` is a routing/composition layer.

Pages should not contain:

- database queries
- business rules
- module-specific data transformation
- mock data
- large inline rendering logic
- reusable business helpers

The Phase 5 dashboard is the reference implementation of this principle.

> Note: dashboard module pages live nested at `(dashboard)/dashboard/<module>/`, all sharing the dashboard route root — there are no standalone `(dashboard)/tasks/`-style top-level routes.

## 4. Dashboard Architecture — Phase 5

The dashboard is now its own module.

```
src/modules/dashboard/
├── components/
│   ├── welcome-header.tsx
│   ├── stats-row.tsx
│   ├── todays-tasks-widget.tsx
│   ├── habit-streaks-widget.tsx
│   ├── active-projects-widget.tsx
│   ├── upcoming-events-widget.tsx
│   ├── quick-notes-widget.tsx
│   ├── this-month-widget.tsx
│   ├── quarterly-goals-widget.tsx
│   └── recent-activity-widget.tsx
│
├── widgets/
│   └── quick-actions/
│       └── quick-actions-widget.tsx
│
├── services/
│   └── dashboard-service.ts        # getDashboardSnapshot() aggregator
│
├── constants.ts                    # WIDGET_DEFINITIONS, DASHBOARD_GRID
└── types.ts                        # WidgetDataMap, WidgetState<T>, DashboardSnapshot
```

The dashboard route remains intentionally thin:

```
src/app/(dashboard)/dashboard/page.tsx
                │
                ▼
getDashboardSnapshot()
                │
                ▼
   DashboardSnapshot
                │
        ┌───────┴────────┐
        ▼                ▼
 Computed slices     Module slices
 welcome/stats       tasks/habits/projects/...
        │                │
        └───────┬────────┘
                ▼
      Dashboard Widgets
```

**Dashboard responsibility**

The dashboard page only:

- calls `getDashboardSnapshot()`
- handles the top-level failure
- passes each snapshot slice to the correct widget

It does not own business logic.

## 5. Dashboard Service Architecture

The Phase 5 dashboard aggregator uses a contributor-based architecture.

```
Dashboard Page
      │
      ▼
getDashboardSnapshot()
      │
      ▼
SnapshotContributors
      │
      ├── Task Service
      ├── Habit Service
      ├── Project Service
      ├── Goal Service
      ├── Journal Service
      ├── Note Service
      ├── Calendar Service
      ├── Expense Service
      └── Activity Service
      │
      ▼
WidgetState slices
      │
      ├── tasks
      ├── habits
      ├── projects
      ├── goals
      ├── journal
      ├── notes
      ├── calendar
      ├── expenses
      └── activity
      │
      ▼
Computed dashboard slices
      ├── welcome
      └── stats
      │
      ▼
DashboardSnapshot
```

The dashboard therefore does not directly call nine different services. It calls `getDashboardSnapshot()` once.

## 6. src/modules/ — Feature Modules
```
src/modules/
├── dashboard/                  # Phase 5 — implemented (aggregator + widgets)
├── activity/                   # Phase 5 — implemented (types + datasource + service)
├── tasks/                      # Phase 5 contracts; Phase 6 CRUD
├── habits/                     # Phase 5 contracts; Phase 7
├── journal/                    # Phase 5 contracts; Phase 8
├── notes/                      # Phase 5 contracts; Phase 9
├── projects/                   # Phase 5 contracts; Phase 10
├── goals/                      # Phase 5 contracts; Phase 11
├── calendar/                   # Phase 5 contracts; Phase 12
├── expenses/                   # Phase 5 contracts; Phase 13
├── auth/                       # Phase 3 — forms + validation (no service layer)
├── analytics/                  # empty shell
├── interviews/                 # empty shell
├── resume/                     # empty shell
├── settings/                   # empty shell
└── notifications/              # empty shell
```

In Phase 5 the data-backed modules (`tasks`, `habits`, `journal`, `notes`, `projects`, `goals`, `calendar`, `expenses`, `activity`) each gained `types.ts`, a `datasource/`, and a `services/`. Their `components/` and `hooks/` remain scaffolds until the module's own phase.

## 7. Module Internal Architecture

Phase 5 established the pattern later modules should follow.

A typical domain module looks like:

```
src/modules/tasks/
│
├── components/                 # Module-specific UI (scaffold until module phase)
├── hooks/                      # Module-specific hooks (scaffold)
├── datasource/                 # Data access adapter (mock today → Drizzle)
│   └── task-datasource.ts
├── services/                   # Business/domain logic
│   └── task-service.ts
├── types.ts                    # Domain + widget data-slice types
├── validation.ts               # Zod validation (added in module phase)
└── actions.ts                  # Server Actions (added in module phase)
```

The exact files may differ by module, but the architectural direction is:

```
UI / Route
    ↓
Server Action / Server Logic
    ↓
Service
    ↓
Datasource / Repository
    ↓
Drizzle
    ↓
PostgreSQL
```

> Convention: the data-access directory is `datasource/` (not `data-sources/`), and files are named `task-datasource.ts` / `task-service.ts`.

## 8. Phase 5 Dashboard → Module Relationship

The dashboard consumes module services rather than bypassing them.

For example:

```
Task Data Source
    ↓
Task Service
    ↓
getDashboardSnapshot()
    ↓
TodaysTasksWidget
```

The dashboard must not:

```
Dashboard
   ↓
Direct database query
```

and must not create a second task implementation.

This allows Phase 6 and later phases to replace mock data sources with database-backed ones without rewriting the dashboard.

## 9. src/modules/tasks/ — Phase 6

Phase 5 already delivered the `tasks` module contracts:

```
src/modules/tasks/
├── types.ts
├── datasource/task-datasource.ts
└── services/task-service.ts
```

Phase 6 builds the persistent module on top:

```
src/modules/tasks/
├── actions.ts                  # + in Phase 6
├── validation.ts               # + in Phase 6
├── services/                   # 🔄 extend
├── datasource/                 # 🔄 Drizzle-backed impl
├── components/                 # + in Phase 6
└── hooks/                      # + in Phase 6
```

Tasks own:

- task business rules
- task validation
- task queries
- task CRUD
- completion logic
- task-specific UI
- user ownership checks

The dashboard consumes the Task Service rather than implementing task logic itself.

## 10. src/components/ — Shared UI
```
src/components/
├── ui/                         # shadcn/ui primitives
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   └── label.tsx
│
├── layout/                     # Application-wide chrome
│   ├── app-shell.tsx
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   ├── breadcrumb.tsx
│   ├── container.tsx
│   ├── theme-toggle.tsx
│   └── user-menu.tsx
│
├── shared/                     # Reusable cross-domain components
│   ├── card.tsx
│   ├── empty-state.tsx
│   ├── progress-bar.tsx
│   ├── search-input.tsx
│   ├── stats-card.tsx
│   ├── section-header.tsx
│   ├── filter-dropdown.tsx
│   ├── fade-in.tsx
│   └── command-palette.tsx
│
└── landing/                    # Marketing-page sections
    ├── hero.tsx
    ├── features-section.tsx
    ├── how-it-works.tsx
    ├── preview-section.tsx
    ├── testimonials.tsx
    ├── roadmap-section.tsx
    ├── cta-section.tsx
    ├── site-footer.tsx
    ├── logo-link.tsx
    └── github-icon.tsx
```

- `ui/` — reusable shadcn/ui primitives.
- `layout/` — application-wide layout components.
- `shared/` — reusable components not owned by one domain module.
- `landing/` — marketing website sections.

Module-specific UI stays inside the corresponding module.

## 11. src/lib/ — Infrastructure
```
src/lib/
├── config/                     # Environment & service configuration
│   ├── env.ts
│   ├── database.ts
│   └── auth.ts
│
├── auth/                       # Better Auth helpers
│   ├── config.ts
│   ├── client.ts
│   └── session.ts
│
├── db/                         # Database layer
│   ├── client.ts               # Drizzle client
│   ├── schema.ts               # Schema barrel
│   ├── schema/                 # Per-domain schema files
│   │   └── auth.ts
│   └── migrations/             # Generated SQL migrations + meta
│
├── ai/                         # (scaffold)
│   └── providers/
├── email/                      # (scaffold)
├── storage/                    # (scaffold)
│
├── result.ts                   # ServiceResult<T> contract (Phase 5)
├── format-date.ts              # Hydration-safe date helpers
├── mock-data.ts                # Deterministic demo data (read by datasources)
└── utils.ts                    # cn() and shared utilities
```

`lib/` contains infrastructure and shared technical services. It must not contain domain-specific business logic.

## 12. Database Layer
```
src/lib/db/
├── client.ts
├── schema.ts                   # Schema barrel
├── schema/
│   └── auth.ts                 # Auth sub-schema
├── migrations/
│   ├── 0000_*.sql
│   └── meta/
└── ...
```

Database responsibilities:

```
Module Datasource
        ↓
Drizzle ORM
        ↓
PostgreSQL
```

Database access must remain user-scoped where the domain is user-owned.

## 13. Other Shared Application Layers
```
src/
├── providers/                  # AppProviders composition root
│   ├── index.tsx
│   ├── theme.tsx
│   └── query.tsx
│
├── stores/                     # Zustand UI state
│   └── ui/
│       └── sidebar-store.ts
│
├── config/                     # Application configuration
│   ├── site.ts
│   ├── navigation.ts
│   ├── layout.ts
│   └── design-tokens.ts
│
├── types/                      # Global types
│   ├── index.ts
│   ├── common.ts
│   ├── navigation.ts
│   └── theme.ts
│
├── hooks/                      # (scaffold)
├── constants/                  # (scaffold)
├── validation/                 # (scaffold)
└── styles/                     # (scaffold)
```

## 14. Module Boundary Rules

These rules remain fundamental.

**Modules MAY import**

- `src/lib/*`
- `src/components/*`
- `src/hooks/*`
- `src/types/*`
- `src/constants/*`
- `src/validation/*`

**Modules MUST NOT**

- ❌ Import another feature module directly
- ❌ Access another module's database tables directly
- ❌ Put business logic in `app/` pages
- ❌ Duplicate another module's service/data-access logic

The dashboard is an intentional composition/aggregation layer, so it may consume module services through its dashboard service.

## 15. Naming Conventions
| Item | Convention | Example |
|------|-----------|---------|
| Module directory | lowercase | `tasks/` |
| Component files | kebab-case | `task-card.tsx` |
| Utility files | kebab-case | `format-date.ts` |
| Route groups | parentheses | `(dashboard)/` |
| Types | PascalCase | `TaskWidgetData` |
| Functions | camelCase | `getTaskSummary()` |
| Server Actions | camelCase | `createTask()` |
| Zod schemas | camelCase + `Schema` | `createTaskSchema` |
| DataSource files | kebab-case, `datasource` dir | `task-datasource.ts` |
| Service files | kebab-case | `task-service.ts` |

## 16. Current Phase Status
| Phase | Area | Structure Status |
|-------|------|------------------|
| Phase 1 | Project Setup | ✅ Implemented |
| Phase 2 | Design System & Layout | ✅ Implemented |
| Phase 3 | Authentication | ✅ Implemented |
| Phase 4 | Database Foundation / Architecture | ✅ Implemented |
| Phase 5 | Dashboard Architecture | ✅ Implemented |
| Phase 6 | Task Management | 🔄 Next |
| Phase 7 | Habit Tracker | 🔄 Planned |
| Phase 8 | Journal | 🔄 Planned |
| Phase 9 | Notes | 🔄 Planned |
| Phase 10 | Projects | 🔄 Planned |
| Phase 11 | Goal Tracker | 🔄 Planned |
| Phase 12 | Calendar | 🔄 Planned |
| Phase 13 | Expense Tracker | 🔄 Planned |
| Phase 14 | Interview Tracker | 🔄 Planned |
| Phase 15 | Resume Manager | 🔄 Planned |
| Phase 16 | Analytics | 🔄 Planned |
| Phase 17 | Settings & Profile | 🔄 Planned |
| Phase 18 | Production, PWA & Deployment | 🔄 Planned |

## 17. Architecture Evolution

LifeOS has evolved through the first five phases as follows:

```
Phase 1
Project Foundation
      ↓
Phase 2
Design System + Layout Shell
      ↓
Phase 3
Authentication
      ↓
Phase 4
Database + Domain Architecture
      ↓
Phase 5
Dashboard Aggregation Architecture
      ↓
Phase 6+
Real Persistent Feature Modules
```

The important architectural transition is:

```
Phase 1–3
Foundation + UI + Auth

        ↓

Phase 4
Data / Domain Architecture

        ↓

Phase 5
Dashboard consumes domain services

        ↓

Phase 6+
Real PostgreSQL-backed modules
```

This means the project is no longer building isolated UI screens. It is now moving toward real domain modules connected through shared architectural contracts.