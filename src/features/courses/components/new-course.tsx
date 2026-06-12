"use client";
import { type Tag, TagInput } from "emblor-maintained";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Save, Rocket, Trash2, Loader2 } from "lucide-react";
import {
  type CourseFormInput,
  courseFormSchema,
} from "@/features/courses/contants";
import { useEffect, useId, useRef, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { newCourseAction } from "@/features/courses/actions";
import { useCourseStore } from "@/stores/useCourseStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ThumbnailUpload } from "@/components/thumbnail-upload";
import { useUploadThumbnail } from "@/hooks/useUploadThumbnail";
import InputTags from "@/components/input-tags";
import { watch } from "fs";

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
  const targetAudienceId = useId();
  const skillsGainedId = useId();
  const [activeTargetIndex, setActiveTargetIndex] = useState<number | null>(
    null,
  );
  const [activeSkillsIndex, setActiveSkillsIndex] = useState<number | null>(
    null,
  );

  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const thumbnailFileRef = useRef<File | null>(null);

  const {
    categories,
    instructors,
    isCategoriesLoading,
    isInstructorsLoading,
    fetchCategories,
    fetchInstructors,
  } = useCourseStore();
  const { upload, isUploading } = useUploadThumbnail();

  useEffect(() => {
    fetchCategories();
    fetchInstructors();
  }, []);

  const { execute, isExecuting } = useAction(newCourseAction, {
    onError: ({ error }) => {
      console.log("error", error);
      setServerError(error?.serverError as string);
    },
    onSuccess: ({ data }) => {
      setServerError("");
      toast.success("Course processed successfully!");
      router.push(`/admin/courses/${data?.course?.id}/edit`);
    },
  });

  const {
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<CourseFormInput>({
    mode: "onChange",
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      categoryId: "",
      level: "All Levels",
      duration: 0,
      instructorId: "",
      status: "draft",
      targetAudience: [],
      skillsGained: [],
    },
  });

  console.log("getValues", getValues("description"));
  console.log(" errors.targetAudience", errors.targetAudience);
  const onSubmitWithStatus = (statusValue: "draft" | "published") => {
    setValue("status", statusValue);
    handleSubmit(async (data) => {
      try {
        let thumbnailUrl: string | null = null;

        // if (thumbnailFileRef.current) {
        //   thumbnailUrl = await upload(thumbnailFileRef.current);
        //   if (!thumbnailUrl) return;
        // }
        // execute({ ...data, thumbnailUrl });
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    })();
  };
  const isLoading = isExecuting || isUploading;
  return (
    <div className="mx-15 max-w-400">
      <div className="w-full">
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">New Course</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="cursor-pointer gap-2"
                variant="destructive"
                type="button"
                disabled={isLoading}
                onClick={() => router.push("/admin/courses")}
              >
                <Trash2 size={15} /> Discard
              </Button>
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
                Publish
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
                  <CardTitle>Taget & Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldSet>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                      <Field>
                        <div>
                          <Field>
                            <FieldLabel htmlFor={targetAudienceId}>
                              Target Audience
                            </FieldLabel>
                            <Controller
                              control={control}
                              name="targetAudience"
                              render={({ field }) => {
                                const currentStringArray = field.value || [];
                                const emblorTags: Tag[] =
                                  currentStringArray.map(
                                    (textValue, index) => ({
                                      id: `target-${index}-${textValue}`,
                                      text: textValue,
                                    }),
                                  );
                                return (
                                  <div>
                                    <TagInput
                                      id={targetAudienceId}
                                      placeholder="Add targeted learner..."
                                      tags={emblorTags}
                                      activeTagIndex={activeTargetIndex}
                                      setActiveTagIndex={setActiveTargetIndex}
                                      styleClasses={{
                                        inlineTagsContainer: `border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 ${
                                          errors.targetAudience
                                            ? "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive"
                                            : ""
                                        }`,
                                        input:
                                          "w-full min-w-[80px] shadow-none px-2 h-7 focus:outline-none",
                                        tag: {
                                          body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                                          closeButton:
                                            "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 justify-center items-center transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground cursor-pointer",
                                        },
                                      }}
                                      setTags={(newTags) => {
                                        const updatedTags =
                                          typeof newTags === "function"
                                            ? newTags(emblorTags)
                                            : newTags;
                                        const pureStringArray = updatedTags.map(
                                          (tagItem) => tagItem.text,
                                        );

                                        field.onChange(pureStringArray);
                                      }}
                                    />
                                    {errors.targetAudience && (
                                      <p
                                        className="text-destructive text-xs mt-2"
                                        role="alert"
                                      >
                                        {errors.targetAudience.message}
                                      </p>
                                    )}
                                  </div>
                                );
                              }}
                            />
                          </Field>
                        </div>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor={skillsGainedId}>
                          Skills Gained
                        </FieldLabel>
                        <Controller
                          control={control}
                          name="skillsGained"
                          render={({ field }) => {
                            const emblorTags: Tag[] = (field.value || []).map(
                              (val, idx) => ({
                                id: String(idx),
                                text: val,
                              }),
                            );

                            return (
                              <div>
                                <TagInput
                                  id={skillsGainedId}
                                  placeholder="Add a gained competency..."
                                  tags={emblorTags}
                                  activeTagIndex={activeSkillsIndex}
                                  setActiveTagIndex={setActiveSkillsIndex}
                                  styleClasses={{
                                    inlineTagsContainer: `border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 ${
                                      errors.targetAudience
                                        ? "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive"
                                        : ""
                                    }`,
                                    input:
                                      "w-full min-w-[80px] shadow-none px-2 h-7 focus:outline-none",
                                    tag: {
                                      body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                                      closeButton:
                                        "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 justify-center items-center transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground cursor-pointer",
                                    },
                                  }}
                                  setTags={(newTags) => {
                                    const stringArray = (newTags as Tag[]).map(
                                      (t) => t.text,
                                    );
                                    field.onChange(stringArray);
                                  }}
                                />

                                {errors.skillsGained && (
                                  <p
                                    className="text-destructive text-xs mt-2"
                                    role="alert"
                                  >
                                    {errors.skillsGained.message}
                                  </p>
                                )}
                              </div>
                            );
                          }}
                        />
                      </Field>
                    </div>
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
                    <ThumbnailUpload
                      onChange={(file) => {
                        thumbnailFileRef.current = file;
                      }}
                    />
                  </FieldSet>
                </CardContent>
              </Card>
              <Card className="bg-background border shadow-none">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="">
                  <FieldSet>
                    <FieldGroup>
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
              <Card className="bg-background border shadow-none">
                <CardHeader>
                  <CardTitle>Classification & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <FieldSet>
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

                    <Field>
                      <FieldLabel htmlFor="course-level">Features</FieldLabel>
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
