/**
 * ProjectService — business logic for the projects module.
 */

import { type ServiceResult } from "@/lib/result";
import { type ProjectWidgetData } from "../types";
import { type ProjectDataSource, createProjectDataSource } from "../datasource/project-datasource";

export async function getProjectSummary(
  _userId: string,
  ds: ProjectDataSource = createProjectDataSource(),
): Promise<ServiceResult<ProjectWidgetData>> {
  const result = await ds.getByStatus("active");

  if (!result.success) return result;

  const active = result.data
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      name: p.name,
      progress: p.progress,
      status: p.status,
    }));

  return {
    success: true,
    data: { active },
  };
}
