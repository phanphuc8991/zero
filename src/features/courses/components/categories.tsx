"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
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
import DataTable from "@/components/data-table/data-table";
import {
  CategoryFormInput,
  categoryFormSchema,
} from "@/features/courses/contants";
import {
  getCategoriesAction,
  newCategoryAction,
} from "@/features/courses/actions";
import { categoryColumns } from "@/components/data-table/category-columns";
import { toast } from "sonner";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";

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

const categoriesFilters = [
  {
    columnId: "slug",
    title: "Categories",
    options: [
      { value: "ai-prompt-engineering", label: "Artificial Intelligence (AI)" },
      { value: "no-code-development", label: "No-Code / Operations" },
      { value: "ui-ux-design", label: "UI/UX Design" },
      {
        value: "data-analytics-automation",
        label: "Data Analytics & Automation",
      },
    ],
  },
];

export default function Categories() {
  const [categoriesData, setCategoriesData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  console.log("isInitialLoading", isInitialLoading);
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
      setIsInitialLoading(true);
      fetchCategories();
    },
  });

  const { execute: fetchCategories } = useAction(getCategoriesAction, {
    onSuccess: ({ data }) => {
      setIsInitialLoading(false);
      if (data?.categories) {
        setCategoriesData(data.categories);
      }
    },
    onError: ({ error }) => {
      setIsInitialLoading(false);
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    },
  });
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Categories</h1>
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
              <Plus size={16} /> Add new
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-120"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
              <DialogDescription className="sr-only">
                Fill out the form below to create a new category for your
                courses.
              </DialogDescription>
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
                <FieldLabel htmlFor="modal-cat-slug">
                  Slug (URL Path)
                </FieldLabel>
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

                <Button
                  type="submit"
                  disabled={isExecuting}
                  className="gap-2 cursor-pointer"
                >
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
      </div>

      <DataTable
        defaultPageSize={5}
        searchColumn="name"
        columns={categoryColumns}
        data={categoriesData}
        filters={categoriesFilters}
        isLoading={isInitialLoading}
      />
    </div>
  );
}
