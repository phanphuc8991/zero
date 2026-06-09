"use client";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { ThumbnailUpload } from "@/components/thumbnail-upload";
import { useShallow } from "zustand/react/shallow";
import { useCourseStore } from "@/stores/useCourseStore";
import {
  courseFormSchema,
  type CourseFormInput,
} from "@/features/courses/contants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Rocket, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadThumbnail } from "@/hooks/useUploadThumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  editCourseAction,
  getCourseByIdAction,
} from "@/features/courses/actions";
import { useAction } from "next-safe-action/hooks";

const convertToSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export function CourseOverviewTab({ courseId }: { courseId: number }) {
  const {
    categories,
    instructors,
    isCategoriesLoading,
    fetchCategories,
    fetchInstructors,
    isInstructorsLoading,
  } = useCourseStore(
    useShallow((state) => ({
      categories: state.categories,
      instructors: state.instructors,
      isCategoriesLoading: state.isCategoriesLoading,
      isInstructorsLoading: state.isInstructorsLoading,
      fetchCategories: state.fetchCategories,
      fetchInstructors: state.fetchInstructors,
    })),
  );
  const [serverError, setServerError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const thumbnailFileRef = useRef<File | null>(null);
  const { upload, isUploading } = useUploadThumbnail();
  const {
    handleSubmit,
    setValue,
    reset,
    control,
    getValues,
    formState: { errors },
  } = useForm<CourseFormInput>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      categoryId: "",
      level: "All Levels",
      duration: 1,
      instructorId: "",
      status: "draft",
    },
  });

  const { execute: fetchCourse } = useAction(getCourseByIdAction, {
    onSuccess: ({ data }) => {
      setIsPageLoading(false);
      if (data?.course) {
        const course = data.course;
        reset({
          title: course.title ?? "",
          slug: course.slug ?? "",
          description: course.description ?? "",
          categoryId: course.categoryId ? String(course.categoryId) : "",
          level: course.level ?? "All Levels",
          duration: course.duration ?? 0,
          instructorId: course.instructorId ? String(course.instructorId) : "",
          status: course.isPublished ? "published" : "draft",
          thumbnailUrl: course.thumbnailUrl ?? null,
        });
      }
    },
    onError: ({ error }) => {
      console.log("fetch detail course faild", error);
      setIsPageLoading(false);
      toast.error("Failed to load course");
    },
  });

  // update course
  const { execute: updateCourse, isExecuting } = useAction(editCourseAction, {
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
    },
    onSuccess: () => {
      setServerError("");
      toast.success("Course updated successfully");
    },
  });

  useEffect(() => {
    if (courseId) fetchCourse({ courseId });
    fetchCategories();
    fetchInstructors();
  }, [courseId]);

  const onSubmitWithStatus = (statusValue: "draft" | "published") => {
    setValue("status", statusValue);
    handleSubmit(async (data) => {
      try {
        let thumbnailUrl = data.thumbnailUrl ?? null;
        if (thumbnailFileRef.current) {
          const uploaded = await upload(thumbnailFileRef.current);
          if (!uploaded) return;
          thumbnailUrl = uploaded;
        }
        updateCourse({ ...data, thumbnailUrl, id: courseId });
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    })();
  };

  if (isPageLoading) {
    return (
      <div className="mx-30 max-w-350">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-72 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const isLoading = isExecuting || isUploading;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-4">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 bg-background border shadow-none">
          <CardContent className="p-0">
            <FieldSet>
              <FieldLegend>General Information</FieldLegend>
              <FieldDescription>
                Provide the core setup and written info for your online
                masterclass
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="course-title">Course Title</FieldLabel>
                  <div>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="course-title"
                          placeholder="e.g. Ultimate Content Creation Mastery"
                          aria-invalid={!!errors.title}
                          onChange={(e) => {
                            field.onChange(e);
                            setValue("slug", convertToSlug(e.target.value), {
                              shouldValidate: true,
                            });
                          }}
                        />
                      )}
                    />
                    {errors.title && (
                      <p
                        aria-live="polite"
                        className="text-destructive text-xs mt-2"
                        role="alert"
                      >
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="course-slug">Slug (URL Path)</FieldLabel>
                  <div>
                    <Controller
                      control={control}
                      name="slug"
                      render={({ field }) => (
                        <Input
                          {...field}
                          aria-invalid={!!errors.slug}
                          id="course-slug"
                          placeholder="e.g. ultimate-content-creation-mastery"
                        />
                      )}
                    />
                    {errors.slug && (
                      <p
                        aria-live="polite"
                        className="text-destructive text-xs mt-2"
                        role="alert"
                      >
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="course-desc">
                    Course Description
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        id="course-desc"
                        placeholder="Write a detailed description about what students will learn..."
                        className="min-h-40 resize-none"
                      />
                    )}
                  />
                  <FieldDescription>
                    Detailed information about the course syllabus,
                    requirements, and target audience.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card className="p-6 bg-background border shadow-none">
          <CardContent className="p-0">
            <FieldSet>
              <FieldLegend>Course Taxonomy</FieldLegend>
              <FieldDescription>
                Classify your course into matching categories and structures
              </FieldDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                <Field>
                  <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                  <div>
                    <Controller
                      control={control}
                      name="categoryId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isCategoriesLoading}
                        >
                          <SelectTrigger
                            aria-invalid={!!errors.categoryId}
                            id="categoryId"
                            ref={field.ref}
                            className="w-full"
                          >
                            <SelectValue
                              placeholder={
                                isCategoriesLoading
                                  ? "Loading..."
                                  : "Select a category"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={String(category.id)}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.categoryId && (
                      <p
                        aria-live="polite"
                        className="text-destructive text-xs mt-2"
                        role="alert"
                      >
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="course-level">
                    Difficulty Level
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="level"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="course-level" ref={field.ref}>
                          <SelectValue placeholder="Select target level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">
                              Intermediate
                            </SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="All Levels">
                              All Levels
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
            </FieldSet>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-background border shadow-none">
          <CardContent className="p-0">
            <FieldSet>
              <FieldLegend className="mb-3">Course Media</FieldLegend>
              <Controller
                control={control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <ThumbnailUpload
                    value={typeof field.value === "string" ? field.value : null}
                    onChange={(file) => {
                      thumbnailFileRef.current = file;
                      field.onChange(file ? file : null);
                    }}
                  />
                )}
              />
            </FieldSet>
          </CardContent>
        </Card>

        <Card className="p-6 bg-background border shadow-none">
          <CardContent className="p-0">
            <FieldSet>
              <FieldLegend>Settings</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="course-duration">
                    Total Duration (Minutes)
                  </FieldLabel>
                  <div>
                    <Controller
                      control={control}
                      name="duration"
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          id="course-duration"
                          value={
                            field.value === 0 || Number.isNaN(field.value)
                              ? ""
                              : field.value
                          }
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          placeholder="e.g. 12"
                        />
                      )}
                    />
                    {errors.duration && (
                      <p
                        aria-live="polite"
                        className="text-destructive text-xs mt-2"
                        role="alert"
                      >
                        {errors.duration.message}
                      </p>
                    )}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="course-instructor">
                    Assigned Instructor
                  </FieldLabel>
                  <div>
                    <Controller
                      control={control}
                      name="instructorId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isInstructorsLoading}
                        >
                          <SelectTrigger
                            id="course-instructor"
                            aria-invalid={!!errors.instructorId}
                            ref={field.ref}
                            className="w-full"
                          >
                            <SelectValue
                              placeholder={
                                isInstructorsLoading
                                  ? "Loading..."
                                  : "Select instructor"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {instructors.map((instructor) => (
                                <SelectItem
                                  key={instructor.id}
                                  value={String(instructor.id)}
                                >
                                  {instructor.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.instructorId && (
                      <p
                        aria-live="polite"
                        className="text-destructive text-xs mt-2"
                        role="alert"
                      >
                        {errors.instructorId.message}
                      </p>
                    )}
                  </div>
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card className="p-6 bg-background border shadow-none">
          <CardContent className="p-0">
            <FieldSet>
              <FieldLegend>Current Status</FieldLegend>
              <div className="pt-2">
                {getValues("status") === "published" ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Published (Live)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    Draft Mode
                  </span>
                )}
              </div>
            </FieldSet>
          </CardContent>
        </Card>

        {serverError && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3 text-sm font-medium border rounded-md text-destructive bg-destructive/10 border-destructive/20"
          >
            {serverError}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            className="cursor-pointer gap-2"
            variant="destructive"
            type="button"
            disabled={isExecuting}
          >
            <Trash2 size={15} /> Delete
          </Button>
          {getValues("status") !== "published" && (
            <Button
              className="cursor-pointer gap-2"
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => onSubmitWithStatus("draft")}
            >
              {isLoading && getValues("status") === "draft" ? (
                <Loader2 className="animate-spin" size={15} />
              ) : (
                <Save size={15} />
              )}
              Save Draft
            </Button>
          )}
          <Button
            className="cursor-pointer gap-2"
            type="button"
            disabled={isLoading}
            onClick={() => onSubmitWithStatus("published")}
          >
            {isLoading && getValues("status") === "published" ? (
              <Loader2 className="animate-spin" size={15} />
            ) : (
              <Rocket size={15} />
            )}
            {getValues("status") === "published" ? "Save" : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
