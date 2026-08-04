"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { resetPasswordSchema, type ResetPasswordInput } from "@/modules/auth/validation";

/**
 * ResetPasswordForm — set a new password with a valid reset token.
 *
 * The token arrives from the email link: Better Auth's
 * `/reset-password/:token` callback validates it server-side, then
 * redirects here with `?token=…` in the URL. We forward that token
 * to `authClient.resetPassword` so the server can match it against
 * the `verifications` table and update the password.
 *
 * Password strength: same lightweight UX nudge as RegisterForm (length
 * + character variety). The real security comes from scrypt hashing
 * server-side; the schema enforces the hard floor (≥8, letter, digit).
 */
function scorePassword(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.min(score, 4); // 0–4
}

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-transparent",
  "bg-destructive",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
];

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");
  const strength = useMemo(() => scorePassword(password ?? ""), [password]);

  async function onSubmit(values: ResetPasswordInput) {
    setSubmitting(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      });

      if (error) {
        toast.error(error.message ?? "Unable to reset password. The link may have expired.");
        return;
      }

      toast.success("Password updated. Please sign in.");
      router.push("/login");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center px-3 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {/* Password-strength meter — UX nudge, not a security gate. */}
        {password && (
          <div className="flex items-center gap-2" aria-hidden>
            <div className="flex h-1.5 flex-1 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-full transition-colors ${
                    i < strength ? STRENGTH_COLORS[strength] : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground w-12 text-xs">{STRENGTH_LABELS[strength]}</span>
          </div>
        )}
        {errors.password && (
          <p className="text-destructive text-sm" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={submitting} className="h-10 w-full" size="lg">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Updating password…
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}
