/**
 * Auth validation schemas — Zod, shared client + server.
 *
 * ── Why one module-level file? ──────────────────────────────────
 * Every form (login, register, forgot/reset password) and its
 * matching server action share the SAME validation rules. Defining
 * them once here means:
 *   • No drift between client + server validation
 *   • Form errors look identical on both ends
 *   • Adding a field = one schema edit, propagates everywhere
 *
 * ── Password complexity ─────────────────────────────────────────
 * ≥8 chars, one letter + one digit. Deliberately NOT über-strict
 * (no 16-char / mixed-case mandate) — Better Auth stores scrypt
 * hashes, so strength comes from the hash, not user friction. We
 * surface a strength *meter* in the UI (client-side) as a soft nudge.
 */
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
    termsAccepted: z.literal(true, {
      message: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Include at least one letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
