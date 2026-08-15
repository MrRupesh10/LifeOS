"use client";

import { GithubIcon } from "@/components/landing/github-icon";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactElement } from "react";

/**
 * Faint grid backdrop — uses the existing --border token so no new
 * design tokens are introduced. Masked with a radial fade so it fades
 * out at the edges (Apple marketing-page style).
 */
const GRID_CLASS =
  "bg-[image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_38%,black,transparent_80%)]";

const FLOAT = { duration: 14, repeat: Infinity, ease: "easeInOut" as const };

export function Hero(): ReactElement {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className={cn("pointer-events-none absolute inset-0 opacity-[0.4]", GRID_CLASS)} />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="bg-chart-1/20 absolute -top-48 -left-32 size-[34rem] rounded-full blur-[130px]"
          animate={
            reduceMotion ? undefined : { x: [0, 50, 0], y: [0, 30, 0], opacity: [0.45, 0.65, 0.45] }
          }
          transition={reduceMotion ? undefined : FLOAT}
        />
        <motion.div
          className="bg-chart-4/20 absolute -right-24 -bottom-52 size-[32rem] rounded-full blur-[130px]"
          animate={
            reduceMotion ? undefined : { x: [0, -40, 0], y: [0, -28, 0], opacity: [0.4, 0.6, 0.4] }
          }
          transition={reduceMotion ? undefined : { ...FLOAT, delay: 2 }}
        />
      </div>

      <Container variant="default" className="relative">
        <div className="flex flex-col items-center gap-6 py-24 text-center sm:py-32 lg:py-40">
          {/* Version badge */}
          <span className="border-border bg-card/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="bg-chart-2 size-1.5 rounded-full" />
            LifeOS v0.5.0-alpha
          </span>

          {/* Headline */}
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Your personal{" "}
            <span className="from-chart-1 to-chart-4 bg-gradient-to-r bg-clip-text text-transparent">
              operating system.
            </span>
          </h1>

          {/* Supporting copy */}
          <p className="text-muted-foreground max-w-xl text-lg text-pretty">
            Tasks, habits, journaling, goals, and skills — one calm, unified workspace. Not another
            todo app. The OS for the rest of your life.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" nativeButton={false} render={<Link href="/dashboard" />}>
              Get Started <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<a href={siteConfig.links.github} target="_blank" rel="noreferrer" />}
            >
              <GithubIcon className="size-4" /> Star on GitHub
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
