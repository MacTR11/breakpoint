import { db } from "./db";

// Teaching groups. A student belongs to at most one; classes are compared on
// their averages, so a small class is not at a disadvantage.

export const YEARS = ["LOWER", "UPPER"] as const;
export const YEAR_LABEL: Record<string, string> = { LOWER: "Lower sixth", UPPER: "Upper sixth" };

/** A best guess from a class name such as "13B" or "U6 Computing", for classes made by a CSV import. */
export const guessYear = (name: string) => (/13|u(pper)?\s*6|upper/i.test(name) ? "UPPER" : "LOWER");

export type ClassStanding = {
  id: string;
  name: string;
  year: string;
  students: number;
  /** Students who solved something in the period. */
  active: number;
  points: number;
  solved: number;
  averagePoints: number;
  averageSolved: number;
  rank: number;
};

const oneDecimal = (value: number) => Math.round(value * 10) / 10;

/**
 * Every class with its totals and averages, best average first. With `from`,
 * only points scored since then count. Averages are per student in the class,
 * including those who have not started, so signing everyone up matters.
 */
export async function classStandings(scope: { from?: Date } = {}): Promise<ClassStanding[]> {
  const since = scope.from ? { gte: scope.from } : undefined;
  const [classes, solves, penalties] = await Promise.all([
    db.class.findMany({ orderBy: { name: "asc" }, include: { students: { where: { role: "STUDENT" }, select: { id: true } } } }),
    db.solve.groupBy({ by: ["userId"], where: since ? { solvedAt: since } : {}, _sum: { points: true }, _count: { _all: true } }),
    db.submission.groupBy({ by: ["userId"], where: { penalty: { gt: 0 }, ...(since ? { createdAt: since } : {}) }, _sum: { penalty: true } }),
  ]);
  const solveBy = new Map(solves.map((s) => [s.userId, s]));
  const lostBy = new Map(penalties.map((p) => [p.userId, p._sum.penalty ?? 0]));

  const rows = classes
    .map((c) => {
      const ids = c.students.map((s) => s.id);
      const points = ids.reduce((sum, id) => sum + (solveBy.get(id)?._sum.points ?? 0) - (lostBy.get(id) ?? 0), 0);
      const solved = ids.reduce((sum, id) => sum + (solveBy.get(id)?._count._all ?? 0), 0);
      const size = Math.max(ids.length, 1);
      return {
        id: c.id,
        name: c.name,
        year: c.year,
        students: ids.length,
        active: ids.filter((id) => solveBy.has(id)).length,
        points,
        solved,
        averagePoints: oneDecimal(points / size),
        averageSolved: oneDecimal(solved / size),
      };
    })
    .sort((a, b) => b.averagePoints - a.averagePoints || b.averageSolved - a.averageSolved || a.name.localeCompare(b.name));

  // Equal averages share a rank.
  let rank = 0;
  return rows.map((row, index) => {
    if (index === 0 || row.averagePoints !== rows[index - 1].averagePoints) rank = index + 1;
    return { ...row, rank };
  });
}
