import type { ReactElement } from "react";
import { Quote } from "lucide-react";
import { Card } from "@/components/shared/card";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/shared/fade-in";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";

export function Testimonials(): ReactElement {
  return (
    <section className="py-24 sm:py-28">
      <Container variant="wide">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-chart-1 text-sm font-semibold tracking-widest uppercase">
            From the community
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            A workspace people actually keep open
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TESTIMONIALS.map((t) => (
            <FadeIn key={t.id} className="h-full">
              <Card variant="glass" className="flex h-full flex-col">
                <Quote className="text-chart-1/40 size-8" strokeWidth={1.5} />
                <p className="text-foreground mt-4 text-base leading-relaxed">"{t.quote}"</p>
                <div className="mt-auto flex items-center gap-3 pt-6">
                  <div className="bg-muted text-foreground flex size-10 items-center justify-center rounded-full text-xs font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
