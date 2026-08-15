"use client";

/**
 * TaskItem — one interactive task row (client leaf).
 *
 * Renders a single task's completion toggle, priority dot, title and due date,
 * plus edit and delete controls. It is the only client part of the list —
 * everything above it is a server component. Mutations go exclusively through
 * the M5 Server Actions (`toggleTaskCompletionAction` / `updateTaskAction` /
 * `deleteTaskAction`); it never reads or writes the database directly. After a
 * successful mutation it refreshes the route so the server-rendered `TaskList`
 * re-fetches and reflects the change.
 */
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/format-date";
import { updateTaskAction, deleteTaskAction, toggleTaskCompletionAction } from "../actions";
import { type Task } from "../types";
import { TaskForm, type TaskFormProps } from "./task-form";

/** Priority indicator; recolored to the completed token when the task is done. */
function PriorityDot({ priority, completed }: { priority: Task["priority"]; completed: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2.5 shrink-0 rounded-full border-2",
        completed
          ? "border-chart-2 bg-chart-2/20"
          : priority === "high"
            ? "border-destructive bg-destructive/20"
            : priority === "medium"
              ? "border-chart-3 bg-chart-3/20"
              : "border-chart-1 bg-chart-1/20",
      )}
    />
  );
}

export function TaskItem({ task }: { task: Task }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Optimistic completion mirror. Completion has exactly one mutation path
  // (`toggleTaskCompletionAction`, M5), so this local state is authoritative
  // between toggles: it flips immediately on click, stays on success, and
  // rolls back on failure. It is seeded from the server prop and reconciled
  // by `router.refresh()` after a successful toggle.
  const [optimisticCompleted, setOptimisticCompleted] = useState(task.status === "completed");
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // deletion in-flight → disables buttons + spinner

  const handleUpdate: TaskFormProps["onSubmit"] = async (values) =>
    updateTaskAction(task.id, values);

  function handleUpdateSuccess() {
    setEditing(false);
    router.refresh();
  }

  /**
   * Toggle completion with optimistic UI:
   *   1. flip the visual state immediately (visible before the server resolves),
   *   2. run the sole completion mutation via `toggleTaskCompletionAction`,
   *   3. on success keep the optimistic state + success toast, then
   *      `router.refresh()` to reconcile the server list with the active filter,
   *   4. on failure roll back to the pre-toggle state + error toast.
   */
  function handleToggle() {
    if (isPending) return;
    const next = !optimisticCompleted;
    setOptimisticCompleted(next); // immediate — visible before the server resolves
    startTransition(async () => {
      const result = await toggleTaskCompletionAction(task.id);
      if (result.success) {
        toast.success(next ? "Task completed." : "Task reopened.");
        router.refresh(); // pull the revalidated row + re-apply the active filter
      } else {
        setOptimisticCompleted(!next); // rollback to the pre-toggle state
        toast.error(result.message ?? "Could not update task.");
      }
    });
  }

  async function handleDelete() {
    if (isDeleting) return; // double-submit guard
    setIsDeleting(true);
    try {
      const result = await deleteTaskAction(task.id);
      if (!result.success) {
        toast.error(result.message ?? "Could not delete task.");
        return; // dialog stays open on error
      }
      toast.success("Task deleted.");
      setDeleting(false);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <li className="group hover:bg-muted/50 flex items-center gap-3 px-4 py-3 transition-colors">
      {/* Completion toggle — the only completion mutation path (see M5). */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        aria-pressed={optimisticCompleted}
        aria-label={
          optimisticCompleted ? `Mark “${task.title}” as not done` : `Mark “${task.title}” as done`
        }
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          "focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed",
          optimisticCompleted
            ? "border-chart-2 bg-chart-2 text-primary-foreground"
            : "border-border hover:border-chart-2/70",
        )}
      >
        {optimisticCompleted ? <Check className="size-3" strokeWidth={3} aria-hidden /> : null}
      </button>
      <PriorityDot priority={task.priority} completed={optimisticCompleted} />

      <span
        className={cn(
          "flex-1 text-sm",
          optimisticCompleted && "text-muted-foreground line-through",
        )}
      >
        {task.title}
      </span>

      {task.dueDate && (
        <span className="text-muted-foreground hidden text-xs sm:inline">
          {formatShortDate(task.dueDate)}
        </span>
      )}

      {/* Row actions — shown on hover so the list stays clean by default. */}
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${task.title}`}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => setDeleting(true)}
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Edit dialog */}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <DialogDescription>Update the details below.</DialogDescription>
          </DialogHeader>
          <TaskForm
            mode="edit"
            initial={task}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setEditing(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleting} onOpenChange={setDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this task?</DialogTitle>
            <DialogDescription>
              You're permanently removing “{task.title}”. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleting(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null} Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
