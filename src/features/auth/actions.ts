"use server";
import {
  registerSchema,
  signInSchema,
  emailSchema,
  resetPasswordActionSchema,
} from "./constants";
import { actionClient } from "@/lib/safe-action";
import {
  registerService,
  signInService,
  resendVerifyEmailService,
  forgotPasswordService,
  resetPasswordService,
} from "@/features/auth/services";

export const resendVerificationAction = actionClient
  .inputSchema(emailSchema)
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

export const forgotPasswordAction = actionClient
  .inputSchema(emailSchema)
  .action(async ({ parsedInput }) => {
    return await forgotPasswordService(parsedInput);
  });

export const resetPasswordAction = actionClient
  .inputSchema(resetPasswordActionSchema)
  .action(async ({ parsedInput }) => {
    return await resetPasswordService(parsedInput);
  });
