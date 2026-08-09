import type { ReactElement } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { GithubIcon } from "@/components/landing/github-icon";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/container";

export function SiteFooter(): ReactElement {
  return (
    <footer className="border-border border-t">
      <Container variant="wide" className="py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-sm font-semibold">{siteConfig.name}</span>
            <span className="text-muted-foreground text-xs">v0.4.0 · {siteConfig.tagline}</span>
          </div>
          <nav className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
            >
              <GithubIcon className="size-4" /> GitHub
            </Link>
            <Link href="/design-system" className="hover:text-foreground transition-colors">
              Design System
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
          </nav>
          <p className="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
            Built with Next.js <Heart className="text-chart-3 size-3" fill="currentColor" />
          </p>
        </div>
      </Container>
    </footer>
  );
}
