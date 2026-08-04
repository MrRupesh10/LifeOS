/**
 * Register page — server component.
 *
 * Already-authenticated users skip this and go straight to the
 * dashboard. Otherwise render the auth layout + RegisterForm.
 * No `redirect` query param on register (unlike login) — new users
 * always go to /dashboard after signup.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getSession } from "@/lib/auth/session";
import { RegisterForm } from "@/modules/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create account — LifeOS",
  description: "Create your LifeOS account.",
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground text-sm">Start managing your life in one place.</p>
      </div>

      <RegisterForm />

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
