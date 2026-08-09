/**
 * Projects module types — production domain model.
 */

// ─── Core entity ──────────────────────────────────────────────────

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number; // 0–100
  category: ProjectCategory;
  color: string | null;
  deadline: string | null; // ISO date
  completedAt: string | null;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "active" | "on_hold" | "completed";

export type ProjectCategory = "personal" | "work" | "learning" | "health" | "finance" | "other";

// ─── Widget data slice ────────────────────────────────────────────

export interface ProjectWidgetData {
  /** Active projects sorted by progress descending (max 3 on dashboard). */
  active: { id: string; name: string; progress: number; status: ProjectStatus }[];
}
