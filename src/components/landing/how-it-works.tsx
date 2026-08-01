import type { ReactElement } from "react";
import { PenSquare, Layers, TrendingUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/shared/fade-in";

const STEPS = [
  {
    step: "01",
    title: "Capture",
    description:
      "Dump tasks, notes, journal entries, and expenses the moment they happen. Frictionless, always one shortcut away.",
    Icon: PenSquare,
  },
  {
    step: "02",
    title: "Organize",
    description:
      "Group into projects, goals, and skills. Tag, prioritize, and schedule so nothing slips through the cracks.",
    Icon: Layers,
  },
  {
    step: "03",
    title: "Grow",
    description:
      "Review streaks, analytics, and interview readiness. Reflect weekly and compound your progress over time.",
    Icon: TrendingUp,
  },
] as const;

export function HowItWorks(): ReactElement {
  return (
    <section className="py-24 sm:py-28">
      <Container variant="wide">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-chart-1 text-sm font-semibold tracking-widest uppercase">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Three steps to a calmer life
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Capture once, organize gently, and let compounding do the work.
          </p>
        </FadeIn>

        <div className="relative mt-16 grid gap-10 lg:grid-cols-3">
          {/* Connecting line — desktop only */}
          <div className="bg-border absolute top-8 right-0 left-0 hidden h-px lg:block" />

          {STEPS.map(({ step, title, description, Icon }) => (
            <FadeIn key={step} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="border-border bg-background flex size-16 items-center justify-center rounded-2xl border shadow-sm">
                  <Icon className="text-foreground size-7" strokeWidth={1.5} />
                </div>
                <span className="text-chart-1 mt-5 text-xs font-semibold tracking-widest">
                  STEP {step}
                </span>
                <h3 className="mt-1.5 text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
