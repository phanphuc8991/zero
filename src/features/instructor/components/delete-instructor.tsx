"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Instructor } from "@/features/courses/contants";
import { deleteInstructor } from "@/features/instructor/actions";
import { INSTRUCTOR_MESSAGES_MAP } from "@/features/instructor/contants";

interface DeleteProps {
  isOpen: boolean;
  instructor: Instructor | null;
  onClose: () => void;
}

export function DeleteInstructor({ isOpen, instructor, onClose }: DeleteProps) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteSubmit = () => {
    if (!instructor?.id) {
      toast.error("Missing instructor ID");
      return;
    }

    startTransition(async () => {
      const res = await deleteInstructor({ id: instructor.id });
      if (!res.success) {
        toast.error(INSTRUCTOR_MESSAGES_MAP[res.error]);
        return;
      }
      toast.success(INSTRUCTOR_MESSAGES_MAP[res.data.message]);
      onClose();
    });
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <AlertDialogContent
        className="sm:max-w-md"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AlertDialogTitle className="sr-only"></AlertDialogTitle>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 size={20} />
            Delete Instructor
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2">
            Are you sure you want to delete the instructor{" "}
            <span className="font-semibold text-foreground">
              "{instructor?.name}"
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDeleteSubmit}
            className="gap-2 cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={15} />
            ) : (
              <Trash2 size={15} />
            )}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
