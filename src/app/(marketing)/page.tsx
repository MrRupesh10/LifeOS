import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

/**
 * Landing page — the root URL (/).
 *
 * Lives in the (marketing) route group, which has a minimal
 * layout (no sidebar, no app chrome). This is the public-facing
 * entry point before authentication.
 *
 * Phase 1: Static placeholder. Later phases: feature overview,
 * sign-in CTA, testimonials, etc.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold tracking-tight">{siteConfig.name}</h1>
      <p className="text-muted-foreground mt-4 text-lg">{siteConfig.tagline}</p>
      <p className="text-muted-foreground mt-2 text-sm">Phase 1 — Foundation</p>
      <div className="mt-8 flex gap-3">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </main>
  );
}
