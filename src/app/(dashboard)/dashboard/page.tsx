// Dashboard Page — thin composition layer.
//
// The dashboard never owns business logic. It calls a single aggregator
// (`getDashboardSnapshot`), handles the top-level failure, and composes the
// existing widgets — each receiving exactly its own `WidgetState` slice from
// the snapshot. No mock data, no filtering, no inline rendering here.

import { getDashboardSnapshot } from "@/modules/dashboard/services/dashboard-service";
import WelcomeHeader from "@/modules/dashboard/components/welcome-header";
import StatsRow from "@/modules/dashboard/components/stats-row";
import TodaysTasksWidget from "@/modules/dashboard/components/todays-tasks-widget";
import HabitStreaksWidget from "@/modules/dashboard/components/habit-streaks-widget";
import ActiveProjectsWidget from "@/modules/dashboard/components/active-projects-widget";
import UpcomingEventsWidget from "@/modules/dashboard/components/upcoming-events-widget";
import QuickNotesWidget from "@/modules/dashboard/components/quick-notes-widget";
import ThisMonthWidget from "@/modules/dashboard/components/this-month-widget";
import QuarterlyGoalsWidget from "@/modules/dashboard/components/quarterly-goals-widget";
import RecentActivityWidget from "@/modules/dashboard/components/recent-activity-widget";
import QuickActionsWidget from "@/modules/dashboard/widgets/quick-actions/quick-actions-widget";

export default async function DashboardPage() {
  const result = await getDashboardSnapshot();

  if (!result.success) {
    return <div className="text-destructive p-4">Failed to load dashboard: {result.message}</div>;
  }

  const snapshot = result.data;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <WelcomeHeader state={snapshot.welcome} />
      <StatsRow state={snapshot.stats} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <TodaysTasksWidget state={snapshot.tasks} />
          <ActiveProjectsWidget state={snapshot.projects} />
          <RecentActivityWidget state={snapshot.activity} />
        </div>
        <div className="space-y-4">
          <HabitStreaksWidget state={snapshot.habits} />
          <UpcomingEventsWidget state={snapshot.calendar} />
          <QuickNotesWidget state={snapshot.notes} />
          <ThisMonthWidget state={snapshot.expenses} />
        </div>
      </div>

      <QuarterlyGoalsWidget state={snapshot.goals} />
      <QuickActionsWidget />
    </div>
  );
}
