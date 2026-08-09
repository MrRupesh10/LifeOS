/**
 * Dashboard module types — the composition contract.
 *
 * The dashboard page consumes exactly ONE type: `DashboardSnapshot`.
 * Each widget receives EXACTLY ONE prop — a `WidgetState<T>` — its own
 * data slice. No widget ever sees the full snapshot (see D11).
 *
 * Refinements D8–D13 adopted in M4:
 *   D10 — Snapshot carries metadata (version, generatedAt); errors embedded per-widget.
 *   D11 — WidgetState<T> is a discriminated union (no impossible states).
 *   D12 — defaultOrder replaces priority (drag-drop ready, UI not built).
 *   D13 — WidgetDataMap + WidgetKey drive the mapped DashboardSnapshot.
 */

import { type LucideIcon } from "lucide-react";
import { type TaskWidgetData } from "@/modules/tasks/types";
import { type HabitWidgetData } from "@/modules/habits/types";
import { type ProjectWidgetData } from "@/modules/projects/types";
import { type GoalWidgetData } from "@/modules/goals/types";
import { type JournalWidgetData } from "@/modules/journal/types";
import { type NoteWidgetData } from "@/modules/notes/types";
import { type CalendarWidgetData } from "@/modules/calendar/types";
import { type ExpenseWidgetData } from "@/modules/expenses/types";
import { type ActivityWidgetData } from "@/modules/activity/types";

// ─── Widget data map (D13) ────────────────────────────────────────

/**
 * Maps every dashboard widget key to its own data-slice type.
 * This is the SINGLE source of truth for "which widget needs which data".
 *
 * Adding a widget:
 *   1. Add its key → slice type here.
 *   2. Add a SnapshotContributor in dashboard-service.ts (TS will error if missing).
 *   3. Add a DashboardWidgetDefinition entry in constants.ts (TS will error if missing).
 * The compiler enforces completeness across all three registries.
 */
export interface WidgetDataMap {
  tasks: TaskWidgetData;
  habits: HabitWidgetData;
  projects: ProjectWidgetData;
  goals: GoalWidgetData;
  journal: JournalWidgetData;
  notes: NoteWidgetData;
  calendar: CalendarWidgetData;
  expenses: ExpenseWidgetData;
  activity: ActivityWidgetData;
}

/** A widget key — also the field name on `DashboardSnapshot`. */
export type WidgetKey = keyof WidgetDataMap;

// ─── Widget state (D11) ───────────────────────────────────────────

/**
 * Discriminated union — one state object per widget (refinement R4).
 * States are mutually exclusive; the old `WidgetProps<T>` (data | null + error?)
 * is replaced because it allowed the impossible state of both set.
 *
 * - `loading`: data not yet available. The synchronous aggregator only emits
 *   `success`/`error` today; `loading` exists for future Suspense/streaming.
 * - `success`: data present. Widgets derive their empty state from `data`.
 * - `error`: the backing service failed. `message` is safe to show users.
 */
export type WidgetState<T> =
  { status: "loading" } | { status: "success"; data: T } | { status: "error"; message: string };

// ─── Dashboard snapshot (D10, D13) ───────────────────────────────

/**
 * Point-in-time aggregate returned by `getDashboardSnapshot()`.
 * Each widget key is an explicit `WidgetState` of its own data slice,
 * plus metadata (version, generatedAt).
 *
 * NOTE: an explicit interface (not a mapped `[K in WidgetKey]` type) is used
 * because a mapped snapshot collides with TS's correlated-records limitation
 * at the assignment site in the aggregator. See ADR D13 — the explicit form
 * is more readable (`snapshot.tasks` shows `WidgetState<TaskWidgetData>`).
 */
export interface DashboardSnapshot {
  version: 1;
  generatedAt: string;
  /** Greeting slice for the dashboard header — computed by the aggregator. */
  welcome: WidgetState<WelcomeWidgetData>;
  /** Cross-module summary stats for `StatsRow` — computed by the aggregator. */
  stats: WidgetState<DashboardStats>;
  tasks: WidgetState<TaskWidgetData>;
  habits: WidgetState<HabitWidgetData>;
  projects: WidgetState<ProjectWidgetData>;
  goals: WidgetState<GoalWidgetData>;
  journal: WidgetState<JournalWidgetData>;
  notes: WidgetState<NoteWidgetData>;
  calendar: WidgetState<CalendarWidgetData>;
  expenses: WidgetState<ExpenseWidgetData>;
  activity: WidgetState<ActivityWidgetData>;
}

// ─── Computed dashboard slices (welcome + stats) ─────────────────
//
// These two slices are NOT backed by a module DataSource and are therefore NOT
// entries in `WidgetDataMap` (which keys the 9 module-backed registry
// contributors in dashboard-service.ts / constants.ts). They are derived inside
// `getDashboardSnapshot()` — welcome from trivial request metadata, stats from
// the already-loaded module slices — and carried on `DashboardSnapshot` as
// first-class `WidgetState` fields.
//
// Because they are computed (not module-backed), they get no
// `SnapshotContributor`, no `DashboardWidgetDefinition` entry, and no icon in
// `WIDGET_ICONS`. `DashboardSnapshot` is an explicit interface (D13) precisely
// so it can carry these alongside the module-backed slices without forcing them
// through the module registry.

/**
 * Greeting slice consumed by `WelcomeHeader`. `name` is the signed-in user's
 * display name (placeholder `"Rupesh"` until auth provides a real name in a
 * later phase); `date` is a short, deterministic current-date string for the
 * header subtitle.
 */
export interface WelcomeWidgetData {
  name: string;
  date: string;
}

/**
 * The four summary stat cards shown by `StatsRow`. Computed by the dashboard
 * aggregator from the already-loaded module slices — counts derive from the
 * widget data the services already produced (no new queries).
 *
 * Phase 5 caveat: counts come from display-capped slices (e.g. `dueToday` is
 * capped at 4, active `projects` at 3), so a stat may under-report when a user
 * has many items. Accurate, un-capped counts arrive in Phase 6+ with real
 * schemas and count-bearing service summaries.
 */
export interface DashboardStats {
  tasksDueToday: number;
  habitsRemaining: number;
  activeProjects: number;
  categoriesEngaged: number;
}

// ─── Widget definition (D12) ─────────────────────────────────────

export type WidgetSize = "sm" | "md" | "lg";

/**
 * A single entry in the dashboard widget registry (UI metadata).
 * Lives in `WIDGET_DEFINITIONS` (constants.ts) — kept SEPARATE from
 * `SnapshotContributor` (data) per D9. Joined on `id: WidgetKey`.
 *
 * Adding a widget = ONE entry. Removing = one delete.
 * Future drag-and-drop: a `user_widget_prefs.order` column overrides
 * `defaultOrder`; `enabled` enables hide. Data shape prepared, no UI built.
 */
export interface DashboardWidgetDefinition {
  /** Unique key — must match a `WidgetKey`. The registry is joined on this. */
  id: WidgetKey;
  /** Owning module name, e.g. "tasks". */
  module: string;
  /** Icon displayed in the widget header. */
  icon: LucideIcon;
  /** Grid size for the widget. */
  size: WidgetSize;
  /** Canonical sort position (lower = earlier). Drag-drop override falls back to this. */
  defaultOrder: number;
  /** Whether the widget is shown. */
  enabled: boolean;
  /** Optional "View all" link target. Omit if self-contained. */
  viewAllHref?: string;
}

// ─── Grid layout ──────────────────────────────────────────────────

/** Column span constants for the two-column dashboard grid layout. */
export interface DashboardGridLayout {
  leftColumn: string;
  rightColumn: string;
}
