"use server";
import type { RegisterForm } from "./constants";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { registerService } from "@/features/auth/services";

export type FormState = {
  error?: string;
  success?: boolean;
} | null;

export async function authenticate(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });
    redirect("/courses");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email hoặc mật khẩu không chính xác!" };
        default:
          return { error: "Đã có lỗi xác thực xảy ra." };
      }
    }
    throw error;
  }
}

export async function signupAction(data: RegisterForm) {
  try {
    return await registerService(data);
  } catch (error) {
    console.log("error action register");
    return {
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
