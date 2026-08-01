import { FileUser, Briefcase, Languages, Award, GraduationCap, FolderGit2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Button } from "@/components/ui/button";
import { MOCK_RESUME_SECTIONS } from "@/lib/mock-data";

export default function ResumePage() {
  const avgCompletion = Math.round(
    MOCK_RESUME_SECTIONS.reduce((sum, s) => sum + s.completion, 0) / MOCK_RESUME_SECTIONS.length,
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Resume"
        description="Build your resume incrementally — section by section."
        action={<Button>Edit Resume</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={FileUser} label="Total Sections" value={MOCK_RESUME_SECTIONS.length} />
        <StatsCard icon={Award} label="Avg. Completion" value={`${avgCompletion}%`} />
        <StatsCard icon={GraduationCap} label="Complete" value="2" />
        <StatsCard icon={FolderGit2} label="Last Updated" value="Jul 28" />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Resume Sections</h2>
        <div className="space-y-3">
          {MOCK_RESUME_SECTIONS.map((section) => (
            <div key={section.name} className="border-border space-y-2 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{section.name}</p>
                <span className="text-muted-foreground text-xs">Updated {section.lastUpdated}</span>
              </div>
              <ProgressBar value={section.completion} size="sm" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
