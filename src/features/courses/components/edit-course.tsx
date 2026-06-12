"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseOverviewTab } from "@/features/courses/components/course-overview-tab";
import { CourseContentTab } from "@/features/courses/components/course-content-tab";

export default function EditCourse({ courseId }: { courseId: number }) {
  return (
    <div className="mx-15 max-w-400">
      <div className="w-full">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Update Course</h1>
          </div>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Course Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <CourseOverviewTab courseId={courseId} />
            </TabsContent>

            <TabsContent value="content">
              <CourseContentTab courseId={courseId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
