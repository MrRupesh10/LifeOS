import type { ReactElement } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/shared/fade-in";

export function CtaSection(): ReactElement {
  return (
    <section className="py-24 sm:py-28">
      <Container variant="narrow">
        <FadeIn>
          <div className="border-border bg-card relative overflow-hidden rounded-3xl border px-6 py-16 text-center shadow-sm sm:px-12">
            <div className="from-chart-1/10 to-chart-4/10 pointer-events-none absolute inset-0 bg-gradient-to-br" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Start organizing your life
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-md text-lg">
                Everything you track, in one calm place. No setup, no friction — just open and go.
              </p>
              <div className="mt-8 flex justify-center">
                <Button size="lg" nativeButton={false} render={<Link href="/dashboard" />}>
                  Open Dashboard <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
