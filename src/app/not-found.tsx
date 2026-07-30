import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * 404 page — shown when a route doesn't match any page.
 *
 * Mechanism: Next.js App Router renders this when a page
 * calls notFound() or when no route matches the URL path.
 * It inherits the root layout (layouts still render for
 * not-found pages), so fonts and styles are available.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-md text-center text-base">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/80 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium whitespace-nowrap transition-all"
      >
        Back to {siteConfig.name}
      </Link>
    </main>
  );
}
