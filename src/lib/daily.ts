import { db } from "./db";
import { londonDay, londonDayStart } from "./london";
import { practiceFilter } from "./problems";

// A small, stable string hash (FNV-1a), used to shuffle the challenges
// differently each day without storing anything.
function hash(text: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Today's challenge for one student. Everyone gets the same easy or medium
 * practice challenge, unless they had already solved it before today, in which
 * case they get the next one in today's order. `done` means solved today.
 */
export async function dailyChallenge(userId: string) {
  const day = londonDay();
  const dayStart = londonDayStart(day);
  const [eligible, solves] = await Promise.all([
    db.problem.findMany({
      where: { ...practiceFilter(), difficulty: { in: ["EASY", "MEDIUM"] } },
      select: { id: true, slug: true, title: true, kind: true, style: true, difficulty: true, points: true, track: true },
    }),
    db.solve.findMany({ where: { userId }, select: { problemId: true, solvedAt: true } }),
  ]);
  const solvedAt = new Map(solves.map((s) => [s.problemId, s.solvedAt]));
  const order = eligible.map((p) => ({ p, key: hash(`${day}:${p.id}`) })).sort((a, b) => a.key - b.key || a.p.id.localeCompare(b.p.id));
  const pick = order.find(({ p }) => {
    const when = solvedAt.get(p.id);
    return !when || when >= dayStart;
  })?.p;
  if (!pick) return null;
  return { day, problem: pick, done: solvedAt.has(pick.id) };
}

/** After a solve: if it was today's challenge, record the bonus hint. Returns whether one was earned. */
export async function claimDailyBonus(userId: string, problemId: string) {
  const daily = await dailyChallenge(userId);
  if (!daily || daily.problem.id !== problemId) return false;
  const key = { userId_day: { userId, day: daily.day } };
  if (await db.dailyBonus.findUnique({ where: key })) return false;
  await db.dailyBonus.create({ data: { userId, day: daily.day, problemId } });
  return true;
}
