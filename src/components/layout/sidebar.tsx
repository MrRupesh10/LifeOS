"use client";

import { navigationConfig } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/ui/sidebar-store";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

/**
 * Sidebar — main navigation for dashboard pages.
 *
 * TWO MODES (driven by Zustand sidebar store):
 *
 * Desktop (>= lg):
 *   - Expanded (256px) or Collapsed (64px icons-only)
 *   - 200 ms CSS transition on width via grid [--sidebar-w]
 *
 * Mobile (< lg):
 *   - Hidden by default, opens as a drawer overlay (z-50)
 *   - Overlay click background to close; nav link click closes; Escape closes
 *
 * Active navigation: `usePathname()` is used to highlight the
 * current route. Each `<Link>` gets `aria-current="page"`.
 *
 * Module boundary: sidebar lives under components/layout.
 * It reads navigation items from config/navigation.ts which
 * modules register against without touching sidebar code.
 */

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapsed, closeMobile } = useSidebarStore();
  const pathname = usePathname();

  // ── Keyboard: Escape closes mobile drawer ──
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) closeMobile();
    },
    [isMobileOpen, closeMobile],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Active‑route check ──
  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  // ── Shared link click closes mobile drawer ──
  function handleLinkClick() {
    if (isMobileOpen) closeMobile();
  }

  return (
    <>
      {/* ── Mobile overlay ── */}
      {isMobileOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar container ── */}
      <aside
        className={cn(
          "bg-background fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-[width] duration-200 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          // Mobile: slides in/out
          "lg:z-30 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* ── Logo area ── */}
        <div
          className={cn(
            "flex h-14 items-center gap-2 border-b px-4",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold">{siteConfig.name}</span>
          )}
          {/* Desktop collapse toggle */}
          {!isCollapsed && (
            <button
              className="hover:bg-muted hidden h-7 w-7 items-center justify-center rounded-md lg:flex"
              onClick={toggleCollapsed}
              aria-label="Collapse sidebar"
              type="button"
            >
              <PanelLeftClose className="size-4" />
            </button>
          )}
          {isCollapsed && (
            <button
              className="hover:bg-muted hidden size-8 items-center justify-center rounded-md lg:flex"
              onClick={toggleCollapsed}
              aria-label="Expand sidebar"
              type="button"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          )}
        </div>

        {/* ── Navigation groups ── */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-4">
            {navigationConfig.primary.map((group) => (
              <li key={group.label}>
                {/* Group label — hidden when collapsed */}
                {!isCollapsed && (
                  <p className="text-muted-foreground mb-1 px-3 text-[0.65rem] font-medium tracking-wider uppercase">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className={cn(
                          "hover:bg-accent flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          isActive(item.href)
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-foreground/70",
                          isCollapsed && "justify-center px-0",
                        )}
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        <item.icon className="size-5 shrink-0" />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Bottom section ── */}
        <div className="border-t p-3">
          {!isCollapsed && (
            <p className="text-muted-foreground px-2 text-[0.65rem]">v0.5.0-alpha</p>
          )}
        </div>
      </aside>
    </>
  );
}
