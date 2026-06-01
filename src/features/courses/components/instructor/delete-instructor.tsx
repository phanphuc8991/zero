"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
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
import { Instructor } from "@/features/courses/contants";
import { deleteInstructorAction } from "@/features/courses/actions";

interface DeleteInstructorProps {
  isOpen: boolean;
  instructor: Instructor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteInstructor({
  isOpen,
  instructor,
  onClose,
  onSuccess,
}: DeleteInstructorProps) {
  const [serverError, setServerError] = useState("");

  const { execute, isExecuting } = useAction(deleteInstructorAction, {
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
    },
    onSuccess: () => {
      setServerError("");
      toast.success("Instructor deleted successfully");
      onSuccess();
      onClose();
    },
  });

  const handleDeleteSubmit = () => {
    if (!instructor?.id) {
      toast.error("Missing instructor ID");
      return;
    }
    execute({ id: instructor.id });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setServerError("");
          onClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 size={20} />
            Delete Instructor
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete the instructor{" "}
            <span className="font-semibold text-foreground">
              "{instructor?.name}"
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div
            role="alert"
            className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-xs font-medium"
          >
            Error: {serverError}
          </div>
        )}

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isExecuting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isExecuting}
            onClick={handleDeleteSubmit}
            className="gap-2 cursor-pointer"
          >
            {isExecuting ? (
              <Loader2 className="animate-spin" size={15} />
            ) : (
              <Trash2 size={15} />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
