"use server";
import { registerSchema, signInSchema } from "./constants";
import { actionClient } from "@/lib/safe-action";
import {
  registerService,
  signInService,
  resendVerifyEmailService,
} from "@/features/auth/services";
import { z } from "zod";

export const resendVerificationAction = actionClient
  .inputSchema(
    z
      .string()
      .trim()
      .pipe(z.email({ message: "Invalid email" }).toLowerCase()),
  )
  .action(async ({ parsedInput }) => {
    return resendVerifyEmailService(parsedInput);
  });

export const signInAction = actionClient
  .inputSchema(signInSchema)
  .action(async ({ parsedInput }) => {
    return signInService(parsedInput);
  });

export const signupAction = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput }) => {
    return await registerService(parsedInput);
  });
