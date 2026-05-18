import type { RegisterForm } from "@/features/auth/constants";

export async function registerService(data: RegisterForm) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result?.error);
    }
    return result;
  } catch (error) {
    console.log("error service register", error);
  }
}
