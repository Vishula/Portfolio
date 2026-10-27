"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

export default function GlassNav() {
  const path = usePathname();
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <nav
      data-nav
      aria-label="Primary"
      className="glass fixed left-1/2 z-50 -translate-x-1/2 rounded-full p-1.5"
      style={{ bottom: "calc(24px + var(--safe-b))" }}
    >
      <ul className="flex gap-1">
        {ITEMS.map((it) => {
          const active = isActive(it.href);
          return (
            <li key={it.href} className="relative">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 items-center rounded-full px-5 text-[15px] font-medium transition duration-300 ease-out active:scale-[0.96] ${
                  active ? "text-white" : "text-ink hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
