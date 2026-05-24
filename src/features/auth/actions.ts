"use server";
import { registerSchema, signInSchema, emailSchema } from "./constants";
import { actionClient } from "@/lib/safe-action";
import {
  registerService,
  signInService,
  resendVerifyEmailService,
  forgotEmailService,
} from "@/features/auth/services";
import { z } from "zod";

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
    return await forgotEmailService(parsedInput);
  });
