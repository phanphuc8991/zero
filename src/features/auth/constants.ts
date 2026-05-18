import { z } from "zod";

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

export type RegisterForm = z.infer<typeof registerSchema>;
