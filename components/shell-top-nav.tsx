"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./shell-top-nav.module.css";

const topTabs = [
  {
    href: "/talk",
    label: "Talk",
    defaultIcon: "/nav-icons/talk-shell-black.png",
    memoryIcon: "/nav-icons/talk-shell.png",
  },
  {
    href: "/room",
    label: "Room",
    defaultIcon: "/nav-icons/room-shell-black.png",
    memoryIcon: "/nav-icons/room-shell.png",
  },
  {
    href: "/memory",
    label: "Memory",
    defaultIcon: "/nav-icons/memory-shell-black.png",
    memoryIcon: "/nav-icons/memory-shell.png",
  },
  {
    href: "/sleep-monitoring",
    label: "Sleep",
    defaultIcon: "/nav-icons/sleep-shell-black.png",
    memoryIcon: "/nav-icons/sleep-shell.png",
  },
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ShellTopNav({
  className = "",
  ariaLabel = "Primary navigation",
  tone = "default",
}: {
  className?: string;
  ariaLabel?: string;
  tone?: "default" | "memory";
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={ariaLabel}
      className={[
        styles.navCapsule,
        tone === "memory" ? styles.navCapsuleMemory : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ul className={styles.navList}>
        {topTabs.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const icon =
            tone === "memory" && !isActive ? item.memoryIcon : item.defaultIcon;

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
                  style={{ backgroundImage: `url(${icon})` }}
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
