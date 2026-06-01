import {
  categoryFormSchema,
  courseByIdSchema,
  courseFormSchema,
  deleteCategorySchema,
  deleteInstructorSchema,
  editCategorySchema,
  editCourseSchema,
  editInstructorSchema,
  instructorFormSchema,
} from "@/features/courses/contants";
import {
  createCategoryService,
  createCourseService,
  createInstructorService,
  getCategoriesService,
  editCategoryService,
  deleteCategoryService,
  getInstructorsService,
  editInstructorService,
  deleteInstructorService,
  getCoursesService,
  getCourseByIdService,
  editCourseService,
} from "@/features/courses/services";
import { actionClient } from "@/lib/safe-action";

export const getCoursesAction = actionClient.action(async () => {
  return await getCoursesService();
});

export const getCourseByIdAction = actionClient
  .inputSchema(courseByIdSchema)
  .action(async ({ parsedInput }) => {
    return await getCourseByIdService(parsedInput.courseId);
  });

export const newCourseAction = actionClient
  .inputSchema(courseFormSchema)
  .action(async ({ parsedInput }) => {
    return createCourseService(parsedInput);
  });

export const editCourseAction = actionClient
  .inputSchema(editCourseSchema)
  .action(async ({ parsedInput }) => {
    return await editCourseService(parsedInput);
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

export const getCategoriesAction = actionClient.action(async () => {
  return await getCategoriesService();
});

export const getInstructorsAction = actionClient.action(async () => {
  return await getInstructorsService();
});
export const newInstructorAction = actionClient
  .inputSchema(instructorFormSchema)
  .action(async ({ parsedInput }) => {
    return await createInstructorService(parsedInput);
  });
export const editInstructorAction = actionClient
  .inputSchema(editInstructorSchema)
  .action(async ({ parsedInput }) => {
    return await editInstructorService(parsedInput);
  });

export const deleteInstructorAction = actionClient
  .inputSchema(deleteInstructorSchema)
  .action(async ({ parsedInput }) => {
    return await deleteInstructorService(parsedInput);
  });
