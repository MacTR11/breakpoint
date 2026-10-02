import { awardsFor } from "./awards";
import { claimDailyBonus } from "./daily";
import { db } from "./db";
import { earnsHint } from "./hints";

/** What a student picked up, beyond the points, by solving a challenge. */
export type Rewards = { hintEarned: boolean; dailyBonus: boolean; awards: string[] };

export const noRewards: Rewards = { hintEarned: false, dailyBonus: false, awards: [] };

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
  const [solvedNow, dailyBonus] = await Promise.all([db.solve.count({ where: { userId } }), claimDailyBonus(userId, problemId)]);
  const awards = (await awardsFor(userId)).filter((a) => a.earned && !before.has(a.id)).map((a) => a.title);
  return { hintEarned: earnsHint(solvedNow), dailyBonus, awards };
}
