"use client";

import { siteConfig } from "@/config/site";
import React from "react";

/**
 * Application footer — shown at the bottom of every dashboard page.
 *
 * Phase 1 (M8): Static copyright line only.
 * Future: status bar (online/offline, last sync, build version).
 */
export function Footer() {
  const [year, setYear] = React.useState<number>(new Date().getFullYear());

  React.useEffect(() => {
    // Ensure the year matches the client time on hydration
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background border-t px-6 py-3 text-center text-xs">
      <p className="text-muted-foreground">
        &copy; {year} {siteConfig.name}. Built with Next.js.
      </p>
    </footer>
  );
}
