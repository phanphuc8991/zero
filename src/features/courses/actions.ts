import {
  categoryFormSchema,
  courseFormSchema,
  instructorFormSchema,
} from "@/features/courses/contants";
import {
  createCategoryService,
  createCourseService,
  createInstructorService,
} from "@/features/courses/services";
import { actionClient } from "@/lib/safe-action";

export const newCourseAction = actionClient
  .inputSchema(courseFormSchema)
  .action(async ({ parsedInput }) => {
    return createCourseService(parsedInput);
  });

export const newCategoryAction = actionClient
  .inputSchema(categoryFormSchema)
  .action(async ({ parsedInput }) => {
    return await createCategoryService(parsedInput);
  });

export const newInstructorAction = actionClient
  .inputSchema(instructorFormSchema)
  .action(async ({ parsedInput }) => {
    return await createInstructorService(parsedInput);
  });
