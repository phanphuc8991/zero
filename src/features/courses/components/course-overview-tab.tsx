"use client";
import { useRef } from "react";
import { Controller } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
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
import type { CourseFormInput } from "@/features/courses/contants";

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

interface Props {
  control: Control<CourseFormInput>;
  errors: FieldErrors<CourseFormInput>;
  setValue: UseFormSetValue<CourseFormInput>;
  getValues: UseFormGetValues<CourseFormInput>;
  thumbnailFileRef: React.RefObject<File | null>;
  showStatus?: boolean;
}

export function CourseOverviewTab({
  control,
  errors,
  setValue,
  getValues,
  thumbnailFileRef,
  showStatus = false,
}: Props) {
  const { categories, instructors, isCategoriesLoading, isInstructorsLoading } =
    useCourseStore(
      useShallow((state) => ({
        categories: state.categories,
        instructors: state.instructors,
        isCategoriesLoading: state.isCategoriesLoading,
        isInstructorsLoading: state.isInstructorsLoading,
      })),
    );

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

        {showStatus && (
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
        )}
      </div>
    </div>
  );
}
