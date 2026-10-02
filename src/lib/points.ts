// What a challenge is worth. Harder work earns clearly more, and writing a
// program from nothing earns more than repairing one or answering a question.
type Level = "EASY" | "MEDIUM" | "HARD";

export const POINTS: Record<"write" | "fix" | "puzzle", Record<Level, number>> = {
  write: { EASY: 10, MEDIUM: 25, HARD: 50 },
  fix: { EASY: 10, MEDIUM: 20, HARD: 40 },
  puzzle: { EASY: 5, MEDIUM: 10, HARD: 20 },
};

/** Every First steps challenge is worth the same small amount. */
export const FIRST_STEPS_POINTS = 5;
/** An exam-style question is worth this for each mark it carries. */
export const POINTS_PER_MARK = 5;

export function suggestedPoints(kind: string, style: string | undefined, difficulty: string) {
  const column = kind === "PUZZLE" ? "puzzle" : style === "FIX" ? "fix" : "write";
  return POINTS[column][(difficulty as Level) in POINTS[column] ? (difficulty as Level) : "EASY"];
}
