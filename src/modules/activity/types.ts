/**
 * Activity module types — production domain model.
 *
 * Activity entries are an audit log of user actions across LifeOS.
 * They are NOT manually created — other modules emit them as
 * side-effects (task completed, habit checked, journal entry posted).
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface ActivityEntry {
  id: string;
  userId: string;
  /** Human-readable description, e.g. "Completed 'Design landing page'". */
  action: string;
  /** Which module emitted this event. */
  source: ActivitySource;
  /** Optional link to the source entity for navigation. */
  sourceEntityId: string | null;
  timestamp: string; // ISO datetime
  createdAt: string;
}

export type ActivitySource =
  | "tasks"
  | "habits"
  | "journal"
  | "notes"
  | "projects"
  | "goals"
  | "expenses"
  | "settings"
  | "auth";

// ─── Widget data slice ────────────────────────────────────────────

/**
 * Compressed view for the RecentActivityWidget.
 * `iconKey` is a source discriminator the widget maps to a Lucide icon.
 */
export interface ActivityWidgetItem {
  id: string;
  action: string;
  source: ActivitySource;
  timestamp: string;
}

export interface ActivityWidgetData {
  /** Recent activity feed (max 5 items). */
  items: ActivityWidgetItem[];
}
