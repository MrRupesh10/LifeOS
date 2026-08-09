// ActiveProjectsWidget – pure presentational component
// Receives a WidgetState<ProjectWidgetData> and renders the active projects grid.
// Loading, Empty, and Error states are defined inline as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type ProjectWidgetData } from "@/modules/projects/types";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import Link from "next/link";

// -----------------------------------------------------------------------------
// Internal state components – kept minimal and local per guidelines
// -----------------------------------------------------------------------------
function Loading() {
  // Three placeholder rows with animate‑pulse styling
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="bg-muted h-4 w-32 rounded" />
          <div className="bg-muted h-3 w-48 rounded" />
        </div>
      ))}
    </div>
  );
}

function Empty() {
  // No active projects – friendly placeholder
  return (
    <p className="text-muted-foreground py-2 text-center text-sm">No active projects to display.</p>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-3">
      <p className="font-medium">Failed to load projects</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * ActiveProjectsWidget – renders a list of active projects with progress bars.
 *
 * The widget receives a {@link WidgetState}<ProjectWidgetData> prop. All business
 * logic (selecting top projects, sorting) is performed upstream in the service
 * layer; this component only formats and displays the data.
 */
export default function ActiveProjectsWidget({ state }: { state: WidgetState<ProjectWidgetData> }) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  const data = state.data;
  if (!data || data.active.length === 0) return <Empty />;

  return (
    <Card variant="hover">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Active Projects</h2>
        <Link
          href="/dashboard/projects"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {data.active.map((proj) => (
          <div key={proj.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{proj.name}</p>
              <span className="text-muted-foreground text-xs">{proj.progress}%</span>
            </div>
            <ProgressBar value={proj.progress} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
}
