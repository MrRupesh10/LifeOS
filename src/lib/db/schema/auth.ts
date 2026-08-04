/**
 * Auth schema — the four Better Auth core tables.
 *
 * ── Ownership ───────────────────────────────────────────────────
 * Better Auth owns these tables: the adapter reads/writes them by
 * column name. The field names BELOW are the exact ones Better Auth
 * expects (verified against @better-auth/core getAuthTables), written
 * in snake_case — which matches the adapter's `camelCase: false`
 * default configured in `src/lib/auth/config.ts`.
 *
 * ── Why we hand-write instead of CLI-generate ──────────────────
 * Per Architecture.md & CLAUDE.md: schemas are source-controlled,
 * reviewed line-by-line, and type-safe. Drizzle Kit diffs THIS file
 * against the live DB to produce migrations — so the file is the
 * source of truth, not the other way around.
 *
 * ── Naming ─────────────────────────────────────────────────────
 * Tables are PLURAL (usePlural: true) per DATABASE.md. Columns are
 * snake_case. UUIDv7 PKs (time-ordered,sortable, no collision race).
 *
 * ── Cascade rule ───────────────────────────────────────────────
 * sessions/accounts/verifications ON DELETE CASCADE — a child record
 * is meaningless without its user (SECURITY.md: deleteUser must not
 * strand sessions or OAuth accounts).
 */
import { pgTable, text, timestamp, boolean, varchar, uuid, index } from "drizzle-orm/pg-core";

/**
 * `users` — the principal identity record.
 *
 * NOTE on `emailVerified` (boolean, not a timestamp): Better Auth
 * treats email verification as a boolean flag, not a moment in time.
 * Our Phase-0 DATABASE.md had `email_verified_at timestamptz`, but the
 * auth library owns this table — its column shape wins. Updated in
 * DATABASE.md during Part D.
 *
 * `image` (not `avatar_url`): Better Auth's standard column for the
 * user's avatar URL (OAuth profile picture or upload).
 *
 * `role`: added now so RBAC is structural, not retrofitted. The admin
 * plugin can read this column with zero migration later.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  /**
   * Role for future RBAC (admin plugin). Defaults to "user".
   * Plain varchar (not pgEnum) so we can add roles without a
   * migration — keeps the door open without coupling now.
   */
  role: varchar("role", { length: 32 }).notNull().default("user"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

/**
 * `sessions` — one row per active session (cookie-token).
 * `userId` FK cascades: deleting a user kills all their sessions.
 */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
    token: text("token").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
  }),
);

/**
 * `accounts` — credentials + OAuth links.
 * Password hashes live HERE (on the account), not on `users` — this
 * is how Better Auth models "a user has many auth methods"
 * (email/password + Google + GitHub, each = one row).
 * All `*ExpiresAt` and token columns are returned:false in the auth
 * schema (never exposed to the client) but are stored for OAuth flows.
 */
export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
      mode: "date",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
      mode: "date",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("accounts_user_id_idx").on(table.userId),
  }),
);

/**
 * `verifications` — short-lived tokens (email verification, password
 * reset). No FK to users — `identifier` is an email string, since a
 * verification can exist for an account not yet created (e.g. signup
 * email confirmation). Rows auto-purge via `expiresAt` in app logic.
 */
export const verifications = pgTable("verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});
