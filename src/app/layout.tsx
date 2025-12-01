import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "期末考试刷题系统",
  description: "智能题库，即时反馈，移动优化",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

