/* WelcomeHeader widget – pure presentational component
   Receives a WidgetState<{ name: string; date: string }> prop.
   The widget renders the same markup as the original dashboard welcome block.
   Loading, empty, and error states are tiny internal components kept in this file.
*/

import { type WidgetState } from "@/modules/dashboard/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Internal sub‑components – kept small and local per the guidelines
function Loading() {
  return (
    <div className="flex animate-pulse items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="bg-muted h-6 w-48" />
        <div className="bg-muted h-4 w-96" />
      </div>
      <Button variant="outline" size="sm" disabled>
        View Analytics
      </Button>
    </div>
  );
}

function Empty() {
  // No dynamic data for the welcome header – render a friendly placeholder
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome!</h1>
        <p className="text-muted-foreground text-sm">Your dashboard is ready.</p>
      </div>
      <Button variant="outline" size="sm" disabled>
        View Analytics
      </Button>
    </div>
  );
}

function Error({ message }: { message: string }) {
  return (
    <div className="border-destructive/30 bg-destructive/5 flex items-start justify-between gap-4 rounded border p-4">
      <div className="space-y-1">
        <h1 className="text-destructive text-2xl font-bold tracking-tight">Error</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}

/**
 * WelcomeHeader widget.
 *
 * The widget receives a {@link WidgetState} prop. The shape is deliberately simple –
 * the widget only displays a greeting; it never performs business logic.
 */
export default function WelcomeHeader({
  state,
}: {
  state: WidgetState<{ name: string; date: string }>;
}) {
  if (state.status === "loading") return <Loading />;
  if (state.status === "error") return <Error message={state.message} />;
  // For success we render the static UI. The data slice currently contains only
  // friendly values – we fall back to a generic greeting if missing.
  const name = state.data?.name ?? "Rupesh";
  const date = state.data?.date ?? new Date().toLocaleDateString();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {name} 👋</h1>
        <p className="text-muted-foreground text-sm">
          Here's what's happening across your life today.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<Link href="/dashboard/analytics" />}
      >
        View Analytics
      </Button>
    </div>
  );
}
