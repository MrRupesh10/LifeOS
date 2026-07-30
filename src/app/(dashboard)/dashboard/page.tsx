import { siteConfig } from "@/config/site";

/**
 * Dashboard home page — first page after login.
 *
 * Phase 1 (M8): Minimal placeholder with greeting and phase badge.
 * Later phases: productivity overview widgets, today's focus,
 * upcoming tasks, streak summary, AI daily brief.
 */
export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to {siteConfig.name}. Your personal operating system.
        </p>
      </div>

      {/* Placeholder grid — real widgets come later */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted/50 h-32 rounded-lg border border-dashed p-4">
          <p className="text-muted-foreground text-sm">No tasks due today</p>
        </div>
        <div className="bg-muted/50 h-32 rounded-lg border border-dashed p-4">
          <p className="text-muted-foreground text-sm">No habits tracked yet</p>
        </div>
        <div className="bg-muted/50 h-32 rounded-lg border border-dashed p-4">
          <p className="text-muted-foreground text-sm">No journal entries</p>
        </div>
      </div>
    </div>
  );
}
