import * as z from "zod";

export const INSTRUCTOR_MESSAGES_MAP: Record<string, string> = {
  SERVER_ERROR: "A critical server error occurred. Please try again later.",
  INVALID_INSTRUCTOR_INPUT:
    "The provided input data is invalid. Please check the form fields.",
  INVALID_INSTRUCTOR_BODY: "The request body is missing or malformed.",
  FETCH_INSTRUCTOR_LIST_ERROR:
    "Failed to fetch the instructor list from the server.",
  INSTRUCTOR_NOT_FOUND: "The assigned instructor could not be found.",
  INSTRUCTOR_IS_IN_USE_BY_COURSES:
    "Cannot delete this instructor because they are currently assigned to one or more courses.",
  INSTRUCTOR_CREATED_SUCCESS: "The instructor has been successfully created.",
  INSTRUCTOR_UPDATED_SUCCESS: "The instructor has been successfully updated.",
  INSTRUCTOR_DELETED_SUCCESS: "The instructor has been successfully deleted.",
};
export const instructorFormSchema = z.object({
  name: z.string().min(1, { message: "Instructor name is required" }),
  title: z.string().min(1, { message: "Professional title is required" }),
  avatarUrl: z
    .url({ message: "Invalid avatar URL" })
    .optional()
    .or(z.literal("")),
  bio: z.string().optional(),
});

export const editInstructorSchema = instructorFormSchema.extend({
  id: z.number().min(1, "Instructor ID is required"),
});

export const deleteInstructorSchema = z.object({
  id: z.number().min(1, "Instructor ID is required"),
});

export type InstructorFormInput = z.infer<typeof instructorFormSchema>;
export type EditInstructorInput = z.infer<typeof editInstructorSchema>;
export type DeleteInstructorInput = z.infer<typeof deleteInstructorSchema>;

export interface Instructor {
  id: number;
  name: string;
  title: string;
  avatarUrl?: string | null;
  bio?: string | null;
}
