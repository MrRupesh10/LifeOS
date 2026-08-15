// TaskList — the Tasks page list (server-rendered composition).
//
// An async server component, the module's own presentation layer. It fetches
// via the Task SERVICE (never the page, never the datasource) and renders
// loading–, error–, empty– and success states. It stays a server component:
// the only client pieces are the interactive leaves — a `<TaskItem>` per row
// plus the "New Task" dialog in the page header. Filter/sort semantics live in
// the service (M4); the `<TaskFilterBar>` (M8) that drives them is a server
// component in the page — it only writes query params.
import { ListTodo } from "lucide-react";

import { type TaskFilter, type TaskSort } from "../types";
import { getTasks } from "../services/task-service";
import { Card } from "@/components/shared/card";
import { EmptyState } from "@/components/shared/empty-state";
import { TaskItem } from "./task-item";

interface TaskListProps {
  userId: string;
  filter: TaskFilter;
  sort: TaskSort;
}

const EMPTY_COPY: Record<TaskFilter, { headline: string; description: string }> = {
  all: { headline: "No tasks yet", description: "Capture your first task to get started." },
  today: {
    headline: "Nothing due today",
    description: "You're all caught up — enjoy the clear headspace.",
  },
  upcoming: {
    headline: "No upcoming tasks",
    description: "Tasks with a future due date will show up here.",
  },
  completed: {
    headline: "Nothing completed yet",
    description: "Tasks you complete will land here.",
  },
};

export default async function TaskList({ userId, filter, sort }: TaskListProps) {
  const result = await getTasks(userId, { filter, sort });

  // Error state — real ServiceResult message, never a mock fallback.
  if (!result.success) {
    return (
      <div className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-4 text-sm">
        <p className="font-medium">Failed to load tasks</p>
        <p className="mt-0.5">{result.message}</p>
      </div>
    );
  }

  const tasks = result.data;

  // Empty state — filter-aware copy; the create CTA lives in the page header.
  if (tasks.length === 0) {
    const copy = EMPTY_COPY[filter];
    return <EmptyState icon={ListTodo} headline={copy.headline} description={copy.description} />;
  }

  // Success — one interactive client row per task.
  return (
    <Card variant="hover">
      <ul className="divide-border/60 divide-y">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </Card>
  );
}
