"use client";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/data-table";
import { courseColumns } from "@/components/data-table/course-columns";
import { useRouter } from "next/navigation";
import { getCoursesAction } from "@/features/courses/actions";
import { Course } from "@/components/data-table/course-columns";

const courseFilters = [
  {
    columnId: "level",
    title: "Level",
    options: [
      { value: "all", label: "All Levels" },
      { value: "beginner", label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced", label: "Advanced" },
    ],
  },
];

export function Courses() {
  const router = useRouter();
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const { execute: fetchCourses } = useAction(getCoursesAction, {
    onSuccess: ({ data }) => {
      setIsInitialLoading(false);
      if (data?.courses) {
        setCoursesData(data.courses);
      }
    },
    onError: ({ error }) => {
      setIsInitialLoading(false);
      console.error("Failed to load courses:", error);
      toast.error("Failed to load courses");
    },
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Courses</h1>
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/admin/courses/new")}
        >
          <PlusIcon aria-hidden="true" className="text-white" size={16} />
          Add new
        </Button>
      </div>

      <DataTable
        defaultPageSize={5}
        searchColumn="title"
        columns={courseColumns}
        data={coursesData}
        filters={courseFilters}
        isLoading={isInitialLoading}
      />
    </div>
  );
}
