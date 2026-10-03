import { awardsFor } from "./awards";
import { claimDailyBonus } from "./daily";
import { db } from "./db";
import { hintsEarned } from "./hints";

/** What a student picked up, beyond the points, by solving a challenge. */
/** What else a solve earned. Each new award comes with its glyph and colour, to be shown as a sticker. */
export type Rewards = { hints: number; dailyBonus: boolean; awards: { title: string; code: string; color: string }[] };

export const noRewards: Rewards = { hints: 0, dailyBonus: false, awards: [] };

/**
 * Record that a student has solved a challenge for the first time, and work out
 * what else that earned them: a hint token, the daily bonus, any new awards.
 */
export async function recordSolve(userId: string, problemId: string, points: number, attempts: number): Promise<Rewards> {
  const before = new Set((await awardsFor(userId)).filter((a) => a.earned).map((a) => a.id));
  await db.solve.upsert({
    where: { userId_problemId: { userId, problemId } },
    create: { userId, problemId, points, attempts },
    update: {},
  });
  const [solvedNow, problem, dailyBonus] = await Promise.all([
    db.solve.count({ where: { userId } }),
    db.problem.findUnique({ where: { id: problemId }, select: { difficulty: true } }),
    claimDailyBonus(userId, problemId),
  ]);
  const awards = (await awardsFor(userId)).filter((a) => a.earned && !before.has(a.id)).map(({ title, code, color }) => ({ title, code, color }));
  return { hints: hintsEarned(solvedNow, problem?.difficulty ?? ""), dailyBonus, awards };
}
