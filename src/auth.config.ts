import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
// CRITICAL: DO NOT import your prisma db here!

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) return null;

        const { prisma } = await import("@/lib/db");
        console.log("prisma", prisma);
        const user = await prisma.user.findUnique({
          where: { email: email as string },
        });

        if (!user || !user.password) return null;

        // const isPasswordCorrect = await bcrypt.compare(
        //   password as string,
        //   user.password,
        // );
        console.log("password", password);
        console.log("user.password", user.password);
        const isPasswordCorrect = (password as any) === (user.password as any);
        if (isPasswordCorrect) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
