import * as z from "zod";
export const courseFormSchema = z.object({
  title: z.string().min(1, { message: "Course title is required" }),
  slug: z
    .string()
    .min(1, { message: "Slug URL path is required" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  description: z.string().optional(),

  categoryId: z.string().min(1, { message: "Please select a course category" }),

  level: z.string().optional(),

  durationHours: z
    .number({ error: "Duration must be a number" })
    .min(1, { message: "Duration must be at least 1 hour" }),

  instructorId: z
    .string()
    .min(1, { message: "Please assign an instructor to this course" }),

  includeCertificate: z.boolean().optional(),
  openEnrollment: z.boolean().optional(),
  status: z.string().optional(),
});

export type CourseFormInput = z.infer<typeof courseFormSchema>;
