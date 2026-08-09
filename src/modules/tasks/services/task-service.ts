/**
 * TaskService — business logic for the tasks module.
 *
 * Reads from a TaskDataSource, is independent of UI and the dashboard.
 * Returns ServiceResult<TaskWidgetData> — never throws.
 */

import { type ServiceResult } from "@/lib/result";
import { type TaskWidgetData } from "../types";
import { type TaskDataSource, createTaskDataSource } from "../datasource/task-datasource";

export async function getTaskSummary(
  userId: string,
  ds: TaskDataSource = createTaskDataSource(),
): Promise<ServiceResult<TaskWidgetData>> {
  const result = await ds.getPending();

  if (!result.success) return result;

  const pending = result.data;
  const today = new Date().toISOString().slice(0, 10);

  const dueToday = pending.filter((t) => t.dueDate?.slice(0, 10) === today).slice(0, 4);

  return {
    success: true,
    data: {
      dueToday,
      pendingCount: pending.length,
    },
  };
}
