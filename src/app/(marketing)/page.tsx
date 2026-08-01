import type { ReactElement } from "react";
import { Hero } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PreviewSection } from "@/components/landing/preview-section";
import { Testimonials } from "@/components/landing/testimonials";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { CtaSection } from "@/components/landing/cta-section";
import { SiteFooter } from "@/components/landing/site-footer";

/**
 * Landing page — the public entry point at /.
 *
 * Lives in the (marketing) route group (no app chrome). Order follows
 * the Apple × Linear narrative: hook (hero) → breadth (features) →
 * method (how it works) → proof (preview + testimonials) → trust
 * (roadmap) → action (CTA) → footer. No authentication in this phase.
 */
export default function HomePage(): ReactElement {
  return (
    <main>
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <PreviewSection />
      <Testimonials />
      <RoadmapSection />
      <CtaSection />
      <SiteFooter />
    </main>
  );
}
