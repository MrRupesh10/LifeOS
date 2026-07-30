"use client";

import { useEffect } from "react";

/**
 * Root-level error boundary — catches errors thrown in layout.tsx
 * or template.tsx, which error.tsx cannot catch.
 *
 * Critical difference from error.tsx: this file MUST define its own
 * <html> and <body> tags — the root layout is NOT available during
 * an error because it's the layout itself that crashed. No Tailwind
 * classes, no font variables, no globals.css — everything must be
 * inline styles.
 *
 * This file renders very rarely (only on layout crashes), but when
 * it does, it's the only thing the user sees. Keep it stable,
 * functional, and dependency-free.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          backgroundColor: "#ffffff",
          color: "#0a0a0a",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            letterSpacing: "-0.025em",
          }}
        >
          Application error
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "#737373",
            maxWidth: "28rem",
            lineHeight: "1.5",
          }}
        >
          A critical error occurred and the application cannot continue. Please try refreshing the
          page.
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            borderRadius: "0.5rem",
            border: "none",
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <p style={{ fontSize: "0.75rem", color: "#a3a3a3", marginTop: "0.75rem" }}>LifeOS</p>
      </body>
    </html>
  );
}
