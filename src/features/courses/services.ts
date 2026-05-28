import { type CourseFormInput } from "@/features/courses/contants";

export async function registerService(data: CourseFormInput) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result?.error ?? "Something went wrong");
  }

  // return result as { message: AuthMessageType };
}
