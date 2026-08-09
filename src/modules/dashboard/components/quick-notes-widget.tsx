// QuickNotesWidget – pure presentational component
// Receives a WidgetState<NoteWidgetData> and renders the recent notes grid.
// Loading, Empty, and Error states are defined inline as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type NoteWidgetData, type NoteWidgetItem } from "@/modules/notes/types";
import { Card } from "@/components/shared/card";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------------------
// Internal state components – kept minimal and local per guidelines
// -----------------------------------------------------------------------------
function Loading() {
  // Two placeholder note cards with animate‑pulse styling
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="border-border rounded-lg border p-3">
          <div className="bg-muted mb-1 h-4 w-32 rounded" />
          <div className="bg-muted mb-2 h-3 w-48 rounded" />
          <div className="flex gap-1">
            <div className="bg-muted h-4 w-12 rounded" />
            <div className="bg-muted h-4 w-12 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  // No recent notes – friendly placeholder
  return <p className="text-muted-foreground py-2 text-center text-sm">No recent notes.</p>;
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-3">
      <p className="font-medium">Failed to load notes</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

/**
 * QuickNotesWidget – renders a small list of recent notes.
 *
 * The widget receives a {@link WidgetState}<NoteWidgetData> prop. All business
 * logic (selecting recent notes, truncating excerpts) is performed upstream in
 * the service layer; this component only formats and displays the data.
 */
export default function QuickNotesWidget({ state }: { state: WidgetState<NoteWidgetData> }) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  const data = state.data;
  if (!data || data.recent.length === 0) return <Empty />;

  return (
    <Card variant="hover">
      <h2 className="mb-4 text-sm font-semibold tracking-wide">Quick Notes</h2>
      <div className="space-y-2">
        {data.recent.map((n: NoteWidgetItem) => (
          <div key={n.id} className="border-border rounded-lg border p-3">
            <p className="line-clamp-1 text-sm font-medium">{n.title}</p>
            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">{n.excerpt}</p>
            <div className="mt-2 flex gap-1">
              {n.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="bg-muted text-muted-foreground inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
