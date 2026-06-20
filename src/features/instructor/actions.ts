"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import {
  DeleteInstructorInput,
  deleteInstructorSchema,
  EditInstructorInput,
  editInstructorSchema,
  InstructorFormInput,
  instructorFormSchema,
} from "@/features/instructor/contants";
import { ActionResponse } from "@/features/courses/contants-1";

export async function getInstructors() {
  try {
    const instructors = await db.instructor.findMany({
      orderBy: { id: "desc" },
    });
    return instructors;
  } catch (error) {
    console.error("Get instructors error:", error);
    return [];
  }
}

export async function createInstructor(
  data: InstructorFormInput,
): Promise<
  ActionResponse<{ message: string; instructor: { id: number; name: string } }>
> {
  try {
    const parsed = instructorFormSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, status: 400, error: "INVALID_INSTRUCTOR_INPUT" };
    }

    const { name, title, avatarUrl, bio } = parsed.data;
    const instructor = await db.instructor.create({
      data: {
        name,
        title,
        avatarUrl: avatarUrl || null,
        bio: bio || null,
      },
    });

    revalidatePath("/admin/instructors");
    return {
      success: true,
      status: 200,
      data: {
        message: "INSTRUCTOR_CREATED_SUCCESS",
        instructor: { id: instructor.id, name: instructor.name },
      },
    };
  } catch (error) {
    console.error("Create instructor error:", error);
    return { success: false, status: 500, error: "SERVER_ERROR" };
  }
}

export async function updateInstructor(
  data: EditInstructorInput,
): Promise<
  ActionResponse<{ message: string; instructor: { id: number; name: string } }>
> {
  try {
    const parsed = editInstructorSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, status: 400, error: "INVALID_INSTRUCTOR_INPUT" };
    }

    const { id, name, title, avatarUrl, bio } = data;

    if (!id)
      return { success: false, status: 400, error: "INVALID_INSTRUCTOR_INPUT" };

    const existingInstructor = await db.instructor.findUnique({
      where: { id },
    });
    if (!existingInstructor) {
      return { success: false, status: 404, error: "INSTRUCTOR_NOT_FOUND" };
    }

    const updatedInstructor = await db.instructor.update({
      where: { id },
      data: {
        name,
        title,
        avatarUrl: avatarUrl || null,
        bio: bio || null,
      },
    });

    revalidatePath("/admin/instructors");

    return {
      success: true,
      status: 200,
      data: {
        message: "INSTRUCTOR_UPDATED_SUCCESS",
        instructor: { id: updatedInstructor.id, name: updatedInstructor.name },
      },
    };
  } catch (error) {
    console.error("Update instructor error:", error);
    return { success: false, status: 500, error: "SERVER_ERROR" };
  }
}

export async function deleteInstructor(
  data: DeleteInstructorInput,
): Promise<ActionResponse<{ message: string }>> {
  try {
    const parsed = deleteInstructorSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, status: 400, error: "INVALID_INSTRUCTOR_INPUT" };
    }

    const { id } = parsed.data;
    const existingInstructor = await db.instructor.findUnique({
      where: { id },
    });
    if (!existingInstructor) {
      return { success: false, status: 404, error: "INSTRUCTOR_NOT_FOUND" };
    }

    await db.instructor.delete({ where: { id } });

    revalidatePath("/admin/instructors");
    return {
      success: true,
      status: 200,
      data: { message: "INSTRUCTOR_DELETED_SUCCESS" },
    };
  } catch (error: any) {
    console.error("Delete instructor error:", error);
    if (error?.code === "P2003") {
      return {
        success: false,
        status: 400,
        error: "INSTRUCTOR_IS_IN_USE_BY_COURSES",
      };
    }
    return { success: false, status: 500, error: "SERVER_ERROR" };
  }
}
