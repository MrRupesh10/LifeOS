"use client";

/**
 * TaskForm — reusable create/edit form (react-hook-form + shared Zod schema).
 *
 * Shared by the "new task" and "edit task" dialogs. Validation rules come from
 * `validation.ts` — the SAME schemas the M5 server actions run — so there is
 * no drift between the client-side form errors and the server-side authority.
 *
 * It does NOT touch the database. The actual mutation is whatever async
 * `onSubmit` the parent wires up (in practice: an M5 Server Action). On
 * success it toasts, resets, and calls `onSuccess` (the dialog closes + the
 * server list refreshes). On failure it toasts the message and stays open.
 */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createTaskSchema, type CreateTaskFormData } from "../validation";
import { type Task } from "../types";

export interface TaskFormProps {
  mode: "create" | "edit";
  /** Present only when editing — used to prefill the fields. */
  initial?: Task;
  submitLabel: string;
  /** Returns the Server Action's ServiceResult-shaped reply. */
  onSubmit: (values: CreateTaskFormData) => Promise<{ success: boolean; message?: string }>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/** Shape a Task row into form values (ISO timestamp → date-only input value). */
function toFormValues(task: Task): CreateTaskFormData {
  return {
    title: task.title,
    description: task.description ?? "",
    dueDate: task.dueDate?.slice(0, 10) ?? "",
    priority: task.priority,
  };
}

/** Normalize empty optionals to `null` so the DB stores clean NULLs. */
function toPayload(values: CreateTaskFormData): CreateTaskFormData {
  return {
    ...values,
    description: values.description && values.description.trim() !== "" ? values.description : null,
    dueDate: values.dueDate && values.dueDate.trim() !== "" ? values.dueDate : null,
  };
}

export function TaskForm({
  mode,
  initial,
  submitLabel,
  onSubmit,
  onSuccess,
  onCancel,
}: TaskFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: initial ? toFormValues(initial) : undefined,
  });

  async function onFormSubmit(values: CreateTaskFormData) {
    setSubmitting(true);
    try {
      const result = await onSubmit(toPayload(values));
      if (!result.success) {
        toast.error(result.message ?? "Something went wrong. Please try again.");
        return;
      }
      toast.success(mode === "edit" ? "Task updated." : "Task created.");
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What needs to be done?"
          autoFocus
          aria-invalid={!!errors.title}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-destructive text-sm" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Add any helpful details…"
          aria-invalid={!!errors.description}
          {...register("description")}
          className="border-input bg-background focus-visible:ring-ring placeholder:text-muted-foreground/60 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
        />
        {errors.description && (
          <p className="text-destructive text-sm" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="dueDate">
            Due date <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            id="dueDate"
            type="date"
            aria-invalid={!!errors.dueDate}
            {...register("dueDate")}
          />
          {errors.dueDate && (
            <p className="text-destructive text-sm" role="alert">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            aria-invalid={!!errors.priority}
            {...register("priority")}
            className="border-input bg-background focus-visible:ring-ring h-9 w-full rounded-md border px-2 text-sm shadow-xs outline-none focus-visible:ring-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <p className="text-destructive text-sm" role="alert">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : submitLabel}
        </Button>
      </div>
    </form>
  );
}
