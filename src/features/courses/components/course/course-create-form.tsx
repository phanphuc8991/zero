"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Save, Rocket, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useUploadThumbnail } from "@/hooks/useUploadThumbnail";
import {
  Category,
  type CourseFormInput,
  courseFormSchema,
  Instructor,
} from "@/features/courses/contants";
import { createCourse } from "@/features/courses/server-action";
import { MESSAGES_MAP } from "@/features/courses/contants-1";
import { CourseFormFields } from "@/features/courses/components/course/course-form-fields";

export function CourseCreateForm({
  categories,
  instructors,
}: {
  categories: Category[];
  instructors: Instructor[];
}) {
  const router = useRouter();
  const thumbnailFileRef = useRef<File | null>(null);
  const { upload, isUploading } = useUploadThumbnail();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      features: [],
    },
  });

  const onSubmitWithStatus = (statusValue: "draft" | "published") => {
    setValue("status", statusValue);
    handleSubmit(async (data) => {
      setIsSubmitting(true);
      try {
        let thumbnailUrl = null;
        if (thumbnailFileRef.current) {
          thumbnailUrl = await upload(thumbnailFileRef.current);
          if (!thumbnailUrl)
            return toast.error("Failed to upload course thumbnail.");
        }
        const result = await createCourse({ ...data, thumbnailUrl });
        if (!result.success)
          return toast.error(MESSAGES_MAP[result.error], {
            duration: 5000,
          });
        toast.success(MESSAGES_MAP[result.data.message]);
        router.push("/admin/courses");
      } catch {
        toast.error(MESSAGES_MAP["COURSE_CREATION_FAILED"]);
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const isLoading = isSubmitting || isUploading;

  return (
    <div className="mx-15 max-w-400">
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-transparent cursor-wait" />
      )}
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">New Course</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              type="button"
              disabled={isLoading}
              onClick={() => router.push("/admin/courses")}
            >
              <Trash2 size={15} /> Discard
            </Button>
            <Button
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
        <CourseFormFields
          control={control}
          errors={errors}
          setValue={setValue}
          categories={categories}
          instructors={instructors}
          thumbnailFileRef={thumbnailFileRef}
        />
      </form>
    </div>
  );
}
