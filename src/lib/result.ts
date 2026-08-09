/**
 * ServiceResult — framework-agnostic operation result for every DataSource
 * and Service in the application.
 *
 * ── Why not throw ─────────────────────────────────────────────────
 * Throwing forces every caller to wrap in try/catch. This type makes
 * failure a *value* the type system tracks. A caller that forgets to
 * check `success` won't compile once it tries to access `.data`.
 *
 * ── Why not Result<T, E> (Rust-style) ────────────────────────────
 * Today we only carry a string `message`. Adding an `error` union
 * would be premature. When a caller genuinely needs to branch on
 * error kind, the variant can be widened in one place — this file.
 *
 * # Future variants — all non-breaking additions:
 *   type ServiceResult<T, E = string> =
 *     | { success: true; data: T }
 *     | { success: false; message: string; code?: E }
 */

export type ServiceResult<T> = { success: true; data: T } | { success: false; message: string };
