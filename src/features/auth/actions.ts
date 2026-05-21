"use server";
import { registerSchema, signInSchema } from "./constants";
import { actionClient } from "@/lib/safe-action";
import { registerService, signInService } from "@/features/auth/services";

export const signInAction = actionClient
  .inputSchema(signInSchema)
  .action(async ({ parsedInput }) => {
    return await signInService(parsedInput);
  });

export const signupAction = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput }) => {
    return await registerService(parsedInput);
  });
