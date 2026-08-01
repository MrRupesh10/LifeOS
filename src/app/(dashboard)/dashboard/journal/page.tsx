import { Calendar, PenSquare, Bell } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { MOCK_JOURNAL } from "@/lib/mock-data";

const moodEmoji: Record<string, string> = {
  great: "😊",
  good: "🙂",
  neutral: "😐",
  low: "😔",
};

export default function JournalPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Journal"
        description="Daily reflections with mood tracking."
        action={<Button>+ New Entry</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard icon={PenSquare} label="Entries" value={MOCK_JOURNAL.length} />
        <StatsCard
          icon={Calendar}
          label="Streak"
          value="5 days"
          trend={{ direction: "up", label: "Keep going" }}
        />
        <StatsCard icon={Bell} label="Last Entry" value="Today" />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Recent Entries</h2>
        <div className="space-y-2">
          {MOCK_JOURNAL.map((entry) => (
            <div
              key={entry.id}
              className="hover:bg-muted/50 flex items-start gap-4 rounded-lg px-3 py-3 transition-colors"
            >
              <span className="text-lg">{moodEmoji[entry.mood]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{entry.title}</p>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{entry.excerpt}</p>
              </div>
              <span className="text-muted-foreground shrink-0 text-xs">{entry.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
