/**
 * Root loading fallback — shown during page navigation and
 * initial load before the route content renders.
 *
 * Next.js automatically uses this as a Suspense boundary for
 * the root layout's children. When pages are SSR'd or slow,
 * this skeleton is the fallback instead of a blank screen.
 *
 * Matches the shell structure so users perceive continuity
 * between the loading state and the loaded page.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {/* Simplified app name — matches landing page structure */}
      <div className="bg-muted h-10 w-24 animate-pulse rounded-md" />
      <div className="bg-muted h-5 w-48 animate-pulse rounded-md" />
      <p className="sr-only">Loading…</p>
    </div>
  );
}
