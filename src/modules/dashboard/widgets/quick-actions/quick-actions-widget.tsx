// QuickActionsWidget – presents shortcut actions for creating new items.
// This widget has no data slice (static UI), so it does not use WidgetState.

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QUICK_ACTION_ICON } from "@/modules/dashboard/constants";
import { Plus } from "lucide-react";

/**
 * QuickActionsWidget – renders a row of primary actions the user can take from
 * the dashboard. The design mirrors the mock implementation from Phase 5 but
 * now lives in a dedicated widget folder following the widget contract.
 */
export default function QuickActionsWidget() {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        size="sm"
        render={
          <Link href="/dashboard/tasks/create" className="flex items-center gap-1">
            <Plus className="size-4" /> New Task
          </Link>
        }
        nativeButton={false}
      >
        {/* The `render` prop already provides the content; button text is ignored */}
      </Button>
      <Button
        variant="outline"
        size="sm"
        render={
          <Link href="/dashboard/habits/create" className="flex items-center gap-1">
            <Plus className="size-4" /> New Habit
          </Link>
        }
        nativeButton={false}
      />
      <Button
        variant="outline"
        size="sm"
        render={
          <Link href="/dashboard/notes/create" className="flex items-center gap-1">
            <Plus className="size-4" /> New Note
          </Link>
        }
        nativeButton={false}
      />
    </div>
  );
}
