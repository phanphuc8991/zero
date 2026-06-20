import { instructorColumns } from "@/components/data-table/instructor-columns";
import { getInstructors } from "@/features/instructor/actions";
import { InstructorWrapper } from "@/features/instructor/instructor-wrapper";

export default async function InstructorsPage() {
  const instructorsData = await getInstructors();

  return (
    <div className="flex flex-col gap-6 h-full">
      <InstructorWrapper
        instructorsData={instructorsData}
        columns={instructorColumns}
      />
    </div>
  );
}
