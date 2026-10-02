import type { Contest, Problem } from "@prisma/client";
import { db } from "./db";
import type { TestCase } from "./types";

export function parseTests(problem: Pick<Problem, "tests">): TestCase[] {
  try {
    const tests = JSON.parse(problem.tests ?? "[]");
    return Array.isArray(tests) ? tests : [];
  } catch {
    return [];
  }
}

function parseList(raw: string | null): string[] {
  try {
    const list = JSON.parse(raw ?? "[]");
    return Array.isArray(list) ? list.map(String) : [];
  } catch {
    return [];
  }
}

export const parseOptions = (problem: Pick<Problem, "options">) => parseList(problem.options);
export const parseBanned = (problem: Pick<Problem, "banned">) => parseList(problem.banned);

type Dates = Pick<Contest, "startsAt" | "endsAt">;

export const isLive = (contest: Dates, now = new Date()) =>
  Boolean(contest.startsAt && contest.endsAt && contest.startsAt <= now && contest.endsAt > now);

/** Not finished yet, which includes packs that have not been given dates. */
export const isPending = (contest: Dates, now = new Date()) => !contest.endsAt || contest.endsAt > now;

/** Problems students can browse: published, and not held back for a competition. */
export const practiceFilter = () => ({
  published: true,
  contests: { none: { contest: { OR: [{ endsAt: null }, { endsAt: { gt: new Date() } }] } } },
});

/**
 * Students can open a problem if it is in practice, or belongs to a competition
 * that is running. Teachers can open anything.
 */
export async function findViewableProblem(slug: string, isTeacher: boolean) {
  const problem = await db.problem.findUnique({
    where: { slug },
    include: { contests: { include: { contest: true } } },
  });
  if (!problem) return null;
  if (isTeacher) return problem;
  const contests = problem.contests.map((c) => c.contest);
  if (contests.some((c) => isLive(c))) return problem;
  if (problem.published && !contests.some((c) => isPending(c))) return problem;
  return null;
}

// Puzzle scoring is built so that guessing loses points on average: a wrong
// answer costs points, and after two wrong answers the puzzle locks.
export const MAX_PUZZLE_ATTEMPTS = 2;

/** Points for solving a puzzle after `wrongAttempts` wrong answers. Code is always worth full points. */
export function pointsFor(problem: Pick<Problem, "kind" | "points">, wrongAttempts: number) {
  if (problem.kind !== "PUZZLE" || wrongAttempts === 0) return problem.points;
  return Math.floor(problem.points / 2);
}

/**
 * Points lost for each wrong puzzle answer. With n options a random guess is
 * right 1 time in n, so losing points/(n-1) each time makes guessing worthless.
 */
export function puzzlePenalty(problem: Pick<Problem, "points" | "options">) {
  const options = parseOptions(problem).length;
  return Math.ceil(problem.points / Math.max(options > 1 ? options - 1 : 4, 1));
}

/** How a student stands on each puzzle they have got wrong: used to show locked puzzles. */
export async function lockedPuzzleIds(userId: string): Promise<Set<string>> {
  const [wrong, solved] = await Promise.all([
    db.submission.groupBy({ by: ["problemId"], where: { userId, status: "WRONG", problem: { kind: "PUZZLE" } }, _count: { _all: true } }),
    db.solve.findMany({ where: { userId }, select: { problemId: true } }),
  ]);
  const solvedIds = new Set(solved.map((s) => s.problemId));
  return new Set(wrong.filter((w) => w._count._all >= MAX_PUZZLE_ATTEMPTS && !solvedIds.has(w.problemId)).map((w) => w.problemId));
}

export const difficultyLabel: Record<string, string> = { EASY: "Easy", MEDIUM: "Medium", HARD: "Hard" };
