import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Design System layout — minimal shell without the dashboard chrome.
 * The root layout still wraps html/body and providers; this just omits
 * the AppShell (no sidebar, header, or footer) so the showcase
 * renders as a standalone reference page.
 */

export const metadata: Metadata = {
  title: `Design System — ${siteConfig.name}`,
  description:
    "Visual reference for every design token and UI primitive in the LifeOS design system.",
};

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
