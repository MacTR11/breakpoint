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
    <nav aria-label="Teacher" className="mb-8 flex gap-5 border-b border-line text-sm">
      {tabs.map((tab) => {
        const active = tab.href === "/teacher" ? pathname === "/teacher" || pathname.startsWith("/teacher/students") : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 pb-2 ${active ? "border-ink font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
