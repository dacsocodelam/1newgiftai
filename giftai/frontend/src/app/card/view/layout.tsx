import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "💝 GiftAI - あなたへのメッセージ",
  description: "特別なメッセージカードをお届けします",
  robots: "noindex, nofollow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function CardViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
