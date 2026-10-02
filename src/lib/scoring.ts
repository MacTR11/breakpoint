import { db } from "./db";

export type LeaderboardRow = {
  rank: number;
  userId: string;
  name: string;
  className: string;
  points: number;
  solved: number;
  lastSolvedAt: Date | null;
};

type Scope = { problemIds?: string[]; from?: Date; to?: Date; tieBreakByTime?: boolean };

/**
 * Students ranked by points (solves minus penalties for wrong puzzle answers),
 * with ties broken by who got there first. Only students who have solved
 * something are listed, and teacher accounts never appear.
 */
export async function leaderboard(scope: Scope = {}): Promise<LeaderboardRow[]> {
  const problems = scope.problemIds ? { problemId: { in: scope.problemIds } } : {};
  const window = scope.from || scope.to ? { gte: scope.from, lte: scope.to } : undefined;
  const [groups, penalties] = await Promise.all([
    db.solve.groupBy({
      by: ["userId"],
      where: { user: { role: "STUDENT" }, ...problems, ...(window ? { solvedAt: window } : {}) },
      _sum: { points: true },
      _count: { _all: true },
      _max: { solvedAt: true },
    }),
    db.submission.groupBy({
      by: ["userId"],
      where: { user: { role: "STUDENT" }, penalty: { gt: 0 }, ...problems, ...(window ? { createdAt: window } : {}) },
      _sum: { penalty: true },
    }),
  ]);
  const users = await db.user.findMany({
    where: { id: { in: groups.map((g) => g.userId) } },
    select: { id: true, name: true, class: { select: { name: true } } },
  });
  const byId = new Map(users.map((u) => [u.id, u]));
  const lost = new Map(penalties.map((p) => [p.userId, p._sum.penalty ?? 0]));

  const rows = groups
    .map((g) => ({
      userId: g.userId,
      name: byId.get(g.userId)?.name ?? "Unknown",
      className: byId.get(g.userId)?.class?.name ?? "",
      points: (g._sum.points ?? 0) - (lost.get(g.userId) ?? 0),
      solved: g._count._all,
      lastSolvedAt: g._max.solvedAt,
    }))
    .sort((a, b) => b.points - a.points || (a.lastSolvedAt?.getTime() ?? 0) - (b.lastSolvedAt?.getTime() ?? 0));

  // Equal points share a rank on the practice board. In a competition the
  // earlier finisher places higher, so every rank is distinct.
  let rank = 0;
  return rows.map((row, i) => {
    if (scope.tieBreakByTime || i === 0 || row.points !== rows[i - 1].points) rank = i + 1;
    return { ...row, rank };
  });
}

/** One user's total: points for everything solved, less penalties. */
export async function pointsOf(userId: string) {
  const [earned, lost] = await Promise.all([
    db.solve.aggregate({ where: { userId }, _sum: { points: true } }),
    db.submission.aggregate({ where: { userId }, _sum: { penalty: true } }),
  ]);
  return (earned._sum.points ?? 0) - (lost._sum.penalty ?? 0);
}

export type ContestState = "DRAFT" | "UPCOMING" | "LIVE" | "FINISHED";

export function contestState(contest: { startsAt: Date | null; endsAt: Date | null }, now = new Date()): ContestState {
  if (!contest.startsAt || !contest.endsAt) return "DRAFT";
  if (now < contest.startsAt) return "UPCOMING";
  if (now >= contest.endsAt) return "FINISHED";
  return "LIVE";
}

export const contestStateLabel: Record<ContestState, string> = { DRAFT: "Not scheduled", UPCOMING: "Upcoming", LIVE: "Live", FINISHED: "Finished" };

export const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
