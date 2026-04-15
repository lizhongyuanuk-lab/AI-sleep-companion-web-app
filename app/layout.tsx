import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Companion Web",
  description: "Minimal placeholder pages for the Next.js mainline app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-white/60 bg-white/88 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <main className="flex-1 px-5 pb-8 pt-6">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
