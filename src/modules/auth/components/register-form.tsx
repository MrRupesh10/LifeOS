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
import { signUp } from "@/lib/auth/client";
import { registerSchema, type RegisterInput } from "@/modules/auth/validation";

/**
 * RegisterForm — client component for account creation.
 *
 * After a successful sign-up (Better Auth `signUp.email`), we
 * immediately sign the user in via `signIn.email` so they land on
 * the dashboard without a second manual step. autoSignIn is false in
 * the server config, so this explicit call is required.
 *
 * Password strength: a lightweight client-only heuristic (length +
 * character variety) that drives a colored meter. This is UX nudging,
 * NOT a security control — the real strength comes from scrypt hashing
 * server-side. The schema enforces the hard floor (≥8, letter, digit).
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

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false as unknown as true,
    },
  });

  const password = watch("password");
  const strength = useMemo(() => scorePassword(password ?? ""), [password]);

  async function onSubmit(values: RegisterInput) {
    setSubmitting(true);
    try {
      const { error } = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        // After the user clicks the email link and the token validates,
        // Better Auth redirects here with ?status=… / ?error=….
        callbackURL: "/verify-email",
      });

      if (error) {
        toast.error(error.message ?? "Unable to create account.");
        return;
      }

      // autoSignIn is disabled server-side AND verification is pending,
      // so we do NOT sign in here. Send the user to a "check your email"
      // screen instead of a (failing) dashboard load.
      toast.success("Account created. Check your email to verify.");
      router.push("/verify-email?pending=true");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Rupesh"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-destructive text-sm" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

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

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
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
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm" role="alert">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <input
          id="termsAccepted"
          type="checkbox"
          className="border-input accent-primary mt-0.5 size-4 rounded"
          {...register("termsAccepted")}
        />
        <Label htmlFor="termsAccepted" className="text-muted-foreground">
          I agree to the terms and privacy policy
        </Label>
      </div>
      {errors.termsAccepted && (
        <p className="text-destructive text-sm" role="alert">
          {errors.termsAccepted.message}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="h-10 w-full" size="lg">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
