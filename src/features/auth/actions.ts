"use server";

import NextAuth from "next-auth";
import authConfig from "@/auth.config"; // 🟢 Import bản config siêu nhẹ (Không có Prisma)
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// 🔥 KHỞI TẠO HÀM signIn ĐỘC LẬP CHO SERVER ACTION TẠI ĐÂY
const { signIn } = NextAuth(authConfig);

export type FormState = {
  error?: string;
  success?: boolean;
} | null;

export async function authenticate(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    // Chạy hàm đăng nhập một cách an toàn thông qua cấu hình authConfig
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
    // 🔴 CỰC KỲ QUAN TRỌNG: Phải throw lỗi redirect của Next.js ra ngoài, không được nuốt!
    throw error;
  }
}
