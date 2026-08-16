/**
 * Habits page — pure server composition.
 *
 * Mirrors the Tasks page pattern exactly:
 * 1. `getSession()` auth gate — redirect if absent
 * 2. Parse `filter` from `searchParams` (safe default)
 * 3. Compose `<SectionHeader>` + `<HabitListContent>` under `<Suspense>`
 *
 * All business logic lives in the service layer. The page is purely structural.
 */
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";
import { type HabitFilter } from "@/modules/habits/types";
import { SectionHeader } from "@/components/shared/section-header";
import HabitListContent from "@/modules/habits/components/habit-list";
import NewHabitDialog from "@/modules/habits/components/new-habit-dialog";

type SearchParams = Promise<{ filter?: string }>;

const VALID_FILTERS: readonly HabitFilter[] = ["all", "active"];

function asFilter(value: string | undefined): HabitFilter {
  return (VALID_FILTERS as readonly string[]).includes(value ?? "")
    ? (value as HabitFilter)
    : "active";
}

function ListSkeleton() {
  return (
    <div className="border-border/60 animate-pulse space-y-2 rounded-lg border p-4" aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-muted h-12 rounded-md" />
      ))}
    </div>
  );
}

export default async function HabitsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession();
  if (!session?.user.id) redirect("/login");

  const { filter: filterParam } = await searchParams;
  const filter = asFilter(filterParam);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <SectionHeader
        title="Habits"
        description="Build consistency with visual streak tracking."
        action={<NewHabitDialog />}
      />
      <Suspense fallback={<ListSkeleton />}>
        <HabitListContent userId={session.user.id} filter={filter} />
      </Suspense>
    </div>
  );
}
