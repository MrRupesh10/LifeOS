import { BarChart3, TrendingUp, Clock, Zap } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { MOCK_ANALYTICS } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const stats = MOCK_ANALYTICS;
  const weeklyTotal = stats.weeklyOverview.reduce((s, d) => s + d.tasksDone, 0);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Analytics"
        description="Productivity overview — track your progress over time."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Zap}
          label="Productivity Score"
          value={`${stats.productivityScore}%`}
          trend={{ direction: "up", label: "+5% vs last week" }}
        />
        <StatsCard icon={BarChart3} label="Tasks Completed" value={stats.tasksCompleted} />
        <StatsCard icon={TrendingUp} label="Focus Hours" value={`${weeklyTotal}`} />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Weekly Overview</h2>
      </Card>
    </div>
  );
}
