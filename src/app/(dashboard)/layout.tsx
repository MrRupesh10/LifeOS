import { AppShell } from "@/components/layout/app-shell";

/**
 * Dashboard layout — authenticated pages wrapped in the
 * application shell (header, sidebar, main, footer).
 *
 * Every route inside (dashboard) shares this layout.
 * The shell is currently a static placeholder without
 * interactivity — sidebar toggle and responsive behavior
 * come in Milestone 9.
 *
 * Route group: (dashboard)
 * Pages: /dashboard, /dashboard/tasks, /dashboard/habits, …
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
