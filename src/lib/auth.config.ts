import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config (no Prisma / no Node.js modules)
// Used by middleware for JWT session validation only
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // Credentials provider added in auth.ts (server-only)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
