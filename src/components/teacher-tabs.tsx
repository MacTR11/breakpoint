"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/teacher", label: "Students" },
  { href: "/teacher/problems", label: "Problems" },
  { href: "/teacher/contests", label: "Competitions" },
];

export function TeacherTabs() {
  const pathname = usePathname();
  return (
    <nav className="glass mb-10 inline-flex rounded-full p-1">
      {tabs.map((tab) => {
        const active = tab.href === "/teacher" ? pathname === "/teacher" || pathname.startsWith("/teacher/students") : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              active ? "bg-white/85 font-medium text-ink" : "text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
