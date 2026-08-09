/**
 * Habits module types — production domain model.
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  category: HabitCategory;
  currentStreak: number;
  bestStreak: number;
  color: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type HabitFrequency = "daily" | "weekly" | "monthly";

export type HabitCategory =
  "health" | "learning" | "productivity" | "mindfulness" | "social" | "finance" | "other";

// ─── Widget data slice ────────────────────────────────────────────

/**
 * A compact view for display in the HabitStreaksWidget grid.
 * Less than the full Habit — only what the widget renders.
 */
export interface HabitWidgetItem {
  id: string;
  name: string;
  currentStreak: number;
  completedToday: boolean;
  category: HabitCategory;
}

export interface HabitWidgetData {
  /** Top habits for the dashboard grid (max 4). */
  items: HabitWidgetItem[];
  /** Total count of active habits. */
  activeCount: number;
  /** Tracks how many habits have been completed today. */
  completedTodayCount: number;
}
