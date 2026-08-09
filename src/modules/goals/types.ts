/**
 * Goals module types — production domain model.
 *
 * Goals are hierarchical: a goal can nest under a parent goal.
 * This enables OKR-style tracking ("Q2 Objective → 3 Key Results").
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  progress: number; // 0–100
  status: GoalStatus;
  parentGoalId: string | null; // hierarchical nesting
  timeframe: GoalTimeframe;
  deadline: string | null;
  completedAt: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GoalStatus = "active" | "completed" | "abandoned";

export type GoalTimeframe = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

// ─── Widget data slice ────────────────────────────────────────────

export interface GoalWidgetItem {
  id: string;
  title: string;
  progress: number; // 0–100
  deadline: string | null;
}

export interface GoalWidgetData {
  /** Quarterly goals (max 4 displayed). */
  items: GoalWidgetItem[];
  totalCount: number;
}
