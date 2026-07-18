import type { NextAuthConfig } from "next-auth";
import { Role } from "@/lib/roles";

/**
 * Edge-safe auth config (no Prisma / Node-only imports).
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role =
          (user as { role?: string }).role ?? Role.STUDENT;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as typeof Role.STUDENT) ?? Role.STUDENT;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
