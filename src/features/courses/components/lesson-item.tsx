"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSortable } from "@dnd-kit/react/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, GripVertical, Play, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
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
  durationSeconds: z
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
  durationSeconds: number;
  sortOrder: number;
  isPreview: boolean;
}

interface ItemProps {
  id: number;
  title: string;
  index: number;
  column: string;
  chapterIndex: number;
  videoUrl: string | null;
  durationSeconds: number;
  isPreview: boolean;
  onUpdateLesson?: (
    columnKey: string,
    lessonId: number,
    fields: Partial<Lesson>,
  ) => void;
}

export function LessonItem({
  id,
  title,
  index,
  column,
  chapterIndex,
  videoUrl,
  durationSeconds,
  isPreview,
  onUpdateLesson,
}: ItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LessonFormInput>({
    resolver: zodResolver(lessonFormSchema),
    mode: "onTouched",
    defaultValues: {
      title: title,
      videoUrl: videoUrl,
      durationSeconds: durationSeconds,
      isPreview: isPreview,
    },
  });

  // useEffect(() => {
  //   reset({ title, videoUrl, durationSeconds, isPreview });
  // }, [title, videoUrl, durationSeconds, isPreview, reset]);

  const onValidSubmit = (data: LessonFormInput) => {
    if (onUpdateLesson) {
      onUpdateLesson(column, id, {
        title: data.title,
        videoUrl: data.videoUrl || null,
        durationSeconds: data.durationSeconds,
        isPreview: data.isPreview,
      });
    }
    setIsEditing(false);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const { ref, isDragging } = useSortable({
    id,
    index,
    type: "item",
    accept: "item",
    group: column,
    data: { chapterId: column },
    disabled: isEditing,
  });

  // useEffect(() => {
  //   if (isEditing && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [isEditing]);

  return (
    <Card
      className={`p-4 bg-background border shadow-none transition-opacity ${
        isDragging ? "opacity-40 border-dashed border-gray-400" : ""
      }`}
      ref={ref}
    >
      <CardContent className="p-0">
        {isEditing ? (
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
              {/* Lesson Title */}
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
                        ref={(e) => {
                          field.ref(e);
                          // @ts-ignore
                          inputRef.current = e;
                        }}
                        placeholder="Enter lesson title..."
                        aria-invalid={!!errors.title}
                        className={
                          errors.title
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                      />
                    )}
                  />
                  {errors.title && (
                    <p
                      aria-live="polite"
                      className="text-destructive mt-1.5"
                      role="alert"
                    >
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Video URL */}
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
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                          placeholder=""
                          aria-invalid={!!errors.videoUrl}
                          className={
                            errors.videoUrl
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />
                      )}
                    />
                    {errors.videoUrl && (
                      <p
                        aria-live="polite"
                        className="text-destructive  mt-1.5"
                        role="alert"
                      >
                        {errors.videoUrl.message}
                      </p>
                    )}
                  </div>
                </Field>

                {/* Duration */}
                <Field>
                  <FieldLabel className=" font-semibold text-muted-foreground">
                    Duration (Seconds)
                  </FieldLabel>
                  <div>
                    <Controller
                      control={control}
                      name="durationSeconds"
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                          aria-invalid={!!errors.durationSeconds}
                          className={
                            errors.durationSeconds
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                        />
                      )}
                    />
                    {errors.durationSeconds && (
                      <p
                        aria-live="polite"
                        className="text-destructive  mt-1.5"
                        role="alert"
                      >
                        {errors.durationSeconds.message}
                      </p>
                    )}
                  </div>
                </Field>
              </div>

              {/* Free Preview Checkbox */}
              <div className="flex items-center gap-2 py-1">
                <Controller
                  control={control}
                  name="isPreview"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      id={`preview-${id}`}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary cursor-pointer"
                    />
                  )}
                />
                <label
                  htmlFor={`preview-${id}`}
                  className=" font-medium cursor-pointer select-none"
                >
                  Allow students to watch this lesson as a free preview
                </label>
              </div>
            </FieldGroup>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 "
                onClick={() => {
                  reset();
                  setIsEditing(false);
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
                    {durationSeconds > 0
                      ? formatDuration(durationSeconds)
                      : "0:00"}
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
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={15} />
              </Button>
              <Button variant="outline" className="gap-2" type="button">
                <Trash2 size={15} className="text-[#E9122B]" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
