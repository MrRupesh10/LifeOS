# Phase 6 — Task Management (Master Specification)

> **Status:** Planning — awaiting approval. No implementation yet.
> **Target version:** v0.6.0-alpha · **Created:** 2026-08-09
> **Sibling file:** `phase6-task-implementation.md` (milestone checklist)

---

## 1. Purpose

Turn Tasks into the **first complete, real, persistent user-facing CRUD module**. Tasks move off mock data onto the Phase 4 PostgreSQL + Drizzle foundation, while preserving the Phase 5 dashboard aggregation architecture. It is the first module to prove the full domain flow (UI → action → service → data source → Drizzle → PostgreSQL), establishing the reusable pattern for later modules (Habits, Projects, …).

## 2. Current Repository State

- **DB layer (Phase 4):** `src/lib/db/client.ts` (single Drizzle instance), `src/lib/db/schema.ts` barrel — **exports auth only**; auth tables in `schema/auth.ts`; migration `0000` is auth-only. **No `tasks` table.** `db:generate` works offline.
- **Tasks module (Phase 5):** `types.ts` already defines the **production `Task`** (id, userId, title, description|null, dueDate|null, priority, status, projectId|null, completedAt|null, createdAt, updatedAt) + `TaskWidgetData`; `datasource/task-datasource.ts` = `TaskDataSource` interface + mock impl + `createTaskDataSource()` factory (**read-only, not user-scoped, mock**); `services/task-service.ts` = `getTaskSummary(userId, ds?)`. `components/`, `hooks/` empty.
- **Dashboard (Phase 5):** `dashboard-service.ts` `getDashboardSnapshot(userId = "current-user")` iterates `SnapshotContributor[]` via `Promise.all`; `tasks` contributor → `getTaskSummary`. `page.tsx` calls it **with no arg** (placeholder user). `todays-tasks-widget.tsx` is pure presentational, links to `/dashboard/tasks`.
- **Tasks route:** `src/app/(dashboard)/dashboard/tasks/page.tsx` is a **mock shell** importing `MOCK_TASKS` — must be rewritten.
- **Auth boundary:** `src/lib/auth/session.ts` `getSession()` → `Session | null`; `session.user.id`/`name`.
- **Primitives & deps (all installed, no new installs):** Zod v4, react-hook-form, `@hookform/resolvers`, Sonner, Base UI `button/dialog/input/label/dropdown-menu` (Button has **no `asChild`**, uses `render`); shared `card`, `empty-state`, `section-header`, `stats-card`. Validation convention: `src/modules/auth/validation.ts`.

## 3. What Phase 5 Already Established (reused, not rebuilt)

- The `Task` domain type (single source of truth).
- The `TaskDataSource` interface + `createTaskDataSource()` factory seam — built expressly for swapping mock → Drizzle with minimal change.
- `getTaskSummary(userId, ds?)` dashboard path.
- The aggregator (`SnapshotContributor[]` + `Promise.all`) and pure-presentational widget shape (`WidgetState<TaskWidgetData>`).
- No server actions exist yet; this phase introduces the project's **first** `actions.ts`.

## 4. Phase 6 Goals

1. Create + migrate a user-scoped `tasks` table.
2. Swap the tasks datasource to a Drizzle impl (same interface/name).
3. Add task service mutations + filters + sorts.
4. Add validation schemas + server actions (first in repo).
5. Rebuild the Tasks page as a real, persistent CRUD UI.
6. Make the dashboard consume the same Task service and reflect mutations.

## 5. Architecture

```
Tasks UI (server page + client primitives only)
   ↓
Server Action (actions.ts)   auth boundary + zod + revalidate
   ↓
Task Service                 business logic ONLY
   ↓
Task DataSource              db access (interface + Drizzle impl + toDomain)
   ↓
Drizzle ORM (src/lib/db/client.ts)
   ↓
PostgreSQL
```
Dashboard:
```
PostgreSQL → Task Service (getTaskSummary) → getDashboardSnapshot() → TodaysTasksWidget
```
Rules: `app/`=composition · `modules/`=domain · no cross-module imports · no duplicated logic · no mock in production · no giant `page.tsx`.

## 6. Data Flow

- **Read:** Tasks page (server) → `getSession()` → `getTasks(userId, {filter, sort})` → datasource (user-scoped) → `toDomain()` → `Task[]`. Dashboard: `getDashboardSnapshot(session.user.id)` → `getTaskSummary`.
- **Mutate:** client → server action → `getSession()` (reject null) → zod parse → service → datasource (`WHERE user_id AND id`) → `db.insert/update/delete` → serializable result → `revalidatePath`.
- **Ownership:** every query/mutation scoped by `userId` from `getSession()` only.

## 7. Database Requirements

New `src/lib/db/schema/tasks.ts`, exported from the barrel; migration `0001_*`:

| column | type | notes |
|---|---|---|
| `id` | `uuid` PK default gen_random | matches auth |
| `user_id` | `uuid` FK → users **ON DELETE CASCADE** | ownership |
| `title` | `varchar(255)` not null | |
| `description` | `text` nullable | |
| `due_date` | `timestamptz` nullable | |
| `priority` | `varchar(32)` default `'medium'` | varchar not pgEnum (repo precedent `users.role`) |
| `status` | `varchar(32)` default `'pending'` | pending/in_progress/completed |
| `project_id` | `uuid` nullable | no FK yet (projects absent) — 1:1 with `Task.projectId` |
| `completed_at` | `timestamptz` nullable | set when completed |
| `created_at`/`updated_at` | `timestamptz` default now | |

Indexes: `user_id`, `status`, `due_date`. **1:1 with the existing `Task` type;** `goal_id` omitted (no `goalId` in the type — added with Goals in Phase 11).

## 8. Task Domain Requirements

Reuse `Task`. Add write/DTO + page types in `tasks/types.ts`: `TaskFilter ("all"|"today"|"upcoming"|"completed")`, `TaskSort ("dueDate"|"priority"|"createdAt")`, `CreateTaskInput`, `UpdateTaskInput`.

## 9. Service & Data-Source Requirements

- **DataSource** (same file `task-datasource.ts`, same interface name): user-scoped + mutable — `getAll(userId)`, `getPending(userId)`, `getByDate(userId,date)`, `create(userId,input)`, `update(userId,id,input)`, `remove(userId,id)`, `toggleComplete(userId,id)`. `createTaskDataSource()` returns `DrizzleTaskDataSource`. `toDomain()`/`toEntity()` map Drizzle `Date` ↔ ISO string.
- **Service** (`task-service.ts`): keep `getTaskSummary` shape; add `getTasks(userId,{filter,sort})`, `getTodayTasks`, `getUpcomingTasks`, `getCompletedTasks`, `createTask`, `updateTask`, `deleteTask`, `toggleTaskCompletion`. Filtering/sorting live here. All return `ServiceResult` (never throw).

## 10. Server Action Requirements

New `src/modules/tasks/validation.ts` (Zod: `createTaskSchema`, `updateTaskSchema` — title required trim 1–255; others optional/typed) and `src/modules/tasks/actions.ts`: `createTaskAction`, `updateTaskAction`, `deleteTaskAction`, `toggleTaskCompletionAction`. Each: `getSession()` → reject null → zod parse → service → `revalidatePath("/dashboard/tasks")` + `("/dashboard")` → serializable result.

## 11. Authentication & Ownership Rules

- Server action is the sole source of `userId`; never trust client `userId`.
- Every datasource call filters by `userId`; mutations target `(user_id AND id)` → 0 rows → error.
- No auth redesign; reuse `getSession()`.

## 12. Tasks UI Requirements

Rewrite `tasks/page.tsx` as a **server component** (read `searchParams.filter/sort` → `getTasks` under `<Suspense>`; never import mock). New module components (one per file): `task-list`, `task-item`, `task-form` (RHF+zod), `new-task-dialog`, `edit-task-dialog`, `task-filter-bar` (single-select All/Today/Upcoming/Completed + sort Due/Priority/Created), delete confirmation. UI uses the existing design system; small private filter control rather than forcing the multi-select `FilterDropdown`.

## 13. Dashboard Real-Data Integration

Minimal + required, no shape change:
- `tasks/page.tsx` → `getSession()` → `getDashboardSnapshot(session.user.id, session.user.name)` (also resolves the Phase 5 `OWNER_NAME` placeholder).
- Aggregator passes the real `userId` through to `getTaskSummary`; tasks datasource is now Drizzle → dashboard Today's Tasks + `tasksDueToday` reflect real rows.
- `revalidatePath("/dashboard")` on mutations → widget updates. **Widget + aggregator shape untouched.** Other 8 widgets remain mock until their phases (transitional, expected).

## 14. Verification Requirements

- Gates: `typecheck`, `lint`, `format:check`, `build` (all currently green).
- `db:generate` offline, human-review SQL; apply migration to dev DB.
- Manual E2E with a real logged-in session: CRUD, each filter, each sort, ownership (can't mutate another user's row), dashboard reflects mutations.
- Dashboard regression (other 8 widgets still render).

## 15. Success Criteria

`tasks` table migrated · user-scoped CRUD persists (restart-safe) · filters/sorts correct · ownership enforced · dashboard Today's Tasks + stat read real rows and reflect mutations · all gates green · docs updated · `v0.6.0-alpha` tagged + released.

## 16. Risks / Architectural Decisions

| ID | Decision/Risk | Rationale |
|---|---|---|
| P6-A | Keep `TaskDataSource` name; swap mock→Drizzle in factory | Seam built for this; zero widget/service shape change |
| P6-B | `varchar` for priority/status, not pgEnum | Repo precedent; avoids migration churn |
| P6-C | DataSource becomes user-scoped + mutable | Ownership is required; natural db-access location |
| P6-D | Server Actions (not API routes) | Per CLAUDE.md — first `actions.ts` |
| P6-E | Dashboard = pass real `session.user.id` into existing aggregator | Required for real task data; shape untouched |
| P6-R1 (risk) | Dashboard mixes real (tasks) + mock (8 others) | Expected; resolves as each module's phase lands |
| P6-R2 (risk) | `project_id` column has no FK (projects absent) | Matches `Task.projectId`; nullable; FK added in Phase 10 |
| P6-R3 (risk) | Full E2E needs a live DB + registered session | Automated gates + documented manual E2E |
| P6-R4 (risk) | No test runner in repo | Services pure/logic-driven for later testability; test runner is a separate decision |

## 17. Documentation Completion Requirements

Update `docs/DATABASE.md` (tasks table), `docs/CHANGELOG.md`, `docs/PROJECT_STATUS.md`, `README.md`, `.claude/CLAUDE.md`, record ADRs in `.claude/DECISIONS.md`. Then tag `v0.6.0-alpha`, verify build, cut GitHub release, push — per the standard phase-completion checklist.