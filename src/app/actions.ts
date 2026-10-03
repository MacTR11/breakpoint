"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { db } from "@/lib/db";
import { hintWallet, parseHints } from "@/lib/hints";
import { cleanTelemetry, type Telemetry } from "@/lib/integrity";
import { judge } from "@/lib/judge";
import { paperUsing } from "@/lib/mock";
import { findViewableProblem, isLive, MAX_PUZZLE_ATTEMPTS, parseBanned, parseOptions, parseTests, pointsFor, puzzlePenalty } from "@/lib/problems";
import { getCurrentUser } from "@/lib/session";
import { noRewards, recordSolve, type Rewards } from "@/lib/solve";
import { bannedUse, type JudgeOutcome } from "@/lib/types";

const MAX_CODE_LENGTH = 20_000;
const MIN_GAP_MS = 2_000;

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}

export type CodeSubmitResult =
  | { ok: false; message: string }
  | { ok: true; outcome: JudgeOutcome; newlySolved: boolean; points: number; attempts: number; rewards: Rewards };

export async function submitCode(slug: string, code: string, telemetry?: Telemetry): Promise<CodeSubmitResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Your session has ended. Please sign in again." };
  if (typeof code !== "string" || code.length > MAX_CODE_LENGTH) return { ok: false, message: "That code is too long to submit." };

  const problem = await findViewableProblem(slug, user.role === "TEACHER");
  if (!problem || problem.kind !== "CODE" || !problem.functionName) return { ok: false, message: "This problem is not available." };

  const last = await db.submission.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, select: { createdAt: true } });
  if (last && Date.now() - last.createdAt.getTime() < MIN_GAP_MS) return { ok: false, message: "Slow down: wait a couple of seconds between submissions." };

  const tests = parseTests(problem);
  const banned = bannedUse(code, parseBanned(problem));
  const outcome: JudgeOutcome = banned ? { status: "ERROR", loadError: banned, results: [] } : await judge(code, problem.functionName, tests);

  await db.submission.create({
    data: {
      userId: user.id,
      problemId: problem.id,
      code,
      status: outcome.status,
      passed: outcome.results.filter((r) => r.status === "PASS").length,
      total: tests.length,
      ...cleanTelemetry(telemetry),
    },
  });

  let newlySolved = false;
  let rewards = noRewards;
  let attempts = 0;
  if (outcome.status === "ACCEPTED") {
    const existing = await db.solve.findUnique({ where: { userId_problemId: { userId: user.id, problemId: problem.id } } });
    if (!existing) {
      attempts = await db.submission.count({ where: { userId: user.id, problemId: problem.id } });
      rewards = await recordSolve(user.id, problem.id, problem.points, attempts);
      newlySolved = true;
      revalidatePath("/", "layout");
    }
  }

  // Hidden tests report pass/fail only, so their inputs and answers stay secret.
  const results = outcome.results.map((r) => (r.hidden ? { index: r.index, status: r.status, hidden: true, ms: r.ms } : r));
  return { ok: true, outcome: { ...outcome, results }, newlySolved, points: problem.points, attempts, rewards };
}

export type PuzzleReveal = { answer: string; explanation: string | null };

export type PuzzleSubmitResult =
  | { ok: false; message: string }
  | { ok: true; correct: true; points: number; attempts: number; explanation: string | null; rewards: Rewards }
  // `reveal` is set once the puzzle is locked, unless a live competition is using it.
  | { ok: true; correct: false; penalty: number; attemptsLeft: number; nextPoints: number; reveal: PuzzleReveal | null };

export async function submitPuzzle(slug: string, answer: string): Promise<PuzzleSubmitResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Your session has ended. Please sign in again." };

  const problem = await findViewableProblem(slug, user.role === "TEACHER");
  if (!problem || problem.kind !== "PUZZLE" || problem.answer === null) return { ok: false, message: "This puzzle is not available." };

  const key = { userId_problemId: { userId: user.id, problemId: problem.id } };
  const solved = await db.solve.findUnique({ where: key });
  if (solved) return { ok: true, correct: true, points: solved.points, attempts: solved.attempts, explanation: problem.explanation, rewards: noRewards };

  const wrongBefore = await db.submission.count({ where: { userId: user.id, problemId: problem.id, status: "WRONG" } });
  if (wrongBefore >= MAX_PUZZLE_ATTEMPTS) return { ok: false, message: "You have used both attempts on this puzzle." };

  const given = String(answer).trim().slice(0, 200);
  const isChoice = parseOptions(problem).length > 0;
  const correct = isChoice ? given === problem.answer : given.toLowerCase() === problem.answer.trim().toLowerCase();
  const penalty = correct ? 0 : puzzlePenalty(problem);

  await db.submission.create({
    data: { userId: user.id, problemId: problem.id, code: given, status: correct ? "ACCEPTED" : "WRONG", passed: correct ? 1 : 0, total: 1, penalty },
  });
  revalidatePath("/", "layout");

  if (!correct) {
    const attemptsLeft = MAX_PUZZLE_ATTEMPTS - wrongBefore - 1;
    const inLiveContest = problem.contests.some((c) => isLive(c.contest));
    return {
      ok: true,
      correct: false,
      penalty,
      attemptsLeft,
      nextPoints: pointsFor(problem, wrongBefore + 1),
      reveal: attemptsLeft === 0 && !inLiveContest ? { answer: problem.answer, explanation: problem.explanation } : null,
    };
  }

  const points = pointsFor(problem, wrongBefore);
  const rewards = await recordSolve(user.id, problem.id, points, wrongBefore + 1);
  return { ok: true, correct: true, points, attempts: wrongBefore + 1, explanation: problem.explanation, rewards };
}

export type HintResult = { ok: false; message: string } | { ok: true; hint: string; balance: number };

/** Spend one hint token to reveal the next hint on a problem. Teachers reveal hints for free. */
export async function unlockHint(slug: string): Promise<HintResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Your session has ended. Please sign in again." };
  const isTeacher = user.role === "TEACHER";
  const problem = await findViewableProblem(slug, isTeacher);
  if (!problem) return { ok: false, message: "This problem is not available." };

  if (!isTeacher && (await paperUsing(user.id, problem.id))) return { ok: false, message: "Hints are off while you sit a mock paper." };

  const hints = parseHints(problem);
  const index = await db.hintUnlock.count({ where: { userId: user.id, problemId: problem.id } });
  if (index >= hints.length) return { ok: false, message: "There are no more hints for this challenge." };

  const wallet = await hintWallet(user.id);
  if (!isTeacher && wallet.balance <= 0) {
    return { ok: false, message: `You have no hints left. Solve ${wallet.untilNext} more challenge${wallet.untilNext === 1 ? "" : "s"} to earn one.` };
  }
  await db.hintUnlock.upsert({
    where: { userId_problemId_index: { userId: user.id, problemId: problem.id, index } },
    create: { userId: user.id, problemId: problem.id, index },
    update: {},
  });
  revalidatePath("/", "layout");
  return { ok: true, hint: hints[index], balance: isTeacher ? wallet.balance : wallet.balance - 1 };
}
