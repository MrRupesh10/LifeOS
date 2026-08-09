/**
 * ProjectDataSource — data access interface for projects.
 */

import { type ServiceResult } from "@/lib/result";
import { type Project, type ProjectStatus, type ProjectCategory } from "../types";
import { MOCK_PROJECTS, type ProjectItem } from "@/lib/mock-data";

export interface ProjectDataSource {
  getAll(): Promise<ServiceResult<Project[]>>;
  getByStatus(status: ProjectStatus): Promise<ServiceResult<Project[]>>;
}

function toDomain(mock: ProjectItem): Project {
  return {
    id: mock.id,
    userId: "current-user",
    name: mock.name,
    description: mock.description,
    status: (mock.status === "on-hold" ? "on_hold" : mock.status) as ProjectStatus,
    progress: mock.progress,
    category: (mock.category ?? "other") as ProjectCategory,
    color: null,
    deadline: mock.deadline ?? null,
    completedAt: mock.status === "completed" ? "2026-07-31T00:00:00.000Z" : null,
    archived: false,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-31T00:00:00.000Z",
  };
}

class MockProjectDataSource implements ProjectDataSource {
  async getAll(): Promise<ServiceResult<Project[]>> {
    return { success: true, data: MOCK_PROJECTS.map(toDomain) };
  }
  async getByStatus(status: ProjectStatus): Promise<ServiceResult<Project[]>> {
    const statusMap: Record<ProjectStatus, string> = {
      active: "active",
      on_hold: "on-hold",
      completed: "completed",
    };
    return {
      success: true,
      data: MOCK_PROJECTS.filter((p) => p.status === statusMap[status]).map(toDomain),
    };
  }
}

export const createProjectDataSource = (): ProjectDataSource => new MockProjectDataSource();
