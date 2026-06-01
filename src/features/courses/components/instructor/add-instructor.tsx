"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InstructorFormInput,
  instructorFormSchema,
} from "@/features/courses/contants";
import { newInstructorAction } from "@/features/courses/actions";

interface AddInstructorProps {
  onSuccess: () => void;
}

export function AddInstructor({ onSuccess }: AddInstructorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InstructorFormInput>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: { name: "", title: "", avatarUrl: "", bio: "" },
  });

  const { execute, isExecuting } = useAction(newInstructorAction, {
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
    },
    onSuccess: () => {
      setServerError("");
      setIsModalOpen(false);
      reset();
      toast.success("Instructor created successfully");
      onSuccess();
    },
  });

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          reset();
          setServerError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <Plus size={16} /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-120"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New Instructor</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => execute(data))}
          className="space-y-4 pt-2"
        >
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
                <p
                  aria-live="polite"
                  role="alert"
                  className="text-destructive text-xs mt-2"
                >
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
                <p
                  aria-live="polite"
                  role="alert"
                  className="text-destructive text-xs mt-2"
                >
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
                <p
                  aria-live="polite"
                  role="alert"
                  className="text-destructive text-xs mt-2"
                >
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

          {serverError && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-xs font-medium"
            >
              Error: {serverError}
            </div>
          )}

          <DialogFooter className="py-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isExecuting} className="gap-2">
              {isExecuting ? (
                <Loader2 className="animate-spin" size={15} />
              ) : (
                <Save size={15} />
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
