/**
 * Schema barrel — single re-export point for all Drizzle tables.
 *
 * Drizzle Kit (drizzle.config.ts) and the relational query API
 * (`db.query.*`) both read from this file. Every new domain schema
 * added in Part D gets one line here:
 *
 *   export * from "./schema/tasks";
 *
 * Keeping a barrel means modules import `@/lib/db/schema` and get
 * everything, while the DB client imports `* as schema` for the
 * relational API — a single wiring point, zero scattered paths.
 */
export * from "./schema/auth";
