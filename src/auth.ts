import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { CustomAuthError } from "@/features/auth/constants";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
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
        if (!user || !user.password || !passwordMatch) {
          throw new CustomAuthError("INVALID_CREDENTIALS");
        }
        if (!user.emailVerified) {
          throw new CustomAuthError("ACCOUNT_INACTIVE");
        }

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await db.user.findUnique({
          where: { email: user.email! },
        });
        if (existing) {
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
          });
          if (!existingAccount) {
            return "/sign-in?error=EmailAlreadyExists";
          }
          return true;
        }
        await db.user.create({
          data: {
            email: user.email!,
            name: user.name,
            image: user.image,
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            },
          },
        });
      }
      return true;
    },
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
