/**
 * Tasks schema — the first user-facing domain table (Phase 6).
 *
 * ── Ownership ───────────────────────────────────────────────────
 * Every task belongs to exactly one user. `user_id` is a required FK to
 * `users.id` with ON DELETE CASCADE (SECURITY.md: deleting a user must not
 * strand their tasks). Every read and mutation is scoped by `user_id`; the
 * only source of that id at runtime is the authenticated session
 * (`getSession()`), never a client-supplied value.
 *
 * ── Relationship to the module type ─────────────────────────────
 * This table is deliberately 1:1 with the domain `Task` type in
 * `src/modules/tasks/types.ts` (the single source of truth). Drizzle dates
 * come back as `Date` (`mode: "date"`); the datasource `toDomain()` maps them
 * to the ISO strings the module type carries.
 *
 * ── Enum columns: varchar, not pgEnum ───────────────────────────
 * `priority` and `status` use `varchar`, matching the `users.role` precedent.
 * This defers migration churn if the value sets grow, and keeps the door open
 * without re-diffing the table. The runtime values are constrained in the
 * module type + Zod schemas (`low|medium|high`, `pending|in_progress|completed`).
 *
 * ── project_id ──────────────────────────────────────────────────
 * Nullable, intentionally WITHOUT a foreign key: the `projects` table does not
 * exist yet (Phase 10). The column is kept to stay 1:1 with `Task.projectId`.
 * The FK is added in the Projects phase. `goal_id` is omitted entirely — the
 * module `Task` type has no `goalId`; it is added with Goals (Phase 11).
 */
import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    dueDate: timestamp("due_date", { withTimezone: true, mode: "date" }),
    priority: varchar("priority", { length: 32 }).notNull().default("medium"),
    status: varchar("status", { length: 32 }).notNull().default("pending"),
    projectId: uuid("project_id"),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("tasks_user_id_idx").on(table.userId),
    statusIdx: index("tasks_status_idx").on(table.status),
    dueDateIdx: index("tasks_due_date_idx").on(table.dueDate),
  }),
);
