/**
 * HabitService — business logic for the habits module.
 *
 * Owns ALL habit business logic: filtering, completion state, streak
 * calculation. UI (pages/components) and the dashboard never run this logic;
 * they call these functions. Every function returns `ServiceResult` — never
 * throws. Reads go through a `HabitDataSource` (default: Drizzle via
 * `createHabitDataSource()`), with the optional `ds` param enabling injection
 * for testability.
 *
 * ── What is NOT here ─────────────────────────────────────────────
 * Streak counts are computed here from `habit_logs` — there is no stored
 * counter (the `currentStreak`/`bestStreak` fields from the Phase 5 shell were
 * dropped because the `0002` schema has no such columns; they are derived).
 * No recurrence engine, reminders, or categories (out of scope, per plan §7).
 */
import { type ServiceResult } from "@/lib/result";
import {
  type Habit,
  type HabitFilter,
  type HabitView,
  type HabitWidgetData,
  type HabitWidgetItem,
  type CreateHabitInput,
  type UpdateHabitInput,
} from "../types";
import { type HabitDataSource, createHabitDataSource } from "../datasource/habit-datasource";

// ─── Timezone & date helpers (pure) ────────────────────────────────

/** Application timezone — the single source of truth for "today". */
const APP_TIMEZONE = "Asia/Kolkata";

/** The `habit_logs.completed_on` column is a plain date; parse to a UTC day number. */
const DAY_MS = 86_400_000;
/** `YYYY-MM-DD` → a UTC-based day number (plain date parsing, zone-independent). */
function dayNumber(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  if (y === undefined || m === undefined || d === undefined) return 0;
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

/** Today's calendar-day key in the app timezone (`YYYY-MM-DD`), Zone-correct. */
function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE }).format(new Date());
}

/**
 * Streak math over a set of completed day-keys.
 *
 * `current` — consecutive done days counting back from today. If today is not
 * yet done, the streak is measured from yesterday (today is still "in progress"
 * and does not break the streak until the day ends uncompleted). A gap of any
 * missed day ends the current streak.
 *
 * `best` — the longest run of consecutive done days over all history.
 */
function computeStreaks(completed: Set<string>, today: string): { current: number; best: number } {
  const todayNum = dayNumber(today);
  let day = todayNum;
  if (!completed.has(today)) day -= 1; // today incomplete → measure through yesterday
  let current = 0;
  while (completed.has(keyOfDay(day))) {
    current += 1;
    day -= 1;
  }

  let best = 0;
  let run = 0;
  let prev = Number.NEGATIVE_INFINITY;
  for (const raw of [...completed].sort()) {
    const n = dayNumber(raw);
    run = n === prev + 1 ? run + 1 : 1;
    if (run > best) best = run;
    prev = n;
  }
  return { current, best };
}

function keyOfDay(num: number): string {
  const ms = num * DAY_MS;
  const d = new Date(ms);
  const pad = (v: number) => String(v).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

// ─── Reusable composition ──────────────────────────────────────────

/**
 * Load active habits + their completion logs once, then enrich each habit with
 * streaks and today's completion. This is the single read that backs the today
 * list, weekly/monthly views, and the dashboard summary — one query pair.
 */
async function buildViews(
  userId: string,
  ds: HabitDataSource,
  filter: HabitFilter = "active",
): Promise<ServiceResult<HabitView[]>> {
  const [habitsResult, logsResult] = await Promise.all([
    ds.getUserHabits(userId, filter),
    ds.getLogs(userId),
  ]);
  if (!habitsResult.success) return habitsResult;
  if (!logsResult.success) return logsResult;

  const today = todayKey();
  // Per-habit set of completed day-keys.
  const completedByHabit = new Map<string, Set<string>>();
  for (const log of logsResult.data) {
    const set = completedByHabit.get(log.habitId) ?? new Set<string>();
    set.add(log.completedOn);
    completedByHabit.set(log.habitId, set);
  }

  const views: HabitView[] = habitsResult.data.map((h) => {
    const completed = completedByHabit.get(h.id) ?? new Set<string>();
    const { current, best } = computeStreaks(completed, today);
    return {
      ...h,
      currentStreak: current,
      bestStreak: best,
      completedToday: completed.has(today),
      completedDays: [...completed].sort(),
    };
  });

  return { success: true, data: views };
}

// ─── Reads ─────────────────────────────────────────────────────────

export async function getHabits(
  userId: string,
  filter: HabitFilter = "active",
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<Habit[]>> {
  return ds.getUserHabits(userId, filter);
}

/** Active habits each with current/best streak and today's completion. */
export async function getHabitViews(
  userId: string,
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<HabitView[]>> {
  return buildViews(userId, ds, "active");
}

// ─── Mutations (delegate to the datasource) ──────────────────────

export async function createHabit(
  userId: string,
  input: CreateHabitInput,
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<Habit>> {
  return ds.create(userId, input);
}

export async function updateHabit(
  userId: string,
  id: string,
  input: UpdateHabitInput,
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<Habit>> {
  return ds.update(userId, id, input);
}

export async function deleteHabit(
  userId: string,
  id: string,
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<void>> {
  return ds.remove(userId, id);
}

/** Set a habit's completion for the given calendar day (default: today). */
export async function setHabitCompletion(
  userId: string,
  habitId: string,
  completed: boolean,
  completedOn: string = todayKey(),
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<void>> {
  return ds.setCompleted(userId, habitId, completedOn, completed);
}

// ─── Toggle (read-flip) ─────────────────────────────────────────────

/**
 * Read the current "completed today" state for the habit, then flip it.
 * Delegates to `setHabitCompletion` with the inferred boolean.
 *
 * This is the single action-point the UI calls — it never sends a boolean,
 * eliminating any risk of a stale client optimistic state mismatching the
 * server.
 */
export async function toggleHabitCompletion(
  userId: string,
  habitId: string,
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<void>> {
  // Ownership gate: confirm the habit exists AND is owned.
  const ownedResult = await ds.getUserHabits(userId, "active");
  if (!ownedResult.success) {
    return { success: false, message: ownedResult.message } as ServiceResult<void>;
  }
  const owned = ownedResult.data.some((h) => h.id === habitId);
  if (!owned) return { success: false, message: "Habit not found" } as ServiceResult<void>;

  const today = todayKey();
  // Check whether a log row exists for today — that's the flip trigger.
  const logResult = await ds.getLogForDay(userId, habitId, today);
  if (!logResult.success) {
    return { success: false, message: logResult.message } as ServiceResult<void>;
  }
  const alreadyDone = logResult.data !== undefined;
  return setHabitCompletion(userId, habitId, !alreadyDone, today, ds);
}

// ─── Dashboard summary (unchanged contract) ──────────────────────

/**
 * The slice the dashboard's `HabitStreaksWidget` reads. Computed from real
 * `habit_logs` now. Shape is byte-for-byte the Phase 5 `HabitWidgetData`.
 */
export async function getHabitSummary(
  userId: string,
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<HabitWidgetData>> {
  const result = await buildViews(userId, ds, "active");
  if (!result.success) return result;

  const habits = result.data;
  const today = todayKey();
  const sorted = [...habits].sort((a, b) => b.currentStreak - a.currentStreak);

  const items: HabitWidgetItem[] = sorted.slice(0, 4).map((h) => ({
    id: h.id,
    name: h.name,
    currentStreak: h.currentStreak,
    completedToday: h.completedToday,
  }));

  return {
    success: true,
    data: {
      items,
      activeCount: habits.length,
      completedTodayCount: habits.filter((h) => h.completedToday).length,
    },
  };
}
