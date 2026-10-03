"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/teacher", label: "Students" },
  { href: "/teacher/classes", label: "Classes" },
  { href: "/teacher/homework", label: "Homework" },
  { href: "/teacher/problems", label: "Problems" },
  { href: "/teacher/contests", label: "Competitions" },
  { href: "/teacher/settings", label: "Settings" },
];

export function TeacherTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Teacher" className="segmented mb-7">
      {tabs.map((tab) => {
        const active = tab.href === "/teacher" ? pathname === "/teacher" || pathname.startsWith("/teacher/students") : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
