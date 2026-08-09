/**
 * ActivityService — business logic for the activity feed module.
 */

import { type ServiceResult } from "@/lib/result";
import { type ActivityWidgetData, type ActivityWidgetItem } from "../types";
import {
  type ActivityDataSource,
  createActivityDataSource,
} from "../datasource/activity-datasource";

export async function getActivitySummary(
  _userId: string,
  ds: ActivityDataSource = createActivityDataSource(),
): Promise<ServiceResult<ActivityWidgetData>> {
  const result = await ds.getFeed(5);

  if (!result.success) return result;

  const items: ActivityWidgetItem[] = result.data.map((a) => ({
    id: a.id,
    action: a.action,
    source: a.source,
    timestamp: a.timestamp,
  }));

  return {
    success: true,
    data: { items },
  };
}
