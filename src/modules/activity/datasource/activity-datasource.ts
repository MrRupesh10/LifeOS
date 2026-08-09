/**
 * ActivityDataSource — data access interface for the activity feed.
 */

import { type ServiceResult } from "@/lib/result";
import { type ActivityEntry, type ActivitySource } from "../types";
import { MOCK_ACTIVITIES, type ActivityItem } from "@/lib/mock-data";

export interface ActivityDataSource {
  getFeed(limit: number): Promise<ServiceResult<ActivityEntry[]>>;
}

/** Map mock iconName strings to ActivitySource values. */
const ICON_TO_SOURCE: Record<string, ActivitySource> = {
  check: "tasks",
  checkSquare: "tasks",
  palette: "projects",
  code2: "projects",
  target: "goals",
  fileText: "notes",
  bookOpen: "journal",
  briefcase: "projects",
  dollarSign: "expenses",
};

function toDomain(mock: ActivityItem): ActivityEntry {
  return {
    id: mock.id,
    userId: "current-user",
    action: mock.action,
    source: ICON_TO_SOURCE[mock.iconName] ?? "tasks",
    sourceEntityId: null,
    timestamp: mock.timestamp,
    createdAt: "2026-07-31T00:00:00.000Z",
  };
}

class MockActivityDataSource implements ActivityDataSource {
  async getFeed(limit: number): Promise<ServiceResult<ActivityEntry[]>> {
    return { success: true, data: MOCK_ACTIVITIES.slice(0, limit).map(toDomain) };
  }
}

export const createActivityDataSource = (): ActivityDataSource => new MockActivityDataSource();
