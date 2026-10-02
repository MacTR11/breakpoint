import { db } from "./db";

// Every student starts with a few hint tokens, earns another each time they
// solve this many more challenges, one for every hard challenge solved, and
// one for each daily challenge done on its day.
export const STARTING_HINTS = 3;
export const SOLVES_PER_HINT = 3;

export type HintWallet = {
  /** Tokens available to spend now. */
  balance: number;
  /** Solves still needed before the next token is earned. */
  untilNext: number;
  solved: number;
};

export async function hintWallet(userId: string): Promise<HintWallet> {
  const [solved, hard, used, daily] = await Promise.all([
    db.solve.count({ where: { userId } }),
    db.solve.count({ where: { userId, problem: { difficulty: "HARD" } } }),
    db.hintUnlock.count({ where: { userId } }),
    db.dailyBonus.count({ where: { userId } }),
  ]);
  return {
    balance: Math.max(0, STARTING_HINTS + Math.floor(solved / SOLVES_PER_HINT) + hard + daily - used),
    untilNext: SOLVES_PER_HINT - (solved % SOLVES_PER_HINT),
    solved,
  };
}

/** How many tokens the solve that has just been recorded earned. */
export const hintsEarned = (solvedNow: number, difficulty: string) => (solvedNow > 0 && solvedNow % SOLVES_PER_HINT === 0 ? 1 : 0) + (difficulty === "HARD" ? 1 : 0);

export function parseHints(problem: { hints: string | null }): string[] {
  try {
    const hints = JSON.parse(problem.hints ?? "[]");
    return Array.isArray(hints) ? hints.map(String) : [];
  } catch {
    return [];
  }
}
