import {
  Home,
  CheckSquare,
  Repeat,
  BookOpen,
  FileText,
  Folders,
  Target,
  Calendar,
  Briefcase,
  Receipt,
  FileUser,
  Code2,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { NavItem, NavGroup, NavConfig } from "@/types";

/**
 * Central registry for all dashboard navigation items.
 *
 * Every component that renders navigation (Sidebar, MobileNav,
 * future Command Palette) reads from this single configuration.
 * Adding a new module = one insert here — zero changes to
 * individual nav components.
 *
 * Icons are imported explicitly (not dynamic strings) so that
 * tree-shaking works and TypeScript verifies every reference.
 */

const ICONS: Record<string, LucideIcon> = {
  dashboard: Home,
  tasks: CheckSquare,
  habits: Repeat,
  journal: BookOpen,
  notes: FileText,
  projects: Folders,
  goals: Target,
  calendar: Calendar,
  interviews: Briefcase,
  expenses: Receipt,
  resume: FileUser,
  skills: Code2,
  analytics: BarChart3,
  settings: Settings,
};

/** Primary navigation groups — rendered as labeled sections. */
const primaryNav: NavGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: Home, keyboardShortcut: "g d" },
      { title: "Tasks", href: "/dashboard/tasks", icon: CheckSquare, keyboardShortcut: "g t" },
      { title: "Habits", href: "/dashboard/habits", icon: Repeat, keyboardShortcut: "g h" },
      { title: "Journal", href: "/dashboard/journal", icon: BookOpen, keyboardShortcut: "g j" },
      { title: "Notes", href: "/dashboard/notes", icon: FileText, keyboardShortcut: "g n" },
    ],
  },
  {
    label: "Planning",
    items: [
      { title: "Projects", href: "/dashboard/projects", icon: Folders, keyboardShortcut: "g p" },
      { title: "Goals", href: "/dashboard/goals", icon: Target, keyboardShortcut: "g g" },
      { title: "Calendar", href: "/dashboard/calendar", icon: Calendar, keyboardShortcut: "g c" },
    ],
  },
  {
    label: "Career",
    items: [
      {
        title: "Interviews",
        href: "/dashboard/interviews",
        icon: Briefcase,
        keyboardShortcut: "g i",
      },
      { title: "Resume", href: "/dashboard/resume", icon: FileUser, keyboardShortcut: "g r" },
      { title: "Skills", href: "/dashboard/skills", icon: Code2, keyboardShortcut: "g k" },
      { title: "Expenses", href: "/dashboard/expenses", icon: Receipt, keyboardShortcut: "g e" },
    ],
  },
  {
    label: "Review",
    items: [
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
        keyboardShortcut: "g a",
      },
      { title: "Settings", href: "/dashboard/settings", icon: Settings, keyboardShortcut: "g s" },
    ],
  },
];

/** Footer / bottom-bar navigation items. */
const bottomNav: NavItem[] = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings, keyboardShortcut: "g s" },
];

export const navigationConfig: NavConfig = {
  primary: primaryNav,
  bottom: bottomNav,
};

/**
 * Look up a Lucide icon by its registration key.
 * Falls back to Home icon if the key is not found.
 */
export function getNavIcon(iconName: string): LucideIcon {
  return ICONS[iconName] ?? Home;
}
