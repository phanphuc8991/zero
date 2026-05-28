import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail/verification-mailer";
import { randomUUID } from "crypto";

import {
  RATE_LIMIT_THRESHOLD_MS,
  registerSchema,
} from "@/features/auth/constants";
import { apiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return apiResponse.error("INVALID_BODY", 400);
    }
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return apiResponse.error("INVALID_INPUT", 400);
    }
    const { name, email, password } = parsed.data;
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      if (!existingUser.password) {
        return apiResponse.error("GOOGLE_ACCOUNT_EXIST", 409);
      }
      return apiResponse.error("EMAIL_IN_USE", 409);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const token = randomUUID();
    const expires = new Date(Date.now() + RATE_LIMIT_THRESHOLD_MS);
    await db.$transaction([
      db.user.create({
        data: { name, email, password: hashedPassword, currentPlanId: 1 },
      }),
      db.verificationToken.create({
        data: { identifier: email, token, expires },
      }),
    ]);
    try {
      await sendVerificationEmail(email, token);
    } catch {
      await db.$transaction([
        db.user.delete({ where: { email } }),
        db.verificationToken.delete({ where: { token } }),
      ]);
      return apiResponse.error("EMAIL_SEND_FAILED", 500);
    }
    return apiResponse.success({ message: "REGISTER_SUCCESS" }, 201);
  } catch (error) {
    console.error("error route api register", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
