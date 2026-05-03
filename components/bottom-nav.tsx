"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/talk", label: "Talk" },
  { href: "/memory", label: "Memory" },
  { href: "/sleep-monitoring", label: "Sleep" },
  { href: "/room", label: "Room" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/talk" ||
    pathname === "/room" ||
    pathname === "/memory" ||
    pathname.startsWith("/memory/") ||
    pathname === "/sleep-monitoring" ||
    pathname.startsWith("/sleep-monitoring/")
  ) {
    return null;
  }

  return (
    <nav
      aria-label="Bottom navigation"
      className="sticky bottom-0 border-t border-slate-200/80 bg-white/92 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur"
    >
      <ul className="grid grid-cols-4 gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.label}
                className={[
                  "flex min-h-14 items-center justify-center rounded-2xl px-2 text-center text-[0.8rem] leading-tight font-medium transition-colors",
                  isActive
                    ? "bg-slate-900 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
                ].join(" ")}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
