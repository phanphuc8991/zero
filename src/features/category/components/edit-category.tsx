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
  Category,
  EditCategoryInput,
  editCategorySchema,
} from "@/features/courses/contants";
import { updateCategory } from "@/features/category/action";
import { CATEGORY_MESSAGES_MAP } from "@/features/category/contants";

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
}

export function EditCategory({ isOpen, category, onClose }: EditProps) {
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (data: EditCategoryInput) => {
    startTransition(async () => {
      const res = await updateCategory(data);
      if (!res.success) {
        toast.success(CATEGORY_MESSAGES_MAP[res.error]);
        return;
      }
      reset();
      toast.success(CATEGORY_MESSAGES_MAP[res.data.message]);
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
          <AlertDialogTitle>Edit category</AlertDialogTitle>
          <AlertDialogDescription className="sr-only"></AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <FieldLabel htmlFor="modal-edit-cat-name">Category Name</FieldLabel>
            <div>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-edit-cat-name"
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
                <p role="alert" className="text-destructive text-xs mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="modal-edit-cat-slug">
              Slug (URL Path)
            </FieldLabel>
            <div>
              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="modal-edit-cat-slug"
                    placeholder="e.g. ai-automation"
                    aria-invalid={!!errors.slug}
                  />
                )}
              />
              {errors.slug && (
                <p role="alert" className="text-destructive text-xs mt-2">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="modal-edit-cat-desc">Description</FieldLabel>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="modal-edit-cat-desc"
                  placeholder="Brief summary about this course category..."
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
