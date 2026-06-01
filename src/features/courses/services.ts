import type {
  InstructorFormInput,
  CourseFormInput,
  CategoryFormInput,
  EditCategoryInput,
  DeleteCategoryInput,
  EditInstructorInput,
  DeleteInstructorInput,
  EditCourseInput,
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

export async function getCoursesService() {
  const res = await fetch("/api/course/get-courses", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function getCourseByIdService(courseId: string) {
  const res = await fetch(`/api/course/${courseId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse(res);
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

export async function editCourseService(data: EditCourseInput) {
  console.log("data.id", data.id);
  const res = await fetch(`/api/course/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
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

export async function getCategoriesService() {
  const res = await fetch("/api/category/get-categories", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function getInstructorsService() {
  const res = await fetch("/api/instructor/get-instructors", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function createInstructorService(data: InstructorFormInput) {
  const res = await fetch("/api/instructor/add-instructor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function editInstructorService(data: EditInstructorInput) {
  const res = await fetch("/api/instructor/edit-instructor", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteInstructorService(data: DeleteInstructorInput) {
  const res = await fetch("/api/instructor/delete-instructor", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
