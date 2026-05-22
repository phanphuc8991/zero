import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail/mailer";

const RATE_LIMIT_THRESHOLD_MS = 55 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

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
          expires: { gt: new Date(Date.now() + RATE_LIMIT_THRESHOLD_MS) },
        },
      });

      if (recentToken) {
        return { status: "rate_limited" } as const;
      }

      await tx.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      const token = crypto.randomUUID();
      const expires = new Date(Date.now() + 3600000);

      await tx.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires,
        },
      });

      return { status: "success", token } as const;
    });

    if (
      result.status === "not_found" ||
      result.status === "already_verified" ||
      result.status === "rate_limited"
    ) {
      return NextResponse.json(
        { message: "VERIFICATION_SENT_GENERIC." },
        { status: 200 },
      );
    }

    if (result.status !== "success" || !result.token) {
      return NextResponse.json({ error: "UNKNOWN_ERROR" }, { status: 500 });
    }

    try {
      await sendVerificationEmail(normalizedEmail, result.token);
    } catch (mailError) {
      console.error("Mail send crash inside resend-verify:", mailError);
      return NextResponse.json({ error: "EMAIL_SEND_FAILED" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "A new verification link has been sent to your email!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend token error:", error);
    return NextResponse.json({ error: "UNKNOWN_ERROR" }, { status: 500 });
  }
}
