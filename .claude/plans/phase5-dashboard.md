# Phase 5 — Dashboard Foundation & Widget Architecture

> Implementation Plan v2 — single source of truth for Phase 5 progress.

---

## Phase 5 Progress

### Overall Progress

████████████████████████ 100% &nbsp; (8 / 8 milestones)

### Current Milestone
✅ Phase 5 complete — ready for Phase 6

### Completed
- ✅ M1 — ServiceResult + Module Types
- ✅ M2 — DataSources
- ✅ M3 — Module Services
- ✅ M4 — Dashboard Aggregator
- ✅ M5 — Dashboard Constants
- ✅ M6 — Dashboard Widgets
- ✅ M7 — Dashboard Page Refactor
- ✅ M8 — Build & Verify

### In Progress
- *(none)*

### Remaining
- *(none)*

---

## Files Created

### M1
- `src/lib/result.ts`
- `src/modules/tasks/types.ts`
- `src/modules/habits/types.ts`
- `src/modules/projects/types.ts`
- `src/modules/goals/types.ts`
- `src/modules/journal/types.ts`
- `src/modules/notes/types.ts`
- `src/modules/calendar/types.ts`
- `src/modules/expenses/types.ts`
- `src/modules/activity/types.ts`
- `src/modules/dashboard/types.ts`

### M2
- `src/modules/tasks/datasource/task-datasource.ts`
- `src/modules/habits/datasource/habit-datasource.ts`
- `src/modules/projects/datasource/project-datasource.ts`
- `src/modules/goals/datasource/goal-datasource.ts`
- `src/modules/journal/datasource/journal-datasource.ts`
- `src/modules/notes/datasource/note-datasource.ts`
- `src/modules/calendar/datasource/calendar-datasource.ts`
- `src/modules/expenses/datasource/expense-datasource.ts`
- `src/modules/activity/datasource/activity-datasource.ts`

### M3
- `src/modules/tasks/services/task-service.ts`
- `src/modules/habits/services/habit-service.ts`
- `src/modules/projects/services/project-service.ts`
- `src/modules/goals/services/goal-service.ts`
- `src/modules/journal/services/journal-service.ts`
- `src/modules/notes/services/note-service.ts`
- `src/modules/calendar/services/calendar-service.ts`
- `src/modules/expenses/services/expense-service.ts`
- `src/modules/activity/services/activity-service.ts`

### M4
- `src/modules/dashboard/services/dashboard-service.ts`

### M5
- `src/modules/dashboard/constants.ts`

### M6
- `src/modules/dashboard/components/welcome-header.tsx`
- `src/modules/dashboard/components/stats-row.tsx`
- `src/modules/dashboard/components/todays-tasks-widget.tsx`
- `src/modules/dashboard/components/habit-streaks-widget.tsx`
- `src/modules/dashboard/components/active-projects-widget.tsx`
- `src/modules/dashboard/components/upcoming-events-widget.tsx`
- `src/modules/dashboard/components/quick-notes-widget.tsx`
- `src/modules/dashboard/components/this-month-widget.tsx`
- `src/modules/dashboard/components/quarterly-goals-widget.tsx`
- `src/modules/dashboard/components/recent-activity-widget.tsx`
- `src/modules/dashboard/widgets/quick-actions/quick-actions-widget.tsx`

### M7
- *(none — page refactor modified existing files; see Files Modified)*

### M8
- *(none — verification only)*

## Files Modified

### M1
- None

### M2
- `src/modules/activity/types.ts` — added `"expenses"` to `ActivitySource` union

### M3
- None

### M4
- `src/modules/dashboard/types.ts` — refined: added `WidgetDataMap`, `WidgetKey`, `WidgetState<T>` (discriminated union), metadata (`version`, `generatedAt`), `defaultOrder`; `DashboardSnapshot` now explicit `WidgetState` per key; removed `WidgetProps<T>`/`errors`/`priority`

### M5
- None

### M6
- None

### M7
- `src/app/(dashboard)/dashboard/page.tsx` — full rewrite to a thin composition layer (333 → 58 lines). Calls `getDashboardSnapshot()` once, handles the `ServiceResult` failure with a single inline fallback, and renders `WelcomeHeader`, `StatsRow`, the nine data-backed widgets, and `QuickActionsWidget` — each receiving exactly its snapshot slice. No mock data, no helpers, no business logic, no `ACTIVITY_ICONS`/`ViewAll`/`priorityDot`, no inline list rendering, no duplicated imports/exports.
- `src/modules/dashboard/services/dashboard-service.ts` — derived the two computed slices (`welcome`, `stats`) inside `getDashboardSnapshot()` from the already-loaded module slices (no new service calls). The build-loop + final `as unknown as DashboardSnapshot` cast was replaced by a single read-path cast to a local mapped `LoadedSlices` type, so the assembled object literal satisfies `DashboardSnapshot` directly — one fewer cast overall (ADR D14 retained, refined).
- `src/modules/dashboard/types.ts` — extended `DashboardSnapshot` with `welcome: WidgetState<WelcomeWidgetData>` and `stats: WidgetState<DashboardStats>` (both computed, so deliberately NOT in `WidgetDataMap`). Added `WelcomeWidgetData`; corrected the stale `DashboardStats` doc comment.

### M8
- None

---

## Phase 5 Artifact Index

Tracks every major artifact and its completion. Updated after each milestone.

| Artifact | Milestone | Status | Location |
|----------|-----------|--------|----------|
| `ServiceResult<T>` | M1 | ✅ Done | `src/lib/result.ts` |
| Module domain + widget types (9 modules + dashboard) | M1 | ✅ Done | `src/modules/*/types.ts` |
| DataSources (9) | M2 | ✅ Done | `src/modules/*/datasource/*-datasource.ts` |
| Module Services (9) | M3 | ✅ Done | `src/modules/*/services/*-service.ts` |
| `WidgetDataMap`, `WidgetKey`, `WidgetState<T>` | M1→M4 | ✅ Done | `src/modules/dashboard/types.ts` |
| `DashboardSnapshot` (explicit + metadata) | M1→M4 | ✅ Done | `src/modules/dashboard/types.ts` |
| `DashboardWidgetDefinition` (+ `defaultOrder`) | M5 | ✅ Type done in M4; array in M5 | `src/modules/dashboard/types.ts` → `constants.ts` |
| Dashboard Aggregator (`getDashboardSnapshot`) | M4 | ✅ Done | `src/modules/dashboard/services/dashboard-service.ts` |
| `SnapshotContributor` registry | M4 | ✅ Done | `src/modules/dashboard/services/dashboard-service.ts` |
| `WIDGET_DEFINITIONS` constant + grid config | M5 | ✅ Done | `src/modules/dashboard/constants.ts` |
| Widgets (11) | M6 |✅ Done | `src/modules/dashboard/widgets/*/` |
| Dashboard page refactor (333 → ~58 lines, pure composition) | M7 | ✅ Done | `src/app/(dashboard)/dashboard/page.tsx` (+ 2 contract files) |
| Build verification | M8 | ✅ Done | `pnpm typecheck / lint / build` |

---

## Architecture Decisions

### D1 — Widget data slices are independent types
**Reason:** A widget knows only its own shape. No widget imports `DashboardSnapshot`. This prevents accidental coupling — changing `TaskWidgetData` triggers TypeScript errors ONLY in `TodaysTasksWidget`, not in every widget.

### D2 — `ServiceResult<T>` has no helper functions
**Reason:** Premature abstraction. `isSuccess()` / `isError()` helpers add indirection without value. Pattern-match via `if (result.success)` — the discriminant property is the API.

### D3 — Entity types model Drizzle tables, not mock data shapes
**Reason:** Types are forward-looking. `Task` includes `userId`, `description`, timestamps even though mock data doesn't have them. When Drizzle schemas land in Phase 6, the types are already correct.

### D4 — `ActivitySource` replaces `iconName: string`
**Reason:** Mock data had `iconName: string` — a leaky abstraction. `source: ActivitySource` is semantic. Widget maps source → icon at render time.

### D5 — DataSources map mock types to domain types inside `toDomain()`
**Reason:** `MockTaskDataSource` imports `TaskItem` from mock-data and returns `Task` from module types. The `toDomain()` adapter isolates the mock shape behind the datasource interface. When Drizzle replaces mock data, `toDomain` is replaced by Drizzle row mapping — the interface does not change.

### D6 — Services are functions, not classes — DI via optional parameter
**Reason:** `getTaskSummary(userId, ds)` defaults `ds` to `createTaskDataSource()`. This is dependency injection without a container or class hierarchy. Tests pass a mock datasource; production uses the default. The function is the seam.

### D7 — Services short-circuit on datasource failure
**Reason:** If the datasource returns `{ success: false }`, the service returns that same failure immediately — no transformation, no wrapping. The service only transforms data on the success path. This keeps the `ServiceResult` chain transparent and avoids error-nesting.

### D8 — Aggregator function, not a fluent Builder (refinement R1)
**Decision:** Adopt the name "aggregator" for semantic accuracy, but keep `getDashboardSnapshot` a single `async` function — NOT a fluent builder (`.withTasks().withHabits().build()`).
**Reason:** A fluent builder earns its keep when callers compose varying subsets; we always aggregate all enabled modules. A builder here would add indirection and a chainable API surface with no new capability. The function IS the aggregation seam. YAGNI.

### D9 — Two registries: SnapshotContributor (data) + DashboardWidgetDefinition (UI) (refinement R2)
**Decision:** Drive the aggregator from a `SnapshotContributor[]` array (`{ key, load }`) it iterates via `Promise.all` — adding a module = one array entry, zero aggregator code changes. Keep UI metadata (`icon`, `size`, `defaultOrder`, `viewAllHref`) in a separate `DashboardWidgetDefinition[]` (M5) and join on `WidgetKey` at render.
**Reason:** Separation of concerns — the aggregator depends only on data concerns, the page depends only on presentation metadata. Tradeoff accepted: adding a module touches two type-checked arrays rather than one fat object (still minimal). Rejected a single unified registry to avoid mixing `load` functions into a UI-definition record. Future `user_widget_prefs` table overrides `defaultOrder`/`enabled` per user.

### D10 — DashboardSnapshot gains metadata; errors embedded per-widget (refinement R3)
**Decision:** `DashboardSnapshot` now carries `version: 1` and `generatedAt: string` (ISO, from server-time `new Date()`). The separate `errors` map is removed — errors live inside each slice as `WidgetState`.
**Reason:** `generatedAt` enables cache freshness checks and client staleness display. `version` enables future snapshot migration/invalidation when the aggregate shape evolves. Embedding errors per-widget removes a parallel error structure that could drift out of sync with the data slices. `new Date()` is safe here — this is a per-request server function, not SSR-deterministic mock-data.

### D11 — WidgetState discriminated union replaces WidgetProps (refinement R4)
**Decision:** Replace `WidgetProps<T> = { data: T | null; error?: string }` with a discriminated union:
`type WidgetState<T> = { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; message: string }`.
Dashboard passes a SINGLE `state` prop to each widget. Emptiness stays widget-internal (derived from `data`).
**Reason:** The old shape allowed the impossible state (both `data` and `error` set). The union makes states mutually exclusive and the type system rejects the bad combination. Passing one `state` object (not `data`+`error` props) matches the refinement. `loading` exists for future Suspense/streaming though the synchronous aggregator only emits `success`/`error` today.

### D12 — defaultOrder replaces priority; drag-drop ready (refinement R5)
**Decision:** `DashboardWidgetDefinition.priority` → `defaultOrder: number`. Add nothing else now.
**Reason:** Same semantics (canonical sort position) but named for its future role: a `user_widget_prefs.order` override will fall back to `defaultOrder` when drag-and-drop arrives. `enabled` already supports hide; `id: WidgetKey` ensures a stable key for reordering. No drag-drop UI built — only the data shape is prepared. This is reversible; if a future need differs, one rename.

### D13 — WidgetDataMap + explicit DashboardSnapshot (refined during M4)
**Decision:** Introduce `WidgetDataMap` (maps widget keys → data-slice types) and `WidgetKey = keyof WidgetDataMap`. These drive registry type-safety (`SnapshotContributor.key: WidgetKey`, `DashboardWidgetDefinition.id: WidgetKey`) — adding a key forces TS errors in both registries until the widget is registered.
**However:** `DashboardSnapshot` is an **explicit interface** (each field typed `WidgetState<XxxWidgetData>` + metadata), NOT a mapped `[K in WidgetKey]` type. A mapped snapshot collides with TS's correlated-records limitation — `Promise.all` flattens each `[key, state]` tuple so the union `K` can't stay correlated with `WidgetState<WidgetDataMap[K]>` at the assignment site, demanding casts everywhere. The explicit interface is more readable for consumers (`snapshot.tasks` shows `WidgetState<TaskWidgetData>` directly) and needs only ONE documented cast in the build loop (see D14).
**Tradeoff accepted:** adding a widget touches `WidgetDataMap`, `SnapshotContributors`, the explicit `DashboardSnapshot` interface, and `WIDGET_DEFINITIONS` (4 type-checked edits) instead of 3 — worth it for readability and minimal casts.

### D14 — One justified cast in the aggregator build loop (M4)
**Decision:** The aggregator's `for (const [key, state] of results) { slices[key] = state; }` uses a single localized `as` cast: `(slices as Record<WidgetKey, WidgetState<unknown>>)[key] = state`.
**Reason:** TypeScript cannot correlate the union key `K` with `WidgetState<WidgetDataMap[K]>` after `Promise.all` flattens the tuples — this is the well-known *correlated-records* limitation, not a logic flaw. Runtime pairing is guaranteed by construction (each contributor emits its own `[key, state]`). CLAUDE.md discourages `as` casts, but a type guard cannot help here (this is not a narrowing problem); the alternative — abandoning the registry for explicit per-key awaits — costs the R2 "minimal module-add edits" benefit. The cast is contained to one line, commented, and the assembled object is re-cast to `DashboardSnapshot` once at the return. This is the pragmatic senior-engineer trade.

---

## Verification Log

### M1
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

### M2
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

### M3
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

### M4
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

### M5
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

### M6
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

### M7
- ✅ `pnpm typecheck` — clean (`tsc --noEmit`, no errors)
- ✅ `pnpm lint` — clean (ESLint flat config, no warnings/errors)
- ✅ `pnpm build` — compiled successfully; 24 routes; `/dashboard` prerendered static (`○`, 826 B / 111 kB First Load JS)

### M8
- ✅ `pnpm typecheck` — clean (`tsc --noEmit`, no errors)
- ✅ `pnpm lint` — clean (ESLint flat config, no warnings/errors)
- ✅ `pnpm build` — compiled successfully in 7.3s; 24 routes generated; `/dashboard` prerendered as static (`○`)

---

## Milestones

## M1 — ServiceResult + Module Types

**Status:** ✅ Completed

**Completion Date:** 2026-08-05

**Objective:** Establish the type foundation — `ServiceResult<T>`, core entity types for every module, widget data slices, and `DashboardSnapshot` as the composition contract.

**Files Created (11):**
- `src/lib/result.ts`
- `src/modules/tasks/types.ts`
- `src/modules/habits/types.ts`
- `src/modules/projects/types.ts`
- `src/modules/goals/types.ts`
- `src/modules/journal/types.ts`
- `src/modules/notes/types.ts`
- `src/modules/calendar/types.ts`
- `src/modules/expenses/types.ts`
- `src/modules/activity/types.ts`
- `src/modules/dashboard/types.ts`

**Files Modified:** None

**Architecture Decisions:**
- `ServiceResult<T>` uses discriminated union `{ success, data } | { success: false, message }` — no helpers, no classes
- Every module exports both core entity types AND a `XxxWidgetData` slice
- `DashboardSnapshot` aggregates all 9 widget slices + `errors` record (for per-module failure tracking)
- `WidgetProps<T>` enforces one-widget-one-slice rule — widgets never see the full snapshot
- `DashboardWidgetDefinition` includes `id`, `module`, `icon`, `size`, `priority`, `enabled`, `viewAllHref`
- All IDs are `string` (UUID), all date fields are `string` (ISO), all entities have `userId`
- Entity types model Drizzle table shapes (`userId`, timestamps) even though tables don't exist yet

**Verification:**
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

**Deviations from Plan:** None

**Notes:** Types are forward-looking — designed for Drizzle columns, not mock data shapes.

**Ready for Next:** ➡️ M2 — DataSources

---

## M2 — DataSources (Data Adapters)

**Status:** ✅ Completed

**Completion Date:** 2026-08-05

**Objective:** Create data access adapters for every module. Each DataSource exports an interface + mock implementation + factory function. When Drizzle tables exist in Phases 6+, the mock class is replaced — zero changes to services or widgets.

**Files Created (9):**
- `src/modules/tasks/datasource/task-datasource.ts`
- `src/modules/habits/datasource/habit-datasource.ts`
- `src/modules/projects/datasource/project-datasource.ts`
- `src/modules/goals/datasource/goal-datasource.ts`
- `src/modules/journal/datasource/journal-datasource.ts`
- `src/modules/notes/datasource/note-datasource.ts`
- `src/modules/calendar/datasource/calendar-datasource.ts`
- `src/modules/expenses/datasource/expense-datasource.ts`
- `src/modules/activity/datasource/activity-datasource.ts`

**Files Modified (1):**
- `src/modules/activity/types.ts` — added `"expenses"` to `ActivitySource` union (missing variant surfaced at compile time)

**Architecture Decisions:**
- Each DataSource exports an interface + `MockXxxDataSource` class + `createXxxDataSource()` factory
- `toDomain()` adapter isolates the mock-data shape behind the datasource interface (mock shapes → production domain types)
- `userId` is hardcoded `"current-user"` — placeholder until auth integration
- All factory functions return the mock implementation by default — swapped to Drizzle in Phases 6+ (DI via optional param on services enables swapping without code changes)
- `ProjectStatus` maps mock's `"on-hold"` (mock-data convention) to domain `"on_hold"` (type convention) in `toDomain()`
- `ActivitySource` map converts mock `iconName` strings to semantic source constants

**Verification:**
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

**Notes / Deviations:**
- `ActivitySource` union was originally missing `"expenses"` — caught by TypeScript, added during M2
- `ExpenseItem` in mock-data has `description` not `title` — mapped to title field in `toDomain`

**Ready for Next:** ➡️ M3 — Module Services

---

## M3 — Module Services

**Status:** ✅ Completed

**Completion Date:** 2026-08-05

**Objective:** Create business-logic services for every module. Each service reads from its DataSource and returns `ServiceResult<XxxWidgetData>`. Services own filtering, sorting, counting, and aggregation. Dashboard will call these services (via the aggregator in M4) — it will never reach DataSources directly.

**Files Created (9):**
- `src/modules/tasks/services/task-service.ts`
- `src/modules/habits/services/habit-service.ts`
- `src/modules/projects/services/project-service.ts`
- `src/modules/goals/services/goal-service.ts`
- `src/modules/journal/services/journal-service.ts`
- `src/modules/notes/services/note-service.ts`
- `src/modules/calendar/services/calendar-service.ts`
- `src/modules/expenses/services/expense-service.ts`
- `src/modules/activity/services/activity-service.ts`

**Files Modified:** None

**Architecture Decisions:**
- Services are plain `async` functions, not classes — `async function getXxxSummary(userId, ds = createXxxDataSource())`
- Dependency injection via optional 2nd parameter: tests pass a mock DataSource; production uses the default factory
- Short-circuit on failure: if a datasource returns `{ success: false }`, the service returns that failure immediately — never wraps or transforms errors
- Each service returns the EXACT `XxxWidgetData` shape defined in M1 — slicing (`.slice(0, 4)`, field picking) happens here, not in widgets or dashboard
- `completedToday` and `completedTodayCount` for habits default to `0`/`false` — real values require the `habit_logs` table (Phase 7)
- `ExpenseService` runs two datasource calls in parallel via `Promise.all` (income + expense) before aggregating
- `ProjectService` sorts active projects by descending progress before slicing top 3
- `JournalService` and `NoteService` truncate body to excerpt (120 chars) at the service layer — widgets receive display-ready strings

**Verification:**
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

**Notes:**
- No deviations from plan
- All services ignore `userId` for now (prefixed `_`) — they return mock data for the single test user. Phase 6+ services will filter by `userId` once Drizzle schemas exist
- Habit "completed today" logic is a Phase 7 dependency (needs `habit_logs` table) — stubbed to `0`/`false` with a comment marker so it is not forgotten
- The excerpt length (120 chars) is a service-layer constant, not a widget concern — could be centralized in a constants file if more services adopt it

**Ready for Next:** ➡️ M4 — Dashboard Service (Aggregator)

---

## M4 — Dashboard Aggregator

**Status:** ✅ Completed

**Completion Date:** 2026-08-05

**Objective:** Create the dashboard aggregator (`getDashboardSnapshot`) that calls every module service in parallel, wraps failures per-widget, and returns a single typed `DashboardSnapshot` with metadata. Refine the type contract to use a `WidgetState` discriminated union, separate data + UI registries, and prepare the shape for future drag-drop.

**Pre-implementation refinements (recorded as ADRs D8–D13):**
- D8: Aggregator function, not fluent Builder (YAGNI — always aggregate all modules)
- D9: Two registries — `SnapshotContributor[]` (data) + `DashboardWidgetDefinition[]` (UI) — joined on `WidgetKey`
- D10: `DashboardSnapshot` gains `version` + `generatedAt`; errors embedded per-widget (no parallel `errors` map)
- D11: `WidgetProps<T>` → `WidgetState<T>` discriminated union (no impossible states)
- D12: `priority` → `defaultOrder` (drag-drop ready, no UI built)
- D13: `WidgetDataMap` + `WidgetKey` for registry type-safety; `DashboardSnapshot` as explicit interface

**Files Created (1):**
- `src/modules/dashboard/services/dashboard-service.ts`

**Files Modified (1):**
- `src/modules/dashboard/types.ts` — refined per D8–D13

**Architecture Decisions:**
- **D8:** Adopted "aggregator" naming; kept a single `async function getDashboardSnapshot` instead of a fluent Builder — always aggregating all modules, so a builder would add indirection without capability
- **D9:** Aggregator iterates `SnapshotContributor[]` via `Promise.all` — adding a module = one type-checked array entry, zero aggregator code. UI metadata (`DashboardWidgetDefinition`) lives separately in M5's `WIDGET_DEFINITIONS`, joined on `WidgetKey`
- **D10:** Removed the parallel `DashboardSnapshot.errors` map — each widget's `WidgetState` carries its own `status: "error" | "success"`; `version: 1` + `generatedAt: string` (server time) added for cache freshness/future invalidation
- **D11:** `WidgetProps<T> = { data: T | null; error?: string }` replaced by `WidgetState<T>` discriminated union: `{ loading } | { success, data } | { error, message }`. Mutual exclusion makes the impossible state unrepresentable. Each widget receives ONE `state` prop (refinement R4)
- **D12:** `priority` renamed `defaultOrder` — same semantics, named for its future role: a `user_widget_prefs.order` column overrides it when drag-drop arrives
- **D13:** `WidgetDataMap` + `WidgetKey` enforce registry completeness. **However**, `DashboardSnapshot` is an explicit interface, NOT a mapped `[K in WidgetKey]` type — the mapped form collides with TS's correlated-records limitation at the assignment site. Explicit form is more readable (`snapshot.tasks` shows `WidgetState<TaskWidgetData>`)
- **D14 (added during M4):** A single localized `as` cast in the aggregator build loop, with rationale — TS cannot correlate the union key `K` with `WidgetState<WidgetDataMap[K]>` after `Promise.all` flattens tuples. Runtime pairing is correct by construction; the cast is contained to one line

**Verification:**
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

**Notes / Deviations:**
- Mapped-type `DashboardSnapshot` → explicit interface, recorded as D13 refinement. Adding a widget now touches `WidgetDataMap` + `DashboardSnapshot` (explicit iface) — 4 type-checked edits vs 3 — accepted for readability and minimal casts
- One justified `as` cast in aggregator build loop (D14) — exception to CLAUDE.md's "no `as`" rule, documented inline + in ADR; a type guard cannot help (correlated-records, not a narrowing problem)
- Each contributor's `load` is wrapped in try/catch — synchronous or async errors become `WidgetState.error`, never thrown. The aggregator itself never throws — returns `ServiceResult` always
- `userId` defaults to `"current-user"` — auth integration in Robert Phases

**Ready for Next:** ➡️ M5 — Dashboard Types + Constants (UI registry `WIDGET_DEFINITIONS` + grid config)

---

## M5 — Dashboard Constants

**Status:** ✅ Completed

**Completion Date:** 2026-08-05

**Objective:** Create the UI-side widget registry (`WIDGET_DEFINITIONS`), grid layout constants, and icon mapping. UI metadata only — joined to the aggregator's data via `WidgetKey` (D9 separation of concerns).

**Files Created (1):**
- `src/modules/dashboard/constants.ts`

**Files Modified:** None

**Architecture Decisions:**
- `WIDGET_DEFINITIONS: DashboardWidgetDefinition[]` — 9 entries, one per widget key in `WidgetDataMap`. `id` is a `WidgetKey`, so TypeScript ties each definition to a `DashboardSnapshot` field
- `defaultOrder` uses multiples of 10 (10, 20, …) — leaves gaps for future insertions without renumbering
- `WIDGET_ICONS` derived from `WIDGET_DEFINITIONS` (`Record<WidgetKey, LucideIcon>`) — single icon source; no duplicate icon imports elsewhere
- `QUICK_ACTION_ICON` (`Plus`) kept as a standalone constant — QuickActionsWidget has no data slice, so it is not in `WIDGET_DEFINITIONS`
- `DASHBOARD_GRID` + `FULL_ROW_SPAN` — plain string constants for Tailwind column spans; no abstraction layer
- Per the user's directive: no new ADRs, no new registries, no future-proofing baggage. Used only the abstractions established in M1–M4

**Verification:**
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

**Notes:**
- No deviations from plan
- `WIDGET_DEFINITIONS` covers the 9 data-backed widgets. QuickActionsWidget (no data slice) is rendered directly in M7, not via the registry — it has no `WidgetKey`
- `activity` widget's `viewAllHref` points to `/dashboard/analytics` (no dedicated activity page yet) — matches the existing module page shells
- `Plus` icon imported from lucide-react for QuickActions — `lucide-react` removed brand icons but Plus is still available

**Ready for Next:** ➡️ M6 — Widgets (11 widgets, built one at a time)

---

## M6 — Dashboard Widgets

**Status:** ✅ Completed

**Completion Date:** 2026-08-06

**Objective:** Implement all eleven dashboard widgets as pure presentational components following the widget contract.

**Files Created (11):**
- `src/modules/dashboard/components/welcome-header.tsx`
- `src/modules/dashboard/components/stats-row.tsx`
- `src/modules/dashboard/components/todays-tasks-widget.tsx`
- `src/modules/dashboard/components/habit-streaks-widget.tsx`
- `src/modules/dashboard/components/active-projects-widget.tsx`
- `src/modules/dashboard/components/upcoming-events-widget.tsx`
- `src/modules/dashboard/components/quick-notes-widget.tsx`
- `src/modules/dashboard/components/this-month-widget.tsx`
- `src/modules/dashboard/components/quarterly-goals-widget.tsx`
- `src/modules/dashboard/components/recent-activity-widget.tsx`
- `src/modules/dashboard/widgets/quick-actions/quick-actions-widget.tsx`

**Files Modified:** none

**Architecture Decisions Reflected:** The widgets adhere to the existing widget contract (receive `WidgetState<T>` or no props), contain no business logic, and use shared UI components (`Card`, `Button`, `ProgressBar`, `StatsCard`) and utilities (`cn`, `formatShortDate`, `splitDate`) as defined in earlier milestones.

**Verification:**
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`

**Deviations / Notes:** None.

**Ready for Next:** ➡️ M7 — Dashboard Page Refactor

---

## M7 — Dashboard Page Refactor

**Status:** ✅ Completed

**Completion Date:** 2026-08-06

**Objective:** Replace the 333-line monolithic dashboard page with a pure ~58-line
composition layer that calls the aggregator, handles top-level failure, and renders
the existing M6 widgets — each fed its own `WidgetState` slice. Delete all old
dashboard business logic, helpers, mock imports, and inline list rendering.

**Files Modified (3):**
- `src/app/(dashboard)/dashboard/page.tsx` — full rewrite to a thin composition
  layer (333 → 58 lines). Calls `getDashboardSnapshot()` once, handles the
  `ServiceResult` failure with a single inline fallback, and renders
  `WelcomeHeader`, `StatsRow`, the nine data-backed widgets, and
  `QuickActionsWidget` — each receiving exactly its snapshot slice. No mock
  data, no helpers, no business logic, no `ACTIVITY_ICONS`/`ViewAll`/`priorityDot`,
  no inline list rendering, no duplicated imports/exports.
- `src/modules/dashboard/services/dashboard-service.ts` — derived the two
  computed slices (`welcome`, `stats`) inside `getDashboardSnapshot()` from the
  already-loaded module slices (no new service calls). The build-loop + final
  `as unknown as DashboardSnapshot` cast was replaced by a single read-path cast
  to a local mapped `LoadedSlices` type, so the assembled object literal satisfies
  `DashboardSnapshot` directly — one fewer cast overall (ADR D14 retained, refined).
- `src/modules/dashboard/types.ts` — extended `DashboardSnapshot` with
  `welcome: WidgetState<WelcomeWidgetData>` and `stats: WidgetState<DashboardStats>`
  (both computed, so deliberately NOT in `WidgetDataMap`). Added
  `WelcomeWidgetData`; corrected the stale `DashboardStats` doc comment.

**Architecture Decisions / Why:**
- **Separation of Concerns — the dependency arrow points inward.** The page
  knows only "compose widgets from a snapshot"; all derivation lives in the
  aggregator. `welcome`/`stats` are computed there so the page never needs mock
  data or business logic to feed the M6 `WelcomeHeader`/`StatsRow` widgets.
- **Computed slices are not module-backed.** `welcome` and `stats` have no
  DataSource/service, so they are NOT added to `WidgetDataMap` (no
  `SnapshotContributor`, no `WIDGET_DEFINITIONS` entry, no icon). `DashboardSnapshot`
  is an explicit interface (D13) precisely so it can carry these alongside the
  module-backed slices without forcing them through the module registry. This
  mirrors how `DashboardStats` was already documented as "not in WidgetDataMap" —
  M7 just delivers it as a real `WidgetState`.
- **The `journal` slice is loaded but not rendered.** The aggregator loads
  `journal` (it's in `DashboardSnapshot`/`WidgetDataMap`), but no journal widget
  exists in M6. The page correctly does not render it; adding a journal widget
  later is one widget file + one `<JournalWidget state={snapshot.journal} />` line.

**Deviations from Plan:**
- The original M7 plan specified editing **only** `page.tsx`. That was impossible
  to finish correctly: the M6 `WelcomeHeader` and `StatsRow` widgets require a
  `WidgetState`, but M4's `getDashboardSnapshot()` emitted only the 9 module
  slices — no `welcome`/`stats`. The interim page hardcoded both widgets to
  `{ status: "loading" }`, producing two **permanent skeletons** next to nine
  live widgets (the actual defect behind "M7 is not complete"). Feeding
  `StatsRow` real numbers needs business logic (forbidden in the page) or mock
  data (forbidden). Per explicit user approval, the minimum architectural
  correction added the two computed slices in the aggregator + types (3 files
  total, not 1). The page itself remained a pure composition layer as required.

**Verification:**
- ✅ `pnpm typecheck` — clean (`tsc --noEmit`, no errors)
- ✅ `pnpm lint` — clean (ESLint flat config, no warnings/errors)
- ✅ `pnpm build` — compiled successfully; 24 routes; `/dashboard` prerendered
  static (`○`, 826 B / 111 kB First Load JS)

**Notes:**
- Stat counts derive from display-capped slices (e.g. `dueToday` is capped at 4,
  active `projects` at 3), so a stat may under-report when a user has many items
  — documented in `DashboardStats` (types.ts). Accurate, un-capped counts arrive
  in Phase 6+ with real schemas; the page + widget contracts already support that.

**Ready for Next:** ➡️ M8 — Build & Verify

---

## M8 — Build & Verify

**Status:** ✅ Completed

**Completion Date:** 2026-08-06

**Objective:** Verify the Phase 5 refactor end-to-end: the thin dashboard page
composes all eleven widgets from a single aggregator call, every widget renders
from a real `WidgetState` slice (no permanent loading skeletons), and the build
is green.

**Verification Results:**
- ✅ `pnpm typecheck` — clean (`tsc --noEmit`, no errors)
- ✅ `pnpm lint` — clean (ESLint flat config, no warnings/errors)
- ✅ `pnpm build` — compiled successfully in 7.3s; 24 routes generated;
  `/dashboard` prerendered as static (`○`)

**What was verified:**
- The 333-line monolith is gone: the page is a ~58-line pure composition layer
  with zero mock imports, zero business logic, zero inline list rendering, and
  zero helper functions.
- All eleven M6 widgets render from real `snapshot` slices: `WelcomeHeader`
  (`snapshot.welcome`), `StatsRow` (`snapshot.stats`), and the nine data-backed
  widgets. No widget is hardcoded to a loading state.
- Top-level `ServiceResult` failure is handled with one inline error fallback;
  per-widget failures remain per-slice `WidgetState.error` (unchanged from M4).
- `dashboard-service.ts` computes `welcome` + `stats` inside the aggregator — no
  business logic in the page, no new service calls.
- Module boundaries respected: the page imports only from
  `@/modules/dashboard/...` (widgets + aggregator); no cross-module or
  mock-data imports.

**Not executed in this run:**
- `pnpm dev` live visual-parity check. The production build prerendered
  `/dashboard` with zero errors; a live refresh is a 30-second follow-up if
  pixel-parity confirmation is desired.

**Phase 5 result:** All 8 milestones complete. The dashboard architecture is
replaced underneath while the visual layout is preserved — ready to begin Phase 6
(business schemas / Drizzle) with zero dashboard changes expected.

---

## Original Implementation Plan

> The sections below preserve the original design plan written before implementation.
> They describe intent (the "why" and "how") with code examples. The executed
> outcome — files, decisions, deviations — is recorded in the **Milestones** section
> above. M6–M8 had no separate plan-phase description; their completion records live
> in Milestones.

### 1. Current State

**Dashboard page** (`src/app/(dashboard)/dashboard/page.tsx`): 333 lines, single monolithic RSC.

Problems:
- Imports 8 mock data objects directly from `@/lib/mock-data`
- Filters/transforms mock data inline (business logic in the page)
- No widget abstraction — every section is raw JSX
- No loading/empty/error state handling
- Will break completely when real modules arrive

**Module directories** exist as empty shells: `components/` and `hooks/` only. No `types.ts`, `services/`, or `datasources/`.

**Database**: Only auth tables exist. No business tables yet (tasks, habits, etc. come in Phases 6–12).

**Goal**: Preserve the visual dashboard. Replace the architecture underneath.

---

### 2. Architecture (Target)

```
Dashboard Page (RSC, ~60 lines)
  ↓ awaits
DashboardService.getDashboardSnapshot()
  ↓ Promise.all parallel
  ├── TaskService.getSummary()
  │     └── TaskDataSource → mock (today) → Drizzle (Phases 6+)
  ├── HabitService.getSummary()
  │     └── HabitDataSource → mock
  ├── ProjectService.getSummary()
  │     └── ProjectDataSource → mock
  ├── GoalService.getSummary()
  │     └── GoalDataSource → mock
  ├── JournalService.getSummary()
  │     └── JournalDataSource → mock
  ├── CalendarService.getSummary()
  │     └── CalendarDataSource → mock
  ├── NoteService.getSummary()
  │     └── NoteDataSource → mock
  ├── ExpenseService.getSummary()
  │     └── ExpenseDataSource → mock
  └── ActivityService.getSummary()
        └── ActivityDataSource → mock
  ↓ returns
ServiceResult<DashboardSnapshot>  ← unified aggregate
  ↓
Dashboard page destructures snapshot.slices[widgetKey]
  ↓
Each widget receives ONLY its own data slice
  ↓
Widget is purely presentational — zero business logic
```

Key properties:
- Dashboard NEVER imports mock data
- Dashboard NEVER performs business logic
- DataSources own mock data (single access point, swappable)
- Services own business logic (summaries, stats, filtering)
- DashboardSnapshot is the single aggregate return type
- Each widget receives exactly its own typed data slice — never the full snapshot
- `actions.ts` deferred to Phases 6+ (mutations only; no reads belong there)
- Type is truth — real data arrives in Phases 6+ with zero dashboard changes

---

### 3. Naming Conventions (Phase 5 specific)

| Old (plan v1) | New (plan v2) | Reason |
|---------------|----------------|--------|
| Repository | **DataSource** | Clearer intent: "where data comes from." Not a repository pattern — it's a thin adapter over mock data that swaps to Drizzle later. |
| DashboardData | **DashboardSnapshot** | Emphasizes it's a point-in-time aggregate, not a live connection. Named for clarity in service contracts. |
| WidgetRegistry | **DashboardWidgetDefinition[]** | Not an opaque "registry" object — it's an array of metadata definitions the dashboard iterates. |
| `getDashboardData()` | **`getDashboardSnapshot()`** | Matches the return type name. |

---

### 4. Implementation Milestones

#### M1: Service Result Pattern + Module Types

**Why first**: Every layer depends on these contracts. Types must be the source of truth.

**Files to create (10):**
```
src/lib/result.ts                            → ServiceResult<T>

src/modules/tasks/types.ts                   → Task, TaskWidgetData (data slice a widget receives)
src/modules/habits/types.ts                  → Habit, HabitWidgetData
src/modules/projects/types.ts                → Project, ProjectWidgetData
src/modules/goals/types.ts                   → Goal, GoalWidgetData
src/modules/journal/types.ts                 → JournalEntry, JournalWidgetData
src/modules/notes/types.ts                   → Note, NoteWidgetData
src/modules/calendar/types.ts                → CalendarEvent, CalendarWidgetData
src/modules/expenses/types.ts                → Expense, ExpenseWidgetData
src/modules/activity/types.ts                → ActivityEntry, ActivityWidgetData
```

**Each `XxxWidgetData`** is the EXACT shape a widget receives. No more, no less. A widget destructures ONLY what it renders.

**`actions.ts` is deliberately NOT created in Phase 5** — Server Actions are for mutations (`createTask`, `deleteHabit`, etc.). Phase 5 is read-only. Modules become writable in Phases 6–12 when `actions.ts` will be introduced alongside their `validation.ts`.

**Files to modify:** None

**Verification**: `pnpm typecheck`

#### M2: DataSources (data adapters)

**Why second**: DataSources own mock data. They are the ONLY place mock-data.ts is imported. Later: `MockTaskDataSource` → `DrizzleTaskDataSource` with zero changes to services or widgets.

**Files to create (9):**
```
src/modules/tasks/datasource/task-datasource.ts           — TaskDataSource interface + MockTaskDataSource
src/modules/habits/datasource/habit-datasource.ts
src/modules/projects/datasource/project-datasource.ts
src/modules/goals/datasource/goal-datasource.ts
src/modules/journal/datasource/journal-datasource.ts
src/modules/notes/datasource/note-datasource.ts
src/modules/calendar/datasource/calendar-datasource.ts
src/modules/expenses/datasource/expense-datasource.ts
src/modules/activity/datasource/activity-datasource.ts
```

**Pattern (DataSource = interface + mock impl + factory):**
```typescript
// modules/tasks/datasource/task-datasource.ts
import { type ServiceResult } from "@/lib/result"

export interface TaskDataSource {
  getAll(): Promise<ServiceResult<Task[]>>
  getPending(): Promise<ServiceResult<Task[]>>
  getByDateRange(from: string, to: string): Promise<ServiceResult<Task[]>>
}

class MockTaskDataSource implements TaskDataSource {
  async getAll(): Promise<ServiceResult<Task[]>> {
    return { success: true, data: MOCK_TASKS }
  }
  async getPending(): Promise<ServiceResult<Task[]>> {
    return { success: true, data: MOCK_TASKS.filter(t => !t.completed) }
  }
  async getByDateRange(_from: string, _to: string): Promise<ServiceResult<Task[]>> {
    return { success: true, data: MOCK_TASKS }
  }
}

/** Factory — returns mock impl today, Drizzle impl in Phases 6+. Callers are unchanged. */
export function createTaskDataSource(): TaskDataSource {
  return new MockTaskDataSource()
}
```

Every datasource exports: interface + mock class + `createXDataSource()` factory.

#### M3 — Module Services

**Why third**: Services hold business logic. Dashboard calls services. Services call DataSources. Services never know about UI. Dashboard never knows about DataSources. This is Clean Architecture — dependency arrow always inward.

**Files to create (9):**
```
src/modules/tasks/services/task-service.ts              — getTaskSummary()
src/modules/habits/services/habit-service.ts
src/modules/projects/services/project-service.ts
src/modules/goals/services/goal-service.ts
src/modules/journal/services/journal-service.ts
src/modules/notes/services/note-service.ts
src/modules/calendar/services/calendar-service.ts
src/modules/expenses/services/expense-service.ts
src/modules/activity/services/activity-service.ts
```

**Every service rule:**
- Returns `ServiceResult<XxxWidgetData>` — never a bare type, never throws
- Accepts an optional DataSource (DI for testability; production defaults to `createXxxDataSource()`)
- Transforms raw data into widget-ready summaries (count, filter, compute stats)
- Zero knowledge of or reference to dashboard, React, or UI

```typescript
// modules/tasks/services/task-service.ts
import { type ServiceResult } from "@/lib/result"
import { type TaskWidgetData } from "./types"
import { type TaskDataSource, createTaskDataSource } from "./datasource/task-datasource"

export async function getTaskSummary(
  userId: string,
  ds: TaskDataSource = createTaskDataSource()
): Promise<ServiceResult<TaskWidgetData>> {
  const result = await ds.getPending()
  if (!result.success) return result

  const pendingTasks = result.data
  const dueToday = pendingTasks
    .filter(t => {
      const today = new Date().toISOString().slice(0, 10)
      return t.dueDate?.slice(0, 10) === today
    })
    .slice(0, 4)

  return {
    success: true,
    data: {
      dueToday,
      pendingCount: pendingTasks.length,
    }
  }
}
```

#### M4 — Dashboard Service (Aggregator)

**Why fourth:** Dashboard page calls ONE function. Not 9.

**Files to create (1):**
```
src/modules/dashboard/services/dashboard-service.ts
```

**`getDashboardSnapshot(userId)`**:

```typescript
export async function getDashboardSnapshot(
  userId: string
): Promise<ServiceResult<DashboardSnapshot>> {
  const [
    tasks, habits, projects, goals,
    journal, notes, calendar, expenses, activity,
  ] = await Promise.all([
    getTaskSummary(userId),
    getHabitSummary(userId),
    getProjectSummary(userId),
    getGoalSummary(userId),
    getJournalSummary(userId),
    getNoteSummary(userId),
    getCalendarSummary(userId),
    getExpenseSummary(userId),
    getActivitySummary(userId),
  ])

  return {
    success: true,
    data: {
      tasks:     tasks.success    ? tasks.data    : null,
      habits:    habits.success   ? habits.data   : null,
      projects:  projects.success ? projects.data : null,
      goals:     goals.success    ? goals.data    : null,
      journal:   journal.success  ? journal.data  : null,
      notes:     notes.success    ? notes.data    : null,
      calendar:  calendar.success ? calendar.data : null,
      expenses:  expenses.success ? expenses.data : null,
      activity:  activity.success ? activity.data : null,
      _errors: {
        tasks:    !tasks.success    ? tasks.message    : undefined,
        habits:   !habits.success   ? habits.message   : undefined,
        // ...
      },
    },
  }
}
```

Each service run in parallel (`Promise.all`). One failed service never breaks the other eight. Widget renders data OR its error state — dashboard never needs a try/catch.

#### M5 — Dashboard Types, Snapshot + Widget Definitions

**Files to create (2):**
```
src/modules/dashboard/types.ts       — DashboardSnapshot, WidgetProps<T>, DashboardWidgetDefinition
src/modules/dashboard/constants.ts   — WIDGET_DEFINITIONS array, grid layout config
```

**`DashboardSnapshot`** — the single aggregate:
```typescript
export interface DashboardSnapshot {
  tasks:       TaskWidgetData | null
  habits:      HabitWidgetData | null
  projects:    ProjectWidgetData | null
  goals:       GoalWidgetData | null
  journal:     JournalWidgetData | null
  notes:       NoteWidgetData | null
  calendar:    CalendarWidgetData | null
  expenses:    ExpenseWidgetData | null
  activity:    ActivityWidgetData | null
}
```

`WidgetProps<T>` — every widget receives EXACTLY its own data slice, never the full snapshot:
```typescript
export interface WidgetProps<T> {
  data: T | null      // null means loading / not yet available
  error?: string      // non-empty = service error; widget renders error UI
}
```

**`DashboardWidgetDefinition`** — structured metadata (the expanded "registry"):
```typescript
import { type LucideIcon } from "lucide-react"

export interface DashboardWidgetDefinition {
  id: string              // unique key (e.g. "todays-tasks")
  module: string          // owning module (e.g. "tasks")
  icon: LucideIcon         // icon for header / optional sidebar badge
  size: "sm" | "md" | "lg"  // grid cell size
  priority: number        // ordering weight (low = first)
  enabled: boolean        // toggle via user preferences future
  viewAllHref?: string    // optional "View All" link
}
```

**`WIDGET_DEFINITIONS`** constant = the single array of registered widgets. Dashboard iterates it.

**Grid layout constants**:
```typescript
export const DASHBOARD_GRID = {
  leftColumn:  { span: "lg:col-span-2" },
  rightColumn: { span: "lg:col-span-1" },
  fullRow:     { span: "lg:col-span-3" },
} as const
```

> **M6–M8** completion records live in the **Milestones** section above, not here.
> This section preserves only the original M1–M5 design plan.

---

### 5. Files Summary

#### Files to Create (~42 files)

| Layer | Count | Purpose |
|-------|-------|---------|
| `src/lib/result.ts` | 1 | `ServiceResult<T>` — shared contract |
| modules `types.ts` | 10 | One per module; own data type + widget data slice |
| modules `datasource/` | 9 | Mock implementation + interface, swapped to Drizzle later |
| modules `services/` | 9 | Business logic, one `.ts` per module |
| dashboard service | 1 | `getDashboardSnapshot()` aggregator |
| dashboard types | 1 | `DashboardSnapshot`, `WidgetProps<T>`, `DashboardWidgetDefinition` |
| dashboard constants | 1 | `WIDGET_DEFINITIONS`, grid config |
| widgets | 11 dirs each × varying files | Each widget = {index,view,loading,empty,error} |

#### Files to Modify (1)

| File | Change |
|------|--------|
| `src/app/(dashboard)/dashboard/page.tsx` | Replace 333 lines of mock-import + inline business logic with ~60 lines of widget composition |

#### Files to NOT touch

| File | Reason |
|------|--------|
| `src/lib/mock-data.ts` | Read ONLY by DataSources; deleted in Phase 6+ |
| `src/lib/db/schema.ts` | No business tables yet |
| `src/lib/db/client.ts` | Already production-ready |
| `src/components/shared/*` | Already reusable |
| `src/app/(dashboard)/layout.tsx` | Shell unchanged |
| `src/config/navigation.ts` | No nav changes |

---

### 6. ServiceResult Pattern

```typescript
// src/lib/result.ts
export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; message: string }
```

No bare boolean, no null, no throw. Every DataSource, Service, and `getDashboardSnapshot` returns this.

---

### 7. Widget Contract

```typescript
// src/modules/dashboard/types.ts
export interface WidgetProps<T> {
  data: T | null          // null → loading / not yet available
  error?: string          // non-empty → service error
}
```

Widget renders:
1. `if (error)` → error UI
2. `if (!data)` → loading skeleton UI
3. `if (isEmpty(data))` → empty state UI
4. Otherwise → success view UI

Every widget exports statics: `Widget.Loading`, `.Empty`, `.Error` so the dashboard page never depends on low-level rendering details.

---

### 8. Widget Definitions

```typescript
// src/modules/dashboard/constants.ts
import {
  CheckSquare, Repeat, Folders, BookOpen,
  FileText, Target, Calendar, DollarSign,
  Clock, PlusCircle, type LucideIcon,
} from "lucide-react"

export const WIDGET_DEFINITIONS: DashboardWidgetDefinition[] = [
  {
    id: "todays-tasks", module: "tasks", icon: CheckSquare,
    size: "md", priority: 1, enabled: true,
    viewAllHref: "/dashboard/tasks",
  },
  {
    id: "habit-streaks", module: "habits", icon: Repeat,
    size: "sm", priority: 2, enabled: true,
    viewAllHref: "/dashboard/habits",
  },
  // ...
  {
    id: "quick-actions", module: "dashboard", icon: Plus,
    size: "sm", priority: 99, enabled: true,
  },
]
```

---

### 9. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| DataSource for mock stays too long | Each DataSource is one file; replacing it with Drizzle per module is trivial in Phase 6+ |
| Widget count explosion | Knowledge-limited: 11 widgets. Registry enables coming hiding, disable, reorder without rewriting code |
| Service contracts fracture | One `ServiceResult<T>` type; one `DashboardSnapshot`; one `WidgetProps<T>` |
| Premature abstraction | DataSource IS the interface; Service is a plain function, not a class; no Dependency Injection containers |

---

### 10. Execution Order

M1 → M2 → M3 → M4 → M5 → M6 → M7 → M8

Types → DataSources → Services → Dashboard Service → Dashboard Types → Widgets → Page Refactor → Verify
