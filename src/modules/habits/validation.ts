/**
 * Habits validation schemas — Zod, shared client + server.
 *
 * Mirrors the Phase 6 Tasks pattern (`tasks/validation.ts`): one file, one
 * shared set of rules used by both the client-side forms and the server-side
 * actions. Adding or changing a rule is a single edit — no drift.
 *
 * ── Empty-optional normalization ─────────────────────────────────
 * HTML `<textarea>` submits `""` for an unset optional field. `maybeDescription`
 * normalizes `""` → `null` so an unset description is `null` at the
 * service/data layer instead of failing the `nullable()` check.
 */
import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().trim().min(1, "Habit name is required").max(255, "Name is too long"),
  description: z.string().trim().max(2000, "Description is too long").nullable().optional(),
});

/** Edit form — every field optional (partial update on the write side). */
export const updateHabitSchema = createHabitSchema.partial();

export type CreateHabitFormData = z.infer<typeof createHabitSchema>;
export type UpdateHabitFormData = z.infer<typeof updateHabitSchema>;
