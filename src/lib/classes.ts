import { db } from "./db";
import { flagsByChallenge, mightBeFlagged } from "./integrity";
import { practiceFilter } from "./problems";
import { TRACKS } from "./tracks";

// Teaching groups. A student belongs to at most one; classes are compared on
// their averages, so a small class is not at a disadvantage.

export const YEARS = ["LOWER", "UPPER"] as const;
export const YEAR_LABEL: Record<string, string> = { LOWER: "Lower sixth", UPPER: "Upper sixth" };

// Each class owns a colour, given in name order, so 12A and 12B never share one.
const CLASS_COLORS = ["#0a7aff", "#d96d00", "#2a9d48", "#a550e0", "#d6409f", "#1492aa", "#5856d6", "#e5372c"];
export const classColor = (index: number) => CLASS_COLORS[index % CLASS_COLORS.length];

/** Every class in name order, with its colour. */
export async function allClasses() {
  const classes = await db.class.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { students: true } } } });
  return classes.map((c, index) => ({ id: c.id, name: c.name, year: c.year, students: c._count.students, color: classColor(index) }));
}

/** A best guess from a class name such as "13B" or "U6 Computing", for classes made by a CSV import. */
export const guessYear = (name: string) => (/13|u(pper)?\s*6|upper/i.test(name) ? "UPPER" : "LOWER");

export type ClassStanding = {
  id: string;
  name: string;
  year: string;
  color: string;
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
    .map((c, index) => {
      const ids = c.students.map((s) => s.id);
      const points = ids.reduce((sum, id) => sum + (solveBy.get(id)?._sum.points ?? 0) - (lostBy.get(id) ?? 0), 0);
      const solved = ids.reduce((sum, id) => sum + (solveBy.get(id)?._count._all ?? 0), 0);
      const size = Math.max(ids.length, 1);
      return {
        id: c.id,
        name: c.name,
        year: c.year,
        color: classColor(index),
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

/**
 * A class's students against the practice topics: how many of each topic's
 * challenges each student has solved, plus their totals and paste flags.
 */
export async function topicGrid(classId: string) {
  const [students, practice] = await Promise.all([
    db.user.findMany({
      where: { classId, role: "STUDENT" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        username: true,
        lastSeenAt: true,
        solves: { select: { problemId: true, points: true, solvedAt: true } },
        submissions: { where: mightBeFlagged, select: { userId: true, problemId: true, createdAt: true, code: true, pastedChars: true, largestPaste: true } },
      },
    }),
    db.problem.findMany({ where: practiceFilter(), select: { id: true, track: true } }),
  ]);
  const penalties = await db.submission.groupBy({ by: ["userId"], where: { userId: { in: students.map((s) => s.id) }, penalty: { gt: 0 } }, _sum: { penalty: true } });
  const lost = new Map(penalties.map((p) => [p.userId, p._sum.penalty ?? 0]));
  const trackOf = new Map(practice.map((p) => [p.id, p.track]));
  const tracks = TRACKS.map((t) => ({ ...t, total: practice.filter((p) => p.track === t.id).length })).filter((t) => t.total > 0);

  const rows = students.map((student) => {
    const solvedIn = new Map<string, number>();
    for (const solve of student.solves) {
      const track = trackOf.get(solve.problemId);
      if (track) solvedIn.set(track, (solvedIn.get(track) ?? 0) + 1);
    }
    const lastSolved = student.solves.reduce<Date | null>((latest, s) => (!latest || s.solvedAt > latest ? s.solvedAt : latest), null);
    return {
      id: student.id,
      name: student.name,
      username: student.username,
      lastSeenAt: student.lastSeenAt,
      lastSolved,
      cells: tracks.map((t) => solvedIn.get(t.id) ?? 0),
      solved: student.solves.length,
      points: student.solves.reduce((sum, s) => sum + s.points, 0) - (lost.get(student.id) ?? 0),
      flags: flagsByChallenge(student.submissions).length,
    };
  });
  // The class's average share of each topic, for the bottom row.
  const average = tracks.map((t, i) => (rows.length ? rows.reduce((sum, r) => sum + r.cells[i], 0) / rows.length : 0));
  return { tracks, rows, average };
}
