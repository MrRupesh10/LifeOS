/**
 * TaskDataSource — data access interface for tasks.
 *
 * M2: MockTaskDataSource reads from mock-data.ts.
 * Phase 6: DrizzleTaskDataSource replaces it — zero service changes.
 */

import { type ServiceResult } from "@/lib/result";
import { type Task, type TaskPriority, type TaskStatus } from "../types";
import { MOCK_TASKS } from "@/lib/mock-data";
import { type TaskItem } from "@/lib/mock-data";

/** Abstract interface — future Drizzle impl satisfies this shape. */
export interface TaskDataSource {
  getAll(): Promise<ServiceResult<Task[]>>;
  getPending(): Promise<ServiceResult<Task[]>>;
  getByDate(date: string): Promise<ServiceResult<Task[]>>;
}

/** Map a mock TaskItem → production Task type. */
function toDomain(mock: TaskItem): Task {
  return {
    id: mock.id,
    userId: "current-user", // placeholder — real userId from auth in Phase 6
    title: mock.title,
    description: null,
    dueDate: mock.dueDate,
    priority: mock.priority as TaskPriority,
    status: mock.completed ? "completed" : "pending",
    projectId: mock.project ?? null,
    completedAt: mock.completed ? "2026-07-31T00:00:00.000Z" : null,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
  };
}

class MockTaskDataSource implements TaskDataSource {
  async getAll(): Promise<ServiceResult<Task[]>> {
    return { success: true, data: MOCK_TASKS.map(toDomain) };
  }
  async getPending(): Promise<ServiceResult<Task[]>> {
    return { success: true, data: MOCK_TASKS.filter((t) => !t.completed).map(toDomain) };
  }
  async getByDate(date: string): Promise<ServiceResult<Task[]>> {
    return { success: true, data: MOCK_TASKS.filter((t) => t.dueDate === date).map(toDomain) };
  }
}

export const createTaskDataSource = (): TaskDataSource => new MockTaskDataSource();
