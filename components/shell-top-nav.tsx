"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./shell-top-nav.module.css";

const topTabs = [
  { href: "/talk", label: "Talk", icon: "/nav-icons/talk-shell-black.png" },
  { href: "/room", label: "Room", icon: "/nav-icons/room-shell-black.png" },
  { href: "/memory", label: "Memory", icon: "/nav-icons/memory-shell-black.png" },
  {
    href: "/sleep-monitoring",
    label: "Sleep",
    icon: "/nav-icons/sleep-shell-black.png",
  },
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ShellTopNav({
  className = "",
  ariaLabel = "Primary navigation",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={ariaLabel}
      className={[styles.navCapsule, className].filter(Boolean).join(" ")}
    >
      <ul className={styles.navList}>
        {topTabs.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <li key={item.href} className={styles.navItem}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                title={item.label}
                className={[
                  styles.navLink,
                  isActive ? styles.navLinkActive : "",
                ].join(" ")}
              >
                <span
                  className={styles.navIconAsset}
                  style={{ backgroundImage: `url(${item.icon})` }}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
