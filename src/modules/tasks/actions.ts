"use server";

/**
 * Tasks server actions — the mutation boundary for the Tasks module.
 *
 * ── Security ─────────────────────────────────────────────────────
 * Every action runs `getSession()` FIRST (the TWO-layer defense from
 * SECURITY.md — middleware is only the UX layer; this is the authority). The
 * authenticated `session.user.id` is the ONLY source of `userId`; a
 * client-supplied id is never trusted — the datasource additionally scopes
 * every mutation by `(user_id AND id)`. Unauthenticated → `Unauthorized`.
 *
 * ── Validation ───────────────────────────────────────────────────
 * Input arrives as `unknown` and is parsed with the shared Zod schemas from
 * `validation.ts` (same rules the M7 forms use client-side). Nothing is ever
 * given to the service without passing validation.
 *
 * ── Revalidation ─────────────────────────────────────────────────
 * On success both the Tasks page and the dashboard are revalidated, so the
 * list and the Today's Tasks widget immediately reflect the mutation.
 *
 * ── Result shapes ────────────────────────────────────────────────
 * Task-bearing actions return `ServiceResult<Task>`; delete returns a plain
 * serializable `{ success, message? }`. All are serializable across the
 * server-action boundary (no `undefined` data for delete).
 */
import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth/session";
import { type ServiceResult } from "@/lib/result";
import { type Task } from "./types";
import { createTaskSchema, updateTaskSchema } from "./validation";
import { createTask, updateTask, deleteTask, toggleTaskCompletion } from "./services/task-service";

type TaskResult = ServiceResult<Task>;
type DeleteResult = { success: boolean; message?: string };

/** Extract the first validation message into a serializable error. */
function validationError(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Invalid input";
}

/** Revalidate the Tasks page + dashboard after any successful mutation. */
function revalidateTasks() {
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard");
}

export async function createTaskAction(input: unknown): Promise<TaskResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: validationError(parsed.error) };

  const result = await createTask(session.user.id, parsed.data);
  if (result.success) revalidateTasks();
  return result;
}

export async function updateTaskAction(id: string, input: unknown): Promise<TaskResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const parsed = updateTaskSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: validationError(parsed.error) };

  const result = await updateTask(session.user.id, id, parsed.data);
  if (result.success) revalidateTasks();
  return result;
}

export async function deleteTaskAction(id: string): Promise<DeleteResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const result = await deleteTask(session.user.id, id);
  if (result.success) {
    revalidateTasks();
    return { success: true };
  }
  return { success: false, message: result.message };
}

export async function toggleTaskCompletionAction(id: string): Promise<TaskResult> {
  const session = await getSession();
  if (!session?.user.id) return { success: false, message: "Unauthorized" };

  const result = await toggleTaskCompletion(session.user.id, id);
  if (result.success) revalidateTasks();
  return result;
}
