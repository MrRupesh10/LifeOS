"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/modules/auth/validation";

/**
 * ForgotPasswordForm — request a password reset link.
 *
 * Better Auth sends a reset link to the email (logged to console in
 * dev). Three UI states: idle → loading → sent-success. We show a
 * confirmation screen on success so users know to check their inbox,
 * regardless of whether the email exists (avoids email enumeration).
 */
export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setSubmitting(true);
    try {
      // We ignore the error on purpose: Better Auth returns the same
      // shape whether or not the email exists, to prevent enumeration.
      await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-3 text-center">
        <div className="bg-primary/10 mx-auto flex size-12 items-center justify-center rounded-full">
          <MailCheck className="text-primary size-6" />
        </div>
        <h2 className="text-lg font-medium">Check your email</h2>
        <p className="text-muted-foreground text-sm">
          If an account exists for that email, a reset link is on its way.
        </p>
        <a href="/login" className="text-primary inline-block text-sm font-medium hover:underline">
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-destructive text-sm" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={submitting} className="h-10 w-full" size="lg">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending link…
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}
