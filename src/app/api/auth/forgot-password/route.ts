import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { apiResponse } from "@/lib/api-response";
import { RATE_LIMIT_THRESHOLD_MS } from "@/features/auth/constants";
import { sendForgotPasswordEmail } from "@/lib/mail/forgotpassword-mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const result = await db.$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({ where: { email } });
      if (!user) return { status: "not_found" } as const;
      const recentToken = await tx.passwordResetToken.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
      });
      if (recentToken) return { status: "rate_limited" } as const;
      await tx.passwordResetToken.deleteMany({ where: { userId: user.id } });
      const token = randomUUID();
      await tx.passwordResetToken.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + RATE_LIMIT_THRESHOLD_MS),
        },
      });

      return { status: "success", token, userId: user.id } as const;
    });

    if (result.status === "not_found") {
      return apiResponse.success({ message: "CHECK_YOUR_EMAIL" }, 200);
    }
    if (result.status === "rate_limited") {
      return apiResponse.error("VERIFICATION_SENT_GENERIC", 429);
    }

    try {
      await sendForgotPasswordEmail(email, result.token);
    } catch {
      await db.passwordResetToken.deleteMany({
        where: { userId: result.userId },
      });
      return NextResponse.json({ error: "EMAIL_SEND_FAILED" }, { status: 500 });
    }

    return NextResponse.json({ message: "EMAIL_SEND_SUCCESS" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
