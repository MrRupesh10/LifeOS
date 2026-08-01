import { CheckSquare, ListTodo, Clock, AlertTriangle, Square } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { MOCK_TASKS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function TasksPage() {
  const pending = MOCK_TASKS.filter((t) => !t.completed);
  const completed = MOCK_TASKS.filter((t) => t.completed);
  const overdue = MOCK_TASKS.filter((t) => !t.completed && t.dueDate < "2026-07-31");

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Tasks"
        description="Capture, prioritize, and complete — one task at a time."
        action={<Button>+ New Task</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Square} label="Total Tasks" value={MOCK_TASKS.length} />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={pending.length}
          trend={{ direction: "up", label: "2 due today" }}
        />
        <StatsCard icon={CheckSquare} label="Completed" value={completed.length} />
        <StatsCard
          icon={AlertTriangle}
          label="Overdue"
          value={overdue.length}
          trend={{ direction: "down", label: "Needs attention" }}
        />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-tight">Recent Tasks</h2>
        <div className="space-y-1">
          {MOCK_TASKS.slice(0, 4).map((task) => (
            <div
              key={task.id}
              className="hover:bg-muted/50 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
            >
              <div
                className={cn(
                  "size-2.5 rounded-full border-2",
                  task.priority === "high" && "border-destructive bg-destructive/20",
                  task.priority === "medium" && "border-chart-3 bg-chart-3/20",
                  task.priority === "low" && "border-chart-1 bg-chart-1/20",
                  task.completed && "border-chart-2 bg-chart-2/20",
                )}
              />
              <span
                className={cn(
                  "flex-1 text-sm",
                  task.completed && "text-muted-foreground line-through",
                )}
              >
                {task.title}
              </span>
              <span className="text-muted-foreground text-xs">{task.dueDate}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
