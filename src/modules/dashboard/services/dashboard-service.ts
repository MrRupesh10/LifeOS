/**
 * Dashboard Aggregator — `getDashboardSnapshot()`.
 *
 * The dashboard page calls ONE function. Not nine.
 *
 * Architecture (refinement D9): the aggregator iterates a
 * `SnapshotContributor[]` registry via Promise.all. Adding a module =
 * ONE array entry — zero aggregator code changes.
 *
 * Each contributor is caught individually: one failed service never
 * breaks the others. A failure becomes `{ status: "error" }` on that
 * widget's slice; the rest render normally.
 *
 * Two additional slices — `welcome` and `stats` — are NOT module-backed and
 * therefore not in `WidgetDataMap`. They are derived here: welcome from trivial
 * request metadata, stats from the already-loaded module slices. See the
 * "Computed dashboard slices" section in ../types.ts.
 */

import { type ServiceResult } from "@/lib/result";
import { formatShortDate } from "@/lib/format-date";
import {
  type WidgetKey,
  type WidgetDataMap,
  type WidgetState,
  type DashboardSnapshot,
  type DashboardStats,
  type WelcomeWidgetData,
} from "../types";
import { getTaskSummary } from "@/modules/tasks/services/task-service";
import { getHabitSummary } from "@/modules/habits/services/habit-service";
import { getProjectSummary } from "@/modules/projects/services/project-service";
import { getGoalSummary } from "@/modules/goals/services/goal-service";
import { getJournalSummary } from "@/modules/journal/services/journal-service";
import { getNoteSummary } from "@/modules/notes/services/note-service";
import { getCalendarSummary } from "@/modules/calendar/services/calendar-service";
import { getExpenseSummary } from "@/modules/expenses/services/expense-service";
import { getActivitySummary } from "@/modules/activity/services/activity-service";

/** A contributor loads one widget's slice. Adding a module = one entry. */
export interface SnapshotContributor<K extends WidgetKey> {
  key: K;
  load: (userId: string) => Promise<ServiceResult<WidgetDataMap[K]>>;
}

/** Registry — the single list the aggregator iterates. */
const SNAPSHOT_CONTRIBUTORS: SnapshotContributor<WidgetKey>[] = [
  { key: "tasks", load: getTaskSummary },
  { key: "habits", load: getHabitSummary },
  { key: "projects", load: getProjectSummary },
  { key: "goals", load: getGoalSummary },
  { key: "journal", load: getJournalSummary },
  { key: "notes", load: getNoteSummary },
  { key: "calendar", load: getCalendarSummary },
  { key: "expenses", load: getExpenseSummary },
  { key: "activity", load: getActivitySummary },
];

/** Wrap one contributor's result into a WidgetState. Caught, never thrown. */
async function loadSlice<K extends WidgetKey>(
  c: SnapshotContributor<K>,
  userId: string,
): Promise<[K, WidgetState<WidgetDataMap[K]>]> {
  try {
    const result = await c.load(userId);
    return result.success
      ? [c.key, { status: "success" as const, data: result.data }]
      : [c.key, { status: "error" as const, message: result.message }];
  } catch (err) {
    return [
      c.key,
      { status: "error" as const, message: err instanceof Error ? err.message : "Failed to load" },
    ];
  }
}

// ─── Computed slices (welcome + stats) ────────────────────────────
//
// Derived inside the aggregator (not loaded by a module contributor). `welcome`
// is trivial request metadata; `stats` is a cross-module summary computed from
// the already-loaded slices — no new datasource/service calls.

/** Placeholder owner name until auth supplies the real signed-in user (Phase 6+). */
const OWNER_NAME = "Rupesh";

/**
 * Loaded module slices indexed by key — a *mapped* type so the stats derivation
 * reads each slice with per-key narrowing (`loaded.tasks: WidgetState<TaskWidgetData>`).
 * `WidgetDataMap[K]` correlates correctly inside a mapped type; it only breaks in
 * `Promise.all`'s flattened tuples (the correlated-records limitation, ADR D14).
 */
type LoadedSlices = { [K in WidgetKey]: WidgetState<WidgetDataMap[K]> };

/**
 * Cross-module summary stats for `StatsRow`. Counts derive from the widget data
 * the services already produced (no new queries). A failed module contributes 0
 * to its stat — `StatsRow` has no per-card error state, so 0 is the honest
 * fallback. See `DashboardStats` (../types.ts) for the Phase-5 capping caveat.
 */
function computeDashboardStats(s: LoadedSlices): DashboardStats {
  const tasksDueToday = s.tasks.status === "success" ? s.tasks.data.dueToday.length : 0;
  const habitsRemaining =
    s.habits.status === "success"
      ? Math.max(0, s.habits.data.activeCount - s.habits.data.completedTodayCount)
      : 0;
  const activeProjects = s.projects.status === "success" ? s.projects.data.active.length : 0;
  const categoriesEngaged =
    s.activity.status === "success" ? new Set(s.activity.data.items.map((i) => i.source)).size : 0;
  return { tasksDueToday, habitsRemaining, activeProjects, categoriesEngaged };
}

/**
 * Aggregate every module slice in parallel, then derive the two computed slices
 * (`welcome`, `stats`) from the loaded results.
 *
 * @returns ServiceResult<DashboardSnapshot> — never throws. A failed module
 * becomes `{ status: "error" }` on its own slice; the rest render normally.
 */
export async function getDashboardSnapshot(
  userId = "current-user",
): Promise<ServiceResult<DashboardSnapshot>> {
  const results = await Promise.all(SNAPSHOT_CONTRIBUTORS.map((c) => loadSlice(c, userId)));

  // Correlated-records limitation (ADR D14): Promise.all flattens each [key,
  // state] tuple so the union key K can't stay correlated with
  // WidgetState<WidgetDataMap[K]> at the read site. Runtime pairing is correct
  // by construction (each contributor emits its own [key, state]); we cast ONCE
  // to a mapped type here so stats derivation gets per-key narrowing. This
  // replaces the old build-loop + final cast with a single read-path cast.
  const loaded = Object.fromEntries(results) as unknown as LoadedSlices;

  const now = new Date();
  const welcome: WidgetState<WelcomeWidgetData> = {
    status: "success",
    data: { name: OWNER_NAME, date: formatShortDate(now.toISOString()) },
  };
  const stats: WidgetState<DashboardStats> = {
    status: "success",
    data: computeDashboardStats(loaded),
  };

  // Assemble the snapshot as an explicit object literal. Each module slice is
  // typed via the mapped `LoadedSlices`, so the literal satisfies
  // `DashboardSnapshot` directly — no final `as` cast is needed.
  return {
    success: true,
    data: {
      version: 1,
      generatedAt: now.toISOString(),
      welcome,
      stats,
      tasks: loaded.tasks,
      habits: loaded.habits,
      projects: loaded.projects,
      goals: loaded.goals,
      journal: loaded.journal,
      notes: loaded.notes,
      calendar: loaded.calendar,
      expenses: loaded.expenses,
      activity: loaded.activity,
    },
  };
}
