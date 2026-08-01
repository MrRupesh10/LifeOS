"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { useSidebarStore } from "@/stores/ui/sidebar-store";
import { cn } from "@/lib/utils";

/**
 * Application Shell — the structural chrome for every dashboard page.
 *
 * This is a client component because the sidebar layout size and
 * behaviours are driven by Zustand (cross-tree UI state). The
 * Zustand store is consumed by ONLY the components that need it:
 *   Header — hamburger / collapse toggle
 *   Sidebar — width, collapsed/overlay logic
 *   AppShell — main content margin
 *
 * Desktop:
 *   ┌──────────────────────────┐
 *   │ Header                    │
 *   ├────┬─────────────────────┤
 *   │ SB │ Main (children)     │  ← sidebar width from Zustand
 *   ├────┴─────────────────────┤
 *   │ Footer                    │
 *   └──────────────────────────┘
 *
 * Mobile:
 *   Sidebar is overlay (absolute pos, z= at 0).
 *   Main content is full-width and static.
 */

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();
  // Desktop: margin matches sidebar (collapsed or expanded)
  const collapsedMargin = isCollapsed ? "lg:pl-16" : "lg:pl-64";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main
          id="main-content"
          className={cn(
            "flex-1 px-6 py-6 transition-[padding-left] duration-200 ease-out",
            collapsedMargin,
          )}
        >
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
