import { db } from "./db";
import { isFlagged, mightBeFlagged } from "./integrity";

/** Every student with their totals, for the teacher dashboard and CSV export. */
export async function studentSummaries() {
  const [students, solves, activity, pastes] = await Promise.all([
    db.user.findMany({
      where: { role: "STUDENT" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, username: true, lastSeenAt: true, classId: true, class: { select: { name: true } } },
    }),
    db.solve.groupBy({ by: ["userId"], _sum: { points: true }, _count: { _all: true } }),
    db.submission.groupBy({ by: ["userId"], _max: { createdAt: true }, _count: { _all: true }, _sum: { penalty: true } }),
    // Narrowed in the database, then decided by the same rule the teacher pages use.
    db.submission.findMany({ where: mightBeFlagged, select: { userId: true, code: true, pastedChars: true, largestPaste: true } }),
  ]);
  const solveBy = new Map(solves.map((s) => [s.userId, s]));
  const activityBy = new Map(activity.map((a) => [a.userId, a]));
  const flagsBy = new Map<string, number>();
  for (const paste of pastes) if (isFlagged(paste)) flagsBy.set(paste.userId, (flagsBy.get(paste.userId) ?? 0) + 1);
  return students.map((student) => ({
    ...student,
    className: student.class?.name ?? "",
    points: (solveBy.get(student.id)?._sum.points ?? 0) - (activityBy.get(student.id)?._sum.penalty ?? 0),
    solved: solveBy.get(student.id)?._count._all ?? 0,
    submissions: activityBy.get(student.id)?._count._all ?? 0,
    lastActive: activityBy.get(student.id)?._max.createdAt ?? null,
    flags: flagsBy.get(student.id) ?? 0,
  }));
}

export type StudentSummary = Awaited<ReturnType<typeof studentSummaries>>[number];
