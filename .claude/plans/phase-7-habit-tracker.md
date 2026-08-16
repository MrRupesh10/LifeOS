# Phase 7 — Habit Tracker Implementation Plan

> **Status:** Draft for approval. Nothing built. Working tree untouched except pre-existing `docs/Roadmap.md` edit.
> **Primary reference:** Phase 6 Tasks (`src/modules/tasks/`, `0001_graceful_ultimo.sql`). Reuse its pattern; do NOT copy its code.

## 1. Objective
Turn the Habits module from a mock shell into the second DB-backed business module: persistent habits with daily completion and streak tracking, wired through the same user-scoped DataSource → Service → Server Action seams established in Phase 6, keeping the dashboard on real data.

## 2. Existing Architecture to Reuse
Follow these exact Phase 6 files as the template (reference only):
- Schema: `src/lib/db/schema/tasks.ts` → new `src/lib/db/schema/habits.ts`
- DataSource: `src/modules/tasks/datasource/task-datasource.ts` (`ServiceResult`, `toDomain`/`toDate`, `ownedById(userId, id)`, Drizzle behind `createXxxDataSource()` factory)
- Service: `src/modules/tasks/services/task-service.ts` (`todayKey()` via `Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata"})`, filter/sort, summary slice)
- Actions: `src/modules/tasks/actions.ts` (`getSession()` first → Zod `safeParse` → service → `revalidatePath`)
- Validation: `src/modules/tasks/validation.ts` (shared client+server Zod)
- Page: `src/app/(dashboard)/dashboard/tasks/page.tsx` (server component, session guard, `searchParams`, `<Suspense>`)
- Client leaves: `new-task-dialog.tsx`, `task-form.tsx`, `task-item.tsx`
- Dashboard seam: `src/modules/dashboard/services/dashboard-service.ts` contributor + `constants.ts` + `types.ts` (`WidgetDataMap`/`WidgetKey`)
- Timezone + migrations: `todayKey()` docblock; migration `0001` hand-apply precedent (verify `pnpm db:migrate` if DB recreated)

## 3. Scope
- Schema + migration for `habits` + `habit_logs` tables
- User-scoped CRUD + completion toggle + active-archived state
- Today list, weekly grid, streak calc
- Habits page (server list + client toggle/edit/delete)
- Dashboard uses real Habit Service
- NO categories-as-table, reminders, notifications, recurrence engine, analytics, calendar sync, social

## 4. Data Model
**`habits`** (one row per habit):
- `id uuid PK defaultRandom`, `user_id uuid NOT NULL → users.id ON DELETE CASCADE`
- `name varchar(255) NOT NULL`, `description text`
- `archived boolean NOT NULL DEFAULT false`
- `created_at` / `updated_at` timestamptz (mode:"date"), defaultNow
- index `habits_user_id_idx`
- Reuse `varchar` enum precedent — phaseable via module type + Zod, no pgEnum.

**`habit_logs`** (one row per habit-per-day completion — no generic recurrence engine, just a completion row):
- `id uuid PK defaultRandom`
- `habit_id uuid NOT NULL → habits.id ON DELETE CASCADE`
- `completed_on date NOT NULL` (calendar day, `YYYY-MM-DD`; plain `date` column, not timestamp)
- `created_at` timestamptz defaultNow
- **unique `(habit_id, completed_on)`** — one completion per habit per day (upsert on toggle)
- index `habit_logs_habit_id_idx`; index `habit_logs_user_id_idx` to avoid join-through-habit for scoping
- `user_id` optionally denormalized for cheap scoping; prefer unique+habit join if kept clean.

**Date semantics:** `completed_on` is the app-zone calendar day (Asia/Kolkata via `Intl en-CA`). DB stores the local day string, not UTC time.

## 5. Module Structure
```
src/modules/habits/
  ├── types.ts                 # Habit, HabitLog, HabitWidgetData, DTOs, filters
  ├── validation.ts            # create/update Zod (shared client+server)
  ├── actions.ts               # "use server" mutation boundary
  ├── datasource/habit-datasource.ts
  ├── services/habit-service.ts    # streaks, today, weekly, summary
  └── components/ (kebab-case)     # habit-list, habit-item, habit-form, new-habit-dialog, weekly-grid
src/lib/db/schema/habits.ts + barrel export in schema.ts
src/app/(dashboard)/dashboard/habits/page.tsx   # server composition
```
Dashboard files reference Habits types/services exactly as Tasks does.

## 6. Core Behavior
- **Create/Update/Delete:** CRUD via Server Actions, user-scoped `(user_id AND id)`. Delete cascades habit_logs.
- **Archive:** `archived` flag instead of hard delete for permanence toggle; archived excluded from today/weekly/streak read paths.
- **Toggle completion:** upsert (insert-or-delete) a `habit_logs` row for `(habitId, todayKey)`. No `completed` column on `habits`.
- **Today list:** active habits + `completedToday` from today's log rows.
- **Weekly/monthly grid:** query `habit_logs` rows within window keyed by `completed_on`; render completion cells per day.
- **User scoping:** every query/mutation starts from authenticated `session.user.id`; SQL scoped by user.
- **Dashboard summary:** recompute `HabitWidgetData` from real service (`items` top-4 streaks, `activeCount`, `completedTodayCount`).

## 7. Date / Streak Semantics
- **A "habit day"** = the Asia/Kolkata calendar day (`todayKey()` — reuse the exact phase-6 utility/approach).
- **Completed on day D** iff a `habit_logs` row exists with `completed_on = D`.
- **Toggle** inserts the row if absent (completed) or deletes it if present (uncompleted); `updatedAt` unchanged on `habits`.
- **Current streak** = count of consecutive days ending at todayKey that have a log; broken by a missed day (no row) or by today being uncompleted (calculates through yesterday). N-day window (>365) guards perf.
- **Best streak** = max run over history; derived from sorted `completed_on` set.
- No recurrence engine — timeliness is purely "a row exists for the day".

## 8. Dashboard Integration
Do NOT create a second data path. `getHabitSummary` already sits in `SNAPSHOT_CONTRIBUTORS` (dashboard-service.ts) and the `habits` `WidgetKey` already exists. Replace the Mock `HabitDataSource` behind `createHabitDataSource()` with a Drizzle impl and compute streaks/completion from `habit_logs`. `HabitWidgetData` shape and `HabitStreaksWidget` stay unchanged. Stats derivation in the aggregator is untouched.

## 9. Verification Plan
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm build`
- [ ] Generate new migration (`db:generate`), apply to dev Neon, confirm `__drizzle_migrations` + tables; update DATABASE.md
- [ ] SQL ownership: non-owned habit id → no-op/error; cross-user data invisible
- [ ] CRUD E2E + toggle insert/delete + duplicate-habit-down → delete cascades logs
- [ ] Today/weekly/monthly grids correct
- [ ] Streak edges: consecutive days, gap breaks, today uncompleted, best streak pinned, empty history
- [ ] Dashboard reflects real habits (was mock)
- [ ] Manual E2E in running dev server (all states: empty/loading/error/success)

## 10. Documentation / ADR Candidates
- **ADR: habit_logs-as-rows vs boolean column** (upsert log table is the streak source of truth) — genuine design decision.
- ADR: `completed_on` as app-zone calendar `date` string for streak correctness — likely fold into the above.
- No ADR for routine CRUD/validation/server-action reuse of Phase 6 — reference existing ADRs instead.

## 11. Implementation Order
1. Schema `habits` + `habit_logs` + barrel → 2. `db:generate` migration + apply → 3. types.ts → 4. Drizzle `HabitDataSource` (swap mock) → 5. service (streaks/today/weekly/summary) → 6. validation.ts + actions.ts → 7. Habits page (server) + client list/item/form/dialog + weekly grid → 8. Verify dashboard real-data + all gates → 9. Doc/ADR/CHANGELOG.

## 12. Definition of Done
- Create/edit/delete & archive habits; toggle daily completion
- Weekly/monthly progress visible; streaks + best streak correct
- Data persists in PostgreSQL (migration applied, verified)
- Dashboard HabitStreaksWidget reflects real persistent data
- User-scoped ownership enforced at SQL boundary
- typecheck / lint / format / build green
- DATABASE.md, CHANGELOG updated; ADR recorded


## Milestone Tracking

### M1 — Habit Data Layer
- Status: ✅ Complete
- Started: 2026-08-16
- Completed: 2026-08-16
- Work: `habits` (user-scoped, `archived`) + `habit_logs` (unique `(habit_id, completed_on)`) schema written and registered in barrel; generated `0002_narrow_master_mold.sql`.
- Verification: `pnpm typecheck` pass. Migration `0002` direct-applied to dev Neon in a single transaction (per M12 hand-apply precedent — `__drizzle_migrations` absent, so no `db:migrate`). Post-apply: both tables + columns confirmed; `habits_user_id_idx`, `habit_logs_habit_id_idx`, and unique `habit_logs_habit_id_completed_on_unique` present; cascade FKs `habits.user_id→users` and `habit_logs.habit_id→habits` verified (`ON DELETE CASCADE`).
- Notes: `habit_logs` has NO `user_id` (minimal form) — ownership scoping must join through `habits.user_id`. No module/service/UI code touched this milestone.

### M2 — Habit DataSource + Service
- Status: ✅ Complete
- Started: 2026-08-16
- Completed: 2026-08-16
- Work: Rewrote `types.ts` (1:1 with `0002`; dropped unused `frequency`/`category`/`color`; `HabitWidgetData` contract preserved). Drizzle `HabitDataSource` behind the factory — userscoped, logs read/joined through `habits.user_id` (logs carry no `user_id`), `setCompleted` upserts via `ON CONFLICT DO NOTHING` + deletes off, ownership-gated on `(user_id AND id)`. `HabitService` — CRUD, `setHabitCompletion`, `getHabitViews` (streaks+completedToday), `getHabitSummary` (byte-identical widget shape).
- Verification: `pnpm typecheck` pass, `pnpm lint` pass. DB smoke test (real users, all PASS): unique `(habit_id,completed_on)` holds under idempotent toggle ON; toggle OFF deletes; B cannot resolve A's habit (ownership); cascade-delete purges logs; cross-user log isolation via join; 5 streak edge cases PASS (today-done / today-not / gap / best-exceeds-current / broken run).
- Notes: `habit_logs.completed_on` is string-mode in Drizzle, returned as `YYYY-MM-DD` (adapter maps directly). Streak rule: current streak counts back from today, or through yesterday when today is still pending. Smoke data cleaned up.

### M3 — Validation + Server Actions
- Status: ✅ Complete
- Started: 2026-08-16
- Completed: 2026-08-16
- Work: Wrote `habits/validation.ts` (create/update Zod schemas shared client+server) and `habits/actions.ts` (5 auth-gated actions: create/update/delete/toggle with `getSession()` → Zod → service → `revalidatePath`). Adopted single-toggle pattern matching Phase 6 Task actions.
- Verification: `pnpm typecheck` pass.
- Notes: Added `getLogForDay()` to datasource + `toggleHabitCompletion()` to service for efficient read-flip toggle (this method is the exclusive toggle entry-point consumed by the action).

### M4 — Habit UI
- Status: Complete
- Started: 2026-08-16
- Completed: 2026-08-16
- Work: Built full CRUD UI matching Phase 6 Task pattern: `habit-form.tsx` (RHF + Zod), `new-habit-dialog.tsx` (create), `habit-item.tsx` (client leaf: optimistic toggle, edit/delete/archive dialogs), `habit-list.tsx` (server-rendered error/empty/success), weekly grid (`weekly-grid.tsx`, 7-day heatmap app-timezone), and server-composed `habits/page.tsx` (auth gate + Suspense). `HabitView` enriched with `completedDays: string[]` from service. Archive/unarchive actions added.
- Verification: `pnpm typecheck` pass, `pnpm lint` pass, `pnpm build` pass.
- Notes: Client/server boundary respected — `NewHabitDialog` lives outside the server `HabitList`. All client leaves are kebab-case.

### M4 visual refinement (post-completion)
- Status: ✅ Complete (visual pass on weekly grid)
- Started: 2026-08-16
- Work: Replaced original large-block weekly grid with a compact 7-day row: small filled/empty circles per day, day headers with date numbers, today emphasized with a subtle ring, hover tooltip showing "Mon, Aug 17 — Completed/Not completed". Reduced vertical height significantly; no extra dependencies.
- Verification: `pnpm typecheck` pass, `pnpm lint` pass, `pnpm build` pass.

### M5 — Dashboard Integration
- Status: ✅ Complete (confirmed during M4)
- Started: 2026-08-16
- Completed: 2026-08-16
- Work: Verified real `getHabitSummary` is registered in `SNAPSHOT_CONTRIBUTORS` (dashboard-service.ts line 49). The mock `HabitDataSource` was pinned-swapped in M2; the dashboard has been rendering real habit data via `DrizzleHabitDataSource` since then. No new code required — confirmed by grep showing zero mock references in the habits module.
- Verification: `pnpm typecheck` pass, `pnpm lint` pass, `pnpm build` pass. Zero mock references in `src/modules/`.
- Notes: The dashboard HabitStreaksWidget already received real data post-M2. M5 was a verification-only checkpoint, not a code change.

### M6 — Verification + Documentation
- Status: ✅ Complete
- Started: 2026-08-16
- Completed: 2026-08-16
- Work: Full verification gate run (typecheck/lint/build all pass), migration `0002` confirmed applied, 24 build routes, zero mock references. Documentation updated: PROJECT_STATUS.md (Phase 7 active, v0.7.0-alpha, DB tables, verification entries), CHANGELOG.md (full Phase 7 M1–M5 release notes), README.md (Phase 7 status). Git tag `v0.7.0-alpha` created.
- Verification: `pnpm typecheck` ✅ `pnpm lint` ✅ `pnpm build` ✅ (24 routes). Migration `0002` present and applied. Zero mock references.
- Notes: Phase 7 M1–M5 complete. M6 closes the phase; remaining is M6 only for docs/release.

### Phase 7 Final
- Status: ⬜ Pending
- Started:
- Completed:
- Result:
- Release:
