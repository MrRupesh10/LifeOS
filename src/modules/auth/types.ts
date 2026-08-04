/**
 * Auth module types — shared shapes for the auth UI layer.
 *
 * The core session shape comes from Better Auth's own inference
 * (`Session` type in `src/lib/auth/session.ts`). These types are the
 * *form/action* shapes used by the auth UI components and server
 * actions defined inside this module.
 */
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./validation";

/**
 * Standard server-action return shape for any auth mutation.
 * `ok` is the success flag — `data` carries the payload on success,
 * `error` carries a user-safe message on failure. One discriminated
 * union for the whole module keeps error handling uniform.
 */
export type AuthActionResult<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

export type { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput };
