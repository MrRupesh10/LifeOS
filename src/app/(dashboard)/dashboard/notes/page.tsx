import { FileText, Tag, Search } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { MOCK_NOTES } from "@/lib/mock-data";

export default function NotesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Notes"
        description="Your second brain — capture, link, and rediscover ideas."
        action={<Button>+ New Note</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard icon={FileText} label="Total Notes" value={MOCK_NOTES.length} />
        <StatsCard icon={Tag} label="Tags" value="7" />
        <StatsCard icon={Search} label="Updated" value="Today" />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Recent Notes</h2>
        <div className="space-y-1.5">
          {MOCK_NOTES.map((note) => (
            <div
              key={note.id}
              className="hover:bg-muted/50 flex items-start justify-between gap-4 rounded-lg px-3 py-3 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{note.title}</p>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{note.excerpt}</p>
                <div className="mt-2 flex gap-1.5">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-muted text-muted-foreground inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-muted-foreground shrink-0 text-xs">{note.updatedAt}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
