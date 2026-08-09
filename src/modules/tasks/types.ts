/**
 * Tasks module types — the production domain model for tasks.
 *
 * Designed as if the `tasks` PostgreSQL table already exists.
 * Drizzle schema in Phase 6 will map these camelCase fields to
 * snake_case columns (e.g. `dueDate` → `due_date`).
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "completed";

// ─── Widget data slice ───────────────────────────────────────────
/**
 * The exact shape the dashboard's TodayTasksWidget receives.
 * The widget never sees raw Task[] — the service computes this.
 */
export interface TaskWidgetData {
  /** Up to 4 pending tasks due today (or overdue). */
  dueToday: Task[];
  /** Count of ALL pending tasks for the user. */
  pendingCount: number;
}
