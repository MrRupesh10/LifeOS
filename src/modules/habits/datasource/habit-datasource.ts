/**
 * HabitDataSource — data access interface for habits.
 */

import { type ServiceResult } from "@/lib/result";
import { type Habit, type HabitFrequency, type HabitCategory } from "../types";
import { MOCK_HABITS, type HabitItem } from "@/lib/mock-data";

export interface HabitDataSource {
  getAll(): Promise<ServiceResult<Habit[]>>;
  getActive(): Promise<ServiceResult<Habit[]>>;
}

function toDomain(mock: HabitItem): Habit {
  return {
    id: mock.id,
    userId: "current-user",
    name: mock.name,
    description: null,
    frequency: mock.frequency as HabitFrequency,
    category: mock.category as HabitCategory,
    currentStreak: mock.streak,
    bestStreak: mock.streak,
    color: null,
    archived: false,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
  };
}

class MockHabitDataSource implements HabitDataSource {
  async getAll(): Promise<ServiceResult<Habit[]>> {
    return { success: true, data: MOCK_HABITS.map(toDomain) };
  }
  async getActive(): Promise<ServiceResult<Habit[]>> {
    return { success: true, data: MOCK_HABITS.map(toDomain) };
  }
}

export const createHabitDataSource = (): HabitDataSource => new MockHabitDataSource();
