import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://challngehub.jp"),
  title: "Try Buddy | 学生の挑戦が、ここから始まる",
  description: "高校生が参加できる実際の募集を探し、応募準備から参加まで、自分だけの挑戦記録を残せるサイトです。",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}

