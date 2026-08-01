import { Repeat, Flame, CheckCircle2, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { MOCK_HABITS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function HabitsPage() {
  const completedToday = MOCK_HABITS.filter((h) => h.completedToday);
  const total = MOCK_HABITS.length;
  const bestStreak = Math.max(...MOCK_HABITS.map((h) => h.streak));

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Habits"
        description="Build consistency with visual streak tracking."
        action={<Button>+ New Habit</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Repeat} label="Total Habits" value={total} />
        <StatsCard
          icon={CheckCircle2}
          label="Done Today"
          value={`${completedToday.length}/${total}`}
          trend={{ direction: "up", label: `${completedToday.length} complete` }}
        />
        <StatsCard icon={Flame} label="Best Streak" value={`${bestStreak} days`} />
        <StatsCard
          icon={TrendingUp}
          label="Consistency"
          value={`${Math.round((completedToday.length / total) * 100)}%`}
        />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Today</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MOCK_HABITS.map((habit) => (
            <div
              key={habit.id}
              className="border-border flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="text-sm font-medium">{habit.name}</p>
                <p className="text-muted-foreground text-xs">
                  {habit.frequency} · {habit.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold tabular-nums">{habit.streak}</span>
                <span className="text-muted-foreground text-xs">days</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
