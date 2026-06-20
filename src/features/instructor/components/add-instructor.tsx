"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  InstructorFormInput,
  instructorFormSchema,
} from "@/features/courses/contants";
import { createInstructor } from "@/features/instructor/actions";
import { INSTRUCTOR_MESSAGES_MAP } from "@/features/instructor/contants";
import { VisuallyHidden } from "radix-ui";

export function AddInstructor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InstructorFormInput>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: { name: "", title: "", avatarUrl: "", bio: "" },
  });

  const onSubmit = (data: InstructorFormInput) => {
    startTransition(async () => {
      const res = await createInstructor(data);
      if (!res.success) {
        toast.error(INSTRUCTOR_MESSAGES_MAP[res.error]);
        return;
      }
      setIsModalOpen(false);
      reset();
      toast.success(INSTRUCTOR_MESSAGES_MAP[res.data.message]);
    });
  };

  return (
    <AlertDialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          reset();
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <Plus size={16} /> Add New
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="sm:max-w-120"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AlertDialogTitle className="sr-only"></AlertDialogTitle>

        <AlertDialogHeader>
          <AlertDialogTitle>New Instructor</AlertDialogTitle>
          <AlertDialogDescription className="sr-only"></AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <FieldLabel htmlFor="modal-ins-name">Instructor Name</FieldLabel>
            <div>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-ins-name"
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
            <FieldLabel htmlFor="modal-ins-title">
              Professional Title
            </FieldLabel>
            <div>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-ins-title"
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
            <FieldLabel htmlFor="modal-ins-avatar">Avatar URL</FieldLabel>
            <div>
              <Controller
                control={control}
                name="avatarUrl"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-ins-avatar"
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
            <FieldLabel htmlFor="modal-ins-bio">Bio</FieldLabel>
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="modal-ins-bio"
                  placeholder="Brief background about this instructor..."
                  className="min-h-24 resize-none"
                />
              )}
            />
          </Field>

          <AlertDialogFooter className="py-4">
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </AlertDialogCancel>
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
