/**
 * Drizzle ORM client — the single database connection for the app.
 *
 * ── Why postgres-js (not @neondatabase/serverless) ──────────────
 * We run on Node.js serverless (Vercel functions), not the Edge
 * Runtime. postgres-js is already installed (ADR: reuse deps) and is
 * the driver Drizzle's `postgres-js` adapter targets. The Neon
 * serverless driver would only be needed for Edge runtimes, which we
 * are not using for database access.
 *
 * ── Why prepare: false ──────────────────────────────────────────
 * Neon's pooled (PgBouncer) endpoint runs in transaction mode and
 * does NOT support Postgres prepared statements. With `prepare: true`
 * (the postgres-js default) you get intermittent
 * "prepared statement _drizzle_1 does not exist" errors. Setting
 * `prepare: false` keeps everything on a simple query protocol.
 *
 * @see https://neon.tech/docs/connect/connection-pooling
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "@/lib/config/env";
import * as schema from "./schema";

/** Raw postgres-js connection (rarely needed — prefer `db`). */
export const client = postgres(env.DATABASE_URL, { prepare: false });

/**
 * The Drizzle instance. Always import THIS from modules/actions —
 * never construct a second drizzle(). Passing `{ schema }` enables
 * the relational query API (`db.query.users.findMany(...)`).
 */
export const db = drizzle(client, { schema });

/**
 * Infers the domain row types from the schema for use across the app
 * (module types, server-action return shapes). Single source of truth.
 */
export type Database = typeof db;
