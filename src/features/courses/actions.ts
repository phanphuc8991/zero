import {
  categoryFormSchema,
  courseFormSchema,
  deleteCategorySchema,
  editCategorySchema,
  instructorFormSchema,
} from "@/features/courses/contants";
import {
  createCategoryService,
  createCourseService,
  createInstructorService,
  getCategoriesService,
  editCategoryService,
  deleteCategoryService,
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

export const editCategoryAction = actionClient
  .inputSchema(editCategorySchema)
  .action(async ({ parsedInput }) => {
    return await editCategoryService(parsedInput);
  });

export const deleteCategoryAction = actionClient
  .inputSchema(deleteCategorySchema)
  .action(async ({ parsedInput }) => {
    return await deleteCategoryService(parsedInput);
  });

export const newInstructorAction = actionClient
  .inputSchema(instructorFormSchema)
  .action(async ({ parsedInput }) => {
    return await createInstructorService(parsedInput);
  });

export const getCategoriesAction = actionClient.action(async () => {
  return await getCategoriesService();
});
