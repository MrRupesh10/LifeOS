"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, ChevronDown, Check, Search, Home, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import {
  COLOR_TOKENS,
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  RADIUS_TOKENS,
  ANIMATION_TOKENS,
  FONT_TOKENS,
} from "@/config/design-tokens";
import { cn } from "@/lib/utils";

/**
 * Design System Showcase Page
 *
 * Living reference for every visual primitive in LifeOS.
 * Displayed without the dashboard chrome for focused review.
 * Toggle light/dark via the ThemeToggle in the page header.
 */

export default function DesignSystemPage() {
  const { theme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Button variants for the showcase grid
  const BUTTON_VARIANTS = ["default", "outline", "secondary", "ghost", "destructive"] as const;

  const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;

  return (
    <div className="min-h-screen">
      {/* ── Page header ── */}
      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 border-b backdrop-blur-sm">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight">Design System</span>
            <span className="text-muted-foreground hidden text-xs sm:block">
              {siteConfig.name} v0.2.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <Container className="py-12">
        <div className="mb-16 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
          <p className="text-muted-foreground max-w-2xl">
            Apple × Linear inspired visual language. Every token, primitive, and component rendered
            in both light and dark themes. Toggle the theme to see the full range.
          </p>
          <p className="text-muted-foreground text-xs">
            Current theme: <code className="bg-muted rounded px-1.5 py-0.5 text-xs">{theme}</code>
          </p>
        </div>

        {/*
         * ── 1. Colors ──────────────────────────────────────────────────
         */}
        <Section
          title="Color Palette"
          description="21 semantic tokens with light and dark mode values."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.cssVariable}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div
                  className="ring-border/50 size-10 shrink-0 rounded-md border ring-1"
                  style={{ backgroundColor: `var(${token.cssVariable})` }}
                  aria-label={`${token.name}: light ${token.lightHex}, dark ${token.darkHex}`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{token.name}</p>
                  <p className="text-muted-foreground text-xs">{token.cssVariable}</p>
                  <p className="text-muted-foreground/70 mt-0.5 flex gap-2 text-[0.65rem]">
                    <span className="font-mono">{token.lightHex}</span>
                    <span className="font-mono">{token.darkHex}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 2. Typography ─────────────────────────────────────────────── */}
        <Section title="Typography" description="Geist Sans with mono for code. 16px body default.">
          <div className="space-y-6">
            {TYPOGRAPHY_TOKENS.map((token) => (
              <div
                key={token.name}
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <div className="w-24 shrink-0">
                  <span className="text-muted-foreground text-xs font-medium uppercase">
                    {token.name}
                  </span>
                  <p className="text-muted-foreground/60 text-[0.65rem]">{token.size}</p>
                </div>
                <p className={cn(token.tailwindClass, "truncate")}>{token.sample}</p>
              </div>
            ))}
            {/* Monospace */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
              <div className="w-60 shrink-0">
                <span className="text-muted-foreground text-xs font-medium">mono</span>
                <p className="text-muted-foreground/60 text-[0.65rem]">14px / 1.25rem</p>
              </div>
              <p className="font-mono text-sm">0123456789 — the quick brown fox</p>
            </div>
          </div>
        </Section>

        {/* ── 3. Spacing ────────────────────────────────────────────────── */}
        <Section
          title="Spacing Scale"
          description="4px-based grid (Tailwind default). Generous whitespace."
        >
          <div className="space-y-2">
            {SPACING_TOKENS.map((token) => (
              <div key={token.name} className="flex items-center gap-4">
                <span className="text-muted-foreground w-8 text-right font-mono text-xs">
                  {token.px}px
                </span>
                <div className="bg-muted/50 h-6 rounded-sm border" style={{ width: token.px }} />
                <span className="text-muted-foreground text-xs">{token.usage}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 4. Radius ─────────────────────────────────────────────────── */}
        <Section title="Border Radius" description="Consistent 6px base. Shadcn base-nova scale.">
          <div className="flex flex-wrap items-end gap-4">
            {RADIUS_TOKENS.map((token) => (
              <div key={token.name} className="flex flex-col items-center gap-2">
                <div
                  className="bg-primary/15 size-16 border"
                  style={{ borderRadius: `var(${token.cssVariable})` }}
                />
                <span className="text-muted-foreground text-[0.65rem]">{token.name}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 5. Fonts ──────────────────────────────────────────────────── */}
        <Section title="Fonts" description="Geist Sans + Geist Mono loaded from next/font/google.">
          <div className="space-y-4">
            {FONT_TOKENS.map((token) => (
              <div key={token.name} className="space-y-1">
                <p className="text-sm font-medium">{token.name}</p>
                <p className="text-muted-foreground font-mono text-xs">{token.cssVariable}</p>
                <p className="text-muted-foreground/70 text-xs">{token.stack}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 6. Animation ──────────────────────────────────────────────── */}
        <Section
          title="Animation"
          description="prefers-reduced-motion respected globally. All animations skip on reduce."
        >
          <div className="space-y-2">
            {ANIMATION_TOKENS.map((token) => (
              <div key={token.name} className="flex items-center gap-4">
                <span className="text-muted-foreground w-48 font-mono text-xs">{token.name}</span>
                <span className="text-xs font-medium">{token.value}</span>
                <span className="text-muted-foreground text-xs">{token.usage}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 7. Buttons — All Variants × Sizes ─────────────────────────── */}
        <Section title="Buttons" description="5 variants × 4 sizes. Focus-visible ring.">
          <div className="space-y-8">
            {BUTTON_VARIANTS.map((variant) => (
              <div key={variant} className="space-y-2">
                <p className="text-muted-foreground text-xs font-medium">{variant}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {BUTTON_SIZES.map((size) => (
                    <Button key={`${variant}-${size}`} variant={variant} size={size}>
                      {variant === "default" ? `${size}` : variant}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            {/* Icon-only buttons */}
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium">icon sizes</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="icon-xs">
                  <Search />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Bell />
                </Button>
                <Button variant="ghost" size="icon">
                  <Home />
                </Button>
                <Button variant="ghost" size="icon-lg">
                  <Sun />
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 8. Dialog ──────────────────────────────────────────────────── */}
        <Section title="Dialog" description="Base UI dialog primitive. Escape closes, focus trap.">
          <div className="flex items-center gap-3">
            <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sample Dialog</DialogTitle>
                  <DialogDescription>
                    This is a sample dialog to verify styling and accessibility.
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm">
                  Dialogs interrupt the user for modal actions. Escape closes. Focus is trapped
                  inside while open.
                </div>
                <DialogFooter showCloseButton>
                  <Button onClick={() => setDialogOpen(false)}>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Section>

        {/* ── 9. Dropdown Menu ──────────────────────────────────────────── */}
        <Section
          title="Dropdown Menu"
          description="Base UI Menu primitive with radio items, separators, shortcuts."
        >
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                Open Menu
                <ChevronDown className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => {}}>
                <Home className="size-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <Search className="size-4" />
                Search
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>
              <DropdownMenuItem variant="destructive" onSelect={() => {}}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        {/* ── 10. Icons ─────────────────────────────────────────────────── */}
        <Section
          title="Icons"
          description="Lucide React. Stroke width 1.5, 4 sizes. currentColor inheritance."
        >
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {[
              { icon: Home, label: "Home" },
              { icon: Search, label: "Search" },
              { icon: Sun, label: "Sun" },
              { icon: Moon, label: "Moon" },
              { icon: Monitor, label: "Monitor" },
              { icon: Bell, label: "Bell" },
              { icon: Check, label: "Check" },
              { icon: ChevronDown, label: "Chevron" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-lg border py-3"
              >
                <Icon className="size-5" />
                <span className="text-muted-foreground text-[0.6rem]">{label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Footer ── */}
        <footer className="border-t pt-8 pb-16 text-center">
          <p className="text-muted-foreground text-xs">LifeOS v0.2.0 — Design System Reference</p>
        </footer>
      </Container>
    </div>
  );
}

/**
 * Section wrapper for consistent vertical rhythm.
 */
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pb-16">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground mt-1 mb-6 text-sm">{description}</p>}
      <div className={description ? "mt-0" : "mt-6"}>{children}</div>
    </section>
  );
}
