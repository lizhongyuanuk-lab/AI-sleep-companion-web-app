"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";

export function AppFrame({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isImmersiveRoute =
    pathname === "/talk" ||
    pathname === "/room" ||
    pathname === "/memory" ||
    pathname.startsWith("/memory/") ||
    pathname === "/sleep-monitoring" ||
    pathname.startsWith("/sleep-monitoring/");

  return (
    <div
      className={[
        "mx-auto flex min-h-screen w-full max-w-md flex-col",
        isImmersiveRoute
          ? "overflow-hidden bg-transparent"
          : "border-x border-white/60 bg-white/88 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur",
      ].join(" ")}
    >
      <main className={isImmersiveRoute ? "flex-1" : "flex-1 px-5 pb-8 pt-6"}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
