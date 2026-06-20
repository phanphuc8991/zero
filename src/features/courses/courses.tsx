import { PlusIcon } from "lucide-react";
import DataTable from "@/components/data-table/data-table";
import { courseColumns } from "@/components/data-table/course-columns";
import { NavButton } from "@/app/components/client/nav-button";
import { getCourses } from "@/features/courses/server-action";

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

export async function Courses() {
  const courses: any = await getCourses();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Courses</h1>
        <NavButton to="/admin/courses/new">
          <PlusIcon aria-hidden="true" className="text-white" size={16} />
          Add new
        </NavButton>
      </div>

      <DataTable
        defaultPageSize={5}
        searchColumn="title"
        columns={courseColumns}
        data={courses}
        filters={courseFilters}
        isLoading={false}
      />
    </div>
  );
}
