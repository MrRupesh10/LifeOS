/**
 * Environment variable validation.
 *
 * Uses @t3-oss/env-nextjs to validate env vars at build time.
 * Every environment variable the application touches is declared
 * and validated here — fail-fast, with a clear error message,
 * instead of a crash deep in the call stack.
 *
 * @see https://env.t3.gg/docs/nextjs
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * ── Server-side variables ─────────────────────────────────
   * These are only available on the server. Never exposed to
   * the browser. Access via `env.DATABASE_URL`.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    /**
     * Neon PostgreSQL pooled connection string.
     * Required — without a database the app cannot start.
     * Must be a valid postgres:// URL (Neon appends ?sslmode=require).
     */
    DATABASE_URL: z.string().url("DATABASE_URL must be a valid postgres connection string"),
    /**
     * Better Auth HMAC secret — signs session cookies & tokens.
     * 32+ hex chars; generate via `openssl rand -hex 32`.
     */
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET must be at least 32 characters (openssl rand -hex 32)"),
    /**
     * Base URL where the app is served. Better Auth uses it for
     * email-verification links and cookie scope. Optional in dev.
     */
    BETTER_AUTH_URL: z.string().url().optional(),
    /**
     * OAuth — Google (optional)
     * From console.cloud.google.com → APIs & Services → Credentials
     */
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    /**
     * OAuth — GitHub (optional)
     * From github.com/settings/developers → OAuth Apps
     */
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
  },

  /*
   * ── Client-side variables ─────────────────────────────────
   * These are bundled and sent to the browser. MUST be
   * prefixed with NEXT_PUBLIC_. Access via `env.NEXT_PUBLIC_APP_URL`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    /**
     * Better Auth API base URL (client). Omit for default (/api/auth).
     * Only needed during SSR or when running behind a proxy/CDN.
     * Optional. Must be HTTPS in production.
     */
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),
  },

  /*
   * ── Runtime mapping ───────────────────────────────────────
   * Maps the Zod schemas above to actual process.env values.
   * Empty strings are treated as undefined (common in Docker/Vercel).
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  },

  /**
   * Only defined for production builds, or when running on Vercel.
   * Set SKIP_ENV_VALIDATION=true to bypass in development.
   */
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});
