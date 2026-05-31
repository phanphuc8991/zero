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
  CategoryFormInput,
  categoryFormSchema,
} from "@/features/courses/contants";
import { newCategoryAction } from "@/features/courses/actions";

const convertToSlug = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

interface AddCategoryProps {
  onSuccess: () => void;
}

export function AddCategory({ onSuccess }: AddCategoryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  const { execute, isExecuting } = useAction(newCategoryAction, {
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
    },
    onSuccess: () => {
      setServerError("");
      setIsModalOpen(false);
      reset();
      toast.success("Category created successfully");
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
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => execute(data))}
          className="space-y-4 pt-2"
        >
          <Field>
            <FieldLabel htmlFor="modal-cat-name">Category Name</FieldLabel>
            <div>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-cat-name"
                    placeholder="e.g. AI & Automation"
                    aria-invalid={!!errors.name}
                    onChange={(e) => {
                      field.onChange(e);
                      setValue("slug", convertToSlug(e.target.value), {
                        shouldValidate: true,
                      });
                    }}
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
            <FieldLabel htmlFor="modal-cat-slug">Slug (URL Path)</FieldLabel>
            <div>
              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-cat-slug"
                    placeholder="e.g. ai-automation"
                    aria-invalid={!!errors.slug}
                  />
                )}
              />
              {errors.slug && (
                <p
                  aria-live="polite"
                  role="alert"
                  className="text-destructive text-xs mt-2"
                >
                  {errors.slug.message}
                </p>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="modal-cat-desc">Description</FieldLabel>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="modal-cat-desc"
                  placeholder="Brief summary about this course category..."
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
