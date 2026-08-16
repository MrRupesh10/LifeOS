/**
 * HabitList — server-rendered list content (no header, no dialog).
 *
 * The page composes the `<SectionHeader>` + `<NewHabitDialog>` outside this
 * component. This file focuses purely on the list: fetching, error/empty/success
 * rendering, and delegating interactivity to `<HabitItem>`.
 */
import { EmptyState } from "@/components/shared/empty-state";
import { Repeat } from "lucide-react";
import { Card } from "@/components/shared/card";
import { type HabitFilter, type HabitView } from "../types";
import { getHabitViews } from "../services/habit-service";
import HabitItem from "./habit-item";

export default async function HabitListContent({
  userId,
  filter = "active",
}: {
  userId: string;
  filter?: HabitFilter;
}) {
  const result = await getHabitViews(userId);

  if (!result.success) {
    return (
      <Card>
        <div className="p-6 text-center text-sm text-red-600">{result.message}</div>
      </Card>
    );
  }

  const habits = result.data;

  if (habits.length === 0) {
    return (
      <Card variant="hover">
        <EmptyState
          icon={Repeat}
          headline={filter === "archived" ? "No archived habits" : "No active habits"}
          description={
            filter === "archived"
              ? "Archived habits will appear here."
              : "Create a habit to start tracking your daily progress."
          }
        />
      </Card>
    );
  }

  return (
    <Card variant="hover">
      <div className="grid gap-3">
        {habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} />
        ))}
      </div>
    </Card>
  );
}
