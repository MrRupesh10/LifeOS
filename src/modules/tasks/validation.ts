/**
 * Tasks validation schemas — Zod, shared client + server.
 *
 * Same pattern as `auth/validation.ts`: the create/edit forms AND the server
 * actions use the SAME rules, so there is no drift between client-side form
 * errors and server-side validation, and adding a field is one schema edit.
 *
 * ── Empty-optional normalization ─────────────────────────────────
 * HTML `type="date"` / empty text inputs submit `""` for an unset optional
 * field. `maybeDate` normalizes `""` → `null` via `z.preprocess` so an unset
 * due date is `null` at the service/data layer instead of failing `.date()`.
 *
 * ── Ownership / status ───────────────────────────────────────────
 * No `userId` here — it always comes from the authenticated session server-side
 * (never from the client). No `status` field: completion is handled solely by
 * the dedicated toggle path (`toggleTaskCompletion`), keeping `status` and
 * `completedAt` in lockstep.
 */
import { z } from "zod";

const prioritySchema = z.enum(["low", "medium", "high"]);

/** Due date — a `YYYY-MM-DD` string, or `null` when unset (`""` → `null`). */
export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().trim().max(2000, "Description is too long").nullable().optional(),
  dueDate: z.string().optional().nullable(),
  priority: prioritySchema.optional(),
});

/** Edit form — every field optional (partial update on the write side). */
export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
