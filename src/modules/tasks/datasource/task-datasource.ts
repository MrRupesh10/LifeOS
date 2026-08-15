/**
 * TaskDataSource — data access for tasks (Drizzle/PostgreSQL).
 *
 * The single data-access pattern for tasks. Services depend on this
 * interface, so swapping implementations later (e.g. adding caching) requires
 * zero changes above this file. The Phase 5 mock was replaced here by the
 * Drizzle implementation behind the SAME factory seam.
 *
 * ── Ownership ────────────────────────────────────────────────────
 * Every method takes an explicit `userId` FROM THE AUTHENTICATED SESSION and
 * scopes the SQL with it (`WHERE user_id = :userId`). No read or mutation is
 * ever scoped by a client-supplied value. Mutations target
 * `(user_id AND id)`, so a non-owned row is never touched — returning zero
 * rows becomes `{ success: false }`.
 *
 * ── Dates ────────────────────────────────────────────────────────
 * The `tasks` table returns `Date` objects (`mode: "date"`). `toDomain()`
 * converts them to the ISO strings the module `Task` type carries; `toEntity()`
 * (via `toDate()`) does the reverse for writes.
 */
import { eq, and, ne, gte, lte } from "drizzle-orm";
import { type ServiceResult } from "@/lib/result";
import { db } from "@/lib/db/client";
import { tasks } from "@/lib/db/schema";
import {
  type Task,
  type TaskPriority,
  type TaskStatus,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "../types";

/** The row shape Drizzle returns for the `tasks` table. */
type TaskRow = typeof tasks.$inferSelect;

/** Abstract interface — services depend on this, never on the impl. */
export interface TaskDataSource {
  getUserTasks(userId: string): Promise<ServiceResult<Task[]>>;
  getPending(userId: string): Promise<ServiceResult<Task[]>>;
  getByDate(userId: string, date: string): Promise<ServiceResult<Task[]>>;
  create(userId: string, input: CreateTaskInput): Promise<ServiceResult<Task>>;
  update(userId: string, id: string, input: UpdateTaskInput): Promise<ServiceResult<Task>>;
  remove(userId: string, id: string): Promise<ServiceResult<void>>;
  toggleComplete(userId: string, id: string): Promise<ServiceResult<Task>>;
}

// ─── Domain mapping (kept isolated here) ───────────────────────────

function toDomain(row: TaskRow): Task {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    description: row.description,
    dueDate: row.dueDate ? row.dueDate.toISOString() : null,
    priority: row.priority as TaskPriority,
    status: row.status as TaskStatus,
    projectId: row.projectId,
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** ISO string → Drizzle timestamp (null-safe). */
function toDate(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null;
}

/** Normalize an unknown error into a safe, serializable message. */
function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

// ─── Ownership-where helpers ─────────────────────────────────────

/** WHERE user_id = :userId AND id = :id — the ownership SQL boundary. */
function ownedById(userId: string, id: string) {
  return and(eq(tasks.userId, userId), eq(tasks.id, id));
}

// ─── Implementation ───────────────────────────────────────────────

class DrizzleTaskDataSource implements TaskDataSource {
  async getUserTasks(userId: string): Promise<ServiceResult<Task[]>> {
    try {
      const rows = await db.select().from(tasks).where(eq(tasks.userId, userId));
      return { success: true, data: rows.map(toDomain) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to load tasks") };
    }
  }

  async getPending(userId: string): Promise<ServiceResult<Task[]>> {
    try {
      const rows = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.userId, userId), ne(tasks.status, "completed")));
      return { success: true, data: rows.map(toDomain) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to load pending tasks") };
    }
  }

  /** Tasks whose `due_date` falls on the given calendar day (UTC, matching the
   *  service's ISO-date comparison convention). */
  async getByDate(userId: string, date: string): Promise<ServiceResult<Task[]>> {
    try {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);
      const rows = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.userId, userId), gte(tasks.dueDate, start), lte(tasks.dueDate, end)));
      return { success: true, data: rows.map(toDomain) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to load tasks by date") };
    }
  }

  async create(userId: string, input: CreateTaskInput): Promise<ServiceResult<Task>> {
    try {
      const [row] = await db
        .insert(tasks)
        .values({
          userId,
          title: input.title,
          description: input.description ?? null,
          dueDate: toDate(input.dueDate),
          priority: input.priority ?? "medium",
        })
        .returning();
      if (!row) return { success: false, message: "Task could not be created" };
      return { success: true, data: toDomain(row) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to create task") };
    }
  }

  async update(userId: string, id: string, input: UpdateTaskInput): Promise<ServiceResult<Task>> {
    try {
      const row = await db
        .update(tasks)
        .set({
          ...(input.title !== undefined && { title: input.title }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.dueDate !== undefined && { dueDate: toDate(input.dueDate) }),
          ...(input.priority !== undefined && { priority: input.priority }),
          ...(input.status !== undefined && { status: input.status }),
          updatedAt: new Date(),
        })
        .where(ownedById(userId, id))
        .returning()
        .then((rows) => rows[0]);

      if (!row) return { success: false, message: "Task not found" };
      return { success: true, data: toDomain(row) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to update task") };
    }
  }

  async remove(userId: string, id: string): Promise<ServiceResult<void>> {
    try {
      const deleted = await db
        .delete(tasks)
        .where(ownedById(userId, id))
        .returning({ id: tasks.id });
      if (deleted.length === 0) return { success: false, message: "Task not found" };
      return { success: true, data: undefined };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to delete task") };
    }
  }

  async toggleComplete(userId: string, id: string): Promise<ServiceResult<Task>> {
    try {
      const [current] = await db.select().from(tasks).where(ownedById(userId, id)).limit(1);

      if (!current) return { success: false, message: "Task not found" };

      const next: TaskStatus = current.status === "completed" ? "pending" : "completed";
      const completedAt = next === "completed" ? new Date() : null;

      const [row] = await db
        .update(tasks)
        .set({ status: next, completedAt, updatedAt: new Date() })
        .where(ownedById(userId, id))
        .returning();

      if (!row) return { success: false, message: "Task not found" };
      return { success: true, data: toDomain(row) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to update task") };
    }
  }
}

export const createTaskDataSource = (): TaskDataSource => new DrizzleTaskDataSource();
