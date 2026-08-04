import Link from "next/link";
import {
  CheckSquare,
  Repeat,
  Folders,
  Zap,
  ArrowRight,
  Palette,
  Check,
  BookOpen,
  FileText,
  Target,
  Code2,
  DollarSign,
  Briefcase,
  FileUser,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { StatsCard } from "@/components/shared/stats-card";
import { Button } from "@/components/ui/button";
import {
  MOCK_TASKS,
  MOCK_HABITS,
  MOCK_PROJECTS,
  MOCK_GOALS,
  MOCK_NOTES,
  MOCK_EVENTS,
  MOCK_EXPENSES,
  MOCK_ACTIVITIES,
  MOCK_DASHBOARD_STATS,
} from "@/lib/mock-data";
import { formatShortDate, splitDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

/**
 * Activity feed icon registry — maps the mock `iconName` strings to
 * Lucide icons at render time. Lives here because it is specific to the
 * dashboard timeline (the nav config maps module keys, not these names).
 */
const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  palette: Palette,
  check: Check,
  bookOpen: BookOpen,
  fileText: FileText,
  checkSquare: CheckSquare,
  target: Target,
  code2: Code2,
  dollarSign: DollarSign,
  briefcase: Briefcase,
  fileUser: FileUser,
};

const priorityDot: Record<string, string> = {
  high: "border-destructive bg-destructive/20",
  medium: "border-chart-3 bg-chart-3/20",
  low: "border-chart-1 bg-chart-1/20",
};

function ViewAll({ href }: { href: string }): React.ReactElement {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
    >
      View all <ArrowRight className="size-3" />
    </Link>
  );
}

export default function DashboardPage(): React.ReactElement {
  const pendingTasks = MOCK_TASKS.filter((t) => !t.completed).slice(0, 4);
  const habits = MOCK_HABITS.slice(0, 4);
  const activeProjects = MOCK_PROJECTS.filter((p) => p.status === "active").slice(0, 3);
  const events = MOCK_EVENTS.slice(0, 4).map((e) => ({
    ...e,
    ...splitDate(e.date),
  }));
  const expensesTotal = MOCK_EXPENSES.filter((e) => e.type === "expense").reduce(
    (s, e) => s + e.amount,
    0,
  );
  const incomeTotal = MOCK_EXPENSES.filter((e) => e.type === "income").reduce(
    (s, e) => s + e.amount,
    0,
  );
  const balance = incomeTotal - expensesTotal;

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Rupesh 👋</h1>
          <p className="text-muted-foreground text-sm">
            Here's what's happening across your life today.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/dashboard/analytics" />}
        >
          View Analytics
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={CheckSquare}
          label="Tasks Due Today"
          value={MOCK_DASHBOARD_STATS.tasksDueToday}
          trend={{ direction: "up", label: "2 pending" }}
        />
        <StatsCard
          icon={Repeat}
          label="Habits to Complete"
          value={MOCK_HABITS.filter((h) => !h.completedToday).length}
          trend={{ direction: "down", label: "Keep streak" }}
        />
        <StatsCard
          icon={Folders}
          label="Active Projects"
          value={MOCK_DASHBOARD_STATS.activeProjects}
          trend={{ direction: "up", label: "On track" }}
        />
        <StatsCard
          icon={Zap}
          label="Skills Improved"
          value={MOCK_DASHBOARD_STATS.skillsImproved}
          trend={{ direction: "up", label: "This week" }}
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Focus column */}
        <div className="space-y-4 lg:col-span-2">
          <Card variant="hover">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide">Today's Tasks</h2>
              <ViewAll href="/dashboard/tasks" />
            </div>
            <div className="space-y-1">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="hover:bg-muted/50 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
                >
                  <div
                    className={cn(
                      "size-2.5 shrink-0 rounded-full border-2",
                      priorityDot[task.priority],
                    )}
                  />
                  <span className="flex-1 text-sm">{task.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatShortDate(task.dueDate)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="hover">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide">Active Projects</h2>
              <ViewAll href="/dashboard/projects" />
            </div>
            <div className="space-y-3">
              {activeProjects.map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{p.name}</p>
                    <span className="text-muted-foreground text-xs">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} size="sm" />
                </div>
              ))}
            </div>
          </Card>

          <Card variant="hover">
            <h2 className="mb-4 text-sm font-semibold tracking-wide">Recent Activity</h2>
            <div className="space-y-1">
              {MOCK_ACTIVITIES.slice(0, 5).map((a) => {
                const Icon = ACTIVITY_ICONS[a.iconName] ?? CheckSquare;
                return (
                  <div
                    key={a.id}
                    className="hover:bg-muted/50 flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors"
                  >
                    <div className="bg-muted mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="text-muted-foreground size-3.5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">{a.action}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatShortDate(a.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          <Card variant="hover">
            <h2 className="mb-4 text-sm font-semibold tracking-wide">Habit Streaks</h2>
            <div className="grid grid-cols-2 gap-2">
              {habits.map((h) => (
                <div
                  key={h.id}
                  className={cn(
                    "border-border rounded-lg border p-3",
                    h.completedToday && "bg-chart-2/5",
                  )}
                >
                  <p className="line-clamp-1 text-xs font-medium">{h.name}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums">{h.streak}</p>
                  <p className="text-muted-foreground text-[10px]">day streak</p>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="hover">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-wide">Upcoming</h2>
              <ViewAll href="/dashboard/calendar" />
            </div>
            <div className="space-y-2">
              {events.map((e) => (
                <div key={e.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                  <div className="bg-muted flex size-10 shrink-0 flex-col items-center justify-center rounded-lg">
                    <span className="text-[9px] font-semibold tracking-wide uppercase">
                      {e.month}
                    </span>
                    <span className="text-base leading-none font-bold">{e.day}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">{e.title}</p>
                    <p className="text-muted-foreground text-xs">{e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="hover">
            <h2 className="mb-4 text-sm font-semibold tracking-wide">Quick Notes</h2>
            <div className="space-y-2">
              {MOCK_NOTES.slice(0, 2).map((n) => (
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

          <Card variant="hover">
            <h2 className="mb-4 text-sm font-semibold tracking-wide">This Month</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Income</span>
                <span className="text-chart-2 text-sm font-semibold tabular-nums">
                  +₹{incomeTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Expenses</span>
                <span className="text-destructive text-sm font-semibold tabular-nums">
                  −₹{expensesTotal.toLocaleString()}
                </span>
              </div>
              <div className="border-border flex items-center justify-between border-t pt-3">
                <span className="text-sm font-medium">Balance</span>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    balance >= 0 ? "text-chart-2" : "text-destructive",
                  )}
                >
                  ₹{balance.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Quarterly goals */}
      <Card variant="hover">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wide">Quarterly Goals</h2>
          <ViewAll href="/dashboard/goals" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_GOALS.map((g) => (
            <div key={g.id} className="space-y-2">
              <p className="line-clamp-1 text-sm font-medium">{g.title}</p>
              <ProgressBar value={g.progress} size="sm" />
              <p className="text-muted-foreground text-xs">
                {g.progress}% · {formatShortDate(g.deadline)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
