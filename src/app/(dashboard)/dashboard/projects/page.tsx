import { Folders, PlayCircle, Link, CalendarClock } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  active: "bg-chart-1",
  "on-hold": "bg-chart-3",
  completed: "bg-chart-2",
};

export default function ProjectsPage() {
  const active = MOCK_PROJECTS.filter((p) => p.status === "active").length;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Projects"
        description="Manage projects with timelines and deliverables."
        action={<Button>+ New Project</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Folders} label="Total Projects" value={MOCK_PROJECTS.length} />
        <StatsCard
          icon={PlayCircle}
          label="Active"
          value={active}
          trend={{ direction: "up", label: "On track" }}
        />
        <StatsCard icon={Link} label="Completed" value="1" />
        <StatsCard icon={CalendarClock} label="Next Deadline" value="Aug 30" />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">All Projects</h2>
        <div className="space-y-4">
          {MOCK_PROJECTS.map((project) => (
            <div key={project.id} className="border-border space-y-2 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">{project.description}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                    project.status === "active" && "bg-chart-1/10 text-chart-1",
                    project.status === "on-hold" && "bg-chart-3/10 text-chart-3",
                    project.status === "completed" && "bg-chart-2/10 text-chart-2",
                  )}
                >
                  {project.status}
                </span>
              </div>
              <ProgressBar value={project.progress} size="sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
