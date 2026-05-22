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
    .trim()
    .pipe(z.email({ message: "Invalid email" }).toLowerCase()),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
      "Password must contain both letters and numbers",
    ),
});

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email({ message: "Invalid email" }).toLowerCase()),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
      "Password must contain both letters and numbers",
    ),
});

export type RegisterForm = z.infer<typeof registerSchema>;
export type SignInForm = z.infer<typeof signInSchema>;

export const AUTH_MESSAGES = {
  MISSING_FIELDS: "Missing fields.",
  INVALID_FIELDS: "Invalid data.",
  EMAIL_IN_USE: "Email unavailable.",
  INVALID_CREDENTIALS: "Wrong email or password.",
  ACCOUNT_INACTIVE: "Account is inactive.",
  EMAIL_NOT_FOUND: "Email address not found. Please check and try again.",
  EMAIL_SEND_FAILED: "Email sending failed. Please check and try again.",
  SERVER_ERROR: "Server error.",
  UNKNOWN_ERROR: "Something went wrong.",
  VERIFICATION_SENT_GENERIC:
    "If the email is valid, a verification link has been sent.",
  REGISTER_SUCCESS: "Registration successful! Please check your email.",
} as const;

export type AuthMessageType = keyof typeof AUTH_MESSAGES;

export class CustomAuthError extends AuthError {
  constructor(public customType: AuthMessageType) {
    super(customType);
    this.name = "CustomAuthError";
  }
}
