import type {
  InstructorFormInput,
  CourseFormInput,
  CategoryFormInput,
} from "@/features/courses/contants";

async function handleResponse(res: Response) {
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("SERVER_ERROR");
  }

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error ?? "SERVER_ERROR");
  }
  return result;
}

export async function createCourseService(data: CourseFormInput) {
  const res = await fetch("/api/course/new-course", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
export async function createCategoryService(data: CategoryFormInput) {
  const res = await fetch("/api/category/new-category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function createInstructorService(data: InstructorFormInput) {
  const res = await fetch("/api/instructor/new-instructor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}
