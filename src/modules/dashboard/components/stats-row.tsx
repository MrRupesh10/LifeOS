// StatsRow widget – pure presentational component
// Receives a WidgetState<DashboardStats> prop and renders four StatsCard components.
// Loading, empty, and error states are handled internally as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type DashboardStats } from "@/modules/dashboard/types";
import { StatsCard } from "@/components/shared/stats-card";
import { CheckSquare, Repeat, Folders, Zap } from "lucide-react";

function Loading() {
  // Four placeholder cards with animate‑pulse styling
  return (
    <div className="grid animate-pulse gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="border-border bg-muted flex items-center gap-3 rounded-xl border p-4"
        >
          <div className="bg-muted size-10 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="bg-muted h-3 w-20 rounded" />
            <div className="bg-muted h-5 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  // No stats – render a friendly placeholder message
  return (
    <div className="text-muted-foreground py-4 text-center text-sm">
      No dashboard statistics available.
    </div>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-4">
      <p className="font-medium">Error loading stats</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/** StatsRow widget */
export default function StatsRow({ state }: { state: WidgetState<DashboardStats> }) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  // Success – render the four StatsCard components
  const { tasksDueToday, habitsRemaining, activeProjects, categoriesEngaged } = state.data;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard icon={CheckSquare} label="Tasks Due Today" value={tasksDueToday} />
      <StatsCard icon={Repeat} label="Habits to Complete" value={habitsRemaining} />
      <StatsCard icon={Folders} label="Active Projects" value={activeProjects} />
      <StatsCard icon={Zap} label="Categories Engaged" value={categoriesEngaged} />
    </div>
  );
}
