import { siteConfig } from "@/config/site";

/**
 * Application footer — shown at the bottom of every dashboard page.
 *
 * Phase 1 (M8): Static copyright line only.
 * Future: status bar (online/offline, last sync, build version).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t px-6 py-3 text-center text-xs">
      <p className="text-muted-foreground">
        &copy; {year} {siteConfig.name}. Built with Next.js.
      </p>
    </footer>
  );
}
