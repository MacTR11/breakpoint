"use client";

import { usePathname } from "next/navigation";
import type { IconName } from "@/components/icons";
import { SlidingTabs } from "@/components/sliding-tabs";

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/teacher", label: "Students", icon: "users-three" },
  { href: "/teacher/live", label: "Live lesson", icon: "broadcast" },
  { href: "/teacher/classes", label: "Classes", icon: "chalkboard" },
  { href: "/teacher/homework", label: "Homework", icon: "notebook" },
  { href: "/teacher/problems", label: "Problems", icon: "code" },
  { href: "/teacher/contests", label: "Competitions", icon: "trophy" },
  { href: "/teacher/settings", label: "Settings", icon: "gear-six" },
];

/** The teacher's sections, on one row that scrolls sideways on a phone. */
export function TeacherTabs() {
  const pathname = usePathname();
  const items = tabs.map((tab) => ({
    ...tab,
    active: tab.href === "/teacher" ? pathname === "/teacher" || pathname.startsWith("/teacher/students") : pathname.startsWith(tab.href),
  }));
  return (
    <nav aria-label="Teacher" className="mb-7">
      <SlidingTabs items={items} current="page" />
    </nav>
  );
}
