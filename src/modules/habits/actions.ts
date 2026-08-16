"use server";

/**
 * Habits server actions — the mutation boundary for the Habits module.
 *
 * ── Security ─────────────────────────────────────────────────────
 * Every action runs `getSession()` FIRST. The authenticated
 * `session.user.id` is the ONLY source of `userId`; a client-supplied id is
 * never trusted — the datasource additionally scopes every mutation by
 * `(user_id AND id)`. Unauthenticated → `Unauthorized`.
 *
 * ── Validation ───────────────────────────────────────────────────
 * Input arrives as `unknown` and is parsed with the shared Zod schemas from
 * `validation.ts`. Nothing is given to the service without passing validation.
 *
 * ── Revalidation ─────────────────────────────────────────────────
 * On success the Habits page and the dashboard are revalidated, so the list
 * and the Habit Streaks widget immediately reflect the mutation.
 *
 * ── Toggle ────────────────────────────────────────────────────────
 * `toggleHabitCompletionAction` is a single read-flip: the service reads
 * whether the habit is already done today, then either inserts or deletes
 * the log row. The client never sends a boolean — no stale optimistic state
 * can desync.
 */
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth/session";
import { type ServiceResult } from "@/lib/result";
import { type Habit } from "./types";
import { createHabitSchema, updateHabitSchema } from "./validation";
import {
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitCompletion,
} from "./services/habit-service";

type HabitResult = ServiceResult<Habit>;
type ToggleResult = { success: boolean; message?: string };

/** Extract the first validation message into a serializable error. */
function validationError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid input";
}

/** Revalidate the Habits page + dashboard after any successful mutation. */
function revalidateHabits() {
  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");
}

export async function createHabitAction(input: unknown): Promise<HabitResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const parsed = createHabitSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: validationError(parsed.error) };

  const result = await createHabit(session.user.id, parsed.data);
  if (result.success) revalidateHabits();
  return result;
}

export async function updateHabitAction(id: string, input: unknown): Promise<HabitResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const parsed = updateHabitSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: validationError(parsed.error) };

  const result = await updateHabit(session.user.id, id, parsed.data);
  if (result.success) revalidateHabits();
  return result;
}

export async function deleteHabitAction(id: string): Promise<ToggleResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const result = await deleteHabit(session.user.id, id);
  if (result.success) {
    revalidateHabits();
    return { success: true };
  }
  return { success: false, message: result.message };
}

export async function toggleHabitCompletionAction(id: string): Promise<ToggleResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const result = await toggleHabitCompletion(session.user.id, id);
  if (result.success) revalidateHabits();
  if (!result.success) return result;
  return { success: true };
}

export async function archiveHabitAction(id: string): Promise<HabitResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const result = await updateHabit(session.user.id, id, { archived: true });
  if (result.success) revalidateHabits();
  return result;
}

export async function unarchiveHabitAction(id: string): Promise<HabitResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const result = await updateHabit(session.user.id, id, { archived: false });
  if (result.success) revalidateHabits();
  return result;
}
