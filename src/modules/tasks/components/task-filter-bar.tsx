// TaskFilterBar — the Tasks page filter + sort controls (M8).
//
// A pure-presentational SERVER component. The URL is the single source of
// truth: each control is a `next/link` that writes `?filter=` / `?sort=` query
// params (preserving the other control's current value). Selecting a value is
// therefore navigation — the page re-renders on the server, the existing M4
// service re-runs `getTasks`, and the list re-suspends under the page's
// `<Suspense>` boundary. No client component is added, no business logic is
// duplicated here, and the URL stays shareable + back-button-friendly.
//
// Filter/sort semantics (what "today"/"upcoming" mean, nulls-last due-date
// sort, priority rank, newest-first created) all live in the service — this
// component only knows the human labels and the query-param values.
import Link from "next/link";

import { cn } from "@/lib/utils";
import { type TaskFilter, type TaskSort } from "../types";

interface TaskFilterBarProps {
  /** The currently-applied filter, used for active state + href building. */
  filter: TaskFilter;
  /** The currently-applied sort, used for active state + href building. */
  sort: TaskSort;
}

// Display-only label↔value pairs. The `value`s are the exact `TaskFilter` /
// `TaskSort` union members the service switches on, so they cannot drift from
// the type. Adding a union member is caught exhaustively in the service switch
// (the guardrail); this array is presentation, so it must be updated by hand
// when a new option ships.
const FILTER_OPTIONS: readonly { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

const SORT_OPTIONS: readonly { value: TaskSort; label: string }[] = [
  { value: "dueDate", label: "Due" },
  { value: "priority", label: "Priority" },
  { value: "createdAt", label: "Created" },
];

/**
 * Build a query string that sets one control and preserves the other. Both
 * params are always present — explicit + predictable, and the page's
 * validation (`asFilter`/`asSort`) treats the defaults identically whether or
 * not they appear in the URL.
 */
function buildHref(filter: TaskFilter, sort: TaskSort): string {
  return `?filter=${filter}&sort=${sort}`;
}

export function TaskFilterBar({ filter, sort }: TaskFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Filter — All / Today / Upcoming / Completed */}
      <div
        role="group"
        aria-label="Filter tasks"
        className="bg-muted/40 border-border/60 inline-flex items-center gap-0.5 rounded-lg border p-0.5"
      >
        {FILTER_OPTIONS.map((option) => {
          const active = option.value === filter;
          return (
            <Link
              key={option.value}
              href={buildHref(option.value, sort)}
              aria-current={active ? "true" : undefined}
              scroll={false}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                active
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
              )}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      {/* Sort — Due / Priority / Created */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs font-medium">Sort by</span>
        <div
          role="group"
          aria-label="Sort tasks"
          className="bg-muted/40 border-border/60 inline-flex items-center gap-0.5 rounded-lg border p-0.5"
        >
          {SORT_OPTIONS.map((option) => {
            const active = option.value === sort;
            return (
              <Link
                key={option.value}
                href={buildHref(filter, option.value)}
                aria-current={active ? "true" : undefined}
                scroll={false}
                className={cn(
                  "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                )}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
