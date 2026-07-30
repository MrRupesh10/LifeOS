/**
 * Utility types used across the entire application.
 *
 * These small, reusable type-level helpers eliminate common
 * TypeScript boilerplate. Zero runtime code — they exist
 * only at compile time (type erasure).
 */

/** Wraps T in the same null and undefined. For legacy API responses. */
export type Nullable<T> = T | null | undefined;

/** Makes every property of T optional recursively. */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/** Extracts success from {@link Promise<T>}. Shorthand. */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/** Marks known immutable values (used with `as const`). */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };
