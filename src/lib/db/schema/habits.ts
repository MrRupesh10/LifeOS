import {
  boolean,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const habits = pgTable(
  "habits",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),

    archived: boolean("archived").notNull().default(false),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("habits_user_id_idx").on(table.userId),
  }),
);

export const habitLogs = pgTable(
  "habit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    habitId: uuid("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),

    completedOn: date("completed_on").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    habitIdIdx: index("habit_logs_habit_id_idx").on(table.habitId),

    habitCompletedOnUnique: uniqueIndex("habit_logs_habit_id_completed_on_unique").on(
      table.habitId,
      table.completedOn,
    ),
  }),
);
