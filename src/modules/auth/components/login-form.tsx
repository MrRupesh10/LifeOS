"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/client";
import { loginSchema, type LoginInput } from "@/modules/auth/validation";

/**
 * LoginForm — client component for email + password sign-in.
 *
 * Uses React Hook Form with the shared Zod schema (same rules run
 * on client and server). Calls the Better Auth React client's
 * `signIn.email`, surfaces API errors via Sonner toasts, and
 * redirects to the dashboard (or the `redirect` query param) on
 * success. Pure client-side — no server round-trip for the form
 * state itself; only the auth mutation hits the API.
 */
export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"google" | "github" | null>(null);

  async function onOAuthSignIn(provider: "google" | "github") {
    setOauthProvider(provider);
    try {
      await signIn.social({
        provider,
        callbackURL: redirectTo ?? "/dashboard",
      });
    } catch {
      // signIn.social redirects on success; if it throws, surface the error
      toast.error("Could not sign in with " + provider + ".");
      setOauthProvider(null);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (error) {
        toast.error(error.message ?? "Unable to sign in. Check your credentials.");
        return;
      }

      toast.success("Welcome back!");
      router.push(redirectTo ?? "/dashboard");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-primary text-sm font-medium hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
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
        {errors.password && (
          <p className="text-destructive text-sm" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="rememberMe"
          type="checkbox"
          className="border-input accent-primary size-4 rounded"
          {...register("rememberMe")}
        />
        <Label htmlFor="rememberMe" className="text-muted-foreground">
          Remember me for 30 days
        </Label>
      </div>

      <Button type="submit" disabled={submitting} className="h-10 w-full" size="lg">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card text-muted-foreground px-2">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={!!oauthProvider}
          onClick={() => onOAuthSignIn("google")}
          className="h-10"
        >
          {oauthProvider === "google" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Google
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={!!oauthProvider}
          onClick={() => onOAuthSignIn("github")}
          className="h-10"
        >
          {oauthProvider === "github" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <GitHubIcon />
          )}
          GitHub
        </Button>
      </div>
    </form>
  );
}

/** Google "G" mark — simple SVG icon for the OAuth button. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** GitHub mark — inline SVG inheriting currentColor for the OAuth button. */
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 8.2 11.4c.6.1.8-.26.8-.58v-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.33-1.78-1.33-1.78-1.08-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.48.99.1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.92a4.63 4.63 0 0 1 1.23-3.22 4.28 4.28 0 0 1 .12-3.18s1-.32 3.3 1.23a11.36 11.36 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23a4.28 4.28 0 0 1 .12 3.18 4.63 4.63 0 0 1 1.23 3.22c0 4.6-2.8 5.62-5.48 5.9.43.42.8 1.18.8 2.3v3.42c0 .39.2.71.8.6A12 12 0 0 0 24 12 12 12 0 0 0 12 0z" />
    </svg>
  );
}
