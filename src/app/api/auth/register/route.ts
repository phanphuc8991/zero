import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail/mailer";
import { randomUUID } from "crypto";

import { registerSchema } from "@/features/auth/constants";
import { apiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return apiResponse.error("EMAIL_IN_USE", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const token = randomUUID();
    const expires = new Date(Date.now() + 3600000);

    await db.$transaction([
      db.user.create({
        data: { name, email, password: hashedPassword },
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

    return NextResponse.json({ message: "REGISTER_SUCCESS" }, { status: 201 });
  } catch (error) {
    console.error("error route api register", error);
    return apiResponse.error("UNKNOWN_ERROR", 500);
  }
}
