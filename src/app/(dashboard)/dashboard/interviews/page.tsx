import { Briefcase, Clock, Building2, CheckCircle2, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { MOCK_INTERVIEWS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  upcoming: "border-chart-1 bg-chart-1/10 text-chart-1",
  completed: "border-chart-2 bg-chart-2/10 text-chart-2",
  rejected: "border-destructive bg-destructive/10 text-destructive",
  offer: "border-chart-2 bg-chart-2/10 text-chart-2",
};

export default function InterviewsPage() {
  const upcoming = MOCK_INTERVIEWS.filter((i) => i.status === "upcoming").length;
  const completed = MOCK_INTERVIEWS.filter((i) => i.status === "completed").length;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Interviews"
        description="Track interview prep with company notes and confidence building."
        action={<Button>+ Add Interview</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Briefcase} label="Total" value={MOCK_INTERVIEWS.length} />
        <StatsCard
          icon={Clock}
          label="Upcoming"
          value={upcoming}
          trend={{ direction: "up", label: "Be prepared" }}
        />
        <StatsCard icon={Building2} label="Companies" value="3" />
        <StatsCard icon={CheckCircle2} label="Completed" value={completed} />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Interview Pipeline</h2>
        <div className="space-y-2">
          {MOCK_INTERVIEWS.map((interview) => (
            <div
              key={interview.id}
              className="border-border flex items-start gap-4 rounded-lg border p-4"
            >
              <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                {interview.company.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{interview.company}</p>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                      statusStyles[interview.status],
                    )}
                  >
                    {interview.status}
                  </span>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {interview.role} · {interview.round}
                </p>
                <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                  <Calendar className="size-3" />
                  {interview.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
