import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resetPasswordActionSchema } from "@/features/auth/constants";

export async function GET(req: Request) {
  console.log("run....");
  const url = new URL(req.url);
  const rawToken = url.searchParams.get("token");

  const redirect = (path: string) => {
    return NextResponse.redirect(new URL(path, req.url));
  };

  try {
    const tokenParsed = resetPasswordActionSchema.safeParse(rawToken);
    console.log("tokenParsed", tokenParsed);
    if (!tokenParsed.success) {
      return redirect("/verify-email/result?status=invalid");
    }
    const token = tokenParsed.data;
    const result = await db.$transaction(async (tx: any) => {
      const verificationToken = await tx.verificationToken.findUnique({
        where: { token },
      });
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

      const user = await tx.user.findUnique({
        where: { email: verificationToken.identifier },
      });

      if (!user) {
        return { status: "invalid" as const };
      }
      if (user.emailVerified) {
        await tx.verificationToken.delete({
          where: { token },
        });

        return { status: "already_verified" as const };
      }

      await tx.user.update({
        where: { email: user.email },
        data: { emailVerified: new Date() },
      });

      await tx.verificationToken.delete({
        where: { token },
      });

      return { status: "success" as const };
    });

    switch (result.status) {
      case "success":
      case "already_verified":
        return redirect("/verify-email/result?status=verified");
      case "expired":
        return redirect("/verify-email/result?status=expired");
      default:
        return redirect("/verify-email/result?status=invalid");
    }
  } catch (error) {
    console.error("Verify email error:", error);
    return redirect("/verify-email/result?status=server");
  }
}
