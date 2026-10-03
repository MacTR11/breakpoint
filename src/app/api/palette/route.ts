import { kindGlyph } from "@/components/ui";
import { allClasses } from "@/lib/classes";
import { db } from "@/lib/db";
import type { PaletteItem } from "@/lib/palette";
import { difficultyLabel, isLive, practiceFilter } from "@/lib/problems";
import { getCurrentUser } from "@/lib/session";
import { trackColor, trackTitle } from "@/lib/tracks";

const dateFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });

/**
 * What the command palette can find for the signed-in user. A student gets the
 * challenges they can open (Practice, and competitions running now) and
 * competitions running or coming up; the teacher also gets every challenge,
 * student, class and piece of homework. Titles only: nothing a student could
 * not already see on a page.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  const teacher = user.role === "TEACHER";
  const now = new Date();
  const [problems, contests] = await Promise.all([
    db.problem.findMany({
      where: teacher ? {} : { OR: [practiceFilter(), { contests: { some: { contest: { startsAt: { lte: now }, endsAt: { gt: now } } } } }] },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true, kind: true, style: true, track: true, difficulty: true, points: true, published: true, solves: { where: { userId: user.id }, select: { id: true } } },
    }),
    db.contest.findMany({ where: { startsAt: { not: null }, endsAt: { gt: now } }, orderBy: { startsAt: "asc" } }),
  ]);
  const items: PaletteItem[] = [
    ...problems.map((p) => ({
      group: "Challenges" as const,
      title: p.title,
      detail: [trackTitle(p.track), difficultyLabel[p.difficulty] ?? p.difficulty, `${p.points} points`, p.solves.length ? "Solved" : null, teacher && !p.published ? "Unpublished" : null]
        .filter(Boolean)
        .join(" · "),
      href: `/problems/${p.slug}`,
      icon: { text: kindGlyph(p.kind, p.style), color: trackColor(p.track) },
    })),
    ...contests.map((c) => ({
      group: "Competitions" as const,
      title: c.title,
      detail: isLive(c, now) ? `Live until ${dateFormat.format(c.endsAt!)}` : `Starts ${dateFormat.format(c.startsAt!)}`,
      href: `/contests/${c.id}`,
      icon: { text: "vs", color: isLive(c, now) ? "#e5372c" : "#c48500" },
    })),
  ];
  if (teacher) {
    const [classes, students, homework] = await Promise.all([
      allClasses(),
      db.user.findMany({ where: { role: "STUDENT" }, orderBy: { name: "asc" }, select: { id: true, name: true, username: true, classId: true } }),
      db.homework.findMany({ orderBy: { dueAt: "desc" }, select: { id: true, title: true, dueAt: true, class: { select: { name: true } } } }),
    ]);
    const byId = new Map(classes.map((c) => [c.id, c]));
    const initials = (name: string) =>
      name
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    items.push(
      ...students.map((s) => {
        const group = s.classId ? byId.get(s.classId) : undefined;
        return {
          group: "Students" as const,
          title: s.name,
          detail: [s.username, group?.name ?? "No class"].join(" · "),
          href: `/teacher/students/${s.id}`,
          icon: { text: initials(s.name) || "?", color: group?.color ?? "#8e8e93" },
        };
      }),
      ...classes.map((c) => ({
        group: "Classes" as const,
        title: c.name,
        detail: `${c.students} student${c.students === 1 ? "" : "s"} · ${c.year === "UPPER" ? "Upper sixth" : "Lower sixth"}`,
        href: `/teacher/classes/${c.id}`,
        icon: { text: "#", color: c.color },
      })),
      ...homework.map((h) => ({
        group: "Homework" as const,
        title: h.title,
        detail: `${h.class?.name ?? "Every class"} · due ${dateFormat.format(h.dueAt)}`,
        href: `/teacher/homework/${h.id}`,
        icon: { text: "hw", color: "#0a7aff" },
      })),
    );
  }
  return Response.json({ items }, { headers: { "Cache-Control": "private, no-store" } });
}
