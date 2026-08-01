"use client";

import { motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  /** Delay before the entrance begins, in seconds. */
  delay?: number;
  /** Initial vertical offset in pixels (animates to 0). */
  y?: number;
  className?: string;
}

/**
 * FadeIn — subtle scroll-triggered entrance animation.
 *
 * Wraps children in a motion.div that fades + slides up when it
 * scrolls into view (once). Uses the design system's --ease-out
 * cubic-bezier for a consistent, premium feel.
 *
 * Accessibility: framer-motion respects `prefers-reduced-motion`
 * globally via `<MotionConfig reducedMotion="user">` in AppProviders.
 * When the OS-level preference is enabled, all animations resolve
 * instantly (duration 0) without altering the component tree, so
 * hydration remains consistent and content is visible immediately.
 *
 * Use for section reveals on the landing page. Keep above-the-fold
 * critical content OUT of FadeIn so it is visible without JS.
 */
export function FadeIn({ children, delay = 0, y = 16, className }: FadeInProps): ReactElement {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
