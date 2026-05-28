import { courseFormSchema } from "@/features/courses/contants";
import { actionClient } from "@/lib/safe-action";

export const newCourseAction = actionClient
  .inputSchema(courseFormSchema)
  .action(async ({ parsedInput }) => {
    return;
  });
