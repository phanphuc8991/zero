"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Save, Rocket, Trash2 } from "lucide-react";
import {
  type CourseFormInput,
  courseFormSchema,
} from "@/features/courses/contants";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { newCourseAction } from "@/features/courses/actions";

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

export function NewCourse() {
  const [serverError, setServerError] = useState("");
  const { execute, isExecuting } = useAction(newCourseAction, {
    onError: ({ error }) => {
      console.log("error", error);
      setServerError(error?.serverError as string);
    },
    onSuccess: () => {
      setServerError("");
      alert("Course processed successfully!");
    },
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CourseFormInput>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      categoryId: "",
      level: "All Levels",
      durationHours: 0,
      instructorId: "",
      includeCertificate: false,
      openEnrollment: true,
      status: "draft",
    },
  });

  const onSubmitWithStatus = (statusValue: "draft" | "published") => {
    setValue("status", statusValue);
    handleSubmit((data) => {
      execute(data);
    })();
  };

  return (
    <div className="mx-30 max-w-350">
      <div className="w-full">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">
                Create New Course
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="cursor-pointer gap-2"
                variant="secondary"
                type="button"
                disabled={isExecuting}
              >
                <Trash2 size={15} /> Discard
              </Button>
              <Button
                className="cursor-pointer gap-2"
                variant="outline"
                type="button"
                disabled={isExecuting}
                onClick={() => onSubmitWithStatus("draft")}
              >
                <Save size={15} /> Save Draft
              </Button>
              <Button
                className="cursor-pointer gap-2"
                type="button"
                disabled={isExecuting}
                onClick={() => onSubmitWithStatus("published")}
              >
                <Rocket size={15} /> Publish
              </Button>
            </div>
          </div>

          {serverError && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 text-sm font-medium border rounded-md text-destructive bg-destructive/10 border-destructive/20"
            >
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column */}
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
                        <FieldLabel htmlFor="course-title">
                          Course Title
                        </FieldLabel>
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
                                  const generatedSlug = convertToSlug(
                                    e.target.value,
                                  );
                                  setValue("slug", generatedSlug, {
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
                        <FieldLabel htmlFor="course-slug">
                          Slug (URL Path)
                        </FieldLabel>
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
                              className="text-destructive text-xs mt-1"
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
                      Classify your course into matching categories and
                      structures
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
                              >
                                <SelectTrigger
                                  aria-invalid={!!errors.categoryId}
                                  id="categoryId"
                                  ref={field.ref}
                                  className="w-full"
                                >
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="1">
                                      AI & Automation
                                    </SelectItem>
                                    <SelectItem value="2">
                                      No-Code Mastery
                                    </SelectItem>
                                    <SelectItem value="3">
                                      UI/UX Interface
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.categoryId && (
                            <p
                              aria-live="polite"
                              className="text-destructive text-xs mt-1"
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
                                  <SelectItem value="Beginner">
                                    Beginner
                                  </SelectItem>
                                  <SelectItem value="Intermediate">
                                    Intermediate
                                  </SelectItem>
                                  <SelectItem value="Advanced">
                                    Advanced
                                  </SelectItem>
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
                    <div className="flex items-center justify-between mb-2">
                      <FieldLegend className="m-0">Course Media</FieldLegend>
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline cursor-pointer"
                      >
                        Add from URL
                      </button>
                    </div>
                    <FieldGroup>
                      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:bg-accent/40 transition cursor-pointer group bg-background">
                        <div className="mx-auto h-10 w-10 rounded-full bg-background flex items-center justify-between border shadow-sm mb-3 group-hover:scale-105 transition">
                          <UploadCloud className="mx-auto h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium block mb-1">
                          Drop your course banner here
                        </span>
                        <span className="text-xs text-muted-foreground block mb-3">
                          PNG or JPG (max. 5MB)
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          Select images
                        </Button>
                      </div>
                    </FieldGroup>
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
                          Total Duration (Hours)
                        </FieldLabel>
                        <div>
                          <Controller
                            control={control}
                            name="durationHours"
                            render={({ field }) => (
                              <Input
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber || 0)
                                }
                                aria-invalid={!!errors.durationHours}
                                id="course-duration"
                                type="number"
                                placeholder="e.g. 12"
                              />
                            )}
                          />
                          {errors.durationHours && (
                            <p
                              aria-live="polite"
                              className="text-destructive text-xs mt-1"
                              role="alert"
                            >
                              {errors.durationHours.message}
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
                              >
                                <SelectTrigger
                                  id="course-instructor"
                                  aria-invalid={!!errors.instructorId}
                                  ref={field.ref}
                                  className="w-full"
                                >
                                  <SelectValue placeholder="Select instructor" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="1">
                                      Ethan Walker
                                    </SelectItem>
                                    <SelectItem value="2">
                                      Olivia Hayes
                                    </SelectItem>
                                    <SelectItem value="3">
                                      Lucas Bennett
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.instructorId && (
                            <p
                              aria-live="polite"
                              className="text-destructive text-xs mt-1"
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
                    <FieldLegend>Status</FieldLegend>
                    <FieldGroup>
                      <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="course-status"
                              className="w-full"
                              ref={field.ref}
                            >
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="draft">
                                  <span className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                                    Draft
                                  </span>
                                </SelectItem>
                                <SelectItem value="published">
                                  <span className="inline-flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    Published
                                  </span>
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FieldDescription>
                        Set the course visibility status.
                      </FieldDescription>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
