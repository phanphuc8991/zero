import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { apiResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const { newPassword, token } = await req.json();
    const result = await db.$transaction(async (tx: any) => {
      const record = await tx.passwordResetToken.findUnique({
        where: { token },
      });

      if (!record) return { status: "invalid_token" } as const;
      if (record.expiresAt < new Date()) return { status: "expired" } as const;

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await tx.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.delete({ where: { token } });

      return { status: "success" } as const;
    });
    if (result.status === "invalid_token") {
      return apiResponse.error("INVALID_TOKEN", 400);
    }

    if (result.status === "expired") {
      return apiResponse.error("EXPIRED_TOKEN", 400);
    }

    return apiResponse.success({ message: "RESET_PASSWORD_SUCCESS" }, 200);
  } catch (error) {
    console.error("Reset password error:", error);
    return apiResponse.error("SERVER_ERROR", 500);
  }
}
