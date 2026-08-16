/**
 * Habits module types — the production domain model for habits.
 *
 * Deliberately 1:1 with the Drizzle tables in `src/lib/db/schema/habits.ts`
 * (Phase 6 precedent: the domain `Habit` maps directly to the `habits` row).
 * Streak counts are NOT stored — they are derived by the service from the
 * `habit_logs` table. `frequency`/`category`/`color` were dropped from the
 * Phase 5 shell because the `0002` schema does not carry them; they can be
 * reintroduced with a migration when a phase genuinely needs them.
 */

// ─── Core entities ────────────────────────────────────────────────

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * One completion row — a habit completed on a calendar day.
 * `completedOn` is the app-timezone day (`YYYY-MM-DD`), stored in a `date`
 * column so it is timezone-safe. There is NO `userId` here: ownership is
 * scoped through the owning `habits.userId` (join/subquery), keeping the log
 * table minimal per the approved plan.
 */
export interface HabitLog {
  id: string;
  habitId: string;
  completedOn: string;
  createdAt: string;
}

// ─── Derived view (service layer) ────────────────────────────────

/**
 * An active habit with its completion state for a client or the widget.
 * Streaks are computed by the service from `habit_logs`, never stored.
 */
export interface HabitView extends Habit {
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  /** All calendar-day keys (`YYYY-MM-DD`) that have completion logs. */
  completedDays: string[];
}

// ─── Widget data slice (dashboard contract) ──────────────────────

/**
 * A compact row for the dashboard `HabitStreaksWidget` grid.
 * (The Phase 5 shell also carried `category`; the widget never rendered it and
 * the schema does not store it, so it is removed here.)
 */
export interface HabitWidgetItem {
  id: string;
  name: string;
  currentStreak: number;
  completedToday: boolean;
}

/**
 * The exact shape `HabitStreaksWidget` receives. Unchanged from Phase 5 —
 * this is the dashboard data contract that must not drift.
 */
export interface HabitWidgetData {
  items: HabitWidgetItem[];
  /** Total count of active (non-archived) habits for the user. */
  activeCount: number;
  /** How many of those habits have been completed today. */
  completedTodayCount: number;
}

// ─── Write DTOs ───────────────────────────────────────────────────

export interface CreateHabitInput {
  name: string;
  description?: string | null;
}

/** Partial update; `archived` toggles archive state. */
export interface UpdateHabitInput {
  name?: string;
  description?: string | null;
  archived?: boolean;
}

// ─── Read options (service layer) ─────────────────────────────────

export type HabitFilter = "all" | "active" | "archived";
