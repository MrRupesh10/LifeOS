import { Target, Crosshair, Zap, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { MOCK_GOALS } from "@/lib/mock-data";

export default function GoalsPage() {
  const avgProgress = Math.round(
    MOCK_GOALS.reduce((sum, g) => sum + g.progress, 0) / MOCK_GOALS.length,
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Goals"
        description="OKR-inspired goal tracking — break ambitions into measurable results."
        action={<Button>+ New Goal</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Target} label="Total Goals" value={MOCK_GOALS.length} />
        <StatsCard icon={Zap} label="Average Progress" value={`${avgProgress}%`} />
        <StatsCard
          icon={Crosshair}
          label="On Track"
          value="3"
          trend={{ direction: "up", label: "Good progress" }}
        />
        <StatsCard icon={Calendar} label="Next Deadline" value="Sep 1" />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Quarter Goals</h2>
        <div className="space-y-4">
          {MOCK_GOALS.map((goal) => (
            <div key={goal.id} className="border-border space-y-3 rounded-lg border p-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{goal.title}</p>
                  <span className="text-muted-foreground text-xs">Due {goal.deadline}</span>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">{goal.description}</p>
              </div>
              <ProgressBar
                value={goal.progress}
                label={`${goal.progress}/${goal.target} ${goal.unit}`}
                size="sm"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
