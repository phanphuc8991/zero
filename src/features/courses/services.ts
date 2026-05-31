import type {
  InstructorFormInput,
  CourseFormInput,
  CategoryFormInput,
  EditCategoryInput,
  DeleteCategoryInput,
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
  const res = await fetch("/api/category/add-category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function editCategoryService(data: EditCategoryInput) {
  const res = await fetch("/api/category/edit-category", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCategoryService(data: DeleteCategoryInput) {
  const res = await fetch("/api/category/delete-category", {
    method: "DELETE",
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

export async function getCategoriesService() {
  const res = await fetch("/api/category/get-categories", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse(res);
}
