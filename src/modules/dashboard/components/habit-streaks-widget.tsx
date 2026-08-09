// HabitStreaksWidget – pure presentational component
// Accepts a WidgetState<HabitWidgetData> and renders the habit streak grid.
// Loading, Empty, and Error states are defined inline as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type HabitWidgetData, type HabitWidgetItem } from "@/modules/habits/types";
import { Card } from "@/components/shared/card";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Internal state components – kept small and local per the guidelines
// -----------------------------------------------------------------------------
function Loading() {
  // Grid of 4 placeholder boxes with animate‑pulse styling
  return (
    <div className="grid animate-pulse grid-cols-2 gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border-border bg-muted rounded-lg border p-3">
          <div className="bg-muted mb-2 h-4 w-20 rounded" />
          <div className="bg-muted h-5 w-10 rounded" />
          <div className="bg-muted mt-1 h-3 w-12 rounded" />
        </div>
      ))}
    </div>
  );
}

function Empty() {
  // No habits to show – friendly placeholder
  return (
    <p className="text-muted-foreground py-2 text-center text-sm">No habit streaks to display.</p>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-3">
      <p className="font-medium">Failed to load habit streaks</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * HabitStreaksWidget – renders a compact grid of habit streaks.
 *
 * The widget receives a {@link WidgetState}<HabitWidgetData> prop. All business
 * logic (calculating streaks, filtering, etc.) occurs in the service layer; this
 * component only formats and displays the data.
 */
export default function HabitStreaksWidget({ state }: { state: WidgetState<HabitWidgetData> }) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  const data = state.data;
  // If there are no items, render the empty UI.
  if (!data || data.items.length === 0) return <Empty />;

  return (
    <Card variant="hover">
      <h2 className="mb-4 text-sm font-semibold tracking-wide">Habit Streaks</h2>
      <div className="grid grid-cols-2 gap-2">
        {data.items.map((item: HabitWidgetItem) => (
          <div
            key={item.id}
            className={cn(
              "border-border rounded-lg border p-3",
              item.completedToday && "bg-chart-2/5",
            )}
          >
            <p className="line-clamp-1 text-xs font-medium">{item.name}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{item.currentStreak}</p>
            <p className="text-muted-foreground text-[10px]">day streak</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
