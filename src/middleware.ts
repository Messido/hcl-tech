import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use the edge-compatible config (no Prisma/SQLite)
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/welcome", "/assets"],
};
