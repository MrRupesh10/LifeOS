/**
 * LogoLink — the LifeOS wordmark, used in the auth layout header.
 *
 * A small, shared navigation affordance: clicking the wordmark returns
 * to the marketing landing page. Server component (no interactivity
 * needed) so it adds zero client JS to the auth pages it appears on.
 */
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function LogoLink() {
  return (
    <Link
      href="/"
      className="text-foreground hover:text-foreground/80 text-lg font-semibold tracking-tight transition-colors"
    >
      {siteConfig.name}
    </Link>
  );
}
