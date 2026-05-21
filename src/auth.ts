import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { CustomAuthError } from "@/features/auth/constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await db.user.findUnique({ where: { email } });
        const dbPassword =
          user?.password || "$2a$10$FakeHashToPreventTimingAttacksDoNotUseThis";
        const passwordMatch = await bcrypt.compare(password, dbPassword);
        console.log("user", user);
        console.log("user.password", passwordMatch);
        if (!user || !user.password || !passwordMatch) {
          throw new CustomAuthError("INVALID_CREDENTIALS");
        }
        if (!user.emailVerified) {
          throw new CustomAuthError("ACCOUNT_INACTIVE");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
