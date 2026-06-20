"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Instructor,
  EditInstructorInput,
  editInstructorSchema,
} from "@/features/courses/contants";
import { updateInstructor } from "@/features/instructor/actions";
import { INSTRUCTOR_MESSAGES_MAP } from "@/features/instructor/contants";

interface EditProps {
  isOpen: boolean;
  instructor: Instructor | null;
  onClose: () => void;
}

export function EditInstructor({ isOpen, instructor, onClose }: EditProps) {
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditInstructorInput>({
    mode: "onChange",
    resolver: zodResolver(editInstructorSchema),
    defaultValues: { id: 0, name: "", title: "", avatarUrl: "", bio: "" },
  });

  useEffect(() => {
    if (isOpen && instructor) {
      reset({
        id: instructor.id,
        name: instructor.name || "",
        title: instructor.title || "",
        avatarUrl: instructor.avatarUrl || "",
        bio: instructor.bio || "",
      });
    }
  }, [instructor, isOpen, reset]);

  const onSubmit = (data: EditInstructorInput) => {
    if (!instructor?.id) {
      toast.error("Missing instructor ID");
      return;
    }
    startTransition(async () => {
      const res = await updateInstructor(data);
      if (!res.success) {
        toast.error(INSTRUCTOR_MESSAGES_MAP[res.error]);
        return;
      }
      reset();
      toast.success(INSTRUCTOR_MESSAGES_MAP[res.data.message]);
      onClose();
    });
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          onClose();
        }
      }}
    >
      <AlertDialogContent
        className="sm:max-w-120"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AlertDialogTitle className="sr-only"></AlertDialogTitle>
        <AlertDialogHeader>
          <AlertDialogTitle
            id="AlertDialog-ins-title"
            tabIndex={-1}
            className="outline-none"
          >
            Edit Instructor
          </AlertDialogTitle>
          <AlertDialogDescription className="sr-only"></AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <FieldLabel htmlFor="modal-edit-ins-name">
              Instructor Name
            </FieldLabel>
            <div>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-edit-ins-name"
                    placeholder="e.g. John Doe"
                    aria-invalid={!!errors.name}
                  />
                )}
              />
              {errors.name && (
                <p role="alert" className="text-destructive text-xs mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="modal-edit-ins-title">
              Professional Title
            </FieldLabel>
            <div>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-edit-ins-title"
                    placeholder="e.g. AI Content Strategist"
                    aria-invalid={!!errors.title}
                  />
                )}
              />
              {errors.title && (
                <p role="alert" className="text-destructive text-xs mt-2">
                  {errors.title.message}
                </p>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="modal-edit-ins-avatar">Avatar URL</FieldLabel>
            <div>
              <Controller
                control={control}
                name="avatarUrl"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-edit-ins-avatar"
                    placeholder="https://example.com/avatar.jpg"
                    aria-invalid={!!errors.avatarUrl}
                  />
                )}
              />
              {errors.avatarUrl && (
                <p role="alert" className="text-destructive text-xs mt-2">
                  {errors.avatarUrl.message}
                </p>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="modal-edit-ins-bio">Bio</FieldLabel>
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="modal-edit-ins-bio"
                  placeholder="Brief background about this instructor..."
                  className="min-h-24 resize-none"
                />
              )}
            />
          </Field>
          <AlertDialogFooter className="py-4">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="animate-spin" size={15} />
              ) : (
                <Save size={15} />
              )}
              Save
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
