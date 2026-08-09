/**
 * HabitService — business logic for the habits module.
 */

import { type ServiceResult } from "@/lib/result";
import { type HabitWidgetData, type HabitWidgetItem } from "../types";
import { type HabitDataSource, createHabitDataSource } from "../datasource/habit-datasource";

export async function getHabitSummary(
  _userId: string,
  ds: HabitDataSource = createHabitDataSource(),
): Promise<ServiceResult<HabitWidgetData>> {
  const result = await ds.getActive();

  if (!result.success) return result;

  const habits = result.data;
  const items: HabitWidgetItem[] = habits.slice(0, 4).map((h) => ({
    id: h.id,
    name: h.name,
    currentStreak: h.currentStreak,
    completedToday: false, // will be computed from habit_logs in Phase 7
    category: h.category,
  }));

  return {
    success: true,
    data: {
      items,
      activeCount: habits.length,
      completedTodayCount: 0, // Phase 7 — computed from habit_logs table
    },
  };
}
