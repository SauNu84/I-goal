import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { SubscriptionTier } from "@/generated/prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { subscription: { select: { tier: true, endDate: true } } },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        let tier: SubscriptionTier = "free";
        if (user.subscription) {
          if (user.subscription.endDate && user.subscription.endDate < new Date()) {
            tier = "free";
          } else {
            tier = user.subscription.tier;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tier,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.tier = (user as { tier?: SubscriptionTier }).tier ?? "free";
      }
      if (trigger === "update" && token.id) {
        const sub = await prisma.userSubscription.findUnique({
          where: { userId: token.id as string },
          select: { tier: true, endDate: true },
        });
        if (sub) {
          token.tier = sub.endDate && sub.endDate < new Date() ? "free" : sub.tier;
        } else {
          token.tier = "free";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string; tier: string }).id = token.id as string;
        (session.user as { id: string; tier: string }).tier =
          (token.tier as string) ?? "free";
      }
      return session;
    },
  },
};
