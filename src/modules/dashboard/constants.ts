/**
 * Dashboard widget registry + grid layout constants.
 *
 * UI metadata only (D9) — joined to the aggregator's data via `WidgetKey`.
 * `id` is a `WidgetKey`, so each definition points at a `DashboardSnapshot` field.
 */

import {
  CheckSquare,
  Repeat,
  Folders,
  Target,
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  History,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { type DashboardWidgetDefinition, type DashboardGridLayout, type WidgetKey } from "./types";

// ─── Widget definitions ──────────────────────────────────────────

/**
 * Ordered list of widgets shown on the dashboard.
 * Order = `defaultOrder` (ascending). `enabled` toggles visibility.
 * Adding a widget = ONE entry here + ONE `SnapshotContributor` (data) +
 * ONE `DashboardSnapshot` field. Widget render component lives in M6.
 */
export const WIDGET_DEFINITIONS: DashboardWidgetDefinition[] = [
  {
    id: "tasks",
    module: "tasks",
    icon: CheckSquare,
    size: "md",
    defaultOrder: 10,
    enabled: true,
    viewAllHref: "/dashboard/tasks",
  },
  {
    id: "habits",
    module: "habits",
    icon: Repeat,
    size: "sm",
    defaultOrder: 20,
    enabled: true,
    viewAllHref: "/dashboard/habits",
  },
  {
    id: "projects",
    module: "projects",
    icon: Folders,
    size: "md",
    defaultOrder: 30,
    enabled: true,
    viewAllHref: "/dashboard/projects",
  },
  {
    id: "goals",
    module: "goals",
    icon: Target,
    size: "lg",
    defaultOrder: 40,
    enabled: true,
    viewAllHref: "/dashboard/goals",
  },
  {
    id: "journal",
    module: "journal",
    icon: BookOpen,
    size: "md",
    defaultOrder: 50,
    enabled: true,
    viewAllHref: "/dashboard/journal",
  },
  {
    id: "notes",
    module: "notes",
    icon: FileText,
    size: "sm",
    defaultOrder: 60,
    enabled: true,
    viewAllHref: "/dashboard/notes",
  },
  {
    id: "calendar",
    module: "calendar",
    icon: Calendar,
    size: "sm",
    defaultOrder: 70,
    enabled: true,
    viewAllHref: "/dashboard/calendar",
  },
  {
    id: "expenses",
    module: "expenses",
    icon: DollarSign,
    size: "sm",
    defaultOrder: 80,
    enabled: true,
    viewAllHref: "/dashboard/expenses",
  },
  {
    id: "activity",
    module: "activity",
    icon: History,
    size: "md",
    defaultOrder: 90,
    enabled: true,
    viewAllHref: "/dashboard/analytics",
  },
];

// ─── Icon mapping ────────────────────────────────────────────────

/** Icon registry keyed by `WidgetKey` — the single icon source for widgets. */
export const WIDGET_ICONS = Object.fromEntries(
  WIDGET_DEFINITIONS.map((w) => [w.id, w.icon]),
) as Record<WidgetKey, LucideIcon>;

/** Shorthand for QuickActions (+New Task, +New Habit, ...) — no data slice. */
export const QUICK_ACTION_ICON = Plus;

// ─── Grid layout ─────────────────────────────────────────────────

/** Column spans for the two-column dashboard grid. */
export const DASHBOARD_GRID: DashboardGridLayout = {
  leftColumn: "lg:col-span-2",
  rightColumn: "lg:col-span-1",
};

/** Bottom row spans the full width. */
export const FULL_ROW_SPAN = "lg:col-span-3";
