import { create } from "zustand";

/**
 * Sidebar UI state — cross-tree state that Header, Sidebar,
 * AppShell, and MobileNav all need.
 *
 * WHY ZUSTAND (ADR-009):
 *   Zustand stores are consumed by components without provider
 *   nesting and live outside the React tree. Drilling sidebar
 *   props through 3+ components violates Separation of Concern.
 *
 * TWO MODES:
 *   isCollapsed  — desktop: sidebar is icons-only (Hide)
 *   isMobileOpen — mobile: drawer overlay is visible
 */

type SidebarStore = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  setMobileOpen: (open: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,

  toggleCollapsed: () => set((prev) => ({ isCollapsed: !prev.isCollapsed })),

  openMobile: () => set({ isMobileOpen: true }),

  closeMobile: () => set({ isMobileOpen: false }),

  setMobileOpen: (open) => set({ isMobileOpen: open }),
}));
