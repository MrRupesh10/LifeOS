import { Calendar, CalendarCheck, Clock, Plus, CalendarDays } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card } from "@/components/shared/card";
import { Button } from "@/components/ui/button";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeStyles: Record<string, string> = {
  meeting: "border-chart-1 bg-chart-1/5 text-chart-1",
  deadline: "border-destructive bg-destructive/5 text-destructive",
  personal: "border-chart-5 bg-chart-5/5 text-chart-5",
  health: "border-chart-2 bg-chart-2/5 text-chart-2",
};

export default function CalendarPage() {
  const upcoming = MOCK_EVENTS.length;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Calendar"
        description="Events, deadlines, and meetings — unified timeline."
        action={<Button>+ New Event</Button>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard icon={Calendar} label="Events This Week" value={upcoming} />
        <StatsCard icon={Clock} label="Next Event" value="Today 14:00" />
        <StatsCard
          icon={CalendarDays}
          label="Busy Day"
          value="Mon"
          trend={{ direction: "up", label: "3 events" }}
        />
      </div>

      <Card variant="hover">
        <h2 className="mb-4 text-sm font-semibold tracking-wide">Upcoming Events</h2>
        <div className="space-y-1.5">
          {MOCK_EVENTS.map((event) => (
            <div
              key={event.id}
              className="hover:bg-muted/50 flex items-center gap-4 rounded-lg px-3 py-2.5 transition-colors"
            >
              <div
                className={cn(
                  "flex size-2.5 shrink-0 rounded-full border-2",
                  typeStyles[event.type]?.split(" ")[0],
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-muted-foreground text-xs">
                  {event.date} · {event.time}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  typeStyles[event.type],
                )}
              >
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
