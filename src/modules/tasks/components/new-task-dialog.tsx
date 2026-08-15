"use client";

/**
 * NewTaskDialog — the header "New Task" trigger + create dialog (client).
 *
 * Owns its own `open` state and renders the reusable `TaskForm` in create
 * mode. Creation is a single mutation through the M5 Server Action
 * (`createTaskAction`); on success it closes and refreshes the route so the
 * server `TaskList` re-renders with the new row. It never touches the
 * database directly.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createTaskAction } from "../actions";
import { TaskForm, type TaskFormProps } from "./task-form";

export function NewTaskDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSubmit: TaskFormProps["onSubmit"] = async (values) => createTaskAction(values);

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button className="h-9" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New Task
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>Add a task to your list.</DialogDescription>
          </DialogHeader>
          <TaskForm
            mode="create"
            submitLabel="Create task"
            onSubmit={handleSubmit}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
