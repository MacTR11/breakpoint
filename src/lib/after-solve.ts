import { db } from "./db";
import { practiceFilter, standings } from "./problems";
import { trackTitle } from "./tracks";
import { DIFFICULTIES } from "./types";

/** Where the solved pop-up sends a student: back to the list, or straight on to the next challenge. */
export type AfterSolve = {
  back: { href: string; label: string };
  next: { href: string; title: string; detail: string } | null;
};

const order = (difficulty: string) => DIFFICULTIES.indexOf(difficulty as (typeof DIFFICULTIES)[number]);

/**
 * During a live competition: back to the competition, and on to its next
 * unsolved challenge. Otherwise: back to Practice, and on to the easiest
 * unsolved challenge in the same topic (or, when the topic is finished, the
 * easiest unsolved one anywhere).
 */
export async function afterSolve(userId: string, problem: { id: string; track: string }, liveContest: { id: string; title: string } | null | undefined): Promise<AfterSolve> {
  const statusOf = await standings(userId);
  const open = (id: string) => id !== problem.id && statusOf(id) !== "solved" && statusOf(id) !== "locked";

  if (liveContest) {
    const rows = await db.contestProblem.findMany({ where: { contestId: liveContest.id }, orderBy: { sortOrder: "asc" }, select: { problem: { select: { id: true, slug: true, title: true } } } });
    const next = rows.map((r) => r.problem).find((p) => open(p.id));
    return {
      back: { href: `/contests/${liveContest.id}`, label: "Back to the competition" },
      next: next ? { href: `/problems/${next.slug}`, title: next.title, detail: liveContest.title } : null,
    };
  }

  const candidates = (
    await db.problem.findMany({
      where: practiceFilter(),
      orderBy: [{ sortOrder: "asc" }],
      select: { id: true, slug: true, title: true, track: true, difficulty: true },
    })
  )
    .filter((p) => open(p.id))
    .sort((a, b) => order(a.difficulty) - order(b.difficulty));
  const next = candidates.find((p) => p.track === problem.track) ?? candidates[0];
  return {
    back: { href: "/problems", label: "Back to challenges" },
    next: next ? { href: `/problems/${next.slug}`, title: next.title, detail: trackTitle(next.track) } : null,
  };
}
