import type { ReactElement } from "react";
import { Check, Loader, Circle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";
import { MOCK_ROADMAP } from "@/lib/mock-data";

const STATUS_META: Record<
  "completed" | "in-progress" | "upcoming",
  { icon: typeof Check; className: string; label: string }
> = {
  completed: {
    icon: Check,
    className: "border-chart-2/40 bg-chart-2/10 text-chart-2",
    label: "Complete",
  },
  "in-progress": {
    icon: Loader,
    className: "border-chart-1/40 bg-chart-1/10 text-chart-1",
    label: "In progress",
  },
  upcoming: {
    icon: Circle,
    className: "border-border bg-muted text-muted-foreground",
    label: "Upcoming",
  },
};

export function RoadmapSection(): ReactElement {
  return (
    <section className="py-24 sm:py-28">
      <Container variant="default">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-chart-1 text-sm font-semibold tracking-widest uppercase">Roadmap</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Built in the open
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Every phase is shipped before the next begins. No half-built features.
          </p>
        </FadeIn>

        <div className="relative mx-auto mt-16 max-w-2xl">
          {/* Timeline spine */}
          <div className="border-border absolute top-2 bottom-2 left-[19px] w-px" />

          {MOCK_ROADMAP.map((phase) => {
            const meta = STATUS_META[phase.status];
            const StatusIcon = meta.icon;
            return (
              <FadeIn key={phase.phase} className="relative pb-8 last:pb-0">
                <div className="flex gap-5">
                  <div
                    className={cn(
                      "bg-background relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border",
                      meta.className,
                    )}
                  >
                    <StatusIcon
                      className="size-4"
                      strokeWidth={phase.status === "upcoming" ? 1.5 : 2}
                    />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs font-semibold tracking-widest">
                        {phase.phase}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                          meta.className,
                        )}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold">{phase.title}</h3>
                    <ul className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {phase.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
