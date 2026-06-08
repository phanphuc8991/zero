"use client";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCourseStore } from "@/stores/useCourseStore";
import { useSortable } from "@dnd-kit/react/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, GripVertical, Play, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useShallow } from "zustand/react/shallow";

const lessonFormSchema = z.object({
  title: z.string().trim().min(1, "Lesson title cannot be empty"),
  videoUrl: z
    .string()
    .trim()
    .nullable()
    .or(
      z
        .url("Invalid video URL (must start with http:// or https://)")
        .max(0)
        .or(z.string()),
    ),
  duration: z
    .number({ error: "Duration must be a number" })
    .min(1, "Lesson duration must be greater than 0 seconds"),
  isPreview: z.boolean(),
});

type LessonFormInput = z.infer<typeof lessonFormSchema>;

interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  videoUrl: string | null;
  duration: number;
  sortOrder: number;
  isPreview: boolean;
}

interface LessonProps {
  lessonId: number;
  title: string;
  index: number;
  chapterKey: string;
  chapterIndex: number;
  videoUrl: string | null;
  duration: number;
  isPreview: boolean;
  onUpdateLesson?: (
    columnKey: string,
    lessonId: number,
    fields: Partial<Lesson>,
  ) => void;
}

export function LessonItem({
  lessonId,
  title,
  index,
  chapterKey,
  chapterIndex,
  videoUrl,
  duration,
  isPreview,
  onUpdateLesson,
}: LessonProps) {
  const { editingLessonId, isSystemLocked, openEditLesson, closeAllInputs } =
    useCourseStore(
      useShallow((state) => ({
        editingLessonId: state.editingLessonId,
        isSystemLocked: state.isSystemLocked(),
        openEditLesson: state.openEditLesson,
        closeAllInputs: state.closeAllInputs,
      })),
    );

  const editingThisLessonId = editingLessonId === lessonId;

  const { ref, isDragging } = useSortable({
    id: lessonId,
    index,
    type: "item",
    disabled: editingThisLessonId,
  });
  const {
    handleSubmit,
    control,
    // reset,
    formState: { errors, isDirty },
  } = useForm<LessonFormInput>({
    resolver: zodResolver(lessonFormSchema),
    mode: "onChange",
    defaultValues: {
      title: title,
      videoUrl: videoUrl,
      duration: duration,
      isPreview: isPreview,
    },
  });

  const onValidSubmit = (data: LessonFormInput) => {
    if (onUpdateLesson) {
      onUpdateLesson(chapterKey, lessonId, {
        title: data.title,
        videoUrl: data.videoUrl || null,
        duration: data.duration,
        isPreview: data.isPreview,
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 ${
        editingLessonId
          ? "bg-muted/30 shadow-none"
          : "bg-background border shadow-none"
      } ${isDragging ? "opacity-40 border-dashed border-gray-400" : ""}`}
      ref={ref}
    >
      <CardContent className="p-0">
        {editingThisLessonId ? (
          <form
            onSubmit={handleSubmit(onValidSubmit)}
            className="flex flex-col gap-4 w-full animate-in fade-in duration-150"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-bold">
              Edit Lesson {chapterIndex + 1}.{index + 1}
            </span>

            <FieldGroup>
              <Field>
                <FieldLabel className="font-semibold text-muted-foreground">
                  Lesson Title
                </FieldLabel>
                <div>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter lesson title..."
                        aria-invalid={!!errors.title}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="font-semibold text-muted-foreground">
                    Video URL
                  </FieldLabel>
                  <div>
                    <Controller
                      control={control}
                      name="videoUrl"
                      render={({ field }) => (
                        <Input
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                          aria-invalid={!!errors.videoUrl}
                        />
                      )}
                    />
                    {errors.videoUrl && (
                      <p
                        aria-live="polite"
                        className="text-destructive text-xs mt-2"
                        role="alert"
                      >
                        {errors.videoUrl.message}
                      </p>
                    )}
                  </div>
                </Field>

                <Field>
                  <FieldLabel className=" font-semibold text-muted-foreground">
                    Duration (Minutes)
                  </FieldLabel>
                  <div>
                    <Controller
                      control={control}
                      name="duration"
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                          aria-invalid={!!errors.duration}
                          className={
                            errors.duration
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
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
              </div>
              <div className="w-full py-4 px-4 border rounded-xl">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <Controller
                      control={control}
                      name="isPreview"
                      render={({ field }) => (
                        <Checkbox
                          id={`preview-${lessonId}`}
                          className="cursor-pointer"
                          checked={field.value}
                          onCheckedChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      )}
                    />
                    <label
                      htmlFor={`preview-${lessonId}`}
                      className="font-semibold cursor-pointer select-none text-sm"
                    >
                      Free Preview
                    </label>
                  </div>
                  <p className="text-sm ml-7 text-muted-foreground">
                    Allow students to watch this lesson as a free preview
                  </p>
                </div>
              </div>
            </FieldGroup>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 "
                onClick={() => {
                  closeAllInputs();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 ">
                Update
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <GripVertical className="w-6 h-6 cursor-pointer text-muted-foreground" />
              <Play className="w-5 h-5 text-muted-foreground" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <h4 className="font-semibold">
                    <span>{chapterIndex + 1}.</span>
                    <span>{index + 1}:</span>
                  </h4>
                  <span className=""> {title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className=" text-muted-foreground font-normal">
                    {duration > 0 ? formatDuration(duration) : "0:00"}
                  </span>
                  <Badge className="gap-1 bg-[#EAF3DF] text-[#3D6C1A] text-[10px] px-1.5 py-0 h-4 shadow-none border-none hover:bg-[#EAF3DF]">
                    <span>video</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2"
                type="button"
                onClick={() => openEditLesson(lessonId)}
                disabled={isSystemLocked}
              >
                <Pencil size={15} />
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                type="button"
                disabled={isSystemLocked}
              >
                <Trash2 size={15} className="text-[#E9122B]" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
