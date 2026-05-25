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

export async function registerService(data: RegisterForm) {
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

  return result as { message: AuthMessageType };
}

export async function resendVerifyEmailService(data: { email: string }) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/resend-verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error ?? "SERVER_ERROR");
  }

  return result as { message: AuthMessageType };
}

export async function forgotPasswordService(data: { email: string }) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error ?? "SERVER_ERROR");
  }

  return result as { message: AuthMessageType };
}

export async function resetPasswordService(data: {
  newPassword: string;
  confirmPassword: string;
  token: string;
}) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result?.error ?? "SERVER_ERROR");
  }

  return result as { message: AuthMessageType };
}
