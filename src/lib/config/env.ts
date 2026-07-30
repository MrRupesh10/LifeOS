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
    DATABASE_URL: z.string().url().optional(),
  },

  /*
   * ── Client-side variables ─────────────────────────────────
   * These are bundled and sent to the browser. MUST be
   * prefixed with NEXT_PUBLIC_. Access via `env.NEXT_PUBLIC_APP_URL`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  },

  /*
   * ── Runtime mapping ───────────────────────────────────────
   * Maps the Zod schemas above to actual process.env values.
   * Empty strings are treated as undefined (common in Docker/Vercel).
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Only defined for production builds, or when running on Vercel.
   * Set SKIP_ENV_VALIDATION=true to bypass in development.
   */
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});
