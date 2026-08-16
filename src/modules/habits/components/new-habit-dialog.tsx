"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HabitForm from "./habit-form";
import { createHabitAction } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function NewHabitDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: { name: string; description?: string | null }) => {
    const result = await createHabitAction(values);
    if (result.success) {
      setOpen(false);
      router.refresh();
    }
    return result;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Habit</DialogTitle>
          <DialogDescription>Create a new habit to track daily.</DialogDescription>
        </DialogHeader>
        <HabitForm mode="create" onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
