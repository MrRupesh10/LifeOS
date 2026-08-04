/**
 * Forgot-password page — server component.
 *
 * Already-authenticated users are bounced to the dashboard (a signed-in
 * user who forgot their password can reset it from Settings instead).
 * Otherwise render the auth layout + ForgotPasswordForm.
 *
 * No `redirect` query param here (unlike login) — the flow always
 * returns to /login after the user clicks the reset link and sets a
 * new password (see ResetPasswordForm).
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getSession } from "@/lib/auth/session";
import { ForgotPasswordForm } from "@/modules/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password — LifeOS",
  description: "Reset your LifeOS account password.",
};

export default async function ForgotPasswordPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-muted-foreground text-center text-sm">
        Remembered your password?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
