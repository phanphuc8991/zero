"use client";
import { useEffect, useRef, useState, useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Save,
  Rocket,
  Trash2,
  Loader2,
  X,
  ChevronsUpDown,
  Check,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadThumbnail } from "@/hooks/useUploadThumbnail";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  editCourseAction,
  getCourseByIdAction,
} from "@/features/courses/actions";
import { useAction } from "next-safe-action/hooks";
import { type Tag, TagInput } from "emblor-maintained";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const courseFeaturesList = [
  { value: "professional-certificate", label: "Professional certificate" },
  { value: "flexibl-learning-path", label: "Flexible learning path" },
  { value: "24/7-support", label: "24/7 support" },
  { value: "downloadable-materials", label: "Downloadable materials" },
];

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

  const [openFeatures, setOpenFeatures] = useState(false);
  const targetAudienceId = useId();
  const skillsGainedId = useId();
  const [activeTargetIndex, setActiveTargetIndex] = useState<number | null>(
    null,
  );
  const [activeSkillsIndex, setActiveSkillsIndex] = useState<number | null>(
    null,
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
      features: [],
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
          targetAudience: course.targetAudience ?? [],
          skillsGained: course.skillsGained ?? [],
          features: course.features ?? [],
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
  console.log("errors", errors);
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
  function formatSecondsToBadge(totalSeconds: number): string {
    if (!totalSeconds || totalSeconds <= 0) return "0s";

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const parts: string[] = [];

    if (h > 0) {
      parts.push(`${h}h`);
    }

    if (m > 0 || (h > 0 && s > 0)) {
      parts.push(`${m}m`);
    }

    if (s > 0 || parts.length === 0) {
      parts.push(`${s}s`);
    }

    return parts.join(" ");
  }
  return (
    <div className="relative grid lg:grid-cols-3 gap-6 items-start">
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
                </Field>

                <Field>
                  <FieldLabel htmlFor="course-slug">Slug (URL Path)</FieldLabel>

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
                  <FieldDescription>
                    Detailed information about the course syllabus,
                    requirements, and target audience.
                  </FieldDescription>
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
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                <Field>
                  <FieldLabel htmlFor={targetAudienceId}>
                    Target Audience
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="targetAudience"
                    render={({ field }) => {
                      const currentStringArray = field.value || [];
                      const emblorTags: Tag[] = currentStringArray.map(
                        (textValue, index) => ({
                          id: `target-${index}-${textValue}`,
                          text: textValue,
                        }),
                      );
                      return (
                        <div>
                          <TagInput
                            maxTags={5}
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
                              {errors.targetAudience.message ||
                                (Array.isArray(errors.targetAudience) &&
                                  errors.targetAudience.find(Boolean)?.message)}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={skillsGainedId}>
                    Skills Gained
                  </FieldLabel>
                  <Controller
                    control={control}
                    name="skillsGained"
                    render={({ field }) => {
                      const currentStringArray = field.value || [];
                      const emblorTags: Tag[] = currentStringArray.map(
                        (textValue, index) => ({
                          id: `skills-${index}-${textValue}`,
                          text: textValue,
                        }),
                      );
                      return (
                        <div>
                          <TagInput
                            maxTags={5}
                            id={skillsGainedId}
                            placeholder="Add a gained competency..."
                            tags={emblorTags}
                            activeTagIndex={activeSkillsIndex}
                            setActiveTagIndex={setActiveSkillsIndex}
                            styleClasses={{
                              inlineTagsContainer: `border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1 ${
                                errors.skillsGained
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
                          {errors.skillsGained && (
                            <p
                              className="text-destructive text-xs mt-2"
                              role="alert"
                            >
                              {errors.skillsGained.message ||
                                (Array.isArray(errors.skillsGained) &&
                                  errors.skillsGained.find(Boolean)?.message)}
                            </p>
                          )}
                        </div>
                      );
                    }}
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

        <Card className="bg-background border shadow-none">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
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
              <FieldGroup>
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
                <Field>
                  <FieldLabel htmlFor="course-features">Features</FieldLabel>
                  <Controller
                    control={control}
                    name="features"
                    render={({ field }) => {
                      const selectedValues: string[] = field.value || [];
                      const handleUnselect = (itemValue: string) => {
                        const updatedValues = selectedValues.filter(
                          (v) => v !== itemValue,
                        );
                        field.onChange(updatedValues);
                      };
                      const handleSelect = (currentValue: string) => {
                        const updatedValues = selectedValues.includes(
                          currentValue,
                        )
                          ? selectedValues.filter((v) => v !== currentValue)
                          : [...selectedValues, currentValue];
                        field.onChange(updatedValues);
                      };
                      return (
                        <div className="w-full">
                          <Popover
                            open={openFeatures}
                            onOpenChange={setOpenFeatures}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                id="course-features"
                                variant="outline"
                                role="combobox"
                                aria-expanded={openFeatures}
                                className={cn(
                                  "w-full justify-between min-h-10 h-auto p-2 border-input text-left font-normal shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50",
                                  errors.features
                                    ? "border-destructive focus-within:ring-destructive/20 focus-within:border-destructive"
                                    : "",
                                )}
                              >
                                <div className="flex gap-1 flex-wrap items-center">
                                  {selectedValues.length === 0 && (
                                    <span className="text-muted-foreground text-sm">
                                      Select features...
                                    </span>
                                  )}
                                  {selectedValues.map((valueItem) => {
                                    const featureObj = courseFeaturesList.find(
                                      (f) => f.value === valueItem,
                                    );
                                    return (
                                      <Badge
                                        variant="secondary"
                                        key={valueItem}
                                        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleUnselect(valueItem);
                                        }}
                                      >
                                        {featureObj
                                          ? featureObj.label
                                          : valueItem}

                                        <span
                                          role="button"
                                          className="ml-0.5 rounded-full outline-none text-muted-foreground/80 hover:text-foreground cursor-pointer flex items-center justify-center"
                                          onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleUnselect(valueItem);
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </span>
                                      </Badge>
                                    );
                                  })}
                                </div>
                                <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-(--radix-popover-trigger-width) p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search feature..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No feature found.</CommandEmpty>
                                  <CommandGroup>
                                    {courseFeaturesList.map((feature) => (
                                      <CommandItem
                                        key={feature.value}
                                        value={feature.value}
                                        onSelect={() =>
                                          handleSelect(feature.value)
                                        }
                                        className="cursor-pointer"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValues.includes(
                                              feature.value,
                                            )
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {feature.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          {errors.features && (
                            <p
                              className="text-destructive text-xs mt-2"
                              role="alert"
                            >
                              {errors.features.message}
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <div className="absolute -top-10 right-0">
          <div className="flex justify-between items-center gap-2">
            <Badge className="h-7 px-3 gap-2 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 font-semibold">
              <Clock className="h-3.5 w-3.5" />
              {formatSecondsToBadge(getValues("duration"))}
            </Badge>
            <Separator orientation="vertical" className="h-4" />
            <div>
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
