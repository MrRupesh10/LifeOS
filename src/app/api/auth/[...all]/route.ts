/**
 * Better Auth catch-all Next.js API route.
 *
 * `toNextJsHandler(auth)` scans the incoming request path under
 * `/api/auth/*` and dispatches to the correct Better Auth handler:
 *   POST /api/auth/sign-in/email     → email + password login
 *   POST /api/auth/sign-up/email     → register new account
 *   POST /api/auth/sign-out           → destroy session
 *   GET  /api/auth/get-session       → return session JSON (user menu)
 *   GET  /api/auth/verify-email?token=…   → email verification
 *   GET  /api/auth/reset-password?token=…  → password reset callback
 *
 * This is a thin routing layer: zero business logic lives here.
 * BetterAuth handles validation, CSRF, rate-limiting stubs.
 */
import { auth } from "@/lib/auth/config";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
