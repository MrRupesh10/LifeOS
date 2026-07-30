/**
 * Global TypeScript type exports — the single import point
 * for all shared types in the application.
 *
 * Import:
 *   import type { NavItem, ThemeMode } from "@/types"
 *
 * This barrel file keeps codebases tidy: add new type exports
 * here without changing every import across the app.
 */

export type { Nullable, DeepPartial, UnwrapPromise, Mutable } from "./common";
export type { NavItem, NavGroup, NavConfig } from "./navigation";
export type { ThemeMode, ThemeOption } from "./theme";
