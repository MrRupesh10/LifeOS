/**
 * Better Auth React client — typed hooks for client components.
 *
 * We export TWO things from this module:
 *
 *   • `authClient`  — the full client object, for less-common
 *                      actions that don't need their own hook sugar
 *                      (`authClient.forgetPassword`,
 *                       `authClient.resetPassword`).
 *   • Named hooks   — `signIn`, `signUp`, `signOut`, `useSession` —
 *                      convenience destructures for the flows every
 *                      auth form uses, so imports read clearly.
 *
 * `baseURL` points the client at the Better Auth API route
 * (`/api/auth/*`) so the hooks call our single server instance over
 * fetch. Use in any `"use client"` component:
 *
 *   const { data: session, isPending } = useSession();
 *   if (isPending) return <Spinner />;
 *   if (!session) return <LoginPrompt />;
 *   return <Dashboard user={session.user} />;
 */
import { createAuthClient } from "better-auth/react";

/**
 * No baseURL passed — Better Auth resolves it via:
 * 1. NEXT_PUBLIC_BETTER_AUTH_URL env (SSR-safe string, no new URL())
 * 2. window.location.origin (CSR)
 * 3. "/api/auth" as final fallback (browser resolves against origin)
 *
 * Passing a relative baseURL like "/api/auth" causes an SSR crash:
 * getBaseURL() → withPath() → new URL("/api/auth") throws ERR_INVALID_URL.
 * Omitting it lets the public-env and client-side resolution work for both.
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
