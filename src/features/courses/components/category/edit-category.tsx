"use client";

import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Category,
  EditCategoryInput,
  editCategorySchema,
} from "@/features/courses/contants";
import { editCategoryAction } from "@/features/courses/actions";

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
interface EditProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCategory({
  isOpen,
  category,
  onClose,
  onSuccess,
}: EditProps) {
  const [serverError, setServerError] = useState("");

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<EditCategoryInput>({
    mode: "onChange",
    resolver: zodResolver(editCategorySchema),
    defaultValues: { id: 0, name: "", slug: "", description: "" },
  });

  const { execute, isExecuting } = useAction(editCategoryAction, {
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
    },
    onSuccess: () => {
      setServerError("");
      reset();
      toast.success("Category updated successfully");
      onClose();
      onSuccess();
    },
  });
  useEffect(() => {
    if (isOpen && category) {
      reset({
        id: category.id,
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
      });
    }
  }, [category, isOpen, reset]);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          setServerError("");
          onClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-120"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => {
            if (!category?.id) {
              toast.error("Missing category ID");
              return;
            }
            execute(data);
          })}
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
