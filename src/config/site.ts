/**
 * Site-wide configuration constants.
 *
 * Single source of truth for all branding and metadata.
 * Import from any server or client module — this file contains
 * only static constants, no environment or secret access.
 *
 * Pattern: Next.js ecosystem convention (shadcn, create-t3-app,
 * next-forge). Centralize branding so that changing the app name
 * or description requires one edit, not a search-and-replace
 * across every layout, page, and metadata export.
 *
 * @see src/app/layout.tsx — metadata consumer
 * @see src/app/not-found.tsx — uses siteConfig for back-link
 */
export const siteConfig = {
  name: "LifeOS",
  tagline: "Your personal operating system.",
  description:
    "Your personal operating system. Manage tasks, habits, journaling, and more from a single dashboard.",
  url: "https://lifeos.app",
  author: {
    name: "Rupesh",
    github: "https://github.com/MrRupesh10",
  },
  links: {
    github: "https://github.com/MrRupesh10/LifeOS",
  },
  keywords: [
    "personal operating system",
    "life management",
    "task manager",
    "habit tracker",
    "journaling",
    "notes",
    "project management",
    "second brain",
    "productivity",
    "open source",
  ],
  /**
   * Used for image generation (og:image, twitter:image).
   * Replace with the actual OG image URL when available.
   */
  ogImage: "/og.png",
} as const;
