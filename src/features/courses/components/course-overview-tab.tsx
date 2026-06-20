"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useUploadThumbnail } from "@/hooks/useUploadThumbnail";

import { Separator } from "@/components/ui/separator";
import {
  type CourseFormInput,
  courseFormSchema,
} from "@/features/courses/contants";
import { updateCourse } from "@/features/courses/server-action";
import { ERROR_MESSAGES_MAP } from "@/features/courses/contants-1";
import { CourseFormFields } from "./course-form-fields";
import { Badge } from "@/components/ui/badge";

export function CourseOverviewTab({
  categories,
  instructors,
  initialData,
}: any) {
  const thumbnailFileRef = useRef<File | null>(null);
  const { upload, isUploading } = useUploadThumbnail();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    setValue,
    control,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CourseFormInput>({
    mode: "onChange",
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: initialData.title ?? "",
      slug: initialData.slug ?? "",
      description: initialData.description ?? "",
      categoryId: initialData.categoryId ? String(initialData.categoryId) : "",
      level: initialData.level ?? "All Levels",
      duration: initialData.duration ?? 0,
      instructorId: initialData.instructorId
        ? String(initialData.instructorId)
        : "",
      status: initialData.isPublished ? "published" : "draft",
      thumbnailUrl: initialData.thumbnailUrl ?? null,
      targetAudience: initialData.targetAudience ?? [],
      skillsGained: initialData.skillsGained ?? [],
      features: initialData.features ?? [],
    },
  });

  const onSubmitWithStatus = (statusValue: "draft" | "published") => {
    setValue("status", statusValue);
    handleSubmit(async (data) => {
      console.log("data", data);
      setIsSubmitting(true);
      try {
        let thumbnailUrl = initialData?.thumbnailUrl || null;
        if (thumbnailFileRef.current) {
          thumbnailUrl = await upload(thumbnailFileRef.current);
          if (!thumbnailUrl)
            return toast.error("Failed to upload course thumbnail.");
        }
        const result = await updateCourse(initialData.id, {
          ...data,
          thumbnailUrl,
        });
        if (!result.success)
          return toast.error(ERROR_MESSAGES_MAP[result.error]);
        toast.success("Course updated successfully!");
      } catch {
        toast.error("Failed to update course");
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  function formatSecondsToBadge(totalSeconds: number): string {
    console.log("totalSeconds", totalSeconds);
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

  const isLoading = isSubmitting || isUploading;

  return (
    <div className="relative">
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <CourseFormFields
          control={control}
          errors={errors}
          setValue={setValue}
          categories={categories}
          instructors={instructors}
          thumbnailFileRef={thumbnailFileRef}
        />
      </form>

      <div className="absolute -top-13 right-0">
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

      <div className="absolute -top-30 right-0 flex items-center gap-2">
        <Button
          className="cursor-pointer gap-2"
          variant="destructive"
          type="button"
          disabled={isLoading}
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
            <Save size={15} />
          )}
          {getValues("status") === "published" ? "Save" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
