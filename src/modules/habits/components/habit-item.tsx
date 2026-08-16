"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type HabitView } from "../types";
import {
  toggleHabitCompletionAction,
  updateHabitAction,
  deleteHabitAction,
  archiveHabitAction,
  unarchiveHabitAction,
} from "../actions";
import HabitForm from "./habit-form";
import WeeklyGrid from "./weekly-grid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon, PencilIcon, TrashIcon, ArchiveIcon } from "lucide-react";

type HabitItemProps = {
  habit: HabitView;
};

export default function HabitItem({ habit }: HabitItemProps) {
  const [optimisticCompleted, setOptimisticCompleted] = useState(habit.completedToday);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    const next = !optimisticCompleted;
    setOptimisticCompleted(next);
    startTransition(async () => {
      const result = await toggleHabitCompletionAction(habit.id);
      if (result.success) {
        toast.success(next ? "Completed!" : "Uncompleted");
        router.refresh();
      } else {
        setOptimisticCompleted(!next);
        toast.error(result.message ?? "Failed to update");
      }
    });
  };

  const handleUpdate = async (values: { name: string; description?: string | null }) => {
    const result = await updateHabitAction(habit.id, values);
    if (result.success) {
      setIsEditing(false);
      router.refresh();
    }
    return result;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteHabitAction(habit.id);
    if (result.success) {
      toast.success("Habit deleted");
      router.refresh();
    } else {
      setIsDeleting(false);
      toast.error(result.message ?? "Failed to delete");
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    const result = habit.archived
      ? await unarchiveHabitAction(habit.id)
      : await archiveHabitAction(habit.id);
    if (result.success) {
      toast.success(habit.archived ? "Habit unarchived" : "Habit archived");
      router.refresh();
    } else {
      setIsArchiving(false);
      toast.error(result.message ?? "Failed to archive");
    }
  };

  return (
    <div
      className={
        "group flex items-center justify-between rounded-lg border p-4 transition-colors " +
        (habit.completedToday
          ? "border-[--chart-2]/40 bg-[--chart-2]/5"
          : "border-border hover:border-border/80")
      }
    >
      <div className="min-w-0 flex-1">
        <p
          className={
            "truncate text-sm font-medium " +
            (habit.completedToday ? "text-[--chart-6] line-through" : "")
          }
        >
          {habit.name}
        </p>
        {habit.description && (
          <p className="text-muted-foreground truncate text-xs">{habit.description}</p>
        )}
        <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            🔥 {habit.currentStreak} day{habit.currentStreak !== 1 ? "s" : ""}
          </span>
          {habit.bestStreak > 0 && <span>Best: {habit.bestStreak}</span>}
        </div>
        <WeeklyGrid
          name={habit.name}
          completedDays={new Set(habit.completedDays)}
          streak={habit.currentStreak}
        />
      </div>

      <div className="ml-4 flex items-center gap-2">
        {/* Completion toggle */}
        <Button
          variant={optimisticCompleted ? "default" : "outline"}
          size="icon-sm"
          onClick={handleToggle}
          disabled={isPending}
          aria-label={optimisticCompleted ? "Mark as incomplete" : "Mark as complete"}
          title={optimisticCompleted ? "Completed today" : "Click to complete"}
        >
          <CheckIcon className="h-4 w-4" />
        </Button>

        {/* Edit — appears on hover/focus */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsEditing(true)}
          className="opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
          aria-label="Edit habit"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>

        {/* Archive — appears on hover/focus */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleArchive}
          disabled={isArchiving}
          className="opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
          aria-label={habit.archived ? "Unarchive habit" : "Archive habit"}
          title={habit.archived ? "Unarchive" : "Archive"}
        >
          {isArchiving ? <span className="text-xs">…</span> : <ArchiveIcon className="h-4 w-4" />}
        </Button>

        {/* Delete — appears on hover/focus */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
          aria-label="Delete habit"
        >
          {isDeleting ? <span className="text-xs">…</span> : <TrashIcon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <HabitForm
            mode="edit"
            initial={{ name: habit.name, description: habit.description }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitLabel="Save changes"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
