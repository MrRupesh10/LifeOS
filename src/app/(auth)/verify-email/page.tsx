/**
 * Verify-email page — server component.
 *
 * Three states, all sharing the auth layout's calm shell:
 *
 *  1. `?pending=true` — the user just registered. We tell them to
 *     check their inbox. No token involved yet.
 *  2. bare `/verify-email` (no query) — Better Auth validated the
 *     token at `/api/auth/verify-email?token=…&callbackURL=/verify-email`
 *     and redirected here with NO params on success. The email is now
 *     confirmed; offer a sign-in CTA.
 *  3. `?error=<code>` — the token was invalid/expired. Offer a resend.
 *
 * We do NOT validate the token here — the API route already did that
 * and only redirected on success/failure. This page is pure UX.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { AlertCircle, CheckCircle2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Verify email — LifeOS",
  description: "Confirm your email address to activate your LifeOS account.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; pending?: string }>;
}) {
  const { error, pending } = await searchParams;

  // State: verification failed (invalid/expired token from the email link).
  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <div className="bg-destructive/10 mx-auto flex size-12 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Verification link invalid</h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            This link has expired or is no longer valid. You can sign in to request a new
            verification email.
          </p>
        </div>

        <Button
          size="lg"
          nativeButton={false}
          className="h-10 w-full"
          render={<Link href="/login" />}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  // State: verification succeeded (clicked the email link, token valid).
  // On success Better Auth redirects to the bare callbackURL with NO
  // query params, so reaching here (no `error`, no `pending`) means done.
  if (!pending) {
    return (
      <div className="space-y-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="size-6 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Email verified</h1>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            Your email is confirmed. You can now sign in to your account.
          </p>
        </div>

        <Button
          size="lg"
          nativeButton={false}
          className="h-10 w-full"
          render={<Link href="/login" />}
        >
          Sign in
        </Button>
      </div>
    );
  }

  // State: just registered, pending verification.
  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <div className="bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-full">
          <MailCheck className="text-primary size-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm">
          {pending
            ? "We sent a verification link to your inbox. Click it to confirm your email and activate your account."
            : "A verification link is on its way. Click it to confirm your email."}
        </p>
      </div>

      <div className="bg-muted/30 text-muted-foreground rounded-lg border p-4 text-sm">
        <p className="text-foreground font-medium">Didn't get the email?</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Check your spam or promotions folder.</li>
          <li>Wait a couple of minutes — it can take a moment.</li>
          <li>
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            and we'll resend a verification link.
          </li>
        </ul>
      </div>
    </div>
  );
}
