/**
 * GoalService — business logic for the goals module.
 */

import { type ServiceResult } from "@/lib/result";
import { type GoalWidgetData, type GoalWidgetItem } from "../types";
import { type GoalDataSource, createGoalDataSource } from "../datasource/goal-datasource";

export async function getGoalSummary(
  _userId: string,
  ds: GoalDataSource = createGoalDataSource(),
): Promise<ServiceResult<GoalWidgetData>> {
  const result = await ds.getByTimeframe("quarterly");

  if (!result.success) return result;

  const items: GoalWidgetItem[] = result.data.slice(0, 4).map((g) => ({
    id: g.id,
    title: g.title,
    progress: g.progress,
    deadline: g.deadline,
  }));

  return {
    success: true,
    data: {
      items,
      totalCount: result.data.length,
    },
  };
}
