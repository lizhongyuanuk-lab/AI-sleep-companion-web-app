import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AppFrame } from "@/components/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Companion Web",
  description: "Minimal placeholder pages for the Next.js mainline app.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <AppFrame>{children}</AppFrame>
      </body>
      <Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" />
    </html>
  );
}
