"use client";
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
            minutes: editingLessonData.minutes,
            seconds: editingLessonData.seconds,
            isPreview: !!editingLessonData.isPreview,
          }
        : {
            title: "",
            videoUrl: "",
            minutes: "",
            seconds: "",
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
                <p className="text-destructive text-xs mt-2">
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
                    placeholder="YouTube, Vimeo, HLS link..."
                    aria-invalid={!!errors.videoUrl}
                  />
                )}
              />
              {errors.videoUrl && (
                <p className="text-destructive text-xs mt-2">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>
          </Field>

          <Field>
            <FieldLabel>Duration(minutes,seconds)</FieldLabel>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Controller
                    control={control}
                    name="minutes"
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ""}
                        type="text"
                        placeholder="minutes"
                        aria-invalid={!!errors.minutes}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="seconds"
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ""}
                        type="text"
                        placeholder="seconds"
                        aria-invalid={!!errors.seconds}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  {errors.minutes && (
                    <p className="text-destructive text-xs">
                      {errors.minutes.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  {errors.seconds && (
                    <p className="text-destructive text-xs">
                      {errors.seconds.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Field>

          <div className="w-full py-4 px-4 border rounded-xl bg-muted/10">
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
