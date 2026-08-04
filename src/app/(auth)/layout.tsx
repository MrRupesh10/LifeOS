/**
 * Auth route-group layout — minimal centered shell, NO app chrome.
 *
 * The (auth) group strips the AppShell (sidebar/header/footer):
 * login, register, and password-reset pages render against a calm,
 * distraction-free backdrop. The dashboard layout's AppShell is NOT
 * inherited because route groups don't share layouts by default.
 *
 * Server component — no client JS for the shell itself.
 */
import type { ReactNode } from "react";
import type { Metadata } from "next";

import { LogoLink } from "@/components/landing/logo-link";

export const metadata: Metadata = {
  title: "LifeOS — Account",
  description: "Sign in or create your LifeOS account.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background relative flex min-h-svh flex-col items-center justify-center px-4 py-12">
      {/* Soft ambient gradient glow — pure decoration, hidden in reduced-motion via CSS. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/8 absolute top-[-10%] left-1/2 size-[40rem] -translate-x-1/2 rounded-full blur-3xl" />
      </div>

      <main className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <LogoLink />
        </div>
        {children}
      </main>
    </div>
  );
}
