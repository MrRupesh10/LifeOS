import type { ReactElement } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Repeat,
  BookOpen,
  FileText,
  Folders,
  Target,
  Code2,
  Calendar,
  FileUser,
  Briefcase,
  Receipt,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/shared/card";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/shared/fade-in";
import { MOCK_FEATURES } from "@/lib/mock-data";

/** Maps mock `iconName` strings to Lucide icons for the feature grid. */
const FEATURE_ICONS: Record<string, LucideIcon> = {
  checkSquare: CheckSquare,
  repeat: Repeat,
  bookOpen: BookOpen,
  fileText: FileText,
  folders: Folders,
  target: Target,
  code2: Code2,
  calendar: Calendar,
  fileUser: FileUser,
  briefcase: Briefcase,
  receipt: Receipt,
};

export function FeaturesSection(): ReactElement {
  return (
    <section className="py-24 sm:py-28">
      <Container variant="wide">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-chart-1 text-sm font-semibold tracking-widest uppercase">Features</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything in one place
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Eleven independent modules that share one shell. Add what you need, ignore what you
            don't.
          </p>
        </FadeIn>

        <FadeIn className="mt-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_FEATURES.map((feature) => {
              const Icon = FEATURE_ICONS[feature.iconName] ?? FileText;
              return (
                <Link key={feature.title} href={feature.href} className="group block h-full">
                  <Card variant="hover" className="h-full">
                    <div className="bg-muted flex size-11 items-center justify-center rounded-xl">
                      <Icon className="text-foreground size-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <span className="text-muted-foreground group-hover:text-foreground mt-4 inline-flex items-center gap-1 text-xs transition-colors">
                      Open
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
