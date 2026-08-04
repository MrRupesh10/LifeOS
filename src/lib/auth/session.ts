/**
 * Server-side session helper — the security boundary for protected routes.
 *
 * ── Two-layer defense (per SECURITY.md) ─────────────────────────
 * 1. Middleware (UX layer) — reads the session cookie; redirects
 *    unauthenticated users to /login. Fast, but not bulletproof
 *    (cookies can be read but stale).
 * 2. Server-side (authority) — `getSession()` calls Better Auth's
 *    `auth.api.getSession` which validates the cookie against
 *    the database and re-issues if expired. Every protected Server
 *    Action MUST call `getSession()` as its first step.
 *
 * ── Usage ────────────────────────────────────────────────────────
 * In a Server Component or Server Action:
 *
 *   import { getSession } from "@/lib/auth/session";
 *   const session = await getSession();
 *   if (!session) return { error: "Unauthorized" };
 *   const userId = session.user.id; // type-safe
 *
 * The return type `Session | null` means every caller must handle
 * the null branch — no "oops I forgot to check" runtime surprises.
 */
import { headers } from "next/headers";
import { auth } from "@/lib/auth/config";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export type Session = Awaited<ReturnType<typeof getSession>>;
