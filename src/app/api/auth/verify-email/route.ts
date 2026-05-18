import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  // Redirect helper
  const redirect = (path: string) => {
    return NextResponse.redirect(new URL(path, req.url));
  };

  try {
    // 1. Validate token
    if (!token?.trim()) {
      return redirect("/verify-email?error=invalid");
    }

    // 2. Use transaction to avoid race conditions
    const result = await db.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Lock-like behavior: fetch token first
        const verificationToken = await tx.verificationToken.findUnique({
          where: { token },
        });

        // Hide internal state (security best practice)
        if (!verificationToken) {
          return { status: "invalid" as const };
        }

        // 3. Expired token handling
        if (verificationToken.expires < new Date()) {
          await tx.verificationToken.delete({
            where: { token },
          });

          return { status: "expired" as const };
        }

        // 4. Check user existence (safe update)
        const user = await tx.user.findUnique({
          where: { email: verificationToken.identifier },
        });

        if (!user) {
          return { status: "invalid" as const };
        }

        // 5. If already verified → idempotent behavior
        if (user.emailVerified) {
          await tx.verificationToken.delete({
            where: { token },
          });

          return { status: "already_verified" as const };
        }

        // 6. Verify user
        await tx.user.update({
          where: { email: user.email },
          data: { emailVerified: new Date() },
        });

        // 7. Delete token
        await tx.verificationToken.delete({
          where: { token },
        });

        return { status: "success" as const };
      },
    );

    // 8. Unified response handling (avoid leaking internal state)
    switch (result.status) {
      case "success":
        return redirect("/sign-in?success=verified");

      case "already_verified":
        return redirect("/sign-in?success=verified");

      case "expired":
        return redirect("/verify-email?error=expired");

      default:
        return redirect("/verify-email?error=invalid");
    }
  } catch (error) {
    console.error("Verify email error:", error);
    return redirect("/verify-email?error=server");
  }
}
