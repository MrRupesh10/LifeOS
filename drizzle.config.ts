/**
 * Drizzle Kit configuration — schema migrations & Studio.
 *
 * Used by:
 *   pnpm db:generate   → creates a SQL migration from schema changes
 *   pnpm db:migrate    → applies pending migrations to Neon
 *   pnpm db:studio     → opens Drizzle Studio (DB browser GUI)
 *
 * The `schema` path points to a barrel that re-exports every
 * `pgTable` definition, so Drizzle Kit sees the complete picture
 * when diffing against the database. Domain schemas are added to
 * the barrel as they are created (Part D).
 *
 * @see https://orm.drizzle.team/docs/kit-best-practices
 */
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  /**
   * `db:generate` is schema-local only — no connection.
   * `db:migrate` and `db:studio` need DATABASE_URL set in .env.local
   * (drizzle-kit reads process.env directly). The connection string
   * defaults to empty so generation works offline, but migration or
   * Studio will fail with a clear connection error if unset.
   */
  dbCredentials: { url: databaseUrl },
  verbose: true,
  strict: true,
});
