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

// ─── Write DTOs ────────────────────────────────────────────────
/**
 * Input for task creation. `priority` defaults to "medium" at the data
 * layer; `dueDate`/`description` are optional. Validation (title required,
 * lengths, enums) happens in Zod schemas at the action layer (M5), not here.
 * Dates are ISO strings — the datasource converts them to Drizzle timestamps.
 */
export interface CreateTaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
}

/**
 * Input for editing an existing task. All fields optional (partial update).
 * `status`/`completed_at` are managed by the datasource; note that toggling
 * completion has its own dedicated path (`toggleComplete`) that keeps
 * `status` and `completedAt` in lockstep.
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
}

// ─── List options (service layer) ───────────────────────────────
/**
 * Task list filters. Semantics (enforced in the service):
 * - `all`      — every task (pending + completed)
 * - `today`    — non-completed tasks due today or overdue
 * - `upcoming` — non-completed tasks due after today
 * - `completed`— completed tasks
 */
export type TaskFilter = "all" | "today" | "upcoming" | "completed";

/** Task list sort keys (enforced in the service). */
export type TaskSort = "dueDate" | "priority" | "createdAt";
