import type { ReactElement } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, TrendingUp, ArrowRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/shared/fade-in";
import { MOCK_ANALYTICS, MOCK_SKILLS } from "@/lib/mock-data";

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}): ReactElement {
  return (
    <div className="bg-muted/40 border-border rounded-lg border p-3">
      <Icon className="text-muted-foreground size-4" strokeWidth={1.5} />
      <p className="mt-2 text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-muted-foreground text-[10px]">{label}</p>
    </div>
  );
}

export function PreviewSection(): ReactElement {
  const weekly = MOCK_ANALYTICS.weeklyOverview;
  const maxTasks = Math.max(...weekly.map((w) => w.tasksDone));

  return (
    <section className="py-24 sm:py-28">
      <Container variant="wide">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-chart-1 text-sm font-semibold tracking-widest uppercase">Preview</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            One pane of glass for your life
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Built from real components — no screenshots. This is the actual UI, just a glance of it.
          </p>
        </FadeIn>

        <FadeIn className="mt-14">
          <div className="bg-card border-border mx-auto max-w-4xl overflow-hidden rounded-2xl border shadow-xl shadow-black/5 dark:shadow-black/30">
            {/* Window chrome */}
            <div className="bg-muted/50 border-border flex items-center gap-2 border-b px-4 py-3">
              <span className="bg-destructive/60 size-3 rounded-full" />
              <span className="bg-chart-3/70 size-3 rounded-full" />
              <span className="bg-chart-2/70 size-3 rounded-full" />
              <div className="bg-background text-muted-foreground ml-3 flex h-6 max-w-xs flex-1 items-center rounded-md px-3 text-xs">
                lifeos.app/dashboard
              </div>
            </div>

            {/* Mock dashboard body */}
            <div className="space-y-4 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Today's Focus</p>
                  <p className="text-muted-foreground text-xs">Friday, July 31</p>
                </div>
                <span className="bg-chart-2/10 text-chart-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                  <CheckCircle2 className="size-3" /> 3 of 5 done
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <MiniStat icon={TrendingUp} label="Productivity" value="78%" />
                <MiniStat icon={Clock} label="Focus time" value="12.6h" />
                <MiniStat icon={CheckCircle2} label="Tasks" value="42" />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card variant="default">
                  <p className="text-xs font-semibold tracking-wide">Top Skills</p>
                  <div className="mt-3 space-y-3">
                    {MOCK_SKILLS.slice(0, 4).map((s) => (
                      <div key={s.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-muted-foreground">{s.proficiency}%</span>
                        </div>
                        <ProgressBar value={s.proficiency} size="sm" />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="default">
                  <p className="text-xs font-semibold tracking-wide">This Week</p>
                  <div className="mt-3 flex h-32 items-end justify-between gap-2">
                    {weekly.map((w) => (
                      <div
                        key={w.day}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                      >
                        <div
                          className="bg-primary/70 hover:bg-primary w-full rounded-md transition-colors"
                          style={{ height: `${Math.round((w.tasksDone / maxTasks) * 104)}px` }}
                        />
                        <span className="text-muted-foreground text-[10px]">{w.day}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
            >
              Explore the live dashboard <ArrowRight className="size-4" />
            </Link>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
