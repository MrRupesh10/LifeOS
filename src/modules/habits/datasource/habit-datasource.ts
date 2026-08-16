/**
 * HabitDataSource — data access for habits (Drizzle/PostgreSQL).
 *
 * Replaces the Phase 5 Mock behind the SAME factory seam. Every method takes an
 * explicit `userId` from the authenticated session and scopes the SQL with it
 * (`WHERE user_id = :userId`). Mutations target `(user_id AND id)` so a
 * non-owned row is never touched — zero rows becomes `{ success: false }`.
 *
 * ── User scoping for logs ─────────────────────────────────────────
 * `habit_logs` has NO `user_id` column (approved plan — kept minimal). That
 * means a log is scoped to a user only through its owning habit: every log read
 * joins `habit_logs` to `habits` on `user_id`, and every log write is guarded
 * by first resolving the habit to `(user_id AND id)`. If the DB later grows
 * enough that the join is a bottleneck, denormalizing `user_id` onto `habit_logs`
 * is a one-column migration away.
 *
 * ── Dates ────────────────────────────────────────────────────────
 * `completedOn` (`date` column) returns as a `YYYY-MM-DD` string. Streaks are
 * computed from these in the service; nothing here knows about streaks or time.
 */
import { eq, and, gte, ne } from "drizzle-orm";
import { type ServiceResult } from "@/lib/result";
import { db } from "@/lib/db/client";
import { habits, habitLogs } from "@/lib/db/schema";
import {
  type Habit,
  type HabitLog,
  type HabitFilter,
  type CreateHabitInput,
  type UpdateHabitInput,
} from "../types";

/** Row shapes Drizzle returns. */
type HabitRow = typeof habits.$inferSelect;
type HabitLogRow = typeof habitLogs.$inferSelect;

/** Abstract interface — services depend on this, never on the impl. */
export interface HabitDataSource {
  getUserHabits(userId: string, filter?: HabitFilter): Promise<ServiceResult<Habit[]>>;
  /** All logs for the user's habits, ordered newest-first. User-scoped via join. */
  getLogs(userId: string): Promise<ServiceResult<HabitLog[]>>;
  /** Logs for the user's habits on or after `from` (inclusive), newest-first. */
  getLogsFrom(userId: string, from: string): Promise<ServiceResult<HabitLog[]>>;
  /** At most one log row for `(habitId, completedOn)` — ownership-gated through the habit. */
  getLogForDay(
    userId: string,
    habitId: string,
    completedOn: string,
  ): Promise<ServiceResult<HabitLog | undefined>>;
  create(userId: string, input: CreateHabitInput): Promise<ServiceResult<Habit>>;
  update(userId: string, id: string, input: UpdateHabitInput): Promise<ServiceResult<Habit>>;
  remove(userId: string, id: string): Promise<ServiceResult<void>>;
  /**
   * Set a habit's completion for one calendar day. Insert the log row when
   * `completed` is true, delete it when false. Idempotent per the unique
   * `(habit_id, completed_on)` constraint. Returns `{ success: false }` if the
   * habit is not owned or does not exist.
   */
  setCompleted(
    userId: string,
    habitId: string,
    completedOn: string,
    completed: boolean,
  ): Promise<ServiceResult<void>>;
}

// ─── Domain mapping (kept isolated here) ───────────────────────────

function toHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    description: row.description,
    archived: row.archived,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Ownership WHERE — `user_id = :userId AND id = :id` — the SQL boundary. */
function ownedById(userId: string, id: string) {
  return and(eq(habits.userId, userId), eq(habits.id, id));
}

/** Normalize an unknown error into a safe, serializable message. */
function toErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

class DrizzleHabitDataSource implements HabitDataSource {
  async getUserHabits(
    userId: string,
    filter: HabitFilter = "all",
  ): Promise<ServiceResult<Habit[]>> {
    try {
      const where =
        filter === "archived"
          ? and(eq(habits.userId, userId), eq(habits.archived, true))
          : filter === "active"
            ? and(eq(habits.userId, userId), ne(habits.archived, true))
            : eq(habits.userId, userId);
      const rows = await db.select().from(habits).where(where);
      return { success: true, data: rows.map(toHabit) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to load habits") };
    }
  }

  async getLogs(userId: string): Promise<ServiceResult<HabitLog[]>> {
    try {
      const rows = await db
        .select({
          id: habitLogs.id,
          habitId: habitLogs.habitId,
          completedOn: habitLogs.completedOn,
          createdAt: habitLogs.createdAt,
        })
        .from(habitLogs)
        .innerJoin(habits, eq(habitLogs.habitId, habits.id))
        .where(eq(habits.userId, userId));
      return { success: true, data: rows.map((r) => logFromRow(r)) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to load habit log") };
    }
  }

  async getLogsFrom(userId: string, from: string): Promise<ServiceResult<HabitLog[]>> {
    try {
      const rows = await db
        .select({
          id: habitLogs.id,
          habitId: habitLogs.habitId,
          completedOn: habitLogs.completedOn,
          createdAt: habitLogs.createdAt,
        })
        .from(habitLogs)
        .innerJoin(habits, eq(habitLogs.habitId, habits.id))
        .where(and(eq(habits.userId, userId), gte(habitLogs.completedOn, from)));
      return { success: true, data: rows.map((r) => logFromRow(r)) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to load habit log") };
    }
  }

  async getLogForDay(
    userId: string,
    habitId: string,
    completedOn: string,
  ): Promise<ServiceResult<HabitLog | undefined>> {
    try {
      const [row] = await db
        .select({
          id: habitLogs.id,
          habitId: habitLogs.habitId,
          completedOn: habitLogs.completedOn,
          createdAt: habitLogs.createdAt,
        })
        .from(habitLogs)
        .innerJoin(habits, eq(habitLogs.habitId, habits.id))
        .where(
          and(
            eq(habits.userId, userId),
            eq(habits.id, habitId),
            eq(habitLogs.completedOn, completedOn),
          ),
        )
        .limit(1);
      return { success: true, data: row ? logFromRow(row) : undefined };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to load habit log") };
    }
  }

  async create(userId: string, input: CreateHabitInput): Promise<ServiceResult<Habit>> {
    try {
      const [row] = await db
        .insert(habits)
        .values({ userId, name: input.name, description: input.description ?? null })
        .returning();
      if (!row) return { success: false, message: "Habit could not be created" };
      return { success: true, data: toHabit(row) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to create habit") };
    }
  }

  async update(userId: string, id: string, input: UpdateHabitInput): Promise<ServiceResult<Habit>> {
    try {
      const row = await db
        .update(habits)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.archived !== undefined && { archived: input.archived }),
          updatedAt: new Date(),
        })
        .where(ownedById(userId, id))
        .returning()
        .then((rows) => rows[0]);
      if (!row) return { success: false, message: "Habit not found" };
      return { success: true, data: toHabit(row) };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to update habit") };
    }
  }

  async remove(userId: string, id: string): Promise<ServiceResult<void>> {
    try {
      const deleted = await db
        .delete(habits)
        .where(ownedById(userId, id))
        .returning({ id: habits.id });
      if (deleted.length === 0) return { success: false, message: "Habit not found" };
      return { success: true, data: undefined };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to delete habit") };
    }
  }

  async setCompleted(
    userId: string,
    habitId: string,
    completedOn: string,
    completed: boolean,
  ): Promise<ServiceResult<void>> {
    try {
      // Resolve the habit first — this is the ownership gate for a log row that
      // has no `user_id` of its own. A non-owned or missing habit is a no-op.
      const [owned] = await db
        .select({ id: habits.id })
        .from(habits)
        .where(ownedById(userId, habitId))
        .limit(1);
      if (!owned) return { success: false, message: "Habit not found" };

      if (completed) {
        await db
          .insert(habitLogs)
          .values({ habitId, completedOn })
          .onConflictDoNothing({ target: [habitLogs.habitId, habitLogs.completedOn] });
      } else {
        await db
          .delete(habitLogs)
          .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.completedOn, completedOn)));
      }
      return { success: true, data: undefined };
    } catch (err) {
      return { success: false, message: toErrorMessage(err, "Failed to update habit log") };
    }
  }
}

/** Map a combined log+habit row to the domain `HabitLog`. The `date` column is
 *  string-mode in Drizzle, so `completedOn` is already a `YYYY-MM-DD` string. */
function logFromRow(r: {
  id: string;
  habitId: string;
  completedOn: string;
  createdAt: Date;
}): HabitLog {
  return {
    id: r.id,
    habitId: r.habitId,
    completedOn: r.completedOn,
    createdAt: r.createdAt.toISOString(),
  };
}

export const createHabitDataSource = (): HabitDataSource => new DrizzleHabitDataSource();
