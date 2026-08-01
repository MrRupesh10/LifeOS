"use client";

import { Fragment, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dynamic breadcrumb — reads the current URL pathname and builds
 * a trail of links with the last segment as the active page.
 *
 * SEO-friendly:
 *   - Wrapped in a <nav aria-label="Breadcrumb">
 *   - Ordered list for screen readers
 *   - aria-current="page" on the last item
 *
 * Example traversals:
 *   /dashboard/tasks          → Home > Tasks
 *   /dashboard/projects       → Home > Projects
 *   /design-system            → Home > Design System
 */

/** Readable label overrides for URL segments. */
const LABEL_OVERRIDES: Record<string, string> = {
  dashboard: "Dashboard",
  "design-system": "Design System",
};

/** Paths that should NOT appear in the breadcrumb trail. */
const HIDDEN_SEGMENTS = new Set(["dashboard"]);

/** Converts a URL segment to a human-readable label. */
function segmentToLabel(segment: string): string {
  if (LABEL_OVERRIDES[segment]) return LABEL_OVERRIDES[segment];
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type BreadcrumbItem = {
  label: string;
  href: string;
  isLast: boolean;
};

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();

  const items: BreadcrumbItem[] = useMemo(() => {
    if (!pathname || pathname === "/") return [];

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [];

    // Filter out hidden segments (e.g. "dashboard" in /dashboard/tasks)
    const visibleIndexes = segments
      .map((s, i) => (HIDDEN_SEGMENTS.has(s) ? -1 : i))
      .filter((i) => i !== -1);

    if (visibleIndexes.length === 0) {
      const last = segments[segments.length - 1]!;
      return [{ label: segmentToLabel(last), href: pathname, isLast: true }];
    }

    return visibleIndexes.map((si, idx) => {
      const isLast = idx === visibleIndexes.length - 1;
      const href = "/" + segments.slice(0, si + 1).join("/");
      return {
        label: segmentToLabel(segments[si]!),
        href,
        isLast,
      };
    });
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1 text-sm">
        {/* Home icon link */}
        <li>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground rounded-sm transition-colors duration-[--duration-fast]"
            aria-label="Dashboard Home"
          >
            <Home className="size-3.5" />
          </Link>
        </li>

        {items.map((item) => (
          <Fragment key={item.href}>
            <li aria-hidden="true">
              <ChevronRight className="text-muted-foreground/60 size-3.5" />
            </li>
            <li>
              {item.isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground -mx-1 rounded-sm px-1 py-0.5 transition-colors duration-[--duration-fast]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
