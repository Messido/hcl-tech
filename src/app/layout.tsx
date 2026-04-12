import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth App — Secure Authentication",
  description: "A modern authentication system built with Next.js and NextAuth.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
