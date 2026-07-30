"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/**
 * Page-level error boundary — catches errors thrown in pages
 * and child components during rendering.
 *
 * Mechanism: Next.js wraps each route segment with this
 * React Error Boundary. Errors in Server Components get
 * propagated to this client component. The `reset()` function
 * retries rendering, not a full page reload.
 *
 * Scope: catches errors in page.tsx and components below it.
 * Does NOT catch errors in layout.tsx or template.tsx —
 * those require global-error.tsx.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error-reporting service here (Sentry, LogRocket, etc.)
    console.error("Page error boundary caught:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-center text-balance">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} className="mt-4">
        Try again
      </Button>
      <p className="text-muted-foreground mt-2 text-xs">
        If this persists, contact{" "}
        <a
          href={siteConfig.links.github}
          className="underline underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          support
        </a>
        .
      </p>
    </main>
  );
}
