// QuarterlyGoalsWidget – pure presentational component
// Receives a WidgetState<GoalWidgetData> and renders the quarterly goals grid.
// Loading, Empty, and Error states are defined inline as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type GoalWidgetData, type GoalWidgetItem } from "@/modules/goals/types";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { formatShortDate } from "@/lib/format-date";
import Link from "next/link";

// -----------------------------------------------------------------------------
// Internal state components – minimal and local per guidelines
// -----------------------------------------------------------------------------
function Loading() {
  // Four placeholder goal cards with animate‑pulse styling
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="bg-muted h-4 w-32 rounded" />
          <div className="bg-muted h-3 w-48 rounded" />
          <div className="bg-muted h-3 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}

function Empty() {
  // No quarterly goals – friendly placeholder
  return (
    <p className="text-muted-foreground py-2 text-center text-sm">No quarterly goals to display.</p>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-3">
      <p className="font-medium">Failed to load goals</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * QuarterlyGoalsWidget – renders up to four quarterly goal cards.
 *
 * The widget receives a {@link WidgetState}<GoalWidgetData> prop. All business
 * logic (selecting quarterly items, computing progress) occurs upstream in the
 * service layer; this component only formats and displays the data.
 */
export default function QuarterlyGoalsWidget({ state }: { state: WidgetState<GoalWidgetData> }) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  const data = state.data;
  if (!data || data.items.length === 0) return <Empty />;

  return (
    <Card variant="hover">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Quarterly Goals</h2>
        <Link
          href="/dashboard/goals"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.items.map((g: GoalWidgetItem) => (
          <div key={g.id} className="space-y-2">
            <p className="line-clamp-1 text-sm font-medium">{g.title}</p>
            <ProgressBar value={g.progress} size="sm" />
            <p className="text-muted-foreground text-xs">
              {g.progress}%{g.deadline ? ` · ${formatShortDate(g.deadline)}` : ""}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
