/**
 * GoalDataSource — data access interface for goals.
 */

import { type ServiceResult } from "@/lib/result";
import { type Goal, type GoalStatus, type GoalTimeframe } from "../types";
import { MOCK_GOALS, type GoalItem } from "@/lib/mock-data";

export interface GoalDataSource {
  getAll(): Promise<ServiceResult<Goal[]>>;
  getByTimeframe(timeframe: GoalTimeframe): Promise<ServiceResult<Goal[]>>;
}

function toDomain(mock: GoalItem): Goal {
  return {
    id: mock.id,
    userId: "current-user",
    title: mock.title,
    description: mock.description,
    progress: mock.progress,
    status: "active" as GoalStatus,
    parentGoalId: null,
    timeframe: "quarterly",
    deadline: mock.deadline,
    completedAt: null,
    archived: false,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
  };
}

class MockGoalDataSource implements GoalDataSource {
  async getAll(): Promise<ServiceResult<Goal[]>> {
    return { success: true, data: MOCK_GOALS.map(toDomain) };
  }
  async getByTimeframe(timeframe: GoalTimeframe): Promise<ServiceResult<Goal[]>> {
    return {
      success: true,
      data: MOCK_GOALS.map(toDomain).filter((g) => g.timeframe === timeframe),
    };
  }
}

export const createGoalDataSource = (): GoalDataSource => new MockGoalDataSource();
