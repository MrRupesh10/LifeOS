"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * TanStack Query provider — hydration-safe client factory.
 *
 * Pattern: create a new QueryClient on every server‑side component to
 * prevent cross‑client data leaks; use a single client instance on the
 * browser side so caching persists across pages.
 *
 * Defaults:
 *   staleTime: 60 seconds — refetch only when data is stale
 *   refetchOnWindowFocus: false — don't exit on tab switch
 *
 * @see https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
 */

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server — create the client for this request only
    return makeQueryClient();
  }
  // Client — reuse the singleton
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
