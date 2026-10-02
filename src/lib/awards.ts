import { activity } from "./activity";
import { db } from "./db";
import { practiceFilter } from "./problems";
import { TRACKS } from "./tracks";

/** `color` fills the award once it is earned and `code` is printed faintly on it. `progress` is [so far, needed]. */
export type Award = { id: string; code: string; title: string; description: string; color: string; earned: boolean; progress: [number, number] };

type Solved = { problemId: string; slug: string; kind: string; style: string; track: string; difficulty: string; attempts: number };

const SORTS = ["bubble-sort", "insertion-sort", "merge-sort", "quick-sort"];
const SEARCHES = ["linear-search", "binary-search", "binary-search-recursive"];

const BLUE = "#0071e3";
const GREEN = "#2a9d48";
const RED = "#d70015";
const PURPLE = "#8944ab";
const ORANGE = "#c93400";
const INDIGO = "#5e5ce6";
const TEAL = "#1492aa";
const PINK = "#d30f45";

/**
 * Every award with this student's progress towards it. Awards are worked out
 * from what the student has done; nothing about them is stored.
 */
export async function awardsFor(userId: string): Promise<Award[]> {
  const [solveRows, hintRows, history, practice, dailies] = await Promise.all([
    db.solve.findMany({
      where: { userId },
      select: { problemId: true, attempts: true, solvedAt: true, problem: { select: { slug: true, kind: true, style: true, track: true, difficulty: true, contests: { select: { contest: true } } } } },
    }),
    db.hintUnlock.findMany({ where: { userId }, select: { problemId: true } }),
    activity(userId),
    db.problem.findMany({ where: practiceFilter(), select: { id: true, track: true } }),
    db.dailyBonus.count({ where: { userId } }),
  ]);
  const solves: Solved[] = solveRows.map((s) => ({ problemId: s.problemId, attempts: s.attempts, ...s.problem }));
  const slugs = new Set(solves.map((s) => s.slug));
  const solvedIds = new Set(solves.map((s) => s.problemId));
  const hinted = new Set(hintRows.map((h) => h.problemId));
  const count = (test: (s: Solved) => boolean) => solves.filter(test).length;

  const inCompetition = solveRows.filter((s) => s.problem.contests.some(({ contest }) => contest.startsAt && contest.endsAt && contest.startsAt <= s.solvedAt && s.solvedAt <= contest.endsAt)).length;
  const tracksTouched = new Set(solves.map((s) => s.track)).size;
  const tracksInUse = TRACKS.filter((track) => practice.some((p) => p.track === track.id));
  // The topic the student is closest to finishing, as a fraction.
  const closest = tracksInUse
    .map((track) => {
      const ids = practice.filter((p) => p.track === track.id).map((p) => p.id);
      return [ids.filter((id) => solvedIds.has(id)).length, ids.length] as [number, number];
    })
    .sort((a, b) => b[0] / b[1] - a[0] / a[1])[0] ?? [0, 1];

  const award = (id: string, code: string, title: string, description: string, color: string, done: number, needed: number): Award => ({
    id,
    code,
    title,
    description,
    color,
    earned: done >= needed,
    progress: [Math.min(done, needed), needed],
  });

  return [
    award("first-pass", "ok", "First pass", "Solve your first challenge.", GREEN, solves.length, 1),
    award("ten", "10", "Double figures", "Solve 10 challenges.", GREEN, solves.length, 10),
    award("twenty-five", "25", "Quarter century", "Solve 25 challenges.", GREEN, solves.length, 25),
    award("fifty", "50", "Half century", "Solve 50 challenges.", GREEN, solves.length, 50),
    award("first-fix", "fix", "Bug squashed", "Fix your first broken program.", RED, count((s) => s.style === "FIX"), 1),
    award("ten-fixes", "x10", "Exterminator", "Fix 10 broken programs.", RED, count((s) => s.style === "FIX"), 10),
    award("clean-run", "1st", "Clean run", "Have 5 coding challenges accepted on your first submission.", BLUE, count((s) => s.kind === "CODE" && s.attempts === 1), 5),
    award("sharp-eye", "==", "Sharp eye", "Answer 10 puzzles correctly at the first attempt.", BLUE, count((s) => s.kind === "PUZZLE" && s.attempts === 1), 10),
    award("unassisted", "solo", "Unassisted", "Solve a hard challenge without using a hint.", PURPLE, count((s) => s.difficulty === "HARD" && !hinted.has(s.problemId)), 1),
    award("heavy-lifting", "hard", "Heavy lifting", "Solve 5 hard challenges.", PURPLE, count((s) => s.difficulty === "HARD"), 5),
    award("all-sorts", "sort", "All sorts", "Write bubble, insertion, merge and quick sort.", INDIGO, SORTS.filter((slug) => slugs.has(slug)).length, SORTS.length),
    award("seek-and-find", "find", "Seek and find", "Write linear search and both kinds of binary search.", TEAL, SEARCHES.filter((slug) => slugs.has(slug)).length, SEARCHES.length),
    award("all-rounder", "all", "All-rounder", "Solve at least one challenge in every topic.", ORANGE, tracksTouched, tracksInUse.length),
    award("completionist", "100%", "Completionist", "Finish every practice challenge in any one topic.", ORANGE, closest[0], closest[1]),
    award("three-days", "3d", "Three in a row", "Solve something on 3 days running.", PINK, history.best, 3),
    award("full-week", "7d", "Full week", "Solve something on 7 days running.", PINK, history.best, 7),
    award("daily-habit", "day", "Daily habit", "Complete 5 daily challenges on their day.", PINK, dailies, 5),
    award("on-the-clock", "live", "On the clock", "Solve a challenge during a live competition.", INDIGO, inCompetition, 1),
  ];
}
