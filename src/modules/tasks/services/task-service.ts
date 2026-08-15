/**
 * TaskService — business logic for the tasks module.
 *
 * Owns ALL task business logic: filtering, sorting, and rule about which
 * dataset backs each filter. UI (pages/components) and the dashboard never
 * run this logic; they call these functions. Every function returns
 * `ServiceResult` — never throws.
 *
 * Reads go through a `TaskDataSource` (default: the Drizzle implementation
 * via `createTaskDataSource()`); the optional `ds` param enables dependency
 * injection for testability. Data access is entirely the datasource's job;
 * this layer reasons over domain `Task`s.
 */
import { type ServiceResult } from "@/lib/result";
import {
  type Task,
  type TaskPriority,
  type TaskWidgetData,
  type TaskFilter,
  type TaskSort,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "../types";
import { type TaskDataSource, createTaskDataSource } from "../datasource/task-datasource";

// ─── Constants & helpers (pure) ───────────────────────────────────

/** Application timezone — the single source of truth for "today". */
const APP_TIMEZONE = "Asia/Kolkata";

/**
 * Today's calendar-day key in the application timezone (`YYYY-MM-DD`).
 *
 * Previously derived from `new Date().toISOString().slice(0, 10)`, which
 * returns the UTC day. Because the runtime runs in UTC but the app's intended
 * zone is `APP_TIMEZONE` (+05:30), that boundary slipped a day — a task seeded
 * on Aug 11 UTC was already overdue on Aug 12 in Kolkata, so "today" filters
 * and the dashboard's "Tasks Due Today" showed the wrong day. `Intl` with
 * `en-CA` yields a zero-padded, zone-correct `YYYY-MM-DD` string that feeds the
 * same string comparisons the filters already use.
 */
function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE }).format(new Date());
}

/** Priority rank used for sorting — higher first. */
const PRIORITY_RANK: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

function applyFilter(tasks: Task[], filter: TaskFilter): Task[] {
  const today = todayKey();
  switch (filter) {
    case "all":
      return tasks;
    case "completed":
      return tasks.filter((t) => t.status === "completed");
    case "today":
      // Non-completed rows due today or overdue (due on/before today, in UTC).
      return tasks.filter((t) => t.dueDate !== null && t.dueDate.slice(0, 10) <= today);
    case "upcoming":
      // Non-completed rows due strictly after today.
      return tasks.filter((t) => t.dueDate !== null && t.dueDate.slice(0, 10) > today);
  }
}

function applySort(tasks: Task[], sort: TaskSort): Task[] {
  const copy = [...tasks];
  switch (sort) {
    case "dueDate":
      // Ascending due date; tasks without a due date sort last.
      return copy.sort((a, b) => {
        if (a.dueDate === null && b.dueDate === null) return 0;
        if (a.dueDate === null) return 1;
        if (b.dueDate === null) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case "priority":
      return copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
    case "createdAt":
      // Newest first.
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

// ─── Reads ─────────────────────────────────────────────────────────

/**
 * Load a user's tasks, filtered and sorted. The page's single read entry point.
 */
export async function getTasks(
  userId: string,
  opts: { filter?: TaskFilter; sort?: TaskSort } = {},
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<Task[]>> {
  const filter = opts.filter ?? "all";
  const sort = opts.sort ?? "dueDate";

  let rows: Task[];
  const result = await (filter === "all" || filter === "completed"
    ? ds.getUserTasks(userId)
    : ds.getPending(userId));
  if (!result.success) return result;
  rows = result.data;

  return { success: true, data: applySort(applyFilter(rows, filter), sort) };
}

export async function getTodayTasks(
  userId: string,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<Task[]>> {
  return getTasks(userId, { filter: "today", sort: "dueDate" }, ds);
}

export async function getUpcomingTasks(
  userId: string,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<Task[]>> {
  return getTasks(userId, { filter: "upcoming", sort: "dueDate" }, ds);
}

export async function getCompletedTasks(
  userId: string,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<Task[]>> {
  return getTasks(userId, { filter: "completed", sort: "dueDate" }, ds);
}

// ─── Mutations (delegate to the datasource) ──────────────────────

export async function createTask(
  userId: string,
  input: CreateTaskInput,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<Task>> {
  return ds.create(userId, input);
}

export async function updateTask(
  userId: string,
  id: string,
  input: UpdateTaskInput,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<Task>> {
  return ds.update(userId, id, input);
}

/** Deletes a task the user owns (no-op error if not found/owned). */
export async function deleteTask(
  userId: string,
  id: string,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<void>> {
  return ds.remove(userId, id);
}

/** Flip an owned task's completion state (status + completedAt in lockstep). */
export async function toggleTaskCompletion(
  userId: string,
  id: string,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<Task>> {
  return ds.toggleComplete(userId, id);
}

// ─── Dashboard summary (unchanged contract) ──────────────────────
// Keep the Phase 5 dashboard slice stable: "pending tasks due today (or
// overdue), capped at 4" + a total pending count. Despite some overlap with
// `getTasks`, this path is intentionally kept independent so the dashboard's
// displayed contract never drifts from what `TaskWidgetData` promises.
export async function getTaskSummary(
  userId: string,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<TaskWidgetData>> {
  const result = await ds.getPending(userId);

  if (!result.success) return result;

  const pending = result.data;
  const today = todayKey();

  const dueToday = pending.filter((t) => t.dueDate?.slice(0, 10) === today).slice(0, 4);

  return {
    success: true,
    data: {
      dueToday,
      pendingCount: pending.length,
    },
  };
}
