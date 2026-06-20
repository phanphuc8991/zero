"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseContentTab } from "@/features/courses/components/course/course-content-tab";
import { useState } from "react";
import {
  Category,
  Chapter,
  CreateCourseInput,
  Instructor,
} from "@/features/courses/contants-1";
import { CourseOverviewTab } from "@/features/courses/components/course/course-overview-tab";

interface CourseEditFormProps {
  courseId: number;
  categories: Category[];
  instructors: Instructor[];
  initialData: CreateCourseInput;
  initialChapters: Chapter[];
}

export function CourseEditForm({
  courseId,
  categories,
  instructors,
  initialData,
  initialChapters,
}: CourseEditFormProps) {
  const searchParams = useSearchParams();

  const [currentTab, setCurrentTab] = useState(
    searchParams.get("tab") || "overview",
  );
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", value);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, "", newUrl);
  };

  return (
    <div className="mx-15 max-w-400">
      <div className="w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Update Course</h1>
          </div>
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger className="cursor-pointer" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="content">
                Course Content
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <CourseOverviewTab
                categories={categories}
                instructors={instructors}
                initialData={initialData}
              />
            </TabsContent>

            <TabsContent value="content" className="mt-4">
              <CourseContentTab
                courseId={courseId}
                initialChapters={initialChapters}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
