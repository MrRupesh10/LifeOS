"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { CreateHabitFormData } from "../validation";
import { createHabitSchema } from "../validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type HabitFormProps = {
  mode: "create" | "edit";
  /** Pre-filled values for edit mode. */
  initial?: {
    name: string;
    description: string | null;
  };
  /** Called with validated + normalized values on success. */
  onSubmit: (values: CreateHabitFormData) => Promise<{ success: boolean; message?: string }>;
  /** Called after a successful mutation. */
  onSuccess?: () => void;
  /** Cancel callback (e.g. close the parent dialog). */
  onCancel?: () => void;
  submitLabel?: string;
};

export default function HabitForm({
  mode,
  initial,
  onSubmit,
  onSuccess,
  onCancel,
  submitLabel = mode === "create" ? "Create habit" : "Save changes",
}: HabitFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateHabitFormData>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: initial?.name ?? "",
      description: initial?.description ?? null,
    },
  });

  const handleFormSubmit = async (values: CreateHabitFormData) => {
    setSubmitting(true);
    try {
      // Normalize empty description to null (HTML textarea sends "").
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || null,
      };
      const result = await onSubmit(payload);
      if (!result.success) {
        toast.error(result.message ?? "Something went wrong");
        return;
      }
      toast.success(mode === "create" ? "Habit created" : "Habit updated");
      reset();
      if (mode === "create") {
        // Keep fields empty for rapid creation; don't close dialog (parent owns that).
      }
      onSuccess?.();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="habit-name">Habit name</Label>
        <Input
          id="habit-name"
          {...register("name")}
          placeholder="e.g. Read 30 minutes"
          disabled={submitting}
          autoFocus
        />
        {errors.name && (
          <p className="text-destructive text-sm" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="habit-description">
          Description <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="habit-description"
          {...register("description")}
          placeholder="A short note about this habit"
          disabled={submitting}
        />
        {errors.description && (
          <p className="text-destructive text-sm" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
