# CLAUDE.md — Permanent Memory for Claude

> This file is read by Claude Code at the start of every session.
> It defines **who we are**, **how we work**, and **what we must never do**.

---

## Project Identity

**Project:** LifeOS  
**Tagline:** A Personal Operating System — not a todo app.  
**Owner:** Rupesh — Computer Science student, building this as a flagship portfolio project and personal daily tool.  

### Core Purpose

LifeOS exists for four reasons:

1. **Learn** full-stack software engineering through real, production-grade work
2. **Build** an outstanding portfolio project that impresses in interviews
3. **Learn** production architecture patterns from an experienced mentor (Claude)
4. **Create** an application the owner actually uses every day

---

## Architecture Philosophy

### The Operating System Metaphor

LifeOS is NOT a collection of features. It is a **platform** on which modules run.

- Every module is independent — you can remove one without breaking others
- Modules share a common shell (layout, auth, navigation)
- Modules communicate through well-defined contracts, never through import
- Adding a new module should require zero changes to existing modules

### Module Boundary Rules

```
✅ A module MAY import from:
  - src/lib/*       (infrastructure)
  - src/components/* (shared UI)
  - src/hooks/*     (shared hooks)
  - src/types/*     (global types)

❌ A module MUST NEVER:
  - Import from another module (modules/tasks → modules/habits)
  - Contain business logic in app/ route files
  - Directly access another module's database tables
```

### Module File Convention

Every module follows this structure:

```
src/modules/<name>/
  ├── actions.ts       # Server Actions / mutations
  ├── types.ts         # Module-level type definitions
  ├── validation.ts    # Zod schemas for this module's forms
  ├── components/       # React components specific to this module
  └── hooks/            # React hooks specific to this module
```

---

## Current Architecture

LifeOS currently consists of:

- Marketing Website
- Authentication System
- Dashboard Shell
- Database Foundation
- Shared UI Library
- Design System
- Navigation System
- Module Framework

Business modules (Tasks, Habits, Journal, Notes, Projects...)
exist as shells only.

## Dashboard Philosophy

The dashboard NEVER owns business logic.

The dashboard is only responsible for composing widgets.

Each widget belongs to its own module.

Examples:

TasksWidget
→ modules/tasks

HabitsWidget
→ modules/habits

JournalWidget
→ modules/journal

UpcomingEventsWidget
→ modules/calendar

RecentActivityWidget
→ modules/activity

Dashboard imports widgets.

Widgets import their own queries.

Dashboard never directly queries the database.

## Data Ownership

Every feature owns:

- schema
- server actions
- queries
- validation
- components
- widgets

No module accesses another module's tables directly.

Shared data only travels through public interfaces.

## Coding Standards

### TypeScript

- **Always** use strict TypeScript
- **Never** use `any` — use `unknown` and narrow
- **Never** use `as` casts — prefer type guards
- **Always** define explicit return types on exported functions
- **Prefer** `type` over `interface` for data models
- **Prefer** `interface` over `type` for class-like shapes (components, services)

### React Components

- **Always** prefer server components unless client interactivity is required
- **Always** use Server Actions (not API routes) for mutations
- **Always** mark client-only files with `'use client'` — place it as the very first line
- **Always** destructure props, never use `Props` types
- **Never** use `React.FC` — use `({ prop }: { prop: Type }) =>` pattern
- **One component per file** — except for small private helpers
- **Always** import from `@/` alias, never from `../../` relative paths

### Naming

| What | Convention | Example |
|------|-----------|---------|
| Files (shared components) | PascalCase | `TaskCard.tsx` in `src/components/` |
| Files (module components) | kebab-case | `task-item.tsx` in `src/modules/<name>/components/` (see ADR-019) |
| Files (utilities) | kebab-case | `format-date.ts` |
| Functions | camelCase | `createTask()` |
| Types | PascalCase | `Task` |
| Database columns | snake_case | `created_at` |
| Database tables | plural | `tasks`, `user_sessions` |
| Zod schemas | camelCase + `Schema` | `createTaskSchema` |
| Server Actions | camelCase | `createTask`, `deleteProject` |

### Database

- **Always** use UUID primary keys — never auto-increment integers
- **Always** use `created_at` and `updated_at` timestamps
- **Always** add indexes where you'd write a WHERE clause
- **Prefer** normalization — no duplicated data
- **Only** use soft deletes when there's a audit trail requirement
- **Always** write migrations — never modify tables manually
- **Always** write down migration before applying

---

## How Claude Must Work

### Workflow Rules

1. **Never generate an entire feature in one response.** Break it into the smallest logical unit.
2. **Always explain WHY before writing code.** The why is more important than the code itself.
3. **Always propose multiple approaches** when more than one reasonable path exists. Recommend the best professional choice and explain the tradeoffs.
4. **Wait for explicit approval before moving to the next step.** Never batch beyond the current micro-milestone.
5. **State software engineering principle behind decisions.** Mention patterns by name: Principle of Least Privilege, Separation of Concern, etc.

### Teaching Style

- Treat user as a junior engineer being mentored
- Explain the **concept** first, then the **implementation**
- Connect decisions to real-world engineering practices
- Mention what enterprise teams do at scale

### Code Generation Rules

- **Never** write more than ~200 lines in one response
- **Always** separate concerns — one file, one responsibility
- **Always** write tests with a feature (not separate phase)
- **Always** handle errors, loading states, and empty states
- **Always** run the code after writing it (via `/run` or equivalent)
- **Never** leave broken code in the tree

### Documentation Rules

- **Always** update docs/ and .claude/ as we go
- **Always** record technical decisions in `.claude/DECISIONS.md`
- **Always** update CHANGELOG.md for every meaningful change
- Documentation is a first-class citizen, not an afterthought
After every completed phase:

1. PROJECT_STATUS.md

2. CHANGELOG.md

3. README.md

4. CLAUDE.md

5. Git Tag

6. GitHub Release

7. Verify Build

8. Push

---

## Things Claude Must NEVER Do

- ❌ Generate an entire file structure without approval
- ❌ Write feature code rendering planning documents
- ❌ Use deprecated libraries or patterns
- ❌ Install dependencies without explaning what each does
- ❌ Skip type safety with `any` or type assertions
- ❌ Write duplicate utility code
- ❌ Create components that already exist in the project
- ❌ Generate create business logic in `app/` route files (routing only)
- ❌ Skip error handling, even in "quick" features
- ❌ Dump everything into `/components` or `/lib` (organize into modules)
- ❌ Import from another module (violates module boundary)

---

## Commit Convention

Follow Conventional Commits:

```
feat: add task creation dialog
fix: resolve habit streak calculation at midnight
refactor: extract date picker to shared component
docs: update database ER diagram in DATABASE.md
chore: upgrade next to 15.2.0
```

Types: `feat` | `fix` | `refactor` | `docs` | `chore` | `test` | `perf` | `ci`

Branch naming: `<type>/<short-description>` — e.g. `feat/task-creation`

---

## Reference

- Technology decision log: `.claude/DECISIONS.md`
- Coding rules: `.claude/RULES.md`
- Architecture: `docs/Architecture.md`
- Engineering handbook: `docs/Engineering-Handbook.md`
- Project landscape: `docs/Roadmap.md`
- Tooling decisions: `docs/engineering/tooling.md`
- Project progress: `docs/PROJECT_STATUS.md`

---

Version: 0.6.0-alpha

Current Phase:
Phase 6 — Task Management (Business Module MVP) (Complete)

Completed Phases
✓ Phase 0
✓ Phase 1
✓ Phase 2
✓ Phase 3
✓ Phase 4
✓ Phase 5
✓ Phase 6
- **Project Status:** Phase 6 — Task Management complete (M1–M12, verified 2026-08-14). First real DB-backed business module; migration 0001 applied to dev Neon DB; Asia/Kolkata timezone fix verified. Main docs + ADRs + Git release deferred to next session.

## Current Implementation State

## Phase 0 — Documentation & Reference

- **Dependency manifest:** `docs/DEPENDENCIES.md` — every package, justification, and alternatives considered (30 packages)
- **Architectural decisions:** `.claude/DECISIONS.md` — 14 ADRs covering every technology choice from Next.js 15 to TanStack Query factory pattern
- **Project status:** `docs/PROJECT_STATUS.md` — live tracker (current phase, milestones, verification gates)
- **Folder structure:** `docs/FOLDER_STRUCTURE.md` — every directory, naming rules, module boundaries
- **Engineering handbook:** `docs/Engineering-Handbook.md` — coding standards, component patterns, error handling
- **Changelog:** `docs/CHANGELOG.md` — Keep a Changelog format, updated through M22
- **All gates green:** `typecheck` ✅ `lint` ✅ `format:check` ✅ `build` ✅ (17 routes)

## Phase 1 — Active Tooling Decisions

- **Tailwind CSS v4** is in use (not v3). Configuration is CSS-based via `@import "tailwindcss"` and `@theme inline` in `src/app/globals.css`. There is NO `tailwind.config.ts`. Use `postcss.config.mjs` with `@tailwindcss/postcss` plugin.
- **ESLint 9** flat config via `eslint.config.mjs` using `@next/eslint-plugin-next` (`flatConfig.recommended` + `flatConfig.coreWebVitals`) and `@eslint/js`. Do NOT use `eslint-config-next` (the legacy package) — it breaks with ESLint 9.
- **pnpm `allowBuilds`** is in `pnpm-workspace.yaml` for `sharp` and `unrs-resolver`.
- **shadcn/ui v2** uses `@base-ui/react` (not Radix). Buttons don't support `asChild` — Base UI uses the `render` prop instead. Import components from `@/components/ui/`.
- **Site config** is centralized in `src/config/site.ts` — all branding, metadata, and links live there. Import `siteConfig` for app name, description, or GitHub URL anywhere in the app.
- **AppProviders** in `src/providers/index.tsx` is the single composition root. Layout.tsx wraps `<AppProviders>` once — adding future providers (QueryClient, Sonner, Auth) requires zero layout changes.
- **Route groups** `(marketing)` (public pages, no chrome) and `(dashboard)` (AppShell with sidebar, header, footer). Dashboard layout lives at `src/app/(dashboard)/layout.tsx`.
- **AppShell** is now a client component powered by a **Zustand sidebar store** — `src/stores/ui/sidebar-store.ts` (ADR-009). No provider required; components subscribe directly.
- **Sidebar** reads navigation items from `src/config/navigation.ts` — the single source of truth for all nav links and icons. Add a module = one insert in navigation.ts, zero changes to sidebar.
- **Active navigation highlighting** uses `usePathname()` from `next/navigation` — `pathname.startsWith(href)` pattern.
- **Theme toggle** uses a shadcn DropdownMenu (not a button cycle) — three radio options: Light → Dark → System.
- **Command palette** placeholder listens globally for ⌘K / Ctrl+K and opens a Base UI Dialog. Hook: `src/components/shared/command-palette.tsx`.
- **TanStack Query** is wired via `src/providers/query.tsx` — server-safe QueryClient factory pattern (prevents cross-session data leaks). Full `@tanstack/react-query` provider ready inside AppProviders.
- **Sonner** `<Toaster />` is mounted globally inside AppProviders at bottom-right position, richColors, theme-aware.
- **shadcn/ui dropdown-menu and dialog** installed — the dropdown uses Base UI's Menu primitive. Trigger is styled with className; no `asChild` needed.

## Phase 2 — Design System & Layout Shell (Complete)

- **Apple/Linear-inspired design tokens** in `globals.css` — cool-blue neutral undertones, Apple blue accent (#007AFF), oklch color space, CSS custom properties for animation durations/easing, `prefers-reduced-motion` support
- **Design token registry** at `src/config/design-tokens.ts` — typed definitions for colors, typography, spacing, radii, shadows, animations, and fonts; consumed by the design-system showcase page
- **Dynamic `<Breadcrumb>`** at `src/components/layout/breadcrumb.tsx` — reads pathname, hides dashboard segment, shows home icon + trail with chevrons, `aria-current="page"`, integrated into Header
- **Reusable `<Container>`** at `src/components/layout/container.tsx` — three width variants (narrow/default/wide), centered with responsive padding, polymorphic `as` prop
- **Design System Showcase** at `/design-system` — standalone page rendering all tokens: color swatches (light+dark hex), typography scale, spacing bars, radius shapes, fonts, animation specs, all button variants × sizes, sample Dialog, sample DropdownMenu, icon grid, theme toggle
- **Accessibility improvements**: skip-to-content link in root layout (keyboard-first), visible focus ring on `:focus-visible` (Apple blue, WCAG AAA), `aria-label` on breadcrumb, `aria-current`, reduced-motion global rule
- **4 build routes** — `/`, `/dashboard`, `/_not-found`, `/design-system`
- **All gates green** — typecheck ✅, lint ✅, build ✅

## Phase 2 Extension — Landing Page, Dashboard & Module Pages (Complete)

- **Premium landing page** at `/` — 8 narrative sections (Hero → Features → How It Works → Preview → Testimonials → Roadmap → CTA → Footer). Hero uses framer-motion floating glows + dot-grid mask. All sections wrapped in `<FadeIn>` (respect `prefers-reduced-motion`).
- **Shared UI component library** in `src/components/shared/` — `<Card>` (3 variants: default/hover/glass), `<EmptyState>`, `<ProgressBar>`, `<SearchInput>`, `<StatsCard>`, `<SectionHeader>`, `<FilterDropdown>`, `<FadeIn>` (framer-motion wrapper, `useReducedMotion`).
- **Rich dashboard** at `/dashboard` — welcome header, 4 StatsCards, Today's Tasks (priority dots + checkboxes), Active Projects (progress bars), Habit Streaks, Upcoming, Quick Notes, Recent Activity timeline, This Month balance. All data from `src/lib/mock-data.ts`.
- **13 module page shells** in `src/app/(dashboard)/` — tasks, habits, journal, notes, projects, goals, skills, calendar, expenses, interviews, resume, settings, analytics. Each: SectionHeader + 4-col StatsCard row + Card with recent items + EmptyState.
- **Mock data** centralized at `src/lib/mock-data.ts` — server-safe (no `new Date()` calls, all ISO strings). Single source for all demo content across landing + dashboard + module pages.
- **Date utility** at `src/lib/format-date.ts` — `formatShortDate`, `formatShortDateTime`, `splitDate`. Deterministic ISO string parsing (no `new Date()`) — prevents hydration mismatches. Strict null-safe via `parseIsoDate` guard.
- **Skills** added to navigation (`src/config/navigation.ts`) — `Code2` icon, "g k" shortcut, in Career group.
- **framer-motion v12** installed — used only in `<FadeIn>` and Hero for intentional motion. `useReducedMotion` accessibility hook respected everywhere.
- **`GithubIcon`** SVG component at `src/components/landing/github-icon.tsx` — lucide-react removed brand icons, so the GitHub mark is an inline SVG inheriting `currentColor`.
- **17 build routes**, **all 15 dashboard routes return HTTP 200** (dev server verified).
- **All gates green** — typecheck ✅, lint ✅, build ✅ (17 routes).

---

## Phase 3 (Authentication) and 4 (Database Foundation) are fully implemented, verified, and production‑ready.

- **All verification gates:** TypeScript ✅, ESLint ✅, Prettier ✅, Build ✅, Auth flow ✅, DB access ✅, Security ✅.



## Phase 5 — Dashboard Foundation & Widget Architecture (Complete)

**Status:** 8/8 milestones complete (verified 2026-08-06). All gates green.

**Goal:** Preserve the visual dashboard; replace the monolithic 333-line page with a pure composition layer over a real widget architecture.

**Milestones (M1 → M8):**
- **M1 — ServiceResult + Module Types:** `ServiceResult<T>` (discriminated union, no helpers) + typed module contracts across 9 modules + dashboard (11 `types.ts` files + `src/lib/result.ts`).
- **M2 — DataSources:** interface + mock impl + `createXxxDataSource()` factory + `toDomain()` adapter. Nine `datasource/` files. The ONLY place mock data is imported — swappable to Drizzle in Phase 6 with zero service/widget changes.
- **M3 — Module Services:** plain `async` functions returning `ServiceResult<XxxWidgetData>`; filter/sort/count/slice logic lives here, never in the UI. Nine `services/` files.
- **M4 — Dashboard Aggregator:** `getDashboardSnapshot()` iterates `SnapshotContributor[]` via `Promise.all` — one failed service never breaks the other eight.
- **M5 — Dashboard Constants:** `WIDGET_DEFINITIONS`, `WIDGET_ICONS`, `QUICK_ACTION_ICON`, `DASHBOARD_GRID` in `modules/dashboard/constants.ts`.
- **M6 — Dashboard Widgets:** 11 pure-presentational widgets (WelcomeHeader, StatsRow, 9 data-backed) — zero business logic; shared UI components only.
- **M7 — Dashboard Page Refactor:** dashboard page rewritten 333 → ~58 lines (pure composition). Added computed `welcome`/`stats` slices inside the aggregator.
- **M8 — Build & Verify:** typecheck ✅, lint ✅, build ✅ (24 routes, `/dashboard` prerendered static).

**Key ADRs (D1–D14):** Widget data slices are independent · `WidgetState<T>` discriminated union (no impossible states) · two registries (data `SnapshotContributor[]` + UI `DashboardWidgetDefinition[]`) joined on `WidgetKey` · explicit `DashboardSnapshot` interface · one documented `as` cast in the build loop (D14).

**Architecture pattern:** Dashboard never imports mock data and never runs business logic. DataSources own data, Services own logic, Aggregator composes, Widgets render. The dependency arrow always points inward (Clean Architecture).

**Full milestone detail + ADRs:** `.claude/plans/phase5-dashboard.md`.

## Phase 6 — Task Management (Business Module MVP) (Complete)

**Status:** M1–M12 complete (verified 2026-08-14). All gates green. This is the **first real DB-backed business module** — the first server-action module, the first user-scoped datasource, and the first domain table beyond auth.

**Goal:** Take the Tasks module from a mock shell to a fully working, user-scoped CRUD feature over PostgreSQL via Drizzle, wired through the Phase 5 seams — while keeping the dashboard on the same data.

**Milestones (M1 → M12):**
- **M1 — Repo Audit:** read-only; confirmed the `TaskDataSource` seam, `getTaskSummary(userId, ds?)`, and migration `0001` is next. No drift.
- **M2 — Schema + Migration:** `src/lib/db/schema/tasks.ts` + `0001_graceful_ultimo.sql`. `tasks` table: UUID PK, `user_id` → `users.id` **`ON DELETE CASCADE`**, 3 indexes (`tasks_user_id_idx`, `tasks_status_idx`, `tasks_due_date_idx`), varchar `priority`/`status` defaults (not pgEnum, matching `users.role`).
- **M3 — Data Source:** `DrizzleTaskDataSource` replaces the mock behind the preserved factory. **User-scoped** — ownership enforced at the SQL boundary via `WHERE (user_id AND id)`; `getUserTasks(userId)`; mutations return serializable `ServiceResult` (never throw).
- **M4 — Service Layer:** `getTasks(userId,{filter,sort})` + `today`/`upcoming`/`completed`/`create`/`update`/`delete`/`toggle`. `getTaskSummary` dashboard contract preserved byte-for-byte.
- **M5 — Validation + Server Actions:** repo's first `actions.ts` — 4 auth-gated actions (`getSession()` → Zod parse → service → `revalidatePath`). Shared client+server Zod schemas in `validation.ts`.
- **M6 — Tasks Page:** `/dashboard/tasks` rewritten as a server component — session guard, validated `searchParams`, `<Suspense>` skeleton, real error/empty/success states. No mock.
- **M7 — Task CRUD UI:** `TaskForm` (RHF+zod) behind `NewTaskDialog` (create) and inline edit/delete dialogs in `TaskItem`. Mutations only via Server Actions. Client leaves (`TaskItem`, `NewTaskDialog`) over server list.
- **M8 — Filtering + Sorting:** `TaskFilterBar` — **server-component, URL-driven** single-select controls (`?filter`/`?sort` write into `searchParams`; `aria-current`, `scroll={false}`). Zero new client surface, zero duplicated logic.
- **M9 — Completion UX:** optimistic toggle via `useState` mirror + `useTransition`, exact rollback, `--chart-2` completed styling, Sonner feedback.
- **M10 — Dashboard Real-Data:** `/dashboard` is auth-gated and now **`ƒ (Dynamic)`**; `getDashboardSnapshot(realUserId, name)` resolves the `OWNER_NAME` placeholder; Today's Tasks + `tasksDueToday` read the real user-scoped Task service through the untouched M5 registration seam.
- **M11 — Error / Empty / Loading:** every read + all 5 mutation paths surface real loading/empty/error/success; delete dialog added `isDeleting` in-flight state. No fake fallbacks.
- **M12 — Verification:** migration `0001` **applied directly to dev Neon DB in a single transaction** (auth tables matched `0000` but `__drizzle_migrations` was absent, so direct-apply, not claimed as a `db:migrate` run). DB reconcilied + verified. Read-only TaskService/DashboardService smoke ✅. SSR/auth-boundary checks ✅. All gates green. **Asia/Kolkata timezone bug fixed + manually verified.** Main docs + ADRs + Git release intentionally deferred to next session.

**Key ADRs:** user-scoped datasource + `getUserTasks` naming · today/upcoming filter semantics (today = due on/before, non-completed; upcoming = strictly after) · sort-by-created newest-first · **Asia/Kolkata "today"** via `Intl.DateTimeFormat("en-CA",{timeZone})` replacing UTC `toISOString().slice(0,10)` (the M12 timezone fix — corrected Today/Upcoming/summary/dashboard date behavior) · shared-validation-file pattern · server-actions-as-mutation-boundary · delete-returns-`{success,message?}` · RHF/Zod optional-string `dueDate` · varchar-enum precedent.

**Key architecture points:** `app/` only composes — business logic stays in the service, data access in the datasource, mutations only through Server Actions (auth-gated, ownership-scoped at SQL). Dependency arrow stays inward (Clean Architecture). `/dashboard/tasks` and `/dashboard` are now permanently `ƒ (Dynamic)` — do not re-statify. Component filenames in the Tasks module follow **kebab-case** (`task-item.tsx`, `task-form.tsx`, `task-filter-bar.tsx`) — noted precedent to reconcile with CLAUDE.md's PascalCase naming table during the docs pass. `MOCK_TASKS`/`mock-data` still feed the other 8 dashboard modules, unchanged.

**Runtime notes for future modules:** migration `0001` was hand-applied, so if a dev DB is recreated, `pnpm db:migrate` should be verified (the `__drizzle_migrations` table now exists). Module-page template = **server component list + URL-driven filter bar + thin client leaf rows/dialogs + shared Zod + Server Actions**.

**Full milestone detail + execution log:** `.claude/plans/phase6-task-implementation.md` and requirements in `.claude/plans/phase6-task-management.md`.



Documentation must always be updated before tagging a release.
---

*Last updated: 2026-08-14 — LifeOS Phase 6 (Task Management) implementation + verification complete; docs/ADRs/Git release pending*