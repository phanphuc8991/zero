import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail/verification-mailer";
import { apiResponse } from "@/lib/api-response";
import {
  emailResendVerifySchema,
  RATE_LIMIT_THRESHOLD_MS,
} from "@/features/auth/constants";

// const RATE_LIMIT_THRESHOLD_MS = 55 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return apiResponse.error("INVALID_BODY", 400);
    }
    const validatedFields = emailResendVerifySchema.safeParse(body);
    if (!validatedFields.success) {
      return apiResponse.error("INVALID_INPUT", 400);
    }
    const { email: normalizedEmail } = validatedFields.data;

    const result = await db.$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (!user) {
        return { status: "not_found" } as const;
      }

      if (user.emailVerified) {
        return { status: "already_verified" } as const;
      }

      const recentToken = await tx.verificationToken.findFirst({
        where: {
          identifier: normalizedEmail,
          expires: { gt: new Date() },
        },
      });
      if (recentToken) {
        return { status: "rate_limited" } as const;
      }

      await tx.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + RATE_LIMIT_THRESHOLD_MS);

      await tx.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires,
        },
      });
      return { status: "success", token } as const;
    });
    if (result.status === "not_found") {
      return apiResponse.error("EMAIL_NOT_FOUND", 404);
    }
    if (
      result.status === "already_verified" ||
      result.status === "rate_limited"
    ) {
      return NextResponse.json(
        { message: "VERIFICATION_SENT_GENERIC" },
        { status: 429 },
      );
    }

    if (result.status !== "success" || !result.token) {
      return apiResponse.error("SERVER_ERROR", 500);
    }

    try {
      await sendVerificationEmail(normalizedEmail, result.token);
    } catch (mailError) {
      console.error("Mail send crash inside resend-verify:", mailError);
      return apiResponse.error("EMAIL_SEND_FAILED", 500);
    }

    return apiResponse.success({}, 201);
  } catch (error) {
    console.error("Resend token error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
