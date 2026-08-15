/**
 * Tasks page — pure server composition.
 *
 * This file holds NO business logic and imports NO mock data. It only:
 *   1. reads the authenticated session (auth boundary — `redirect` if absent),
 *   2. parses `filter`/`sort` out of `searchParams` (invalid → safe default),
 *   3. composes the shared header, the `<TaskFilterBar>` (M8), and the
 *      module's async `<TaskList>` under a `<Suspense>` boundary (loading
 *      fallback included).
 *
 * Filter/sort/today semantics live in the service (M4); the fetch and the
 * empty/error/success rendering live in `TaskList` (M6). The `<TaskFilterBar>`
 * (M8) also lives at this layer — it only writes query params, so the service
 * remains the sole owner of the logic.
 */
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { SectionHeader } from "@/components/shared/section-header";
import type { TaskFilter, TaskSort } from "@/modules/tasks/types";
import TaskList from "@/modules/tasks/components/task-list";
import { NewTaskDialog } from "@/modules/tasks/components/new-task-dialog";
import { TaskFilterBar } from "@/modules/tasks/components/task-filter-bar";

type SearchParams = Promise<{ filter?: string; sort?: string }>;

const VALID_FILTERS: readonly TaskFilter[] = ["all", "today", "upcoming", "completed"];
const VALID_SORTS: readonly TaskSort[] = ["dueDate", "priority", "createdAt"];

/** `filter` query param → a valid TaskFilter, else the safe default. */
function asFilter(value: string | undefined): TaskFilter {
  return (VALID_FILTERS as readonly string[]).includes(value ?? "") ? (value as TaskFilter) : "all";
}

/** `sort` query param → a valid TaskSort, else the safe default. */
function asSort(value: string | undefined): TaskSort {
  return (VALID_SORTS as readonly string[]).includes(value ?? "") ? (value as TaskSort) : "dueDate";
}

/** Loading fallback rendered inside the Suspense boundary. */
function ListSkeleton() {
  return (
    <div className="border-border/60 animate-pulse space-y-2 rounded-lg border p-4" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="bg-muted h-9 rounded-md" />
      ))}
    </div>
  );
}

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession();
  if (!session?.user.id) redirect("/login");

  const { filter: filterParam, sort: sortParam } = await searchParams;
  const filter = asFilter(filterParam);
  const sort = asSort(sortParam);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Tasks"
        description="Capture, prioritize, and complete — one task at a time."
        action={<NewTaskDialog />}
      />

      {/* M8 — writes filter/sort into the URL; the list below re-suspends. */}
      <TaskFilterBar filter={filter} sort={sort} />

      <Suspense fallback={<ListSkeleton />}>
        <TaskList userId={session.user.id} filter={filter} sort={sort} />
      </Suspense>
    </div>
  );
}
