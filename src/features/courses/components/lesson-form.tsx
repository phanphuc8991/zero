"use client";
import * as z from "zod";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCourseStore } from "@/stores/useCourseStore";
import { useShallow } from "zustand/react/shallow";
import { LessonFormInput, lessonFormSchema } from "@/features/courses/contants";

interface LessonFormProps {
  handleFormSubmit: (data: LessonFormInput) => void;
}

export function LessonForm({ handleFormSubmit }: LessonFormProps) {
  const { lessonDrawerMode, editingLessonData, closeLessonDrawer } =
    useCourseStore(
      useShallow((state) => ({
        lessonDrawerMode: state.lessonDrawerMode,
        editingLessonData: state.editingLessonData,
        closeLessonDrawer: state.closeLessonDrawer,
      })),
    );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LessonFormInput>({
    resolver: zodResolver(lessonFormSchema),
    mode: "onChange",

    defaultValues:
      lessonDrawerMode === "EDIT" && editingLessonData
        ? {
            title: editingLessonData.title || "",
            videoUrl: editingLessonData.videoUrl || "",
            duration: editingLessonData.duration || 0,
            isPreview: !!editingLessonData.isPreview,
          }
        : {
            title: "",
            videoUrl: "",
            duration: 0,
            isPreview: false,
          },
  });

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-5 h-full justify-between"
    >
      <div className="flex-1">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel>Lesson Title</FieldLabel>
            <div>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="e.g. Introduction to Next.js"
                    aria-invalid={!!errors.title}
                  />
                )}
              />
              {errors.title && (
                <p className="text-destructive text-xs mt-1.5">
                  {errors.title.message}
                </p>
              )}
            </div>
          </Field>
          <Field>
            <FieldLabel>Video URL</FieldLabel>
            <div>
              <Controller
                control={control}
                name="videoUrl"
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    placeholder="YouTube, Vimeo, HLS link..."
                    aria-invalid={!!errors.videoUrl}
                  />
                )}
              />
              {errors.videoUrl && (
                <p className="text-destructive text-xs mt-1.5">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel>Duration (Minutes)</FieldLabel>
            <div>
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || 0)
                    }
                    aria-invalid={!!errors.duration}
                  />
                )}
              />
              {errors.duration && (
                <p className="text-destructive text-xs mt-1.5">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </Field>

          <div className="w-full py-4 px-4 border rounded-xl bg-muted/10 mt-2">
            <div className="flex items-start gap-3">
              <Controller
                control={control}
                name="isPreview"
                render={({ field }) => (
                  <Checkbox
                    id="drawer-preview-checkbox"
                    className="cursor-pointer mt-0.5"
                    checked={field.value}
                    onCheckedChange={(e) => field.onChange(e)}
                  />
                )}
              />
              <div className="grid gap-1 leading-none">
                <label
                  htmlFor="drawer-preview-checkbox"
                  className="font-semibold cursor-pointer select-none text-sm"
                >
                  Free Preview
                </label>
                <p className="text-xs text-muted-foreground">
                  Allow students to watch this lesson for free.
                </p>
              </div>
            </div>
          </div>
        </FieldGroup>
      </div>

      <div className="flex flex-col items-center gap-2 w-full mb-4">
        <Button className="w-full" type="submit">
          {lessonDrawerMode === "CREATE" ? "Create Lesson" : "Save Changes"}
        </Button>
        <Button
          className="w-full"
          type="button"
          variant="outline"
          onClick={closeLessonDrawer}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
