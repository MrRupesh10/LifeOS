/**
 * Reset-password page — server component.
 *
 * The user arrives here from the Better Auth email-link flow:
 *   1. They submit their email on /forgot-password.
 *   2. Better Auth emails a link to
 *      /api/auth/reset-password/:token?callbackURL=/reset-password
 *   3. Clicking it validates the token server-side, then redirects
 *      here with either ?token=VALID_TOKEN or ?error=INVALID_TOKEN.
 *
 * We do NOT redirect already-authenticated users away from this page
 * (unlike login/register) — someone clicking a reset link from their
 * inbox should be able to complete the flow regardless of session
 * state.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password — LifeOS",
  description: "Set a new password for your LifeOS account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  // Invalid or expired token → show a retry message.
  if (error === "INVALID_TOKEN" || (!token && !error)) {
    return (
      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <div className="bg-destructive/10 mx-auto flex size-12 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Link expired or invalid</h1>
          <p className="text-muted-foreground text-sm">
            This password reset link has expired or is no longer valid. Request a new one to
            continue.
          </p>
        </div>

        <Button
          size="lg"
          nativeButton={false}
          className="h-10 w-full"
          render={<Link href="/forgot-password" />}
        >
          Request new link
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Remembered your password?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  if (!token) {
    redirect("/forgot-password");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
        <p className="text-muted-foreground text-sm">Choose a strong password for your account.</p>
      </div>

      <ResetPasswordForm token={token} />

      <p className="text-muted-foreground text-center text-sm">
        Remembered your password?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
