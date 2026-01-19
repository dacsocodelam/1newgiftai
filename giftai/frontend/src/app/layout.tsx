import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import I18nProvider from "../components/I18nProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { title: "PresentoAI" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-[#030712] min-h-screen`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
