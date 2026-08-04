"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Loader2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth/client";

/**
 * UserMenu — the authenticated user's account affordance in the header.
 *
 * ── Why a dropdown (not a bare "Sign out" button) ─────────────────
 * The header is global across the dashboard. Keeping the affordance
 * compact (avatar only) plus a menu mirrors Linear/Vercel's pattern:
 * identity at a glance, destructible action one click away but never
 * accidentally. The avatar doubles as a session-loaded indicator.
 *
 * ── State handling ────────────────────────────────────────────────
 * `useSession()` resolves client-side against /api/auth/get-session.
 * On /dashboard a session is expected (middleware already gated it),
 * but the first paint will be `isPending`. We show a muted placeholder
 * circle then — never a flash of "no user" that looks like a bug.
 *
 * `signOut()` POSTs /api/auth/sign-out (clears the session cookie),
 * then we redirect to /login. A local `signingOut` flag prevents
 * double-clicks and renders a spinner — plain defensive UI.
 */
export function UserMenu(): React.ReactElement {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  const name = session?.user?.name;
  const email = session?.user?.email;
  // Initials: first letter of the first name, uppercase. Fallback "?".
  const initials = name ? name.trim().charAt(0).toUpperCase() : "?";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  // While the session is resolving on the client, show a neutral
  // placeholder so the header doesn't flash different widths.
  if (isPending || !session) {
    return (
      <div
        className="bg-muted inline-flex size-8 items-center justify-center rounded-full"
        aria-hidden={isPending}
        aria-label="Account"
      >
        {isPending ? (
          <UserIcon className="text-muted-foreground size-4" />
        ) : (
          <UserIcon className="text-muted-foreground size-4" />
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="ring-ring/0 hover:ring-ring/40 focus-visible:ring-ring/40 from-primary to-primary/60 text-primary-foreground inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold ring-2 transition focus-visible:outline-none"
        aria-label="Account menu"
      >
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col">
              {name ? <span className="text-foreground text-sm font-medium">{name}</span> : null}
              <span className="text-muted-foreground text-xs leading-tight">{email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
            <Settings className="size-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleSignOut} disabled={signingOut}>
            {signingOut ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
