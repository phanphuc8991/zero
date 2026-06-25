import { z } from "zod";
import { AuthError } from "next-auth";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address",
    ),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "At least 8 characters")
    .max(100, "Password is too long")
    .regex(/(?=.*[a-z])/, "Must contain a lowercase letter")
    .regex(/(?=.*[A-Z])/, "Must contain an uppercase letter")
    .regex(/(?=.*\d)/, "Must contain a number")
    .regex(
      /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Must contain a special character",
    )
    .regex(/^[^\s]+$/, "No spaces allowed"),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address",
    ),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "At least 8 characters")
    .max(100, "Password is too long")
    .regex(/(?=.*[a-z])/, "Must contain a lowercase letter")
    .regex(/(?=.*[A-Z])/, "Must contain an uppercase letter")
    .regex(/(?=.*\d)/, "Must contain a number")
    .regex(
      /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Must contain a special character",
    )
    .regex(/^[^\s]+$/, "No spaces allowed"),
});

export const emailResendVerifySchema = z.object({
  email: z
    .string()
    .min(1, "EMAIL_INVALID")
    .max(254, "EMAIL_INVALID")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "EMAIL_INVALID"),
});

export const emailForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address",
    ),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "At least 8 characters")
      .max(100, "Password is too long")
      .regex(/(?=.*[a-z])/, "Must contain a lowercase letter")
      .regex(/(?=.*[A-Z])/, "Must contain an uppercase letter")
      .regex(/(?=.*\d)/, "Must contain a number")
      .regex(
        /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
        "Must contain a special character",
      )
      .regex(/^[^\s]+$/, "No spaces allowed"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordActionSchema = resetPasswordSchema.extend({
  token: z.string().trim().length(36, { message: "INVALID_TOKEN" }),
});

export const tokenSchema = z.object({
  token: z
    .string()
    .trim()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      "INVALID_TOKEN",
    ),
});

export type RegisterForm = z.infer<typeof registerSchema>;
export type SignInForm = z.infer<typeof signInSchema>;

export type ForgotPasswordForm = z.infer<typeof emailForgotPasswordSchema>;

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const AUTH_MESSAGES = {
  EMAIL_INVALID:
    "The provided email address is invalid. Please verify and try again.",
  EMAIL_IN_USE: "Email unavailable.",
  INVALID_CREDENTIALS: "Wrong email or password.",
  ACCOUNT_INACTIVE: "Account is inactive.",
  EMAIL_NOT_FOUND: "Email address not found. Please check and try again.",
  EMAIL_SEND_FAILED: "Email sending failed. Please check and try again.",
  EMAIL_SEND_SUCCESS: "Email sent successfully! Please check your inbox.",
  SERVER_ERROR: "Server error.",
  UNKNOWN_ERROR: "Something went wrong.",
  VERIFICATION_SENT_GENERIC:
    "If the email is valid, a verification link has been sent.",
  REGISTER_SUCCESS: "Registration successful! Please check your email.",
  LOGIN_SUCCESS: "Login successful!",
  CHECK_YOUR_EMAIL: "Please check your email.",
  INVALID_TOKEN: "Invalid reset link.",
  EXPIRED_TOKEN: "Reset link has expired, please try again.",
  RESET_PASSWORD_SUCCESS: "Password reset successfully.",
  INVALID_INPUT: "Please check your input.",
  INVALID_BODY: "Invalid request body.",
  GOOGLE_ACCOUNT_EXIST:
    "This email is already registered with Google. Please sign in with Google.",
} as const;

export type AuthMessageType = keyof typeof AUTH_MESSAGES;

export class CustomAuthError extends AuthError {
  constructor(public customType: AuthMessageType) {
    super(customType);
    this.name = "CustomAuthError";
  }
}

export const RATE_LIMIT_THRESHOLD_MS = 60 * 1000 * 2;
