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
  CategoryFormInput,
  categoryFormSchema,
} from "@/features/courses/contants";
import { createCategory } from "@/features/category/action";
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

export function AddCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (data: CategoryFormInput) => {
    startTransition(async () => {
      const res = await createCategory(data);
      if (!res.success) {
        toast.error(CATEGORY_MESSAGES_MAP[res.error]);
        return;
      }
      setIsModalOpen(false);
      reset();
      toast.success(CATEGORY_MESSAGES_MAP[res.data.message]);
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
        <AlertDialogHeader>
          <AlertDialogTitle>New Category</AlertDialogTitle>
          <AlertDialogDescription className="sr-only"></AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
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
                <p role="alert" className="text-destructive text-xs mt-2">
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
                <p role="alert" className="text-destructive text-xs mt-2">
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
