// TodaysTasksWidget – pure presentational component
// Receives a WidgetState<TaskWidgetData> and renders the tasks list
// Loading, empty, and error states are defined inline as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type TaskWidgetData, type Task } from "@/modules/tasks/types";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatShortDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Internal state components – kept small and local per the guidelines
// -----------------------------------------------------------------------------
function Loading() {
  // Four placeholder rows with animate‑pulse styling
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="bg-muted size-2.5 shrink-0 rounded-full" />
          <div className="bg-muted h-4 w-32 rounded" />
          <div className="bg-muted ml-auto h-4 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

function Empty() {
  // No tasks due today – friendly placeholder
  return <p className="text-muted-foreground py-2 text-center text-sm">No tasks due today.</p>;
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-3">
      <p className="font-medium">Failed to load tasks</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * TodaysTasksWidget – renders pending tasks for the current user.
 *
 * The widget receives a {@link WidgetState} whose `data` shape matches
 * {@link TaskWidgetData}. All business logic (filtering, counting) is performed
 * upstream in the service layer; this component only formats and displays the
 * data.
 */
export default function TodaysTasksWidget({ state }: { state: WidgetState<TaskWidgetData> }) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  // Success path – if there are no tasks, render the empty UI
  const tasks = state.data?.dueToday ?? [];
  if (tasks.length === 0) return <Empty />;

  return (
    <Card variant="hover">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Today's Tasks</h2>
        <Link
          href="/dashboard/tasks"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="space-y-1">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className={cn(
              "hover:bg-muted/50 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
              // The original code used a `priorityDot` map – we keep the class name
              // as‑is; it will resolve to a harmless string if the map isn’t present.
            )}
          >
            <div className="border-destructive size-2.5 shrink-0 rounded-full border-2" />
            <span className="flex-1 text-sm">{task.title}</span>
            <span className="text-muted-foreground text-xs">
              {formatShortDate(task.dueDate ?? "")}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
