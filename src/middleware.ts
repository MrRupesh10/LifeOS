/**
 * Middleware — optimistic auth redirect (defense layer 1).
 *
 * ── Why middleware (not the real boundary) ───────────────────────
 * Middleware runs on the Edge before every request. It can ONLY read
 * cookies — it cannot validate a session against the database. So
 * this is a UX optimization: bounce unauthenticated users to /login
 * before the server even renders the dashboard shell.
 *
 * The authoritative check is `getSession()` in Server Actions and
 * Server Components (`src/lib/auth/session.ts`) — that validates the
 * cookie's signature + expiry against the DB (defense layer 2).
 *
 * ── Why a hand-rolled cookie read (not better-auth/cookies) ────────
 * `better-auth/cookies`'s `getSessionCookie` pulls in `jose`, which
 * uses `CompressionStream`/`DecompressionStream` — Node APIs the
 * Edge Runtime does not support. That produces hard build warnings
 * and runtime failures on Vercel's Edge.
 *
 * Middleware needs NONE of that: it only checks whether a cookie
 * NAMED like a session token EXISTS. Crypto validation is deferred
 * to `getSession()` (defense layer 2). So a plain header string check
 * is both sufficient and edge-safe (Principle of Least Privilege).
 *
 * ── Cookie name ───────────────────────────────────────────────────
 * Better Auth's default session cookie is `better-auth.session_token`
 * (insecure) or `__Secure-better-auth.session_token` (production,
 * HTTPS). We accept either. It can also be chunked across
 * `better-auth.session_token.0`, `.1`, … when the token exceeds the
 * 4 KB cookie size limit — we treat the presence of ANY chunk as a
 * session, since chunks only exist when a session exists.
 */
import { NextResponse, type NextRequest } from "next/server";

/** Cookie name prefix used by Better Auth (default config). */
const SESSION_COOKIE = "better-auth.session_token";
/** HTTPS-only prefix Node/Next adds for Secure cookies in production. */
const SECURE_PREFIX = "__Secure-";

/**
 * Does the request carry anything that looks like a Better Auth
 * session cookie? Handles both the secure and insecure variants,
 * plus chunked cookies (`.0`, `.1`…).
 */
function hasSessionCookie(request: NextRequest): boolean {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  const names = cookieHeader.split(";").map((pair) => pair.split("=")[0]?.trim() ?? "");

  return names.some(
    (name) =>
      name === SESSION_COOKIE ||
      name === `${SECURE_PREFIX}${SESSION_COOKIE}` ||
      name.startsWith(`${SESSION_COOKIE}.`) ||
      name.startsWith(`${SECURE_PREFIX}${SESSION_COOKIE}.`),
  );
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // No session cookie → redirect to login, preserving the intended URL.
  if (!hasSessionCookie(request)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Only run on dashboard routes. Auth routes, API, and static
   * assets are skipped — middleware would only add latency there.
   */
  matcher: ["/dashboard/:path*"],
};
