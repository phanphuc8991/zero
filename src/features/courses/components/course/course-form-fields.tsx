"use client";
import { Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbnailUpload } from "@/components/thumbnail-upload";
import { CategorySelect } from "@/features/courses/components/course/category-select";
import { InstructorSelect } from "@/features/courses/components/course/instructors-select";
import { SkillsGainedInput } from "@/features/courses/components/course/skills-gained-input";
import { TargetAudienceInput } from "@/features/courses/components/course/target-audience-input";
import { FeaturesSelect } from "@/features/courses/components/course/features-select";
import { CourseLevelSelect } from "@/features/courses/components/course/course-level-select";
import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { type CourseFormInput } from "@/features/courses/contants";
import { RefObject, useId } from "react";

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

interface CourseFormFieldsProps {
  control: Control<CourseFormInput>;
  errors: FieldErrors<CourseFormInput>;
  setValue: UseFormSetValue<CourseFormInput>;
  categories: any;
  instructors: any;
  thumbnailFileRef: RefObject<File | null>;
}

export function CourseFormFields({
  control,
  errors,
  setValue,
  categories,
  instructors,
  thumbnailFileRef,
}: CourseFormFieldsProps) {
  const targetAudienceId = useId();
  const skillsGainedId = useId();
  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="grid gap-6 lg:col-span-2">
        <Card className="bg-background border shadow-none">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldSet>
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
                      <p className="text-destructive text-xs mt-2">
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
                        <Input {...field} id="course-slug" />
                      )}
                    />
                    {errors.slug && (
                      <p className="text-destructive text-xs mt-2">
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
                        className="min-h-60 resize-none"
                      />
                    )}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card className="bg-background border shadow-none">
          <CardHeader>
            <CardTitle>Target & Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldSet>
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                <Field>
                  <FieldLabel htmlFor={targetAudienceId}>
                    Target Audience
                  </FieldLabel>
                  <TargetAudienceInput
                    control={control}
                    errors={errors}
                    id="target-audience"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={skillsGainedId}>
                    Skills Gained
                  </FieldLabel>
                  <SkillsGainedInput
                    control={control}
                    errors={errors}
                    id="skills-gained"
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:col-span-1">
        <Card className="bg-background border shadow-none">
          <CardHeader>
            <CardTitle>Course Media</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldSet>
              <Controller
                control={control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <ThumbnailUpload
                    value={field.value ? field.value : null}
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

        <Card className="bg-background border shadow-none">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="instructorId">Instructor</FieldLabel>
                  <InstructorSelect
                    control={control}
                    errors={errors}
                    instructors={instructors}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card className="bg-background border shadow-none">
          <CardHeader>
            <CardTitle>Classification & Features</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                  <CategorySelect
                    control={control}
                    errors={errors}
                    categories={categories}
                  />
                </Field>
                <Field>
                  <FieldLabel>Difficulty Level</FieldLabel>
                  <CourseLevelSelect control={control} />
                </Field>
                <Field>
                  <FieldLabel>Features</FieldLabel>
                  <FeaturesSelect control={control} errors={errors} />
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
