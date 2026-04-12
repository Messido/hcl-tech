import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Management Application",
  description: "A secure asset management application built with Next.js and NextAuth.js",
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
