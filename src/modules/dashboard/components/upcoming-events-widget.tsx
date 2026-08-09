// UpcomingEventsWidget – pure presentational component
// Receives a WidgetState<CalendarWidgetData> and renders the upcoming events grid.
// Loading, Empty, and Error states are defined inline as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type CalendarWidgetData, type CalendarWidgetEventItem } from "@/modules/calendar/types";
import { Card } from "@/components/shared/card";
import Link from "next/link";

// -----------------------------------------------------------------------------
// Internal state components – kept minimal and local per guidelines
// -----------------------------------------------------------------------------
function Loading() {
  // Four placeholder rows with animate‑pulse styling
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
            <div className="bg-muted h-3 w-6 rounded" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="bg-muted h-4 w-32 rounded" />
            <div className="bg-muted h-3 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  // No upcoming events – friendly placeholder
  return <p className="text-muted-foreground py-2 text-center text-sm">No upcoming events.</p>;
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-3">
      <p className="font-medium">Failed to load events</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * UpcomingEventsWidget – renders a list of upcoming calendar events.
 *
 * The widget receives a {@link WidgetState}<CalendarWidgetData> prop. All business
 * logic (sorting, date‑formatting) is performed upstream; this component only
 * displays the data.
 */
export default function UpcomingEventsWidget({
  state,
}: {
  state: WidgetState<CalendarWidgetData>;
}) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  const data = state.data;
  if (!data || data.upcoming.length === 0) return <Empty />;

  return (
    <Card variant="hover">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide">Upcoming</h2>
        <Link
          href="/dashboard/calendar"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {data.upcoming.map((ev: CalendarWidgetEventItem) => (
          <div key={ev.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
            <div className="bg-muted flex size-10 shrink-0 flex-col items-center justify-center rounded-lg">
              <span className="text-[9px] font-semibold tracking-wide uppercase">
                {new Date(ev.date).toLocaleString("default", { month: "short" })}
              </span>
              <span className="text-base font-bold">{new Date(ev.date).getDate()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium">{ev.title}</p>
              <p className="text-muted-foreground text-xs">{ev.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
