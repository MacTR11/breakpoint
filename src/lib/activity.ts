import { db } from "./db";
import { londonDay, shiftDay } from "./london";

export type ActivityDay = { day: string; count: number; future: boolean };

/**
 * A student's solving history by UK calendar day: the current and best streaks,
 * and a grid of the last `weeks` weeks (each column Monday to Sunday).
 */
export async function activity(userId: string, weeks = 15) {
  const solves = await db.solve.findMany({ where: { userId }, select: { solvedAt: true } });
  const counts = new Map<string, number>();
  for (const solve of solves) {
    const day = londonDay(solve.solvedAt);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  const today = londonDay();

  // A streak survives until the end of the next day, so it still counts
  // before today's first solve.
  let cursor = counts.has(today) ? today : shiftDay(today, -1);
  let streak = 0;
  while (counts.has(cursor)) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }

  let best = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of [...counts.keys()].sort()) {
    run = previous && shiftDay(previous, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }

  const weekday = (new Date(`${today}T12:00:00Z`).getUTCDay() + 6) % 7; // 0 is Monday
  const start = shiftDay(today, -(weekday + 7 * (weeks - 1)));
  const grid: ActivityDay[][] = Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (_, weekdayIndex) => {
      const day = shiftDay(start, week * 7 + weekdayIndex);
      return { day, count: counts.get(day) ?? 0, future: day > today };
    }),
  );

  return { streak, best, grid, solvedToday: counts.has(today), inGrid: grid.flat().reduce((sum, d) => sum + d.count, 0) };
}
