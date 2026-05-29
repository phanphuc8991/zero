import { signIn } from "@/auth";
import {
  AuthMessageType,
  CustomAuthError,
  type RegisterForm,
  type SignInForm,
} from "@/features/auth/constants";

export async function signInService(data: SignInForm) {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    return { message: "LOGIN_SUCCESS" };
  } catch (error) {
    if (error instanceof CustomAuthError) {
      throw new Error(error.customType);
    }
    throw new Error("SERVER_ERROR");
  }
}

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

export async function registerService(data: RegisterForm) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res) as Promise<{ message: AuthMessageType }>;
}

export async function resendVerifyEmailService(data: { email: string }) {
  const res = await fetch("/api/auth/resend-verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res) as Promise<{ message: AuthMessageType }>;
}

export async function forgotPasswordService(data: { email: string }) {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res) as Promise<{ message: AuthMessageType }>;
}

export async function resetPasswordService(data: {
  newPassword: string;
  confirmPassword: string;
  token: string;
}) {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(res) as Promise<{ message: AuthMessageType }>;
}
