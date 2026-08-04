/**
 * Login page — server component.
 *
 * If a valid session already exists, redirect to the dashboard
 * (defense layer 2 — `getSession()` validates against the DB).
 * Otherwise render the auth layout + LoginForm.
 *
 * The `redirect` query param is forwarded to LoginForm so a user
 * bounced off a protected page returns where they intended, not
 * always to /dashboard. This is a standard, well-understood pattern.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in — LifeOS",
  description: "Sign in to your LifeOS account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const { redirect: redirectTo } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Sign in to continue to your dashboard.</p>
      </div>

      <LoginForm redirectTo={redirectTo} />

      <p className="text-muted-foreground text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
