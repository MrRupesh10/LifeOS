// RecentActivityWidget – pure presentational component
// Receives a WidgetState<ActivityWidgetData> and renders the recent activity feed.
// Loading, Empty, and Error states are defined inline as tiny components.

import { type WidgetState } from "@/modules/dashboard/types";
import { type ActivityWidgetData, type ActivityWidgetItem } from "@/modules/activity/types";
import { Card } from "@/components/shared/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  CheckSquare,
  Repeat,
  Folders,
  Zap,
  Palette,
  BookOpen,
  FileText,
  Target,
  Code2,
  DollarSign,
  Briefcase,
  FileUser,
} from "lucide-react";
import { formatShortDate } from "@/lib/format-date";

// -----------------------------------------------------------------------------
// Internal state components – minimal, kept within this file per guidelines
// -----------------------------------------------------------------------------
function Loading() {
  // Five placeholder rows with animate‑pulse styling
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-lg" />
          <div className="flex-1 space-y-1">
            <div className="bg-muted h-4 w-40 rounded" />
            <div className="bg-muted h-3 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty() {
  // No recent activity – friendly placeholder
  return <p className="text-muted-foreground py-2 text-center text-sm">No recent activity.</p>;
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 text-destructive rounded border p-3">
      <p className="font-medium">Failed to load activity</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

// Icon registry – maps activity source to a Lucide icon (mirrors page implementation)
const ACTIVITY_ICONS = {
  tasks: CheckSquare,
  habits: Repeat,
  projects: Folders,
  goals: Zap,
  journal: Palette,
  notes: BookOpen,
  calendar: FileText,
  expenses: Target,
  settings: Code2,
  auth: DollarSign,
};

/** RecentActivityWidget – renders a list of recent activity items. */
export default function RecentActivityWidget({
  state,
}: {
  state: WidgetState<ActivityWidgetData>;
}) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;

  const data = state.data;
  if (!data || data.items.length === 0) return <Empty />;

  return (
    <Card variant="hover">
      <h2 className="mb-4 text-sm font-semibold tracking-wide">Recent Activity</h2>
      <div className="space-y-2">
        {data.items.map((item: ActivityWidgetItem) => {
          const Icon = (ACTIVITY_ICONS as any)[item.source] ?? CheckSquare;
          return (
            <div
              key={item.id}
              className="hover:bg-muted/50 flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors"
            >
              <div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-lg">
                <Icon className="text-muted-foreground size-3.5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm">{item.action}</p>
                <p className="text-muted-foreground text-xs">{formatShortDate(item.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
