import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import i18n from "../i18n"; // Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { title: "PresentoAI" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
