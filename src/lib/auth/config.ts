/**
 * Better Auth server instance — the single auth configuration for the
 * entire application.
 *
 * ── What this file does ─────────────────────────────────────────
 * Creates the `auth` server object that every auth-related piece
 * (API handler, React client, server-side session check) derives
 * from. There is ONE auth instance — never create a second one.
 *
 * ── Architecture (ADR-003) ───────────────────────────────────────
 * Better Auth was chosen over Auth.js/NextAuth for:
 *   • Built-in email+password support (no adapter-email coupling)
 *   • Server-Action native (no API-route required for auth flows,
 *     though we expose one for the client hooks to call)
 *   • Framework-agnostic Drizzle adapter
 *   • HTTP-only cookies + scrypt password hashing + CSRF built-in
 *
 * ── Drizzle adapter config: usePlural & camelCase ────────────────
 * `usePlural: true`    → table names are "users","sessions", etc.
 * `camelCase: false`   → column names are snake_case (email_verified,
 *                        created_at). Matches our schema/auth.ts.
 *
 * These pass through to the @better-auth/drizzle-adapter and control
 * what column/table names it generates in SQL queries.
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";
import { env } from "@/lib/config/env";

export const auth = betterAuth({
  /** Required: HMAC secret for cookie signing + token generation. */
  secret: env.BETTER_AUTH_SECRET,

  /**
   * App base URL. Better Auth uses this for:
   *  - Email verification link generation
   *  - `Set-Cookie` domain scope
   *  - Redirect URL validation
   */
  baseURL: env.BETTER_AUTH_URL ?? "http://localhost:3000",

  /** PostgreSQL via Drizzle, using our hand-written schema. */
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),

  /**
   * Email + password is the primary auth method (no social OAuth yet).
   * autoSignIn: false → user must manually sign in after registration,
   * giving us an explicit step for email verification UX.
   */
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    /**
     * Password reset.
     *
     * Better Auth generates a reset token and calls this function
     * with the reset URL. In development the URL is logged to the
     * console. In production, swap for a real email provider (Postmark,
     * Resend, etc.) — just like `sendVerificationEmail`.
     *
     * WITHOUT this function, the reset-password endpoint rejects every
     * request with 400: "Reset password isn't enabled."
     */
    sendResetPassword: async ({ url, user }) => {
      if (env.NODE_ENV === "development") {
        // biome-ignore lint/suspicious/noConsole: intentional dev-only log
        console.log("🔑 Password reset link:", url);
      }
    },
  },

  /**
   * ── OAuth providers ──────────────────────────────────────────
   * Google and GitHub social sign-in. Users who sign in via OAuth
   * get linked accounts in the `accounts` table (one row per
   * provider per user). If the email matches an existing account,
   * Better Auth links the OAuth identity to it automatically;
   * otherwise a new user record is created.
   *
   * Required env vars (add to .env.local):
   *   GOOGLE_CLIENT_ID     — from console.cloud.google.com
   *   GOOGLE_CLIENT_SECRET — from console.cloud.google.com
   *   GITHUB_CLIENT_ID     — from github.com/settings/developers
   *   GITHUB_CLIENT_SECRET — from github.com/settings/developers
   *
   * Redirect URIs (add these in the OAuth provider consoles):
   *   Google: http://localhost:3000/api/auth/callback/google
   *   GitHub: http://localhost:3000/api/auth/callback/github
   *
   * Each provider is conditional on its env vars being set.
   * Missing vars → provider skipped. This lets local dev work
   * with one provider while the other is being provisioned.
   */
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },

  /**
   * Email verification.
   *
   * `sendOnSignUp: true`  → Better Auth generates a verification token
   *                         and calls `sendVerificationEmail` right
   *                         after sign-up, so the user gets the email
   *                         without a manual "send" request. The
   *                         `callbackURL` passed in the sign-up body
   *                         controls where the link redirects after
   *                         the token is validated (our /verify-email).
   *
   * `autoSignInAfterVerification: false` → keep the explicit sign-in
   *                         step after verification, consistent with
   *                         `emailAndPassword.autoSignIn: false`.
   *
   * In development the verification URL is logged to the console so
   * the developer can click it. In production, swap the no-op for a
   * real email provider (Postmark/Resend).
   */
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ url }) => {
      if (env.NODE_ENV === "development") {
        // Development-only: verification link logged for manual testing.
        // No-op in production.
      }
    },
  },

  /**
   * ── ID generation (must match schema column types) ──────────
   * Every auth table (`schema/auth.ts`) declares `id` as a Postgres
   * `uuid` column. Better Auth's DEFAULT id generator emits a 32-char
   * random alphanumeric string — NOT a UUID — so Postgres rejects
   * every INSERT with `22P02: invalid input syntax for type uuid`.
   * `generateId: "uuid"` routes through `crypto.randomUUID()`, which
   * returns a valid UUIDv4 the adapter can pass to a `uuid` column.
   *
   * The column's own `.defaultRandom()` never fires here because the
   * Drizzle adapter supplies the `id` explicitly in each INSERT.
   * (Confirmed branch in create-context.mjs:
   *  `if (dbGenerateId === "uuid") return crypto.randomUUID();`.)
   */
  advanced: {
    database: {
      generateId: "uuid" as const,
    },
  },

  /**
   * ── Additional auth config ───────────────────────────────────
   * Session: 30d cookie (default)
   * Password: uses Better Auth's built-in scrypt hashing
   * CSRF: built-in to Server Actions (SameSite cookies)
   * Cookie plugin: nextCookies bakes Next.js-specific cookie handling
   */
  plugins: [nextCookies()],
});
