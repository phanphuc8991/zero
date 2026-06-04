"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { ArrowLeft, Save, Rocket, Trash2, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type CourseFormInput,
  courseFormSchema,
} from "@/features/courses/contants";
import {
  getCourseByIdAction,
  editCourseAction,
} from "@/features/courses/actions";
import { useCourseStore } from "@/stores/useCourseStore";
import { useUploadThumbnail } from "@/hooks/useUploadThumbnail";
import { ThumbnailUpload } from "@/components/thumbnail-upload";
import { ChapterColumn } from "@/features/courses/components/chapter-column";
import { LessonItem } from "@/features/courses/components/lesson-item";
import { DragDropProvider } from "@dnd-kit/react";
import { PointerSensor, KeyboardSensor } from "@dnd-kit/dom";
import { move } from "@dnd-kit/helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  videoUrl: string | null;
  durationSeconds: number;
  sortOrder: number;
  isPreview: boolean;
}

interface ChapterInfo {
  id: number;
  title: string;
  sortOrder: number;
}
export default function EditCourse(props: { courseId: string }) {
  const router = useRouter();
  const courseId = Number(props?.courseId);
  const [serverError, setServerError] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    null,
  );
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [isCurrentFormDirty, setIsCurrentFormDirty] = useState(false);

  const [pendingLessonId, setPendingLessonId] = useState<number | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const thumbnailFileRef = useRef<File | null>(null);
  const handleUpdateChapterTitle = (columnKey: string, newTitle: string) => {
    setChapterDetails((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        title: newTitle,
      },
    }));
  };

  const handleConfirmDiscard = () => {
    setEditingLessonId(pendingLessonId);
    setIsCurrentFormDirty(false);
    setIsAlertOpen(false);
    setPendingLessonId(null);
  };

  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const handleUpdateLessonFields = (
    columnKey: string,
    lessonId: number,
    fieldsToUpdate: Partial<Lesson>,
  ) => {
    setItems((prevItems) => {
      const currentLessons = prevItems[columnKey] || [];
      const updatedLessons = currentLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...fieldsToUpdate } : lesson,
      );
      return {
        ...prevItems,
        [columnKey]: updatedLessons,
      };
    });
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const newColumnKey = `chapter-key-${Date.now()}`;
    const newChapterId = Math.floor(Math.random() * 10000);
    setChapterDetails((prev) => ({
      ...prev,
      [newColumnKey]: {
        id: newChapterId,
        title: newChapterTitle.trim(),
        sortOrder: Object.keys(prev).length,
      },
    }));
    setItems((prev) => ({
      ...prev,
      [newColumnKey]: [],
    }));
    setColumnOrder((prev) => [...prev, newColumnKey]);
    setNewChapterTitle("");
    setIsAddingChapter(false);
  };

  const handleAddLesson = (columnKey: string, lessonTitle: string) => {
    if (!lessonTitle.trim()) return;

    const newLessonId = Math.floor(Math.random() * 100000);
    const currentLessons = items[columnKey] || [];

    const newLesson: Lesson = {
      id: newLessonId,
      chapterId: chapterDetails[columnKey]?.id || 0,
      title: lessonTitle.trim(),
      videoUrl: "",
      durationSeconds: 0,
      sortOrder: currentLessons.length,
      isPreview: false,
    };
    setItems((prev) => ({
      ...prev,
      [columnKey]: [...currentLessons, newLesson],
    }));
  };

  const { upload, isUploading } = useUploadThumbnail();
  const [items, setItems] = useState<{ [key: string]: Lesson[] }>({
    "chapter-key-a": [
      {
        id: 101,
        chapterId: 10,
        title: "Cài đặt môi trường NodeJS",
        videoUrl: "",
        durationSeconds: 495,
        sortOrder: 0,
        isPreview: true,
      },
      {
        id: 102,
        chapterId: 10,
        title: "Cấu trúc thư mục App Router",
        videoUrl: "",
        durationSeconds: 720,
        sortOrder: 1,
        isPreview: false,
      },
    ],
    "chapter-key-b": [
      {
        id: 201,
        chapterId: 11,
        title: "Cách tạo Dynamic Routes",
        videoUrl: "",
        durationSeconds: 900,
        sortOrder: 0,
        isPreview: false,
      },
    ],
  });
  const [chapterDetails, setChapterDetails] = useState<{
    [key: string]: ChapterInfo;
  }>({
    "chapter-key-a": { id: 10, title: "Khởi đầu với Next.js", sortOrder: 0 },
    "chapter-key-b": {
      id: 11,
      title: "Làm chủ Routing & Layout",
      sortOrder: 1,
    },
  });

  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    Object.keys(items),
  );

  const {
    categories,
    instructors,
    isCategoriesLoading,
    isInstructorsLoading,
    fetchCategories,
    fetchInstructors,
  } = useCourseStore();

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
      durationHours: 1,
      instructorId: "",
      includeCertificate: false,
      openEnrollment: true,
      status: "draft",
    },
  });
  const { execute: fetchCourse } = useAction(getCourseByIdAction, {
    onSuccess: ({ data }) => {
      setIsPageLoading(false);
      if (data?.course) {
        const course = data.course;
        setCourseTitle(course.title);
        reset({
          title: course.title ?? "",
          slug: course.slug ?? "",
          description: course.description ?? "",
          categoryId: course.categoryId ? String(course.categoryId) : "",
          level: course.level ?? "All Levels",
          durationHours: course.durationHours ?? 0,
          instructorId: course.instructorId ? String(course.instructorId) : "",
          status: course.isPublished ? "published" : "draft",
          includeCertificate: false,
          openEnrollment: true,
          thumbnailUrl: course.thumbnailUrl ?? null,
        });
      }
    },
    onError: ({ error }) => {
      setIsPageLoading(false);
      console.error("Failed to load course:", error);
      toast.error("Failed to load course");
    },
  });

  const { execute: updateCourse, isExecuting } = useAction(editCourseAction, {
    onError: ({ error }) => {
      console.log("error", error);
      setServerError(error?.serverError as string);
    },
    onSuccess: () => {
      setServerError("");
      toast.success("Course updated successfully");
    },
  });
  console.log("items", items);
  useEffect(() => {
    if (courseId) {
      fetchCourse({ courseId });
    }
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
    <div className="mx-30 max-w-350">
      <div className="w-full">
        <div
          className="flex flex-col gap-6"
          // onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">
                Update Course
              </h1>
            </div>
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

          {serverError && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 text-sm font-medium border rounded-md text-destructive bg-destructive/10 border-destructive/20"
            >
              {serverError}
            </div>
          )}

          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Course Content</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pt-4">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="p-6 bg-background border shadow-none">
                    <CardContent className="p-0">
                      <FieldSet>
                        <FieldLegend>General Information</FieldLegend>
                        <FieldDescription>
                          Provide the core setup and written info for your
                          online masterclass
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
                                      setValue(
                                        "slug",
                                        convertToSlug(e.target.value),
                                        { shouldValidate: true },
                                      );
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
                            <FieldLabel htmlFor="categoryId">
                              Category
                            </FieldLabel>
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
                                  <SelectTrigger
                                    id="course-level"
                                    ref={field.ref}
                                  >
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
                        <FieldLegend className="mb-3">Course Media</FieldLegend>
                        <Controller
                          control={control}
                          name="thumbnailUrl"
                          render={({ field }) => (
                            <ThumbnailUpload
                              value={
                                typeof field.value === "string"
                                  ? field.value
                                  : null
                              }
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
                                      field.onChange(
                                        e.target.valueAsNumber || 0,
                                      )
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <DragDropProvider
                sensors={[PointerSensor, KeyboardSensor]}
                onDragOver={(event) => {
                  const { source, target } = event.operation;
                  if (source?.type === "column" || target?.type === "column")
                    return;
                  if (source && target) {
                    const sourceId = source.id;
                    const targetId = target.id;
                    const sourceChapterKey = Object.keys(items).find((key) =>
                      items[key].some((lesson) => lesson.id === sourceId),
                    );
                    const targetChapterKey = Object.keys(items).find((key) =>
                      items[key].some((lesson) => lesson.id === targetId),
                    );
                    if (sourceChapterKey !== targetChapterKey) return;
                  }
                  setItems((prevItems) => move(prevItems, event));
                }}
                onDragEnd={(event) => {
                  const { source } = event.operation;
                  if (event.canceled || source?.type !== "column") return;
                  setColumnOrder((columns) => move(columns, event));
                }}
              >
                <div className="flex flex-col gap-4">
                  {columnOrder.map((columnKey, chapterIndex) => {
                    const chapter = chapterDetails[columnKey];
                    const lessons = items[columnKey] || [];

                    return (
                      <ChapterColumn
                        key={columnKey}
                        id={columnKey}
                        index={chapterIndex}
                        title={chapter.title}
                        lessonCount={lessons.length}
                        onUpdateTitle={handleUpdateChapterTitle}
                        onAddLesson={handleAddLesson}
                      >
                        {lessons.map((lesson, lessonIndex) => (
                          <LessonItem
                            key={lesson.id}
                            id={lesson.id}
                            title={lesson.title}
                            index={lessonIndex}
                            column={columnKey}
                            chapterIndex={chapterIndex}
                            onUpdateLesson={handleUpdateLessonFields}
                            videoUrl={lesson.videoUrl}
                            durationSeconds={lesson.durationSeconds}
                            isPreview={lesson.isPreview}
                            isEditing={editingLessonId === lesson.id}
                            onFormDirtyChange={(dirty) => {
                              if (editingLessonId === lesson.id) {
                                setIsCurrentFormDirty(dirty);
                              }
                            }}
                            setIsEditing={(editing, isFormDirty) => {
                              if (editing) {
                                console.log(
                                  "isCurrentFormDirty",
                                  isCurrentFormDirty,
                                );
                                if (
                                  editingLessonId !== null &&
                                  editingLessonId !== lesson.id &&
                                  isCurrentFormDirty
                                ) {
                                  setPendingLessonId(lesson.id);
                                  setIsAlertOpen(true);
                                  return;
                                }
                                setEditingLessonId(lesson.id);
                                setIsCurrentFormDirty(false);
                              } else {
                                if (isFormDirty) {
                                  setPendingLessonId(null);
                                  setIsAlertOpen(true);
                                } else {
                                  setEditingLessonId(null);
                                  setIsCurrentFormDirty(false);
                                }
                              }
                            }}
                          />
                        ))}
                      </ChapterColumn>
                    );
                  })}
                </div>

                {isAddingChapter ? (
                  <div className="mt-6 flex flex-col gap-2 p-4 border rounded-lg bg-background">
                    <Input
                      autoFocus
                      placeholder="Enter a new chapter title... (e.g., Chapter 3: Advanced Hooks)"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddChapter();
                        if (e.key === "Escape") {
                          setIsAddingChapter(false);
                          setNewChapterTitle("");
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setIsAddingChapter(false);
                          setNewChapterTitle("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddChapter}
                        disabled={!newChapterTitle.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="mt-6 gap-2 w-full h-12 cursor-pointer"
                    onClick={() => setIsAddingChapter(true)}
                  >
                    <Plus size={15} />
                    Add chapter
                  </Button>
                )}
              </DragDropProvider>
            </TabsContent>
          </Tabs>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  You have made modifications to this lesson. Are you sure you
                  want to discard these changes? Your edits will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                  Keep Editing
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDiscard}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Discard Changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
