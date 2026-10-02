import { activity } from "./activity";
import { db } from "./db";
import { isFlagged } from "./integrity";
import { dateToLondonInput, londonDay, shiftDay } from "./london";
import { practiceFilter } from "./problems";
import { TRACKS } from "./tracks";

/**
 * `color` fills the award once it is earned and `code` is printed faintly on
 * it. `progress` is [so far, needed]. A `secret` award shows only a clue until
 * it is earned.
 */
export type Award = { id: string; code: string; title: string; description: string; color: string; group: string; secret: boolean; clue?: string; earned: boolean; progress: [number, number] };

/** What a secret award shows before it is earned. */
const CLUES: Record<string, string> = {
  "night-owl": "Some code is best written by moonlight.",
  "early-bird": "Before the first bell.",
  weekend: "Two days off. Or are they?",
  persistence: "Try, try again.",
  "quick-draw": "Fast fingers, no pasting.",
  "the-answer": "Life, the universe and everything.",
};

/** The headings awards are shown under, in order. */
export const AWARD_GROUPS = ["Solving", "Fixing", "Accuracy", "Taking it on", "Algorithms", "Breadth", "Habits", "Competing", "Secret"];

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
const NIGHT = "#3a4a8c";
const GOLD = "#b07800";

/**
 * Every award with this student's progress towards it. Awards are worked out
 * from what the student has done; nothing about them is stored.
 */
export async function awardsFor(userId: string): Promise<Award[]> {
  const [solveRows, hintRows, history, practice, dailies, quick] = await Promise.all([
    db.solve.findMany({
      where: { userId },
      select: { problemId: true, attempts: true, solvedAt: true, problem: { select: { slug: true, kind: true, style: true, track: true, difficulty: true, contests: { select: { contest: true } } } } },
    }),
    db.hintUnlock.findMany({ where: { userId }, select: { problemId: true } }),
    activity(userId),
    db.problem.findMany({ where: practiceFilter(), select: { id: true, track: true } }),
    db.dailyBonus.count({ where: { userId } }),
    // Medium or hard code accepted within two minutes of opening it, typed rather than pasted.
    db.submission.findMany({
      where: { userId, status: "ACCEPTED", seconds: { gt: 0, lte: 120 }, problem: { kind: "CODE", difficulty: { in: ["MEDIUM", "HARD"] } } },
      select: { code: true, pastedChars: true, largestPaste: true },
    }),
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

  // When things were solved, in UK time, for the secret awards.
  const hours = solveRows.map((s) => Number(dateToLondonInput(s.solvedAt).slice(11, 13)));
  const days = new Set(solveRows.map((s) => londonDay(s.solvedAt)));
  const weekend = [...days].some((day) => new Date(`${day}T12:00:00Z`).getUTCDay() === 6 && days.has(shiftDay(day, 1)));

  const make =
    (group: string, secret = false) =>
    (id: string, code: string, title: string, description: string, color: string, done: number, needed: number): Award => ({
      id,
      code,
      title,
      description,
      color,
      group,
      secret,
      ...(secret ? { clue: CLUES[id] } : {}),
      earned: done >= needed,
      progress: [Math.min(done, needed), needed],
    });
  const solving = make("Solving");
  const fixing = make("Fixing");
  const accuracy = make("Accuracy");
  const taking = make("Taking it on");
  const algorithms = make("Algorithms");
  const breadth = make("Breadth");
  const habits = make("Habits");
  const competing = make("Competing");
  const secret = make("Secret", true);

  return [
    solving("first-pass", "ok", "First pass", "Solve your first challenge.", GREEN, solves.length, 1),
    solving("ten", "10", "Double figures", "Solve 10 challenges.", GREEN, solves.length, 10),
    solving("twenty-five", "25", "Quarter century", "Solve 25 challenges.", GREEN, solves.length, 25),
    solving("fifty", "50", "Half century", "Solve 50 challenges.", GREEN, solves.length, 50),
    solving("hundred", "100", "Centurion", "Solve 100 challenges.", GREEN, solves.length, 100),
    fixing("first-fix", "fix", "Bug squashed", "Fix your first broken program.", RED, count((s) => s.style === "FIX"), 1),
    fixing("ten-fixes", "x10", "Exterminator", "Fix 10 broken programs.", RED, count((s) => s.style === "FIX"), 10),
    accuracy("clean-run", "1st", "Clean run", "Have 5 coding challenges accepted on your first submission.", BLUE, count((s) => s.kind === "CODE" && s.attempts === 1), 5),
    accuracy("sharp-eye", "==", "Sharp eye", "Answer 10 puzzles correctly at the first attempt.", BLUE, count((s) => s.kind === "PUZZLE" && s.attempts === 1), 10),
    taking("unassisted", "solo", "Unassisted", "Solve a hard challenge without using a hint.", PURPLE, count((s) => s.difficulty === "HARD" && !hinted.has(s.problemId)), 1),
    taking("heavy-lifting", "hard", "Heavy lifting", "Solve 5 hard challenges.", PURPLE, count((s) => s.difficulty === "HARD"), 5),
    taking("exam-ready", "[6]", "Exam ready", "Solve 10 exam-style questions.", PURPLE, count((s) => s.track === "exam"), 10),
    algorithms("all-sorts", "sort", "All sorts", "Write bubble, insertion, merge and quick sort.", INDIGO, SORTS.filter((slug) => slugs.has(slug)).length, SORTS.length),
    algorithms("seek-and-find", "find", "Seek and find", "Write linear search and both kinds of binary search.", TEAL, SEARCHES.filter((slug) => slugs.has(slug)).length, SEARCHES.length),
    breadth("all-rounder", "all", "All-rounder", "Solve at least one challenge in every topic.", ORANGE, tracksTouched, tracksInUse.length),
    breadth("completionist", "100%", "Completionist", "Finish every practice challenge in any one topic.", ORANGE, closest[0], closest[1]),
    habits("three-days", "3d", "Three in a row", "Solve something on 3 days running.", PINK, history.best, 3),
    habits("full-week", "7d", "Full week", "Solve something on 7 days running.", PINK, history.best, 7),
    habits("daily-habit", "day", "Daily habit", "Complete 5 daily challenges on their day.", PINK, dailies, 5),
    competing("on-the-clock", "live", "On the clock", "Solve a challenge during a live competition.", INDIGO, inCompetition, 1),
    secret("night-owl", "23:59", "Night owl", "Solve something after 10 at night.", NIGHT, hours.some((h) => h >= 22 || h < 5) ? 1 : 0, 1),
    secret("early-bird", "06:00", "Early bird", "Solve something before half past seven in the morning.", GOLD, solveRows.some((s) => /T0[5-6]:|T07:[0-2]/.test(dateToLondonInput(s.solvedAt))) ? 1 : 0, 1),
    secret("weekend", "sat", "Weekend warrior", "Solve something on a Saturday and the Sunday after it.", ORANGE, weekend ? 1 : 0, 1),
    secret("persistence", "retry", "while not passed", "Get a coding challenge accepted after five or more tries.", RED, count((s) => s.kind === "CODE" && s.attempts >= 5), 1),
    secret("quick-draw", "<2m", "Quick draw", "Type out a medium or hard solution that passes within two minutes of opening it.", TEAL, quick.filter((q) => !isFlagged(q)).length, 1),
    secret("the-answer", "42", "The answer", "Solve 42 challenges. Don't panic.", GOLD, solves.length, 42),
  ];
}
