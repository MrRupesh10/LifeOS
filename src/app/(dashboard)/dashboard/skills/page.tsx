import { Code2, Zap, Clock, Target } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { MOCK_SKILLS, SKILL_CATEGORIES } from "@/lib/mock-data";

export default function SkillsPage() {
  const totalHours = MOCK_SKILLS.reduce((s, sk) => s + sk.hours, 0);
  const avgProficiency = Math.round(
    MOCK_SKILLS.reduce((s, sk) => s + sk.proficiency, 0) / MOCK_SKILLS.length,
  );
  const interviewReady = MOCK_SKILLS.filter((s) => s.interviewReady).length;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Skills"
        description="Track proficiency and interview readiness across technologies."
        action={<Button>+ Add Skill</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Code2} label="Total Skills" value={MOCK_SKILLS.length} />
        <StatsCard icon={Zap} label="Avg. Proficiency" value={`${avgProficiency}%`} />
        <StatsCard icon={Clock} label="Total Hours" value={`${totalHours}h`} />
        <StatsCard
          icon={Target}
          label="Interview Ready"
          value={`${interviewReady}/${MOCK_SKILLS.length}`}
        />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">All Skills</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MOCK_SKILLS.map((skill) => (
            <div key={skill.id} className="border-border rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">{skill.name}</p>
                <span className="text-muted-foreground text-xs">
                  {SKILL_CATEGORIES.find((c) => c.id === skill.category)?.label ?? skill.category}
                </span>
              </div>
              <ProgressBar value={skill.proficiency} size="sm" />
              <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
                <span>{skill.hours}h</span>
                <span>{skill.projects} projects</span>
                {skill.interviewReady && (
                  <span className="text-chart-2 font-medium">Interview Ready</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
