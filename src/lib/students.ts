import { db } from "./db";

/** Every student with their totals, for the teacher dashboard and CSV export. */
export async function studentSummaries() {
  const [students, solves, activity] = await Promise.all([
    db.user.findMany({ where: { role: "STUDENT" }, orderBy: { name: "asc" }, select: { id: true, name: true, username: true, lastSeenAt: true } }),
    db.solve.groupBy({ by: ["userId"], _sum: { points: true }, _count: { _all: true } }),
    db.submission.groupBy({ by: ["userId"], _max: { createdAt: true }, _count: { _all: true }, _sum: { penalty: true } }),
  ]);
  const solveBy = new Map(solves.map((s) => [s.userId, s]));
  const activityBy = new Map(activity.map((a) => [a.userId, a]));
  return students.map((student) => ({
    ...student,
    points: (solveBy.get(student.id)?._sum.points ?? 0) - (activityBy.get(student.id)?._sum.penalty ?? 0),
    solved: solveBy.get(student.id)?._count._all ?? 0,
    submissions: activityBy.get(student.id)?._count._all ?? 0,
    lastActive: activityBy.get(student.id)?._max.createdAt ?? null,
  }));
}
